'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink, LANGUAGE_COLORS } from '@/types';

interface DependencyGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeSelect: (node: GraphNode) => void;
  onNodeDoubleClick: (node: GraphNode, content: string) => void;
  filterDanger?: boolean;
  filterDead?: boolean;
}

export default function DependencyGraph({
  nodes,
  links,
  onNodeSelect,
  onNodeDoubleClick,
  filterDanger = false,
  filterDead = false,
}: DependencyGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; node: GraphNode } | null>(null);

  const truncateLabel = (text: string, maxLen = 22): string => {
    return text.length > maxLen ? text.substring(0, maxLen - 3) + '...' : text;
  };

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    const g = svg.append('g');

    // Resolve string references to actual node objects
    type ResolvedLink = { source: GraphNode; target: GraphNode };
    const validLinks: ResolvedLink[] = links.map(l => ({
      source: typeof l.source === 'object' ? l.source : nodes.find(n => n.id === l.source)!,
      target: typeof l.target === 'object' ? l.target : nodes.find(n => n.id === l.target)!,
    })).filter(l => l.source && l.target);

    let displayNodes = [...nodes];
    if (filterDanger) {
      displayNodes = nodes.filter(n => n.debtScore > 70);
    } else if (filterDead) {
      const linked = new Set<string>();
      validLinks.forEach(l => {
        linked.add(l.source.id);
        linked.add(l.target.id);
      });
      displayNodes = nodes.filter(n => !linked.has(n.id));
    }

    const simulation = d3.forceSimulation<GraphNode>(displayNodes)
      .force('link', d3.forceLink<GraphNode, ResolvedLink>(validLinks as any)
        .id(d => d.id)
        .distance(80))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>()
        .radius(d => Math.sqrt(d.loc) * 0.4 + 10));

    const link = g.append('g')
      .selectAll('line')
      .data(validLinks)
      .enter()
      .append('line')
      .attr('class', 'link stroke-gray-600 transition-all duration-300')
      .attr('stroke-width', d => Math.max(1, 4 - Math.abs(nodes.indexOf(d.source) - nodes.indexOf(d.target)) / 10));

    const node = g.append('g')
      .selectAll('g')
      .data(displayNodes)
      .enter()
      .append('g')
      .attr('class', 'node-group cursor-pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', d => Math.sqrt(d.loc) * 0.6 + 6)
      .attr('fill', d => LANGUAGE_COLORS[d.language] || '#888')
      .attr('fill-opacity', 0.8)
      .attr('stroke', '#0d0f0e')
      .attr('stroke-width', 2)
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeSelect(d);
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        onNodeDoubleClick(d, d.content || '');
      })
      .on('mouseover', (event: MouseEvent, d: GraphNode) => {
        setTooltip({ x: event.pageX, y: event.pageY, node: d });
      })
      .on('mouseout', () => setTooltip(null));

    node.append('text')
      .attr('class', 'node-label fill-gray-200 pointer-events-none text-center text-[10px] font-mono')
      .attr('dy', d => Math.sqrt(d.loc) * 0.6 + 18)
      .text(d => truncateLabel(d.id));

    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x!)
        .attr('y1', d => d.source.y!)
        .attr('x2', d => d.target.x!)
        .attr('y2', d => d.target.y!);

      node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, filterDanger, filterDead, onNodeSelect, onNodeDoubleClick]);

  return (
    <>
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
      {tooltip && (
        <div
          className="fixed z-[1000] bg-[#141817] border border-amber-500 rounded-lg p-3 text-xs shadow-[0_0_20px_rgba(245,166,35,0.3)] pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 12, maxWidth: '250px' }}
        >
          <div className="tooltip-title text-amber-500 font-semibold mb-2">
            {tooltip.node.id}
          </div>
          <div className="tooltip-field flex justify-between">
            <span className="text-gray-400">Language:</span>
            <span>{tooltip.node.language}</span>
          </div>
          <div className="tooltip-field flex justify-between">
            <span className="text-gray-400">LOC:</span>
            <span>{tooltip.node.loc.toLocaleString()}</span>
          </div>
          <div className="tooltip-field flex justify-between">
            <span className="text-gray-400">Tech Debt:</span>
            <span>{Math.round(tooltip.node.debtScore)}/100</span>
          </div>
          <div className="debt-score-bar h-1 bg-gray-800 rounded overflow-hidden mt-1">
            <div
              className="debt-score-fill h-full bg-gradient-to-r from-green-400 via-amber-500 to-red-500"
              style={{ width: `${tooltip.node.debtScore}%` }}
            />
          </div>
          <div className="tooltip-field flex justify-between mt-1">
            <span className="text-gray-400">Last modified:</span>
            <span>2 days ago</span>
          </div>
        </div>
      )}
    </>
  );
}

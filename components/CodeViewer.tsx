'use client';

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import { GraphNode } from '@/types';

interface CodeViewerProps {
  node: GraphNode | null;
  content: string;
  onClose: () => void;
}

export default function CodeViewer({ node, content, onClose }: CodeViewerProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current && hljs) {
      hljs.highlightElement(codeRef.current);
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [node, onClose]);

  if (!node) return null;

  return (
    <div
      id="code-viewer-modal"
      className="fixed inset-0 z-[20000] flex items-center justify-center p-10 bg-black/90 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="modal-content bg-[#141817] border border-amber-500 rounded-lg w-full max-w-5xl h-[80vh] flex flex-col shadow-[0_0_40px_rgba(245,166,35,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header px-5 py-4 border-b border-[rgba(245,166,35,0.2)] flex items-center justify-between">
          <div className="modal-title font-['Bebas_Neue'] text-2xl tracking-wider text-amber-500">
            {node.id}
          </div>
          <button
            className="modal-close bg-none border-none text-gray-400 text-3xl cursor-pointer hover:text-amber-500 transition-colors"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="modal-body flex-1 overflow-auto p-5 font-mono">
          <pre className="h-full m-0">
            <code
              ref={codeRef}
              className={`language-${node.language.toLowerCase()} block text-sm leading-relaxed`}
              style={{ fontFamily: "'Courier Prime', monospace" }}
            >
              {content}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

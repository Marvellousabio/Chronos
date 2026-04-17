'use client';

interface ToolbarProps {
  activeView: 'flat' | 'cluster';
  dangerActive: boolean;
  deadActive: boolean;
  onViewChange: (view: 'flat' | 'cluster') => void;
  onDangerToggle: () => void;
  onDeadToggle: () => void;
}

export default function Toolbar({
  activeView,
  dangerActive,
  deadActive,
  onViewChange,
  onDangerToggle,
  onDeadToggle,
}: ToolbarProps) {
  return (
    <div className="graph-toolbar absolute top-3 left-3 bg-[#141817] border border-[rgba(255,255,255,0.08)] rounded-lg p-2 flex gap-2 z-10">
      <button
        className={`toolbar-btn px-3 py-1.5 rounded text-xs font-mono transition-all ${
          activeView === 'flat'
            ? 'bg-amber-500 text-black'
            : 'bg-gray-800 text-gray-300 hover:bg-amber-500/20'
        }`}
        onClick={() => onViewChange('flat')}
      >
        FLAT
      </button>
      <button
        className={`toolbar-btn px-3 py-1.5 rounded text-xs font-mono transition-all ${
          activeView === 'cluster'
            ? 'bg-amber-500 text-black'
            : 'bg-gray-800 text-gray-300 hover:bg-amber-500/20'
        }`}
        onClick={() => onViewChange('cluster')}
      >
        CLUSTER
      </button>
      <div className="w-px bg-gray-700 mx-1" />
      <button
        className={`toolbar-btn px-3 py-1.5 rounded text-xs font-mono transition-all ${
          dangerActive
            ? 'bg-red-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-red-500/20'
        }`}
        onClick={onDangerToggle}
      >
        DANGER ZONES
      </button>
      <button
        className={`toolbar-btn px-3 py-1.5 rounded text-xs font-mono transition-all ${
          deadActive
            ? 'bg-gray-500 text-white'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-500/20'
        }`}
        onClick={onDeadToggle}
      >
        DEAD CODE
      </button>
    </div>
  );
}

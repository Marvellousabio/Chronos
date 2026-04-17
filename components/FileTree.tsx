'use client';

import { ProcessedFile, FILE_ICONS } from '@/types';

interface FileTreeProps {
  files: ProcessedFile[];
  onFileClick: (file: ProcessedFile) => void;
}

export default function FileTree({ files, onFileClick }: FileTreeProps) {
  const getDebtClass = (score: number): string => {
    if (score < 50) return 'bg-green-400';
    if (score < 80) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="file-list flex flex-col gap-1">
      {files.map((file) => (
        <div
          key={file.name}
          className="file-item flex items-center gap-2 p-2 bg-[#1a1d1b] rounded cursor-pointer hover:bg-[rgba(245,166,35,0.1)] transition-colors"
          onClick={() => onFileClick(file)}
          title={`Debt: ${Math.round(file.debtScore)}/100`}
        >
          <div className="file-icon w-4 text-center text-xs text-amber-500">
            {FILE_ICONS[file.language] || '◇'}
          </div>
          <div className="file-name flex-1 truncate text-sm" title={file.name}>
            {file.name}
          </div>
          <div className="file-loc text-xs text-green-400">
            {file.loc} LOC
          </div>
          <div className={`debt-indicator w-1 h-3 rounded-full ${getDebtClass(file.debtScore)}`} />
        </div>
      ))}
    </div>
  );
}

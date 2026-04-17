'use client';

import { useState, useEffect } from 'react';
import { FileNode } from '@/types';

interface HeaderProps {
  fileCount: number;
  totalLoc: number;
  languageBreakdown: Record<string, number>;
  avgDebtScore: number;
}

export default function Header({ fileCount, totalLoc, languageBreakdown, avgDebtScore }: HeaderProps) {
  const [isBootComplete, setIsBootComplete] = useState(false);

  useEffect(() => {
    // Boot sequence
    const timer = setTimeout(() => {
      setIsBootComplete(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isBootComplete) {
    return (
      <div className="boot-sequence fixed inset-0 z-[10000] flex flex-col items-center justify-center font-mono text-amber-500 p-10 text-center">
        <div className="boot-title font-['Bebas_Neue'] text-6xl tracking-widest mb-10 drop-shadow-[0_0_30px_rgba(245,166,35,0.5)]">
          ⬡ CHRONOS SYSTEMS
        </div>
        {[
          'INITIALIZING ARCHAEOLOGICAL PROTOCOLS...',
          'DEPENDENCY SCANNER... OK',
          'COBOL PARSER... OK',
          'JAVA SYMBOL TABLE... OK',
          'ANTHROPIC API LINK... OK',
          'FORCE-GRAPH ENGINE... OK',
          'ARCHAEOLOGICAL DATABASE... OK',
          'SYSTEM READY — WELCOME, COMMANDER'
        ].map((line, i) => (
          <div
            key={i}
            className="boot-line text-lg opacity-0 animate-fadeIn"
            style={{ animationDelay: `${0.2 + i * 0.4}s`, animationFillMode: 'forwards' }}
          >
            {line}
          </div>
        ))}
      </div>
    );
  }

  const gaugeCircumference = 2 * Math.PI * 15.9;
  const gaugeOffset = gaugeCircumference - (avgDebtScore / 100) * gaugeCircumference;

  return (
    <header className="h-[60px] bg-[#141817] border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-6 relative z-10">
      <div className="logo font-['Bebas_Neue'] text-3xl tracking-widest text-amber-500 drop-shadow-[0_0_10px_rgba(245,166,35,0.5)]">
        ⬡ CHRONOS
      </div>

      <div className="flex items-center gap-4">
        <div className="codebase-name text-base text-gray-200">
          {fileCount > 0 ? `Codebase: ${fileCount} files` : 'No codebase loaded'}
        </div>

        <div className="flex gap-2">
          {Object.entries(languageBreakdown)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([lang, count]) => (
              <span key={lang} className="badge px-2.5 py-1 bg-[rgba(245,166,35,0.15)] text-amber-500 text-xs border border-amber-500 uppercase tracking-wider rounded-sm">
                {lang} {count}
              </span>
            ))}
        </div>

        <div className="loc-counter text-base text-green-400">
          {totalLoc.toLocaleString()} LOC
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-xs text-gray-500">TECH DEBT INDEX</div>
        <div className="debt-gauge w-[120px] h-[30px] relative flex items-center justify-center">
          <svg className="gauge-arc w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
            />
            <path
              className="gauge-value transition-all duration-1000 ease-out"
              d="M18 2.1 a 15.9 15.9 0 0 1 0 31.8"
              fill="none"
              stroke="#f5a623"
              strokeWidth="3"
              strokeDasharray={`${gaugeOffset}, ${gaugeCircumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-xs font-bold text-amber-500">
            {Math.round(avgDebtScore)}
          </div>
        </div>
      </div>
    </header>
  );
}

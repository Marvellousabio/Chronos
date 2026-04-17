'use client';

import { useState, useEffect, useRef } from 'react';

interface TerminalProps {
  onCommand: (cmd: string) => Promise<string>;
}

export default function Terminal({ onCommand }: TerminalProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Type \'help\' for available commands']);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setOutput(prev => [...prev, `chronos@archaeologist:~$ ${cmd}`]);
    setInput('');

    const response = await onCommand(cmd);
    if (response) {
      setOutput(prev => [...prev, response]);
    }
  };

  // Auto-focus on terminal click
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col" onClick={handleTerminalClick}>
      <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
        <span className="terminal-prompt text-green-400 font-semibold pt-2">
          chronos@archaeologist:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          className="terminal-input flex-1 bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 font-mono text-sm rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
          placeholder="Type command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
        />
      </form>

      <div className="terminal-output bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm leading-relaxed flex-1 overflow-y-auto">
        {output.map((line, i) => (
          <div key={i} className="mb-1">
            {line.startsWith('chronos@') ? (
              <div>
                <span className="text-green-400 font-semibold">{line.split(' ')[0]}</span>
                <span className="text-gray-300">{line.substring(line.indexOf('$') + 2)}</span>
              </div>
            ) : (
              <div className="text-gray-300 whitespace-pre-wrap">{line}</div>
            )}
          </div>
        ))}
        {input && (
          <div className="flex">
            <span className="terminal-prompt text-green-400 font-semibold mr-2">
              chronos@archaeologist:~$
            </span>
            <span className="text-gray-300">{input}</span>
            <span className="cursor ml-1 w-2 h-4 bg-amber-500 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

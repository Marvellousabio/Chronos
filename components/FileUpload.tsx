'use client';

import { useCallback, useState, useRef } from 'react';
import JSZip from 'jszip';
import { ProcessedFile } from '@/types';

interface FileUploadProps {
  onFilesProcessed: (files: ProcessedFile[]) => void;
}

export default function FileUpload({ onFilesProcessed }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processSingleFile = async (file: File): Promise<ProcessedFile> => {
    const content = await file.text();
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    return {
      id: file.name,
      name: file.name,
      content,
      language: detectLanguage(ext),
      lines: content.split('\n').length,
      loc: content.replace(/\s+/g, '').length,
      debtScore: estimateDebtScore(file.name, content),
    };
  };

  const processZip = async (zipFile: File): Promise<ProcessedFile[]> => {
    const zip = new JSZip();
    const zipData = await zip.loadAsync(zipFile);
    const files: ProcessedFile[] = [];

    for (const [path, zipEntry] of Object.entries(zipData.files)) {
      if (!zipEntry.dir) {
        const content = await zipEntry.async('text');
        const ext = path.split('.').pop()?.toLowerCase() || '';
        files.push({
          id: path,
          name: path,
          content,
          language: detectLanguage(ext),
          lines: content.split('\n').length,
          loc: content.replace(/\s+/g, '').length,
          debtScore: estimateDebtScore(path, content),
        });
      }
    }

    return files;
  };

  const detectLanguage = (ext: string): string => {
    const map: Record<string, string> = {
      cobol: 'COBOL', cbl: 'COBOL',
      java: 'Java',
      js: 'JavaScript', ts: 'TypeScript',
      py: 'Python',
      c: 'C', cpp: 'C++',
      php: 'PHP', rb: 'Ruby',
      pl: 'Perl', vb: 'Visual Basic',
      bas: 'BASIC', asm: 'Assembly',
      sql: 'SQL', xml: 'XML', json: 'JSON',
      cs: 'C#', go: 'Go', rs: 'Rust',
      kt: 'Kotlin', scala: 'Scala', swift: 'Swift',
      txt: 'Text', properties: 'Text'
    };
    return map[ext] || 'Text';
  };

  const estimateDebtScore = (filename: string, content: string): number => {
    let score = 20;
    const lowerFilename = filename.toLowerCase();

    if (lowerFilename.includes('legacy')) score += 30;
    if (lowerFilename.includes('old')) score += 25;
    if (content.includes('FIXME') || content.includes('TODO')) score += 20;
    if (content.includes('HACK') || content.includes('XXX')) score += 35;
    if (content.includes('System.out.println')) score += 15;
    if (content.includes('var ') && content.includes('function')) score += 10;
    if (content.includes('goto')) score += 40;
    if (content.includes('eval(')) score += 50;
    if (content.includes('catch (Exception') && content.includes('{}')) score += 30;
    if ((content.match(/\/\/.*\n/g) || []).length > content.length / 50) score += 15;
    if (content.length > 5000) score += 20;
    if (content.includes('synchronized') || content.includes('volatile')) score += 10;

    return Math.min(100, score + Math.random() * 20);
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const processedFiles: ProcessedFile[] = [];

    for (const file of Array.from(files)) {
      if (file.name.endsWith('.zip')) {
        const zipFiles = await processZip(file);
        processedFiles.push(...zipFiles);
      } else {
        const processed = await processSingleFile(file);
        processedFiles.push(processed);
      }
    }

    onFilesProcessed(processedFiles);
  }, [onFilesProcessed]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className="mb-4">
      <div
        className={`upload-zone border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-amber-500 bg-[rgba(245,166,35,0.05)] shadow-[0_0_20px_rgba(245,166,35,0.3)]'
            : 'border-[rgba(245,166,35,0.15)] hover:border-amber-500/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-icon text-4xl text-amber-500 mb-3">⬡</div>
        <div className="upload-text text-sm text-gray-400 leading-relaxed">
          Drag & drop code archives here<br />
          or paste raw code<br />
          <br />
          <small className="text-gray-500">ZIP • Individual Files • Raw Text</small>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".zip,.cobol,.cbl,.java,.js,.ts,.py,.c,.cpp,.php,.rb,.pl,.vb,.bas,.asm,.txt"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

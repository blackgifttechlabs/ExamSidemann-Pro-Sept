import React from 'react';
import { Terminal, Copy, Check } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  filename?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, filename }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[#333] bg-[#1e1e1e] my-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename && (
            <span className="ml-3 text-xs text-gray-400 font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 uppercase">{language}</span>
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-[#333] rounded-md transition-colors"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed">
          <code className="language-javascript text-[#d4d4d4]">
            {code.split('\n').map((line, i) => (
              <div key={i} className="table-row">
                <span className="table-cell text-right pr-4 select-none text-[#858585] w-8">{i + 1}</span>
                <span className="table-cell">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
};

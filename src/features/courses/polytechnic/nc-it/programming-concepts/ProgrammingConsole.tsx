import React from 'react';
import { Terminal, Copy, Play, Eraser, Code2, Search, Settings, FileCode, Monitor, Cpu } from 'lucide-react';

interface ProgrammingConsoleProps {
  code: string;
  fileName?: string;
  language?: string;
  isDarkMode?: boolean;
}

export const ProgrammingConsole: React.FC<ProgrammingConsoleProps> = ({ 
  code, 
  fileName = 'main.cpp', 
  language = 'cpp',
  isDarkMode = false 
}) => {

  const highlightCode = (text: string) => {
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const tokens: { val: string; cls: string }[] = [];
    
    const addToken = (match: string, cls: string) => {
      const id = tokens.length;
      tokens.push({ val: match, cls });
      return `__PROG_TOKEN_${id}__`;
    };

    // 1. Comments
    escaped = escaped.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, (m) => addToken(m, "text-gray-500 dark:text-gray-400 italic"));
    
    // 2. Strings
    escaped = escaped.replace(/'[^']*'|"[^"]*"/g, (m) => addToken(m, "text-green-600 dark:text-green-400"));
    
    // 3. Keywords
    const keywords = /\b(int|float|double|char|void|if|else|switch|case|default|while|for|do|break|continue|return|struct|class|public|private|protected|virtual|override|new|delete|this|static|const|namespace|using|include|template|typename|try|catch|throw|bool|true|false)\b/g;
    escaped = escaped.replace(keywords, (m) => addToken(m, "text-blue-600 dark:text-blue-400 font-bold"));
    
    // 4. Preprocessor
    escaped = escaped.replace(/#\w+/g, (m) => addToken(m, "text-purple-600 dark:text-purple-400 font-medium"));

    // 5. Functions (simple regex for words followed by paren)
    escaped = escaped.replace(/\b(\w+)(?=\()/g, (m) => addToken(m, "text-yellow-600 dark:text-yellow-400"));
    
    // 6. Numbers
    escaped = escaped.replace(/\b\d+(\.\d+)?\b/g, (m) => addToken(m, "text-orange-600 dark:text-orange-400"));

    // Final pass: replace tokens with spans
    return escaped.replace(/__PROG_TOKEN_(\d+)__/g, (_, id) => {
      const token = tokens[parseInt(id)];
      return `<span class="${token.cls}">${token.val}</span>`;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={`my-8 overflow-hidden rounded-xl border shadow-2xl transition-all duration-300 ${
      isDarkMode ? 'border-gray-700 bg-[#1e1e1e] shadow-indigo-900/10' : 'border-gray-200 bg-white shadow-gray-200/50'
    }`}>
      {/* IDE Style Header */}
      <div className={`${isDarkMode ? 'bg-[#252526]' : 'bg-gray-100'} px-4 py-2 flex items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-black/10 dark:bg-black/20">
            <FileCode size={14} className="text-blue-400" />
            <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{fileName}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="hidden sm:inline flex items-center gap-1"><Monitor size={12}/> Editor</span>
          <span className="hidden sm:inline flex items-center gap-1"><Cpu size={12}/> {language.toUpperCase()}</span>
        </div>
      </div>

      {/* Code Editor Area */}
      <div className="relative flex">
        {/* Line Numbers */}
        <div className={`hidden sm:flex flex-col text-right px-3 py-4 font-mono text-xs select-none border-r ${
          isDarkMode ? 'bg-[#1e1e1e] border-gray-800 text-gray-600' : 'bg-gray-50 border-gray-100 text-gray-400'
        }`}>
          {code.split('\n').map((_, i) => (
            <span key={i} className="leading-6">{i + 1}</span>
          ))}
        </div>

        {/* The Code */}
        <div className={`flex-1 overflow-x-auto font-mono text-sm leading-6 p-4 ${
          isDarkMode ? 'bg-[#1e1e1e] text-gray-300' : 'bg-white text-gray-800'
        }`}>
          <pre 
            className="outline-none whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
          />
        </div>
        
        {/* Floating Icons */}
        <div className="absolute top-2 right-2 flex gap-2">
          <button 
            onClick={handleCopy}
            title="Copy to clipboard"
            className={`p-1.5 rounded-md transition-all ${
              isDarkMode ? 'hover:bg-gray-800 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
            }`}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className={`px-4 py-2 border-t flex justify-between items-center ${
        isDarkMode ? 'bg-[#007acc] border-gray-700 text-white' : 'bg-blue-600 border-blue-700 text-white'
      }`}>
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
            <Play size={10} fill="currentColor" /> Run Code
          </button>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <span className="text-[10px]">UTF-8</span>
        </div>
        <div className="text-[10px] flex gap-4">
          <span>Ln {code.split('\n').length}, Col 1</span>
          <span>Spaces: 2</span>
        </div>
      </div>
    </div>
  );
};

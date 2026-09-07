import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowLeft,
  CheckCircle,
  Code2,
  AlertCircle,
  Download,
  Lightbulb,
  X,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Bot,
  Terminal,
  Layers,
  Bookmark,
  RotateCcw,
  Square,
  Check,
  Copy,
  Maximize2,
  User,
} from "lucide-react";
import { TeachMeLaunchButton } from "../../../../practicals/tools/shared/TeachMeLaunchButton";
import { CSharpDiagnostic, runCSharpCode } from "./csharpRunnerApi";
import Editor, { useMonaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GROQ_MODELS, groqReasoningParams } from '../../../../../services/groq';

const customInputStyles = `
.grid-bg-ai { background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 1rem 1rem; background-position: center center; position: absolute; inset: 0; z-index: 0; }
.ai-w, .ai-b, .ai-db, .ai-g {
  height: 100%; width: 100%; position: absolute; overflow: hidden; z-index: -1; border-radius: 12px; filter: blur(3px);
}
.ai-input {
  background-color: var(--ai-input-bg, #0d0d12); border: none; width: 100%; height: 58px; border-radius: 14px; color: var(--ai-input-fg, white); padding-inline: 18px 64px; font-size: 15px; box-sizing: border-box;
}
.ai-input-light {
  --ai-input-bg: #f4f4f5;
  --ai-input-fg: #1f1f1f;
}
.ai-input-light::placeholder { color: #8b8b93 !important; }
#poda { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; box-sizing: border-box; }
.ai-input::placeholder { color: #c0b9c0; }
.ai-input:focus { outline: none; }
#main:focus-within > #input-mask { display: none; }
#input-mask { pointer-events: none; width: 100px; height: 20px; position: absolute; background: linear-gradient(90deg, transparent, black); top: 18px; left: 70px; }
#pink-mask { pointer-events: none; width: 30px; height: 20px; position: absolute; background: #cf30aa; top: 10px; left: 5px; filter: blur(20px); opacity: 0.8; transition: all 2s; }
.ai-w::before, .ai-b::before, .ai-db::before, .ai-g:before { content: ""; z-index: -2; text-align: center; top: 50%; left: 50%; position: absolute; width: 600px; height: 600px; background-repeat: no-repeat; background-position: 0 0; transition: all 2s; }
.ai-w::before { transform: translate(-50%, -50%) rotate(83deg); filter: brightness(1.4); background-image: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%); }
.ai-b::before { transform: translate(-50%, -50%) rotate(70deg); filter: brightness(1.3); background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%); }
.ai-db::before { transform: translate(-50%, -50%) rotate(82deg); background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%); }
#poda:hover > .ai-db::before { transform: translate(-50%, -50%) rotate(-98deg); }
#poda:hover > .ai-g::before { transform: translate(-50%, -50%) rotate(-120deg); }
#poda:hover > .ai-w::before { transform: translate(-50%, -50%) rotate(-97deg); }
#poda:hover > .ai-b::before { transform: translate(-50%, -50%) rotate(-110deg); }
#poda:focus-within > .ai-db::before { transform: translate(-50%, -50%) rotate(442deg); transition: all 4s; }
#poda:focus-within > .ai-g::before { transform: translate(-50%, -50%) rotate(420deg); transition: all 4s; }
#poda:focus-within > .ai-w::before { transform: translate(-50%, -50%) rotate(443deg); transition: all 4s; }
#poda:focus-within > .ai-b::before { transform: translate(-50%, -50%) rotate(430deg); transition: all 4s; }
.ai-g { filter: blur(30px); opacity: 0.4; overflow: hidden; max-height: 200px; border-radius: 20px;}
.ai-g:before { content: ""; position: absolute; transform: translate(-50%, -50%) rotate(60deg); width: 900px; height: 900px; background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%); }
#main { position: relative; width: 100%; box-sizing: border-box; }
#search-icon { position: absolute; left: 15px; top: 16px; pointer-events: none; }
#filter-icon { position: absolute; top: 8px; right: 8px; display: flex; align-items: center; justify-content: center; z-index: 2; height: 40px; width: 40px; isolation: isolate; overflow: hidden; border-radius: 10px; background: linear-gradient(180deg, #161329, black, #1d1b4b); border: 1px solid transparent; cursor: pointer; transition: transform 0.2s; }
#filter-icon:active { transform: scale(0.95); }
.filterBorder { height: 42px; width: 42px; position: absolute; overflow: hidden; top: -1px; right: -1px; border-radius: 10px; z-index: -1; }
.filterBorder::before { content: ""; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg); position: absolute; width: 100px; height: 100px; background-repeat: no-repeat; background-position: 0 0; filter: brightness(1.35); background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%); animation: ai-rotate 4s linear infinite; }
@keyframes ai-rotate { 100% { transform: translate(-50%, -50%) rotate(450deg); } }

/* Rich markdown typography inside chat bubbles */
.prose-chat h1, .prose-chat h2, .prose-chat h3 {
  font-weight: 700;
  margin-top: 0.85rem;
  margin-bottom: 0.4rem;
}
.prose-chat h3 { font-size: 0.95rem; }
.prose-chat strong {
  font-weight: 600;
  color: #db2777;
  background: rgba(219,39,119,0.08);
  padding: 0 4px;
  border-radius: 4px;
}
.dark .prose-chat strong {
  color: #f472b6;
  background: rgba(244,114,182,0.12);
}
.prose-chat hr {
  margin: 0.9rem 0;
  border: none;
  border-top: 1px solid rgba(0,0,0,0.1);
}
.dark .prose-chat hr { border-top-color: rgba(255,255,255,0.12); }
.prose-chat ul { list-style: disc; padding-left: 1.25rem; margin: 0.4rem 0; }
.prose-chat ul li::marker { color: #ec4899; }
.prose-chat ol { list-style: decimal; padding-left: 1.25rem; margin: 0.4rem 0; }
.prose-chat { line-height: 1.65; }
.prose-chat {
  font-size: 0.95rem;
}
.prose-chat p { margin: 0.5rem 0; }
.prose-chat li { line-height: 1.55; }
.chat-text {
  font-family: Arial, Helvetica, sans-serif;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.65) transparent;
  scrollbar-gutter: stable;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.55);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: content-box;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.75);
  background-clip: content-box;
}
@media (max-width: 1023px) {
  .mobile-tab-panel {
    animation: mobile-tab-enter 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }
}
@media (prefers-reduced-motion: reduce) {
  .mobile-tab-panel {
    animation: none;
  }
}
@keyframes mobile-tab-enter {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.995);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.prose-chat code:not(pre code) {
  background: rgba(139,92,246,0.1);
  color: #7c3aed;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 0.85em;
}
.dark .prose-chat code:not(pre code) { color: #a78bfa; background: rgba(167,139,250,0.15); }

/* Streaming indicator */
.streaming-glow {
  border-left: 2px solid #ec4899;
  animation: glow-pulse 1.4s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% { border-left-color: rgba(236,72,153,0.3); }
  50% { border-left-color: rgba(236,72,153,1); }
}
`;

interface Props {
  onBack?: () => void;
}

const DEFAULT_CODE = `using System;

namespace AdditionApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // Declare two numbers
            int num1 = 15;
            int num2 = 25;
            
            // Add the numbers together
            int sum = num1 + num2;
            
            // Display the result
            Console.WriteLine("The sum of " + num1 + " and " + num2 + " is: " + sum);
            
            // Wait for user to press a key before closing
            Console.ReadKey();
        }
    }
}`;

const extractConsoleInputPrompts = (code: string) => {
  const prompts: string[] = [];
  const readLinePattern = /Console\.ReadLine\s*\(\s*\)/g;
  let previousReadEnd = 0;
  let readMatch: RegExpExecArray | null;

  while ((readMatch = readLinePattern.exec(code)) !== null) {
    const segment = code.slice(previousReadEnd, readMatch.index);
    const writePattern = /Console\.Write(?:Line)?\s*\(\s*\$?"((?:\\.|[^"\\])*)"\s*\)\s*;/g;
    let writeMatch: RegExpExecArray | null;
    let prompt = `Input ${prompts.length + 1}:`;

    while ((writeMatch = writePattern.exec(segment)) !== null) {
      prompt = writeMatch[1].replace(/"/g, '"');
    }

    prompts.push(prompt);
    previousReadEnd = readLinePattern.lastIndex;
  }

  return prompts;
};

const CodeBlock: React.FC<{ code: string; language?: string; isDarkMode: boolean }> = ({
  code,
  language,
  isDarkMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fileLabel = language === "csharp" || language === "cs" ? "Program.cs" : `snippet.${language || "txt"}`;

  return (
    <>
      <div
        className={`rounded-xl overflow-hidden border my-2 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_4px_16px_rgba(0,0,0,0.10)] ${
          isDarkMode ? "border-[#3a3a3c]/80" : "border-slate-200"
        }`}
      >
        <div
          className={`flex items-center justify-between px-3 py-1.5 border-b ${
            isDarkMode ? "bg-[#1e1e2e] border-[#3a3a3c]" : "bg-slate-100 border-slate-200"
          }`}
        >
          <div className={`flex items-center gap-2 text-[11px] font-mono ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>
            <Code2 className={`w-3.5 h-3.5 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            {fileLabel}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              }`}
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setIsMaximized(true)}
              className={`p-1 rounded transition-colors ${
                isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              }`}
              title="Expand"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className={`text-xs ${isDarkMode ? "bg-[#1a1a2e]" : "bg-white"}`}>
          <SyntaxHighlighter
            language={language === "cs" ? "csharp" : language || "csharp"}
            style={isDarkMode ? oneDark : oneLight}
            customStyle={{ margin: 0, padding: "12px", background: "transparent", fontSize: "12px", lineHeight: 1.6 }}
            codeTagProps={{ style: { background: "transparent" } }}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>

      {isMaximized && (
        <div
          className="fixed inset-0 z-[300] bg-black/70 flex items-center justify-center p-6"
          onClick={() => setIsMaximized(false)}
        >
          <div
            className={`rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden ${
              isDarkMode ? "bg-[#1a1a2e]" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between px-4 py-3 border-b ${
                isDarkMode ? "border-[#3a3a3c] bg-[#1e1e2e]" : "border-slate-200 bg-slate-100"
              }`}
            >
              <div className={`flex items-center gap-2 text-sm font-mono ${isDarkMode ? "text-gray-200" : "text-slate-700"}`}>
                <Code2 className={`w-4 h-4 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
                {fileLabel}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${
                    isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  onClick={() => setIsMaximized(false)}
                  className={`p-1 rounded ${isDarkMode ? "hover:bg-white/10 text-gray-300" : "hover:bg-slate-200 text-slate-600"}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className={`flex-1 overflow-auto custom-scrollbar ${isDarkMode ? "bg-[#1a1a2e]" : "bg-white"}`}>
              <SyntaxHighlighter
                language={language === "cs" ? "csharp" : language || "csharp"}
                style={isDarkMode ? oneDark : oneLight}
                customStyle={{ margin: 0, padding: "20px", background: "transparent", fontSize: "13px", minHeight: "100%", lineHeight: 1.6 }}
                codeTagProps={{ style: { background: "transparent" } }}
                wrapLongLines
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const makeMarkdownComponents = (isDarkMode: boolean) => ({
  code({ inline, className, children }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeText = String(children).replace(/\n$/, "");
    const isInlineCode = inline || (!className && !codeText.includes("\n"));

    if (isInlineCode) {
      return <code className={className}>{children}</code>;
    }
    return (
      <CodeBlock
        code={codeText}
        language={match ? match[1] : undefined}
        isDarkMode={isDarkMode}
      />
    );
  },
  ol({ children }: any) {
    return <ol className="list-decimal pl-5 my-2 space-y-1">{children}</ol>;
  },
  ul({ children }: any) {
    return <ul className="list-disc pl-5 my-2 space-y-1">{children}</ul>;
  },
  li({ children }: any) {
    return <li className="pl-1">{children}</li>;
  },
});

let csharpMonacoConfigured = false;

const configureCSharpMonaco = (monacoInstance: any) => {
  if (!monacoInstance || csharpMonacoConfigured) return;

  if (!monacoInstance.languages.getLanguages().some((language: any) => language.id === "csharp")) {
    monacoInstance.languages.register({ id: "csharp" });
  }

  monacoInstance.languages.setMonarchTokensProvider("csharp", {
    defaultToken: "",
    tokenPostfix: ".cs",
    keywords: [
      "abstract", "as", "base", "bool", "break", "byte", "case", "catch", "char", "checked",
      "class", "const", "continue", "decimal", "default", "delegate", "do", "double", "else",
      "enum", "event", "explicit", "extern", "false", "finally", "fixed", "float", "for",
      "foreach", "goto", "if", "implicit", "in", "int", "interface", "internal", "is", "lock",
      "long", "namespace", "new", "null", "object", "operator", "out", "override", "params",
      "private", "protected", "public", "readonly", "ref", "return", "sbyte", "sealed", "short",
      "sizeof", "stackalloc", "static", "string", "struct", "switch", "this", "throw", "true",
      "try", "typeof", "uint", "ulong", "unchecked", "unsafe", "ushort", "using", "virtual",
      "void", "volatile", "while", "var", "async", "await", "get", "set", "value",
    ],
    typeKeywords: [
      "Console", "Math", "Convert", "DateTime", "String", "List", "Dictionary", "Array",
      "Exception", "Program", "Task",
    ],
    operators: [
      "=", ">", "<", "!", "~", "?", ":", "==", "<=", ">=", "!=", "&&", "||", "++", "--",
      "+", "-", "*", "/", "&", "|", "^", "%", "<<", ">>", "+=", "-=", "*=", "/=", "&=",
      "|=", "^=", "%=", "<<=", ">>=", "=>",
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            "@keywords": "keyword",
            "@typeKeywords": "type.identifier",
            "@default": "identifier",
          },
        }],
        [/[A-Z][\w$]*/, "type.identifier"],
        { include: "@whitespace" },
        [/[{}()\[\]]/, "@brackets"],
        [/[<>](?!@symbols)/, "@brackets"],
        [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],
        [/\d*\.\d+([eE][\-+]?\d+)?[fFdDmM]?/, "number.float"],
        [/0[xX][0-9a-fA-F]+/, "number.hex"],
        [/\d+[lL]?/, "number"],
        [/[;,.]/, "delimiter"],
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/"/, "string", "@string"],
        [/'[^\\']'/, "string"],
        [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
        [/'/, "string.invalid"],
      ],
      whitespace: [
        [/[ \t\r\n]+/, ""],
        [/\/\*/, "comment", "@comment"],
        [/\/\/.*$/, "comment"],
      ],
      comment: [
        [/[^\/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
      string: [
        [/[^"]+/, "string"],
        [/@escapes/, "string.escape"],
        [/\\./, "string.escape.invalid"],
        [/"/, "string", "@pop"],
      ],
    },
  });

  monacoInstance.editor.defineTheme("sidemann-csharp-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "7C3AED", fontStyle: "bold" },
      { token: "type.identifier", foreground: "0F766E" },
      { token: "string", foreground: "B45309" },
      { token: "number", foreground: "2563EB" },
      { token: "comment", foreground: "64748B", fontStyle: "italic" },
      { token: "operator", foreground: "DB2777" },
    ],
    colors: {
      "editor.background": "#fffffe",
      "editor.foreground": "#0f172a",
    },
  });

  monacoInstance.editor.defineTheme("sidemann-csharp-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "C084FC", fontStyle: "bold" },
      { token: "type.identifier", foreground: "5EEAD4" },
      { token: "string", foreground: "FBBF24" },
      { token: "number", foreground: "93C5FD" },
      { token: "comment", foreground: "94A3B8", fontStyle: "italic" },
      { token: "operator", foreground: "F472B6" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#e5e7eb",
    },
  });

  csharpMonacoConfigured = true;
};

export const PracticeCSharp: React.FC<Props> = ({ onBack }) => {
  const [query, setQuery] = useState(DEFAULT_CODE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    output: string[];
    error?: string;
    diagnostics?: CSharpDiagnostic[];
    executionTime?: number;
  }>({ success: true, output: [] });
  const [hasExecuted, setHasExecuted] = useState(false);
  const [leftColumnRatio, setLeftColumnRatio] = useState(65);
  const [topRowRatio, setTopRowRatio] = useState(100);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [autoRunCommands, setAutoRunCommands] = useState(true);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "code">("code");
  
  const workspaceRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [consoleInputValue, setConsoleInputValue] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [pendingRunCode, setPendingRunCode] = useState<string | null>(null);
  const [pendingPrompts, setPendingPrompts] = useState<string[]>([]);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const resolveInputRef = useRef<((value: string) => void) | null>(null);

  const handleColDown = (e: React.PointerEvent) => {
    setIsColDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleRowDown = (e: React.PointerEvent) => {
    setIsRowDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  
  const handleMove = (e: React.PointerEvent) => {
    if (isColDragging && workspaceRef.current) {
       const { left, width } = workspaceRef.current.getBoundingClientRect();
       if (window.innerWidth < 1024) return;
       let newRatio = ((e.clientX - left) / width) * 100;
       newRatio = Math.max(30, Math.min(80, newRatio));
       setLeftColumnRatio(newRatio);
    } else if (isRowDragging && leftColRef.current) {
       const { top, height } = leftColRef.current.getBoundingClientRect();
       let newRatio = ((e.clientY - top) / height) * 100;
       newRatio = Math.max(20, Math.min(80, newRatio));
       setTopRowRatio(newRatio);
    }
  };
  
  const handleUp = (e: React.PointerEvent) => {
    setIsColDragging(false);
    setIsRowDragging(false);
    if(e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [activeTab, setActiveTab] = useState<"snippets" | "ai">("ai");
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  
  const [messages, setMessages] = useState<{ role: string; content: any }[]>([
    {
      role: "assistant",
      content:
        "Hi! I am your AI C# Programming tutor. Ask me any conceptual question, or ask me for a code solution so we can run and test it inside our execution engine!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRunText, setAutoRunText] = useState("Executing C# compile...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading, activeTab]);

  useEffect(() => {
    const updateLayoutMode = () => setIsMobileLayout(window.innerWidth < 1024);
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setAttachedImage(event.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) setAttachedImage(event.target.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onload = (event) => {
         if (event.target?.result) setAttachedImage(event.target.result as string);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() && !attachedImage) return;

    let userContent: any = chatInput;
    if (attachedImage) {
      userContent = [];
      if (chatInput.trim()) {
        userContent.push({ type: "text", text: chatInput });
      }
      userContent.push({
        type: "image_url",
        image_url: { url: attachedImage } });
    }

    const newMsg = { role: "user", content: userContent };
    const hasAnyImages = messages.some((m: any) => Array.isArray(m.content)) || !!attachedImage;

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setAttachedImage(null);
    setIsAiLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI C# Programming tutor." },
        ]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt =
        `You are an expert Object-Oriented C# database and systems programming tutor for NC/ND IT polytechnic students. Help them master programming in C#.
- If the student greets you, jokes casually, says thanks, or asks a normal non-code question, respond naturally and briefly. Do not force a C# lesson, code sample, or long explanation unless they ask for one.
- If the student's intent is unclear, ask one short clarifying question instead of guessing a topic.
- Keep C# code examples clean and use pure, console-compilable C# (e.g., classes with static void Main).
- When the student asks for code, use simple, easy-to-understand code.
- Provide simple English comments in your code explaining what each main part of the program does.
- When you provide a complete C# console program, place a Console.ReadKey(); at the end of the Main() method to ensure they get used to console programs waiting for a key press before closing.
- When calling static methods defined in the same class, ALWAYS prefix them with the class name (e.g., \`MyClass.MyMethod();\` instead of just \`MyMethod();\`) to ensure the local execution engine resolves them correctly.
- If you write code for a student, wrap it inside \`\`\`csharp ... \`\`\` code blocks.
- Since code is sent to a C# compiler API, implement standard C# syllabus topics with Console.WriteLine outputs (no native Windows Form libraries).
- Provide explanations simply and professionally, without sales jargon.`;

      // One shared list — see services/groq.ts. No model on this account reads
      // images, so an attachment is described by the learner, not analysed.
      const modelsToTry = GROQ_MODELS;

      let data: any = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({
                model: model,
                ...groqReasoningParams(model),
                messages: [
                  { role: "system", content: systemPrompt },
                  ...messages.map((m) => ({
                    role: m.role,
                    content: m.content })),
                  newMsg,
                ],
                temperature: 0.7,
                max_tokens: 1200 }) },
          );

          data = await response.json();
          if (!data.error) {
            break;
          } else {
            lastError = new Error(data.error.message || "API Error");
          }
        } catch (e: any) {
          lastError = e;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error("All Groq models failed to respond.");
      }

      let aiText = data.choices[0].message.content || "";
      let extractedCSharp = "";
      
      const csharpMatch = aiText.match(/```csharp\s*([\s\S]*?)\s*```/) || aiText.match(/```cs\s*([\s\S]*?)\s*```/);
      if (csharpMatch) {
        extractedCSharp = csharpMatch[1].trim();
      }

      setIsAiLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      let currentText = "";
      const chunkSize = Math.max(1, Math.floor(aiText.length / 32)); 
      for (let i = 0; i < aiText.length; i += chunkSize) {
        currentText += aiText.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentText;
          return newMessages;
        });
        await new Promise(r => setTimeout(r, 12));
      }
      
      setMessages((prev) => {
         const newMessages = [...prev];
         newMessages[newMessages.length - 1].content = aiText;
         return newMessages;
      });

      if (extractedCSharp && autoRunCommands) {
         handleSnippetClick(extractedCSharp, true);
      }

    } catch (e: any) {
      setIsAiLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `API tutor execution error: ${e.message}` },
      ]);
    }
  };

  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const snippetData = [
    {
      title: "1. Mathematical problems",
      description: "Perform basic mathematical operations.",
      code: `using System;

class MathematicalProblems
{
    static void Main()
    {
        // 1. Addition
        int num1 = 15;
        int num2 = 25;
        int sum = num1 + num2;
        Console.WriteLine("Sum: " + num1 + " + " + num2 + " = " + sum);
        
        // 2. Square Root
        double sqrt = Math.Sqrt(144);
        Console.WriteLine("Square root of 144 is: " + sqrt);
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "2. If else statements",
      description: "Determine flow based on condition evaluation.",
      code: `using System;

class IfElseDemo
{
    static void Main()
    {
        int score = 85;
        
        // Check condition
        if (score >= 80) 
        {
            Console.WriteLine("Congratulations! You got a Distinction.");
        } 
        else if (score >= 60) 
        {
            Console.WriteLine("You passed with a Merit.");
        } 
        else 
        {
            Console.WriteLine("You need to work harder.");
        }
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "3. Select statement (switch)",
      description: "Switch cases to select matching executions.",
      code: `using System;

class SwitchDemo
{
    static void Main()
    {
        int day = 3;
        
        // Make a choice based on day number
        switch (day) 
        {
            case 1:
                Console.WriteLine("Monday");
                break;
            case 2:
                Console.WriteLine("Tuesday");
                break;
            case 3:
                Console.WriteLine("Wednesday");
                break; // Switch matches here
            default:
                Console.WriteLine("Other day");
                break;
        }
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "4. The for loop",
      description: "Looping through numbers counting up and down.",
      code: `using System;

class ForLoopDemo
{
    static void Main()
    {
        Console.WriteLine("Counting up:");
        
        // Loop from 1 to 5
        for (int i = 1; i <= 5; i++)
        {
            Console.WriteLine("Count: " + i);
        }
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "5. Patterns (nested loops)",
      description: "Using for loops inside other for loops to create shapes.",
      code: `using System;

class NestedLoopsDemo
{
    static void Main()
    {
        Console.WriteLine("Printing a right triangle pattern:");
        
        // Outer loop controls rows
        for (int row = 1; row <= 5; row++)
        {
            // Inner loop controls columns (stars per row)
            for (int col = 1; col <= row; col++)
            {
                Console.Write("* ");
            }
            // Move to the next line after each row
            Console.WriteLine();
        }
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "6. Arrays",
      description: "Storing multiple values in a single variable.",
      code: `using System;

class ArraysDemo
{
    static void Main()
    {
        // Declare an array of numbers
        int[] numbers = { 10, 20, 30, 40, 50 };
        
        Console.WriteLine("Values in the array:");
        
        // Go through the array elements
        for (int i = 0; i < numbers.Length; i++)
        {
            Console.WriteLine("Element at index " + i + " is " + numbers[i]);
        }
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}` },
    {
      title: "7. Functions",
      description: "Making reusable blocks of code that take arguments.",
      code: `using System;

class FunctionsDemo
{
    static void Main()
    {
        // Call function to calculate area
        double area = FunctionsDemo.CalculateArea(5, 10);
        
        Console.WriteLine("The area of a 5x10 rectangle is: " + area);
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }

    // Function that takes two numbers and returns double
    static double CalculateArea(double width, double length)
    {
        return width * length;
    }
}` },
    {
      title: "8. Classes",
      description: "Creating custom structures with variables and functions.",
      code: `using System;

class ClassesDemo
{
    static void Main()
    {
        // 1. Create a Student object
        Student stu = new Student("Alice", 20);
        
        // 2. Call a method on the object
        stu.Greet();
        
        // Wait for user to press a key before closing
        Console.ReadKey();
    }
}

// Define the blueprint for a Student
class Student
{
    public string name;
    public int age;

    // Constructor to set initial values
    public Student(string studentName, int studentAge)
    {
        this.name = studentName;
        this.age = studentAge;
    }

    // Class function
    public void Greet()
    {
        Console.WriteLine("Hi, my name is " + this.name + " and I am " + this.age + " years old.");
    }
}` },
  ];

  const handleSnippetClick = async (snippet: string, autoRun = false) => {
    if (autoRun) {
      setActiveMobileTab("code");
    }
    setIsTyping(true);
    setTypingMessage(autoRun ? "Auto-generating C# structure..." : "Loading boilerplate...");
    setQuery("");
    setHasExecuted(false);

    await new Promise((r) => setTimeout(r, 260));
    setTypingMessage("Streaming text to Visual Studio workspace...");

    let currentCode = "";
    const step = autoRun ? 5 : 2;
    await new Promise((r) => setTimeout(r, 120));
    setTypingMessage("");

    for (let i = 0; i < snippet.length; i += step) {
      currentCode += snippet.slice(i, i + step);
      setQuery(currentCode);
      await new Promise((r) => setTimeout(r, 6));
    }
    setQuery(snippet);
    setIsTyping(false);

    if (autoRun) {
      handleGo(true, snippet);
    }
  };

  useEffect(() => {
    setShowTutorial(true);
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const executeThroughApi = async (
    code: string,
    stdin = "",
    isAuto = false,
    preserveTerminal = false,
    promptsToStrip: string[] = []
  ) => {
    setAutoRunText(isAuto ? "Sending C# code to compiler API..." : "Running C# through compiler API...");
    setIsExecuting(true);
    setHasExecuted(false);
    setResult({ success: true, output: [] });

    setTimeout(async () => {
      try {
        const execRes = await runCSharpCode(code, stdin);
        const resultToShow = preserveTerminal
          ? {
              ...execRes,
              output: execRes.output
                .map((line) =>
                  promptsToStrip.reduce(
                    (currentLine, prompt) => currentLine.replaceAll(prompt, ""),
                    line
                  )
                )
                .filter((line) => line.trim().length > 0),
            }
          : execRes;
        setResult(resultToShow);
        if (!preserveTerminal) {
          setTerminalLines([]);
        }
      } catch (err: any) {
        setResult({
          success: false,
          output: [],
          error:
            err.message ||
            "Unable to reach the C# compiler API. Check VITE_CSHARP_RUN_API_URL or the /api/csharp/run endpoint.",
          executionTime: 0
        });
      } finally {
        setHasExecuted(true);
        setIsExecuting(false);
        setIsWaitingForInput(false);
        resolveInputRef.current = null;
      }
    }, 450);
  };

  const handleGo = (isAuto = false, codeOverride?: string) => {
    const codeToPrepare = codeOverride ?? query;
    if (!codeToPrepare.trim()) return;

    if (!isAuto) {
      setActiveMobileTab("code");
    }

    if (topRowRatio === 100) {
      setTopRowRatio(60);
    }

    const prompts = extractConsoleInputPrompts(codeToPrepare);
    setResult({ success: true, output: [] });
    setHasExecuted(false);
    setTerminalLines([]);
    setConsoleInputValue("");

    if (prompts.length > 0) {
      setPendingRunCode(codeToPrepare);
      setPendingPrompts(prompts);
      setCollectedInputs([]);
      setActiveInputIndex(0);
      setIsWaitingForInput(true);
      setTerminalLines([prompts[0]]);
      return;
    }

    setPendingRunCode(null);
    setPendingPrompts([]);
    setCollectedInputs([]);
    setActiveInputIndex(0);
    setIsWaitingForInput(false);
    executeThroughApi(codeToPrepare, "", isAuto);
  };

  const handleTerminalInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRunCode || !isWaitingForInput) return;

    const value = consoleInputValue;
    const nextInputs = [...collectedInputs, value];
    const nextIndex = activeInputIndex + 1;
    setTerminalLines((prev) => [...prev, `> ${value}`]);
    setConsoleInputValue("");
    setCollectedInputs(nextInputs);

    if (nextIndex < pendingPrompts.length) {
      setActiveInputIndex(nextIndex);
      setTerminalLines((prev) => [...prev, pendingPrompts[nextIndex]]);
      return;
    }

    const codeToRun = pendingRunCode;
    setPendingRunCode(null);
    setPendingPrompts([]);
    setCollectedInputs([]);
    setActiveInputIndex(0);
    setIsWaitingForInput(false);
    executeThroughApi(codeToRun, `${nextInputs.join("\n")}\n`, false, true, pendingPrompts);
  };

  const handleEditorChange = (value: string | undefined) => {
    setQuery(value || "");
  };

  const openMobileCodeTab = () => {
    setActiveMobileTab("code");
    window.setTimeout(() => {
      terminalOutputRef.current?.scrollTo({
        top: terminalOutputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      configureCSharpMonaco(monaco);
      monaco.editor.setTheme(isDarkMode ? "sidemann-csharp-dark" : "sidemann-csharp-light");
    }
  }, [monaco, isDarkMode]);

  const codeTabStatus = isExecuting
    ? "Running..."
    : hasExecuted
      ? result.success
        ? "Ran"
        : "Error"
      : "";
  const codeTabStatusColor = isExecuting
    ? "bg-amber-500"
    : hasExecuted
      ? result.success
        ? "bg-emerald-500"
        : "bg-red-500"
      : "bg-slate-400";
  const isConsoleOpen = topRowRatio < 100;
  const mobileEditorBasis = !isConsoleOpen ? "100%" : hasExecuted && !result.success ? "55%" : "65%";
  const mobileTerminalBasis = !isConsoleOpen ? "0%" : hasExecuted && !result.success ? "45%" : "35%";

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}
    >
      <style>{customInputStyles}</style>

      {/* Top Navbar */}
      <div
        className={`h-14 border-b flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 shadow-sm ${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-1.5 rounded-md shrink-0 transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded bg-[#003153]/10 text-[#003153] dark:text-blue-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-sm sm:text-lg tracking-tight truncate max-w-[46vw] sm:max-w-none">
              <span className="sm:hidden">Practice & Compile</span>
              <span className="hidden sm:inline">C# Practice & Compilation Lab</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <TeachMeLaunchButton />
          <button
            onClick={() => setIsSyllabusOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"}`}
            title="Syllabus Topics"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Syllabus Topics</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-md ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"} transition-colors`}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div 
        ref={workspaceRef}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        className="flex-1 flex overflow-hidden lg:flex-row flex-col pb-[72px] lg:pb-0"
      >
        <div className="flex w-full h-full relative lg:flex-row flex-col">
          <div 
            ref={leftColRef}
            className={`${activeMobileTab === "code" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : { flexBasis: `${leftColumnRatio}%`, flexGrow: 0, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
            }
          >
            {/* Editor Section */}
            <div
              className={`flex flex-col overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.05)] ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
              style={
                isMobileLayout
                  ? { flexBasis: mobileEditorBasis, flexGrow: 0, transition: "flex-basis 0.25s ease" }
                  : { flexBasis: `${topRowRatio}%`, flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
              }
            >
              <div
                className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-b shrink-0 gap-3 ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}`}
              >
                <div className="hidden lg:flex items-center gap-2">
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-indigo-600`}
                  >
                    1
                  </span>
                  <h2 className="text-sm font-semibold tracking-wide">
                    C# Editor Environment (Visual Studio)
                  </h2>
                </div>
                <div className="lg:hidden flex items-center gap-2 min-w-0">
                  <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-sm font-semibold truncate">Code</span>
                </div>
                
                <div className="hidden lg:flex items-center gap-3">
                  <div
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border hidden sm:block ${isDarkMode ? "border-gray-600 text-gray-400 bg-gray-800" : "border-gray-200 text-gray-500 bg-white"}`}
                  >
                    Ctrl+Enter
                  </div>

                  <button
                     onClick={() => {
                       setQuery(DEFAULT_CODE);
                       setResult({ success: true, output: [] });
                       setHasExecuted(false);
                       setTerminalLines([]);
                       setPendingRunCode(null);
                       setPendingPrompts([]);
                       setCollectedInputs([]);
                       setActiveInputIndex(0);
                       setIsWaitingForInput(false);
                       setConsoleInputValue("");
                     }}
                     className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
                       isDarkMode
                         ? "bg-[#333] border-[#555] text-gray-200 hover:bg-[#444]"
                         : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                     }`}
                     title="Reset to default compilable script"
                   >
                     <RotateCcw className="w-3.5 h-3.5" />
                     <span className="hidden sm:inline">Reset</span>
                   </button>

                  <div className="relative">
                    {topRowRatio < 100 && !isExecuting ? (
	                      <button
	                        onClick={() => {
	                          setTopRowRatio(100);
	                          setHasExecuted(false);
	                          setResult({ success: true, output: [] });
                            setTerminalLines([]);
                            setPendingRunCode(null);
                            setPendingPrompts([]);
                            setCollectedInputs([]);
                            setActiveInputIndex(0);
                            setIsWaitingForInput(false);
                            setConsoleInputValue("");
	                        }}
                        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md active:scale-[0.98]`}
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGo()}
                        disabled={isExecuting || !query.trim()}
                        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all ${
                          isExecuting || !query.trim()
                            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                            : "bg-[#003153] hover:bg-blue-800 text-white shadow hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        {isExecuting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Executing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run</span>
                          </>
                        )}
                      </button>
                    )}
  
                    {showTutorial && !isExecuting && query.trim() && (
                      <div className="absolute top-10 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce whitespace-nowrap">
                        <Lightbulb size={12} fill="currentColor" /> Click to execute!
                        <div className="absolute -top-1 right-6 w-2 h-2 bg-indigo-600 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:hidden flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTopRowRatio(isConsoleOpen ? 100 : 60)}
                    className={`p-2 rounded-md border transition-colors ${
                      isConsoleOpen
                        ? isDarkMode
                          ? "bg-sky-950/40 border-sky-800 text-sky-300"
                          : "bg-sky-50 border-sky-200 text-sky-700"
                        : isDarkMode
                          ? "bg-[#333] border-[#555] text-gray-200"
                          : "bg-white border-gray-300 text-gray-700 shadow-sm"
                    }`}
                    title={isConsoleOpen ? "Hide output" : "Show output"}
                  >
                    <Terminal className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo()}
                    disabled={isExecuting || !query.trim()}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all active:scale-95 ${
                      isExecuting || !query.trim()
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-[#003153] hover:bg-blue-800 text-white shadow"
                    }`}
                    title="Run C# code"
                  >
                    {isExecuting ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    Run
                  </button>
                </div>
              </div>

              <div className="relative flex-1 min-h-0 bg-[#fffffe] dark:bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language="csharp"
                  theme={isDarkMode ? "sidemann-csharp-dark" : "sidemann-csharp-light"}
                  value={query}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                    lineNumbersMinChars: 3 }}
                  beforeMount={configureCSharpMonaco}
                  onMount={(editor, monacoInstance) => {
                    configureCSharpMonaco(monacoInstance);
                    monacoInstance.editor.setTheme(isDarkMode ? "sidemann-csharp-dark" : "sidemann-csharp-light");
                    editor.addCommand(
                      monacoInstance.KeyMod.CtrlCmd |
                        monacoInstance.KeyCode.Enter,
                      () => {
                        handleGo();
                      },
                    );

                    const completionProvider = monacoInstance.languages.registerCompletionItemProvider('csharp', {
                      triggerCharacters: ['.', 'C'],
                      provideCompletionItems: (model: any, position: any) => {
                        const word = model.getWordUntilPosition(position);
                        const range = {
                          startLineNumber: position.lineNumber,
                          endLineNumber: position.lineNumber,
                          startColumn: word.startColumn,
                          endColumn: word.endColumn };
                        const suggestions = [
                          {
                            label: 'Console.ReadLine',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Console.ReadLine()',
                            documentation: 'Reads the next line of characters from the standard input stream.' },
                          {
                            label: 'Convert.ToInt32',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToInt32(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent 32-bit signed integer.' },
                          {
                            label: 'Convert.ToInt16',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToInt16(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent 16-bit signed integer.' },
                          {
                            label: 'Convert.ToInt64',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToInt64(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent 64-bit signed integer.' },
                          {
                            label: 'Convert.ToString',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToString(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts the specified value to its equivalent string representation.' },
                          {
                            label: 'Convert.ToDouble',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToDouble(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent double-precision floating-point number.' },
                          {
                            label: 'Convert.ToSingle',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToSingle(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent single-precision floating-point number.' },
                          {
                            label: 'Convert.ToDecimal',
                            kind: monacoInstance.languages.CompletionItemKind.Method,
                            insertText: 'Convert.ToDecimal(${1:value})',
                            insertTextRules: monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                            documentation: 'Converts a string representation to an equivalent decimal number.' },
                        ];
                        return {
                          suggestions: suggestions.map(s => ({ ...s, range }))
                        };
                      }
                    });
                    editor.onDidDispose(() => completionProvider.dispose());
                  }}
                />

              </div>

               
            </div>

            {/* Drag Handle (Row splitting editor and Terminal Output) */}
            <div
              className={`hidden lg:flex items-center justify-center relative z-20 cursor-row-resize ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-full h-2 group hover:bg-indigo-500 active:bg-indigo-600 transition-colors border-y ${isDarkMode ? 'border-[#404040]' : 'border-gray-300'}`}
              onPointerDown={handleRowDown}
            >
              <div className={`w-8 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-indigo-300`} />
            </div>

            {/* Console Output Section */}
            <div
              className={`flex flex-col border-t shrink-0 ${isDarkMode ? "bg-[#181818]" : "bg-white"}`}
              style={
                isMobileLayout
                  ? { flexBasis: mobileTerminalBasis, overflow: "hidden", flexGrow: 0, transition: "flex-basis 0.25s ease" }
                  : { flexBasis: `${100 - topRowRatio}%`, overflow: 'hidden', flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
              }
            >
               <div
                className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${isDarkMode ? "bg-[#1f1f1f] border-[#404040]" : "bg-slate-100 border-slate-300"}`}
              >
                <div className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  <Terminal size={16} className="text-sky-500" />
                  <h2 className="text-xs font-bold tracking-wider font-mono uppercase text-sky-500">
                    Console output Terminal
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {hasExecuted && (
                    result.success ? (
                      <div className={`flex items-center gap-1.5 text-[10px] font-mono font-medium ${isDarkMode ? "text-purple-400" : "text-indigo-600"}`}>
                        <CheckCircle className="w-3 h-3" />
                        Executed in {result.executionTime} ms.
                      </div>
                    ) : (
                      <div className={`flex items-center gap-1.5 text-[10px] font-mono font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                        <AlertCircle className="w-3 h-3" />
                        Compilation error
                      </div>
                    )
                  )}
                  <button
                    onClick={() => {
                      setTopRowRatio(100);
                      setHasExecuted(false);
                      setResult({ success: true, output: [] });
                      setTerminalLines([]);
                      setPendingRunCode(null);
                      setPendingPrompts([]);
                      setCollectedInputs([]);
                      setActiveInputIndex(0);
                      setIsWaitingForInput(false);
                      setConsoleInputValue("");
                    }}
                    className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-300/60 text-slate-500 hover:text-slate-900"}`}
                    title="Close console output"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={terminalOutputRef}
                className={`flex-1 min-h-0 overflow-auto p-4 font-mono text-xs md:text-sm custom-scrollbar whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-white bg-slate-950" : "text-slate-800 bg-white"}`}
              >
                {isExecuting ? (
                  <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3 text-center">
                    <div className="w-9 h-9 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                      {autoRunText}
                    </span>
                  </div>
                ) : !result.success ? (
                  <div className={`p-3 rounded space-y-3 border ${isDarkMode ? "text-red-400 bg-red-950/20 border-red-900/30" : "text-red-700 bg-red-50 border-red-200"}`}>
                    <span className="font-bold text-[#ff7400] uppercase block mb-1 font-sans">
                      [C# Compiler / Runtime Error]:
                    </span>
                    {result.diagnostics && result.diagnostics.length > 0 ? (
                      <div className="space-y-2">
                        {result.diagnostics.map((diagnostic, index) => (
                          <div key={index} className="rounded border border-red-900/40 bg-black/20 p-2">
                            <div className="text-[11px] uppercase tracking-wider text-red-300 font-bold">
                              {diagnostic.severity || 'error'}
                              {diagnostic.code ? ` ${diagnostic.code}` : ''}
                              {diagnostic.line !== undefined
                                ? ` at line ${diagnostic.line}${diagnostic.column !== undefined ? `, column ${diagnostic.column}` : ''}`
                                : ' at unknown location'}
                            </div>
                            <div className="mt-1 text-red-100">{diagnostic.message}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>{result.error}</div>
                    )}
                  </div>
                ) : (
                  <>
                    {terminalLines.map((line, lIdx) => (
                      <div key={`terminal-${lIdx}`} className={`border-b border-transparent py-0.5 px-2 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}>
                        <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">
                          {line.startsWith(">") ? "" : "?"}
                        </span>
                        {line}
                      </div>
                    ))}
                    {result.output.map((line, lIdx) => (
                      <div key={lIdx} className={`border-b border-transparent py-0.5 px-2 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}>
                        <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">
                          &gt;
                        </span>
                        {line}
                      </div>
                    ))}
                    {isWaitingForInput && (
                      <form 
                        className="flex mt-2 items-center w-full px-2"
                        onSubmit={handleTerminalInputSubmit}
                      >
                         <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">&gt;</span>
                         <input 
                           autoFocus
                           className={`flex-1 bg-transparent border-none outline-none font-mono ${isDarkMode ? "text-white" : "text-slate-800"}`}
                           value={consoleInputValue}
                           onChange={(e) => setConsoleInputValue(e.target.value)}
                           placeholder={`Input ${activeInputIndex + 1} of ${pendingPrompts.length}`}
                         />
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Drag Handle (Column resize slider for Editor/Terminal/Chat) */}
          <div
            className={`hidden lg:flex items-center justify-center relative z-20 cursor-col-resize ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-2 h-full group hover:bg-pink-500 active:bg-pink-600 transition-colors border-x ${isDarkMode ? 'border-[#404040]' : 'border-gray-300'}`}
            onPointerDown={handleColDown}
          >
            <div className={`w-1 h-8 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-pink-300`} />
          </div>

          {/* Sidebar Area (Snippets Tab or AI Tutor Tab) */}
          <div
            className={`${activeMobileTab === "chat" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full ${
              isDarkMode ? "bg-[#252526] border-l border-[#404040]" : "bg-[#fafafa] border-l border-gray-200"
            }`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : { flexBasis: `${100 - leftColumnRatio}%`, flexGrow: 0, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
            }
          >
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between gap-3 shrink-0 h-11 px-4 border-b ${isDarkMode ? "bg-[#1e1e1e] border-[#404040] text-pink-400" : "bg-gray-50 border-gray-200 text-pink-600"}`}>
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider truncate">AI Systems Tutor</span>
              </div>
              <label className={`flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                <span>Auto Injection:</span>
                <input
                  type="checkbox"
                  checked={autoRunCommands}
                  onChange={(e) => setAutoRunCommands(e.target.checked)}
                  className="rounded border-gray-400 checked:bg-pink-500 accent-pink-500 w-3 h-3 cursor-pointer"
                  id="checkbox-auto-inject-run"
                />
              </label>
            </div>

            {/* Container Scroll Area */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col h-full">
                <div className="flex-1 flex flex-col min-h-0 relative h-full">
                  {/* AI Chat History */}
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-5 px-4 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-4 select-text">
                    {messages.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className={`flex items-start ${
                          m.role === "user" ? "ml-auto flex-row-reverse gap-3 max-w-[85%]" : "mr-auto max-w-full"
                        }`}
                      >
                        {m.role === "user" && (
                          <div className="w-7 h-7 mt-0.5 rounded-full shrink-0 flex items-center justify-center bg-purple-600 text-white">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={
                            m.role === "user"
                              ? `rounded-xl px-3 py-2 text-sm leading-normal chat-text shadow-sm border ${
                                  isDarkMode
                                    ? "bg-purple-900/40 border-purple-800 text-white"
                                    : "bg-purple-50 border-purple-100 text-purple-900"
                                }`
                              : `pt-1 text-sm leading-relaxed chat-text w-full max-w-[72ch] min-w-0 ${
                                  isDarkMode ? "text-gray-300" : "text-gray-800"
                                }`
                          }
                        >
                          {typeof m.content === "string" ? (
                            <div className="markdown-body prose-chat">
                              <ReactMarkdown
                                components={makeMarkdownComponents(isDarkMode)}
                              >
                                {m.content}
                              </ReactMarkdown>
                            </div>
                          ) : Array.isArray(m.content) ? (
                            m.content.map((elem: any, elemIdx: number) => {
                              if (elem.type === "text") {
                                return (
                                  <div key={elemIdx} className="markdown-body prose-chat">
                                    <ReactMarkdown
                                      components={makeMarkdownComponents(isDarkMode)}
                                    >
                                      {elem.text}
                                    </ReactMarkdown>
                                  </div>
                                );
                              }
                              if (elem.type === "image_url") {
                                return (
                                  <img
                                    key={elemIdx}
                                    src={elem.image_url.url}
                                    alt="User Attachment"
                                    className="max-h-48 rounded-lg mt-2 border shadow-sm border-gray-600"
                                  />
                                );
                              }
                              return null;
                            })
                          ) : null}
                        </div>
                      </div>
                    ))}
                    {isAiLoading && (
                      <div className="flex gap-3 max-w-full mr-auto">
                        <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-pink-600/10 text-pink-600 dark:text-pink-400">
                          <Bot className="w-4 h-4 animate-pulse" />
                        </div>
                        <div
                          className={`pt-1 text-sm chat-text w-full max-w-[72ch] min-w-0 ${
                            isDarkMode ? "text-gray-300" : "text-gray-800"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                            </span>
                            <span className="text-[11px] font-semibold text-gray-500">Thinking</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={endOfMessagesRef} />
                  </div>

                  {/* AI Input Box with glow matching database style */}
                  <form
                    onSubmit={handleSendMessage}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    className={`mt-auto px-4 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-4 border-t flex flex-col gap-2 shrink-0 ${
                      isDarkMode ? "bg-[#252526] border-gray-800" : "bg-white border-gray-200"
                    }`}
                  >
                    {isDragging && (
                      <div
                        className={`py-8 border-2 border-dashed border-pink-500 rounded-xl flex items-center justify-center animate-pulse mb-2 text-xs font-semibold ${
                          isDarkMode ? "bg-pink-500/10 text-pink-300" : "bg-pink-50 text-pink-600"
                        }`}
                      >
                        Drop assignment image/receipt screenshot here!
                      </div>
                    )}

                    {attachedImage && (
                      <div
                        className={`relative inline-block w-max self-start mb-2 group border rounded-lg p-1.5 ${
                          isDarkMode ? "border-[#3a3a3c] bg-[#1e1e1e]" : "border-gray-300 bg-slate-100"
                        }`}
                      >
                        <img
                          src={attachedImage}
                          alt="Attachment"
                          className={`max-h-20 rounded shadow-md border ${isDarkMode ? "border-[#3a3a3c]" : "border-slate-200"}`}
                        />
                        <button
                          type="button"
                          onClick={() => setAttachedImage(null)}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-0.5 rounded-full shadow hover:bg-red-700 transition"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <div id="poda" className="flex-1 relative">
                        <div className="ai-w"></div>
                        <div className="ai-b"></div>
                        <div className="ai-db"></div>
                        <div className="ai-g"></div>
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="Ask Sidemann"
                          className={`ai-input font-medium ${!isDarkMode ? "ai-input-light" : ""}`}
                          id="ai-text-input"
                        />
                        <button
                          type="submit"
                          disabled={isAiLoading || (!chatInput.trim() && !attachedImage)}
                          className={`absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                            isDarkMode
                              ? "bg-pink-600 text-white hover:bg-pink-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
                              : "bg-pink-600 text-white hover:bg-pink-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                          }`}
                          id="btn-ai-send"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        id="ai-hidden-file-input"
                      />
                    </div>
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed left-0 right-0 bottom-0 z-[170] border-t px-4 pt-2 ${
          isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-white border-gray-200"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openMobileCodeTab}
            className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
              activeMobileTab === "code"
                ? isDarkMode
                  ? "bg-indigo-950/40 text-indigo-300"
                  : "bg-indigo-50 text-indigo-700"
                : isDarkMode
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Code</span>
            {(isExecuting || hasExecuted) && (
              <span
                className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isDarkMode ? "bg-white/10 text-gray-200" : "bg-slate-100 text-slate-700"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${codeTabStatusColor} ${isExecuting ? "animate-pulse" : ""}`} />
                {codeTabStatus}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("chat")}
            className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
              activeMobileTab === "chat"
                ? isDarkMode
                  ? "bg-pink-950/40 text-pink-300"
                  : "bg-pink-50 text-pink-700"
                : isDarkMode
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>

      {/* Syllabus Topics Slide-in Panel */}
      <div className={`fixed inset-0 z-[200] ${isSyllabusOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setIsSyllabusOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSyllabusOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 left-0 h-full w-[300px] max-w-[85vw] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isSyllabusOpen ? "translate-x-0" : "-translate-x-full"
          } ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"}`}
        >
          <div className={`flex items-center justify-between px-4 h-14 border-b shrink-0 ${isDarkMode ? "border-[#404040]" : "border-gray-200"}`}>
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-sm">Syllabus Topics</h2>
            </div>
            <button
              onClick={() => setIsSyllabusOpen(false)}
              className={`p-1.5 rounded-md transition-colors ${isDarkMode ? "hover:bg-[#333] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {snippetData.map((snippet, sIdx) => (
              <div
                key={sIdx}
                onClick={() => {
                  handleSnippetClick(snippet.code);
                  setIsSyllabusOpen(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all group flex items-center gap-3 ${
                  isDarkMode
                    ? "bg-[#252526] border-[#3a3a3c] hover:border-indigo-500/80 hover:bg-[#2c2c2e]"
                    : "bg-slate-50 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40"
                }`}
              >
                <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${isDarkMode ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}>
                  {sIdx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate group-hover:text-indigo-500">
                    {snippet.title.replace(/^\d+\.\s*/, "")}
                  </h4>
                  <p className={`text-[10px] leading-snug truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {snippet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

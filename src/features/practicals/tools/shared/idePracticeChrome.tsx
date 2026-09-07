import React, { useState } from "react";
import { Check, Code2, Copy, Maximize2, X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

/**
 * Chrome shared by the browser-based practice IDEs (C++, Web Dev). It is the
 * same visual language as the C# compilation lab: the glowing AI prompt box,
 * the markdown typography used inside chat bubbles, and the copy/expand code
 * card the tutor's snippets are rendered in.
 */
export const IDE_PRACTICE_STYLES = `
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
.prose-chat { line-height: 1.65; font-size: 0.95rem; }
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
`;

const FILE_LABELS: Record<string, string> = {
  cpp: "main.cpp",
  "c++": "main.cpp",
  cc: "main.cpp",
  c: "main.c",
  csharp: "Program.cs",
  cs: "Program.cs",
  html: "index.html",
  css: "styles.css",
  javascript: "script.js",
  js: "script.js",
};

/**
 * Flattens whatever react-markdown passed as children into the exact source
 * text. `String(children)` looks like it does this, but on the array of nodes a
 * highlighted block produces it joins them with commas, so the copied snippet
 * comes out corrupted.
 */
export const toPlainText = (node: any): string => {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join("");
  if (typeof node === "object" && node.props) return toPlainText(node.props.children);
  return "";
};

/**
 * Copies through the async clipboard API where it is allowed, and falls back to
 * a hidden textarea otherwise — students open this over http on the campus
 * network, where navigator.clipboard is not available.
 */
export const copyTextToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the textarea below
  }

  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    area.setSelectionRange(0, text.length);
    const succeeded = document.execCommand("copy");
    document.body.removeChild(area);
    return succeeded;
  } catch {
    return false;
  }
};

const normaliseLanguage = (language?: string) => {
  if (!language) return undefined;
  const lower = language.toLowerCase();
  if (lower === "c++" || lower === "cc") return "cpp";
  if (lower === "cs") return "csharp";
  if (lower === "js") return "javascript";
  return lower;
};

export const CodeBlock: React.FC<{
  code: string;
  language?: string;
  isDarkMode: boolean;
  defaultLanguage?: string;
}> = ({ code, language, isDarkMode, defaultLanguage = "cpp" }) => {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const [isMaximized, setIsMaximized] = useState(false);
  const copied = copyState === "copied";

  const handleCopy = async () => {
    const succeeded = await copyTextToClipboard(code);
    setCopyState(succeeded ? "copied" : "failed");
    setTimeout(() => setCopyState("idle"), 1500);
  };

  const highlightLanguage = normaliseLanguage(language) || defaultLanguage;
  const fileLabel = FILE_LABELS[highlightLanguage] || `snippet.${highlightLanguage}`;

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
                copied
                  ? "bg-emerald-500/15 text-emerald-500"
                  : copyState === "failed"
                    ? "bg-red-500/15 text-red-500"
                    : isDarkMode
                      ? "hover:bg-white/10 text-gray-400 hover:text-white"
                      : "hover:bg-slate-200 text-slate-500 hover:text-slate-900"
              }`}
              title={copyState === "failed" ? "Could not copy" : copied ? "Copied" : "Copy code"}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
            language={highlightLanguage}
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
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
                    copied
                      ? "bg-emerald-500/15 text-emerald-500"
                      : copyState === "failed"
                        ? "bg-red-500/15 text-red-500"
                        : isDarkMode
                          ? "hover:bg-white/10 text-gray-300"
                          : "hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : copyState === "failed" ? "Copy failed" : "Copy"}
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
                language={highlightLanguage}
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

export const makeMarkdownComponents = (isDarkMode: boolean, defaultLanguage = "cpp") => ({
  code({ inline, className, children }: any) {
    const match = /language-(\w+)/.exec(className || "");
    const codeText = toPlainText(children).replace(/\n$/, "");
    const isInlineCode = inline || (!className && !codeText.includes("\n"));

    if (isInlineCode) {
      return <code className={className}>{children}</code>;
    }
    return (
      <CodeBlock
        code={codeText}
        language={match ? match[1] : undefined}
        isDarkMode={isDarkMode}
        defaultLanguage={defaultLanguage}
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

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  ArrowLeft,
  Plus,
  Mic,
  ArrowUp,
  Copy,
  Trash2,
  Check,
  SquarePen,
  BrainCircuit,
  Activity,
  FileDown,
  History,
  GraduationCap,
  Upload,
  Type,
  Pin,
  Menu,
  X,
  Search,
  Loader2,
  Download,
  Sparkles,
  Zap,
  Play,
  Maximize2,
  Minimize2,
  RotateCw,
  ExternalLink,
  Code2,
  Eye,
  Image as ImageIcon,
  ChevronDown,
  FolderOpen,
  FolderTree,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CURRICULUM_REGISTRY, type AcademicLevel, type SubjectMeta } from '../../data/constants';
import { requestGroqStream, type GroqChatMessage } from '../../services/groq';
import { requestGeminiStream } from '../../services/gemini';
import { ThreeStarAiIcon } from '../../components/icons/ThreeStarAiIcon';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../contexts/AuthContext';
import {
  runReactInWebContainer,
  runHtmlInWebContainer,
  buildFileSystemTreeFromDataTransfer,
  buildFileSystemTreeFromHandle,
  mountFolderIntoWebContainer,
} from '../../services/webcontainer';
import { AiChatSidebar } from './AiChatSidebar';
import {
  createChatSessionId,
  saveChatSession,
  loadChatSession,
  subscribeToTokens,
  subscribeToChatSessions,
  incrementDailyTokens,
  estimateTokens,
  saveAiNote,
  DAILY_TOKEN_LIMIT,
  AiChatSession,
} from '../../services/aiChatHistory';
import { formatDistanceToNow } from '../../utils/dateFormat';

import { MathJax, MathJaxContext } from 'better-react-mathjax';

const mathJaxConfig = {
  loader: { load: ['[tex]/html'] },
  tex: {
    packages: { '[+]': ['html'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
  options: {
    enableMenu: false,
  },
};

interface SourceItem {
  id: string;
  type: 'file' | 'text' | 'course';
  title: string;
  content: string;
  active: boolean;
  date: Date;
  summary?: string;
  metadata?: {
    level?: string;
    subject?: string;
    topic?: string;
  };
  fileType?: string;
}

interface NoteItem {
  id: string;
  content: string;
  date: Date;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imageUrl?: string;
  isStreaming?: boolean;
}

const GEMINI_LOGO_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACFUlEQVR4nN2azUocQRCAPzTuG7hZT8Y1KOgiiJK7CRhhXyOgkLuiPoIk/ryCiIaIuUgQMQg+iN4S9WBMwNXbSEGNNDKzO7s7P11+UOetb7qrp6p3IHt+AicYpwQEGn0YpuyI9GOYCUdkHMPUHZE5DLPqiCxhmB+OyD5G6QNuHZFbqyfXR0cijPcY5FuEyA7GGAAeIkTugQqG2IqQCOMrRnirTz5OpAEMYYDjJhJhHOE5nxNIhDGPp7yLKfC4kO03hWcMA5dtSIRxDYziUXFfdCARxrk+iEKR7XTVhUQYf4DpIgu7nZpIUjMLeQpU9fgMMorTrOtG2o7NFi+7NFdnPc12pqRd7F7K2yhpPAC7wGzSEaAXeA3UdDxd0aHofwHJBzHxDzgAljXHmuYsuT/dOwXG40REfnmQSLdxFq5Kj947jel+XNIZ+68HSQYaN8B3YFFzHNOcJfeWvAI+6GSXx2kVPAv5zW1gRnNJhYoeiY0cBO6AL1rMmTGU8QFxCLwhR+ZT3m6y08QI5pkK8rSV+A1MUjDD2op3KnGu/ZsXVDtcGRkBRvCM6TZrpuHDdopjoQ2Rwgo7KYcJJOT49p5qiy0mL7tBjLDRRGQNQ1SaXGJn2nZkwW6EiDSA5piNEJEu1vxfbzdptuJ5c+CIyFBklhVHRCY7s9RfygcDNUdEZmyzlF/KRzUlR8TkxwI4yOXZ071TVjwCsYqIM/xUMOMAAAAASUVORK5CYII=';

const GROK_LOGO_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADr0lEQVR4nO2ZW4hNURjHf4y7XKYR5R4j97txecDDhCKXB/I0biXl+kB5cHkw0ZgimQgPcpsieeFBU+QBIyG5DBHjPu6XcW9wtlZ9arfba+2z114nHeZf6+Wcvb9v/fde6/v+67+hHvVwhdHATWAhWU7iA+ABxfwDJO4ALclCDAfeCYkfwCiynIQHrMt0ws5AEbADqACuAvdlY54D9gIrgEExYo7yLSc1KoFGmZh8Y5n8WSDlSxg17gJrgfaG2GMCJL4B+ZkgMQt4GGPyYaMW6KghURu41nmVagccT0jA/2ZyI5aTGq9dV6l+wCMHBJ4BS4AmaZDwgI0uSahN+jYhAfVkVwHNQ+IXaEh4LveGWsdPYkz4M3AdOA2cB64B64FWmvgFwHtNrHsuK9PlNCav3tYWYCSQEyP+CAMJNY66IrI6gsAvIdDGQbPzQsZ2FyS6AV8iyudEy9jD0iDhAaUuiGwzJKgDxlnGHRqjcOxKSqJ1SFPyj0WWcYcAb2IUjmNJicwxBFeSxAaDY5LwRLInQrkh+FhLEq818c4YesivpF39hSbwLctmGkbiO7AcaCB7QffgVEm3QltD0M0xYw0EXml0lqpcfzDFkHMuCaqKLuiMGHEGaEiUh3T5zoacG2yJTDIEVRI7HfQHXgbuVT1pgeb6hoacW22JFBqC9klTJQf32A353YSfmpzq1GmF8QneSN8QEns0itePXEPOTbZEehiCzosg8dx3rWqos2PYPZ5mqMpmhYYGjXVIc0+fAIlLQM8YOdcYiEwgASo1QT8CeYFrewM18n9KNmfw9GdCA+C2oSHaKOu05Lt/zTYDHsvvSn5Mtcg1zZDrAgmRbwj+VRqdQlOgSrws1QviogVQbci1FAeoMiSo1lg5xFxSRww5wpaxFXYYkqhxMEHsnAh95bl0T4oNSX6ISWeDLsCpCBI1IZ6XNfYbXJLJlkfnEuBTBAlPRKQTKLP4aUiCVxpZrTr3SuAKcFIMibUi+PaIqZ2uP1yKQxSFJFDueq/AdapfLBb30HMwDktDdoK8EL2kvK0OgTc2H3jgiIAH7BMfzQlypCf4E1SEnB92OiRQJ1aqKsfOsDuQ5IDmKS2RCSQloaSQOsg5RbDclkQ8pa5AWYRtZHJiprt+C8hnMb9QW0b6aCZ6SS23iyJh/JNOyeeIE1LZ4qji2B5WyveJaybJoTRUJ/kwpPRYxlEoXdoTV9zWBv2r6O7zm2rERMtKlAmJm6J/shb95QO8M3FWj/8dvwFSXMtDfU76ZwAAAABJRU5ErkJggg==';

interface SubjectReference {
  id: string;
  level: AcademicLevel;
  subject: SubjectMeta;
}

type CodeCanvasProps = {
  code: string;
  language?: string;
  onRun?: (code: string, language?: string) => void;
};

const SITE_URL = 'https://www.examsidemann.com';
const PDF_LOGO_URL = 'https://i.ibb.co/HDtTcsP1/LOGObg.png';

const highlightCode = (code: string) => {
  const escapeHtml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const keywordPattern = /^(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|new|type|interface|extends|true|false|null|undefined|typeof|instanceof|switch|case|break|continue|throw|yield|void|static|readonly|as|in|of|keyof)$/;
  const cssKeyframePattern = /^(@keyframes|@media|@import|@supports|transform|animation|translateY|translateX|scale|rotate|ease-in-out|infinite|linear|ease|normal|forwards|keyframes)$/;
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*$|\/\*[\s\S]*?\*\/|#.*$|=>|===|!==|==|!=|<=|>=|&&|\|\||[{}()[\];:,]|\b\d+(?:\.\d+)?(?:px|em|rem|%|s|ms|deg|vh|vw)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/gm;

  let output = '';
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(code)) !== null) {
    const token = match[0];
    output += escapeHtml(code.slice(cursor, match.index));
    const escaped = escapeHtml(token);

    if (/^(\/\/|\/\*|#)/.test(token)) {
      output += `<span class="text-slate-400 dark:text-slate-500 italic">${escaped}</span>`;
    } else if (/^["'`]/.test(token)) {
      output += `<span class="text-[#16a34a] dark:text-emerald-300 font-normal">${escaped}</span>`;
    } else if (/^\d/.test(token) || /^\d+(?:px|em|rem|%|s|ms|deg)?$/.test(token)) {
      output += `<span class="text-[#0891b2] dark:text-cyan-300 font-normal">${escaped}</span>`;
    } else if (token === '=>') {
      output += `<span class="text-[#9333ea] dark:text-fuchsia-400 font-bold">${escaped}</span>`;
    } else if (keywordPattern.test(token)) {
      output += `<span class="text-[#9333ea] dark:text-fuchsia-300 font-semibold">${escaped}</span>`;
    } else if (cssKeyframePattern.test(token)) {
      output += `<span class="text-[#16a34a] dark:text-emerald-400 font-medium">${escaped}</span>`;
    } else if (/^[A-Z][a-zA-Z0-9_]*$/.test(token)) {
      output += `<span class="text-[#ea580c] dark:text-amber-300 font-medium">${escaped}</span>`;
    } else if (/^(curve|midX|hubBounce|HUB_STYLES|handle[A-Z]\w*|set[A-Z]\w*|[a-z][a-zA-Z0-9_]*)\b/.test(token)) {
      output += `<span class="text-[#2563eb] dark:text-sky-300 font-medium">${escaped}</span>`;
    } else {
      output += `<span class="text-slate-800 dark:text-slate-200">${escaped}</span>`;
    }

    cursor = match.index + token.length;
  }

  return output + escapeHtml(code.slice(cursor));
};

type BrowserRunnerKind = 'html' | 'css' | 'javascript' | 'react';

const getBrowserRunnerKind = (code: string, language?: string): BrowserRunnerKind | null => {
  const lang = (language || '').trim().toLowerCase();

  if (['html', 'html5', 'htm', 'svg', 'xml'].includes(lang)) return 'html';
  if (lang === 'css') return 'css';
  if (['js', 'javascript', 'mjs', 'cjs'].includes(lang)) return 'javascript';
  if (['tsx', 'jsx', 'react', 'ts'].includes(lang)) return 'react';

  // Markdown generators occasionally omit the language identifier. Only offer
  // Run when the contents still look like browser code; pseudocode and server
  // languages should not open a misleading blank preview.
  if (!lang) {
    const trimmed = code.trim();
    if (/^(?:<!doctype\s+html|<html\b|<svg\b|<[a-z][\w:-]*(?:\s|>|\/))/i.test(trimmed)) {
      return 'html';
    }
    if (/\b(?:console\.(?:log|warn|error|info)|document\.|window\.|alert\s*\(|(?:const|let|var)\s+[A-Za-z_$]|function\s+[A-Za-z_$])/m.test(trimmed)) {
      return 'javascript';
    }
  }

  return null;
};

const prepareHtmlForExecution = (code: string, language?: string): string => {
  const trimmed = code.trim();
  const runnerKind = getBrowserRunnerKind(code, language);

  // If already a full HTML document
  if (runnerKind === 'html' && /<html|<!DOCTYPE/i.test(trimmed)) {
    return trimmed;
  }

  // If CSS only
  if (runnerKind === 'css') {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 24px; background: #f8fafc; color: #0f172a; }
    .demo-box { padding: 20px; border-radius: 12px; background: white; box-shadow: 0 4px 20px rgba(0,0,0,0.06); max-width: 500px; margin: 0 auto; }
    ${trimmed}
  </style>
</head>
<body>
  <div class="demo-box">
    <h2>CSS Styles Preview</h2>
    <p>Your custom CSS rules have been applied to this preview container.</p>
    <button class="btn">Sample Button</button>
  </div>
</body>
</html>`;
  }

  // Keep source code out of the surrounding script element. Interpolating it
  // directly lets a string containing "</script>" terminate the runner script.
  if (runnerKind === 'javascript') {
    const serializedSource = JSON.stringify(trimmed)
      .replace(/</g, '\\u003c')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #0d1117; color: #c9d1d9; margin: 0; }
    #console { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; background: #161b22; padding: 16px; border-radius: 8px; border: 1px solid #30363d; white-space: pre-wrap; font-size: 13px; line-height: 1.5; color: #58a6ff; }
    h3 { margin-top: 0; color: #f0f6fc; }
  </style>
</head>
<body>
  <h3>JavaScript Console Output:</h3>
  <div id="console"></div>
  <script>
    const con = document.getElementById('console');
    const appendLog = (prefix, ...args) => {
      const formatted = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
      con.innerText += (prefix ? prefix + ' ' : '') + formatted + '\\n';
    };
    console.log = (...args) => appendLog('', ...args);
    console.error = (...args) => appendLog('[ERROR]', ...args);
    console.warn = (...args) => appendLog('[WARN]', ...args);
    console.info = (...args) => appendLog('[INFO]', ...args);
    window.addEventListener('error', (event) => appendLog('[ERROR]', event.message));
    window.addEventListener('unhandledrejection', (event) => appendLog('[ERROR]', event.reason));

    try {
      const source = ${serializedSource};
      (0, eval)(source);
    } catch(err) {
      appendLog('[ERROR]', err instanceof Error ? err.message : err);
    }
  </script>
</body>
</html>`;
  }

  // HTML / SVG snippets
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 16px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${trimmed}
</body>
</html>`;
};

const LiveCodeRunnerPanel: React.FC<{
  code: string;
  language?: string;
  title?: string;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
  onClose: () => void;
}> = ({ code, language, title, isFullScreen, onToggleFullScreen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showCopyMenu, setShowCopyMenu] = useState(false);
  const [webContainerUrl, setWebContainerUrl] = useState<string | null>(null);
  const [webContainerStatus, setWebContainerStatus] = useState<string>('');
  const [webContainerDiff, setWebContainerDiff] = useState<{ linesAdded: number; linesRemoved: number } | null>(null);

  const langUpper = (language || 'TSX').toUpperCase();
  const displayTitle = title || (language ? `${language} snippet` : 'Polytechniclandingpage');
  const isReactLike = ['tsx', 'jsx', 'react', 'ts'].includes((language || '').trim().toLowerCase());
  const isHtmlLike = ['html', 'html5', 'htm', 'svg', 'xml'].includes((language || '').trim().toLowerCase());
  const srcDoc = useMemo(() => prepareHtmlForExecution(code, language), [code, language]);

  useEffect(() => {
    if (isReactLike || isHtmlLike) {
      let isMounted = true;
      const run = isReactLike ? runReactInWebContainer(code, handleRunnerState) : runHtmlInWebContainer(srcDoc, handleRunnerState);

      function handleRunnerState(state: Parameters<NonNullable<Parameters<typeof runReactInWebContainer>[1]>>[0]) {
        if (!isMounted) return;
        if (state.url) setWebContainerUrl(state.url);
        if (state.diff) setWebContainerDiff(state.diff);
        if (state.status === 'booting') setWebContainerStatus('Booting container...');
        else if (state.status === 'installing') setWebContainerStatus('Installing packages...');
        else if (state.status === 'starting') setWebContainerStatus('Starting Vite...');
        else if (state.status === 'verifying') setWebContainerStatus('Verifying build...');
        else if (state.status === 'fixing') setWebContainerStatus('AI Self-fixing...');
        else if (state.status === 'ready') setWebContainerStatus('Verified (Live)');
        else if (state.status === 'error') setWebContainerStatus('Preview fallback');
      }

      run.catch(() => {
        if (isMounted) setWebContainerStatus('');
      });
      return () => {
        isMounted = false;
      };
    }
  }, [code, isReactLike, isHtmlLike, srcDoc]);

  const handleOpenExternal = () => {
    if (webContainerUrl) {
      window.open(webContainerUrl, '_blank');
      return;
    }
    const blob = new Blob([srcDoc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setShowCopyMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(srcDoc);
    setCopied(true);
    setShowCopyMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={
        isFullScreen
          ? 'fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white'
          : 'flex h-full w-full flex-col bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl'
      }
    >
      {/* Runner Top Bar - Matching screenshot */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#161b22] px-3 sm:px-4">
        {/* Left: Eye icon, Code icon, Title · TSX */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#21262d] p-0.5">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-[#30363d] text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="Live Preview"
              aria-label="Preview"
            >
              <Eye size={15} />
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex h-7 w-7 items-center justify-center rounded-md transition ${
                activeTab === 'code'
                  ? 'bg-white dark:bg-[#30363d] text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
              title="View Source Code"
              aria-label="Code"
            >
              <Code2 size={15} />
            </button>
          </div>

          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-[280px]">
            {displayTitle} <span className="text-slate-400 dark:text-slate-500">·</span> {langUpper}
          </span>

          {webContainerDiff && (webContainerDiff.linesAdded > 0 || webContainerDiff.linesRemoved > 0) && (
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] font-bold bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full shadow-2xs">
              <span className="text-emerald-600 dark:text-emerald-400">+{webContainerDiff.linesAdded}</span>
              <span className="text-slate-400 dark:text-slate-500">/</span>
              <span className="text-rose-600 dark:text-rose-400">-{webContainerDiff.linesRemoved}</span>
            </span>
          )}

          {webContainerStatus && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
              <span className={`h-1.5 w-1.5 rounded-full ${webContainerStatus.includes('Verified') || webContainerStatus.includes('Live') ? 'bg-emerald-500 animate-pulse' : webContainerStatus.includes('fixing') ? 'bg-rose-500 animate-ping' : 'bg-amber-500 animate-ping'}`} />
              <span>{webContainerStatus}</span>
            </span>
          )}
        </div>

        {/* Right: Copy v dropdown, expand, close */}
        <div className="flex items-center gap-1.5">
          {/* Reload button */}
          <button
            type="button"
            onClick={() => setKey((k) => k + 1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Reload Preview"
            aria-label="Reload"
          >
            <RotateCw size={13} />
          </button>

          {/* Open in new window */}
          <button
            type="button"
            onClick={handleOpenExternal}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title="Open in new window"
            aria-label="Open in new window"
          >
            <ExternalLink size={13} />
          </button>

          {/* Copy dropdown button */}
          <div className="relative">
            <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#30363d] bg-white dark:bg-[#21262d] shadow-2xs">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-black dark:hover:text-white transition"
                title="Copy Code"
              >
                {copied ? <Check size={13} className="text-emerald-500" /> : null}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCopyMenu((prev) => !prev)}
                className="border-l border-slate-200 dark:border-[#30363d] px-1.5 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
                aria-label="Copy options"
              >
                <ChevronDown size={12} />
              </button>
            </div>

            {showCopyMenu && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-36 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1f26] p-1 shadow-lg text-left">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Copy Source Code
                </button>
                <button
                  type="button"
                  onClick={handleCopyHtml}
                  className="w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Copy Full HTML
                </button>
              </div>
            )}
          </div>

          {/* Full Screen Toggle */}
          <button
            type="button"
            onClick={onToggleFullScreen}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-[#21262d] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            title={isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
            aria-label="Toggle Full Screen"
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-rose-50 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition ml-0.5"
            title="Close Preview"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Runner Body */}
      <div className="flex-1 overflow-hidden relative bg-white dark:bg-[#0d1117]">
        {activeTab === 'preview' ? (
          webContainerUrl ? (
            <iframe
              key={`wc-${key}-${webContainerUrl}`}
              src={webContainerUrl}
              title="Live WebContainer App"
              allow="cross-origin-isolated"
              className="h-full w-full border-0 bg-white"
            />
          ) : (
            <iframe
              key={key}
              srcDoc={srcDoc}
              title="Live Code Runner"
              sandbox="allow-scripts allow-modals allow-forms"
              className="h-full w-full border-0 bg-white"
            />
          )
        ) : (
          <div className="h-full w-full overflow-auto bg-white dark:bg-[#0d1117] p-4 font-mono text-xs leading-6 text-slate-900 dark:text-slate-200">
            <pre
              className="m-0"
              dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CodeCanvas: React.FC<CodeCanvasProps> = ({ code, language, onRun }) => {
  const [copied, setCopied] = useState(false);
  const label = (language || 'code').toLowerCase();
  const canRun = getBrowserRunnerKind(code, language) !== null;

  return (
    <div className="not-prose my-3.5 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-xs">
      <div className="flex h-9 items-center justify-between px-4 pt-2">
        <span className="font-mono text-xs font-medium text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {canRun && (
            <button
              type="button"
              onClick={() => onRun?.(code, language)}
              className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
              title="Run code in preview panel"
            >
              <Play size={10} className="fill-current" />
              <span>Run</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(code);
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition"
          >
            {copied ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
      <pre className="m-0 max-h-[540px] overflow-x-auto bg-white dark:bg-[#0d1117] px-4 py-3 text-[13px] font-mono leading-6 text-slate-900 dark:text-slate-200">
        <code
          className="font-mono block"
          dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
        />
      </pre>
    </div>
  );
};

const cleanMarkdownText = (value: string) =>
  value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
    .replace(/\\\(|\\\)|\\\[|\\\]/g, '')
    .trim();

const parseMarkdownTableRow = (line: string) =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cleanMarkdownText(cell));

const looksLikeTableDivider = (line: string) =>
  /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

type PdfCodeToken = {
  text: string;
  color: [number, number, number];
};

const tokenizeCodeLine = (line: string): PdfCodeToken[] => {
  const keywordPattern = /^(const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|try|catch|new|type|interface|extends|true|false|null|undefined)$/;
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*$|#.*$|\b[A-Za-z_][A-Za-z0-9_]*\b|\b\d+(?:\.\d+)?\b)/gm;
  const tokens: PdfCodeToken[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(line)) !== null) {
    if (match.index > cursor) {
      tokens.push({ text: line.slice(cursor, match.index), color: [226, 232, 240] });
    }
    const token = match[0];
    if (/^(\/\/|#)/.test(token)) tokens.push({ text: token, color: [100, 116, 139] });
    else if (/^["'`]/.test(token)) tokens.push({ text: token, color: [110, 231, 183] });
    else if (/^\d/.test(token)) tokens.push({ text: token, color: [251, 191, 36] });
    else if (keywordPattern.test(token)) tokens.push({ text: token, color: [240, 171, 252] });
    else if (/^[A-Z]/.test(token)) tokens.push({ text: token, color: [125, 211, 252] });
    else tokens.push({ text: token, color: [226, 232, 240] });
    cursor = match.index + token.length;
  }

  if (cursor < line.length) {
    tokens.push({ text: line.slice(cursor), color: [226, 232, 240] });
  }
  return tokens.length ? tokens : [{ text: ' ', color: [226, 232, 240] }];
};

const loadImageDataUrl = async (src: string): Promise<string | null> => {
  try {
    const response = await fetch(src, { mode: 'cors' });
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const downloadMarkdownPdf = async (markdown: string, title: string, filename: string) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const logoDataUrl = await loadImageDataUrl(PDF_LOGO_URL);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = 54;

  const drawLetterhead = () => {
    doc.setFillColor(51, 51, 55);
    doc.rect(0, 0, 250, 38, 'F');
    doc.setFillColor(244, 23, 68);
    doc.triangle(176, 0, 226, 38, 176, 38, 'F');
    doc.setFillColor(58, 58, 61);
    doc.triangle(226, 0, 266, 38, 226, 38, 'F');
    doc.setFillColor(51, 51, 55);
    doc.rect(250, 15, 190, 16, 'F');
    doc.triangle(440, 15, 472, 23, 440, 31, 'F');
    doc.setFillColor(244, 23, 68);
    doc.rect(292, 30, 95, 4, 'F');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 30, 9, 112, 22, undefined, 'FAST');
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.setTextColor(255, 255, 255);
      doc.text('EXAM SIDEMANN', 30, 25);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 55);
    doc.text(title, margin, 92, { maxWidth: maxWidth - 150 });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(114, 120, 130);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`, pageWidth - margin - 112, 92);
    doc.text(SITE_URL, margin, 111);
  };

  const drawFooter = (page: number, totalPages: number) => {
    const footerY = pageHeight - 34;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footerY - 18, pageWidth - margin, footerY - 18);
    doc.setFillColor(51, 51, 55);
    doc.rect(margin, footerY - 5, 7, 7, 'F');
    doc.setFillColor(244, 23, 68);
    doc.rect(margin + 164, footerY - 5, 7, 7, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(98, 105, 118);
    doc.text(SITE_URL, margin + 12, footerY);
    doc.text('Exam Sidemann AI', margin + 176, footerY);
    doc.text(`Page ${page} of ${totalPages}`, pageWidth - margin - 48, footerY);
  };

  const ensureSpace = (height: number) => {
    if (y + height <= pageHeight - margin) return;
    doc.addPage();
    y = margin;
  };

  const addText = (
    text: string,
    options: { size?: number; style?: 'normal' | 'bold'; indent?: number; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const size = options.size ?? 11;
    const indent = options.indent ?? 0;
    const gap = options.gap ?? 8;
    doc.setFont('helvetica', options.style ?? 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(options.color ?? [31, 41, 55]));
    const lines = doc.splitTextToSize(cleanMarkdownText(text), maxWidth - indent);
    const height = lines.length * (size + 4);
    ensureSpace(height + gap);
    doc.text(lines, margin + indent, y);
    y += height + gap;
  };

  const addCodeBlock = (code: string, language: string) => {
    const lines = code.split('\n');
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    const visualLineCount = lines.reduce((count, line) => count + Math.max(1, Math.ceil(doc.getTextWidth(line || ' ') / (maxWidth - 28))), 0);
    const boxHeight = visualLineCount * 13 + 42;
    ensureSpace(Math.min(boxHeight, pageHeight - margin * 2));
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin, y, maxWidth, Math.min(boxHeight, pageHeight - margin - y), 8, 8, 'F');
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(margin, y, maxWidth, 26, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text((language || 'code').toUpperCase(), margin + 14, y + 17);
    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    let codeY = y + 42;
    lines.forEach((line) => {
      if (codeY > pageHeight - margin) {
        doc.addPage();
        doc.setFillColor(15, 23, 42);
        doc.rect(margin, margin, maxWidth, pageHeight - margin * 2, 'F');
        codeY = margin + 16;
      }
      let codeX = margin + 14;
      tokenizeCodeLine(line).forEach((token) => {
        const pieces = token.text.split(/(\s+)/);
        pieces.forEach((piece) => {
          if (!piece) return;
          const width = doc.getTextWidth(piece);
          if (codeX + width > margin + maxWidth - 14) {
            codeY += 13;
            codeX = margin + 14;
          }
          if (codeY > pageHeight - margin) {
            doc.addPage();
            doc.setFillColor(15, 23, 42);
            doc.rect(margin, margin, maxWidth, pageHeight - margin * 2, 'F');
            codeY = margin + 16;
            codeX = margin + 14;
          }
          doc.setTextColor(...token.color);
          doc.text(piece, codeX, codeY);
          codeX += width;
        });
      });
      codeY += 13;
    });
    y = codeY + 14;
  };

  const addTable = (rows: string[][]) => {
    if (!rows.length) return;
    const columnCount = Math.max(...rows.map((row) => row.length));
    const columnWidth = maxWidth / columnCount;
    const rowHeight = 30;
    ensureSpace(rowHeight * Math.min(rows.length, 8) + 12);

    rows.forEach((row, rowIndex) => {
      ensureSpace(rowHeight);
      row.forEach((cell, cellIndex) => {
        const x = margin + cellIndex * columnWidth;
        doc.setFillColor(rowIndex === 0 ? 241 : 255, rowIndex === 0 ? 245 : 255, rowIndex === 0 ? 249 : 255);
        doc.setDrawColor(226, 232, 240);
        doc.rect(x, y, columnWidth, rowHeight, 'FD');
        doc.setFont('helvetica', rowIndex === 0 ? 'bold' : 'normal');
        doc.setFontSize(8);
        doc.setTextColor(31, 41, 55);
        const lines = doc.splitTextToSize(cleanMarkdownText(cell), columnWidth - 12).slice(0, 2);
        doc.text(lines, x + 6, y + 12);
      });
      y += rowHeight;
    });
    y += 12;
  };

  drawLetterhead();
  y = 146;

  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      y += 6;
      continue;
    }

    const codeMatch = trimmed.match(/^```(\w+)?/);
    if (codeMatch) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }
      addCodeBlock(codeLines.join('\n'), codeMatch[1] || 'code');
      continue;
    }

    if (trimmed.includes('|') && index + 1 < lines.length && looksLikeTableDivider(lines[index + 1])) {
      const rows = [parseMarkdownTableRow(trimmed)];
      index += 2;
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) {
        rows.push(parseMarkdownTableRow(lines[index]));
        index += 1;
      }
      index -= 1;
      addTable(rows);
      continue;
    }

    const heading = trimmed.match(/^(#{1,3})\s+(.+)/);
    if (heading) {
      addText(heading[2], {
        size: heading[1].length === 1 ? 16 : heading[1].length === 2 ? 14 : 12,
        style: 'bold',
        color: [15, 23, 42],
        gap: 10,
      });
      continue;
    }

    const numbered = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numbered) {
      addText(`${numbered[1]}. ${numbered[2]}`, { indent: 12, gap: 5 });
      continue;
    }

    const bullet = trimmed.match(/^[-*]\s+(.+)/);
    if (bullet) {
      addText(`• ${bullet[1]}`, { indent: 12, gap: 5 });
      continue;
    }

    addText(trimmed);
  }

  const totalPages = doc.getNumberOfPages();
  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page);
    drawFooter(page, totalPages);
  }

  doc.save(filename);
};

const THINKING_WORDS = [
  'Thinking',
  'Analyzing',
  'Pondering',
  'Formulating',
  'Structuring',
  'Elucidating',
];

const ThinkingIndicator: React.FC = () => {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % THINKING_WORDS.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 py-4 text-sm">
      <div className="flex items-center gap-2.5">
        <ThreeStarAiIcon size={18} className="animate-spin text-slate-700 dark:text-slate-300 shrink-0" />
        <span className="inline-block w-28 font-semibold text-xs tracking-wider uppercase text-slate-600 dark:text-slate-300 animate-pulse">
          {THINKING_WORDS[wordIndex]}...
        </span>
      </div>

      {/* Skeleton loading bars */}
      <div className="space-y-2 pt-1 max-w-lg">
        <div className="h-2.5 w-3/4 rounded-full bg-slate-200/80 dark:bg-white/[0.08] animate-pulse" />
        <div className="h-2.5 w-1/2 rounded-full bg-slate-200/60 dark:bg-white/[0.05] animate-pulse" />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Typing & Streaming constants: 2-words pacing with disappearing mist effect
// ---------------------------------------------------------------------------
const TYPING_TICK_MS = 36;

const getNextWordChunk = (queue: string): { chunk: string; remaining: string } => {
  if (!queue) return { chunk: '', remaining: '' };
  // Target ~2 words per tick; dynamically catch up if queue is large
  const targetWords = queue.length > 180 ? 4 : queue.length > 70 ? 3 : 2;
  let wordsFound = 0;
  let idx = 0;
  let inWord = false;

  while (idx < queue.length) {
    const isSpace = /\s/.test(queue[idx]);
    if (!isSpace && !inWord) {
      inWord = true;
      wordsFound++;
      if (wordsFound > targetWords) break;
    } else if (isSpace && inWord) {
      inWord = false;
      if (wordsFound >= targetWords) {
        // include any trailing spaces after this word
        while (idx < queue.length && /\s/.test(queue[idx])) {
          idx++;
        }
        break;
      }
    }
    idx++;
  }

  if (idx === 0) {
    idx = Math.min(queue.length, 6);
  }

  return {
    chunk: queue.slice(0, idx),
    remaining: queue.slice(idx),
  };
};

const StreamingMistIndicator: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes mistSmoke {
          0% {
            opacity: 0.25;
            transform: translateX(-3px) scaleX(0.85);
            filter: blur(1.5px);
          }
          50% {
            opacity: 0.9;
            transform: translateX(2px) scaleX(1.15);
            filter: blur(2.5px);
          }
          100% {
            opacity: 0.25;
            transform: translateX(-3px) scaleX(0.85);
            filter: blur(1.5px);
          }
        }
        @keyframes mistBottomFlow {
          0% {
            transform: translateX(-25%);
            opacity: 0.3;
          }
          50% {
            transform: translateX(25%);
            opacity: 0.85;
          }
          100% {
            transform: translateX(-25%);
            opacity: 0.3;
          }
        }
        .mist-vapor-trail {
          animation: mistSmoke 1.8s ease-in-out infinite;
        }
        .mist-bottom-wave {
          animation: mistBottomFlow 3.2s ease-in-out infinite;
        }
      `}</style>
      <span className="inline-flex items-center align-baseline ml-1.5 relative select-none" aria-hidden="true">
        {/* Misty vapor particle core */}
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-slate-400/40 dark:bg-white/40 opacity-75 blur-[2px]" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-tr from-slate-600 via-slate-400 to-slate-200 dark:from-white dark:via-slate-200 dark:to-slate-400 shadow-[0_0_8px_rgba(100,116,139,0.6)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        </span>
        {/* Dissolving mist vapor trail */}
        <span className="mist-vapor-trail ml-0.5 inline-block h-3.5 w-6 rounded-full bg-gradient-to-r from-slate-400/60 via-slate-300/30 to-transparent dark:from-white/60 dark:via-white/20 dark:to-transparent blur-[2px]" />
      </span>
    </>
  );
};

/** Helper to clean raw text and handle HTML tags, plus auto-normalize LaTeX formulas */
const formatMarkdownSource = (raw: string): string => {
  if (!raw) return '';
  let text = raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/gi, ' ');

  // Convert bare bracketed LaTeX formulas like `[ \text{...} ]` or `[ 6CO_2 ... ]` into standard `$$ ... $$`
  text = text.replace(/(?:^|\n|\s)\[\s*(\\text|\\ce|\\frac|\\sqrt|\\xrightarrow|\\sum|\\int|\\begin|[0-9A-Za-z]+_|[0-9A-Za-z]+(?:\^[0-9]+|_\{?[0-9a-zA-Z]+\}?)|[\\{])([\s\S]*?)\](?:\n|\s|$)/g, (match, p1, p2) => {
    return `\n\n$$\n${p1}${p2}\n$$\n\n`;
  });

  return text;
};

export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Data State
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [, setNotes] = useState<NoteItem[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const adjustInputHeight = () => {
    const el = chatInputRef.current;
    if (el) {
      el.style.height = 'auto';
      const nextHeight = Math.min(Math.max(el.scrollHeight, 38), 220);
      el.style.height = `${nextHeight}px`;
    }
  };

  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteMsgId, setSavedNoteMsgId] = useState<string | null>(null);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  // Chat session (Firestore)
  const [chatId, setChatId] = useState<string | null>(null);
  const chatIdRef = useRef<string | null>(null);
  const [chatSessions, setChatSessions] = useState<AiChatSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  // AI Provider (Gemini / Groq)
  type AiProvider = 'gemini' | 'groq';
  const [aiProvider, setAiProvider] = useState<AiProvider>(() => {
    try {
      return (localStorage.getItem('examsidemann_ai_provider') as AiProvider) || 'gemini';
    } catch {
      return 'gemini';
    }
  });

  const handleSetAiProvider = (provider: AiProvider) => {
    setAiProvider(provider);
    try {
      localStorage.setItem('examsidemann_ai_provider', provider);
    } catch {
      // ignore storage error
    }
  };

  // Live Code Runner Sidebar State
  const [activeRunner, setActiveRunner] = useState<{ code: string; language?: string } | null>(null);
  const [isRunnerFullScreen, setIsRunnerFullScreen] = useState(false);

  // Attached Image state for multimodal Gemini
  const [attachedImage, setAttachedImage] = useState<{
    url: string;
    mimeType: string;
    data: string;
    name?: string;
  } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachedImage({
        url: result,
        mimeType: file.type || 'image/png',
        data: result,
        name: file.name,
      });
      // Multimodal image questions work via Gemini
      if (aiProvider !== 'gemini') {
        handleSetAiProvider('gemini');
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          processImageFile(file);
          e.preventDefault();
          break;
        }
      }
    }
  };

  // Tokens
  const [tokensUsed, setTokensUsed] = useState(0);

  // UI State
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [subjectPickerQuery, setSubjectPickerQuery] = useState('');
  const [selectedSubjectReferenceId, setSelectedSubjectReferenceId] = useState<string | null>(null);
  const [selectedLearningOutcome, setSelectedLearningOutcome] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState<'text' | 'course' | null>(null);
  const [tempSourceContent, setTempSourceContent] = useState('');
  const [tempSourceTitle, setTempSourceTitle] = useState('');

  // WebContainer Folder Import & Drag and Drop State
  const [isDraggingFolder, setIsDraggingFolder] = useState(false);
  const [mountedProject, setMountedProject] = useState<{ name: string; fileCount: number; url?: string } | null>(null);

  const handleImportFolderPicker = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const dirHandle = await (window as any).showDirectoryPicker();
        const { tree, fileCount } = await buildFileSystemTreeFromHandle(dirHandle);
        const folderName = dirHandle.name || 'project';
        const url = await mountFolderIntoWebContainer(tree, folderName);
        setMountedProject({ name: folderName, fileCount, url });
        setActiveRunner({
          code: `// Imported project: ${folderName}\n// Total files: ${fileCount}\n// Mounted into WebContainer virtual file system`,
          language: 'tsx',
        });
      } else {
        alert('Directory picker is not supported in this browser. You can drag and drop a folder directly into the window.');
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Folder import error:', err);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingFolder) setIsDraggingFolder(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingFolder(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFolder(false);

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      try {
        const { tree, folderName, fileCount } = await buildFileSystemTreeFromDataTransfer(e.dataTransfer.items);
        if (fileCount > 0) {
          const url = await mountFolderIntoWebContainer(tree, folderName);
          setMountedProject({ name: folderName, fileCount, url });
          setActiveRunner({
            code: `// Drag & Drop Imported: ${folderName}\n// Files mounted: ${fileCount}\n// Ready in WebContainer sandbox.`,
            language: 'tsx',
          });
        }
      } catch (err) {
        console.error('Folder drop error:', err);
      }
    }
  };

  // Course Selection State
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const sentSourceIds = useRef<Set<string>>(new Set());

  const subjectReferences: SubjectReference[] = CURRICULUM_REGISTRY.flatMap((level) =>
    level.subjects.map((subject) => ({
      id: `${level.id}::${subject.name}`,
      level,
      subject,
    })),
  );
  const filteredSubjectReferences = subjectReferences
    .filter((item) => {
      const query = subjectPickerQuery.trim().toLowerCase();
      if (!query) return true;
      return `${item.subject.name} ${item.level.name} ${item.level.category} ${item.subject.description}`
        .toLowerCase()
        .includes(query);
    })
    .slice(0, 18);
  const selectedSubjectReference =
    subjectReferences.find((item) => item.id === selectedSubjectReferenceId) || null;

  // Typing animation queue
  const rawQueueRef = useRef<string>('');          // chars waiting to be revealed
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealedRef = useRef<string>('');          // text already on screen
  const streamingMsgIdRef = useRef<string | null>(null);

  // Keep chatIdRef in sync
  useEffect(() => {
    chatIdRef.current = chatId;
  }, [chatId]);

  // ── Subscribe to daily tokens ─────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToTokens(user.uid, setTokensUsed);
    return () => unsub();
  }, [user]);

  // ── Subscribe to chat sessions for real-time history ──────────────────────
  useEffect(() => {
    if (!user) {
      setChatSessions([]);
      setSessionsLoading(false);
      return;
    }
    setSessionsLoading(true);
    const unsub = subscribeToChatSessions(user.uid, (data) => {
      setChatSessions(data);
      setSessionsLoading(false);
    });
    return () => unsub();
  }, [user]);

  // Highlight control ref to prevent repeated scrolling on every message
  const hasHighlightedRef = useRef(false);

  // Reset highlight tracking when switching sessions
  useEffect(() => {
    hasHighlightedRef.current = false;
  }, [searchParams.get('session')]);

  // ── Load session from URL param ───────────────────────────────────────────
  useEffect(() => {
    const sessionId = searchParams.get('session');
    if (!sessionId || !user) return;
    if (chatIdRef.current === sessionId && messages.length > 0) return;

    loadChatSession(user.uid, sessionId).then((session) => {
      if (!session) return;
      const loaded: ChatMessage[] = (session.messages || []).map((m, i) => ({
        id: (m as any).id || `loaded-${i}`,
        role: m.role,
        text: m.text,
        isStreaming: false,
      }));
      setMessages(loaded);
      setChatId(sessionId);
      chatIdRef.current = sessionId;
    });
  }, [searchParams, user]);

  // ── Auto-scroll & Highlight when coming from Saved Notes (One-time only) ──
  useEffect(() => {
    const highlightParam = searchParams.get('highlight');
    if (!highlightParam || messages.length === 0 || hasHighlightedRef.current) return;

    hasHighlightedRef.current = true;
    const timer = setTimeout(() => {
      const match = messages.find(
        (m) => m.id === highlightParam || m.text.includes(highlightParam),
      );
      if (match) {
        const el = document.getElementById(`chat-msg-${match.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setHighlightedMsgId(match.id);
          const removeTimer = setTimeout(() => {
            setHighlightedMsgId(null);
          }, 3500);
          return () => clearTimeout(removeTimer);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchParams, messages]);

  // ── Auto-scroll on normal messages ─────────────────────────────────────────
  useEffect(() => {
    const highlightParam = searchParams.get('highlight');
    if (highlightParam && !hasHighlightedRef.current) return;

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── Cleanup timers on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  // ── Speech Recognition ────────────────────────────────────────────────────
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // ── Source Handlers ───────────────────────────────────────────────────────
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'pdf') {
      alert('Please upload DOCX or text files for grounding.');
      e.target.value = '';
      setShowAddMenu(false);
      return;
    }

    if (fileType === 'docx') {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          const text = result.value;
          const newSource: SourceItem = {
            id: Date.now().toString(),
            type: 'file',
            title: file.name,
            content: text,
            active: true,
            date: new Date(),
            fileType: 'docx',
          };
          setSources((prev) => [...prev, newSource]);
        } catch {
          alert('Failed to read DOCX file.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target?.result as string;
        const newSource: SourceItem = {
          id: Date.now().toString(),
          type: 'file',
          title: file.name,
          content: text,
          active: true,
          date: new Date(),
          fileType: 'txt',
        };
        setSources((prev) => [...prev, newSource]);
      };
      reader.readAsText(file);
    }
    setShowAddMenu(false);
  };

  const handleAddTextSource = () => {
    if (!tempSourceContent.trim() || !tempSourceTitle.trim()) return;
    const newSource: SourceItem = {
      id: Date.now().toString(),
      type: 'text',
      title: tempSourceTitle,
      content: tempSourceContent,
      active: true,
      date: new Date(),
    };
    setSources((prev) => [...prev, newSource]);
    setActiveModal(null);
    setTempSourceContent('');
    setTempSourceTitle('');
  };

  const buildSubjectContextSummary = (
    level: AcademicLevel,
    subject: SubjectMeta,
    learningOutcome?: string,
  ) => {
    const availableOutcomes =
      subject.outcomes && subject.outcomes.length > 0
        ? subject.outcomes
        : Array.from({ length: subject.outcomeCount }, (_, index) => `Learning Outcome ${index + 1}`);
    const selectedOutcome = learningOutcome?.trim();

    return [
      'Course context summary generated by Exam Sidemann from the curriculum registry. This summary was not generated by AI.',
      `Level: ${level.name}`,
      `Category: ${level.category}`,
      `Subject: ${subject.name}`,
      `Subject summary: ${subject.description || 'No subject description is available.'}`,
      subject.studyTime ? `Study time: ${subject.studyTime}` : '',
      `Learning outcomes available: ${availableOutcomes.join('; ')}`,
      selectedOutcome ? `Selected learning outcome: ${selectedOutcome}` : 'Selected learning outcome: Whole subject overview',
      selectedOutcome
        ? `Context focus: Answer the student's next question using ${subject.name} at ${level.name} level, especially the learning outcome "${selectedOutcome}".`
        : `Context focus: Answer the student's next question using ${subject.name} at ${level.name} level.`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleAddSubjectReference = () => {
    if (!selectedSubjectReference) return;
    const { level, subject } = selectedSubjectReference;
    const summary = buildSubjectContextSummary(level, subject, selectedLearningOutcome);
    const title = selectedLearningOutcome.trim()
      ? `${level.name} - ${subject.name}: ${selectedLearningOutcome.trim()}`
      : `${level.name} - ${subject.name}`;
    const newSource: SourceItem = {
      id: `subject-${Date.now()}`,
      type: 'course',
      title,
      content: summary,
      active: true,
      date: new Date(),
      summary,
      metadata: {
        level: level.name,
        subject: subject.name,
        topic: selectedLearningOutcome.trim() || undefined,
      },
    };

    setSources((prev) => [...prev, newSource]);
    setShowSubjectPicker(false);
    setSubjectPickerQuery('');
    setSelectedSubjectReferenceId(null);
    setSelectedLearningOutcome('');
  };

  const handleAddCourseSource = () => {
    if (!selectedCategory || !selectedCourse || !selectedSubject || !selectedTopic) return;
    const title = `${selectedCourse} - ${selectedSubject}: ${selectedTopic}`;
    const content = `Search Query: ${selectedTopic} in ${selectedSubject} (${selectedCourse}) syllabus and notes.`;

    const newSource: SourceItem = {
      id: Date.now().toString(),
      type: 'course',
      title,
      content,
      active: true,
      date: new Date(),
      metadata: {
        level: selectedCourse,
        subject: selectedSubject,
        topic: selectedTopic,
      },
    };

    setSources((prev) => [...prev, newSource]);
    setActiveModal(null);
    setSelectedCategory(null);
    setSelectedCourse(null);
    setSelectedSubject(null);
    setSelectedTopic(null);
  };

  // ── Typing animation helpers ──────────────────────────────────────────────
  const stopTypingTimer = () => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
  };

  const startTypingTimer = (msgId: string) => {
    stopTypingTimer();
    streamingMsgIdRef.current = msgId;

    typingTimerRef.current = setInterval(() => {
      const queue = rawQueueRef.current;
      if (!queue.length) return; // nothing to drain yet

      const { chunk, remaining } = getNextWordChunk(queue);
      rawQueueRef.current = remaining;
      revealedRef.current += chunk;

      const revealed = revealedRef.current;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, text: revealed } : m,
        ),
      );
    }, TYPING_TICK_MS);
  };

  // ── Main send handler ─────────────────────────────────────────────────────
  // ── Main send handler ─────────────────────────────────────────────────────
  const handleSend = async (overrideInput?: string) => {
    const textToSend = overrideInput || input;
    const currentAttachedImage = attachedImage;

    if (!textToSend.trim() && !currentAttachedImage) return;

    // Token gate
    if (tokensUsed >= DAILY_TOKEN_LIMIT && user) {
      alert('You have used your daily 10,000 token limit. Resets at midnight.');
      return;
    }

    const activeSources = sources.filter((s) => s.active);
    const newSources = activeSources.filter((s) => s.type === 'course' || !sentSourceIds.current.has(s.id));

    const sourceContext = newSources.length
      ? [
          '--- Active study sources ---',
          ...newSources.map((s) => `Source: ${s.title}\nContent:\n${s.content.slice(0, 20_000)}`),
          '--- End study sources ---',
        ]
          .join('\n\n')
          .slice(0, 60_000)
      : '';

    const userContent = sourceContext
      ? `${sourceContext}\n\nStudent question:\n${textToSend}`
      : textToSend;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      imageUrl: currentAttachedImage?.url,
    };

    const assistantMsgId = (Date.now() + 1).toString();

    // Clear any active highlight and prevent further highlight jumps
    setHighlightedMsgId(null);
    hasHighlightedRef.current = true;

    // ── Create Firestore session on first message ─────────────────────────
    let currentChatId = chatIdRef.current;
    if (!currentChatId && user) {
      currentChatId = createChatSessionId(user.uid);
      setChatId(currentChatId);
      chatIdRef.current = currentChatId;
      navigate(`/chat?session=${currentChatId}`, { replace: true });
    } else if (currentChatId && searchParams.get('highlight')) {
      navigate(`/chat?session=${currentChatId}`, { replace: true });
    }

    const msgsWithUser = [...messages, userMsg];
    setMessages(msgsWithUser);
    if (!overrideInput) {
      setInput('');
      if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
    }
    setAttachedImage(null);
    setIsThinking(true);

    // Save prompt immediately to database so session exists
    if (user && currentChatId) {
      const initialStored = msgsWithUser.map((m) => ({ id: m.id, role: m.role, text: m.text }));
      saveChatSession(user.uid, currentChatId, initialStored).catch(console.error);
    }

    // Reset typing queue
    rawQueueRef.current = '';
    revealedRef.current = '';

    try {
      const history = messages.slice(-20).map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      let hasStartedRendering = false;
      let fullResponseText = '';

      const systemPrompt =
        "You are Sidemann AI, Exam Sidemann's study assistant. Explain concepts clearly with clean, standard markdown formatting. Use bold text, bullet lists, clean headers, and markdown tables where suitable. When writing math or chemical formulas and equations, format them using standard LaTeX enclosed in $$ equation $$ for block display or $ equation $ for inline (for example, $$ 6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{chlorophyll}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 $$). Never output raw unrendered bracketed expressions like [\\text{...}].";

      // Streaming execution with resilient provider failover
      const runStream = async (provider: 'gemini' | 'groq') => {
        if (provider === 'gemini') {
          await requestGeminiStream({
            messages: [
              {
                role: 'system' as const,
                content: systemPrompt,
              },
              ...history,
              {
                role: 'user' as const,
                content: userContent || (currentAttachedImage ? 'Please explain this image and answer any study questions related to it.' : ''),
                image: currentAttachedImage
                  ? {
                      mimeType: currentAttachedImage.mimeType,
                      data: currentAttachedImage.data,
                    }
                  : undefined,
              },
            ],
            maxTokens: 4000,
            temperature: 0.4,
            onChunk: (chunk: string) => {
              if (!hasStartedRendering) {
                setIsThinking(false);
                hasStartedRendering = true;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantMsgId,
                    role: 'assistant',
                    text: '',
                    isStreaming: true,
                  },
                ]);
                startTypingTimer(assistantMsgId);
              }
              fullResponseText += chunk;
              rawQueueRef.current += chunk;
            },
          });
        } else {
          await requestGroqStream({
            messages: [
              {
                role: 'system' as const,
                content: systemPrompt,
              },
              ...history,
              {
                role: 'user' as const,
                content: userContent,
              },
            ],
            maxTokens: 4000,
            temperature: 0.4,
            onChunk: (chunk: string) => {
              if (!hasStartedRendering) {
                setIsThinking(false);
                hasStartedRendering = true;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: assistantMsgId,
                    role: 'assistant',
                    text: '',
                    isStreaming: true,
                  },
                ]);
                startTypingTimer(assistantMsgId);
              }
              fullResponseText += chunk;
              rawQueueRef.current += chunk;
            },
          });
        }
      };

      // Run the selected provider; Gemini internally retries its own model list on failure.
      const activeProvider = currentAttachedImage ? 'gemini' : aiProvider;
      await runStream(activeProvider);

      // ── Stream finished — flush remaining queue naturally ──────────────
      await new Promise<void>((resolve) => {
        const check = setInterval(() => {
          if (!rawQueueRef.current.length) {
            clearInterval(check);
            resolve();
          }
        }, TYPING_TICK_MS);
        setTimeout(() => {
          clearInterval(check);
          resolve();
        }, 5000);
      });

      stopTypingTimer();
      streamingMsgIdRef.current = null;

      // Finalize — ensure full text is visible and remove streaming flag
      const finalText = fullResponseText || 'No response generated.';
      const finalAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: finalText,
        isStreaming: false,
      };

      const fullFinalMessages = [...msgsWithUser, finalAssistantMsg];
      setMessages(fullFinalMessages);

      newSources.forEach((s) => {
        if (s.type !== 'course') sentSourceIds.current.add(s.id);
      });

      // ── Persist and update token count in Database ────────────────────
      if (user && currentChatId) {
        const tokenCost = estimateTokens(textToSend) + estimateTokens(finalText);
        const stored = fullFinalMessages.map((m) => ({ id: m.id, role: m.role, text: m.text }));
        await Promise.all([
          saveChatSession(user.uid, currentChatId, stored),
          incrementDailyTokens(user.uid, tokenCost),
        ]);
      }
    } catch (error) {
      stopTypingTimer();
      console.error(error);
      const errorMessage =
        error instanceof Error && error.message.startsWith('Study with AI is not configured')
          ? error.message
          : "Sorry, Sidemann AI couldn't respond just now. Please try again.";

      const errorMessages: ChatMessage[] = [
        ...msgsWithUser,
        { id: assistantMsgId, role: 'assistant', text: errorMessage, isStreaming: false },
      ];
      setMessages(errorMessages);

      if (user && currentChatId) {
        const stored = errorMessages.map((m) => ({ id: m.id, role: m.role, text: m.text }));
        saveChatSession(user.uid, currentChatId, stored).catch(console.error);
      }
    } finally {
      setIsThinking(false);
    }
  };

  const startNewChat = () => {
    stopTypingTimer();
    rawQueueRef.current = '';
    revealedRef.current = '';
    hasHighlightedRef.current = false;
    setHighlightedMsgId(null);
    setMessages([]);
    setChatId(null);
    chatIdRef.current = null;
    sentSourceIds.current.clear();
    setMobileMenuOpen(false);
    navigate('/chat');
  };

  // ── Load a session from the sidebar or mobile menu ────────────────────────
  const handleSelectSession = (session: AiChatSession) => {
    stopTypingTimer();
    rawQueueRef.current = '';
    revealedRef.current = '';
    hasHighlightedRef.current = false;
    setHighlightedMsgId(null);
    const loaded: ChatMessage[] = (session.messages || []).map((m, i) => ({
      id: (m as any).id || `loaded-${i}`,
      role: m.role,
      text: m.text,
      isStreaming: false,
    }));
    setMessages(loaded);
    setChatId(session.id);
    chatIdRef.current = session.id;
    setMobileMenuOpen(false);
    navigate(`/chat?session=${session.id}`);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Save Note to User Dashboard ──────────────────────────────────────────
  const addNote = async (content: string, messageId: string) => {
    if (!user) {
      alert('Please sign in to save notes to your dashboard.');
      return;
    }

    try {
      await saveAiNote(user.uid, {
        content,
        chatId: chatId || '',
        messageId,
      });
      setSavedNoteMsgId(messageId);
      setNotes((prev) => [...prev, { id: Date.now().toString(), content, date: new Date() }]);
      setTimeout(() => setSavedNoteMsgId(null), 3000);
    } catch (err) {
      console.error('Failed to save note to dashboard:', err);
      alert('Could not save note right now. Please try again.');
    }
  };

  const handlePDFMaker = () => {
    const markdown = messages
      .map((msg) => `${msg.role === 'user' ? '## You' : '## Sidemann AI'}\n\n${msg.text}`)
      .join('\n\n---\n\n');
    downloadMarkdownPdf(markdown, 'Study Session Summary', 'exam-sidemann-ai-chat.pdf');
    setMobileMenuOpen(false);
  };

  const handleDownloadAnswerPdf = (message: ChatMessage) => {
    downloadMarkdownPdf(
      message.text,
      'Sidemann AI Answer',
      `sidemann-ai-answer-${message.id}.pdf`,
    );
  };

  // Token display values
  const tokenRemaining = Math.max(DAILY_TOKEN_LIMIT - tokensUsed, 0);
  const tokenLimitReached = tokensUsed >= DAILY_TOKEN_LIMIT && !!user;
  const isAiReplying = isThinking || messages.some((m) => m.isStreaming);

  const filteredMobileSessions = mobileSearchQuery.trim()
    ? chatSessions.filter((s) =>
        s.title.toLowerCase().includes(mobileSearchQuery.toLowerCase()),
      )
    : chatSessions;

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="flex h-screen w-full overflow-hidden bg-[#fcfcfd] dark:bg-[#0d0f14] text-slate-900 dark:text-gray-100 font-sans select-text">
        {/* Dynamic Keyframes for Double Highlight Pulse */}
        <style>{`
          @keyframes highlightDoublePulse {
            0%, 100% {
              background-color: transparent;
              box-shadow: none;
            }
            15%, 45% {
              background-color: rgba(245, 158, 11, 0.18);
              box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.45);
            }
            30%, 60% {
              background-color: transparent;
              box-shadow: none;
            }
            75% {
              background-color: rgba(245, 158, 11, 0.18);
              box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.45);
            }
          }
          .highlight-twice {
            animation: highlightDoublePulse 2.8s ease-in-out 1 forwards;
            border-radius: 12px;
          }
        `}</style>

        {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
        <AiChatSidebar
        activeChatId={chatId}
        tokensUsed={tokensUsed}
        onSelectSession={handleSelectSession}
        onNewChat={startNewChat}
        onExamPredictor={() =>
          handleSend('Based on our conversation, predict 5 likely exam questions with marking guides.')
        }
        onPdfExport={handlePDFMaker}
        onDiagramHelper={() =>
          handleSend('Draw a clear text diagram or breakdown explaining the main topic.')
        }
        onClearConversation={startNewChat}
      />

      {/* ── Mobile Menu Slide-Over Drawer ────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
            />

            {/* Slide-over Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-[#0d0f14] border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden md:hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-white/[0.08] shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Menu
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Model Selector in Mobile Drawer */}
              <div className="px-3 pt-3 pb-2 shrink-0 border-b border-slate-200/80 dark:border-white/[0.08]">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500 mb-1.5">
                  AI Model
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => handleSetAiProvider('gemini')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      aiProvider === 'gemini'
                        ? 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                    }`}
                  >
                    <img src={GEMINI_LOGO_SRC} alt="Gemini" className="h-4 w-4 object-contain shrink-0" />
                    <span>Gemini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAiProvider('groq')}
                    className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                      aiProvider === 'groq'
                        ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs'
                        : 'text-slate-600 dark:text-gray-400 hover:text-slate-900'
                    }`}
                  >
                    <img src={GROK_LOGO_SRC} alt="Groq" className="h-4 w-4 object-contain shrink-0" />
                    <span>Groq</span>
                  </button>
                </div>
              </div>

              {/* Action Menu */}
              <div className="flex flex-col gap-0.5 p-3 shrink-0 border-b border-slate-200/80 dark:border-white/[0.08]">
                <button
                  onClick={startNewChat}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <SquarePen size={15} className="shrink-0 text-slate-700 dark:text-gray-300" />
                  <span>New Chat</span>
                </button>

                <button
                  onClick={() => {
                    handleSend('Based on our conversation, predict 5 likely exam questions with marking guides.');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <BrainCircuit size={15} className="shrink-0 text-purple-500" />
                  <span>Exam Predictor</span>
                </button>

                <button
                  onClick={() => {
                    handleSend('Draw a clear text diagram or breakdown explaining the main topic.');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Activity size={15} className="shrink-0 text-orange-500" />
                  <span>Diagram Helper</span>
                </button>

                <button
                  onClick={handlePDFMaker}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <FileDown size={15} className="shrink-0 text-blue-500" />
                  <span>Export as PDF</span>
                </button>

                <button
                  onClick={startNewChat}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 size={15} className="shrink-0 text-rose-500" />
                  <span>Clear Conversation</span>
                </button>

                <button
                  onClick={() => {
                    navigate('/chat/history');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-[8px] text-xs font-semibold text-slate-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                >
                  <History size={15} className="shrink-0 text-emerald-500" />
                  <span>All History</span>
                </button>
              </div>

              {/* Chat History Section */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-gray-500">
                    Chats
                  </span>
                </div>

                {/* Search input in mobile menu */}
                <div className="relative mb-2 shrink-0">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search chats…"
                    className="w-full rounded-[8px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 pl-8 pr-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-slate-400 dark:focus:border-white/30"
                  />
                </div>

                {/* Session list (No icons for titles) */}
                <div className="space-y-1 flex-1">
                  {sessionsLoading && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 size={16} className="animate-spin text-slate-400" />
                    </div>
                  )}

                  {!sessionsLoading && user && filteredMobileSessions.length === 0 && (
                    <p className="text-[11px] text-slate-400 dark:text-gray-500 px-2 py-4 text-center">
                      {mobileSearchQuery ? 'No matching chats' : 'No past chats yet'}
                    </p>
                  )}

                  {!sessionsLoading && !user && (
                    <p className="text-[11px] text-slate-400 dark:text-gray-500 px-2 py-4 text-center leading-5">
                      Sign in to view and save chat history
                    </p>
                  )}

                  {filteredMobileSessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session)}
                      className={`w-full flex flex-col text-left rounded-[8px] px-3 py-2 transition-colors ${
                        session.id === chatId
                          ? 'bg-slate-200/80 dark:bg-white/10 text-slate-900 dark:text-white font-bold'
                          : 'text-slate-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate text-xs leading-snug">
                        {session.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">
                        {session.updatedAt?.toDate
                          ? formatDistanceToNow(session.updatedAt.toDate())
                          : 'Recently'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ───────────────────────────────────────────────── */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="relative flex flex-col flex-1 min-w-0 h-screen overflow-hidden"
      >
        {/* Fullscreen Drag & Drop Overlay */}
        <AnimatePresence>
          {isDraggingFolder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-4 z-50 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-500 bg-indigo-950/80 backdrop-blur-md text-white shadow-2xl pointer-events-none p-6 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 mb-4 animate-bounce">
                <FolderOpen size={36} />
              </div>
              <h3 className="text-lg font-bold text-white">Drop Folder to Mount Project</h3>
              <p className="text-xs text-indigo-200 mt-1 max-w-sm">
                Recursively mounts your local folder into the WebContainer virtual environment for live preview and AI tools.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP BAR */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#0d0f14]/95 backdrop-blur-md z-30">
          {/* Back to site button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-gray-200 transition-colors text-xs font-bold border border-slate-200/60 dark:border-white/10"
              title="Back to dashboard / site"
              aria-label="Back to site"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back to site</span>
            </button>
          </div>

          {/* ── Center: Model Toggle + Tokens remaining ─ */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Model Selector Toggle */}
            <div className="flex items-center rounded-full bg-slate-100 dark:bg-white/[0.07] p-1 border border-slate-200/80 dark:border-white/10 text-xs font-bold shadow-2xs">
              <button
                type="button"
                onClick={() => handleSetAiProvider('gemini')}
                className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 transition-all ${
                  aiProvider === 'gemini'
                    ? 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 shadow-xs ring-1 ring-black/5 dark:ring-white/10 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Google Gemini 2.5 Flash"
              >
                <img src={GEMINI_LOGO_SRC} alt="Gemini" className="h-3.5 w-3.5 object-contain shrink-0" />
                <span>Gemini</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetAiProvider('groq')}
                className={`flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 transition-all ${
                  aiProvider === 'groq'
                    ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs ring-1 ring-black/5 dark:ring-white/10 font-black'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
                title="Groq LLM (Fast inference)"
              >
                <img src={GROK_LOGO_SRC} alt="Groq" className="h-3.5 w-3.5 object-contain shrink-0" />
                <span>Groq</span>
              </button>
            </div>

            {/* Tokens remaining */}
            <div className="hidden sm:flex items-center justify-center min-w-[50px]">
              {isAiReplying ? (
                <div className="h-4 w-12 rounded bg-slate-200 dark:bg-white/10 animate-pulse" />
              ) : (
                <span
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums select-none"
                  title={user ? `${tokenRemaining.toLocaleString()} tokens left today` : '10,000 tokens remaining'}
                >
                  {tokenRemaining.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions (New Chat on Desktop & Mobile, Menu on Mobile) */}
          <div className="flex items-center gap-1.5">
            {/* New chat button */}
            <button
              onClick={startNewChat}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 transition-colors"
              title="New Chat"
              aria-label="New Chat"
            >
              <SquarePen size={18} />
            </button>

            {/* Mobile Menu Button (replaces 3 dots on mobile) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-gray-300 transition-colors"
              title="Open Menu"
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* CHAT THREAD */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 custom-scrollbar">
          {messages.length === 0 && !isThinking ? (
            <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center px-4">
              {/* Clean minimal greeting */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                {[
                  'Explain photosynthesis simply',
                  'Predict 5 likely exam questions',
                  'How to balance chemical equations',
                  'Summarize O-Level syllabus topics',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    disabled={tokenLimitReached}
                    className="p-3 text-left rounded-[10px] bg-white dark:bg-[#151820] border border-slate-200 dark:border-white/[0.08] hover:border-slate-400 dark:hover:border-white/20 text-xs font-semibold text-slate-800 dark:text-gray-200 transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6 pb-6">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                const formattedContent = formatMarkdownSource(msg.text);
                const isHighlighted = highlightedMsgId === msg.id;

                return (
                  <div
                    key={msg.id}
                    id={`chat-msg-${msg.id}`}
                    className={`flex flex-col transition-all duration-300 ${
                      isUser ? 'items-end' : 'items-start'
                    } ${isHighlighted ? 'highlight-twice p-2 -m-2' : ''}`}
                  >
                    {isUser ? (
                      /* User Message Bubble */
                      <div className="p-3.5 px-4 text-sm leading-relaxed max-w-[90%] sm:max-w-[85%] rounded-[12px] bg-slate-100 dark:bg-[#1c202a] text-slate-900 dark:text-white shadow-sm">
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    ) : (
                      /* AI Response */
                      <div className="w-full text-slate-900 dark:text-gray-100 pt-1">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-[14.5px] leading-7 font-normal">
                          <MathJax dynamic>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                strong: ({ node, ...props }) => (
                                  <strong className="font-bold text-slate-900 dark:text-white" {...props} />
                                ),
                                h1: ({ node, ...props }) => (
                                  <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1.5" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-2.5 mb-1" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="list-disc list-outside pl-5 my-2.5 space-y-1 text-slate-800 dark:text-slate-200" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol className="list-decimal list-outside pl-5 my-2.5 space-y-1 text-slate-800 dark:text-slate-200" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                  <li className="leading-relaxed text-slate-800 dark:text-slate-200" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                  <p className="mb-2.5 last:mb-0 leading-relaxed text-slate-800 dark:text-slate-200" {...props} />
                                ),
                                a: ({ node, ...props }) => (
                                  <a
                                    className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    {...props}
                                  />
                                ),
                                table: ({ node, ...props }) => (
                                  <div className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/10 shadow-sm">
                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10 text-left text-sm" {...props} />
                                  </div>
                                ),
                                thead: ({ node, ...props }) => (
                                  <thead className="bg-slate-50 dark:bg-white/[0.04]" {...props} />
                                ),
                                th: ({ node, ...props }) => (
                                  <th className="px-3.5 py-2.5 font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider border-b border-slate-200 dark:border-white/10" {...props} />
                                ),
                                td: ({ node, ...props }) => (
                                  <td className="px-3.5 py-2 text-xs border-t border-slate-100 dark:border-white/5 text-slate-800 dark:text-slate-200 align-top" {...props} />
                                ),
                                code: ({ node, className, children, ...props }: any) => {
                                  const language = /language-(\w+)/.exec(className || '')?.[1];
                                  const codeText = String(children).replace(/\n$/, '');
                                  if (language || codeText.includes('\n')) {
                                    return (
                                      <CodeCanvas
                                        code={codeText}
                                        language={language}
                                        onRun={(c, l) => {
                                          setActiveRunner({ code: c, language: l });
                                          setIsRunnerFullScreen(false);
                                        }}
                                      />
                                    );
                                  }
                                  return (
                                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-800 dark:bg-white/10 dark:text-slate-200" {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                pre: ({ children }: any) => <>{children}</>,
                                blockquote: ({ node, ...props }) => (
                                  <blockquote className="my-2 pl-3.5 border-l-2 border-slate-300 dark:border-white/20 italic text-slate-600 dark:text-slate-400" {...props} />
                                ),
                              }}
                            >
                              {formattedContent}
                            </ReactMarkdown>
                            {msg.isStreaming && <StreamingMistIndicator />}
                          </MathJax>
                          {msg.isStreaming && (
                            <div className="relative mt-2 h-3.5 w-full overflow-hidden pointer-events-none rounded-full">
                              <div className="mist-bottom-wave absolute inset-0 bg-gradient-to-r from-transparent via-slate-400/25 dark:via-white/20 to-transparent blur-[3px]" />
                            </div>
                          )}
                        </div>

                        {/* Actions below AI response - Black labels without bg */}
                        {!msg.isStreaming && (
                          <div className="mt-3 flex flex-wrap items-center gap-4">
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:opacity-70 active:scale-95 transition-opacity"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={14} className="text-black dark:text-white" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => addNote(msg.text, msg.id)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:opacity-70 active:scale-95 transition-opacity"
                              title="Save to dashboard"
                            >
                              {savedNoteMsgId === msg.id ? (
                                <>
                                  <Check size={14} className="text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                                  <span className="text-emerald-600 dark:text-emerald-400">Saved Note</span>
                                </>
                              ) : (
                                <>
                                  <Pin size={14} className="text-black dark:text-white" />
                                  <span>Save Note</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDownloadAnswerPdf(msg)}
                              className="flex items-center gap-1.5 text-xs font-semibold text-black dark:text-white hover:opacity-70 active:scale-95 transition-opacity"
                              title="Download this answer as PDF"
                            >
                              <Download size={14} className="text-black dark:text-white" />
                              <span>Download PDF</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Thinking state */}
              {isThinking && <ThinkingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* INPUT BAR */}
        <footer className="p-4 sm:p-5 bg-gradient-to-t from-[#fcfcfd] via-[#fcfcfd] dark:from-[#0d0f14] dark:via-[#0d0f14] to-transparent shrink-0">
          {/* Token limit banner */}
          {tokenLimitReached && (
            <div className="max-w-2xl mx-auto mb-3 px-4 py-2 rounded-[9px] bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs font-bold text-red-600 dark:text-red-400 text-center">
              Daily token limit reached (10,000). Your limit resets at midnight.
            </div>
          )}

          <div className="max-w-2xl mx-auto relative">
            {/* Active Grounding Sources Badge */}
            {sources.length > 0 && (
              <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                <span className="text-[10px] font-bold text-slate-400">Sources:</span>
                {sources.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-200/70 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-gray-300"
                  >
                    <span className="truncate max-w-[120px]">{s.title}</span>
                    <button onClick={() => setSources((prev) => prev.filter((item) => item.id !== s.id))}>
                      <Trash2 size={10} className="hover:text-rose-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Mounted WebContainer Project Badge */}
            {mountedProject && (
              <div className="mb-2 flex items-center justify-between gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 px-3 py-1.5 text-xs text-emerald-900 dark:text-emerald-200 shadow-xs">
                <div className="flex items-center gap-2 truncate">
                  <FolderTree size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold truncate">📁 {mountedProject.name}</span>
                  <span className="text-[11px] opacity-75">({mountedProject.fileCount} files mounted in WebContainer)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMountedProject(null)}
                  className="text-emerald-700 dark:text-emerald-400 hover:opacity-75 transition p-0.5"
                  title="Unmount project"
                >
                  <X size={13} />
                </button>
              </div>
            )}

            {/* Input Box - Auto-expanding container */}
            <div className="relative flex items-end gap-2 rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151820] px-2.5 py-1.5 shadow-lg shadow-black/5 focus-within:border-slate-400 dark:focus-within:border-white/30 transition-all">
              {/* Left + Button for Sources/Attachments */}
              <div className="relative mb-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMenu(!showAddMenu);
                    setShowSubjectPicker(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-gray-300 transition-colors"
                  title="Add source material"
                  aria-label="Add source"
                >
                  <Plus size={18} />
                </button>

                <AnimatePresence>
                  {showAddMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-full left-0 mb-3 w-56 rounded-[9px] bg-white dark:bg-[#1c1f26] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden z-50 p-1.5 text-left"
                    >
                      <button
                        onClick={() => {
                          setActiveModal('course');
                          setShowAddMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-[9px] hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-gray-200 transition-colors"
                      >
                        <GraduationCap size={16} className="text-violet-500" />
                        <span>Course Syllabus</span>
                      </button>

                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-[9px] hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-gray-200 transition-colors"
                      >
                        <Upload size={16} className="text-blue-500" />
                        <span>Upload File (DOCX, TXT)</span>
                      </button>

                      <button
                        onClick={() => {
                          handleImportFolderPicker();
                          setShowAddMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-[9px] hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-gray-200 transition-colors"
                      >
                        <FolderOpen size={16} className="text-emerald-500" />
                        <span>Import Project Folder</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveModal('text');
                          setShowAddMenu(false);
                        }}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-[9px] hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-bold text-slate-700 dark:text-gray-200 transition-colors"
                      >
                        <Type size={16} className="text-amber-500" />
                        <span>Paste Notes</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt,.md,.json,.csv,.docx"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={folderInputRef}
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      // Handled via fallback file list
                      const folderName = files[0]?.webkitRelativePath?.split('/')[0] || 'project';
                      setMountedProject({ name: folderName, fileCount: files.length });
                    }
                  }}
                  {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
                  className="hidden"
                />
              </div>

              {/* Subject reference picker */}
              <div className="relative mb-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubjectPicker((open) => !open);
                    setShowAddMenu(false);
                  }}
                  disabled={tokenLimitReached}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:opacity-40 ${
                    showSubjectPicker
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-300'
                  }`}
                  title="Refer to subject"
                  aria-label="Refer to subject"
                >
                  <GraduationCap size={18} />
                </button>

                <AnimatePresence>
                  {showSubjectPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 10 }}
                      className="absolute bottom-full left-0 mb-3 w-[min(360px,calc(100vw-2rem))] -translate-x-12 rounded-[10px] border border-slate-200 bg-white p-3 text-left shadow-2xl dark:border-white/10 dark:bg-[#1c1f26] z-50 sm:translate-x-0"
                    >
                      <div className="relative mb-2">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={subjectPickerQuery}
                          onChange={(e) => setSubjectPickerQuery(e.target.value)}
                          placeholder="Search subjects..."
                          className="h-9 w-full rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 dark:border-white/10 dark:bg-[#12141a] dark:text-white"
                          autoFocus
                        />
                      </div>

                      <div className="max-h-44 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                        {filteredSubjectReferences.map((item) => {
                          const selected = item.id === selectedSubjectReferenceId;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => {
                                setSelectedSubjectReferenceId(item.id);
                                setSelectedLearningOutcome('');
                              }}
                              className={`w-full rounded-[8px] px-3 py-2 text-left transition-colors ${
                                selected
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                  : 'hover:bg-slate-100 text-slate-800 dark:text-slate-100 dark:hover:bg-white/10'
                              }`}
                            >
                              <span className="block truncate text-xs font-bold">{item.subject.name}</span>
                              <span className={`block truncate text-[10px] ${selected ? 'text-white/75 dark:text-slate-600' : 'text-slate-400'}`}>
                                {item.level.name} • {item.level.category}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedSubjectReference && (
                        <div className="mt-3 border-t border-slate-200 pt-3 dark:border-white/10">
                          <p className="mb-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            Optional learning outcome
                          </p>
                          {selectedSubjectReference.subject.outcomes?.length ? (
                            <div className="max-h-28 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                              {selectedSubjectReference.subject.outcomes.map((outcome) => (
                                <button
                                  key={outcome}
                                  type="button"
                                  onClick={() => setSelectedLearningOutcome(outcome)}
                                  className={`w-full rounded-[8px] px-3 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                                    selectedLearningOutcome === outcome
                                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10'
                                  }`}
                                >
                                  {outcome}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <input
                              value={selectedLearningOutcome}
                              onChange={(e) => setSelectedLearningOutcome(e.target.value)}
                              placeholder="Type a learning outcome if needed"
                              className="h-9 w-full rounded-[8px] border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-900 outline-none focus:border-slate-400 dark:border-white/10 dark:bg-[#12141a] dark:text-white"
                            />
                          )}
                          <div className="mt-3 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setShowSubjectPicker(false);
                                setSubjectPickerQuery('');
                                setSelectedSubjectReferenceId(null);
                                setSelectedLearningOutcome('');
                              }}
                              className="rounded-[8px] px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddSubjectReference}
                              className="rounded-[8px] bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:opacity-90 dark:bg-white dark:text-slate-900"
                            >
                              Use as context
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input field - Auto-expanding Textarea */}
              <textarea
                ref={chatInputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  adjustInputHeight();
                }}
                onPaste={() => {
                  setTimeout(adjustInputHeight, 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                    if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                  }
                }}
                placeholder={
                  tokenLimitReached
                    ? 'Daily limit reached — resets at midnight…'
                    : aiProvider === 'gemini'
                    ? 'Message Sidemann (Gemini 3.6)…'
                    : 'Message Sidemann (Groq)…'
                }
                disabled={tokenLimitReached}
                className="flex-1 max-h-[220px] min-h-[38px] resize-none bg-transparent px-2 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500 outline-none border-none ring-0 focus:outline-none focus:ring-0 disabled:opacity-50 custom-scrollbar leading-relaxed"
              />

              {/* Voice input */}
              <button
                type="button"
                onClick={startListening}
                disabled={tokenLimitReached}
                className={`mb-0.5 flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                } disabled:opacity-40`}
                title="Voice input"
                aria-label="Voice input"
              >
                <Mic size={18} />
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => {
                  handleSend();
                  if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                }}
                disabled={!input.trim() || isThinking || tokenLimitReached}
                className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 shadow-sm"
                title="Send message"
                aria-label="Send"
              >
                <ArrowUp size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </footer>

        {/* MODAL: Paste Text Source */}
        {activeModal === 'text' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-[9px] bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Add Text / Notes Source</h3>
              <input
                type="text"
                placeholder="Source Title (e.g. History Notes Chapter 3)"
                value={tempSourceTitle}
                onChange={(e) => setTempSourceTitle(e.target.value)}
                className="w-full rounded-[9px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12141a] px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-slate-400"
              />
              <textarea
                placeholder="Paste study material or notes here..."
                value={tempSourceContent}
                onChange={(e) => setTempSourceContent(e.target.value)}
                rows={6}
                className="w-full rounded-[9px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12141a] p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-slate-400"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-[9px] border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTextSource}
                  disabled={!tempSourceTitle.trim() || !tempSourceContent.trim()}
                  className="rounded-[9px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold hover:opacity-90 disabled:opacity-50"
                >
                  Add Source
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Course Content Selection */}
        {activeModal === 'course' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-[9px] bg-white dark:bg-[#1a1d24] border border-slate-200 dark:border-white/10 p-5 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Select Syllabus Topic</h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Level / Category</label>
                  <select
                    value={selectedCourse || ''}
                    onChange={(e) => {
                      const course = CURRICULUM_REGISTRY.find((c) => c.name === e.target.value);
                      setSelectedCourse(e.target.value);
                      setSelectedCategory(course?.category || null);
                      setSelectedSubject(null);
                      setSelectedTopic(null);
                    }}
                    className="w-full rounded-[9px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12141a] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                  >
                    <option value="">Select Level</option>
                    {CURRICULUM_REGISTRY.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Subject</label>
                    <select
                      value={selectedSubject || ''}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedTopic(null);
                      }}
                      className="w-full rounded-[9px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12141a] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    >
                      <option value="">Select Subject</option>
                      {CURRICULUM_REGISTRY.find((c) => c.name === selectedCourse)?.subjects.map((s) => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedSubject && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Topic</label>
                    <input
                      type="text"
                      placeholder="Enter topic name (e.g. Osmosis, Trig)"
                      value={selectedTopic || ''}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full rounded-[9px] border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#12141a] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-[9px] border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCourseSource}
                  disabled={!selectedCourse || !selectedSubject || !selectedTopic}
                  className="rounded-[9px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 text-xs font-bold hover:opacity-90 disabled:opacity-50"
                >
                  Add Topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar: Live Code Runner */}
      {activeRunner && !isRunnerFullScreen && (
        <aside className="fixed inset-0 z-40 flex h-screen w-full shrink-0 flex-col border-l border-slate-200 bg-white p-2.5 sm:p-3 shadow-2xl transition-all md:relative md:inset-auto md:z-20 md:w-[480px] lg:w-[580px] xl:w-[660px] dark:border-white/10 dark:bg-[#0d1117]">
          <LiveCodeRunnerPanel
            code={activeRunner.code}
            language={activeRunner.language}
            isFullScreen={false}
            onToggleFullScreen={() => setIsRunnerFullScreen(true)}
            onClose={() => setActiveRunner(null)}
          />
        </aside>
      )}

      {/* Full Screen Overlay for Live Code Runner */}
      {activeRunner && isRunnerFullScreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-[#0d1117] p-2 sm:p-4">
          <LiveCodeRunnerPanel
            code={activeRunner.code}
            language={activeRunner.language}
            isFullScreen={true}
            onToggleFullScreen={() => setIsRunnerFullScreen(false)}
            onClose={() => {
              setIsRunnerFullScreen(false);
              setActiveRunner(null);
            }}
          />
        </div>
      )}
    </div>
  </MathJaxContext>
  );
};

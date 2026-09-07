import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Terminal as TerminalIcon, FileText, Folder, Moon, Sun, X, Save, Maximize2, MonitorPlay, ChevronLeft, ChevronRight, Home, Search, Menu, Clock, Star, Monitor, Download, Music, Image as LucideImage, Video, Trash2, Send, Bot, User, TerminalSquare, ChevronUp, ChevronDown, Play, Loader2, BookOpen } from 'lucide-react';
import { TeachMeLaunchButton } from '../shared/TeachMeLaunchButton';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';
SyntaxHighlighter.registerLanguage('bash', bash);

const limeDarkStyle = {
  ...vs2015,
  'hljs': {
    ...vs2015['hljs'],
    background: '#050505',
    color: '#39ff14'
  }
};

const customAiStyles = `
.ai-linux-input-container { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; box-sizing: border-box; }
.ai-linux-input { background-color: #010201; border: 1px solid rgba(57, 255, 20, 0.4); width: 100%; height: 58px; border-radius: 14px; color: #39ff14; padding-inline: 18px 64px; font-size: 15px; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; transition: all 0.3s ease; }
.ai-linux-input:focus { outline: none; box-shadow: 0 0 15px rgba(57, 255, 20, 0.4), inset 0 0 10px rgba(57, 255, 20, 0.1); border-color: #39ff14; }
.ai-linux-input::placeholder { color: rgba(57, 255, 20, 0.5); }
.glow-effect-lime { position: absolute; overflow: hidden; z-index: -1; border-radius: 8px; filter: blur(5px); height: 100%; width: 100%; background: linear-gradient(90deg, rgba(57,255,20,0.1), rgba(0,0,0,0.8), rgba(57,255,20,0.1)); background-size: 200% 200%; border: 1px solid #39ff14; }
.cyber-scroll::-webkit-scrollbar { width: 6px; }
.cyber-scroll::-webkit-scrollbar-track { background: #000; border-radius: 3px; }
.cyber-scroll::-webkit-scrollbar-thumb { background: rgba(57, 255, 20, 0.3); border-radius: 3px; }
.cyber-scroll::-webkit-scrollbar-thumb:hover { background: rgba(57, 255, 20, 0.5); }
.chat-text { font-family: Arial, Helvetica, sans-serif; }
`;
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GROQ_MODELS, groqReasoningParams } from '../../../../services/groq';

interface FileNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  children?: Record<string, FileNode>;
  hidden?: boolean;
}

const initialFileSystem: Record<string, FileNode> = {
  '~': {
    name: '~',
    type: 'dir',
    children: {
      'Desktop': { name: 'Desktop', type: 'dir', children: {} },
      'Documents': { name: 'Documents', type: 'dir', children: {} },
      'Downloads': { name: 'Downloads', type: 'dir', children: {} },
      'Music': { name: 'Music', type: 'dir', children: {} },
      'Pictures': { name: 'Pictures', type: 'dir', children: {} },
      'Videos': { name: 'Videos', type: 'dir', children: {} }
    }
  },
  '/': {
    name: '/',
    type: 'dir',
    children: {
      'etc': {
        name: 'etc',
        type: 'dir',
        children: {
          'passwd': {
            name: 'passwd',
            type: 'file',
            content: 'root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:Kali,,:/home/kali:/bin/bash\n'
          }
        }
      },
      'bin': {
        name: 'bin',
        type: 'dir',
        children: {}
      },
      'home': {
        name: 'home',
        type: 'dir',
        children: {
          'kali': {
            name: 'kali',
            type: 'dir',
            children: {} // mapped to ~ in getDir
          }
        }
      }
    }
  }
};

interface TerminalHistoryItem {
  id: number;
  command: string;
  output: string | React.ReactNode;
  cwd?: string;
  user?: string;
  hostname?: string;
  hidePrompt?: boolean;
  customPrompt?: string;
}

export const LinuxTerminal: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(true);
  const [history, setHistory] = useState<TerminalHistoryItem[]>([]);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [lastCwd, setLastCwd] = useState('~');
  const [user, setUser] = useState('kali');
  const [hostname, setHostname] = useState('kali');
  
  // Drag, Drop, Context Menu State
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, node: {name: string, type: 'dir'|'file'} | null, path: string} | null>(null);
  const [clipboard, setClipboard] = useState<{action: 'copy'|'cut', path: string, name: string} | null>(null);
  const [renamingNode, setRenamingNode] = useState<{name: string, path: string} | null>(null);
  const [renamingInput, setRenamingInput] = useState('');

  const [fileSystem, setFileSystem] = useState<Record<string, FileNode>>(() => {
    const saved = localStorage.getItem('kali_fs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return initialFileSystem;
  });

  useEffect(() => {
    localStorage.setItem('kali_fs', JSON.stringify(fileSystem));
  }, [fileSystem]);
  
  // Interactive state
  const [promptState, setPromptState] = useState<'NORMAL' | 'NANO' | 'ADDUSER_PASS' | 'ADDUSER_PASS_CONFIRM' | 'ADDUSER_FULLNAME' | 'ADDUSER_ROOM' | 'ADDUSER_WORKPHONE' | 'ADDUSER_HOMEPHONE' | 'ADDUSER_OTHER' | 'ADDUSER_CONFIRM' | 'SUDO_PASS'>('NORMAL');
  const [tempState, setTempState] = useState<any>({});
  const [nanoContent, setNanoContent] = useState('');

  // GUI state
  const [guiCwd, setGuiCwd] = useState('~');
  const [guiHistory, setGuiHistory] = useState<string[]>(['~']);
  const [guiSearch, setGuiSearch] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<{path: string, name: string} | null>(null);
  const [openFiles, setOpenFiles] = useState<{name: string, content: string, path: string}[]>([]);

  // Shared z-index counter so whichever window is touched last renders on top
  const zCounterRef = useRef(20);

  // Terminal window state (floating window inside the Desktop pane)
  const [terminalWindow, setTerminalWindow] = useState<{
    isOpen: boolean; isMaximized: boolean; isMinimized: boolean;
    x: number; y: number; width: number; height: number; zIndex: number;
    origin: { x: number; y: number } | null;
  }>({
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 60,
    y: 40,
    width: 680,
    height: 440,
    zIndex: 20,
    origin: null,
  });
  const [winDrag, setWinDrag] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [winResize, setWinResize] = useState<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const bringTerminalToFront = () => {
    zCounterRef.current += 1;
    setTerminalWindow(w => ({ ...w, zIndex: zCounterRef.current }));
  };

  const openTerminalWindow = (origin?: { x: number; y: number }) => {
    zCounterRef.current += 1;
    setTerminalWindow(w => ({ ...w, isOpen: true, isMinimized: false, zIndex: zCounterRef.current, origin: origin ?? w.origin }));
  };
  const closeTerminalWindow = () => {
    const target = getRelativeCenter(dockTerminalIconRef);
    setTerminalWindow(w => ({ ...w, origin: target }));
    requestAnimationFrame(() => setTerminalWindow(w => ({ ...w, isOpen: false })));
  };
  const minimizeTerminalWindow = () => {
    const target = getRelativeCenter(dockTerminalIconRef);
    setTerminalWindow(w => ({ ...w, origin: target }));
    requestAnimationFrame(() => setTerminalWindow(w => ({ ...w, isMinimized: true })));
  };
  const toggleMaximizeTerminal = () => setTerminalWindow(w => ({ ...w, isMaximized: !w.isMaximized, isMinimized: false }));

  const handleWinTitlePointerDown = (e: React.PointerEvent) => {
    bringTerminalToFront();
    if ((e.target as HTMLElement).closest('button')) return; // let control buttons fire their own click
    if (terminalWindow.isMaximized) return;
    setWinDrag({ startX: e.clientX, startY: e.clientY, origX: terminalWindow.x, origY: terminalWindow.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleWinResizePointerDown = (e: React.PointerEvent) => {
    if (terminalWindow.isMaximized) return;
    e.stopPropagation();
    setWinResize({ startX: e.clientX, startY: e.clientY, origW: terminalWindow.width, origH: terminalWindow.height });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // File Manager window state — same floating-window pattern as the Terminal
  const [fileManagerWindow, setFileManagerWindow] = useState<{
    isOpen: boolean; isMaximized: boolean; isMinimized: boolean;
    x: number; y: number; width: number; height: number; zIndex: number;
    origin: { x: number; y: number } | null;
  }>({
    isOpen: false,
    isMaximized: false,
    isMinimized: false,
    x: 100,
    y: 70,
    width: 720,
    height: 460,
    zIndex: 20,
    origin: null,
  });
  const [fmDrag, setFmDrag] = useState<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [fmResize, setFmResize] = useState<{ startX: number; startY: number; origW: number; origH: number } | null>(null);

  const bringFmToFront = () => {
    zCounterRef.current += 1;
    setFileManagerWindow(w => ({ ...w, zIndex: zCounterRef.current }));
  };

  const openFileManager = (path?: string, origin?: { x: number; y: number }) => {
    if (path) navigateToGui(path);
    zCounterRef.current += 1;
    setFileManagerWindow(w => ({ ...w, isOpen: true, isMinimized: false, zIndex: zCounterRef.current, origin: origin ?? w.origin }));
  };
  const closeFileManager = () => {
    const target = getRelativeCenter(dockFilesIconRef);
    setFileManagerWindow(w => ({ ...w, origin: target }));
    requestAnimationFrame(() => setFileManagerWindow(w => ({ ...w, isOpen: false })));
  };
  const minimizeFileManager = () => {
    const target = getRelativeCenter(dockFilesIconRef);
    setFileManagerWindow(w => ({ ...w, origin: target }));
    requestAnimationFrame(() => setFileManagerWindow(w => ({ ...w, isMinimized: true })));
  };
  const toggleMaximizeFileManager = () => setFileManagerWindow(w => ({ ...w, isMaximized: !w.isMaximized, isMinimized: false }));

  const handleFmTitlePointerDown = (e: React.PointerEvent) => {
    bringFmToFront();
    if ((e.target as HTMLElement).closest('button')) return; // let control buttons fire their own click
    if (fileManagerWindow.isMaximized) return;
    setFmDrag({ startX: e.clientX, startY: e.clientY, origX: fileManagerWindow.x, origY: fileManagerWindow.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleFmResizePointerDown = (e: React.PointerEvent) => {
    if (fileManagerWindow.isMaximized) return;
    e.stopPropagation();
    setFmResize({ startX: e.clientX, startY: e.clientY, origW: fileManagerWindow.width, origH: fileManagerWindow.height });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // AI Chat State
  const [autoRunCommands, setAutoRunCommands] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'ai' | 'examPrep'>('ai');
  const [aiMessages, setAiMessages] = useState<{role: string; content: string}[]>([
    {role: "assistant", content: "Hi! I am your AI Kali Linux Assistant. Ask me how to use tools, and I can generate or run commands for you."}
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiChatExpanded, setIsAiChatExpanded] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'desktop' | 'chat'>('desktop');
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const aiEndOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    aiEndOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages, isAiChatExpanded]);

  useEffect(() => {
    const updateLayoutMode = () => setIsMobileLayout(window.innerWidth < 768);
    updateLayoutMode();
    window.addEventListener('resize', updateLayoutMode);
    return () => window.removeEventListener('resize', updateLayoutMode);
  }, []);
  
  // Auto-run effect
  const [lastExecutedMessageIndex, setLastExecutedMessageIndex] = useState(-1);
  useEffect(() => {
     if (autoRunCommands && aiMessages.length > 0) {
         const lastMsg = aiMessages[aiMessages.length - 1];
         if (lastMsg.role === 'assistant' && aiMessages.length - 1 > lastExecutedMessageIndex) {
             const codeMatch = lastMsg.content.match(/\`\`\`(?:[a-zA-Z]*)\n([\s\S]*?)\`\`\`/);
             if (codeMatch) {
                 const code = codeMatch[1].trim();
                 handleAiRunCommand(code);
             }
             setLastExecutedMessageIndex(aiMessages.length - 1);
         }
     }
  }, [aiMessages, autoRunCommands, lastExecutedMessageIndex]);
  

  const handleAiSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!aiInput.trim()) return;

    const newMsg = { role: "user", content: aiInput };
    setAiMessages(prev => [...prev, newMsg]);
    setAiInput("");
    setIsAiLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setAiMessages(prev => [...prev, { role: "assistant", content: "Please configure VITE_GROQ_API_KEY in your environment." }]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt = `You are an expert Kali Linux and cybersecurity tutor. Help the user learn Linux commands, tools, and security concepts.
If the user greets you, thanks you, jokes casually, or asks a normal non-command question, respond naturally and briefly. Do not force a command or lesson unless they ask for one.
If the user's intent is unclear, ask one short clarifying question.
Keep your explanations concise.
If providing a command that the user can execute, place it inside a \`\`\`bash ... \`\`\` block.
Example:
\`\`\`bash
ls -la
\`\`\``;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: GROQ_MODELS[0],
          ...groqReasoningParams(GROQ_MODELS[0]),
          messages: [
            { role: "system", content: systemPrompt },
            ...aiMessages.map(m => ({ role: m.role, content: typeof m.content === 'string' ? m.content : '' })),
            newMsg
          ],
          temperature: 0.7 })
      });
      const data = await response.json();
      if (!data.error && data.choices && data.choices[0]) {
        setAiMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      } else {
        setAiMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error?.message || "Failed"}` }]);
      }
    } catch(err: any) {
        setAiMessages(prev => [...prev, { role: "assistant", content: `Error: ${err.message}` }]);
    } finally {
        setIsAiLoading(false);
    }
  };

  const handleAiRunCommand = (cmd: string) => {
      const cleanCmd = cmd.replace(/^\s*\$\s+/gm, '').replace(/^\`\`\`.*\n?/gm, '').replace(/\`\`\`/g, '').trim();
      executeCommand(cleanCmd);
  };

  
  const renderAiMessage = (content: string, isDark: boolean) => {
    const parts = content.split(/(\`\`\`[\s\S]*?\n[\s\S]*?\`\`\`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/\`\`\`(?:[a-zA-Z]*)\n([\s\S]*?)\`\`\`/);
        const code = match ? match[1].trim() : part.replace(/\`\`\`/g, '').trim();
        return (
          <div key={index} className={`my-3 border rounded-md overflow-hidden ${isDark ? 'bg-[#1e1e1e] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`flex justify-between items-center px-3 py-2 ${isDark ? 'bg-[#252525] border-b border-[#333]' : 'bg-gray-100 border-b border-gray-200'}`}>
              <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff7400]/100"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              {!autoRunCommands && (
                  <button 
                    onClick={() => handleAiRunCommand(code)}
                    className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded transition-all ${isDark ? 'bg-[#333] hover:bg-[#444] text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    <Play className="w-2.5 h-2.5" /> Run
                  </button>
              )}
            </div>
            <div className="p-3 overflow-x-auto text-sm cyber-scroll">
              <SyntaxHighlighter
                   style={limeDarkStyle as any}
                   customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                   language="bash"
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }
      // Handle normal code backticks
      return <span key={index} className="whitespace-pre-wrap">{
          part.split(/(\`[^\`]+\`)/g).map((subPart, i) => {
              if (subPart.startsWith('`') && subPart.endsWith('`')) {
                  return <code key={i} className={`px-1.5 py-0.5 rounded text-[13px] ${isDark ? 'bg-[#2a2a2a] text-green-400' : 'bg-gray-200 text-green-600'} font-mono`}>{subPart.slice(1, -1)}</code>;
              }
              return subPart;
          })
      }</span>;
    });
  };

  const navigateToGui = (path: string) => {
    setGuiHistory(prev => [...prev, path]);
    setGuiCwd(path);
  };


  // Split layout state — only one divider now: Desktop pane vs AI Chat pane
  const [aiSplitRatio, setAiSplitRatio] = useState(28);
  const [isAiDragging, setIsAiDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs to icons so windows can fly to/from their actual on-screen position
  const desktopTerminalIconRef = useRef<HTMLDivElement>(null);
  const desktopHomeIconRef = useRef<HTMLDivElement>(null);
  const dockTerminalIconRef = useRef<HTMLButtonElement>(null);
  const dockFilesIconRef = useRef<HTMLButtonElement>(null);

  const getRelativeCenter = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
    if (!ref.current || !containerRef.current) return { x: 0, y: 0 };
    const r = ref.current.getBoundingClientRect();
    const c = containerRef.current.getBoundingClientRect();
    return { x: r.left + r.width / 2 - c.left, y: r.top + r.height / 2 - c.top };
  };

  const getWindowCenter = (win: { x: number; y: number; width: number; height: number; isMaximized: boolean }) => {
    if (win.isMaximized && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      return { x: (rect.width - 16) / 2 + 8, y: (rect.height - 16) / 2 + 8 };
    }
    return { x: win.x + win.width / 2, y: win.y + win.height / 2 };
  };

  const handleAiPointerDown = (e: React.PointerEvent) => {
    setIsAiDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const { top, left, width } = containerRef.current.getBoundingClientRect();

    if (isAiDragging) {
      if (window.innerWidth < 768) return;
      let newRatio = ((width - (e.clientX - left)) / width) * 100;
      newRatio = Math.max(15, Math.min(45, newRatio));
      setAiSplitRatio(newRatio);
      return;
    }

    // Terminal window drag
    if (winDrag) {
      const dx = e.clientX - winDrag.startX;
      const dy = e.clientY - winDrag.startY;
      const maxX = width - 100;
      const maxY = (containerRef.current.getBoundingClientRect().height) - 60;
      setTerminalWindow(w => ({
        ...w,
        x: Math.max(0, Math.min(maxX, winDrag.origX + dx)),
        y: Math.max(0, Math.min(maxY, winDrag.origY + dy)),
      }));
      return;
    }

    // Terminal window resize
    if (winResize) {
      const dx = e.clientX - winResize.startX;
      const dy = e.clientY - winResize.startY;
      setTerminalWindow(w => ({
        ...w,
        width: Math.max(360, winResize.origW + dx),
        height: Math.max(240, winResize.origH + dy),
      }));
      return;
    }

    // File Manager window drag
    if (fmDrag) {
      const dx = e.clientX - fmDrag.startX;
      const dy = e.clientY - fmDrag.startY;
      const maxX = width - 100;
      const maxY = containerRef.current.getBoundingClientRect().height - 60;
      setFileManagerWindow(w => ({
        ...w,
        x: Math.max(0, Math.min(maxX, fmDrag.origX + dx)),
        y: Math.max(0, Math.min(maxY, fmDrag.origY + dy)),
      }));
      return;
    }

    // File Manager window resize
    if (fmResize) {
      const dx = e.clientX - fmResize.startX;
      const dy = e.clientY - fmResize.startY;
      setFileManagerWindow(w => ({
        ...w,
        width: Math.max(420, fmResize.origW + dx),
        height: Math.max(280, fmResize.origH + dy),
      }));
      return;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsAiDragging(false);
    setWinDrag(null);
    setWinResize(null);
    setFmDrag(null);
    setFmResize(null);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) {}
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const nanoRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (terminalRef.current && promptState !== 'NANO') {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    if (promptState === 'NANO' && nanoRef.current) {
      nanoRef.current.focus();
    }
  }, [history, promptState]);

  useEffect(() => {
    // Keep GUI cwd synced with Terminal cwd whenever it changes
    setGuiCwd(cwd);
  }, [cwd]);

  const addHistory = (command: string, output: string | React.ReactNode, currentCwd = cwd, currentUser = user, currentHostname = hostname, hidePrompt = false, customPrompt = '') => {
    if (command === 'clear') {
      setHistory([]);
      return;
    }
    setHistory(prev => [...prev, { id: Date.now(), command, output, cwd: currentCwd, user: currentUser, hostname: currentHostname, hidePrompt, customPrompt }]);
  };

  const updateFileContent = (path: string, filename: string, content: string) => {
    const newFs = { ...fileSystem };
    const dir = getDir(path, newFs);
    if (dir && dir.children) {
      if (!dir.children[filename]) {
        dir.children[filename] = { name: filename, type: 'file', content };
      } else {
        dir.children[filename].content = content;
      }
      setFileSystem(newFs);
      
      // Update open GUI files
      setOpenFiles(prev => prev.map(f => f.name === filename ? {...f, content} : f));
    }
  };

  const getDir = (path: string, fsState: Record<string, FileNode>): FileNode | null => {
    let normalizedPath = path;
    if (normalizedPath.startsWith('/home/kali/')) {
        normalizedPath = '~/' + normalizedPath.substring('/home/kali/'.length);
    } else if (normalizedPath === '/home/kali') {
        normalizedPath = '~';
    }

    if (normalizedPath === '~') return fsState['~'];
    if (normalizedPath === '/') return fsState['/'];

    if (normalizedPath.startsWith('/')) {
        const parts = normalizedPath.split('/').filter(p => p);
        let curr = fsState['/'];
        for(let p of parts) {
           if (curr && curr.children && curr.children[p]) {
               curr = curr.children[p];
           } else {
               return null;
           }
        }
        return curr;
    }
    
    if (normalizedPath.startsWith('~/')) {
       const parts = normalizedPath.substring(2).split('/').filter(p => p);
       let curr = fsState['~'];
       for(let p of parts) {
           if (curr && curr.children && curr.children[p]) {
               curr = curr.children[p];
           } else {
               return null;
           }
       }
       return curr;
    }

    return null;
  };

  // FS Operation Helpers
  const handleDropOnSidebar = (e: any, targetFolder: string) => {
    e.preventDefault();
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (data && data.path && data.name) {
            pasteNode(targetFolder, {action: 'cut', path: data.path, name: data.name});
        }
    } catch(err) {}
  };

  const deleteNode = (path: string, name: string) => {
    const newFs = { ...fileSystem };
    const dir = getDir(path, newFs);
    if (dir && dir.children && dir.children[name]) {
      delete dir.children[name];
      setFileSystem(newFs);
    }
  };

  const pasteNode = (targetPath: string, overrideClipboard?: {action: 'copy'|'cut', path: string, name: string}) => {
    const clip = overrideClipboard || clipboard;
    if (!clip) return;
    const newFs = { ...fileSystem };
    const sourceDir = getDir(clip.path, newFs);
    const targetDir = getDir(targetPath, newFs);

    if (sourceDir && sourceDir.children && sourceDir.children[clip.name] && targetDir && targetDir.children) {
      if (targetDir.children[clip.name]) {
         alert('File or folder already exists');
         return;
      }
      
      const nodeToMove = sourceDir.children[clip.name];
      // deep copy
      const copyNode = JSON.parse(JSON.stringify(nodeToMove));
      targetDir.children[clip.name] = copyNode;

      if (clip.action === 'cut') {
        delete sourceDir.children[clip.name];
        setClipboard(null);
      }
      setFileSystem(newFs);
    }
  };

  const performRename = () => {
    if (!renamingNode || !renamingInput.trim()) return;
    const newFs = { ...fileSystem };
    const dir = getDir(renamingNode.path, newFs);
    if (dir && dir.children && dir.children[renamingNode.name]) {
      if (dir.children[renamingInput] && renamingInput !== renamingNode.name) {
         alert('Name already exists');
         return;
      }
      const node = dir.children[renamingNode.name];
      node.name = renamingInput;
      delete dir.children[renamingNode.name];
      dir.children[renamingInput] = node;
      setFileSystem(newFs);
    }
    setRenamingNode(null);
    setRenamingInput('');
  };

  const createNewNode = (path: string, type: 'file' | 'dir', baseName: string) => {
    const newFs = { ...fileSystem };
    const dir = getDir(path, newFs);
    if (dir && dir.children) {
      let name = baseName;
      let counter = 1;
      while (dir.children[name]) {
        if (type === 'file') {
          const parts = baseName.split('.');
          const ext = parts.pop();
          name = `${parts.join('.')}_${counter}.${ext}`;
        } else {
          name = `${baseName}_${counter}`;
        }
        counter++;
      }
      dir.children[name] = { 
        name, 
        type, 
        ...(type === 'file' ? { content: '' } : { children: {} }) 
      };
      setFileSystem(newFs);
      
      // Auto-rename the newly created item
      setRenamingNode({ name, path });
      setRenamingInput(name);
    }
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'c' && e.ctrlKey) {
      addHistory(input + '^C', '', cwd, user, hostname);
      setInput('');
      setPromptState('NORMAL');
      setHistoryIndex(-1);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIndex = historyIndex + 1;
        if (nextIndex < cmdHistory.length) {
          const cmd = cmdHistory[cmdHistory.length - 1 - nextIndex];
          setHistoryIndex(nextIndex);
          setInput(cmd);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        const cmd = cmdHistory[cmdHistory.length - 1 - nextIndex];
        setHistoryIndex(nextIndex);
        setInput(cmd);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }

    if (e.key === 'Enter') {
      const cmd = input;
      setInput('');
      setHistoryIndex(-1);

      if (promptState !== 'NORMAL') {
         handleInteractive(cmd);
         return;
      }

      const trimmed = cmd.trim();
      if (!trimmed) {
        addHistory('', '', cwd, user, hostname);
        return;
      }

      setCmdHistory(prev => [...prev.filter(h => h !== trimmed), trimmed]);
      executeCommand(trimmed);
    }
  };

  const handleInteractive = (cmd: string) => {
     const st = promptState;
     if (st === 'SUDO_PASS') {
        const promptStr = tempState.pendingCmd === 'su' ? `Password: ` : `[sudo] password for ${tempState.user}: `;
        addHistory('', '', tempState.cwd, tempState.user, tempState.hostname, true, promptStr);
        setPromptState('NORMAL');
        if (tempState.pendingCmd) {
           if (tempState.pendingCmd === 'su') {
               setUser('root');
               setCwd('/');
           } else {
               executeCommand(tempState.pendingCmd, true, true); // root execution
           }
        }
     }
     else if (st === 'ADDUSER_PASS') {
         setTempState({...tempState, pass1: cmd});
         setPromptState('ADDUSER_PASS_CONFIRM');
         addHistory('', '', tempState.cwd, tempState.user, tempState.hostname, true, 'New password: ');
     }
     else if (st === 'ADDUSER_PASS_CONFIRM') {
         if (cmd !== tempState.pass1) {
             addHistory('', 'Sorry, passwords do not match.\npasswd: Authentication token manipulation error\nadduser: password not set', tempState.cwd, tempState.user, tempState.hostname, true, 'Retype new password: ');
             setPromptState('NORMAL');
             return;
         }
         addHistory('', 'passwd: password updated successfully\nChanging the user information for ' + tempState.username + '\nEnter the new value, or press ENTER for the default', tempState.cwd, tempState.user, tempState.hostname, true, 'Retype new password: ');
         setPromptState('ADDUSER_FULLNAME');
     }
     else if (st === 'ADDUSER_FULLNAME') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, '        Full Name []: ');
         setPromptState('ADDUSER_ROOM');
     }
     else if (st === 'ADDUSER_ROOM') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, '        Room Number []: ');
         setPromptState('ADDUSER_WORKPHONE');
     }
     else if (st === 'ADDUSER_WORKPHONE') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, '        Work Phone []: ');
         setPromptState('ADDUSER_HOMEPHONE');
     }
     else if (st === 'ADDUSER_HOMEPHONE') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, '        Home Phone []: ');
         setPromptState('ADDUSER_OTHER');
     }
     else if (st === 'ADDUSER_OTHER') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, '        Other []: ');
         setPromptState('ADDUSER_CONFIRM');
     }
     else if (st === 'ADDUSER_CONFIRM') {
         addHistory(cmd, '', tempState.cwd, tempState.user, tempState.hostname, true, 'Is the information correct? [Y/n] ');
         if (cmd.toLowerCase() === 'y' || cmd === '') {
             // add to passwd
             const newFs = {...fileSystem};
             const passwdFile = newFs['/'].children?.['etc']?.children?.['passwd'];
             if (passwdFile) {
                 passwdFile.content += `\n${tempState.username}:x:1001:1001:${tempState.username},,:/home/${tempState.username}:/bin/bash\n`;
                 setFileSystem(newFs);
             }
             addHistory('', `Account created for ${tempState.username}`, tempState.cwd, tempState.user, tempState.hostname, true, '');
         }
         setPromptState('NORMAL');
     }
  };

  const resolvePath = (target: string, currentPath: string) => {
      let normalizedCurrent = currentPath;
      if (normalizedCurrent === '~') normalizedCurrent = '/home/kali';
      else if (normalizedCurrent.startsWith('~/')) normalizedCurrent = '/home/kali/' + normalizedCurrent.substring(2);
      
      let newPath = target;
      if (target === '~') newPath = '/home/kali';
      else if (target.startsWith('~/')) newPath = '/home/kali/' + target.substring(2);
      else if (!target.startsWith('/')) {
         if (normalizedCurrent === '/') newPath = '/' + target;
         else newPath = normalizedCurrent + '/' + target;
      }

      const parts = newPath.split('/');
      const res: string[] = [];
      for(let p of parts) {
         if(p === '' || p === '.') continue;
         if(p === '..') {
            if(res.length > 0) res.pop();
         } else {
            res.push(p);
         }
      }
      let finalPath = '/' + res.join('/');
      if (finalPath.startsWith('/home/kali/')) finalPath = '~/' + finalPath.substring('/home/kali/'.length);
      else if (finalPath === '/home/kali') finalPath = '~';
      return finalPath;
  };

  const executeCommand = (commandStr: string, isRoot = user === 'root', isHidden = false) => {
    const args = commandStr.split(' ').filter(s => s.length > 0);
    const cmd = args[0];
    const currentCwd = cwd;
    const currentUser = isRoot ? 'root' : user;
    const currentHostname = hostname;

    const out = (output: string) => {
        if (isHidden) {
            if (output) {
                addHistory('', output, currentCwd, currentUser, currentHostname, true, '');
            }
        } else {
            addHistory(commandStr, output, currentCwd, currentUser, currentHostname);
        }
    };

    switch (cmd) {
      case 'pwd':
        out(currentCwd === '~' ? '/home/kali' : currentCwd);
        break;
      case 'ls': {
        const hasA = args.some(a => a.startsWith('-') && a.includes('a'));
        const hasL = args.some(a => a.startsWith('-') && a.includes('l'));
        const hasD = args.some(a => a.startsWith('-') && a.includes('d'));
        const longFormat = hasL || hasD;
        const targetPath = args.slice(1).find(a => !a.startsWith('-')) || currentCwd;
        const resolved = resolvePath(targetPath, currentCwd);
        const dir = getDir(resolved, fileSystem);
        if (!dir || !dir.children) {
            out(`ls: cannot access '${targetPath}': No such file or directory`);
            break;
        }
        
        let output = '';
        Object.values(dir.children).forEach(child => {
           if (!hasA && child.name.startsWith('.')) return;
           if (longFormat) {
              const prefix = child.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--';
              output += `${prefix} 1 ${currentUser} ${currentUser} 4096 May 14 10:00 ${child.name}\n`;
            } else {
              output += child.name + '  ';
            }
        });
        out(output.trim());
        break;
      }
      case 'cd': {
        const target = args[1] || '~';
        if (target === '-') {
            const temp = currentCwd;
            setCwd(lastCwd);
            setLastCwd(temp);
            out(lastCwd === '~' ? '/home/kali' : lastCwd);
            break;
        }
        const newPath = resolvePath(target, currentCwd);
        const dir = getDir(newPath, fileSystem);
        if (dir && dir.type === 'dir') {
            setLastCwd(currentCwd);
            setCwd(newPath);
            out('');
        } else {
            out(`bash: cd: ${target}: No such file or directory`);
        }
        break;
      }
      case 'touch': {
        if (!args[1]) { out('touch: missing file operand'); break; }
        const newFs = { ...fileSystem };
        let created = 0;
        args.slice(1).forEach(filename => {
            const dir = getDir(currentCwd, newFs);
            if (dir && dir.children) {
                if (!dir.children[filename]) {
                    dir.children[filename] = { name: filename, type: 'file', content: '' };
                    created++;
                }
            }
        });
        setFileSystem(newFs);
        if (created > 0) out(`File(s) created successfully: ${args.slice(1).join(', ')}`);
        else out('');
        break;
      }
      case 'mkdir': {
        if (!args[1]) { out('mkdir: missing operand'); break; }
        const newFs = { ...fileSystem };
        let created = 0;
        args.slice(1).forEach(filename => {
            const dir = getDir(currentCwd, newFs);
            if (dir && dir.children) {
                if (!dir.children[filename]) {
                    dir.children[filename] = { name: filename, type: 'dir', children: {} };
                    created++;
                }
            }
        });
        setFileSystem(newFs);
        if (created > 0) out(`Directory created successfully: ${args.slice(1).join(', ')}`);
        else out('');
        break;
      }
      case 'cat': {
        if (!args[1]) { out(''); break; }
        const dir = getDir(currentCwd, fileSystem);
        if (dir && dir.children && dir.children[args[1]] && dir.children[args[1]].type === 'file') {
            out(dir.children[args[1]].content || '');
        } else {
            out(`cat: ${args[1]}: No such file or directory`);
        }
        break;
      }
      case 'nano': {
        if (!args[1]) { out('nano: filename required here'); break; }
        const dir = getDir(currentCwd, fileSystem);
        let content = '';
        if (dir && dir.children && dir.children[args[1]] && dir.children[args[1]].type === 'file') {
             content = dir.children[args[1]].content || '';
        }
        setTempState({ filename: args[1], cwd: currentCwd, user: currentUser, hostname: currentHostname });
        setNanoContent(content);
        setPromptState('NANO');
        break;
      }
      case 'addgroup':
      case 'adduser': {
        if (currentUser !== 'root') {
            out('/usr/sbin/adduser: Only root may add a user or group to the system.');
            break;
        }
        if (!args[1]) {
            out('adduser: Only one or two names allowed.');
            break;
        }
        setTempState({ username: args[1], cwd: currentCwd, user: currentUser, hostname: currentHostname });
        out(`Adding user \`${args[1]}' ...\nAdding new group \`${args[1]}' (1001) ...\nAdding new user \`${args[1]}' (1001) with group \`${args[1]}' ...\nCreating home directory \`/home/${args[1]}' ...\nCopying files from \`/etc/skel' ...`);
        setPromptState('ADDUSER_PASS');
        break;
      }
      case 'rm': {
        if (!args[1]) { out('rm: missing operand'); break; }
        const newFs = { ...fileSystem };
        const dir = getDir(currentCwd, newFs);
        let removed = 0;
        if (dir && dir.children) {
          args.slice(1).forEach(filename => {
             if (dir.children![filename] && dir.children![filename].type === 'file') {
                 delete dir.children![filename];
                 removed++;
             }
          });
          setFileSystem(newFs);
        }
        out(removed > 0 ? `Removed file(s): ${args.slice(1).join(', ')}` : `rm: cannot remove: No such file`);
        break;
      }
      case 'echo': {
        out(args.slice(1).join(' ').replace(/['"]/g, ''));
        break;
      }
      case 'whoami':
        out(currentUser);
        break;
      case 'sudo': {
        if (currentUser === 'root') {
            executeCommand(args.slice(1).join(' '), true);
            break;
        }
        const pCmd = args.slice(1).join(' ');
        setTempState({ pendingCmd: pCmd, cwd: currentCwd, user: currentUser, hostname: currentHostname });
        addHistory(commandStr, '', currentCwd, currentUser, currentHostname);
        setPromptState('SUDO_PASS');
        break;
      }
      case 'su': {
         if (currentUser === 'root' && args[1]) {
             setUser(args[1] === '-' ? 'root' : args[1]);
             setCwd(args[1] === '-' ? '/' : '~');
             out('');
             break;
         }
         addHistory(commandStr, '', currentCwd, currentUser, currentHostname);
         setTempState({ pendingCmd: 'su', cwd: currentCwd, user: currentUser, hostname: currentHostname });
         setPromptState('SUDO_PASS');
         break;
      }
      case 'exit':
         setUser('kali');
         setCwd('~');
         out('logout');
         break;
      case 'history': {
         const histOutput = cmdHistory.map((cmd, i) => ` ${i + 1}  ${cmd}`).join('\n');
         out(histOutput);
         break;
      }
      case 'clear':
        addHistory(commandStr, '', currentCwd, currentUser, currentHostname); 
        setHistory([]);
        break;
      case 'usermod':
        out(currentUser === 'root' ? '' : 'usermod: Permission denied. Please try again.');
        break;
      case 'getent':
        if (args[1] === 'passwd') {
            const dir = getDir('/', fileSystem);
            if (dir?.children?.['etc']?.children?.['passwd']) {
                out(dir.children['etc'].children['passwd'].content || '');
            } else {
                out('root:x:0:0:root:/root:/bin/bash\nkali:x:1000:1000:Kali,,:/home/kali:/bin/bash');
            }
        } else {
            out('');
        }
        break;
      case 'chage':
        out(currentUser === 'root' ? '' : 'chage: Permission denied. Please try again.');
        break;
      case 'mv': {
        if (!args[1] || !args[2]) { out('mv: missing file operand'); break; }
        const newFs = { ...fileSystem };
        const dir = getDir(currentCwd, newFs);
        if (dir && dir.children && dir.children[args[1]]) {
            const node = dir.children[args[1]];
            delete dir.children[args[1]];
            node.name = args[2];
            dir.children[args[2]] = node;
            setFileSystem(newFs);
            out('');
        } else {
            out(`mv: cannot stat '${args[1]}': No such file or directory`);
        }
        break;
      }
      case 'chown':
      case 'chgrp':
      case 'chmod':
        if (currentUser !== 'root' && !commandStr.includes('sudo')) {
            out(`${cmd}: changing permissions/ownership: Operation not permitted`);
            break;
        }
        out('');
        break;
      case 'groupadd':
      case 'groupmod':
      case 'groupdel':
        if (currentUser !== 'root' && !commandStr.includes('sudo')) {
            out(`${cmd}: Permission denied. Please try again.`);
            break;
        }
        out('');
        break;
      case 'groups':
        out(currentUser === 'root' ? 'root' : `${currentUser} cdrom floppy sudo audio dip video plugdev netdev bluetooth scanner`);
        break;
      case 'id':
        if (currentUser === 'root') {
            out('uid=0(root) gid=0(root) groups=0(root)');
        } else {
            out(`uid=1000(${currentUser}) gid=1000(${currentUser}) groups=1000(${currentUser}),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),108(netdev),114(bluetooth),118(scanner)`);
        }
        break;
      case 'ping':
        if (args.includes('>')) {
            out('');
        } else {
            out('PING localhost (127.0.0.1) 56(84) bytes of data.\n64 bytes from localhost (127.0.0.1): icmp_seq=1 ttl=64 time=0.034 ms\n64 bytes from localhost (127.0.0.1): icmp_seq=2 ttl=64 time=0.041 ms\n...');
        }
        break;
      case 'date':
        out(new Date().toString());
        break;
      case 'uptime':
        out(' 10:23:45 up 1 day,  2:34,  1 user,  load average: 0.00, 0.01, 0.05');
        break;
      case 'free':
        out('              total        used        free      shared  buff/cache   available\nMem:        8192000     2048000     4096000           0     2048000     5000000\nSwap:       2048000           0     2048000');
        break;
      case 'df':
        out('Filesystem     1K-blocks    Used Available Use% Mounted on\n/dev/sda1       50000000 10000000  40000000  20% /\ntmpfs             400000       4    399996   1% /dev/shm');
        break;
      case 'uname':
        out(args.includes('-a') ? 'Linux kali 6.1.0-kali7-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.20-1kali1 (2023-04-19) x86_64 GNU/Linux' : 'Linux');
        break;
      case 'ifconfig':
      case 'ip':
        out('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255\n        inet6 fe80::a0b:12ff:fe34:5678  prefixlen 64  scopeid 0x20<link>\n        ether 08:0b:12:34:56:78  txqueuelen 1000  (Ethernet)\n        RX packets 12345  bytes 12345678 (11.7 MiB)\n        TX packets 54321  bytes 87654321 (83.5 MiB)');
        break;
      case 'lsmod':
        out('Module                  Size  Used by\nrfkill                 32768  2\nscsi_mod              249856  1 \ni2c_core               94208  1\nbutton                 24576  0\next4                  909312  1');
        break;
      case 'ss':
        out('Active Internet connections (servers and established)\nProto Recv-Q Send-Q Local Address           Foreign Address         State      \ntcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     \ntcp6       0      0 :::80                   :::*                    LISTEN     ');
        break;
      case 'ps':
      case 'top':
        out('  PID TTY          TIME CMD\n    1 pts/0    00:00:00 bash\n   14 pts/0    00:00:00 ' + cmd);
        break;
      case 'bg':
      case 'jobs':
        out('');
        break;
      default:
        out(`bash: ${cmd}: command not found`);
        break;
    }
  };

  const handleNanoSave = () => {
      updateFileContent(tempState.cwd, tempState.filename, nanoContent);
      setPromptState('NORMAL');
      addHistory(`nano ${tempState.filename}`, '', tempState.cwd, tempState.user, tempState.hostname); // exit nano
  };

  // GUI interaction functions
  const handleGuiDoubleClick = (node: FileNode, basePath: string) => {
     if (node.type === 'dir') {
         const newPath = resolvePath(node.name, basePath);
         setGuiCwd(newPath);
     } else {
         // Open file in GUI notepad
         if (!openFiles.find(f => f.name === node.name)) {
             setOpenFiles([...openFiles, {name: node.name, content: node.content || '', path: basePath}]);
         }
     }
  };

  const closeGuiFile = (name: string) => {
      setOpenFiles(openFiles.filter(f => f.name !== name));
  };

  const saveGuiFile = (name: string, content: string, path: string) => {
      updateFileContent(path, name, content);
      setOpenFiles(openFiles.filter(f => f.name !== name));
  };


  const renderPromptLine = (st: string) => {
      if (st === 'ADDUSER_PASS') return 'New password: ';
      if (st === 'ADDUSER_PASS_CONFIRM') return 'Retype new password: ';
      if (st === 'SUDO_PASS') return `[sudo] password for ${user}: `;
      if (st === 'ADDUSER_FULLNAME') return `        Full Name []: `;
      if (st === 'ADDUSER_ROOM') return `        Room Number []: `;
      if (st === 'ADDUSER_WORKPHONE') return `        Work Phone []: `;
      if (st === 'ADDUSER_HOMEPHONE') return `        Home Phone []: `;
      if (st === 'ADDUSER_OTHER') return `        Other []: `;
      if (st === 'ADDUSER_CONFIRM') return `Is the information correct? [Y/n] `;
      return '';
  };

  const activeGuiDir = getDir(guiCwd, fileSystem);
  let guiNodes = activeGuiDir?.children ? Object.values(activeGuiDir.children) : [];
  if (guiSearch) {
      guiNodes = guiNodes.filter(n => n.name.toLowerCase().includes(guiSearch.toLowerCase()));
  }

  return (
    <>
      <style>{customAiStyles}</style>
      <div className={`w-full h-screen ${isDark ? 'bg-[#000] text-gray-300' : 'bg-gray-100 text-gray-800'} font-sans flex flex-col transition-colors duration-300`}>
      {confirmDelete && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
              <div className={`rounded-xl p-6 shadow-2xl max-w-sm w-full ${isDark ? 'bg-[#222] text-gray-200 border border-[#444]' : 'bg-white text-gray-800'}`}>
                  <h3 className="text-xl font-bold mb-2">Delete Item</h3>
                  <p className="mb-6 opacity-80">Are you sure you want to delete '{confirmDelete.name}'? This cannot be undone.</p>
                  <div className="flex gap-3 justify-end">
                      <button className="px-4 py-2 rounded-lg font-medium opacity-80 hover:opacity-100 hover:bg-gray-500/10" onClick={() => setConfirmDelete(null)}>Cancel</button>
                      <button className="px-4 py-2 rounded-lg font-medium bg-[#ff7400]/100 text-white hover:bg-red-600" onClick={() => {
                          deleteNode(confirmDelete.path, confirmDelete.name);
                          setConfirmDelete(null);
                      }}>Delete</button>
                  </div>
              </div>
          </div>
      )}
      {/* Top Navigation */}
      <div className={`border-b ${isDark ? 'border-[#333] bg-[#111]' : 'border-gray-200 bg-white'} p-2 px-4 flex items-center justify-between shadow-sm z-10 shrink-0`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (window.history.length > 2) navigate(-1);
              else navigate('/practicals/polytechnic/it');
            }}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#222] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`}
          >
            <ArrowLeft size={18} />
          </button>
          <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <TerminalIcon size={18} />
            <span className="font-bold hidden sm:inline">Kali Linux Virtual Environment</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TeachMeLaunchButton isDarkMode={isDark} />
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-full ${isDark ? 'hover:bg-[#333] text-gray-300' : 'hover:bg-gray-200 text-gray-700'}`}
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      
      <div 
        className="flex flex-col md:flex-row flex-1 overflow-hidden pb-[72px] md:pb-0"
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <div 
          className="flex flex-col md:flex-row flex-1 overflow-hidden order-1 md:order-1"
        >

         

         {/* GUI Pane (Desktop Environment) */}
         <div 
           className={`${activeMobileTab === 'desktop' ? 'flex' : 'hidden'} md:flex w-full md:w-auto h-full md:h-full flex-col relative ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#e5e5e5]'} overflow-hidden focus-within:z-10 order-1 md:order-3`}
           style={{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }}
         >
             {/* Desktop wallpaper background */}
             <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/site/kali-net.jpg')" }}
                onClick={() => setContextMenu(null)}
             />
             <div className="absolute inset-0 bg-black/10" />

             {/* Top bar */}
             <div className="relative z-10 h-8 shrink-0 bg-black/60 backdrop-blur-md flex items-center justify-between px-3 text-xs text-gray-200 font-medium select-none">
                <span className="font-semibold">Activities</span>
                <span>{new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} &nbsp; {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-2 opacity-80">
                   <TerminalIcon size={14} />
                </div>
             </div>

             {/* Desktop content area — fills all space between top bar and taskbar */}
             <div className="relative z-0 flex-1 overflow-hidden">

             {/* Desktop icons */}
             <div className="relative z-10 p-4 flex flex-col gap-1 w-24">
                <div
                   ref={desktopHomeIconRef}
                   className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg text-center hover:bg-white/10 transition-colors group"
                   onDoubleClick={() => openFileManager('~', getRelativeCenter(desktopHomeIconRef))}
                >
                   <Home size={48} className="text-white drop-shadow-md group-hover:scale-105 transition-transform" />
                   <span className="text-xs text-white drop-shadow-md">Home</span>
                </div>
                <div
                   ref={desktopTerminalIconRef}
                   className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg text-center hover:bg-white/10 transition-colors group"
                   onDoubleClick={() => openTerminalWindow(getRelativeCenter(desktopTerminalIconRef))}
                >
                   <TerminalIcon size={48} className="text-green-400 drop-shadow-md group-hover:scale-105 transition-transform" />
                   <span className="text-xs text-white drop-shadow-md">Terminal</span>
                </div>
                <div
                   className="flex flex-col items-center gap-1 cursor-pointer p-2 rounded-lg text-center hover:bg-white/10 transition-colors group"
                   onDoubleClick={() => setConfirmDelete(null)}
                >
                   <Trash2 size={48} className="text-white drop-shadow-md group-hover:scale-105 transition-transform" />
                   <span className="text-xs text-white drop-shadow-md">Trash</span>
                </div>
             </div>

             {/* File Manager Window (floating, opens on Home double-click) */}
             <AnimatePresence>
             {fileManagerWindow.isOpen && !fileManagerWindow.isMinimized && (() => {
               const center = getWindowCenter(fileManagerWindow);
               const origin = fileManagerWindow.origin || center;
               const dx = origin.x - center.x;
               const dy = origin.y - center.y;
               return (
             <motion.div
                key="filemanager-window"
                initial={{ opacity: 0, scale: 0.05, x: dx, y: dy }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.05, x: dx, y: dy }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                style={{
                  position: 'absolute',
                  zIndex: fileManagerWindow.zIndex,
                  transformOrigin: 'center center',
                  ...(fileManagerWindow.isMaximized
                    ? { top: 8, left: 8, right: 8, bottom: 8 }
                    : { top: fileManagerWindow.y, left: fileManagerWindow.x, width: fileManagerWindow.width, height: fileManagerWindow.height }),
                }}
                className={`rounded-lg shadow-2xl flex flex-col overflow-hidden ${isDark ? 'bg-[#1e1e1e] border border-gray-700' : 'bg-white border border-gray-300'}`}
                onPointerDownCapture={bringFmToFront}
             >
                <div
                   className={`h-9 px-3 text-xs font-bold font-sans flex justify-between items-center cursor-move select-none ${isDark ? 'bg-[#2d2d2d] text-gray-300' : 'bg-[#f0f0f0] text-gray-700'}`}
                   onPointerDown={handleFmTitlePointerDown}
                   onDoubleClick={toggleMaximizeFileManager}
                >
                   <span className="flex items-center gap-2"><Folder size={14} /> Files</span>
                   <div className="flex gap-1">
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={minimizeFileManager} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'}`} title="Minimize">
                        <ChevronDown size={13} />
                      </button>
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={toggleMaximizeFileManager} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'}`} title="Maximize">
                        <Maximize2 size={12} />
                      </button>
                      <button onPointerDown={(e) => e.stopPropagation()} onClick={closeFileManager} className={`w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-red-500 hover:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`} title="Close">
                        <X size={14} />
                      </button>
                   </div>
                </div>
                 {/* Top Toolbar */}
                 <div className={`flex items-center justify-between p-2 border-b ${isDark ? 'bg-[#2d2d2d] border-[#444] text-gray-200' : 'bg-[#f0f0f0] border-gray-300 text-gray-700'}`}>
                    <div className="flex items-center gap-2 flex-1">
                        <div className="flex gap-1 mr-2">
                           <button className={`p-1.5 rounded-full ${isDark ? 'hover:bg-[#444]' : 'hover:bg-gray-200'} transition-colors ${guiHistory.length <= 1 ? 'opacity-50' : ''}`} onClick={() => {
                               if (guiHistory.length > 1) {
                                   const newHist = [...guiHistory];
                                   newHist.pop();
                                   const next = newHist[newHist.length - 1];
                                   setGuiHistory(newHist);
                                   setGuiCwd(next);
                               }
                           }}><ChevronLeft size={16} /></button>
                           <button className={`p-1.5 rounded-full ${isDark ? 'hover:bg-[#444]' : 'hover:bg-gray-200'} transition-colors opacity-50`}><ChevronRight size={16} /></button>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all truncate overflow-hidden ${isDark ? 'bg-[#1a1a1a] border-[#555]' : 'bg-white border-gray-300 shadow-sm'} ${isSearchExpanded ? 'w-10 px-2 justify-center' : 'flex-1 max-w-sm'}`}>
                            <Home size={16} className="text-gray-500 shrink-0" />
                            {!isSearchExpanded && <span className="text-sm font-semibold truncate flex-1">{guiCwd === '~' ? 'Home' : guiCwd.replace('~', 'Home / ')}</span>}
                        </div>
                        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-md border ml-1 transition-all ${isDark ? 'bg-[#1a1a1a] border-[#555]' : 'bg-white border-gray-300'} ${isSearchExpanded ? 'flex-1' : 'w-10 sm:w-40'}`}>
                            <Search size={14} className="text-gray-500 shrink-0 cursor-pointer" onClick={() => setIsSearchExpanded(true)} />
                            <input 
                                type="text"
                                className={`bg-transparent border-none outline-none text-sm w-full transition-all font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'} ${isSearchExpanded ? 'block' : 'hidden sm:block'}`}
                                placeholder="Search..."
                                value={guiSearch}
                                onChange={(e) => setGuiSearch(e.target.value)}
                                onFocus={() => setIsSearchExpanded(true)}
                                onBlur={() => { if (!guiSearch) setIsSearchExpanded(false); }}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button className={`p-1.5 rounded-full ${isDark ? 'hover:bg-[#444]' : 'hover:bg-gray-200'}`}><Menu size={16} /></button>
                    </div>
                 </div>

                 {/* Body */}
                 <div className="flex flex-1 overflow-hidden">
                     {/* Sidebar */}
                     <div className={`hidden md:flex w-40 border-r flex-col py-2 select-none overflow-y-auto ${isDark ? 'bg-[#252525] border-[#444] text-gray-300' : 'bg-[#fafafa] border-gray-200 text-gray-700'}`}>
                         <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 mt-1">Places</div>
                         <div className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200'}`}><Clock size={16}/> Recent</div>
                         <div className={`flex items-center gap-3 px-4 py-2 text-sm cursor-pointer transition-colors ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200'}`}><Star size={16}/> Starred</div>
                         <div className="h-px bg-gray-500/20 my-3 mx-2"></div>
                         
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~')}><Home size={16}/> Home</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Desktop')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Desktop' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Desktop')}><Monitor size={16}/> Desktop</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Documents')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Documents' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Documents')}><FileText size={16}/> Documents</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Downloads')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Downloads' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Downloads')}><Download size={16}/> Downloads</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Music')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Music' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Music')}><Music size={16}/> Music</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Pictures')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Pictures' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Pictures')}><LucideImage size={16}/> Pictures</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => handleDropOnSidebar(e, '~/Videos')} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors ${guiCwd === '~/Videos' ? (isDark ? 'bg-[#ff7b54]/20 text-[#ff7b54] font-bold' : 'bg-gray-200 font-bold') : (isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200')}`} onClick={() => navigateToGui('~/Videos')}><Video size={16}/> Videos</div>
                         <div onDragOver={e => e.preventDefault()} onDrop={e => {
                            e.preventDefault();
                            try {
                                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                if (data && data.path && data.name) {
                                    setConfirmDelete({path: data.path, name: data.name});
                                }
                            } catch(err) {}
                         }} className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors mt-2 ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-200'}`}><Trash2 size={16}/> Trash</div>
                     </div>

                     {/* Icons Grid */}
                     <div 
                        className={`flex-1 p-6 flex content-start flex-wrap gap-4 overflow-y-auto ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({x: e.clientX, y: e.clientY, node: null, path: guiCwd});
                        }}
                        onClick={() => setContextMenu(null)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            try {
                               const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                               if (data && data.path && data.name && data.path !== guiCwd) {
                                  pasteNode(guiCwd, {action: 'cut', path: data.path, name: data.name});
                               }
                            } catch(err) {}
                        }}
                     >
                         {!guiSearch && guiCwd === '~' && (
                             <div
                                className={`flex flex-col items-center gap-2 cursor-pointer p-3 rounded-lg w-28 text-center transition-colors group ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}
                                onDoubleClick={(e) => openTerminalWindow({ x: e.clientX - (containerRef.current?.getBoundingClientRect().left ?? 0), y: e.clientY - (containerRef.current?.getBoundingClientRect().top ?? 0) })}
                             >
                                <TerminalIcon size={64} className="text-green-500 drop-shadow-sm group-hover:scale-105 transition-transform" />
                                <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'} truncate w-full group-hover:underline`}>Terminal</span>
                             </div>
                         )}
                         {guiNodes.length === 0 && guiSearch && (
                             <div className="flex flex-col items-center justify-center w-full h-full opacity-50">
                                 <Search size={48} className="mb-4" />
                                 <p className="text-lg font-semibold">No results found for "{guiSearch}"</p>
                             </div>
                         )}
                         <AnimatePresence mode="popLayout">
                         {guiNodes.map((node, i) => (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.8 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ duration: 0.2, delay: Math.min(i * 0.03, 0.5) }}
                               key={`${guiCwd}-${node.name}`}
                               draggable
                               onDragStart={(e: any) => {
                                   e.dataTransfer.setData('text/plain', JSON.stringify({name: node.name, path: guiCwd}));
                               }}
                               onDragOver={(e: any) => {
                                   if (node.type === 'dir') e.preventDefault();
                               }}
                               onDrop={(e: any) => {
                                   if (node.type !== 'dir') return;
                                   e.preventDefault();
                                   e.stopPropagation();
                                   try {
                                      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                                      // Can't drop into itself
                                      if (data.name === node.name && data.path === guiCwd) return;
                                      
                                      const newPath = guiCwd === '/' ? `/${node.name}` : `${guiCwd}/${node.name}`;
                                      if (data && data.path && data.name) {
                                         pasteNode(newPath, {action: 'cut', path: data.path, name: data.name});
                                      }
                                   } catch(err) {}
                               }}
                               onContextMenu={(e: any) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   setContextMenu({x: e.clientX, y: e.clientY, node: {name: node.name, type: node.type}, path: guiCwd});
                               }}
                               className={`flex flex-col items-center gap-2 cursor-pointer p-3 rounded-lg w-28 text-center transition-colors group ${isDark ? 'hover:bg-[#333]' : 'hover:bg-gray-100'}`}
                               onDoubleClick={() => handleGuiDoubleClick(node, guiCwd)}
                             >
                                 {node.type === 'dir' ? (
                                     <Folder size={64} fill={isDark ? '#475569' : '#e2e8f0'} className={`${isDark ? 'text-[#e5e7eb]' : 'text-gray-400'} drop-shadow-sm group-hover:scale-105 transition-transform`} />
                                 ) : (
                                     <FileText size={64} className={`${isDark ? 'text-[#ff7b54]/80' : 'text-[#ff7b54]/70'} drop-shadow-sm group-hover:scale-105 transition-transform`} />
                                 )}
                                 
                                 {renamingNode?.name === node.name && renamingNode?.path === guiCwd ? (
                                     <input 
                                        autoFocus
                                        value={renamingInput}
                                        onChange={e => setRenamingInput(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') performRename();
                                            if (e.key === 'Escape') setRenamingNode(null);
                                        }}
                                        onBlur={performRename}
                                        onClick={e => e.stopPropagation()}
                                        className="text-sm bg-blue-500 text-white truncate w-full px-1 outline-none text-center rounded selection:bg-blue-300"
                                     />
                                 ) : (
                                     <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'} truncate w-full group-hover:underline`}>{node.name}</span>
                                 )}
                             </motion.div>
                         ))}
                         </AnimatePresence>
                     </div>
                     
                     {/* Context Menu */}
                     <AnimatePresence>
                         {contextMenu && (
                            <motion.div
                               initial={{ opacity: 0, scale: 0.95 }}
                               animate={{ opacity: 1, scale: 1 }}
                               exit={{ opacity: 0, scale: 0.95 }}
                               transition={{ duration: 0.1 }}
                               className={`fixed z-50 py-1 w-48 rounded-md shadow-xl border ${isDark ? 'bg-[#2d2d2d] border-gray-600' : 'bg-white border-gray-200'}`}
                               style={{ top: contextMenu.y, left: contextMenu.x }}
                               onClick={(e) => e.stopPropagation()}
                            >
                               {contextMenu.node ? (
                                   <>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         onClick={() => {
                                            setClipboard({ action: 'copy', path: contextMenu.path, name: contextMenu.node!.name });
                                            setContextMenu(null);
                                         }}
                                      >
                                         Copy
                                      </button>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         onClick={() => {
                                            setClipboard({ action: 'cut', path: contextMenu.path, name: contextMenu.node!.name });
                                            setContextMenu(null);
                                         }}
                                      >
                                         Cut
                                      </button>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         onClick={() => {
                                            setRenamingNode({ name: contextMenu.node!.name, path: contextMenu.path });
                                            setRenamingInput(contextMenu.node!.name);
                                            setContextMenu(null);
                                         }}
                                      >
                                         Rename
                                      </button>
                                      <div className={`my-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-red-400 hover:bg-red-600 hover:text-white' : 'text-[#ff7400] hover:bg-[#ff7400]/100 hover:text-white'}`}
                                         onClick={() => {
                                            deleteNode(contextMenu.path, contextMenu.node!.name);
                                            setContextMenu(null);
                                         }}
                                      >
                                         Delete
                                      </button>
                                   </>
                               ) : (
                                   <>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${!clipboard ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         disabled={!clipboard}
                                         onClick={() => {
                                            pasteNode(contextMenu.path);
                                            setContextMenu(null);
                                         }}
                                      >
                                         Paste
                                      </button>
                                      <div className={`my-1 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         onClick={() => {
                                            createNewNode(guiCwd, 'dir', 'New Folder');
                                            setContextMenu(null);
                                         }}
                                      >
                                         New Folder
                                      </button>
                                      <button 
                                         className={`w-full text-left px-4 py-2 text-sm transition-colors ${isDark ? 'text-gray-200 hover:bg-blue-600 hover:text-white' : 'text-gray-700 hover:bg-blue-500 hover:text-white'}`}
                                         onClick={() => {
                                            createNewNode(guiCwd, 'file', 'New File.txt');
                                            setContextMenu(null);
                                         }}
                                      >
                                         New Text File
                                      </button>
                                   </>
                               )}
                            </motion.div>
                         )}
                     </AnimatePresence>

                 </div>
             {!fileManagerWindow.isMaximized && (
                  <div
                     onPointerDown={handleFmResizePointerDown}
                     className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize"
                     style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(100,100,100,0.5) 50%)' }}
                  />
                )}
             </motion.div>
               );
             })()}
             </AnimatePresence>

             {/* Floating Terminal Window */}
             <AnimatePresence>
             {terminalWindow.isOpen && !terminalWindow.isMinimized && (() => {
               const center = getWindowCenter(terminalWindow);
               const origin = terminalWindow.origin || center;
               const dx = origin.x - center.x;
               const dy = origin.y - center.y;
               return (
               <motion.div
                 key="terminal-window"
                 initial={{ opacity: 0, scale: 0.05, x: dx, y: dy }}
                 animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                 exit={{ opacity: 0, scale: 0.05, x: dx, y: dy }}
                 transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                 style={{
                   position: 'absolute',
                   zIndex: terminalWindow.zIndex,
                   transformOrigin: 'center center',
                   ...(terminalWindow.isMaximized
                     ? { top: 8, left: 8, right: 8, bottom: 8 }
                     : { top: terminalWindow.y, left: terminalWindow.x, width: terminalWindow.width, height: terminalWindow.height }),
                 }}
                 className={`rounded-lg shadow-2xl flex flex-col overflow-hidden font-mono ${isDark ? 'bg-[#0a0a0a] border border-gray-700' : 'bg-[#1e1e1e] border border-gray-600'}`}
                 onPointerDownCapture={bringTerminalToFront}
               >
                 {/* Title bar */}
                 <div
                   className={`h-9 px-3 text-xs font-bold font-sans flex justify-between items-center cursor-move select-none ${isDark ? 'bg-[#1c1c1c] text-gray-400' : 'bg-[#e0e0e0] text-gray-800'}`}
                   onPointerDown={handleWinTitlePointerDown}
                   onDoubleClick={toggleMaximizeTerminal}
                 >
                   <span>Terminal - {user}@{hostname}</span>
                   <div className="flex gap-1">
                     <button onPointerDown={(e) => e.stopPropagation()} onClick={minimizeTerminalWindow} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'}`} title="Minimize">
                       <ChevronDown size={13} />
                     </button>
                     <button onPointerDown={(e) => e.stopPropagation()} onClick={toggleMaximizeTerminal} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/10 text-gray-700'}`} title="Maximize">
                       <Maximize2 size={12} />
                     </button>
                     <button onPointerDown={(e) => e.stopPropagation()} onClick={closeTerminalWindow} className={`w-6 h-6 flex items-center justify-center rounded transition-colors hover:bg-red-500 hover:text-white ${isDark ? 'text-gray-300' : 'text-gray-700'}`} title="Close">
                       <X size={14} />
                     </button>
                   </div>
                 </div>

                 {promptState === 'NANO' ? (
                   <div className="flex-1 flex flex-col bg-black text-white p-2 overflow-hidden">
                     <div className="bg-white text-black px-2 py-0.5 text-center mb-2 flex justify-between font-bold">
                       <span>GNU nano 5.4</span>
                       <span>File: {tempState.filename}</span>
                       <span></span>
                     </div>
                     <textarea
                       ref={nanoRef}
                       value={nanoContent}
                       onChange={(e) => setNanoContent(e.target.value)}
                       className="flex-1 bg-transparent text-white outline-none resize-none font-mono"
                       spellCheck={false}
                     />
                     <div className="flex gap-4 bg-white text-black px-2 mt-2 py-0.5 flex-wrap">
                       <span>^X Exit</span>
                       <button onClick={handleNanoSave} className="font-bold border border-black px-2 hover:bg-gray-200 transition-colors">^S Save and Exit (Click here)</button>
                     </div>
                   </div>
                 ) : (
                   <div
                     ref={terminalRef}
                     className="flex-1 p-4 overflow-y-auto cursor-text text-gray-200 text-sm"
                     onClick={() => inputRef.current?.focus()}
                   >
                     <div className="mb-4">
                       <div className="text-green-500 font-bold">Kali GNU/Linux Rolling</div>
                       <div className="text-gray-400">Simulated Terminal Environment</div>
                     </div>

                     {history.map((item, index) => (
                       <motion.div
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.2 }}
                         key={item.id + index}
                         className="mb-2"
                       >
                         {!item.hidePrompt ? (
                           <>
                             <div className="flex items-center gap-2">
                               <span className="text-green-500 font-bold break-all">┌──({item.user}㉿{item.hostname})-[{item.cwd}]</span>
                             </div>
                             <div className="flex items-center gap-2">
                               <span className="text-green-500 font-bold shrink-0">└─$</span>
                               <span className="break-all">{item.command}</span>
                             </div>
                           </>
                         ) : (
                           (item.customPrompt || item.command) ? (
                             <div className="flex items-baseline gap-2">
                               <span className="whitespace-pre">{item.customPrompt}</span>
                               <span className="break-all">{item.command}</span>
                             </div>
                           ) : null
                         )}
                         {item.output && (
                           <div className="whitespace-pre-wrap mt-1 text-gray-300">
                             {item.output}
                           </div>
                         )}
                       </motion.div>
                     ))}

                     <div className="flex flex-col gap-1">
                       {promptState === 'NORMAL' && (
                         <div className="flex items-center gap-2">
                           <span className="text-green-500 font-bold break-all">┌──({user}㉿{hostname})-[{cwd}]</span>
                         </div>
                       )}
                       <div className="flex items-center gap-2">
                         {promptState === 'NORMAL' ? <span className="text-green-500 font-bold whitespace-nowrap">└─$</span> : <span className="whitespace-pre">{renderPromptLine(promptState)}</span>}
                         <input
                           ref={inputRef}
                           type={promptState.includes('PASS') ? 'password' : 'text'}
                           value={input}
                           onChange={(e) => setInput(e.target.value)}
                           onKeyDown={handleCommand}
                           className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-200 p-0 m-0"
                           autoFocus
                           autoComplete="off"
                           spellCheck="false"
                         />
                       </div>
                     </div>
                   </div>
                 )}

                 {/* Resize handle */}
                 {!terminalWindow.isMaximized && (
                   <div
                     onPointerDown={handleWinResizePointerDown}
                     className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize"
                     style={{ background: 'linear-gradient(135deg, transparent 50%, rgba(57,255,20,0.5) 50%)' }}
                   />
                 )}
               </motion.div>
               );
             })()}
             </AnimatePresence>

             {/* Modals for Open Files */}
             <AnimatePresence>
             {openFiles.map((file, i) => (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9, y: 20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.9, y: 20 }}
                   transition={{ type: "spring", stiffness: 300, damping: 25 }}
                   key={file.name} 
                   className={`absolute w-full max-w-md h-[400px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-300 overflow-hidden z-20`} 
                   style={{ top: `${40 + i*20}px`, left: `${40 + i*20}px` }}>
                     <div className={`bg-gray-200 border-b border-gray-300 px-3 py-2 flex justify-between items-center cursor-default`}>
                         <div className="flex items-center gap-2 text-gray-700 text-sm font-semibold truncate flex-1">
                             <FileText size={16} /> Notepad - {file.name}
                         </div>
                         <button onClick={() => closeGuiFile(file.name)} className="hover:bg-[#ff7400]/100 hover:text-white p-1 rounded transition-colors text-gray-500 shrink-0">
                             <X size={16} />
                         </button>
                     </div>
                     <div className="p-2 bg-gray-50 border-b border-gray-200 flex gap-2 shrink-0">
                         <button onClick={() => saveGuiFile(file.name, file.content, file.path)} className="flex items-center gap-2 text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium">
                             <Save size={14} /> Save & Close
                         </button>
                     </div>
                     <textarea 
                         className="flex-1 w-full p-4 resize-none outline-none font-mono text-sm text-gray-800 bg-white"
                         value={file.content}
                         onChange={e => setOpenFiles(openFiles.map(f => f.name === file.name ? {...f, content: e.target.value} : f))}
                     />
                 </motion.div>
             ))}
             </AnimatePresence>

             </div>

             {/* Taskbar — long modern bar */}
             <div className={`relative z-30 h-12 shrink-0 flex items-center px-4 gap-1 border-t backdrop-blur-xl ${isDark ? 'bg-[#141414]/90 border-white/10' : 'bg-white/90 border-black/10'}`}>

                <button
                  ref={dockFilesIconRef}
                  onClick={() => {
                    if (fileManagerWindow.isOpen) {
                      setFileManagerWindow(w => ({ ...w, isMinimized: false, origin: getRelativeCenter(dockFilesIconRef) }));
                      bringFmToFront();
                    } else openFileManager('~', getRelativeCenter(dockFilesIconRef));
                  }}
                  className={`relative p-2 rounded-xl transition-all active:scale-90 group ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'}`}
                  title="Files"
                >
                  <Folder size={19} />
                  {fileManagerWindow.isOpen && <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-blue-400" />}
                </button>

                <button
                  ref={dockTerminalIconRef}
                  onClick={() => {
                    if (terminalWindow.isOpen) {
                      setTerminalWindow(w => ({ ...w, isMinimized: false, origin: getRelativeCenter(dockTerminalIconRef) }));
                      bringTerminalToFront();
                    } else openTerminalWindow(getRelativeCenter(dockTerminalIconRef));
                  }}
                  className="relative p-2 rounded-xl text-green-400 hover:bg-green-500/10 transition-all active:scale-90 group"
                  title="Terminal"
                >
                  <TerminalIcon size={19} />
                  {terminalWindow.isOpen && <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-green-400" />}
                </button>

                <button
                  onClick={() => setGuiCwd('/')}
                  className={`p-2 rounded-xl transition-all active:scale-90 ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-600 hover:bg-black/5 hover:text-black'}`}
                  title="Root"
                >
                  <MonitorPlay size={19} />
                </button>

                {openFiles.length > 0 && (
                  <>
                    <div className={`w-px h-6 mx-2 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                    <div className="flex gap-1.5 overflow-x-auto">
                       {openFiles.map((f, i) => (
                          <div key={i} className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 cursor-pointer border shrink-0 max-w-[150px] transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/5' : 'bg-black/5 hover:bg-black/10 text-gray-800 border-black/5'}`}>
                             <FileText size={13} className="text-[#ff7b54] shrink-0" />
                             <span className="truncate">{f.name}</span>
                          </div>
                       ))}
                    </div>
                  </>
                )}

                <div className="flex-1" />
                <span className={`text-xs font-medium tabular-nums pr-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
             </div>
         </div>
        </div>

         
         
      {/* Second Divider for AI Chat */}
      <div
         className={`hidden md:flex items-center justify-center relative z-40 cursor-col-resize ${isDark ? 'bg-[#333]' : 'bg-gray-300'} w-1 h-full group hover:bg-[#ff7400]/100 transition-colors shrink-0 order-2 md:order-2 active:bg-red-600`}
         onPointerDown={handleAiPointerDown}
         onPointerMove={handlePointerMove}
         onPointerUp={handlePointerUp}
         onPointerCancel={handlePointerUp}
      >
          <div className={`w-1 h-8 rounded-full ${isDark ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-red-300`} />
      </div>

         {/* AI Assistant Chat Right Sidebar */}
         <div 
           className={`${activeMobileTab === 'chat' ? 'flex' : 'hidden'} md:flex w-full md:w-80 h-full md:h-full flex-col ${isDark ? 'bg-[#1c1c1c] border-[#333]' : 'bg-[#f4f4f5] border-gray-300'} border-t md:border-t-0 md:border-l shrink-0 order-3 md:order-2`}
           style={isMobileLayout ? { flexBasis: 'auto', flexGrow: 1, flexShrink: 1 } : { flexBasis: `calc(${aiSplitRatio}%)`, flexGrow: 0, flexShrink: 0 }}
         >
            <div className={`px-4 py-3 pb-2 flex flex-col gap-3 ${isDark ? 'bg-[#212121] border-b border-[#333]' : 'bg-white border-b border-gray-300'}`}>
              <div className="flex justify-between items-center w-full pb-1">
                 <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? 'bg-[#141414]' : 'bg-gray-100'}`}>
                   <button
                     onClick={() => setActiveSidebarTab('ai')}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSidebarTab === 'ai' ? (isDark ? 'bg-[#2a2a2a] text-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-white text-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]') : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800')}`}
                   >
                     <Bot className="w-4 h-4" /> AI Chat
                   </button>
                   <button
                     onClick={() => setActiveSidebarTab('examPrep')}
                     className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeSidebarTab === 'examPrep' ? (isDark ? 'bg-[#2a2a2a] text-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.1)]' : 'bg-white text-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]') : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-800')}`}
                   >
                     <BookOpen className="w-4 h-4" /> Exam Prep
                   </button>
                 </div>
                 {activeSidebarTab === 'ai' && (
                   <label className={`flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span>Auto Injection:</span>
                      <input
                        type="checkbox"
                        checked={autoRunCommands}
                        onChange={(e) => setAutoRunCommands(e.target.checked)}
                        className="rounded border-gray-400 checked:bg-green-500 accent-green-500 w-3 h-3 cursor-pointer"
                      />
                   </label>
                 )}
              </div>
            </div>

            {activeSidebarTab === 'ai' ? (
              <>
            <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-6 ${isDark ? 'bg-[#141414]' : 'bg-[#fafafa]'}`}>
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex items-start text-sm font-sans ${msg.role === 'user' ? 'ml-auto flex-row-reverse gap-3 max-w-[85%]' : 'mr-auto max-w-full'}`}>
                  {msg.role === 'user' ? (
                     <>
                        <div className="w-7 h-7 mt-0.5 rounded-full shrink-0 flex items-center justify-center bg-green-600 text-white">
                          <User className="w-4 h-4" />
                        </div>
                        <div className={`rounded-xl px-3 py-2 text-sm leading-normal chat-text shadow-sm border ${isDark ? 'bg-green-900/30 border-green-800 text-gray-100' : 'bg-green-50 border-green-100 text-green-950'}`}>
                           {msg.content}
                        </div>
                     </>
                  ) : (
                     <>
                        <div className={`pt-1 text-sm leading-relaxed chat-text w-full max-w-[72ch] min-w-0 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                           {renderAiMessage(msg.content, isDark)}
                        </div>
                     </>
                  )}
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className={`flex items-center gap-2 p-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                     <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                </div>
              )}
              <div ref={aiEndOfMessagesRef} />
            </div>

             <div className={`p-3 ${isDark ? 'bg-[#1c1c1c] border-t border-[#333]' : 'bg-white border-t border-gray-300'}`}>
               <form onSubmit={handleAiSendMessage} className="relative flex items-center">
                  <input 
                    className={`w-full h-[58px] rounded-[14px] pl-[18px] pr-[64px] text-[15px] focus:outline-none transition-colors chat-text ${isDark ? 'bg-[#0d0d12] text-gray-200 border-[#444] focus:border-green-500 border' : 'bg-gray-100 text-gray-800 border-gray-300 focus:border-gray-400 border'}`}
                    placeholder="Ask Sidemann"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!aiInput.trim() || isAiLoading}
                    className={`absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-xl shadow-lg transition-all active:scale-95 ${aiInput.trim() && !isAiLoading ? 'bg-green-600 text-white hover:bg-green-500' : (isDark ? 'bg-[#444] text-gray-500 shadow-none' : 'bg-gray-300 text-gray-500 shadow-none')}`}
                  >
                    <Send className="w-[18px] h-[18px]" />
                  </button>
               </form>
             </div>
             </>
            ) : (
              <div className={`flex-1 overflow-y-auto p-4 flex flex-col gap-4 ${isDark ? 'bg-[#141414]' : 'bg-[#fafafa]'}`}>
                <div className={`p-4 rounded-xl shadow-sm border ${isDark ? 'bg-[#1c1c1c] border-[#333]' : 'bg-white border-gray-200'}`}>
                   <h3 className={`font-semibold mb-2 flex items-center gap-2 ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Command Reference
                   </h3>
                   <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4 leading-relaxed`}>
                     These are standard Linux commands, including equivalents to MS-DOS. Click any command to instantly run it in your terminal.
                   </p>
                </div>

                <div className="flex flex-col gap-3">
                   {[
                      { desc: 'Viewing current directory', cmd: 'pwd' },
                      { desc: 'Viewing contents of a directory including hidden files', cmd: 'ls -a' },
                      { desc: 'Creating an empty file', cmd: 'touch filename.txt' },
                      { desc: 'Creating many empty files', cmd: 'touch file1.txt file2.txt file3.txt' },
                      { desc: 'Viewing contents of a file', cmd: 'cat filename.txt' },
                      { desc: 'Deleting many files', cmd: 'rm file1.txt file2.txt file3.txt' },
                      { desc: 'Copying a file', cmd: 'cp source.txt dest.txt' },
                      { desc: 'Moving or renaming a file', cmd: 'mv filename.txt newname.txt' },
                      { desc: 'Creating a directory', cmd: 'mkdir directoryname' },
                      { desc: 'Accessing root user', cmd: 'sudo su -' },
                      { desc: 'Adding a created account to sudo group', cmd: 'sudo usermod -aG sudo username' },
                      { desc: 'Locking an account', cmd: 'sudo usermod -L username' },
                      { desc: 'Viewing all user accounts in the system', cmd: 'getent passwd' },
                      { desc: 'Setting a user password to expire after 20 days', cmd: 'sudo chage -M 20 username' },
                      { desc: 'Changing user ownership of a directory', cmd: 'sudo chown newuser directoryname' },
                      { desc: 'Changing group ownership of a directory', cmd: 'sudo chgrp newgroup directoryname' },
                      { desc: 'Viewing ownership (user/group)', cmd: 'ls -l' },
                      { desc: 'Changing user and group ownership of a directory', cmd: 'sudo chown -R root:root directoryname' },
                      { desc: 'Viewing active processes in the system', cmd: 'ps -e' },
                      { desc: 'Ping localhost and redirect to null', cmd: 'ping localhost > /dev/null' },
                      { desc: 'Terminating the foreground process', cmd: '^C' },
                      { desc: 'Restarting previous process in background', cmd: 'bg' },
                      { desc: 'View jobs running in current terminal', cmd: 'jobs' },
                      { desc: 'All processes in current shell', cmd: 'ps' },
                      { desc: 'View all loaded drivers (modules)', cmd: 'lsmod' },
                      { desc: 'View active network connections and listening ports', cmd: 'ss -tulpn' },
                      { desc: 'View running processes continuously', cmd: 'top' }
                   ].map((item, idx) => (
                      <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-2 transition-all hover:-translate-y-0.5 ${isDark ? 'bg-[#212121] border-[#333] hover:border-gray-500' : 'bg-white border-gray-200 shadow-sm hover:border-gray-400'}`}>
                         <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</span>
                         <div className={`p-2 rounded flex items-center justify-between group ${isDark ? 'bg-[#141414]' : 'bg-gray-100'}`}>
                            <code className={`text-sm font-mono ${isDark ? 'text-green-400' : 'text-blue-600'}`}>
                               {item.cmd}
                            </code>
                            {item.cmd !== '^C' && (
                              <button
                                onClick={e => handleAiRunCommand(item.cmd)}
                                className={`opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all ${isDark ? 'bg-[#333] hover:bg-[#444] text-gray-200' : 'bg-white hover:bg-gray-200 text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.1)]'}`}
                                title="Run Command"
                              >
                                <Play className="w-3.5 h-3.5" />
                              </button>
                            )}
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
         </div>

    
      </div>

      <div
        className={`md:hidden fixed left-0 right-0 bottom-0 z-[170] border-t px-3 pt-2 ${
          isDark ? 'bg-[#111] border-[#333]' : 'bg-white border-gray-200'
        }`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveMobileTab('desktop')}
            className={`h-12 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors ${
              activeMobileTab === 'desktop'
                ? isDark ? 'bg-blue-950/50 text-blue-300' : 'bg-blue-50 text-blue-700'
                : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-slate-100'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('chat')}
            className={`h-12 rounded-xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors ${
              activeMobileTab === 'chat'
                ? isDark ? 'bg-emerald-950/50 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                : isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
      </div>
    </>
  );

};

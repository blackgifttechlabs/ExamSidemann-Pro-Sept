import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  Network,
  Share2,
  GitBranch,
  Code,
  GraduationCap,
  Lightbulb,
  Table,
  List,
  Copy,
  Check,
  Brain,
  RefreshCw,
  ChevronUp,
  BookOpen,
  X,
  Search,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'types', label: 'Types' },
  { id: 'traversals', label: 'Traversals' },
  { id: 'representations', label: 'Representations' },
  { id: 'topological', label: 'Topological' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'closure', label: 'Closure' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(
    null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark Mode detection
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Random tip on mount
  useEffect(() => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Graphs are used to model social networks, transportation systems, and even the structure of the internet.',
      },
      {
        title: 'Pro Tip',
        text: 'BFS is great for finding the shortest path in unweighted graphs; Dijkstra’s handles weighted graphs without negative edges.',
      },
      {
        title: 'Memory Trick',
        text: 'DFS uses a stack (or recursion) – it goes deep; BFS uses a queue – it goes broad.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to mark nodes as visited in graph traversals leads to infinite loops in cyclic graphs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Graphs are used to model social networks, transportation systems, and even the structure of the internet.',
      },
      {
        title: 'Pro Tip',
        text: 'BFS is great for finding the shortest path in unweighted graphs; Dijkstra’s handles weighted graphs without negative edges.',
      },
      {
        title: 'Memory Trick',
        text: 'DFS uses a stack (or recursion) – it goes deep; BFS uses a queue – it goes broad.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to mark nodes as visited in graph traversals leads to infinite loops in cyclic graphs.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  // Scroll to section when tab changes
  const scrollToSection = (index: number) => {
    setActiveSectionIndex(index);
    const tab = SECTION_TABS[index];
    const element = sectionRefs.current[tab.id];
    if (element) {
      const scrollArea = document.getElementById('lesson-scroll-area');
      if (scrollArea) {
        const scrollAreaRect = scrollArea.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        scrollArea.scrollTo({
          top: elementRect.top - scrollAreaRect.top + scrollArea.scrollTop - 72,
          behavior: 'smooth',
        });
      } else {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // ─── Sticky Navigation ────────────────────────────────────────────────────
  const NavTabs = () => (
    <div className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a0a0b]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2 px-[5px] sm:px-6 md:px-8 shadow-sm">
      <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SECTION_TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(idx)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeSectionIndex === idx
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

  // ─── Copy to clipboard ──────────────────────────────────────────────────
  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Syntax highlighting (same as previous outcomes) ────────────────────
  const highlightSyntax = (code: string): React.ReactNode => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const placeholders: Record<string, string> = {};
    let counter = 0;

    // Comments
    escaped = escaped.replace(/(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, (match) => {
      const key = `__COMMENT_${counter++}__`;
      placeholders[key] = `<span class="text-[#57A64A] dark:text-[#6a9955] italic">${match}</span>`;
      return key;
    });

    // Strings
    escaped = escaped.replace(/(".*?"|'.*?'|`.*?`)/g, (match) => {
      const key = `__STRING_${counter++}__`;
      placeholders[key] = `<span class="text-[#D69D85] dark:text-[#ce9178]">${match}</span>`;
      return key;
    });

    // Keywords
    const keywords = [
      'int', 'void', 'char', 'double', 'float', 'if', 'else', 'return', 'for',
      'while', 'do', 'break', 'continue', 'switch', 'case', 'default', 'class',
      'struct', 'public', 'private', 'protected', 'namespace', 'using', 'include',
      'define', 'endl', 'cout', 'cin', 'main', 'bool', 'const', 'new', 'delete',
      'virtual', 'override', 'final', 'template', 'typename', 'auto', 'static',
      'constexpr', 'try', 'catch', 'throw', 'std', 'vector', 'cerr'
    ];
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    escaped = escaped.replace(keywordRegex, '<span class="text-[#1e40af] dark:text-[#569CD6] font-semibold">$1</span>');

    // Primitive types
    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Functions (specific names for graph algorithms)
    const functions = ['DFS', 'BFS', 'dijkstra', 'prim', 'kruskal', 'floydWarshall'];
    const funcRegex = new RegExp(`\\b(${functions.join('|')})\\b`, 'g');
    escaped = escaped.replace(funcRegex, '<span class="text-[#DCDCAA]">$1</span>');

    // Methods (words followed by '(')
    escaped = escaped.replace(/(?<![<>"'])\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\s*\()/g, '<span class="text-[#DCDCAA]">$1</span>');

    // Numbers
    escaped = escaped.replace(/\b(\d+(\.\d+)?)\b/g, '<span class="text-[#16a34a] dark:text-[#b5cea8]">$1</span>');

    Object.keys(placeholders).forEach(key => {
      escaped = escaped.replace(key, placeholders[key]);
    });

    const lines = escaped.split('\n');
    return lines.map((line, idx) => (
      <div key={idx} className="flex min-h-[1.5rem] hover:bg-gray-100/50 dark:hover:bg-gray-700/30 rounded-md transition-colors">
        <span className="text-right w-8 select-none text-gray-400 dark:text-gray-500 text-xs pr-3 mr-3 border-r border-gray-200 dark:border-gray-700 shrink-0">
          {idx + 1}
        </span>
        <pre
          className="m-0 flex-1 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: line || ' ' }}
        />
      </div>
    ));
  };

  // ─── CodeBlock component ────────────────────────────────────────────────
  const CodeBlock = ({ code, title, id }: { code: string; title: string; id: string }) => (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700">
        <span className="text-sm font-mono text-slate-700 dark:text-slate-300 font-medium">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="px-3 py-1 rounded-md text-xs transition-all flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
        >
          {copiedId === id ? <Check size={12} /> : <Copy size={12} />}
          {copiedId === id ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="bg-white dark:bg-[#0a0a0b] p-4 overflow-x-auto">
        {highlightSyntax(code)}
      </div>
    </div>
  );

  // ─── Table component ────────────────────────────────────────────────────
  const Table = ({ headers, rows, title }: { headers: string[]; rows: string[][]; title?: string }) => (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
      {title && (
        <div className="px-4 py-2 font-semibold bg-slate-100 dark:bg-[#1a1a1a] border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          {title}
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead className="bg-slate-100 dark:bg-[#1a1a1a]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="border border-slate-200 dark:border-slate-700 p-3 text-left font-semibold text-slate-800 dark:text-slate-200">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white dark:bg-[#0a0a0b]' : 'bg-slate-50 dark:bg-[#121212]'}>
              {row.map((cell, j) => (
                <td key={j} className="border border-slate-200 dark:border-slate-700 p-3 text-slate-700 dark:text-slate-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── Simple Graph SVG Component ────────────────────────────────────────
  const GraphSVG: React.FC<{
    nodes: { id: string; x: number; y: number; label?: string }[];
    edges: { from: string; to: string; weight?: number; directed?: boolean }[];
    width?: number;
    height?: number;
  }> = ({ nodes, edges, width = 400, height = 300 }) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto my-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600">
        {/* Draw edges */}
        {edges.map((edge, idx) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          return (
            <g key={idx}>
              <line
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={edge.directed ? "#3b82f6" : "#6b7280"}
                strokeWidth="2"
                markerEnd={edge.directed ? "url(#arrowhead)" : undefined}
              />
              {edge.weight !== undefined && (
                <text
                  x={(from.x + to.x) / 2 + 5}
                  y={(from.y + to.y) / 2 - 5}
                  fill="#f59e0b"
                  fontSize="12"
                  className="font-mono"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        {/* Draw nodes */}
        {nodes.map(node => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="18" fill="#1e1e2e" stroke="#3b82f6" strokeWidth="2" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fill="white" fontSize="12" className="font-mono">
              {node.label || node.id}
            </text>
          </g>
        ))}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
          </marker>
        </defs>
      </svg>
    );
  };

  // ─── Code snippets for algorithms ──────────────────────────────────────
  const dfsCode = `void DFS(int node, vector<bool>& visited, vector<int> adj[]) {
    visited[node] = true;
    cout << node << " ";
    for (int neighbor : adj[node]) {
        if (!visited[neighbor]) {
            DFS(neighbor, visited, adj);
        }
    }
}`;

  const bfsCode = `void BFS(int start, vector<int> adj[], int V) {
    vector<bool> visited(V, false);
    queue<int> q;
    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << " ";
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <Network size={14} className="inline mr-1" /> GRAPH DATA STRUCTURE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 8{' '}
            <span className="text-orange-300 font-bold italic">
              Simply Easy Graphs
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master graph data structures: traversals (DFS, BFS), representations,
            MST algorithms, shortest paths, and transitive closure.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Network size={14} className="inline mr-1" /> Graph
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Traversals
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, algorithm, or representation..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} className="text-indigo-200" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ─── Sticky Navigation ────────────────────────────────────────────── */}
      <NavTabs />

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Graphs
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A <span className="font-bold">graph</span> is a non‑linear data structure consisting of
                    <strong> vertices (nodes)</strong> and <strong>edges</strong> that connect them. Graphs
                    model relationships between objects and are used in social networks, transportation,
                    communication, and many other domains.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Components of a Graph</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Vertices (Nodes):</strong> Fundamental units representing entities.</li>
                  <li><strong>Edges:</strong> Connect pairs of vertices; can be directed or undirected.</li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  A graph is like a map of cities (vertices) connected by roads (edges). Some roads are one‑way
                  (directed), some have tolls (weighted), and some form loops (cycles).
                </p>
              </div>
            </div>

            {/* ─── Section 2: Types of Graphs ────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['types'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Types of Graphs
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Undirected Graph: Edges have no direction.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Directed Graph: Edges have a direction (A→B ≠ B→A).</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Weighted Graph: Edges have associated weights/costs.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Unweighted Graph: Edges have no weights.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Cyclic Graph: Contains at least one cycle.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Acyclic Graph: Contains no cycles.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Connected Graph: All vertices reachable from any other.</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Disconnected Graph: Some vertices are isolated.</span>
                </div>
              </div>
            </div>

            {/* ─── Section 3: Graph Traversals ───────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['traversals'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Graph Traversals
              </h2>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                Graph traversals systematically visit all nodes and edges. They are fundamental for searching,
                pathfinding, and cycle detection.
              </p>

              <div className="mt-4 space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400">Depth‑First Search (DFS)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Explores as far as possible along each branch before backtracking. Uses a stack (or recursion). O(V+E).</p>
                  <div className="mt-3">
                    <CodeBlock code={dfsCode} title="DFS (C++)" id="dfsCode" />
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-green-600 dark:text-green-400">Breadth‑First Search (BFS)</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Explores all neighbors at current depth before moving to next level. Uses a queue. O(V+E).</p>
                  <div className="mt-3">
                    <CodeBlock code={bfsCode} title="BFS (C++)" id="bfsCode" />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Traversal Issues</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Disconnected Graphs:</strong> Not all nodes reachable from one source.</li>
                  <li><strong>Cyclic Graphs:</strong> Need to track visited nodes to avoid infinite loops.</li>
                  <li><strong>Re‑visitation:</strong> Mark nodes visited to process each once.</li>
                </ul>
              </div>
            </div>

            {/* ─── Section 4: Graph Representations ──────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['representations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Graph Representations
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Adjacency List</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Array of lists; each vertex stores its neighbors. Efficient for sparse graphs. Space O(V+E).</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Adjacency Matrix</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">2D array of size V×V; adj[i][j]=1 if edge exists. Efficient for dense graphs. Space O(V²). Edge query O(1).</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Comparison</h4>
                <Table
                  headers={["Feature", "Adjacency Matrix", "Adjacency List"]}
                  rows={[
                    ["Storage Space", "O(V²)", "O(V+E)"],
                    ["Adding a Vertex", "O(V²)", "O(1)"],
                    ["Adding an Edge", "O(1)", "O(1)"],
                    ["Removing an Edge", "O(1)", "O(E)"],
                    ["Edge Existence Query", "O(1)", "O(V)"],
                  ]}
                  title="Matrix vs List"
                />
              </div>
            </div>

            {/* ─── Section 5: Topological Sorting ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['topological'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Topological Sorting
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  A topological sort is a linear ordering of vertices in a <strong>Directed Acyclic Graph (DAG)</strong>
                  such that for every directed edge u→v, u comes before v. Used in task scheduling and dependency resolution.
                </p>
                <div className="mt-4">
                  <GraphSVG
                    nodes={[
                      {id:"5",x:80,y:50},{id:"4",x:220,y:50},{id:"2",x:150,y:150},{id:"3",x:280,y:150},
                      {id:"1",x:80,y:250},{id:"0",x:220,y:250}
                    ]}
                    edges={[
                      {from:"5",to:"2",directed:true},{from:"5",to:"0",directed:true},
                      {from:"4",to:"0",directed:true},{from:"4",to:"1",directed:true},
                      {from:"2",to:"3",directed:true},{from:"3",to:"1",directed:true}
                    ]}
                    width={350} height={320}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Example ordering:</strong> 5 → 4 → 2 → 3 → 1 → 0
                </p>
              </div>
            </div>

            {/* ─── Section 6: Algorithms Overview ────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['algorithms'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Graph Algorithms Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Warshall's Algorithm</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Dynamic programming to find transitive closure (O(V³)).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Dijkstra's Algorithm</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Greedy algorithm for shortest paths from a source (no negative edges). O((V+E)log V).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Prim's Algorithm</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Greedy algorithm for Minimum Spanning Tree (MST). O(E log V).</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Kruskal's Algorithm</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Greedy MST algorithm using edge sorting and Union‑Find. O(E log E).</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">MST Example (Kruskal)</h4>
                <GraphSVG
                  nodes={[
                    {id:"0",x:50,y:80},{id:"1",x:150,y:30},{id:"2",x:250,y:80},{id:"3",x:350,y:30},
                    {id:"4",x:400,y:150},{id:"5",x:300,y:200},{id:"6",x:150,y:200},{id:"7",x:50,y:150},
                    {id:"8",x:200,y:130}
                  ]}
                  edges={[
                    {from:"7",to:"6",weight:1},{from:"8",to:"2",weight:2},{from:"6",to:"5",weight:2},
                    {from:"0",to:"1",weight:4},{from:"2",to:"5",weight:4},{from:"8",to:"6",weight:6},
                    {from:"2",to:"3",weight:7},{from:"7",to:"8",weight:7},{from:"0",to:"7",weight:8},
                    {from:"1",to:"2",weight:8},{from:"3",to:"4",weight:9},{from:"5",to:"4",weight:10},
                    {from:"1",to:"7",weight:11},{from:"3",to:"5",weight:14}
                  ]}
                  width={480} height={250}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Kruskal:</strong> Sorts edges by weight, adds if no cycle, until V‑1 edges.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Dijkstra's Shortest Path</h4>
                <GraphSVG
                  nodes={[
                    {id:"0",x:50,y:80},{id:"1",x:150,y:30},{id:"2",x:250,y:80},{id:"3",x:350,y:30},
                    {id:"4",x:400,y:150},{id:"5",x:300,y:200},{id:"6",x:150,y:200},{id:"7",x:50,y:150},
                    {id:"8",x:200,y:130}
                  ]}
                  edges={[
                    {from:"0",to:"1",weight:4},{from:"0",to:"7",weight:8},{from:"1",to:"2",weight:8},
                    {from:"1",to:"7",weight:11},{from:"2",to:"3",weight:7},{from:"2",to:"5",weight:4},
                    {from:"2",to:"8",weight:2},{from:"3",to:"4",weight:9},{from:"3",to:"5",weight:14},
                    {from:"4",to:"5",weight:10},{from:"5",to:"6",weight:2},{from:"6",to:"7",weight:1},
                    {from:"6",to:"8",weight:6},{from:"7",to:"8",weight:7}
                  ]}
                  width={480} height={250}
                />
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Distances from 0:</strong> 0→1:4, 0→2:12, 0→3:19, 0→4:21, 0→5:11, 0→6:9, 0→7:8, 0→8:14
                </p>
              </div>
            </div>

            {/* ─── Section 7: Transitive Closure ──────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['closure'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Transitive Closure
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The transitive closure of a directed graph is a matrix showing reachability between all vertex pairs.
                  It can be computed using <strong>Floyd‑Warshall</strong> algorithm in O(V³).
                </p>
                <div className="mt-4">
                  <GraphSVG
                    nodes={[{id:"0",x:100,y:100},{id:"1",x:300,y:100},{id:"2",x:200,y:250}]}
                    edges={[{from:"0",to:"1",directed:true},{from:"1",to:"2",directed:true}]}
                    width={400} height={300}
                  />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  In this graph, 0 reaches 1 and 2; 1 reaches 2. The closure matrix captures all reachabilities.
                </p>
              </div>
            </div>

            {/* ─── Section 8: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Graph Basics</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Vertex/Node:</strong> entity</li>
                    <li><strong>Edge:</strong> connection (directed/undirected)</li>
                    <li><strong>Weighted/Unweighted:</strong> edge costs</li>
                    <li><strong>Cyclic/Acyclic:</strong> contains cycles or not</li>
                    <li><strong>Connected/Disconnected:</strong> reachability</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Traversals & Algorithms</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>DFS:</strong> stack/recursive, O(V+E)</li>
                    <li><strong>BFS:</strong> queue, O(V+E)</li>
                    <li><strong>Dijkstra:</strong> shortest path, O((V+E)log V)</li>
                    <li><strong>Prim/Kruskal:</strong> MST, O(E log V)</li>
                    <li><strong>Topological Sort:</strong> DAG ordering</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Representations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Adjacency Matrix:</strong> O(V²) space, O(1) edge query</li>
                    <li><strong>Adjacency List:</strong> O(V+E) space, O(V) edge query</li>
                    <li><strong>Choose:</strong> dense → matrix, sparse → list</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Explain DFS vs BFS", "Compare adjacency matrix and list", and "Describe how Kruskal's
                      algorithm works" are common questions. Focus on time/space trade‑offs and real‑world
                      applications.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Traverse it. Connect it. Optimise it. Master it. 🚀</p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Graph Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-indigo-500 dark:text-indigo-400" />
                </button>
              </div>
              {randomTip && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {randomTip.title}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {randomTip.text}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
                📊 Quick Stats
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex justify-between">
                  <span>Sections</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Graph Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Key Algorithms</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Graphs are versatile and powerful. Choosing the right representation and traversal algorithm
                is key to performance. Practice implementing DFS, BFS, and MST algorithms to truly understand
                their mechanics and trade‑offs.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── Floating Scroll-to-Top ──────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            const scrollArea = document.getElementById('lesson-scroll-area');
            if (scrollArea) {
              scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Graphs</strong> model relationships with vertices and edges.
                Types include directed/undirected, weighted/unweighted, cyclic/acyclic, connected/disconnected.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Traversals</strong> – DFS (stack) and BFS (queue) – visit
                nodes in different orders. Both O(V+E).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Representations</strong> – adjacency matrix (O(V²)) vs
                adjacency list (O(V+E)) – choose based on graph density.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Key algorithms</strong> – Dijkstra (shortest path), Prim/Kruskal
                (MST), Warshall (transitive closure), Topological sort (DAG).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Exam success</strong> comes from understanding algorithm
                mechanics, complexity, and real‑world applications.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Simply Easy Graphs 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;
import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  IntroGraphDemo, GraphTypesGallery, TraversalDemo, RepresentationDemo,
  TopoSortDemo, DijkstraDemo, MstDemo, WarshallDemo,
} from './GraphDemos';
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

const IntroBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
    <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{children}</p>
  </div>
);

const Point: React.FC<{ n: number; title: string; simple: string; children: React.ReactNode }> = ({ n, title, simple, children }) => (
  <div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{n}. {title}</h3>
    <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
      {children}
      <br />
      In simple words: {simple}
    </p>
  </div>
);

const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{children}</p>
);

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome8: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
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
        <div className="grid grid-cols-1 gap-8">
          {/* Left column: sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* ─── Section 1: Introduction */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Graphs
              </h2>

              <IntroBox>
                A <span className="font-bold">graph</span> is a way of showing things and the connections between them. The
                things are called <strong>vertices</strong> (or nodes) and the connections are called <strong>edges</strong>.
                Graphs are used for maps, social networks, the internet and much more.
              </IntroBox>

              <Lead>A graph has two parts:</Lead>

              <Point n={1} title="Vertices (Nodes)" simple="each dot is one thing. It could be a city, a person, a computer or a web page.">
                The vertices are the basic units of a graph. Each one stands for an object.
              </Point>

              <Point n={2} title="Edges" simple="a line between two dots that says &quot;these two are connected&quot;. If the line has an arrow, you can only travel one way.">
                An edge connects a pair of vertices. It can be directed (one way) or undirected (two way).
              </Point>

              <IntroGraphDemo />

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of a map. The cities are vertices and the roads are edges. Some roads are one-way (directed), some
                  cost a toll (weighted), and some lead you back to where you started (cycles).
                </p>
              </div>

            </div>

            {/* ─── Section 2: Types of Graphs */}
            <div
              ref={(el) => { sectionRefs.current['types'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Types of Graphs
              </h2>

              <IntroBox>
                Graphs come in different kinds. They come in four opposite pairs: <strong>undirected or directed</strong>,
                <strong> weighted or unweighted</strong>, <strong>cyclic or acyclic</strong>, and
                <strong> connected or disconnected</strong>. Watch each one below.
              </IntroBox>

              <GraphTypesGallery />

            </div>

            {/* ─── Section 3: Graph Traversals */}
            <div
              ref={(el) => { sectionRefs.current['traversals'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Graph Traversals
              </h2>

              <IntroBox>
                A <span className="font-bold">traversal</span> is a way of visiting every vertex in a graph, one at a time,
                without getting lost. Traversals are used for searching, finding paths and spotting cycles.
              </IntroBox>

              <Lead>There are two main ways to do it:</Lead>

              <Point n={1} title="Breadth-First Search (BFS)" simple="like ripples on a pond. The search spreads out one ring at a time, so it always finds the closest vertices first.">
                Visits all the neighbours of a vertex first, then the neighbours of those neighbours, and so on. It uses a
                queue. Time: O(V + E).
              </Point>

              <Point n={2} title="Depth-First Search (DFS)" simple="like exploring a maze. Keep walking until you hit a dead end, then go back to the last junction and try another way.">
                Goes as deep as it can along one path, then backtracks and tries another. It uses a stack (or recursion).
                Time: O(V + E).
              </Point>

              <TraversalDemo />

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">BFS and DFS side by side</h3>
                <Table
                  headers={["Feature", "BFS", "DFS"]}
                  rows={[
                    ["Data structure", "Queue (first in, first out)", "Stack (last in, first out)"],
                    ["How it moves", "Level by level", "Deep first, then backtrack"],
                    ["Shortest path (unweighted)", "Yes", "No"],
                    ["Time", "O(V + E)", "O(V + E)"],
                  ]}
                />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">The code</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed mb-3">
                  Both functions use a <code>visited</code> list so that no vertex is processed twice.
                </p>
                <div className="space-y-4">
                  <CodeBlock code={dfsCode} title="DFS (C++)" id="dfsCode" />
                  <CodeBlock code={bfsCode} title="BFS (C++)" id="bfsCode" />
                </div>
              </div>

              <Lead>Three things can go wrong if you are not careful:</Lead>

              <Point n={1} title="Cyclic Graphs" simple="if the graph has a loop and you forget which vertices you have seen, you will walk round and round forever.">
                Keep track of visited vertices so you never get stuck in a cycle.
              </Point>

              <Point n={2} title="Disconnected Graphs" simple="if the graph is made of separate islands, one search only finds the island it started on.">
                Not every vertex can be reached from one starting point. Start a new search from every vertex that is still unvisited.
              </Point>

              <Point n={3} title="Re-visiting Vertices" simple="mark a vertex as soon as you see it, so each one is handled exactly once.">
                Without a visited mark, the same vertex would be processed many times.
              </Point>

            </div>

            {/* ─── Section 4: Graph Representations */}
            <div
              ref={(el) => { sectionRefs.current['representations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Graph Representations
              </h2>

              <IntroBox>
                A computer cannot look at a picture of a graph. The graph has to be stored in memory. There are two common
                ways to do it: an <strong>adjacency list</strong> and an <strong>adjacency matrix</strong>.
              </IntroBox>

              <Point n={1} title="Adjacency List" simple="each vertex keeps a list of its neighbours, like a contact list. It is a good choice when there are few edges (a sparse graph).">
                An array of lists. Each vertex stores the vertices it is connected to. Space: O(V + E).
              </Point>

              <Point n={2} title="Adjacency Matrix" simple="a grid with a row and a column for every vertex. A 1 means &quot;connected&quot;. You can check any pair in one look. It is a good choice when there are many edges (a dense graph).">
                A V × V table. adj[i][j] = 1 if there is an edge from i to j. Space: O(V²). Checking an edge: O(1).
              </Point>

              <RepresentationDemo />

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Which one should I use?</h3>
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
                <p className="mt-3 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Rule of thumb: many edges, use a matrix. Few edges, use a list.
                </p>
              </div>

            </div>

            {/* ─── Section 5: Topological Sorting */}
            <div
              ref={(el) => { sectionRefs.current['topological'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Topological Sorting
              </h2>

              <IntroBox>
                A <span className="font-bold">topological sort</span> puts the vertices of a Directed Acyclic Graph (DAG) in a
                line so that every arrow points forward. If there is an arrow from u to v, then u comes before v. It is used
                for task scheduling and for working out which thing to build first.
              </IntroBox>

              <Point n={1} title="The idea" simple="think of getting dressed. Socks come before shoes, and trousers come before a belt. A topological sort finds an order where nothing is done before the thing it depends on.">
                Each arrow means "this must happen first".
              </Point>

              <Point n={2} title="Why it needs a DAG" simple="if the arrows form a loop, you would need A before B and B before A at the same time, which is impossible.">
                A topological order only exists when the graph is directed and has no cycles.
              </Point>

              <TopoSortDemo />

              <Lead>
                This animation uses Kahn&apos;s algorithm: repeatedly pick a vertex with nothing left to wait for, add it to the
                order, and remove its arrows.
              </Lead>

            </div>

            {/* ─── Section 6: Algorithms Overview */}
            <div
              ref={(el) => { sectionRefs.current['algorithms'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Graph Algorithms Overview
              </h2>

              <IntroBox>
                Once a graph is stored, we can ask smart questions about it. These three algorithms answer the most common
                ones: &quot;what is the shortest route?&quot; and &quot;what is the cheapest way to connect everything?&quot;
              </IntroBox>

              <Point n={1} title="Dijkstra's Algorithm" simple="always walk to the closest place you have not finished yet, then check whether going through it gives anyone a shorter route. It does not work with negative weights.">
                A greedy algorithm that finds the shortest path from one source to every other vertex. Time: O((V+E) log V).
              </Point>

              <Point n={2} title="Prim's Algorithm" simple="start with one vertex and keep growing a single tree, always adding the cheapest edge that reaches a new vertex.">
                A greedy algorithm that builds a Minimum Spanning Tree (MST). Time: O(E log V).
              </Point>

              <Point n={3} title="Kruskal's Algorithm" simple="sort all edges from cheapest to most expensive and take each one, unless it would make a loop.">
                A greedy MST algorithm that sorts the edges and uses Union-Find to detect cycles. Time: O(E log E).
              </Point>

              <DijkstraDemo />

              <Lead>
                A Minimum Spanning Tree connects every vertex using the smallest possible total weight, with no loops. Kruskal
                and Prim take different routes but reach the same total here.
              </Lead>

              <MstDemo />

            </div>

            {/* ─── Section 7: Transitive Closure */}
            <div
              ref={(el) => { sectionRefs.current['closure'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Transitive Closure
              </h2>

              <IntroBox>
                The <span className="font-bold">transitive closure</span> of a directed graph is a table that shows whether you
                can get from one vertex to another by following one or more arrows. Warshall&apos;s algorithm builds it in O(V³).
              </IntroBox>

              <Point n={1} title="The idea" simple="if A can reach B, and B can reach C, then A can reach C. Warshall keeps adding these shortcuts until nothing new appears.">
                Reachability is passed along: a chain of arrows counts as a connection.
              </Point>

              <Point n={2} title="How Warshall works" simple="pick one vertex at a time as a stepping stone, and ask who can now reach someone new by going through it.">
                For every vertex k, and every pair (i, j): if i reaches k and k reaches j, then i reaches j.
              </Point>

              <WarshallDemo />

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
                    <li><strong>Vertex/Node:</strong> a thing (a dot)</li>
                    <li><strong>Edge:</strong> a connection (one way or two way)</li>
                    <li><strong>Weighted/Unweighted:</strong> edges have a cost, or they do not</li>
                    <li><strong>Cyclic/Acyclic:</strong> has a loop, or has no loops</li>
                    <li><strong>Connected/Disconnected:</strong> everything can be reached, or some parts cannot</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Traversals & Algorithms</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>DFS:</strong> goes deep first, uses a stack or recursion, O(V+E)</li>
                    <li><strong>BFS:</strong> goes level by level, uses a queue, O(V+E)</li>
                    <li><strong>Dijkstra:</strong> shortest path from one vertex, O((V+E)log V)</li>
                    <li><strong>Prim/Kruskal:</strong> cheapest way to connect everything (MST), about O(E log V)</li>
                    <li><strong>Topological Sort:</strong> puts a DAG in order, so every arrow points forward</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Representations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Adjacency Matrix:</strong> a grid, O(V²) space, O(1) to check an edge</li>
                    <li><strong>Adjacency List:</strong> a list of neighbours, O(V+E) space, O(V) to check an edge</li>
                    <li><strong>Choose:</strong> many edges → matrix, few edges → list</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Explain DFS vs BFS", "Compare adjacency matrix and list", and "Describe how Kruskal's
                      algorithm works" are common questions. Focus on the trade-offs in time and memory, and give
                      real-life examples.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Traverse it. Connect it. Optimise it. Master it. 🚀</p>
              </div>
            </div>
          </div>
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
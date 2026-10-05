import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { FamilyTreeAnimation } from './FamilyTreeAnimation';
import { TreeTypesGallery } from './TreeTypesGallery';
import { TreeOperationsDemo } from './TreeOperationsDemo';
import {
  TreeDeciduous,
  GitBranch,
  Search,
  Code,
  Lightbulb,
  GraduationCap,
  Table,
  List,
  Copy,
  Check,
  Brain,
  ChevronUp,
  BookOpen,
  X,
  Layers,
  Workflow,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Intro' },
  { id: 'properties', label: 'Properties' },
  { id: 'types', label: 'Types' },
  { id: 'operations', label: 'Operations' },
  { id: 'applications', label: 'Applications' },
  { id: 'exam-tips', label: 'Exam Tips' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome7: React.FC = () => {
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
        text: 'Binary Search Trees (BSTs) are the foundation for many efficient algorithms and are used in databases, file systems, and compilers.',
      },
      {
        title: 'Pro Tip',
        text: 'Inorder traversal of a BST yields sorted order – a great trick for sorting data without explicit sorting algorithms.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember tree traversals: Preorder = Root first, Inorder = Left, Root, Right, Postorder = Left, Right, Root.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to balance a BST can lead to O(n) performance – use self‑balancing trees like AVL or Red‑Black for guaranteed log n.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Binary Search Trees (BSTs) are the foundation for many efficient algorithms and are used in databases, file systems, and compilers.',
      },
      {
        title: 'Pro Tip',
        text: 'Inorder traversal of a BST yields sorted order – a great trick for sorting data without explicit sorting algorithms.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember tree traversals: Preorder = Root first, Inorder = Left, Root, Right, Postorder = Left, Right, Root.',
      },
      {
        title: 'Common Mistake',
        text: 'Forgetting to balance a BST can lead to O(n) performance – use self‑balancing trees like AVL or Red‑Black for guaranteed log n.',
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

  // ─── Syntax highlighting (same as LO1) ────────────────────────────────
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

    const types = ['int', 'char', 'double', 'float', 'bool', 'void', 'string', 'Node'];
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g');
    escaped = escaped.replace(typeRegex, '<span class="text-[#1d4ed8] dark:text-[#4ec9b0]">$1</span>');

    // Preprocessor
    escaped = escaped.replace(/^#include.*$/gm, '<span class="text-[#c586c0]">$&</span>');

    // Methods
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

  // ─── Code snippets (optional – we'll include a simple traversal example) ──
  const traversalCode = `#include <iostream>
using namespace std;

// A node holds a number and two arrows: left and right
struct Node {
    int data;
    Node* left = nullptr;
    Node* right = nullptr;
    Node(int d) { data = d; }
};

// Inorder: Left, Root, Right
void inorder(Node* n) {
    if (n == nullptr) return;   // empty spot, stop
    inorder(n->left);           // 1. go left
    cout << n->data << " ";     // 2. say this node
    inorder(n->right);          // 3. go right
}

// Preorder: Root, Left, Right
void preorder(Node* n) {
    if (n == nullptr) return;
    cout << n->data << " ";     // say this node first
    preorder(n->left);
    preorder(n->right);
}

// Postorder: Left, Right, Root
void postorder(Node* n) {
    if (n == nullptr) return;
    postorder(n->left);
    postorder(n->right);
    cout << n->data << " ";     // say this node last
}

int main() {
    // The tree:  1 <- 2 -> 3   (2 is the root)
    Node* root = new Node(2);
    root->left = new Node(1);
    root->right = new Node(3);

    inorder(root);    // 1 2 3
    cout << endl;
    preorder(root);   // 2 1 3
    cout << endl;
    postorder(root);  // 1 3 2
    cout << endl;
}`;

  // ─── Return ─────────────────────────────────────────────────────────────
  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#312e81] dark:bg-[#1e1b4b] border-b border-indigo-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <TreeDeciduous size={14} className="inline mr-1" /> TREE DATA STRUCTURE
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Learning Outcome 7{' '}
            <span className="text-indigo-300 font-bold italic">
              Tree Data Structure
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Master tree data structures: binary trees, BSTs, traversals,
            operations, and applications. Learn to leverage trees for efficient
            searching, sorting, and hierarchical data representation.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <TreeDeciduous size={14} className="inline mr-1" /> Trees
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> BST
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
                placeholder="Search for a concept, traversal, or property..."
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
            {/* ─── Section 1: Introduction ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['intro'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 uppercase">
                Introduction to Tree Data Structures
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A <span className="font-bold">tree</span> is a non‑linear data structure that consists of
                    nodes connected by edges. It resembles an inverted tree, with a <strong>root</strong> node
                    at the top and branches extending downwards. Each node can have zero or more child nodes.
                    Trees are used to represent hierarchical relationships, enable efficient searching, and
                    support many algorithms.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="text-amber-600 dark:text-amber-400" size={20} />
                  <span className="font-black uppercase text-amber-800 dark:text-amber-300">Simple Analogy</span>
                </div>
                <p className="text-amber-900 dark:text-amber-100 italic">
                  Think of a tree like a family tree: you have ancestors (root), parents (internal nodes), and
                  children (child nodes). Each person can have children, forming a hierarchical structure.
                </p>
                <FamilyTreeAnimation />
              </div>
            </div>

            {/* ─── Section 2: Properties ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['properties'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Properties of a Tree
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold">Tree properties</span> are the words we use to describe where a node
                  sits and how big a tree is. Picture a family tree and each word will make sense.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                There are eight terms to know:
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Root Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The root is the topmost node of the tree.
                  <br />
                  In simple words: It is the oldest ancestor. Everything else grows down from here, and it is the only node with no parent.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Parent Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  A parent is a node that has one or more child nodes.
                  <br />
                  In simple words: Anyone who has kids. A node can be a parent and also somebody else's child.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Child Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  A child is a node that has a parent node.
                  <br />
                  In simple words: Anyone who sits directly below another node. Every node except the root is a child.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Leaf Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  A leaf is a node with no children.
                  <br />
                  In simple words: The end of a branch, like a leaf on a real tree. Nothing grows below it.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Degree of a Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The degree is the number of children a node has.
                  <br />
                  In simple words: Just count the kids. A node with 2 children has degree 2, and a leaf has degree 0.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">6. Level of a Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The level is the distance of a node from the root (the root is level 0).
                  <br />
                  In simple words: Which generation it belongs to. Root is generation 0, its children are level 1, grandchildren level 2, and so on.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">7. Height of a Tree</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The height is the maximum level of any node (or the most edges from the root).
                  <br />
                  In simple words: How many steps it takes to get from the root to the furthest leaf. A taller tree means a longer walk to the deepest node.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">8. Depth of a Node</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  The depth is the number of edges from the root to the node.
                  <br />
                  In simple words: How far down a node is. Count the lines you cross walking from the root to it.
                </p>
              </div>
            </div>

            {/* ─── Section 3: Types of Trees ─────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['types'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Types of Trees
              </h2>

              <TreeTypesGallery />

              <div className="space-y-6">

                <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Binary trees</span> are the most common kind of tree. Every node can have at most two children.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Binary Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Each node has at most two children (left and right).
                    <br />
                    In simple words: Every parent has room for two kids, a left one and a right one, and may have fewer.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Binary Search Tree (BST)</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    The left subtree contains keys less than the root; the right subtree contains keys greater than the root. This makes search, insert and delete efficient (O(log n) on average).
                    <br />
                    In simple words: Small values go left, big values go right. Because of that, you can ignore half the tree at every step when searching.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Complete Binary Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    All levels are completely filled except possibly the last, which is filled from left to right.
                    <br />
                    In simple words: Fill each row fully before starting the next one, always from the left, with no gaps in the middle.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Full Binary Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    Every node has either 0 or 2 children.
                    <br />
                    In simple words: No node is left with just one child. It either has two or none.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Perfect Binary Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    All internal nodes have 2 children and all leaves are at the same level.
                    <br />
                    In simple words: A perfectly neat triangle where every row is completely full.
                  </p>
                </div>

                <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold">Specialized trees</span> add extra rules so they stay fast or suit a particular job.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. AVL Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    A self-balancing BST where the heights of the left and right subtrees differ by at most 1.
                    <br />
                    In simple words: It checks itself after every change. If one side gets too tall, it rotates nodes to even things out.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Red-Black Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    A self-balancing BST that uses colors (red and black) to maintain balance.
                    <br />
                    In simple words: Each node is red or black, and simple colour rules stop the tree from leaning too far to one side.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. B-Tree</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    A self-balancing tree used in databases and file systems, where nodes can have many children.
                    <br />
                    In simple words: Each node holds many sorted keys, so the tree is short and wide. That means fewer reads from the disk.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Heap</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    A complete binary tree that satisfies the heap property (max-heap or min-heap).
                    <br />
                    In simple words: In a max-heap the biggest value is always at the top, and every parent is at least as big as its children.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Trie</h3>
                  <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    A tree used for storing strings, where each node represents a character.
                    <br />
                    In simple words: Words are spelled by walking down the letters. Words that start the same, like cat and car, share the same path.
                  </p>
                </div>
              </div>
            </div>

            {/* ─── Section 4: Operations ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['operations'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Binary Tree Operations
              </h2>

              <TreeOperationsDemo />

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-6">
                <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Example: Tree Traversal in C++</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">The three traversals on a tiny tree. Each one is just three lines; only the order of those lines changes.</p>
                <CodeBlock code={traversalCode} title="tree_traversals.cpp" id="traversalCode" />
              </div>
            </div>

            {/* ─── Section 5: Applications ────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['applications'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Applications of Trees
              </h2>

              <div className="flex items-start gap-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold">Trees are everywhere.</span> Whenever data has a hierarchy, or needs to be
                  searched quickly, there is usually a tree working behind the scenes.
                </p>
              </div>

              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                Here are eight places you will find them:
              </p>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">1. Efficient Searching</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  BSTs provide O(log n) search on average.
                  <br />
                  In simple words: Every step throws away half of the tree, so even a million values need only about 20 comparisons.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">2. Sorting</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  An inorder traversal yields a sorted list.
                  <br />
                  In simple words: Put the numbers in a BST, then read them left, root, right. They come out in order, like magic.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">3. Symbol Tables</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Trees are used to store key-value pairs efficiently.
                  <br />
                  In simple words: Think of a phone book: look up a name (the key) and quickly get the number (the value). Compilers use this to remember variable names.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">4. Set and Map Implementations</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Many standard library containers (e.g., std::map, std::set) are based on balanced BSTs.
                  <br />
                  In simple words: When you use a map in C++, a self-balancing tree is quietly doing the work underneath.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">5. Huffman Coding</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Trees are used in compression algorithms.
                  <br />
                  In simple words: Common letters get short codes and rare letters get long codes, all read off a tree. That is how files get smaller when zipped.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">6. Database Indexing</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  B-trees and B+-trees are fundamental for indexing.
                  <br />
                  In simple words: Like the index at the back of a book: instead of reading every page, you jump straight to the right one.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">7. File Systems</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Directories and file structures are often represented as trees.
                  <br />
                  In simple words: Folders inside folders inside folders. The drive is the root, folders are parents and files are leaves.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">8. Artificial Intelligence</h3>
                <p className="pl-5 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  Decision trees and game trees are used in AI.
                  <br />
                  In simple words: A chain of yes/no questions that leads to an answer, or a map of every possible move in a game like chess.
                </p>
              </div>
            </div>

            {/* ─── Section 6: Exam Tips ──────────────────────────────────── */}
            <div
              ref={(el) => { sectionRefs.current['exam-tips'] = el; }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase">
                Exam Tips & Cheat Sheet
              </h2>

              <div className="space-y-3">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Tree Basics</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Root:</strong> top node</li>
                    <li><strong>Leaf:</strong> no children</li>
                    <li><strong>Parent/Child:</strong> hierarchical relation</li>
                    <li><strong>Degree:</strong> number of children</li>
                    <li><strong>Level/Depth:</strong> distance from root</li>
                    <li><strong>Height:</strong> maximum level</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 BST Operations</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Insertion:</strong> O(log n) average</li>
                    <li><strong>Deletion:</strong> O(log n) average</li>
                    <li><strong>Search:</strong> O(log n) average</li>
                    <li><strong>Traversals:</strong> Inorder (sorted), Preorder, Postorder</li>
                    <li><strong>Balance:</strong> AVL, Red‑Black for guaranteed O(log n)</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">📌 Applications</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li>Efficient searching & sorting</li>
                    <li>Symbol tables, sets, maps</li>
                    <li>Huffman coding</li>
                    <li>Database indexing (B‑trees)</li>
                    <li>Autocomplete (Trie)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <div className="flex items-start gap-3">
  <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Exam Tip</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "Explain the properties of a BST and its operations" and "Compare tree traversals" are
                      common questions. Know the time complexities and when to use each traversal. Also,
                      understand the importance of balancing for performance.
                    </p>
</div>
              </div>

              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg text-center">
                <p className="text-xl font-bold">Branch it. Search it. Traverse it. Master it. 🚀</p>
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
                <strong className="text-white">Trees</strong> are hierarchical data structures with nodes and edges.
                Binary trees restrict each node to at most two children.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Binary Search Trees (BSTs)</strong> maintain order – left subtree
                contains smaller keys, right subtree larger keys – enabling O(log n) search on average.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Traversals</strong> – Inorder (sorted), Preorder (copy), Postorder
                (delete) – serve different purposes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Balanced trees</strong> (AVL, Red‑Black) guarantee O(log n) operations
                even in worst case.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Applications</strong> range from databases and file systems to
                compression and AI – trees are everywhere in computing.
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
            Sidemann Academic Registry • Tree Data Structure 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome7;
import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  GitBranch,
  Github,
  Terminal,
  GitMerge,
  Upload,
  Download,
  Code,
  FolderTree,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Box,
  GitPullRequest,
  Cloud,
  Server,
  HardDrive,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  Lightbulb,
  RefreshCw,
  ChevronUp,
  AlertCircle,
  Layers,
  Target,
  FileCode,
  Link,
  Settings,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'repo-definition', label: 'Repository' },
  { id: 'git-vs-github', label: 'Git vs GitHub' },
  { id: 'install-setup', label: 'Install & Setup' },
  { id: 'commands', label: 'Commands' },
  { id: 'gui', label: 'GUI Tools' },
  { id: 'commit-messages', label: 'Commit Messages' },
  { id: 'deploy-push', label: 'Deploy & Push' },
  { id: 'pull', label: 'Pull Projects' },
  { id: 'feature-branches', label: 'Feature Branches' },
  { id: 'merging', label: 'Branch Merging' },
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
        text: 'Git was created by Linus Torvalds in 2005 to manage the development of the Linux kernel. It is now the most widely used version control system in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'Always write clear commit messages. A good commit message explains WHAT changed and WHY. Use the imperative mood: "Add feature" not "Added feature".',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the basic Git workflow: git add → git commit → git push. Add changes to staging, commit them locally, then push to remote.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to git pull before starting work on a feature branch. This ensures you have the latest changes from the main branch and reduces merge conflicts.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Git was created by Linus Torvalds in 2005 to manage the development of the Linux kernel. It is now the most widely used version control system in the world.',
      },
      {
        title: 'Pro Tip',
        text: 'Always write clear commit messages. A good commit message explains WHAT changed and WHY. Use the imperative mood: "Add feature" not "Added feature".',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the basic Git workflow: git add → git commit → git push. Add changes to staging, commit them locally, then push to remote.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t forget to git pull before starting work on a feature branch. This ensures you have the latest changes from the main branch and reduces merge conflicts.',
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

  // ─── Main container classes ─────────────────────────────────────────────
  const containerClasses = isDarkMode
    ? 'min-h-screen bg-[#0a0a0b] text-slate-200'
    : 'min-h-screen bg-slate-50 text-slate-900';

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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Helper for table rows
  const rowBg = (index: number) => {
    const even = index % 2 === 0;
    return isDarkMode 
      ? (even ? 'bg-gray-800' : 'bg-gray-750') 
      : (even ? 'bg-white' : 'bg-gray-50');
  };
  const theadBg = isDarkMode ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#7c2d12] dark:bg-[#431407] border-b border-orange-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <GitBranch size={14} className="inline mr-1" /> LEARNING OUTCOME 8
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Git, GitHub &{' '}
            <span className="text-orange-300 font-bold italic">
              Branching Strategies
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Master Git repositories, GitHub, commands, GUI tools, commit messages, feature branches, merging, and deployment workflows.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitBranch size={14} className="inline mr-1" /> Git &amp; GitHub
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <GitMerge size={14} className="inline mr-1" /> Branching &amp; Merging
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Cloud size={14} className="inline mr-1" /> Deployments
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, git, branch, merge..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
          {/* List of sections */}
          <div ref={listContainerRef} className="space-y-12">
            {/* Section 1: Defining a Git Repository */}
            <div
              ref={(el) => {
                sectionRefs.current['repo-definition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Defining a Git Repository
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A Git repository is a central location where developers store and manage their code. It acts as a version control system, tracking changes made to the code over time and allowing for collaboration among multiple developers.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Ways of Getting a Git Repository</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Create a New Repository:</span> Using the Git command line or a graphical interface.</li>
                  <li><span className="font-bold">Clone an Existing Repository:</span> Using the <code>git clone</code> command.</li>
                  <li><span className="font-bold">Use a Hosting Service:</span> GitHub, GitLab, or Bitbucket.</li>
                </ul>
              </div>
            </div>

            {/* Section 2: Git vs GitHub */}
            <div
              ref={(el) => {
                sectionRefs.current['git-vs-github'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Distinguishing Between Git and GitHub
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead className={theadBg}>
                    <tr>
                      <th className="border p-2 text-left font-bold">Feature</th>
                      <th className="border p-2 text-left font-bold">Git</th>
                      <th className="border p-2 text-left font-bold">GitHub</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Definition', 'Version control system for tracking code changes', 'Web-based hosting service for Git repositories'],
                      ['Functionality', 'Branching, merging, committing changes', 'Collaboration, issue tracking, project management'],
                      ['Location', 'Can be local or remote', 'Always hosted remotely'],
                      ['Accessibility', 'Requires Git installed on your machine', 'Accessible via web browser'],
                      ['Cost', 'Free for local repositories', 'Free for public; subscription for private'],
                    ].map((item, idx) => (
                      <tr key={item[0]} className={rowBg(idx)}>
                        <td className="border p-2 font-bold">{item[0]}</td>
                        <td className="border p-2">{item[1]}</td>
                        <td className="border p-2">{item[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Installing and Setting Up Git */}
            <div
              ref={(el) => {
                sectionRefs.current['install-setup'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Installing and Setting Up Git
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Download Git:</span> Download the appropriate installer from the official Git website.</li>
                  <li><span className="font-bold">Run the Installer:</span> Follow the on-screen instructions to install Git.</li>
                  <li><span className="font-bold">Configure Git:</span> Use <code>git config</code> to set your name and email.</li>
                  <li><span className="font-bold">Create a Repository:</span> Use <code>git init</code> in your desired directory.</li>
                  <li><span className="font-bold">Add Files:</span> Use <code>git add</code> to stage files.</li>
                  <li><span className="font-bold">Commit Changes:</span> Use <code>git commit -m "message"</code>.</li>
                  <li><span className="font-bold">Push to Remote:</span> Use <code>git push</code> to push to a remote repository.</li>
                </ul>
              </div>
            </div>

            {/* Section 4: Using Git Commands in Terminal */}
            <div
              ref={(el) => {
                sectionRefs.current['commands'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Using Git Commands in Terminal
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { cmd: 'git init', desc: 'Create a new Git repository' },
                    { cmd: 'git clone', desc: 'Clone an existing repository' },
                    { cmd: 'git add', desc: 'Add files to staging area' },
                    { cmd: 'git commit', desc: 'Commit changes to local repository' },
                    { cmd: 'git status', desc: 'Show current repository status' },
                    { cmd: 'git log', desc: 'Show commit history' },
                    { cmd: 'git diff', desc: 'Compare changes between commits' },
                    { cmd: 'git branch', desc: 'Create, list, or switch branches' },
                    { cmd: 'git merge', desc: 'Merge changes from one branch into another' },
                    { cmd: 'git push', desc: 'Push changes to remote repository' },
                    { cmd: 'git pull', desc: 'Fetch and merge from remote repository' },
                  ].map(({ cmd, desc }) => (
                    <div key={cmd} className="p-3 bg-gray-100 dark:bg-gray-700 rounded">
                      <code className="font-mono text-sm text-orange-600 dark:text-orange-400">{cmd}</code>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Evaluating Git GUI */}
            <div
              ref={(el) => {
                sectionRefs.current['gui'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Evaluating Git GUI Tools
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  A Git GUI provides a visual way to interact with Git repositories. While the CLI offers full control, a GUI can simplify tasks and make Git more accessible.
                </p>
                <h4 className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-3">Popular Git GUIs</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['GitKraken', 'GitHub Desktop', 'SourceTree', 'TortoiseGit'].map(item => (
                    <span key={item} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</span>
                  ))}
                </div>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Evaluation Factors</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Ease of Use', 'Features', 'Customisation', 'Integration', 'Platform Support'].map(item => (
                    <span key={item} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 6: Writing Clear Commit Messages */}
            <div
              ref={(el) => {
                sectionRefs.current['commit-messages'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Writing Clear and Concise Commit Messages
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Commit messages should be informative and concise, providing a clear explanation of the changes made. They are essential for tracking project history and collaborating with team members.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">Best Practices</h4>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>Use a clear and concise subject line that summarises changes</li>
                  <li>Write a detailed description explaining WHY the changes were made</li>
                  <li>Use the imperative mood: "Add feature" not "Added feature"</li>
                  <li>Avoid vague or generic messages</li>
                  <li>Keep commit messages short and to the point</li>
                  <li>Use consistent formatting and style</li>
                </ul>
              </div>
            </div>

            {/* Section 7: Deploying and Pushing Code */}
            <div
              ref={(el) => {
                sectionRefs.current['deploy-push'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Deploying and Pushing Code to an Online Repository
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Create a Repository:</span> On GitHub, GitLab, or Bitbucket.</li>
                  <li><span className="font-bold">Set Up Project:</span> Initialise Git and add remote tracking branches.</li>
                  <li><span className="font-bold">Make Changes:</span> Develop and test your code. Commit changes locally.</li>
                  <li><span className="font-bold">Push Changes:</span> Use <code>git push</code> to push to the remote repository.</li>
                  <li><span className="font-bold">CI Setup:</span> Configure continuous integration to trigger builds on push.</li>
                  <li><span className="font-bold">Deployment Configuration:</span> Set up scripts to automate deployment.</li>
                  <li><span className="font-bold">Deploy to Production:</span> Trigger the deployment process.</li>
                  <li><span className="font-bold">Testing and Verification:</span> Test the deployed application.</li>
                </ul>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <Lightbulb size={14} className="inline mr-1" />
                    <span className="font-bold">Additional Considerations:</span> Use a branching strategy (like GitFlow), set up different environments (dev/staging/prod), and implement monitoring and logging.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 8: Pulling Existing Projects */}
            <div
              ref={(el) => {
                sectionRefs.current['pull'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Pulling Existing Application Projects
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Pulling an existing application project involves retrieving the project's code and history from a remote location to your local machine.
                </p>
                <ul className="list-decimal pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Choose a Repository Hosting Service:</span> GitHub, GitLab, or Bitbucket.</li>
                  <li><span className="font-bold">Create a Local Repository:</span> Use <code>git clone</code>.</li>
                  <li><span className="font-bold">Specify the Repository URL:</span> Provide the remote URL.</li>
                  <li><span className="font-bold">Clone the Repository:</span> Execute <code>git clone</code> to download the code and history.</li>
                </ul>
              </div>
            </div>

            {/* Section 9: Applying Features Using Branches */}
            <div
              ref={(el) => {
                sectionRefs.current['feature-branches'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Applying Features Using Branches
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Feature branching allows each new feature to be developed on a separate branch, enabling independent work without affecting the main branch.
                </p>
                <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mt-3">7 Qualities of Feature Branch Deployments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {[
                    'Isolation – work without affecting main codebase',
                    'Collaboration – multiple developers work simultaneously',
                    'Risk Management – isolate experimental changes',
                    'Review and Approval – changes reviewed before merging',
                    'Continuous Integration – early conflict detection',
                    'Rollback – easily revert if problems arise',
                    'Flexibility – adapt to changing requirements',
                  ].map((item) => (
                    <div key={item} className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs text-slate-700 dark:text-slate-300">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mt-4">
                <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">Modeling Feature Branch Deployments in Octopus Deploy</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Configure Octopus:</span> Create a project, define environments, configure variables.</li>
                  <li><span className="font-bold">Create Deployment Steps:</span> Build, package, deploy, and configure steps.</li>
                  <li><span className="font-bold">Set Up Release Creation:</span> Define a release, assign deployment steps, configure variables.</li>
                  <li><span className="font-bold">Deploy the Release:</span> Trigger deployment, monitor progress, verify deployment.</li>
                </ul>
              </div>
            </div>

            {/* Section 10: Understanding Git Branch Merging */}
            <div
              ref={(el) => {
                sectionRefs.current['merging'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 inline-block uppercase">
                Understanding Git Branch Merging
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Git branching allows developers to work on different features or bug fixes independently. Once a feature is complete, it can be merged into the main branch.
                </p>
                <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-3">Steps to Merge Branches to Master</h4>
                <ul className="list-decimal pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><span className="font-bold">Create a Feature Branch:</span> <code>git branch feature-branch</code></li>
                  <li><span className="font-bold">Make Changes:</span> Work on the feature and commit regularly.</li>
                  <li><span className="font-bold">Pull from Main:</span> <code>git pull origin main</code> to stay up-to-date.</li>
                  <li><span className="font-bold">Merge Feature Branch:</span> <code>git checkout main</code> then <code>git merge feature-branch</code></li>
                  <li><span className="font-bold">Resolve Conflicts:</span> Use <code>git diff</code> to compare and resolve conflicts.</li>
                  <li><span className="font-bold">Commit the Merge:</span> Commit the merged changes.</li>
                  <li><span className="font-bold">Push to Remote:</span> <code>git push origin main</code></li>
                </ul>
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    <AlertCircle size={14} className="inline mr-1" />
                    <span className="font-bold">Additional Considerations:</span> Consider using <code>git rebase</code> vs <code>git merge</code>, squash commits, and thoroughly test after merging.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Git Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshCw size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Git Commands</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">11</span>
                </li>
                <li className="flex justify-between">
                  <span>Feature Branch Qualities</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Git is the version control system; GitHub is the hosting platform. Master the basic commands: init, clone, add, commit, push, pull, branch, merge. Write clear commit messages. Use feature branches to isolate work and merge carefully with conflict resolution. Version control is an essential skill for every developer.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Git vs GitHub</strong> – Git is the version control system; GitHub is the hosting platform for Git repositories.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Basic Workflow</strong> – <code>git add</code> → <code>git commit</code> → <code>git push</code>. Add changes, commit locally, push to remote.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Branching</strong> – Feature branches isolate work, enable collaboration, and reduce risk. Merge with care and resolve conflicts.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Commit Messages</strong> – Be clear and concise. Use the imperative mood and explain WHY, not just WHAT.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Deployment</strong> – Use CI/CD pipelines, automation tools like Octopus Deploy, and maintain different environments (dev/staging/prod).
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
            Sidemann Academic Registry • Git, GitHub &amp; Branching 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome8;
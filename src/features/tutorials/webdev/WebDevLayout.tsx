import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Code, FileCode2, Layout, Smartphone, Menu, X } from 'lucide-react';

type SidebarIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

interface SubTopic {
  title: string;
  path: string;
}

interface Topic {
  title: string;
  subtopics?: SubTopic[];
  path?: string;
}

interface SidebarItem {
  title: string;
  icon: SidebarIcon;
  topics: Topic[];
}

const sidebarData: SidebarItem[] = [
  {
    title: 'HTML & CSS',
    icon: FileCode2,
    topics: [
      {
        title: 'HTML Basics',
        subtopics: [
          { title: 'Introduction to HTML', path: '/tutorials/webdev/html-css' },
          { title: 'Elements & Tags', path: '/tutorials/webdev/html-elements' },
          { title: 'Forms & Inputs', path: '/tutorials/webdev/html-forms' },
        ] },
      {
        title: 'CSS Styling',
        subtopics: [
          { title: 'Selectors & Colors', path: '/tutorials/webdev/css-selectors' },
          { title: 'Flexbox & Grid', path: '/tutorials/webdev/css-layout' },
          { title: 'Responsive Design', path: '/tutorials/webdev/responsive' },
        ] }
    ] },
  {
    title: 'JavaScript',
    icon: Code,
    topics: [
      {
        title: 'JS Fundamentals',
        subtopics: [
          { title: 'Variables & Types', path: '/tutorials/webdev/js-basics' },
          { title: 'Functions & Scope', path: '/tutorials/webdev/js-functions' },
        ] },
      {
        title: 'Advanced JS',
        subtopics: [
          { title: 'DOM Manipulation', path: '/tutorials/webdev/js-dom' },
          { title: 'Async JavaScript', path: '/tutorials/webdev/js-async' },
        ]
      }
    ] },
  {
    title: 'React',
    icon: Layout,
    topics: [
      {
        title: 'Core Concepts',
        subtopics: [
          { title: 'Components & Props', path: '/tutorials/webdev/react-components' },
          { title: 'State & Hooks', path: '/tutorials/webdev/react-hooks' },
        ]
      },
      {
        title: 'Ecosystem',
        subtopics: [
          { title: 'React Router', path: '/tutorials/webdev/react-routing' },
          { title: 'State Management', path: '/tutorials/webdev/react-state' },
        ]
      }
    ] },
];

export const WebDevLayout: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['HTML & CSS']);
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['HTML Basics', 'CSS Styling']);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleTopic = (title: string) => {
    setExpandedTopics((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const SidebarContent = () => (
    <div className="py-4">
      <div className="px-4 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Smartphone className="text-purple-600" size={20} />
          Web Development
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Master frontend & backend
        </p>
      </div>

      <nav className="space-y-1 px-2">
        {sidebarData.map((section) => {
          const isSectionExpanded = expandedSections.includes(section.title);
          const Icon = section.icon;

          return (
            <div key={section.title} className="mb-2">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-gray-400 dark:text-gray-500" />
                  {section.title}
                </div>
                {isSectionExpanded ? (
                  <ChevronDown size={16} className="text-gray-400" />
                ) : (
                  <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>

              {isSectionExpanded && (
                <div className="mt-1 ml-4 space-y-1 border-l border-gray-200 dark:border-white/10 pl-2">
                  {section.topics.map((topic) => {
                    const isTopicExpanded = expandedTopics.includes(topic.title);
                    
                    return (
                      <div key={topic.title} className="mb-1">
                        <button
                          onClick={() => toggleTopic(topic.title)}
                          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-md transition-colors"
                        >
                          {topic.title}
                          {topic.subtopics && (
                            isTopicExpanded ? (
                              <ChevronDown size={14} className="text-gray-400" />
                            ) : (
                              <ChevronRight size={14} className="text-gray-400" />
                            )
                          )}
                        </button>

                        {isTopicExpanded && topic.subtopics && (
                          <div className="mt-1 ml-4 space-y-1 border-l border-gray-100 dark:border-white/5 pl-2">
                            {topic.subtopics.map((sub) => {
                              const isActive = location.pathname === sub.path;
                              return (
                                <NavLink
                                  key={sub.path}
                                  to={sub.path.endsWith('/') ? sub.path : `${sub.path}/`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={`block px-3 py-1.5 text-xs rounded-md transition-colors ${
                                    isActive
                                      ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 font-semibold'
                                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'
                                  }`}
                                >
                                  {sub.title}
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-16">
      {/* Mobile Sidebar Toggle - Positioned on the right */}
      <div className="lg:hidden fixed top-16 right-0 left-0 z-40 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <span className="font-semibold text-gray-900 dark:text-white">Web Dev Tutorials</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -mr-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden pt-28"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-28 bottom-0 right-0 w-3/4 max-w-xs bg-white dark:bg-[#111] shadow-xl overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar - Sticky */}
      <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] overflow-y-auto h-[calc(100vh-4rem)] sticky top-16">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 mt-12 lg:mt-0">
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#111] rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 p-6 md:p-10 min-h-[70vh]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Menu, X, Play, Code, FileText, 
  Layout, Monitor, Database, Globe, Server, ArrowLeft 
} from 'lucide-react';
import { CodeEditor } from './CodeEditor';

export interface Section {
  title?: string;
  content: string;
  code?: {
    language: string;
    snippet: string;
    filename?: string;
  };
  videoUrl?: string;
}

export interface Topic {
  id: string;
  title: string;
  sections: Section[];
}

interface PracticalViewerProps {
  subjectTitle: string;
  topics: Topic[];
  backPath?: string;
}

export const PracticalViewer: React.FC<PracticalViewerProps> = ({ subjectTitle, topics, backPath }) => {
  const navigate = useNavigate();
  const [activeTopicId, setActiveTopicId] = useState(topics[0]?.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-300 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-30 w-72 h-full bg-white dark:bg-[#111] border-r border-gray-200 dark:border-[#222] flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out
        `}
      >
        <div className="p-6 border-b border-gray-200 dark:border-[#222] flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white tracking-tight">{subjectTitle}</h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-gray-500 dark:text-gray-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          {topics.map((topic, index) => (
            <button
              key={topic.id}
              onClick={() => {
                setActiveTopicId(topic.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full text-left px-6 py-3 text-sm font-medium transition-colors border-l-2
                ${activeTopicId === topic.id 
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500' 
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-100 dark:hover:bg-[#1a1a1a] hover:text-gray-900 dark:hover:text-gray-200'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs opacity-50 font-mono">{(index + 1).toString().padStart(2, '0')}</span>
                <span>{topic.title}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative w-full bg-gray-50 dark:bg-[#0a0a0a]">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 dark:border-[#222] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg text-gray-500 dark:text-gray-400 transition-colors mr-2"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#222] rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {activeTopic?.title}
            </h1>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 scroll-smooth">
          <div className="w-full max-w-5xl mx-auto space-y-12 pb-20">
            {activeTopic?.sections.map((section, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="space-y-8"
              >
                {/* Content */}
                <div className="space-y-6">
                  {section.title && (
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-mono">
                        {idx + 1}
                      </span>
                      {section.title}
                    </h3>
                  )}
                  
                  <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                    <p>{section.content}</p>
                  </div>

                  {section.code && (
                    <div className="mt-6">
                      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                        <Code size={14} />
                        <span>Example Code</span>
                      </div>
                      <CodeEditor 
                        code={section.code.snippet} 
                        language={section.code.language}
                        filename={section.code.filename}
                      />
                    </div>
                  )}
                </div>

                {/* Video */}
                {section.videoUrl && (
                  <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-[#222] bg-white dark:bg-[#111] shadow-xl">
                      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-[#222] bg-gray-50 dark:bg-[#1a1a1a]">
                        <div className="w-2 h-2 rounded-full bg-[#ff7400]/100 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Video Tutorial</span>
                      </div>
                      <div className="aspect-video w-full">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src={`https://www.youtube.com/embed/${getYouTubeId(section.videoUrl)}`} 
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

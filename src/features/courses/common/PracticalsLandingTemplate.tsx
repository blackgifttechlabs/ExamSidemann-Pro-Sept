import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Terminal, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface PracticalSubject {
  id: string;
  title: string;
  description: string;
  icon?: any;
  imageDark?: string;
  imageLight?: string;
  color: string;
  bg?: string;
  border?: string;
  path: string;
}

interface PracticalsLandingTemplateProps {
  title: React.ReactNode;
  subtitle?: string;
  description: string;
  badge: string;
  subjects: PracticalSubject[];
  backPath?: string;
  toolsRow?: React.ReactNode;
}

export const PracticalsLandingTemplate: React.FC<PracticalsLandingTemplateProps> = ({
  title,
  subtitle,
  description,
  badge,
  subjects,
  backPath,
  toolsRow
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = subjects.filter(subject => 
    subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031" 
            className="w-full h-full object-cover"
            alt="Coding Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-gray-50 dark:to-[#0a0a0a]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center w-full">
          {backPath && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(backPath)}
              className="absolute top-0 left-6 md:left-0 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 border border-white/10 rounded-full"
            >
              <ArrowLeft size={14} /> Back
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm"
          >
            <Terminal size={14} />
            <span>{badge}</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-white"
          >
            {title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 max-w-xl mx-auto relative"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center p-2 shadow-2xl">
                <Search className="text-gray-400 ml-3" size={20} />
                <input 
                  type="text"
                  placeholder="Search practicals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 px-4 py-2 font-medium"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-20 mx-auto -mt-20 max-w-[1600px] px-6 py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-6">
          <main className="min-w-0 flex-1">
            {toolsRow && <div className="mb-12">{toolsRow}</div>}
            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredSubjects.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ y: -8 }}
                    onClick={() => navigate(subject.path)}
                    className={`
                      group cursor-pointer rounded-3xl border transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col overflow-hidden
                      bg-white dark:bg-[#16161a] border-gray-200 dark:border-gray-800/80
                    `}
                  >
                    {subject.imageDark && subject.imageLight ? (
                      <div className="w-full h-56 relative flex-shrink-0 bg-gray-50 dark:bg-[#1a1b22]">
                        <img src={subject.imageLight} alt={subject.title} className="w-full h-full object-cover dark:hidden" />
                        <img src={subject.imageDark} alt={subject.title} className="w-full h-full object-cover hidden dark:block" />
                      </div>
                    ) : subject.icon ? (
                      <div className="p-6 pb-0 flex-shrink-0">
                        <div className={`
                          w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                          ${subject.bg} border ${subject.border}
                          transition-transform duration-300 group-hover:scale-110
                        `}>
                          <subject.icon size={28} className={subject.color} />
                        </div>
                      </div>
                    ) : null}

                    <div className="p-6 md:p-8 flex flex-col flex-grow text-left">
                      <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                        {subject.title}
                      </h3>

                      {/* Colored Line */}
                      <div className={`w-8 h-[2px] mb-6 rounded-full bg-current ${subject.color}`}></div>

                      <p className="text-[15px] text-gray-600 dark:text-gray-400 mb-8 flex-grow leading-relaxed">
                        {subject.description}
                      </p>

                      <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${subject.color}`}>
                        <span>Start Lab</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No practicals found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

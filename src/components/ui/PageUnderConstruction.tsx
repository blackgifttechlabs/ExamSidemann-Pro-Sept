import React from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageUnderConstructionProps {
  title?: string;
  subtitle?: string;
  backPath?: string;
}

export const PageUnderConstruction: React.FC<PageUnderConstructionProps> = ({
  title = 'Page under construction',
  subtitle = 'This section is registered, but the content has not been added yet.',
  backPath,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-gray-900 dark:bg-[#121212] dark:text-white font-sans">
      <div className="h-14 border-b border-gray-200 bg-white px-4 dark:border-white/10 dark:bg-[#1e1e1e] flex items-center gap-3 shadow-sm">
        <button
          onClick={() => backPath ? navigate(backPath) : navigate(-1)}
          className="p-1.5 rounded-md text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-black truncate">{title}</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Coming Soon</p>
        </div>
      </div>

      <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-6 py-12">
        <section className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-[#1a1a1a] md:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300">
            <BookOpen size={30} />
          </div>
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-gray-400">Coming Soon</p>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">Page under construction</h2>
          <p className="mx-auto mt-5 max-w-md text-sm font-semibold leading-relaxed text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </section>
      </main>
    </div>
  );
};


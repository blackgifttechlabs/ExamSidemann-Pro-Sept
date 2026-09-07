import React from 'react';
import { Calculator, CheckCircle, FileText, Target } from 'lucide-react';
import { MathChapterPager, notebookPaperClassName, notebookPaperStyle, type MathNavigationProps } from './mathLessonUtils';

interface MathTopicPageProps extends MathNavigationProps {
  title: string;
  summary: string;
  objectives: string[];
  examples: string[];
}

export const MathTopicPage: React.FC<MathTopicPageProps> = ({
  title,
  summary,
  objectives,
  examples,
  onNextTopic,
  nextTopicTitle,
}) => {
  return (
    <div className="w-full min-w-0 max-w-full space-y-6 overflow-x-clip px-3 py-8 sm:px-5 md:px-8 lg:px-10">
      <section className="rounded-[5px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252526] p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-[5px] bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0">
            <Calculator size={22} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">
              Form 1 Mathematics
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {summary}
            </p>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-5">
        <div className="rounded-[5px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252526] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-black text-gray-900 dark:text-white">What to Master</h3>
          </div>
          <div className="space-y-3">
            {objectives.map((objective) => (
              <div key={objective} className="flex items-start gap-3">
                <CheckCircle size={16} className="mt-0.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{objective}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[5px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#252526] p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="font-black text-gray-900 dark:text-white">Practice Focus</h3>
          </div>
          <div className="space-y-3">
            {examples.map((example) => (
              <div key={example} className={notebookPaperClassName} style={notebookPaperStyle}>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MathChapterPager
        currentIndex={0}
        totalChapters={1}
        nextTopicTitle={nextTopicTitle}
        onNextChapter={() => undefined}
        onNextTopic={onNextTopic}
      />
    </div>
  );
};

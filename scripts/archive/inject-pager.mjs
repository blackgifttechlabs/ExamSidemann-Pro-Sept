import fs from 'fs';

const pagerCode = `
const SectionPager = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const sections = React.Children.toArray(children).filter((child: any) => child.type === 'section');
  const itemsPerPage = 3;
  const totalPages = Math.ceil(sections.length / itemsPerPage);

  const currentSections = sections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-900 mb-8 sticky top-20 z-10 transition-all">
        <button 
          onClick={() => { setCurrentPage(Math.max(1, currentPage - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          Previous Page
        </button>
        <div className="text-gray-600 dark:text-gray-300 font-medium hidden md:block">
          Page <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentPage}</span> of {totalPages}
        </div>
        <button 
          onClick={() => { setCurrentPage(Math.min(totalPages, currentPage + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          Next Page
        </button>
      </div>

      <div className="space-y-16 animate-fade-in-up" key={currentPage}>
        {currentSections}
      </div>
      
      <div className="flex justify-between items-center mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
         <button 
          onClick={() => { setCurrentPage(Math.max(1, currentPage - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          Previous Page
        </button>
        <div className="text-gray-600 dark:text-gray-300 font-medium block md:hidden">
          {currentPage} / {totalPages}
        </div>
        <button 
          onClick={() => { setCurrentPage(Math.min(totalPages, currentPage + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
          Next Page
        </button>
      </div>
    </div>
  );
};
`;

const loc = './components/courses/polytechnic/nd-it/network-administration';

[2, 3, 4].forEach(n => {
  let file = loc + '/LearningOutcome' + n + '.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  if (!c.includes('SectionPager')) {
    // Inject pagerCode after imports
    const mainDeclMatch = c.match(/(export\s+default\s+function\s+LearningOutcome|export\s+const\s+LearningOutcome)/);
    if (mainDeclMatch) {
      c = c.slice(0, mainDeclMatch.index) + pagerCode + '\n' + c.slice(mainDeclMatch.index);
    }
    
    c = c.replace(
      '<div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-16">',
      '<SectionPager>'
    );
    
    const endStrMatch = /<\/div>\s*<\/div>\s*<\/div>\s*\);\s*};\s*/;
    if (endStrMatch.test(c)) {
        c = c.replace(endStrMatch, '</SectionPager>\n  </div>\n    </div>\n  );\n};\n');
    } else {
        // Fallback replacement strategy
        const idx = c.lastIndexOf('</div>\n  </div>\n    </div>\n  );\n};');
        if (idx !== -1) {
            c = c.substring(0, idx) + '</SectionPager>\n  </div>\n    </div>\n  );\n};' + c.substring(idx + "</div>\n  </div>\n    </div>\n  );\n};".length);
        }
    }
    
    fs.writeFileSync(file, c);
  }
});

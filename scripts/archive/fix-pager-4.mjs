import fs from 'fs';

const newPagerCode = `const SectionPager = ({ children }: { children: React.ReactNode }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const sections = React.Children.toArray(children).filter((child: any) => child.type === 'section');
  const itemsPerPage = 3;
  const totalPages = Math.ceil(sections.length / itemsPerPage);

  React.useEffect(() => {
    const handleNext = () => {
        setCurrentPage(p => {
           const next = Math.min(totalPages, p + 1);
           const el = document.getElementById('lesson-scroll-area');
           if(el) el.scrollTo({ top: 0, behavior: 'smooth' });
           return next;
        });
    };
    const handlePrev = () => {
        setCurrentPage(p => {
           const prev = Math.max(1, p - 1);
           const el = document.getElementById('lesson-scroll-area');
           if(el) el.scrollTo({ top: 0, behavior: 'smooth' });
           return prev;
        });
    };
    window.addEventListener('pager-next', handleNext);
    window.addEventListener('pager-prev', handlePrev);
    window.dispatchEvent(new CustomEvent('pager-state', { detail: { currentPage, totalPages } }));
    
    return () => {
        window.removeEventListener('pager-next', handleNext);
        window.removeEventListener('pager-prev', handlePrev);
    };
  }, [totalPages, currentPage]);

  React.useEffect(() => {
     return () => {
         window.dispatchEvent(new CustomEvent('pager-state', { detail: null }));
     }
  }, []);

  const currentSections = sections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">
      <div className="space-y-16 animate-fade-in-up" key={currentPage}>
        {currentSections}
      </div>
    </div>
  );
};`;

const loc = './components/courses/polytechnic/nd-it/network-administration';

[1, 2, 3, 4].forEach(n => {
  let file = `${loc}/LearningOutcome${n}.tsx`;
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the old SectionPager if it exists
  const pagerRegex = /const SectionPager = \(\{ children \}: \{ children: React\.ReactNode \}\) => \{[\s\S]*?(?=export\s+(default\s+)?(function|const)\s+LearningOutcome)/;
  
  if (pagerRegex.test(content)) {
    content = content.replace(pagerRegex, newPagerCode + '\n\n');
  } else if (!content.includes('const SectionPager')) {
      // Inject new pager code completely
      const mainDeclMatch = content.match(/(export\s+(default\s+)?(function|const)\s+LearningOutcome)/);
      if (mainDeclMatch) {
          content = content.slice(0, mainDeclMatch.index) + newPagerCode + '\n\n' + content.slice(mainDeclMatch.index);
      }
      
      content = content.replace(
          /<div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 space-y-16">/,
          '<SectionPager>'
      );
      
      // Need to replace the closing div
      let lines = content.split('\n');
      let divCount = 0;
      for (let i = lines.length - 1; i >= Math.max(0, lines.length - 200); i--) {
          if (lines[i].includes('</div>')) {
              divCount++;
              if (divCount === 3 && !content.includes('</SectionPager>')) { // be careful, it might not be 3rd if they have different structure
                  lines[i] = lines[i].replace('</div>', '</SectionPager>');
                  break; 
              }
          }
      }
      content = lines.join('\n');
  }
  
  fs.writeFileSync(file, content);
});

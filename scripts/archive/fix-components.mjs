import fs from 'fs';

function fixComponent(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  // Find "export const LearningOutcome"
  let idx = c.indexOf('export const LearningOutcome');
  if (idx === -1) return;
  
  // We will replace everything above this to fix any broken components.
  // We can just import and define the components nicely.
  
  let header = c.substring(0, idx);
  
  // Let's replace the broken components with working ones.
  header = header.replace(/interface AccordionItemProps[\s\S]*?(?=interface QuestionRevealProps)/, 
`interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="text-purple-600 dark:text-purple-400">
            {icon}
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

`);

  header = header.replace(/interface QuestionRevealProps[\s\S]*?(?=interface TipCardProps)/,
`interface QuestionRevealProps {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const QuestionReveal: React.FC<QuestionRevealProps> = ({ question, answer, icon }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="text-purple-500 mt-1">{icon}</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{question}</p>
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
            >
              Click to reveal answer
            </button>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{answer}</p>
              <button
                onClick={() => setIsRevealed(false)}
                className="text-xs text-gray-500 dark:text-gray-400 mt-2 hover:underline"
              >
                Hide answer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

`);

  fs.writeFileSync(file, header + c.substring(idx));
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => fixComponent(`${loc}/LearningOutcome${n}.tsx`));

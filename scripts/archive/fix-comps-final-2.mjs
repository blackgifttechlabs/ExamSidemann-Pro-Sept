import fs from 'fs';

function fixComp(file) {
  let c = fs.readFileSync(file, 'utf8');

  // Look for the main exported function to replace everything before it.
  const mainDeclMatch = c.match(/(export\s+default\s+function\s+LearningOutcome|export\s+const\s+LearningOutcome)/);
  if (!mainDeclMatch) return;
  const idx = mainDeclMatch.index;

  let imports = c.substring(0, c.indexOf('interface '));
  if (imports.length > 1000) {
    imports = c.substring(0, 500); 
  }

  // Define proper components for each file type:
  let comps = '';

  if (file.includes('LearningOutcome2')) {
    comps = `interface AccordionItemProps { title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; }
const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-3">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="flex items-center gap-3"><div className="text-purple-600 dark:text-purple-400">{icon}</div><span className="font-semibold text-gray-900 dark:text-white">{title}</span></div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (<div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">{children}</div>)}
    </div>
  );
};

interface QuestionRevealProps { question: string; answer: string; icon: React.ReactNode; }
const QuestionReveal: React.FC<QuestionRevealProps> = ({ question, answer, icon }) => {
  const [isRevealed, setIsRevealed] = React.useState(false);
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-3">
      <div className="flex items-start gap-3">
        <div className="text-purple-500 mt-1">{icon}</div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white mb-2">{question}</p>
          {!isRevealed ? (
            <button onClick={() => setIsRevealed(true)} className="text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">Click to reveal answer</button>
          ) : (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{answer}</p>
              <button onClick={() => setIsRevealed(false)} className="text-xs text-gray-500 dark:text-gray-400 mt-2 hover:underline">Hide answer</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TipCardProps { children: React.ReactNode; type?: 'exam' | 'tip' | 'warning'; }
const TipCard: React.FC<TipCardProps> = ({ children, type = 'tip' }) => {
  const colors = { exam: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', tip: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' };
  const icons = { exam: <GraduationCap className="text-purple-600 shrink-0 mt-1" size={20} />, tip: <Lightbulb className="text-purple-600 shrink-0 mt-1" size={20} />, warning: <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} /> };
  return (
    <div className={colors[type] + " p-4 rounded-lg border-l-4 my-4"}>
      <div className="flex items-start gap-2">{icons[type]}<div className="text-gray-800 dark:text-gray-200">{children}</div></div>
    </div>
  );
};

interface CheatSheetItemProps { label: string; value: string; }
const CheatSheetItem: React.FC<CheatSheetItemProps> = ({ label, value }) => (
  <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"><span className="font-medium text-gray-700 dark:text-gray-300">{label}:</span><span className="font-bold text-purple-600 dark:text-purple-400">{value}</span></div>
);

interface PhaseCardProps { phase: string; number: number; children: React.ReactNode; }
const PhaseCard: React.FC<PhaseCardProps> = ({ phase, number, children }) => (
  <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
    <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg">{number}</span>Phase {number}: {phase}</h3>
    <div className="text-gray-700 dark:text-gray-300">{children}</div>
  </div>
);

interface CommandTableRowProps { command: string; os: string; whatItDoes: string; }
const CommandTableRow: React.FC<CommandTableRowProps> = ({ command, os, whatItDoes }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="p-3 font-mono text-sm text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/10">{command}</td><td className="p-3 text-sm">{os}</td><td className="p-3 text-sm">{whatItDoes}</td></tr>
);

interface CableToolRowProps { tool: string; description: string; cableType?: string; }
const CableToolRow: React.FC<CableToolRowProps> = ({ tool, description, cableType }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="p-3 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">{tool}</td><td className="p-3 text-sm">{description}</td></tr>
);

interface ElementRowProps { element: string; description: string; }
const ElementRow: React.FC<ElementRowProps> = ({ element, description }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="p-3 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">{element}</td><td className="p-3 text-sm">{description}</td></tr>
);

interface EthernetSpeedRowProps { standard: string; speed: string; cableInfo: string; }
const EthernetSpeedRow: React.FC<EthernetSpeedRowProps> = ({ standard, speed, cableInfo }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="p-3 font-mono text-sm font-bold">{standard}</td><td className="p-3 font-semibold text-purple-600 dark:text-purple-400">{speed}</td><td className="p-3 text-sm">{cableInfo}</td></tr>
);

interface ComponentCardProps { title: string; description: string; icon?: React.ReactNode; use?: string; }
const ComponentCard: React.FC<ComponentCardProps> = ({ title, description, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex gap-4 items-start">
    <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400 mt-1 shrink-0">{icon}</div><div><h4 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h4><p className="text-sm text-gray-600 dark:text-gray-400">{description}</p></div>
  </div>
);

interface ComparisonRowProps { feature: string; rip: string; ospf: string; }
const ComparisonRow: React.FC<ComparisonRowProps> = ({ feature, rip, ospf }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700"><td className="p-3 font-semibold bg-gray-50 dark:bg-gray-800/50">{feature}</td><td className="p-3">{rip}</td><td className="p-3">{ospf}</td></tr>
);

interface ToolCardProps { title?: string; name?: string; description: string; icon?: React.ReactNode; use?: string; }
const ToolCard: React.FC<ToolCardProps> = ({ title, name, description, icon, use }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
    <div className="flex justify-center mb-3 text-purple-500">{icon}</div><h4 className="font-bold text-gray-900 dark:text-white mb-2">{title || name}</h4><p className="text-sm text-gray-600 dark:text-gray-400">{description}</p><p className="text-sm text-gray-600 dark:text-gray-400">{use}</p>
  </div>
);

`;
  }

  if (file.includes('LearningOutcome4')) {
    comps = `interface TipCardProps { children: React.ReactNode; type?: 'exam' | 'tip' | 'warning'; }
const TipCard: React.FC<TipCardProps> = ({ children, type = 'tip' }) => {
  const colors = { exam: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', tip: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800', warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800' };
  const icons = { exam: <GraduationCap className="text-purple-600 shrink-0 mt-1" size={20} />, tip: <Lightbulb className="text-purple-600 shrink-0 mt-1" size={20} />, warning: <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} /> };
  return (
    <div className={colors[type] + " p-4 rounded-lg border-l-4 my-4"}>
      <div className="flex items-start gap-2">{icons[type]}<div className="text-gray-800 dark:text-gray-200">{children}</div></div>
    </div>
  );
};
interface StepCardProps { number: number; title: string; desc?: string; children?: React.ReactNode; }
const StepCard: React.FC<StepCardProps> = ({ number, title, children }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-emerald-500 shadow-sm">
    <div className="flex gap-4"><div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">{number}</div><div><h4 className="font-bold text-gray-900 dark:text-white">{title}</h4><div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{children}</div></div></div>
  </div>
);

interface TroubleshootingMethodProps { title?: string; name?: string; description?: string; desc?: string; pros?: string[]; cons?: string[]; icon?: React.ReactNode; }
const TroubleshootingMethod: React.FC<TroubleshootingMethodProps> = ({ title, name, description, desc, icon }) => (
  <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-200 dark:border-emerald-800/50 text-center">
    <div className="inline-flex justify-center items-center w-12 h-12 bg-white dark:bg-gray-800 rounded-full text-emerald-500 mb-3 shadow-sm">{icon}</div><h4 className="font-bold text-gray-900 dark:text-white mb-2">{title || name}</h4><p className="text-sm text-gray-600 dark:text-gray-400">{description || desc}</p>
  </div>
);

interface IssueRowProps { issue: string; theory: string; command: string; }
const IssueRow: React.FC<IssueRowProps> = ({ issue, theory, command }) => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <td className="p-3 font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800/50">{issue}</td><td className="p-3 text-sm">{theory}</td><td className="p-3 font-mono text-xs text-emerald-600 dark:text-emerald-400">{command}</td>
  </tr>
);

`;
  }

  let finalContent = imports + comps + c.substring(idx);
  
  // also inject `import { Network } from 'lucide-react'` if missing to `LearningOutcome3.tsx` and `LearningOutcome4.tsx`
  if (!finalContent.includes('Network,') && !finalContent.includes(' Network ')) {
    finalContent = finalContent.replace(/import \{/, 'import { Network, ');
  }

  fs.writeFileSync(file, finalContent);
}

const loc = './components/courses/polytechnic/nd-it/network-administration';
[2,3,4].forEach(n => {
  if (n !== 3) fixComp(loc + '/LearningOutcome' + n + '.tsx');
  else {
     let fc = fs.readFileSync(loc + '/LearningOutcome3.tsx', 'utf8');
     if (!fc.includes('Network,')) fs.writeFileSync(loc + '/LearningOutcome3.tsx', fc.replace(/import \{/, 'import { Network, '));
  }
});

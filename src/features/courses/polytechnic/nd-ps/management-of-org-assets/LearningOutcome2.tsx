import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  GlobeIcon,
  Shield,
  ListChecks,
  BookOpen,
  FileText,
  Database,
  RefreshCw as Refresh,
  Lock,
  Wrench,
  File,
  Clipboard,
  CheckSquare,
  FileCheck,
  PenTool,
  Users,
  UserCheck,
  Computer,
  AlertOctagon,
  ClipboardList,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'procedures', label: 'Procedures & Documentation' },
  { id: 'permission', label: 'Permission Protocols' },
  { id: 'controls', label: 'Internal Controls' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome2: React.FC = () => {
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
        text: 'Standardized Operating Procedures (SOPs) in materials handling can reduce errors by up to 70% and significantly improve workplace safety.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain an audit trail for material movements. Digital systems like WMS can automate tracking and provide real-time visibility into inventory.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 3 pillars of internal controls: Authorization (who can do what), Documentation (what happened), and Reconciliation (checking everything matches).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume verbal approvals are sufficient. Always require written or electronic authorization for material movements to maintain accountability.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Standardized Operating Procedures (SOPs) in materials handling can reduce errors by up to 70% and significantly improve workplace safety.',
      },
      {
        title: 'Pro Tip',
        text: 'Always maintain an audit trail for material movements. Digital systems like WMS can automate tracking and provide real-time visibility into inventory.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 3 pillars of internal controls: Authorization (who can do what), Documentation (what happened), and Reconciliation (checking everything matches).',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t assume verbal approvals are sufficient. Always require written or electronic authorization for material movements to maintain accountability.',
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
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Organisational Procedures &{' '}
            <span className="text-sky-300 font-bold italic">
              Internal Controls
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to procedures, documentation, permission protocols, and internal controls in materials and materials handling.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <FileCheck size={14} className="inline mr-1" /> Procedures
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lock size={14} className="inline mr-1" /> Internal Controls
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Documentation
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-indigo-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, procedure, control..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-indigo-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-indigo-200" />
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
            {/* SECTION 1: Organisational Procedures and Documentation */}
            <div
              ref={(el) => {
                sectionRefs.current['procedures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Organisational Procedures and Documentation Demonstrated in Materials and Materials Handling
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In managing materials and materials handling, demonstrating robust organizational procedures and meticulous documentation is paramount. It is not simply about moving items around; it is about establishing a controlled, traceable, and efficient system that minimizes errors, ensures safety, and optimizes resource utilization. Clear procedures and comprehensive documentation provide a framework for consistent operations, accountability, and continuous improvement.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Standardized Operating Procedures (SOPs)', icon: <FileText size={16} />, content: 'Establishing detailed SOPs for all aspects of materials handling — receiving, inspection, storage, picking, packing, and shipping. SOPs should outline step-by-step instructions, safety protocols, and quality control measures. For example, SOPs for receiving include verifying delivery quantities, inspecting for damage, and documenting discrepancies. Regularly reviewing and updating SOPs ensures they reflect changes in regulations, technology, or operational needs.' },
                  { title: '2. Comprehensive Documentation of Material Movement', icon: <ClipboardList size={16} />, content: 'Accurate documentation of all material movements for tracking inventory, ensuring accountability, and supporting audits. Includes receiving, issuing, transfers, and disposals. Documents like receiving reports, material requisition forms, and shipping manifests should be accurately completed and retained. Electronic documentation systems (WMS) automate data capture and provide real-time visibility.' },
                  { title: '3. Inventory Control Records and Reports', icon: <Database size={16} />, content: 'Detailed inventory control records for maintaining accurate stock levels — receipts, issues, adjustments, and cycle counts. Regular inventory reports (stock status, turnover) monitor performance and identify trends. Records should be reconciled with physical counts. Inventory management software automates data collection and reporting, providing real-time insights.' },
                  { title: '4. Equipment Maintenance and Inspection Records', icon: <Wrench size={16} />, content: 'Detailed maintenance and inspection records for materials handling equipment, including schedules, checklists, and repair logs. Provides history of maintenance, identifies recurring issues, and supports replacement planning. Regular inspections ensure equipment is in good working order and safety features function properly, reducing accident risk.' },
                  { title: '5. Safety and Incident Reporting Procedures', icon: <Shield size={16} />, content: 'Clear safety procedures and incident reporting protocols for accidents, near misses, and safety hazards. Incident reports should be investigated to identify root causes and implement corrective actions. Safety training records should document employee training and certifications, ensuring incidents are promptly addressed and preventive measures implemented.' },
                  { title: '6. Quality Control Documentation', icon: <CheckSquare size={16} />, content: 'Quality control documentation including inspection reports, test results, and certificates of compliance. Documented quality control procedures ensure consistency and accuracy. Provides evidence of quality assurance and helps identify improvement areas, ensuring customer satisfaction.' },
                  { title: '7. Supplier and Vendor Documentation', icon: <Users size={16} />, content: 'Accurate records of supplier and vendor information — contracts, purchase orders, delivery schedules, and performance evaluations. Ensures compliance with contractual obligations and facilitates supplier relationship management and performance tracking.' },
                  { title: '8. Training and Certification Records', icon: <BookOpen size={16} />, content: 'Maintaining records of employee training and certifications for materials handling, equipment operation, and safety. Demonstrates compliance with regulatory requirements and ensures employees have necessary skills and knowledge, reducing accident risk.' },
                  { title: '9. Environmental Compliance Documentation', icon: <GlobeIcon size={16} />, content: 'Documentation related to environmental compliance — waste disposal records, hazardous materials handling procedures, and environmental permits. Demonstrates compliance with environmental regulations and supports sustainable practices.' },
                  { title: '10. Document Control and Retention Policies', icon: <File size={16} />, content: 'Implementing document control and retention policies for creation, approval, storage, and disposal. Ensures compliance with legal and regulatory requirements and that records are readily available for audits and legal proceedings.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Getting Permission to Receive and Give Out Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['permission'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Getting Permission to Receive and Give Out Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    This is about making sure only the right people can accept deliveries and hand out supplies. It is like having a secure storeroom where you need a key to get things in or out. This system stops mistakes, theft, and ensures everything is tracked properly.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Clear System of Authority', icon: <UserCheck size={16} />, content: 'Establishing clear rules about who is allowed to receive deliveries from suppliers and who can give out materials to workers or departments. Only certain people in the receiving department can sign for deliveries, and only supervisors can approve workers to get specific tools or parts. This prevents unauthorized access and ensures everyone knows their role.' },
                  { title: '2. Forms and Paperwork for Approval', icon: <PenTool size={16} />, content: 'Using forms or electronic records to show permission for receiving or giving out materials. A "receiving report" is filled out when a delivery arrives, showing who accepted it. A "material requisition form" is used when workers need supplies, showing who approved the request. These documents create a paper trail for tracking materials and identifying discrepancies.' },
                  { title: '3. Verification of Authority', icon: <Shield size={16} />, content: 'Ensuring people approving material movements have the authority to do so by checking job titles, access levels in computer systems, or signatures on authorized personnel lists. This prevents unauthorized approvals and ensures the person authorizing the transaction is allowed to do so.' },
                  { title: '4. Record Keeping of All Transactions', icon: <Clipboard size={16} />, content: 'Recording every time materials are received or given out — who did it, what was involved, and when it happened. This helps track material movement, identify missing items, and detect patterns of theft or misuse. Enables easy auditing of materials.' },
                  { title: '5. Computer Systems for Access Control', icon: <Computer size={16} />, content: 'Using computer systems like warehouse management systems (WMS) that require users to log in with username and password before receiving or giving out materials. These systems track material movement and generate reports on inventory levels, automating and increasing accuracy of material control.' },
                  { title: '6. Regular System Checks', icon: <Refresh size={16} />, content: 'Regularly checking the system for problems or weaknesses through audits, reviews of records, or physical inventory checks. Identifies areas for improvement and risks of theft or misuse, ensuring the system remains effective.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: Internal Controls */}
            <div
              ref={(el) => {
                sectionRefs.current['controls'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Internal Controls
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Imagine your house. You have locks on the doors, you keep your valuables in a safe, and you might have a list of chores for everyone to do. That is kind of what internal control systems is for a company – rules and ways of doing things to keep everything safe and running well.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertOctagon size={16} /> What Internal Controls Are
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>They are like safety rules and check-ups for a business.</li>
                  <li>They help stop people from stealing or making mistakes.</li>
                  <li>They make sure the company's money and things are safe.</li>
                  <li>They help the company follow the rules and laws.</li>
                  <li>They make sure the company's information is correct.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. To Stop People from Taking Things', icon: <Target size={16} />, content: 'Companies have controls to stop people from taking money or supplies. For example, they might have different people handle money and keep the records, so no one person has too much control. This stops people from easily hiding theft. It is like having two people check your homework, so there is less chance of a mistake.' },
                  { title: '2. To Make Sure Everything Is Correct', icon: <Target size={16} />, content: 'Mistakes happen, but controls help catch them. For example, companies compare the money in the bank to their records to make sure they match. This helps stop big problems from happening later. If you have a budget and track your spending, you know if you are overspending — companies do the same thing.' },
                  { title: '3. To Follow the Rules', icon: <Target size={16} />, content: 'Companies must follow laws about money, safety, and other things. Controls help them do this. For example, they might have rules about handling dangerous materials or keeping customer information safe. This is like following traffic laws, so you do not get a ticket.' },
                  { title: '4. To Make Things Run Better', icon: <Target size={16} />, content: 'Controls can help a company work more smoothly. For example, they might have a system for ordering supplies so they do not run out. This helps save time and money. It is like having a well-organized kitchen — you know where everything is, and you can cook faster.' },
                  { title: '5. To Help with Honesty', icon: <Target size={16} />, content: 'Companies need to make sure their financial reports are accurate. Internal controls help ensure all numbers are correct, making it easier for investors and others to trust the company.' },
                ].map((item) => (
                  <div key={item.title} className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                      {item.icon} {item.title}
                    </h4>
                    <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ListChecks size={16} /> Examples of Simple Controls
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Two People Checking:</strong> Like having two people count the money.</li>
                  <li><strong>Passwords:</strong> To keep computer information safe.</li>
                  <li><strong>Locks and Security Cameras:</strong> To protect things in the warehouse or store.</li>
                  <li><strong>Keeping Records:</strong> Writing down every sale or purchase.</li>
                  <li><strong>Regular Checks:</strong> Someone checking that the rules are being followed.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Control Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-indigo-500 dark:text-indigo-400" />
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
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Procedure Types</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Permission Protocols</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Internal Control Benefits</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective materials handling requires clear Standardized Operating Procedures (SOPs), comprehensive documentation of all movements, and strict permission protocols. Internal controls — including segregation of duties, authorization requirements, and regular audits — are essential for preventing theft, ensuring accuracy, and maintaining operational efficiency. Always follow the principle: "If it's not documented, it didn't happen."
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
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-indigo-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Procedures &amp; Documentation</strong> – SOPs, material movement documentation, inventory records, maintenance logs, safety reports, quality control, supplier records, training certificates, environmental compliance, and document control policies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Permission Protocols</strong> – clear authority systems, forms for approval, verification of authority, record keeping, computer access controls, and regular system checks.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internal Controls</strong> – prevent theft, ensure accuracy, maintain regulatory compliance, improve operational efficiency, and support honest financial reporting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Simple Controls</strong> – two-person verification, passwords, locks and cameras, record keeping, and regular compliance checks.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpenIcon size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Materials Management &amp; Internal Controls 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome2;

import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Target,
  Shield,
  SettingsIcon,
  LayersIcon,
  FileText,
  Database,
  DollarSign,
  Users,
  ClipboardCheck,
  BarChart3,
  RefreshCw,
  Handshake,
  Building2,
  UserCheck,
  Package,
  Calculator,
  ShoppingCart,
  ClipboardList,
  Clock,
  Scan,
  MapPin,
  Cpu,
  Wrench,
  Eye,
  Link,
  FileCheck,
  Trash2,
  Workflow,
  CheckSquare,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'register', label: 'Asset Register' },
  { id: 'verification', label: 'Physical Verification' },
  { id: 'procurement', label: 'Asset Procurement' },
  { id: 'controls', label: 'Internal Controls' },
  { id: 'maintenance', label: 'Maintaining Register' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome1: React.FC = () => {
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
        text: 'An asset register is not just a list of items — it\'s a legal requirement for many organizations. It provides crucial evidence for insurance claims, audits, and financial reporting.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct physical verification of assets at least annually. More frequent checks on high-value or mobile assets can prevent losses and detect discrepancies early.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 pillars of asset management: Planning, Procurement, Registration, Maintenance, and Disposal — each is essential for a complete asset lifecycle.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse procurement with purchasing. Procurement is a strategic process that includes needs assessment, supplier selection, and contract management, not just buying.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'An asset register is not just a list of items — it\'s a legal requirement for many organizations. It provides crucial evidence for insurance claims, audits, and financial reporting.',
      },
      {
        title: 'Pro Tip',
        text: 'Always conduct physical verification of assets at least annually. More frequent checks on high-value or mobile assets can prevent losses and detect discrepancies early.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 pillars of asset management: Planning, Procurement, Registration, Maintenance, and Disposal — each is essential for a complete asset lifecycle.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse procurement with purchasing. Procurement is a strategic process that includes needs assessment, supplier selection, and contract management, not just buying.',
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

  // Helper to render a clean card
  const renderCard = (title: string, icon: React.ReactNode, content: React.ReactNode) => {
    return (
      <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 mb-4">
        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
          {icon} {title}
        </h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          {typeof content === 'string' ? <p>{content}</p> : content}
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* ─── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> PROCUREMENT &amp; ASSET MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Asset Register &amp;{' '}
            <span className="text-emerald-300 font-bold italic">
              Procurement Management
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Complete guide to preparing and maintaining asset registers, physical resource verification, asset procurement, internal control systems, and maintaining an asset register.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <ClipboardList size={14} className="inline mr-1" /> Asset Register
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Package size={14} className="inline mr-1" /> Procurement
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Internal Controls
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
                placeholder="Search for a concept, process, control..."
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
            {/* SECTION 1: Preparing and Maintaining Asset Register */}
            <div
              ref={(el) => {
                sectionRefs.current['register'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preparing and Maintaining Asset Register for the Procurement Department
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preparing and maintaining an asset register is a fundamental practice in asset management, particularly within the procurement department. It is not simply a list of items; it is a comprehensive record that tracks the lifecycle of each asset, from acquisition to disposal. This register provides crucial information for asset tracking, maintenance, depreciation, and financial reporting, ensuring accountability and maximizing the value of the procurement department's resources.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Establishing a Comprehensive Asset Inventory', icon: <ClipboardList size={16} />, content: 'Creating a complete inventory of all assets owned by the procurement department, including computers, printers, office furniture, software licenses, and other equipment. Each asset should be identified with a unique identifier (asset tag or serial number) to ensure accurate tracking. The initial inventory should be meticulously compiled, verifying the existence and condition of each asset to form the baseline for the asset register.' },
                  { title: '2. Defining Asset Categories and Classifications', icon: <LayersIcon size={16} />, content: 'Categorizing and classifying assets based on their nature, function, and expected lifespan. Common categories include IT equipment, office furniture, and software licenses. Classifications should also consider depreciation methods and accounting requirements, providing a structured framework for the asset register and enabling efficient management and analysis of asset data.' },
                  { title: '3. Recording Essential Asset Information', icon: <FileText size={16} />, content: 'Including essential information for each asset: description, model, asset tag/serial number, acquisition date and cost, location and custodian, depreciation method and rate, maintenance records, warranty information, and disposal date/value. Accurate and complete data entry is crucial for maintaining the integrity of the asset register.' },
                  { title: '4. Implementing a System for Regular Updates', icon: <RefreshCw size={16} />, content: 'Regularly updating the asset register to reflect changes in asset status (acquisitions, disposals, transfers, maintenance). Establishing procedures for reporting asset changes and assigning responsibility for data entry. Regular audits and reconciliations should be conducted to verify the accuracy of the register.' },
                  { title: '5. Utilizing Asset Management Software', icon: <Database size={16} />, content: 'Leveraging asset management software to streamline data entry, tracking, and reporting. These solutions automate processes, reduce errors, improve efficiency, and provide features for generating reports, tracking maintenance schedules, and managing depreciation, enhancing asset visibility and control.' },
                  { title: '6. Establishing Clear Roles and Responsibilities', icon: <Users size={16} />, content: 'Clearly defining roles and responsibilities for data entry, updates, audits, and reporting. All personnel involved in asset management should be trained on procedures for maintaining the register, ensuring everyone understands their role in the asset management process.' },
                  { title: '7. Ensuring Data Security and Accessibility', icon: <Shield size={16} />, content: 'Implementing appropriate security measures (access controls, data encryption) to protect sensitive asset information. Ensuring the register is readily accessible to authorized personnel for reporting and analysis, balancing security with accessibility for effective asset management.' },
                  { title: '8. Integrating with Financial Reporting Systems', icon: <Link size={16} />, content: 'Integrating the asset register with the organization\'s financial reporting systems to ensure accurate and consistent financial reporting. This integration allows for automated depreciation calculations and asset valuation, streamlining the financial reporting process.' },
                  { title: '9. Regular Audits and Reconciliation', icon: <Search size={16} />, content: 'Conducting periodic audits and reconciliations to verify the accuracy of the asset register. Physical audits verify the existence and condition of assets, while reconciliations compare the register with financial records. These audits help ensure accuracy and act as a deterrent to theft.' },
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

            {/* SECTION 2: Physical Resource Verification */}
            <div
              ref={(el) => {
                sectionRefs.current['verification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Physical Resource Verification
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Carrying out physical resource verification is a crucial process for ensuring the accuracy and integrity of an organization's asset records. It is a systematic and thorough examination of physical assets to confirm their existence, condition, and location. This process provides vital information for asset management, financial reporting, and operational efficiency.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Planning and Preparation', icon: <ClipboardCheck size={16} />, content: 'Defining the scope of verification, identifying assets to be verified, and establishing a schedule. A detailed checklist should be prepared outlining information to be verified (asset tag, serial number, location, condition). The verification team should be assembled and trained on procedures and equipment use.' },
                  { title: '2. Physical Inspection and Data Collection', icon: <Scan size={16} />, content: 'Visually inspecting each asset, verifying asset tag or serial number, and recording location and condition. Noting any discrepancies between physical asset and asset register. Data collection can be done manually or electronically using mobile devices or barcode scanners.' },
                  { title: '3. Reconciliation with Asset Register', icon: <FileCheck size={16} />, content: 'Comparing physical inventory with recorded inventory and identifying discrepancies (missing assets, incorrect locations, inaccurate conditions). Discrepancies should be thoroughly investigated to determine the root cause.' },
                  { title: '4. Documentation and Reporting', icon: <FileText size={16} />, content: 'Recording verification date, assets verified, discrepancies identified, and actions taken. A formal report should be generated summarizing findings and highlighting significant issues, shared with relevant stakeholders.' },
                  { title: '5. Addressing Discrepancies and Corrective Actions', icon: <Wrench size={16} />, content: 'Promptly addressing discrepancies by updating the asset register, investigating missing assets, or repairing damaged assets. Corrective actions should be documented and tracked to ensure completion.' },
                  { title: '6. Regular Verification Schedules', icon: <Clock size={16} />, content: 'Conducting physical verification on a regular basis to ensure ongoing accuracy. Frequency may vary by asset type, organization size, and risk. High-value or high-risk assets may require more frequent verification.' },
                  { title: '7. Use of Technology', icon: <Cpu size={16} />, content: 'Leveraging barcode scanners, RFID technology, and mobile devices to automate data collection and reduce errors. Asset tracking software provides real-time visibility into asset locations and movements.' },
                  { title: '8. Training and Awareness', icon: <Users size={16} />, content: 'Ensuring all personnel involved in asset management are trained on the importance of physical verification and procedures. This promotes a culture of accountability and ensures everyone understands their role.' },
                  { title: '9. Independent Verification', icon: <UserCheck size={16} />, content: 'Where possible, engaging external auditors or assigning personnel from different departments to conduct verification. This provides an objective assessment of the accuracy of asset records.' },
                  { title: '10. Continuous Improvement', icon: <RefreshCw size={16} />, content: 'Continuously reviewing and improving the verification process by analysing results, identifying improvement areas, and implementing changes to enhance efficiency and accuracy.' },
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

            {/* SECTION 3: Asset Procurement */}
            <div
              ref={(el) => {
                sectionRefs.current['procurement'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Asset Procurement
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Determining asset procurement is a strategic process that involves identifying, evaluating, and acquiring the necessary assets to support an organization's operations and objectives. It is a comprehensive approach that considers the long-term impact of asset acquisitions on financial performance, operational efficiency, and strategic goals.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Needs Assessment and Justification', icon: <Target size={16} />, content: 'Conducting a thorough needs assessment to identify specific assets required to support operations and strategic goals. Analysing current and future needs, considering production capacity, technology, and market demands. Preparing detailed justification outlining rationale, expected benefits, and return on investment.' },
                  { title: '2. Asset Specification and Selection', icon: <SettingsIcon size={16} />, content: 'Developing detailed specifications outlining required features, performance, and quality standards. Evaluating potential suppliers and asset options considering cost, reliability, performance, and supplier reputation. May involve requesting proposals, conducting product demonstrations, and evaluating vendor references.' },
                  { title: '3. Financial Analysis and Budgeting', icon: <DollarSign size={16} />, content: 'Conducting financial analysis to evaluate implications of asset procurement. Estimating total cost of ownership including purchase price, installation, maintenance, and operating costs. Developing a budget allocating necessary funds for procurement.' },
                  { title: '4. Procurement Method Selection', icon: <ShoppingCart size={16} />, content: 'Selecting appropriate procurement method based on asset type, procurement policies, and market conditions. Options include purchasing, leasing, or renting. Considering factors such as cost, flexibility, and tax implications.' },
                  { title: '5. Supplier Negotiation and Contract Management', icon: <Handshake size={16} />, content: 'Negotiating with suppliers for favourable terms on pricing, delivery schedules, warranty, and payment terms. Preparing comprehensive contracts outlining agreed terms. Monitoring supplier performance and ensuring compliance with contract terms.' },
                  { title: '6. Asset Acquisition and Installation', icon: <Package size={16} />, content: 'Acquiring and installing the asset according to agreed specifications and schedule. Coordinating with suppliers, contractors, and internal departments. Ensuring proper installation and commissioning for efficient and safe operation.' },
                  { title: '7. Asset Registration and Tracking', icon: <ClipboardList size={16} />, content: 'Registering the asset in the organization\'s asset register upon acquisition, recording essential information (asset tag, serial number, acquisition date, cost). Implementing tracking systems to monitor location, condition, and usage.' },
                  { title: '8. Asset Maintenance and Management', icon: <Wrench size={16} />, content: 'Implementing preventive maintenance schedules, conducting regular inspections, and performing necessary repairs. Monitoring asset usage, tracking maintenance costs, and evaluating asset performance to extend lifespan and prevent breakdowns.' },
                  { title: '9. Asset Disposal', icon: <Trash2 size={16} />, content: 'Responsibly disposing of assets at end of useful life through selling, scrapping, or recycling. Conducting disposal in accordance with policies and environmental regulations, including removal of sensitive data.' },
                  { title: '10. Performance Evaluation and Continuous Improvement', icon: <BarChart3 size={16} />, content: 'Regularly evaluating asset performance using key performance indicators (utilization, maintenance costs, downtime). Continuously reviewing and improving the procurement process based on performance evaluation and feedback.' },
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

            {/* SECTION 4: Internal Control Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['controls'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Internal Control Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Observing internal control systems is a critical process for evaluating their effectiveness and identifying potential weaknesses. It is about actively observing how controls are implemented and executed in practice, providing valuable insights into the real-world application of controls and revealing discrepancies between documented procedures and actual practices.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Understanding the Control Environment', icon: <Building2 size={16} />, content: 'Assessing the organization\'s culture, ethical values, and management\'s commitment to internal controls. Observing the tone at the top, clarity of organizational structure, and effectiveness of communication channels. A strong control environment fosters compliance and accountability.' },
                  { title: '2. Direct Observation of Control Activities', icon: <Eye size={16} />, content: 'Witnessing execution of control activities in real-time — observing how employees perform tasks, handle transactions, and use equipment. Observing segregation of duties (authorization, custody, recording) helps identify conflicts of interest and deviations from documented procedures.' },
                  { title: '3. Review of Documentation and Records', icon: <FileText size={16} />, content: 'Examining transaction records, reports, and relevant documents to verify accuracy and completeness. Reviewing audit trails and exception reports to identify anomalies and potential control weaknesses. Comparing documented procedures with actual practices.' },
                  { title: '4. Walkthroughs and Process Mapping', icon: <Workflow size={16} />, content: 'Tracing transactions from initiation to completion to identify control points and assess effectiveness. Process mapping visually represents process flow and control points, helping identify bottlenecks, redundancies, and control gaps.' },
                  { title: '5. Interviews with Personnel', icon: <Users size={16} />, content: 'Interviewing personnel involved in control activities to gain insights into their understanding of controls and implementation challenges. Helps assess awareness and understanding of control procedures among employees.' },
                  { title: '6. Testing and Sampling', icon: <CheckSquare size={16} />, content: 'Examining a subset of transactions or records to assess control effectiveness. Testing accuracy of data entry, completeness of documentation, and effectiveness of authorization procedures. Provides statistical evidence of control effectiveness.' },
                  { title: '7. Evaluation of Control Effectiveness', icon: <Target size={16} />, content: 'Assessing whether controls are operating as intended and achieving their objectives. Identifying and documenting control weaknesses or deficiencies. Developing recommendations for improvement and communicating to management.' },
                  { title: '8. Continuous Monitoring and Feedback', icon: <RefreshCw size={16} />, content: 'Maintaining ongoing observation of controls through regular review of activities, assessing performance, and adjusting as needed. Considering feedback from employees and stakeholders in evaluation and improvement.' },
                  { title: '9. Documentation of Observations', icon: <FileText size={16} />, content: 'Thoroughly documenting all observations, findings, and recommendations. Maintaining records of the observation process to support evaluation of control effectiveness and facilitate communication with management and auditors.' },
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

            {/* SECTION 5: Maintaining an Asset Register */}
            <div
              ref={(el) => {
                sectionRefs.current['maintenance'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Maintaining an Asset Register
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Maintaining an asset register is a continuous and vital process for any organization that owns or manages physical assets. It is an ongoing commitment to accurate record-keeping, ensuring that the register reflects the status and value of all assets. A well-maintained asset register provides essential information for financial reporting, asset tracking, maintenance planning, and overall asset management.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: '1. Regular Updates and Data Integrity', icon: <RefreshCw size={16} />, content: 'Regularly updating the asset register to reflect changes in asset status (acquisitions, disposals, transfers, modifications). Timely and accurate data entry is crucial for maintaining integrity. Implementing a system for regular updates ensures the register remains a reliable source of information.' },
                  { title: '2. Tracking Asset Movements and Locations', icon: <MapPin size={16} />, content: 'Tracking the location of each asset, especially for mobile assets or assets moved between departments. Accurate location tracking helps prevent loss or theft and facilitates efficient asset retrieval.' },
                  { title: '3. Recording Maintenance and Repair History', icon: <Wrench size={16} />, content: 'Including records of all maintenance and repair activities (preventive maintenance, repairs, upgrades). Tracking maintenance history provides insights into asset performance, identifies recurring issues, and supports maintenance planning.' },
                  { title: '4. Calculating and Recording Depreciation', icon: <Calculator size={16} />, content: 'Including depreciation method and rate for each asset, and accumulating depreciation. Regular depreciation calculations ensure financial statements accurately reflect asset value and support correct tax calculations.' },
                  { title: '5. Conducting Periodic Audits and Reconciliations', icon: <Search size={16} />, content: 'Regular physical audits to verify existence and condition of assets, and reconciliations comparing register with financial records. Discrepancies should be investigated and corrected, acting as a deterrent to theft.' },
                  { title: '6. Utilizing Asset Management Software', icon: <Database size={16} />, content: 'Using asset management software to automate data entry, tracking, and reporting. Reducing errors and improving efficiency with features for generating reports, tracking maintenance, and managing depreciation.' },
                  { title: '7. Establishing Clear Roles and Responsibilities', icon: <Users size={16} />, content: 'Clearly defining roles for data entry, updates, audits, and reporting. Training all personnel involved on procedures for maintaining the register to ensure everyone understands their role.' },
                  { title: '8. Ensuring Data Security and Accessibility', icon: <Shield size={16} />, content: 'Implementing security measures (access controls, encryption) to protect sensitive information. Ensuring the register is readily accessible to authorized personnel for reporting and analysis, balancing security with accessibility.' },
                  { title: '9. Integrating with Other Systems', icon: <Link size={16} />, content: 'Integrating the asset register with financial accounting, maintenance management, and procurement systems for seamless data exchange and elimination of manual data entry.' },
                  { title: '10. Regular Review and Improvement', icon: <RefreshCw size={16} />, content: 'Continuously reviewing and improving the maintenance process by analysing data, identifying improvement areas, and implementing changes to enhance efficiency and accuracy, updating procedures to reflect technology or regulatory changes.' },
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
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 Asset Management Insight
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
                  <span>Register Preparation Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Verification Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Procurement Steps</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Effective asset management requires a comprehensive asset register that is regularly maintained, verified through physical inspections, and supported by robust procurement processes. Internal controls are essential for ensuring accuracy, accountability, and compliance throughout the asset lifecycle — from planning and acquisition to maintenance and disposal.
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
                <strong className="text-white">Asset Register</strong> – a comprehensive record tracking the lifecycle of each asset from acquisition to disposal, providing essential information for tracking, maintenance, depreciation, and financial reporting.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Physical Verification</strong> – systematic examination of physical assets to confirm existence, condition, and location, involving planning, inspection, reconciliation, and corrective actions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Asset Procurement</strong> – strategic process including needs assessment, specification, financial analysis, supplier negotiation, acquisition, registration, maintenance, and disposal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Internal Controls</strong> – observing control environment, direct observation, documentation review, walkthroughs, interviews, testing, and continuous monitoring to ensure controls function as intended.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Maintaining Register</strong> – ongoing commitment requiring regular updates, location tracking, maintenance records, depreciation calculation, audits, software utilization, and integration with other systems.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── Footer Branding ────────────────────────────────────────────── */}
      <footer className="mx-auto px-[5px] sm:px-6 md:px-8 pb-8 text-center opacity-30">
        <div className="inline-flex items-center gap-2">
          <BookOpen size={16} />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Sidemann Academic Registry • Asset &amp; Procurement Management 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome1;
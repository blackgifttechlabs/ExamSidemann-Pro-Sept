import React, { useState, useRef, useEffect } from 'react';
import {
  FolderTree, Search, X, DollarSign, Shield, AlertTriangle,
  Database, Activity, Clock, Zap, Users,
  BookOpen, BarChart, Scale,
  
  RefreshCw,
  User, 
  
  CreditCard, 
  FileText,
  
  Award, 

  MessageCircle, 
  Mail, 
  
  ClipboardCheck, 
  FileSearch,

  Folder, 
  Archive
  
  } from 'lucide-react';

// Define sections with their keywords for search
const sections = [
  {
    id: 'introduction',
    title: 'An Introduction to Customer Records',
    keywords: ['records', 'customer records', 'data archiving', 'audit trail', 'statutory requirement', 'due diligence'],
  },
  {
    id: 'types',
    title: 'Types of Customer Records that Banks Maintain',
    keywords: ['types', 'identity records', 'mandate', 'transaction records', 'correspondence', 'credit records', 'loan records'],
  },
  {
    id: 'justifying',
    title: 'Justifying Why Banks Should Maintain Customer Records',
    keywords: ['justifying', 'legal requirements', 'regulatory', 'audit trail', 'dispute resolution', 'risk management', 'credit decisions', 'customer service'],
  },
  {
    id: 'updating',
    title: 'Updating Customer Records in Line with Customer Instructions',
    keywords: ['updating', 'customer instruction', 'mandate', 'verification', 'data integrity', 'supporting documents'],
  },
  {
    id: 'policy-updates',
    title: 'Updating Customer Accounts in Line with Organisational Policy',
    keywords: ['policy updates', 'organisational policy', 'dormant account', 'account status', 'KYC review', 'interest', 'charges', 'flagging', 'product features'],
  },
  {
    id: 'timelines',
    title: 'Adhering to Organisational Timelines',
    keywords: ['timelines', 'turnaround time', 'SLA', 'service level agreement', 'efficiency', 'customer expectations', 'security', 'reputation', 'regulatory'],
  },
];

// Helper to flatten section keywords for search
const searchIndex = sections.flatMap(s =>
  s.keywords.map(kw => ({ keyword: kw, sectionId: s.id, sectionTitle: s.title }))
);

export const LearningOutcome5: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ keyword: string; sectionId: string; sectionTitle: string }[]>([]);
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Dark mode effect
  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Search handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase().trim();
    setSearchQuery(query);
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }
    const matches = searchIndex.filter(item => item.keyword.includes(query));
    const unique = matches.reduce((acc, current) => {
      if (!acc.some(item => item.sectionId === current.sectionId)) {
        acc.push(current);
      }
      return acc;
    }, [] as typeof matches);
    setSuggestions(unique.slice(0, 6));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      const first = suggestions[0];
      scrollToSection(first.sectionId);
    }
  };

  const handleSuggestionClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setSearchQuery('');
    setSuggestions([]);
  };

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs.current[sectionId];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightedSection(sectionId);
      setTimeout(() => {
        setHighlightedSection(null);
      }, 3000);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  // Styling helpers
  const containerClasses = isDarkMode
    ? 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-12';

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: '',
      green: '',
      purple: '',
      amber: '',
      red: '',
      indigo: '',
      pink: '',
      teal: '',
      orange: '',
    };
    const borderColor = colorMap[color] || colorMap.blue;
    const base = `py-4 mb-4 ${borderColor}`;
    const dark = isDarkMode ? 'bg-[#252526]' : 'bg-white';
    return `${dark} ${base} hover:-translate-y-1 hover:scale-[1.01]`;
  };

  // Corrected SectionWrapper with proper ref callback
  const SectionWrapper = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const isHighlighted = highlightedSection === id;
    return (
      <div
        ref={(el) => {
          if (sectionRefs.current) {
            if (el) {
              sectionRefs.current[id] = el;
            } else {
              delete sectionRefs.current[id];
            }
          }
        }}
        className={`transition-all duration-500 ${isHighlighted ? 'ring-4 ring-yellow-400 ring-opacity-70 shadow-2xl rounded-lg' : ''}`}
        style={{ scrollMarginTop: '80px' }}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      
      {/* SEARCH BAR */}
      <div className="sticky top-0 z-50 bg-opacity-80 backdrop-blur-md p-4 rounded-b-2xl shadow-lg dark:bg-gray-800/80 bg-white/80 transition-all duration-300">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sections... (e.g., records, KYC, dormant, timelines, mandate)"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-10 py-3 rounded-full border-2 border-indigo-300 dark:border-indigo-600 bg-white/90 dark:bg-gray-700/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              {suggestions.map((sug) => (
                <div
                  key={sug.sectionId}
                  onClick={() => handleSuggestionClick(sug.sectionId)}
                  className="px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <FolderTree className="w-4 h-4 text-indigo-500" />
                  <span className="font-medium text-sm">{sug.sectionTitle}</span>
                  <span className="text-xs text-gray-400 ml-auto">({sug.keyword})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HEADER SECTION */}
      <header className={`relative w-full mb-12 rounded-[5px] overflow-hidden shadow-2xl ${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'} mt-4`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <FolderTree className="w-4 h-4" />
              Record Keeping
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              The Responsibility of <span className="text-rose-300 font-bold italic">Record‑Keeping</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Explore the importance of customer records, types of records, updating processes, policy-driven updates, and adhering to organisational timelines.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">record_keeping.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Records;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Types;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">IMPLEMENT</span><span className="text-white">Updates;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Archive className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Folder className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: INTRODUCTION ========== */}
        <SectionWrapper id="introduction">
          <section className="space-y-6">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>An Introduction to Customer Records</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine a hospital. For every single patient, the hospital creates and maintains a detailed file. This file contains their personal details, their medical history, the results of every test they have taken, and a record of every treatment they have received. This record is one of the most important tools the hospital has. It allows any doctor to quickly understand the patient's health, ensures that treatments are safe and consistent, and provides a legal record of the care provided. The hospital doesn't just keep these records for a week or a month; it maintains them securely for many years.</p>
              <p>A bank operates in a very similar way. For every customer, the bank creates and maintains a comprehensive set of records. This is not just a matter of good organisation; it is a fundamental legal and operational requirement. From the initial account opening forms to the statement of every transaction that has ever occurred, these records form the complete financial history of the customer's relationship with the bank.</p>
              <p>This chapter will explore the different types of customer records that banks must maintain, and the critical reasons why this meticulous record-keeping is so essential. Proper records management is the backbone of the bank's operations, ensuring accountability, compliance with the law, and the ability to provide a seamless and secure service to the customer.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Customer Records:</strong> The complete collection of documents and data that a bank holds relating to a specific customer and their accounts.</li>
                <li><strong>Data Archiving:</strong> The process of moving data that is no longer actively used to a separate storage device for long-term retention.</li>
                <li><strong>Statutory Requirement:</strong> An obligation that is imposed by a law or statute. Banks have a statutory requirement to maintain records for a minimum period.</li>
                <li><strong>Audit Trail:</strong> A detailed, chronological record of all activities. Customer records form the primary audit trail for all banking relationships.</li>
                <li><strong>Due Diligence:</strong> The care that a reasonable person should take. Maintaining accurate records is a key part of a bank's due diligence obligations.</li>
              </ul>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 2: TYPES OF CUSTOMER RECORDS ========== */}
        <SectionWrapper id="types">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Types of Customer Records that Banks Maintain</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>A customer's record is not a single document but a comprehensive file that contains many different types of information. These records can be divided into two main categories: physical documents and digital data.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><User size={20} /> Identity and Mandate Records</h3>
                <p>This is the foundational set of documents collected when the account is first opened. It includes the original account opening form, certified copies of the customer's Proof of ID and Proof of Residence (the core KYC documents), and the specimen signature card that the bank uses to verify signatures on cheques and instructions. For a corporate account, this category would also include all the company registration documents and the board resolution that specifies the signing arrangements (the "mandate").</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> Transaction Records</h3>
                <p>This is the dynamic part of the customer's file. It is a complete historical log of every single transaction that has ever passed through the customer's account. This includes records of all deposits, withdrawals, transfers (like RTGS and ZIPIT), debit card swipes, and any loan repayments. This data is primarily stored digitally and is summarised for the customer in their regular bank statements.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Mail size={20} /> Correspondence Records</h3>
                <p>The bank must also keep a record of its significant interactions and communications with the customer. This can include copies of official letters sent to the customer, important emails regarding their account, and sometimes, logs or notes from significant phone calls or in-person meetings, especially those involving formal requests or complaints.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><CreditCard size={20} /> Credit and Loan Records</h3>
                <p>For customers who have borrowed money, the bank maintains a separate, detailed file. This includes the original loan application form, the formal loan agreement contract, any collateral documents (like the title deeds for a house), and a full history of the loan repayment schedule.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 3: JUSTIFYING WHY BANKS MAINTAIN RECORDS ========== */}
        <SectionWrapper id="justifying">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Justifying Why Banks Should Maintain Customer Records</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <p>Banks don't keep these extensive records just for fun; there are several critical legal, operational, and customer service reasons that make it an absolute necessity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 1. To Comply with Legal and Regulatory Requirements</h3>
                <p>The laws of Zimbabwe (such as the Money Laundering and Proceeds of Crime Act) and the regulations set by the Reserve Bank of Zimbabwe legally require all financial institutions to maintain complete customer records for a specified minimum period (often several years even after an account is closed). This is to ensure that there is always a clear audit trail available for inspection by regulators or for use in criminal investigations.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileSearch size={20} /> 2. To Provide an Audit Trail and Resolve Disputes</h3>
                <p>Customer records provide a definitive, historical account of the relationship. If a customer disputes a transaction from six months ago, the bank can retrieve the transaction records and source documents (like the deposit slip) to prove exactly what happened. This protects both the customer from errors and the bank from fraudulent claims.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 3. To Manage Risk and Prevent Fraud</h3>
                <p>The historical data in a customer's record is essential for the account monitoring process. The bank analyses these records to build a "normal" profile for the customer. Without a detailed history, it would be impossible for the bank's systems to spot an unusual or potentially fraudulent transaction.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BarChart size={20} /> 4. To Make Informed Business and Credit Decisions</h3>
                <p>When a customer applies for a loan, the first thing the bank does is review their existing customer records. The history of how they have managed their deposit accounts provides a clear indication of their financial discipline and helps the bank to make a responsible lending decision. These records are a crucial input for assessing credit risk.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 5. To Provide Better Customer Service</h3>
                <p>Having a complete and easily accessible record allows the bank to serve the customer more efficiently. When a customer calls, any bank employee can quickly look up their file and understand their history and relationship with the bank. This allows them to provide informed and consistent service without the customer having to explain their situation from the beginning every single time.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 4: UPDATING RECORDS IN LINE WITH CUSTOMER INSTRUCTIONS ========== */}
        <SectionWrapper id="updating">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Updating Customer Records in Line with Customer Instructions</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>A customer's life is not static; it is constantly changing. A student graduates and gets a job. A person gets married and changes their surname. A family moves from a small flat in the Avenues to a new house in Westgate. A business owner appoints a new director who needs to be able to sign on the company's bank account. When these life events happen, the information the bank holds for the customer is no longer accurate.</p>
              <p>An outdated customer record is a serious problem. It can lead to important mail being sent to the wrong address, security alerts being sent to an old phone number, and, most dangerously, unauthorised individuals still having access to an account. Therefore, the process of updating customer records is a crucial, ongoing task.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Customer Instruction:</strong> A formal and verifiable request made by a customer to the bank to perform a specific action, such as changing their personal details.</li>
                <li><strong>Mandate (Signing Mandate):</strong> The official instruction, particularly for a corporate account, that details who is authorised to sign and transact on the account.</li>
                <li><strong>Verification:</strong> The process of confirming the authenticity of a customer's instruction and their identity before making any changes to their records.</li>
                <li><strong>Data Integrity:</strong> The overall accuracy, completeness, and consistency of data. Updating records is essential for maintaining data integrity.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageCircle size={20} /> 1. Receiving the Customer's Instruction</h3>
                <p>The process begins when the customer communicates their need for a change. For security reasons, most significant changes cannot be made over the phone. Banks have specific organisational policies that dictate the required channel for different types of instructions. A simple change of a mobile number might be done via the mobile app after a security verification, but a more significant change, like a change of surname or account signatories, almost always requires the customer to visit the branch in person and fill out a formal, signed instruction form.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 2. Verifying the Customer's Identity</h3>
                <p>This is the most critical precaution. Before any change is made, you must be 100% certain that the instruction is coming from the actual customer and not a fraudster. For an in-person request, this means asking for the customer's original National ID or passport and comparing the photo and signature to the records the bank already holds. For a written instruction, it means meticulously comparing the signature on the letter or form to the specimen signature that the bank has on file from when the account was opened. No changes should ever be made without this fundamental identity verification.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><FileText size={20} /> 3. Obtaining the Necessary Supporting Documents</h3>
                <p>Different types of updates require different proof. The bank cannot simply take the customer's word for it; a clear audit trail requires official documentation. For example, a customer wanting to change their surname after getting married must provide the original Marriage Certificate. A business wanting to change the signatories on their corporate account must provide a new Board Resolution, signed by the company directors, which clearly states the old mandate is cancelled and specifies the new signing arrangements.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Database size={20} /> 4. Executing the Update in the Banking System</h3>
                <p>Once the instruction has been received through the proper channel and both the customer's identity and the supporting documents have been verified, the bank officer can then proceed to make the change in the bank's core banking system. This requires careful and accurate data entry. The officer will access the customer's profile and update the relevant field—be it the address, the surname, or the list of authorised signatories. This step must be performed with great attention to detail to ensure the new information is captured correctly.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ClipboardCheck size={20} /> 5. Confirming the Update and Filing the Records</h3>
                <p>After the change has been made in the system, it is good practice to confirm the update with the customer. This can be done by printing out the updated profile for them to review and sign, or by sending a formal confirmation letter or SMS. Finally, the original instruction form and the certified copies of the supporting documents must be filed correctly in the customer's physical or digital file. This ensures that a complete record of the change is maintained, showing what was changed, who authorised it, and when it was done.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 5: UPDATING ACCOUNTS IN LINE WITH ORGANISATIONAL POLICY ========== */}
        <SectionWrapper id="policy-updates">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Updating Customer Accounts in Line with Organisational Policy</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Think about the software on your smartphone. Every now and then, you get a notification telling you that an "update is available." You don't ask for this update, but the company (like Apple or Google) pushes it out to you. These updates are essential; they fix security vulnerabilities, improve performance, and ensure the system is running according to the latest standards. It's an automatic, policy-driven process designed to keep the system healthy and secure.</p>
              <p>In a similar way, banks perform regular, automatic updates on customer accounts that are not initiated by a customer's direct instruction. These updates are driven by the bank's own internal organisational policy.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Organisational Policy:</strong> A set of formal rules, principles, and guidelines adopted by an organisation to reach its long-term goals and to govern its internal processes.</li>
                <li><strong>Dormant Account:</strong> A bank account that has had no customer-initiated financial activity for a specified long period of time.</li>
                <li><strong>Account Status:</strong> A label or classification given to an account in the banking system that can affect how it is treated (e.g., Active, Dormant, Frozen).</li>
                <li><strong>System-Generated Update:</strong> An automatic change made to an account's status or details by the bank's core banking software, based on pre-defined policy rules.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Clock size={20} /> 1. Updating Account Status to "Dormant"</h3>
                <p>Every bank has a policy that defines the period of inactivity after which an account is considered "dormant." In Zimbabwe, this is typically a period of 12 months with no customer-initiated transactions. When the system detects that an account has passed this threshold, it will automatically change its status from "Active" to "Dormant." This is a critical risk management procedure. A dormant account is more vulnerable to fraud because the legitimate owner is not monitoring it. Changing the status often places a restriction on the account, requiring the owner to visit the branch and provide their ID to "reactivate" it.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><RefreshCw size={20} /> 2. Periodic KYC and Customer Information Reviews</h3>
                <p>Regulatory requirements and good banking practice demand that customer information does not become stale. Therefore, banks have a policy for the periodic review of customer records, especially for high-risk or corporate clients. The bank's policy might state that every two or three years, a relationship manager must contact their corporate clients to request updated documents, such as a new CR5 (list of directors) or an updated tax clearance certificate. This is a proactive, policy-driven update to ensure the bank's KYC information remains current and compliant with the law.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><DollarSign size={20} /> 3. Applying Interest and Bank Charges</h3>
                <p>The monthly or quarterly crediting of interest to a savings account, and the debiting of service fees from a current account, are also policy-driven updates. The bank's central system is programmed to automatically run these calculations and post the transactions to millions of accounts on a specific date, according to the rates and fees outlined in the bank's official policy and the customer's account agreement.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20} /> 4. Flagging Accounts for Review or Closure</h3>
                <p>The bank's risk management policies define the rules for the account monitoring system. When a customer's account consistently breaches these policy rules—for example, by repeatedly having transactions that are flagged as suspicious—the system will automatically update the account's status to "Flagged for Review." This triggers a manual investigation by a compliance officer. If the activity is found to be in serious breach of the bank's policies, the policy will then dictate the process for account termination.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> 5. Updating Product Features or Terms and Conditions</h3>
                <p>When a bank decides to change the features, fees, or terms and conditions for a certain type of account, this change is rolled out to all affected accounts as a policy-driven update. For example, a bank might have a policy to upgrade all basic "Youth Accounts" to a standard "Current Account" automatically when the account holder reaches the age of 25. The system would be programmed to identify all customers turning 25 and automatically update their account type in line with this organisational policy.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* ========== SECTION 6: ADHERING TO ORGANISATIONAL TIMELINES ========== */}
        <SectionWrapper id="timelines">
          <section className="space-y-6 pt-12">
            <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
              <h2 className={sectionHeaderClasses}>Adhering to Organisational Timelines</h2>
            </div>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h3 className="text-xl font-bold">What's the Big Idea?</h3>
              <p>Imagine you order a meal at a Chicken Inn. You expect your two-piecer and chips to be ready in a few minutes. You would be very unhappy if the staff told you to come back in three hours. Similarly, if you report a burst water pipe to the City of Harare, you expect them to respond with urgency, not in three weeks. In the world of service, speed matters. The quality of a service is not just about what is done, but also about when it is done.</p>
              <p>In banking, the element of time is even more critical. Delays can have serious financial and emotional consequences for a customer. A delay in processing a deposit could mean a business fails to pay its staff on time. A delay in blocking a stolen debit card could lead to a customer losing their life savings. To ensure that all tasks are completed in a timely and efficient manner, banks establish strict organisational timelines.</p>
            </div>

            <div className={cardClasses('blue')}>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BookOpen size={20} /> Key Vocabulary</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Organisational Timeline:</strong> A pre-defined, official timeframe or deadline within which a specific task or process must be completed by an employee.</li>
                <li><strong>Service Level Agreement (SLA):</strong> A formal commitment between a service provider (the bank) and a client that specifies the standards and timelines for the services to be rendered.</li>
                <li><strong>Turnaround Time (TAT):</strong> A common business metric that measures the time elapsed from the moment a request is received to the moment it is fulfilled.</li>
                <li><strong>Efficiency:</strong> The ability to accomplish a task with the minimum amount of time and effort.</li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className={cardClasses('blue')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Users size={20} /> 1. To Meet Customer Expectations and Ensure Satisfaction</h3>
                <p>Modern customers expect service to be fast and efficient. A bank that consistently meets or beats its promised timelines for common tasks—like issuing a new debit card or processing a loan application—will be seen as reliable and professional. A customer who is told their new account will be open in 24 hours and finds that it is, will be satisfied. Conversely, failing to meet these basic timelines is one of the quickest ways to create a frustrated and dissatisfied customer.</p>
              </div>
              <div className={cardClasses('green')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> 2. To Mitigate Financial and Security Risks</h3>
                <p>In many banking operations, time is a critical security factor. A customer's instruction to block a stolen card or to place a stop payment on a cheque must be actioned immediately. The organisational timeline for such high-priority tasks is often measured in minutes, not hours. Any delay creates a window of opportunity for fraudsters to steal the customer's money. By adhering strictly to these urgent timelines, you are actively protecting the customer and the bank from financial loss.</p>
              </div>
              <div className={cardClasses('purple')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={20} /> 3. To Ensure Operational Efficiency and Manage Workload</h3>
                <p>Organisational timelines create a structured and predictable workflow within the bank. They prevent backlogs from building up and ensure a smooth operational flow. When every employee completes their tasks within the specified turnaround time, the entire system works efficiently. If one person delays, it can create a bottleneck that affects other departments and slows down the service for many other customers. Following timelines is a key part of being a reliable and effective team member.</p>
              </div>
              <div className={cardClasses('amber')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Award size={20} /> 4. To Maintain the Bank's Professional Reputation</h3>
                <p>A bank's reputation is built on its perceived reliability and competence. A bank that is known for being slow—slow queues, slow application processes, slow problem resolution—will quickly gain a negative reputation in the market. Adhering to timelines is a tangible way to demonstrate the bank's commitment to professionalism. It sends a powerful message to customers that the bank values their time and is managed efficiently.</p>
              </div>
              <div className={cardClasses('red')}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Scale size={20} /> 5. To Comply with Regulatory and Legal Standards</h3>
                <p>In some cases, timelines are not just internal policy; they are a matter of law. For example, financial regulations may dictate the maximum amount of time a bank has to resolve a formal customer complaint or to respond to a request from a regulatory body. Failing to adhere to these statutory timelines can result in fines and other penalties for the bank. Therefore, following the internal timeline is often essential for ensuring the bank remains in good standing with its regulators.</p>
              </div>
            </div>
          </section>
        </SectionWrapper>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of The Responsibility of Record‑Keeping</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Customer Records</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">KYC</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Audit Trail</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Mandate</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Dormant Account</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Policy Update</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Organisational Timeline</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">SLA</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Record‑Keeping & Accountability. 📁🔏</p>
        </footer>

      </div>
    </div>
  );
};
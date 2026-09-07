import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FolderTree,
  Hash,
  SettingsIcon,
  FileText,
  Scissors,
  Scale,
  Gavel,
  Home,
  Building2,
  Landmark,
  Package,
  Truck,
  Shield as ShieldIcon,
  Users,
  Clock,
  Lock,
  RefreshCw,
  Flag,
  Flame,
  Users2,
  Handshake,
  Lightbulb,
  Plus,
  BookOpen,
  Search,
  X as XIcon,
  Sparkles,
  ChevronUp,
  AlertCircle,
  Globe,
  FileCode,
  UserCheck,
  GraduationCap,
  Briefcase,
  Rocket,
  Menu,
  MousePointer,
  Touchpad,
  Grid3X3,
  Palette,
  Settings,
  FileText as FileTextIcon,
  MessageSquare,
  Mail,
  Calendar,
  MapPin,
  Globe as GlobeIcon,
  Factory,
  TrendingUp,
  Activity,
  Database,
  Warehouse,
  RefreshCw as RefreshIcon,
  ChevronDown,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'intro', label: 'Law of Property' },
  { id: 'application', label: 'Application' },
  { id: 'classification', label: 'Classification' },
  { id: 'real-personal-rights', label: 'Real vs Personal' },
  { id: 'acquiring-ownership', label: 'Acquiring Ownership' },
  { id: 'transferring-ownership', label: 'Transferring Ownership' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome5: React.FC = () => {
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
        text: 'The concept of "property" in law includes both tangible things (like land and goods) and intangible rights (like patents and copyrights).',
      },
      {
        title: 'Pro Tip',
        text: 'When transferring ownership of real property, always ensure the deed is properly recorded. Unrecorded deeds may not be enforceable against third parties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 methods of acquiring ownership: Occupation, Transfer, Prescription, Accession, and Appropriation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse possession with ownership. You can possess something without owning it (e.g., a tenant in a rental property).',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The concept of "property" in law includes both tangible things (like land and goods) and intangible rights (like patents and copyrights).',
      },
      {
        title: 'Pro Tip',
        text: 'When transferring ownership of real property, always ensure the deed is properly recorded. Unrecorded deeds may not be enforceable against third parties.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the 5 methods of acquiring ownership: Occupation, Transfer, Prescription, Accession, and Appropriation.',
      },
      {
        title: 'Common Mistake',
        text: 'Don\'t confuse possession with ownership. You can possess something without owning it (e.g., a tenant in a rental property).',
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
                ? 'bg-orange-600 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30'
                : 'bg-white dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Helper to render a card ─────────────────────────────────────────────
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
      <header className="bg-[#881337] dark:bg-[#4c0519] border-b border-rose-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> ND PURCHASING &amp; SUPPLY
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Law of Property &{' '}
            <span className="text-rose-300 font-bold italic">
              Ownership
            </span>
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl leading-relaxed">
            Complete guide to the law of property, classification of things, real and personal rights, methods of acquiring ownership, and transfer of ownership.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-orange-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scale size={14} className="inline mr-1" /> Property Law
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Home size={14} className="inline mr-1" /> Ownership
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Handshake size={14} className="inline mr-1" /> Transfer
            </span>
          </div>

          {/* Search Bar inline */}
          <div className="mt-6 max-w-xl">
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <Search className="ml-4 text-orange-200" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for a concept, ownership, possession..."
                className="w-full bg-transparent border-none outline-none py-3 px-3 text-white placeholder-orange-200/70 font-medium"
              />
              {inputValue && (
                <button
                  onClick={() => {
                    setInputValue('');
                    searchInputRef.current?.focus();
                  }}
                  className="mr-3 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XIcon size={18} className="text-orange-200" />
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
            {/* SECTION 1: Law of Property */}
            <div
              ref={(el) => {
                sectionRefs.current['intro'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Law of Property
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    The law of property governs the rights and obligations related to ownership and possession of tangible and intangible assets. It defines what constitutes "property," how it can be acquired, transferred, and protected, and the various interests that can exist within it.
                  </p>
                  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed mt-2">
                    The law of property is a complex legal area that encompasses a wide range of concepts, including:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Ownership:</strong> The most comprehensive right a person can have in property, including the right to possess, use, enjoy, and dispose of it.</li>
                    <li><strong>Possession:</strong> The physical control of property, which may or may not be accompanied by ownership.</li>
                    <li><strong>Real Property (Immovable Property):</strong> Land and anything permanently attached to it, such as buildings, fixtures, and mineral rights.</li>
                    <li><strong>Personal Property (Movable Property):</strong> All other types of property, including tangible goods, vehicles, and intangible assets like intellectual property.</li>
                    <li><strong>Interests in Property:</strong> Various rights that can exist in property, such as easements, leases, mortgages, and liens.</li>
                  </ul>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Building2 size={16} /> 1. Real Estate Transactions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When buying or selling a house, the law of property governs the transfer of ownership, the registration of deeds, and the resolution of disputes related to boundaries or title.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, the law outlines the steps involved in conducting a title search, drafting a deed, and recording the transaction in the land registry.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Users size={16} /> 2. Landlord-Tenant Relationships
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The law of property governs the rights and obligations of landlords and tenants, including lease agreements, rental payments, eviction procedures, and the maintenance of premises.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, it would define the landlords right to collect rent, and the tenants right to quiet enjoyment of the property.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <FileText size={16} /> 3. Inheritance and Wills
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When a person dies, the law of property determines how their assets are distributed to their heirs. This involves the interpretation of wills, the administration of estates, and the resolution of inheritance disputes.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, the law dictates the proper legal process for proving a will and distributing the property as the will indicates.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Lightbulb size={16} /> 4. Intellectual Property
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The law of property protects intangible assets such as patents, copyrights, and trademarks. It grants creators and innovators exclusive rights to their works, encouraging innovation and creativity.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, copyright law grants authors exclusive rights to their literary and artistic works, while patent law grants inventors' exclusive rights to their inventions.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Lock size={16} /> 5. Secured Transactions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When a person borrows money and uses property as collateral, the law of property governs the rights of the lender to seize and sell the property in case of default.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, mortgage law defines the rights of a bank to foreclose on a property if the borrower fails to make mortgage payments.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <Gavel size={16} /> 6. Dispute Resolution
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    When property disputes arise, the legal system provides mechanisms for resolving them, such as litigation, arbitration, and mediation.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    For example, disputes over property boundaries, easements, or ownership can be resolved through court proceedings.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: "Things" and Their Classification */}
            <div
              ref={(el) => {
                sectionRefs.current['classification'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                "Things" and Their Classification
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In legal terms, "things" (or property) refer to anything that can be owned or possessed. They are objects of legal rights. Classifying these "things" is essential for determining the applicable legal rules and principles.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Hash size={16} /> Definition of 'Things'
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  "Things" are legally defined as any object that is capable of being subjected to legal control by a legal subject. This means that a person or entity can hold rights and exercise powers over that object. It covers a wide range of tangible and intangible items, from physical objects like land and goods to abstract concepts like intellectual property.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  The key aspect is that it must be something that can be controlled and owned. Wild animals, in their natural environment, are not considered things, because they are not able to be controlled. When an animal is domesticated, then it becomes a thing.
                </p>
              </div>

              <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 mt-4">Classification of "Things"</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Package size={16} /> 1. Corporeal vs. Incorporeal
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Corporeal:</strong> Tangible, physical objects (e.g., land, cars, furniture).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Incorporeal:</strong> Intangible objects (e.g., patents, copyrights, rights).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Truck size={16} /> 2. Movable vs. Immovable
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Movable:</strong> Can be transported (e.g., furniture, vehicles).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Immovable:</strong> Fixed to the earth (e.g., land, buildings).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Flame size={16} /> 3. Consumable vs. Non-Consumable
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Consumable:</strong> Used up or destroyed (e.g., food, fuel).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Non-Consumable:</strong> Can be used repeatedly (e.g., furniture, tools).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Scissors size={16} /> 4. Divisible vs. Indivisible
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Divisible:</strong> Can be divided without losing character (e.g., land, money).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Indivisible:</strong> Cannot be divided without losing character (e.g., a painting, a car).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                    <RefreshCw size={16} /> 5. Fungible vs. Non-Fungible
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Fungible:</strong> Interchangeable with others of same kind (e.g., money, grain).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Non-Fungible:</strong> Unique and not interchangeable (e.g., a specific piece of art).
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4: Real and Personal Rights */}
            <div
              ref={(el) => {
                sectionRefs.current['real-personal-rights'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Real and Personal Rights: Ownership and Possession
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    In property law, rights are broadly classified as either real rights or personal rights. These distinctions are crucial for understanding how ownership and possession are legally protected.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ShieldIcon size={16} /> Real Rights (Jura in re)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Real rights are enforceable against the world at large. They relate directly to a specific piece of property.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Ownership:</strong> The most comprehensive real right – the right to possess, use, enjoy, and dispose.</li>
                    <li><strong>Possession:</strong> Physical control of property, protected in certain circumstances.</li>
                    <li><strong>Easements:</strong> Rights to use another's property for a specific purpose.</li>
                    <li><strong>Mortgages:</strong> Security interests in property as collateral for a loan.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Real rights are typically registered in public records to provide notice.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Users size={16} /> Personal Rights (Jura in persona)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Personal rights are enforceable only against specific individuals. They arise from contractual obligations or other legal relationships.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Contractual Rights:</strong> Rights to claim performance from a contracting party.</li>
                    <li><strong>Lease Agreements:</strong> Rights between landlord and tenant.</li>
                    <li><strong>Debt Obligations:</strong> Rights to claim money owed.</li>
                  </ul>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Personal rights are not typically registered in public records.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 5: Methods of Acquiring Ownership */}
            <div
              ref={(el) => {
                sectionRefs.current['acquiring-ownership'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Methods of Acquiring Ownership
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Ownership of property can be acquired through a variety of legal mechanisms, each with its own set of rules and requirements.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Flag size={16} /> 1. Original Acquisition (Occupation)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Acquiring ownership of property that previously belonged to no one (res nullius).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Example: Finding a seashell on a public beach and collecting it.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                    <Handshake size={16} /> 2. Derivative Acquisition (Transfer)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Acquiring ownership from a previous owner.
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <li><strong>Transfer by Agreement:</strong> Sale, gift, or exchange.</li>
                    <li><strong>Transfer by Inheritance:</strong> Through a will or intestacy.</li>
                    <li><strong>Transfer by Operation of Law:</strong> Foreclosure, bankruptcy, court order.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-2">
                    <Clock size={16} /> 3. Prescription (Acquisitive Prescription)
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Acquiring ownership through long, continuous, and undisturbed possession of property.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    If you occupy land openly and without the owner's permission for a certain period, you may acquire ownership through prescription.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
                    <Plus size={16} /> 4. Accession
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Acquiring ownership of something added to or produced by existing property.
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Example: A cow giving birth to a calf; planting seeds and growing plants.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 md:col-span-2">
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Landmark size={16} /> 5. Appropriation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    The government taking private property for public use, with fair compensation (eminent domain).
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Example: The government building a highway through your property and compensating you.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 6: Transferring of Ownership */}
            <div
              ref={(el) => {
                sectionRefs.current['transferring-ownership'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Transferring of Ownership
              </h2>

              <div className="p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Transfer of ownership refers to the legal process by which the rights and title to a piece of property are passed from one person (the transferor) to another (the transferee). This process is crucial in property law, as it determines who has the legal authority to possess, use, and dispose of the property.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                  <SettingsIcon size={16} /> Key Aspects of Transfer of Ownership
                </h3>
                <div className="space-y-3 mt-2">
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">1. Types of Property</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Real Property:</strong> Land and anything permanently attached; transfers involve deeds and registration.</li>
                      <li><strong>Personal Property:</strong> Movable goods; transfers can be simpler but still require clear intention and delivery.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">2. Methods of Transfer</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Sale:</strong> Exchange for monetary consideration.</li>
                      <li><strong>Gift:</strong> Voluntary transfer without consideration.</li>
                      <li><strong>Inheritance:</strong> Transfer upon death via will or intestacy.</li>
                      <li><strong>Operation of Law:</strong> Foreclosure, bankruptcy, court order, accession, prescription.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">3. Legal Requirements</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                      <li><strong>Intention:</strong> Clear intent to transfer and acquire.</li>
                      <li><strong>Capacity:</strong> Both parties must have legal capacity.</li>
                      <li><strong>Consideration:</strong> May be required (e.g., in a sale).</li>
                      <li><strong>Delivery:</strong> Physical delivery or transfer of title documents.</li>
                      <li><strong>Documentation:</strong> Deeds, bills of sale, or transfer certificates.</li>
                      <li><strong>Registration:</strong> For real property, registration is essential.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">4. Transfer of Title</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Title refers to legal ownership. Transfer of title means the transferee acquires all rights and responsibilities of ownership. Clear title is essential to avoid disputes.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">5. Risk Transfer</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Risk of loss or damage typically passes with ownership, but parties can agree otherwise.</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">6. Legal Formalities</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Transfer of real property generally involves more complex formalities to protect rights and ensure validity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-orange-100 dark:border-orange-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  💡 Property Insight
                </h3>
                <button
                  onClick={refreshRandomTip}
                  className="p-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <RefreshIcon size={16} className="text-orange-500 dark:text-orange-400" />
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
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    {SECTION_TABS.length}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Classification Types</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
                <li className="flex justify-between">
                  <span>Methods of Acquiring</span>
                  <span className="font-bold text-orange-600 dark:text-orange-400">5</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                The law of property is foundational to legal systems. Understand the classification of things, the distinction between real and personal rights, and the various methods of acquiring and transferring ownership. Key concepts like possession, title, and registration are essential for both legal professionals and everyday transactions.
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
          className="w-12 h-12 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <ChevronUp size={22} />
        </button>
      </div>

      {/* ─── Key Takeaways Footer ────────────────────────────────────────── */}
      <div className="mx-auto px-[5px] sm:px-6 md:px-8 pb-12">
        <div className="mt-8 p-6 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl text-white shadow-lg">
          <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-orange-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Law of Property</strong> – governs rights and obligations related to ownership and possession of tangible and intangible assets.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Classification of Things</strong> – corporeal/incorporeal, movable/immovable, consumable/non-consumable, divisible/indivisible, fungible/non-fungible.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Real vs Personal Rights</strong> – real rights are enforceable against the world (e.g., ownership); personal rights are enforceable only against specific individuals (e.g., contract rights).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Acquiring Ownership</strong> – original acquisition (occupation), derivative acquisition (transfer), prescription, accession, and appropriation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-300 font-bold">•</span>
              <span>
                <strong className="text-white">Transferring Ownership</strong> – involves intention, capacity, consideration, delivery, documentation, and registration (especially for real property).
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
            Sidemann Academic Registry • Legal Studies – Law of Property 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome5;

import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  FileText,
  Archive,
  Trash2,
  Target,
  ClipboardList,
  Shield,
  BookOpen,
  Monitor,
  Calendar,
  Search,
  X as XIcon,
  Sparkles,
  RefreshCw as RefreshIcon,
  ChevronUp,
  BookOpen as BookOpenIcon,
  Clock,
  Hash,
  CheckCircle,
  RefreshCw,
  Scissors,
  Layers,
  Link,
  Grid,
  Scroll,
  User,
  FileText as FileTextIcon,
  Settings,
  Box,
  Zap,
  DollarSign,
  AlertCircle,
  Package,
  Wrench,
  Pin,
  LineChart,
  Hammer,
  Paintbrush,
  Eye,
  Scan,
  Handshake,
  Folder,
  Award,
  Pin as Needle,
  FlaskRound,
  AlertTriangle,
  Sun,
  Search as SearchIcon,
  LayoutIcon,
  CircleIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'nonadhesive', label: 'Non‑Adhesive Binding' },
  { id: 'clothpaper', label: 'Cloth & Paper' },
  { id: 'edition', label: 'Edition Binding' },
  { id: 'mending', label: 'Mending Paper' },
  { id: 'stamping', label: 'Stamping' },
  { id: 'singlesheets', label: 'Binding Single Sheets' },
  { id: 'enclosures', label: 'Preservation Enclosures' },
  { id: 'repairskills', label: 'Repair Skills' },
  { id: 'leather', label: 'Leather Works' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'practical', label: 'Practical Activities' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome4: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [activeSectionIndex, setActiveSectionIndex] = useLessonState('section', 0);
  const [randomTip, setRandomTip] = useState<{ title: string; text: string } | null>(null);

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
        text: 'The oldest surviving bound books in the world are the Coptic codices from Egypt, dating back to the 4th century AD, using a sewn binding technique that is still used today.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a bone folder to crease folds – it creates a sharp, clean crease without damaging the paper fibres, ensuring your signatures lay flat.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of book repair: "A‑S‑C‑D" – Assess damage, Select appropriate materials, Carry out the repair, Document everything.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners use ordinary PVA glue for book repairs; it can become brittle and acidic over time. Always use archival‑quality, flexible adhesives like wheat starch paste.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The oldest surviving bound books in the world are the Coptic codices from Egypt, dating back to the 4th century AD, using a sewn binding technique that is still used today.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use a bone folder to crease folds – it creates a sharp, clean crease without damaging the paper fibres, ensuring your signatures lay flat.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the four pillars of book repair: "A‑S‑C‑D" – Assess damage, Select appropriate materials, Carry out the repair, Document everything.',
      },
      {
        title: 'Common Mistake',
        text: 'Many beginners use ordinary PVA glue for book repairs; it can become brittle and acidic over time. Always use archival‑quality, flexible adhesives like wheat starch paste.',
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

  // ─── Helper to render a clean card ──────────────────────────────────────
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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FileText size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Bookbinding, Repair —{' '}
            <span className="text-amber-300 font-bold italic">
              &amp; Conservation Skills
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to non‑adhesive binding, cloth/paper bindings, edition binding,
            mending, stamping, enclosures, repair skills, leather works, and practical activities.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Scissors size={14} className="inline mr-1" /> Binding
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Wrench size={14} className="inline mr-1" /> Repair
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Conservation
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
                placeholder="Search for a binding method, repair technique, tool..."
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
            {/* SECTION 1: Survey of Non-Adhesive Binding */}
            <div
              ref={(el) => {
                sectionRefs.current['nonadhesive'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Survey of Non‑Adhesive Binding
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A survey of non‑adhesive binding methods reveals a rich history and diverse array
                    of techniques, each with its own unique characteristics and applications. These
                    methods avoid the use of glue or other adhesives to hold pages together, relying
                    instead on mechanical means like stitching, folding, or threading.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Sewn Bindings (Stitched Bindings)',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p>
                          This is one of the oldest and most durable forms of binding. It involves sewing
                          the pages together in sections, called signatures, using thread. The signatures
                          are then sewn together and attached to the cover.
                        </p>
                        <p className="mt-2"><strong>Types:</strong></p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Coptic Binding:</strong> An ancient Egyptian technique where signatures
                            are sewn directly to the cover, leaving the spine exposed. This allows the book
                            to lie flat and is known for its decorative stitching.
                          </li>
                          <li>
                            <strong>Long Stitch Binding:</strong> A variation where longer stitches are used
                            to attach the signatures to the cover, creating a visible and often decorative
                            pattern on the spine.
                          </li>
                          <li>
                            <strong>Japanese Stab Binding:</strong> This method involves punching holes along
                            the edge of the pages and stitching them together with thread. It is known for its
                            simplicity and aesthetic appeal.
                          </li>
                        </ul>
                        <p className="mt-2">
                          <strong>Advantages:</strong> Exceptionally strong and durable, allows books to lie
                          flat, and offers decorative possibilities.
                        </p>
                        <p>
                          <strong>Disadvantages:</strong> Can be time‑consuming and labour‑intensive,
                          especially for large books.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Folded Bindings',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          These methods rely on folding the pages in specific ways to create a self‑supporting
                          structure.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Accordion Binding:</strong> Pages are folded in a zigzag pattern, creating
                            a continuous strip that can be unfolded like an accordion.
                          </li>
                          <li>
                            <strong>Concertina Binding:</strong> Similar to accordion binding, but often used
                            for displaying images or artwork in a continuous sequence.
                          </li>
                          <li>
                            <strong>Origami Binding:</strong> Involves intricate folding techniques to create
                            a book‑like structure without any stitching or adhesives.
                          </li>
                        </ul>
                        <p className="mt-2">
                          <strong>Advantages:</strong> Simple, requires minimal tools, and can be visually
                          appealing.
                        </p>
                        <p>
                          <strong>Disadvantages:</strong> Limited page capacity, not suitable for heavy use.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Threaded Bindings',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>
                          These methods involve threading pages or signatures together using various
                          materials like thread, cord, or wire.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Post Binding:</strong> Uses metal posts or screws to hold pages together.
                            This method is often used for sample books or portfolios, as it allows for easy
                            addition or removal of pages.
                          </li>
                          <li>
                            <strong>Ring Binding:</strong> Similar to post binding but uses metal rings to
                            hold pages together. This method is commonly used for notebooks and manuals.
                          </li>
                          <li>
                            <strong>Spiral Binding (Wire‑O Binding):</strong> Involves punching holes along
                            the edge of the pages and threading a continuous wire coil through the holes.
                            Though wire is used, it still is a mechanical binding method, and does not use
                            adhesive.
                          </li>
                        </ul>
                        <p className="mt-2">
                          <strong>Advantages:</strong> Allows for easy page turning, can accommodate thick
                          materials, and offers flexibility.
                        </p>
                        <p>
                          <strong>Disadvantages:</strong> Can be bulky, and the binding mechanism may be
                          visible.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Slotted Bindings',
                    icon: <Grid size={16} />,
                    content: (
                      <>
                        <p>
                          This method uses precisely cut slots in the pages that interlock to form the book
                          block. This is a less common technique but is used in some artistic book creation.
                        </p>
                        <p className="mt-2">
                          <strong>Advantages:</strong> No thread or adhesives are required.
                        </p>
                        <p>
                          <strong>Disadvantages:</strong> Requires precise cutting and is not suitable for
                          all paper types.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Japanese Scroll Binding',
                    icon: <Scroll size={16} />,
                    content: (
                      <>
                        <p>
                          This traditional method uses a long sheet of paper that is rolled onto dowels.
                          This is used for art, and some traditional texts.
                        </p>
                        <p className="mt-2">
                          <strong>Advantages:</strong> Beautiful, and traditional.
                        </p>
                        <p>
                          <strong>Disadvantages:</strong> Not practical for all document types.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 2: Cloth and Paper Bindings */}
            <div
              ref={(el) => {
                sectionRefs.current['clothpaper'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Cloth and Paper Bindings
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Cloth and paper bindings are two fundamental techniques in bookbinding, each offering
                    distinct aesthetic and functional qualities. They represent a wide range of styles and
                    durability, catering to various needs from artistic expression to robust archival
                    storage.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Cloth Bindings',
                    icon: <User size={16} />, // Using User as shirt placeholder
                    content: (
                      <>
                        <p>
                          Cloth bindings, a staple in bookbinding for centuries, are renowned for their
                          durability and classic aesthetic. These bindings typically involve covering the
                          book's boards (the rigid front and back covers) with cloth, which is then adhered
                          to the boards and wrapped around the spine. The choice of cloth is vast, ranging
                          from traditional book cloth, which is designed for its strength and longevity, to
                          more decorative fabrics like linen, buckram, or even silk. The cloth provides a
                          robust protective layer, safeguarding the book's interior from wear and tear. This
                          makes cloth bindings particularly suitable for books intended for frequent use,
                          such as reference books, textbooks, or cherished novels. The texture and weave of
                          the cloth contribute to the book's tactile appeal, adding a sense of quality and
                          sophistication. Furthermore, cloth bindings offer a versatile canvas for
                          embellishments, such as foil stamping, embossing, or printed designs, allowing for
                          a high degree of customization. The strength of the cloth also allows for a strong
                          hinge point, which helps the book to open and close correctly for many years. The
                          long‑term durability of cloth bindings makes them a popular choice for archival
                          storage.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Paper Bindings',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Paper bindings, while generally less durable than cloth bindings, offer exceptional
                          versatility and artistic expression. These bindings involve covering the book's
                          boards with paper, which can range from simple decorative paper to intricate
                          handmade sheets. Paper bindings are often favoured for artist books, limited
                          editions, and projects where visual impact is paramount. The wide array of paper
                          types, textures, and colours allows for endless creative possibilities. From smooth,
                          matte papers to textured, hand‑marbled sheets, paper bindings can evoke a range of
                          moods and styles. Paper bindings also lend themselves to various decorative
                          techniques, such as printing, collage, and hand‑colouring. The relative ease of
                          working with paper makes it an accessible medium for book artists and crafters.
                          However, the inherent fragility of paper means that paper bindings are generally
                          less suitable for books intended for heavy use. To increase the durability of a
                          paper binding, often a protective coating is applied to the paper. Paper bindings
                          are very useful for limited edition, or artist created books, where the paper
                          becomes a part of the artistic expression.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 3: Edition Binding */}
            <div
              ref={(el) => {
                sectionRefs.current['edition'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Edition Binding
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Edition binding refers to the industrial or large‑scale production of books, typically
                    in uniform quantities, using standardized methods and materials. It is the process by
                    which most commercially available hardcover books are created. This method prioritizes
                    efficiency, consistency, and cost‑effectiveness, while still aiming for a reasonable
                    level of durability and aesthetic appeal.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Standardized Materials and Processes',
                    icon: <Settings size={16} />,
                    content: (
                      <>
                        <p>
                          Edition binding relies on standardized materials, such as pre‑printed book blocks
                          (the assembled pages), pre‑cut binder's board (for the covers), and machine‑made
                          book cloth or paper coverings. This standardization allows for efficient and
                          consistent production. The processes are also highly mechanized, with machines
                          handling tasks like folding pages, sewing signatures, casing‑in (attaching the book
                          block to the covers), and applying the outer covering. This automation significantly
                          speeds up production and reduces labour costs.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Case Binding (Hardcover)',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          A common form of edition binding is case binding, where the book block is attached
                          to rigid covers, or "cases." The cases are typically made from binder's board, which
                          is a sturdy cardboard material. The book block is often sewn together in signatures
                          for added strength, though some less expensive editions may use adhesive binding
                          (perfect binding). The sewn book block is then attached to the case using endpapers.
                          The outer covering of the case can vary, but often consists of book cloth or a
                          printed paper covering that is laminated for durability.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Perfect Binding (Adhesive Binding)',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>
                          While not always considered the highest quality, perfect binding is a common and
                          cost‑effective method used in edition binding, especially for paperback books or
                          less expensive hardcovers. This method involves milling the spine of the book block
                          to create a rough surface, and then applying a strong adhesive to hold the pages
                          together. The cover is then wrapped around the glued spine. Perfect binding is
                          efficient and allows for high‑speed production, but it is generally less durable
                          than sewn bindings.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Automated Production Lines',
                    icon: <Zap size={16} />,
                    content: (
                      <>
                        <p>
                          Edition binding takes place on highly automated production lines, where machines
                          perform each step of the binding process. This automation ensures consistency and
                          speed, allowing for the production of large quantities of books in a relatively
                          short time. These production lines often include machines for folding, sewing,
                          gluing, casing‑in, and trimming the books.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Cost‑Effectiveness and Efficiency',
                    icon: <DollarSign size={16} />,
                    content: (
                      <>
                        <p>
                          A primary goal of edition binding is to produce books at a low cost. This is
                          achieved through standardization, automation, and the use of cost‑effective
                          materials. The focus on efficiency allows publishers to produce large print runs
                          and distribute books widely.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Uniformity and Consistency',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p>
                          Edition binding aims for uniformity and consistency across all copies of a book.
                          This is crucial for mass‑market books, where readers expect each copy to be
                          identical. Automated processes and quality control measures help to ensure that
                          each book meets the required standards.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Limitations and Considerations',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p>
                          While edition binding is efficient and cost‑effective, it may not be suitable for
                          books that require specialized materials or binding techniques. The focus on mass
                          production can sometimes limit the artistic or creative possibilities of book design.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 4: Mending Paper */}
            <div
              ref={(el) => {
                sectionRefs.current['mending'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Mending Paper
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Mending paper is a crucial skill in archival and conservation work, aimed at repairing
                    tears, holes, and other damage to paper‑based materials. It is a delicate process that
                    requires careful consideration of materials and techniques to ensure the repair is both
                    effective and minimally invasive.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Assessment of Damage',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <>
                        <p>
                          The first step in mending paper is to thoroughly assess the extent and nature of the
                          damage. This includes identifying the type of tear or hole, the condition of the
                          surrounding paper, and any existing repairs. The assessment also involves determining
                          the type of paper and its characteristics, such as fibre direction, thickness, and pH.
                          This information is crucial for selecting appropriate mending materials and techniques.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Selection of Mending Materials',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>
                          The choice of mending materials is critical for ensuring the longevity and
                          compatibility of the repair.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Japanese tissue:</strong> This is often the preferred material for paper
                            repairs due to its thinness, strength, and flexibility. Different weights and types
                            of Japanese tissue are available, allowing for a range of repair options.
                          </li>
                          <li>
                            <strong>Adhesives:</strong> Archival‑quality adhesives, such as wheat starch paste
                            or methylcellulose, are used to adhere the mending tissue to the damaged paper.
                            These adhesives are reversible and non‑acidic, minimizing the risk of further damage.
                          </li>
                          <li>
                            <strong>Other materials:</strong> Other types of paper, or even fibres from the
                            original paper can be used in some conservation situations.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Mending Techniques',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <p>
                          Various techniques are used to mend paper, depending on the type and extent of the
                          damage.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Tear Repair:</strong> Tears are typically mended by applying small strips
                            of Japanese tissue along the tear, ensuring that the fibres of the mending tissue
                            align with the fibres of the original paper.
                          </li>
                          <li>
                            <strong>Hole Filling:</strong> Holes are filled by creating a patch of Japanese
                            tissue that closely matches the shape and thickness of the missing paper. The patch
                            is then adhered to the edges of the hole, ensuring a seamless repair.
                          </li>
                          <li>
                            <strong>Edge Repair:</strong> Damaged edges are repaired by applying strips of
                            Japanese tissue along the edge, reinforcing the paper, and preventing further damage.
                          </li>
                          <li>
                            <strong>Infills:</strong> When large portions of a document are missing, infills are
                            used. These are custom made pieces of paper that match the original.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Tools and Equipment',
                    icon: <Hammer size={16} />,
                    content: (
                      <>
                        <p>
                          Mending paper requires specialized tools and equipment to ensure precise and
                          controlled repairs.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Bone folders:</strong> These are used to crease and fold paper, as well as
                            to burnish mending tissue.
                          </li>
                          <li>
                            <strong>Tweezers and spatulas:</strong> These are used to handle delicate materials
                            and apply small amounts of adhesive.
                          </li>
                          <li>
                            <strong>Brushes:</strong> Various brushes are used to apply adhesive and dampen
                            mending tissue.
                          </li>
                          <li>
                            <strong>Light tables:</strong> These provide even illumination for examining and
                            repairing paper.
                          </li>
                          <li>
                            <strong>Magnifiers:</strong> These are used to see fine details.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Reversibility and Minimal Intervention',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          A fundamental principle of conservation is reversibility, meaning that any repair
                          should be able to be undone without causing further damage to the original material.
                          Minimal intervention is also crucial, meaning that only the necessary repairs should
                          be made, and the original material should be altered as little as possible.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Documentation',
                    icon: <ClipboardList size={16} />,
                    content: (
                      <>
                        <p>
                          All mending treatments should be thoroughly documented, including the materials and
                          techniques used. This documentation provides a record of the repairs and allows for
                          future conservation treatments to be carried out safely.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 5: Stamping */}
            <div
              ref={(el) => {
                sectionRefs.current['stamping'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Stamping
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Stamping, in the context of bookbinding and archival work, refers to the process of
                    applying designs, text, or other markings to surfaces using a stamp or die and pressure,
                    often with heat. It is a versatile technique used for both decorative and informational
                    purposes.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'The Stamping Process: A Detailed Look',
                    icon: <Hammer size={16} />,
                    content: (
                      <>
                        <p>
                          Stamping, at its core, is about transferring a design from a raised surface (the
                          stamp or die) onto another material. This transfer occurs through the application of
                          pressure, and often, heat, which helps to create a lasting impression.
                        </p>
                        <p className="mt-2">
                          The tools used in this process, stamps, or dies, are typically crafted from durable
                          materials like brass or steel. These materials are chosen for their ability to
                          withstand repeated pressure and heat without deforming, ensuring consistent and
                          precise transfers.
                        </p>
                        <p className="mt-2">
                          The material to be stamped, whether it is the cover of a book, a piece of leather,
                          or archival‑quality paper, is carefully positioned beneath the stamp or die. This
                          positioning is crucial for accurate placement of the design.
                        </p>
                        <p className="mt-2">
                          The application of pressure is a critical step, as it is what forces the design from
                          the stamp onto the material. The amount of pressure required varies depending on the
                          materials involved. For instance, leather requires more pressure than paper to achieve
                          a deep and clear impression.
                        </p>
                        <p className="mt-2">
                          Heat, when used, plays a vital role in enhancing the transfer process. It softens the
                          material being stamped, allowing the design to imprint more deeply and permanently.
                          This is particularly useful when working with materials like leather or certain types
                          of book cloth.
                        </p>
                        <p className="mt-2">
                          In a variation known as foil stamping, a thin sheet of foil is placed between the die
                          and the material. The heat and pressure cause the foil to adhere to the material,
                          creating a metallic or coloured design. This technique is often used for adding titles
                          or decorative elements to book covers, providing a glossy and eye‑catching finish.
                        </p>
                        <p className="mt-2">
                          The precision of the stamping process allows for intricate details to be transferred,
                          making it suitable for both simple text and complex designs. The depth and clarity of
                          the impression can be controlled by adjusting the pressure and temperature, giving the
                          user a high degree of control over the final result.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Types of Stamping',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Blind Stamping:</strong> This involves creating an impression on the surface
                            without using any ink or foil. The pressure and heat create a subtle, recessed design
                            or text. This technique is often used on leather or cloth bindings to create a classic
                            and understated look.
                          </li>
                          <li>
                            <strong>Foil Stamping:</strong> This involves using a thin sheet of foil, typically
                            metallic, between the stamp or die and the surface. The heat and pressure transfer
                            the foil onto the surface, creating a shiny and vibrant design or text. Foil stamping
                            is commonly used for book titles, logos, and decorative elements.
                          </li>
                          <li>
                            <strong>Ink Stamping:</strong> This involves using ink to transfer a design or text
                            onto the surface. This technique is often used on paper or other absorbent materials.
                            Ink stamping can create a variety of effects, depending on the type of ink and the
                            surface being stamped.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Applications of Stamping',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Bookbinding:</strong> Stamping is widely used in bookbinding to apply titles,
                            author names, and decorative designs to book covers. It adds a professional and
                            polished look to books.
                          </li>
                          <li>
                            <strong>Archival Work:</strong> Stamping can be used to apply identification markings
                            or accession numbers to archival materials. This helps to organize and track valuable
                            documents and artifacts.
                          </li>
                          <li>
                            <strong>Leatherworking:</strong> Stamping is a common technique in leatherworking to
                            create decorative patterns and designs on leather goods.
                          </li>
                          <li>
                            <strong>Paper Crafting:</strong> Stamping is used in paper crafting to create
                            decorative elements on cards, scrapbook pages, and other paper projects.
                          </li>
                          <li>
                            <strong>Industrial marking:</strong> Stamping is used to mark parts, and other
                            industrial items.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Tools and Equipment',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Stamps and Dies:</strong> These are the tools that contain the design or
                            text to be transferred.
                          </li>
                          <li>
                            <strong>Stamping Presses:</strong> These are machines that apply pressure to the
                            stamp or die.
                          </li>
                          <li>
                            <strong>Heating Elements:</strong> These are used to heat the stamp or die for heat
                            stamping.
                          </li>
                          <li>
                            <strong>Foil:</strong> This is used in foil stamping to create metallic designs.
                          </li>
                          <li>
                            <strong>Inks:</strong> Various inks are used for ink stamping, depending on the
                            surface being stamped.
                          </li>
                        </ul>
                      </>
                    ),
                  },
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

            {/* SECTION 6: Binding for Text Block of Single Sheets */}
            <div
              ref={(el) => {
                sectionRefs.current['singlesheets'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Binding for Text Block of Single Sheets
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Binding a text block composed of single sheets presents unique challenges compared to
                    binding folded signatures. Single sheets lack the inherent strength and structure of
                    folded signatures, making them more prone to tearing and misalignment. Therefore,
                    specialized binding methods are required to ensure durability and proper page alignment.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Perfect Binding: Glued for a Clean Look',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>
                          Perfect binding is a widely used method for binding single sheets, particularly in
                          paperback books and magazines. This technique involves milling the spine of the text
                          block to create a rough surface, which enhances the adhesion of the glue. A strong,
                          flexible adhesive is then applied to the milled spine, and the cover is wrapped around
                          the glued edges. This creates a clean, square spine that is often printed with the
                          book's title and author. Perfect binding is efficient and cost‑effective, making it
                          suitable for large print runs. However, it is important to note that perfect binding is
                          less durable than sewn bindings, as the pages are held together solely by glue. Over
                          time, the glue can become brittle, and pages may detach. Also, books bound in this
                          method do not lay flat very well when opened.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Comb Binding (Plastic Comb): Simple and Customizable',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p>
                          Comb binding, also known as plastic comb binding, is a simple and versatile method for
                          binding single sheets. It involves punching rectangular holes along the edge of the
                          text block and inserting a plastic comb through the holes. The comb's teeth hold the
                          pages securely in place. Comb binding is popular for reports, presentations, and
                          manuals, as it allows for easy page addition or removal. It also allows the book to lay
                          relatively flat when open. The plastic combs are available in various sizes and colours,
                          providing a degree of customization. However, comb binding is not as durable as other
                          methods, and the plastic combs can break or become distorted over time.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Spiral Binding (Coil Binding): Durable and Flexible',
                    icon: <CircleIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Spiral binding, also known as coil binding, is a durable and flexible method for
                          binding single sheets. It involves punching round holes along the edge of the text
                          block and threading a continuous plastic or metal coil through the holes. The coil's
                          spiral shape holds the pages securely in place and allows the book to lay flat when
                          open. Spiral binding is commonly used for notebooks, workbooks, and other documents
                          that require frequent page turning. It is more durable than comb binding, and the metal
                          coils are particularly robust. However, spiral binding can be more expensive than comb
                          binding, and the coils can become bent or damaged if mishandled.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Wire‑O Binding (Double‑Loop Wire): Professional and Sturdy',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          Wire‑O binding, also known as double‑loop wire binding, is a professional and sturdy
                          method for binding single sheets. It involves punching square or round holes along the
                          edge of the text block and threading a series of wire loops through the holes. The wire
                          loops are then crimped closed, creating a secure and durable binding. Wire‑O binding is
                          commonly used for reports, proposals, and other high‑quality documents. It allows the
                          book to lay flat when open and provides a clean, professional appearance. However,
                          Wire‑O binding can be more expensive than comb or spiral binding, and the wire loops can
                          become bent or damaged if mishandled.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Post Binding: Adaptable and Expandable',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>
                          Post binding is a versatile method that uses metal posts or screws to hold single
                          sheets together. It involves punching holes along the edge of the text block and
                          inserting the posts or screws through the holes. Post binding is often used for sample
                          books, portfolios, and other documents that require frequent page changes. It allows
                          for easy addition or removal of pages and can accommodate thick materials. However,
                          post binding can be bulky and may not be suitable for documents that require frequent
                          page turning.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Screw Post Binding (Chicago Screws): Heavy Duty and Reusable',
                    icon: <Pin size={16} />,
                    content: (
                      <>
                        <p>
                          Screw post binding, often utilizing "Chicago screws," is a heavy‑duty and reusable
                          method. It employs metal posts with screw heads that can be easily unscrewed to add or
                          remove pages. This binding is ideal for swatch books, architectural drawings, and other
                          documents that need to be updated or expanded. While highly durable and adaptable, it
                          can be more expensive and less streamlined than other options.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 7: Preservation Enclosures */}
            <div
              ref={(el) => {
                sectionRefs.current['enclosures'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preservation Enclosures
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preservation enclosures are specially designed containers used to protect valuable
                    documents, photographs, and other artifacts from environmental damage and physical
                    deterioration. They are crucial for extending the lifespan of irreplaceable items.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Purpose and Importance',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>
                          Preservation enclosures serve as a protective barrier between valuable items and the
                          surrounding environment. They are designed to minimize the impact of factors that can
                          cause damage, such as dust, light, moisture, pollutants, and physical stress. These
                          enclosures are crucial for safeguarding irreplaceable items like historical documents,
                          rare books, photographs, and artwork. Without proper enclosures, these items are
                          vulnerable to accelerated deterioration, potentially leading to irreversible damage.
                          Think of them as tiny, customized vaults, designed to extend the lifespan of the items
                          they contain. The use of appropriate enclosures is a fundamental aspect of archival
                          preservation, ensuring that future generations can access and appreciate these valuable
                          artifacts.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Archival‑Quality Materials',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>
                          The materials used in preservation enclosures are carefully selected for their
                          chemical stability and inertness. This means they will not react with the items they
                          enclose, preventing any transfer of harmful substances. Common materials include
                          acid‑free paper and board, which prevent the paper from becoming acidic and brittle.
                          Other materials include inert plastics such as polyester or polyethylene, which are
                          stable and will not release harmful chemicals. These plastics are often used for sleeves
                          or pockets that hold photographs or delicate documents. The choice of material depends
                          on the specific needs of the item being stored. For example, fragile documents might
                          require rigid enclosures made from acid‑free board, while photographs might benefit from
                          flexible polyester sleeves. The goal is to create a safe and stable microenvironment
                          that minimizes the risk of chemical degradation.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Enclosure Types and Designs',
                    icon: <LayoutIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Preservation enclosures come in a wide variety of types and designs, each tailored to
                          the specific needs of different items. Common types include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Boxes:</strong> These provide rigid support and protection from dust and
                            light. They are available in various sizes and shapes to accommodate different items.
                          </li>
                          <li>
                            <strong>Folders and Sleeves:</strong> These provide individual protection for
                            documents and photographs, preventing them from rubbing against each other and causing
                            scratches or abrasions.
                          </li>
                          <li>
                            <strong>Encapsulation:</strong> This involves sealing documents or photographs in
                            inert plastic sleeves, providing a barrier against moisture and pollutants.
                          </li>
                          <li>
                            <strong>Custom‑made Enclosures:</strong> For oddly shaped or particularly fragile
                            items, custom‑made enclosures can provide the best protection.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The design of the enclosure is also important. For example, enclosures should be
                          designed to allow for easy access to the items without causing damage. They should also
                          be designed to minimize the risk of damage from handling.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Environmental Considerations: Controlling the Microenvironment',
                    icon: <Sun size={16} />,
                    content: (
                      <>
                        <p>
                          Preservation enclosures can also help to control the microenvironment surrounding the
                          items they contain. For example, they can help to buffer against fluctuations in
                          temperature and humidity. Some enclosures also include desiccants or other materials
                          that help to absorb moisture or pollutants. However, it is important to note that
                          enclosures are not a substitute for proper environmental control in storage areas.
                          They should be used in conjunction with appropriate temperature, humidity, and air
                          quality controls.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Handling and Storage: Safe Practices',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p>
                          Even with the best enclosures, proper handling and storage practices are essential for
                          preserving valuable items. Enclosures should be handled with care to avoid damage. They
                          should be stored in areas with stable environmental conditions and protected from light
                          and dust. Regular inspections of enclosures and their contents are also important to
                          ensure that they are still providing adequate protection.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Digitization and Enclosures',
                    icon: <Scan size={16} />,
                    content: (
                      <>
                        <p>
                          Even in a digital age, physical enclosures are still vital. Digitization is a great
                          tool, but it does not replace the original artifact. Often the original item must be
                          kept. Enclosures allow for the safe storage of those original items. Also, some items
                          cannot be digitized.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 8: Book Repair and Conservation Bench Skills */}
            <div
              ref={(el) => {
                sectionRefs.current['repairskills'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Book Repair and Conservation Bench Skills
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Assessment and Documentation',
                    icon: <SearchIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Before you can fix a book, you need to understand what is wrong with it. Think of it
                          like a doctor examining a patient. This involves carefully looking at every part of the
                          book – the cover, the spine, and every single page. You are looking for tears, stains,
                          mold, or anything else that is damaging the book. You also need to figure out what kind
                          of paper and binding the book has, because that affects how you will fix it. Just like a
                          detective, you write down everything you find, take pictures, and make notes. This is
                          super important because it helps you plan your repairs and also creates a record of what
                          you did, in case someone needs to look at the book in the future.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Paper Repair Techniques',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Many old books have torn or damaged pages. Fixing these pages is like putting together
                          a delicate puzzle. You use special thin paper, often Japanese tissue, and a gentle glue
                          made from things like wheat starch. You carefully patch up tears and fill in missing
                          pieces, making sure the new paper matches the old as closely as possible. It is like
                          doing surgery on paper. You have to be very careful and precise, using tools like tiny
                          brushes and tweezers. The goal is to make the repairs strong and look as natural as
                          possible, so the book is still easy to read and does not look like it has been patched
                          up too much.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Binding Repair Techniques',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>
                          The binding is what holds all the pages together, and it can get damaged over time.
                          This might mean the spine is broken, the cover is loose, or the pages are falling out.
                          Fixing the binding is like being a book architect. You need to understand how the book
                          was put together in the first place, and then carefully rebuild it. This might involve
                          replacing the spine, reattaching the cover, or sewing the pages back together. The goal
                          is to make the book strong and functional again, so it can be opened and read without
                          falling apart.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Leather and Cloth Repair',
                    icon: <User size={16} />,
                    content: (
                      <>
                        <p>
                          Many old books have covers made of leather or cloth, which can become dry, cracked, or
                          worn. Fixing these covers is like giving the book a makeover. You might need to clean
                          the leather, fill in cracks, or replace worn‑out cloth. It is like being a book
                          dermatologist. You need to understand how to treat different types of materials and use
                          special products to keep them looking good and lasting longer. The goal is to make the
                          cover look nice and protect the pages inside.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Protective Enclosures',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          Sometimes, the best way to protect a book is to build it a special house. These houses
                          are called enclosures, and they are like custom‑made boxes or folders that keep the book
                          safe from dust, light, and changes in temperature. It is like being a book carpenter.
                          You need to know how to choose the right materials and build a sturdy enclosure that
                          fits the book perfectly. This is a proactive way to prevent future damage and keep the
                          book in good condition for a long time.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Tool Handling and Maintenance',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <p>
                          Book conservation uses special tools that are very delicate and precise. You need to
                          know how to use these tools safely and carefully. It is like being a skilled craftsman.
                          You also need to keep your tools clean and in good condition, so they work properly.
                          This involves things like sharpening scalpels, cleaning brushes, and storing tools
                          properly.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Adhesive and Material Knowledge',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <>
                        <p>
                          Glue is a very important part of book repair, but you cannot just use any glue. You
                          need to use special glues that are safe for paper and will not damage the book over
                          time. It is like being a book chemist. You need to understand how different glues work
                          and what materials they are compatible with. You also need to know how to use the glue
                          properly, so it holds the pages together without causing damage.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Ethical Considerations',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Book conservation is about preserving the book as close to its original state as
                          possible. This means you should only do repairs that are necessary, and you should use
                          methods that can be undone if needed. It is like being a responsible doctor. You do not
                          want to make any changes that will permanently alter the book or make it harder to
                          repair in the future.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Historical Knowledge',
                    icon: <BookOpen size={16} />,
                    content: (
                      <>
                        <p>
                          Understanding how books were made in the past is very important for book repair. It is
                          like being a book historian. Knowing the history of book binding will help to better
                          understand how to repair the book or conserve it.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Disaster Preparedness',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p>
                          Sometimes, books get damaged in accidents, like floods or fires. Knowing how to save
                          these books is a very important skill. It is like being a book firefighter. This might
                          involve drying wet books, removing mold, or stabilizing damaged pages. It is about being
                          prepared for anything and knowing how to rescue books from danger.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 9: Introductory Leather Works */}
            <div
              ref={(el) => {
                sectionRefs.current['leather'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Introductory Leather Works
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Introductory leather works involve the fundamental skills and knowledge needed to begin
                    crafting with leather. It is a craft that combines artistry and practicality, allowing for
                    the creation of durable and beautiful items.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Leather Types and Selection',
                    icon: <Package size={16} />,
                    content: (
                      <>
                        <p>
                          Leather is not just one thing; it comes in many varieties, each with unique properties.
                          Understanding these differences is the first step in leather working. Think of it like
                          knowing the different types of wood before building furniture. Cowhide is common, known
                          for its durability and versatility. But there's also sheepskin, which is softer and
                          thinner, or even exotic leathers like alligator or ostrich. The "grain" of the leather,
                          which is the surface texture, and its thickness, which is measured in ounces, are
                          important factors. You must also consider how the leather was tanned, as this affects
                          its flexibility and how it takes dyes or finishes. For beginners, vegetable‑tanned
                          leather is often recommended because it is easier to work with and takes tooling and
                          dyeing well. Choosing the right leather for your project is crucial, as it will
                          determine the final product's look, feel, and durability.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Basic Tools and Their Uses',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <p>
                          Like any craft, leather working has its own set of essential tools. You will need tools
                          for cutting, shaping, and finishing leather. A sharp rotary cutter or a utility knife is
                          used for precise cuts, while a mallet and various punches create holes for stitching or
                          fasteners. Edge bevelers round off the sharp edges of leather, and a groover creates
                          lines for stitching. A stitching awl is used to pierce holes for hand stitching, and
                          needles and thread are used to sew the leather pieces together. A burnisher smooths and
                          polishes the edges of the leather, giving it a professional finish. Understanding how to
                          use each tool safely and effectively is crucial for producing quality leather goods. It
                          is also important to use tools specifically made for leather working, as other tools may
                          damage the leather.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Cutting and Shaping Techniques',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p>
                          Cutting and shaping are the fundamental skills in leather working. Precision is key.
                          You will learn how to use patterns to trace shapes onto the leather and then cut them
                          out cleanly. For shaping leather, you might use techniques like wet molding, where you
                          dampen the leather and then form it over a mold or shape. This is how things like
                          leather masks, or formed cases are made. You might also use tools like a swivel knife to
                          carve decorative designs into the leather's surface. Understanding how leather stretches
                          and conforms to shapes is essential for creating well‑formed and functional items.
                          Practice is essential, as leather can be unforgiving, and mistakes can be difficult to
                          correct.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Stitching and Fastening',
                    icon: <Link size={16} />,
                    content: (
                      <>
                        <p>
                          Stitching is the process of joining leather pieces together using thread. There are
                          various stitching techniques, each with its own look and strength. Hand stitching, using
                          a saddle stitch, is a common technique that creates a strong and durable seam. You will
                          learn how to create evenly spaced holes and sew a consistent stitch. Fasteners, such as
                          rivets, snaps, and buckles, are also used to join leather pieces and add functionality to
                          your projects. Knowing how to properly set these fasteners is crucial for creating
                          secure and long‑lasting connections. The quality of your stitching and fastening will
                          greatly impact the overall durability and appearance of your leather goods.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Finishing and Dyeing',
                    icon: <Paintbrush size={16} />,
                    content: (
                      <>
                        <p>
                          Finishing and dyeing are the steps that give your leather projects their final look and
                          feel. Finishing involves applying products that protect the leather and enhance its
                          appearance, such as leather conditioners or sealants. Dyeing allows you to add colour to
                          your leather, creating unique and personalized items. You will learn how to prepare the
                          leather for dyeing and apply dyes evenly. There are many different types of dyes, and
                          finishes, so understanding their properties is important. Proper finishing and dyeing
                          techniques can transform a simple leather project into a professional‑looking piece.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Safety Practices',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Leather working involves using sharp tools and potentially hazardous chemicals, so
                          safety is paramount. You will learn how to handle tools safely, such as keeping your
                          fingers away from cutting edges and using a cutting mat. When working with dyes or
                          finishes, you will need to wear appropriate protective gear, such as gloves and a
                          respirator. Proper ventilation is also essential when working with chemicals. Following
                          safety guidelines will help you avoid injuries and create a safe and enjoyable leather
                          working experience.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 10: Equipment and Consumables Used in Binding */}
            <div
              ref={(el) => {
                sectionRefs.current['equipment'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Equipment and Consumables Used in Binding
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    When it comes to bookbinding, a range of equipment and consumables are essential for
                    creating durable and aesthetically pleasing books. These tools and materials vary
                    depending on the binding method and the scale of production, from simple hand tools for
                    small projects to complex machinery for large‑scale operations.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Cutting and Trimming Tools: Precision for Clean Edges',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p>
                          Precise cutting and trimming are fundamental to achieving a professional finish in
                          bookbinding. This category includes tools like guillotines, which are large,
                          lever‑operated cutters capable of slicing through thick stacks of paper with accuracy.
                          Smaller rotary cutters and utility knives are used for more detailed work, such as
                          trimming individual sheets or creating intricate shapes. Cutting mats provide a stable
                          and protective surface, preventing damage to worktables. Trimmers are also used to cut
                          the edges of the book block after the pages are bound, ensuring a clean and uniform
                          finish. These tools require careful handling and maintenance to ensure sharp, clean cuts
                          and prevent accidents.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Folding and Creasing Tools: Shaping the Pages',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          Folding and creasing tools are essential for creating neat and accurate folds in paper,
                          particularly when working with signatures (folded sections of pages). Bone folders,
                          traditionally made from animal bone or now often from plastic, are used to create sharp
                          creases without damaging the paper. Creasing machines can automate the process for
                          larger projects, creating consistent folds quickly. Folding jigs or templates help to
                          ensure precise folding of multiple sheets. These tools are crucial for creating
                          well‑formed signatures and ensuring that the book block lays flat and opens smoothly.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Sewing and Stitching Equipment: Holding the Pages Together',
                    icon: <Needle size={16} />,
                    content: (
                      <>
                        <p>
                          Sewing and stitching are traditional methods for binding books, known for their
                          durability and strength. This category includes tools like sewing frames, which hold
                          signatures in place during the sewing process, and awls, which create holes for the
                          thread. Bookbinding needles, typically curved and strong, are used to stitch the
                          signatures together. Thread, which comes in various materials like linen, cotton, or
                          synthetic fibres, is chosen for its strength and longevity. Sewing machines designed for
                          bookbinding can automate the stitching process for larger projects. These tools ensure
                          that the pages are securely bound and that the book can withstand repeated use.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Adhesives and Gluing Equipment: Bonding the Components',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <>
                        <p>
                          Adhesives play a vital role in binding, particularly in methods like perfect binding
                          and case binding. Bookbinding glue, typically a flexible and archival‑quality adhesive,
                          is used to bond the pages together and attach the book block to the covers. Gluing
                          machines, such as spine gluers and cover applicators, automate the process for
                          large‑scale production. Brushes, rollers, and glue pots are used for smaller projects or
                          more delicate work. These tools ensure that the adhesive is applied evenly and that the
                          book's components are securely bonded.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Pressing and Clamping Equipment: Applying Even Pressure',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          Pressing and clamping equipment is essential for ensuring that the bound book is flat
                          and that the adhesive sets properly. Book presses, either manual or hydraulic, apply
                          even pressure to the book block, preventing warping and distortion. Clamps and weights
                          are used for smaller projects or when working with delicate materials. These tools
                          ensure that the book maintains its shape and that the binding is strong and durable.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Cover Materials and Boards: Creating the Outer Shell',
                    icon: <Folder size={16} />,
                    content: (
                      <>
                        <p>
                          The covers of a book provide protection and contribute to its aesthetic appeal. Cover
                          materials include book cloth, leather, paper, and other decorative materials. Binder's
                          board, a thick and rigid cardboard material, is used to create the covers themselves.
                          Endpapers, which attach the book block to the covers, are typically made from high‑
                          quality paper. These materials are chosen for their durability, appearance, and
                          compatibility with the binding method.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Finishing Tools: Adding the Final Touches',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p>
                          Finishing tools are used to add decorative elements and protect the finished book. This
                          category includes tools for foil stamping, which applies metallic or coloured designs to
                          the cover, and embossing, which creates raised or recessed designs. Edge gilding tools
                          apply gold leaf or other finishes to the edges of the book block. Protective coatings,
                          such as varnishes or laminates, are applied to the cover to enhance its durability and
                          appearance. These tools ensure that the finished book is both beautiful and long‑lasting.
                        </p>
                      </>
                    ),
                  },
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

            {/* SECTION 11: Practical Activities in Binding */}
            <div
              ref={(el) => {
                sectionRefs.current['practical'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Practical Activities in Binding: Hands‑On Book Crafting
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Practical activities in binding encompass a range of hands‑on tasks that transform loose
                    sheets of paper into cohesive and functional books or documents. These activities vary
                    depending on the chosen binding method and the project's scale, but they all involve a
                    blend of manual dexterity, precision, and attention to detail.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Folding Signatures: Creating the Book\'s Foundation',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          Folding signatures is a fundamental activity, especially in traditional bookbinding
                          methods. It involves taking large sheets of paper, often pre‑printed with multiple pages,
                          and folding them precisely to create sections called signatures. Each signature will form
                          a portion of the book's text block. This requires accuracy to ensure that all pages align
                          correctly and that the book block lays flat. Using a bone folder, a smooth, flat tool,
                          you will create sharp, clean creases along the fold lines. This process demands careful
                          attention to the paper's grain direction, as folding against the grain can result in
                          uneven or damaged folds. The size and number of folds will determine the final page size
                          and the number of pages per signature. This activity is crucial for creating a
                          well‑structured book block that can be sewn or glued together.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Sewing Signatures: Stitching the Pages Together',
                    icon: <Needle size={16} />,
                    content: (
                      <>
                        <p>
                          Sewing signatures is a traditional and highly durable method of binding. It involves
                          stitching the folded signatures together along their spines, creating a strong and
                          cohesive book block. Using a sewing frame, which holds the signatures in place, you will
                          thread a needle with strong linen or cotton thread. You will then sew through the folds
                          of each signature, creating a series of interlocking stitches that connect them. This
                          process requires precision and consistency to ensure that the stitches are evenly spaced
                          and that the thread tension is correct. Different stitching patterns, such as kettle
                          stitch or link stitch, can be used to create varying levels of strength and flexibility.
                          This activity is essential for creating books that can withstand repeated use and
                          handling.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Gluing the Spine: Bonding the Pages',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <>
                        <p>
                          Gluing the spine is a common activity in modern binding methods, particularly in perfect
                          binding and case binding. It involves applying a strong, flexible adhesive to the milled
                          or roughened spine of the text block, bonding the pages together. This process requires
                          careful application of the adhesive to ensure that it penetrates the paper fibres and
                          creates a strong bond. Using a gluing machine or a brush, you will apply an even layer
                          of adhesive along the spine, ensuring that all pages are securely bonded. Clamping the
                          book block while the adhesive dries is crucial for preventing warping and ensuring a flat
                          spine. This activity is essential for creating books with a clean, square spine and a
                          professional appearance.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Attaching Endpapers: Connecting to the Covers',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Attaching endpapers is a crucial step in case binding, where the book block is attached
                          to rigid covers. Endpapers are double‑leaf sheets of paper that are glued to the first
                          and last pages of the book block and then attached to the inside of the covers. This
                          process requires precise alignment and careful application of adhesive to ensure that the
                          book block is securely attached to the covers. Using a bone folder and adhesive, you will
                          carefully fold and crease the endpapers before gluing them to the book block and covers.
                          This activity is essential for creating a strong and durable connection between the book
                          block and the covers.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Casing‑In: Affixing the Book Block to the Covers',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          Casing‑in is the process of attaching the completed book block to the pre‑made covers,
                          or "cases." This involves carefully positioning the book block between the covers and
                          adhering the endpapers to the inside of the covers. This process demands a steady hand
                          and careful alignment to ensure that the book block is cantered and that the covers are
                          properly attached. Using a bone folder and adhesive, you will carefully attach the
                          endpapers to the covers, ensuring a clean and secure bond. This activity is the
                          culmination of the binding process, resulting in a finished hardcover book.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Trimming the Book Block: Creating Clean Edges',
                    icon: <Scissors size={16} />,
                    content: (
                      <>
                        <p>
                          Trimming the book block involves cutting the edges of the bound book to create clean and
                          even edges. This process is typically performed using a guillotine or a trimming machine,
                          which can slice through thick stacks of paper with precision. This activity requires
                          careful measurement and alignment to ensure that the edges are trimmed evenly and that
                          the book has a professional finish. Trimming is often the last step in the binding
                          process, resulting in a polished and presentable book.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Applying Cover Materials: Adding the Finishing Touch',
                    icon: <Paintbrush size={16} />,
                    content: (
                      <>
                        <p>
                          Applying cover materials involves adhering cloth, paper, leather, or other decorative
                          materials to the book's covers. This process requires careful cutting and shaping of the
                          cover materials to fit the covers precisely. Using adhesive and a bone folder, you will
                          carefully adhere the cover materials to the covers, ensuring a smooth and even finish.
                          This activity is essential for creating books with a visually appealing and durable
                          exterior.
                        </p>
                      </>
                    ),
                  },
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
                  💡 Bookbinding Insight
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
                  <span>Binding Methods</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">12+</span>
                </li>
                <li className="flex justify-between">
                  <span>Repair Skills</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">10</span>
                </li>
                <li className="flex justify-between">
                  <span>Tools & Equipment</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
                <li className="flex justify-between">
                  <span>Practical Activities</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">7</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Non‑adhesive bindings (sewn, folded, threaded) offer durability and aesthetic variety.
                Cloth and paper bindings each have distinct properties. Edition binding focuses on
                efficiency and consistency. Mending paper requires careful assessment and reversible
                techniques. Stamping adds decorative and informational marks. Single‑sheet bindings
                (perfect, comb, spiral, etc.) require special methods. Preservation enclosures protect
                valuable items from environmental damage. Bench skills include assessment, repair of
                paper, binding, leather, and creating enclosures. Leather works involve selection,
                cutting, stitching, and finishing. Binding equipment ranges from cutters to presses.
                Practical activities bring all these skills together.
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
                <strong className="text-white">Non‑Adhesive Binding</strong> – Techniques like Coptic,
                long stitch, and Japanese stab binding rely on stitching, folding, or threading
                instead of glue, offering durability and decorative appeal.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Cloth &amp; Paper Bindings</strong> – Cloth provides
                strength and a classic look; paper offers versatility and artistic expression.
                Both are fundamental to bookbinding.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Edition Binding</strong> – Mass‑production methods
                (case binding, perfect binding) prioritise efficiency and cost‑effectiveness
                while maintaining consistency.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Mending &amp; Stamping</strong> – Paper mending uses
                Japanese tissue and reversible adhesives; stamping applies designs with pressure
                and heat, used for decoration and identification.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Single‑Sheet Bindings</strong> – Perfect, comb,
                spiral, Wire‑O, and post bindings accommodate loose sheets, each with different
                durability and flexibility.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation &amp; Repair Skills</strong> – Enclosures
                protect from environmental damage; bench skills include assessment, paper/binding/
                leather repair, tool handling, and ethical practices.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Leather Works &amp; Equipment</strong> – Leather crafting
                involves selection, cutting, stitching, and finishing; binding requires specific
                tools like cutters, folders, sewing frames, presses, and finishing equipment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Practical Activities</strong> – Hands‑on steps include
                folding signatures, sewing, gluing, attaching endpapers, casing‑in, trimming, and
                applying cover materials – all essential to create a finished book.
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
            Sidemann Academic Registry • Bookbinding &amp; Conservation Mastery 4.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome4;
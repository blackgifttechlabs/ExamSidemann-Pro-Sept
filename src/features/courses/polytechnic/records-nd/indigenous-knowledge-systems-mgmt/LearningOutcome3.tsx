import React, { useState, useEffect, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import {
  // ─── Icons used in the LO1 template ────────────────────────────────────
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

  // ─── Icons specific to this LO3 content ────────────────────────────────
  FolderTree,
  Home,
  Leaf,
  Globe,
  Users,
  Database,
  Heart,
  HeartPulse,
  Apple,
  Scale,
  FileText as FileTextIcon,
  Archive as ArchiveIcon,
  Shield as ShieldIcon,
  BookOpen as BookOpenIcon2,
  AlertCircle,
  MessageSquare,
  Building,
  Sun,
  Eye,
  Brain,
  TreePalm as Tree,
  Link,
  AlertTriangle,
  Handshake,
  TrendingUp,
  Clock as ClockIcon,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'challenges-solutions', label: 'Challenges & Solutions' },
  { id: 'prospects-limitations', label: 'Prospects & Limitations' },
  { id: 'managing-tks', label: 'Managing TKS' },
  { id: 'science-roles', label: 'Roles of Science' },
  { id: 'devaluation', label: 'Devaluation' },
  { id: 'blending', label: 'Blending Knowledge' },
  { id: 'archivists', label: 'Archivists' },
];

// ──────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export const LearningOutcome3: React.FC = () => {
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
        text: 'Managing Indigenous Knowledge requires a delicate balance between preservation, accessibility, and protection of cultural rights.',
      },
      {
        title: 'Pro Tip',
        text: 'When blending IK and Western science, always prioritise equitable partnerships, prior informed consent, and benefit-sharing agreements.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six management approaches: Community-based, Documentation, Legal, Collaborative, Education, Ethics, and Adaptive Management.',
      },
      {
        title: 'Common Mistake',
        text: 'Treating IK as static – it is dynamic and must be managed with flexibility to adapt to changing social and environmental conditions.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'Managing Indigenous Knowledge requires a delicate balance between preservation, accessibility, and protection of cultural rights.',
      },
      {
        title: 'Pro Tip',
        text: 'When blending IK and Western science, always prioritise equitable partnerships, prior informed consent, and benefit-sharing agreements.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the six management approaches: Community-based, Documentation, Legal, Collaborative, Education, Ethics, and Adaptive Management.',
      },
      {
        title: 'Common Mistake',
        text: 'Treating IK as static – it is dynamic and must be managed with flexibility to adapt to changing social and environmental conditions.',
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-10 pb-8 shadow-sm">
        <div className="mx-auto px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            <FolderTree size={14} className="inline mr-1" /> INDIGENOUS KNOWLEDGE SYSTEMS
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Managing Indigenous Knowledge &amp; Traditional Wisdom —{' '}
            <span className="text-purple-300 font-bold italic">
              Challenges, Integration &amp; Preservation
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to challenges, solutions, prospects, limitations, management approaches, and the role of archivists in Indigenous Knowledge Systems.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Management
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Link size={14} className="inline mr-1" /> Integration
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Archive size={14} className="inline mr-1" /> Preservation
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
                placeholder="Search for a concept, value, process step..."
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
            {/* SECTION 1: Challenges and Solutions */}
            <div
              ref={(el) => {
                sectionRefs.current['challenges-solutions'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Challenges in Managing Indigenous Knowledge and Solutions
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Managing Indigenous Knowledge involves navigating a range of challenges, but with thoughtful approaches, these can be addressed effectively.
                  </p>
</div>

              {/* Challenges Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertCircle size={16} /> Challenges in Managing Indigenous Knowledge
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Documentation and Codification:</strong> A significant portion of IK is orally transmitted, making it vulnerable to loss. Lack of formal documentation and codification hinders its accessibility and application beyond specific communities.</li>
                  <li><strong>Loss of Knowledge Holders:</strong> The passing of elders and traditional practitioners who hold valuable IK poses a serious threat. Modernization and migration contribute to the decline in intergenerational knowledge transfer.</li>
                  <li><strong>Intellectual Property Rights and Benefit Sharing:</strong> The exploitation of IK by external entities without proper recognition or benefit sharing is a major concern. This can lead to misappropriation and the erosion of indigenous control over their knowledge.</li>
                  <li><strong>Cultural Sensitivity and Ethical Considerations:</strong> Managing IK requires a deep understanding of cultural protocols and ethical considerations. Inappropriate handling or dissemination can cause harm to indigenous communities.</li>
                  <li><strong>Integration with Modern Systems:</strong> Bridging the gap between IK and mainstream scientific and policy systems is challenging. Lack of recognition and integration hinders the application of IK in development initiatives.</li>
                  <li><strong>Access and Dissemination:</strong> Balancing the need to protect sensitive knowledge with the desire to make IK accessible for research and development is a complex task.</li>
                  <li><strong>Language Barriers:</strong> Many IKS are held within indigenous languages, and as those languages become less spoken, the knowledge contained within them is at risk.</li>
                  <li><strong>Environmental Change:</strong> As the environment changes, some IKS becomes less useful, and therefore, must be updated.</li>
                </ul>
              </div>

              {/* Solutions Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <CheckCircle size={16} /> Solutions to the Challenges
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Community-Based Documentation and Archiving:</strong> Support indigenous communities in developing their own documentation and archiving systems. This ensures that knowledge is recorded and stored in a culturally appropriate manner.</li>
                  <li><strong>Intergenerational Knowledge Transfer Programs:</strong> Implement programs that facilitate the transmission of IK from elders to younger generations. This can involve apprenticeships, workshops, and cultural immersion programs.</li>
                  <li><strong>Legal Frameworks for Protection and Benefit Sharing:</strong> Establish clear legal frameworks that recognize the intellectual property rights of indigenous communities and ensure fair benefit sharing.</li>
                  <li><strong>Ethical Guidelines and Protocols:</strong> Develop ethical guidelines and protocols for the management and use of IK, in consultation with indigenous communities.</li>
                  <li><strong>Collaborative Research and Knowledge Exchange:</strong> Promote collaborative research between indigenous communities and researchers, fostering a respectful and equitable exchange of knowledge.</li>
                  <li><strong>Digital Platforms and Databases:</strong> Utilize digital platforms and databases to store and disseminate IK, while ensuring appropriate access controls and security measures.</li>
                  <li><strong>Language Revitalization and Documentation:</strong> Support language revitalization programs and develop multilingual documentation and educational materials.</li>
                  <li><strong>Adaptive Management and Monitoring:</strong> Incorporate IK into adaptive management and monitoring systems, allowing for the integration of traditional knowledge with scientific data.</li>
                  <li><strong>Education and Awareness Campaigns:</strong> Create education campaigns that highlight the importance of IKS.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 2: Prospects and Limitations */}
            <div
              ref={(el) => {
                sectionRefs.current['prospects-limitations'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Prospects and Limitations of Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge offers significant potential, but it also has inherent limitations that must be acknowledged.
                  </p>
</div>

              {/* Prospects Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <TrendingUp size={16} /> Prospects of Indigenous Knowledge
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Sustainable Resource Management:</strong> IK often embodies generations of observation and adaptation to local ecosystems. This translates to valuable insights into sustainable agricultural practices, water management, and biodiversity conservation. In a world grappling with climate change, these practices are incredibly relevant.</li>
                  <li><strong>Health and Traditional Medicine:</strong> Many indigenous communities possess extensive knowledge of medicinal plants and healing practices. This can complement or provide alternatives to Western medicine, particularly in areas where access to modern healthcare is limited.</li>
                  <li><strong>Cultural Preservation and Identity:</strong> IK is intrinsically linked to cultural identity and heritage. Its preservation helps maintain traditions, languages, and social structures, fostering a sense of belonging and community resilience.</li>
                  <li><strong>Climate Change Adaptation:</strong> Indigenous communities have often developed adaptive strategies to cope with environmental variability. Their knowledge can be crucial for developing local solutions to climate change impacts.</li>
                  <li><strong>Biodiversity Conservation:</strong> Indigenous communities often have a very deep understanding of the flora and fauna in their local environments. This knowledge is very important for conservation efforts.</li>
                  <li><strong>Food Security:</strong> IK often includes knowledge about drought-resistant crops and traditional food storage methods that can be very important to food security.</li>
                </ul>
              </div>

              {/* Limitations Card */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} /> Limitations of Indigenous Knowledge
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Context-Specificity:</strong> IK is often deeply rooted in specific local environments and cultural contexts. This can limit its applicability in different settings, making it difficult to generalize or transfer.</li>
                  <li><strong>Oral Transmission and Vulnerability:</strong> Reliance on oral transmission makes IK susceptible to loss, particularly with the passing of elders and the decline of traditional languages.</li>
                  <li><strong>Lack of Formal Documentation:</strong> The absence of formal documentation and codification can hinder the accessibility and sharing of IK, making it difficult to integrate with mainstream scientific knowledge.</li>
                  <li><strong>Integration with Modern Systems:</strong> Bridging the gap between IK and Western scientific or policy frameworks can be challenging due to differences in worldviews and methodologies.</li>
                  <li><strong>Vulnerability to Exploitation:</strong> IK can be vulnerable to misappropriation and exploitation by external actors, particularly in the context of commercialization and bioprospecting.</li>
                  <li><strong>Social and Environmental Change:</strong> Rapid social and environmental changes can render some aspects of IK less relevant or applicable.</li>
                  <li><strong>Limited Capacity:</strong> Some indigenous communities may lack the resources or capacity to properly record and store their IKS.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 3: Managing Traditional Knowledge Systems */}
            <div
              ref={(el) => {
                sectionRefs.current['managing-tks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Managing Traditional Knowledge Systems (TKS)
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Managing Traditional Knowledge Systems (TKS) requires a multi‑faceted approach that respects the rights of knowledge holders, ensures its preservation, and promotes its responsible use.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: '1. Community-Based Management',
                    icon: <Users size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Empowerment:</strong> Prioritize the involvement of indigenous and local communities in all aspects of TKS management. This includes decision-making regarding documentation, access, and use.</li>
                        <li><strong>Customary Protocols:</strong> Recognize and respect customary laws and protocols governing the transmission and use of TKS.</li>
                        <li><strong>Community-Owned Archives:</strong> Support the establishment of community-owned archives and knowledge centers to ensure that TKS remains under the control of its rightful custodians.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '2. Documentation and Preservation',
                    icon: <ArchiveIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Culturally Sensitive Methods:</strong> Employ documentation methods that align with cultural values and practices. This may involve audio-visual recordings, storytelling, and other forms of traditional expression.</li>
                        <li><strong>Digital Archiving:</strong> Utilize digital technologies for archiving TKS, while ensuring data security and appropriate access controls.</li>
                        <li><strong>Language Preservation:</strong> Support language revitalization efforts, as many TKS are intrinsically linked to indigenous languages.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '3. Legal and Policy Frameworks',
                    icon: <ShieldIcon size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Intellectual Property Rights:</strong> Establish legal frameworks that recognize and protect the intellectual property rights of indigenous and local communities.</li>
                        <li><strong>Prior Informed Consent (PIC):</strong> Implement PIC procedures to ensure that communities have the right to decide how their TKS is used.</li>
                        <li><strong>Benefit Sharing:</strong> Develop mechanisms for equitable benefit sharing when TKS is used for commercial or other purposes.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '4. Collaborative Partnerships',
                    icon: <Handshake size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Researchers and Communities:</strong> Foster collaborative research partnerships between researchers and indigenous communities, ensuring that research is conducted ethically and respectfully.</li>
                        <li><strong>Inter-Institutional Collaboration:</strong> Promote collaboration between government agencies, academic institutions, and NGOs to support TKS management.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '5. Education and Awareness',
                    icon: <BookOpenIcon2 size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Integration into Curricula:</strong> Integrate TKS into educational curricula to promote awareness and understanding among younger generations.</li>
                        <li><strong>Public Awareness Campaigns:</strong> Conduct public awareness campaigns to highlight the value of TKS and promote respect for indigenous cultures.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '6. Ethical Considerations',
                    icon: <Heart size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Respect for Cultural Values:</strong> Adhere to ethical principles that respect cultural values, spiritual beliefs, and traditional practices.</li>
                        <li><strong>Confidentiality and Privacy:</strong> Protect the confidentiality and privacy of sensitive TKS.</li>
                      </ul>
                    ),
                  },
                  {
                    title: '7. Adaptive Management',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Monitoring and Evaluation:</strong> Create systems to monitor and evaluate the effectiveness of TKS management strategies.</li>
                        <li><strong>Flexibility:</strong> Recognize that TKS is dynamic, and create systems that can adapt to changing social and environmental conditions.</li>
                      </ul>
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5"
                  >
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

            {/* SECTION 4: Roles of Science */}
            <div
              ref={(el) => {
                sectionRefs.current['science-roles'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Roles of Science in the Generation of Indigenous Knowledge
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    While Indigenous Knowledge is primarily generated through observation, experience, and oral transmission within communities, science can play several supporting roles in its understanding, validation, and application. It's crucial to understand that science should be a tool that respects IK, not a replacement for it.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Validation and Documentation of IK:</strong> Scientific methods can be used to validate and document the effectiveness of traditional practices. For example, ethnobotanical studies can analyze the chemical properties of medicinal plants used in traditional healing, providing scientific evidence for their efficacy. This validation can help to gain wider recognition for IK and promote its integration into mainstream systems. Science can also provide a method of documenting IKS, using audio, video, and written methods, this can help to preserve IKS.</li>
                  <li><strong>Understanding Ecological Processes:</strong> Scientific tools and techniques can be used to understand the ecological processes underlying traditional resource management practices. This can help to explain why certain practices are effective and how they can be adapted to changing environmental conditions. For instance, ecological studies can analyze the impact of traditional farming methods on soil fertility and biodiversity.</li>
                  <li><strong>Technological Development and Adaptation:</strong> Science can contribute to the development of new technologies that are compatible with IK and can enhance traditional practices. This might involve adapting modern technologies to suit local contexts or developing new tools based on indigenous principles. For example, renewable energy technologies can be adapted to meet the needs of remote indigenous communities.</li>
                  <li><strong>Addressing Contemporary Challenges:</strong> Science can help to address contemporary challenges, such as climate change and biodiversity loss, by integrating IK with scientific knowledge. This involves using scientific models and data to understand the impact of these challenges on indigenous communities and to develop solutions that are both culturally appropriate and scientifically sound.</li>
                  <li><strong>Facilitating Knowledge Exchange:</strong> Science can provide a platform for knowledge exchange between indigenous communities and researchers. This involves creating opportunities for dialogue, collaboration, and co-creation of knowledge. Scientific publications and conferences can also serve as a means of disseminating IK to a wider audience, while ensuring appropriate attribution and respect for intellectual property rights.</li>
                  <li><strong>Developing Monitoring and Evaluation Tools:</strong> Scientific methods can be used to develop monitoring and evaluation tools that assess the effectiveness of indigenous resource management practices. This can help to demonstrate the value of IK and to inform policy decisions. For example, remote sensing and GIS technologies can be used to monitor changes in forest cover and biodiversity in areas managed by indigenous communities.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 5: Historical and Contemporary Devaluation */}
            <div
              ref={(el) => {
                sectionRefs.current['devaluation'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Historical and Contemporary Devaluation of Indigenous Knowledge Systems
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Indigenous Knowledge Systems have been systematically devalued throughout history and continue to face marginalisation in contemporary settings.
                  </p>
</div>

              {/* Historical Devaluation */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <ClockIcon size={16} /> Historical Devaluation
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Colonialism and Ethnocentrism:</strong> Colonial powers often dismissed IKS as "primitive" or "superstitious," promoting Western scientific knowledge as the only valid form of understanding. This ethnocentric view justified the suppression of indigenous practices and the imposition of Western systems of education, governance, and resource management.</li>
                  <li><strong>Land Dispossession and Resource Exploitation:</strong> Colonial land dispossession and resource exploitation disrupted traditional land management practices and undermined the ecological knowledge embedded in IKS. The forced removal of indigenous peoples from their ancestral lands severed their connection to the environment and disrupted the transmission of knowledge.</li>
                  <li><strong>Forced Assimilation and Cultural Suppression:</strong> Policies of forced assimilation aimed to eradicate indigenous languages, cultures, and knowledge systems. Residential schools and other institutions were used to forcibly remove children from their families and communities, disrupting the transmission of IKS across generations.</li>
                </ul>
              </div>

              {/* Contemporary Devaluation */}
              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 mb-2">
                  <TrendingUp size={16} /> Contemporary Devaluation
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Scientific Hegemony:</strong> Despite growing recognition of the value of IKS, Western scientific knowledge continues to hold a dominant position in many sectors, including research, policy, and development. This can lead to the marginalization of IKS and the dismissal of its validity.</li>
                  <li><strong>Commodification and Biopiracy:</strong> The commercialization of IKS, particularly in the fields of medicine and agriculture, has led to concerns about biopiracy and the misappropriation of indigenous knowledge. This can result in indigenous communities being denied the benefits of their own knowledge.</li>
                  <li><strong>Lack of Integration into Mainstream Systems:</strong> IKS is often excluded from mainstream educational curricula, policy frameworks, and development initiatives. This lack of integration perpetuates the marginalization of IKS and limits its potential to contribute to sustainable development.</li>
                  <li><strong>Impact of Globalization and Modernization:</strong> Globalization and modernization can lead to the erosion of traditional practices and the displacement of IKS. The influence of Western consumer culture and the dominance of global markets can undermine local economies and traditional livelihoods.</li>
                  <li><strong>Continuing Stereotypes and Misconceptions:</strong> Despite increased awareness, stereotypes and misconceptions about indigenous peoples and their knowledge systems persist. This can lead to prejudice and discrimination, further devaluing IKS.</li>
                  <li><strong>Lack of funding:</strong> Compared to western science, IKS research and preservation receives very little funding.</li>
                </ul>
              </div>
            </div>

            {/* SECTION 6: Blending Traditional and Western Knowledge */}
            <div
              ref={(el) => {
                sectionRefs.current['blending'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Blending Traditional Knowledge and Western Scientific Knowledge
              </h2>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5 space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The integration of Traditional Knowledge (TK) and Western Scientific Knowledge (WSK) presents a powerful approach to addressing complex challenges, offering a more holistic and nuanced understanding of the world. This blending, however, must be approached with respect, equity, and a commitment to collaborative knowledge creation.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  The core idea is to recognize that both TK and WSK offer valuable, but different, perspectives. TK, rooted in long-term observations and cultural practices, provides context-specific insights into local ecosystems, resource management, and social dynamics. WSK, with its emphasis on empirical data and rigorous analysis, offers tools for understanding fundamental processes and developing technological solutions. By combining these approaches, we can create more comprehensive and effective strategies for sustainable development, environmental conservation, and social well-being.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  One key aspect of blending these knowledge systems is recognizing the validity of different epistemologies. This involves moving beyond the assumption that WSK is the only valid form of knowledge and acknowledging the legitimacy of TK's experiential and holistic approach. Collaborative research projects, where indigenous communities and scientists work together as equal partners, are essential for fostering mutual understanding and respect. These collaborations should prioritize the principles of prior informed consent, benefit sharing, and the recognition of indigenous intellectual property rights.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Blending TK and WSK can take various forms. For example, ethnobotanical studies can combine traditional knowledge of medicinal plants with scientific analysis of their chemical properties, leading to the development of new pharmaceuticals. Ecological studies can integrate indigenous knowledge of local ecosystems with scientific data to develop more effective conservation strategies. Climate change adaptation efforts can benefit from the integration of indigenous knowledge of traditional weather patterns and adaptive strategies with scientific climate models.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  It is crucial to avoid a simplistic or extractive approach to blending TK and WSK. This involves moving beyond simply "extracting" useful information from TK and instead engaging in a process of co-creation, where both knowledge systems are valued and integrated. This requires building trust, fostering open communication, and ensuring that indigenous communities have control over their knowledge. Furthermore, it's vital to acknowledge that TK is not a monolithic entity. It varies across communities and contexts, and any attempt to blend it with WSK must be sensitive to this diversity.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Ultimately, the blending of TK and WSK offers a promising path towards a more sustainable and equitable future. By recognizing the strengths of both knowledge systems and fostering collaborative partnerships, we can create innovative solutions to the challenges facing our world.
                </p>
              </div>
            </div>

            {/* SECTION 7: Role of Archivists */}
            <div
              ref={(el) => {
                sectionRefs.current['archivists'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Role of Archivists and Information Practitioners in Indigenous Knowledge Management
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Archivists and information practitioners play a pivotal role in the preservation, organization, and accessibility of Indigenous Knowledge (IK), contributing significantly to its management and sustainability. Their expertise in information management, combined with a commitment to ethical practices, is crucial for ensuring that IK is respected, protected, and utilized appropriately.
                  </p>
</div>

              <div className="p-4 bg-slate-50 dark:bg-white/[0.03] rounded-xl border border-slate-100 dark:border-white/5">
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li><strong>Documentation and Preservation:</strong> Archivists are essential in the documentation and preservation of IK. Recognizing that much of IK is orally transmitted, they can employ culturally sensitive methods to record and document this knowledge. This includes audio-visual recordings, transcriptions, and the creation of digital repositories, always with the full consent and participation of the knowledge holders. They are also vital in preserving physical artifacts, and documents, that are related to IKS. Furthermore, archivists are skilled in developing and implementing preservation strategies that ensure the long-term survival of these records, both digital and analog. This involves managing digital files, ensuring data integrity, and creating metadata that accurately reflects the context and provenance of the information.</li>
                  <li><strong>Organization and Accessibility:</strong> Information practitioners contribute to the organization and accessibility of IK. They can develop classification systems and metadata standards that reflect indigenous worldviews and languages, making the information easily retrievable for community members and researchers alike. They are also crucial in creating user-friendly interfaces for digital repositories, ensuring that IK is accessible to a wide range of users, including those with limited technical skills. Moreover, they can develop information literacy programs that empower indigenous communities to manage their own knowledge and access relevant resources.</li>
                  <li><strong>Ethical Considerations:</strong> Both archivists and information practitioners play a vital role in upholding ethical considerations in IK management. They are trained to respect intellectual property rights, cultural sensitivities, and the principle of prior informed consent. They can advocate for policies that protect IK from misappropriation and exploitation, and they can ensure that access to sensitive knowledge is restricted to authorized individuals or groups. This includes ensuring that the community involved has given permission for any information to be shared.</li>
                  <li><strong>Facilitating Knowledge Exchange:</strong> They can play a vital role in facilitating knowledge exchange between indigenous communities and researchers. By creating platforms for dialogue and collaboration, they can foster mutual understanding and respect. They can also help to translate and interpret IK for use in mainstream systems, such as education, health care, and environmental management.</li>
                  <li><strong>Community-Based Information Systems:</strong> Information professionals can assist in the development of community-based information systems. This involves training community members in information management skills, providing technical support, and helping to develop sustainable information infrastructure. Such systems empower indigenous communities to manage their own knowledge and participate in decision-making processes that affect their lives.</li>
                </ul>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                  In essence, archivists and information practitioners act as custodians and facilitators, ensuring that IK is preserved, accessible, and used in a way that benefits indigenous communities and contributes to a more just and sustainable future.
                </p>
              </div>
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────────────────── */}
          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Random Tip Card */}
            <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#121212] p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  💡 IKS Insight
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
                  <span>Challenges</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">8</span>
                </li>
                <li className="flex justify-between">
                  <span>Solutions</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Management Approaches</span>
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
                Managing IKS requires addressing challenges like oral transmission, loss of elders, IPR issues, and language barriers through community-based documentation, legal frameworks, and intergenerational programs. IKS has prospects in sustainability, health, and culture, but limitations include context-specificity and vulnerability to exploitation. Effective management involves community empowerment, ethical guidelines, and collaboration. Science can validate and complement IK, while archivists play a crucial role in preservation, access, and advocacy.
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
                <strong className="text-white">Challenges & Solutions</strong> – Managing IKS faces challenges like oral transmission, loss of elders, IPR issues, and language barriers; solutions include community documentation, legal protection, and intergenerational transfer.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Prospects & Limitations</strong> – IKS offers prospects in sustainability, health, culture, and climate adaptation, but has limitations such as context-specificity, vulnerability to loss, and exploitation.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Managing TKS</strong> – Effective management involves community-based approaches, documentation, legal frameworks, collaboration, education, ethics, and adaptive strategies.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Science & Archivists</strong> – Science can validate and complement IK; archivists and information practitioners preserve, organize, and advocate for ethical access and community empowerment.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Devaluation & Blending</strong> – IKS has been historically and contemporarily devalued; blending TK with WSK requires equity, collaboration, and respect for diverse epistemologies.
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
            Sidemann Academic Registry • Managing Indigenous Knowledge &amp; Traditional Wisdom 1.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
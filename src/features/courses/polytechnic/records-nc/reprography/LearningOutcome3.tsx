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
  Lightbulb,
  Eye,
  Palette,
  Layers,
  FlaskRound,
  AlertTriangle,
  Cloud,
  Sun,
  Lock,
  Camera,
  Edit,
  Printer,
  Box,
  Folder,
  HardDrive,
  Settings,
  Handshake,
  Wrench,
  Users,
  Share2,
  Waves,
  Zap,
  Computer,
  Award,
  FileText as FileTextIcon,
  Database,
  Snowflake,
  Layout,
  AlertCircle,
} from 'lucide-react';

// ──────────────────────────────────────────────────────────────────────────────
// SECTION TABS FOR NAVIGATION
// ──────────────────────────────────────────────────────────────────────────────
const SECTION_TABS = [
  { id: 'concepts', label: 'Key Concepts' },
  { id: 'risks', label: 'Preservation Risks' },
  { id: 'policy', label: 'Preservation Policy' },
  { id: 'physics', label: 'Physics of Light' },
  { id: 'tools', label: 'Tools & Standards' },
  { id: 'housing', label: 'Housing & Storage' },
  { id: 'handling', label: 'Storage & Handling' },
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
        text: 'The first permanent photograph, "View from the Window at Le Gras", was taken by Nicéphore Niépce in 1826 using a process that required an eight‑hour exposure.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use cotton gloves when handling photographic prints and negatives to prevent oils and acids from your skin damaging the emulsion.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of preservation: "C-H-L" – Control environment, Handle carefully, and store in proper enclosures (Light‑tight, acid‑free).',
      },
      {
        title: 'Common Mistake',
        text: 'Many people store photographs in standard plastic sleeves that contain PVC – over time, PVC can outgas and cause chemical damage to the images.',
      },
    ];
    setRandomTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const refreshRandomTip = () => {
    const tips = [
      {
        title: 'Did you know?',
        text: 'The first permanent photograph, "View from the Window at Le Gras", was taken by Nicéphore Niépce in 1826 using a process that required an eight‑hour exposure.',
      },
      {
        title: 'Pro Tip',
        text: 'Always use cotton gloves when handling photographic prints and negatives to prevent oils and acids from your skin damaging the emulsion.',
      },
      {
        title: 'Memory Trick',
        text: 'Remember the three pillars of preservation: "C-H-L" – Control environment, Handle carefully, and store in proper enclosures (Light‑tight, acid‑free).',
      },
      {
        title: 'Common Mistake',
        text: 'Many people store photographs in standard plastic sleeves that contain PVC – over time, PVC can outgas and cause chemical damage to the images.',
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
            <FileText size={14} className="inline mr-1" /> RECORDS & INFORMATION MANAGEMENT
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Photo-Reproduction, Preservation —{' '}
            <span className="text-purple-300 font-bold italic">
              &amp; The Physics of Light
            </span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl leading-relaxed">
            Comprehensive guide to photo‑reproduction key concepts, preservation risks, policies,
            physics of light, tools, practices, and storage.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-indigo-100">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              📚 {SECTION_TABS.length} sections
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Camera size={14} className="inline mr-1" /> Reproduction
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Shield size={14} className="inline mr-1" /> Preservation
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-full">
              <Lightbulb size={14} className="inline mr-1" /> Physics
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
                placeholder="Search for a concept, preservation risk, storage method..."
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
            {/* SECTION 1: Key Concepts in Photo-Reproduction */}
            <div
              ref={(el) => {
                sectionRefs.current['concepts'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Key Concepts in Photo-Reproduction
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Photo‑reproduction is the process of creating faithful copies of original images through
                    photographic or digital means. It relies on a deep understanding of light, optics, and
                    materials to capture and reproduce images with accuracy and fidelity.
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Light and Exposure: The Foundation of Image Capture',
                    icon: <Lightbulb size={16} />,
                    content: (
                      <>
                        <p>
                          Light is the fundamental element in photo-reproduction. Understanding its properties
                          and how it interacts with surfaces is crucial for capturing accurate and well-exposed
                          images. Exposure refers to the amount of light that reaches the image sensor or film,
                          controlled by the camera's aperture, shutter speed, and ISO sensitivity. Proper exposure
                          is essential for creating images with the desired brightness and contrast. Too little
                          light results in underexposed images, which are dark and lack detail, while too much
                          light leads to overexposed images, which are bright and washed out. The interplay between
                          these settings determines the final image's appearance. Mastering light and exposure
                          involves understanding how to manipulate these settings to achieve the desired effect,
                          whether it is capturing a dimly lit scene or freezing motion with a fast shutter speed.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Image Resolution and Sharpness: Capturing Fine Details',
                    icon: <Eye size={16} />,
                    content: (
                      <>
                        <p>
                          Image resolution and sharpness are critical for preserving the fine details of an image
                          during photo-reproduction. Resolution refers to the number of pixels or grains that make
                          up an image, while sharpness refers to the clarity and distinctness of the edges and
                          details. Higher resolution images contain more information and can be enlarged without
                          losing quality. Sharpness is influenced by factors such as lens quality, focus accuracy,
                          and camera stability. In photo-reproduction, maintaining image resolution and sharpness
                          is essential for capturing accurate and detailed copies of the original. This is
                          particularly important for archival purposes or when reproducing images for print media,
                          where high-quality reproductions are essential.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Colour Reproduction and Accuracy: Maintaining True Colours',
                    icon: <Palette size={16} />,
                    content: (
                      <>
                        <p>
                          Colour reproduction and accuracy are crucial for capturing and reproducing images with
                          faithful colour representation. This involves accurately capturing the colours of the
                          original scene or object and reproducing them in the final image. Colour accuracy is
                          influenced by factors such as the camera's colour sensitivity, the lighting conditions,
                          and the processing software. Colour management systems are used to ensure that colours
                          are accurately reproduced across different devices and media. This involves calibrating
                          displays, printers, and other devices to a common colour space. In photo-reproduction,
                          maintaining colour accuracy is essential for preserving the authenticity of the original
                          image and ensuring that colours are reproduced consistently.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Contrast and Dynamic Range: Capturing the Full Spectrum',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          Contrast and dynamic range are essential concepts in photo-reproduction, determining the
                          range of tones and colours that can be captured and reproduced. Contrast refers to the
                          difference between the lightest and darkest areas of an image, while dynamic range refers
                          to the range of brightness levels that a camera or display can capture or reproduce.
                          High contrast images have a wide difference between light and dark areas, while low
                          contrast images have a more even distribution of tones. A wide dynamic range allows for
                          the capture of both bright highlights and dark shadows in a single image. Understanding
                          contrast and dynamic range is crucial for capturing images with the desired tonal range
                          and avoiding clipping, which is the loss of detail in highlights or shadows.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Image Processing and Editing: Enhancing and Correcting Images',
                    icon: <Edit size={16} />,
                    content: (
                      <>
                        <p>
                          Image processing and editing play a significant role in photo-reproduction, allowing for
                          the enhancement and correction of captured images. This involves using software tools to
                          adjust various image parameters, such as brightness, contrast, colour balance, and
                          sharpness. Image editing can also be used to remove blemishes, correct distortions, and
                          create special effects. In photo-reproduction, image processing and editing are essential
                          for optimizing the quality of reproduced images and ensuring that they meet the desired
                          standards. However, it is crucial to strike a balance between enhancing images and
                          preserving their authenticity. Excessive editing can lead to unnatural-looking images or
                          the loss of important details.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Reproduction Techniques and Media: Creating Copies',
                    icon: <Printer size={16} />,
                    content: (
                      <>
                        <p>
                          Reproduction techniques and media refer to the methods and materials used to create
                          copies of original images. This can involve various processes, such as digital printing,
                          photographic printing, and scanning. The choice of reproduction technique and media
                          depends on factors such as the desired image quality, the intended use, and the budget.
                          Digital printing, for example, offers high-quality reproductions and allows for
                          customization and variable data printing. Photographic printing, on the other hand, is
                          ideal for creating archival-quality prints with exceptional colour accuracy and longevity.
                          Scanning is used to digitize physical images for digital storage or reproduction.
                          Understanding the characteristics of different reproduction techniques and media is
                          essential for selecting the most appropriate method for a given application.
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

            {/* SECTION 2: Preservation Risks and Concerns */}
            <div
              ref={(el) => {
                sectionRefs.current['risks'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preservation Risks and Concerns in Photo-Reproduction
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    Preservation risks and concerns in photo-reproduction are crucial to understand, as they
                    directly impact the longevity and integrity of valuable images. Here is a breakdown of these
                    risks:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Chemical Degradation: The Slow Decay',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <>
                        <p>
                          Chemical degradation is a significant concern, especially for older photographic
                          materials. Films, prints, and even digital storage media can undergo chemical reactions
                          that lead to deterioration over time. For instance, cellulose nitrate film, used in early
                          photography, is notoriously unstable and can decompose, releasing harmful gases and
                          posing a fire hazard. Colour dyes in prints and films can fade or shift due to exposure
                          to light, heat, or humidity. Even modern digital media, like optical discs, can degrade
                          due to chemical reactions within the storage layers. In photo-reproduction, it is
                          essential to use archival-quality materials and processes that minimize chemical
                          degradation. This includes storing materials in controlled environments with stable
                          temperature and humidity, using acid-free storage containers, and avoiding exposure to
                          harmful chemicals.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Physical Damage: The Scars of Time',
                    icon: <AlertTriangle size={16} />,
                    content: (
                      <>
                        <p>
                          Physical damage can occur from various sources, including handling, environmental factors,
                          and natural disasters. Scratches, abrasions, tears, and folds can compromise the integrity
                          of photographic materials. Dust and dirt can accumulate on surfaces, obscuring details and
                          causing further damage. Water damage from floods or leaks can lead to warping, staining,
                          and mold growth. In photo-reproduction, it is crucial to implement proper handling
                          procedures to minimize physical damage. This includes wearing gloves when handling
                          photographic materials, using appropriate storage containers, and avoiding excessive
                          handling. Storage areas should be protected from environmental hazards, and disaster
                          preparedness plans should be in place to mitigate the impact of unforeseen events.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Technological Obsolescence: The Ever-Changing Landscape',
                    icon: <Cloud size={16} />,
                    content: (
                      <>
                        <p>
                          Technological obsolescence is a significant challenge in the digital age. Digital storage
                          media, file formats, and software applications become outdated over time, making it
                          difficult to access stored images. For example, older digital files may require specialized
                          software or hardware that is no longer available. This can lead to data loss or the
                          inability to reproduce images. In photo-reproduction, it is crucial to adopt long-term
                          preservation strategies that mitigate the risks of technological obsolescence. This
                          includes migrating images to newer storage media and file formats, using open and
                          standardized file formats, and documenting the technical specifications of stored images.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Data Corruption and Loss: The Digital Dilemma',
                    icon: <AlertCircle size={16} />,
                    content: (
                      <>
                        <p>
                          Data corruption and loss can occur due to various factors, including hardware failures,
                          software errors, and human mistakes. Digital files can become corrupted, making them
                          unreadable or causing image distortion. Data loss can occur due to accidental deletion,
                          hard drive crashes, or other unforeseen events. In photo-reproduction, it is crucial to
                          implement data backup and recovery strategies to prevent data corruption and loss. This
                          includes regularly backing up digital images to multiple storage locations, using
                          redundant storage systems, and implementing data integrity checks.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Environmental Factors: The Silent Threats',
                    icon: <Sun size={16} />,
                    content: (
                      <>
                        <p>
                          Environmental factors, such as light, heat, humidity, and pollutants, can accelerate the
                          degradation of photographic materials. Ultraviolet (UV) radiation from sunlight or
                          artificial light can cause fading and discoloration. High temperatures and humidity can
                          accelerate chemical reactions and promote mold growth. Pollutants, such as ozone and
                          sulphur dioxide, can react with photographic materials, causing fading and deterioration.
                          In photo-reproduction, it is crucial to control environmental conditions in storage areas.
                          This includes maintaining stable temperature and humidity levels, filtering air to remove
                          pollutants, and minimizing exposure to light.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Security Risks: Protecting Valuable Assets',
                    icon: <Lock size={16} />,
                    content: (
                      <>
                        <p>
                          Security risks, such as unauthorized access, theft, and vandalism, can compromise the
                          integrity and availability of photographic materials. This is particularly relevant for
                          digital images stored on networked systems or in cloud storage. In photo-reproduction, it
                          is crucial to implement security measures to protect valuable images. This includes using
                          access controls, encryption, and firewalls to prevent unauthorized access, and implementing
                          physical security measures to protect storage areas from theft and vandalism.
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

            {/* SECTION 3: Preservation Policy for Photographic Materials */}
            <div
              ref={(el) => {
                sectionRefs.current['policy'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Preservation Policy for Photographic Materials
              </h2>

              <div className="p-4 sm:p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
  <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    A preservation policy for photographic materials is a crucial document that outlines an
                    organization's commitment to safeguarding its photographic collections for current and future
                    use. It provides a framework for decision-making regarding the care, handling, and storage of
                    these valuable assets. Here is a breakdown of the key components and considerations for
                    developing such a policy:
                  </p>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Statement of Purpose and Scope',
                    icon: <Target size={16} />,
                    content: (
                      <>
                        <p>
                          The policy should begin with a clear statement of purpose, outlining the organization's
                          commitment to preserving its photographic materials. It should define the scope of the
                          policy, specifying the types of photographic materials covered (e.g., film, prints,
                          digital images) and the collections included. This section establishes the policy's
                          intent and applicability, ensuring that all stakeholders understand its goals and
                          boundaries. It should also state that the policy will be reviewed and updated regularly.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Environmental Control Guidelines',
                    icon: <Settings size={16} />,
                    content: (
                      <>
                        <p>
                          This section should detail the organization's standards for environmental control in
                          storage areas. It should specify acceptable ranges for temperature, relative humidity,
                          light levels, and air quality. It should also outline procedures for monitoring and
                          maintaining these conditions, including the use of environmental monitoring equipment
                          and regular inspections. The policy should address the need for climate control systems
                          and air filtration to mitigate the risks of chemical degradation and physical damage.
                          This portion is critical, as it directly impacts the longevity of the collection.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Materials Handling and Storage Procedures',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p>
                          This section should outline the organization's protocols for handling and storing
                          photographic materials. It should specify the use of archival-quality storage materials,
                          such as acid-free boxes, folders, and sleeves. It should also detail proper handling
                          techniques, including the use of gloves and appropriate support materials. The policy
                          should address the storage of different types of photographic materials, such as film,
                          prints, and digital images, and specify appropriate storage conditions for each. This is
                          essential for preventing physical damage and minimizing the risk of deterioration.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Conservation and Restoration Practices',
                    icon: <Wrench size={16} />,
                    content: (
                      <>
                        <p>
                          This section should describe the organization's approach to conservation and restoration.
                          It should outline the principles and ethical guidelines that govern conservation
                          treatments, emphasizing the importance of minimal intervention and reversibility. The
                          policy should specify the qualifications and expertise required for conservation
                          professionals and outline procedures for documenting conservation treatments. It should
                          also address the use of appropriate materials and techniques for repairing and stabilizing
                          damaged photographic materials. This section ensures that any restoration work is carried
                          out professionally and ethically.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Digital Preservation Strategies',
                    icon: <HardDrive size={16} />,
                    content: (
                      <>
                        <p>
                          For digital photographic materials, this section should outline the organization's
                          strategies for long-term preservation. It should address the selection of appropriate
                          file formats, metadata standards, and storage media. The policy should specify procedures
                          for data backup, migration, and integrity checks. It should also address the risks of
                          technological obsolescence and outline strategies for mitigating these risks, such as the
                          use of open and standardized file formats. This section is vital in the modern era, where
                          many photograph collections are digital.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Disaster Preparedness and Recovery',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          This section should outline the organization's plans for disaster preparedness and
                          recovery. It should address the risks of various disasters, such as floods, fires, and
                          earthquakes, and specify procedures for mitigating these risks. The policy should include
                          procedures for salvaging damaged photographic materials, restoring environmental
                          conditions, and backing up digital data. It should also address the importance of regular
                          disaster preparedness training and drills. This portion of the policy protects the
                          collection from catastrophic loss.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Access and Reproduction Policies',
                    icon: <Share2 size={16} />,
                    content: (
                      <>
                        <p>
                          This section should outline the organization's policies for providing access to and
                          reproducing photographic materials. It should address the balance between preservation
                          and access, specifying appropriate handling and reproduction techniques. The policy
                          should also address copyright and intellectual property issues, and outline procedures
                          for obtaining permissions for reproduction. This section balances the needs of the public
                          with the needs of the collection.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Staff Training and Education',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          This section should outline the organization's commitment to providing staff training
                          and education on preservation best practices. It should specify the types of training
                          required for different staff roles and outline procedures for ongoing professional
                          development. The policy should also address the importance of raising awareness about
                          preservation among all staff members. This ensures that the policy will be properly
                          implemented.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Review and Update Procedures',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>
                          This section should specify procedures for regularly reviewing and updating the
                          preservation policy. It should address the frequency of reviews and the process for
                          incorporating new research and best practices. This ensures that the policy remains
                          relevant and effective.
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

            {/* SECTION 4: The Physics of Light */}
            <div
              ref={(el) => {
                sectionRefs.current['physics'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                The Physics of Light
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Light as a Wave and a Particle (Wave-Particle Duality)',
                    icon: <Waves size={16} />,
                    content: (
                      <>
                        <p>
                          Imagine light as something that can act in two different ways. Sometimes, it behaves like
                          a wave, similar to ripples in water. These waves have different lengths, and these lengths
                          determine the colour of the light we see. For example, red light has longer waves than blue
                          light. However, light can also act like tiny packets of energy, called photons. Think of
                          them like tiny balls of light. This "wave-particle duality" is a bit strange, but it is how
                          light works. It is like light has a dual personality, depending on how we look at it.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'The Electromagnetic Spectrum: A Rainbow Beyond What We See',
                    icon: <Layers size={16} />,
                    content: (
                      <>
                        <p>
                          The light we see, like the colours of a rainbow, is just a small part of a much larger
                          thing called the electromagnetic spectrum. This spectrum includes all sorts of light, most
                          of which we cannot see with our eyes. It includes radio waves, microwaves, infrared light
                          (like heat), ultraviolet light (which causes sunburn), X-rays, and gamma rays. All of these
                          are forms of light, but they have different wavelengths and energies. The light we see is
                          called visible light, and it is just a tiny slice of this huge spectrum.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Reflection and Refraction: Bouncing and Bending Light',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>
                          When light hits a surface, it can bounce off, which is called reflection. This is how we
                          see things. The smoother the surface, the more the light bounces off in a regular way, like
                          a mirror. When light passes from one material to another, like from air to water, it can
                          bend, which is called refraction. This happens because light travels at different speeds in
                          different materials. This is why a straw in a glass of water looks bent.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: "The Speed of Light: The Universe's Speed Limit",
                    icon: <Zap size={16} />,
                    content: (
                      <>
                        <p>
                          Light travels incredibly fast, about 300,000 kilometres per second (or about 186,000 miles
                          per second) in a vacuum. This is the fastest anything can travel in the universe. It is so
                          fast that light from the sun takes only about eight minutes to reach Earth. When light
                          travels through other materials, like glass or water, it slows down a bit.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Colour: What Our Eyes See',
                    icon: <Palette size={16} />,
                    content: (
                      <>
                        <p>
                          The colours we see are determined by the wavelengths of light that reach our eyes. When
                          white light, which contains all the colours of the rainbow, hits an object, some of the
                          wavelengths are absorbed, and others are reflected. The reflected wavelengths are what we
                          see as the object's colour. For example, a red apple absorbs all the other colours and
                          reflects only red light.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Light and Energy: Photons Packing a Punch',
                    icon: <Sun size={16} />,
                    content: (
                      <>
                        <p>
                          Light carries energy, and the amount of energy depends on the wavelength. Shorter
                          wavelengths, like blue light and ultraviolet light, carry more energy than longer
                          wavelengths, like red light and infrared light. This is why ultraviolet light can cause
                          sunburn – it has enough energy to damage our skin cells. This is also why X-rays and
                          gamma rays, which have very short wavelengths, are used in medical imaging and cancer
                          treatment – they have a lot of energy.
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

            {/* SECTION 5: Tools, Practices, and Standards for Processing */}
            <div
              ref={(el) => {
                sectionRefs.current['tools'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Tools, Practices, and Standards for Processing Photographic Materials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Tools for Chemical Processing (Traditional Film)',
                    icon: <FlaskRound size={16} />,
                    content: (
                      <>
                        <p>
                          For traditional film processing, several specialized tools are essential. These include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Developing Tanks and Reels:</strong> These are used to hold film during the
                            chemical development process, ensuring even exposure to the solutions.
                          </li>
                          <li>
                            <strong>Chemicals (Developer, Fixer, Stop Bath):</strong> These are the solutions that
                            react with the film to create the image. Each chemical plays a specific role in the
                            process.
                          </li>
                          <li>
                            <strong>Darkroom Equipment:</strong> This includes safe lights, timers, thermometers,
                            and measuring beakers, all necessary for precise control of the processing environment.
                          </li>
                          <li>
                            <strong>Film Dryers:</strong> These are used to dry the processed film without causing
                            damage or water spots.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The practical aspect involves precise measurements, careful timing, and strict adherence
                          to chemical safety protocols.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Practices for Chemical Processing (Traditional Film)',
                    icon: <CheckCircle size={16} />,
                    content: (
                      <>
                        <p>
                          The practices involved in chemical processing emphasize consistency and precision. Key
                          practices include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Temperature Control:</strong> Maintaining consistent temperatures of the
                            chemical solutions is crucial for consistent development.
                          </li>
                          <li>
                            <strong>Agitation:</strong> Regularly agitating the film in the solutions ensures even
                            development and prevents uneven results.
                          </li>
                          <li>
                            <strong>Cleanliness:</strong> Maintaining a clean darkroom and equipment is essential
                            to prevent contamination and artifacts on the film.
                          </li>
                          <li>
                            <strong>Safe Handling:</strong> Using proper safety equipment and procedures when
                            handling chemicals is vital to prevent health hazards.
                          </li>
                        </ul>
                        <p className="mt-2">
                          These practices aim to produce high-quality negatives or positives with accurate densities
                          and contrast.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Standards for Chemical Processing (Traditional Film)',
                    icon: <Award size={16} />,
                    content: (
                      <>
                        <p>
                          Industry standards and best practices guide chemical processing to ensure consistent and
                          archival-quality results. These standards often include:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>ISO Standards:</strong> International Organization for Standardization (ISO)
                            standards define specifications for film processing chemicals and procedures.
                          </li>
                          <li>
                            <strong>Archival Processing:</strong> Standards for archival processing emphasize the
                            use of specific chemicals and procedures to ensure the long-term stability of the
                            processed film.
                          </li>
                          <li>
                            <strong>Quality Control:</strong> Implementing quality control procedures, such as
                            density and colour checks, ensures that the processed film meets the required standards.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Tools for Digital Processing (Digital Photography)',
                    icon: <Computer size={16} />,
                    content: (
                      <>
                        <p>
                          Digital processing relies heavily on software and hardware, including:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Computers and Monitors:</strong> These are essential for viewing, editing, and
                            managing digital images.
                          </li>
                          <li>
                            <strong>Image Editing Software:</strong> Programs like Adobe Photoshop or Lightroom
                            provide tools for adjusting colour, exposure, and other image parameters.
                          </li>
                          <li>
                            <strong>Calibration Tools:</strong> These devices ensure accurate colour reproduction
                            on monitors and printers.
                          </li>
                          <li>
                            <strong>Printers:</strong> High-quality printers are used to produce prints from digital
                            images.
                          </li>
                        </ul>
                        <p className="mt-2">
                          The practical aspect involves mastering software tools and understanding colour management
                          principles.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Practices for Digital Processing (Digital Photography)',
                    icon: <Edit size={16} />,
                    content: (
                      <>
                        <p>
                          Digital processing practices emphasize non-destructive editing and workflow management:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>Non-Destructive Editing:</strong> Using adjustment layers and other
                            non-destructive techniques allows for flexibility and reversibility in editing.
                          </li>
                          <li>
                            <strong>Colour Management:</strong> Calibrating monitors and printers ensures accurate
                            colour reproduction across different devices.
                          </li>
                          <li>
                            <strong>File Management:</strong> Organizing and backing up digital files is essential
                            for preventing data loss.
                          </li>
                          <li>
                            <strong>Workflow Automation:</strong> Using batch processing and presets can streamline
                            the editing process for large volumes of images.
                          </li>
                        </ul>
                      </>
                    ),
                  },
                  {
                    title: 'Standards for Digital Processing (Digital Photography)',
                    icon: <FileTextIcon size={16} />,
                    content: (
                      <>
                        <p>
                          Digital imaging standards focus on file formats, colour spaces, and metadata:
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>File Formats (TIFF, JPEG, RAW):</strong> Standards define the characteristics
                            and uses of different file formats.
                          </li>
                          <li>
                            <strong>Colour Spaces (sRGB, Adobe RGB):</strong> Standards define colour spaces for
                            accurate colour reproduction across different devices.
                          </li>
                          <li>
                            <strong>Metadata Standards (EXIF, IPTC):</strong> Standards define metadata fields for
                            describing image information and copyright.
                          </li>
                          <li>
                            <strong>ISO Standards:</strong> ISO standards also address digital imaging, dealing
                            with image quality, and archiving.
                          </li>
                        </ul>
                        <p className="mt-2">
                          Adhering to these standards ensures interoperability and long-term accessibility of
                          digital images.
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

            {/* SECTION 6: Housing and Storage Options */}
            <div
              ref={(el) => {
                sectionRefs.current['housing'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Housing and Storage Options for Photographic Materials
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Archival-Quality Boxes and Enclosures: Keeping Things Safe and Sound',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          When it comes to storing photographic materials, archival-quality boxes and enclosures are
                          your first line of defence against the elements and time itself. These are not your everyday
                          cardboard boxes; they are made from materials specifically designed to be chemically stable
                          and acid-free, preventing any harmful reactions with your precious photos. Think of them as
                          tiny vaults for your memories. These boxes and enclosures come in various sizes and shapes,
                          perfect for storing everything from small prints to large-format negatives. For fragile
                          items, like glass plate negatives or delicate film, custom-made enclosures can provide extra
                          support and protection. These enclosures also help shield your photos from dust, light, and
                          fluctuations in temperature and humidity, all of which can cause damage over time. By
                          investing in archival-quality storage, you are essentially giving your photographs the best
                          possible chance to survive for generations to come.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Acid-Free Folders and Sleeves: Individual Protection for Each Item',
                    icon: <Folder size={16} />,
                    content: (
                      <>
                        <p>
                          Just like you would not throw all your important papers into a drawer without folders, you
                          should not store your photos in a pile. Acid-free folders and sleeves provide individual
                          protection for each photograph, preventing them from rubbing against each other and causing
                          scratches or abrasions. These sleeves are made from materials like polyester or
                          polyethylene, which are inert and will not react with the photographic emulsion. They act
                          as a gentle barrier against dust, fingerprints, and even airborne pollutants. Different
                          types of sleeves are available for different types of photos: thin sleeves for prints,
                          thicker sleeves for negatives, and even specialized sleeves for oddly shaped items. By
                          using acid-free folders and sleeves, you are creating a safe and organized environment for
                          your photos, making them easier to access and less prone to damage.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Climate-Controlled Storage: Creating the Perfect Environment',
                    icon: <Cloud size={16} />,
                    content: (
                      <>
                        <p>
                          Imagine a museum where the temperature and humidity are always just right. That is
                          essentially what climate-controlled storage is for photographic materials. Maintaining a
                          stable environment is crucial for preventing chemical degradation and physical damage.
                          High humidity can lead to mold growth and sticking, while low humidity can cause
                          brittleness and cracking. Temperature fluctuations can also accelerate chemical reactions
                          and cause fading. Climate-controlled storage involves using specialized equipment to
                          regulate temperature and humidity within a narrow range, typically around 18-22°C (64-72°F)
                          and 30-50% relative humidity. Air filtration systems are also used to remove dust and
                          pollutants, creating a clean and stable environment. While climate-controlled storage can
                          be expensive, it is a worthwhile investment for preserving valuable photographic
                          collections.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Cold Storage: Freezing Time for Certain Materials',
                    icon: <Snowflake size={16} />,
                    content: (
                      <>
                        <p>
                          For certain types of photographic materials, like colour negatives or motion picture film,
                          cold storage can significantly extend their lifespan. By lowering the temperature, you slow
                          down the chemical reactions that cause degradation. Cold storage typically involves storing
                          materials in freezers or refrigerators at temperatures below freezing. However, it is
                          crucial to use specialized equipment and procedures to prevent condensation and ice crystal
                          formation, which can damage the photos. Materials must be carefully wrapped in vapor-proof
                          barriers and allowed to warm up slowly before being handled. Cold storage is a specialized
                          technique that is typically used for materials that are particularly vulnerable to
                          degradation or that need to be preserved for very long periods.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Vertical Storage: Saving Space and Preventing Damage',
                    icon: <Layout size={16} />,
                    content: (
                      <>
                        <p>
                          Vertical storage is a space-saving and damage-preventing storage method. Instead of
                          stacking photos on top of each other, which can cause pressure damage, they are stored
                          upright in specially designed cabinets or racks. This method is particularly useful for
                          storing large collections of prints or negatives. Vertical storage allows for easy access
                          to individual items and minimizes the risk of damage from handling. It also helps to
                          prevent warping and distortion, as the photos are supported along their edges. Vertical
                          storage cabinets are often equipped with drawers or shelves that can be adjusted to
                          accommodate different sizes of photos.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Digital Storage (For Digital Images): Safe Keeping for Digital Files',
                    icon: <HardDrive size={16} />,
                    content: (
                      <>
                        <p>
                          For digital photographic materials, storage considerations are different, but no less
                          important. Digital files are susceptible to data loss due to hardware failures, software
                          obsolescence, and human error. Digital storage solutions should include multiple backups
                          stored in different locations. Using reliable hard drives, solid state drives, or cloud
                          storage services is important. File formats should be open and standardized, and metadata
                          should be carefully preserved. Regularly migrating files to newer storage media and file
                          formats is also crucial to prevent obsolescence. Digital asset management systems can help
                          organize and manage large collections of digital photos, providing features like metadata
                          tagging, version control, and access control.
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

            {/* SECTION 7: Storage and Handling of Photographic Records */}
            <div
              ref={(el) => {
                sectionRefs.current['handling'] = el;
              }}
              className="scroll-mt-24 p-4 sm:p-6 bg-white dark:bg-[#121212] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 inline-block uppercase">
                Storage and Handling of Photographic Records
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Environmental Control: Setting the Stage for Preservation',
                    icon: <Settings size={16} />,
                    content: (
                      <>
                        <p>
                          The environment in which photographic records are stored is paramount. Fluctuations in
                          temperature and humidity can cause significant damage to photographic materials. Ideally,
                          storage areas should maintain a stable temperature, typically between 18-22 degrees Celsius
                          (64-72 degrees Fahrenheit), and a relative humidity of 30-50%. High humidity can lead to
                          mold growth and sticking, while low humidity can cause brittleness and cracking. Light,
                          especially ultraviolet (UV) radiation, can cause fading and deterioration. Storage areas
                          should be kept dark or illuminated with low levels of UV-free lighting. Air quality is also
                          crucial, as pollutants and dust can accelerate degradation. Air filtration systems should
                          be implemented to remove harmful contaminants. Regular monitoring of environmental
                          conditions using sensors and data loggers is essential to ensure stability.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Handling Procedures: Gentle Care for Delicate Materials',
                    icon: <Handshake size={16} />,
                    content: (
                      <>
                        <p>
                          Photographic materials are often delicate and require careful handling to prevent damage.
                          Proper handling procedures are essential for minimizing physical damage, such as scratches,
                          tears, and fingerprints. Cotton gloves should be worn when handling photographs, negatives,
                          and films to prevent the transfer of oils and contaminants from the skin. Materials should
                          be handled by the edges and supported to avoid bending or folding. Heavy or bulky items
                          should be moved using appropriate equipment, such as trolleys or dollies. When retrieving
                          records from storage, it is crucial to use appropriate equipment and techniques. For
                          example, microfilm readers should be used to view microfilm, and light tables should be
                          used to examine negatives.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Storage Materials: Choosing the Right Containers',
                    icon: <Box size={16} />,
                    content: (
                      <>
                        <p>
                          The choice of storage materials can significantly impact the longevity of photographic
                          records. Archival-quality materials are designed to be chemically stable and inert,
                          preventing them from reacting with the records and causing damage. Acid-free boxes,
                          folders, and sleeves should be used for storing paper prints, negatives, and films. These
                          materials prevent the transfer of harmful chemicals and protect the records from dust and
                          light. For digital images, high-quality hard drives, solid-state drives, or optical discs
                          should be used. Redundant storage systems and regular backups are essential to prevent
                          data loss. Storage containers should be clearly labelled and organized to facilitate easy
                          retrieval.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Organization and Indexing: Making Records Accessible',
                    icon: <Database size={16} />,
                    content: (
                      <>
                        <p>
                          Proper organization and indexing are essential for making photographic records accessible
                          and usable. Records should be organized logically, based on subject, date, or other
                          relevant criteria. Indexing systems, such as databases or catalogues, should be used to
                          track the location and content of records. Metadata, or data about data, should be
                          captured and stored with digital images to provide context and facilitate searching.
                          Metadata standards, such as EXIF and IPTC, should be used to ensure interoperability.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Disaster Preparedness and Recovery: Planning for the Unexpected',
                    icon: <Shield size={16} />,
                    content: (
                      <>
                        <p>
                          Despite the best efforts to control environmental conditions and implement proper handling
                          procedures, disasters can still occur. Organizations must establish disaster preparedness
                          and recovery plans to minimize the impact of events such as floods, fires, and earthquakes.
                          These plans should include procedures for salvaging damaged records, restoring
                          environmental conditions, and backing up digital data. Regular disaster preparedness
                          training and drills are essential to ensure the effectiveness of the plans.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Training and Education: Empowering Staff for Preservation',
                    icon: <Users size={16} />,
                    content: (
                      <>
                        <p>
                          Staff training and education are crucial for ensuring that photographic records are
                          properly handled and stored. All staff members who handle photographic records should
                          receive training on proper handling techniques, environmental control, and disaster
                          preparedness. Training should be ongoing to ensure that staff members stay up to date on
                          best practices and new technologies.
                        </p>
                      </>
                    ),
                  },
                  {
                    title: 'Regular Inspections and Maintenance: Proactive Care',
                    icon: <RefreshCw size={16} />,
                    content: (
                      <>
                        <p>
                          Regular inspections and maintenance are essential for ensuring the long-term preservation
                          of photographic records. Storage areas should be periodically inspected for signs of damage
                          or deterioration, such as mold growth, water damage, or pest infestations. Environmental
                          conditions should be regularly monitored and adjusted as needed. Digital storage media
                          should be regularly checked for data integrity and backed up to prevent data loss.
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
                  💡 Photo‑Preservation Insight
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
                  <span>Key Concepts</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Preservation Risks</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
                <li className="flex justify-between">
                  <span>Policy Components</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">9</span>
                </li>
                <li className="flex justify-between">
                  <span>Storage Options</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">6</span>
                </li>
              </ul>
            </div>

            {/* Quick Reminder */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-5 shadow-sm">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                📝 Remember
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                Photo‑reproduction relies on understanding light, resolution, colour, and contrast.
                Preservation risks include chemical degradation, physical damage, technological
                obsolescence, data corruption, environmental factors, and security threats. A
                comprehensive preservation policy covers purpose, environment, handling, conservation,
                digital strategies, disaster preparedness, access, training, and review. Storage
                options range from archival boxes and acid‑free sleeves to climate‑controlled and
                cold storage. Proper handling, organisation, and regular inspections are essential
                for long‑term preservation.
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
                <strong className="text-white">Key Concepts</strong> – Light, exposure, resolution,
                colour accuracy, contrast, dynamic range, processing, and reproduction techniques
                form the foundation of photo‑reproduction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation Risks</strong> – Chemical degradation,
                physical damage, technological obsolescence, data corruption, environmental factors,
                and security threats all threaten the longevity of photographic materials.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Preservation Policy</strong> – A robust policy covers
                purpose, environmental guidelines, handling, conservation, digital strategies,
                disaster recovery, access, training, and regular review.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Physics of Light</strong> – Understanding light’s
                wave‑particle nature, the electromagnetic spectrum, reflection, refraction, speed,
                colour, and energy is essential for accurate reproduction.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Tools &amp; Standards</strong> – Chemical and digital
                processing require specialised tools, consistent practices, and adherence to ISO
                and archival standards for quality and longevity.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-300 font-bold">•</span>
              <span>
                <strong className="text-white">Storage &amp; Handling</strong> – Proper storage
                (archival boxes, climate control, cold storage) and careful handling (gloves,
                supporting materials) are vital; regular inspections and disaster plans protect
                collections.
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
            Sidemann Academic Registry • Photo‑Reproduction &amp; Preservation Mastery 3.0
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LearningOutcome3;
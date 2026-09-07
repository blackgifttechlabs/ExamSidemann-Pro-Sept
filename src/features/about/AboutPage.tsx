import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Code2,
  FileText,
  FlaskConical,
  GraduationCap,
  Lightbulb,
  Menu,
  School,
  Search,
  Sparkles,
  WifiOff,
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } };

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15 } } };

const heroFeatures = [
  {
    label: "Explore syllabus topics in one place",
    badge: null,
    icon: BookOpen,
    eyebrow: "Learning library",
    title: "Explore your syllabus, beautifully organised.",
    description:
      "Move from clear notes to worked examples and revision material without losing your place.",
    metric: "Multiple levels",
    metricLabel: "ECD to Polytechnic",
    items: ["Syllabus-aligned notes", "Worked examples", "Topic-by-topic revision"],
  },
  {
    label: "Run interactive science experiments",
    badge: "NEW",
    icon: FlaskConical,
    eyebrow: "Virtual laboratory",
    title: "Turn science lessons into experiments.",
    description:
      "Explore practical concepts through interactive experiments built for curious learners.",
    metric: "Hands-on",
    metricLabel: "Learn by doing",
    items: ["Guided procedures", "Interactive controls", "Instant observations"],
  },
  {
    label: "Find the right school",
    badge: null,
    icon: School,
    eyebrow: "Schools registry",
    title: "Discover schools with confidence.",
    description:
      "Search clearly separated primary, high school, college and university listings.",
    metric: "Local",
    metricLabel: "Zimbabwe-wide directory",
    items: ["Clear categories", "Fast local search", "Useful school details"],
  },
  {
    label: "Revise with past papers",
    badge: null,
    icon: FileText,
    eyebrow: "Exam preparation",
    title: "Practise smarter before exam day.",
    description:
      "Find the papers and focused revision resources you need, exactly when you need them.",
    metric: "Exam ready",
    metricLabel: "Focused preparation",
    items: ["Past exam papers", "Revision resources", "Quick subject access"],
  },
  {
    label: "Study even with limited data",
    badge: null,
    icon: WifiOff,
    eyebrow: "Accessible anywhere",
    title: "Keep learning when connectivity is limited.",
    description:
      "Lightweight pages and downloadable resources make study possible on more devices.",
    metric: "Low data",
    metricLabel: "Built for real conditions",
    items: ["Lightweight experience", "Downloadable PDFs", "Mobile-first access"],
  },
];

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [storyOpen, setStoryOpen] = useState(false);
  const [activeHeroFeature, setActiveHeroFeature] = useState(0);
  const selectedHeroFeature = heroFeatures[activeHeroFeature];
  const SelectedHeroIcon = selectedHeroFeature.icon;

  return (
    <div className="min-h-screen pt-0 font-sans text-left overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative isolate overflow-hidden bg-[#520047] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(228,70,190,0.18),transparent_35%),linear-gradient(145deg,#43003d_0%,#640052_55%,#4a003f_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-28 bottom-24 h-80 w-80 rounded-full bg-purple-300/10 blur-3xl"
        />

        <div className="absolute inset-x-0 top-0 z-30 mx-auto flex max-w-7xl px-6 pt-5 md:px-12 md:pt-7">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/75 backdrop-blur-sm transition hover:border-white/35 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back
          </button>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-40 hidden text-white md:block lg:left-12"
        >
          <Sparkles className="absolute left-20 top-0 h-5 w-5 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          <span className="absolute left-0 top-10 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.5)]" />
          <span className="absolute left-12 top-5 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.45)]" />
          <span className="absolute left-28 top-11 text-xl drop-shadow-[0_0_7px_white]">✦</span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-40 right-12 hidden h-24 w-36 text-white md:block"
        >
          <Sparkles className="absolute right-5 top-4 h-7 w-7 drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
          <span className="absolute bottom-4 left-3 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_4px_rgba(255,255,255,0.5)]" />
          <span className="absolute right-20 top-10 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_8px_3px_rgba(255,255,255,0.45)]" />
          <span className="absolute bottom-1 right-10 text-lg drop-shadow-[0_0_7px_white]">✦</span>
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-44 pt-24 md:px-12 md:pb-52 md:pt-28">
          <motion.header
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.p
              variants={fadeUp}
              className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-100/80"
            >
              About Exam Sidemann
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl"
            >
              Reimagining what&apos;s possible
              <br className="hidden sm:block" /> for every learner.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              Exam Sidemann brings accessible learning resources, interactive
              experiments and school discovery into one accessible platform —
              from ECD to Polytechnic.
            </motion.p>
          </motion.header>

          <div className="mt-12 grid items-center gap-10 lg:mt-14 lg:grid-cols-[0.78fr_1.22fr] lg:gap-14">
            <motion.nav
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              aria-label="Exam Sidemann features"
              className="mx-auto flex w-full max-w-xl flex-col gap-2 lg:mx-0"
            >
              {heroFeatures.map((feature, index) => {
                const FeatureIcon = feature.icon;
                const isActive = activeHeroFeature === index;

                return (
                  <button
                    key={feature.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveHeroFeature(index)}
                    className={`group flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      isActive
                        ? "bg-white text-[#5b064f] shadow-[0_12px_35px_rgba(31,0,28,0.25)]"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        isActive
                          ? "bg-fuchsia-100 text-[#720561]"
                          : "bg-white/10 text-white/75 group-hover:bg-white/15"
                      }`}
                    >
                      <FeatureIcon size={16} strokeWidth={2.25} />
                    </span>
                    <span className="flex-1">{feature.label}</span>
                    {feature.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-black tracking-wide ${
                          isActive
                            ? "bg-[#e8e9ff] text-[#4c46a8]"
                            : "bg-white text-[#5b064f]"
                        }`}
                      >
                        {feature.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </motion.nav>

            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.25, ease: "easeOut" }}
              className="relative mx-auto w-full max-w-3xl"
            >
              <div
                aria-hidden="true"
                className="absolute -inset-5 rounded-[2.5rem] bg-fuchsia-300/10 blur-2xl"
              />
              <div className="relative overflow-hidden rounded-[22px] border border-white/20 bg-[#260021] p-1.5 shadow-[0_30px_80px_rgba(22,0,20,0.42)]">
                <div className="overflow-hidden rounded-[17px] bg-[#f8f5f8] text-[#2f1730]">
                  <div className="flex h-11 items-center gap-3 bg-[#7c096a] px-4 text-white">
                    <div className="flex gap-1.5" aria-hidden="true">
                      <span className="h-2 w-2 rounded-full bg-[#ff6868]" />
                      <span className="h-2 w-2 rounded-full bg-[#ffd45e]" />
                      <span className="h-2 w-2 rounded-full bg-[#58d98c]" />
                    </div>
                    <div className="mx-auto flex h-7 w-[55%] items-center gap-2 rounded-md bg-black/15 px-3 text-[10px] text-white/75">
                      <Search size={11} />
                      <span className="truncate">Search Exam Sidemann</span>
                    </div>
                    <Menu size={15} className="text-white/70" />
                  </div>

                  <div className="flex min-h-[350px] sm:min-h-[390px]">
                    <aside className="flex w-14 shrink-0 flex-col items-center gap-3 bg-[#32102f] py-5 text-white sm:w-20">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-500 text-sm font-black shadow-lg">
                        ES
                      </div>
                      <div className="mt-3 flex flex-col gap-3" aria-hidden="true">
                        {heroFeatures.slice(0, 4).map((feature, index) => {
                          const SidebarIcon = feature.icon;
                          return (
                            <span
                              key={feature.label}
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                activeHeroFeature === index
                                  ? "bg-white text-[#6b075b]"
                                  : "bg-white/5 text-white/55"
                              }`}
                            >
                              <SidebarIcon size={14} />
                            </span>
                          );
                        })}
                      </div>
                    </aside>

                    <div className="min-w-0 flex-1 p-4 sm:p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={selectedHeroFeature.label}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22 }}
                          className="flex h-full flex-col"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8a337d] sm:text-[10px]">
                                {selectedHeroFeature.eyebrow}
                              </p>
                              <h2 className="mt-2 max-w-md text-lg font-black leading-tight text-[#2e1730] sm:text-2xl">
                                {selectedHeroFeature.title}
                              </h2>
                            </div>
                            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f2def0] text-[#7b0a68] sm:flex">
                              <SelectedHeroIcon size={20} />
                            </span>
                          </div>

                          <div className="mt-5 grid flex-1 gap-4 xl:grid-cols-[1fr_0.72fr]">
                            <div className="rounded-2xl border border-[#eadfe9] bg-white p-4 shadow-sm sm:p-5">
                              <p className="text-xs leading-relaxed text-[#6c586c] sm:text-sm">
                                {selectedHeroFeature.description}
                              </p>
                              <div className="mt-5 space-y-3">
                                {selectedHeroFeature.items.map((item, index) => (
                                  <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-xl bg-[#faf6fa] px-3 py-2.5"
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#efe0ee] text-[#7c096a]">
                                      <CheckCircle2 size={13} strokeWidth={2.5} />
                                    </span>
                                    <span className="text-[11px] font-bold text-[#4d3c4e] sm:text-xs">
                                      {item}
                                    </span>
                                    <span className="ml-auto hidden text-[9px] font-black text-[#a589a3] sm:block">
                                      0{index + 1}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="hidden flex-col justify-between rounded-2xl bg-gradient-to-br from-[#740562] to-[#4b0647] p-5 text-white shadow-lg xl:flex">
                              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                                <SelectedHeroIcon size={20} />
                              </span>
                              <div>
                                <p className="text-2xl font-black">
                                  {selectedHeroFeature.metric}
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-white/65">
                                  {selectedHeroFeature.metricLabel}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.13em] text-fuchsia-100/80">
                                <Sparkles size={12} />
                                The handheld teacher
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-36 left-1/2 z-20 h-52 w-[120%] -translate-x-1/2 rounded-[50%] bg-white dark:bg-[#050505]"
        />
      </section>

      <div className="max-w-7xl mx-auto">
        {/* ── STATS ── */}
        <section className="px-6 md:px-12 py-16 border-t border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-white/5">
          <div className="flex flex-wrap gap-x-16 gap-y-10 justify-between md:justify-start">
            {[
              { value: "ECD–Poly", label: "Learning levels" },
              { value: "Mobile", label: "First experience" },
              { value: "Low-data", label: "Lightweight access" },
              { value: "2025", label: "Founded" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <p className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em] font-bold">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── MISSION & VALUES ── */}
        <section className="px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-bold mb-6">
              Our mission
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-8">
              To democratize education by providing a centralized, accessible
              platform where learners can achieve academic excellence.
            </h2>

            {/* Mission image */}
            <div className="h-64 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-lg relative">
              <img
                src="/images/about/neverbuiltfor.jpeg"
                alt="Students gathered together beneath a tree"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-bold mb-8">
              Core values
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12">
              {[
                {
                  title: "Accessibility",
                  desc: "Reducing barriers with resources designed for students across locations, devices and connectivity levels." },
                {
                  title: "Quality & Trust",
                  desc: "We aim to align study materials with relevant Zimbabwean syllabi, identify sources where practical, and correct confirmed errors reported to us." },
                {
                  title: "Community",
                  desc: "Fostering a collaborative environment where students and educators thrive together." },
                {
                  title: "Offline-first",
                  desc: "Affordable PDF downloads via EcoCash give learners another way to study when connectivity is limited." },
              ].map((val, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {val.title}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="border-t border-gray-200 dark:border-white/5 mx-6 md:mx-12" />

        {/* ── STORY ── */}
        <section className="px-6 md:px-12 py-24 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-bold mb-10">
              The founder&apos;s story
            </p>

            <p className="mb-10 max-w-3xl rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-medium leading-relaxed text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200">
              This section recounts Prominance T. Kunyadini&apos;s personal
              experience and recollections. Individual learning outcomes vary;
              the story is not a promise of academic results.
            </p>

            <div className="flex flex-col md:flex-row gap-12 items-start mb-10">
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/5] relative mb-6 bg-gray-200 dark:bg-gray-800">
                  <img
                    src="/images/site/ceo_examsidemann.jpg"
                    alt="Prominance T. Kunyadini"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-white font-black text-2xl mb-1">
                      Prominance T. Kunyadini
                    </p>
                    <p className="text-white/80 text-sm font-bold tracking-wide uppercase">
                      Founder & Creator
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200 dark:border-blue-800/50">
                    <Code2 size={14} /> Self-Taught Developer
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full border border-purple-200 dark:border-purple-800/50">
                    <GraduationCap size={14} /> Education Advocate
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold rounded-full border border-green-200 dark:border-green-800/50">
                    <Lightbulb size={14} /> Innovator
                  </span>
                </div>
              </div>

              <div className="w-full md:w-2/3 pt-2">
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed text-2xl mb-8 font-medium">
                  ExamSidemann began with a simple, yet powerful realization:
                  Zimbabwean students struggled to access the resources needed
                  to succeed. Experiences from a village in Gutu, Mpandawana
                  highlighted a stark reality — outdated textbooks, unreliable
                  resources online, and talented classmates who failed to
                  proceed because of a single failed subject. That frustration
                  became the fuel.
                </p>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-6">
                  Prominance dedicated countless days compiling information from
                  diverse sources, transforming his findings into comprehensive
                  study aids shared with classmates. According to his account,
                  classmates found the materials useful while studying difficult
                  subjects at{" "}
                  <a
                    href="https://maspoly.ac.zw/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-colors"
                  >
                    Masvingo Polytechnic
                  </a>
                  . That success ignited the vision: democratizing access to
                  quality education.
                </p>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-10">
                  Driven by passion, Prominance spent months developing a free
                  website tailored to Zimbabwean syllabi. Recognizing
                  connectivity challenges, ExamSidemann also offers affordable{" "}
                  <a
                    href="/library/"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-500 transition-colors"
                  >
                    PDF downloads
                  </a>{" "}
                  via EcoCash to support students who have limited connectivity.
                </p>

                {/* Read more toggle */}
                <button
                  onClick={() => setStoryOpen(!storyOpen)}
                  className="group flex items-center gap-2 text-base font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 px-6 py-3 rounded-full transition-all duration-300"
                >
                  {storyOpen
                    ? "Collapse the timeline"
                    : "Explore the full timeline"}
                  <motion.span
                    animate={{ rotate: storyOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="inline-block"
                  >
                    ↓
                  </motion.span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── TIMELINE (expandable) ── */}
          <AnimatePresence>
            {storyOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden mt-16"
              >
                {/* Pull quote */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-20 bg-blue-50 dark:bg-blue-900/20 p-8 md:p-12 rounded-3xl relative"
                >
                  <div className="absolute text-6xl text-blue-200 dark:text-blue-800/30 -top-4 -left-2 font-serif">
                    "
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-blue-100 leading-snug relative z-10 italic">
                    I spent nights in classrooms when others slept — not because
                    I had to, but because I was desperate to understand how this
                    world worked.
                  </p>
                </motion.div>

                <div className="relative border-l-2 border-gray-200 dark:border-white/10 ml-4 md:ml-6 pb-8">
                  {[
                    {
                      era: "Primary school · Gutu United Primary",
                      heading: "The suitcase with secrets",
                      body: `While every other student played games in the computer lab, young Prominance was captivated by a strange app with a suitcase icon — an encyclopedia about animals and the world. He taught himself to type, experimented with Paint, explored MS Word. No teacher guided him. His teachers said: play games. He said: what else is there?` },
                    {
                      era: "Form 1 · Gutu High School · Age 14",
                      heading: "The big board — and a word he'd never heard",
                      body: `At 14, he spotted a sign mentioning "WiFi." He didn't know what it meant. He asked. The answer amazed him. He became friends with students fortunate enough to have laptops — T. Rufasha, T. Mubaiwa — and borrowed them constantly. School days were long, so the best time was night. The boys' hostel wasn't secure. He would slip out and walk to the classrooms, spending entire nights reading about the history of computers, learning everything no one had taught him.` },
                    {
                      era: "Form 2",
                      heading: 'His first program — not "Hello World"',
                      body: `Before any teacher introduced the concept of programming, Prominance borrowed a laptop, found VB.NET, and taught himself for weeks. His first program wasn't a greeting. It was a calculator. He had no idea what he was doing — he just did it anyway.` },
                    {
                      era: "Form 2 — same year",
                      heading: "Robotics, Simon Muzariri & the Science Fair",
                      body: `A Form 5 student named Simon Muzariri — later founder of Omorfo Tech Labs — arrived and introduced robotics. Every Thursday the club met. Then Simon told them about the Zimbabwe Science Fair: a national competition held every February–March. Any idea qualified — electronics, medicine, software, anything. Prominance knew immediately this was his arena.` },
                    {
                      era: "Form 3",
                      heading: "Second place — then he taught the exam class",
                      body: `VB.NET alone couldn't build something that worked without a coach. So he taught himself web development instead — all night, skipping lessons. At the Science Fair, he placed second with no prize. Then, still in Form 3, he turned around and taught the Form 4 exam class how to program, helping them build and enter their own projects.` },
                    {
                      era: "Form 6 · A-Levels",
                      heading: "X, X, X, X — all absent",
                      body: `By A-Level, Prominance spent most of his time at home researching and building rather than attending school. When the Science Fair dates clashed with his A-Level exams, he chose the competition. His results arrived: every subject marked X — Absent. He dropped his A-Levels and didn't look back.` },
                    {
                      era: "2023 · Masvingo Polytechnic",
                      heading: "No textbooks. No problem.",
                      body: `He enrolled to study IT at Masvingo Polytechnic and found something shocking: not a single textbook existed for the subjects they were studying. Nobody around him had even heard of programming. In his spare time, Prominance began creating PDFs for his classmates. First semester — very useful. By second semester it felt like his responsibility. Students performed remarkably well in exams.` },
                    {
                      era: "2024",
                      heading:
                        "Records Management — expanding the study guides",
                      body: `A cousin doing Records Management asked for help. With the aid of AI research tools, Prominance created course books for that department too. According to his account, several students using the materials went on to earn distinctions. He kept going.` },
                    {
                      era: "2024–2025 · South Africa",
                      heading: "Suspended. Broken. Still building.",
                      body: `A mistake he won't speak of led to suspension from Polytechnic for one year. Financial hardship followed. Relationships broke down. Friends were lost. He moved to live with his mother in South Africa — nothing fancy, nothing to do all day. Until one thought arrived: what if I converted these books into a website?\n\nWhat started as something to fill the silence became an obsession. Three straight months — only three hours of sleep a night — building course material for IT, Records Management, and Automotive Engineering simultaneously. It ended when he experienced a hypnagogic hallucination. He slowed down. But he did not stop.` },
                    {
                      era: "April 2025",
                      heading: "R200 worth of bricks — and a domain",
                      body: `He needed money for the domain. He asked his mother, but she didn't trust online payments — and he understood her reasons completely. Across the road, neighbours were demolishing a house and needed someone to clear bricks and rubble. He volunteered. R200 earned. Domain purchased. ExamSidemann was born.`,
                      image:
                        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop" },
                    {
                      era: "2025 — launch",
                      heading: "A larger audience than expected",
                      body: `He launched expecting a small audience, but the platform reached more learners than he anticipated. It was later rebuilt in React, and a WhatsApp AI bot was added to help students generate practice material on demand.` },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="relative pl-8 md:pl-12 mb-16 last:mb-0 group"
                    >
                      {/* Timeline Dot */}
                      <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-gray-50 dark:ring-[#0a0a0a] group-hover:scale-125 transition-transform duration-300 shadow-sm" />

                      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-3">
                          {item.era}
                        </p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                          {item.heading}
                        </h3>

                        {item.image && (
                          <div className="my-6 rounded-xl overflow-hidden h-48 md:h-64 relative bg-gray-200 dark:bg-gray-800">
                            <img
                              src={item.image}
                              alt={item.heading}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {item.body.split("\n\n").map((para, j) => (
                          <p
                            key={j}
                            className="text-gray-600 dark:text-gray-400 leading-relaxed text-base md:text-lg font-medium mb-3 last:mb-0"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* ── FOOTER SPACER ── */}
      <div className="h-24" />
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, BookOpen, GraduationCap, Wrench, Library, EyeOff, Ear, Brain, Accessibility, Sparkles, Heart, Star, MapPin, Clock, User, School } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolFinderProps {
  onNavigate: (page: string, params?: any) => void;
}

export const SchoolFinder: React.FC<SchoolFinderProps> = ({ onNavigate }) => {
  const schoolCategories = [
    { title: 'Primary Schools', description: 'The foundation of academic excellence for young learners in Zimbabwe.', image: 'https://i.ibb.co/DPX7HyzK/esgirl.png', id: 'primary', icon: BookOpen, color: 'emerald', label: 'Primary', enrollment: 'ZIMSEC & Cambridge', location: 'Zimbabwe', type: 'Foundational' },
    { title: 'High Schools', description: 'Premier Boarding and modern Day options for ZIMSEC & Cambridge.', image: 'https://i.ibb.co/qM3JXg9x/olevel-study.webp', id: 'high', icon: GraduationCap, color: 'blue', label: 'High School', enrollment: 'O & A Level', location: 'Zimbabwe', type: 'Secondary' },
    { title: 'Polytechnics', description: 'Specialized technical and vocational training for industrial expertise.', image: 'https://i.ibb.co/8vZQWRR/study-group-african-people-2-1.jpg', id: 'poly', icon: Wrench, color: 'amber', label: 'Polytechnic', enrollment: 'National Diploma', location: 'Zimbabwe', type: 'Technical' },
    { title: 'Universities', description: 'Higher education institutions offering advanced professional specializations.', image: 'https://i.ibb.co/0pMLDTFm/alevel-study.webp', id: 'university', icon: Library, color: 'indigo', label: 'University', enrollment: 'Degree Programs', location: 'Zimbabwe', type: 'Tertiary' }
  ];

  const specializedCategories = [
    { title: 'Blind Education', description: 'Dedicated institutions providing Braille and specialized learning.', image: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?q=80&w=2070', id: 'blind', icon: EyeOff, color: 'rose', label: 'Specialized', enrollment: 'Braille Support', location: 'Zimbabwe', type: 'Inclusive' },
    { title: 'Deaf Education', description: 'Schools focused on Sign Language and inclusive communication.', image: 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?q=80&w=2148', id: 'deaf', icon: Ear, color: 'cyan', label: 'Specialized', enrollment: 'Sign Language', location: 'Zimbabwe', type: 'Inclusive' },
    { title: 'Autism Care', description: 'Tailored environments for students with autism to thrive.', image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1972', id: 'autism', icon: Brain, color: 'violet', label: 'Specialized', enrollment: 'Safe Environment', location: 'Zimbabwe', type: 'Specialized' },
    { title: 'Special Needs', description: 'Accessible campuses designed for students with mobility support.', image: 'https://images.unsplash.com/photo-1534643944726-9923be0d7714?q=80&w=2070', id: 'physical', icon: Accessibility, color: 'teal', label: 'Specialized', enrollment: 'Mobility Support', location: 'Zimbabwe', type: 'Accessible' }
  ];

  const row1 = ["Whitestone", "Coghlan", "Hillside", "Henry Low", "Kumalo", "CBC", "Dominican Convent", "Milton Boys", "Girls College", "Mpopoma High", "NUST", "Solusi University", "ZOU", "Bulawayo Polytechnic", "Hillside Teachers’ College", "UCE", "Speciss College", "Trust Academy", "Heritage School", "Twin Rivers", "St. John’s Preparatory", "Courtney Selous", "Blakiston", "Prince Edward", "St. George’s College", "Arundel School", "Churchill Boys", "Roosevelt Girls", "UZ", "HIT", "WUA", "Arrupe Jesuit University", "Catholic University", "Harare Polytechnic", "Belvedere Technical", "Morgan Zintec", "Blackfordby College", "Chancellor Junior", "Mutare Junior", "Baring Primary", "St. Jude’s", "Hillcrest Preparatory", "St. Augustine’s", "Marist Brothers", "St. Faith’s", "Hillcrest College", "Sakubva High"];
  const row2 = ["Africa University", "MSUAS", "Mutare Polytechnic", "Marymount Teachers’ College", "Mutare Teachers’ College", "Bindura Primary", "Bradley Primary", "Mazowe Primary", "Freda Rebecca", "Barwick", "Mazowe Boys", "St. Alberts", "Howard High", "Bradley High", "Mavhuradonha High", "BUSE", "ZEGU", "Madziwa Teachers’ College", "Mushagashe Vocational", "Ruzawi", "Springvale House", "Digglefold", "Marondera Primary", "Godfrey Huggins", "Peterhouse", "Bernard Mizeki", "Monte Cassino", "Goromonzi High", "Waddilove", "MUAST", "Nyadire Teachers’ College", "Kushinga Phikelela", "Lomagundi Primary", "Chinhoyi Primary", "Banket Primary", "Karoi Junior", "Eiffel Flats", "Kutama College", "Lomagundi College", "Sandringham High", "Chinhoyi High", "Moleli High", "CUT", "Gwebi Agricultural", "Chinhoyi Technical", "Kyle Preparatory", "Victoria Junior"];
  const row3 = ["Hellen McGhie", "Francis Aphane", "Gokomere Primary", "Gokomere High", "Victoria High", "Kyle College", "Dewure High", "Pamushana High", "GZU", "RCU", "Masvingo Polytechnic", "Morgenster Teachers", "Bondolfi Teachers", "Victoria Falls Primary", "Coalfields Primary", "Baobab Primary", "Fatima Primary", "Inyathi Primary", "Mosi-oa-Tunya High", "John Tallach", "Inyathi High", "Tsholotsho High", "Fatima High", "LSU", "Hwange Teachers", "Victoria Falls Hotel School", "Gwanda Primary", "Portland Primary", "Mzingwane Primary", "Beitbridge Primary", "Colleen Bawn", "Falcon College", "Mzingwane High", "JZ Moyo High", "Matopo High", "Empandeni High", "GSU", "JMN Polytechnic", "Midlands Christian School", "Anderson Adventist", "Kwekwe Primary", "Gweru Primary", "Goldridge Primary", "MCC", "Chaplin High", "Fletcher High", "Regina Mundi", "MSU", "Gweru Polytechnic", "Kwekwe Polytechnic", "Mkoba Teachers"];

  const marqueeColors = [
    'bg-blue-500/10 text-blue-600 border-blue-200/50',
    'bg-emerald-500/10 text-emerald-600 border-emerald-200/50',
    'bg-amber-500/10 text-amber-600 border-amber-200/50',
    'bg-[#ff7400]/10 text-[#ff7400] border-rose-200/50',
    'bg-indigo-500/10 text-indigo-600 border-indigo-200/50',
    'bg-violet-500/10 text-violet-600 border-violet-200/50',
    'bg-cyan-500/10 text-cyan-600 border-cyan-200/50',
    'bg-teal-500/10 text-teal-600 border-teal-200/50',
  ];

  const cardVariants: any = {
    initial: { 
      opacity: 0, 
      y: 50, 
      filter: "blur(20px)" 
    },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      y: -120, 
      filter: "blur(30px) brightness(1.5) contrast(200%)", 
      scale: 1.05,
      transition: { duration: 1, ease: "anticipate" }
    }
  };

  const skeletonVariants: any = {
    initial: { opacity: 1 },
    animate: { 
      opacity: 0, 
      transition: { duration: 0.8, delay: 0.3, ease: "easeInOut" } 
    }
  };

  return (
    <section 
      id="school-finder"
      className="relative py-24 md:py-40 overflow-hidden bg-[#fcfcfc] dark:bg-[#050505]"
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.07]" style={{
          backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
          backgroundSize: '32px 32px'
       }}></div>

      <div className="pl-[20px] pr-4 md:pr-10 relative z-10 w-full overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-left mb-20 md:mb-32"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-blue-600"></div>
            <span className="text-blue-600 font-semibold text-sm">Institution Finder</span>
          </div>
          <h2 className="text-2xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-4 whitespace-nowrap overflow-hidden">
            Find the best <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-400 to-blue-600">Schools in Zimbabwe</span>
          </h2>
          <div className="relative inline-block group">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative p-4 md:p-6 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl md:rounded-3xl shadow-xl max-w-2xl lg:hidden"
            >
              <div className="absolute -top-2 left-8 w-4 h-4 bg-white dark:bg-[#111] border-l border-t border-gray-100 dark:border-white/10 rotate-45"></div>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-lg font-medium leading-relaxed">
                Discover a comprehensive directory of Zimbabwean educational institutions. Filter by curriculum, location, and facilities.
              </p>
            </motion.div>
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mt-6 ml-10 text-blue-600 lg:hidden"
            >
              <ArrowRight size={24} className="rotate-90" />
            </motion.div>
          </div>

          {/* Marquee Container */}
          <div className="relative w-full overflow-hidden flex flex-col gap-3 py-6" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            {/* Row 1 */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused] pb-1">
              <div className="flex gap-2 pr-2">
                {row1.map((school, i) => (
                  <div key={`r1a-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[i % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pr-2">
                {row1.map((school, i) => (
                  <div key={`r1b-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[i % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
            </div>
            {/* Row 2 */}
            <div className="flex w-max animate-marquee-reverse hover:[animation-play-state:paused] pb-1">
              <div className="flex gap-2 pr-2">
                {row2.map((school, i) => (
                  <div key={`r2a-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[(i + 3) % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pr-2">
                {row2.map((school, i) => (
                  <div key={`r2b-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[(i + 3) % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
            </div>
            {/* Row 3 */}
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              <div className="flex gap-2 pr-2">
                {row3.map((school, i) => (
                  <div key={`r3a-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[(i + 5) % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pr-2">
                {row3.map((school, i) => (
                  <div key={`r3b-${i}`} className={`px-2 py-1 rounded-full text-[8px] md:text-xs font-black uppercase tracking-tight border backdrop-blur-sm transition-all hover:scale-110 cursor-default ${marqueeColors[(i + 5) % marqueeColors.length]}`}>
                    {school}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 w-full mb-32 pb-8">
          {schoolCategories.map((category, index) => {
            return (
              <motion.div 
                key={index}
                variants={cardVariants}
                initial="initial"
                whileInView="animate"
                viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('schools/search', { type: category.id })}
                className="group relative bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 transition-all duration-300 cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
              >
                {/* Skeleton Overlay */}
                <motion.div 
                  variants={skeletonVariants}
                  className="absolute inset-0 z-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40"
                />
                {/* Image Container */}
                <div className="aspect-[3/2] relative overflow-hidden shrink-0">
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                </div>

                {/* Content Area */}
                <div className="p-3 md:p-4 flex flex-col items-start justify-start flex-1 text-left w-full">
                  {/* Info Tag */}
                  <div className="text-blue-600 dark:text-blue-400 font-bold text-[10px] md:text-xs mb-1 uppercase tracking-tight text-left w-full">
                    {category.enrollment}
                  </div>

                  {/* Name */}
                  <h3 className="text-[11px] md:text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase text-left w-full">
                    {category.title}
                  </h3>

                  {/* Category/Type */}
                  <div className="text-[9px] md:text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-tight text-left w-full">
                    {category.type} Education
                  </div>

                  {/* Action Button */}
                  <button className="mt-auto w-full py-2 bg-[#ff003c] text-white hover:bg-[#d90033] rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                    <School size={10} /> Explore
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-24 space-y-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-start text-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#ff7400]"></div>
              <span className="text-[#ff7400] font-bold text-sm uppercase tracking-widest">Learning Paths</span>
            </div>
            
            <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter mb-4">
              Inclusive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7400] to-pink-500">Education Systems</span>
            </h3>

            <div className="relative inline-block mt-4 lg:hidden">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm max-w-xl"
              >
                <div className="absolute -top-2 left-6 w-4 h-4 bg-gray-50 dark:bg-[#111] border-l border-t border-gray-100 dark:border-white/10 rotate-45"></div>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] md:text-sm font-bold uppercase tracking-tight leading-loose">
                  Tailored environments designed to ensure every student has the support they need to reach their full potential.
                </p>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mt-4 ml-6 text-[#ff7400]"
              >
                <ArrowRight size={18} className="rotate-90" />
              </motion.div>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 w-full pb-20">
            {specializedCategories.map((category, index) => {
              return (
                <motion.div 
                  key={index}
                  variants={cardVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: false, margin: "-100px 0px -100px 0px" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('schools/search', { type: category.id })}
                  className="group relative bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 transition-all duration-300 cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
                >
                  {/* Skeleton Overlay */}
                  <motion.div 
                    variants={skeletonVariants}
                    className="absolute inset-0 z-20 bg-gradient-to-br from-[#ff7400]-100 to-pink-100 dark:from-[#ff7400]/40 dark:to-pink-900/40"
                  />
                  {/* Image Container */}
                  <div className="aspect-[3/2] relative overflow-hidden shrink-0">
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>

                  {/* Content Area */}
                  <div className="p-3 md:p-4 flex flex-col items-start justify-start flex-1 text-left w-full">
                    {/* Info Tag */}
                    <div className="text-blue-600 dark:text-blue-400 font-bold text-[10px] md:text-xs mb-1 uppercase tracking-tight text-left w-full">
                      {category.enrollment}
                    </div>

                    {/* Name */}
                    <h3 className="text-[11px] md:text-sm font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase text-left w-full">
                      {category.title}
                    </h3>

                    {/* Category/Type */}
                    <div className="text-[9px] md:text-[10px] text-gray-400 font-bold mb-2 uppercase tracking-tight text-left w-full">
                      {category.type} Education
                    </div>

                    {/* Action Button */}
                    <button className="mt-auto w-full py-2 bg-[#ff003c] text-white hover:bg-[#d90033] rounded-lg font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                      <School size={10} /> View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

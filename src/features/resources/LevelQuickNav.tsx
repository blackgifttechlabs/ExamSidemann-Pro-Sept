
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CURRICULUM_REGISTRY } from '../../data/constants';

interface LevelQuickNavProps {
  onNavigate: (page: string, params?: any) => void;
}

export const LevelQuickNav: React.FC<LevelQuickNavProps> = ({ onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const getCourseImage = (id: string): string => {
    const normId = id.toLowerCase();
    if (normId.includes('it') || normId.includes('programming') || normId.includes('information technology')) {
      return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=400';
    }
    if (normId.includes('auto') || normId.includes('electric') || normId.includes('motor') || normId.includes('car')) {
      return 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=400';
    }
    if (normId.includes('record')) {
      return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=400';
    }
    if (normId.includes('purchasing') || normId.includes('procurement') || normId.includes('supply') || normId.includes('logistic')) {
      return 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=400';
    }
    if (normId.includes('banking') || normId.includes('finance')) {
      return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=400';
    }
    if (normId.includes('form-1') || normId.includes('form 1') || normId.includes('form-2') || normId.includes('form 2')) {
      return 'https://images.unsplash.com/photo-1523050853063-bd8012fec21b?q=80&w=400';
    }
    if (normId.includes('form-3') || normId.includes('form 3') || normId.includes('form-4') || normId.includes('form 4')) {
      return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400';
    }
    if (normId.includes('lower-6') || normId.includes('lower 6') || normId.includes('upper-6') || normId.includes('upper 6') || normId.includes('form-5') || normId.includes('form-6') || normId.includes('6')) {
      return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400';
    }
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400';
  };

  const formatCourseName = (name: string): string => {
    return name
      .replace('Information Technology', 'I.T.')
      .replace('Auto Electrics', 'Auto')
      .replace('Records & Information Management', 'Records')
      .replace('Records Management', 'Records')
      .replace('Purchasing & Supply', 'Purchasing')
      .replace('Industrial & Services Procurement', 'Purchasing')
      .replace('Banking and Finance', 'Banking');
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll();
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full sticky top-16 z-40 bg-white/95 dark:bg-[#070707]/95 backdrop-blur-sm shadow-sm border-b border-gray-100 dark:border-white/5 transition-all">
      <div className="w-full px-[20px] py-3 relative flex items-center group">
        
        {/* Left Fading Scroll Indicator */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#070707] to-transparent z-20 flex items-center shadow-inner pointer-events-none">
            <button
              onClick={() => scroll('left')}
              className="pointer-events-auto ml-2 w-8 h-8 rounded-full bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-200 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-gray-100 dark:border-white/10 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto scroll-smooth hide-scrollbar px-0 py-1 w-full select-none"
        >
          {CURRICULUM_REGISTRY.map((course) => (
            <button
              key={course.id}
              onClick={() => onNavigate('courses/detail', { id: course.name })}
              className="relative grow flex-1 min-w-max flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-lg overflow-hidden bg-[#18181b] hover:bg-[#27272a] text-white transition-colors duration-200 cursor-pointer border border-zinc-800 dark:border-white/10 group hover:shadow-md"
            >
              {/* Image side layer with high-contrast dark overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={getCourseImage(course.id)} 
                  className="w-full h-full object-cover opacity-20 dark:opacity-30 group-hover:scale-[1.02] transition-transform duration-300 pointer-events-none"
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-zinc-950/85 group-hover:bg-zinc-950/75 transition-opacity" />
              </div>

              {/* Text content */}
              <span className="relative z-10 text-[10px] sm:text-xs font-black text-white dark:text-white uppercase tracking-wider flex items-center leading-none">
                <span className="truncate max-w-[140px] sm:max-w-[240px] lg:max-w-none">{formatCourseName(course.name)}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Right Fading Scroll Indicator */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#070707] to-transparent z-20 flex items-center justify-end pointer-events-none">
            <button
              onClick={() => scroll('right')}
              className="pointer-events-auto mr-2 w-8 h-8 rounded-full bg-white dark:bg-[#18181b] text-gray-700 dark:text-gray-200 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-gray-100 dark:border-white/10 cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

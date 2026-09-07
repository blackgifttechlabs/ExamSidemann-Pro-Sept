
import React, { useEffect, useRef, useState } from 'react';

type DropdownIcon = React.ComponentType<{
  size?: number;
  className?: string;
}>;

interface DropdownItem {
  label: string;
  icon?: DropdownIcon;
  onClick: () => void;
  id?: string;
}

interface LiquidDropdownProps {
  id: string;
  trigger: React.ReactNode;
  items: DropdownItem[];
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
  className?: string;
}

export const LiquidDropdown: React.FC<LiquidDropdownProps> = ({ id, trigger, items, isOpen, onToggle, className = "" }) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'center' | 'left' | 'right'>('center');

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onToggle(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      onToggle(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      
      // dropdown width is 240px (w-60)
      const dropdownWidth = 240;
      
      const centerLeft = rect.left + rect.width / 2 - dropdownWidth / 2;
      const centerRight = centerLeft + dropdownWidth;
      
      if (centerRight > viewportWidth - 16) {
        setPosition('right');
      } else if (centerLeft < 16) {
        setPosition('left');
      } else {
        setPosition('center');
      }
    }
  }, [isOpen]);

  return (
    <div 
        ref={containerRef}
        className={`relative z-50 ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-pointer py-2">
        {trigger}
      </div>

      <div 
        className={`
          absolute top-[85%] w-60 pt-4
          transform transition-all duration-300 ease-in-out origin-top
          ${position === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
          ${position === 'right' ? 'right-0' : ''}
          ${position === 'left' ? 'left-0' : ''}
          ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}
        `}
      >
         {/* The Point Thing (Caret) */}
         <div className={`absolute top-[9px] w-4 h-4 bg-white dark:bg-[#1e1e1e] border-t border-l border-gray-100 dark:border-[#333] transform rotate-45 z-20 transition-all duration-300
            ${position === 'center' ? 'left-1/2 -translate-x-1/2' : ''}
            ${position === 'right' ? 'right-4' : ''}
            ${position === 'left' ? 'left-4' : ''}
         `}></div>

         <div className="relative bg-white dark:bg-[#1e1e1e] rounded-b-2xl rounded-t-lg shadow-2xl border border-gray-100 dark:border-[#333] overflow-hidden p-2 z-10">
           {items.map((item, idx) => (
             <button
               key={idx}
               onClick={(e) => {
                 e.stopPropagation();
                 item.onClick();
                 onToggle(false);
               }}
               className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-3 transition-colors group"
             >
               {item.icon && <item.icon size={18} className="opacity-70 text-gray-400 group-hover:text-purple-500 transition-colors" />}
               <span className="font-medium">{item.label}</span>
             </button>
           ))}
         </div>
      </div>
    </div>
  );
};

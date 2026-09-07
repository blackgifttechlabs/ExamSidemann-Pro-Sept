import React, { useState, useEffect } from "react";
import {
  Home,
  BookOpen,
  Library,
  Video,
  Plus,
  Moon,
  Sun,
  Layout,
  GraduationCap,
  School,
  Building2,
  X,
  ChevronRight,
  User,
  LayoutDashboard,
  Info,
  Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";

interface MobileBottomNavProps {
  onNavigate: (page: string, params?: any) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onNavigate }) => {
  const { user } = useAuth();
  const [showMore, setShowMore] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as "light" | "dark") || "light";
    }
    return "light";
  });

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 50) {
            setIsVisible(false);
            if (showMore) setShowMore(false);
          } else if (currentScrollY < lastScrollY) {
            setIsVisible(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, showMore]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const navItems = [
    { label: "Home", icon: Home, onClick: () => onNavigate("home") },
    { label: "Courses", icon: BookOpen, onClick: () => onNavigate("courses") },
    { label: "Library", icon: Library, onClick: () => onNavigate("library") },
    { label: "Videos", icon: Video, onClick: () => onNavigate("tutorials") },
    { label: "More", icon: Plus, onClick: () => setShowMore(true) },
  ];

  const moreItems = [
    {
      label: "O' Level",
      icon: School,
      onClick: () => onNavigate("courses/overview", { category: "O' Level" }) },
    {
      label: "A' Level",
      icon: GraduationCap,
      onClick: () => onNavigate("courses/overview", { category: "A' Level" }) },
    {
      label: "Polytechnics",
      icon: Building2,
      onClick: () =>
        onNavigate("courses/overview", { category: "Polytechnic" }) },
    {
      label: "Video Tutorials",
      icon: Video,
      onClick: () => onNavigate("tutorials") },
    { label: "About Us", icon: Info, onClick: () => onNavigate("about") },
    { label: "Contact Us", icon: Phone, onClick: () => onNavigate("contact") },
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard") },
  ];

  return (
    <>
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-[100] w-full h-[60px] pointer-events-none transition-all duration-300 ease-in-out translate-y-0 opacity-100`}
      >
        <div className="w-full h-full bg-white dark:bg-black/90 backdrop-blur-3xl border-t border-gray-200/50 dark:border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] flex items-center justify-around px-2 pointer-events-auto">
          {navItems.map((item, idx) => {
            const isMore = item.label === "More";
            return (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center min-w-[50px] group transition-all active:scale-95"
              >
                <div
                  className={`p-1.5 rounded-xl transition-all duration-300 ${isMore && showMore ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-700 dark:text-gray-300"}`}
                >
                  <item.icon
                    size={18}
                    className={`${isMore && showMore ? "rotate-45" : ""} transition-transform duration-300`}
                    strokeWidth={2.5}
                  />
                </div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isMore && showMore ? "text-blue-600 dark:text-blue-400" : "text-gray-500"}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showMore && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMore(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[110] lg:hidden"
            />
            <motion.div
              initial={{ y: 20, x: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, x: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, x: 20, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="fixed bottom-24 right-6 z-[120] w-[210px] lg:hidden h-auto origin-bottom-right"
            >
              <div className="bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/5 rounded-[5px] shadow-[0_8px_40px_rgba(0,0,0,0.12)] shadow-black/20 overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-white/5">
                  <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                    Navigation
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-0.5 p-0.5 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                  >
                    <div
                      className={`p-1.5 rounded-md transition-all ${theme === "light" ? "bg-white shadow-sm text-blue-600 scale-110" : "text-gray-400 shadow-none"}`}
                    >
                      <Sun size={12} strokeWidth={3} />
                    </div>
                    <div
                      className={`p-1.5 rounded-md transition-all ${theme === "dark" ? "bg-gray-800 shadow-sm text-blue-400 scale-110" : "text-gray-400 shadow-none"}`}
                    >
                      <Moon size={12} strokeWidth={3} />
                    </div>
                  </button>
                </div>

                <div className="flex flex-col gap-0.5 p-1">
                  {moreItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        item.onClick();
                        setShowMore(false);
                      }}
                      className="flex items-center gap-3 p-3 w-full hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] text-left group"
                    >
                      <div className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                        <item.icon size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
                        {item.label}
                      </span>
                    </button>
                  ))}

                  <div className="h-px bg-gray-50 dark:bg-white/5 my-0.5 mx-2" />

                  <button
                    onClick={() => {
                      onNavigate("profile");
                      setShowMore(false);
                    }}
                    className="flex items-center gap-3 p-3 w-full hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-all active:scale-[0.98] text-left group"
                  >
                    <div className="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors">
                      <User size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[11px] font-black text-gray-800 dark:text-gray-100 uppercase tracking-tighter">
                      Account Profile
                    </span>
                  </button>

                  <div className="h-0.5" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

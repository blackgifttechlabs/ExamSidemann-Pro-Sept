import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  Sun,
  MoreVertical,
  ChevronDown,
  Menu,
  X,
  Moon,
  LogIn,
  LogOut,
  Layout,
  Settings,
  Users,
  FileText,
  BookOpen,
  Video,
  GraduationCap,
  Library,
  School,
  Building2,
  Eye,
  AudioLines,
  Brain,
  Accessibility,
  ChevronRight,
  Sparkles,
  User,
  LayoutDashboard,
  UserCircle,
  ArrowLeft,
  MessageCircle,
  Home,
  Info,
  Phone,
  Baby,
  FlaskConical,
  Bot,
  Bell } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../services/firebase";
import { subscribeToPendingFriendRequests } from "../../services/notifications";
import { LiquidDropdown } from "./LiquidDropdown";
import { SearchResultRow } from "../../features/resources/SearchResultRow";
import { searchStudyCatalog } from "../../utils/studySearch";
import { CURRICULUM_REGISTRY } from "../../data/constants";

import { LogoutModal } from "../../features/auth/LogoutModal";
import { Toast } from "../ui/Toast";


type Theme = "light" | "dark";

interface SearchResult {
  id: string;
  type: "level" | "subject" | "school_category";
  title: string;
  subtitle: string;
  category?: string;
  icon: React.ElementType;
  route: string;
  params: any;
  levelName?: string;
  levelCategory?: string;
}

interface HeaderProps {
  onNavigate: (page: string, params?: any) => void;
  onLoginRequest?: () => void;
  onMenuToggle?: (isOpen: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onLoginRequest,
  onMenuToggle }) => {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "light";
    }
    return "light";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    highSchool: SearchResult[];
    polytechnic: SearchResult[];
  }>({ highSchool: [], polytechnic: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const [openLiquidMenu, setOpenLiquidMenu] = useState<string | null>(null);
  const openLiquidMenuRef = useRef<string | null>(null);

  // Logout & Toast State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setUnreadNotifsCount(0);
      return;
    }
    const unsub = subscribeToPendingFriendRequests(user.uid, ({ count }) => {
      setUnreadNotifsCount(count);
    });
    return () => unsub();
  }, [user]);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      setIsMenuOpen(false);
      setShowUserDropdown(false);
      setToast({ message: "Successfully logged out", type: "success" });
      window.location.assign('/login?from=logout');
    } catch (error) {
      console.error("Logout failed", error);
      setToast({ message: "Failed to log out", type: "error" });
    }
  };

  useEffect(() => {
    openLiquidMenuRef.current = openLiquidMenu;
  }, [openLiquidMenu]);

  const handleLiquidToggle = (id: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenLiquidMenu(id);
      if (onMenuToggle) onMenuToggle(true);
    } else {
      if (openLiquidMenuRef.current === id) {
        setOpenLiquidMenu(null);
        if (onMenuToggle) onMenuToggle(false);
      }
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("recent_searches");
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  const addToRecent = (query: string) => {
    if (!query.trim()) return;
    const updated = [query, ...recentSearches.filter((q) => q !== query)].slice(
      0,
      5,
    );
    setRecentSearches(updated);
    localStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches");
  };

  const handleNavClick = (page: string, params?: any) => {
    if (searchQuery) addToRecent(searchQuery);
    onNavigate(page, params);
    setIsMenuOpen(false);
    setIsSearchVisible(false);
    setOpenLiquidMenu(null);
    setSearchQuery("");
    setSearchResults({ highSchool: [], polytechnic: [] });
    setShowSearchDropdown(false);
    if (onMenuToggle) onMenuToggle(false);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ highSchool: [], polytechnic: [] });
      setShowSearchDropdown(false);
      return;
    }

    const matches: SearchResult[] = searchStudyCatalog(searchQuery).map(item => ({
      ...item,
      type: item.type === 'Subject' ? 'subject' : 'level',
      subtitle: `${item.levelName} • ${item.levelCategory}`,
      icon: item.type === 'Subject' ? FileText : BookOpen,
    }));
    setSearchResults({
      highSchool: matches.filter(item => item.levelCategory !== 'Polytechnic'),
      polytechnic: matches.filter(item => item.levelCategory === 'Polytechnic'),
    });
    setShowSearchDropdown(true);
  }, [searchQuery]);

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
        if (!searchQuery) setIsSearchVisible(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const resourceItems = [
    {
      label: "Black-Tonet",
      icon: Bot,
      onClick: () => handleNavClick("code-agent") },
    {
      label: "IQ Trainer",
      icon: Brain,
      onClick: () => handleNavClick("iq-trainer") },
    {
      label: "PDF Library",
      icon: Library,
      onClick: () => handleNavClick("library") },
    {
      label: "Syllabus Library",
      icon: BookOpen,
      onClick: () => handleNavClick("syllabi") },
    {
      label: "Past Exam Papers",
      icon: FileText,
      onClick: () => handleNavClick("past-papers") },
    {
      label: "Video Tutorials",
      icon: Video,
      onClick: () => handleNavClick("tutorials") },
    {
      label: "Extra Lessons",
      icon: GraduationCap,
      onClick: () => handleNavClick("extra-lessons") },
  ];

  const moreItems = [
    {
      label: "My Dashboard",
      icon: Layout,
      onClick: () => handleNavClick("dashboard") },
    {
      label: "Student Community",
      icon: Users,
      onClick: () => handleNavClick("communities") },
    {
      label: "Join Whatsapp",
      icon: MessageCircle,
      onClick: () =>
        window.open(
          "https://whatsapp.com/channel/0029Vb34ZR859PwV4EzW1w04",
          "_blank",
        ) },
    {
      label: "Account Settings",
      icon: Settings,
      onClick: () => handleNavClick("settings") },
    ...(user
      ? [
          {
            label: "Sign Out",
            icon: LogOut,
            onClick: () => setShowLogoutModal(true) },
        ]
      : []),
  ];
  const isActivePath = (page: string) => {
    const path = location.pathname.replace(/\/+$/, "") || "/";
    switch (page) {
      case "home":
        return path === "/";
      case "dashboard":
        return path.startsWith("/dashboard");
      case "courses/overview":
        return path.startsWith("/courses");
      case "ecd":
        return path.startsWith("/ecd");
      case "practicals":
        return path.startsWith("/practicals");
      case "iq-trainer":
        return path.startsWith("/iq-trainer");
      case "library":
        return path.startsWith("/library");
      case "notifications":
        return path.startsWith("/notifications");
      case "about":
        return path.startsWith("/about");
      case "contact":
        return path.startsWith("/contact");
      default:
        return false;
    }
  };
  const mobileNavClass = (active = false) =>
    `w-full flex items-center gap-4 rounded-[8px] px-3 py-2 text-left text-[13px] font-medium leading-5 transition-colors ${
      active
        ? "bg-[#e9e9e9] text-black dark:bg-white/[0.12] dark:text-white"
        : "text-black hover:bg-[#e9e9e9] dark:text-slate-100 dark:hover:bg-white/10"
    }`;
  const mobileIconClass = "shrink-0 text-black dark:text-slate-100";

  return (
    <>
      <style>{`
        .input-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .header-search-input {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          outline: none;
          padding: 10px 12px;
          background-color: transparent;
          cursor: pointer;
          transition: all .5s ease-in-out;
        }

        .header-search-input::placeholder {
          color: transparent;
        }

        .header-search-input:focus::placeholder {
          color: rgb(131, 128, 128);
        }

        .header-search-input:focus, .header-search-input:not(:placeholder-shown) {
          background-color: var(--search-bg, #fff);
          border: 1px solid var(--border-hover, #eee);
          box-shadow: 0 4px 20px -2px rgba(0,0,0,0.05);
          width: 290px;
          cursor: text;
          padding: 10px 12px 10px 40px;
        }

        .dark .header-search-input:focus, .dark .header-search-input:not(:placeholder-shown) {
          background-color: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.1);
          --search-bg: #1a1a1a;
        }

        .search-icon-svg {
          position: absolute;
          left: 0;
          top: 0;
          height: 40px;
          width: 40px;
          background-color: #fff;
          border-radius: 10px;
          z-index: 1;
          fill: #1b365d;
          border: 1px solid #ddd;
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .dark .search-icon-svg {
          background-color: #0a0a0a;
          border: 1px solid rgba(255,255,255,0.1);
          fill: #1b365d;
        }

        .header-search-input:hover + .search-icon-svg {
          transform: rotate(360deg);
        }

        .header-search-input:focus + .search-icon-svg, .header-search-input:not(:placeholder-shown) + .search-icon-svg {
          z-index: 2;
          background-color: transparent;
          border: none;
        }
      `}</style>
      <header className="block border-b border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md fixed top-0 w-full z-[60] transition-all shadow-sm">
        <div className="flex items-center justify-between px-4 py-2 md:px-6 lg:px-8 h-16 relative z-[70]">
          {/* Left Section: Nav (Desktop) / Search Toggle (Mobile) */}
          <div className="flex items-center gap-4 transition-all duration-500">
            <button
              onClick={() => onNavigate("home")}
              className="hidden lg:flex items-center focus:outline-none shrink-0 group z-[80]"
            >
              <img
                src="https://i.ibb.co/HDtTcsP1/LOGObg.png"
                alt="Exam Sidemann"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 block dark:hidden"
              />
              <img
                src="https://i.ibb.co/SwGTG6Wt/Gemini-Generated-Image-o9ijg1o9ijg1o9ij-removebg-preview.png"
                alt="Exam Sidemann"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105 hidden dark:block"
              />
            </button>

            {/* Search Icon for Mobile */}
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all"
              onClick={() => setIsMobileSearchActive(true)}
            >
              <Search size={22} strokeWidth={2.5} />
            </button>

            <nav className="hidden lg:flex flex-nowrap items-center gap-3 ml-4 xl:gap-5 2xl:gap-6">
              <button
                onClick={() => handleNavClick("home")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick("courses/overview")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                Class Notes
              </button>
              <button
                onClick={() => handleNavClick("ecd")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                ECD
              </button>
              <button
                onClick={() => handleNavClick("practicals")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                Practicals
              </button>
              <button
                onClick={() => handleNavClick("iq-trainer")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                <span className="text-violet-600 dark:text-violet-400">IQ</span> Trainer
              </button>

              <LiquidDropdown
                id="resources"
                trigger={
                  <span className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold flex items-center gap-1 transition-all cursor-pointer text-sm">
                    Resources <ChevronDown size={14} />
                  </span>
                }
                items={resourceItems}
                isOpen={openLiquidMenu === "resources"}
                onToggle={(v) => handleLiquidToggle("resources", v)}
              />
              <button
                onClick={() => handleNavClick("chat")}
                className="whitespace-nowrap text-sm font-bold text-violet-600 transition-colors hover:text-violet-800 dark:text-violet-300"
              >
                Sidemann AI
              </button>
              <button
                onClick={() => handleNavClick("dashboard")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className="whitespace-nowrap text-gray-600 dark:text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 font-bold transition-all text-sm outline-none"
              >
                Contact Us
              </button>
            </nav>
          </div>

          {/* Center Section: Logo Only on Mobile */}
          <div className="lg:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-[80]">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center focus:outline-none"
            >
              <img
                src="https://i.ibb.co/HDtTcsP1/LOGObg.png"
                alt="Exam Sidemann"
                className="h-9 w-auto object-contain block dark:hidden"
              />
              <img
                src="https://i.ibb.co/SwGTG6Wt/Gemini-Generated-Image-o9ijg1o9ijg1o9ij-removebg-preview.png"
                alt="Exam Sidemann"
                className="h-7 w-auto object-contain hidden dark:block"
              />
            </button>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            {/* Search Toggle for Desktop */}
            <div
              ref={searchRef}
              className="hidden md:flex relative items-center"
            >
              <div className="input-container">
                <input
                  placeholder="Search subjects or levels..."
                  className="header-search-input text-sm text-gray-800 dark:text-white"
                  name="text"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && searchQuery.trim()) {
                      handleNavClick('search', { query: searchQuery.trim() });
                      setIsMobileSearchActive(false);
                    }
                  }}
                  onFocus={() => {
                    setIsSearchVisible(true);
                    if (searchQuery) setShowSearchDropdown(true);
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="search-icon-svg"
                >
                  <g strokeWidth="0" id="SVGRepo_bgCarrier"></g>
                  <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    id="SVGRepo_tracerCarrier"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <rect fill="transparent" width="24" height="24"></rect>
                    <path
                      d="M7.25007 2.38782C8.54878 2.0992 10.1243 2 12 2C13.8757 2 15.4512 2.0992 16.7499 2.38782C18.06 2.67897 19.1488 3.176 19.9864 4.01358C20.824 4.85116 21.321 5.94002 21.6122 7.25007C21.9008 8.54878 22 10.1243 22 12C22 13.8757 21.9008 15.4512 21.6122 16.7499C21.321 18.06 20.824 19.1488 19.9864 19.9864C19.1488 20.824 18.06 21.321 16.7499 21.6122C15.4512 21.9008 13.8757 22 12 22C10.1243 22 8.54878 21.9008 7.25007 21.6122C5.94002 21.321 4.85116 20.824 4.01358 19.9864C3.176 19.1488 2.67897 18.06 2.38782 16.7499C2.0992 15.4512 2 13.8757 2 12C2 10.1243 2.0992 8.54878 2.38782 7.25007C2.67897 5.94002 3.176 4.85116 4.01358 4.01358C4.85116 3.176 5.94002 2.67897 7.25007 2.38782ZM9 11.5C9 10.1193 10.1193 9 11.5 9C12.8807 9 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5ZM11.5 7C9.01472 7 7 9.01472 7 11.5C7 13.9853 9.01472 16 11.5 16C12.3805 16 13.202 15.7471 13.8957 15.31L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0976 16.3166 17.0976 15.6834 16.7071 15.2929L15.31 13.8957C15.7471 13.202 16 12.3805 16 11.5C16 9.01472 13.9853 7 11.5 7Z"
                      clipRule="evenodd"
                      fillRule="evenodd"
                    ></path>
                  </g>
                </svg>
              </div>

              {showSearchDropdown && (
                <div className="fixed top-16 left-0 right-0 bg-slate-50/[0.98] dark:bg-[#0a0a0a]/[0.98] border-b border-slate-200 dark:border-white/10 shadow-2xl overflow-y-auto max-h-[calc(100vh_-_var(--app-header-h))] animate-dropdown-reveal z-[100] origin-top hide-scrollbar backdrop-blur-xl">
                  <div className="px-5 py-6 sm:px-10 lg:px-[100px]">
                    <button onClick={() => handleNavClick('search', { query: searchQuery.trim() })} className="mb-5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white">View all search results →</button>
                    {searchResults.highSchool.length > 0 ||
                    searchResults.polytechnic.length > 0 ? (
                      <div>
                        <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                          <div>
                            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                              Search results
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                              Select a subject or course level
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-extrabold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            {searchResults.highSchool.length +
                              searchResults.polytechnic.length}{" "}
                            {searchResults.highSchool.length +
                              searchResults.polytechnic.length ===
                            1
                              ? "result"
                              : "results"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                          {[
                            {
                              id: "hs",
                              label: "High school",
                              icon: School,
                              results: searchResults.highSchool },
                            {
                              id: "poly",
                              label: "Polytechnic",
                              icon: Building2,
                              results: searchResults.polytechnic },
                          ]
                            .filter((category) => category.results.length > 0)
                            .map((category) => (
                              <section key={category.id}>
                                <div className="mb-3 flex items-center gap-2">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                    <category.icon size={14} />
                                  </span>
                                  <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                                    {category.label}
                                  </h3>
                                  <span className="text-[10px] font-semibold text-slate-400">
                                    {category.results.length}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
                                  {category.results.map((result) => (
                                    <SearchResultRow
                                      key={result.id}
                                      title={result.title}
                                      levelName={result.levelName}
                                      levelCategory={result.levelCategory}
                                      resultType={result.type}
                                      onSelect={() =>
                                        handleNavClick(
                                          result.route,
                                          result.params,
                                        )
                                      }
                                    />
                                  ))}
                                </div>
                              </section>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <Search size={28} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          No results for “{searchQuery}”
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Try a subject or level name.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className="hidden md:flex p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all group"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? (
                <Moon size={20} className="text-[#1b365d] dark:text-blue-400" />
              ) : (
                <Sun
                  size={20}
                  className="text-gray-600 dark:text-gray-400 group-hover:text-[#1b365d] dark:group-hover:text-blue-400"
                />
              )}
            </button>

            {/* More dots strictly for desktop */}
            <div className="hidden lg:block">
              <LiquidDropdown
                id="more"
                trigger={
                  <button className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                    <MoreVertical
                      size={20}
                      className="text-gray-600 dark:text-gray-400"
                    />
                  </button>
                }
                items={moreItems}
                isOpen={openLiquidMenu === "more"}
                onToggle={(v) => handleLiquidToggle("more", v)}
                className="right-0"
              />
            </div>

            {user ? (
              <div className="hidden md:block relative" ref={userDropdownRef}>
                <button
                  className="ml-1 w-9 h-9 rounded-full border-2 border-[#1b365d] dark:border-blue-400 overflow-hidden flex items-center justify-center text-sm font-bold bg-[#1b365d]/10 shadow-md shrink-0 transition-transform hover:scale-105 active:scale-95"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                >
                  {userProfile?.photoURL || user.photoURL ? (
                    <img
                      src={userProfile?.photoURL || user.photoURL}
                      alt="P"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[#1b365d] dark:text-blue-400">
                      {userProfile?.firstName?.[0] || "U"}
                    </span>
                  )}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden animate-dropdown-reveal z-[100]">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-2 border-[#1b365d] dark:border-blue-400 overflow-hidden flex items-center justify-center text-lg font-bold bg-[#1b365d]/10 dark:bg-blue-400/10 shrink-0">
                          {userProfile?.photoURL || user.photoURL ? (
                            <img
                              src={userProfile?.photoURL || user.photoURL}
                              alt="P"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[#1b365d] dark:text-blue-400">
                              {userProfile?.firstName?.[0] || "U"}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {userProfile?.firstName} {userProfile?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          handleNavClick("profile");
                          setShowUserDropdown(false);
                        }}
                        className="w-full mt-4 py-2 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        Manage your Account
                      </button>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          handleNavClick("profile");
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <User size={18} className="text-gray-400" />
                        <span>View Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick("dashboard");
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Layout size={18} className="text-gray-400" />
                        <span>View Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          handleNavClick("settings");
                          setShowUserDropdown(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Settings size={18} className="text-gray-400" />
                        <span>Settings</span>
                      </button>
                    </div>

                    <div className="p-2 border-t border-gray-100 dark:border-white/5">
                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#1b365d] dark:text-blue-400 hover:bg-[#1b365d]/10 dark:hover:bg-blue-400/10 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onLoginRequest?.()}
                className="hidden md:flex ml-1 p-2.5 rounded-full bg-[#1b365d] dark:bg-blue-500 text-white hover:bg-[#122543] dark:hover:bg-blue-600 transition-all items-center justify-center shadow-md hover:shadow-lg shrink-0"
                title="Sign In"
              >
                <LogIn size={20} />
              </button>
            )}

            {/* Mobile Menu Button - shows user's profile icon when logged in */}
            {user ? (
              <button
                className="lg:hidden relative ml-1 w-9 h-9 rounded-full border-2 border-[#1b365d] dark:border-blue-400 overflow-hidden flex items-center justify-center text-sm font-bold bg-[#1b365d]/10 shadow-sm shrink-0 transition-transform active:scale-95"
                onClick={() => setIsMenuOpen(true)}
                title="Open menu"
                aria-label="Open menu"
              >
                {userProfile?.photoURL || user.photoURL ? (
                  <img
                    src={userProfile?.photoURL || user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#1b365d] dark:text-blue-400 font-black text-xs">
                    {userProfile?.firstName?.[0] || "U"}
                  </span>
                )}
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ef2b3f] px-1 text-[9px] font-black text-white ring-2 ring-white dark:ring-[#0a0a0a]">
                    {unreadNotifsCount > 9 ? "9+" : unreadNotifsCount}
                  </span>
                )}
              </button>
            ) : (
              <button
                className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg"
                onClick={() => setIsMenuOpen(true)}
                title="Open navigation menu"
                aria-label="Open navigation menu"
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchActive && (
        <div className="fixed inset-0 z-[120] bg-white dark:bg-[#0a0a0a] flex flex-col animate-dropdown-reveal origin-top">
          <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-100 dark:border-white/5">
            <button
              onClick={() => setIsMobileSearchActive(false)}
              className="p-2 text-gray-500"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="Search subjects or levels..."
                className="w-full py-3 bg-transparent text-gray-900 dark:text-white text-lg outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && searchQuery.trim()) {
                      handleNavClick('search', { query: searchQuery.trim() });
                      setIsMobileSearchActive(false);
                    }
                  }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            {searchQuery.trim() && <button onClick={() => { handleNavClick('search', { query: searchQuery.trim() }); setIsMobileSearchActive(false); }} className="mb-5 w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white">View all search results →</button>}
            {searchQuery ? (
              searchResults.highSchool.length > 0 ||
              searchResults.polytechnic.length > 0 ? (
                <div className="space-y-6">
                  {[
                    {
                      id: "mobile-hs",
                      label: "High school",
                      results: searchResults.highSchool },
                    {
                      id: "mobile-poly",
                      label: "Polytechnic",
                      results: searchResults.polytechnic },
                  ]
                    .filter((category) => category.results.length > 0)
                    .map((category) => (
                      <section key={category.id}>
                        <div className="mb-2 flex items-center justify-between px-1">
                          <h3 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                            {category.label}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400">
                            {category.results.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {category.results.map((result) => (
                            <SearchResultRow
                              key={result.id}
                              title={result.title}
                              levelName={result.levelName}
                              levelCategory={result.levelCategory}
                              resultType={result.type}
                              onSelect={() => {
                                handleNavClick(result.route, result.params);
                                setIsMobileSearchActive(false);
                              }}
                            />
                          ))}
                        </div>
                      </section>
                    ))}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <Search size={28} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    No results for “{searchQuery}”
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try a subject or level name.
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-10 py-6">
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        Recent History
                      </p>
                      <button
                        onClick={clearRecent}
                        className="text-[10px] font-bold text-[#1b365d] dark:text-blue-400 uppercase tracking-widest"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 px-2">
                      {recentSearches.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setSearchQuery(s)}
                          className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300 border border-transparent hover:border-[#1b365d]/50 dark:hover:border-blue-400/50 transition-all"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2 flex items-center gap-2">
                    <Sparkles
                      size={12}
                      className="text-[#1b365d] dark:text-blue-400"
                    />{" "}
                    Trending Resources
                  </p>
                  <div className="grid grid-cols-2 gap-3 px-2">
                    {resourceItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          item.onClick();
                          setIsMobileSearchActive(false);
                        }}
                        className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-white/10 hover:border-[#1b365d]/30 dark:hover:border-blue-400/30 transition-all shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#1b365d]/10 dark:bg-blue-900/20 flex items-center justify-center text-[#1b365d] dark:text-blue-400 shrink-0">
                          <item.icon size={16} />
                        </div>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 px-2">
                    Popular Levels
                  </p>
                  <div className="space-y-1">
                    {CURRICULUM_REGISTRY.slice(0, 4).map((lvl, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          handleNavClick("courses/overview", {
                            category: lvl.category,
                            level: lvl.name })
                        }
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#1b365d] dark:group-hover:text-blue-400 transition-colors">
                          <GraduationCap size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                            {lvl.name}
                          </p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            {lvl.category}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all ${isMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/25 transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div
          className={`absolute top-0 bottom-0 left-0 w-[212px] bg-white dark:bg-[#0d0f14] shadow-2xl flex flex-col transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center gap-2 border-b border-slate-200/70 p-3 dark:border-white/[0.06]">
            {user ? (
              <button
                onClick={() => handleNavClick("profile")}
                className="flex min-w-0 flex-1 items-center gap-2 rounded-[8px] px-1 py-1 text-left transition-colors hover:bg-[#e9e9e9] dark:hover:bg-white/10"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 overflow-hidden flex items-center justify-center text-xs font-semibold bg-slate-100 shrink-0 dark:bg-white/10">
                  {userProfile?.photoURL || user.photoURL ? (
                    <img
                      src={userProfile?.photoURL || user.photoURL}
                      alt="P"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-black dark:text-slate-100">
                      {userProfile?.firstName?.[0] || "U"}
                    </span>
                  )}
                </div>
                <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-black dark:text-white">
                  {userProfile?.firstName} {userProfile?.lastName}
                </p>
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginRequest?.();
                  setIsMenuOpen(false);
                }}
                className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#e9e9e9] px-3 py-2 text-[13px] font-medium text-black dark:bg-white/10 dark:text-white"
              >
                <LogIn size={16} /> Sign In
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="shrink-0 p-2 rounded-[8px] hover:bg-[#e9e9e9] dark:hover:bg-white/10 text-black dark:text-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 text-left">
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick("home")}
                className={mobileNavClass(isActivePath("home"))}
              >
                <Home size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileSearchActive(true);
                  setIsMenuOpen(false);
                }}
                className={mobileNavClass(isMobileSearchActive)}
              >
                <Search size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Search</span>
              </button>
              <button
                onClick={() => handleNavClick("courses/overview")}
                className={mobileNavClass(isActivePath("courses/overview"))}
              >
                <BookOpen size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Class Notes</span>
              </button>
              <button
                onClick={() => handleNavClick("ecd")}
                className={mobileNavClass(isActivePath("ecd"))}
              >
                <Baby size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>ECD</span>
              </button>
              <button
                onClick={() => handleNavClick("practicals")}
                className={mobileNavClass(isActivePath("practicals"))}
              >
                <FlaskConical size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Practicals</span>
              </button>
              <button
                onClick={() => handleNavClick("iq-trainer")}
                className={mobileNavClass(isActivePath("iq-trainer"))}
              >
                <Brain size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>IQ Trainer</span>
              </button>

              <button
                onClick={() => handleNavClick("library")}
                className={mobileNavClass(isActivePath("library"))}
              >
                <Library size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Library</span>
              </button>
              {user && (
                <button
                  onClick={() => handleNavClick("notifications")}
                  className={mobileNavClass(isActivePath("notifications"))}
                >
                  <Bell size={16} strokeWidth={1.8} className={mobileIconClass} />
                  <span>Notifications</span>
                  {unreadNotifsCount > 0 && (
                    <span className="ml-auto flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#ef2b3f] px-1 text-[9px] font-semibold text-white">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setMobileResourcesOpen((open) => !open)}
                className={mobileNavClass(mobileResourcesOpen)}
              >
                <Sparkles size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Explore</span>
                <ChevronDown
                  size={15}
                  className={`ml-auto text-black transition-transform dark:text-slate-100 ${mobileResourcesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {mobileResourcesOpen && (
                <div className="ml-4 space-y-1 border-l border-slate-200 pl-3 dark:border-white/10">
                  {resourceItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 rounded-[8px] px-3 py-2 text-[13px] font-medium text-black transition-colors hover:bg-[#e9e9e9] dark:text-slate-100 dark:hover:bg-white/10"
                    >
                      <item.icon size={15} strokeWidth={1.8} className={mobileIconClass} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleNavClick("dashboard")}
                className={mobileNavClass(isActivePath("dashboard"))}
              >
                <LayoutDashboard size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => handleNavClick("about")}
                className={mobileNavClass(isActivePath("about"))}
              >
                <Info size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>About Us</span>
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className={mobileNavClass(isActivePath("contact"))}
              >
                <Phone size={16} strokeWidth={1.8} className={mobileIconClass} />
                <span>Contact Us</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200/70 p-3 dark:border-white/[0.06]">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-[13px] font-medium text-black transition-colors hover:bg-[#e9e9e9] dark:text-white dark:hover:bg-white/10"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "dark" ? (
                <Moon size={16} strokeWidth={1.8} className={mobileIconClass} />
              ) : (
                <Sun size={16} strokeWidth={1.8} className={mobileIconClass} />
              )}
              <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            </button>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

import React, { useEffect, useRef, useState } from "react";
import {
  Facebook,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { openConsentPreferences } from "../../features/privacy/privacyConsent";

/** Taps on the copyright year needed to open the admin area. */
const ADMIN_TAP_COUNT = 5;
/** Taps further apart than this start the count again. */
const ADMIN_TAP_WINDOW_MS = 1500;

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  /*
   * Five quick taps on "© <year>" opens the admin area. It is a shortcut, not a
   * lock: /admin still checks the account behind it, so a curious visitor who
   * finds this lands straight back on the home page.
   */
  const [adminTaps, setAdminTaps] = useState(0);
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    },
    [],
  );

  const handleCopyrightTap = () => {
    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);

    const taps = adminTaps + 1;
    if (taps >= ADMIN_TAP_COUNT) {
      setAdminTaps(0);
      navigate("/admin");
      return;
    }

    setAdminTaps(taps);
    tapResetTimer.current = setTimeout(() => setAdminTaps(0), ADMIN_TAP_WINDOW_MS);
  };

  return (
    <footer className="bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-white/5 pt-16 pb-8 transition-colors duration-300 w-full relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Logo and Description */}
          <div className="md:col-span-4 text-left">
            <Link
              to="/"
              className="flex items-center focus:outline-none mb-6"
            >
              <img
                src="https://i.ibb.co/HDtTcsP1/LOGObg.png"
                alt="Exam Sidemann"
                className="h-10 w-auto object-contain block dark:hidden"
              />
              <img
                src="https://i.ibb.co/SwGTG6Wt/Gemini-Generated-Image-o9ijg1o9ijg1o9ij-removebg-preview.png"
                alt="Exam Sidemann"
                className="h-8 w-auto object-contain hidden dark:block"
              />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm leading-relaxed font-medium">
              An independent learning platform for Zimbabwean students, with
              study resources, AI-assisted tools and student communities since
              2025.
            </p>
            <p className="max-w-sm text-xs font-medium leading-relaxed text-gray-400 dark:text-gray-500">
              Exam Sidemann is not affiliated with or endorsed by ZIMSEC, HEXCO,
              the Ministry of Primary and Secondary Education, or any school
              listed on this site. Their names are used only to identify relevant
              curricula, qualifications and institutions.
            </p>
          </div>

          {/* Links Sections - 2 columns on mobile */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 text-left">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">
                Academic
              </h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <li>
                  <Link
                    to="/courses/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    ZJC Certificate
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    O' Level Exam
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    A' Level Mastery
                  </Link>
                </li>
                <li>
                  <Link
                    to="/courses/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Polytechnic NC/ND
                  </Link>
                </li>
                <li>
                  <Link
                    to="/practicals/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Practical Labs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">
                Resources
              </h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <li>
                  <Link
                    to="/library/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Digital Library
                  </Link>
                </li>
                <li>
                  <Link
                    to="/syllabi/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Syllabus Resources
                  </Link>
                </li>
                <li>
                  <Link
                    to="/past-papers/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Past Papers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/tutorials/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Video Tutorials
                  </Link>
                </li>
                <li>
                  <Link
                    to="/extra-lessons/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Extra Lessons
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">
                Community
              </h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => onNavigate?.("dashboard")}
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Student Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.("communities")}
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Communities
                  </button>
                </li>
                <li>
                  <a
                    href="https://discord.gg/Mbgbnc7HQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#5865F2] transition-colors"
                  >
                    Join Discord
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.("messages")}
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Messages
                  </button>
                </li>
                <li>
                  <Link
                    to="/feedback/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    to="/news/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Latest News
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-6">
                Support
              </h4>
              <ul className="space-y-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                <li>
                  <Link
                    to="/about/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={openConsentPreferences}
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                    aria-label="Open privacy and cookie choices"
                  >
                    Privacy choices
                  </button>
                </li>
                <li>
                  <Link
                    to="/terms/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/editorial/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Editorial Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/credits/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Licences
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate?.("settings")}
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Settings
                  </button>
                </li>
                <li>
                  <Link
                    to="/feedback/"
                    className="hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"
                  >
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-white/5 pt-12 pb-8">
          <div className="flex flex-col items-center gap-8">
            {/* Social Icons */}
            <div className="flex gap-6">
              <a
                href="https://whatsapp.com/channel/0029Vb34ZR859PwV4EzW1w04"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-all transform hover:scale-110"
                title="Join WhatsApp Channel"
              >
                <img src="https://i.ibb.co/pHk4bmy/whatsapp.png" alt="WhatsApp" width={20} height={20} className="h-5 w-5 object-contain" />
              </a>
              <a
                href="https://www.facebook.com/share/1BRk5FHizj/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-all transform hover:scale-110"
                title="Visit Facebook Page"
              >
                <img src="https://i.ibb.co/1YmcCwTn/facebook.png" alt="Facebook" width={20} height={20} className="h-5 w-5 object-contain" />
              </a>
              <a
                href="https://discord.gg/Mbgbnc7HQ"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-transform hover:scale-110"
                title="Join Discord Community"
                aria-label="Join Discord Community"
              >
                <img src="/images/social/discord.png" alt="" width={20} height={20} className="h-5 w-5 object-contain" />
              </a>
            </div>

            <div className="flex flex-col items-center gap-2 text-xs font-medium text-gray-400">
              <p className="text-center">
                Original site content{" "}
                <span
                  onClick={handleCopyrightTap}
                  className="inline-block select-none cursor-default transition-transform duration-150"
                  style={{
                    transform: adminTaps >= 2 ? `scale(${1 + adminTaps * 0.05})` : undefined,
                  }}
                >
                  &copy; {currentYear}
                </span>{" "}
                Exam Sidemann. Third-party materials remain the property of
                their respective owners.
              </p>
            </div>

            {/* Blackgift Tech Labs Branding */}
            <div className="pt-8 border-t border-gray-100 dark:border-white/5 w-full flex justify-center">
              <a
                href="https://blackgiftlabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-[10px] font-medium text-gray-400 group-hover:text-[#1b365d] dark:group-hover:text-blue-400 transition-colors">
                  Powered by
                </span>
                <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-purple-600 transition-colors group-hover:text-purple-500 dark:text-purple-400 dark:group-hover:text-purple-300">
                  BLACKGIFT TECH LABS
                  <ExternalLink
                    size={12}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

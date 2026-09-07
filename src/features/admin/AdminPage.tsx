import React, { useState, useEffect } from 'react';
import {
    School, Users, FileStack, Newspaper, Calendar, MessageSquare,
    LineChart, Menu, X, ArrowLeft, TableProperties, GraduationCap, Settings2, FlaskConical, MapPinned, Trophy, Bot
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

// Modular Sub-components
import { SchoolManager } from './SchoolManager';
import { ResourceManager } from './ResourceManager';
import { UserDatabase } from './UserDatabase';
import { NewsManager } from './NewsManager';
import { CalendarManager } from './CalendarManager';
import { CommentsManager } from './CommentsManager';
import { AdminNotifications } from './AdminNotifications';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { TrafficPages } from './TrafficPages';
import { TeacherManager } from './TeacherManager';
import { ConfigurationManager } from './ConfigurationManager';
import { ExperimentsAnalytics } from './ExperimentsAnalytics';
import { TrafficPageDetails } from './TrafficPageDetails';
import { VisitorMap } from './VisitorMap';
import { GlobalRankingManager } from './GlobalRankingManager';
import { ChatTrackerManager } from './ChatTrackerManager';
import { AdminUserChatView } from './AdminUserChatView';
import type { PageStats } from '../../services/analytics';
import type { UserChatProfile } from '../../services/adminChatTracker';
import { warmAdminAnalyticsForOffline } from '../../services/offlineData';

type AdminView = 'analytics' | 'traffic' | 'traffic-detail' | 'maps' | 'experiments' | 'resources' | 'users' | 'teachers' | 'ai-chats' | 'ai-chat-detail' | 'schools' | 'news' | 'calendar' | 'comments' | 'configuration' | 'global-ranking';

interface AcademicLevel {
    name: string;
    category: any;
}

const NAV_ITEMS: { id: AdminView; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }[] = [
    { id: 'analytics', icon: LineChart, label: 'Analytics' },
    { id: 'traffic', icon: TableProperties, label: 'Pages by Traffic' },
    { id: 'maps', icon: MapPinned, label: 'Maps' },
    { id: 'experiments', icon: FlaskConical, label: 'Experiments' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'ai-chats', icon: Bot, label: 'AI Chats' },
    { id: 'teachers', icon: GraduationCap, label: 'Teachers' },
    { id: 'global-ranking', icon: Trophy, label: 'Dedicated Learners' },
    { id: 'news', icon: Newspaper, label: 'News/Blog' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' },
    { id: 'schools', icon: School, label: 'Schools' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'resources', icon: FileStack, label: 'Resources' },
    { id: 'configuration', icon: Settings2, label: 'Configuration' }
];

export const AdminPage: React.FC = () => {
    const [activeView, setActiveView] = useState<AdminView>('analytics');
    const [allCourses, setAllCourses] = useState<AcademicLevel[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTrafficPage, setSelectedTrafficPage] = useState<Pick<PageStats, 'path' | 'title'> | null>(null);
    const [selectedChatUser, setSelectedChatUser] = useState<UserChatProfile | null>(null);

    useEffect(() => {
        const unsub = onSnapshot(
            doc(db, 'config', 'academic_hierarchy'),
            (snap) => {
                if (snap.exists()) setAllCourses(snap.data().list || []);
            },
            (error) => console.warn('Admin course navigation could not be loaded', error)
        );
        void warmAdminAnalyticsForOffline();
        return () => unsub();
    }, []);

    // A new screen starts at its own top, not halfway down the previous one.
    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [activeView]);

    /*
     * Closing lives here rather than in the effect above: picking the screen you
     * are already on does not change `activeView`, and a drawer that stays open
     * after a tap reads as a broken button.
     */
    const openView = (view: AdminView) => {
        setActiveView(view);
        setDrawerOpen(false);
    };

    // A drawer left open behind a scrolled page is a trap on a phone.
    useEffect(() => {
        if (!drawerOpen) return;
        const close = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setDrawerOpen(false);
        };
        window.addEventListener('keydown', close);
        return () => window.removeEventListener('keydown', close);
    }, [drawerOpen]);

    const activeItem = NAV_ITEMS.find((item) => item.id === activeView);
    const activeTitle = activeView === 'traffic-detail'
        ? 'Traffic details'
        : activeView === 'ai-chat-detail'
            ? 'AI chat history'
            : activeItem?.label ?? 'Admin';

    const renderContent = () => {
        switch(activeView) {
            case 'analytics': return <AnalyticsDashboard />;
            case 'traffic': return <TrafficPages onOpenDetails={(page) => {
                setSelectedTrafficPage({ path: page.path, title: page.title });
                openView('traffic-detail');
            }} />;
            case 'traffic-detail': return selectedTrafficPage
                ? <TrafficPageDetails path={selectedTrafficPage.path} title={selectedTrafficPage.title} onBack={() => openView('traffic')} />
                : <TrafficPages onOpenDetails={(page) => {
                    setSelectedTrafficPage({ path: page.path, title: page.title });
                    openView('traffic-detail');
                }} />;
            case 'maps': return <VisitorMap />;
            case 'experiments': return <ExperimentsAnalytics />;
            case 'news': return <NewsManager />;
            case 'comments': return <CommentsManager />;
            case 'schools': return <SchoolManager />;
            case 'calendar': return <CalendarManager />;
            case 'resources': return <ResourceManager allCourses={allCourses} />;
            case 'users': return <UserDatabase />;
            case 'ai-chats': return <ChatTrackerManager onOpenUser={(profile) => {
                setSelectedChatUser(profile);
                openView('ai-chat-detail');
            }} />;
            case 'ai-chat-detail': return selectedChatUser
                ? <AdminUserChatView
                    userId={selectedChatUser.userId}
                    userName={selectedChatUser.name}
                    userEmail={selectedChatUser.email}
                    onBack={() => openView('ai-chats')}
                />
                : <ChatTrackerManager onOpenUser={(profile) => {
                    setSelectedChatUser(profile);
                    openView('ai-chat-detail');
                }} />;
            case 'teachers': return <TeacherManager />;
            case 'global-ranking': return <GlobalRankingManager />;
            case 'configuration': return <ConfigurationManager />;
            default: return <AnalyticsDashboard />;
        }
    };

    /**
     * One nav list, rendered twice: as the standing rail on a desktop and inside
     * the drawer on a phone. `expanded` is what tells the rail whether it is the
     * icon-only strip (tablet) or the full list.
     */
    const NavList: React.FC<{ expanded: boolean }> = ({ expanded }) => (
        <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map(item => {
                const isActive = activeView === item.id
                    || (activeView === 'traffic-detail' && item.id === 'traffic')
                    || (activeView === 'ai-chat-detail' && item.id === 'ai-chats');
                return (
                    <button
                        key={item.id}
                        onClick={() => openView(item.id)}
                        title={expanded ? undefined : item.label}
                        aria-current={isActive ? 'page' : undefined}
                        className={`group relative flex items-center gap-3 transition-colors ${
                            expanded ? 'px-5 py-3' : 'px-0 py-3 justify-center'
                        } ${
                            isActive
                                ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {isActive && (
                            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-600" />
                        )}
                        <item.icon size={19} className="shrink-0" />
                        {expanded && (
                            <span className="text-[13px] font-semibold tracking-tight whitespace-nowrap">
                                {item.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );

    const RailHeader: React.FC<{ expanded: boolean }> = ({ expanded }) => (
        <div className={`flex items-center gap-3 h-16 border-b border-gray-100 dark:border-white/5 ${expanded ? 'px-5' : 'justify-center'}`}>
            <img
                src="/app-icon-192.png"
                alt="Exam Sidemann logo"
                className="w-9 h-9 rounded-xl object-cover shrink-0"
            />
            {expanded && (
                <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white leading-tight">
                        Admin
                    </p>
                    <p className="text-[10px] text-gray-400 leading-tight">Exam Sidemann</p>
                </div>
            )}
        </div>
    );

    /*
     * The sidebar is `fixed`, not `sticky`: it owns the full height of the
     * viewport from the very top edge, square-cornered and flush, and the screen
     * beside it is pushed over by a matching margin. `/admin` hides the site
     * header (see App.tsx) so nothing sits above it.
     */
    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] transition-colors duration-300 text-left">

            {/* ----------------------------------------------- standing sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 flex-col bg-white dark:bg-[#111] border-r border-gray-200 dark:border-white/10 w-[68px] lg:w-[240px]">
                <div className="hidden lg:block">
                    <RailHeader expanded />
                </div>
                <div className="lg:hidden">
                    <RailHeader expanded={false} />
                </div>

                <div className="hidden lg:block flex-1 overflow-y-auto custom-scrollbar py-3">
                    <NavList expanded />
                </div>
                <div className="lg:hidden flex-1 overflow-y-auto custom-scrollbar py-3">
                    <NavList expanded={false} />
                </div>

                <div className="border-t border-gray-100 dark:border-white/5 p-3 flex flex-col gap-2 items-center lg:items-stretch">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-2 lg:px-3 py-2 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        title="Back to site"
                    >
                        <ArrowLeft size={18} className="shrink-0" />
                        <span className="hidden lg:inline text-[13px] font-semibold">Back to site</span>
                    </Link>
                </div>
            </aside>

            {/* -------------------------------------------------- the screen */}
            <div className="md:pl-[68px] lg:pl-[240px]">
                {/* One bar across the top of the content, level with the rail head. */}
                <header className="sticky top-0 z-40 flex items-center justify-between gap-3 h-16 px-4 md:px-8 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur border-b border-gray-200 dark:border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setDrawerOpen(true)}
                            className="md:hidden w-9 h-9 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-300"
                            aria-label="Open menu"
                        >
                            <Menu size={18} />
                        </button>
                        <h1 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white truncate">
                            {activeTitle}
                        </h1>
                    </div>
                    <AdminNotifications />
                </header>

                <main className={activeView === 'maps' ? 'p-0' : 'p-4 md:p-6 lg:p-8'}>
                    {renderContent()}
                </main>
            </div>

            {/* -------------------------------------------------- phone drawer */}
            {drawerOpen && (
                <div className="md:hidden fixed inset-0 z-[60] flex">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setDrawerOpen(false)}
                    />
                    <div className="relative w-[250px] max-w-[80vw] h-full bg-white dark:bg-[#111] flex flex-col">
                        <div className="flex items-center justify-between pr-2">
                            <div className="flex-1">
                                <RailHeader expanded />
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
                                aria-label="Close menu"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar py-3">
                            <NavList expanded />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

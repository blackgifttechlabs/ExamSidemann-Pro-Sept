
import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Plus, Filter, ChevronRight, BookOpen, 
  FileText, CheckCircle, Clock, Trash2, Edit, Save, 
  BrainCircuit, Layout, UserPlus, X, GraduationCap, Settings, School, ChevronDown, Copy, Hash, DollarSign, Loader2, ArrowRight, ArrowLeft, MessageSquare, Bell, User, Video
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDoc, arrayRemove, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { Messages } from '../community/Messages';
import { TutorialsStudio } from '../tutorials/TutorialsStudio';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function LocationPicker({ position, setPosition }: { position: {lat: number, lng: number} | null, setPosition: (p: {lat: number, lng: number}) => void }) {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
        locationfound(e) {
            if (!position) {
                setPosition(e.latlng);
                map.flyTo(e.latlng, 15);
            }
        } });

    useEffect(() => {
        if (!position) {
            map.locate();
        }
    }, [map, position]);

    return position === null ? null : (
        <Marker position={position} icon={customIcon}></Marker>
    );
}

interface AcademicLevel {
    name: string;
    category: string;
}

interface Student {
    id: string;
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
    email: string;
    isInvited?: boolean;
}

interface PendingRequest {
    studentId: string;
    classId: string;
    className: string;
    studentName: string;
    studentGrade: string;
    studentSchool: string;
}

interface Question {
    id: string;
    type: 'multiple-choice' | 'short-answer' | 'essay';
    text: string;
    options?: string[];
    correctAnswer?: string; 
    marks: number;
}

interface ClassData {
    id: string;
    name: string;
    subject: string;
    level: string;
    timetable: string;
    students: string[];
    pendingRequests?: string[];
    price: number;
    currency: string;
}

interface TeacherDashboardProps {
    onLoginRequest: () => void;
    onNavigate: (page: string, params?: any) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLoginRequest, onNavigate }) => {
    const { user, userProfile, updateProfileData } = useAuth();
    const isVerifiedTeacher = userProfile?.role === 'teacher' && userProfile.teacherVerified === true;
    type TeacherTab = 'overview' | 'messages' | 'extra-lessons' | 'tutorials-studio';
    const teacherTabs: TeacherTab[] = ['overview', 'extra-lessons', 'messages', 'tutorials-studio'];
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedTab = searchParams.get('teacherView') as TeacherTab | null;
    const [activeTab, setActiveTab] = useState<TeacherTab>(requestedTab && teacherTabs.includes(requestedTab) ? requestedTab : 'overview');

    useEffect(() => {
        if (requestedTab && teacherTabs.includes(requestedTab)) setActiveTab(requestedTab);
    }, [requestedTab]);

    const selectTab = (tab: TeacherTab) => {
        setActiveTab(tab);
        const next = new URLSearchParams(searchParams);
        next.set('teacherView', tab);
        setSearchParams(next, { replace: true });
    };
    
    // Dynamic Level/Subject Data
    const [allLevels, setAllLevels] = useState<AcademicLevel[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

    // Class Creation State
    const [showCreateClass, setShowCreateClass] = useState(false);
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [showListingSuccess, setShowListingSuccess] = useState(false);
    const [myClasses, setMyClasses] = useState<ClassData[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [newClass, setNewClass] = useState({
        name: '',
        subject: '',
        level: '',
        timetable: '',
        price: 0,
        period: 'month',
        currency: 'USD',
        province: '',
        city: '',
        suburb: '',
        phone: '',
        lat: null as number | null,
        lng: null as number | null
    });

    // Student Search State
    const [searchSchoolQuery, setSearchSchoolQuery] = useState('');
    const [schoolResults, setSchoolResults] = useState<string[]>([]);
    const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
    const [myStudents, setMyStudents] = useState<Student[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);

    // Fetch Levels
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snap) => {
            const configured = snap.exists() ? snap.data().list : null;
            setAllLevels(
                Array.isArray(configured) && configured.length > 0
                    ? configured
                    : CURRICULUM_REGISTRY.map(({ name, category }) => ({ name, category })),
            );
        });
        return () => unsub();
    }, []);

    // Fetch Subjects for selected Level in form
    useEffect(() => {
        if (!newClass.level) {
            setAvailableSubjects([]);
            return;
        }
        const unsub = onSnapshot(doc(db, 'course_subjects', newClass.level), (snap) => {
            const configured = snap.exists() ? snap.data().list : null;
            const localSubjects = CURRICULUM_REGISTRY
                .find((level) => level.name === newClass.level)
                ?.subjects.map((subject) => subject.name) ?? [];
            setAvailableSubjects(
                Array.isArray(configured) && configured.length > 0 ? configured : localSubjects,
            );
        });
        return () => unsub();
    }, [newClass.level]);

    const fetchMyClassesAndRequests = async () => {
        if (!user) return;
        try {
            const q = query(collection(db, 'classes'), where('teacherId', '==', user.uid));
            const snap = await getDocs(q);
            const loadedClasses: ClassData[] = [];
            const loadedRequests: PendingRequest[] = [];

            for (const docSnapshot of snap.docs) {
                const d = docSnapshot.data();
                loadedClasses.push({ 
                    id: docSnapshot.id, 
                    name: d.name, 
                    subject: d.subject, 
                    level: d.level,
                    timetable: d.timetable, 
                    students: d.students || [], 
                    pendingRequests: d.pendingRequests || [],
                    price: d.price, 
                    currency: d.currency 
                });

                if (d.pendingRequests && d.pendingRequests.length > 0) {
                    for (const studentId of d.pendingRequests) {
                        try {
                            const studentSnap = await getDoc(doc(db, 'users', studentId));
                            if (studentSnap.exists()) {
                                const sData = studentSnap.data();
                                loadedRequests.push({
                                    studentId: studentId,
                                    classId: docSnapshot.id,
                                    className: d.name,
                                    studentName: `${sData.firstName} ${sData.lastName}`,
                                    studentGrade: sData.grade,
                                    studentSchool: sData.school
                                });
                            }
                        } catch (err) {
                            console.error("Error fetching student details", err);
                        }
                    }
                }
            }
            setMyClasses(loadedClasses);
            setPendingRequests(loadedRequests);
        } catch (e) { console.error("Error fetching classes", e); }
    };

    useEffect(() => {
        if (user) {
            fetchMyClassesAndRequests();
        }
    }, [user]);

    const handleCreateClass = async () => {
        if (!newClass.name || !newClass.level || !newClass.subject || !user) {
            alert("Please fill in Name, Level, and Subject.");
            return;
        }
        if (!isVerifiedTeacher) {
            alert('Teacher publishing is available only after administrator verification.');
            return;
        }
        setIsCreatingClass(true);
        try {
            await addDoc(collection(db, 'classes'), {
                ...newClass,
                teacherId: user.uid,
                teacherName: `${userProfile?.firstName} ${userProfile?.lastName}`,
                teacherImage: userProfile?.photoURL || user.photoURL || '',
                students: [],
                pendingRequests: [],
                // Administrator verification is the publishing gate. Once a
                // teacher is verified, their lesson listing can go live.
                approved: true,
                createdAt: serverTimestamp(),
                settings: { allowStudentMessages: true }
            });
            setShowCreateClass(false);
            setShowListingSuccess(true);
            window.setTimeout(() => setShowListingSuccess(false), 2200);
            setNewClass({ name: '', subject: '', level: '', timetable: '', price: 0, period: 'month', currency: 'USD', province: '', city: '', suburb: '', phone: '', lat: null, lng: null });
            await fetchMyClassesAndRequests();
            selectTab('extra-lessons');
        } catch (e) {
            console.error(e);
            alert("Error creating class");
        } finally {
            setIsCreatingClass(false);
        }
    };

    const handleApproveStudent = async (req: PendingRequest) => {
        try {
            const classRef = doc(db, 'classes', req.classId);
            await updateDoc(classRef, {
                students: arrayUnion(req.studentId),
                pendingRequests: arrayRemove(req.studentId)
            });
            setPendingRequests(prev => prev.filter(r => r.studentId !== req.studentId || r.classId !== req.classId));
            
            const chatId = [user?.uid, req.studentId].sort().join('_');
            await addDoc(collection(db, 'direct_messages'), {
                text: `Welcome to ${req.className}! You have been approved.`,
                senderId: user?.uid,
                receiverId: req.studentId,
                chatId: chatId,
                timestamp: serverTimestamp(),
                read: false
            });
        } catch (e) { console.error(e); }
    };

    if (!user) return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Teacher Dashboard" />;
    if (userProfile?.role !== 'teacher') {
        return (
          <main className="min-h-[calc(100vh_-_var(--app-header-h))] bg-gray-50 p-6 text-center dark:bg-[#0a0a0a]">
            <section className="mx-auto mt-20 max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-[#171717]">
              <GraduationCap className="mx-auto text-amber-500" size={40} />
              <h1 className="mt-5 text-2xl font-black text-gray-900 dark:text-white">Teacher account required</h1>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
                Sign in with a registered teacher account to open this dashboard.
              </p>
            </section>
          </main>
        );
    }

    return (
        <div className="min-h-[calc(100vh_-_var(--app-header-h))] bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-200 flex overflow-hidden font-sans relative lg:h-[calc(100vh_-_var(--app-header-h))]">
            {showListingSuccess && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/75">
                    <div className="animate-dropdown-reveal text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-[0_16px_45px_rgba(220,38,38,0.35)]"><CheckCircle size={42} strokeWidth={3} /></span><h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">Listing published</h2><p className="mt-1 text-sm text-gray-500">Students can now find you in Extra Lessons.</p></div>
                </div>
            )}
            
            {showCreateClass && (
                <div className="fixed inset-0 z-[100] bg-black/50 dark:bg-black/80 flex items-end md:items-center justify-center md:p-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white dark:bg-[#1e1e1e] w-full md:max-w-2xl md:rounded-3xl rounded-t-3xl p-6 md:p-8 border border-gray-200 dark:border-[#333] animate-slide-up md:animate-dropdown-reveal relative shadow-2xl overflow-y-auto max-h-[90vh] pb-safe">
                        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 md:hidden" />
                        <button onClick={() => setShowCreateClass(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-white hidden md:block"><X size={20}/></button>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">List yourself in Extra Lessons</h2>
                        <p className="mb-6 text-sm text-gray-500">Add the lesson students will see under your verified teacher profile.</p>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Academic Level</label>
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer appearance-none" value={newClass.level} onChange={(e) => setNewClass({...newClass, level: e.target.value, subject: ''})}>
                                            <option value="">Select Level</option>
                                            {allLevels.map(l => <option key={l.name} value={l.name}>{l.name} ({l.category})</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer appearance-none" value={newClass.subject} onChange={(e) => setNewClass({...newClass, subject: e.target.value})} disabled={!newClass.level}>
                                            <option value="">Select Subject</option>
                                            {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Class Display Name</label>
                                <input className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Morning Mathematics Intensive" value={newClass.name} onChange={(e) => setNewClass({...newClass, name: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Province</label>
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer appearance-none" value={newClass.province} onChange={(e) => setNewClass({...newClass, province: e.target.value})}>
                                            <option value="">Select Province</option>
                                            {['Bulawayo', 'Harare', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'].map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">City/Town</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none" placeholder="e.g. Harare" value={newClass.city} onChange={(e) => setNewClass({...newClass, city: e.target.value})} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Suburb</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none" placeholder="e.g. Borrowdale" value={newClass.suburb} onChange={(e) => setNewClass({...newClass, suburb: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none" placeholder="e.g. +263 77 123 4567" value={newClass.phone} onChange={(e) => setNewClass({...newClass, phone: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Timetable</label>
                                <input className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none" placeholder="e.g. Mon/Wed 14:00" value={newClass.timetable} onChange={(e) => setNewClass({...newClass, timetable: e.target.value})} />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price</label>
                                    <input type="number" className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none" placeholder="Amount" value={newClass.price} onChange={(e) => setNewClass({...newClass, price: Number(e.target.value)})} />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Currency</label>
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer appearance-none" value={newClass.currency} onChange={(e) => setNewClass({...newClass, currency: e.target.value as any})}>
                                            <option>USD</option>
                                            <option>ZIG</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Period</label>
                                    <div className="relative">
                                        <select className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer appearance-none" value={newClass.period} onChange={(e) => setNewClass({...newClass, period: e.target.value as any})}>
                                            <option value="week">/ Week</option>
                                            <option value="month">/ Month</option>
                                            <option value="term">/ Term</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pin Location</label>
                                        <p className="text-xs text-gray-500">Click on the map to drop a pin for your exact location.</p>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition((pos) => {
                                                    setNewClass({...newClass, lat: pos.coords.latitude, lng: pos.coords.longitude});
                                                });
                                            }
                                        }}
                                        className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                                    >
                                        Use Current Location
                                    </button>
                                </div>
                                <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-[#333] relative z-0">
                                    <MapContainer center={[-19.0154, 29.1549]} zoom={6} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationPicker 
                                            position={newClass.lat !== null && newClass.lng !== null ? {lat: newClass.lat, lng: newClass.lng} : null} 
                                            setPosition={(p) => setNewClass({...newClass, lat: p.lat, lng: p.lng})} 
                                        />
                                    </MapContainer>
                                </div>
                                {newClass.lat && newClass.lng && (
                                    <div className="mt-2 text-xs text-green-600 dark:text-green-400 font-bold flex items-center gap-1">
                                        <CheckCircle size={14} /> Location pinned successfully
                                    </div>
                                )}
                            </div>
                        </div>

                        <button 
                            onClick={handleCreateClass} 
                            disabled={isCreatingClass}
                            className="w-full mt-8 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isCreatingClass ? <Loader2 className="animate-spin" /> : 'Publish in Extra Lessons'}
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#222] h-full overflow-y-auto custom-scrollbar z-30 shrink-0">
                <div className="p-6 border-b border-gray-200 dark:border-[#222] flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-purple-900/30">
                        <GraduationCap size={20} />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">Classroom</span>
                </div>
                
                <nav className="flex-1 py-6 px-3 space-y-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: Layout },
                        { id: 'extra-lessons', label: 'Extra Lessons', icon: GraduationCap },
                        { id: 'messages', label: 'Messages', icon: MessageSquare },
                        { id: 'tutorials-studio', label: 'Tutorials Studio', icon: Video },
                    ].map((item) => (
                        <button 
                            key={item.id}
                            onClick={() => selectTab(item.id as TeacherTab)}
                            className={clsx("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm", activeTab === item.id ? "bg-gray-100 dark:bg-[#252525] text-gray-900 dark:text-white border border-gray-200 dark:border-[#333]" : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200")}
                        >
                            <item.icon size={18} className={activeTab === item.id ? "text-purple-600 dark:text-purple-400" : ""} />
                            <span>{item.label}</span>
                            {activeTab === item.id && <ChevronRight size={16} className="ml-auto opacity-50 hidden lg:block" />}
                        </button>
                    ))}
                </nav>

                <button onClick={() => onNavigate('profile')} className="m-4 flex items-center gap-3 rounded-xl bg-[#f5f1ff] p-3 text-left ring-1 ring-violet-100 transition-colors hover:bg-[#eee7ff] dark:bg-violet-500/10 dark:ring-violet-500/20">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-600 text-sm font-black text-white">
                        {userProfile?.photoURL || user?.photoURL ? <img src={userProfile?.photoURL || user?.photoURL || ''} alt="" className="h-full w-full object-cover" /> : userProfile?.firstName?.[0] || 'T'}
                    </span>
                    <span className="min-w-0 flex-1"><strong className="block truncate text-xs text-gray-900 dark:text-white">{userProfile?.firstName} {userProfile?.lastName}</strong><small className="mt-0.5 block text-[10px] font-semibold text-violet-600 dark:text-violet-300">View profile</small></span>
                    <ChevronRight size={15} className="text-violet-500" />
                </button>

            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] relative">
                <div className={clsx(
                    "flex-1 custom-scrollbar relative z-10",
                    activeTab === 'messages' ? "overflow-hidden p-0" : "overflow-y-auto p-3 pb-32 sm:p-6 sm:pb-32 lg:p-10"
                )}>
                    {!isVerifiedTeacher && (
                        <section className="mb-8 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">
                            <Clock className="mt-0.5 shrink-0" size={19} />
                            <div>
                                <p className="text-sm font-black">Teacher verification is pending</p>
                                <p className="mt-1 text-xs leading-5 text-amber-800/80 dark:text-amber-200/70">
                                    Your dashboard is active. You can review your profile and dashboard tools now; publishing lessons, managing students, and creating classes unlock after administrator approval.
                                </p>
                            </div>
                        </section>
                    )}

                    {activeTab === 'overview' && (
                        <div className="animate-dropdown-reveal lg:hidden">
                            <div className="flex items-center justify-between gap-3 px-1 pt-1">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-600 text-sm font-black text-white shadow-md">
                                            {userProfile?.photoURL || user?.photoURL ? <img src={userProfile?.photoURL || user?.photoURL || ''} alt="" className="h-full w-full object-cover" /> : userProfile?.firstName?.[0] || 'T'}
                                        </span>
                                        <span
                                            title={isVerifiedTeacher ? 'Verified teacher' : 'Verification pending'}
                                            aria-label={isVerifiedTeacher ? 'Verified teacher' : 'Verification pending'}
                                            className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white dark:ring-[#0f0f0f] ${isVerifiedTeacher ? 'bg-violet-600 text-white' : 'bg-amber-500 text-white'}`}
                                        >
                                            {isVerifiedTeacher ? <CheckCircle size={11} strokeWidth={3} /> : <Clock size={11} strokeWidth={3} />}
                                        </span>
                                    </span>
                                    <div className="min-w-0"><p className="text-[10px] font-bold text-gray-400">Welcome back</p><h1 className="truncate text-sm font-black text-gray-900 dark:text-white">{userProfile?.firstName} {userProfile?.lastName}</h1></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => selectTab('messages')} aria-label="Messages" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:text-white dark:ring-white/10"><Bell size={18} /></button>
                                    <button onClick={() => onNavigate('home')} className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-black text-gray-700 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:text-white dark:ring-white/10"><ArrowLeft size={14} /> Back to site</button>
                                </div>
                            </div>

                            <button onClick={() => selectTab('extra-lessons')} className="mt-4 flex w-full items-center gap-2 rounded-full bg-gray-200/80 px-4 py-3 text-left text-xs font-bold text-gray-500 dark:bg-white/10 dark:text-gray-400"><Search size={16} /> Search your lessons and tools</button>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                                {[
                                    { id: 'extra-lessons' as TeacherTab, label: 'Listings', icon: GraduationCap },
                                    { id: 'messages' as TeacherTab, label: 'Messages', icon: MessageSquare },
                                    { id: 'tutorials-studio' as TeacherTab, label: 'Tutorials', icon: Video },
                                ].map((item) => <button key={item.id} onClick={() => selectTab(item.id)} className="flex items-center justify-center gap-1.5 rounded-full bg-white px-2 py-2.5 text-[10px] font-black text-gray-800 shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:text-white dark:ring-white/10"><item.icon size={14} /> {item.label}</button>)}
                            </div>

                            <section className="mt-6">
                                <div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-black text-gray-900 dark:text-white">Keep teaching ›</h2><span className="text-[10px] font-bold text-gray-400">{myClasses.length} listings</span></div>
                                <div className="-mx-3 flex snap-x gap-3 overflow-x-auto px-3 pb-2 hide-scrollbar">
                                    {myClasses.slice(0, 5).map((classItem, index) => (
                                        <button key={classItem.id} onClick={() => selectTab('extra-lessons')} className="w-[132px] shrink-0 snap-start text-left">
                                            <span className={`flex h-28 items-end overflow-hidden rounded-2xl p-3 text-white shadow-sm ${index % 3 === 0 ? 'bg-gradient-to-br from-violet-500 to-indigo-700' : index % 3 === 1 ? 'bg-gradient-to-br from-orange-400 to-rose-600' : 'bg-gradient-to-br from-cyan-500 to-blue-700'}`}><BookOpen className="opacity-80" size={34} /></span>
                                            <strong className="mt-2 block truncate text-[11px] text-gray-900 dark:text-white">{classItem.name}</strong><small className="block truncate text-[9px] text-gray-400">{classItem.subject}</small>
                                        </button>
                                    ))}
                                    {!myClasses.length && <button onClick={() => selectTab('extra-lessons')} className="flex h-28 w-full shrink-0 items-center justify-center gap-2 rounded-2xl border border-dashed border-violet-200 bg-violet-50 text-xs font-black text-violet-600 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300"><Plus size={17} /> Create your first listing</button>}
                                </div>
                            </section>

                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="hidden space-y-6 animate-dropdown-reveal lg:block">
                            <div className="flex items-center justify-between rounded-xl bg-white px-5 py-4 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
                                <div><h1 className="text-base font-black text-gray-950 dark:text-white">Overview</h1><p className="mt-1 text-[11px] font-medium text-gray-400">A quick view of your teaching activity.</p></div>
                                <span className={`rounded-lg px-3 py-2 text-[10px] font-black ${isVerifiedTeacher ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200'}`}>{isVerifiedTeacher ? 'Verified teacher' : 'Verification pending'}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-5">
                                {[
                                    { label: 'Active Students', value: myClasses.reduce((acc, cls) => acc + cls.students.length, 0), note: 'Across all listings', icon: Users, tone: 'text-blue-600 bg-blue-100 dark:bg-blue-500/15', glow: 'bg-blue-400/10' },
                                    { label: 'Classes Created', value: myClasses.length, note: 'Published lessons', icon: BookOpen, tone: 'text-violet-600 bg-violet-100 dark:bg-violet-500/15', glow: 'bg-violet-400/10' },
                                    { label: 'Join Requests', value: pendingRequests.length, note: 'Waiting for review', icon: Bell, tone: 'text-amber-600 bg-amber-100 dark:bg-amber-500/15', glow: 'bg-amber-400/10' },
                                ].map((stat) => (
                                    <article key={stat.label} className="relative flex min-h-[112px] items-center gap-4 overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
                                        <span className={`absolute -right-8 -top-9 h-28 w-28 rounded-full blur-2xl ${stat.glow}`} />
                                        <span className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.tone}`}><stat.icon size={20} /></span>
                                        <span className="relative min-w-0"><strong className="block text-2xl font-black leading-none text-gray-950 dark:text-white">{stat.value}</strong><span className="mt-2 block text-xs font-black text-gray-700 dark:text-gray-200">{stat.label}</span><small className="mt-0.5 block text-[10px] text-gray-400">{stat.note}</small></span>
                                    </article>
                                ))}
                            </div>

                            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
                                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
                                    <div><h3 className="flex items-center gap-2 text-sm font-black text-gray-900 dark:text-white"><UserPlus size={17} className="text-violet-600"/> Pending Join Requests</h3><p className="mt-1 text-[10px] text-gray-400">Approve students who want to join your lessons.</p></div>
                                    <span className="rounded-full bg-[#f5f1ff] px-2.5 py-1 text-[10px] font-black text-violet-600 dark:bg-violet-500/15 dark:text-violet-200">{pendingRequests.length}</span>
                                </div>
                                {pendingRequests.length > 0 ? (
                                    <div className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
                                        {pendingRequests.map((req) => (
                                            <div key={`${req.classId}-${req.studentId}`} className="p-4 hover:bg-gray-50 dark:hover:bg-[#1e1e1e] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#252525] flex items-center justify-center text-gray-500 dark:text-gray-400 font-bold border border-gray-200 dark:border-[#333]">
                                                        {req.studentName[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-gray-200 text-sm">{req.studentName}</h4>
                                                        <p className="text-xs text-gray-500">Targeting {req.className}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleApproveStudent(req)} className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors flex items-center gap-2">
                                                        <CheckCircle size={14} /> Approve
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3 px-5 py-8 text-xs text-gray-400"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f1ff] text-violet-500 dark:bg-violet-500/15"><UserPlus size={16} /></span>No pending requests.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'extra-lessons' && (
                        <div className="animate-dropdown-reveal space-y-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div><h2 className="text-xl font-bold text-gray-900 dark:text-white">Extra Lessons</h2><p className="mt-1 text-sm text-gray-500">Manage how you and your lessons appear to students.</p></div>
                                <button onClick={() => setShowCreateClass(true)} disabled={!isVerifiedTeacher} className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-xs font-black text-white hover:bg-purple-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-white/10"><Plus size={16} /> {isVerifiedTeacher ? 'Create listing' : 'Verification pending'}</button>
                            </div>
                            {!isVerifiedTeacher ? (
                                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200"><Clock size={22} /><h3 className="mt-3 font-black">Administrator approval required</h3><p className="mt-1 text-sm leading-6 opacity-80">You can sign in and use your dashboard now. Extra Lessons publishing unlocks when an administrator verifies your teacher account.</p></section>
                            ) : (
                                <div className="divide-y divide-gray-200 border-y border-gray-200 dark:divide-white/10 dark:border-white/10">
                                    {myClasses.map((classItem) => (
                                        <article key={classItem.id} className="flex items-center gap-3 py-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-purple-100 text-sm font-black text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">{userProfile?.photoURL || user.photoURL ? <img src={userProfile?.photoURL || user.photoURL || ''} alt="" className="h-full w-full object-cover" /> : userProfile?.firstName?.[0] || 'T'}</span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-black text-gray-900 dark:text-white">{classItem.name}</h3><p className="mt-0.5 truncate text-[11px] text-gray-500">{classItem.subject} · {classItem.level} · {classItem.timetable}</p></div><span className="text-[10px] font-black text-emerald-600">Published</span><button onClick={() => onNavigate('extra-lessons')} className="text-xs font-black text-purple-600">View</button></article>
                                    ))}
                                    {!myClasses.length && <div className="py-16 text-center text-sm text-gray-500">You have no Extra Lessons listings yet.</div>}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'messages' && (
                        <div className="h-full overflow-hidden">
                            <Messages embedded onLoginRequest={onLoginRequest} />
                        </div>
                    )}

                    {activeTab === 'tutorials-studio' && (
                        <div className="animate-dropdown-reveal">
                            <TutorialsStudio embedded onNavigate={onNavigate} onLoginRequest={onLoginRequest} />
                        </div>
                    )}
                </div>
            </div>

            <nav className="fixed inset-x-3 bottom-3 z-[80] grid grid-cols-4 rounded-[26px] border border-gray-200/80 bg-white/95 px-2 py-2 shadow-[0_12px_36px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/95 lg:hidden" aria-label="Teacher dashboard">
                {[
                    { id: 'overview' as TeacherTab, label: 'Home', icon: Layout },
                    { id: 'extra-lessons' as TeacherTab, label: 'Lessons', icon: GraduationCap },
                    { id: 'tutorials-studio' as TeacherTab, label: 'Tutorials', icon: Video },
                ].map((item) => (
                    <button key={item.id} onClick={() => selectTab(item.id)} className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[9px] font-black transition-colors ${activeTab === item.id ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300' : 'text-gray-400 dark:text-gray-500'}`}><item.icon size={19} strokeWidth={activeTab === item.id ? 2.7 : 2} /><span className="truncate">{item.label}</span></button>
                ))}
                <button onClick={() => onNavigate('profile')} className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[9px] font-black text-gray-400 transition-colors dark:text-gray-500"><User size={19} /><span>Profile</span></button>
            </nav>
        </div>
    );
};

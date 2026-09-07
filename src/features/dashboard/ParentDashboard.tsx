
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Activity, Clock, BookOpen, AlertCircle, CheckCircle, BarChart3, Mail, Heart, GraduationCap, X, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';

export const ParentDashboard: React.FC<{ onLoginRequest: () => void }> = ({ onLoginRequest }) => {
    const { user, userProfile } = useAuth();
    const [searchEmail, setSearchEmail] = useState('');
    const [foundStudent, setFoundStudent] = useState<any | null>(null);
    const [requestSent, setRequestSent] = useState(false);
    const [linkedStudents, setLinkedStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingLinked, setLoadingLinked] = useState(true);

    useEffect(() => {
        const fetchLinkedStudents = async () => {
            if (userProfile?.linkedStudents && userProfile.linkedStudents.length > 0) {
                const students = [];
                for (const studentId of userProfile.linkedStudents) {
                    try {
                        const snap = await getDoc(doc(db, 'users', studentId));
                        if (snap.exists()) {
                            students.push({ id: snap.id, ...snap.data() });
                        }
                    } catch (e) { console.error(e); }
                }
                setLinkedStudents(students);
            }
            setLoadingLinked(false);
        };
        fetchLinkedStudents();
    }, [userProfile]);

    const handleSearch = async () => {
        if (!searchEmail) return;
        setLoading(true);
        setFoundStudent(null);
        setRequestSent(false); // Reset state
        try {
            // Secure search: Only find by exact email match for privacy
            const q = query(collection(db, 'users'), where('email', '==', searchEmail), where('role', '==', 'student'));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const docData = snap.docs[0].data();
                setFoundStudent({ id: snap.docs[0].id, ...docData });
            } else {
                alert("No student found with that email address.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async () => {
        if (!user || !foundStudent) return;
        try {
            const studentRef = doc(db, 'users', foundStudent.id);
            await updateDoc(studentRef, {
                parentRequests: arrayUnion({
                    id: user.uid,
                    name: `${userProfile?.firstName} ${userProfile?.lastName}`,
                    email: user.email
                })
            });
            setRequestSent(true);
        } catch (e) {
            console.error(e);
            alert("Failed to send link request.");
        }
    };

    if (!user) return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Parent Dashboard" />;

    return (
        <div className="min-h-[calc(100vh_-_var(--app-header-h))] bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
            
            {/* Header / Hero */}
            <div className="bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-slate-800 px-6 py-8 md:px-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">Family Hub</h1>
                            <p className="text-slate-500 dark:text-slate-400">Monitor academic progress and support your child's journey.</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-sm border border-indigo-100 dark:border-indigo-800 flex items-center gap-2">
                                <Heart size={16} className="fill-indigo-500 text-indigo-500" /> 
                                {linkedStudents.length} Children Linked
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Link Student Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
                                <h3 className="font-bold text-lg flex items-center gap-2"><UserPlus size={20}/> Add Child</h3>
                                <p className="text-indigo-100 text-xs mt-1 opacity-90">Link a student account to view their progress.</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Student Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input 
                                                className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                placeholder="student@example.com"
                                                value={searchEmail}
                                                onChange={(e) => setSearchEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSearch} 
                                        disabled={loading || !searchEmail}
                                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Find Student'}
                                    </button>
                                </div>

                                {/* Found Student Result */}
                                {foundStudent && (
                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 animate-dropdown-reveal">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500">
                                                {foundStudent.firstName[0]}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{foundStudent.firstName} {foundStudent.lastName}</h4>
                                                <p className="text-xs text-slate-500">{foundStudent.school}</p>
                                            </div>
                                        </div>
                                        
                                        {requestSent ? (
                                            <div className="w-full py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-green-200 dark:border-green-800">
                                                <CheckCircle size={16} /> Request Sent
                                            </div>
                                        ) : (
                                            <button onClick={handleSendRequest} className="w-full py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                                                Send Connection Request
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tip Card */}
                        <div className="bg-orange-50 dark:bg-orange-900/10 p-5 rounded-2xl border border-orange-100 dark:border-orange-800/30 flex gap-4">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg h-fit text-orange-600"><AlertCircle size={20} /></div>
                            <div>
                                <h4 className="font-bold text-orange-800 dark:text-orange-200 text-sm mb-1">Privacy Notice</h4>
                                <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">Students must approve your request from their dashboard before data is shared.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Linked Students */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Children's Progress</h2>
                        </div>

                        {loadingLinked ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={32} /></div>
                        ) : linkedStudents.length > 0 ? (
                            linkedStudents.map(student => (
                                <div key={student.id} className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group">
                                    <div className="p-6 flex flex-col md:flex-row gap-6">
                                        {/* Avatar & Basic Info */}
                                        <div className="flex items-start gap-4 md:w-1/3">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/20">
                                                {student.firstName[0]}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{student.firstName} {student.lastName}</h3>
                                                <p className="text-sm text-slate-500 mb-2">{student.grade}</p>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                                                    <GraduationCap size={12} /> {student.school}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Activity size={12}/> Streak</div>
                                                <div className="text-2xl font-black text-slate-900 dark:text-white">{student.streak || 0} <span className="text-xs font-normal text-slate-400">days</span></div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><BarChart3 size={12}/> Points</div>
                                                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{student.totalPoints || 0}</div>
                                            </div>
                                            <div className="bg-slate-50 dark:bg-[#0f172a] p-3 rounded-xl border border-slate-100 dark:border-slate-800 hidden md:block">
                                                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1"><Clock size={12}/> Last Active</div>
                                                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                                                    {student.lastLoginDate?.toDate ? student.lastLoginDate.toDate().toLocaleDateString() : 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="bg-slate-50 dark:bg-[#0f172a]/50 px-6 py-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                        <div className="flex gap-2">
                                            <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded border border-green-200 dark:border-green-800">Active</span>
                                        </div>
                                        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                            View Full Report <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-64 flex flex-col items-center justify-center bg-white dark:bg-[#1f2937] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center p-8">
                                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
                                    <UserPlus size={32} className="text-slate-400" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">No Children Linked Yet</h3>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                                    Use the "Add Child" panel on the left to search for your child's email address and send a connection request.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

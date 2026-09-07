
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, Video, X, Check, Users, PlayCircle, BookOpen, FileText, Plus, Radio, LayoutGrid, MessageSquare, 
  Settings, Bell, Trophy, Hash, Megaphone, Sun, Moon, LogOut, Loader2
} from 'lucide-react';
import { db, logout } from '../../services/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

interface ClassData {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  students: string[];
}

export const ClassRoom: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { classId } = useParams<{ classId: string }>();
  const { user, userProfile } = useAuth();
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classId) return;
    const fetchClass = async () => {
        const snap = await getDoc(doc(db, 'classes', classId));
        if (snap.exists()) {
            setClassData({ id: snap.id, ...snap.data() } as ClassData);
        }
        setLoading(false);
    };
    fetchClass();
  }, [classId]);

  if (loading) return <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-black"><Loader2 className="animate-spin mb-4" size={40} /><p>Loading Classroom...</p></div>;
  if (!classData) return <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-black"><p>Class not found.</p><button onClick={onBack}>Go Back</button></div>;

  return (
    <div className="h-[calc(100vh_-_var(--app-header-h))] flex flex-col bg-[#f3f4f6] dark:bg-[#050505] transition-colors duration-300 relative overflow-hidden text-left">
        <div className="h-16 px-6 flex items-center justify-between bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-white/5 sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors group"><ArrowLeft size={20} /></button>
                <div className="flex flex-col text-left">
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight uppercase">{classData.name}</h1>
                    <span className="text-xs text-gray-500">{classData.subject}</span>
                </div>
            </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center opacity-30">
            <LayoutGrid size={64} className="mb-4" />
            <h2 className="text-2xl font-black uppercase tracking-widest">Classroom Active</h2>
        </div>
    </div>
  );
};

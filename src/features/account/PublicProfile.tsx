import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  Layout,
  Loader2,
  MessageSquare,
  School,
  User,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface StudentProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  school?: string;
  grade?: string;
  role?: 'student' | 'teacher' | 'parent';
  teacherVerified?: boolean;
  totalPoints?: number;
  joinedCommunities?: string[];
  friends?: string[];
  enrolledSubjects?: string[];
  photoURL?: string;
  bannerURL?: string;
  streak?: number;
}

interface PublicProfileProps {
  onBack: () => void;
  onMessage: () => void;
}

export const PublicProfile: React.FC<PublicProfileProps> = ({ onBack, onMessage }) => {
  const { id: studentId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState<'none' | 'sent' | 'received' | 'friends'>('none');
  const [savingConnection, setSavingConnection] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'users', studentId));
        if (snap.exists()) {
          setProfile(snap.data() as StudentProfile);
          if (user && user.uid !== studentId) {
            const cuSnap = await getDoc(doc(db, 'users', user.uid));
            const cuData = cuSnap.data();
            if (cuData?.friends?.includes(studentId)) setRequestStatus('friends');
            else if (cuData?.sentRequests?.includes(studentId)) setRequestStatus('sent');
            else if (cuData?.friendRequests?.includes(studentId)) setRequestStatus('received');
            else setRequestStatus('none');
          }
        }
      } catch (error) {
        console.error('Error loading public profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [studentId, user]);

  const handleConnection = async () => {
    if (!user || !studentId || user.uid === studentId || savingConnection) return;
    setSavingConnection(true);
    try {
      const meRef = doc(db, 'users', user.uid);
      const themRef = doc(db, 'users', studentId);

      if (requestStatus === 'none') {
        await updateDoc(meRef, { sentRequests: arrayUnion(studentId) });
        await updateDoc(themRef, { friendRequests: arrayUnion(user.uid) });
        setRequestStatus('sent');
      } else if (requestStatus === 'sent') {
        await updateDoc(meRef, { sentRequests: arrayRemove(studentId) });
        await updateDoc(themRef, { friendRequests: arrayRemove(user.uid) });
        setRequestStatus('none');
      } else if (requestStatus === 'received') {
        await updateDoc(meRef, {
          friends: arrayUnion(studentId),
          friendRequests: arrayRemove(studentId),
        });
        await updateDoc(themRef, {
          friends: arrayUnion(user.uid),
          sentRequests: arrayRemove(user.uid),
        });
        setRequestStatus('friends');
      } else {
        await updateDoc(meRef, { friends: arrayRemove(studentId) });
        await updateDoc(themRef, { friends: arrayRemove(user.uid) });
        setRequestStatus('none');
      }
    } catch (error) {
      console.error('Error updating connection', error);
    } finally {
      setSavingConnection(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#faf9ff] dark:bg-[#0f0f10]">
        <Loader2 className="animate-spin text-violet-600" size={32} />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#faf9ff] p-6 text-center text-[#292452] dark:bg-[#0f0f10] dark:text-white">
        <p className="mb-4 text-sm font-bold">Student not found.</p>
        <button onClick={onBack} className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-black text-white">
          Go Back
        </button>
      </div>
    );
  }

  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Student Profile';
  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}` || fullName[0] || 'S';
  const isTeacher = profile.role === 'teacher';
  const isOwnProfile = user?.uid === studentId;
  const subjects = profile.enrolledSubjects || [];
  const friendsCount = profile.friends?.length || 0;
  const groupsCount = profile.joinedCommunities?.length || 0;
  const connectionCopy = requestStatus === 'friends'
    ? 'Friends'
    : requestStatus === 'sent'
    ? 'Requested'
    : requestStatus === 'received'
    ? 'Accept'
    : 'Add Friend';

  const avatar = (
    profile.photoURL
      ? <img src={profile.photoURL} alt={fullName} className="h-full w-full object-cover" />
      : <span>{initials}</span>
  );

  const cover = profile.bannerURL ? (
    <img src={profile.bannerURL} alt={`${fullName} cover`} className="h-full w-full object-cover" />
  ) : (
    <>
      <span className="absolute -bottom-32 -left-16 h-80 w-80 rounded-[45%] bg-white/25 blur-sm" />
      <span className="absolute -bottom-40 left-[18%] h-96 w-96 rounded-[44%] bg-violet-700/25" />
      <span className="absolute -bottom-52 left-[43%] h-[28rem] w-[28rem] rounded-[48%] bg-white/20" />
      <span className="absolute -bottom-56 right-[-8%] h-[30rem] w-[30rem] rounded-[46%] bg-violet-800/20" />
    </>
  );

  return (
    <div className="h-[calc(100vh_-_var(--app-header-h,0px))] overflow-y-auto bg-[#f6f7fb] text-[#25223f] custom-scrollbar dark:bg-[#0f0f10] dark:text-white">
      <div className="min-h-full bg-[#faf9ff] px-5 pb-10 pt-5 text-[#292452] dark:bg-[#0f0f10] dark:text-white md:hidden">
        <div className="grid grid-cols-[40px_1fr_40px] items-center">
          <button onClick={onBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#423684] shadow-sm dark:bg-white/10 dark:text-white">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-center text-base font-black">Profile</h1>
        </div>

        <section className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#ecebf2] text-2xl font-black text-violet-600 shadow-sm dark:bg-white/10">
            {avatar}
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <h2 className="text-lg font-black">{fullName}</h2>
            {isTeacher && profile.teacherVerified === true && <CheckCircle size={15} className="text-violet-600" />}
          </div>
          <p className="mt-0.5 text-xs font-medium text-[#aaa6b8]">{profile.email || profile.school || 'Student'}</p>
        </section>

        <section className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
          {[
            { value: profile.totalPoints || 0, label: 'Points', icon: Award },
            { value: friendsCount, label: 'Friends', icon: Users },
            { value: groupsCount, label: 'Groups', icon: GraduationCap },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#77728d] shadow-sm dark:bg-white/10 dark:text-gray-300"><stat.icon size={16} /></span>
              <strong className="mt-2 block text-sm font-black">{stat.value}</strong>
              <span className="mt-0.5 block text-[10px] font-medium text-[#aaa6b8]">{stat.label}</span>
            </div>
          ))}
        </section>

        {!isOwnProfile && (
          <section className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
            <button onClick={handleConnection} disabled={savingConnection} className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-xs font-black text-white disabled:opacity-60">
              {requestStatus === 'friends' ? <UserMinus size={15} /> : <UserPlus size={15} />}
              {connectionCopy}
            </button>
            <button onClick={onMessage} className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs font-black text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <MessageSquare size={15} />
              Message
            </button>
          </section>
        )}

        <section className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl bg-white px-4 shadow-[0_8px_28px_rgba(38,31,78,0.04)] dark:bg-white/5">
          {[
            { label: profile.school || 'School not added', icon: School },
            { label: isTeacher ? 'Teacher' : profile.grade || 'Level not added', icon: GraduationCap },
            { label: `${profile.totalPoints || 0} learning points`, icon: Award },
          ].map((item) => (
            <div key={item.label} className="flex w-full items-center gap-3 border-b border-[#f1eff7] py-4 text-left text-[13px] font-bold last:border-0 dark:border-white/10">
              <item.icon size={16} className="text-[#423684]" />
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={16} className="text-[#77728d]" />
            </div>
          ))}
        </section>
      </div>

      <div className="hidden min-h-full px-6 py-7 md:block lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-xl bg-white px-5 py-4 text-xs font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
            <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-violet-600 dark:text-gray-300">
              <ArrowLeft size={15} />
              Back
            </button>
            <div className="flex items-center gap-2 text-gray-400">
              <Layout size={14} />
              <span>/</span>
              <span className="rounded-md bg-violet-100 px-2 py-1 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">User Profile</span>
            </div>
          </div>

          <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
            <div className="relative h-[250px] overflow-hidden bg-gradient-to-br from-[#d9c9f7] via-[#b8a2e7] to-[#8061cf] lg:h-[300px]">
              {cover}
            </div>

            <div className="relative grid min-h-[132px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8">
              <div className="flex items-center gap-8">
                {[
                  { value: profile.totalPoints || 0, label: 'Points', icon: Award },
                  { value: friendsCount, label: 'Friends', icon: Users },
                  { value: groupsCount, label: 'Groups', icon: GraduationCap },
                ].map((stat) => (
                  <div key={stat.label} className="min-w-[64px] text-center">
                    <stat.icon size={16} className="mx-auto mb-2 text-gray-500 dark:text-gray-300" />
                    <strong className="block text-lg font-black">{stat.value}</strong>
                    <span className="text-[10px] font-medium text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="min-w-[220px] self-stretch text-center">
                <div className="relative mx-auto -mt-11 h-[88px] w-[88px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#ecebf2] text-2xl font-black text-violet-600 shadow-md dark:border-[#171717] dark:bg-white/10">
                    {avatar}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1.5">
                  <h1 className="text-base font-black">{fullName}</h1>
                  {isTeacher && profile.teacherVerified === true && <CheckCircle size={15} className="text-violet-600" />}
                </div>
                <p className="mt-1 text-[11px] font-medium text-gray-400">{isTeacher ? 'Teacher' : profile.grade || 'Student'}</p>
              </div>

              <div className="flex justify-end gap-3">
                {!isOwnProfile && (
                  <>
                    <button onClick={onMessage} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white">
                      <MessageSquare size={15} />
                      Message
                    </button>
                    <button onClick={handleConnection} disabled={savingConnection} className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-violet-500/20 hover:bg-violet-500 disabled:opacity-60">
                      {requestStatus === 'friends' ? <UserMinus size={15} /> : <UserPlus size={15} />}
                      {connectionCopy}
                    </button>
                  </>
                )}
              </div>
            </div>

            <nav className="flex justify-end gap-8 bg-[#e9dcff] px-8 py-3 text-xs font-bold text-[#544a72] dark:bg-violet-500/15 dark:text-violet-200" aria-label="Profile sections">
              <button className="flex items-center gap-2 text-violet-700 dark:text-white"><User size={15} /> Profile</button>
              <button className="flex items-center gap-2"><GraduationCap size={15} /> Courses</button>
              <button className="flex items-center gap-2"><Users size={15} /> Friends</button>
            </nav>
          </section>

          <div className="mt-6 grid grid-cols-[280px_minmax(0,1fr)] gap-6">
            <aside className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
              <h2 className="text-lg font-black">Introduction</h2>
              <p className="mt-3 text-xs leading-5 text-gray-400">{isTeacher ? 'Teacher profile and contact information.' : 'Student profile, school and academic information.'}</p>
              <div className="mt-6 space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <p className="flex items-center gap-3"><School size={16} /> {profile.school || 'School not added'}</p>
                <p className="flex items-center gap-3"><GraduationCap size={16} /> {isTeacher ? 'Teacher' : profile.grade || 'Level not added'}</p>
                <p className="flex items-center gap-3"><CheckCircle size={16} /> {isTeacher ? (profile.teacherVerified === true ? 'Verified teacher' : 'Verification pending') : `${profile.totalPoints || 0} learning points`}</p>
              </div>
            </aside>

            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
              <h2 className="text-base font-black">{isTeacher ? 'Subjects taught' : 'My subjects'}</h2>
              <p className="mt-1 text-xs text-gray-400">{isTeacher ? 'Subjects shown on this teaching profile.' : 'Subjects included in this academic profile.'}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {subjects.length
                  ? subjects.map((subject) => <span key={subject} className="rounded-lg bg-[#f5f1ff] px-3 py-2 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">{subject}</span>)
                  : <div className="w-full rounded-xl border border-dashed border-violet-200 py-8 text-center text-xs font-black text-violet-600">No subjects added</div>}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

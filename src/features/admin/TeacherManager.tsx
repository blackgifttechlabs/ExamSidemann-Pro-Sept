import { verifyTeacherAccount } from '../../services/accountAutomation';
import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Loader2,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../services/firebase';

type TeacherRecord = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  school?: string;
  province?: string;
  educationType?: 'high-school' | 'polytechnic';
  teacherVerified?: boolean;
  teacherApplication?: {
    teachingArea?: string;
    primarySubject?: string;
    qualification?: string;
    status?: string;
    submittedAt?: unknown;
  };
};

const asDate = (value: any): Date | null => {
  if (value?.toDate instanceof Function) return value.toDate();
  if (typeof value?.seconds === 'number') return new Date(value.seconds * 1000);
  return null;
};

export const TeacherManager: React.FC = () => {
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [listingCounts, setListingCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'verified'>('all');
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    const stopTeachers = onSnapshot(
      query(collection(db, 'users'), where('role', '==', 'teacher')),
      (snapshot) => {
        setTeachers(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as TeacherRecord)));
        setLoading(false);
      },
      (error) => {
        console.error('Could not load teachers', error);
        setLoading(false);
      },
    );
    const stopClasses = onSnapshot(collection(db, 'classes'), (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach((item) => {
        const data = item.data();
        if (data.approved === true && typeof data.teacherId === 'string') {
          counts[data.teacherId] = (counts[data.teacherId] || 0) + 1;
        }
      });
      setListingCounts(counts);
    });
    return () => {
      stopTeachers();
      stopClasses();
    };
  }, []);

  const stats = useMemo(() => ({
    total: teachers.length,
    pending: teachers.filter((teacher) => !teacher.teacherVerified).length,
    verified: teachers.filter((teacher) => teacher.teacherVerified).length,
    listed: teachers.filter((teacher) => (listingCounts[teacher.id] || 0) > 0).length,
  }), [listingCounts, teachers]);

  const filteredTeachers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase();
    return teachers
      .filter((teacher) => status === 'all' || (status === 'verified' ? teacher.teacherVerified : !teacher.teacherVerified))
      .filter((teacher) => [
        teacher.firstName,
        teacher.lastName,
        teacher.email,
        teacher.school,
        teacher.teacherApplication?.teachingArea,
        teacher.teacherApplication?.qualification,
      ].some((value) => String(value || '').toLocaleLowerCase().includes(term)))
      .sort((a, b) => Number(Boolean(a.teacherVerified)) - Number(Boolean(b.teacherVerified)));
  }, [search, status, teachers]);

  const approveTeacher = async (teacher: TeacherRecord) => {
    setApprovingId(teacher.id);
    try {
      await verifyTeacherAccount(teacher.id);
    } catch (error) {
      console.error('Could not approve teacher', error);
      window.alert(error instanceof Error ? error.message : 'Teacher approval failed.');
    } finally {
      setApprovingId(null);
    }
  };

  const cards = [
    { label: 'All teachers', value: stats.total, icon: Users, color: 'bg-violet-500' },
    { label: 'Awaiting approval', value: stats.pending, icon: Clock3, color: 'bg-amber-500' },
    { label: 'Verified teachers', value: stats.verified, icon: ShieldCheck, color: 'bg-emerald-500' },
    { label: 'Listed in lessons', value: stats.listed, icon: BookOpen, color: 'bg-blue-500' },
  ];

  return (
    <section className="space-y-6 text-left">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-600 dark:text-violet-400">Teacher administration</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">Teachers and applications</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Approve teacher accounts before they can publish themselves and their lessons in Extra Lessons.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#161616] sm:p-5">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-white ${card.color}`}><card.icon size={18} /></span>
            <strong className="mt-4 block text-3xl font-black tabular-nums text-slate-900 dark:text-white">{loading ? '—' : card.value}</strong>
            <span className="mt-1 block text-xs font-bold text-slate-500 dark:text-slate-400">{card.label}</span>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#161616]">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, school or subject" className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400 dark:border-white/10 dark:bg-white/5 dark:text-white" />
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
            {(['all', 'pending', 'verified'] as const).map((item) => (
              <button key={item} onClick={() => setStatus(item)} className={`rounded-lg px-3 py-2 text-[11px] font-black capitalize ${status === item ? 'bg-white text-violet-700 shadow-sm dark:bg-white/10 dark:text-violet-300' : 'text-slate-500'}`}>{item}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:bg-white/[0.025]">
              <tr><th className="px-5 py-3.5">Teacher</th><th className="px-5 py-3.5">Institution</th><th className="px-5 py-3.5">Teaching area</th><th className="px-5 py-3.5">Qualification</th><th className="px-5 py-3.5">Applied</th><th className="px-5 py-3.5">Listings</th><th className="px-5 py-3.5">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredTeachers.map((teacher) => {
                const name = `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'Unnamed teacher';
                const submittedAt = asDate(teacher.teacherApplication?.submittedAt);
                const listings = listingCounts[teacher.id] || 0;
                return (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 dark:hover:bg-white/[0.025]">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">{name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</span><span><strong className="block text-slate-900 dark:text-white">{name}</strong><small className="text-slate-400">{teacher.email || 'No email'}</small></span></div></td>
                    <td className="px-5 py-4"><strong className="block text-xs text-slate-700 dark:text-slate-200">{teacher.school || 'Not supplied'}</strong><small className="text-slate-400">{teacher.educationType === 'polytechnic' ? 'Polytechnic' : 'High School'}{teacher.province ? ` · ${teacher.province}` : ''}</small></td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-600 dark:text-slate-300">{teacher.teacherApplication?.teachingArea || teacher.teacherApplication?.primarySubject || 'Not supplied'}</td>
                    <td className="max-w-[210px] px-5 py-4 text-xs text-slate-500 dark:text-slate-400">{teacher.teacherApplication?.qualification || 'Not supplied'}</td>
                    <td className="px-5 py-4 text-xs text-slate-500">{submittedAt ? submittedAt.toLocaleDateString() : 'Unknown'}</td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-xs font-black text-slate-700 dark:text-slate-200"><BookOpen size={14} className="text-blue-500" /> {listings}</span></td>
                    <td className="px-5 py-4">
                      {teacher.teacherVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 size={13} /> Verified</span>
                      ) : (
                        <button onClick={() => void approveTeacher(teacher)} disabled={approvingId === teacher.id} className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-[10px] font-black text-white hover:bg-violet-700 disabled:cursor-wait disabled:opacity-60">
                          {approvingId === teacher.id ? <Loader2 className="animate-spin" size={13} /> : <ShieldCheck size={13} />} Approve teacher
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!loading && filteredTeachers.length === 0 && <div className="py-16 text-center"><GraduationCap className="mx-auto text-slate-300" size={30} /><p className="mt-3 text-sm font-bold text-slate-500">No teachers match this view.</p></div>}
        </div>
      </div>
    </section>
  );
};

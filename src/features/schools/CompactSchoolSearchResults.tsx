import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Building2,
  GraduationCap,
  MapPin,
  Menu,
  School,
  Search,
  Star,
  X,
} from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { db } from '../../services/firebase';
import { ResourceAdRail } from '../resources/ResourceAdRail';

const provinces = [
  'All provinces',
  'Bulawayo',
  'Harare',
  'Manicaland',
  'Mashonaland Central',
  'Mashonaland East',
  'Mashonaland West',
  'Masvingo',
  'Matabeleland North',
  'Matabeleland South',
  'Midlands',
];

const institutionTypes = [
  { id: 'primary', label: 'Primary Schools' },
  { id: 'high', label: 'High Schools' },
  { id: 'poly', label: 'Colleges' },
  { id: 'university', label: 'Universities' },
];

type SchoolData = {
  id: string;
  name: string;
  motto?: string;
  location?: string;
  province?: string;
  rating?: number;
  image?: string;
  type: string;
  isBoarding?: boolean;
  isDay?: boolean;
  fees?: string;
};

type Props = {
  onNavigate: (page: string, params?: any) => void;
};

export const CompactSchoolSearchResults: React.FC<Props> = ({ onNavigate }) => {
  const { type: routeType = 'high' } = useParams<{ type: string }>();
  const activeType = institutionTypes.some((item) => item.id === routeType) ? routeType : 'high';
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [province, setProvince] = useState('All provinces');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'rating'>('name');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setProvince('All provinces');
    setSearch('');
    setSort('name');
  }, [activeType]);

  useEffect(() => {
    setLoading(true);
    setSchools([]);
    resultsRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    const schoolsQuery = province === 'All provinces'
      ? query(collection(db, 'schools'), where('type', '==', activeType))
      : query(
          collection(db, 'schools'),
          where('type', '==', activeType),
          where('province', '==', province)
        );
    return onSnapshot(schoolsQuery, (snapshot) => {
      setSchools(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as SchoolData)));
      setLoading(false);
    }, () => setLoading(false));
  }, [activeType, province]);

  const visibleSchools = useMemo(() => schools.filter((school) => (
    (province === 'All provinces' || school.province === province)
    && `${school.name} ${school.location || ''} ${school.province || ''}`.toLowerCase().includes(search.trim().toLowerCase())
  )).sort((first, second) => (
    sort === 'rating'
      ? (second.rating || 0) - (first.rating || 0)
      : first.name.localeCompare(second.name)
  )), [province, schools, search, sort]);

  const typeLabel = institutionTypes.find((item) => item.id === activeType)?.label || 'Schools';
  const TypeIcon = activeType === 'primary' ? School : activeType === 'high' ? GraduationCap : Building2;

  return (
    <div className="flex h-[calc(100dvh_-_var(--app-header-h))] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b]">
      {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden" aria-label="Close school filters" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[286px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-white/10 dark:bg-[#0d0d12] lg:bottom-0 lg:top-16 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex h-[72px] items-center justify-between border-b border-slate-200 px-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-cyan-600 text-white"><School size={17} /></span>
            <div><p className="text-sm font-black text-slate-900 dark:text-white">School Finder</p><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Zimbabwe directory</p></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-[10px] p-2 text-slate-400 lg:hidden"><X size={17} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Institution type</p>
          <select
            value={activeType}
            onChange={(event) => onNavigate('schools/search', { type: event.target.value })}
            className="mb-5 w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {institutionTypes.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>

          <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Provinces</p>
          <div className="space-y-1">
            {provinces.map((item) => (
              <button key={item} onClick={() => { setProvince(item); setSidebarOpen(false); }} className={`w-full rounded-[11px] px-3 py-2.5 text-left text-xs font-bold ${province === item ? 'bg-cyan-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'}`}>{item}</button>
            ))}
          </div>
        </div>
      </aside>
      <div className="hidden w-[286px] shrink-0 lg:block" aria-hidden="true" />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300 lg:hidden"><Menu size={18} /></button>
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 lg:flex"><TypeIcon size={18} /></span>
            <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">{province}</p><h1 className="truncate text-lg font-black text-slate-900 dark:text-white">{typeLabel}</h1></div>
            <div className="relative hidden w-72 sm:block"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search institutions" className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>
            <select value={sort} onChange={(event) => setSort(event.target.value as 'name' | 'rating')} className="hidden rounded-[11px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300 md:block"><option value="name">Name A–Z</option><option value="rating">Highest rated</option></select>
          </div>
          <div className="relative mt-3 sm:hidden"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search institutions" className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>
        </header>

        <section ref={resultsRef} className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-4"><h2 className="font-black text-slate-900 dark:text-white">Registered institutions</h2><p className="text-xs text-slate-400">{visibleSchools.length} results</p></div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 2xl:grid-cols-3">{[1, 2, 3, 4].map((item) => <div key={item} className="h-72 animate-pulse rounded-3xl bg-white dark:bg-white/5" />)}</div>
          ) : visibleSchools.length ? (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {visibleSchools.map((school) => (
                <button key={school.id} onClick={() => onNavigate('schools/profile', { id: school.id, name: school.name, type: activeType })} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-md transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111]">
                  <div className="relative h-36 overflow-hidden bg-slate-200 md:h-44">
                    <img src={school.image || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=900'} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                    <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-black text-slate-700 backdrop-blur-sm"><Star size={10} className="fill-amber-400 text-amber-400" /> {(school.rating || 4.5).toFixed(1)}</span>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-cyan-600">{typeLabel}</p>
                    <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-900 dark:text-white md:text-base">{school.name}</h3>
                    <p className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400"><MapPin size={12} /> <span className="truncate">{school.location || school.province}</span></p>
                    <div className="mt-4 border-t border-slate-100 pt-3 text-[10px] font-black text-cyan-600 dark:border-white/10">View school profile</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]"><School className="mx-auto mb-3 text-slate-300" size={28} /><p className="font-black text-slate-700 dark:text-slate-200">No schools found</p><p className="mt-1 text-sm text-slate-400">Choose another province or institution type.</p></div>
          )}
        </section>
      </main>
      <ResourceAdRail />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Loader2, ShieldCheck, Bell, CheckCircle2, XCircle } from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface CalendarEvent {
  name: string;
  start: any;
  end: any;
  type: 'term' | 'holiday';
}

interface CalendarData {
  events: CalendarEvent[];
}

export const SchoolCalendar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'primary_high' | 'polytechnic' | 'university'>('primary_high');
  const [calendars, setCalendars] = useState<Record<string, CalendarData>>({
    primary_high: { events: [] },
    polytechnic: { events: [] },
    university: { events: [] }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getDoc(doc(db, 'config', 'school_calendars'))
      .then((snap) => {
        if (active && snap.exists()) setCalendars(snap.data() as Record<string, CalendarData>);
      })
      .catch((error) => {
        console.error('School calendar could not be loaded', error);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const getTodayStatus = (events: CalendarEvent[]) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const activeEvent = events.find(e => {
      const start = e.start?.toDate();
      const end = e.end?.toDate();
      return start && end && now >= start && now <= end;
    });

    if (events.length === 0) return { label: 'Dates not available', color: 'text-gray-600 bg-gray-100 border-gray-200', icon: XCircle };
    if (!activeEvent) return { label: 'No active term listed', color: 'text-gray-600 bg-gray-100 border-gray-200', icon: XCircle };
    if (activeEvent.type === 'holiday') return { label: `Holiday: ${activeEvent.name}`, color: 'text-[#ff7400] bg-[#ff7400]/10 border-[#ff7400]/20', icon: Bell };
    return { label: `Open: ${activeEvent.name}`, color: 'text-green-600 bg-green-50 border-green-100', icon: CheckCircle2 };
  };

  const currentYear = new Date().getFullYear();
  const activeEvents = (calendars[activeTab]?.events || []).filter((event) => {
    const start = event.start?.toDate?.();
    const end = event.end?.toDate?.();
    return start?.getFullYear() === currentYear || end?.getFullYear() === currentYear;
  });
  const status = getTodayStatus(activeEvents);
  const StatusIcon = status.icon;

  return (
    <section id="term-dates" className="relative overflow-hidden bg-[#fff6e9] px-4 py-20 text-left dark:bg-[#100b08] md:px-8">
      <div className="absolute inset-0 opacity-40 dark:opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(249,115,22,.24) 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-orange-900/20" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(280px,.8fr)_minmax(0,1.35fr)] lg:items-start">
        <div className="max-w-xl text-center lg:sticky lg:top-24 lg:text-left">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-300/70 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700 backdrop-blur-md dark:border-orange-500/30 dark:bg-white/5 dark:text-orange-300">
            <Calendar size={14} /> {currentYear} academic calendar
          </div>
          <h2 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] text-slate-950 dark:text-white md:text-7xl">
            Term dates
            <span className="mt-2 block text-orange-500">& holidays.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base font-medium leading-7 text-slate-600 dark:text-slate-400 lg:mx-0">
            Check the learning periods, breaks, and holidays currently listed for Zimbabwean schools and tertiary institutions.
          </p>

          <div className="mt-8 overflow-hidden rounded-[15px] border border-orange-200 bg-slate-950 p-5 text-white shadow-xl dark:border-white/10">
            {loading ? (
              <div className="flex h-28 items-center justify-center"><Loader2 className="animate-spin text-orange-400" /></div>
            ) : (
              <>
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                  <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/55"><Clock size={15} /> Today's status</span>
                  <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black ${status.color}`}>
                    <StatusIcon size={14} /> {status.label}
                  </span>
                </div>
                <div className="mt-8 flex items-end justify-between gap-5">
                  <div>
                    <p className="text-4xl font-black tracking-[-0.05em]">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/45">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric' })}</p>
                  </div>
                  <ShieldCheck className="shrink-0 text-orange-400" size={28} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-[15px] border border-orange-200/80 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#17110d]/95">
          <div className="border-b border-orange-100 p-3 dark:border-white/10">
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'primary_high', label: 'Schools' },
                { id: 'polytechnic', label: 'Polytechnics' },
                { id: 'university', label: 'Universities' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`rounded-[11px] px-2 py-3 text-[10px] font-black uppercase tracking-wide transition-colors sm:text-xs ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-md' : 'bg-orange-50 text-slate-500 hover:bg-orange-100 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-900 dark:text-white">
                <Calendar size={17} className="text-orange-500" /> Academic schedule
              </h3>
              <span className="text-[10px] font-bold text-slate-400">Listed dates</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {loading ? (
                [1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-[15px] bg-orange-50 dark:bg-white/5" />)
              ) : activeEvents.length > 0 ? (
                activeEvents.map((event, index) => {
                  const now = new Date();
                  now.setHours(0, 0, 0, 0);
                  const start = event.start?.toDate();
                  const end = event.end?.toDate();
                  const isActive = start && end && now >= start && now <= end;

                  return (
                    <article key={`${event.name}-${index}`} className={`relative overflow-hidden rounded-[15px] border p-5 transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:shadow-lg ${isActive ? 'border-orange-400 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/5'}`}>
                      <div className="flex items-center justify-between gap-3">
                        <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${event.type === 'holiday' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'}`}>
                          {event.type}
                        </span>
                        {isActive && <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-emerald-600"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Active</span>}
                      </div>
                      <h4 className="mt-4 truncate text-base font-black text-slate-900 dark:text-white">{event.name}</h4>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <span>{start?.toLocaleDateString('en-GB')}</span>
                        <ArrowRight size={12} className="text-orange-400" />
                        <span>{end?.toLocaleDateString('en-GB')}</span>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="col-span-full flex min-h-64 flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[15px] bg-orange-50 dark:bg-white/5"><Bell size={22} className="text-orange-300" /></div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No dates available for this section yet.</p>
                </div>
              )}
            </div>

            <p className="mt-5 flex gap-2 border-t border-slate-100 pt-4 text-[10px] font-medium leading-5 text-slate-400 dark:border-white/10">
              <ShieldCheck size={15} className="shrink-0 text-orange-500" /> Dates can change. Confirm the current calendar with the relevant government circular or institution before making plans.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

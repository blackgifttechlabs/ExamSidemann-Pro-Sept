import React, { useState, useEffect } from 'react';
import { 
    Calendar, Plus, Trash2, Save, X, Loader2, 
    ArrowLeft, CheckCircle, Clock, Info, ShieldCheck, 
    ChevronRight, AlertTriangle, List, RefreshCw
} from 'lucide-react';
import { db } from '../../services/firebase';
import { doc, onSnapshot, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

interface CalendarEvent {
  name: string;
  start: any;
  end: any;
  type: 'term' | 'holiday';
}

interface CalendarData {
  events: CalendarEvent[];
}

export const CalendarManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'primary_high' | 'polytechnic' | 'university'>('primary_high');
    const [calendars, setCalendars] = useState<Record<string, CalendarData>>({
      primary_high: { events: [] },
      polytechnic: { events: [] },
      university: { events: [] }
    });
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [showForm, setShowForm] = useState(false);
    const [eventName, setEventName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [eventType, setEventType] = useState<'term' | 'holiday'>('term');

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'config', 'school_calendars'), (snap) => {
            if (snap.exists()) {
                setCalendars(snap.data() as any);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleSaveCalendar = async (updatedEvents: CalendarEvent[]) => {
        setIsSaving(true);
        try {
            const newData = { ...calendars, [activeTab]: { events: updatedEvents }, updatedAt: serverTimestamp() };
            await setDoc(doc(db, 'config', 'school_calendars'), newData);
            alert("School dates updated successfully!");
        } catch (e) {
            console.error(e);
            alert("Error saving dates.");
        } finally {
            setIsSaving(false);
        }
    };

    const addEvent = () => {
        if (!eventName || !startDate || !endDate) return alert("Please fill in all the details.");
        const newEvent: CalendarEvent = {
            name: eventName,
            start: Timestamp.fromDate(new Date(startDate)),
            end: Timestamp.fromDate(new Date(endDate)),
            type: eventType
        };
        const updated = [...(calendars[activeTab]?.events || []), newEvent].sort((a,b) => a.start.seconds - b.start.seconds);
        handleSaveCalendar(updated);
        resetForm();
    };

    const deleteEvent = (index: number) => {
        if (!confirm("Remove this entry from the calendar?")) return;
        const updated = calendars[activeTab].events.filter((_, i) => i !== index);
        handleSaveCalendar(updated);
    };

    const resetForm = () => {
        setEventName('');
        setStartDate('');
        setEndDate('');
        setEventType('term');
        setShowForm(false);
    };

    return (
        <div className="space-y-8 animate-dropdown-reveal text-left">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-[#111] p-8 border-2 border-gray-200 dark:border-white/5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/10 text-purple-600 flex items-center justify-center shadow-inner"><Calendar size={28}/></div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">School dates and holidays</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update dates for everyone</p>
                    </div>
                </div>
                <div className="flex bg-gray-50 dark:bg-[#1a1a1a] p-1 border border-gray-200 dark:border-white/10 rounded-none w-full lg:w-auto">
                    {[
                        { id: 'primary_high', label: 'Primary/High' },
                        { id: 'polytechnic', label: 'Polytechnic' },
                        { id: 'university', label: 'University' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 lg:flex-none px-6 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Manager Side */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-[#161616] p-6 border border-gray-200 dark:border-[#222] shadow-sm space-y-6">
                        <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm border-b dark:border-white/5 pb-4">Add new dates</h3>
                        
                        {!showForm ? (
                            <button 
                                onClick={() => setShowForm(true)}
                                className="w-full py-4 bg-[#003153] hover:bg-blue-800 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all"
                            >
                                <Plus size={18}/> New term or holiday
                            </button>
                        ) : (
                            <div className="space-y-4 animate-dropdown-reveal">
                                <div>
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">What is the event name?</label>
                                    <input className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 p-3 text-sm outline-none focus:border-purple-600 text-gray-900 dark:text-white" placeholder="e.g. Term 1 2025" value={eventName} onChange={e => setEventName(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">When does it start?</label>
                                        <input type="date" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 p-3 text-xs outline-none text-gray-900 dark:text-white" value={startDate} onChange={e => setStartDate(e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">When does it end?</label>
                                        <input type="date" className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 p-3 text-xs outline-none text-gray-900 dark:text-white" value={endDate} onChange={e => setEndDate(e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Is it a term or holiday?</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setEventType('term')} className={`flex-1 py-2 text-[9px] font-black uppercase border-2 transition-all ${eventType === 'term' ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'text-gray-500 border-gray-200 dark:border-white/5 hover:border-blue-600'}`}>School Term</button>
                                        <button onClick={() => setEventType('holiday')} className={`flex-1 py-2 text-[9px] font-black uppercase border-2 transition-all ${eventType === 'holiday' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'text-gray-500 border-gray-200 dark:border-white/5 hover:border-red-600'}`}>Public Holiday</button>
                                    </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                    <button onClick={addEvent} className="flex-1 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">Save entry</button>
                                    <button onClick={resetForm} className="px-4 py-3 bg-gray-100 dark:bg-white/5 text-gray-500 rounded-none"><X size={18}/></button>
                                </div>
                            </div>
                        )}

                        <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-500">
                             <h4 className="text-[10px] font-black text-orange-800 dark:text-orange-400 uppercase mb-1">Live updates</h4>
                             <p className="text-[9px] text-orange-700/80 leading-relaxed font-bold uppercase tracking-tight">The calendar on the home page updates instantly. Today's status will change automatically based on the dates you set.</p>
                        </div>
                    </div>
                </div>

                {/* Registry View */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-[#161616] p-6 border border-gray-200 dark:border-[#222] shadow-sm min-h-[500px]">
                        <div className="flex justify-between items-center mb-8 border-b dark:border-white/5 pb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white uppercase text-sm">Currently listed dates</h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest">{calendars[activeTab]?.events?.length || 0} items</span>
                        </div>

                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center opacity-30">
                                <Loader2 className="animate-spin text-purple-600 mb-4" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Loading...</p>
                            </div>
                        ) : calendars[activeTab]?.events?.length > 0 ? (
                            <div className="space-y-3">
                                {calendars[activeTab].events.map((event, idx) => {
                                    const start = event.start?.toDate();
                                    const end = event.end?.toDate();
                                    return (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 group hover:border-purple-600 transition-all">
                                            <div className={`p-2 rounded-none border-2 shrink-0 ${event.type === 'holiday' ? 'text-[#ff7400] border-red-500/20' : 'text-blue-500 border-blue-500/20'}`}>
                                                <Calendar size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0 text-left">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate tracking-tight">{event.name}</h4>
                                                <p className="text-[10px] text-gray-500 font-bold tracking-widest">
                                                    {start?.toLocaleDateString()} — {end?.toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button onClick={() => deleteEvent(idx)} className="p-2 text-gray-400 hover:text-[#ff7400] opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-32 text-center opacity-30 border-2 border-dashed border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-4">
                                <Clock size={40} />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No dates found in this category</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
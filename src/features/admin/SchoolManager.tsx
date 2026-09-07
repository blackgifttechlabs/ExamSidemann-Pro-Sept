import React, { useState, useEffect } from 'react';
import { 
    School, Building2, Plus, Search, MapPin, Star, Edit3, Trash2, 
    ArrowLeft, Globe, ChevronRight, CheckCircle, Loader2, Save, Send, 
    X, Sparkles, Building, GraduationCap, BookMarked, Eye, AudioLines, Brain, Accessibility,
    LayoutGrid, List, Rocket, Repeat, AlertTriangle
} from 'lucide-react';
import { db } from '../../services/firebase';
import { 
    collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch, query, where, getDoc
} from 'firebase/firestore';
import { generateSchoolInfo, generateBulkSchoolsInfo } from '../../services/ai';

type SchoolType = 'primary' | 'high' | 'poly' | 'university' | 'blind' | 'deaf' | 'autism' | 'physical';

const SCHOOL_CATEGORIES = [
    { id: 'primary', label: 'Primary Schools', icon: School },
    { id: 'high', label: 'High Schools', icon: GraduationCap },
    { id: 'poly', label: 'Polytechnics', icon: Building2 },
    { id: 'university', label: 'Universities', icon: BookMarked },
    { id: 'blind', label: 'Blind & Visually Impaired', icon: Eye },
    { id: 'deaf', label: 'Deaf & Hearing Impaired', icon: AudioLines },
    { id: 'autism', label: 'Intellectual & Autism', icon: Brain },
    { id: 'physical', label: 'Physical Disabilities', icon: Accessibility }
];

const ZIM_PROVINCES = [
    'Bulawayo', 'Harare', 'Manicaland', 'Mashonaland Central', 
    'Mashonaland East', 'Mashonaland West', 'Masvingo', 
    'Matabeleland North', 'Matabeleland South', 'Midlands'
];

export const SchoolManager: React.FC = () => {
    const [step, setStep] = useState<'category' | 'province' | 'registry'>('category');
    const [selectedCategory, setSelectedCategory] = useState<SchoolType | null>(null);
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    
    const [schools, setSchools] = useState<any[]>([]);
    const [isAddingSchool, setIsAddingSchool] = useState(false);
    const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
    const [schoolSearch, setSchoolSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [isGeneratingSchool, setIsGeneratingSchool] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [schoolDrafts, setSchoolDrafts] = useState<any[]>([]);
    const [dbError, setDbError] = useState<string | null>(null);
    const [opStatus, setOpStatus] = useState<string>('');

    const [schoolForm, setSchoolForm] = useState({
        name: '', motto: '', location: '', province: '', type: '' as SchoolType, rating: 4.5, ratingsCount: 10,
        curriculums: [] as string[], phone: '', email: '', website: '', isBoarding: true, isDay: true,
        hasResidence: false, fees: { amount: 500, currency: 'USD', period: 'Term' },
        description: '', image: '', allowEdits: true, coordinates: { lat: -17.8252, lng: 31.0335 },
        sources: [] as string[]
    });

    // Optimized Listener: Fetches only relevant data to save quota
    useEffect(() => {
        if (step === 'registry' && selectedCategory && selectedProvince) {
            console.log(`Setting up listener for: ${selectedCategory} in ${selectedProvince}`);
            setLoading(true);
            setDbError(null);
            
            const q = query(
                collection(db, 'schools'),
                where('type', '==', selectedCategory),
                where('province', '==', selectedProvince)
            );

            const unsubSchools = onSnapshot(q, (snap) => {
                setSchools(snap.docs.map(d => ({ id: d.id, ...d.data() })));
                setLoading(false);
                console.log(`Snapshot updated. Total schools in view: ${snap.size}`);
            }, (err) => {
                console.error("FIRESTORE ERROR:", err);
                if (err.message.includes("requires an index")) {
                    setDbError("This view requires a Firestore index. Please click the link in your Firebase console to create it.");
                } else {
                    setDbError(err.message);
                }
                setLoading(false);
            });

            return () => unsubSchools();
        }
    }, [step, selectedCategory, selectedProvince]);

    const handleSaveSchool = async () => {
        if (!schoolForm.name || !schoolForm.location) return alert("Name and Location are required.");
        
        setLoading(true);
        setOpStatus('Saving record...');
        setDbError(null);
        try {
            const finalData = { 
                ...schoolForm, 
                type: selectedCategory, 
                province: selectedProvince,
                updatedAt: serverTimestamp() 
            };

            if (editingSchoolId) {
                console.log("Updating document:", editingSchoolId);
                await updateDoc(doc(db, 'schools', editingSchoolId), finalData);
            } else {
                console.log("Creating new document...");
                await addDoc(collection(db, 'schools'), { ...finalData, createdAt: serverTimestamp() });
            }
            setIsAddingSchool(false);
            resetSchoolForm();
            setOpStatus('');
        } catch (e: any) { 
            console.error("SAVE ERROR:", e); 
            setDbError(e.message);
            setOpStatus('');
        }
        setLoading(false);
    };

    const handleTransferTo = async (targetType: SchoolType) => {
        if (!editingSchoolId) {
            console.error("Transfer failed: No editingSchoolId found");
            return;
        }
        
        console.log("--- STARTING TRANSFER (SEED & DELETE) ---");
        console.log("Source ID:", editingSchoolId);
        console.log("Target Category:", targetType);
        
        if (confirm(`Move this institution to the ${targetType} category? This will re-register it and delete the old entry.`)) {
            setLoading(true);
            setDbError(null);
            
            try {
                // PHASE 1: PREP DATA
                setOpStatus('Preparing institutional data...');
                console.log("1/4 Preparing data for clone...");
                const cloneData = { ...schoolForm };
                
                // PHASE 2: SEED NEW DOC
                setOpStatus(`Seeding into ${targetType} registry...`);
                console.log("2/4 Seeding new document...");
                const newDocRef = await addDoc(collection(db, 'schools'), {
                    ...cloneData,
                    type: targetType,
                    province: selectedProvince,
                    updatedAt: serverTimestamp(),
                    createdAt: serverTimestamp(),
                    transferSource: editingSchoolId
                });
                console.log("Success: New document created with ID:", newDocRef.id);

                // PHASE 3: DELETE OLD DOC
                setOpStatus('Deleting old registry entry...');
                console.log("3/4 Deleting original record...");
                await deleteDoc(doc(db, 'schools', editingSchoolId));
                console.log("Success: Original record deleted.");

                // PHASE 4: CLEANUP
                setOpStatus('Finalizing...');
                console.log("4/4 Transfer complete. Cleaning up state.");
                alert(`Successfully moved to ${targetType} schools.`);
                
                setIsAddingSchool(false);
                resetSchoolForm();
                setStep('category'); // Go back to refresh snapshots correctly
            } catch (e: any) {
                console.error("CRITICAL TRANSFER ERROR:", e);
                setDbError(`Transfer Process Failed: ${e.message}`);
                alert(`Database Error: ${e.message}`);
            } finally {
                setLoading(false);
                setOpStatus('');
            }
        }
    };

    const handleGenerateSchoolAi = async () => {
        if (!schoolForm.name || !selectedCategory || !selectedProvince) return alert("Enter school name first.");
        setIsGeneratingSchool(true);
        try {
            const data = await generateSchoolInfo(schoolForm.name, selectedCategory, selectedProvince);
            if (data) {
                // Fix: Destructure fees from AI data to handle assignment to strict mandatory types and avoid spread conflicts
                const { fees, ...restOfData } = data as any;
                // Corrected: Use functional update and ensure fees object has all required properties
                setSchoolForm(prev => ({ 
                    ...prev, 
                    ...restOfData,
                    fees: {
                        amount: fees?.amount ?? prev.fees.amount,
                        currency: fees?.currency ?? prev.fees.currency,
                        period: fees?.period ?? prev.fees.period
                    }
                }));
            }
        } catch (e) {
            console.error("AI Generation error", e);
        } finally {
            setIsGeneratingSchool(false);
        }
    };

    const handleFetchBulkSuggestions = async () => {
        if (!selectedCategory || !selectedProvince) return;
        setIsSuggesting(true);
        const existingNames = schools.map(s => s.name);
        const results = await generateBulkSchoolsInfo(selectedCategory, selectedProvince, existingNames);
        
        const processed = results.map((r: any) => ({
            ...r,
            province: selectedProvince,
            type: selectedCategory,
            rating: 4.5,
            ratingsCount: 5,
            // Corrected: Ensure fees object has all required properties
            fees: {
                amount: r.fees?.amount ?? 500,
                currency: r.fees?.currency ?? 'USD',
                period: r.fees?.period ?? 'Term'
            },
            allowEdits: true
        }));

        setSchoolDrafts(prev => [...prev, ...processed]);
        setIsSuggesting(false);
    };

    const handlePublishAllDrafts = async () => {
        if (schoolDrafts.length === 0) return;
        setLoading(true);
        try {
            const batch = writeBatch(db);
            const schoolsRef = collection(db, 'schools');
            schoolDrafts.forEach(draft => {
                const newDocRef = doc(schoolsRef);
                batch.set(newDocRef, { ...draft, createdAt: serverTimestamp() });
            });
            await batch.commit();
            setSchoolDrafts([]);
            alert("Drafts Published!");
        } catch (e: any) { 
            console.error(e); 
            setDbError(e.message);
        }
        setLoading(false);
    };

    const resetSchoolForm = () => {
        setSchoolForm({
            name: '', motto: '', location: '', province: '', type: '' as SchoolType, rating: 4.5, ratingsCount: 10,
            curriculums: [], phone: '', email: '', website: '', isBoarding: true, isDay: true,
            hasResidence: false, fees: { amount: 500, currency: 'USD', period: 'Term' },
            description: '', image: '', allowEdits: true, coordinates: { lat: -17.8252, lng: 31.0335 },
            sources: []
        });
        setEditingSchoolId(null);
    };

    const handleDeleteSchool = async (id: string) => {
        if (confirm("Permanently delete this institution?")) {
            await deleteDoc(doc(db, 'schools', id));
        }
    };

    if (step === 'category') {
        return (
            <div className="space-y-10 animate-dropdown-reveal">
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Institution Category</h2>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Step 1/3</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {SCHOOL_CATEGORIES.map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => { setSelectedCategory(cat.id as SchoolType); setStep('province'); }}
                            className="group aspect-square bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 flex flex-col items-center justify-center p-8 transition-all hover:border-[#003153] hover:bg-[#003153]/5 rounded-none shadow-sm"
                        >
                            <cat.icon size={48} className="text-gray-400 group-hover:text-[#003153] transition-colors mb-4" />
                            <span className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white text-center">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (step === 'province') {
        return (
            <div className="space-y-10 animate-dropdown-reveal">
                <div className="flex items-center gap-4 text-left">
                    <button onClick={() => setStep('category')} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"><ArrowLeft size={24}/></button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Select Province</h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Registry Step 2/3 for {SCHOOL_CATEGORIES.find(c => c.id === selectedCategory)?.label}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {ZIM_PROVINCES.map(prov => (
                        <button 
                            key={prov} 
                            onClick={() => { setSelectedProvince(prov); setStep('registry'); }}
                            className="h-24 bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 flex items-center justify-center font-black uppercase tracking-widest text-[11px] text-gray-900 dark:text-white hover:bg-[#003153] hover:text-white hover:border-[#003153] transition-all rounded-none shadow-sm"
                        >
                            {prov}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-dropdown-reveal relative">
            {/* DB ERROR LOG DISPLAY */}
            {dbError && (
                <div className="bg-[#ff7400]/10 dark:bg-red-900/20 border-2 border-red-500 p-4 flex items-center gap-3 animate-dropdown-reveal">
                    <AlertTriangle className="text-[#ff7400] shrink-0" />
                    <div className="flex-1">
                        <p className="text-xs font-black text-[#ff7400] dark:text-red-400 uppercase tracking-widest">Database Error Log</p>
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">{dbError}</p>
                    </div>
                    <button onClick={() => setDbError(null)} className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"><X size={16} /></button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white dark:bg-[#111] p-6 md:p-8 border-2 border-gray-200 dark:border-white/5 text-left shadow-sm">
                <div className="flex items-center gap-4 md:gap-6">
                    <button onClick={() => setStep('province')} className="p-3 bg-gray-100 dark:bg-white/5 rounded-none hover:bg-[#003153] hover:text-white transition-colors border border-gray-200 dark:border-white/10"><ArrowLeft size={24}/></button>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white uppercase leading-none mb-1">{selectedCategory?.replace('_', ' ')} Registry</h2>
                        <p className="text-xs font-bold text-[#003153] uppercase tracking-widest">{selectedProvince} Province • {schools.length} Total</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                    <button onClick={handleFetchBulkSuggestions} disabled={isSuggesting} className="flex-1 lg:flex-none px-6 py-3 bg-[#003153]/5 dark:bg-[#003153]/20 border-2 border-[#003153]/30 text-[#003153] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#003153] hover:text-white transition-all disabled:opacity-30 rounded-none">
                        {isSuggesting ? <Loader2 className="animate-spin" size={16}/> : <><Sparkles size={16}/> AI Discover</>}
                    </button>
                    <button onClick={() => { resetSchoolForm(); setIsAddingSchool(true); }} className="flex-1 lg:flex-none px-8 py-3 bg-[#003153] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg rounded-none">
                        <Plus size={18}/> Register New
                    </button>
                </div>
            </div>

            {schoolDrafts.length > 0 && (
                <div className="bg-[#003153]/5 dark:bg-[#003153]/10 border-2 border-[#003153]/10 p-6 md:p-8 space-y-6 animate-dropdown-reveal text-left">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase flex items-center gap-2"><Rocket size={20}/> Staging Area ({schoolDrafts.length})</h3>
                        <button onClick={handlePublishAllDrafts} className="px-6 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-none shadow-md">Publish Staged</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {schoolDrafts.map((draft, idx) => (
                            <div key={idx} className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-white/5 p-4 relative group rounded-none shadow-sm">
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase truncate">{draft.name}</h4>
                                <p className="text-[10px] text-gray-500 uppercase mt-1">{draft.location}</p>
                                <button onClick={() => setSchoolDrafts(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-gray-300 hover:text-[#ff7400] opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="relative text-left">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input className="w-full bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 pl-12 text-sm text-gray-900 dark:text-white outline-none focus:border-[#003153] rounded-none shadow-sm" placeholder="Search within this registry..." value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                        <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Querying Global Registry...</p>
                    </div>
                ) : schools.filter(s => s.name.toLowerCase().includes(schoolSearch.toLowerCase())).map(s => (
                    <div key={s.id} className="aspect-square bg-white dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-6 flex flex-col group relative transition-all hover:border-[#003153] rounded-none shadow-sm">
                        <div className="mb-auto">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight line-clamp-2">{s.name}</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 flex items-center gap-1"><MapPin size={10}/> {s.location}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t-2 border-gray-100 dark:border-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-1 text-yellow-500 font-black text-xs"><Star size={12} className="fill-current"/> {s.rating?.toFixed(1) || '0.0'}</div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { 
                                    setEditingSchoolId(s.id); 
                                    // Corrected: Explicitly destructure to handle fees mapping separately from spread to ensure required props are set
                                    const { fees, ...schoolProps } = s;
                                    setSchoolForm({
                                        ...schoolForm, 
                                        ...schoolProps,
                                        fees: {
                                            amount: fees?.amount ?? 500,
                                            currency: fees?.currency ?? 'USD',
                                            period: fees?.period ?? 'Term'
                                        }
                                    }); 
                                    setIsAddingSchool(true); 
                                }} className="p-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-none hover:bg-blue-600 hover:text-white transition-all border border-blue-600/20"><Edit3 size={16}/></button>
                                <button onClick={() => handleDeleteSchool(s.id)} className="p-2 bg-red-600/10 text-[#ff7400] dark:text-red-400 rounded-none hover:bg-red-600 hover:text-white transition-all border border-red-600/20"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`fixed inset-0 z-[120] transition-transform duration-500 ease-in-out ${isAddingSchool ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddingSchool(false)}></div>
                <div className="absolute right-0 top-0 bottom-0 w-full md:w-[85vw] lg:w-[70vw] bg-white dark:bg-[#0a0a0a] border-l-2 border-gray-200 dark:border-white/10 flex flex-col shadow-2xl">
                    <header className="h-20 border-b-2 border-gray-200 dark:border-white/5 px-6 md:px-8 flex items-center justify-between bg-white dark:bg-[#111] shrink-0 sticky top-0 z-50">
                        <div className="flex items-center gap-4 min-w-0">
                            <button onClick={() => setIsAddingSchool(false)} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={28}/></button>
                            <h3 className="text-lg md:text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">{editingSchoolId ? 'Update Registry' : 'New Registration'}</h3>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4 shrink-0">
                             <button onClick={handleGenerateSchoolAi} disabled={isGeneratingSchool || !schoolForm.name} className="hidden md:flex px-6 py-2 bg-blue-600 text-white font-black text-[10px] lg:text-xs uppercase tracking-widest items-center gap-2 shadow-md disabled:opacity-40 rounded-none transition-all">
                                {isGeneratingSchool ? <Loader2 className="animate-spin" size={14}/> : <><Sparkles size={14}/> AI Search</>}
                            </button>
                            <button onClick={handleSaveSchool} disabled={loading} className="px-6 md:px-10 py-2 bg-[#003153] text-white font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2 rounded-none transition-all">
                                {loading ? <Loader2 className="animate-spin" size={14}/> : <><Save size={14}/> {editingSchoolId ? 'Save Changes' : 'Publish'}</>}
                            </button>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar text-left">
                        <div className="max-w-4xl mx-auto space-y-10">
                            
                            {/* STATUS FEED FOR OPERATIONS */}
                            {loading && opStatus && (
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest flex items-center gap-3 animate-pulse">
                                    <Loader2 className="animate-spin" size={18} />
                                    {opStatus}
                                </div>
                            )}

                            {/* Transfer Registry Panel */}
                            {editingSchoolId && (
                                <section className="p-6 bg-orange-50 dark:bg-orange-900/10 border-2 border-orange-500/30 flex flex-col md:flex-row items-center justify-between gap-6 animate-dropdown-reveal rounded-none shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-orange-500 text-white rounded-none shadow-lg shrink-0"><Repeat size={20}/></div>
                                        <div>
                                            <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm">Transfer Document</h4>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Seeds record to new category & deletes old entry.</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleTransferTo('primary')}
                                            disabled={loading || schoolForm.type === 'primary'}
                                            className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-black text-[9px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all disabled:opacity-30 rounded-none shadow-sm"
                                        >
                                            Move to Primary
                                        </button>
                                        <button 
                                            onClick={() => handleTransferTo('high')}
                                            disabled={loading || schoolForm.type === 'high'}
                                            className="flex-1 md:flex-none px-4 py-2.5 bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 font-black text-[9px] uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all disabled:opacity-30 rounded-none shadow-sm"
                                        >
                                            Move to High
                                        </button>
                                    </div>
                                </section>
                            )}

                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-[#003153] dark:text-blue-400 uppercase tracking-[0.3em]">Basic Identity</h4>
                                    <div><label className="block text-[9px] font-black text-gray-500 uppercase mb-2">Institution Name</label><input className="w-full bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white focus:border-[#003153] outline-none rounded-none transition-all" value={schoolForm.name} onChange={e => setSchoolForm({...schoolForm, name: e.target.value})} /></div>
                                    <div><label className="block text-[9px] font-black text-gray-500 uppercase mb-2">Motto</label><input className="w-full bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white focus:border-[#003153] outline-none rounded-none transition-all" value={schoolForm.motto} onChange={e => setSchoolForm({...schoolForm, motto: e.target.value})} /></div>
                                    <div><label className="block text-[9px] font-black text-gray-500 uppercase mb-2">Location Suburb</label><input className="w-full bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white focus:border-[#003153] outline-none rounded-none transition-all" value={schoolForm.location} onChange={e => setSchoolForm({...schoolForm, location: e.target.value})} /></div>
                                </div>
                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-[#003153] dark:text-blue-400 uppercase tracking-[0.3em]">Institutional Specs</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => setSchoolForm({...schoolForm, isBoarding: !schoolForm.isBoarding})} className={`p-4 border-2 text-[9px] font-black uppercase transition-all rounded-none ${schoolForm.isBoarding ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-transparent border-gray-200 dark:border-white/5 text-gray-500 hover:border-[#003153]'}`}>Boarding</button>
                                        <button onClick={() => setSchoolForm({...schoolForm, isDay: !schoolForm.isDay})} className={`p-4 border-2 text-[9px] font-black uppercase transition-all rounded-none ${schoolForm.isDay ? 'bg-green-600 border-green-600 text-white shadow-md' : 'bg-transparent border-gray-200 dark:border-white/5 text-gray-500 hover:border-[#003153]'}`}>Day</button>
                                    </div>
                                    {/* Fix: Ensured fees object is spread properly without using optional logic that confuses TS */}
                                    <div><label className="block text-[9px] font-black text-gray-500 uppercase mb-2">Fees per {schoolForm.fees.period || 'Term'}</label><input type="number" className="w-full bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white focus:border-[#003153] outline-none rounded-none transition-all" value={schoolForm.fees.amount || 0} onChange={e => setSchoolForm({...schoolForm, fees: { ...schoolForm.fees, amount: Number(e.target.value) }})} /></div>
                                    <div><label className="block text-[9px] font-black text-gray-500 uppercase mb-2">Image URL</label><input className="w-full bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white focus:border-[#003153] outline-none rounded-none transition-all" value={schoolForm.image} onChange={e => setSchoolForm({...schoolForm, image: e.target.value})} /></div>
                                </div>
                            </section>
                            <section>
                                <h4 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mb-4">Institutional Summary</h4>
                                <textarea className="w-full h-40 bg-gray-50 dark:bg-[#111] border-2 border-gray-200 dark:border-white/5 p-6 text-sm text-gray-900 dark:text-white outline-none focus:border-[#003153] resize-none rounded-none transition-all shadow-inner" placeholder="Enter a comprehensive description..." value={schoolForm.description} onChange={e => setSchoolForm({...schoolForm, description: e.target.value})} />
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight, Loader2, Filter, School, Building2, BookMarked, GraduationCap, Globe, ChevronLeft, LayoutGrid, List, ArrowLeft, Eye, AudioLines, Brain, Accessibility, Navigation, SortAsc, SortDesc, ListFilter, Map as MapIcon, Sparkles, Heart, Clock, User } from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ZIM_PROVINCES = [
    'Bulawayo', 'Harare', 'Manicaland', 'Mashonaland Central', 
    'Mashonaland East', 'Mashonaland West', 'Masvingo', 
    'Matabeleland North', 'Matabeleland South', 'Midlands'
];

const ZIM_DISTRICTS: Record<string, string[]> = {
    'Bulawayo': ['Bulawayo'],
    'Harare': ['Harare', 'Chitungwiza', 'Epworth'],
    'Manicaland': ['Buhera', 'Chimanimani', 'Chipinge', 'Makoni', 'Mutare', 'Mutasa', 'Nyanga'],
    'Mashonaland Central': ['Bindura', 'Guruve', 'Mazowe', 'Mbire', 'Mt Darwin', 'Muzarabani', 'Rushinga', 'Shamva'],
    'Mashonaland East': ['Chikomba', 'Goromonzi', 'Marondera', 'Mudzi', 'Murehwa', 'Mutoko', 'Seke', 'Uzumba-Maramba-Pfungwe', 'Wedza'],
    'Mashonaland West': ['Chegutu', 'Hurungwe', 'Kariba', 'Makonde', 'Mhondoro-Ngezi', 'Sanyati', 'Zvimba'],
    'Masvingo': ['Bikita', 'Chiredzi', 'Chivi', 'Gutu', 'Masvingo', 'Mwenezi', 'Zaka'],
    'Matabeleland North': ['Binga', 'Bubi', 'Hwange', 'Lupane', 'Nkayi', 'Tsholotsho', 'Umguza'],
    'Matabeleland South': ['Beitbridge', 'Bulilima', 'Gwanda', 'Insiza', 'Mangwe', 'Matobo', 'Umzingwane'],
    'Midlands': ['Chirumhanzu', 'Gokwe North', 'Gokwe South', 'Gweru', 'Kwekwe', 'Mberengwa', 'Shurugwi', 'Zvishavane']
};

interface SchoolData {
    id: string;
    name: string;
    motto: string;
    location: string;
    province: string;
    rating: number;
    image?: string;
    type: string;
    isBoarding: boolean;
    isDay: boolean;
    fees?: string;
}

interface Props {
    type?: string;
    onNavigate: (page: string, params?: any) => void;
}

export const SchoolSearchResults: React.FC<Props> = ({ type = 'high', onNavigate }) => {
    const [schools, setSchools] = useState<SchoolData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
    const [sortBy, setSortBy] = useState<'name_asc' | 'name_desc' | 'rating_desc'>('name_asc');

    useEffect(() => {
        window.scrollTo(0, 0);
        setSelectedDistrict('All');
    }, [selectedProvince]);

    useEffect(() => {
        if (!selectedProvince) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const q = query(
            collection(db, 'schools'), 
            where('type', '==', type),
            where('province', '==', selectedProvince)
        );
        const unsub = onSnapshot(q, (snap) => {
            setSchools(snap.docs.map(d => ({ id: d.id, ...d.data() } as SchoolData)));
            setLoading(false);
        });
        return () => unsub();
    }, [type, selectedProvince]);

    const getProcessedSchools = () => {
        let filtered = schools.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                s.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDistrict = selectedDistrict === 'All' || s.location.toLowerCase().includes(selectedDistrict.toLowerCase());
            return matchesSearch && matchesDistrict;
        });

        return filtered.sort((a, b) => {
            if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
            if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
            if (sortBy === 'rating_desc') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });
    };

    const processedSchools = getProcessedSchools();

    const getIcon = () => {
        switch(type) {
            case 'primary': return School;
            case 'high': return GraduationCap;
            case 'poly': return Building2;
            case 'university': return BookMarked;
            case 'blind': return Eye;
            case 'deaf': return AudioLines;
            case 'autism': return Brain;
            case 'physical': return Accessibility;
            default: return GraduationCap;
        }
    };

    const CategoryIcon = getIcon();

    if (!selectedProvince) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-sans overflow-x-hidden text-left transition-colors duration-500">
                {/* Hero Section */}
                <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center overflow-hidden">
                    <motion.div 
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1523050853064-95246453b93b?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-full object-cover grayscale-[20%]"
                            alt="Academic Background"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/40 to-[#050505]"></div>
                    </motion.div>

                    <div className="relative z-10 text-center px-6 max-w-5xl">
                        <motion.button 
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            onClick={() => onNavigate('home')}
                            className="absolute -top-32 left-0 md:-top-40 md:left-10 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-all text-[10px] font-black tracking-widest bg-white/5 backdrop-blur-xl px-5 py-2.5 border border-white/10 rounded-full hover:bg-white/10"
                        >
                            <ArrowLeft size={16} /> Exit Search
                        </motion.button>

                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600 text-white text-[10px] font-black tracking-[0.3em] mb-8 shadow-2xl rounded-full"
                        >
                           <Navigation size={14} fill="currentColor" className="animate-pulse" /> Location Required
                        </motion.div>

                        <motion.h1 
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-5xl md:text-9xl font-black text-white tracking-tighter leading-none mb-6 uppercase"
                        >
                            Select <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Province</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.8 }}
                            transition={{ delay: 0.6 }}
                            className="text-gray-300 max-w-2xl mx-auto text-sm md:text-xl font-bold tracking-[0.2em]"
                        >
                            Browsing <span className="text-blue-400">{type}</span> across Zimbabwe.
                        </motion.p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 pb-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {ZIM_PROVINCES.map((prov, idx) => (
                            <motion.button 
                                key={prov}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                                whileHover={{ 
                                    scale: 1.05, 
                                    y: -5,
                                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.3)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedProvince(prov)}
                                className="group relative h-32 md:h-48 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center transition-all hover:border-blue-500 hover:bg-blue-500/5 rounded-3xl overflow-hidden shadow-lg"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <MapIcon size={24} className="mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                <span className="text-xs md:text-sm font-black tracking-[0.2em] text-center px-4 leading-tight text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-white transition-colors uppercase">
                                    {prov}
                                </span>
                                
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                    <ArrowRight size={18} className="text-blue-500" />
                                </div>

                                {/* Subtle background text */}
                                <div className="absolute -bottom-4 -left-4 text-6xl font-black text-gray-100 dark:text-white/5 pointer-events-none select-none group-hover:text-blue-500/10 transition-colors">
                                    {prov[0]}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] pb-24 font-sans text-left">
            <div className="bg-white/80 dark:bg-[#111]/80 border-b border-gray-200 dark:border-[#222] py-6 md:py-8 px-4 md:px-10 sticky top-16 z-30 shadow-sm backdrop-blur-md">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setSelectedProvince(null)} className="p-3 bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-[#003153] transition-all border border-transparent dark:border-white/5 rounded-none"><ChevronLeft size={24} /></button>
                            <div className="min-w-0">
                                <span className="text-[9px] font-black text-[#003153] tracking-[0.2em] mb-1 block truncate">
                                    {type} • {selectedProvince} • {processedSchools.length} Registered
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tighter flex items-center gap-3">
                                    <CategoryIcon size={32} className="text-[#003153] shrink-0" />
                                    <span className="truncate">Institutions</span>
                                    <span className="ml-2 px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-[10px] md:text-xs font-black rounded-none shadow-lg">
                                        {processedSchools.length}
                                    </span>
                                </h1>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
                            <div className="relative flex-1 lg:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input className="w-full pl-12 pr-4 py-3.5 bg-gray-100 dark:bg-[#1a1a1a] border border-transparent focus:border-gray-300 dark:focus:border-white/20 text-sm outline-none transition-all shadow-inner text-gray-900 dark:text-white rounded-none" placeholder="Search by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="relative shrink-0">
                                <select 
                                    className="h-full w-full sm:w-48 pl-4 pr-10 py-3.5 bg-gray-100 dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-[#333] text-xs font-black tracking-widest outline-none focus:border-blue-600 appearance-none rounded-none text-gray-700 dark:text-gray-200"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                >
                                    <option value="name_asc">Name (A-Z)</option>
                                    <option value="name_desc">Name (Z-A)</option>
                                    <option value="rating_desc">Highest Rated</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    {sortBy === 'rating_desc' ? <Star size={14} /> : <SortAsc size={14} />}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar py-2">
                        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-gray-200 dark:border-white/10 mr-2">
                            <ListFilter size={14} className="text-gray-400" />
                            <span className="text-[10px] font-black tracking-widest text-gray-400">District</span>
                        </div>
                        <button 
                            onClick={() => setSelectedDistrict('All')}
                            className={`px-6 py-2 border-2 text-[10px] font-black tracking-widest whitespace-nowrap transition-all rounded-none ${selectedDistrict === 'All' ? 'bg-[#003153] text-white border-[#003153]' : 'bg-transparent text-gray-500 border-gray-100 dark:border-white/5 hover:border-blue-600'}`}
                        >
                            All Districts
                        </button>
                        {ZIM_DISTRICTS[selectedProvince]?.map(district => (
                            <button 
                                key={district}
                                onClick={() => setSelectedDistrict(district)}
                                className={`px-6 py-2 border-2 text-[10px] font-black tracking-widest whitespace-nowrap transition-all rounded-none ${selectedDistrict === district ? 'bg-[#003153] text-white border-[#003153]' : 'bg-transparent text-gray-500 border-gray-100 dark:border-white/5 hover:border-blue-600'}`}
                            >
                                {district}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-10">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div 
                            key="loader"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-40"
                        >
                            <div className="relative">
                                <Loader2 className="animate-spin text-blue-600 dark:text-blue-400 mb-4" size={64} />
                                <div className="absolute inset-0 animate-ping opacity-20 bg-blue-500 rounded-full"></div>
                            </div>
                            <p className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Syncing academic database...</p>
                        </motion.div>
                    ) : processedSchools.length > 0 ? (
                        <motion.div 
                            key="results"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.05
                                    }
                                }
                            }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8"
                        >
                            {processedSchools.map(school => (
                                <motion.div 
                                    key={school.id} 
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => onNavigate('schools/profile', { id: school.id, name: school.name, type })} 
                                    className="group bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 transition-all duration-300 cursor-pointer flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-xl"
                                >
                                    {/* Image Container */}
                                    <div className="aspect-[4/5] relative overflow-hidden shrink-0">
                                        <img 
                                            src={school.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                            alt={school.name} 
                                        />
                                        
                                        {/* Heart Icon Overlay */}
                                        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/40 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-[#ff7400] transition-colors shadow-lg border border-white/10">
                                            <Heart size={16} />
                                        </button>

                                        {/* Rating Overlay */}
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-md px-2 py-1 text-[8px] font-black flex items-center gap-1 rounded-full border border-white/10 shadow-lg">
                                            <Star size={10} className="text-yellow-500 fill-yellow-500"/> 
                                            <span className="text-gray-900 dark:text-white">{school.rating?.toFixed(1) || '4.5'}</span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-3 md:p-5 flex flex-col flex-1">
                                        {/* Name */}
                                        <h3 className="text-[11px] md:text-base font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                            {school.name}
                                        </h3>

                                        {/* Category/Type */}
                                        <div className="text-[9px] md:text-xs text-gray-400 font-bold mb-2 uppercase tracking-tight">
                                            {type} Education
                                        </div>

                                        {/* Location */}
                                        <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-500 mb-1">
                                            <MapPin size={12} className="text-gray-400" />
                                            <span className="truncate">{school.location}</span>
                                        </div>

                                        {/* Status/Process (Replacing Delivery) */}
                                        <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-500 mb-1">
                                            <Clock size={12} className="text-gray-400" />
                                            <span>{school.isBoarding ? 'Boarding' : 'Day School'}</span>
                                        </div>

                                        {/* Sub-label/Author */}
                                        <div className="flex items-center gap-1.5 text-[9px] md:text-xs text-gray-400 mb-4 italic">
                                            <User size={12} className="text-gray-300" />
                                            <span className="truncate">{school.province} Province</span>
                                        </div>

                                        {/* Action Button */}
                                        <button className="mt-auto w-full py-2 md:py-2.5 bg-[#ff003c] text-white hover:bg-[#d90033] rounded-lg font-black text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <School size={14} /> View Profile
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="no-results"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32 bg-white dark:bg-[#0d0d0d] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl"
                        >
                            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <School size={48} className="text-gray-300 dark:text-gray-700 opacity-40" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">No results found</h3>
                            <p className="text-sm text-gray-500 font-medium max-w-xs mx-auto mt-3">Adjust your filters or try a different search term to find what you're looking for.</p>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => { setSelectedDistrict('All'); setSearchQuery(''); }} 
                                className="mt-10 px-12 py-4 bg-blue-600 text-white font-black text-[10px] tracking-[0.3em] rounded-full shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all uppercase"
                            >
                                Reset Filters
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, DollarSign, Users, BookOpen, CheckCircle, Lock, Loader2, X, Send, Video, Sparkles, MapPin, Star, Map as MapIcon, MessageCircle, Layout } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, getDocs, doc, updateDoc, arrayUnion, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface ClassData {
  id: string;
  name: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  timetable: string;
  price: number;
  period: 'week' | 'month' | 'term';
  currency: 'USD' | 'ZIG';
  students: string[];
  pendingRequests?: string[];
  description?: string;
  location?: string;
  rating?: number;
  province?: string;
  city?: string;
  suburb?: string;
  phone?: string;
  lat?: number;
  lng?: number;
}

interface ExtraLessonsProps {
  onNavigate: (page: string, params?: any) => void;
  onLoginRequest: () => void;
}

export const ExtraLessons: React.FC<ExtraLessonsProps> = ({ onNavigate, onLoginRequest }) => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  const [showMap, setShowMap] = useState(false);
  const [selectedTeacherMarker, setSelectedTeacherMarker] = useState<ClassData | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'classes'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            // Mock data for new UI fields if not present
            rating: 4.8, 
            location: 'Online' 
        } as ClassData));
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'All' || cls.subject === activeFilter;
    const matchesProvince = selectedProvince === 'All' || cls.province === selectedProvince;
    const matchesPrice = maxPrice === '' || cls.price <= Number(maxPrice);
    
    return matchesSearch && matchesFilter && matchesProvince && matchesPrice;
  });

  const handleClassClick = (cls: ClassData) => {
    if (user && (cls.students.includes(user.uid) || cls.teacherId === user.uid)) {
      onNavigate('class-room', { classId: cls.id });
    } else {
      setSelectedClass(cls);
      setRequestStatus('idle');
    }
  };

  const handleRequestJoin = async () => {
    if (!user || !selectedClass) {
        onLoginRequest();
        return;
    }
    setRequestStatus('sending');
    try {
        const classRef = doc(db, 'classes', selectedClass.id);
        await updateDoc(classRef, {
            pendingRequests: arrayUnion(user.uid)
        });

        const chatId = [user.uid, selectedClass.teacherId].sort().join('_');
        await addDoc(collection(db, 'direct_messages'), {
            text: `Hi ${selectedClass.teacherName}, I would like to join your class: ${selectedClass.name}.`,
            senderId: user.uid,
            receiverId: selectedClass.teacherId,
            chatId: chatId,
            timestamp: serverTimestamp(),
            read: false
        });

        setRequestStatus('sent');
        setTimeout(() => {
            setSelectedClass(null);
            onNavigate('messages', { chatId: selectedClass.teacherId });
        }, 1500);

    } catch (error) {
        console.error("Error sending request:", error);
        alert("Failed to send request.");
        setRequestStatus('idle');
    }
  };

  const categories = ['All', 'Mathematics', 'Computer Science', 'English', 'Science'];

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans relative pb-20">
      
      {/* --- Google-style Header --- */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-all">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                      <Sparkles className="text-purple-600 fill-purple-600" size={24} />
                      Extra Lessons
                  </h1>
                  
                  {/* Search Input */}
                  <div className="relative w-full md:w-[400px]">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search className="text-gray-400" size={20} />
                      </div>
                      <input 
                          type="text" 
                          placeholder="Search for tutors, subjects..." 
                          className="w-full bg-gray-100 dark:bg-[#1a1a1a] border-none rounded-full pl-12 pr-4 py-3 text-base focus:ring-2 focus:ring-purple-600/50 shadow-sm transition-all hover:shadow-md"
                          value={searchQuery}
                          onChange={handleSearch}
                      />
                  </div>
                  
                  <button 
                      onClick={() => setShowMap(!showMap)}
                      className="px-5 py-3 bg-purple-600 text-white rounded-full font-bold shadow-lg hover:bg-purple-500 transition-colors flex items-center gap-2 shrink-0"
                  >
                      {showMap ? <Layout size={18} /> : <MapIcon size={18} />}
                      {showMap ? 'Grid View' : 'Map View'}
                  </button>
              </div>

              {/* Filters / Chips */}
              <div className="flex flex-wrap gap-4 py-4 items-center">
                  <div className="flex gap-2 overflow-x-auto hide-scrollbar flex-1">
                      {categories.map(cat => (
                          <button 
                              key={cat}
                              onClick={() => setActiveFilter(cat)}
                              className={`px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                                  activeFilter === cat 
                                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg' 
                                  : 'bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#252525]'
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                      <select 
                          className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-purple-600/50 appearance-none cursor-pointer"
                          value={selectedProvince}
                          onChange={(e) => setSelectedProvince(e.target.value)}
                      >
                          <option value="All">All Provinces</option>
                          {['Bulawayo', 'Harare', 'Manicaland', 'Mashonaland Central', 'Mashonaland East', 'Mashonaland West', 'Masvingo', 'Matabeleland North', 'Matabeleland South', 'Midlands'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <div className="relative">
                          <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                              type="number" 
                              placeholder="Max Price" 
                              className="w-28 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-full pl-8 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-purple-600/50"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                          />
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
            <div className="flex justify-center py-40"><Loader2 className="animate-spin text-purple-600" size={40}/></div>
        ) : showMap ? (
            <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl relative z-0">
                <MapContainer center={[-19.0154, 29.1549]} zoom={6} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                    />
                    {filteredClasses.filter(c => c.lat && c.lng).map(cls => (
                        <Marker 
                            key={cls.id} 
                            position={[cls.lat!, cls.lng!]} 
                            icon={customIcon}
                            eventHandlers={{
                                click: () => setSelectedTeacherMarker(cls) }}
                        />
                    ))}
                </MapContainer>
                
                {/* Teacher Details Popup (iPhone Style) */}
                {selectedTeacherMarker && (
                    <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-200 dark:border-white/10 p-5 z-[1000] animate-slide-up">
                        <button onClick={() => setSelectedTeacherMarker(null)} className="absolute top-4 right-4 p-1.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <X size={16}/>
                        </button>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0 border-2 border-white dark:border-[#222] shadow-sm">
                                {selectedTeacherMarker.teacherName[0]}
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900 dark:text-white leading-tight">{selectedTeacherMarker.teacherName}</h3>
                                <p className="text-xs text-gray-500 font-medium">{selectedTeacherMarker.subject}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-5">
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <MapPin size={14} className="text-purple-500"/>
                                <span className="truncate">{selectedTeacherMarker.suburb}, {selectedTeacherMarker.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <DollarSign size={14} className="text-green-500"/>
                                <span>{selectedTeacherMarker.currency} {selectedTeacherMarker.price} / {selectedTeacherMarker.period}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleClassClick(selectedTeacherMarker)}
                                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20"
                            >
                                <MessageCircle size={14} /> Message
                            </button>
                            {selectedTeacherMarker.phone && (
                                <a 
                                    href={`https://wa.me/${selectedTeacherMarker.phone.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#25D366]/20"
                                >
                                    WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        ) : filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClasses.map((cls) => (
                    <div 
                        key={cls.id} 
                        onClick={() => handleClassClick(cls)}
                        className="group bg-white dark:bg-[#161616] rounded-[24px] border border-gray-200 dark:border-[#2a2a2a] overflow-hidden hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 cursor-pointer flex flex-col relative h-[380px]"
                    >
                        {/* Card Image Area */}
                        <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-[#1a1a1a] dark:to-[#222] relative p-6 flex flex-col justify-between">
                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-black/5 dark:border-white/10 flex items-center gap-1">
                                <Star size={12} className="text-yellow-500 fill-yellow-500"/> {cls.rating}
                            </div>
                            <div className="w-14 h-14 bg-white dark:bg-[#252525] rounded-2xl flex items-center justify-center text-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                                <BookOpen size={28} />
                            </div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{cls.subject}</span>
                        </div>

                        {/* Content Area */}
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                                {cls.name}
                            </h3>
                            
                            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[10px] font-bold">
                                    {cls.teacherName[0]}
                                </div>
                                <span className="truncate">{cls.teacherName}</span>
                            </div>

                            <div className="mt-auto space-y-3">
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1f1f1f] p-3 rounded-xl">
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14}/> {cls.timetable}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users size={14}/> {cls.students.length}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div>
                                        <span className="text-2xl font-black text-gray-900 dark:text-white">{cls.currency === 'USD' ? '$' : 'ZIG'}{cls.price}</span>
                                        <span className="text-xs text-gray-500 ml-1 font-medium">/{cls.period}</span>
                                    </div>
                                    <button className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-lg">
                                        Open
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
                    <Search size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">We couldn't find any classes matching your criteria. Try different keywords or filters.</p>
            </div>
        )}
      </div>

      {/* Join Request Modal */}
      {selectedClass && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setSelectedClass(null)}></div>
            <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-[#333] rounded-[32px] shadow-2xl p-8 animate-dropdown-reveal text-center overflow-hidden">
                <button onClick={() => setSelectedClass(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full text-gray-500 transition-colors">
                    <X size={20}/>
                </button>
                
                <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Lock size={36} />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Access Required</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    You need permission to join <strong>{selectedClass.name}</strong>. Send a request to <strong>{selectedClass.teacherName}</strong> to get started.
                </p>

                <div className="bg-gray-50 dark:bg-[#111] p-5 rounded-2xl mb-8 text-left border border-gray-100 dark:border-[#333]">
                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500 text-sm">Subject</span>
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClass.subject}</span>
                    </div>
                    <div className="flex justify-between mb-3">
                        <span className="text-gray-500 text-sm">Schedule</span>
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">{selectedClass.timetable}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 dark:border-[#333] pt-3 mt-3">
                        <span className="text-gray-500 text-sm">Tuition</span>
                        <span className="text-purple-600 dark:text-purple-400 font-black text-lg">{selectedClass.currency} {selectedClass.price} <span className="text-xs font-normal text-gray-500">/{selectedClass.period}</span></span>
                    </div>
                </div>

                {requestStatus === 'sent' ? (
                    <div className="w-full py-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl font-bold border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                        <CheckCircle size={20} /> Request Sent Successfully
                    </div>
                ) : (
                    <button 
                        onClick={handleRequestJoin}
                        disabled={requestStatus === 'sending'}
                        className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-200 dark:shadow-purple-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:shadow-none hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {requestStatus === 'sending' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Request Access</>}
                    </button>
                )}
            </div>
        </div>
      )}

    </div>
  );
};

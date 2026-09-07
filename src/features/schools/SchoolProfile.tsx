
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    ArrowLeft, Star, MapPin, Globe, Mail, Phone, CreditCard, 
    Edit3, X, Share2, ShieldCheck, 
    Navigation, Loader2, Send, CheckCircle
} from 'lucide-react';
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

interface SchoolProfileData {
    id: string;
    name: string;
    motto: string;
    location: string;
    province: string;
    coordinates?: { lat: number, lng: number };
    rating: number;
    ratingsCount: number;
    curriculums: string[];
    phone: string;
    email: string;
    website: string;
    isBoarding: boolean;
    isDay: boolean;
    hasResidence?: boolean;
    fees: { amount: number, currency: string, period: string };
    description: string;
    image?: string;
    allowEdits: boolean;
    type: string;
}

interface Props {
    onBack: () => void;
    onLoginRequest: () => void;
}

export const SchoolProfile: React.FC<Props> = ({ onBack, onLoginRequest }) => {
    const { id: schoolId } = useParams<{ id: string }>();
    const { user, userProfile } = useAuth();
    const [school, setSchool] = useState<SchoolProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRatingPrompt, setShowRatingPrompt] = useState(false);
    
    const [tempRating, setTempRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        if (!schoolId) return;
        const fetchSchool = async () => {
            const snap = await getDoc(doc(db, 'schools', schoolId));
            if (snap.exists()) {
                setSchool({ id: snap.id, ...snap.data() } as SchoolProfileData);
            }
            setLoading(false);
        };
        fetchSchool();

        const timer = setTimeout(() => {
            const sessionRated = sessionStorage.getItem(`rated_${schoolId}`);
            if (!sessionRated) setShowRatingPrompt(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, [schoolId]);

    const handleRateSubmit = async () => {
        if (tempRating === 0 || !school) return;
        setIsSubmittingRating(true);
        try {
            const currentAvg = school.rating || 0;
            const currentCount = school.ratingsCount || 0;
            const newCount = currentCount + 1;
            const newAvg = ((currentAvg * currentCount) + tempRating) / newCount;

            await updateDoc(doc(db, 'schools', school.id), {
                rating: newAvg,
                ratingsCount: newCount
            });

            await addDoc(collection(db, 'reviews'), {
                schoolId: school.id,
                schoolName: school.name,
                rating: tempRating,
                review: reviewText,
                userId: user?.uid || 'anonymous',
                userName: userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Anonymous User',
                createdAt: serverTimestamp()
            });

            setSchool({ ...school, rating: newAvg, ratingsCount: newCount });
            setHasSubmitted(true);
            sessionStorage.setItem(`rated_${schoolId}`, 'true');
            setTimeout(() => setShowRatingPrompt(false), 2000);
        } catch (e) {
            console.error(e);
            alert("Failed to submit rating.");
        } finally {
            setIsSubmittingRating(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black"><Loader2 className="animate-spin text-purple-600" size={48} /></div>;
    if (!school) return <div className="min-h-screen flex flex-col items-center justify-center text-white bg-black"><p className="mb-4">School not found.</p><button onClick={onBack} className="text-purple-400">Go Back</button></div>;

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#050505] pb-24 font-sans overflow-x-hidden text-left">
            {showRatingPrompt && !hasSubmitted && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-[#111] border-2 border-purple-600 w-full max-w-md p-8 relative shadow-2xl rounded-none">
                        <button onClick={() => setShowRatingPrompt(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"><X size={20} /></button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 mx-auto flex items-center justify-center mb-4 rounded-none"><Star size={32} className="fill-current" /></div>
                            <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">Rate this Institution</h3>
                        </div>
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setTempRating(star)} className="transition-transform active:scale-90">
                                    <Star size={36} className={`${(hoverRating || tempRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-200 dark:text-gray-800'}`} />
                                </button>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <textarea className="w-full bg-gray-50 dark:bg-black border-2 border-gray-100 dark:border-white/5 p-4 text-sm text-gray-900 dark:text-white outline-none focus:border-purple-600 h-24 resize-none" placeholder="Add a short review (optional)..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                            <button onClick={handleRateSubmit} disabled={isSubmittingRating || tempRating === 0} className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 transition-all rounded-none">{isSubmittingRating ? <Loader2 className="animate-spin mx-auto" size={20}/> : 'Submit Rating'}</button>
                        </div>
                    </div>
                </div>
            )}
            {hasSubmitted && showRatingPrompt && (
                <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"><div className="text-center text-white"><div className="w-20 h-20 bg-green-500 rounded-none flex items-center justify-center mx-auto mb-6 shadow-2xl"><CheckCircle size={40} /></div><h2 className="text-3xl font-black uppercase tracking-tighter">Thank You!</h2></div></div>
            )}
            <div className="h-[400px] md:h-[500px] relative w-full overflow-hidden rounded-none">
                <img src={school.image || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop"} className="w-full h-full object-cover" alt={school.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-transparent"></div>
                <div className="absolute top-8 left-6 md:left-10 z-10"><button onClick={onBack} className="p-3 bg-black/40 backdrop-blur-md rounded-none text-white border border-white/10 hover:bg-black/60 transition-all"><ArrowLeft size={24} /></button></div>
                <div className="absolute bottom-10 left-6 md:left-10 z-10 max-w-4xl text-left">
                    <div className="flex flex-wrap items-center gap-3 mb-4"><span className="px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-none shadow-lg">{school.type}</span><span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-none">{school.province}</span></div>
                    <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-2xl">{school.name}</h1>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-8 relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-white dark:bg-[#111] p-8 md:p-12 rounded-none border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col md:flex-row gap-10 items-start text-left">
                        <div className="flex-1 space-y-8">
                            <section><h3 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] mb-4">Overview</h3><p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed font-medium">{school.description}</p></section>
                            <div className="grid grid-cols-2 gap-6">
                                <div><h4 className="text-[9px] font-black text-gray-400 uppercase mb-3 tracking-widest">Average Tuition</h4><div className="flex items-center gap-3"><div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-none"><CreditCard size={24}/></div><div><span className="block text-2xl font-black text-gray-900 dark:text-white leading-none">{school.fees?.currency || '$'} {school.fees?.amount || 0}</span></div></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

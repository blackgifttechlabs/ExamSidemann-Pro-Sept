
import React, { useState, useEffect, useRef } from 'react';
import { User, School, Book, Award, Save, Edit2, X, Trophy, Users, MapPin, Calendar, Camera, Share2, Download, Copy, ExternalLink, QrCode, CheckCircle, Loader2, GraduationCap, PlayCircle, ThumbsUp, Layout, Video, SlidersHorizontal, Bell, CircleHelp, ChevronRight, LogOut, Star } from 'lucide-react';
import { SUBJECTS } from '../../data/constants';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs, doc, getDoc, where, updateDoc, writeBatch } from 'firebase/firestore';
import { db, logout } from '../../services/firebase';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { LogoutModal } from '../auth/LogoutModal';

interface LeaderboardUser {
    id: string;
    name: string;
    points: number;
}

interface ShareProfileModalProps {
  user: any;
  profile: any;
  onClose: () => void;
}

const ShareProfileModal: React.FC<ShareProfileModalProps> = ({ user, profile, onClose }) => {
  const shareUrl = `${window.location.origin}/profile/${user?.uid}`; 
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 border border-gray-200 dark:border-[#333] shadow-2xl max-w-sm w-full animate-dropdown-reveal overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full text-gray-500 transition-colors">
            <X size={20} />
        </button>
        
        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 flex items-center justify-center gap-2">
                <QrCode size={20} className="text-blue-500" /> Share Profile
            </h3>
            <p className="text-gray-500 text-xs">Let others connect with you.</p>
        </div>
        
        <div className="flex flex-col items-center mb-8 relative">
           <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-xl relative z-10 border-4 border-white dark:border-[#1e1e1e]">
              {profile.firstName?.[0]}{profile.lastName?.[0]}
           </div>
           <h4 className="text-lg font-bold text-gray-900 dark:text-white relative z-10">{profile.firstName} {profile.lastName}</h4>
           <p className="text-gray-500 text-sm relative z-10">{profile.school}</p>
        </div>

        <div className="bg-gray-100 dark:bg-[#252525] p-4 rounded-xl flex items-center justify-between mb-4 border border-gray-200 dark:border-[#333]">
           <span className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-[180px] font-mono">{shareUrl}</span>
           <button onClick={handleCopyLink} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-xs flex items-center gap-1 bg-blue-100 dark:bg-blue-400/10 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-400/20 transition-colors">
               <Copy size={12}/> Copy
           </button>
        </div>

        <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
            Share via...
        </button>
      </div>
    </div>
  );
};

export const Profile: React.FC<{ onLoginRequest?: () => void; onNavigate?: (page: string, params?: any) => void }> = ({ onLoginRequest, onNavigate }) => {
  const { user, userProfile, updateProfileData, loading: authLoading, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      window.location.assign('/login?from=logout');
    } catch (error) {
      console.error('Logout failed', error);
      setShowLogoutModal(false);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editPhotoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [localPhotoURL, setLocalPhotoURL] = useState<string | null>(null);
  const [localBannerURL, setLocalBannerURL] = useState<string | null>(null);
  const [subjectSearch, setSubjectSearch] = useState('');
  const [showAllSubjects, setShowAllSubjects] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    school: '',
    grade: 'Form 1',
    enrolledSubjects: [] as string[]
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  
  // Teacher Stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  
  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<'friends' | 'groups' | null>(null);
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const [loadingDropdown, setLoadingDropdown] = useState(false);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [groupIds, setGroupIds] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile) {
      setLocalPhotoURL(userProfile.photoURL || user?.photoURL || null);
      setLocalBannerURL(userProfile.bannerURL || null);
      setFormData({
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        school: userProfile.school || '',
        grade: userProfile.grade || 'Form 1',
        enrolledSubjects: userProfile.enrolledSubjects || []
      });
      
      const fetchExtraData = async () => {
          if (user) {
              try {
                  const userDoc = await getDoc(doc(db, 'users', user.uid));
                  if (userDoc.exists()) {
                      const data = userDoc.data();
                      setFriendIds(data.friends || []);
                      setGroupIds(data.joinedCommunities || []);
                  }
                  
                  // Teacher Aggregation
                  if (userProfile.role === 'teacher') {
                      // 1. Classes & Students
                      const classesQ = query(collection(db, 'classes'), where('teacherId', '==', user.uid));
                      const classesSnap = await getDocs(classesQ);
                      
                      setTotalClasses(classesSnap.size);

                      const uniqueStudents = new Set();
                      classesSnap.forEach(doc => {
                          const students = doc.data().students || [];
                          students.forEach((sid: string) => uniqueStudents.add(sid));
                      });
                      setTotalStudents(uniqueStudents.size);

                      // 2. Tutorial Likes
                      const tutorialsQ = query(collection(db, 'tutorials'), where('teacherId', '==', user.uid));
                      const tutorialsSnap = await getDocs(tutorialsQ);
                      let likesCount = 0;
                      tutorialsSnap.forEach(doc => {
                          likesCount += (doc.data().likes || 0);
                      });
                      setTotalLikes(likesCount);
                  }

              } catch (e) {
                  console.error(e);
              }
          }
      };
      fetchExtraData();
    }
  }, [userProfile, user]);

  useEffect(() => {
      const fetchLeaderboard = async () => {
          try {
              const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(5));
              const snap = await getDocs(q);
              const data: LeaderboardUser[] = [];
              snap.forEach(doc => {
                  const d = doc.data();
                  data.push({
                      id: doc.id,
                      name: `${d.firstName} ${d.lastName}`,
                      points: d.totalPoints || 0
                  });
              });
              setLeaderboard(data);
          } catch(e) {
              console.error("Error fetching leaderboard", e);
          }
      };
      fetchLeaderboard();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      const exists = prev.enrolledSubjects.includes(subject);
      if (exists) {
        return { ...prev, enrolledSubjects: prev.enrolledSubjects.filter(s => s !== subject) };
      }
      return { ...prev, enrolledSubjects: [...prev.enrolledSubjects, subject] };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileData(formData);
    setIsEditing(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 280 * 1024) {
            alert("Image is too large. Please choose an image under 280KB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                await updateDoc(doc(db, 'users', user.uid), { photoURL: base64String });
                if (userProfile?.role === 'teacher' && userProfile.teacherVerified === true) {
                    const classes = await getDocs(query(collection(db, 'classes'), where('teacherId', '==', user.uid)));
                    const batch = writeBatch(db);
                    classes.docs.forEach((classDoc) => batch.update(classDoc.ref, { teacherImage: base64String }));
                    await batch.commit();
                }
                if (refreshProfile) await refreshProfile();
                setLocalPhotoURL(base64String);
            } catch (error) {
                console.error("Error uploading image", error);
                alert("Failed to upload image.");
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (file.size > 280 * 1024) {
            alert("Image is too large. Please choose an image under 280KB.");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;
            try {
                await updateDoc(doc(db, 'users', user.uid), { bannerURL: base64String });
                if (refreshProfile) await refreshProfile();
                setLocalBannerURL(base64String);
            } catch (error) {
                console.error("Error uploading banner", error);
                alert("Failed to upload banner.");
            }
        };
        reader.readAsDataURL(file);
    }
  };

  const handleStatClick = async (type: 'friends' | 'groups') => {
      setActiveDropdown(type);
      setLoadingDropdown(true);
      setDropdownData([]);

      try {
          const ids = type === 'friends' ? friendIds : groupIds;
          const collectionName = type === 'friends' ? 'users' : 'communities';
          
          if (ids.length > 0) {
              const fetches = ids.slice(0, 20).map(id => getDoc(doc(db, collectionName, id)));
              const results = await Promise.all(fetches);
              
              const data = results.map(snap => {
                  if (snap.exists()) {
                      const d = snap.data();
                      return {
                          id: snap.id,
                          title: type === 'friends' ? `${d.firstName} ${d.lastName}` : d.name,
                          subtitle: type === 'friends' ? (d.school || 'Student') : `${d.members || 0} members`,
                          avatar: type === 'friends' ? d.photoURL : null,
                          initial: (type === 'friends' ? d.firstName?.[0] : d.name?.[0]) || '?',
                          type: type
                      };
                  }
                  return null;
              }).filter(Boolean);
              setDropdownData(data);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setLoadingDropdown(false);
      }
  };

  const handleItemClick = (item: any) => {
      setActiveDropdown(null);
      if (onNavigate) {
          if (item.type === 'friends') {
              onNavigate('public-profile', { id: item.id });
          } else {
              onNavigate('communities', { communityId: item.id });
          }
      }
  };

  const isTeacher = userProfile?.role === 'teacher';

  if (!user && !authLoading) {
      return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Profile" />;
  }

  if (authLoading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;

  if (!userProfile) {
      return (
        <div className="flex min-h-[55vh] items-center justify-center p-6 text-center">
          <div className="max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#171717]">
            <CircleHelp className="mx-auto mb-3 text-violet-500" size={30} />
            <h1 className="text-lg font-black text-gray-900 dark:text-white">Profile could not load</h1>
            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Your account is signed in, but the profile record is not available yet.
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => refreshProfile()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-black text-white hover:bg-violet-500"
              >
                Try again
              </button>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-black text-gray-600 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Sign out
              </button>
            </div>
            <LogoutModal
              isOpen={showLogoutModal}
              onClose={() => setShowLogoutModal(false)}
              onConfirm={handleLogoutConfirm}
            />
          </div>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh_-_var(--app-header-h))] bg-[#f9f9f9] dark:bg-[#121212] text-gray-900 dark:text-gray-200 overflow-y-auto custom-scrollbar font-sans relative">
      
      {/* Share Modal */}
      {showShareModal && (
        <ShareProfileModal 
          user={user} 
          profile={formData} 
          onClose={() => setShowShareModal(false)} 
        />
      )}

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />

      {/* Friends/Groups Modal */}
      {activeDropdown && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"
                onClick={() => setActiveDropdown(null)}
              ></div>
              <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-dropdown-reveal flex flex-col max-h-[60vh]">
                  <div className="p-5 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-wide flex items-center gap-2">
                          {activeDropdown === 'friends' ? <Users size={20} className="text-blue-500" /> : <Users size={20} className="text-purple-500" />}
                          My {activeDropdown === 'friends' ? 'Friends' : 'Groups'}
                      </h3>
                      <button onClick={() => setActiveDropdown(null)} className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                          <X size={20} className="text-gray-500" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                      {loadingDropdown ? (
                          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
                      ) : dropdownData.length > 0 ? (
                          dropdownData.map(item => (
                              <button 
                                key={item.id} 
                                onClick={() => handleItemClick(item)}
                                className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all group border border-transparent hover:border-gray-200 dark:hover:border-white/5 text-left"
                              >
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-lg ${item.type === 'friends' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                                      {item.avatar ? <img src={item.avatar} className="w-full h-full rounded-full object-cover"/> : item.initial}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                      <h4 className="font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h4>
                                      <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                                  </div>
                                  <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white transition-colors">
                                      <ExternalLink size={16} />
                                  </div>
                              </button>
                          ))
                      ) : (
                          <div className="text-center py-8 text-gray-500 text-sm">
                              No {activeDropdown} found.
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
          <div className="fixed inset-0 z-[200] flex justify-end">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsEditing(false)}></div>
              <div className="relative w-full md:w-[600px] lg:w-[800px] h-full bg-white dark:bg-[#121212] shadow-2xl animate-slide-in-right flex flex-col">
                  <div className="p-6 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-gray-50 dark:bg-[#1e1e1e]">
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                          <Edit2 size={24} className="text-purple-500" /> Edit Profile
                      </h2>
                      <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition-colors">
                          <X size={24} className="text-gray-500" />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                      <form id="edit-profile-form" onSubmit={handleSave} className="space-y-8 max-w-3xl mx-auto">
                          <div className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-[#333] dark:bg-[#1e1e1e]">
                              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#ecebf2] text-xl font-black text-violet-600 dark:bg-white/10">
                                  {localPhotoURL ? <img src={localPhotoURL} alt="Profile" className="h-full w-full object-cover" /> : <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>}
                              </div>
                              <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-black text-gray-900 dark:text-white">Profile Image</h3>
                                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">Choose a small image. It is saved to your profile record as a base64 data URL.</p>
                              </div>
                              <button
                                  type="button"
                                  onClick={() => editPhotoInputRef.current?.click()}
                                  className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-black text-white hover:bg-violet-500"
                              >
                                  <Camera size={15} />
                                  Change
                              </button>
                              <input type="file" ref={editPhotoInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#333] pb-2">Personal Info</h3>
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">First Name</label>
                                      <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors" />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Last Name</label>
                                      <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors" />
                                  </div>
                              </div>
                              <div className="space-y-6">
                                  <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#333] pb-2">Academic Info</h3>
                                  <div>
                                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">School Name</label>
                                      <input name="school" value={formData.school} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors" placeholder="e.g. Prince Edward School" />
                                  </div>
                                  {!isTeacher && (
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Current Grade</label>
                                          <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer">
                                          {['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Lower 6', 'Upper 6'].map(g => <option key={g} value={g}>{g}</option>)}
                                          </select>
                                      </div>
                                  )}
                              </div>
                          </div>
                          
                          <div className="space-y-4">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-[#333] pb-2">{isTeacher ? "Subjects Taught" : "Academic Focus"}</h3>
                              
                              <div className="relative">
                                  <input 
                                      type="text" 
                                      placeholder="Search subjects..." 
                                      value={subjectSearch}
                                      onChange={(e) => setSubjectSearch(e.target.value)}
                                      className="w-full bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-[#333] rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-purple-500 outline-none transition-colors mb-4"
                                  />
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                  {SUBJECTS.filter(s => s.toLowerCase().includes(subjectSearch.toLowerCase()))
                                      .slice(0, (showAllSubjects || subjectSearch) ? undefined : 5)
                                      .map(subject => (
                                      <label key={subject} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${formData.enrolledSubjects.includes(subject) ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-500/50' : 'bg-gray-50 dark:bg-[#252525] border-gray-200 dark:border-[#333] hover:bg-gray-100 dark:hover:bg-[#333]'}`}>
                                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.enrolledSubjects.includes(subject) ? 'bg-purple-500 border-purple-500' : 'border-gray-400 dark:border-gray-600'}`}>
                                              {formData.enrolledSubjects.includes(subject) && <CheckCircle size={14} className="text-white" />}
                                          </div>
                                          <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">{subject}</span>
                                          <input type="checkbox" checked={formData.enrolledSubjects.includes(subject)} onChange={() => handleSubjectToggle(subject)} className="hidden" />
                                      </label>
                                  ))}
                              </div>
                              
                              {!subjectSearch && SUBJECTS.length > 5 && (
                                  <button 
                                      type="button"
                                      onClick={() => setShowAllSubjects(!showAllSubjects)}
                                      className="text-purple-600 dark:text-purple-400 text-sm font-bold hover:underline"
                                  >
                                      {showAllSubjects ? "Show Less" : "Reveal All"}
                                  </button>
                              )}
                          </div>
                      </form>
                  </div>
                  <div className="p-6 border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#1e1e1e] flex justify-end gap-4">
                      <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-gray-200 dark:bg-[#333] hover:bg-gray-300 dark:hover:bg-[#444] text-gray-800 dark:text-white rounded-xl font-bold transition-colors">Cancel</button>
                      <button type="submit" form="edit-profile-form" className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/30">
                          <Save size={20} /> Save Changes
                      </button>
                  </div>
              </div>
          </div>
      )}

      {(
        <div className="min-h-full bg-[#faf9ff] px-5 pb-28 pt-5 text-[#292452] dark:bg-[#0f0f10] dark:text-white md:hidden">
          <h1 className="text-center text-base font-black">Profile</h1>

          <section className="mt-6 flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#ecebf2] text-2xl font-black text-violet-600 shadow-sm dark:bg-white/10">
                {localPhotoURL ? <img src={localPhotoURL} alt="Profile" className="h-full w-full object-cover" /> : <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>}
              </div>
              <button onClick={() => fileInputRef.current?.click()} aria-label="Change profile image" className="absolute -bottom-1 right-0 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#faf9ff] bg-violet-600 text-white shadow-sm dark:border-[#0f0f10]">
                <Edit2 size={14} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <h2 className="text-lg font-black">{formData.firstName} {formData.lastName}</h2>
              {isTeacher && userProfile.teacherVerified === true && <CheckCircle size={15} className="text-violet-600" />}
            </div>
            <p className="mt-0.5 text-xs font-medium text-[#aaa6b8]">{user?.email || userProfile.email}</p>
          </section>

          <section className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-3">
            {(isTeacher ? [
              { value: totalStudents, label: 'Students', icon: Users },
              { value: totalClasses, label: 'Listings', icon: GraduationCap },
              { value: totalLikes, label: 'Likes', icon: ThumbsUp },
            ] : [
              { value: userProfile.totalPoints || 0, label: 'Points', icon: Award },
              { value: friendIds.length, label: 'Friends', icon: Users },
              { value: groupIds.length, label: 'Groups', icon: GraduationCap },
            ]).map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#77728d] shadow-sm dark:bg-white/10 dark:text-gray-300"><stat.icon size={16} /></span>
                <strong className="mt-2 block text-sm font-black">{stat.value}</strong>
                <span className="mt-0.5 block text-[10px] font-medium text-[#aaa6b8]">{stat.label}</span>
              </div>
            ))}
          </section>

          <section className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl bg-white px-4 shadow-[0_8px_28px_rgba(38,31,78,0.04)] dark:bg-white/5">
            {[
              { label: 'Personal', icon: User, action: () => setIsEditing(true) },
              { label: 'General', icon: SlidersHorizontal, action: () => onNavigate?.('settings') },
              { label: 'Notification', icon: Bell, action: () => onNavigate?.('settings') },
              { label: 'Help', icon: CircleHelp, action: () => onNavigate?.('contact') },
            ].map((item) => (
              <button key={item.label} onClick={item.action} className="flex w-full items-center gap-3 border-b border-[#f1eff7] py-4 text-left text-[13px] font-bold last:border-0 dark:border-white/10">
                <item.icon size={16} className="text-[#423684]" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight size={16} className="text-[#77728d]" />
              </button>
            ))}
            <button onClick={() => setShowLogoutModal(true)} className="flex w-full items-center gap-3 border-t border-[#f1eff7] py-4 text-left text-[13px] font-bold text-rose-600 dark:border-white/10 dark:text-rose-400">
              <LogOut size={16} />
              <span className="flex-1">Log Out</span>
              <ChevronRight size={16} className="text-rose-300" />
            </button>
          </section>

          <nav className="fixed inset-x-3 bottom-3 z-[80] grid grid-cols-4 rounded-[26px] border border-gray-200/80 bg-white/95 px-2 py-2 shadow-[0_12px_36px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-[#171717]/95" aria-label="Profile navigation">
            {(isTeacher ? [
              { label: 'Home', icon: Layout, action: () => onNavigate?.('dashboard', { teacherView: 'overview' }) },
              { label: 'Lessons', icon: GraduationCap, action: () => onNavigate?.('dashboard', { teacherView: 'extra-lessons' }) },
              { label: 'Tutorials', icon: Video, action: () => onNavigate?.('dashboard', { teacherView: 'tutorials-studio' }) },
            ] : [
              { label: 'Home', icon: Layout, action: () => onNavigate?.('dashboard') },
              { label: 'Courses', icon: GraduationCap, action: () => onNavigate?.('courses') },
              { label: 'Groups', icon: Users, action: () => onNavigate?.('communities') },
            ]).map((item) => <button key={item.label} onClick={item.action} className="flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[9px] font-black text-gray-400 dark:text-gray-500"><item.icon size={19} /><span>{item.label}</span></button>)}
            <button className="flex min-w-0 flex-col items-center gap-1 rounded-2xl bg-violet-50 px-1 py-1.5 text-[9px] font-black text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"><User size={19} strokeWidth={2.7} /><span>Profile</span></button>
          </nav>
        </div>
      )}

      {(
        <div className="hidden min-h-full bg-[#f6f7fb] px-6 py-7 text-[#25223f] dark:bg-[#0f0f10] dark:text-white md:block lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between rounded-xl bg-white px-5 py-4 text-xs font-bold shadow-sm ring-1 ring-gray-100 dark:bg-white/5 dark:ring-white/10">
              <span>User Profile</span>
              <div className="flex items-center gap-2 text-gray-400"><Layout size={14} /><span>/</span><span className="rounded-md bg-violet-100 px-2 py-1 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">User Profile</span></div>
            </div>

            <section className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
              <div className="group relative h-[250px] overflow-hidden bg-gradient-to-br from-[#d9c9f7] via-[#b8a2e7] to-[#8061cf] lg:h-[300px]">
                {localBannerURL ? (
                  <img src={localBannerURL} alt="Profile cover" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <span className="absolute -bottom-32 -left-16 h-80 w-80 rounded-[45%] bg-white/25 blur-sm" />
                    <span className="absolute -bottom-40 left-[18%] h-96 w-96 rounded-[44%] bg-violet-700/25" />
                    <span className="absolute -bottom-52 left-[43%] h-[28rem] w-[28rem] rounded-[48%] bg-white/20" />
                    <span className="absolute -bottom-56 right-[-8%] h-[30rem] w-[30rem] rounded-[46%] bg-violet-800/20" />
                  </>
                )}
                <button onClick={() => bannerInputRef.current?.click()} className="absolute right-5 top-5 flex items-center gap-2 rounded-lg bg-black/35 px-3 py-2 text-xs font-bold text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"><Camera size={15} /> Change cover</button>
                <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
              </div>

              <div className="relative grid min-h-[132px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-8">
                <div className="flex items-center gap-8">
                  {(isTeacher ? [
                    { value: totalClasses, label: 'Listings', icon: Book },
                    { value: totalStudents, label: 'Students', icon: Users },
                    { value: totalLikes, label: 'Likes', icon: ThumbsUp },
                  ] : [
                    { value: userProfile.totalPoints || 0, label: 'Points', icon: Award },
                    { value: friendIds.length, label: 'Friends', icon: Users },
                    { value: groupIds.length, label: 'Groups', icon: GraduationCap },
                  ]).map((stat) => (
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
                      {localPhotoURL ? <img src={localPhotoURL} alt="Profile" className="h-full w-full object-cover" /> : <span>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>}
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} aria-label="Change profile image" className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white dark:border-[#171717]"><Edit2 size={12} /></button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1.5"><h1 className="text-base font-black">{formData.firstName} {formData.lastName}</h1>{isTeacher && userProfile.teacherVerified === true && <CheckCircle size={15} className="text-violet-600" />}</div>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">{isTeacher ? 'Teacher' : formData.grade || 'Student'}</p>
                </div>

                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowShareModal(true)} className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white"><Share2 size={15} /> Share</button>
                  <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-black text-white shadow-md shadow-violet-500/20 hover:bg-violet-500"><Edit2 size={15} /> Edit Profile</button>
                  <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 text-xs font-black text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:bg-white/5 dark:text-rose-400 dark:hover:bg-rose-500/10"><LogOut size={15} /> Log Out</button>
                </div>
              </div>

              <nav className="flex justify-end gap-8 bg-[#e9dcff] px-8 py-3 text-xs font-bold text-[#544a72] dark:bg-violet-500/15 dark:text-violet-200" aria-label="Profile sections">
                <button className="flex items-center gap-2 text-violet-700 dark:text-white"><User size={15} /> Profile</button>
                <button onClick={() => isTeacher ? onNavigate?.('dashboard', { teacherView: 'extra-lessons' }) : onNavigate?.('courses')} className="flex items-center gap-2"><GraduationCap size={15} /> {isTeacher ? 'Listings' : 'Courses'}</button>
                <button onClick={() => isTeacher ? onNavigate?.('dashboard', { teacherView: 'tutorials-studio' }) : onNavigate?.('communities')} className="flex items-center gap-2">{isTeacher ? <Video size={15} /> : <Users size={15} />} {isTeacher ? 'Tutorials' : 'Friends'}</button>
                <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2"><Camera size={15} /> Gallery</button>
              </nav>
            </section>

            <div className="mt-6 grid grid-cols-[280px_minmax(0,1fr)] gap-6">
              <aside className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
                <h2 className="text-lg font-black">Introduction</h2>
                <p className="mt-3 text-xs leading-5 text-gray-400">{isTeacher ? 'Teacher profile and contact information for students looking for lessons.' : 'Student profile, school and academic information.'}</p>
                <div className="mt-6 space-y-4 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  <p className="flex items-center gap-3"><School size={16} /> {formData.school || 'School not added'}</p>
                  <p className="flex items-center gap-3"><User size={16} /> {user?.email || userProfile.email}</p>
                  <p className="flex items-center gap-3"><GraduationCap size={16} /> {isTeacher ? 'Teacher' : formData.grade || 'Level not added'}</p>
                  <p className="flex items-center gap-3"><CheckCircle size={16} /> {isTeacher ? (userProfile.teacherVerified === true ? 'Verified teacher' : 'Verification pending') : `${userProfile.totalPoints || 0} learning points`}</p>
                </div>
              </aside>

              <div className="space-y-6">
                <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10">
                  <div className="flex items-center justify-between"><div><h2 className="text-base font-black">{isTeacher ? 'Subjects taught' : 'My subjects'}</h2><p className="mt-1 text-xs text-gray-400">{isTeacher ? 'Subjects shown on your teaching profile.' : 'Subjects included in your academic profile.'}</p></div><button onClick={() => setIsEditing(true)} className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-black text-white">Edit</button></div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {formData.enrolledSubjects.length ? formData.enrolledSubjects.map((subject) => <span key={subject} className="rounded-lg bg-[#f5f1ff] px-3 py-2 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-200">{subject}</span>) : <button onClick={() => setIsEditing(true)} className="w-full rounded-xl border border-dashed border-violet-200 py-8 text-xs font-black text-violet-600">+ Add subjects</button>}
                  </div>
                </section>

                <section className="grid grid-cols-2 gap-4">
                  <button onClick={() => isTeacher ? onNavigate?.('dashboard', { teacherView: 'extra-lessons' }) : onNavigate?.('courses')} className="flex items-center gap-4 rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15"><GraduationCap size={19} /></span><span><strong className="block text-sm">{isTeacher ? 'Extra Lessons' : 'My Courses'}</strong><small className="mt-1 block text-gray-400">{isTeacher ? 'Manage your listings' : 'Continue learning'}</small></span></button>
                  <button onClick={() => isTeacher ? onNavigate?.('dashboard', { teacherView: 'tutorials-studio' }) : onNavigate?.('communities')} className="flex items-center gap-4 rounded-xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 dark:bg-[#171717] dark:ring-white/10"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-500/15">{isTeacher ? <Video size={19} /> : <Users size={19} />}</span><span><strong className="block text-sm">{isTeacher ? 'Tutorial Studio' : 'Study Groups'}</strong><small className="mt-1 block text-gray-400">{isTeacher ? 'Manage your videos' : 'Learn with classmates'}</small></span></button>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Profile Content --- */}
      <div className="hidden">
         
         {/* Banner */}
         <div className="h-48 md:h-64 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 w-full relative overflow-hidden group">
            {localBannerURL && <img src={localBannerURL} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f9] dark:from-[#121212] via-transparent to-transparent opacity-30"></div>
            {isTeacher && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            )}

            {/* Banner Upload Button */}
            {isTeacher && (
                <>
                    <button onClick={() => bannerInputRef.current?.click()} className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100 z-20">
                        <Camera size={20} />
                    </button>
                    <input type="file" ref={bannerInputRef} onChange={handleBannerUpload} accept="image/*" className="hidden" />
                </>
            )}
         </div>
         
         <div className="max-w-6xl mx-auto px-6 md:px-8 relative">
            {/* Name in Banner (Teacher Only) - Positioned relative to the centered container */}
            {isTeacher && (
                <div className="absolute bottom-full mb-2 md:mb-3 left-[10.5rem] md:left-[16rem] z-10 flex items-center gap-4 pointer-events-none pr-4 max-w-[calc(100%-10.5rem)] md:max-w-none">
                    <h1 className="text-xl sm:text-2xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg whitespace-nowrap truncate">{formData.firstName} {formData.lastName}</h1>
                </div>
            )}
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 md:-mt-24 mb-8 gap-6 md:gap-8">
               
               {/* Avatar */}
               <div className="relative shrink-0">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-[#f9f9f9] dark:border-[#121212] bg-white dark:bg-[#252525] flex items-center justify-center overflow-hidden shadow-2xl">
                     {localPhotoURL ? (
                        <img src={localPhotoURL} alt="Profile" className="w-full h-full object-cover" />
                     ) : (
                        <div className="text-5xl md:text-6xl font-bold text-gray-400">{formData.firstName?.[0]}{formData.lastName?.[0]}</div>
                     )}
                  </div>
                  <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleImageUpload} 
                     accept="image/*" 
                     className="hidden" 
                  />
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-purple-600 p-2.5 rounded-full border-4 border-[#f9f9f9] dark:border-[#121212] text-white hover:bg-purple-500 transition-colors shadow-lg" title="Change Photo">
                     <Camera size={18} />
                  </button>
               </div>

               {/* Name & Basic Info */}
               <div className="flex-1 w-full min-w-0 pb-2">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        {/* Name moved to banner for teachers, kept here for students */}
                        {!isTeacher && (
                            <div className="flex items-center gap-3">
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{formData.firstName} {formData.lastName}</h1>
                            </div>
                        )}
                        <div className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm md:text-base text-gray-600 dark:text-gray-400 mb-2 ${isTeacher ? 'mt-4 md:mt-0' : ''}`}>
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#252525] rounded-full border border-gray-200 dark:border-[#333] shadow-sm"><School size={16} className="text-purple-600 dark:text-purple-400" /> {formData.school || "No School Added"}</span>
                                {isTeacher && (
                                    <span className="hidden md:inline-flex bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full border border-purple-400 shadow-md">Teacher</span>
                                )}
                            </div>
                            {isTeacher && (
                                <div className="md:hidden">
                                    <span className="inline-flex bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full border border-purple-400 shadow-md">Teacher</span>
                                </div>
                            )}
                            <span className="self-start md:self-auto flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#252525] rounded-full border border-gray-200 dark:border-[#333] shadow-sm">
                                <Award size={16} className="text-purple-600 dark:text-purple-400" /> {isTeacher ? "Department" : formData.grade}
                            </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 md:self-end">
                        <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-white dark:bg-[#252525] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-800 dark:text-white rounded-xl text-sm font-bold transition-colors border border-gray-200 dark:border-[#333] hover:border-gray-300 dark:hover:border-[#555] shadow-lg flex items-center gap-2">
                            <Edit2 size={16} /> Edit
                        </button>
                        <button 
                            onClick={() => setShowShareModal(true)} 
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors shadow-lg shadow-blue-900/20 flex items-center gap-2"
                        >
                            <QrCode size={18} /> Share
                        </button>
                      </div>
                  </div>
               </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
                
                {isTeacher ? (
                    // TEACHER STATS
                    <>
                        <div className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                            <span className="text-3xl md:text-4xl font-black text-green-600 dark:text-green-500 mb-1">{totalStudents}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Students</span>
                        </div>
                        
                        <div className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-[#ff7400]/100/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                            <span className="text-3xl md:text-4xl font-black text-[#ff7400] dark:text-[#ff7400] mb-1">{userProfile.subscriberCount || 0}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Subscribers</span>
                        </div>

                        <div className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-500 mb-1">{totalLikes}</span>
                                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><ThumbsUp size={12}/> Likes</span>
                            </div>
                        </div>
                    </>
                ) : (
                    // STUDENT STATS
                    <>
                        <div className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl -mr-5 -mt-5"></div>
                            <span className="text-3xl md:text-4xl font-black text-yellow-600 dark:text-yellow-500 mb-1">{userProfile.totalPoints || 0}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Total Points</span>
                        </div>

                        <div 
                            onClick={() => handleStatClick('friends')}
                            className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -mr-5 -mt-5 transition-colors group-hover:bg-blue-500/20"></div>
                            <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{friendIds.length}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-300">Friends</span>
                        </div>

                        <div 
                            onClick={() => handleStatClick('groups')}
                            className="bg-white dark:bg-[#1e1e1e] p-4 md:p-6 rounded-2xl border border-gray-200 dark:border-[#333] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-all shadow-sm"
                        >
                            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl -mr-5 -mt-5 transition-colors group-hover:bg-purple-500/20"></div>
                            <span className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{groupIds.length}</span>
                            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-purple-600 dark:group-hover:text-purple-300">Groups</span>
                        </div>
                    </>
                )}
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                
                {/* Left Column: Details & Edit Form */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Enrolled Subjects */}
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-[#333] relative overflow-hidden shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl flex items-center gap-3"><Book size={24} className="text-purple-500" /> {isTeacher ? "Subjects Taught" : "Academic Focus"}</h3>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            {formData.enrolledSubjects.length > 0 ? formData.enrolledSubjects.map(subject => (
                            <button 
                                    key={subject} 
                                    onClick={() => {
                                        if (onNavigate) {
                                            onNavigate(formData.grade || 'Form 1', { tab: subject });
                                        }
                                    }}
                                    className="px-4 py-2.5 bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#333] text-gray-800 dark:text-gray-200 rounded-xl text-sm font-bold border border-gray-200 dark:border-[#333] hover:border-purple-500/50 transition-all shadow-sm"
                            >
                                {subject}
                            </button>
                            )) : (
                            <div className="text-gray-500 italic p-4 text-center w-full bg-gray-50 dark:bg-[#252525] rounded-xl border border-dashed border-gray-200 dark:border-[#333]">No subjects listed.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sidebar Stats */}
                <div className="space-y-8">
                    {/* Leaderboard (Students Only) */}
                    {!isTeacher && (
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 border border-gray-200 dark:border-[#333] shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-6 flex items-center gap-2"><Trophy size={20} className="text-yellow-500" /> Dedicated Learners</h3>
                            <div className="space-y-4">
                                {leaderboard.map((friend, idx) => (
                                    <div key={friend.id} className="flex items-center justify-between group p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-[#252525] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-gray-400 text-black' : idx === 2 ? 'bg-orange-700 text-white' : 'bg-gray-200 dark:bg-[#333] text-gray-600 dark:text-gray-400'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-sm font-bold truncate max-w-[120px] ${friend.id === user.uid ? 'text-purple-600 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                                {friend.id === user.uid ? 'You' : friend.name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="flex flex-col items-end gap-0.5">
                                        <span className="flex items-center gap-1 font-mono text-yellow-600 dark:text-yellow-500 font-bold text-sm">
                                            <Star size={13} className="fill-yellow-500 text-yellow-500 shrink-0" />
                                            {friend.points}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{friend.points === 1 ? 'star' : 'stars'}</span>
                                    </span>
                                    </div>
                                ))}
                                {leaderboard.length === 0 && <div className="text-gray-500 text-sm text-center py-4">Leaderboard updating...</div>}
                            </div>
                        </div>
                    )}

                    {/* Streak (Students Only) */}
                    {!isTeacher && (
                        <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl p-6 border border-orange-200 dark:border-orange-500/20 shadow-sm">
                            <h3 className="font-bold text-orange-600 dark:text-orange-400 text-lg mb-4 flex items-center gap-2"><Calendar size={20} /> Daily Streak</h3>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-5xl font-black text-gray-900 dark:text-white">{userProfile.streak || 0}</span>
                                    <span className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-widest font-bold mt-1">Days Active</span>
                                </div>
                                <div className="w-16 h-16 rounded-full border-4 border-orange-500/30 flex items-center justify-center animate-pulse">
                                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">🔥</div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Teacher: Uploads Shortcut */}
                    {isTeacher && (
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-3xl p-6 border border-purple-200 dark:border-purple-500/20 text-center shadow-sm">
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Content Creator</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Manage your uploaded tutorials and resources.</p>
                            <button 
                                onClick={() => onNavigate && onNavigate('tutorials-studio')}
                                className="w-full py-3 bg-white dark:bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-md"
                            >
                                <PlayCircle size={20} /> Go to Studio
                            </button>
                        </div>
                    )}
                </div>

            </div>
         </div>
      </div>
    </div>
  );
};

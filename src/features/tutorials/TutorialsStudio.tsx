
import React, { useState, useEffect } from 'react';
import { Video, Upload, Trash2, Edit2, Play, AlertCircle, Loader2, Link as LinkIcon, FileVideo, Youtube, X, Hash, Search, MoreVertical, Share2, Clock3, CalendarDays, Plus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LoginRequiredView } from '../auth/LoginRequiredView';
import { SUBJECTS } from '../../data/constants';

interface VideoData {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  subject: string;
  grade: string;
  topic: string;
  description: string;
  teacherId: string;
  views: number;
  likes: number;
  createdAt: any;
  duration?: string;
  approved?: boolean;
}

interface TutorialsStudioProps {
  onNavigate: (page: string) => void;
  onLoginRequest: () => void;
  embedded?: boolean;
}

export const TutorialsStudio: React.FC<TutorialsStudioProps> = ({ onNavigate, onLoginRequest, embedded = false }) => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'content'>('content');
  
  // Upload/Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadType, setUploadType] = useState<'youtube' | 'file'>('youtube');
  
  // Form Fields
  const [title, setTitle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [grade, setGrade] = useState('Form 4');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);

  // Content State
  const [myVideos, setMyVideos] = useState<VideoData[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<VideoData | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [videoSearch, setVideoSearch] = useState('');

  const polySubjects = [
      'Information Technology', 'Records Management', 'Auto Electrics', 
      'Purchasing & Supply', 'Banking & Finance'
  ];
  
  const allSubjects = [...SUBJECTS, ...polySubjects].sort();
  
  const levels = [
      'Form 1', 'Form 2', 'Form 3', 'Form 4', 'Lower 6', 'Upper 6',
      'NC Information Tech', 'ND Information Tech', 'NC Records Mgmt', 'ND Records Mgmt',
      'NC Auto Electrics', 'NC Purchasing', 'ND Purchasing', 'NC Banking'
  ];

  useEffect(() => {
    if (activeTab === 'content' && user) {
        fetchMyVideos();
    }
  }, [activeTab, user]);

  const fetchMyVideos = async () => {
      setIsLoadingVideos(true);
      try {
          const q = query(collection(db, 'tutorials'), where('teacherId', '==', user?.uid), orderBy('createdAt', 'desc'));
          const snap = await getDocs(q);
          const vids = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VideoData));
          setMyVideos(vids);
      } catch (e) {
          console.error("Error fetching videos", e);
      } finally {
          setIsLoadingVideos(false);
      }
  };

  /** Safe YouTube ID extraction */
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtu.be')) {
        return parsed.pathname.slice(1);
      }
      if (parsed.searchParams.get('v')) {
        return parsed.searchParams.get('v');
      }
      if (parsed.pathname.includes('/embed/')) {
        return parsed.pathname.split('/embed/')[1];
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleUploadOrUpdate = async () => {
      if (!title || !youtubeLink || !topic || !user) {
          alert("Please fill in all required fields (Title, Link, Topic).");
          return;
      }
      if (userProfile?.role !== 'teacher' || userProfile.teacherVerified !== true) {
          alert('Teacher publishing is available only after administrator verification.');
          return;
      }
      setIsUploading(true);
      
      const videoId = getYouTubeVideoId(youtubeLink);
      if (!videoId) {
          alert("Invalid YouTube URL");
          setIsUploading(false);
          return;
      }

      const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      try {
          const videoData = {
              title,
              url: youtubeLink,
              thumbnail,
              subject,
              grade,
              topic,
              description: description || '',
              duration: duration.trim() || 'Not specified',
              teacherId: user.uid,
              teacherName: `${userProfile?.firstName} ${userProfile?.lastName}`,
              approved: false,
              // Only set these on creation
              ...(editingId ? {} : { 
                  views: 0, 
                  likes: 0, 
                  createdAt: serverTimestamp() 
              })
          };

          if (editingId) {
              await updateDoc(doc(db, 'tutorials', editingId), videoData);
              alert("Video updated and returned to the administrator review queue.");
          } else {
              await addDoc(collection(db, 'tutorials'), videoData);
              alert("Video submitted for administrator review. It will not appear publicly until approved.");
          }

          resetForm();
          setActiveTab('content');
      } catch (e) {
          console.error("Upload error", e);
          alert("Failed to save video.");
      } finally {
          setIsUploading(false);
      }
  };

  const handleEdit = (video: VideoData) => {
      setEditingId(video.id);
      setTitle(video.title);
      setYoutubeLink(video.url);
      setSubject(video.subject);
      setGrade(video.grade);
      setTopic(video.topic || '');
      setDescription(video.description || '');
      setDuration(video.duration || '');
      setActiveTab('upload');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
      if (confirm("Are you sure you want to delete this video? This cannot be undone.")) {
          try {
              await deleteDoc(doc(db, 'tutorials', id));
              setMyVideos(prev => prev.filter(v => v.id !== id));
              if (previewVideo?.id === id) setPreviewVideo(null);
          } catch (e) {
              console.error("Delete error", e);
          }
      }
  };

  const handleShare = async (video: VideoData) => {
      setOpenMenuId(null);
      try {
          if (navigator.share) {
              await navigator.share({ title: video.title, text: `${video.subject} tutorial`, url: video.url });
          } else {
              await navigator.clipboard.writeText(video.url);
              alert('Tutorial link copied.');
          }
      } catch (error: any) {
          if (error?.name !== 'AbortError') alert('Could not share this tutorial.');
      }
  };

  const resetForm = () => {
      setEditingId(null);
      setTitle('');
      setYoutubeLink('');
      setTopic('');
      setDescription('');
      setDuration('');
      setSubject(SUBJECTS[0]);
      setGrade('Form 4');
  };

  const filteredVideos = myVideos.filter((video) => (
      `${video.title} ${video.subject} ${video.topic}`.toLocaleLowerCase().includes(videoSearch.trim().toLocaleLowerCase())
  ));

  if (!user) return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Tutorials Studio" />;
  if (userProfile?.role !== 'teacher' || userProfile.teacherVerified !== true) {
      return (
        <main className="min-h-[calc(100vh_-_var(--app-header-h))] bg-gray-50 p-6 text-center dark:bg-[#0f0f0f]">
          <section className="mx-auto mt-20 max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-lg dark:border-white/10 dark:bg-[#171717]">
            <AlertCircle className="mx-auto text-amber-500" size={40} />
            <h1 className="mt-5 text-2xl font-black text-gray-900 dark:text-white">Publisher verification required</h1>
            <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-300">
              Tutorial publishing is limited to teachers whose identity and publishing access have been approved by an administrator. Contact Exam Sidemann if you want to apply.
            </p>
          </section>
        </main>
      );
  }

  return (
    <div className={`${embedded ? 'min-h-full' : 'min-h-screen'} bg-transparent font-sans flex flex-col`}>
      
      {/* File Upload Modal */}
      {showFileModal && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-2xl max-w-md w-full text-center relative border border-gray-200 dark:border-[#333]">
                  <button onClick={() => setShowFileModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors">
                      <X size={20} className="text-gray-500" />
                  </button>
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Direct file uploads are currently under development. For now, please upload your video to YouTube and paste the link here.
                  </p>
                  <button onClick={() => { setShowFileModal(false); setUploadType('youtube'); }} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-colors">
                      Use YouTube Link
                  </button>
              </div>
          </div>
      )}

      <div className={`flex-1 w-full ${embedded ? 'p-0' : 'mx-auto max-w-[1600px] p-6 md:p-10'}`}>
          <div className="mb-6 border-b border-gray-200 pb-5 dark:border-white/10">
              <div className="flex items-center justify-between gap-4">
                  <div><h1 className="text-xl font-black text-gray-900 dark:text-white">{activeTab === 'content' ? 'Tutorials' : editingId ? 'Edit tutorial' : 'Create tutorial'}</h1>{activeTab === 'content' && <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{myVideos.length} videos</p>}</div>
                  {activeTab === 'content' ? <button onClick={() => { resetForm(); setActiveTab('upload'); }} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] bg-blue-600 px-4 py-2.5 text-xs font-black text-white hover:bg-blue-500"><Plus size={16} /> <span className="hidden sm:inline">Create tutorial</span><span className="sm:hidden">Create</span></button> : <button onClick={() => { resetForm(); setActiveTab('content'); }} className="inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-gray-200 px-4 py-2.5 text-xs font-black text-gray-700 dark:border-white/10 dark:text-white"><X size={15} /> Cancel</button>}
              </div>
              {activeTab === 'content' && <div className="relative mt-4 w-full"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" /><input value={videoSearch} onChange={(event) => setVideoSearch(event.target.value)} placeholder="Search tutorials" className="w-full rounded-[10px] border border-gray-200 bg-white py-3 pl-10 pr-4 text-xs outline-none focus:border-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white" /></div>}
          </div>
          
          {activeTab === 'upload' && (
              <div className="animate-dropdown-reveal w-full">
                  <div className="mb-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Tutorial' : 'Upload a New Tutorial'}</h2>
                      <p className="text-sm text-gray-500">Share your knowledge with students across the platform.</p>
                  </div>

                  {/* Type Selector (Only show if not editing) */}
                  {!editingId && (
                      <div className="mb-5 flex gap-3">
                          <button
                            onClick={() => setUploadType('youtube')}
                            className={`flex w-36 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-all ${uploadType === 'youtube' ? 'border-red-500 bg-[#ff7400]/10 text-[#ff7400]' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-[#333] dark:hover:bg-[#252525]'}`}
                          >
                              <Youtube size={18} />
                              <span className="text-xs font-bold">YouTube</span>
                          </button>
                          <button
                            onClick={() => setShowFileModal(true)}
                            className={`flex w-36 items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-all ${uploadType === 'file' ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/10' : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-[#333] dark:hover:bg-[#252525]'}`}
                          >
                              <FileVideo size={18} />
                              <span className="text-xs font-bold">File Upload</span>
                          </button>
                      </div>
                  )}

                  <div className="grid items-start gap-x-10 gap-y-5 lg:grid-cols-2">

                      {/* LEFT COLUMN — video source */}
                      <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Video source</p>

                          {/* Title */}
                          <div>
                              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Video Title <span className="text-[#ff7400]">*</span></label>
                              <input
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                placeholder="e.g. Introduction to Algebra"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                              />
                          </div>

                          {/* Link */}
                          {uploadType === 'youtube' && (
                              <div>
                                  <label className="mb-1.5 flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                      <LinkIcon size={14} /> YouTube Link <span className="text-[#ff7400]">*</span>
                                  </label>
                                  <input
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-red-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                    placeholder="https://www.youtube.com/watch?v=..."
                                    value={youtubeLink}
                                    onChange={(e) => setYoutubeLink(e.target.value)}
                                  />
                              </div>
                          )}

                          {/* Preview */}
                          <div className="flex h-[228px] w-full items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-[#333] dark:bg-[#111]">
                              {getYouTubeVideoId(youtubeLink) ? (
                                  <img src={`https://img.youtube.com/vi/${getYouTubeVideoId(youtubeLink)}/hqdefault.jpg`} alt="Video thumbnail" className="h-full w-full object-cover" />
                              ) : (
                                  <div className="px-6 text-center text-gray-400">
                                      <Video size={28} className="mx-auto mb-2" />
                                      <p className="text-xs font-bold">Paste a YouTube link to preview the thumbnail</p>
                                  </div>
                              )}
                          </div>
                      </div>

                      {/* RIGHT COLUMN — details */}
                      <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Details</p>

                          {/* Topic & Subject */}
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Topic <span className="text-[#ff7400]">*</span></label>
                                  <div className="relative">
                                      <Hash size={16} className="absolute left-3 top-3 text-gray-400" />
                                      <input
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-4 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                        placeholder="e.g. Geometry"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Subject</label>
                                  <select
                                    className="custom-scrollbar w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                  >
                                      {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                  </select>
                              </div>
                          </div>

                          {/* Grade & Duration */}
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Class / Level</label>
                                  <select
                                    className="custom-scrollbar w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                  >
                                      {levels.map(g => <option key={g} value={g}>{g}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Duration</label>
                                  <input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="e.g. 12:30" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white" />
                              </div>
                          </div>

                          {/* Description */}
                          <div>
                              <label className="mb-1.5 block text-sm font-bold text-gray-700 dark:text-gray-300">Description <span className="font-normal text-gray-400">(Optional)</span></label>
                              <textarea
                                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900 outline-none transition-all focus:ring-2 focus:ring-blue-500 dark:border-[#333] dark:bg-[#111] dark:text-white"
                                rows={4}
                                placeholder="Describe what students will learn..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                          </div>

                          {/* Buttons */}
                          <div className="flex gap-3 pt-1">
                              {editingId && (
                                  <button onClick={() => { resetForm(); setActiveTab('content'); }} className="rounded-xl border border-gray-300 px-6 py-3 font-bold text-gray-700 hover:bg-gray-100 dark:border-[#444] dark:text-gray-300 dark:hover:bg-[#222]">
                                      Cancel
                                  </button>
                              )}
                              <button
                                onClick={handleUploadOrUpdate}
                                disabled={isUploading || !title || !youtubeLink || !topic}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                  {isUploading ? <Loader2 className="animate-spin" /> : editingId ? <><Edit2 size={20} /> Update Video</> : <><Upload size={20} /> Publish Video</>}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'content' && (
              <div className="animate-fade-in space-y-6">
                  <div className="divide-y divide-gray-200 dark:divide-white/10">
                      {isLoadingVideos ? (
                          <div className="py-16 text-center"><Loader2 className="mx-auto animate-spin text-blue-500" /></div>
                      ) : filteredVideos.length ? filteredVideos.map((video) => (
                          <article key={video.id} className="relative flex gap-3 py-4 sm:gap-5 sm:py-5">
                              <button onClick={() => window.open(video.url, '_blank', 'noopener,noreferrer')} className="group relative h-[76px] w-[122px] shrink-0 overflow-hidden rounded-xl bg-black sm:h-[96px] sm:w-[164px]">
                                  <img src={video.thumbnail} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-black/15"><Play size={20} className="fill-white text-white drop-shadow" /></span>
                              </button>
                              <div className="min-w-0 flex-1 pr-9">
                                  <h3 className="line-clamp-2 text-sm font-black leading-5 text-gray-900 dark:text-white sm:text-base">{video.title}</h3>
                                  <p className="mt-1 truncate text-[11px] font-bold text-blue-600 dark:text-blue-400">{video.subject}</p>
                                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-gray-400">
                                      <span className="flex items-center gap-1"><Clock3 size={12} /> {video.duration || 'Not specified'}</span>
                                      <span className="flex items-center gap-1"><CalendarDays size={12} /> {new Date(video.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                                      <span>{video.approved ? 'Published' : 'Under review'}</span>
                                  </div>
                              </div>
                              <button onClick={() => setOpenMenuId((current) => current === video.id ? null : video.id)} aria-label={`More options for ${video.title}`} className="absolute right-0 top-4 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"><MoreVertical size={19} /></button>
                              {openMenuId === video.id && (
                                  <div className="absolute right-0 top-12 z-30 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-[#202020]">
                                      <button onClick={() => { setOpenMenuId(null); handleEdit(video); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"><Edit2 size={14} /> Edit</button>
                                      <button onClick={() => void handleShare(video)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"><Share2 size={14} /> Share</button>
                                      <button onClick={() => { setOpenMenuId(null); void handleDelete(video.id); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={14} /> Delete</button>
                                  </div>
                              )}
                          </article>
                      )) : (
                          <div className="py-20 text-center"><Video className="mx-auto text-gray-300" size={32} /><p className="mt-3 text-sm font-bold text-gray-500">No tutorials found.</p><button onClick={() => { resetForm(); setActiveTab('upload'); }} className="mt-4 text-xs font-black text-blue-600">Create your first tutorial</button></div>
                      )}
                  </div>

                  <div className="hidden">
                      {/* Video List */}
                      <div className={`flex-1 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm transition-all duration-500 ${previewVideo ? 'lg:w-1/2' : 'w-full'}`}>
                          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                              <h3 className="font-bold text-gray-900 dark:text-white">Uploads</h3>
                              <div className="relative">
                                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                    type="text" 
                                    placeholder="Filter videos..." 
                                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-xs outline-none focus:border-blue-500 transition-all"
                                  />
                              </div>
                          </div>
                          
                          <div className="overflow-x-auto">
                              <table className="w-full text-left">
                                  <thead className="bg-gray-50 dark:bg-white/2 border-b border-gray-100 dark:border-white/5">
                                      <tr>
                                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Video</th>
                                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Visibility</th>
                                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden lg:table-cell">Date</th>
                                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Views</th>
                                          <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                      {isLoadingVideos ? (
                                          <tr><td colSpan={5} className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                                      ) : myVideos.length > 0 ? (
                                          myVideos.map(video => (
                                              <tr 
                                                key={video.id} 
                                                className={`group cursor-pointer transition-colors ${previewVideo?.id === video.id ? 'bg-blue-50 dark:bg-blue-900/10' : 'hover:bg-gray-50 dark:hover:bg-white/2'}`}
                                                onClick={() => setPreviewVideo(video)}
                                              >
                                                  <td className="px-6 py-4">
                                                      <div className="flex items-center gap-4">
                                                          <div className="w-28 h-16 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden shrink-0 relative group-hover:scale-105 transition-transform">
                                                              <img src={video.thumbnail} className="w-full h-full object-cover" alt={video.title} />
                                                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                  <Play size={20} className="text-white fill-current" />
                                                              </div>
                                                          </div>
                                                          <div className="min-w-0">
                                                              <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{video.title}</h4>
                                                              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{video.subject} • {video.grade}</p>
                                                          </div>
                                                      </div>
                                                  </td>
                                                  <td className="px-6 py-4 hidden md:table-cell">
                                                      <div className="flex items-center gap-2 text-emerald-500">
                                                          <CheckCircle size={14} />
                                                          <span className="text-[10px] font-bold uppercase tracking-widest">Public</span>
                                                      </div>
                                                  </td>
                                                  <td className="px-6 py-4 text-[11px] text-gray-500 hidden lg:table-cell">
                                                      {new Date(video.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}
                                                  </td>
                                                  <td className="px-6 py-4 text-[11px] font-bold text-gray-700 dark:text-gray-300">
                                                      {video.views.toLocaleString()}
                                                  </td>
                                                  <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                                                      <div className="flex justify-end gap-1">
                                                          <button onClick={() => handleEdit(video)} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-full text-blue-600 transition-colors"><Edit2 size={16}/></button>
                                                          <button onClick={() => handleDelete(video.id)} className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full text-[#ff7400] transition-colors"><Trash2 size={16}/></button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          ))
                                      ) : (
                                          <tr><td colSpan={5} className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">No content found</td></tr>
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      </div>

                      {/* Preview Panel */}
                      {previewVideo && (
                          <div className="w-full lg:w-1/3 bg-white dark:bg-[#1a1a1a] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-slide-in-right flex flex-col h-fit sticky top-40">
                              <div className="aspect-video bg-black relative">
                                  <button onClick={() => setPreviewVideo(null)} className="absolute top-3 right-3 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"><X size={18}/></button>
                                  {getYouTubeVideoId(previewVideo.url) ? (
                                      <iframe 
                                          width="100%" height="100%" 
                                          src={`https://www.youtube.com/embed/${getYouTubeVideoId(previewVideo.url)}?autoplay=1&rel=0`} 
                                          allowFullScreen className="w-full h-full"
                                      />
                                  ) : <div className="w-full h-full flex items-center justify-center text-white text-xs uppercase font-bold">Preview Unavailable</div>}
                              </div>
                              <div className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-bold text-gray-900 dark:text-white">{previewVideo.title}</h3>
                                      <div className="flex gap-2">
                                          <button onClick={() => handleEdit(previewVideo)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 transition-all"><Edit2 size={16}/></button>
                                          <button onClick={() => handleDelete(previewVideo.id)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-[#ff7400]/10 dark:hover:bg-red-900/20 text-[#ff7400] transition-all"><Trash2 size={16}/></button>
                                      </div>
                                  </div>
                                  <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                          <div className="bg-gray-50 dark:bg-white/2 p-3 rounded-2xl">
                                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Views</p>
                                              <p className="font-bold text-gray-900 dark:text-white">{previewVideo.views.toLocaleString()}</p>
                                          </div>
                                          <div className="bg-gray-50 dark:bg-white/2 p-3 rounded-2xl">
                                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Likes</p>
                                              <p className="font-bold text-gray-900 dark:text-white">{previewVideo.likes || 0}</p>
                                          </div>
                                      </div>
                                      <div className="bg-gray-50 dark:bg-white/2 p-4 rounded-2xl">
                                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Details</p>
                                          <div className="space-y-2">
                                              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Subject</span><span className="font-bold text-gray-700 dark:text-gray-300">{previewVideo.subject}</span></div>
                                              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Level</span><span className="font-bold text-gray-700 dark:text-gray-300">{previewVideo.grade}</span></div>
                                              <div className="flex justify-between text-[11px]"><span className="text-gray-500">Topic</span><span className="font-bold text-gray-700 dark:text-gray-300 truncate ml-4">{previewVideo.topic}</span></div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};


import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
    FileStack, BookOpen, Library, Archive, Search, Trash2, Upload, Loader2, Edit3, X, Save, Sparkles
} from 'lucide-react';
import { auth, db } from '../../services/firebase';
import { 
    collection, onSnapshot, query, orderBy, deleteDoc, doc, addDoc, serverTimestamp, updateDoc 
} from 'firebase/firestore';
import {
    deleteAdminResourceFile,
    formatFileSize,
    MAX_RESOURCE_FILE_SIZE,
    RESOURCE_FILE_ACCEPT,
    uploadAdminResourceFile,
} from '../../services/appwriteResourceStorage';
import { POLYTECHNIC_COURSE_GROUPS } from '../../data/polytechnicCourses';
import { analyzeAdminResource, titleFromFileName } from '../../services/adminResourceAnalysis';

type ResourceType = 'syllabi' | 'library' | 'past-papers';

interface AcademicLevel {
    name: string;
    category: string;
}

interface Props {
    allCourses: AcademicLevel[];
}

const PRIMARY_LEVELS = Array.from({ length: 7 }, (_, index) => `Grade ${index + 1}`);
const HIGH_SCHOOL_LEVELS = Array.from({ length: 6 }, (_, index) => `Form ${index + 1}`);

export const ResourceManager: React.FC<Props> = ({ allCourses }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [resType, setResType] = useState<ResourceType>('syllabi');
    const [resTitle, setResTitle] = useState('');
    const [resUrl, setResUrl] = useState('');
    const [resCourse, setResCourse] = useState('');
    const [resSubject, setResSubject] = useState('');
    const [resYear, setResYear] = useState(new Date().getFullYear().toString());
    const [resSession, setResSession] = useState('November');
    const [resSize, setResSize] = useState('1.5 MB');
    const [resCoverUrl, setResCoverUrl] = useState('');
    const [resFile, setResFile] = useState<File | null>(null);
    const [resStorageProvider, setResStorageProvider] = useState('');
    const [resStorageFileId, setResStorageFileId] = useState('');
    const [resStoredFileName, setResStoredFileName] = useState('');
    const [resStoredMimeType, setResStoredMimeType] = useState('');
    const [resStoredSize, setResStoredSize] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisMessage, setAnalysisMessage] = useState('');
    const analysisRequestId = useRef(0);
    
    const [globalResources, setGlobalResources] = useState<any[]>([]);
    const [resSearch, setResSearch] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const resourceLevelGroups = useMemo(() => {
        const groups: Array<{ label: string; options: string[] }> = [
            { label: 'Primary School', options: PRIMARY_LEVELS },
            { label: 'High School', options: HIGH_SCHOOL_LEVELS },
            ...POLYTECHNIC_COURSE_GROUPS.map(group => ({
                label: `Polytechnic — ${group.label}`,
                options: [...group.courses],
            })),
        ];
        const known = new Set(groups.flatMap(group => group.options.map(option => option.toLocaleLowerCase())));
        const configured = new Map<string, string[]>();

        allCourses.forEach(course => {
            const name = course.name?.trim();
            if (!name || known.has(name.toLocaleLowerCase())) return;
            const category = course.category?.trim() || 'Other configured levels';
            const options = configured.get(category) || [];
            options.push(name);
            configured.set(category, options);
            known.add(name.toLocaleLowerCase());
        });

        configured.forEach((options, label) => groups.push({ label, options }));
        return groups;
    }, [allCourses]);
    const resourceLevelOptions = useMemo(
        () => resourceLevelGroups.flatMap(group => group.options),
        [resourceLevelGroups],
    );

    const prefillResourceWithAI = async (file: File) => {
        const requestId = ++analysisRequestId.current;
        setIsAnalyzing(true);
        setAnalysisMessage('AI is reading the file and filling its details…');
        setResTitle(current => current.trim() ? current : titleFromFileName(file.name));

        try {
            const suggestion = await analyzeAdminResource(file, resType, resourceLevelOptions);
            if (analysisRequestId.current !== requestId) return;
            setResTitle(current => suggestion.title || current);
            setResCourse(current => suggestion.course || current);
            setResSubject(current => suggestion.subject || current);
            if (!editingId) setResType(suggestion.type || resType);
            if (suggestion.year) setResYear(suggestion.year);
            if (suggestion.session) setResSession(suggestion.session);
            setAnalysisMessage('AI filled the available details. Please review them before publishing.');
        } catch (error) {
            if (analysisRequestId.current !== requestId) return;
            console.warn('AI resource prefill failed.', error);
            setAnalysisMessage('AI could not read enough information. You can complete the remaining fields manually.');
        } finally {
            if (analysisRequestId.current === requestId) setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        const q = query(collection(db, 'global_resources'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            setGlobalResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setResTitle('');
        setResUrl('');
        setResCourse('');
        setResSubject('');
        setResYear(new Date().getFullYear().toString());
        setResSession('November');
        setResSize('1.5 MB');
        setResCoverUrl('');
        setResFile(null);
        setResStorageProvider('');
        setResStorageFileId('');
        setResStoredFileName('');
        setResStoredMimeType('');
        setResStoredSize(0);
        setUploadProgress(0);
        analysisRequestId.current += 1;
        setIsAnalyzing(false);
        setAnalysisMessage('');
    };

    const handleSaveGlobalResource = async () => {
        if (!resTitle || (!resUrl.trim() && !resFile) || !resCourse || !resSubject) {
            alert("Please fill in Title, Level and Subject, then select a file or enter a URL.");
            return;
        }
        if (!auth.currentUser) {
            alert("Sign in again before publishing a resource.");
            return;
        }
        setIsSaving(true);
        let newStoredFile: Awaited<ReturnType<typeof uploadAdminResourceFile>> | null = null;
        let metadataSaved = false;
        try {
            const reviewerId = auth.currentUser?.uid || null;
            if (resFile) {
                newStoredFile = await uploadAdminResourceFile(resFile, setUploadProgress);
            }
            const resourceUrl = newStoredFile?.url || resUrl.trim();
            const resData: any = {
                type: resType,
                title: resTitle,
                url: resourceUrl,
                course: resCourse,
                subject: resSubject,
                storageProvider: newStoredFile ? 'appwrite' : (resStorageProvider || 'external'),
                storageFileId: newStoredFile?.fileId || resStorageFileId,
                fileName: newStoredFile?.name || resStoredFileName,
                mimeType: newStoredFile?.mimeType || resStoredMimeType,
                sizeBytes: newStoredFile?.size || resStoredSize,
                approved: true,
                approvedAt: serverTimestamp(),
                approvedBy: reviewerId,
                updatedAt: serverTimestamp()
            };

            if (resType === 'past-papers') { 
                resData.year = resYear; 
                resData.session = resSession; 
            } else if (resType === 'library') { 
                resData.size = newStoredFile ? formatFileSize(newStoredFile.size) : resSize;
                resData.coverUrl = resCoverUrl.trim();
            }

            if (editingId) {
                await updateDoc(doc(db, 'global_resources', editingId), resData);
            } else {
                resData.createdAt = serverTimestamp();
                await addDoc(collection(db, 'global_resources'), resData);
            }
            metadataSaved = true;
            if (newStoredFile && resStorageProvider === 'appwrite' && resStorageFileId && resStorageFileId !== newStoredFile.fileId) {
                await deleteAdminResourceFile(resStorageFileId).catch(error => {
                    console.warn('The replaced Appwrite file could not be cleaned up.', error);
                });
            }
            alert(editingId ? "Resource updated and published." : "Resource published successfully.");
            resetForm();
        } catch (e) { 
            console.error(e); 
            if (newStoredFile && !metadataSaved) {
                await deleteAdminResourceFile(newStoredFile.fileId).catch(() => undefined);
            }
            const message = e instanceof Error ? e.message : 'Unknown upload error';
            alert(`Error saving resource: ${message}`);
        } finally { 
            setIsSaving(false); 
        }
    };

    const handleEditClick = (res: any) => {
        setEditingId(res.id);
        setResType(res.type);
        setResTitle(res.title || '');
        setResUrl(res.url || '');
        setResCourse(res.course || '');
        setResSubject(res.subject || '');
        setResFile(null);
        setResStorageProvider(res.storageProvider || '');
        setResStorageFileId(res.storageFileId || '');
        setResStoredFileName(res.fileName || '');
        setResStoredMimeType(res.mimeType || '');
        setResStoredSize(Number(res.sizeBytes) || 0);
        setUploadProgress(0);
        analysisRequestId.current += 1;
        setIsAnalyzing(false);
        setAnalysisMessage('');
        if (res.type === 'past-papers') {
            setResYear(res.year || '');
            setResSession(res.session || 'November');
        }
        if (res.type === 'library') {
            setResSize(res.size || '1.5 MB');
            setResCoverUrl(res.coverUrl || '');
        }
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteResource = async (resource: any) => {
        if (!confirm("Delete this resource from the public library? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'global_resources', resource.id));
            if (resource.storageProvider === 'appwrite' && resource.storageFileId) {
                await deleteAdminResourceFile(resource.storageFileId).catch(error => {
                    console.warn('Resource metadata was deleted, but Appwrite file cleanup failed.', error);
                    alert('The resource was removed, but its Appwrite file could not be cleaned up. Check the Appwrite bucket.');
                });
            }
            if (editingId === resource.id) resetForm();
        } catch (e) { 
            console.error(e); 
            alert('The resource could not be deleted.');
        }
    };

    return (
        <div className="space-y-8 animate-dropdown-reveal text-left">
            <section className="bg-white dark:bg-[#161616] p-6 md:p-8 rounded-none border border-gray-200 dark:border-[#222] shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-tight">
                        <FileStack size={20} className="text-blue-500"/> 
                        {editingId ? 'Edit Resource' : 'Resource Uploader'}
                    </h3>
                    {editingId && (
                        <button onClick={resetForm} className="text-gray-400 hover:text-[#ff7400] flex items-center gap-1 text-xs font-black uppercase tracking-widest">
                            <X size={14}/> Cancel Edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Type</label>
                        <div className="flex flex-col gap-2">
                            {[
                                { id: 'syllabi', icon: BookOpen, label: 'Syllabus' }, 
                                { id: 'library', icon: Library, label: 'Textbook' }, 
                                { id: 'past-papers', icon: Archive, label: 'Past Paper' }
                            ].map(t => (
                                <button 
                                    key={t.id} 
                                    disabled={!!editingId} // Disable type switching during edit to maintain data integrity
                                    onClick={() => setResType(t.id as ResourceType)} 
                                    className={`p-3 rounded-none border flex items-center gap-3 transition-all ${editingId ? 'opacity-50 cursor-not-allowed' : ''} ${resType === t.id ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-[#333]'}`}
                                >
                                    <t.icon size={18}/>
                                    <span className="text-xs font-bold uppercase tracking-widest">{t.label}</span>
                                </button>
                            ))}
                        </div>
                        {editingId && <p className="mt-2 text-[9px] text-gray-400 italic">Type is locked during edit.</p>}
                    </div>

                    <div className="md:col-span-2 space-y-4 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Level</label>
                                <select 
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" 
                                    value={resCourse} 
                                    onChange={e => setResCourse(e.target.value)}
                                >
                                    <option value="">Select course or level</option>
                                    {resourceLevelGroups.map(group => (
                                        <optgroup key={group.label} label={group.label}>
                                            {group.options.map(option => <option key={`${group.label}-${option}`} value={option}>{option}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Subject</label>
                                <input 
                                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" 
                                    placeholder="e.g. Mathematics" 
                                    value={resSubject} 
                                    onChange={e => setResSubject(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Title</label>
                            <input 
                                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" 
                                placeholder="Resource Title" 
                                value={resTitle} 
                                onChange={e => setResTitle(e.target.value)} 
                            />
                        </div>

                        <div className="border-2 border-dashed border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/20">
                            <label className="text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase mb-2 block tracking-widest">Upload resource to Appwrite Cloud</label>
                            <input
                                type="file"
                                accept={RESOURCE_FILE_ACCEPT}
                                disabled={isSaving}
                                className="block w-full text-xs text-gray-600 file:mr-4 file:border-0 file:bg-blue-600 file:px-4 file:py-2.5 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:text-white hover:file:bg-blue-500 dark:text-gray-300"
                                onChange={event => {
                                    const file = event.target.files?.[0] || null;
                                    if (file && file.size > MAX_RESOURCE_FILE_SIZE) {
                                        alert(`Files must be ${formatFileSize(MAX_RESOURCE_FILE_SIZE)} or smaller.`);
                                        event.target.value = '';
                                        analysisRequestId.current += 1;
                                        setResFile(null);
                                        setIsAnalyzing(false);
                                        setAnalysisMessage('');
                                        return;
                                    }
                                    setResFile(file);
                                    setUploadProgress(0);
                                    if (file) void prefillResourceWithAI(file);
                                }}
                            />
                            <p className="mt-2 text-[10px] leading-relaxed text-blue-700/80 dark:text-blue-300/80">
                                PDF, Word, EPUB, PowerPoint, Excel, text or ZIP; maximum {formatFileSize(MAX_RESOURCE_FILE_SIZE)}.
                                {resStorageProvider === 'appwrite' && resStorageFileId && !resFile
                                    ? ` Current file: ${resStoredFileName || resStorageFileId}. Choose a new file to replace it.`
                                    : ' The selected file is uploaded when you save.'}
                            </p>
                            {resFile && (
                                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] font-bold text-gray-700 dark:text-gray-200">
                                    <span className="min-w-0 truncate">{resFile.name} · {formatFileSize(resFile.size)}</span>
                                    <button type="button" disabled={isSaving} onClick={() => {
                                        analysisRequestId.current += 1;
                                        setResFile(null);
                                        setIsAnalyzing(false);
                                        setAnalysisMessage('');
                                    }} className="shrink-0 text-red-500 hover:text-red-600">Remove</button>
                                </div>
                            )}
                            {analysisMessage && (
                                <div className={`mt-3 flex items-start gap-2 rounded-[8px] px-3 py-2 text-[10px] font-bold ${isAnalyzing ? 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' : 'bg-white/80 text-blue-700 dark:bg-white/5 dark:text-blue-300'}`} aria-live="polite">
                                    {isAnalyzing ? <Loader2 className="mt-0.5 shrink-0 animate-spin" size={13} /> : <Sparkles className="mt-0.5 shrink-0" size={13} />}
                                    <span>{analysisMessage}</span>
                                </div>
                            )}
                            {isSaving && resFile && (
                                <div className="mt-3" aria-live="polite">
                                    <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-700 dark:text-blue-300">
                                        <span>Uploading</span><span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950">
                                        <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploadProgress}%` }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">External URL (alternative)</label>
                            <input 
                                type="url"
                                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" 
                                placeholder="Use this only when the file is already hosted elsewhere" 
                                value={resUrl} 
                                onChange={e => setResUrl(e.target.value)} 
                            />
                            <p className="mt-1.5 text-[10px] text-gray-400">A selected Appwrite file takes priority over this URL.</p>
                        </div>

                        {resType === 'past-papers' && (
                            <div className="grid grid-cols-2 gap-4 animate-dropdown-reveal">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Exam Year</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-white outline-none" value={resYear} onChange={e => setResYear(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Session</label>
                                    <select className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-white outline-none" value={resSession} onChange={e => setResSession(e.target.value)}>
                                        <option>June</option>
                                        <option>November</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {resType === 'library' && (
                            <div className="animate-dropdown-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">File Size Estimate</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" placeholder="e.g. 2.4 MB" value={resSize} onChange={e => setResSize(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block tracking-widest">Cover Image URL</label>
                                    <input className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-none px-4 py-2.5 text-sm text-gray-900 dark:text-white outline-none" placeholder="/Books/cover.png — optional" value={resCoverUrl} onChange={e => setResCoverUrl(e.target.value)} />
                                </div>
                            </div>
                        )}

                        <button 
                            onClick={handleSaveGlobalResource} 
                            disabled={isSaving || isAnalyzing}
                            className={`w-full py-4 rounded-none font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2 ${editingId ? 'bg-orange-600 hover:bg-orange-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                        >
                            {isAnalyzing ? <><Loader2 className="animate-spin" size={16}/> AI is filling details</> : isSaving ? <><Loader2 className="animate-spin" size={16}/> {resFile ? `Uploading ${uploadProgress}%` : 'Saving'}</> : editingId ? <><Save size={16}/> Save Resource</> : <><Upload size={16}/> Save Resource</>}
                        </button>
                    </div>
                </div>
            </section>

            <section className="bg-white dark:bg-[#161616] p-6 md:p-8 rounded-none border border-gray-200 dark:border-[#222] shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg uppercase tracking-tight">Active Library</h3>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-[#333] rounded-none pl-10 pr-4 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-blue-500 transition-colors" placeholder="Search by title..." value={resSearch} onChange={e => setResSearch(e.target.value)} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] text-gray-500 font-black uppercase text-[8px] tracking-widest border-b dark:border-[#222]">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Context</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-[#222]">
                            {globalResources.filter(r => r.title?.toLowerCase().includes(resSearch.toLowerCase())).map(r => (
                                <tr key={r.id} className={`transition-colors ${editingId === r.id ? 'bg-orange-500/5' : 'hover:bg-gray-50 dark:hover:bg-[#1e1e1e]'}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-gray-200">{r.title}</div>
                                        <div className="text-[10px] text-gray-400 truncate max-w-xs">{r.url}</div>
                                        {r.storageProvider === 'appwrite' && (
                                            <div className="mt-1 text-[9px] font-black uppercase tracking-wider text-blue-600">Appwrite · {r.fileName || 'managed file'}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 uppercase text-[9px] font-black">
                                        <span className={`px-2 py-1 rounded-none border ${r.type === 'syllabi' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 border-purple-200 dark:border-purple-800' : r.type === 'past-papers' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800' : 'bg-green-100 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800'}`}>
                                            {r.type.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {r.course} 
                                        <br/>
                                        <span className="text-[10px] font-bold text-gray-400">{r.subject}</span>
                                        {r.year && <span className="text-[9px] text-blue-500 ml-2">({r.year} {r.session})</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleEditClick(r)} 
                                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-none transition-colors"
                                                title="Edit"
                                            >
                                                <Edit3 size={16}/>
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteResource(r)} 
                                                className="p-2 text-gray-400 hover:text-[#ff7400] hover:bg-[#ff7400]/100/10 rounded-none transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {globalResources.length === 0 && (
                    <div className="py-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No resources in the database.</div>
                )}
            </section>
        </div>
    );
};

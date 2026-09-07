import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardPaste,
  Flame,
  GraduationCap,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  School as SchoolIcon,
  Star,
  Trophy,
  UploadCloud,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { polytechnicLogoForName } from '../../data/polytechnicLogos';
import {
  fetchGlobalRanking,
  fetchMyRank,
  fetchSuggestedClassmates,
  type PublicProfile,
} from '../../services/studentDirectory';
import { SubjectRemovalDialog } from './SubjectRemovalDialog';

const HIGH_SCHOOL_LEVELS = [
  { label: 'Form 1', value: 'Form 1' },
  { label: 'Form 2', value: 'Form 2' },
  { label: 'Form 3', value: 'Form 3' },
  { label: 'Form 4', value: 'Form 4' },
  { label: 'Form 5', value: 'Lower 6' },
  { label: 'Form 6', value: 'Upper 6' },
] as const;

const POLYTECHNIC_LEVELS = CURRICULUM_REGISTRY.filter((level) => level.category === 'Polytechnic');
const ALL_SUBJECT_OPTIONS = Array.from(
  new Map(
    CURRICULUM_REGISTRY.flatMap((level) => level.subjects)
      .map((subject) => [subject.name, { name: subject.name, description: subject.description }] as const)
  ).values()
).sort((a, b) => a.name.localeCompare(b.name));

/** Resolve legacy signup labels onto the actual curriculum record. */
const curriculumLevelFor = (savedLevel: string) => {
  const alias = savedLevel === 'Form 5' ? 'Lower 6' : savedLevel === 'Form 6' ? 'Upper 6' : savedLevel;
  return CURRICULUM_REGISTRY.find((level) => level.name === alias) ?? null;
};

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'S';

/* ------------------------------------------------------------------ pieces */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">{children}</p>
);

const Fact: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="min-w-0">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{children}</div>
  </div>
);

const Avatar: React.FC<{ name: string; photoURL?: string; size?: number }> = ({
  name,
  photoURL,
  size = 40,
}) =>
  photoURL ? (
    <img
      src={photoURL}
      alt=""
      style={{ width: size, height: size }}
      className="rounded-full object-cover shrink-0"
    />
  ) : (
    <div
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      className="rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center shrink-0"
    >
      {initials(name)}
    </div>
  );

/* ------------------------------------------------------------- subjects */

const SubjectManager: React.FC<{
  enrolled: string[];
  available: { name: string; description: string }[];
  levelName: string;
  onChange: (subjects: string[]) => Promise<void>;
}> = ({ enrolled, available, levelName, onChange }) => {
  const [adding, setAdding] = useState(enrolled.length === 0);
  const [draft, setDraft] = useState<string[]>(enrolled);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [browsingAllSubjects, setBrowsingAllSubjects] = useState(false);

  useEffect(() => {
    setDraft(enrolled);
    if (enrolled.length === 0) {
      setAdding(true);
    }
  }, [enrolled]);

  const subjectPool = (browsingAllSubjects ? ALL_SUBJECT_OPTIONS : available).filter((subject) => (
    !search.trim() || subject.name.toLowerCase().includes(search.trim().toLowerCase())
  ));
  const selectedForDelete = enrolled.filter((subject) => draft.includes(subject));

  const toggleDraft = (name: string) => {
    setDraft((current) => (
      current.includes(name)
        ? current.filter((subject) => subject !== name)
        : [...current, name]
    ));
  };

  const save = async () => {
    setSaving(true);
    await onChange(draft);
    setSaving(false);
    setAdding(false);
  };

  const remove = async (name: string) => {
    await onChange(enrolled.filter((subject) => subject !== name));
  };

  const Chip: React.FC<{ subject: string; off?: boolean }> = ({ subject, off }) => (
    <span
      className={`group inline-flex items-center gap-2 rounded-full pl-3 pr-1.5 py-1.5 text-xs font-bold ${
        off
          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300'
          : 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300'
      }`}
      title={off ? `${subject} is outside the selected subject group` : undefined}
    >
      {subject}
      <button
        onClick={() => void remove(subject)}
        aria-label={`Remove ${subject}`}
        className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors disabled:opacity-40 ${
          off
            ? 'hover:bg-amber-200 dark:hover:bg-amber-500/20'
            : 'hover:bg-purple-200 dark:hover:bg-purple-500/20'
        }`}
      >
        <X size={12} />
      </button>
    </span>
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {enrolled.map((subject) => (
          <Chip key={subject} subject={subject} />
        ))}

        {enrolled.length === 0 && (
          <p className="text-xs text-gray-400">
            No subjects yet — add the ones you are taking this year.
          </p>
        )}

        <button
          onClick={() => {
            setDraft(enrolled);
            setAdding((open) => !open);
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 dark:border-white/20 px-3 py-1.5 text-xs font-bold text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {adding && (
        <div className="mt-3 rounded-[9px] border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3">
          {available.length || ALL_SUBJECT_OPTIONS.length ? (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{browsingAllSubjects ? 'All subjects' : `Subjects for ${levelName}`}</p>
                <div className="relative w-full sm:w-48">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={browsingAllSubjects ? 'Search all subjects' : 'Search subjects'} className="w-full rounded-[9px] border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs outline-none focus:border-purple-400 dark:border-white/10 dark:bg-[#252932]" />
                </div>
              </div>
              <div className="grid max-h-72 grid-cols-1 gap-2 overflow-y-auto custom-scrollbar sm:grid-cols-2 lg:grid-cols-3">
                {subjectPool.map((subject) => {
                  const checked = draft.includes(subject.name);
                  return (
                    <button
                      key={subject.name}
                      onClick={() => toggleDraft(subject.name)}
                      className={`flex min-h-[48px] items-center gap-3 rounded-[9px] border p-3 text-left transition-colors ${
                        checked
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
                          : 'border-gray-200 bg-white hover:border-purple-300 dark:border-white/10 dark:bg-[#252932]'
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${checked ? 'border-purple-500 bg-purple-600 text-white' : 'border-gray-300 dark:border-white/20'}`}>
                        {checked && <Check size={13} />}
                      </span>
                      <span className="min-w-0 text-xs font-black text-gray-800 dark:text-white">{subject.name}</span>
                    </button>
                  );
                })}
                {!browsingAllSubjects && (
                  <button type="button" onClick={() => { setBrowsingAllSubjects(true); setSearch(''); }} className="flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] border border-dashed border-purple-400 bg-purple-50 p-3 text-xs font-black text-purple-600 hover:bg-purple-100 dark:bg-purple-500/10">
                    <Plus size={14} /> Add Subject
                  </button>
                )}
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {selectedForDelete.length > 0 && (
                  <button type="button" onClick={() => setConfirmingDelete(true)} disabled={saving} className="rounded-[9px] bg-rose-600 px-4 py-2 text-xs font-black text-white hover:bg-rose-700 disabled:opacity-40">
                    Delete{selectedForDelete.length > 1 ? ` (${selectedForDelete.length})` : ''}
                  </button>
                )}
                <button
                  onClick={() => void save()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-[9px] bg-purple-600 px-4 py-2 text-xs font-black text-white disabled:opacity-40"
                >
                  {saving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  Save subjects
                </button>
              </div>
              {confirmingDelete && (
                <SubjectRemovalDialog
                  count={selectedForDelete.length}
                  onCancel={() => setConfirmingDelete(false)}
                  onConfirm={async () => {
                    const remaining = enrolled.filter((subject) => !selectedForDelete.includes(subject));
                    await onChange(remaining);
                    setDraft(remaining);
                  }}
                  onFinished={() => {
                    setConfirmingDelete(false);
                    setAdding(false);
                  }}
                />
              )}
            </>
          ) : (
            <p className="rounded-[9px] border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-xs font-semibold text-gray-400 dark:border-white/10 dark:bg-[#252932]">
              Choose a course or level above before adding subjects.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* --------------------------------------------------------------- editing */

type EditableProfile = { firstName: string; lastName: string; school: string };

const ProfileEditor: React.FC<{
  initial: EditableProfile;
  onCancel: () => void;
  onSave: (values: EditableProfile) => Promise<void>;
}> = ({ initial, onCancel, onSave }) => {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);

  const field = (key: keyof EditableProfile) => ({
    value: values[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [key]: event.target.value })),
    className:
      'w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-purple-500',
  });

  const submit = async () => {
    setSaving(true);
    await onSave(values);
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-400 mb-1 block">First name</label>
        <input {...field('firstName')} />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">Last name</label>
        <input {...field('lastName')} />
      </div>
      <div>
        <label className="text-xs text-gray-400 mb-1 block">School</label>
        <input {...field('school')} placeholder="e.g. Prince Edward School" />
      </div>
      <div className="sm:col-span-2 flex gap-2">
        <button
          onClick={() => void submit()}
          disabled={saving || !values.firstName.trim()}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 text-white px-5 py-2.5 text-sm font-bold hover:bg-purple-700 disabled:opacity-50"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Save profile
        </button>
        <button
          onClick={onCancel}
          className="rounded-xl border border-gray-200 dark:border-white/10 px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const CourseLevelEditor: React.FC<{
  initialType?: 'high-school' | 'polytechnic' | 'ecd';
  initialLevel: string;
  onSave: (educationType: 'high-school' | 'polytechnic', level: string) => Promise<void>;
  onClose: () => void;
}> = ({ initialType, initialLevel, onSave, onClose }) => {
  const initialCurriculum = curriculumLevelFor(initialLevel);
  const [educationType, setEducationType] = useState<'high-school' | 'polytechnic'>(
    initialType === 'polytechnic' || initialCurriculum?.category === 'Polytechnic' ? 'polytechnic' : 'high-school'
  );
  const [selected, setSelected] = useState(initialCurriculum?.name ?? '');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [saveError, setSaveError] = useState('');

  const polytechnicLevels = POLYTECHNIC_LEVELS.filter((level) => (
    !search.trim() || `${level.name} ${level.subjects.map((subject) => subject.name).join(' ')}`.toLowerCase().includes(search.trim().toLowerCase())
  ));

  const chooseType = (type: 'high-school' | 'polytechnic') => {
    setEducationType(type);
    setSelected('');
    setSearch('');
  };

  const update = async () => {
    if (!selected || status !== 'idle') return;
    setSaveError('');
    setStatus('saving');
    try {
      await onSave(educationType, selected);
      setStatus('success');
      window.setTimeout(onClose, 700);
    } catch (error) {
      console.error('Could not update course or level', error);
      setSaveError('Could not update. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="mt-4 overflow-hidden rounded-[9px] border border-violet-200 bg-[#faf8ff] p-3 shadow-sm dark:border-violet-500/20 dark:bg-white/5">
      <div className="grid grid-cols-2 gap-2 rounded-[9px] bg-slate-100 p-1 dark:bg-black/20">
        <button type="button" onClick={() => chooseType('high-school')} className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-black ${educationType === 'high-school' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-white'}`}><SchoolIcon size={14} /> High School</button>
        <button type="button" onClick={() => chooseType('polytechnic')} className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2 text-xs font-black ${educationType === 'polytechnic' ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-white'}`}><GraduationCap size={14} /> Polytechnic</button>
      </div>

      {educationType === 'high-school' ? (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {HIGH_SCHOOL_LEVELS.map((level) => (
            <button key={level.label} type="button" onClick={() => setSelected(level.value)} className={`rounded-[8px] border px-2 py-2 text-xs font-bold ${selected === level.value ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300'}`}>{level.label}</button>
          ))}
        </div>
      ) : (
        <div className="mt-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Polytechnic courses" className="w-full rounded-[8px] border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-violet-400" />
          </div>
          <div className="mt-2 max-h-48 space-y-1 overflow-y-auto custom-scrollbar">
            {polytechnicLevels.map((level) => (
              <button key={level.id} type="button" onClick={() => setSelected(level.name)} className={`flex w-full items-center gap-2 rounded-[8px] px-3 py-2 text-left text-xs font-semibold ${selected === level.name ? 'bg-violet-600 text-white' : 'bg-white text-slate-600 hover:bg-violet-50'}`}><span className="min-w-0 flex-1">{level.name}</span>{selected === level.name && <Check size={13} />}</button>
            ))}
          </div>
        </div>
      )}

      <button type="button" onClick={() => void update()} disabled={!selected || status !== 'idle'} className={`mt-3 inline-flex min-w-28 items-center justify-center gap-2 rounded-[9px] px-5 py-2.5 text-xs font-black text-white transition ${status === 'success' ? 'bg-emerald-500' : 'bg-violet-600 hover:bg-violet-700'} disabled:opacity-50`}>
        {status === 'saving' ? <Loader2 size={15} className="animate-spin" /> : status === 'success' ? <Check size={16} strokeWidth={3} /> : 'Update'}
      </button>
      {saveError && <p className="mt-2 text-xs font-semibold text-rose-600">{saveError}</p>}
    </div>
  );
};

const PhotoDropModal: React.FC<{
  open: boolean;
  saving: boolean;
  onClose: () => void;
  onFile: (file: File) => void;
  onBrowse: () => void;
}> = ({ open, saving, onClose, onFile, onBrowse }) => {
  const [dragging, setDragging] = useState(false);
  const [pasteError, setPasteError] = useState('');

  useEffect(() => {
    if (!open) return;
    const paste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((item) => item.type.startsWith('image/'));
      if (file) onFile(file);
    };
    window.addEventListener('paste', paste);
    return () => window.removeEventListener('paste', paste);
  }, [open, onFile]);

  const pasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((type) => type.startsWith('image/'));
        if (imageType) {
          onFile(new File([await item.getType(imageType)], 'pasted-profile-image', { type: imageType }));
          return;
        }
      }
      setPasteError('No image found on the clipboard.');
    } catch {
      setPasteError('Clipboard access was not available. Press Ctrl+V instead.');
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[480] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <section className="w-full max-w-md rounded-[9px] bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-lg font-black text-slate-950">Update profile photo</p><p className="mt-1 text-xs text-slate-500">Drop, paste, or browse for an image.</p></div>
          <button type="button" onClick={onClose} disabled={saving} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-slate-100"><X size={16} /></button>
        </div>
        <div onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith('image/')); if (file) onFile(file); }} className={`mt-4 flex min-h-44 flex-col items-center justify-center rounded-[9px] border-2 border-dashed p-5 text-center transition ${dragging ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-slate-50'}`}>
          {saving ? <><Loader2 size={30} className="animate-spin text-violet-600" /><p className="mt-3 text-xs font-bold text-slate-600">Saving image...</p></> : <><UploadCloud size={32} className="text-violet-600" /><p className="mt-3 text-sm font-black text-slate-800">Drop your image here</p><p className="mt-1 text-xs text-slate-400">PNG, JPG or WebP up to 4 MB</p></>}
        </div>
        {!saving && <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => void pasteFromClipboard()} className="flex items-center justify-center gap-2 rounded-[9px] border border-slate-200 px-3 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50"><ClipboardPaste size={15} /> Paste image</button><button type="button" onClick={onBrowse} className="flex items-center justify-center gap-2 rounded-[9px] bg-violet-600 px-3 py-2.5 text-xs font-black text-white hover:bg-violet-700"><ImagePlus size={15} /> Browse files</button></div>}
        {pasteError && <p className="mt-2 text-center text-[11px] font-semibold text-rose-500">{pasteError}</p>}
      </section>
    </div>
  );
};

const prepareProfileImage = (file: File) => new Promise<string>((resolve, reject) => {
  if (!file.type.startsWith('image/')) {
    reject(new Error('Choose an image file.'));
    return;
  }
  if (file.size > 4 * 1024 * 1024) {
    reject(new Error('The image must be smaller than 4 MB.'));
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => reject(new Error('The image could not be read.'));
  reader.onload = () => {
    const image = new Image();
    image.onerror = () => reject(new Error('The selected file is not a valid image.'));
    image.onload = () => {
      const scale = Math.min(1, 512 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('The image could not be prepared.'));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
});

/* ------------------------------------------------------------------- hub */

type Tab = 'classmates' | 'ranking';

export const StudentProfileHub: React.FC<{ onNavigate?: (page: string, params?: any) => void }> = ({
  onNavigate,
}) => {
  const { user, userProfile, updateProfileData } = useAuth();

  const [tab, setTab] = useState<Tab>('classmates');
  const [editing, setEditing] = useState(false);
  const [ranking, setRanking] = useState<PublicProfile[]>([]);
  const [classmates, setClassmates] = useState<(PublicProfile & { sharedSubjects: string[] })[]>([]);
  const [myRank, setMyRank] = useState<{ rank: number; capped: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [socialError, setSocialError] = useState(false);
  const [courseEditing, setCourseEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoSaving, setPhotoSaving] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const displayName = `${userProfile?.firstName ?? ''} ${userProfile?.lastName ?? ''}`.trim();
  const subjects = useMemo(() => userProfile?.enrolledSubjects ?? [], [userProfile]);
  const level = userProfile?.grade ?? '';
  const curriculumLevel = useMemo(() => curriculumLevelFor(level), [level]);
  const availableSubjects = useMemo(
    () => curriculumLevel?.subjects.map((subject) => ({ name: subject.name, description: subject.description })) ?? [],
    [curriculumLevel]
  );
  const eligibleSubjects = useMemo(
    () => subjects.filter((subject) => ALL_SUBJECT_OPTIONS.some((available) => available.name === subject)),
    [subjects]
  );
  const points = userProfile?.totalPoints ?? 0;
  const polytechnicLogo = polytechnicLogoForName(userProfile?.school);

  const loadSocial = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setSocialError(false);
    try {
      const [rankingRows, classmateRows, rank] = await Promise.all([
        fetchGlobalRanking(25),
        fetchSuggestedClassmates(user.uid, level, subjects),
        fetchMyRank(points),
      ]);
      setRanking(rankingRows);
      setClassmates(classmateRows);
      setMyRank(rank);
    } catch (error) {
      console.error('student directory unavailable', error);
      setSocialError(true);
    } finally {
      setLoading(false);
    }
  }, [user, level, subjects, points]);

  useEffect(() => {
    void loadSocial();
  }, [loadSocial]);

  const saveSubjects = async (next: string[]) => {
    const allowed = new Set(ALL_SUBJECT_OPTIONS.map((subject) => subject.name));
    await updateProfileData({ enrolledSubjects: next.filter((subject) => allowed.has(subject)) });
  };

  const saveProfile = async (values: EditableProfile) => {
    await updateProfileData({
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      school: values.school.trim(),
    });
    setEditing(false);
  };

  const saveCourseLevel = async (educationType: 'high-school' | 'polytechnic', nextLevel: string) => {
    await updateProfileData({
      educationType,
      grade: nextLevel,
      course: educationType === 'polytechnic' ? nextLevel : '',
      enrolledSubjects: [],
    });
  };

  const savePhotoFile = useCallback(async (file: File) => {
    setPhotoSaving(true);
    setPhotoError('');
    try {
      const photoURL = await prepareProfileImage(file);
      await updateProfileData({ photoURL });
      setPhotoModalOpen(false);
    } catch (error: any) {
      setPhotoError(error?.message || 'Could not update the profile photo.');
    } finally {
      setPhotoSaving(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  }, [updateProfileData]);

  const openPhotoPicker = () => {
    if (window.matchMedia('(max-width: 639px)').matches) photoInputRef.current?.click();
    else setPhotoModalOpen(true);
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-100 dark:bg-[#1c1f26] dark:ring-white/10">
        <Loader2 className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------ profile card */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[#1c1f26] dark:ring-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">

          {/* Identity */}
          <div className="flex flex-col items-center border-b border-violet-100 bg-[#faf8ff] p-6 text-center dark:border-violet-500/15 dark:bg-[#20232a] lg:border-b-0 lg:border-r">
            <div className="relative">
              <Avatar name={displayName} photoURL={userProfile.photoURL} size={112} />
              <button type="button" onClick={openPhotoPicker} aria-label="Change profile photo" className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-4 border-[#faf8ff] bg-violet-600 text-white shadow-lg transition hover:bg-violet-700 dark:border-[#20232a]">
                {photoSaving ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void savePhotoFile(file); }} />
            </div>
            {photoError && <p className="mt-2 text-[11px] font-semibold text-rose-500">{photoError}</p>}
            <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
              {displayName || 'Student'}
            </h2>

            <div className="mt-2 flex items-center gap-1.5">
              <Star size={14} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{points}</span>
              <span className="text-xs text-gray-400">points</span>
            </div>

            {myRank && (
              <div className="mt-4 w-full">
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                    Global rank
                  </span>
                  <span className="text-sm font-black text-purple-600">
                    {myRank.capped ? '500+' : `#${myRank.rank}`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{
                      width: `${Math.max(4, 100 - Math.min(myRank.rank, 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => setEditing((open) => !open)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:border-purple-400 hover:text-purple-600 transition-colors"
            >
              <Pencil size={13} /> {editing ? 'Close editor' : 'Edit profile'}
            </button>
          </div>

          {/* Facts */}
          <div className="space-y-6 p-6">
            {editing ? (
              <div>
                <SectionLabel>Edit profile</SectionLabel>
                <ProfileEditor
                  initial={{
                    firstName: userProfile.firstName ?? '',
                    lastName: userProfile.lastName ?? '',
                    school: userProfile.school ?? '',
                  }}
                  onCancel={() => setEditing(false)}
                  onSave={saveProfile}
                />
              </div>
            ) : (
              <div>
                <SectionLabel>Student profile</SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <Fact label="School">
                    <span className="inline-flex items-center gap-2">
                      {polytechnicLogo ? (
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-1 dark:border-white/10">
                          <img src={polytechnicLogo} alt="" className="h-full w-full object-contain" />
                        </span>
                      ) : (
                        <SchoolIcon size={14} className="text-purple-600 shrink-0" />
                      )}
                      {userProfile.school || <span className="text-gray-400 font-medium">Not set</span>}
                    </span>
                  </Fact>
                  <Fact label="Course / level">
                    <span className="inline-flex items-center gap-2">
                      <GraduationCap size={14} className="text-purple-600 shrink-0" />
                      {level || (
                        <span className="text-gray-400 font-medium">No course/level selected</span>
                      )}
                      <button type="button" onClick={() => setCourseEditing((open) => !open)} aria-label="Edit course or level" className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-gray-400 transition hover:bg-violet-50 hover:text-violet-600 dark:hover:bg-white/10">
                        <Pencil size={12} />
                      </button>
                    </span>
                  </Fact>
                  <Fact label="Day streak">
                    <span className="inline-flex items-center gap-2">
                      <Flame size={14} className="text-orange-500 shrink-0" />
                      {userProfile.streak || 0} days
                    </span>
                  </Fact>
                </div>
                {courseEditing && (
                  <CourseLevelEditor
                    initialType={userProfile.educationType}
                    initialLevel={level}
                    onSave={saveCourseLevel}
                    onClose={() => setCourseEditing(false)}
                  />
                )}
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  My subjects ({eligibleSubjects.length})
                </p>
              </div>
              <SubjectManager
                enrolled={eligibleSubjects}
                available={availableSubjects}
                levelName={curriculumLevel?.name ?? level}
                onChange={saveSubjects}
              />
            </div>
          </div>
        </div>
      </div>

      <PhotoDropModal
        open={photoModalOpen}
        saving={photoSaving}
        onClose={() => setPhotoModalOpen(false)}
        onFile={(file) => void savePhotoFile(file)}
        onBrowse={() => photoInputRef.current?.click()}
      />

      {/* ------------------------------------------------------------- tabs */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100 dark:bg-[#1c1f26] dark:ring-white/10">
        <div className="flex border-b border-gray-100 dark:border-[#2a2a2a] px-2">
          {([
            { id: 'classmates' as const, label: 'Students like me', icon: Users },
            { id: 'ranking' as const, label: 'Dedicated Learners', icon: Trophy },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`relative flex items-center gap-2 px-5 py-4 text-sm font-bold transition-colors ${
                tab === item.id
                  ? 'text-purple-600'
                  : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <item.icon size={16} />
              {item.label}
              {tab === item.id && (
                <span className="absolute left-3 right-3 bottom-0 h-[3px] rounded-t bg-purple-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-purple-600" />
            </div>
          ) : socialError ? (
            <div className="py-10 text-center">
              <p className="text-sm font-semibold text-gray-500">
                Rankings are not available right now.
              </p>
              <p className="text-xs text-gray-400 mt-1">
                They need the public_profiles rules and index deployed — see
                docs/STUDENT_DIRECTORY.md.
              </p>
            </div>
          ) : tab === 'classmates' ? (
            classmates.length === 0 ? (
              <div className="py-10 text-center">
                <Users size={22} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-500">
                  Nobody to suggest yet
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {eligibleSubjects.length === 0
                    ? 'Add the subjects you take and we will find students doing the same ones.'
                    : `As more ${level} students add their subjects, the ones sharing yours appear here.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {classmates.map((mate) => (
                  <button
                    key={mate.id}
                    onClick={() => onNavigate?.('public-profile', { id: mate.id })}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 dark:border-white/10 p-4 text-left hover:border-purple-400 transition-colors"
                  >
                    <Avatar name={mate.displayName} photoURL={mate.photoURL} size={44} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {mate.displayName}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {mate.school || 'School not set'}
                      </p>
                      <p className="text-[11px] font-semibold text-purple-600 mt-0.5">
                        {mate.sharedSubjects.length} subject
                        {mate.sharedSubjects.length === 1 ? '' : 's'} in common
                      </p>
                    </div>
                    <ChevronRight size={15} className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            )
          ) : ranking.length === 0 ? (
            <div className="py-10 text-center">
              <Trophy size={22} className="text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-500">No rankings yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {ranking.map((student, index) => {
                const isMe = student.id === user?.uid;
                return (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                      isMe ? 'bg-purple-50 dark:bg-purple-500/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span
                      className={`w-7 text-center font-black text-sm tabular-nums ${
                        index === 0
                          ? 'text-yellow-500'
                          : index < 3
                            ? 'text-gray-500'
                            : 'text-gray-300'
                      }`}
                    >
                      {index + 1}
                    </span>
                    {index === 0 && <Award size={15} className="text-yellow-500 shrink-0" />}
                    <Avatar name={student.displayName} photoURL={student.photoURL} size={34} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {student.displayName}
                        {isMe && <span className="ml-2 text-[10px] text-purple-600">You</span>}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {[student.school, student.level].filter(Boolean).join(' · ') ||
                          'School not set'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-black text-gray-900 dark:text-white tabular-nums">
                        {student.visitCount ?? student.totalPoints ?? 0}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {(student.visitCount ?? student.totalPoints ?? 0) === 1 ? 'visit' : 'visits'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p className="flex items-center gap-2 text-[11px] text-gray-400 px-1">
        <BookOpen size={13} />
        Your name, school, level, subjects and score are visible to other signed-in students. Your
        email, quiz history and messages are not.
      </p>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  GraduationCap,
  Loader2,
  MapPin,
  Search,
  School,
  Sparkles,
  UserRound,
  X,
} from 'lucide-react';
import { POLYTECHNIC_COURSE_GROUPS } from '../../data/polytechnicCourses';
import { searchSchools, type SchoolSuggestion } from '../../data/schoolRegistry';

type EducationType = 'high-school' | 'polytechnic';

interface GoogleProfileCompletionProps {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string | null;
  onComplete: (profile: {
    firstName: string;
    lastName: string;
    educationType: EducationType;
    grade: string;
    school: string;
  }) => Promise<void>;
}

export function GoogleProfileCompletion({
  firstName: initialFirstName,
  lastName: initialLastName,
  email,
  photoURL,
  onComplete,
}: GoogleProfileCompletionProps) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [educationType, setEducationType] = useState<EducationType | ''>('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [schoolMenuOpen, setSchoolMenuOpen] = useState(false);
  const [courseSearch, setCourseSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isPolytechnic = educationType === 'polytechnic';

  const schoolSuggestions = useMemo(() => {
    return searchSchools(schoolSearch, {
      educationType: educationType || undefined,
      maximum: 8,
    });
  }, [schoolSearch, educationType]);

  const selectedSchoolRecord = useMemo(() => {
    if (!school.trim()) return undefined;
    return schoolSuggestions.find((s) => s.name.toLowerCase() === school.trim().toLowerCase());
  }, [school, schoolSuggestions]);

  const filteredGroups = useMemo(() => {
    const query = courseSearch.trim().toLowerCase();
    return POLYTECHNIC_COURSE_GROUPS.map((group) => ({
      ...group,
      courses: group.courses.filter((course) =>
        `${group.label} ${course}`.toLowerCase().includes(query)
      ),
    })).filter((group) => group.courses.length > 0);
  }, [courseSearch]);

  const chooseType = (next: EducationType) => {
    setEducationType(next);
    setGrade('');
    setSchool('');
    setSchoolSearch('');
    setCourseSearch('');
    setError('');
  };

  const selectSchool = (chosen: SchoolSuggestion) => {
    setSchool(chosen.name);
    setSchoolSearch(chosen.name);
    setSchoolMenuOpen(false);
    setError('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError('Confirm your first name and surname.');
      return;
    }
    if (!educationType) {
      setError('Choose High School or Polytechnic.');
      return;
    }
    if (!grade) {
      setError(educationType === 'polytechnic' ? 'Choose your Polytechnic course.' : 'Choose your current Form.');
      return;
    }
    const finalSchool = school.trim() || 'Private';

    setSaving(true);
    setError('');
    try {
      await onComplete({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        educationType,
        grade,
        school: finalSchool,
      });
    } catch (caught: any) {
      setError(caught?.message || 'Could not save your profile. Please try again.');
      setSaving(false);
    }
  };

  const inputClass = 'w-full rounded-[9px] border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100';

  return (
    <div className="fixed inset-0 z-[490] flex min-h-dvh items-center justify-center overflow-y-auto bg-[#f3f5f8] p-4 sm:p-6">
      <section className="my-auto w-full max-w-xl rounded-[9px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,.16)] sm:p-7">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[9px] bg-violet-100 text-sm font-black text-violet-700">
            {photoURL ? <img src={photoURL} alt="" className="h-full w-full object-cover" /> : `${firstName[0] ?? ''}${lastName[0] ?? ''}` || <UserRound size={20} />}
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">One last step</p>
            <h1 className="mt-1 text-xl font-black tracking-tight text-slate-950">Complete your profile</h1>
            <p className="mt-1 text-xs text-slate-500">Tell us where you are learning so we can show the right material.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">First name</span>
              <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className={inputClass} autoComplete="given-name" />
            </label>
            <label>
              <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">Surname</span>
              <input value={lastName} onChange={(event) => setLastName(event.target.value)} className={inputClass} autoComplete="family-name" />
            </label>
          </div>

          <label>
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">Google account</span>
            <input value={email} readOnly className={`${inputClass} cursor-default text-slate-500`} />
          </label>

          <div>
            <span className="mb-1.5 block text-[10px] font-black uppercase tracking-wider text-slate-500">Where do you study?</span>
            <div className="grid grid-cols-2 gap-2 rounded-[9px] bg-slate-100 p-1">
              <button type="button" onClick={() => chooseType('high-school')} className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2.5 text-xs font-black transition ${educationType === 'high-school' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
                <School size={15} /> High School
              </button>
              <button type="button" onClick={() => chooseType('polytechnic')} className={`flex items-center justify-center gap-2 rounded-[8px] px-3 py-2.5 text-xs font-black transition ${educationType === 'polytechnic' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
                <GraduationCap size={15} /> Polytechnic
              </button>
            </div>

            <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${educationType ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}>
              <div className="min-h-0 overflow-hidden">
                {educationType === 'high-school' && (
                  <div className="rounded-[9px] border border-slate-200 bg-white p-3 shadow-sm">
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600"><Award size={14} className="text-violet-600" /> Choose your current level</p>
                    <div className="grid grid-cols-3 gap-2">
                      {['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Form 5', 'Form 6'].map((level) => (
                        <button key={level} type="button" onClick={() => { setGrade(level); setError(''); }} className={`rounded-[8px] border px-2 py-2 text-xs font-bold transition ${grade === level ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-violet-300 hover:bg-violet-50'}`}>
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {educationType === 'polytechnic' && (
                  <div className="rounded-[9px] border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="search" value={courseSearch} onChange={(event) => setCourseSearch(event.target.value)} placeholder="Search Polytechnic courses" className={`${inputClass} py-2 pl-9 pr-9 text-xs`} />
                      {courseSearch && <button type="button" onClick={() => setCourseSearch('')} aria-label="Clear course search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={13} /></button>}
                    </div>
                    <div className="mt-2 max-h-44 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                      {filteredGroups.map((group) => (
                        <div key={group.label}>
                          <p className="mb-1 px-1 text-[9px] font-black uppercase tracking-wider text-slate-400">{group.label}</p>
                          <div className="space-y-1">
                            {group.courses.map((course) => (
                              <button key={course} type="button" onClick={() => { setGrade(course); setError(''); }} className={`flex w-full items-center gap-2 rounded-[8px] px-2.5 py-2 text-left text-[11px] font-semibold transition ${grade === course ? 'bg-violet-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-violet-50 hover:text-violet-800'}`}>
                                <span className="min-w-0 flex-1">{course}</span>{grade === course && <Check size={13} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                      {filteredGroups.length === 0 && <p className="py-5 text-center text-xs text-slate-400">No courses match &ldquo;{courseSearch.trim()}&rdquo;.</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* School Selection */}
          {educationType && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
                  {isPolytechnic ? 'Choose your Polytechnic / College' : 'Choose your High School'}
                </span>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                  Optional
                </span>
              </div>

              {school ? (
                <div className="rounded-[9px] border border-violet-200 bg-violet-50/70 p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                        {isPolytechnic ? <GraduationCap size={16} /> : <School size={16} />}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-900">{school}</p>
                        <p className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-slate-500">
                          <MapPin size={10} className="shrink-0 text-violet-500" />
                          {selectedSchoolRecord?.location || selectedSchoolRecord?.province || (isPolytechnic ? 'Polytechnic Institution' : 'High School')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSchool('');
                        setSchoolSearch('');
                        setSchoolMenuOpen(true);
                      }}
                      className="shrink-0 rounded-md px-2.5 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    {isPolytechnic ? (
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    ) : (
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    )}
                    <input
                      type="text"
                      autoComplete="off"
                      role="combobox"
                      aria-autocomplete="list"
                      aria-expanded={schoolMenuOpen}
                      value={schoolSearch}
                      onChange={(event) => {
                        setSchoolSearch(event.target.value);
                        setSchoolMenuOpen(true);
                        setError('');
                      }}
                      onFocus={() => setSchoolMenuOpen(true)}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape') setSchoolMenuOpen(false);
                        if (event.key === 'Enter' && schoolSuggestions.length > 0) {
                          event.preventDefault();
                          selectSchool(schoolSuggestions[0]);
                        }
                      }}
                      placeholder={isPolytechnic ? 'Search your polytechnic...' : 'Search your high school...'}
                      className={`${inputClass} pl-9 pr-9 text-xs`}
                    />
                    {schoolSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setSchoolSearch('');
                          setSchoolMenuOpen(true);
                        }}
                        aria-label="Clear school search"
                        className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* Modern Suggestions Dropdown */}
                  {schoolMenuOpen && (
                    <div
                      role="listbox"
                      className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-56 overflow-y-auto overscroll-contain rounded-[12px] border border-slate-200 bg-white/95 p-1.5 shadow-[0_16px_36px_rgba(15,23,42,0.18)] backdrop-blur-xl custom-scrollbar"
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setSchool('Private');
                          setSchoolSearch('Private');
                          setSchoolMenuOpen(false);
                          setError('');
                        }}
                        className="mb-1 flex w-full items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-100"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-200 text-slate-700">
                          <UserRound size={13} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] font-bold text-slate-900">
                            Private Candidate / Self-study
                          </span>
                          <span className="text-[9px] text-slate-400">Save my school as &ldquo;Private&rdquo;</span>
                        </span>
                      </button>

                      {schoolSearch.trim().length > 1 && (
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSchool(schoolSearch.trim());
                            setSchoolMenuOpen(false);
                            setError('');
                          }}
                          className="mb-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-violet-300 bg-violet-50/70 px-2.5 py-2 text-left text-xs font-bold text-violet-700 hover:bg-violet-100"
                        >
                          <Sparkles size={13} className="shrink-0 text-violet-600" />
                          <span className="truncate">Use &ldquo;{schoolSearch.trim()}&rdquo; as my school</span>
                        </button>
                      )}

                      {schoolSuggestions.map((s) => {
                        const isSelected = s.name.toLowerCase() === school.trim().toLowerCase();
                        const typeLabel = s.type === 'poly' || s.type === 'college' ? 'Polytechnic' : 'High School';

                        return (
                          <button
                            key={`${s.id}-${s.name}`}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => selectSchool(s)}
                            className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
                              isSelected ? 'bg-violet-50 text-slate-900' : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm">
                              {isPolytechnic ? <GraduationCap size={13} /> : <School size={13} />}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[11px] font-bold text-slate-900 group-hover:text-violet-700">
                                {s.name}
                              </span>
                              <span className="mt-0.5 flex items-center gap-1 truncate text-[9px] text-slate-400">
                                <MapPin size={9} className="shrink-0" />
                                {[s.location, s.province].filter(Boolean).join(' · ') || 'Zimbabwe'}
                              </span>
                            </span>
                            <span className="shrink-0 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500 group-hover:bg-violet-100 group-hover:text-violet-700">
                              {typeLabel}
                            </span>
                            {isSelected && <Check size={13} className="shrink-0 text-violet-600" />}
                          </button>
                        );
                      })}

                      {schoolSuggestions.length === 0 && (
                        <div className="py-4 text-center text-xs text-slate-400">
                          No schools match &ldquo;{schoolSearch.trim()}&rdquo;.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p role="alert" className="rounded-[9px] border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">{error}</p>}

          <button disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-[9px] bg-slate-950 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving profile...</> : <>Continue to dashboard <ArrowRight size={16} /></>}
          </button>
        </form>
      </section>
    </div>
  );
}

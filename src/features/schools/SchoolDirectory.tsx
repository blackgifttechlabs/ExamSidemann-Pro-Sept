import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BadgeCheck,
  BedDouble,
  BookMarked,
  Building2,
  ChevronDown,
  GraduationCap,
  Layers,
  MapPin,
  Menu,
  Phone,
  School,
  Search,
  Star,
  Sun,
  X,
} from 'lucide-react';
import {
  INSTITUTION_TYPES,
  ZIM_PROVINCES,
  districtForSlug,
  districtsFor,
  labelForType,
  provinceForSlug,
  shortLabelForType,
} from '../../data/zimGeo';
import { schoolSlugForName, schoolsForType } from '../../data/schoolRegistry';
import { institutionLogoForName } from '../../data/polytechnicLogos';
import { SchoolProfilePanel } from './SchoolProfilePanel';
import { SchoolRecord, feeAmount, formatFees } from './types';

type Props = {
  onNavigate: (page: string, params?: any) => void;
  profileSchoolId?: string;
};

const ALL_PROVINCES = 'All provinces';
const ALL_DISTRICTS = 'All districts';
const CARD_FALLBACK = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=900';

const iconForType = (typeId: string) => {
  switch (typeId) {
    case 'primary':
      return School;
    case 'high':
      return GraduationCap;
    case 'poly':
      return Building2;
    case 'university':
      return BookMarked;
    default:
      return Layers;
  }
};

// Legacy records stored the district inside the free-text `location` string,
// so district matching has to look in both places.
const matchesDistrict = (school: SchoolRecord, district: string) => {
  if (district === ALL_DISTRICTS) return true;
  const needle = district.toLowerCase();
  return (
    (school.district || '').toLowerCase() === needle ||
    (school.location || '').toLowerCase().includes(needle)
  );
};

export const SchoolDirectory: React.FC<Props> = ({ onNavigate, profileSchoolId }) => {
  const {
    type: routeType,
    id: routeSchoolId,
    provinceSlug,
    districtSlug,
  } = useParams<{ type?: string; id?: string; provinceSlug?: string; districtSlug?: string }>();
  const activeSchoolId = profileSchoolId || routeSchoolId;
  const isProfileMode = !!activeSchoolId;

  const knownType = INSTITUTION_TYPES.some((item) => item.id === routeType) ? (routeType as string) : 'high';
  const routeProvince = provinceForSlug(provinceSlug);
  const routeDistrict = districtForSlug(routeProvince, districtSlug);
  const [activeType, setActiveType] = useState(knownType);
  const [province, setProvince] = useState(routeProvince || ALL_PROVINCES);
  const [district, setDistrict] = useState(routeDistrict || ALL_DISTRICTS);
  const [expandedProvince, setExpandedProvince] = useState<string | null>(routeProvince || null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'name' | 'fees'>('name');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const schools = useMemo(
    () => schoolsForType(activeType, province === ALL_PROVINCES ? undefined : province),
    [activeType, province]
  );

  // In profile mode the URL carries no type; adopt the school's own type once
  // it loads so the sidebar highlights the right category.
  const handleSchoolLoaded = React.useCallback((school: SchoolRecord) => {
    if (school.type) setActiveType(school.type);
    if (school.province) setExpandedProvince(school.province);
  }, []);

  useEffect(() => {
    if (isProfileMode) return;
    setActiveType(knownType);
    setProvince(routeProvince || ALL_PROVINCES);
    setDistrict(routeDistrict || ALL_DISTRICTS);
    setExpandedProvince(routeProvince || null);
    setSearch('');
  }, [isProfileMode, knownType, routeDistrict, routeProvince]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [activeSchoolId]);

  const visibleSchools = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return schools
      .filter(
        (school) =>
          matchesDistrict(school, district) &&
          `${school.name} ${school.location || ''} ${school.district || ''} ${school.province || ''}`
            .toLowerCase()
            .includes(needle)
      )
      .sort((first, second) => {
        const logoDifference = Number(!!institutionLogoForName(second.name)) - Number(!!institutionLogoForName(first.name));
        if (logoDifference) return logoDifference;
        if (sort === 'fees') return feeAmount(first.fees) - feeAmount(second.fees);
        return first.name.localeCompare(second.name);
      });
  }, [district, schools, search, sort]);

  const selectProvince = (nextProvince: string) => {
    setProvince(nextProvince);
    setDistrict(ALL_DISTRICTS);
    if (nextProvince === ALL_PROVINCES) {
      setExpandedProvince(null);
      setSidebarOpen(false);
    } else {
      setExpandedProvince(nextProvince);
    }
    onNavigate('schools/search', {
      type: activeType,
      province: nextProvince === ALL_PROVINCES ? undefined : nextProvince,
    });
  };

  const selectDistrict = (nextProvince: string, nextDistrict: string) => {
    setProvince(nextProvince);
    setDistrict(nextDistrict);
    setSidebarOpen(false);
    onNavigate('schools/search', {
      type: activeType,
      province: nextProvince,
      district: nextDistrict === ALL_DISTRICTS ? undefined : nextDistrict,
    });
  };

  const typeLabel = labelForType(activeType);
  const TypeIcon = iconForType(activeType);

  return (
    <div className="flex h-[calc(100dvh_-_var(--app-header-h))] overflow-hidden bg-[#f5f6f8] text-left dark:bg-[#08080b]">
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
          aria-label="Close school filters"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[290px] flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-white/10 dark:bg-[#0d0d12] lg:bottom-0 lg:top-16 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-slate-200 px-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-cyan-600 text-white">
              <School size={17} />
            </span>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">School Finder</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">Zimbabwe directory</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-[10px] p-2 text-slate-400 lg:hidden">
            <X size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Institution type</p>
          <select
            value={activeType}
            onChange={(event) => onNavigate('schools/search', { type: event.target.value })}
            className="mb-5 w-full rounded-[12px] border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-black text-slate-700 outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {INSTITUTION_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <p className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Provinces & districts</p>

          <button
            onClick={() => selectProvince(ALL_PROVINCES)}
            className={`mb-1 w-full rounded-[11px] px-3 py-2.5 text-left text-xs font-bold transition ${
              province === ALL_PROVINCES
                ? 'bg-cyan-600 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
            }`}
          >
            {ALL_PROVINCES}
          </button>

          <div className="space-y-1">
            {ZIM_PROVINCES.map((item) => {
              const expanded = expandedProvince === item;
              const isActiveProvince = province === item;
              return (
                <div key={item}>
                  <button
                    onClick={() => {
                      setExpandedProvince(expanded ? null : item);
                      selectProvince(item);
                    }}
                    className={`flex w-full items-center gap-2 rounded-[11px] px-3 py-2.5 text-left text-xs font-bold transition ${
                      isActiveProvince
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5'
                    }`}
                    aria-expanded={expanded}
                  >
                    <span className="flex-1 truncate">{item}</span>
                    <ChevronDown
                      size={14}
                      className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* District reveal — grid-rows trick keeps the open/close
                      animated without measuring heights. */}
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-2.5 dark:border-white/10">
                        <button
                          onClick={() => selectDistrict(item, ALL_DISTRICTS)}
                          className={`w-full rounded-[9px] px-2.5 py-2 text-left text-[11px] font-bold transition ${
                            isActiveProvince && district === ALL_DISTRICTS
                              ? 'bg-cyan-500/12 text-cyan-600'
                              : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                        >
                          {ALL_DISTRICTS}
                        </button>
                        {districtsFor(item).map((districtName) => (
                          <button
                            key={districtName}
                            onClick={() => selectDistrict(item, districtName)}
                            className={`w-full rounded-[9px] px-2.5 py-2 text-left text-[11px] font-bold transition ${
                              isActiveProvince && district === districtName
                                ? 'bg-cyan-500/12 text-cyan-600'
                                : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                            }`}
                          >
                            {districtName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
      <div className="hidden w-[290px] shrink-0 lg:block" aria-hidden="true" />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-30 shrink-0 border-b border-slate-200 bg-white/90 p-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-300 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 lg:flex">
              <TypeIcon size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-black uppercase tracking-[0.18em] text-cyan-600">
                {province}
                {district !== ALL_DISTRICTS ? ` · ${district}` : ''}
              </p>
              <h1 className="truncate text-lg font-black text-slate-900 dark:text-white">{typeLabel}</h1>
            </div>

            {!isProfileMode && (
              <>
                <div className="relative hidden w-72 sm:block">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search institutions"
                    className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as 'name' | 'fees')}
                  className="hidden rounded-[11px] border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-500 outline-none dark:border-white/10 dark:bg-white/5 dark:text-slate-300 md:block"
                >
                  <option value="name">Name A–Z</option>
                  <option value="fees">Lowest fees</option>
                </select>
              </>
            )}
          </div>

          {!isProfileMode && (
            <div className="relative mt-3 sm:hidden">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search institutions"
                className="w-full rounded-[12px] border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          )}
        </header>

        <section ref={contentRef} className="flex-1 overflow-y-auto">
          {isProfileMode ? (
            <SchoolProfilePanel
              schoolId={activeSchoolId as string}
              onBack={() => onNavigate('schools/search', { type: activeType })}
              onSchoolLoaded={handleSchoolLoaded}
            />
          ) : (
            <div className="p-4 md:p-6">
              <div className="mb-4">
                <h2 className="font-black text-slate-900 dark:text-white">Listed institutions</h2>
                <p className="text-xs text-slate-400">{visibleSchools.length} results</p>
              </div>

              {visibleSchools.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {visibleSchools.map((school) => {
                    const attendance = school.isBoarding ? 'Boarding' : school.isDay ? 'Day' : 'Not published';
                    const AttendanceIcon = school.isBoarding ? BedDouble : Sun;
                    const institutionLogo = institutionLogoForName(school.name);
                    return (
                      <Link
                          key={school.id}
                          to={`/${schoolSlugForName(school.name)}/`}
                          aria-label={`View information for ${school.name}`}
                          className="group flex overflow-hidden rounded-[9px] border border-slate-200 bg-white text-left shadow-sm transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl dark:border-white/10 dark:bg-[#111117]"
                        >
                          <div className={`relative w-[112px] shrink-0 overflow-hidden sm:w-[132px] ${institutionLogo ? 'bg-white dark:bg-slate-100' : 'bg-slate-200'}`}>
                            <img
                              src={institutionLogo || school.image || CARD_FALLBACK}
                              alt={institutionLogo ? `${school.name} logo` : ''}
                              className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.06] ${institutionLogo ? 'object-contain p-3' : 'object-cover'}`}
                            />
                            {school.verified && !!school.ratingsCount && typeof school.rating === 'number' && (
                              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-black text-slate-700 backdrop-blur-sm">
                                <Star size={9} className="fill-amber-400 text-amber-400" /> {school.rating.toFixed(1)}
                              </span>
                            )}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col p-3.5">
                            <div className="flex items-start gap-2">
                              <p className="flex-1 text-[9px] font-black uppercase tracking-[0.15em] text-cyan-600">
                                {shortLabelForType(school.type)}
                              </p>
                              {school.verified && <BadgeCheck size={14} className="shrink-0 text-emerald-500" />}
                            </div>

                            <h3 className="mt-1 line-clamp-2 text-sm font-black leading-5 text-slate-900 dark:text-white">
                              {school.name}
                            </h3>

                            <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <MapPin size={11} className="shrink-0" />
                              <span className="truncate">
                                {[school.district || school.location, school.province].filter(Boolean).join(' · ')}
                              </span>
                            </p>

                            {school.verified && school.phone && (
                              <p className="mt-1 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Phone size={11} className="shrink-0" />
                                <span className="truncate">{school.phone}</span>
                              </p>
                            )}

                            <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2.5">
                              {(school.verified && school.curriculums?.length ? school.curriculums : [school.verified ? 'Not published' : 'Profile pending review']).slice(0, 2).map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-400"
                                >
                                  {item}
                                </span>
                              ))}
                              <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-400">
                                <AttendanceIcon size={9} /> {attendance}
                              </span>
                              {school.verified && (
                                <span className="ml-auto text-[10px] font-black text-cyan-600">
                                  {formatFees(school.fees, school.feesEstimated)}
                                </span>
                              )}
                            </div>
                          </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[15px] border border-dashed border-slate-300 bg-white/60 py-20 text-center dark:border-white/10 dark:bg-white/[0.025]">
                  <School className="mx-auto mb-3 text-slate-300" size={28} />
                  <p className="font-black text-slate-700 dark:text-slate-200">No schools found</p>
                  <p className="mt-1 text-sm text-slate-400">Choose another district, province or institution type.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

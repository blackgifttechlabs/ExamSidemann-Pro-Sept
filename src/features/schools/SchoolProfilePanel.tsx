import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BadgeCheck,
  BedDouble,
  BookOpen,
  Building2,
  ChevronRight,
  CreditCard,
  Globe,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  School,
  Share2,
  Star,
  Sun,
} from 'lucide-react';
import { PROVINCE_CENTRES, shortLabelForType } from '../../data/zimGeo';
import { schoolForId } from '../../data/schoolRegistry';
import { institutionLogoForName } from '../../data/polytechnicLogos';
import { SchoolMap } from './SchoolMap';
import { SuggestEditsModal } from './SuggestEditsModal';
import { SchoolRecord, formatFees } from './types';

type Props = {
  schoolId: string;
  onBack: () => void;
  onSchoolLoaded?: (school: SchoolRecord) => void;
};

const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop';

type IconComponent = React.ComponentType<{ size?: number; className?: string }>;

const ContactRow: React.FC<{
  icon: IconComponent;
  label: string;
  value?: string;
  href?: string;
}> = ({ icon: Icon, label, value, href }) => {
  const missing = !value || !value.trim();
  const body = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-300">
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
        <span className={`mt-0.5 block truncate text-sm font-bold ${missing ? 'text-slate-400 italic' : 'text-slate-900 dark:text-white'}`}>
          {missing ? 'Not published yet' : value}
        </span>
      </span>
      {!missing && href && <ChevronRight size={16} className="shrink-0 text-slate-300" />}
    </>
  );

  const shell = 'flex items-center gap-3.5 rounded-2xl border border-slate-200 bg-white p-3.5 dark:border-white/10 dark:bg-[#111117]';

  if (!missing && href) {
    return (
      <a href={href} className={`${shell} transition hover:border-cyan-400 hover:shadow-md`}>
        {body}
      </a>
    );
  }
  return <div className={shell}>{body}</div>;
};

const StatChip: React.FC<{ icon: IconComponent; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#111117]">
    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
      <Icon size={12} /> {label}
    </span>
    <p className="mt-2 text-sm font-black text-slate-900 dark:text-white">{value}</p>
  </div>
);

export const SchoolProfilePanel: React.FC<Props> = ({ schoolId, onBack, onSchoolLoaded }) => {
  const [showSuggest, setShowSuggest] = useState(false);
  const [copied, setCopied] = useState(false);
  const school = useMemo(() => schoolForId(schoolId), [schoolId]);

  useEffect(() => {
    if (school) onSchoolLoaded?.(school);
    // onSchoolLoaded is a stable callback from the shell; re-subscribing on it
    // would tear the listener down on every parent render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school]);

  const coordinates = useMemo(() => {
    if (school?.coordinates?.lat && school?.coordinates?.lng) return school.coordinates;
    return PROVINCE_CENTRES[school?.province || ''] || PROVINCE_CENTRES.Harare;
  }, [school]);

  const fullAddress = useMemo(() => {
    if (!school) return '';
    return [school.address, school.location, school.district, school.province].filter(Boolean).join(', ');
  }, [school]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: school?.name, url });
        return;
      } catch {
        /* user dismissed the share sheet */
      }
    }
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (!school) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-32 text-center">
        <School size={38} className="text-slate-300" />
        <p className="font-black text-slate-700 dark:text-slate-200">This institution is no longer listed.</p>
        <button onClick={onBack} className="rounded-[12px] bg-cyan-600 px-6 py-3 text-[11px] font-black uppercase tracking-wider text-white">
          Back to results
        </button>
      </div>
    );
  }

  const curriculums = school.curriculums?.length ? school.curriculums : ['Not published'];
  const attendance = [school.isBoarding && 'Boarding', school.isDay && 'Day'].filter(Boolean).join(' & ') || 'Not published';
  const hasVerifiedRating = school.verified && !!school.ratingsCount && typeof school.rating === 'number';
  const institutionLogo = institutionLogoForName(school.name);

  return (
    <>
      {/* Banner — full width of the content column, hero-styled but short so
          the details below stay above the fold. */}
      <div className="relative h-[190px] w-full shrink-0 overflow-hidden md:h-[230px]">
        <img src={school.image || FALLBACK_BANNER} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/25" />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 md:px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 rounded-[12px] border border-white/15 bg-slate-950/55 px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-slate-950/80"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 rounded-[12px] border border-white/15 bg-slate-950/55 px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md transition hover:bg-slate-950/80"
            >
              <Share2 size={14} /> {copied ? 'Link copied' : 'Share'}
            </button>
            {school.allowEdits !== false && (
              <button
                onClick={() => setShowSuggest(true)}
                className="flex items-center gap-2 rounded-[12px] bg-cyan-500 px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-950 shadow-lg transition hover:bg-cyan-400"
              >
                <PencilLine size={14} /> Suggest edits
              </button>
            )}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 md:px-6 md:pb-6">
          <div className="flex items-end gap-3 md:gap-4">
            {institutionLogo && (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white p-1.5 shadow-xl md:h-20 md:w-20 md:p-2">
                <img src={institutionLogo} alt={`${school.name} logo`} className="h-full w-full object-contain" />
              </div>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl text-2xl font-black uppercase leading-[1.05] tracking-[-0.03em] text-white drop-shadow-lg md:text-5xl"
            >
              {school.name}
            </motion.h1>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-cyan-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-slate-950">
              <MapPin size={11} /> {school.province || 'Zimbabwe'} Province
            </span>
            {school.district && (
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
                {school.district} District
              </span>
            )}
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white backdrop-blur-md">
              {shortLabelForType(school.type)}
            </span>
            {school.verified && (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">
                <BadgeCheck size={11} /> Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-7 p-4 md:p-6">
        {!school.verified && (
          <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            <strong>Unverified directory record.</strong> Contact details, programmes and fees may change. Confirm important information directly with the institution before applying or paying.
          </aside>
        )}
        {school.motto && (
          <p className="text-sm font-bold italic text-slate-500 dark:text-slate-400">“{school.motto}”</p>
        )}

        <section>
          <h2 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Contact details</h2>
          <div className="grid gap-2.5 md:grid-cols-2">
            <ContactRow icon={Phone} label="Phone" value={school.phone} href={school.phone ? `tel:${school.phone.replace(/\s/g, '')}` : undefined} />
            <ContactRow icon={Mail} label="Email" value={school.email} href={school.email ? `mailto:${school.email}` : undefined} />
            <ContactRow icon={MapPin} label="Address" value={fullAddress} />
            <ContactRow
              icon={Globe}
              label="Website"
              value={school.website}
              href={school.website ? (school.website.startsWith('http') ? school.website : `https://${school.website}`) : undefined}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">At a glance</h2>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
            <StatChip icon={BookOpen} label="Curriculum" value={curriculums.join(' · ')} />
            <StatChip
              icon={CreditCard}
              label={school.feesEstimated ? 'Fees (estimate)' : 'Fees'}
              value={formatFees(school.fees, school.feesEstimated)}
            />
            <StatChip icon={school.isBoarding ? BedDouble : Sun} label="Attendance" value={attendance} />
            <StatChip
              icon={Star}
              label="Community rating"
              value={hasVerifiedRating ? `${school.rating?.toFixed(1)} (${school.ratingsCount})` : 'Not yet available'}
            />
          </div>
        </section>

        {school.description && (
          <section>
            <h2 className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">About</h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">{school.description}</p>
          </section>
        )}

        <section>
          <h2 className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
            <Building2 size={12} /> Location & directions
          </h2>
          <SchoolMap coordinates={coordinates} schoolName={school.name} address={fullAddress} />
          {!school.coordinates?.lat && (
            <p className="mt-2.5 text-[11px] font-bold text-amber-600">
              Exact coordinates are not on record — the pin shows the province centre. Use “Suggest edits” to help us
              place it precisely.
            </p>
          )}
        </section>

        {school.allowEdits !== false && (
          <section className="flex flex-col items-start gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03] md:flex-row md:items-center">
            <div className="flex-1">
              <p className="font-black text-slate-900 dark:text-white">Spotted something out of date?</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Submit a correction — an administrator reviews every suggestion before it is published.
              </p>
            </div>
            <button
              onClick={() => setShowSuggest(true)}
              className="flex items-center gap-2 rounded-[12px] bg-slate-900 px-6 py-3.5 text-[11px] font-black uppercase tracking-wider text-white dark:bg-white dark:text-slate-900"
            >
              <PencilLine size={14} /> Suggest edits
            </button>
          </section>
        )}
      </div>

      {showSuggest && <SuggestEditsModal school={school} onClose={() => setShowSuggest(false)} />}
    </>
  );
};

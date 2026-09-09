import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  findPastPaper,
  getPastPaperBoard,
  getPastPaperCoursePath,
  getPastPaperPath,
  getPastPaperSubjectPath,
  SITE_URL,
  ALL_PAST_PAPERS,
} from '../../utils/pastPaperSeo';
import {
  RESOURCE_CATEGORIES,
  ResourceCategoryBar,
  categoryOf,
  coursesInCategory,
} from './ResourceLevelNav';
import { AcademicLibrarySidebar, AcademicNavCourse } from './AcademicLibrarySidebar';
import { SeoHead } from '../../seo/SeoHead';
import {
  buildKeywordPhrases,
  keywordsAttribute,
  paperSeoFor,
} from '../../data/seoKeywords';
import { loadResourceManifest, resourceUrlFromManifest } from '../../services/resourceManifest';
import { DownloadCountdown, DownloadJob } from './DownloadCountdown';
import { db } from '../../services/firebase';
import {
  manifestPastPapers,
  paperMatchesRoute,
  uploadedPastPaper,
} from '../../utils/runtimePastPapers';
import { SlideLoader } from '../../components/ui/SlideLoader';

const basePastPaperCourses: AcademicNavCourse[] = Array.from(new Set(
  ALL_PAST_PAPERS.map((paper) => paper.course),
)).sort((left, right) => {
  const priority = (name: string) => name === "O' Level" ? 0 : name === "A' Level" ? 1 : name.startsWith('NC ') ? 2 : 3;
  return priority(left) - priority(right) || left.localeCompare(right);
}).map((name) => ({
  name,
  category: /^Grade\s+[1-7]$/i.test(name) ? 'Primary' : name === "O' Level" || name === "A' Level" ? name : 'Polytechnic',
}));

export const PastPaperDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseSlug, subjectSlug, paperSlug } = useParams();
  const staticPaper = findPastPaper(courseSlug, subjectSlug, paperSlug);
  const [runtimePapers, setRuntimePapers] = useState<typeof ALL_PAST_PAPERS>([]);
  const [runtimeLoading, setRuntimeLoading] = useState(!staticPaper);
  const paper = staticPaper || runtimePapers.find((item) => (
    paperMatchesRoute(item, courseSlug, subjectSlug, paperSlug)
  ));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState(staticPaper?.url || '');
  const [downloadJob, setDownloadJob] = useState<DownloadJob | null>(null);

  useEffect(() => {
    if (staticPaper) {
      setRuntimeLoading(false);
      return undefined;
    }

    let cancelled = false;
    setRuntimeLoading(true);
    const manifestRequest = loadResourceManifest()
      .then((manifest) => manifestPastPapers(manifest))
      .catch(() => []);
    const uploadRequest = getDocs(query(
      collection(db, 'global_resources'),
      where('type', '==', 'past-papers'),
      where('approved', '==', true),
    )).then((snapshot) => snapshot.docs
      .map((item) => uploadedPastPaper(item.id, item.data()))
      .filter(Boolean) as typeof ALL_PAST_PAPERS)
      .catch(() => []);

    Promise.all([manifestRequest, uploadRequest]).then(([manifest, uploads]) => {
      if (cancelled) return;
      setRuntimePapers([...manifest, ...uploads]);
      setRuntimeLoading(false);
    });
    return () => { cancelled = true; };
  }, [courseSlug, paperSlug, staticPaper, subjectSlug]);

  useEffect(() => {
    setDocumentUrl(paper?.url || '');
    if (!paper?.url.startsWith('/qp/')) return undefined;
    let cancelled = false;
    loadResourceManifest().then((manifest) => {
      if (!cancelled) setDocumentUrl(resourceUrlFromManifest(manifest, paper.url));
    }).catch(() => {
      // The original catalogue URL remains available as a deployment fallback.
    });
    return () => { cancelled = true; };
  }, [paper]);

  // Related papers come from everything the archive holds, so a bundled paper
  // is not left looking like the only one of its subject.
  const allAvailablePapers = useMemo(
    () => [...ALL_PAST_PAPERS, ...runtimePapers],
    [runtimePapers],
  );
  const relatedPapers = useMemo(() => paper ? allAvailablePapers.filter((item) => (
    item.course === paper.course && item.subject === paper.subject && item.id !== paper.id
  )).slice(0, 4) : [], [allAvailablePapers, paper]);
  const pastPaperCourses = useMemo(() => {
    if (!paper || basePastPaperCourses.some((course) => course.name === paper.course)) {
      return basePastPaperCourses;
    }
    const category = /^Grade\s+[1-7]$/i.test(paper.course)
      ? 'Primary'
      : paper.course === "O' Level" || paper.course === "A' Level"
        ? paper.course
        : 'Polytechnic';
    return [...basePastPaperCourses, { name: paper.course, category }];
  }, [paper]);

  if (runtimeLoading && !paper) {
    return (
      <div className="h-[100dvh] bg-[#13141d] lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <SlideLoader label="Opening the paper" />
      </div>
    );
  }

  if (!paper) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-slate-50 p-5 text-center dark:bg-[#08080b]">
        <SeoHead
          title="Past paper not found | Exam Sidemann"
          description="The requested past paper could not be found."
          canonical={`${SITE_URL}/past-papers/`}
          robots="noindex, follow"
        />
        <div>
          <FileText className="mx-auto text-slate-300" size={44} />
          <h1 className="mt-5 text-3xl font-black text-slate-900 dark:text-white">Past paper not found</h1>
          <Link to="/past-papers/" className="mt-6 inline-flex items-center gap-2 rounded-[12px] bg-rose-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white">
            <ArrowLeft size={16} /> Browse past papers
          </Link>
        </div>
      </main>
    );
  }

  const board = getPastPaperBoard(paper);
  const canonicalPath = getPastPaperPath(paper);
  const canonical = `${SITE_URL}${canonicalPath}`;
  // Kept in step with scripts/generateSeo.mjs, which pre-renders this route.
  const { title, description } = paperSeoFor({
    courseName: paper.course,
    subjectName: paper.subject,
    board,
    year: paper.year,
    type: paper.type,
  });
  const keywords = keywordsAttribute(buildKeywordPhrases({
    courseName: paper.course,
    category: board === 'HEXCO' ? 'Polytechnic' : undefined,
    subjectName: paper.subject,
    kinds: ['pastPapers'],
    extras: [
      `${paper.subject} ${paper.year} ${paper.type}`,
      `${paper.subject} ${paper.year} past paper`,
      `${board} ${paper.subject} ${paper.year}`,
    ],
  }));
  const previewUrl = documentUrl.replace('/view', '/preview');
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${paper.subject} ${paper.year} ${paper.type}`,
      description,
      url: canonical,
      learningResourceType: 'Past examination paper',
      educationalLevel: paper.course,
      inLanguage: 'en',
      provider: {
        '@type': 'EducationalOrganization',
        name: 'Exam Sidemann',
        url: SITE_URL,
      },
      encoding: {
        '@type': 'DigitalDocument',
        name: paper.name,
        encodingFormat: 'application/pdf',
        contentUrl: documentUrl,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Past Papers', item: `${SITE_URL}/past-papers/` },
        { '@type': 'ListItem', position: 2, name: paper.course, item: `${SITE_URL}/past-papers/${courseSlug}/` },
        { '@type': 'ListItem', position: 3, name: paper.subject, item: `${SITE_URL}${getPastPaperSubjectPath(paper.course, paper.subject)}` },
        { '@type': 'ListItem', position: 4, name: `${paper.year} ${paper.type}`, item: canonical },
      ],
    },
  ];

  return (
    <>
      <SeoHead title={title} description={description} keywords={keywords} canonical={canonical} robots="noindex, follow" structuredData={structuredData} />
      <div className="flex h-[100dvh] overflow-hidden bg-[#f5f6f8] text-left text-slate-900 dark:bg-[#08080b] dark:text-white lg:h-[calc(100dvh_-_var(--app-header-h))]">
        <AcademicLibrarySidebar
          title="Past Papers"
          subtitle="Exam library"
          courses={pastPaperCourses}
          selectedCourse={paper.course}
          onSelectCourse={(courseName) => navigate(getPastPaperCoursePath(courseName))}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-w-0 flex-1 flex-col">

          {/* The whole top of the page: out of here, what this is, and the
              download. The trail of links it replaces said little that the
              title and the row beneath it do not. */}
          <div className="shrink-0 border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#0d0d12]">
            <style>{`
              @keyframes paperSheen {
                0% { transform: translateX(-120%); }
                60%, 100% { transform: translateX(220%); }
              }
              .paper-sheen::after {
                content: '';
                position: absolute;
                inset: 0;
                background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%);
                animation: paperSheen 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              }
              @media (prefers-reduced-motion: reduce) {
                .paper-sheen::after { animation: none; }
              }
            `}</style>
            <div className="flex min-w-0 items-center gap-2 px-3 py-2.5 sm:px-5 md:px-6">
              {/* Back means back. Only when there is no history to go back to
                  — a shared link, a search result — does it climb to the
                  subject the paper belongs to. */}
              <button
                type="button"
                onClick={() => (window.history.length > 1
                  ? navigate(-1)
                  : navigate(getPastPaperSubjectPath(paper.course, paper.subject)))}
                aria-label={`Back to ${paper.subject} papers`}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-slate-500 transition-colors hover:text-rose-600 dark:text-slate-300"
              >
                <ArrowLeft size={18} />
              </button>
              {/* A green book's year and its type are the same word — "Biology
                  Green Book", not "Biology Green Book Green Book". */}
              <h1 className="min-w-0 flex-1 truncate text-base font-black tracking-[-0.03em] sm:text-lg">
                {paper.year === paper.type ? `${paper.subject} ${paper.type}` : `${paper.subject} ${paper.year} ${paper.type}`}
              </h1>
            </div>
          </div>

          <section className="flex-1 overflow-y-auto scroll-smooth pb-20 lg:pb-0">
            <div className="grid min-w-0 lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
              <article className="min-w-0 overflow-hidden border-b border-slate-200 bg-white dark:border-white/10 dark:bg-[#101014] lg:border-r">
                {/* One line above the paper: what it is, and the three facts
                    that identify it. The full blurb lives in the page's
                    metadata, where a reader does not have to scroll past it. */}
                <header className="flex min-w-0 flex-nowrap items-center justify-between gap-4 overflow-hidden border-b border-slate-200 px-4 py-2 dark:border-white/10">
                  <div className="flex min-w-0 items-center gap-3 overflow-hidden whitespace-nowrap text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {/* The title above already names the paper, so a phone keeps
                        only the session and gives the room to the button. */}
                    <span className="hidden items-center gap-1.5 sm:flex"><GraduationCap size={14} className="text-rose-500" /> {paper.course}</span>
                    {paper.year !== paper.type ? (
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-rose-500" /> {paper.year}</span>
                    ) : null}
                    <span className="hidden items-center gap-1.5 sm:flex"><FileText size={14} className="text-rose-500" /> {paper.type}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDownloadJob({ token: Date.now(), title: paper.name, url: documentUrl })}
                    className="paper-sheen relative flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[5px] bg-rose-600 px-6 py-2 text-[11px] font-black uppercase tracking-wider text-white sm:px-10"
                  >
                    <Download size={15} /> Download
                  </button>
                </header>

                <div className="h-[calc(100dvh-190px)] min-h-[520px] bg-slate-100 dark:bg-black">
                  {/* Public Drive previews need an anonymous frame under the app's COEP policy. */}
                  <iframe {...{ credentialless: '' }} src={previewUrl} title={`${paper.name} preview`} className="h-full w-full border-0" />
                </div>
              </article>

              <aside className="space-y-4 bg-[#f5f6f8] p-4 dark:bg-[#08080b] sm:p-6 lg:min-h-full lg:border-b lg:border-slate-200 lg:p-7 dark:lg:border-white/10">
                {relatedPapers.length > 0 && (
                  <div className="rounded-[15px] border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#101014]">
                    <h2 className="text-sm font-black">Related {paper.subject} papers</h2>
                    <div className="mt-3 space-y-2">
                      {relatedPapers.map((related) => (
                        <Link key={related.id} to={getPastPaperPath(related)} className="flex items-center justify-between gap-3 rounded-[11px] bg-slate-50 p-3 text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-rose-500/10">
                          {/* A green book's year and type are the same word; say it once. */}
                          <span>{related.year === related.type ? related.type : `${related.year} · ${related.type}`}</span>
                          <ExternalLink size={14} />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </section>
        </main>

        <ResourceCategoryBar
          categories={RESOURCE_CATEGORIES.filter((category) => coursesInCategory(pastPaperCourses, category.id).length > 0)}
          active={categoryOf(pastPaperCourses.find((course) => course.name === paper.course) || { name: paper.course })}
          onSelect={(category) => {
            const first = coursesInCategory(pastPaperCourses, category)[0];
            if (first) navigate(getPastPaperCoursePath(first.name));
          }}
        />
      </div>
      <DownloadCountdown key={downloadJob?.token ?? 'download-idle'} job={downloadJob} onClose={() => setDownloadJob(null)} />
    </>
  );
};

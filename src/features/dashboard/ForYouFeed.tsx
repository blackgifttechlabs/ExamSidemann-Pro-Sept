import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowRight, Bookmark, Bot, BookOpen, Check,
  CheckCircle2, ChevronRight, GraduationCap,
  Lightbulb, Loader2, MessageCircle, Send, Sigma, X, XCircle,
} from 'lucide-react';
import clsx from 'clsx';
import {
  type FeedCardItem, type FeedCardType, type FeedNoteBlock, type StudentLearningSignals,
  getDaysUntilExam, recordStudentAction,
} from '../../services/personalizationEngine';
import { requestGeminiCompletion } from '../../services/gemini';
import { saveAiNote } from '../../services/aiChatHistory';
import { loadResourceManifest, resourceImageUrlFromManifest } from '../../services/resourceManifest';

interface ForYouFeedProps {
  signals: StudentLearningSignals;
  feedItems: FeedCardItem[];
  onRefreshFeed: () => void;
  onNavigate: (page: string, params?: any) => void;
  currentUserId?: string;
}

type FeedFilter = 'all' | 'challenge' | 'revision' | 'exam_urgency' | 'career_discovery' | 'ai_tool';

const FILTERS: Array<{ id: FeedFilter; label: string }> = [
  { id: 'all', label: 'For You' },
  { id: 'challenge', label: 'Practice' },
  { id: 'revision', label: 'Revision' },
  { id: 'exam_urgency', label: 'Exam Prep' },
  { id: 'career_discovery', label: 'Discover' },
  { id: 'ai_tool', label: 'AI Tutor' },
];

const filterMatches = (filter: FeedFilter, type: FeedCardType) => {
  if (filter === 'all') return true;
  if (filter === 'challenge') return type === 'challenge' || type === 'past_paper_drill' || type === 'iq';
  if (filter === 'revision') return type === 'revision' || type === 'knowledge_spark' || type === 'momentum';
  if (filter === 'exam_urgency') return type === 'exam_urgency' || type === 'past_paper';
  if (filter === 'career_discovery') return type === 'career_discovery' || type === 'book' || type === 'knowledge_spark';
  return type === filter;
};

const NotePoint: React.FC<{ text: string }> = ({ text }) => {
  const separator = text.indexOf(':');
  if (separator <= 0 || separator > 55) return <>{text}</>;
  return <><strong className="font-black text-slate-950">{text.slice(0, separator)}:</strong>{text.slice(separator + 1)}</>;
};

const TeachingNote: React.FC<{ text: string }> = ({ text }) => {
  const isExplanation = text.startsWith('Explanation:');
  const isDefinition = text.startsWith('Definition:') || text.startsWith('Key rule:');
  const isExample = text.startsWith('Example:');
  const isAnswer = text.startsWith('Answer:');
  const isStep = /^Step \d+:/.test(text);

  if (isExplanation) {
    return <p className="text-base font-medium leading-7 text-slate-700 sm:text-lg"><NotePoint text={text} /></p>;
  }
  if (isDefinition) {
    return <div className="rounded-[9px] border border-rose-200 bg-rose-50/40 p-5 text-center text-base font-bold leading-7 text-slate-900 sm:text-lg"><NotePoint text={text} /></div>;
  }
  if (isExample || isAnswer) {
    return <div className={clsx('rounded-[9px] p-4 text-sm font-bold leading-6', isAnswer ? 'bg-emerald-50 text-emerald-950' : 'border border-slate-200 bg-white text-slate-900')}><NotePoint text={text} /></div>;
  }
  if (isStep) {
    return <div className="flex gap-3 rounded-[9px] border border-slate-100 p-3 text-sm font-semibold leading-6 text-slate-700"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-black text-emerald-700">{text.match(/^Step (\d+)/)?.[1]}</span><span><NotePoint text={text.replace(/^Step \d+:\s*/, '')} /></span></div>;
  }
  return <div className="flex gap-3 rounded-[9px] border border-slate-100 p-3 text-sm font-semibold leading-6 text-slate-700"><Check size={16} className="mt-1 shrink-0 text-emerald-600" /><span><NotePoint text={text} /></span></div>;
};

const FeedNoteBlockView: React.FC<{ block: FeedNoteBlock }> = ({ block }) => {
  if (block.kind === 'list' && block.items?.length) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {block.items.map((item, index) => {
          const separator = item.indexOf(':');
          const term = separator > 0 && separator < 55 ? item.slice(0, separator) : '';
          const meaning = term ? item.slice(separator + 1).trim() : item;
          return (
            <div key={index} className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-center sm:p-5">
              {term && <span className="mb-1 block text-lg font-black text-rose-600 sm:text-xl">{term}</span>}
              <span className="block text-sm font-extrabold leading-6 text-rose-500 sm:text-base">{meaning}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (block.kind === 'formula' || block.kind === 'theorem') {
    return (
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 text-center">
        <span className="mb-2 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-blue-600">
          <Sigma size={18} /> {block.kind === 'theorem' ? 'Theorem / rule' : 'Formula'}
        </span>
        <p className="text-xl font-black leading-relaxed text-blue-900 sm:text-2xl">{block.body}</p>
      </div>
    );
  }

  if (block.kind === 'did_you_know') {
    return (
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 text-center">
        <span className="mb-2 flex items-center justify-center gap-2 text-lg font-black text-amber-600"><Lightbulb size={20} /> Did you know?</span>
        <p className="text-base font-extrabold leading-7 text-amber-800">{block.body}</p>
      </div>
    );
  }

  if (block.kind === 'definition') {
    return (
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-5 text-center">
        <span className="mb-1 block text-xl font-black text-rose-600">Definition</span>
        <p className="text-base font-extrabold leading-7 text-rose-500 sm:text-lg">{block.body?.replace(/^Definition:\s*/i, '')}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-5 text-center">
      {block.kind === 'example' && <span className="mb-1 block text-lg font-black text-slate-800">Worked example</span>}
      <p className="text-base font-extrabold leading-7 text-slate-700 sm:text-lg">{block.body}</p>
    </div>
  );
};

const subjectTheme = (subject: string) => {
  const normalized = subject.toLowerCase();
  if (normalized.includes('math')) return { bg: '#2563eb', cardBg: 'bg-blue-900/40 border-blue-500/30 text-white', label: 'bg-blue-600 text-white' };
  if (normalized.includes('geograph')) return { bg: '#059669', cardBg: 'bg-emerald-900/40 border-emerald-500/30 text-white', label: 'bg-emerald-600 text-white' };
  if (normalized.includes('computer') || normalized.includes('program') || normalized.includes('database')) return { bg: '#0891b2', cardBg: 'bg-cyan-900/40 border-cyan-500/30 text-white', label: 'bg-cyan-600 text-white' };
  if (normalized.includes('science') || normalized.includes('physics') || normalized.includes('chem') || normalized.includes('bio')) return { bg: '#7c3aed', cardBg: 'bg-violet-900/40 border-violet-500/30 text-white', label: 'bg-violet-600 text-white' };
  if (normalized.includes('english') || normalized.includes('language')) return { bg: '#d97706', cardBg: 'bg-amber-900/40 border-amber-500/30 text-white', label: 'bg-amber-600 text-white' };
  if (normalized.includes('agric')) return { bg: '#65a30d', cardBg: 'bg-lime-900/40 border-lime-500/30 text-white', label: 'bg-lime-600 text-white' };
  if (normalized.includes('relig') || normalized.includes('frs')) return { bg: '#e11d48', cardBg: 'bg-rose-900/40 border-rose-500/30 text-white', label: 'bg-rose-600 text-white' };
  if (normalized.includes('history')) return { bg: '#ea580c', cardBg: 'bg-orange-900/40 border-orange-500/30 text-white', label: 'bg-orange-600 text-white' };
  return { bg: '#4f46e5', cardBg: 'bg-indigo-900/40 border-indigo-500/30 text-white', label: 'bg-indigo-600 text-white' };
};

export const ForYouFeed: React.FC<ForYouFeedProps> = ({
  signals, feedItems, onRefreshFeed, onNavigate, currentUserId,
}) => {
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('all');
  const [activeCardId, setActiveCardId] = useState(feedItems[0]?.id || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [iqSlideIndexes, setIqSlideIndexes] = useState<Record<string, number>>({});
  const [masteredTopics, setMasteredTopics] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [resolvedImages, setResolvedImages] = useState<Record<string, string>>({});
  const feedRef = useRef<HTMLDivElement>(null);
  const visitRef = useRef<{ card: FeedCardItem; startedAt: number } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const filteredItems = useMemo(
    () => feedItems.filter((item) => filterMatches(activeFilter, item.type)),
    [activeFilter, feedItems],
  );
  const daysRemaining = getDaysUntilExam(signals.targetExamDate);

  useEffect(() => {
    let cancelled = false;
    loadResourceManifest().then((manifest) => {
      if (cancelled) return;
      const next: Record<string, string> = {};
      feedItems.forEach((card) => {
        if (card.imageUrl) next[card.id] = resourceImageUrlFromManifest(manifest, card.imageUrl);
      });
      setResolvedImages(next);
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [feedItems]);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2600);
  };

  const finishVisit = (nextCardId?: string) => {
    const visit = visitRef.current;
    if (!visit || visit.card.id === nextCardId) return;
    const dwellMs = Date.now() - visit.startedAt;
    recordStudentAction.viewCard(visit.card, dwellMs, dwellMs >= 7000, currentUserId);
    visitRef.current = null;
  };

  useEffect(() => {
    const root = feedRef.current;
    if (!root) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible || visible.intersectionRatio < 0.62) return;
      const cardId = (visible.target as HTMLElement).dataset.cardId;
      const card = filteredItems.find((item) => item.id === cardId);
      if (!card || visitRef.current?.card.id === card.id) return;
      finishVisit(card.id);
      visitRef.current = { card, startedAt: Date.now() };
      setActiveCardId(card.id);
    }, { root, threshold: [0.62, 0.82] });
    root.querySelectorAll<HTMLElement>('[data-card-id]').forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); finishVisit(); };
  }, [filteredItems, currentUserId]);

  useEffect(() => () => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
  }, []);

  const selectFilter = (filter: FeedFilter) => {
    finishVisit();
    setActiveFilter(filter);
    setActiveCardId('');
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = (card: FeedCardItem, optionId: string, answerKey = card.id, options = card.options) => {
    if (selectedAnswers[answerKey]) return;
    const selected = options?.find((option) => option.id === optionId);
    const isCorrect = Boolean(selected?.isCorrect);
    setSelectedAnswers((current) => ({ ...current, [answerKey]: optionId }));
    recordStudentAction.solveChallenge(answerKey, isCorrect, card.type === 'past_paper_drill' ? 25 : 15, currentUserId, card.subject, card.topic);
    recordStudentAction.logSubjectActivity(card.subject, currentUserId);
    showToast(isCorrect ? 'Correct. Your feed has learned from this answer.' : 'Good attempt. Review the explanation and try again later.');
    onRefreshFeed();
  };

  const handleSave = async (card: FeedCardItem) => {
    const wasSaved = signals.savedCardIds.includes(card.id);
    recordStudentAction.saveCard(card.id, currentUserId, card.subject, card.topic);
    if (!wasSaved && currentUserId) {
      try {
        await saveAiNote(currentUserId, {
          title: `${card.subject}: ${card.topic}`,
          content: card.summaryPoints?.join('\n') || `${card.question || card.title}\n\n${card.stepByStepSolution?.join('\n') || ''}`,
        });
      } catch (error) {
        console.warn('Could not also save this card as an AI note', error);
      }
    }
    showToast(wasSaved ? 'Removed from saved items.' : 'Saved. You will see more like this.');
    onRefreshFeed();
  };

  const handleSkip = (card: FeedCardItem) => {
    recordStudentAction.skipCard(card.id, currentUserId, card.subject, card.topic);
    showToast('Showing less content like this.');
    const cardNode = feedRef.current?.querySelector<HTMLElement>(`[data-card-id="${card.id}"]`);
    (cardNode?.nextElementSibling as HTMLElement | null)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.setTimeout(onRefreshFeed, 350);
  };

  const handleMastered = (card: FeedCardItem) => {
    recordStudentAction.markTopicMastered(card.topic, card.subject, currentUserId);
    setMasteredTopics((current) => ({ ...current, [card.id]: true }));
    showToast('Marked as mastered. Future recommendations will adjust.');
    onRefreshFeed();
  };

  const runAiTutor = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const response = await requestGeminiCompletion({
        messages: [{ role: 'user', content: `Teach this step by step in clear, concise language: ${aiPrompt}` }],
        temperature: 0.3,
      });
      setAiResponse(response || 'No explanation was generated. Try asking in a different way.');
    } catch {
      setAiResponse('The AI tutor is unavailable right now. Please try again shortly.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <section className="relative flex h-full min-h-0 flex-col bg-black text-white">
      <style>{`@keyframes iq-slide-in { from { opacity: 0; transform: scale(0.96) translateY(12px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>

      {toast && <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950/90 border border-white/20 px-4 py-2 text-center text-xs font-bold text-white shadow-xl backdrop-blur-md">{toast}</div>}

      <div ref={feedRef} className="min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto bg-black scroll-smooth overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Category Pills Subbar */}
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 custom-scrollbar bg-black/40 backdrop-blur-md">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectFilter(id)}
              className={clsx(
                'shrink-0 rounded-full px-3 py-1 text-xs font-black transition-all',
                activeFilter === id
                  ? 'bg-white text-black shadow-md scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {filteredItems.map((card, index) => {
          const iqSlideIndex = card.type === 'iq' ? (iqSlideIndexes[card.id] || 0) : 0;
          const iqQuestion = card.type === 'iq' ? card.iqQuestions?.[iqSlideIndex] : undefined;
          const answerKey = iqQuestion ? `${card.id}:${iqQuestion.id}` : card.id;
          const answerId = selectedAnswers[answerKey];
          const displayedQuestion = iqQuestion?.question || card.question;
          const displayedOptions = iqQuestion?.options || card.options;
          const displayedSolution = iqQuestion?.solution || card.stepByStepSolution;
          const isSaved = signals.savedCardIds.includes(card.id);
          const isMastered = signals.masteredTopicIds.includes(`${card.subject}:${card.topic}`) || masteredTopics[card.id];
          const isActive = card.id === activeCardId || (!activeCardId && index === 0);
          const theme = subjectTheme(card.subject);
          const isFeedNote = (card.type === 'revision' || card.type === 'knowledge_spark') && Boolean(card.noteBlocks?.length);

          if (isFeedNote) {
            return (
              <article
                key={card.id}
                data-card-id={card.id}
                className="relative flex min-h-full snap-start snap-always items-center justify-center overflow-hidden bg-slate-100 px-4 py-6 sm:px-8 lg:py-10"
              >
                <div className={clsx(
                  'relative grid w-full max-w-md grid-cols-1 items-center gap-4 transition-all duration-500 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_72px]',
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-75',
                )}>
                  <div className="flex min-h-[620px] max-h-[calc(100dvh-190px)] flex-col overflow-y-auto rounded-3xl border border-slate-100 bg-white p-7 shadow-xl [scrollbar-width:thin] sm:p-8 lg:min-h-[520px] lg:p-12">
                    <header className="mb-5 mt-2 text-center lg:mb-8">
                      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">{card.subject}</p>
                      <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-800 sm:text-3xl lg:text-5xl">{card.title}</h2>
                      <p className="mt-2 text-base font-bold text-slate-400 lg:text-lg">{card.subtitle}</p>
                    </header>

                    <div className={clsx('flex flex-1 flex-col justify-center gap-5', card.imageUrl && 'lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-8')}>
                      <div className="space-y-5">
                        {card.noteBlocks?.map((block, blockIndex) => <FeedNoteBlockView key={blockIndex} block={block} />)}
                      </div>
                      {card.imageUrl && (
                        <figure className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-50">
                          <img
                            src={resolvedImages[card.id] || card.imageUrl}
                            alt={`Illustration for ${card.title}`}
                            className="max-h-72 w-full object-contain lg:max-h-[390px]"
                            loading={index < 2 ? 'eager' : 'lazy'}
                          />
                        </figure>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-3 border-t border-slate-100 pt-5">
                      <button disabled={isMastered} onClick={() => handleMastered(card)} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-black text-white disabled:bg-emerald-600"><CheckCircle2 size={15} />{isMastered ? 'Mastered' : 'Mark as mastered'}</button>
                      {card.lessonRoute && <button onClick={() => onNavigate(card.lessonRoute!, card.lessonParams)} className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-5 py-3 text-xs font-black text-slate-700">Full notes <ArrowRight size={15} /></button>}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 lg:flex-col">
                    <button onClick={() => void handleSave(card)} className={clsx('flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-105', isSaved ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-700')} title={isSaved ? 'Remove saved item' : 'Save this card'}><Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} /></button>
                    <button onClick={() => onNavigate('chat', { prompt: `Help me understand ${card.topic}` })} className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-transform hover:scale-105" title="Discuss with AI tutor"><MessageCircle size={19} /></button>
                    <button onClick={() => handleSkip(card)} className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-transform hover:scale-105" title="Show less like this"><X size={19} /></button>
                  </div>
                </div>
                {index < filteredItems.length - 1 && <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400"><ArrowDown size={13} className="animate-bounce" /> Scroll for next</div>}
              </article>
            );
          }

          return (
            <article
              key={card.id}
              data-card-id={card.id}
              className="relative flex h-[calc(100dvh_-_120px)] w-full snap-start snap-always items-center justify-center p-3 sm:p-6"
            >
              {/* Background Glow */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none blur-3xl transition-colors duration-500"
                style={{ backgroundColor: theme.bg }}
              />

              {/* IQ Trainer Style Modern Animated Card Container */}
              <div
                className={clsx(
                  'relative flex h-full w-full max-w-2xl flex-col justify-between overflow-hidden rounded-3xl border-2 p-5 sm:p-8 shadow-2xl transition-all duration-300',
                  theme.cardBg,
                  isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-80'
                )}
                style={{ backgroundColor: `${theme.bg}22` }}
              >
                {/* Header Info */}
                <div className="flex items-start justify-between gap-3 shrink-0">
                  <div className="min-w-0">
                    <span className={clsx('inline-block rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider', theme.label)}>
                      {card.subject}
                    </span>
                    <p className="mt-2 truncate text-xs font-bold text-white/70">{card.topic}</p>
                  </div>
                  <span className="shrink-0 text-xs font-black tabular-nums text-white/50">
                    {String(index + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Main Content Area */}
                <div className="my-auto flex min-h-0 flex-1 flex-col justify-center overflow-y-auto custom-scrollbar py-3">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                    {card.title}
                  </h2>
                  {card.subtitle && (
                    <p className="mt-2 text-xs sm:text-sm font-semibold text-white/80 line-clamp-2">
                      {card.subtitle}
                    </p>
                  )}

                  {/* Question and Interactive Options */}
                  {(card.type === 'challenge' || card.type === 'past_paper_drill' || card.type === 'iq') && displayedQuestion && (
                    <div key={answerKey} className="mt-4 animate-[iq-slide-in_250ms_ease-out]">
                      <div className="rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4 text-xs sm:text-sm font-bold text-white shadow-inner">
                        {displayedQuestion}
                      </div>

                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {displayedOptions?.map((option) => {
                          const answered = Boolean(answerId);
                          const selected = answerId === option.id;
                          return (
                            <button
                              key={option.id}
                              disabled={answered}
                              type="button"
                              onClick={() => handleAnswer(card, option.id, answerKey, displayedOptions)}
                              className={clsx(
                                'flex items-center justify-between rounded-xl border-2 px-3 py-2.5 text-left text-xs font-black transition-all active:scale-95',
                                !answered && 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40',
                                answered && option.isCorrect && 'border-emerald-400 bg-emerald-500/30 text-emerald-200',
                                answered && selected && !option.isCorrect && 'border-rose-400 bg-rose-500/30 text-rose-200',
                                answered && !selected && !option.isCorrect && 'border-white/5 bg-black/20 text-white/40'
                              )}
                            >
                              <span>{option.text}</span>
                              {answered && option.isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
                              {answered && selected && !option.isCorrect && <XCircle size={16} className="text-rose-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {answerId && displayedSolution && (
                        <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-3 text-xs text-emerald-200">
                          <p className="font-black uppercase tracking-wider text-emerald-400">Solution</p>
                          <ul className="mt-1 space-y-1 list-disc list-inside">
                            {displayedSolution.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Summary / Revision */}
                  {(card.type === 'revision' || card.type === 'knowledge_spark' || card.type === 'momentum') && card.summaryPoints && (
                    <div className="mt-3 space-y-2 text-xs sm:text-sm font-medium text-white/90">
                      {card.summaryPoints.slice(0, 3).map((point, idx) => (
                        <div key={idx} className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                          {point}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Card Image if available */}
                  {card.imageUrl && (
                    <div className="mt-3 max-h-40 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                      <img
                        src={resolvedImages[card.id] || card.imageUrl}
                        alt=""
                        className="h-full w-full object-cover max-h-40"
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSave(card)}
                      className={clsx(
                        'flex h-9 w-9 items-center justify-center rounded-full border transition-all active:scale-90',
                        isSaved ? 'border-amber-400 bg-amber-400/20 text-amber-300' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                      )}
                      title={isSaved ? 'Unsave' : 'Save'}
                    >
                      <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('chat', { prompt: `Help me understand ${card.topic}` })}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                      title="Ask AI"
                    >
                      <MessageCircle size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSkip(card)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
                      title="Skip"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {card.lessonRoute ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(card.lessonRoute!, card.lessonParams)}
                      className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-black text-black hover:bg-white/90 transition-all active:scale-95 shadow-md"
                    >
                      <span>Notes</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : card.resourceRoute ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(card.resourceRoute!, card.resourceParams)}
                      className="flex items-center gap-1.5 rounded-full bg-[#ef2b3f] px-4 py-2 text-xs font-black text-white hover:bg-[#ef2b3f]/90 transition-all active:scale-95 shadow-md"
                    >
                      <span>{card.callToAction || 'View'}</span>
                      <ArrowRight size={14} />
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
        {filteredItems.length === 0 && <div className="flex min-h-full items-center justify-center p-8 text-center"><div><BookOpen className="mx-auto text-slate-300" size={30} /><h2 className="mt-3 text-lg font-black">More recommendations are being prepared</h2><p className="mt-1 text-sm text-slate-500">Choose another label to keep learning.</p></div></div>}
      </div>
    </section>
  );
};

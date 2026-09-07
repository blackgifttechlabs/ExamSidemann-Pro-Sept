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
  if (normalized.includes('math')) return { card: 'border-blue-200 bg-blue-50', label: 'bg-blue-700 text-white' };
  if (normalized.includes('geograph')) return { card: 'border-emerald-200 bg-emerald-50', label: 'bg-emerald-700 text-white' };
  if (normalized.includes('computer') || normalized.includes('program') || normalized.includes('database')) return { card: 'border-cyan-200 bg-cyan-50', label: 'bg-cyan-700 text-white' };
  if (normalized.includes('science') || normalized.includes('physics') || normalized.includes('chem') || normalized.includes('bio')) return { card: 'border-violet-200 bg-violet-50', label: 'bg-violet-700 text-white' };
  if (normalized.includes('english') || normalized.includes('language')) return { card: 'border-amber-200 bg-amber-50', label: 'bg-amber-700 text-white' };
  if (normalized.includes('agric')) return { card: 'border-lime-200 bg-lime-50', label: 'bg-lime-700 text-white' };
  if (normalized.includes('relig') || normalized.includes('frs')) return { card: 'border-rose-200 bg-rose-50', label: 'bg-rose-700 text-white' };
  if (normalized.includes('history')) return { card: 'border-orange-200 bg-orange-50', label: 'bg-orange-700 text-white' };
  if (normalized.includes('train your mind')) return { card: 'border-fuchsia-200 bg-fuchsia-50', label: 'bg-fuchsia-700 text-white' };
  return { card: 'border-slate-200 bg-slate-50', label: 'bg-slate-800 text-white' };
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
    <section className="relative flex h-full min-h-0 flex-col bg-black text-slate-950">
      <style>{`@keyframes iq-slide-in { from { opacity: 0; transform: translateX(36px); } to { opacity: 1; transform: translateX(0); } }`}</style>
      <header className="z-30 shrink-0 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-6">
        <nav aria-label="For You categories" className="flex w-full items-center justify-start gap-2 overflow-x-auto [scrollbar-width:none]">
          {FILTERS.map(({ id, label }) => (
            <button key={id} type="button" onClick={() => selectFilter(id)} className={clsx(
              'relative flex shrink-0 items-center px-3 py-4 text-sm font-black transition-colors sm:px-5 sm:text-base',
              activeFilter === id ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700',
            )}>
              {label}
              {activeFilter === id && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[#ef2b3f]" />}
            </button>
          ))}
        </nav>
      </header>

      {toast && <div className="pointer-events-none absolute bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-950 px-4 py-2 text-center text-xs font-bold text-white shadow-xl">{toast}</div>}

      <div ref={feedRef} className="min-h-0 flex-1 snap-y snap-mandatory overflow-y-auto bg-black scroll-smooth overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
            <article key={card.id} data-card-id={card.id} className="relative flex min-h-full snap-start snap-always items-center justify-start overflow-hidden bg-black px-4 py-5 sm:px-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(239,43,63,0.12),transparent_38%)]" />
              <div className={clsx('relative grid w-full grid-cols-1 items-center gap-4 transition-all duration-500 md:grid-cols-[minmax(0,1fr)_72px]', isActive ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-75')}>
                <div className={clsx('max-h-[calc(100vh-210px)] overflow-y-auto rounded-[9px] border p-5 [scrollbar-width:thin] sm:p-8', theme.card)}>
                  <div className={clsx('grid min-w-0 gap-6', card.imageUrl && 'md:grid-cols-2')}>
                    <div className="min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      {!['From your class notes', 'IQ challenge'].includes(card.tag) && <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[#ef2b3f]">{card.tag}</span>}
                      <p className={clsx('mt-2 inline-flex max-w-full rounded-[9px] px-3 py-2 text-xl font-black leading-tight tracking-[-0.025em] sm:text-2xl', theme.label)}>{card.subject}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{card.topic}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold tabular-nums text-slate-400">{String(index + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}</span>
                  </div>
                  <h2 className="mt-5 max-w-2xl text-2xl font-black leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-4xl">{card.title}</h2>
                  {card.subtitle && <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">{card.subtitle}</p>}
                  {(card.type === 'challenge' || card.type === 'past_paper_drill' || card.type === 'iq') && displayedQuestion && (
                    <div key={answerKey} className="mt-5 animate-[iq-slide-in_280ms_ease-out]">
                      <p className="whitespace-pre-line rounded-[9px] bg-slate-950 p-4 text-sm font-bold leading-6 text-white sm:text-base">{displayedQuestion}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        {displayedOptions?.map((option) => {
                          const answered = Boolean(answerId);
                          const selected = answerId === option.id;
                          return <button key={option.id} disabled={answered} onClick={() => handleAnswer(card, option.id, answerKey, displayedOptions)} className={clsx(
                            'flex items-center justify-between rounded-[9px] border p-3 text-left text-xs font-bold transition-all',
                            !answered && 'border-slate-200 hover:border-slate-500 hover:bg-slate-50',
                            answered && option.isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-800',
                            answered && selected && !option.isCorrect && 'border-rose-500 bg-rose-50 text-rose-800',
                            answered && !selected && !option.isCorrect && 'border-slate-100 text-slate-300',
                          )}><span>{option.text}</span>{answered && option.isCorrect && <CheckCircle2 size={16} />}{answered && selected && !option.isCorrect && <XCircle size={16} />}</button>;
                        })}
                      </div>
                      {answerId && displayedSolution && <div className="mt-3 rounded-[9px] border border-slate-200 p-4"><p className="text-xs font-black uppercase tracking-wider text-slate-500">How to solve it</p><ol className="mt-2 space-y-1.5 text-xs font-medium leading-5 text-slate-700">{displayedSolution.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol></div>}
                    </div>
                  )}

                  {(card.type === 'revision' || card.type === 'knowledge_spark' || card.type === 'momentum') && card.summaryPoints && (
                    <div className="mt-5 space-y-2">
                      {card.summaryPoints.map((point, pointIndex) => <TeachingNote key={pointIndex} text={point} />)}
                      {card.keyFormula && <div className="rounded-[9px] bg-amber-50 p-3 text-sm font-black text-amber-900">Core rule: {card.keyFormula}</div>}
                      {card.type === 'revision' && <button disabled={isMastered} onClick={() => handleMastered(card)} className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-black text-white disabled:bg-emerald-600"><CheckCircle2 size={15} />{isMastered ? 'Mastered' : 'Mark as mastered'}</button>}
                    </div>
                  )}

                  {card.type === 'exam_urgency' && <div className="mt-5 grid gap-3 sm:grid-cols-[150px_1fr]"><div className="rounded-[9px] bg-[#ef2b3f] p-5 text-white"><p className="text-4xl font-black">{daysRemaining}</p><p className="mt-1 text-xs font-bold">days until your target exam</p></div><div className="grid gap-2">{card.urgentTopics?.map((topic) => <button key={topic} onClick={() => onNavigate('courses/overview')} className="flex items-center justify-between rounded-[9px] border border-slate-200 px-3 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50">{topic}<ChevronRight size={14} /></button>)}</div></div>}

                  {card.type === 'career_discovery' && <div className="mt-5 rounded-[9px] border border-cyan-100 bg-cyan-50 p-4"><div className="flex items-center gap-2 text-sm font-black text-cyan-950"><GraduationCap size={18} />{card.careerTitle}</div><p className="mt-2 text-xs font-semibold leading-5 text-cyan-900">{card.careerDescription}</p><button onClick={() => { recordStudentAction.logCareerInterest(card.careerTitle || card.topic, currentUserId); onNavigate(card.exploreRoute || 'practicals/tools/webdev'); }} className="mt-3 inline-flex items-center gap-2 rounded-full bg-cyan-700 px-4 py-2 text-xs font-black text-white">Explore this path <ArrowRight size={14} /></button></div>}

                  {card.type === 'ai_tool' && <form onSubmit={runAiTutor} className="mt-5"><div className="flex items-center gap-2 rounded-[9px] border border-slate-300 p-2 focus-within:border-slate-950"><Bot size={18} className="ml-2 shrink-0" /><input value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} placeholder={card.aiPromptPlaceholder || 'Ask a study question'} className="min-w-0 flex-1 bg-transparent px-1 text-xs font-semibold outline-none sm:text-sm" /><button disabled={aiLoading || !aiPrompt.trim()} className="flex h-9 items-center gap-1.5 rounded-[9px] bg-slate-950 px-3 text-xs font-black text-white disabled:opacity-40">{aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Ask</button></div>{aiResponse && <div className="mt-3 whitespace-pre-line rounded-[9px] bg-slate-50 p-4 text-xs font-medium leading-5 text-slate-700">{aiResponse}</div>}</form>}
                  {card.lessonRoute && <button onClick={() => onNavigate(card.lessonRoute!, card.lessonParams)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-xs font-black text-white shadow-sm transition-transform hover:scale-[1.02]">Open class notes <ArrowRight size={15} /></button>}
                  {card.resourceRoute && <button onClick={() => onNavigate(card.resourceRoute!, card.resourceParams)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#ef2b3f] px-5 py-3 text-xs font-black text-white shadow-sm transition-transform hover:scale-[1.02]">{card.callToAction || 'Open this lesson'} <ArrowRight size={15} /></button>}
                  {card.type === 'iq' && card.iqQuestions && card.iqQuestions.length > 1 && <button onClick={() => setIqSlideIndexes((current) => ({ ...current, [card.id]: ((current[card.id] || 0) + 1) % card.iqQuestions!.length }))} className="ml-2 mt-4 inline-flex items-center gap-2 rounded-full bg-fuchsia-700 px-5 py-3 text-xs font-black text-white shadow-sm transition-transform hover:scale-[1.02]">Next question <ArrowRight size={15} /></button>}
                    </div>
                    {card.imageUrl && (
                      <div className="min-h-64 overflow-hidden rounded-[9px] bg-white/60 md:min-h-[360px]">
                        <img
                          src={resolvedImages[card.id] || card.imageUrl}
                          alt=""
                          className={clsx(
                            'h-full max-h-[calc(100vh-274px)] min-h-64 w-full md:min-h-[360px]',
                            card.type === 'book' || card.type === 'past_paper' ? 'object-contain p-4' : 'object-cover',
                          )}
                          loading={index < 2 ? 'eager' : 'lazy'}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 md:flex-col">
                  <button onClick={() => void handleSave(card)} className={clsx('flex h-12 w-12 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-105', isSaved ? 'border-amber-300 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-700')} title={isSaved ? 'Remove saved item' : 'Save this card'}><Bookmark size={19} fill={isSaved ? 'currentColor' : 'none'} /></button>
                  <button onClick={() => onNavigate('chat', { prompt: `Help me understand ${card.topic}` })} className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-transform hover:scale-105" title="Discuss with AI tutor"><MessageCircle size={19} /></button>
                  <button onClick={() => handleSkip(card)} className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-transform hover:scale-105" title="Show less like this"><X size={19} /></button>
                </div>
              </div>
              {index < filteredItems.length - 1 && <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400"><ArrowDown size={13} className="animate-bounce" /> Scroll for next</div>}
            </article>
          );
        })}
        {filteredItems.length === 0 && <div className="flex min-h-full items-center justify-center p-8 text-center"><div><BookOpen className="mx-auto text-slate-300" size={30} /><h2 className="mt-3 text-lg font-black">More recommendations are being prepared</h2><p className="mt-1 text-sm text-slate-500">Choose another label to keep learning.</p></div></div>}
      </div>
    </section>
  );
};

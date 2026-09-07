import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MathJax } from 'better-react-mathjax';
import { ArrowRight, Loader2 } from 'lucide-react';

export const notebookPaperClassName =
  'overflow-x-auto rounded-sm border border-stone-200 bg-[#fffdf5] px-4 py-3 text-slate-800 shadow-[0_2px_5px_rgba(0,0,0,0.08)] [&_mjx-container]:!inline-block [&_mjx-container]:!whitespace-nowrap';

export const notebookPaperStyle: React.CSSProperties = {
  backgroundImage:
    'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(148, 163, 184, 0.16) 32px)',
};

const mathTextSource =
  '(\\$[^$]+\\$|\\\\\\([^)]+\\\\\\)|\\([+-]?\\d+(?:\\.\\d+)?\\s*,\\s*[+-]?\\d+(?:\\.\\d+)?\\)|[A-Za-z½][A-Za-z0-9½\\s]*\\s*=\\s*[A-Za-z0-9½().\\s]+(?:[+−×÷=<>≥≤→↔-]\\s*[A-Za-z0-9½().\\s]+)+(?:\\s*(?:°C|°|cm²|m²|km²|cm³|m³|mm|cm|km|kg|ml|m|g|L|units?|pegs?))?|[+-]?\\d+(?:\\.\\d+)?(?:\\s*(?:°C|°|cm²|m²|km²|cm³|m³|mm|cm|km|kg|ml|m|g|L|units?|pegs?))?(?:\\s*(?:[+−×÷=<>≥≤→↔-])\\s*[+-]?\\d+(?:\\.\\d+)?(?:\\s*(?:°C|°|cm²|m²|km²|cm³|m³|mm|cm|km|kg|ml|m|g|L|units?|pegs?))?)+|[+-]?\\d+(?:\\.\\d+)?\\s*(?:°C|°|cm²|m²|km²|cm³|m³|mm|cm|km|kg|ml|m|g|L|units?|pegs?))';
const mathTextSplitPattern = new RegExp(mathTextSource, 'g');
const mathTextExactPattern = new RegExp(`^${mathTextSource}$`);

const toBoldMathExpression = (value: string) => {
  if (value.startsWith('$') && value.endsWith('$')) {
    return `\\(\\mathbf{${value.slice(1, -1)}}\\)`;
  }

  if (value.startsWith('\\(') && value.endsWith('\\)')) {
    return `\\(\\mathbf{${value.slice(2, -2)}}\\)`;
  }

  return `\\(\\mathbf{${value
    .replace(/\\/g, '\\backslash ')
    .replace(/[{}]/g, '')
    .replace(/×/g, '\\times ')
    .replace(/÷/g, '\\div ')
    .replace(/−/g, '-')
    .replace(/→/g, '\\to ')
    .replace(/↔/g, '\\leftrightarrow ')
    .replace(/≥/g, '\\ge ')
    .replace(/≤/g, '\\le ')
    .replace(/½/g, '\\frac{1}{2}')
    .replace(/cm²/g, 'cm^2')
    .replace(/m²/g, 'm^2')
    .replace(/km²/g, 'km^2')
    .replace(/cm³/g, 'cm^3')
    .replace(/m³/g, 'm^3')
    .replace(/°C/g, '^\\circ C')
    .replace(/°/g, '^\\circ')}}\\)`;
};

export const renderMathText = (text: string) => {
  const parts = text.split(mathTextSplitPattern);

  return parts.map((part, index) => {
    if (!part) return null;

    return mathTextExactPattern.test(part) ? (
      <span key={`${part}-${index}`} className="inline-block whitespace-nowrap align-baseline">
        <MathJax inline>{toBoldMathExpression(part)}</MathJax>
      </span>
    ) : (
      <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
    );
  });
};

export interface MathNavigationProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

/**
 * Keeps the active Maths chapter aligned to the left edge of its scroll row
 * without scrolling or resizing any ancestor of the chapter strip.
 */
export const useCenteredMathChapterTab = (activeId: string) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    scroller.dataset.alignsActiveChapterLeft = 'true';
    scroller.dataset.mathChapterScroller = 'true';

    let frame = 0;
    const alignActiveChapterLeft = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const activeButton = scroller.querySelector<HTMLElement>(
          `[data-topic-id="${CSS.escape(activeId)}"]`,
        );
        if (!activeButton) return;

        const scrollerRect = scroller.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const targetLeft = scroller.scrollLeft + buttonRect.left - scrollerRect.left;

        scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: 'auto' });
      });
    };

    alignActiveChapterLeft();
    const resizeObserver = new ResizeObserver(alignActiveChapterLeft);
    resizeObserver.observe(scroller);

    document.fonts?.ready.then(alignActiveChapterLeft).catch(() => undefined);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [activeId]);

  return scrollRef;
};

interface MathRenderGateProps {
  gateKey: string | number;
  children: React.ReactNode;
}

export const MathRenderGate: React.FC<MathRenderGateProps> = ({ gateKey, children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);

    const prepare = async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const mathJax = (window as typeof window & {
        MathJax?: {
          startup?: { promise?: Promise<unknown> };
          typesetPromise?: () => Promise<unknown>;
        };
      }).MathJax;

      try {
        await mathJax?.startup?.promise;
        await mathJax?.typesetPromise?.();
      } catch {
        // MathJax can reject during route swaps; the next render pass will recover.
      }

      await new Promise((resolve) => window.setTimeout(resolve, 180));
      if (!cancelled) setReady(true);
    };

    prepare();

    return () => {
      cancelled = true;
    };
  }, [gateKey]);

  useEffect(() => {
    const root = document.getElementById('lesson-scroll-area');
    root?.querySelectorAll<HTMLImageElement>('img').forEach((image) => {
      image.loading = 'lazy';
      image.decoding = 'async';
    });
  }, [gateKey, ready]);

  return (
    <div className="math-lesson-responsive relative min-h-screen w-full min-w-0 max-w-full overflow-x-clip">
      <style>{`
        @keyframes mathChapterEnter {
          from { opacity: 0; transform: translateY(14px); filter: blur(3px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }

        .math-lesson-responsive,
        .math-lesson-responsive > * {
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
        }

        .math-lesson-responsive :where(div, section, article, main, aside, figure) {
          min-width: 0;
        }

        .math-lesson-responsive img,
        .math-lesson-responsive video,
        .math-lesson-responsive canvas,
        .math-lesson-responsive svg {
          max-width: 100%;
          height: auto;
        }

        .math-lesson-responsive pre,
        .math-lesson-responsive mjx-container[display="true"] {
          display: block;
          max-width: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
        }

        .math-lesson-responsive p > .whitespace-nowrap,
        .math-lesson-responsive li > .whitespace-nowrap {
          max-width: 100%;
          overflow-x: auto;
          vertical-align: middle;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 640px) {
          .math-lesson-responsive h1,
          .math-lesson-responsive h2,
          .math-lesson-responsive h3,
          .math-lesson-responsive p,
          .math-lesson-responsive li {
            overflow-wrap: anywhere;
          }
        }
      `}</style>
      {!ready && (
        <div className="absolute inset-0 z-20 flex min-h-[70vh] items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3 text-slate-600">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-sm font-semibold">Preparing maths...</p>
          </div>
        </div>
      )}
      <div className={ready ? 'animate-[mathChapterEnter_320ms_ease-out]' : 'invisible max-h-[70vh] overflow-hidden'}>
        {children}
      </div>
    </div>
  );
};

interface MathChapterPagerProps {
  currentIndex: number;
  totalChapters: number;
  nextTopicTitle?: string;
  onNextChapter: () => void;
  onNextTopic?: () => void;
}

export const MathChapterPager: React.FC<MathChapterPagerProps> = ({
  currentIndex,
  totalChapters,
  nextTopicTitle,
  onNextChapter,
  onNextTopic,
}) => {
  const isLastChapter = currentIndex >= totalChapters - 1;

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {isLastChapter ? 'Topic Complete' : `Chapter ${currentIndex + 1} of ${totalChapters}`}
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {isLastChapter
              ? nextTopicTitle
                ? `Next Topic: ${nextTopicTitle}`
                : 'You have completed this topic.'
              : 'Ready for the next chapter?'}
          </h3>
        </div>
        <button
          type="button"
          onClick={isLastChapter ? onNextTopic : onNextChapter}
          disabled={isLastChapter && !onNextTopic}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isLastChapter ? (nextTopicTitle ? `Next Topic: ${nextTopicTitle}` : 'Finished') : 'Next Chapter'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

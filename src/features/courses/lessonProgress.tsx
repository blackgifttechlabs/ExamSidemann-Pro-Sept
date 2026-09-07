import React from 'react';

/**
 * Remembers where a student was in a lesson so a refresh doesn't dump them back
 * at the top of chapter one.
 *
 * Two things get restored:
 *   - the chapter, via `useLessonState` (a useState drop-in), and
 *   - the scroll position, via `useLessonScrollMemory`.
 *
 * Storage is sessionStorage: a refresh keeps your place, but deliberately
 * reopening the lesson later starts clean. Swap to localStorage below if it
 * should outlive the tab.
 */

const STORAGE_PREFIX = 'lesson-progress';

// Scopes saved state to the lesson on screen so one lesson's chapter and scroll
// position can never be applied to another. DynamicModuleViewer supplies its
// contentId; the pathname covers lessons rendered outside it.
export const LessonScopeContext = React.createContext<string | null>(null);

export const useLessonScope = (): string => {
  const scope = React.useContext(LessonScopeContext);
  if (scope) return scope;
  return typeof window === 'undefined' ? 'lesson' : window.location.pathname;
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Private mode, disabled storage, corrupt JSON - remembering the place is a
    // nicety and must never stop the lesson from rendering.
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* see read() */
  }
};

/**
 * useState, but the value survives a refresh. `name` distinguishes multiple
 * saved values within the same lesson.
 */
export function useLessonState<T>(
  name: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const scope = useLessonScope();
  const key = `${STORAGE_PREFIX}:${scope}:${name}`;
  const [value, setValue] = React.useState<T>(() => read(key, initial));

  // If the scope changes without a remount, adopt the new lesson's saved value
  // instead of writing the previous lesson's value over it.
  const keyRef = React.useRef(key);
  if (keyRef.current !== key) {
    keyRef.current = key;
    setValue(read(key, initial));
  }

  React.useEffect(() => {
    write(key, value);
  }, [key, value]);

  return [value, setValue];
}

/**
 * Saves and restores the scroll position of the lesson scroll container.
 *
 * Restoring is not a single assignment: the lesson chunk is code-split and its
 * images decode after mount, so the container is far too short to scroll to the
 * saved offset on the first frame. This keeps re-applying the offset until the
 * content is tall enough to hold it, and gives up the moment the student
 * touches the page so it never fights them for control.
 */
export const useLessonScrollMemory = (scope: string, enabled: boolean) => {
  React.useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const container = document.getElementById('lesson-scroll-area');
    if (!container) return;

    const key = `${STORAGE_PREFIX}:${scope}:scrollTop`;
    const target = read<number>(key, 0);

    let restoring = target > 0;
    let frame = 0;
    let saveTimer = 0;
    const deadline = Date.now() + 5000;

    const stopRestoring = () => {
      restoring = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const attempt = () => {
      if (!restoring) return;
      const max = container.scrollHeight - container.clientHeight;
      if (max >= target) {
        container.scrollTop = target;
        stopRestoring();
        return;
      }
      // Content still growing - hold at the bottom so the page doesn't visibly
      // snap back to the top while chunks and images land.
      container.scrollTop = Math.max(0, max);
      if (Date.now() < deadline) frame = requestAnimationFrame(attempt);
      else stopRestoring();
    };

    if (restoring) frame = requestAnimationFrame(attempt);

    const onScroll = () => {
      if (restoring) return; // don't persist our own partial restore
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(() => write(key, container.scrollTop), 150);
    };

    const userInput = ['wheel', 'touchstart', 'touchmove', 'keydown', 'pointerdown'] as const;
    container.addEventListener('scroll', onScroll, { passive: true });
    userInput.forEach((event) =>
      window.addEventListener(event, stopRestoring, { passive: true }),
    );

    return () => {
      const wasRestoring = restoring;
      stopRestoring();
      window.clearTimeout(saveTimer);
      container.removeEventListener('scroll', onScroll);
      userInput.forEach((event) => window.removeEventListener(event, stopRestoring));
      // Capture the final position on unmount, unless we never got to restore
      // the old one - overwriting it with a half-restored offset loses the place.
      if (!wasRestoring) write(key, container.scrollTop);
    };
  }, [scope, enabled]);
};

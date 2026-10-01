import { useCallback } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";

const supported = typeof document !== "undefined" && "startViewTransition" in document;
if (supported) document.documentElement.classList.add("ecd-vt");

/** navigate() that slides the old page out while the new one slides in. */
export function useEcdNavigate() {
  const navigate = useNavigate();
  return useCallback(
    (to: any, opts?: { back?: boolean } & Record<string, any>) => {
      const { back, ...rest } = opts || {};
      const run = () => (typeof to === "number" ? navigate(to) : navigate(to, rest));
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!supported || reduced) return run();
      document.documentElement.dataset.ecdDir =
        back || (typeof to === "number" && to < 0) ? "back" : "forward";
      (document as any).startViewTransition(() => {
        flushSync(run);
      });
    },
    [navigate]
  );
}

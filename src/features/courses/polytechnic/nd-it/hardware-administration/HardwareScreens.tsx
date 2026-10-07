import React, { useEffect, useRef, useState } from 'react';

// Original illustrations of two common start-up error screens.
// They are drawn in SVG, so they stay sharp at any size and need no image files.

const Monitor: React.FC<{ screen: string; label: string; children: React.ReactNode }> = ({ screen, label, children }) => (
  <svg viewBox="0 0 640 400" className="block h-auto w-full" role="img" aria-label={label}>
    <rect x="8" y="8" width="624" height="344" rx="16" fill="#1e293b" />
    <rect x="22" y="22" width="596" height="316" rx="6" fill={screen} />
    {children}
    <path d="M280 352h80l12 30H268z" fill="#334155" />
    <rect x="236" y="380" width="168" height="10" rx="5" fill="#475569" />
  </svg>
);

const useVisible = () => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
};

export const MissingOsScreen: React.FC = () => {
  const { ref, visible } = useVisible();
  return (
    <figure ref={ref} className="mx-auto my-3 w-full max-w-md">
      <style>{`@keyframes hwBlink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }`}</style>
      <Monitor screen="#0a0a0a" label="A black screen that says Operating System Not Found">
        <g fontFamily="'Courier New', monospace" fill="#e5e7eb" fontSize="19">
          <text x="50" y="82">Boot device not found.</text>
          <text x="50" y="120" fill="#fca5a5" fontWeight="700">Operating System Not Found</text>
          <text x="50" y="170">Insert a bootable drive and</text>
          <text x="50" y="196">press any key to try again.</text>
          <text x="50" y="250">
            <tspan>C:\&gt;</tspan>
            <tspan style={{ animation: visible ? 'hwBlink 1s steps(1) infinite' : undefined }} dx="8">_</tspan>
          </text>
        </g>
      </Monitor>
      <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        A black screen like this means the computer started but could not find an operating system. The exact words are different on different computers.
      </figcaption>
    </figure>
  );
};

export const BsodScreen: React.FC = () => {
  const { ref, visible } = useVisible();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const iv = setInterval(() => setPct((p) => (p >= 100 ? 0 : p + 1)), 90);
    return () => clearInterval(iv);
  }, [visible]);
  return (
    <figure ref={ref} className="mx-auto my-3 w-full max-w-md">
      <Monitor screen="#0a64c8" label="A blue screen of death with a sad face and an error code">
        <g fontFamily="'Segoe UI', Arial, sans-serif" fill="#ffffff">
          <text x="52" y="128" fontSize="86" fontWeight="300">:(</text>
          <text x="52" y="170" fontSize="17">Your PC ran into a problem and needs to restart.</text>
          <text x="52" y="194" fontSize="17">We&apos;re just collecting some error info, and then</text>
          <text x="52" y="218" fontSize="17">we&apos;ll restart for you.</text>
          <text x="52" y="256" fontSize="19" fontWeight="600">{pct}% complete</text>
          <rect x="52" y="278" width="46" height="46" fill="#ffffff" />
          <path d="M58 284h14v14H58zM78 284h14v14H78zM58 304h14v14H58zM80 306h6v6h-6zM90 316h6v6h-6z" fill="#0a64c8" />
          <text x="112" y="296" fontSize="12">For more information about this issue, search for the stop code.</text>
          <text x="112" y="316" fontSize="13" fontWeight="700">Stop code: CRITICAL_PROCESS_DIED</text>
        </g>
        <rect x="108" y="302" width="256" height="20" fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="5 3" />
      </Monitor>
      <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        A Blue Screen of Death. The <strong>stop code</strong> (the yellow dashed box) is the error code to write down.
      </figcaption>
    </figure>
  );
};

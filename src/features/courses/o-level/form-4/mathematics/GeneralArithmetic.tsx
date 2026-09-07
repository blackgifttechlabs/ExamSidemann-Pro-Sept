import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';

const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const ZwFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <rect width="60" height="4.286" y="0" fill="#31905c" />
    <rect width="60" height="4.286" y="4.286" fill="#ffd200" />
    <rect width="60" height="4.286" y="8.572" fill="#de2010" />
    <rect width="60" height="4.286" y="12.858" fill="#000000" />
    <rect width="60" height="4.286" y="17.144" fill="#de2010" />
    <rect width="60" height="4.286" y="21.43" fill="#ffd200" />
    <rect width="60" height="4.286" y="25.716" fill="#31905c" />
    <polygon points="0,0 22,15 0,30" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
    <polygon points="7.5,9.5 8.7,13.2 12.6,13.2 9.5,15.5 10.7,19.2 7.5,16.9 4.3,19.2 5.5,15.5 2.4,13.2 6.3,13.2" fill="#de2010" />
  </svg>
);


/* =========================================================================
   FONTS + NOTEBOOK PAPER STYLES
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .ga-hand { font-family: 'Patrick Hand', cursive; }
    .ga-ink { font-family: 'Kalam', cursive; }
    .ga-ruled {
      background-color: #fffdf6;
      background-image:
        repeating-linear-gradient(#fffdf6, #fffdf6 26px, #d9e6f5 26px, #d9e6f5 27px),
        linear-gradient(90deg, transparent 38px, #f2b8b8 38px, #f2b8b8 40px, transparent 40px);
    }
    @keyframes gaEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  `}</style>
);

/* =========================================================================
   SMALL UI PRIMITIVES (mirrors the Geometry chapter's visual system)
   ========================================================================= */

// A single "step label on the left / big handwritten formula on the right" row
const StepRow = ({ step, children, formula }) => (
  <div className="grid grid-cols-1 gap-3 border-b border-dashed border-slate-200 py-4 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
    <div className="flex gap-3">
      <span className="ga-hand flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-base font-bold text-blue-800">
        {step}
      </span>
      <p className="pt-0.5 leading-relaxed text-slate-700">{children}</p>
    </div>
    {formula && (
      <div className="rounded-lg border-2 border-blue-100 bg-blue-50/60 px-4 py-3 sm:min-w-[220px] sm:border-l-2 sm:border-t-0">
        <span className="ga-ink block text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">
          {formula}
        </span>
      </div>
    )}
  </div>
);

// A boxed, "underlined in red pen" key formula — used as a section climax
const KeyFormula = ({ label, formula }) => (
  <div className="my-6 flex flex-col items-center gap-2 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
    {label && <span className="ga-hand text-sm text-slate-500">{label}</span>}
    <span className="ga-ink text-2xl font-bold text-blue-900 sm:text-3xl">{formula}</span>
    <span className="h-1 w-16 rounded-full bg-rose-300" />
  </div>
);

const RuleList = ({ rules }) => (
  <ul className="ml-1 space-y-3 text-slate-700">
    {rules.map((r, i) => (
      <li key={i} className="flex gap-2">
        <span className="mt-1 text-emerald-400">●</span>
        <span className="leading-relaxed">
          <span className="font-semibold text-slate-800">{r.rule} </span>
          {r.example && <span className="ga-ink ml-1 text-blue-800">{r.example}</span>}
        </span>
      </li>
    ))}
  </ul>
);

const ExampleCard = ({ index, example }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 p-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
          {index}
        </div>
        <div className="pt-1 font-medium text-slate-800">{example.question}</div>
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-100"
      >
        <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
        <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 sm:p-5">
          <div className="ga-ruled rounded-lg p-4 pl-6">
            {example.steps.map((step, i) => (
              <div key={i} className="flex gap-2 border-b border-blue-100/70 py-2 text-sm leading-relaxed last:border-0">
                <span className="ga-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
                <span className="ga-ink flex-1 text-[1.05rem] leading-relaxed text-blue-900">{step}</span>
              </div>
            ))}
            <div className="pt-2 text-sm leading-relaxed">
              <span className="ga-hand mr-1 font-bold text-slate-500">Answer:</span>
              <span className="ga-ink text-lg font-bold text-emerald-700">{example.answer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const PracticeZone = ({ items }) => (
  <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
          <span className="font-bold text-emerald-400">{i + 1}.</span>
          <span className="text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================================
   THREE.JS DIAGRAM ENGINE
   A tiny, dependency-free scene lifecycle: each diagram component gets a
   mount div, and hands back per-frame + cleanup logic.
   ========================================================================= */
function useThreeScene(mountRef, setup, deps = []) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const width = mount.clientWidth || 300;
    const height = mount.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 5);
    const fill = new THREE.DirectionalLight(0xbfd7ff, 0.4);
    fill.position.set(-5, 2, -3);
    scene.add(ambient, key, fill);

    const { onFrame, cleanup } = setup({ scene, camera, renderer, THREE }) || {};

    let frameId;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      onFrame && onFrame(t);
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    const handleResize = () => {
      const w = mount.clientWidth || 300;
      const h = mount.clientHeight || 260;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      cleanup && cleanup();
      scene.traverse((obj) => {
        if (!(obj instanceof THREE.Mesh)) return;
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) obj.material.forEach((material) => material.dispose());
        else obj.material.dispose();
      });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const DiagramFrame = ({ title, caption, children }) => (
  <div className="mb-6 overflow-hidden rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 p-4">
    {title && (
      <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-emerald-600">
        <span className="rounded bg-emerald-100 p-1">🎨</span> {title}
      </h4>
    )}
    <div className="flex justify-center rounded-lg border border-emerald-100 bg-white">{children}</div>
    {caption && <p className="mt-2 text-center text-sm italic text-slate-500">{caption}</p>}
  </div>
);

// ---- Diagram 1: a value "rolls downhill" to its nearest round number ----
const RoundingNumberLine = ({ lowLabel, highLabel, ratio }) => {
  const mountRef = useRef(null);
  useThreeScene(mountRef, ({ scene, camera }) => {
    camera.position.set(0, 2.6, 6.2);
    camera.lookAt(0, 0.2, 0);

    const group = new THREE.Group();
    scene.add(group);

    const barGeo = new THREE.BoxGeometry(6, 0.12, 0.5);
    const barMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0 });
    const bar = new THREE.Mesh(barGeo, barMat);
    group.add(bar);

    const postGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.7, 24);
    const leftPost = new THREE.Mesh(postGeo, new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    leftPost.position.set(-3, 0.4, 0);
    const rightPost = new THREE.Mesh(postGeo, new THREE.MeshStandardMaterial({ color: 0x10b981 }));
    rightPost.position.set(3, 0.4, 0);
    group.add(leftPost, rightPost);

    const midTick = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.5, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b })
    );
    midTick.position.set(0, 0.2, 0);
    group.add(midTick);

    const startX = -3 + ratio * 6;
    const targetX = ratio < 0.5 ? -3 : 3;

    const marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.32, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3 })
    );
    marker.position.set(startX, 0.5, 0);
    group.add(marker);

    return {
      onFrame: (t) => {
        group.rotation.y = Math.sin(t * 0.25) * 0.18;
        const cycle = (t % 4) / 4; // 0..1 loop
        let x;
        if (cycle < 0.55) {
          const p = cycle / 0.55;
          x = startX + (targetX - startX) * Math.min(1, p * 1.15);
        } else {
          x = targetX;
        }
        marker.position.x = x;
        marker.position.y = 0.5 + Math.sin(t * 4) * 0.03;
        const landed = Math.abs(x - targetX) < 0.05;
        const post = targetX < 0 ? leftPost : rightPost;
        post.scale.setScalar(landed ? 1.15 + Math.sin(t * 6) * 0.03 : 1);
      },
    };
  }, [ratio]);

  return (
    <div>
      <div ref={mountRef} className="h-56 w-full max-w-lg" />
      <div className="flex max-w-lg justify-between px-6 pb-3 pt-1 text-sm font-semibold text-slate-500">
        <span>{lowLabel}</span>
        <span className="text-amber-500">halfway</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

// ---- Diagram 2: caliper jaws breathing open/closed around lower/upper bound ----
const BoundsCaliper = ({ value, lower, upper, unit }) => {
  const mountRef = useRef(null);
  useThreeScene(mountRef, ({ scene, camera }) => {
    camera.position.set(0, 2.2, 6);
    camera.lookAt(0, 0.3, 0);

    const group = new THREE.Group();
    scene.add(group);

    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 4.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x60a5fa })
    );
    rod.rotation.z = Math.PI / 2;
    group.add(rod);

    const zoneGeo = new THREE.BoxGeometry(1.1, 0.9, 0.9);
    const zoneMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.28 });
    const zone = new THREE.Mesh(zoneGeo, zoneMat);
    group.add(zone);

    const jawGeo = new THREE.BoxGeometry(0.08, 1.3, 1.3);
    const jawMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
    const jawLeft = new THREE.Mesh(jawGeo, jawMat);
    const jawRight = new THREE.Mesh(jawGeo, jawMat);
    group.add(jawLeft, jawRight);

    return {
      onFrame: (t) => {
        group.rotation.y = Math.sin(t * 0.2) * 0.15;
        const breathe = 0.55 + Math.sin(t * 1.4) * 0.06;
        jawLeft.position.x = -breathe;
        jawRight.position.x = breathe;
        zone.scale.x = breathe / 0.55;
      },
    };
  }, [value, lower, upper]);

  return (
    <div>
      <div ref={mountRef} className="h-52 w-full max-w-lg" />
      <div className="flex max-w-lg justify-between px-8 pb-3 pt-1 text-sm font-semibold">
        <span className="text-rose-500">{lower} {unit}</span>
        <span className="text-blue-600">{value} {unit} measured</span>
        <span className="text-rose-500">{upper} {unit}</span>
      </div>
    </div>
  );
};

// ---- Diagram 3: nested boxes showing min area (solid) vs max area (wireframe) ----
const AreaBoundsBox = ({ minL, minW, maxL, maxW }) => {
  const mountRef = useRef(null);
  useThreeScene(mountRef, ({ scene, camera }) => {
    camera.position.set(4.2, 3.2, 4.6);
    camera.lookAt(0, 0.3, 0);

    const group = new THREE.Group();
    scene.add(group);

    const h = 0.5;
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(minL, h, minW),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    inner.position.y = h / 2;
    group.add(inner);

    const outer = new THREE.Mesh(
      new THREE.BoxGeometry(maxL, h, maxW),
      new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true })
    );
    outer.position.y = h / 2;
    group.add(outer);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    group.add(floor);

    return {
      onFrame: (t) => {
        group.rotation.y = t * 0.35;
      },
    };
  }, [minL, minW, maxL, maxW]);

  return <div ref={mountRef} className="h-60 w-full max-w-lg" />;
};

/* =========================================================================
   CHAPTER CONTENT
   ========================================================================= */
const sections = [
  {
    id: 'estimating',
    eyebrow: 'Chapter 1.1',
    title: 'Rough Estimates',
    heading: 'Rough Estimates and Checking Your Work',
    intro:
      "Before you touch a calculator, a good mathematician always guesses the answer first. This guess is called a rough estimate. We are not trying to find the exact answer here — we only want a number that is close, so that if you press the wrong button on your calculator later, you will notice right away, because the real answer will look strange next to your guess.",
    intro2:
      "The easiest way to make a rough estimate is to round every number in the problem to just 1 significant figure — that means keeping only the very first digit and turning the rest into zeros. Then you do the simple sum in your head.",
    method: {
      title: 'How to Make a Rough Estimate',
      rows: [
        { step: 1, formula: '5 682 → 6 000', text: 'Round every number in the problem to 1 significant figure. Keep only the first digit, and change every digit after it to a zero.' },
        { step: 2, formula: '40 × 5 = 200', text: 'Do the sum using these simple, rounded numbers. Because they are so round, you can work this out in your head.' },
        { step: 3, formula: 'Real ≈ Estimate', text: "Compare your calculator's real answer with your estimate. If the two numbers are close in size, your calculator answer is very likely correct." },
      ],
    },
    examples: [
      {
        question: 'Find a rough estimate for 39.8 × 5.2.',
        steps: ['Round 39.8 to 1 significant figure → 40.', 'Round 5.2 to 1 significant figure → 5.', 'Multiply the rounded numbers: 40 × 5 = 200.'],
        answer: '≈ 200',
      },
      {
        question: "A calculator shows 3120 ÷ 58 = 53.79. Use estimation to check if this looks reasonable.",
        steps: ['Round 3120 to 1 significant figure → 3000.', 'Round 58 to 1 significant figure → 60.', 'Divide the rounded numbers: 3000 ÷ 60 = 50.', '50 is close to 53.79, so the calculator answer is reasonable.'],
        answer: 'Reasonable ✓ (estimate ≈ 50)',
      },
    ],
    practice: [
      'A kombi charges $1.20 per trip. Estimate the total cost for 29 trips this month.',
      'Estimate the answer to 612 × 3.9. Then use a calculator to see how close your estimate was.',
      'A farmer sells 187 crates of tomatoes at $4.85 each. Round each number to 1 significant figure and estimate the total money made.',
      'Without using a calculator, estimate 7891 ÷ 39.',
    ],
  },
  {
    id: 'rounding',
    eyebrow: 'Chapter 1.2',
    title: 'Rounding Off',
    heading: 'Rounding Off Numbers',
    intro:
      "Rounding means changing a number to a simpler, nearby number that is easier to work with — to the nearest ten, the nearest hundred, the nearest whole number, or to a set number of decimal places. Think of it like a ball sitting on a hill between two valleys. If the ball is more than halfway down one side, it rolls all the way to that side. If it hasn't even reached halfway, it rolls back to where it started.",
    intro2: "That is exactly the rule for rounding: look at the digit just after the place you are rounding to. If it is 5, 6, 7, 8 or 9 — round up. If it is 0, 1, 2, 3 or 4 — leave it the same.",
    diagram: {
      type: 'rounding',
      title: 'Rolling to the Nearest Hundred',
      caption: '3456 is closer to 3500 than to 3400 — so it "rolls" up to 3500.',
      props: { lowLabel: '3400', highLabel: '3500', ratio: 0.56 },
    },
    method: {
      title: 'How to Round a Number',
      rows: [
        { step: 1, text: 'Decide which place value you are rounding to (nearest ten, nearest hundred, or a number of decimal places), and find that digit.' },
        { step: 2, text: 'Look at the very next digit, just after it.' },
        { step: 3, formula: '5,6,7,8,9 → UP', text: 'If that next digit is 5 or more, round the digit up by one.' },
        { step: 4, formula: '0,1,2,3,4 → SAME', text: 'If that next digit is 4 or less, leave the digit exactly as it is.' },
        { step: 5, text: 'Change every digit after the rounding place to zero (for whole numbers), or simply drop them (for decimals).' },
      ],
    },
    examples: [
      {
        question: 'Round 3456 to the nearest hundred.',
        steps: ['Find the hundreds digit: the 4 in 3456.', 'Look at the next digit (the tens digit): 5.', '5 is "5 or more", so we round the 4 up to a 5.', 'Change the rest of the digits to zero.'],
        answer: '3500',
      },
      {
        question: 'Round 4.567 to 2 decimal places.',
        steps: ['Count 2 digits after the decimal point: 4.56 | 7.', 'Look at the next digit: 7.', '7 is 5 or more, so the 6 rounds up to a 7.', 'Drop everything after that.'],
        answer: '4.57',
      },
    ],
    practice: [
      "Harare's population is estimated at 2,123,132 people. Round this to the nearest ten thousand.",
      'Round 0.0849 to 2 decimal places.',
      'The exchange rate today is 1 USD = 28.673 ZWG. Round this to the nearest whole number.',
      'Round 68,499 to the nearest thousand.',
    ],
  },
  {
    id: 'sig-figs',
    eyebrow: 'Chapter 1.3',
    title: 'Significant Figures',
    heading: 'Significant Figures',
    intro:
      "Significant figures are the digits in a number that carry real, meaningful information about how carefully it was measured. Counting them is a bit like counting the important people standing in a photograph — you skip the empty space at the edges (leading zeros), but you count everyone in the middle, even the quiet one wearing a plain zero shirt.",
    method: {
      kind: 'rules',
      title: 'The Four Rules of Significant Figures',
      rules: [
        { rule: 'Rule 1: Every digit from 1 to 9 is always significant.', example: '482 has 3 significant figures.' },
        { rule: 'Rule 2: A zero sitting between two other significant digits is significant.', example: '409 has 3 significant figures — the 0 counts because it is sandwiched.' },
        { rule: 'Rule 3: Zeros at the very front of a number (before the first 1–9 digit) are NOT significant — they are only place-holders.', example: '0.0056 has 2 significant figures: only the 5 and the 6 count.' },
        { rule: 'Rule 4: Zeros at the end of a decimal number ARE significant.', example: '3.500 has 4 significant figures.' },
      ],
    },
    method2: {
      title: 'How to Round to a Given Number of Significant Figures',
      rows: [
        { step: 1, formula: '0.00482 → 1st s.f. = 4', text: 'Starting from the first non-zero digit, count along to find your significant figures.' },
        { step: 2, text: 'Look at the digit sitting right after the last significant figure you want to keep.' },
        { step: 3, formula: '5 or more → UP', text: 'Round up or keep the same, using the ordinary rounding rule.' },
        { step: 4, formula: '3050 → 3100 (2 s.f.)', text: 'If you rounded a whole number, replace any digits you rounded off with zeros, so the place value stays correct.' },
      ],
    },
    examples: [
      {
        question: 'Round 0.004821 to 2 significant figures.',
        steps: ['The leading zeros do not count, so the first significant figure is 4.', 'The second significant figure is 8.', 'Look at the next digit: 2. This is less than 5, so 8 stays the same.'],
        answer: '0.0048',
      },
      {
        question: 'Round 3050 to 2 significant figures.',
        steps: ['The first two significant figures are 3 and 0.', 'Look at the next digit: 5.', '5 rounds the second figure up: 0 becomes 1.', 'Replace the remaining digits with zeros to keep the size of the number correct.'],
        answer: '3100',
      },
    ],
    practice: [
      'Zimbabwe exported 34,872 tonnes of tobacco this season. Round this to 3 significant figures.',
      'Round 0.00639 to 1 significant figure.',
      'Gold exports were valued at $1,284,600. Write this to 2 significant figures.',
      'How many significant figures are in 7.040?',
    ],
  },
  {
    id: 'limits-accuracy',
    eyebrow: 'Chapter 1.4',
    title: 'Limits of Accuracy',
    heading: 'Limits of Accuracy',
    intro:
      "No measurement is ever perfectly exact — not even the best ruler, scale or tape measure. They can only measure to a certain 'nearest unit'. If someone tells you a stick is 23.8 cm long, they really mean: 'the true length is very close to 23.8 cm — it could be a tiny bit more, or a tiny bit less.'",
    intro2:
      "We call this the limits of accuracy: an Upper Bound (the biggest the true value could possibly be) and a Lower Bound (the smallest it could possibly be). The true value always sits somewhere between the two.",
    diagram: {
      type: 'bounds',
      title: 'Where Could the True Length Really Be?',
      caption: 'The red jaws mark the lower and upper bound — the true length is trapped somewhere between them.',
      props: { value: '23.8', lower: '23.75', upper: '23.85', unit: 'cm' },
    },
    method: {
      title: 'How to Find the Upper and Lower Bound',
      rows: [
        { step: 1, formula: '0.1 ÷ 2 = 0.05 cm', text: "Find half of the smallest unit used for rounding. This is called the possible error." },
        { step: 2, formula: '23.8 + 0.05 = 23.85 cm', text: 'Add this half-unit to the measurement to get the Upper Bound.' },
        { step: 3, formula: '23.8 − 0.05 = 23.75 cm', text: 'Subtract this half-unit from the measurement to get the Lower Bound.' },
      ],
    },
    keyFormula: { label: 'The true value always satisfies:', formula: 'Lower Bound ≤ True Value < Upper Bound' },
    examples: [
      {
        question: 'A measurement is given as 23.8 cm, to the nearest 0.1 cm. Find the upper and lower bounds.',
        steps: ['The smallest unit used is 0.1 cm.', 'Half of 0.1 cm is 0.05 cm.', 'Upper bound = 23.8 + 0.05 = 23.85 cm.', 'Lower bound = 23.8 − 0.05 = 23.75 cm.'],
        answer: 'Lower bound = 23.75 cm, Upper bound = 23.85 cm',
      },
      {
        question: 'A bag of maize meal is labelled 50 kg, weighed to the nearest kg. Find the limits of accuracy.',
        steps: ['The smallest unit is 1 kg.', 'Half of 1 kg is 0.5 kg.', 'Upper bound = 50 + 0.5 = 50.5 kg.', 'Lower bound = 50 − 0.5 = 49.5 kg.'],
        answer: '49.5 kg ≤ true mass < 50.5 kg',
      },
    ],
    practice: [
      'The distance from Harare to Bulawayo is given as 440 km, to the nearest 10 km. Find the upper and lower bounds.',
      'A packet of sugar is labelled 2 kg, to the nearest 0.1 kg. Find the limits of accuracy.',
      'A field is measured as 120 m long, to the nearest metre. What are the smallest and largest it could really be?',
      "A stopwatch shows a runner's time as 12.4 seconds, to the nearest 0.1 second. Find the bounds.",
    ],
  },
  {
    id: 'error',
    eyebrow: 'Chapter 1.5',
    title: 'Error',
    heading: 'Percentage Error and Absolute Error',
    intro:
      "Sometimes we guess or measure a value, and later we find out the true value. The difference between what we guessed and what is actually true is called the error. If our guess was bigger than the truth, we call it an overestimate. If it was smaller, we call it an underestimate.",
    method: {
      title: 'How to Calculate Absolute Error',
      rows: [
        { step: 1, formula: 'Error = Approx − True', text: 'Subtract the true value from your approximate (guessed or measured) value.' },
        { step: 2, formula: '+ = over, − = under', text: 'A positive answer means you overestimated. A negative answer means you underestimated.' },
        { step: 3, formula: 'Absolute Error = |Approx − True|', text: 'The absolute error is just the size of this difference — we ignore the plus or minus sign.' },
      ],
    },
    keyFormula: { label: 'To turn error into a percentage:', formula: '% Error = (Error ÷ True Value) × 100%' },
    examples: [
      {
        question: 'A shopkeeper guesses there are 500 mangoes in a box. When counted exactly, there are 460. Find the absolute error and percentage error.',
        steps: ['Error = 500 − 460 = 40.', 'This is a positive number, so it was an overestimate.', 'Absolute error = 40 mangoes.', 'Percentage error = (40 ÷ 460) × 100% = 8.7% (1 d.p.).'],
        answer: 'Overestimate of 40 mangoes; percentage error ≈ 8.7%',
      },
      {
        question: 'A bathroom scale reads a bag of cement as 20.5 kg, but its true mass is 20 kg. Find the percentage error.',
        steps: ['Error = 20.5 − 20 = 0.5 kg.', 'This is an overestimate.', 'Percentage error = (0.5 ÷ 20) × 100% = 2.5%.'],
        answer: '2.5%',
      },
    ],
    practice: [
      'A teacher estimates 45 pupils will attend a school trip. Only 38 pupils actually go. Find the absolute error and percentage error.',
      "Zimbabwe's maize harvest was estimated at 1.4 million tonnes before harvest, but the actual harvest was 1.2 million tonnes. Find the percentage error.",
      'A tailor estimates he needs 3.5 m of cloth for a dress, but actually uses 3.2 m. Was this an overestimate or underestimate? Find the percentage error.',
      "A census estimate predicted a town's population at 52,000. The real count was 54,600. Find the percentage error.",
    ],
  },
  {
    id: 'compounding',
    eyebrow: 'Chapter 1.6',
    title: 'Compounding Errors',
    heading: 'Degree of Accuracy in Calculations',
    intro:
      "When you calculate with rounded measurements — for example, multiplying a length by a width to find an area — the small errors hiding inside each measurement combine together in your final answer. This means your final answer also has its own upper and lower bound.",
    intro2:
      "There is an important rule to remember: your final answer should never look more accurate than the least accurate piece of data you started with. Writing extra decimal places in an answer pretends to be more precise than your original measurements really were.",
    diagram: {
      type: 'area',
      title: 'How Much Could the Area Really Vary?',
      caption: 'The solid green box is the smallest possible area. The red wireframe box is the largest possible area.',
      props: { minL: 2.47, minW: 1.71, maxL: 2.49, maxW: 1.73 },
    },
    method: {
      title: 'How to Find Maximum and Minimum Possible Area',
      rows: [
        { step: 1, formula: 'L: 12.35–12.45, W: 8.55–8.65', text: 'Find the upper and lower bound of each measurement, separately.' },
        { step: 2, formula: 'Max Area = Upper(L) × Upper(W)', text: 'To find the LARGEST possible area, multiply the two UPPER bounds together.' },
        { step: 3, formula: 'Min Area = Lower(L) × Lower(W)', text: 'To find the SMALLEST possible area, multiply the two LOWER bounds together.' },
        { step: 4, text: 'Never mix an upper bound with a lower bound in the same multiplication — that would not give you a true extreme.' },
      ],
    },
    examples: [
      {
        question: 'A rectangle has a length of 12.4 cm and a width of 8.6 cm, both measured to the nearest 0.1 cm. Find the maximum and minimum possible area.',
        steps: ['Length bounds: 12.35 cm to 12.45 cm.', 'Width bounds: 8.55 cm to 8.65 cm.', 'Max area = 12.45 × 8.65 = 107.7 cm² (1 d.p.).', 'Min area = 12.35 × 8.55 = 105.6 cm² (1 d.p.).'],
        answer: 'The true area is between 105.6 cm² and 107.7 cm²',
      },
      {
        question: 'Explain why a final answer should not be given to more decimal places than the least accurate measurement used.',
        steps: ['Every rounded measurement already carries a small hidden error.', 'When you multiply or divide rounded numbers, these errors combine and can grow.', 'Extra decimal places in the final answer pretend to be more accurate than the original data really was.'],
        answer: 'The calculation cannot be more accurate than its least accurate starting measurement.',
      },
    ],
    practice: [
      'A rectangular field is 85 m long and 42 m wide, both to the nearest metre. Find the maximum and minimum possible area of the field.',
      'A homestead plot is measured as 30.0 m by 24.0 m, to the nearest 0.5 m. Calculate the upper and lower bounds for its perimeter.',
      'A shop uses an exchange rate of 28.7 ZWG per USD (to 3 s.f.). If the true rate could be between 28.65 and 28.75, find the smallest and largest amount of ZWG a customer changing 100 USD could receive.',
      'A water tank is built as a cube of side 1.2 m, measured to the nearest 0.1 m. Find the maximum and minimum possible volume.',
    ],
  },
];

/* =========================================================================
   MAIN COMPONENT
   ========================================================================= */
const Section = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{section.eyebrow}</span>
      <h2 className="text-2xl font-bold text-slate-900">{section.heading}</h2>
    </div>

    <div className="mb-6">
      <p className="mb-4 leading-relaxed text-slate-700">{section.intro}</p>
      {section.intro2 && <p className="mb-6 leading-relaxed text-slate-700">{section.intro2}</p>}

      {section.diagram && (
        <DiagramFrame title={section.diagram.title} caption={section.diagram.caption}>
          {section.diagram.type === 'rounding' && <RoundingNumberLine {...section.diagram.props} />}
          {section.diagram.type === 'bounds' && <BoundsCaliper {...section.diagram.props} />}
          {section.diagram.type === 'area' && <AreaBoundsBox {...section.diagram.props} />}
        </DiagramFrame>
      )}

      {section.method && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {section.method.title}
          </h3>
          {section.method.kind === 'rules' ? (
            <RuleList rules={section.method.rules} />
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
              {section.method.rows.map((r, i) => (
                <StepRow key={i} step={r.step} formula={r.formula}>
                  {r.text}
                </StepRow>
              ))}
            </div>
          )}
        </div>
      )}

      {section.method2 && (
        <div className="mb-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {section.method2.title}
          </h3>
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
            {section.method2.rows.map((r, i) => (
              <StepRow key={i} step={r.step} formula={r.formula}>
                {r.text}
              </StepRow>
            ))}
          </div>
        </div>
      )}

      {section.keyFormula && <KeyFormula label={section.keyFormula.label} formula={section.keyFormula.formula} />}
    </div>

    <div className="mb-8">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
      {section.examples.map((ex, i) => (
        <ExampleCard key={i} index={i + 1} example={ex} />
      ))}
    </div>

    <PracticeZone items={section.practice} />
  </section>
);

export const GeneralArithmetic = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');
  const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];

  const handleNavigate = (id) => {
    setActive(id);
    requestAnimationFrame(() => {
      const lessonScrollArea = document.getElementById('lesson-scroll-area');
      if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo({ top: 0, behavior: 'auto' });
    });
  };

  const goNext = () => {
    const next = sections[activeIndex + 1];
    if (next) handleNavigate(next.id);
  };
  const goPrev = () => {
    const prev = sections[activeIndex - 1];
    if (prev) handleNavigate(prev.id);
  };

  return (
    <div id="ga-scroll-area" className="min-h-screen w-full min-w-0 max-w-full overflow-x-clip bg-slate-50 pb-20 font-sans text-slate-900">
      <InkStyles />

      {/* Duolingo Gradient Header */}
      <div className={`relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700 border-b-4 border-emerald-800 pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-emerald-400/30 text-white border border-emerald-200/40`}>CHAPTER 1</span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
              </button>
              <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">General Arithmetic</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "Kuyereketa, kufungidzira, nekuyera zvakakwana. Nhamba dzose dzaunomba nezviyero zvose zvaunotora zvinotakura kusajairika — muchitsauko chino, uchadzidzwa kuzviita sesainzi." : "Approximations, estimates, and limits of accuracy. Every number you round, every measurement you take, carries a little bit of uncertainty — in this chapter, you'll learn how to handle it like a mathematician."}
          </p>
        </div>
      </div>

      {/* Left-aligned pill navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div id="math-topic-rail" data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button key={s.id} data-topic-id={s.id} onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 max-w-full px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
        <div key={activeSection.id}>
          <Section section={activeSection} />
        </div>

        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button onClick={goPrev} disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
          <button onClick={goNext} disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralArithmetic;

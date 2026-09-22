import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { Check, ChevronDown, Pause, Play, RotateCcw } from 'lucide-react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as THREE from 'three';

type RodId = 0 | 1 | 2;
type DiskId = 1 | 2 | 3 | 4 | 5;
type LearningMode = 'watch' | 'practice';
type ExecutionPhase = 'first-call' | 'move' | 'second-call';

type HanoiMove = {
  disk: DiskId;
  from: RodId;
  to: RodId;
};

const ROD_NAMES = ['A', 'B', 'C'];
const ROD_X = [-2, 0, 2];
const DISK_COLORS: Record<DiskId, string> = {
  1: '#38bdf8',
  2: '#8b5cf6',
  3: '#f97316',
  4: '#ec4899',
  5: '#14b8a6',
};

const buildMoves = (diskCount: number) => {
  const moves: HanoiMove[] = [];
  const solve = (count: number, source: RodId, destination: RodId, auxiliary: RodId) => {
    if (count === 0) return;
    solve(count - 1, source, auxiliary, destination);
    moves.push({ disk: count as DiskId, from: source, to: destination });
    solve(count - 1, auxiliary, destination, source);
  };
  solve(diskCount, 0, 2, 1);
  return moves;
};

const stateBeforeMove = (diskCount: number, moves: HanoiMove[], moveIndex: number) => {
  const rods: DiskId[][] = [
    Array.from({ length: diskCount }, (_, index) => (diskCount - index) as DiskId),
    [],
    [],
  ];
  moves.slice(0, moveIndex).forEach((move) => {
    const disk = rods[move.from].pop();
    if (disk) rods[move.to].push(disk);
  });
  return rods;
};

const diskY = (stackIndex: number) => 0.34 + stackIndex * 0.22;
const diskRadius = (disk: DiskId) => 0.39 + disk * 0.145;

const StaticDisk: React.FC<{ disk: DiskId; rod: RodId; stackIndex: number }> = ({ disk, rod, stackIndex }) => (
  <mesh position={[ROD_X[rod], diskY(stackIndex), 0]} castShadow receiveShadow>
    <cylinderGeometry args={[diskRadius(disk), diskRadius(disk), 0.2, 64]} />
    <meshStandardMaterial color={DISK_COLORS[disk]} roughness={0.24} metalness={0.34} />
  </mesh>
);

const MovingDisk: React.FC<{
  move: HanoiMove;
  startLevel: number;
  endLevel: number;
  paused: boolean;
  onPhaseChange: (phase: ExecutionPhase) => void;
  onComplete: () => void;
}> = ({ move, startLevel, endLevel, paused, onPhaseChange, onComplete }) => {
  const ref = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const completed = useRef(false);
  const phase = useRef<ExecutionPhase | null>(null);

  useFrame((_, delta) => {
    if (!ref.current || paused || completed.current) return;
    elapsed.current = Math.min(elapsed.current + delta, 4.2);
    const progress = elapsed.current / 4.2;
    const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
    const startX = ROD_X[move.from];
    const endX = ROD_X[move.to];
    const startY = diskY(startLevel);
    const endY = diskY(endLevel);
    const liftY = 2.65;
    const nextPhase: ExecutionPhase = eased < 0.3 ? 'first-call' : eased < 0.7 ? 'move' : 'second-call';
    if (phase.current !== nextPhase) {
      phase.current = nextPhase;
      onPhaseChange(nextPhase);
    }

    if (eased < 0.3) {
      const phase = THREE.MathUtils.smoothstep(eased / 0.3, 0, 1);
      ref.current.position.set(startX, THREE.MathUtils.lerp(startY, liftY, phase), 0);
    } else if (eased < 0.7) {
      const phase = THREE.MathUtils.smoothstep((eased - 0.3) / 0.4, 0, 1);
      ref.current.position.set(THREE.MathUtils.lerp(startX, endX, phase), liftY, 0);
    } else {
      const phase = THREE.MathUtils.smoothstep((eased - 0.7) / 0.3, 0, 1);
      ref.current.position.set(endX, THREE.MathUtils.lerp(liftY, endY, phase), 0);
    }

    ref.current.rotation.y += delta * 0.35;
    if (progress >= 1 && !completed.current) {
      completed.current = true;
      onComplete();
    }
  });

  return (
    <mesh ref={ref} position={[ROD_X[move.from], diskY(startLevel), 0]} castShadow receiveShadow>
      <cylinderGeometry args={[diskRadius(move.disk), diskRadius(move.disk), 0.2, 64]} />
      <meshStandardMaterial color={DISK_COLORS[move.disk]} roughness={0.2} metalness={0.4} />
    </mesh>
  );
};

const HanoiBoard: React.FC<{
  diskCount: number;
  moves: HanoiMove[];
  moveIndex: number;
  paused: boolean;
  onPhaseChange: (phase: ExecutionPhase) => void;
  onMoveComplete: () => void;
}> = ({ diskCount, moves, moveIndex, paused, onPhaseChange, onMoveComplete }) => {
  const rods = useMemo(
    () => stateBeforeMove(diskCount, moves, moveIndex),
    [diskCount, moveIndex, moves]
  );
  const move = moves[moveIndex];
  const movingStartLevel = rods[move.from].length - 1;
  const movingEndLevel = rods[move.to].length;

  return (
    <>
      <color attach="background" args={['#eef3f8']} />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={['#dbeafe', '#7c4a2d', 1.15]} />
      <directionalLight position={[4, 7, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 3, 2]} intensity={0.8} color="#bfdbfe" />

      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 0.34, 2]} />
        <meshStandardMaterial color="#9a5c2f" roughness={0.42} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.23, 0]} receiveShadow>
        <boxGeometry args={[6.15, 0.05, 1.72]} />
        <meshStandardMaterial color="#d39a61" roughness={0.5} />
      </mesh>

      {ROD_X.map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.35, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.1, 2.55, 32]} />
            <meshStandardMaterial color="#b8c1cc" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.34, 0.13, 48]} />
            <meshStandardMaterial color="#64748b" roughness={0.24} metalness={0.65} />
          </mesh>
        </group>
      ))}

      {rods.map((stack, rod) =>
        stack.map((disk, stackIndex) =>
          disk === move.disk && rod === move.from ? null : (
            <StaticDisk key={`${disk}-${rod}`} disk={disk} rod={rod as RodId} stackIndex={stackIndex} />
          )
        )
      )}

      <MovingDisk
        key={`${diskCount}-${moveIndex}`}
        move={move}
        startLevel={movingStartLevel}
        endLevel={movingEndLevel}
        paused={paused}
        onPhaseChange={onPhaseChange}
        onComplete={onMoveComplete}
      />

      <ContactShadows position={[0, -0.14, 0]} opacity={0.35} scale={10} blur={2.3} far={5} />
      <OrbitControls enablePan={false} minDistance={8.5} maxDistance={13} minPolarAngle={0.75} maxPolarAngle={1.35} target={[0, 1, 0]} />
    </>
  );
};

const solutionCode = (diskCount: number) => `void moveDisk(int disk, char source, char target);

void hanoi(int n, char source, char target, char spare) {
    if (n == 0) return;
    hanoi(n - 1, source, spare, target);
    moveDisk(n, source, target);
    hanoi(n - 1, spare, target, source);
}

int main() {
    const int DISKS = ${diskCount};
    hanoi(${diskCount}, 'A', 'C', 'B');
    return 0;
}`;

const starterCode = (diskCount: number) => `void moveDisk(int disk, char source, char target);

void hanoi(int n, char source, char target, char spare) {
    
}

int main() {
    const int DISKS = ${diskCount};
    hanoi(DISKS, 'A', 'C', 'B');
    return 0;
}`;

type CodeCheck = {
  baseCase: boolean;
  firstCall: boolean;
  move: boolean;
  secondCall: boolean;
  correct: boolean;
};

const escapePattern = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const checkSolution = (code: string): CodeCheck => {
  const signature = code.match(/void\s+hanoi\s*\(\s*int\s+(\w+)\s*,\s*char\s+(\w+)\s*,\s*char\s+(\w+)\s*,\s*char\s+(\w+)\s*\)/i);
  if (!signature) return { baseCase: false, firstCall: false, move: false, secondCall: false, correct: false };

  const [, count, source, target, spare] = signature.map((part) => part.toLowerCase());
  const compact = code.replace(/\s+/g, '').toLowerCase();
  const n = escapePattern(count);
  const baseCase = new RegExp(`if\\(${n}(?:==|<=)0\\)return;`).test(compact);
  const firstText = `hanoi(${count}-1,${source},${spare},${target});`;
  const moveText = `movedisk(${count},${source},${target});`;
  const secondText = `hanoi(${count}-1,${spare},${target},${source});`;
  const firstIndex = compact.indexOf(firstText);
  const moveIndex = compact.indexOf(moveText);
  const secondIndex = compact.indexOf(secondText);
  const firstCall = firstIndex >= 0;
  const move = moveIndex > firstIndex;
  const secondCall = secondIndex > moveIndex;
  const hasMainCall = new RegExp(`hanoi\\(disks,['\"]a['\"],['\"]c['\"],['\"]b['\"]\\);`).test(compact);
  const hasDiskValue = /constintdisks=[2-5];/.test(compact);

  return {
    baseCase,
    firstCall,
    move,
    secondCall,
    correct: baseCase && firstCall && move && secondCall && hasMainCall && hasDiskValue,
  };
};

const readDiskCount = (code: string) => {
  const match = code.match(/const\s+int\s+DISKS\s*=\s*([2-5])\s*;/i);
  return match ? Number(match[1]) : null;
};

const writeDiskCount = (code: string, diskCount: number) => {
  if (/const\s+int\s+DISKS\s*=\s*\d+\s*;/i.test(code)) {
    return code.replace(/const\s+int\s+DISKS\s*=\s*\d+\s*;/i, `const int DISKS = ${diskCount};`);
  }
  return code;
};

const HighlightedCodeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const completionProvider = useRef<{ dispose: () => void } | null>(null);

  useEffect(() => () => completionProvider.current?.dispose(), []);

  const handleMount: OnMount = (editor, monaco) => {
    completionProvider.current?.dispose();
    completionProvider.current = monaco.languages.registerCompletionItemProvider('cpp', {
      triggerCharacters: ['h', 'm', 'i', 'r'],
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        const snippet = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
        const kind = monaco.languages.CompletionItemKind.Snippet;
        return {
          suggestions: [
            {
              label: 'base case',
              detail: 'Stop when there are no disks left',
              insertText: 'if (n == 0) return;',
              kind,
              range,
            },
            {
              label: 'move source to spare',
              detail: 'First recursive call',
              insertText: 'hanoi(n - 1, source, spare, target);',
              kind,
              range,
            },
            {
              label: 'move current disk',
              detail: 'Move disk n to the target rod',
              insertText: 'moveDisk(n, source, target);',
              kind,
              range,
            },
            {
              label: 'move spare to target',
              detail: 'Second recursive call',
              insertText: 'hanoi(n - 1, spare, target, source);',
              kind,
              range,
            },
            {
              label: 'if statement',
              detail: 'C++ conditional',
              insertText: 'if (${1:condition}) ${2:return;}',
              insertTextRules: snippet,
              kind,
              range,
            },
            {
              label: 'return',
              detail: 'Return from the current function call',
              insertText: 'return;',
              kind: monaco.languages.CompletionItemKind.Keyword,
              range,
            },
          ],
        };
      },
    });
    editor.focus();
  };

  return (
    <div className="mt-5 min-h-[330px] flex-1 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-200">
      <Editor
        height="100%"
        defaultLanguage="cpp"
        value={value}
        onChange={(nextValue) => onChange(nextValue ?? '')}
        onMount={handleMount}
        theme="light"
        options={{
          automaticLayout: true,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSize: 14,
          lineHeight: 24,
          lineNumbers: 'on',
          lineNumbersMinChars: 2,
          minimap: { enabled: false },
          padding: { top: 14, bottom: 14 },
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          tabCompletion: 'on',
          wordBasedSuggestions: 'off',
          wordWrap: 'on',
          wrappingIndent: 'same',
          scrollBeyondLastLine: false,
          overviewRulerLanes: 0,
          renderLineHighlight: 'line',
          roundedSelection: false,
          scrollbar: { verticalScrollbarSize: 9, horizontal: 'hidden' },
          suggest: { showKeywords: true, showSnippets: true },
        }}
      />
    </div>
  );
};

export const HanoiThreeWalkthrough: React.FC = () => {
  const [diskCount, setDiskCount] = useState(3);
  const [moveIndex, setMoveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [mode, setMode] = useState<LearningMode>('watch');
  const [studentCode, setStudentCode] = useState(() => starterCode(3));
  const [executionPhase, setExecutionPhase] = useState<ExecutionPhase>('first-call');
  const [valueFlash, setValueFlash] = useState(false);
  const moves = useMemo(() => buildMoves(diskCount), [diskCount]);
  const move = moves[moveIndex];
  const codeCheck = useMemo(() => checkSolution(studentCode), [studentCode]);
  const codeCorrect = codeCheck.correct;
  const simulationPaused = paused || (mode === 'practice' && !codeCorrect);
  const activeCodeLine = executionPhase === 'first-call' ? 5 : executionPhase === 'move' ? 6 : 7;

  useEffect(() => {
    if (!valueFlash) return;
    const timer = window.setTimeout(() => setValueFlash(false), 1800);
    return () => window.clearTimeout(timer);
  }, [valueFlash]);

  const resetSimulation = (nextDiskCount = diskCount) => {
    setMoveIndex(0);
    setCycle((value) => value + 1);
    setPaused(false);
    setExecutionPhase('first-call');
    if (nextDiskCount !== diskCount) {
      setDiskCount(nextDiskCount);
      setStudentCode((code) => writeDiskCount(code, nextDiskCount));
      setValueFlash(true);
    }
  };

  const updateStudentCode = (code: string) => {
    setStudentCode(code);
    const codeDiskCount = readDiskCount(code);
    if (codeDiskCount !== null && codeDiskCount !== diskCount) {
      setDiskCount(codeDiskCount);
      setMoveIndex(0);
      setCycle((value) => value + 1);
      setPaused(false);
      setValueFlash(true);
    }
  };

  const completeMove = () => {
    window.setTimeout(() => {
      setMoveIndex((current) => {
        if (current === moves.length - 1) {
          setCycle((value) => value + 1);
          return 0;
        }
        return current + 1;
      });
    }, moveIndex === moves.length - 1 ? 2200 : 850);
  };

  const changeMode = (nextMode: LearningMode) => {
    setMode(nextMode);
    setMoveIndex(0);
    setCycle((value) => value + 1);
    setPaused(false);
    setExecutionPhase('first-call');
  };

  return (
    <section id="hanoi-walkthrough" className="mt-8 scroll-mt-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#0a0a0b]">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-900" aria-label="Learning mode">
            <button type="button" onClick={() => changeMode('watch')} className={`rounded-md px-4 py-2 text-sm font-bold transition ${mode === 'watch' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Watch solution</button>
            <button type="button" onClick={() => changeMode('practice')} className={`rounded-md px-4 py-2 text-sm font-bold transition ${mode === 'practice' ? 'bg-white text-indigo-700 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>Do it yourself</button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200">
              <span className="whitespace-nowrap">Number of disks</span>
              <span className="relative">
                <select
                  value={diskCount}
                  onChange={(event) => resetSimulation(Number(event.target.value))}
                  className="h-11 appearance-none rounded-lg border border-slate-300 bg-white pl-3 pr-10 text-sm font-bold text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-600 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-900"
                >
                  {[2, 3, 4, 5].map((count) => <option key={count} value={count}>{count} disks</option>)}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-3.5 text-slate-500" />
              </span>
            </label>
            <button type="button" onClick={() => setPaused((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-indigo-700 shadow-sm hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-200" aria-label={paused ? 'Play Towers of Hanoi animation' : 'Pause Towers of Hanoi animation'} title={paused ? 'Play animation' : 'Pause animation'}>
              {paused ? <Play size={18} fill="currentColor" /> : <Pause size={18} fill="currentColor" />}
            </button>
            <button type="button" onClick={() => resetSimulation()} className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" aria-label="Restart Towers of Hanoi animation" title="Restart animation">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,.85fr)_minmax(540px,1.15fr)]">
        <div className="min-w-0 border-b border-slate-200 dark:border-slate-700 lg:border-b-0 lg:border-r">
          <div className="bg-indigo-50 px-5 py-4 dark:bg-indigo-950/30 sm:px-6">
            <p className="text-xs font-black uppercase text-indigo-700 dark:text-indigo-300">Move {moveIndex + 1} of {moves.length}</p>
            <p className="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">
              {mode === 'practice' && !codeCorrect
                ? 'Complete the recursive code to start the tower.'
                : `Move disk ${move.disk} from rod ${ROD_NAMES[move.from]} to rod ${ROD_NAMES[move.to]}.`}
            </p>
          </div>
          <div className="relative h-[410px] w-full bg-slate-100 dark:bg-slate-900 sm:h-[500px]">
            <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-around px-[12%] text-xs font-black text-slate-700 dark:text-slate-200 sm:text-sm">
              <span>ROD A</span><span>ROD B</span><span>ROD C</span>
            </div>
            <Canvas key={`${cycle}-${diskCount}`} shadows dpr={[1, 1.5]} camera={{ position: [0, 4.2, 10.5], fov: 45, near: 0.1, far: 50 }}>
              <HanoiBoard diskCount={diskCount} moves={moves} moveIndex={moveIndex} paused={simulationPaused} onPhaseChange={setExecutionPhase} onMoveComplete={completeMove} />
            </Canvas>
          </div>
        </div>

        <div className="min-w-0 bg-white text-slate-900">
          {mode === 'watch' ? (
            <div className="flex h-full min-h-[480px] flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">C++ recursion</p>
                  <p className="mt-1 text-sm text-slate-600">The active line follows what the tower is doing.</p>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">Running</span>
              </div>
              <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <SyntaxHighlighter
                  language="cpp"
                  style={oneLight}
                  showLineNumbers
                  wrapLines
                  lineNumberStyle={{ minWidth: '2.5em', color: '#94a3b8' }}
                  lineProps={(lineNumber) => ({
                    style: {
                      display: 'block',
                      width: '100%',
                      borderLeft: `3px solid ${
                        valueFlash && (lineNumber === 11 || lineNumber === 12)
                          ? '#f59e0b'
                          : lineNumber === activeCodeLine
                            ? '#4f46e5'
                            : 'transparent'
                      }`,
                      background:
                        valueFlash && (lineNumber === 11 || lineNumber === 12)
                          ? '#fef3c7'
                          : lineNumber === activeCodeLine
                            ? '#eef2ff'
                            : 'transparent',
                      transition: 'background-color 220ms ease, border-color 220ms ease',
                    },
                  })}
                  customStyle={{ margin: 0, padding: '16px 0', background: '#ffffff', fontSize: '13px', lineHeight: '1.85' }}
                  codeTagProps={{ style: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' } }}
                >
                  {solutionCode(diskCount)}
                </SyntaxHighlighter>
              </div>
              <div className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
                <p className={executionPhase === 'first-call' ? 'font-semibold text-indigo-700' : ''}><strong className="text-slate-900">First call:</strong> moves the smaller stack onto the spare rod.</p>
                <p className={executionPhase === 'move' ? 'font-semibold text-indigo-700' : ''}><strong className="text-slate-900">Middle line:</strong> moves the largest available disk to its destination.</p>
                <p className={executionPhase === 'second-call' ? 'font-semibold text-indigo-700' : ''}><strong className="text-slate-900">Second call:</strong> repeats the process to place the smaller stack on top.</p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[480px] flex-col p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase text-slate-500">Write the recursive function</p>
                  <p className="mt-1 text-sm text-slate-600">The tower follows your code after all four required steps are present.</p>
                </div>
                {codeCorrect ? (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"><Check size={14} /> Correct code</span>
                ) : (
                  <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">Not complete</span>
                )}
              </div>
              <HighlightedCodeEditor value={studentCode} onChange={updateStudentCode} />
              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p className={codeCheck.baseCase ? 'text-emerald-700' : ''}>1. Add a base case that stops when the disk count reaches 0.</p>
                <p className={codeCheck.firstCall ? 'text-emerald-700' : ''}>2. Move the smaller stack from source to spare.</p>
                <p className={codeCheck.move ? 'text-emerald-700' : ''}>3. Move the current disk from source to target.</p>
                <p className={codeCheck.secondCall ? 'text-emerald-700' : ''}>4. Move the smaller stack from spare to target.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 sm:px-6 sm:text-base">
        <strong className="text-slate-900 dark:text-white">Why this is recursion:</strong> the two highlighted
        lines call <code className="font-mono font-bold text-indigo-700 dark:text-indigo-300">hanoi</code> from
        inside <code className="font-mono font-bold text-indigo-700 dark:text-indigo-300">hanoi</code>. Each call
        reduces <code className="font-mono font-bold">n</code> by one, so it eventually reaches the base case and
        returns. The physical tower performs the moves in the same order produced by those calls.
      </div>
    </section>
  );
};

export default HanoiThreeWalkthrough;

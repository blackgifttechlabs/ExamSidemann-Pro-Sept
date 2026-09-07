import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Camera, Check, LoaderCircle, RefreshCw, Sparkles, Video, VideoOff } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { requestGeminiCompletion, requestGeminiImageEdit } from '../../../services/gemini';

type TutorStep = {
  id: number;
  capturedImage: string;
  explanation?: string;
  generatedImage?: string;
  imageError?: string;
};

const mathJaxConfig = {
  loader: { load: ['[tex]/ams'] },
  tex: {
    packages: { '[+]': ['ams'] },
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
  },
};

const SYSTEM_PROMPT = `You are Sidemann, a patient secondary-school mathematics teacher in Zimbabwe.
Read the photographed problem and the learner's visible working accurately.
Teach exactly ONE useful next step, not the entire solution unless that next step completes it.
Begin by stating what you can read from the image. Explain why the next step is valid.
Use concise Markdown. IMPORTANT: always wrap ALL mathematics in LaTeX delimiters:
- Inline maths: $...$ for example $8ab \\div 2ab = 4$
- Display maths (on its own line): $$...$$ for example $$8ab + 6ab^2 = 2ab(4 + 3b)$$
Do NOT write bare expressions like (8ab \\div 2ab = 4) or [8ab + 6ab^2 = 2ab(4 + 3b)] without dollar signs.
Never invent unreadable values. If part of the question is unclear, say exactly what needs to be recaptured.`;

const normalizeMath = (text: string): string =>
  text
    .replace(/\\\((.+?)\\\)/gs, (_m, inner) => `$${inner}$`)
    .replace(/\\\[(.+?)\\\]/gs, (_m, inner) => `$$${inner}$$`);

const REMARK_PLUGINS = [remarkGfm];

const imagePrompt = (stepNumber: number) => `Edit this photographed mathematics page to demonstrate only the next correct working step (${stepNumber}).
Preserve the original photograph's background, paper, shadows, perspective, crop, ink already present, and every existing mark.
Do not replace, clean, recolour, restyle, redraw, crop, rotate, or blur the background.
Add only the minimum next line of mathematically correct working in the empty space immediately below the learner's last line.
Match the learner's handwriting style, ink colour, stroke weight, size, spacing and alignment as closely as possible.
Do not add boxes, arrows, captions, UI, digital fonts, explanations, watermarks, or a final answer unless it is the immediate next step.
Return the complete edited photograph, not a separate whiteboard or recreated page.`;

const CameraView = React.forwardRef<HTMLVideoElement, { compact?: boolean }>(
  ({ compact = false }, ref) => (
    <div className={`relative overflow-hidden bg-slate-950 ${compact ? 'h-full w-full rounded-2xl' : 'aspect-[4/3] rounded-3xl'}`}>
      <video ref={ref} autoPlay muted playsInline className="h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-3 rounded-xl border border-white/50" />
      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> Live camera
      </div>
    </div>
  ),
);
CameraView.displayName = 'CameraView';

const MathAnswer = ({ children }: { children: string }) => {
  const normalized = normalizeMath(children);
  return (
    <MathJax dynamic className="min-w-0">
      <div className="prose prose-slate max-w-none text-sm leading-relaxed prose-headings:font-black prose-p:my-2 prose-li:my-1 dark:prose-invert sm:text-base">
        <ReactMarkdown remarkPlugins={REMARK_PLUGINS}>{normalized}</ReactMarkdown>
      </div>
    </MathJax>
  );
};

export const MathCameraTutor: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.pathname.includes('/alevel/') ? 'A Level' : 'O Level';
  const levelRoute = level === 'A Level' ? '/practicals/alevel' : '/practicals/olevel';
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [started, setStarted] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [steps, setSteps] = useState<TutorStep[]>([]);
  const [statusText, setStatusText] = useState('');
  /** Image-edit requires a paid Gemini plan; off by default to avoid quota errors. */
  const [generateHandwrittenStep, setGenerateHandwrittenStep] = useState(false);

  const currentStep = steps[steps.length - 1];
  const nextNumber = steps.length + 1;

  const attachStream = (stream: MediaStream) => {
    [videoRef.current, mobileVideoRef.current].forEach((video) => {
      if (!video) return;
      video.srcObject = stream;
      void video.play().catch(() => undefined);
    });
  };

  useEffect(() => {
    if (streamRef.current) attachStream(streamRef.current);
  });

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startCamera = async () => {
    setStarted(true);
    setCameraError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is not supported in this browser.');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1440 } },
      });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      attachStream(stream);
      setCameraReady(true);
    } catch (error) {
      setCameraReady(false);
      setCameraError(error instanceof Error ? error.message : 'Camera permission was not granted.');
    }
  };

  const captureFrame = () => {
    const video = videoRef.current || mobileVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) throw new Error('The camera is still starting. Try again in a moment.');
    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser could not capture the camera frame.');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.88);
  };

  const captureAndTeach = async () => {
    if (processing) return;
    setCameraError('');
    let capturedImage = '';
    try {
      capturedImage = captureFrame();
    } catch (error) {
      setCameraError(error instanceof Error ? error.message : 'Unable to capture the image.');
      return;
    }

    const id = Date.now();
    const stepNumber = nextNumber;
    setSteps((current) => [...current, { id, capturedImage }]);
    setProcessing(true);
    setStatusText('Reading your problem…');
    const attachment = { mimeType: 'image/jpeg', data: capturedImage };

    const explanationPromise = requestGeminiCompletion({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `This is camera capture ${stepNumber}. Read the problem and existing work, then teach the next step.`, image: attachment },
      ],
      maxTokens: 1400,
      temperature: 0.2,
      onWait: (info) => setStatusText(`Teacher queue: retrying in ${Math.max(1, Math.ceil(info.waitSeconds))}s…`),
    });

    const imagePromise = generateHandwrittenStep
      ? requestGeminiImageEdit({
          image: attachment,
          prompt: imagePrompt(stepNumber),
          onWait: (info) => setStatusText(`Preparing the written step in ${Math.max(1, Math.ceil(info.waitSeconds))}s…`),
        })
      : Promise.resolve(null);

    const [explanationResult, imageResult] = await Promise.allSettled([explanationPromise, imagePromise]);
    setSteps((current) => current.map((step) => step.id === id ? {
      ...step,
      explanation: explanationResult.status === 'fulfilled'
        ? explanationResult.value
        : 'I could not read this capture clearly. Keep the whole question inside the frame, improve the lighting, and capture it again.',
      generatedImage: imageResult.status === 'fulfilled' && imageResult.value ? imageResult.value.dataUrl : undefined,
      imageError: imageResult.status === 'rejected'
        ? (imageResult.reason instanceof Error ? imageResult.reason.message : 'The handwritten image could not be generated.')
        : undefined,
    } : step));
    setProcessing(false);
    setStatusText('');
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  };

  const history = useMemo(() => steps.slice(0, -1).reverse(), [steps]);

  if (!started) {
    return (
      <main className="min-h-[100dvh] bg-[radial-gradient(circle_at_top_right,#ddd6fe,transparent_34%),linear-gradient(145deg,#f8fafc,#eef2ff)] px-4 py-8 dark:bg-[radial-gradient(circle_at_top_right,#312e81,transparent_30%),linear-gradient(145deg,#020617,#111827)] sm:py-14">
        <button onClick={() => navigate(levelRoute)} className="mx-auto flex w-full max-w-5xl items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"><ArrowLeft size={18} /> Back to {level} practicals</button>
        <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-[32px] border border-white/70 bg-white/85 p-6 text-center shadow-[0_28px_90px_rgba(76,29,149,.18)] backdrop-blur dark:border-white/10 dark:bg-slate-900/85 sm:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-500/30"><Camera size={36} /></div>
          <div className="mt-6 text-xs font-black uppercase tracking-[.22em] text-violet-600 dark:text-violet-300">{level} Mathematics</div>
          <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">Let Sidemann help you work through a maths problem.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">Show the question and your working to the camera. Sidemann will explain one step, then place that step naturally onto a copy of your page.</p>
          <button onClick={startCamera} className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 px-8 text-base font-black text-white shadow-lg shadow-violet-500/25 transition hover:-translate-y-0.5"><Video size={21} /> Start</button>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Your camera stays on this device until you press Capture. Only captured frames are sent to Gemini.</p>
        </section>
      </main>
    );
  }

  return (
    <MathJaxContext config={mathJaxConfig}>
      {/* ── Fixed left sidebar (desktop only) ── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-slate-200 bg-white dark:border-white/10 dark:bg-[#0b1424] lg:flex">
        {/* Camera feed fills top portion */}
        <div className="relative flex-1 overflow-hidden bg-slate-950">
          <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
          {!cameraReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-sm text-slate-400">
              <VideoOff size={32} className="mb-2" />
              Camera is off
            </div>
          )}
          {cameraReady && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" /> Live camera
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-3 border-t border-slate-200 p-4 dark:border-white/10">
          <button
            disabled={!cameraReady || processing}
            onClick={captureAndTeach}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 font-black text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? <LoaderCircle className="animate-spin" /> : <Camera />}
            {steps.length ? 'Capture next step' : 'Capture problem'}
          </button>

          <p className="px-1 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Keep the whole question, your last line and some empty writing space in the frame.
          </p>

          {/* AI handwritten step toggle */}
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm dark:border-white/10 dark:bg-white/5">
            <span className="flex flex-col">
              <span className="font-black text-slate-800 dark:text-white">AI handwritten step</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Requires paid Gemini plan</span>
            </span>
            <button
              role="switch"
              aria-checked={generateHandwrittenStep}
              onClick={() => setGenerateHandwrittenStep((v) => !v)}
              className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors focus:outline-none ${generateHandwrittenStep ? 'bg-violet-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${generateHandwrittenStep ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </label>

          {/* Camera on/off + back row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(levelRoute)}
              className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              <ArrowLeft size={16} /> {level} practicals
            </button>
            <button
              onClick={cameraReady ? stopCamera : startCamera}
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              aria-label={cameraReady ? 'Turn camera off' : 'Turn camera on'}
            >
              {cameraReady ? <VideoOff size={16} /> : <Video size={16} />}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content — offset by sidebar width on desktop ── */}
      <main className="min-h-[100dvh] bg-slate-100 text-slate-900 dark:bg-[#07101f] dark:text-white lg:ml-80">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-3 backdrop-blur dark:border-white/10 dark:bg-[#0b1424]/95 lg:hidden">
          <button onClick={() => navigate(levelRoute)} className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5">
            <ArrowLeft size={18} />
          </button>
          <div className="text-center">
            <div className="text-sm font-black">Sidemann</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">Mathematics · {level}</div>
          </div>
          <button onClick={cameraReady ? stopCamera : startCamera} className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" aria-label={cameraReady ? 'Turn camera off' : 'Turn camera on'}>
            {cameraReady ? <VideoOff size={16} /> : <Video size={16} />}
          </button>
        </header>

        <div className="space-y-4 p-4 pb-28 sm:p-6 lg:pb-6">
          {cameraError && (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
              {cameraError} <button onClick={startCamera} className="ml-2 underline">Try again</button>
            </div>
          )}

          {!currentStep && (
            <div className="grid min-h-[70dvh] place-items-center text-center lg:min-h-[80dvh]">
              <div className="max-w-lg">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                  <Sparkles size={30} />
                </div>
                <h2 className="mt-5 text-2xl font-black">Put the maths problem on the camera. I will help you.</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  Hold the phone still, avoid shadows, and leave visible space below your current working. Then press Capture.
                </p>
              </div>
            </div>
          )}

          {currentStep && (
            <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f1a2c]">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10 sm:px-6">
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-violet-600 dark:text-violet-300">Step {steps.length}</div>
                  <h2 className="font-black">Sidemann's guidance</h2>
                </div>
                {!processing && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <Check size={12} /> Ready
                  </span>
                )}
              </div>

              {processing ? (
                <div className="grid min-h-[40dvh] place-items-center p-8 text-center">
                  <div>
                    <LoaderCircle className="mx-auto animate-spin text-violet-600" size={36} />
                    <h3 className="mt-4 font-black">Working through the next step</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{statusText || 'Reading the handwriting…'}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 p-4 sm:p-6">
                  {currentStep.explanation && (
                    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
                      <MathAnswer>{currentStep.explanation}</MathAnswer>
                    </div>
                  )}

                  {/* Images — only show the grid when there's something to show */}
                  <div className={`grid gap-4 ${currentStep.generatedImage ? 'xl:grid-cols-2' : ''}`}>
                    <figure className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                      <img src={currentStep.capturedImage} alt={`Captured mathematics working for step ${steps.length}`} className="h-auto max-h-[620px] w-full bg-slate-50 object-contain dark:bg-slate-950" />
                      <figcaption className="px-3 py-2 text-center text-xs font-bold text-slate-500">Your capture</figcaption>
                    </figure>

                    {/* Generated image — only render when image gen is ON */}
                    {generateHandwrittenStep && currentStep.generatedImage && (
                      <figure className="overflow-hidden rounded-2xl border border-violet-200 dark:border-violet-400/20">
                        <img src={currentStep.generatedImage} alt={`AI-generated handwritten continuation for step ${steps.length}`} className="h-auto max-h-[620px] w-full bg-slate-50 object-contain dark:bg-slate-950" />
                        <figcaption className="flex items-center justify-center gap-1.5 px-3 py-2 text-center text-xs font-bold text-violet-700 dark:text-violet-300">
                          <Sparkles size={13} /> AI-generated next-step preview
                        </figcaption>
                      </figure>
                    )}

                    {/* Error placeholder — only when toggle is ON and image actually failed */}
                    {generateHandwrittenStep && !currentStep.generatedImage && currentStep.imageError && (
                      <div className="grid min-h-48 place-items-center rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-5 text-center text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        <div><RefreshCw className="mx-auto mb-2" />{currentStep.imageError}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          )}

          {history.length > 0 && (
            <details className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-[#0f1a2c]">
              <summary className="cursor-pointer text-sm font-black">Earlier steps ({history.length})</summary>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {history.map((step, index) => (
                  <img key={step.id} src={step.generatedImage || step.capturedImage} alt={`Earlier maths step ${history.length - index}`} className="w-full rounded-xl border border-slate-200 dark:border-white/10" />
                ))}
              </div>
            </details>
          )}
        </div>
      </main>

      {/* Mobile: floating mini camera PiP */}
      {cameraReady && (
        <div className="fixed bottom-24 right-3 z-40 h-36 w-28 overflow-hidden rounded-2xl border-2 border-white bg-black shadow-2xl lg:hidden sm:h-44 sm:w-36">
          <CameraView ref={mobileVideoRef} compact />
        </div>
      )}
      {/* Mobile: bottom capture bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 p-3 backdrop-blur dark:border-white/10 dark:bg-[#0b1424]/95 lg:hidden">
        <button disabled={!cameraReady || processing} onClick={captureAndTeach} className="mx-auto flex min-h-14 w-full max-w-md items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-600 font-black text-white shadow-lg disabled:opacity-50">
          {processing ? <LoaderCircle className="animate-spin" /> : <Camera />}
          {steps.length ? 'Capture next step' : 'Capture problem'}
        </button>
      </div>
    </MathJaxContext>
  );
};

export default MathCameraTutor;

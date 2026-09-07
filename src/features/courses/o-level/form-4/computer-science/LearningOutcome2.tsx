import React, { useState, useRef } from 'react';
import ConceptExplainer from './ConceptExplainer';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// CPU internal structure
const cpuStructureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-labelledby="cpu-title cpu-desc">
  <title id="cpu-title">Modern CPU structure diagram</title>
  <desc id="cpu-desc">The control unit and arithmetic logic unit exchange data with registers, which communicate with main memory through buses.</desc>
  <defs>
    <linearGradient id="cpu-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#eff6ff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
    <linearGradient id="cpu-shell" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#172554"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
    <linearGradient id="alu-card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#3b82f6"/>
    </linearGradient>
    <linearGradient id="cu-card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
    <filter id="cpu-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity=".14"/>
    </filter>
    <marker id="cpu-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto-start-reverse">
      <path d="M1 1L9 5L1 9Z" fill="#60a5fa"/>
    </marker>
  </defs>

  <rect width="900" height="540" rx="28" fill="url(#cpu-bg)"/>
  <circle cx="76" cy="72" r="34" fill="#dbeafe"/>
  <path d="M61 59h30v26H61zM68 52v7M76 52v7M84 52v7M68 85v7M76 85v7M84 85v7M54 65h7M54 73h7M91 65h7M91 73h7" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/>
  <text x="128" y="67" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="#0f172a">Inside the CPU</text>
  <text x="128" y="92" font-family="Inter, Arial, sans-serif" font-size="15" fill="#475569">How instructions, calculations and temporary data move</text>

  <rect x="105" y="125" width="690" height="300" rx="26" fill="url(#cpu-shell)" filter="url(#cpu-shadow)"/>
  <text x="450" y="164" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="16" font-weight="700" letter-spacing="2" fill="#bfdbfe">CENTRAL PROCESSING UNIT</text>

  <rect x="145" y="190" width="260" height="115" rx="20" fill="url(#alu-card)"/>
  <circle cx="182" cy="225" r="19" fill="#ffffff" fill-opacity=".18"/>
  <text x="182" y="232" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800" fill="#ffffff">+</text>
  <text x="220" y="224" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">ALU</text>
  <text x="220" y="248" font-family="Inter, Arial, sans-serif" font-size="14" fill="#dbeafe">Arithmetic &amp; Logic Unit</text>
  <text x="165" y="279" font-family="Inter, Arial, sans-serif" font-size="13" fill="#eff6ff">Calculates • compares • makes decisions</text>

  <rect x="495" y="190" width="260" height="115" rx="20" fill="url(#cu-card)"/>
  <circle cx="532" cy="225" r="19" fill="#ffffff" fill-opacity=".18"/>
  <path d="M522 225h20M532 215v20" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
  <text x="570" y="224" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">Control Unit</text>
  <text x="515" y="251" font-family="Inter, Arial, sans-serif" font-size="13" fill="#ede9fe">Fetches • decodes • coordinates operations</text>

  <path d="M405 247H495" stroke="#c4b5fd" stroke-width="4" stroke-linecap="round" marker-start="url(#cpu-arrow)" marker-end="url(#cpu-arrow)"/>

  <rect x="235" y="340" width="430" height="58" rx="16" fill="#ffffff" fill-opacity=".96"/>
  <text x="450" y="365" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#0f172a">Registers</text>
  <text x="450" y="385" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#475569">Ultra-fast temporary storage inside the CPU</text>
  <path d="M275 305V340M625 305V340" stroke="#93c5fd" stroke-width="4" marker-end="url(#cpu-arrow)"/>

  <path d="M450 398V457" stroke="#2563eb" stroke-width="5" marker-start="url(#cpu-arrow)" marker-end="url(#cpu-arrow)"/>
  <rect x="205" y="457" width="490" height="58" rx="17" fill="#ffffff" stroke="#f59e0b" stroke-width="3" filter="url(#cpu-shadow)"/>
  <text x="450" y="482" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="800" fill="#92400e">Main Memory — RAM &amp; ROM</text>
  <text x="450" y="502" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#a16207">Connected to the CPU by address, data and control buses</text>
</svg>
`;

// Fetch-Execute cycle
const fetchExecuteSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 580" role="img" aria-labelledby="cycle-title cycle-desc">
  <title id="cycle-title">Fetch decode execute store cycle</title>
  <desc id="cycle-desc">Four connected stages show how the CPU repeatedly fetches, decodes, executes and stores instructions.</desc>
  <defs>
    <linearGradient id="cycle-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#eff6ff"/>
    </linearGradient>
    <filter id="cycle-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/>
    </filter>
    <marker id="cycle-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto">
      <path d="M1 1L11 6L1 11Z" fill="#2563eb"/>
    </marker>
  </defs>

  <rect width="900" height="580" rx="28" fill="url(#cycle-bg)"/>
  <text x="450" y="53" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" fill="#0f172a">The Instruction Cycle</text>
  <text x="450" y="80" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="15" fill="#475569">The CPU repeats these four stages millions or billions of times per second</text>

  <path d="M370 174H530M690 240V340M530 406H370M210 340V240" fill="none" stroke="#2563eb" stroke-width="5" stroke-linecap="round" marker-end="url(#cycle-arrow)"/>

  <g filter="url(#cycle-shadow)">
    <rect x="70" y="110" width="300" height="130" rx="22" fill="#ffffff" stroke="#bfdbfe" stroke-width="2"/>
    <circle cx="113" cy="151" r="23" fill="#2563eb"/>
    <text x="113" y="159" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff">1</text>
    <text x="151" y="153" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="800" fill="#1d4ed8">FETCH</text>
    <text x="97" y="190" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">The Control Unit gets the next</text>
    <text x="97" y="211" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">instruction from main memory.</text>

    <rect x="530" y="110" width="300" height="130" rx="22" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
    <circle cx="573" cy="151" r="23" fill="#7c3aed"/>
    <text x="573" y="159" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff">2</text>
    <text x="611" y="153" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="800" fill="#6d28d9">DECODE</text>
    <text x="557" y="190" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">The Control Unit interprets</text>
    <text x="557" y="211" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">what the instruction means.</text>

    <rect x="530" y="340" width="300" height="130" rx="22" fill="#ffffff" stroke="#a7f3d0" stroke-width="2"/>
    <circle cx="573" cy="381" r="23" fill="#059669"/>
    <text x="573" y="389" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff">3</text>
    <text x="611" y="383" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="800" fill="#047857">EXECUTE</text>
    <text x="557" y="420" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">The ALU or another component</text>
    <text x="557" y="441" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">carries out the operation.</text>

    <rect x="70" y="340" width="300" height="130" rx="22" fill="#ffffff" stroke="#fde68a" stroke-width="2"/>
    <circle cx="113" cy="381" r="23" fill="#d97706"/>
    <text x="113" y="389" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="800" fill="#ffffff">4</text>
    <text x="151" y="383" font-family="Inter, Arial, sans-serif" font-size="23" font-weight="800" fill="#b45309">STORE</text>
    <text x="97" y="420" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">The result is saved in a register</text>
    <text x="97" y="441" font-family="Inter, Arial, sans-serif" font-size="14" fill="#334155">or returned to main memory.</text>
  </g>

  <circle cx="450" cy="290" r="70" fill="#172554"/>
  <path d="M424 277h52v39h-52zM435 266v11M450 266v11M465 266v11M435 316v11M450 316v11M465 316v11M413 286h11M413 302h11M476 286h11M476 302h11" fill="none" stroke="#93c5fd" stroke-width="5" stroke-linecap="round"/>
  <text x="450" y="510" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#1e3a8a">STORE → FETCH: the cycle immediately begins again</text>
</svg>
`;

// Storage hierarchy (primary vs secondary)
const storageHierarchySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 570" role="img" aria-labelledby="storage-title storage-desc">
  <title id="storage-title">Computer storage hierarchy</title>
  <desc id="storage-desc">Registers and cache are fastest and smallest, followed by primary memory, then larger secondary storage.</desc>
  <defs>
    <linearGradient id="storage-bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#ecfeff"/>
    </linearGradient>
    <linearGradient id="register-tier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#f97316"/>
    </linearGradient>
    <linearGradient id="cache-tier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#6366f1"/>
    </linearGradient>
    <linearGradient id="memory-tier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
    <linearGradient id="secondary-tier" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <filter id="storage-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/>
    </filter>
    <marker id="storage-arrow" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto">
      <path d="M1 11L6 1L11 11Z" fill="#64748b"/>
    </marker>
  </defs>

  <rect width="900" height="570" rx="28" fill="url(#storage-bg)"/>
  <text x="450" y="52" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="800" fill="#0f172a">Storage Hierarchy</text>
  <text x="450" y="79" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="15" fill="#475569">Storage changes in speed, capacity and cost as it moves farther from the CPU</text>

  <path d="M91 448V131" stroke="#64748b" stroke-width="4" marker-end="url(#storage-arrow)"/>
  <text x="65" y="292" text-anchor="middle" transform="rotate(-90 65 292)" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#475569">FASTER • SMALLER • HIGHER COST PER BYTE</text>

  <g filter="url(#storage-shadow)">
    <rect x="320" y="112" width="260" height="76" rx="19" fill="url(#register-tier)"/>
    <text x="450" y="143" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">CPU Registers</text>
    <text x="450" y="167" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#fff7ed">Fastest • tiny • volatile</text>

    <rect x="265" y="211" width="370" height="76" rx="19" fill="url(#cache-tier)"/>
    <text x="450" y="242" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">Cache Memory</text>
    <text x="450" y="266" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#eef2ff">Very fast • small • volatile</text>

    <rect x="205" y="310" width="490" height="82" rx="20" fill="url(#memory-tier)"/>
    <text x="450" y="342" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">Primary Storage — RAM &amp; ROM</text>
    <text x="450" y="368" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#e0f2fe">Directly accessible by CPU • medium capacity</text>

    <rect x="140" y="415" width="620" height="100" rx="22" fill="url(#secondary-tier)"/>
    <text x="450" y="448" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">Secondary Storage — non-volatile</text>
    <rect x="176" y="466" width="150" height="28" rx="14" fill="#ffffff" fill-opacity=".18"/>
    <rect x="375" y="466" width="150" height="28" rx="14" fill="#ffffff" fill-opacity=".18"/>
    <rect x="574" y="466" width="150" height="28" rx="14" fill="#ffffff" fill-opacity=".18"/>
    <text x="251" y="485" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">Magnetic: HDD, tape</text>
    <text x="450" y="485" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">Optical: CD, DVD</text>
    <text x="649" y="485" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">Flash: SSD, USB</text>
  </g>

  <path d="M809 131V448" stroke="#64748b" stroke-width="4" marker-end="url(#storage-arrow)"/>
  <text x="835" y="292" text-anchor="middle" transform="rotate(90 835 292)" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700" fill="#475569">LARGER CAPACITY • SLOWER • LOWER COST PER BYTE</text>
</svg>
`;

const hardwareImages = {
  cpuStructure: svgToDataUri(cpuStructureSvg),
  fetchExecute: svgToDataUri(fetchExecuteSvg),
  storageHierarchy: svgToDataUri(storageHierarchySvg),
};

const LESSON_IMAGE_BASE =
  '/images/courses/o-level/computer-science/learning-outcome-2';

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LessonImageProps {
  fileName: string;
  alt: string;
  caption?: string;
  className?: string;
}

const LessonImage: React.FC<LessonImageProps> = ({
  fileName,
  alt,
  caption,
  className = 'h-60 w-full object-contain p-4 sm:h-64',
}) => {
  const [isMissing, setIsMissing] = useState(false);
  const imagePath = `${LESSON_IMAGE_BASE}/${encodeURIComponent(fileName)}`;

  return (
    <figure className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/60 shadow-sm">
      {isMissing ? (
        <div className="flex h-60 flex-col items-center justify-center px-5 text-center sm:h-64">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-700">
            Image not found
          </span>
          <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
            {fileName}
          </code>
        </div>
      ) : (
        <img
          src={imagePath}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={className}
          onError={() => setIsMissing(true)}
        />
      )}
      {caption && (
        <figcaption className="border-t border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

const sections: TopicSection[] = [
  {
    id: 'part-a',
    title: 'Part A: Input Hardware',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Hardware</strong> refers to the physical, tangible parts of a computer. They are grouped into
              input, processing, output, and storage devices.
            </p>
            <h3 className="text-xl font-bold text-blue-700 mt-6">Input Hardware</h3>
            <p>Devices used to enter data and instructions into the computer.</p>
          </div>

          <ConceptExplainer
            title="How Input Devices Capture Different Kinds of Data"
            introduction="An input device converts a human action, physical measurement or coded source into signals the computer can process. Selection depends on the data type, speed, accuracy, environment, accessibility and amount of human effort."
            accent="amber"
            concepts={[
              {
                name: 'Manual Text and Command Entry',
                definition: 'A person deliberately enters characters or commands through keys or controls.',
                explanation: 'Manual entry is flexible because the user can type many different values, but it is slower than direct capture and vulnerable to transcription errors. Verification and ergonomic use are important.',
                examples: ['Keyboard', 'Numeric keypad', 'Game controller button'],
                examTip: 'Distinguish manual entry by a person from automatic source-data capture.',
              },
              {
                name: 'Pointing and Drawing Input',
                definition: 'A device supplies coordinates, movement, selection or freehand drawing information.',
                explanation: 'The operating system converts movement or touch into pointer coordinates and events such as click, drag or gesture. Precision, available surface and the user’s task determine the best device.',
                examples: ['Mouse', 'Trackball', 'Graphics tablet and stylus'],
                examTip: 'Explain the action captured, not merely that the device “controls the screen.”',
              },
              {
                name: 'Image and Video Capture',
                definition: 'Optical devices convert light from documents or scenes into digital image data.',
                explanation: 'A scanner captures a flat document, a digital camera records still or moving scenes and a webcam streams images. Resolution, colour depth, lighting and compression affect quality and file size.',
                examples: ['Flatbed scanner', 'Digital camera', 'Webcam'],
                examTip: 'A scanner creates an image; OCR is separate software that attempts to recognise characters in that image.',
              },
              {
                name: 'Audio and Touch Input',
                definition: 'Devices capture sound waves or direct physical contact from the user.',
                explanation: 'A microphone needs analogue-to-digital conversion to create digital samples. A touchscreen detects position and gestures while also displaying output, making it a combined input/output device.',
                examples: ['Microphone', 'Capacitive touchscreen', 'Touch-sensitive kiosk'],
                examTip: 'Name the conversion or interaction and the data produced.',
              },
              {
                name: 'Automatic Data Capture',
                definition: 'Data is read directly from a prepared source with little retyping.',
                explanation: 'Readers reduce entry time and transcription errors. Barcodes encode identifiers, magnetic stripes store magnetised patterns and smart cards communicate with an integrated circuit.',
                examples: ['Barcode reader', 'Magnetic-stripe reader', 'Smart-card reader'],
                examTip: 'The barcode normally identifies a record; product details and price are retrieved from a database.',
              },
              {
                name: 'Document Readers and Sensors',
                definition: 'Specialised devices capture marks, printed characters, magnetic ink or physical conditions.',
                explanation: 'OMR detects filled positions, OCR recognises printed or handwritten characters and MICR reads magnetised characters. Sensors measure variables such as temperature and produce signals for conversion and processing.',
                examples: ['OMR exam sheet', 'MICR cheque reader', 'Temperature sensor'],
                examTip: 'OMR reads the position of a mark; OCR tries to identify the character itself.',
              },
            ]}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                name: 'Keyboard',
                desc: 'Used to enter data by typing. Similar to a typewriter. Enters alphabetic, numeric, and special characters. Manual entry – excessive use can cause Repetitive Strain Injury (RSI).',
                image: 'keyboard.png',
              },
              {
                name: 'Mouse',
                desc: 'Pointing device used to select items, click, and drag. Fast method of data entry.',
                image: 'mouse.png',
              },
              {
                name: 'Scanner',
                desc: 'Converts images from paper into electrical signals for input. Used to scan pictures and documents.',
                image: 'scanner.png',
              },
              {
                name: 'Digital Camera',
                desc: 'Captures photographs, films, or videos and transfers them to the computer for editing.',
                image: 'digital camera.png',
              },
              {
                name: 'Touch Screen',
                desc: 'A display that accepts input by touching the screen with a finger. Used in ATMs, smartphones, tablets. Both input and output device.',
                image: 'touchscreen.png',
              },
              {
                name: 'Joystick',
                desc: 'Used mainly for playing games; can also be an alternative to a mouse. Moves objects on the screen.',
                image: 'joystick.png',
              },
              {
                name: 'Trackball (Tracer Ball)',
                desc: 'A stationary pointing device whose exposed ball is rotated to move the pointer. Useful where desk space is limited and in some accessibility or industrial controls.',
                image: 'tracerball.png',
              },
              {
                name: 'Microphone',
                desc: 'A transducer that converts sound into an electrical signal. An audio interface converts the signal into digital samples for recording, calls, speech recognition or control.',
                image: 'microphone.png',
              },
              {
                name: 'Light Pen',
                desc: 'A pen‑shaped device used to draw on the screen or select commands.',
                image: 'lightpen.png',
              },
              {
                name: 'Kimball Tags',
                desc: 'Historically used retail tags containing punched holes that encoded product details for automatic capture at the point of sale.',
                image: 'kimballtags.png',
              },
              {
                name: 'Graphics Tablet',
                desc: 'Provides a drawing surface for creating graphics on the screen.',
                image: 'graphuicstablet.png',
              },
              {
                name: 'Webcam',
                desc: 'Digital camera for capturing and transmitting images over the internet.',
                image: 'webcam.png',
              },
              {
                name: 'Sensor',
                desc: 'Automatically records data by sensing the environment (e.g., humidity, temperature).',
                image: 'sensor.png',
              },
              {
                name: 'Magnetic Strip Reader',
                desc: 'Reads characters encoded in magnetised tracks on cards such as access cards and older payment or ticket systems.',
                image: 'Magnetic Strip Reader.png',
              },
              {
                name: 'Smart Card',
                desc: 'A card containing an integrated circuit with memory and sometimes a processor. It can securely store, process and update data.',
                image: 'smartcard.png',
              },
              {
                name: 'Barcode Reader',
                desc: 'Reads barcodes on products for automatic data entry. Used in EPOS, libraries, stock control.',
                image: 'barcodereader.png',
              },
              {
                name: 'Document Readers (OMR, OCR, MICR)',
                desc: (
                  <>
                    <strong>OMR</strong> – reads pencil marks (multiple‑choice exams).<br />
                    <strong>OCR</strong> – reads characters (billing systems).<br />
                    <strong>MICR</strong> – reads magnetic ink (cheques).
                  </>
                ),
                image: 'omr.png',
              },
            ].map((item) => (
              <article key={item.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <h4 className="font-bold text-blue-700">{item.name}</h4>
                <p className="text-slate-700 text-sm mt-1">{item.desc}</p>
                <div className="mt-auto">
                  <LessonImage
                    fileName={item.image}
                    alt={`${item.name} input device`}
                  />
                </div>
              </article>
            ))}
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
            <p><strong>Characters:</strong> Any symbol, digit, or letter (numeric, alphabetic, alphanumeric, special).</p>
            <p><strong>ASCII:</strong> 7‑bit code for character representation. <strong>EBCDIC:</strong> 8‑bit code.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Input Devices Summary</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Keyboard – text entry</li>
              <li>Mouse – pointing/clicking</li>
              <li>Scanner – image capture</li>
              <li>Microphone – voice input</li>
              <li>Barcode reader – automatic data entry</li>
              <li>OMR/OCR/MICR – document reading</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Output Hardware',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Output hardware</strong> converts processed digital results into a form people or other systems
              can use. Output may be visual, printed, audible or physical.
            </p>
          </div>

          <ConceptExplainer
            title="Output Devices Explained"
            introduction="Choose an output device by considering permanence, audience, required quality, size, speed, accessibility and running cost. Soft copy is temporary electronic output; hard copy is a physical permanent output."
            accent="amber"
            concepts={[
              {
                name: 'Impact Printer',
                definition: 'A printer that creates marks by physically striking an inked ribbon against paper.',
                explanation: 'Impact printing is noisy and usually lower resolution, but the pressure can produce multipart carbon copies. A print head or formed character strikes the ribbon in the required positions.',
                examples: ['Dot-matrix printer', 'Daisy-wheel printer', 'Line printer'],
                examTip: 'Physical contact and multipart forms are the distinguishing clues.',
              },
              {
                name: 'Inkjet Printer',
                definition: 'A non-impact printer that places microscopic droplets of ink onto paper.',
                explanation: 'Inkjet printers can produce detailed colour photographs and are affordable to purchase. Ink cost, blocked nozzles and slower high-volume printing may make them less suitable for a busy office.',
                examples: ['Home document printer', 'Photo printer', 'Wide-format inkjet'],
                examTip: 'Separate low purchase cost from the continuing cost of ink.',
              },
              {
                name: 'Laser Printer',
                definition: 'A non-impact page printer using electrostatic charge, toner and heat.',
                explanation: 'A laser or LED forms an electrostatic image on a drum, toner adheres to that image and heated rollers fuse toner to paper. It is fast and sharp for high-volume text but costs more initially.',
                examples: ['Office monochrome laser', 'Colour laser printer', 'High-volume departmental printer'],
                examTip: 'Laser printers use toner powder and a page process—not liquid ink sprayed from nozzles.',
              },
              {
                name: 'Monitor or Visual Display',
                definition: 'A screen that presents changing soft-copy text, graphics and video.',
                explanation: 'Image quality depends on resolution, pixel density, colour, brightness, contrast and refresh behaviour. A display gives immediate interactive feedback but does not produce a permanent paper copy.',
                examples: ['Desktop monitor', 'Laptop display', 'Digital information screen'],
                examTip: 'Resolution is the number or density of picture elements, not the physical screen size.',
              },
              {
                name: 'Plotter and Large-Format Output',
                definition: 'A device that produces precise, often large technical drawings.',
                explanation: 'Traditional pen plotters moved a pen over paper; modern large-format devices may use inkjet mechanisms but are still called plotters in CAD contexts. They preserve scale and fine line detail.',
                examples: ['Architectural plan', 'Engineering drawing', 'Large map'],
                examTip: 'Link plotters to accurate large-format vector or CAD drawings.',
              },
              {
                name: 'Audio and Physical Output',
                definition: 'Output that is heard or causes a physical change rather than appearing only as an image.',
                explanation: 'Speakers convert digital audio through a digital-to-analogue stage into sound. Actuators convert control signals into movement, heat, light or another physical action.',
                examples: ['Speaker announcement', 'Vibration motor', 'Robot-arm actuator'],
                examTip: 'An actuator is output hardware because it acts on the physical environment.',
              },
            ]}
          />

          <div className="grid gap-4">
            {/* Printers */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Printers</h4>
              <p className="text-slate-700 text-sm">Produce hard copies (paper output).</p>
              <div className="mt-2 grid gap-2">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-semibold">Impact Printers</span>
                  <p className="text-sm text-slate-600">Contact between print head and paper. Examples: dot matrix, daisy wheel. Cheap, noisy, slow, poor quality.</p>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-semibold">Non‑Impact Printers</span>
                  <p className="text-sm text-slate-600">No contact. Examples: laser, inkjet. Fast, quiet, high quality, expensive.</p>
                </div>
              </div>
              <LessonImage
                fileName="printers.png"
                alt="Examples of impact and non-impact printers"
                caption="Printers produce permanent hard-copy output on paper."
              />
            </div>

            {/* Monitor */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Screen / Monitor (VDU)</h4>
              <p className="text-slate-700 text-sm">Displays soft copy. Resolution affects quality – high resolution for graphics.</p>
              <LessonImage
                fileName="monitor.png"
                alt="A computer monitor used as a visual display unit"
                caption="A monitor presents text, pictures, and video as temporary soft-copy output."
              />
            </div>

            {/* Graph Plotter */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Graph Plotter</h4>
              <p className="text-slate-700 text-sm">Produces high‑quality drawings in large sizes. Used in Computer Aided Design (CAD).</p>
              <LessonImage
                fileName="graph plotter.png"
                alt="A graph plotter producing a large technical drawing"
                caption="Plotters produce precise, large-format drawings for engineering, maps, and CAD."
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Output Devices Quick Guide</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Printer – hard copy</li>
              <li>Monitor – soft copy</li>
              <li>Plotter – large drawings</li>
              <li>Speakers – audio output</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Processing Hardware (CPU)',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              The <strong>Central Processing Unit (CPU)</strong> executes program instructions and coordinates the
              movement and processing of data. Calling it the “brain” is a useful analogy, but every result still
              depends on instructions, memory, input and output hardware.
            </p>
          </div>

          <ConceptExplainer
            title="Inside the CPU and Instruction Cycle"
            introduction="The CPU is a coordinated system of control logic, calculation circuits, tiny registers, cache and communication pathways. Each component has a precise role."
            accent="amber"
            concepts={[
              {
                name: 'Control Unit (CU)',
                definition: 'The CPU component that directs instruction execution and coordinates other components.',
                explanation: 'The CU fetches an instruction, decodes what operation and operands it requires, then sends control signals so registers, the ALU, memory and devices act in the correct sequence.',
                examples: ['Memory-read signal', 'Register-load signal', 'ALU operation selection'],
                examTip: 'The CU controls and coordinates; it does not perform the arithmetic itself.',
              },
              {
                name: 'Arithmetic and Logic Unit (ALU)',
                definition: 'Digital circuits that perform arithmetic, comparison and logical operations.',
                explanation: 'The ALU receives operands from registers, carries out the selected operation and places the result in a register. Status flags may record outcomes such as zero, carry or negative.',
                examples: ['Adding two values', 'Comparing whether A is greater than B', 'Applying an AND operation'],
                examTip: 'Logic includes comparisons and Boolean operations, not reasoning in ordinary language.',
              },
              {
                name: 'Registers',
                definition: 'Very small, extremely fast storage locations inside the CPU.',
                explanation: 'Special-purpose registers track the instruction and its data: the Program Counter stores the next instruction address, MAR holds a memory address, MDR holds transferred data, CIR holds the current instruction and the accumulator may hold an ALU result.',
                examples: ['Program Counter (PC)', 'Memory Address Register (MAR)', 'Current Instruction Register (CIR)'],
                examTip: 'Registers are inside the CPU and are much smaller and faster than RAM.',
              },
              {
                name: 'Buses',
                definition: 'Sets of electrical pathways carrying data, addresses and control signals.',
                explanation: 'The data bus transfers values and instructions, the address bus identifies a memory or device location and the control bus carries timing and command signals. Bus width can affect how much is transferred or addressed.',
                examples: ['Data bus', 'Address bus', 'Control bus'],
                examTip: 'State what each bus carries; do not describe all buses as carrying data.',
              },
              {
                name: 'Fetch–Decode–Execute Cycle',
                definition: 'The repeated sequence used to retrieve and carry out machine instructions.',
                explanation: 'The next instruction address moves from the PC to the MAR, the instruction returns through the MDR and enters the CIR, the CU decodes it, then the CPU executes it and stores any result before continuing.',
                examples: ['Fetch an ADD instruction', 'Decode its operation and operands', 'Execute and store the sum'],
                examTip: 'Use the correct order: fetch, decode, execute and store where required.',
              },
              {
                name: 'CPU Performance',
                definition: 'How effectively the processor completes a particular workload.',
                explanation: 'Clock frequency, instructions completed per cycle, number of useful cores, cache size, architecture, heat limits, RAM and software all affect observed speed. Extra cores help only when the workload can run tasks in parallel.',
                examples: ['Clock frequency', 'Core count', 'Cache memory'],
                examTip: 'Performance is not calculated simply as clock speed multiplied by core count.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">CPU Components</h4>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li><strong>ALU (Arithmetic and Logic Unit)</strong> – performs arithmetic (add, subtract) and logic (AND, OR) operations.</li>
                <li><strong>Control Unit (CU)</strong> – coordinates and controls all hardware; carries out the fetch‑execute cycle.</li>
                <li><strong>Registers</strong> – high‑speed temporary storage inside the CPU for instructions and data.</li>
              </ul>
              <LessonImage
                fileName="cpu-components.png"
                alt="The main components of a central processing unit"
                caption="The CPU contains the Control Unit, Arithmetic and Logic Unit, and high-speed registers."
              />
              <figure className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <img
                  src={hardwareImages.cpuStructure}
                  alt="Diagram showing how the ALU, Control Unit, registers, buses, RAM, and ROM work together"
                  className="w-full"
                />
                <figcaption className="border-t border-blue-100 px-4 py-3 text-sm font-medium text-slate-600">
                  CPU components communicate with registers and main memory through electronic buses.
                </figcaption>
              </figure>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Fetch‑Execute Cycle</h4>
              <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1">
                <li><strong>Fetch</strong> – CU fetches instruction from memory.</li>
                <li><strong>Decode</strong> – CU decodes the instruction.</li>
                <li><strong>Execute</strong> – CPU performs the operation; the ALU is used when calculation or logic is required.</li>
                <li><strong>Store</strong> – result is stored in a register or memory.</li>
              </ol>
              <figure className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <img
                  src={hardwareImages.fetchExecute}
                  alt="Circular diagram of the fetch, decode, execute, and store stages"
                  className="w-full"
                />
                <figcaption className="border-t border-blue-100 px-4 py-3 text-sm font-medium text-slate-600">
                  After storing a result, the CPU immediately fetches the next instruction and repeats the cycle.
                </figcaption>
              </figure>
              <p className="text-xs text-slate-500 mt-2">The time taken to complete execute phase is called <strong>Execution Time (E‑time)</strong>.</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Processor Speed</h4>
              <p className="text-sm text-slate-700">Clock frequency is measured in <strong>Megahertz (MHz)</strong> or <strong>Gigahertz (GHz)</strong>, but it is not the only measure of performance. Architecture, cache, number of useful cores, memory speed and the workload also matter.</p>
              <LessonImage
                fileName="processor.png"
                alt="A computer processor chip"
                caption="A processor’s clock speed and number of cores affect how quickly it can carry out instructions."
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">CPU Facts</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>ALU – calculations</li>
              <li>CU – control & fetch‑execute</li>
              <li>Registers – fast temporary store</li>
              <li>Performance depends on clock, cores, cache, architecture and workload</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Storage Media',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Storage media hold data and programs. They are classified as <strong>Primary</strong> (main memory) and <strong>Secondary</strong> (backing storage).
            </p>
          </div>

          <ConceptExplainer
            title="Memory and Storage Technologies Explained"
            introduction="Storage is organised as a hierarchy. Fast locations close to the CPU are small and costly per byte, while backing storage provides larger non-volatile capacity. The best device depends on speed, capacity, durability, portability and cost."
            accent="amber"
            concepts={[
              {
                name: 'RAM',
                definition: 'Volatile main memory holding programs and data currently available to the CPU.',
                explanation: 'When software opens, instructions and working data are loaded from secondary storage into RAM. Contents are lost without power, so unsaved work must be written to non-volatile storage.',
                examples: ['Running application code', 'Open document data', 'Operating-system working data'],
                examTip: 'More RAM improves capacity for active work; RAM is not permanent file storage.',
              },
              {
                name: 'ROM and Firmware',
                definition: 'Non-volatile memory used for instructions that must remain available when power is removed.',
                explanation: 'Firmware starts or controls hardware. PROM is programmed once, EPROM can be erased using ultraviolet light and EEPROM can be erased and rewritten electrically; modern firmware commonly uses flash memory.',
                examples: ['Boot firmware', 'Router firmware', 'Embedded-device control code'],
                examTip: 'ROM is non-volatile, but some ROM technologies can be deliberately reprogrammed.',
              },
              {
                name: 'Cache Memory',
                definition: 'Small high-speed memory that keeps recently or frequently used instructions and data close to CPU cores.',
                explanation: 'A cache hit avoids a slower RAM access, while a cache miss requires data from a lower level. Hardware manages several cache levels to reduce the average time the processor waits.',
                examples: ['L1 instruction cache', 'L1 data cache', 'Shared L3 cache'],
                examTip: 'Cache is faster and smaller than RAM; it is not a long-term file store.',
              },
              {
                name: 'Magnetic Storage',
                definition: 'Non-volatile storage representing data through magnetised regions.',
                explanation: 'Hard disks provide direct access using rotating platters and moving heads. Magnetic tape provides economical high-capacity sequential access for backup and archive but is slow when retrieving one item.',
                examples: ['Hard disk drive', 'Magnetic backup tape', 'Legacy floppy disk'],
                examTip: 'A hard disk is direct access; magnetic tape is sequential access.',
              },
              {
                name: 'Optical Storage',
                definition: 'Removable storage read or written by laser using physical or optical changes on a disc.',
                explanation: 'CD, DVD and Blu-ray formats differ in capacity and laser technology. Optical discs are portable and useful for distribution or archive, but drives are less common and performance is below modern SSDs.',
                examples: ['CD', 'DVD', 'Blu-ray Disc'],
                examTip: 'State whether the disc is read-only, recordable once or rewritable when relevant.',
              },
              {
                name: 'Solid-State Storage',
                definition: 'Non-volatile electronic storage using flash memory without moving mechanical parts.',
                explanation: 'SSDs, memory cards and USB flash drives offer fast access, silent operation and resistance to mechanical shock. Flash cells have limited write endurance and portable devices are easy to lose.',
                examples: ['Solid-state drive', 'USB flash drive', 'Memory card'],
                examTip: 'Solid state describes the technology; USB describes an interface used by some devices.',
              },
              {
                name: 'Storage Selection',
                definition: 'Choosing storage by matching technical properties to a purpose.',
                explanation: 'Capacity, access speed, transfer speed, reliability, endurance, portability, compatibility, security and total cost should be evaluated together. Important data also needs tested backup rather than one device only.',
                examples: ['SSD for operating-system speed', 'Tape for offline archive', 'Encrypted external drive for backup'],
                examTip: 'Give a reason linked to the scenario instead of saying one technology is always best.',
              },
            ]}
          />

          <div className="grid gap-4">
            {/* Primary Storage */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Primary Storage (Main Memory)</h4>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li><strong>RAM (Random Access Memory)</strong> – volatile, used to store programs and data currently in use. Size affects speed and multitasking.</li>
                <li><strong>ROM (Read Only Memory)</strong> – non‑volatile memory used for firmware and startup instructions.</li>
                <li><strong>Types of ROM:</strong> PROM (programmable once), EPROM (UV erasable), EEPROM (electrically erasable and rewritable).</li>
              </ul>
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                <strong>Volatile:</strong> loses data when power is off (RAM). <strong>Non‑volatile:</strong> retains data (ROM, secondary storage).
              </div>
            </div>

            {/* Secondary Storage */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Secondary Storage (Backing Storage)</h4>
              <p className="text-sm text-slate-700">Non‑volatile, used for long‑term storage. Includes:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-semibold">Magnetic</span>
                  <ul className="list-disc list-inside text-xs text-slate-600">
                    <li>Hard disk – high-capacity direct access</li>
                    <li>Magnetic tape – sequential backup/archive</li>
                    <li>Diskette and Zip disk – legacy removable media</li>
                  </ul>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-semibold">Optical</span>
                  <ul className="list-disc list-inside text-xs text-slate-600">
                    <li>CD – commonly about 700 MB</li>
                    <li>Single-layer DVD – commonly 4.7 GB</li>
                    <li>Blu-ray – higher-capacity optical format</li>
                  </ul>
                </div>
                <div className="p-2 bg-slate-50 rounded">
                  <span className="font-semibold">Solid State / Flash</span>
                  <ul className="list-disc list-inside text-xs text-slate-600">
                    <li>USB flash drive – portable and reusable</li>
                    <li>Memory card – used in cameras and mobile devices</li>
                    <li>SSD – fast, silent and without moving parts</li>
                  </ul>
                </div>
              </div>
              <LessonImage
                fileName="storage devices.png"
                alt="Examples of magnetic optical and solid-state storage devices"
                caption="Secondary storage includes magnetic, optical, and solid-state devices for keeping data long-term."
              />
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Data Access Methods</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Sequential access</strong> – data before the required item must be passed in order, as with magnetic tape.</li>
                <li><strong>Direct or random access</strong> – the device can move to a required address without reading every earlier item, as with HDDs, SSDs and optical discs.</li>
              </ul>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Storage Capacity Units</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Bit</strong> – 0 or 1</li>
                <li><strong>Nibble</strong> – 4 bits</li>
                <li><strong>Byte</strong> – 8 bits (one character)</li>
                <li><strong>Kilobyte (KB)</strong> – 1024 bytes</li>
                <li><strong>Megabyte (MB)</strong> – 1024 KB</li>
                <li><strong>Gigabyte (GB)</strong> – 1024 MB</li>
                <li><strong>Terabyte (TB)</strong> – 1024 GB</li>
              </ul>
              <figure className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
                <img
                  src={hardwareImages.storageHierarchy}
                  alt="Storage hierarchy from fast CPU registers to large secondary storage"
                  className="w-full"
                />
                <figcaption className="border-t border-blue-100 px-4 py-3 text-sm font-medium text-slate-600">
                  Higher levels are faster and smaller; lower levels provide more capacity at a lower cost per byte.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Storage Comparison</h3>
            <ul className="space-y-1 text-sm text-slate-600">
              <li><strong>RAM:</strong> fast, volatile, expensive</li>
              <li><strong>ROM:</strong> non‑volatile, fixed</li>
              <li><strong>HDD:</strong> large, cheap, mechanical</li>
              <li><strong>SSD:</strong> fast, quiet, expensive</li>
              <li><strong>CD/DVD:</strong> optical, portable</li>
              <li><strong>USB:</strong> portable, reusable</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: Factors to Consider When Purchasing Hardware',
    content: (
      <div className="space-y-6">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Key Considerations</h3>
          <ConceptExplainer
            title="Organisational Hardware-Purchasing Factors"
            introduction="An organisation should write measurable requirements, evaluate complete systems against realistic workloads and test critical equipment before accepting it."
            accent="amber"
            concepts={[
              {
                name: 'Volume and Growth of Data',
                definition: 'The present and expected amount of data to be captured, processed, transferred and retained.',
                explanation: 'Capacity planning must include working data, indexes, temporary files, backups and future growth. Large data volumes may require faster storage, more memory and stronger backup facilities.',
                examples: ['Daily sales records', 'Medical images', 'Several years of archived transactions'],
                examTip: 'Storage capacity and backup capacity are both required.',
              },
              {
                name: 'Number and Concurrency of Users',
                definition: 'How many people use the system and how many work at the same time.',
                explanation: 'Concurrent users create processor, RAM, storage, network and licence demand. Peak usage matters more than a simple total of registered users.',
                examples: ['One office worker', 'Thirty learners in a laboratory', 'Hundreds of simultaneous online customers'],
                examTip: 'Explain how simultaneous users affect shared resources.',
              },
              {
                name: 'User Locations and Connectivity',
                definition: 'Where users, servers, peripherals and data sources are physically situated.',
                explanation: 'One building may use a LAN, while branches and remote staff need reliable wide-area links, secure remote access and equipment appropriate to each site.',
                examples: ['Single classroom', 'Branches in several towns', 'Field workers using mobile connections'],
                examTip: 'Location changes network, portability and support requirements.',
              },
              {
                name: 'User Ability and Accessibility',
                definition: 'The technical skill, physical needs and working practices of intended users.',
                explanation: 'Public kiosks need simple durable controls; specialists may require precision devices; users with disabilities may need assistive input or output. Training needs affect the whole solution.',
                examples: ['Touchscreen public kiosk', 'Large-key keyboard', 'Screen reader and audio output'],
                examTip: 'Hardware should fit the user, not force every user into one design.',
              },
              {
                name: 'System Timing and Performance',
                definition: 'The required response time, throughput and availability for the workload.',
                explanation: 'Real-time control needs predictable immediate response, online services need acceptable interactive response and batch systems may prioritise total throughput over instant feedback.',
                examples: ['Factory safety controller', 'Online booking server', 'Overnight payroll processing'],
                examTip: 'Match performance to the processing type named in the scenario.',
              },
              {
                name: 'Input and Output Requirements',
                definition: 'The source data to capture and the forms in which results must be delivered.',
                explanation: 'Device choice depends on data type, volume, accuracy, environment and output audience. Automatic capture may reduce errors, while specialist output may require large format or accessibility tools.',
                examples: ['Barcode readers', 'Receipt printers', 'Large-format CAD plotter'],
                examTip: 'Name the data and required output, not only the device.',
              },
              {
                name: 'Security and Physical Environment',
                definition: 'Protection needs and the conditions in which equipment will operate.',
                explanation: 'Sensitive systems may require secure boot, encryption support and controlled access. Dust, heat, moisture, vibration, theft risk and unstable power may require rugged cases, cooling or backup power.',
                examples: ['Lockable server room', 'Uninterruptible power supply', 'Rugged field computer'],
                examTip: 'Security includes physical protection as well as passwords.',
              },
              {
                name: 'Software and Peripheral Compatibility',
                definition: 'Support for required operating systems, applications, drivers, interfaces and file formats.',
                explanation: 'Processor architecture, graphics capability and drivers must be checked with critical software and existing devices. A pilot prevents expensive incompatibility after full purchase.',
                examples: ['Database server requirement', 'Legacy laboratory instrument', 'Required printer driver'],
                examTip: 'Powerful hardware is still unsuitable if critical software cannot run.',
              },
              {
                name: 'Reliability and Continuity',
                definition: 'The ability to operate dependably and recover when a component fails.',
                explanation: 'Critical systems may need redundant power, storage, network links, spare equipment and tested recovery procedures. Availability targets should guide how much resilience is purchased.',
                examples: ['RAID storage', 'Backup Internet link', 'Spare point-of-sale terminal'],
                examTip: 'A backup copy protects data; redundancy can keep a service operating.',
              },
              {
                name: 'Cost, Support and Sustainability',
                definition: 'Purchase and lifetime costs together with maintainability and environmental impact.',
                explanation: 'Include energy, consumables, licences, repairs, downtime, training, upgrades and safe disposal. Warranty, supplier stability, repairability and energy efficiency affect long-term value.',
                examples: ['Printer consumables', 'Maintenance contract', 'Energy-efficient replaceable components'],
                examTip: 'Evaluate total cost of ownership rather than purchase price alone.',
              },
            ]}
          />
        </div>

        <div className="p-5 bg-amber-50 rounded-xl">
          <h4 className="font-bold text-amber-800">Summary</h4>
          <p className="text-amber-700">Always match hardware to the intended application, user environment, and future growth plans. Invest in quality where performance is critical.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="grid gap-6 md:grid-cols-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⌨️</span>
            <h4 className="text-lg font-bold text-blue-700">Input</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Keyboard, Mouse</li>
            <li>Scanner, Camera</li>
            <li>Microphone, Touch</li>
            <li>Barcode, OMR/OCR/MICR</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🖨️</span>
            <h4 className="text-lg font-bold text-blue-700">Output</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Printers (impact/non)</li>
            <li>Monitor (VDU)</li>
            <li>Plotter (CAD)</li>
            <li>Speakers</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-blue-700">Processing</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>CPU: ALU + CU + Registers</li>
            <li>Fetch‑Execute cycle</li>
            <li>Speed: MHz / GHz</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💾</span>
            <h4 className="text-lg font-bold text-blue-700">Storage</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Primary: RAM, ROM</li>
            <li>Secondary: HDD, SSD, CD, DVD</li>
            <li>USB, Tape</li>
          </ul>
        </div>

        <div className="md:col-span-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <h4 className="text-lg font-bold text-blue-700">Buying Factors</h4>
          </div>
          <p className="text-slate-700 mt-1">Consider data volume, users, location, security, software, budget – match to needs.</p>
        </div>
      </div>
    ),
  },
];

/* ---------- Components ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          type="button"
          aria-label="Scroll topics left"
          onClick={() => scroll('left')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
        >
          <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                activeId === s.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.title.replace(/^Part [A-E]: /, '')}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Scroll topics right"
          onClick={() => scroll('right')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
        >
          <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
    </div>
    <div className="prose prose-slate max-w-none">{section.content}</div>
  </section>
);

interface LearningOutcome2Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome2: React.FC<LearningOutcome2Props> = ({
  onNextTopic,
  nextTopicTitle = 'Next Topic',
}) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === active), 0);
  const activeSection = sections[activeIndex];
  const isLastChapter = activeIndex >= sections.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isLastChapter) {
      setActive(sections[activeIndex + 1].id);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNextTopic?.();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            COMPUTER HARDWARE
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Elements of a Computer
          </h1>
          <p className="text-lg text-amber-100 max-w-2xl leading-relaxed">
            Understand the physical components: Input, Output, Processing, and Storage devices – their functions,
            types, and how to choose them.
          </p>
        </div>
      </div>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-amber-600 to-orange-700 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-amber-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Input devices</strong> – keyboard, mouse, scanner, microphone, barcode reader, etc. – enter data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Output devices</strong> – printers, monitors, plotters – present data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">CPU</strong> – contains ALU, Control Unit, Registers; executes the fetch‑decode‑execute cycle.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Storage</strong> – Primary (RAM/ROM) is fast and volatile; Secondary (hard disks, CDs, USB) is non‑volatile and larger.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Purchasing factors</strong> – data volume, users, location, security, software, budget.</span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'Ready for the next section?' : `Chapter ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>
                In the next section, we will learn about <span className="text-blue-600">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-amber-700">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-amber-600 text-white rounded-full font-bold hover:bg-amber-700 transition-all shadow-lg shadow-amber-200 hover:shadow-amber-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export as LearningOutcome2
export default LearningOutcome2;

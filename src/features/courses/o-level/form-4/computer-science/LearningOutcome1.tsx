import React, { useState, useRef } from 'react';
import ConceptExplainer from './ConceptExplainer';
import ProsConsComparison from './ProsConsComparison';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Data Processing Cycle
const dataProcessingCycleSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" role="img" aria-labelledby="dpc-title dpc-desc">
  <title id="dpc-title">Data processing cycle</title>
  <desc id="dpc-desc">Raw data enters through input, the CPU processes it, useful information is produced as output, and data or results may be stored.</desc>
  <defs>
    <linearGradient id="dpc-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <linearGradient id="dpc-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#0ea5e9"/></linearGradient>
    <filter id="dpc-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="dpc-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker>
    <marker id="dpc-arrow-both" markerWidth="12" markerHeight="12" refX="6" refY="6" orient="auto-start-reverse"><path d="M1 1l10 5-10 5z" fill="#7c3aed"/></marker>
  </defs>
  <rect width="900" height="480" rx="28" fill="url(#dpc-bg)"/>
  <text x="450" y="53" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800" fill="#0f172a">Data Processing Cycle</text>
  <text x="450" y="80" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">A computer converts raw facts into useful information</text>

  <path d="M280 205h65M555 205h65" stroke="#2563eb" stroke-width="6" stroke-linecap="round" marker-end="url(#dpc-arrow)"/>
  <g filter="url(#dpc-shadow)">
    <rect x="70" y="125" width="210" height="160" rx="24" fill="#fff" stroke="#bfdbfe" stroke-width="2"/>
    <circle cx="112" cy="168" r="25" fill="#dbeafe"/><path d="M100 157h24v19h-24zM106 181h12" fill="none" stroke="#2563eb" stroke-width="3" stroke-linecap="round"/>
    <text x="150" y="170" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="800" fill="#1d4ed8">1. INPUT</text>
    <text x="95" y="220" font-family="Inter,Arial,sans-serif" font-size="15" fill="#334155">Raw data and instructions</text>
    <text x="95" y="245" font-family="Inter,Arial,sans-serif" font-size="13" fill="#64748b">Keyboard • scanner • sensor</text>

    <rect x="345" y="125" width="210" height="160" rx="24" fill="url(#dpc-blue)"/>
    <circle cx="387" cy="168" r="25" fill="#fff" fill-opacity=".2"/><path d="M375 156h24v24h-24zM381 150v6M393 150v6M381 180v6M393 180v6M369 162h6M369 174h6M399 162h6M399 174h6" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <text x="425" y="170" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="800" fill="#fff">2. PROCESS</text>
    <text x="370" y="220" font-family="Inter,Arial,sans-serif" font-size="15" fill="#eff6ff">CPU follows program instructions</text>
    <text x="370" y="245" font-family="Inter,Arial,sans-serif" font-size="13" fill="#dbeafe">Calculate • sort • compare</text>

    <rect x="620" y="125" width="210" height="160" rx="24" fill="#fff" stroke="#a7f3d0" stroke-width="2"/>
    <circle cx="662" cy="168" r="25" fill="#d1fae5"/><path d="M650 156h24v17h-24zM656 178h12" fill="none" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
    <text x="700" y="170" font-family="Inter,Arial,sans-serif" font-size="23" font-weight="800" fill="#047857">3. OUTPUT</text>
    <text x="645" y="220" font-family="Inter,Arial,sans-serif" font-size="15" fill="#334155">Meaningful information</text>
    <text x="645" y="245" font-family="Inter,Arial,sans-serif" font-size="13" fill="#64748b">Screen • printer • speaker</text>

    <rect x="285" y="355" width="330" height="82" rx="22" fill="#fff" stroke="#ddd6fe" stroke-width="2"/>
    <circle cx="330" cy="396" r="24" fill="#ede9fe"/><path d="M318 384h24v24h-24zM318 392h24" fill="none" stroke="#7c3aed" stroke-width="3"/>
    <text x="370" y="393" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="800" fill="#6d28d9">STORAGE</text>
    <text x="370" y="416" font-family="Inter,Arial,sans-serif" font-size="13" fill="#64748b">Keeps input, programs and results for later use</text>
  </g>
  <path d="M450 285v70" stroke="#7c3aed" stroke-width="5" marker-start="url(#dpc-arrow-both)" marker-end="url(#dpc-arrow-both)"/>
</svg>
`;

// Computer Generations timeline (simplified)
const generationsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 460" role="img" aria-labelledby="gen-title gen-desc">
  <title id="gen-title">Five generations of computers</title>
  <desc id="gen-desc">A timeline shows the defining electronic technology of each computer generation, from vacuum tubes to artificial intelligence.</desc>
  <defs>
    <linearGradient id="gen-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eef2ff"/></linearGradient>
    <linearGradient id="gen-line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f97316"/><stop offset=".5" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
    <filter id="gen-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="460" rx="28" fill="url(#gen-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800" fill="#0f172a">Evolution of Computer Technology</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Each generation improved speed, size, reliability, cost and capability</text>
  <path d="M95 225H805" stroke="url(#gen-line)" stroke-width="8" stroke-linecap="round"/>
  <g font-family="Inter,Arial,sans-serif" filter="url(#gen-shadow)">
    <g><rect x="40" y="105" width="150" height="96" rx="18" fill="#fff"/><circle cx="115" cy="225" r="18" fill="#f97316" stroke="#fff" stroke-width="6"/><text x="61" y="135" font-size="12" font-weight="800" fill="#c2410c">1ST GENERATION</text><text x="61" y="161" font-size="18" font-weight="800" fill="#0f172a">Vacuum tubes</text><text x="61" y="184" font-size="12" fill="#64748b">1940s–mid 1950s</text></g>
    <g><rect x="208" y="250" width="150" height="96" rx="18" fill="#fff"/><circle cx="283" cy="225" r="18" fill="#eab308" stroke="#fff" stroke-width="6"/><text x="229" y="280" font-size="12" font-weight="800" fill="#a16207">2ND GENERATION</text><text x="229" y="306" font-size="18" font-weight="800" fill="#0f172a">Transistors</text><text x="229" y="329" font-size="12" fill="#64748b">mid 1950s–mid 1960s</text></g>
    <g><rect x="375" y="105" width="150" height="96" rx="18" fill="#fff"/><circle cx="450" cy="225" r="18" fill="#2563eb" stroke="#fff" stroke-width="6"/><text x="396" y="135" font-size="12" font-weight="800" fill="#1d4ed8">3RD GENERATION</text><text x="396" y="161" font-size="18" font-weight="800" fill="#0f172a">Integrated circuits</text><text x="396" y="184" font-size="12" fill="#64748b">mid 1960s–1970s</text></g>
    <g><rect x="542" y="250" width="150" height="96" rx="18" fill="#fff"/><circle cx="617" cy="225" r="18" fill="#0891b2" stroke="#fff" stroke-width="6"/><text x="563" y="280" font-size="12" font-weight="800" fill="#0e7490">4TH GENERATION</text><text x="563" y="306" font-size="18" font-weight="800" fill="#0f172a">Microprocessors</text><text x="563" y="329" font-size="12" fill="#64748b">1970s–present</text></g>
    <g><rect x="710" y="105" width="150" height="96" rx="18" fill="#fff"/><circle cx="785" cy="225" r="18" fill="#7c3aed" stroke="#fff" stroke-width="6"/><text x="731" y="135" font-size="12" font-weight="800" fill="#6d28d9">5TH GENERATION</text><text x="731" y="161" font-size="18" font-weight="800" fill="#0f172a">AI systems</text><text x="731" y="184" font-size="12" fill="#64748b">present &amp; developing</text></g>
  </g>
  <rect x="150" y="386" width="600" height="42" rx="21" fill="#172554"/>
  <text x="450" y="412" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="#dbeafe">ROOM-SIZED &amp; EXPENSIVE  →  SMALLER, FASTER, CHEAPER &amp; MORE INTELLIGENT</text>
</svg>
`;

// Types of computers (icons)
const typesOfComputersSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 480" role="img" aria-labelledby="types-title types-desc">
  <title id="types-title">Types of computers</title>
  <desc id="types-desc">Five cards compare microcomputers, minicomputers, mainframes, supercomputers and embedded computers by users, power and purpose.</desc>
  <defs>
    <linearGradient id="types-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <filter id="types-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="480" rx="28" fill="url(#types-bg)"/>
  <text x="450" y="52" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="800" fill="#0f172a">Computer Categories</text>
  <text x="450" y="79" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Classified by processing power, number of users and intended purpose</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#types-shadow)">
    <g><rect x="45" y="118" width="250" height="135" rx="22" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><circle cx="88" cy="160" r="24" fill="#dbeafe"/><path d="M76 149h24v18H76zM82 172h12" fill="none" stroke="#2563eb" stroke-width="3"/><text x="126" y="156" font-size="21" font-weight="800" fill="#1d4ed8">Microcomputer</text><text x="70" y="202" font-size="14" fill="#334155">Usually one user</text><text x="70" y="227" font-size="13" fill="#64748b">Desktop • laptop • tablet</text></g>
    <g><rect x="325" y="118" width="250" height="135" rx="22" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><circle cx="368" cy="160" r="24" fill="#ede9fe"/><path d="M356 149h24v22H356zM360 155h16M360 162h16" fill="none" stroke="#7c3aed" stroke-width="3"/><text x="406" y="156" font-size="21" font-weight="800" fill="#6d28d9">Minicomputer</text><text x="350" y="202" font-size="14" fill="#334155">Departmental multi-user system</text><text x="350" y="227" font-size="13" fill="#64748b">Mid-range business processing</text></g>
    <g><rect x="605" y="118" width="250" height="135" rx="22" fill="#fff" stroke="#bae6fd" stroke-width="2"/><circle cx="648" cy="160" r="24" fill="#e0f2fe"/><path d="M636 148h24v25h-24zM640 154h16M640 162h16" fill="none" stroke="#0891b2" stroke-width="3"/><text x="686" y="156" font-size="21" font-weight="800" fill="#0e7490">Mainframe</text><text x="630" y="202" font-size="14" fill="#334155">Thousands of users/transactions</text><text x="630" y="227" font-size="13" fill="#64748b">Banks • airlines • government</text></g>
    <g><rect x="185" y="287" width="250" height="135" rx="22" fill="#fff" stroke="#fed7aa" stroke-width="2"/><circle cx="228" cy="329" r="24" fill="#ffedd5"/><path d="M216 317h24v24h-24zM222 311v6M234 311v6M222 341v6M234 341v6" fill="none" stroke="#ea580c" stroke-width="3"/><text x="266" y="325" font-size="21" font-weight="800" fill="#c2410c">Supercomputer</text><text x="210" y="371" font-size="14" fill="#334155">Massive parallel calculations</text><text x="210" y="396" font-size="13" fill="#64748b">Science • weather • simulation</text></g>
    <g><rect x="465" y="287" width="250" height="135" rx="22" fill="#fff" stroke="#a7f3d0" stroke-width="2"/><circle cx="508" cy="329" r="24" fill="#d1fae5"/><path d="M496 317h24v24h-24zM502 323h12M502 331h12" fill="none" stroke="#059669" stroke-width="3"/><text x="546" y="325" font-size="21" font-weight="800" fill="#047857">Embedded</text><text x="490" y="371" font-size="14" fill="#334155">Dedicated controller inside a device</text><text x="490" y="396" font-size="13" fill="#64748b">Cars • appliances • cameras</text></g>
  </g>
</svg>
`;

const computerImages = {
  dataProcessingCycle: svgToDataUri(dataProcessingCycleSvg),
  generations: svgToDataUri(generationsSvg),
  typesOfComputers: svgToDataUri(typesOfComputersSvg),
};

const LESSON_IMAGE_BASE =
  '/images/courses/o-level/computer-science/learning-outcome-1';

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LessonImageProps {
  fileName: string;
  alt: string;
  caption: string;
  className?: string;
}

const LessonImage: React.FC<LessonImageProps> = ({
  fileName,
  alt,
  caption,
  className = 'aspect-video w-full object-cover',
}) => {
  const [isMissing, setIsMissing] = useState(false);

  return (
    <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {isMissing ? (
        <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
            Image ready to add
          </p>
          <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
            {fileName}
          </code>
          <p className="mt-3 text-xs text-slate-500">
            Place this file in the Learning Outcome 1 image folder.
          </p>
        </div>
      ) : (
        <img
          src={`${LESSON_IMAGE_BASE}/${fileName}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={className}
          onError={() => setIsMissing(true)}
        />
      )}
      <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
};

const sections: TopicSection[] = [
  {
    id: 'part-a',
    title: 'Part A: Data and Information',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-8">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-xl font-bold text-blue-700">What is a Computer?</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              A computer is an <strong>electronic device</strong> that works under the control of stored programs
              to automatically accept, store, and process data into information.
            </p>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li><strong>Electronic</strong> – works only when electricity is available.</li>
              <li><strong>Device</strong> – a machine.</li>
              <li><strong>Controlled by programs</strong> – follows instructions written in computer language.</li>
              <li><strong>Automatic</strong> – can operate with minimum human intervention.</li>
              <li><strong>Accepts data</strong> – data can be entered through various means.</li>
              <li><strong>Stores data & programs</strong> – for future use.</li>
              <li><strong>Processes data into information</strong> – meaningful output.</li>
            </ul>
            <div className="not-prose mt-6">
              <LessonImage
                fileName="01-modern-computer-system-components.png"
                alt="A realistic desktop computer workstation with labelled hardware represented visually"
                caption="A complete computer system combines physical hardware, software, input, processing, storage, and output."
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
              Data vs Information
            </h3>
            <div className="grid gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-bold text-slate-800">Data</h4>
                <p className="text-slate-700">Raw facts and figures (e.g., list of numbers, names). It is meaningless and cannot be used for decision‑making.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-bold text-slate-800">Information</h4>
                <p className="text-slate-700">Data that has been processed into a meaningful form. It can be understood and used for decision‑making.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-bold text-slate-800">GIGO (Garbage‑In, Garbage‑Out)</h4>
                <p className="text-slate-700">If you enter incorrect data (garbage), the output will also be incorrect. Accuracy of results depends on accurate input.</p>
              </div>
            </div>
            <div className="mt-5">
              <LessonImage
                fileName="02-data-to-information-school-results.png"
                alt="A teacher converting raw student marks into an organised digital report"
                caption="Raw marks are data; totals, averages, grades, and charts produced from them are information."
              />
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <img
                src={computerImages.dataProcessingCycle}
                alt="Data Processing Cycle"
                className="w-full rounded-xl"
              />
            </div>
            <div className="mt-5">
              <LessonImage
                fileName="03-data-processing-cycle-office.png"
                alt="A realistic office example of data moving through input processing storage and output"
                caption="A real-world data processing cycle: enter data, process it, store it, and present useful output."
              />
            </div>
          </div>

          <ConceptExplainer
            title="The Data-Processing Cycle Explained"
            introduction="A useful computer system repeatedly accepts data, transforms it according to instructions, presents information and keeps what will be needed later. The stages are connected: output from one cycle may become input to another."
            accent="blue"
            concepts={[
              {
                name: 'Input',
                definition: 'The capture and entry of raw data and instructions into a computer system.',
                explanation: 'Input may be entered manually by a person, captured automatically by a sensor or received from another system. Validation should be applied as early as possible because inaccurate input can make every later stage unreliable.',
                examples: ['Typing student marks', 'Scanning a product barcode', 'A temperature sensor sending a reading'],
                examTip: 'Name both the input data and the device or source that captures it.',
              },
              {
                name: 'Processing',
                definition: 'The manipulation of data according to a program so that it becomes useful.',
                explanation: 'Processing includes calculating, comparing, classifying, sorting, searching, summarising and updating. The same data can produce different information when a different rule or purpose is applied.',
                examples: ['Calculating a class average', 'Sorting names alphabetically', 'Comparing stock with a reorder level'],
                examTip: 'Describe the actual operation; “the computer processes it” is too vague.',
              },
              {
                name: 'Output',
                definition: 'Information produced by the system and communicated to a user or another device.',
                explanation: 'Output should be relevant, accurate, understandable and delivered in an appropriate form. It can be visual, printed, audible or a control signal sent to an actuator.',
                examples: ['A printed school report', 'A chart displayed on screen', 'An alarm activated by a high reading'],
                examTip: 'State the output form and who or what uses it.',
              },
              {
                name: 'Storage',
                definition: 'Keeping data, programs or information so they can be retrieved in the future.',
                explanation: 'Temporary working data may be held in main memory, while long-term records are saved to secondary storage. Stored results can provide evidence, support future decisions or become input to the next processing cycle.',
                examples: ['Saving marks in a database', 'Keeping a backup on external storage', 'Storing a customer receipt in an account history'],
                examTip: 'Do not confuse volatile working memory with permanent backing storage.',
              },
              {
                name: 'Information Quality and GIGO',
                definition: 'Information quality describes whether output is accurate, complete, relevant, timely and understandable.',
                explanation: 'GIGO means incorrect, incomplete or unsuitable input and rules produce unreliable output. A computer can process bad data perfectly without knowing that the result is misleading, so validation, verification and sensible procedures remain essential.',
                examples: ['Wrong birth date gives a wrong age', 'Missing sales records give a low total', 'Outdated prices produce an incorrect invoice'],
                examTip: 'GIGO concerns bad input or rules; it does not mean the processor made a random arithmetic mistake.',
              },
            ]}
          />
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Key Terms</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>Data</strong> – raw facts</li>
              <li><strong>Information</strong> – processed data</li>
              <li><strong>Processing</strong> – converting data to information</li>
              <li><strong>GIGO</strong> – quality of output depends on input</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Computer Generations',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Computer generations are broad stages identified mainly by the dominant electronic technology used to
              build processors and memory. Their dates overlap, so the component technology is a more reliable
              classification clue than memorising an exact year.
            </p>
          </div>

          <div className="grid gap-4">
            {[
              {
                gen: 'First Generation (mid-1940s–mid-1950s)',
                tech: 'Vacuum tubes',
                features: 'Room-sized machines used thousands of vacuum tubes, consumed large amounts of electricity and produced significant heat. They were programmed in machine language. Examples include ENIAC, EDVAC and UNIVAC I.',
                image: '04-first-generation-vacuum-tube-computer.png',
                imageAlt: 'A realistic 1940s room-sized first-generation vacuum tube computer',
              },
              {
                gen: 'Second Generation (mid-1950s–mid-1960s)',
                tech: 'Transistors',
                features: 'Transistors replaced many vacuum tubes, reducing size, power use and heat while improving reliability. Assembly and early high-level languages became more practical.',
                image: '05-second-generation-transistor-computer.png',
                imageAlt: 'A realistic late-1950s transistor computer installation',
              },
              {
                gen: 'Third Generation (mid-1960s–early 1970s)',
                tech: 'Integrated Circuits (ICs)',
                features: 'Integrated circuits placed several electronic components on one silicon chip. Operating systems, multiprogramming and terminals developed while cost per calculation fell.',
                image: '06-third-generation-integrated-circuit-computer.png',
                imageAlt: 'A realistic 1960s third-generation integrated-circuit computer',
              },
              {
                gen: 'Fourth Generation (early 1970s–present)',
                tech: 'Microprocessors',
                features: 'A complete CPU was placed on one or a few chips. Very-large-scale integration enabled affordable personal computers, portable devices and increasingly powerful servers.',
                image: '07-fourth-generation-microprocessor-computers.png',
                imageAlt: 'A realistic 1980s personal computer built around a microprocessor',
              },
              {
                gen: 'Fifth Generation (current and emerging)',
                tech: 'Artificial intelligence and highly parallel processing',
                features: 'This label describes the continuing goal of systems that learn, reason, recognise language or images and solve knowledge-intensive problems. It overlaps with fourth-generation microprocessor hardware.',
                image: '08-fifth-generation-ai-computing.png',
                imageAlt: 'A realistic modern artificial intelligence computing laboratory',
              },
            ].map((item) => (
              <div key={item.gen} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h4 className="font-bold text-blue-700">{item.gen}</h4>
                <p className="text-sm text-slate-600"><span className="font-semibold">Technology:</span> {item.tech}</p>
                <p className="text-sm text-slate-700 mt-1">{item.features}</p>
                <div className="mt-4">
                  <LessonImage
                    fileName={item.image}
                    alt={item.imageAlt}
                    caption={`${item.gen}: ${item.tech}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <ConceptExplainer
            title="How Each Generation Changed Computing"
            introduction="Each generation solved important limitations of the previous one. Compare the switching technology, physical effect, programming approach and typical systems."
            accent="blue"
            concepts={[
              {
                name: 'First Generation: Vacuum Tubes',
                definition: 'Electronic switches were made from fragile glass vacuum tubes.',
                explanation: 'Thousands of tubes represented and controlled binary signals. Frequent tube failures, heat and high electricity use made operation costly, while machine-language programming tied programs closely to the hardware.',
                examples: ['ENIAC', 'EDVAC', 'UNIVAC I'],
                examTip: 'Link first generation with vacuum tubes, machine code, great size, heat and limited reliability.',
              },
              {
                name: 'Second Generation: Transistors',
                definition: 'Small semiconductor transistors replaced bulky vacuum-tube switches.',
                explanation: 'Transistors switched faster, lasted longer and needed less power. Magnetic-core memory, assembly language and high-level languages such as FORTRAN and COBOL supported more dependable scientific and business processing.',
                examples: ['IBM 1401', 'IBM 7090', 'PDP-1'],
                examTip: 'The key innovation is the transistor—not simply that computers became smaller.',
              },
              {
                name: 'Third Generation: Integrated Circuits',
                definition: 'Several transistors and related components were manufactured together on one chip.',
                explanation: 'Integration shortened electrical paths, increased reliability and reduced cost. Operating systems could manage several jobs, and keyboard-and-monitor terminals improved interaction compared with punched-card-only operation.',
                examples: ['IBM System/360', 'PDP-8', 'ICL 1900 series'],
                examTip: 'Distinguish an integrated circuit containing several components from a later single-chip CPU.',
              },
              {
                name: 'Fourth Generation: Microprocessors',
                definition: 'The CPU was integrated onto a microprocessor chip using large-scale integration.',
                explanation: 'Microprocessors enabled personal computers, embedded controllers and portable devices. Continued increases in transistor density, memory and networking expanded computing without creating a completely new generation for every chip improvement.',
                examples: ['IBM Personal Computer', 'Apple Macintosh', 'Microcontroller-based appliances'],
                examTip: 'A microprocessor is a CPU on a chip; a microcomputer is a complete computer built around one.',
              },
              {
                name: 'Fifth Generation: Intelligent Systems',
                definition: 'A broad, partly aspirational category focused on artificial intelligence and natural interaction.',
                explanation: 'Machine learning, expert systems, speech recognition and parallel hardware allow systems to perform tasks associated with human expertise. These systems still run on electronic processors and do not possess unlimited human understanding.',
                examples: ['Medical expert system', 'Speech-recognition assistant', 'Machine-vision robot'],
                examTip: 'Describe a specific intelligent capability instead of claiming that every modern computer “thinks like a human.”',
              },
            ]}
          />

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <img
              src={computerImages.generations}
              alt="Computer Generations Timeline"
              className="w-full rounded-xl"
            />
          </div>
          <LessonImage
            fileName="09-computer-generations-comparison.png"
            alt="A realistic side-by-side comparison of all five computer generations"
            caption="From room-sized vacuum-tube machines to compact, powerful AI computing systems."
          />
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Generation Snapshot</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>1st:</strong> Valves – huge, slow</li>
              <li><strong>2nd:</strong> Transistors – smaller, faster</li>
              <li><strong>3rd:</strong> ICs – cheap, powerful</li>
              <li><strong>4th:</strong> Microprocessors – miniaturised</li>
              <li><strong>5th:</strong> AI – intelligent systems</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Types of Computers',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <p className="text-lg text-slate-700 leading-relaxed">
            Computers can be classified by size, power, and purpose. The main categories are micro, mini, mainframe, super, and embedded computers.
          </p>

          <ConceptExplainer
            title="Computer Categories Explained"
            introduction="Size alone is not enough to classify a computer. Consider processing workload, number of simultaneous users, reliability, cost and purpose. Modern categories can overlap as technology changes."
            accent="blue"
            concepts={[
              {
                name: 'Microcomputer',
                definition: 'A complete computer built around a microprocessor and normally intended for one primary user.',
                explanation: 'Microcomputers range from desktop systems to portable devices. They run general-purpose applications and can join networks, while performance varies from basic educational machines to powerful engineering workstations.',
                examples: ['Desktop PC', 'Laptop computer', 'Tablet computer'],
                examTip: '“Micro” describes the microprocessor-based category, not necessarily a physically tiny device.',
              },
              {
                name: 'Minicomputer or Midrange System',
                definition: 'A multi-user computer historically positioned between a microcomputer and a mainframe.',
                explanation: 'Minicomputers served departments, laboratories and medium organisations through several terminals. The historical term is now often replaced by midrange server because modern servers perform similar shared workloads.',
                examples: ['DEC PDP-11', 'DEC VAX', 'IBM AS/400 midrange system'],
                examTip: 'Emphasise several simultaneous users and departmental work rather than personal use.',
              },
              {
                name: 'Mainframe Computer',
                definition: 'A highly reliable enterprise computer designed for enormous transaction and input/output workloads.',
                explanation: 'Mainframes prioritise security, availability and processing thousands of concurrent jobs or users. Their strength is dependable bulk transaction processing rather than only raw calculation speed.',
                examples: ['National census processing', 'Core banking transactions', 'Airline reservation processing'],
                examTip: 'Mainframe means high-volume reliable transactions; it is not simply another name for a supercomputer.',
              },
              {
                name: 'Supercomputer',
                definition: 'A computing system designed to perform extremely large scientific calculations at very high speed.',
                explanation: 'Many processors work in parallel on mathematical models. Performance is applied to simulations whose calculations would take ordinary computers too long, often requiring specialised cooling and facilities.',
                examples: ['Weather and climate modelling', 'Molecular simulation', 'Aircraft aerodynamic modelling'],
                examTip: 'Look for complex numerical simulation and parallel calculation, not ordinary business records.',
              },
              {
                name: 'Embedded Computer',
                definition: 'A computer built inside a larger product to monitor or control a dedicated function.',
                explanation: 'Its processor, memory and software are chosen for a narrow task, often with real-time deadlines and limited power. Users may never see a normal keyboard, desktop or operating-system interface.',
                examples: ['Washing-machine controller', 'Vehicle engine-control unit', 'Digital thermostat'],
                examTip: 'Name the host device and the specific function the hidden controller performs.',
              },
            ]}
          />

          <div className="grid gap-4">
            {/* Micro */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-bold text-blue-700">Microcomputers</h4>
              <p className="text-slate-700">Computers with a microprocessor. They include:</p>
              <ul className="list-disc list-inside text-slate-700 ml-4 space-y-1 mt-1">
                <li><strong>Desktop</strong> – separate CPU and monitor, used on a desk.</li>
                <li><strong>Laptop/Notebook</strong> – portable, battery‑powered, fits on lap.</li>
                <li><strong>Palmtop/PDA</strong> – fits in the palm, used as diaries or small business tools.</li>
                <li><strong>Tablet PC</strong> – notebook with touch screen and electronic pen input.</li>
              </ul>
              <div className="mt-4">
                <ProsConsComparison
                  title="Microcomputer Advantages and Disadvantages"
                  advantages={[
                    'Affordable compared with larger multi-user computer systems.',
                    'Compact enough for homes, classrooms, and small offices.',
                    'Portable models allow work and learning from different locations.',
                    'Easy-to-use operating systems support non-specialist users.',
                    'Runs a wide range of general-purpose applications.',
                    'Stores large amounts of personal, school, or business data.',
                    'Connects easily to local networks and the Internet.',
                    'Supports fast communication through email, messaging, and video calls.',
                    'Can connect to many peripherals such as printers and scanners.',
                    'Can be upgraded or customised on many desktop models.',
                  ]}
                  disadvantages={[
                    'Portable devices can be lost or stolen easily.',
                    'Malware and online attacks can compromise files and accounts.',
                    'Hardware, software, repairs, and upgrades create ongoing costs.',
                    'Laptops and tablets depend on batteries that degrade over time.',
                    'Small devices provide less processing power than high-end servers or supercomputers.',
                    'Some compact models have limited ports and upgrade options.',
                    'User mistakes can delete or corrupt important information.',
                    'Long periods of use may contribute to eye strain, RSI, and poor posture.',
                    'Internet access and electricity may be required for important services.',
                    'Older devices and accessories create electronic waste when replaced.',
                  ]}
                />
              </div>
              <div className="mt-4">
                <LessonImage
                  fileName="10-microcomputers-desktop-laptop-tablet.png"
                  alt="A realistic desktop computer laptop tablet and handheld computer together"
                  caption="Microcomputers are designed mainly for individual users and include desktops, laptops, tablets, and handheld devices."
                />
              </div>
            </div>

            {/* Mini */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-bold text-blue-700">Mini‑Computers</h4>
              <p className="text-slate-700">Mid‑range computers, more powerful than micros but less than mainframes. Used in banks, businesses, and large organisations.</p>
              <div className="mt-4">
                <LessonImage
                  fileName="11-minicomputer-midrange-system.png"
                  alt="A realistic historical midrange minicomputer system serving several terminals"
                  caption="A minicomputer is a mid-range multi-user system, historically used by departments and medium-sized organisations."
                />
              </div>
            </div>

            {/* Mainframe */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-bold text-blue-700">Mainframe Computers</h4>
              <p className="text-slate-700">Very large, fast, with massive memory. Used for bulk data processing (census, financial transactions, industry statistics).</p>
              <div className="mt-4">
                <LessonImage
                  fileName="12-mainframe-data-centre.png"
                  alt="A realistic enterprise mainframe computer in a secure data centre"
                  caption="Mainframes process enormous numbers of reliable transactions for banks, governments, airlines, and other large organisations."
                />
              </div>
            </div>

            {/* Super */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-bold text-blue-700">Super Computers</h4>
              <p className="text-slate-700">The fastest and most expensive. Used for complex calculations (modelling aircraft wings, testing bombs, weather forecasting).</p>
              <div className="mt-4">
                <LessonImage
                  fileName="13-supercomputer-facility.png"
                  alt="A realistic modern supercomputer installation with many interconnected cabinets"
                  caption="Supercomputers combine thousands of processors to solve highly complex scientific and engineering problems."
                />
              </div>
            </div>

            {/* Embedded */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h4 className="font-bold text-blue-700">Embedded Computers</h4>
              <p className="text-slate-700">Microprocessors inside non‑computer devices (cameras, washing machines, fridges, TVs, cars). They are dedicated to specific tasks.</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div><strong>Camera:</strong> auto‑focus, light adjustment</div>
                <div><strong>Washing machine:</strong> water level, wash speed, temperature</div>
                <div><strong>Fridge:</strong> temperature control, display</div>
                <div><strong>Speed cameras:</strong> record speed, take photos, store data</div>
              </div>
              <div className="mt-4">
                <LessonImage
                  fileName="14-embedded-computers-everyday-devices.png"
                  alt="Realistic household and vehicle devices containing embedded computer controllers"
                  caption="Embedded computers are hidden inside everyday devices and are programmed to control a specific task."
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <img
              src={computerImages.typesOfComputers}
              alt="Types of Computers"
              className="w-full rounded-xl"
            />
          </div>
          <LessonImage
            fileName="15-computer-types-comparison.png"
            alt="A realistic scale comparison of microcomputer minicomputer mainframe supercomputer and embedded computer"
            caption="Computer categories differ in physical scale, processing power, number of users, cost, and purpose."
          />
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Classification by Purpose</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><strong>General purpose</strong> – many tasks (e.g., PC)</li>
              <li><strong>Special purpose</strong> – one task (e.g., patient monitor)</li>
              <li><strong>Analogue</strong> – continuous data</li>
              <li><strong>Digital</strong> – discrete values (0s and 1s)</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Advantages and Disadvantages of Computers',
    content: (
      <div className="space-y-8">
        <ProsConsComparison
          title="Computer Advantages and Disadvantages"
          advantages={[
            'Speed: computers process very large volumes of data in a short time.',
            'Accuracy: correct programs and input produce highly precise results.',
            'Reliability: computers repeat tasks consistently without becoming tired.',
            'Storage: large quantities of data can be kept in a small physical space.',
            'Automation: programmed tasks can run with little human intervention.',
            'Productivity: people can complete calculations, documents, and designs faster.',
            'Communication: networks enable rapid email, messaging, and video collaboration.',
            'Availability: automated systems can provide services throughout the day and night.',
            'Quality control: computer-controlled production can create consistent products.',
            'New opportunities: computing creates careers, services, research, and new businesses.',
          ]}
          disadvantages={[
            'Health problems: poor computer use can contribute to RSI, eye strain, and back pain.',
            'Cybercrime: systems may be targeted by fraud, hacking, malware, and identity theft.',
            'Job displacement: automation can reduce demand for some repetitive occupations.',
            'Purchase and maintenance costs: equipment, licences, repairs, and security can be expensive.',
            'Power dependence: most systems stop when electricity or backup power is unavailable.',
            'Data loss: hardware failure, mistakes, or malware can destroy information without backups.',
            'Privacy risks: personal data can be collected, copied, or disclosed without permission.',
            'Overdependence: organisations may struggle to operate when computer systems fail.',
            'Digital divide: people without devices, connectivity, or skills may be excluded.',
            'Environmental impact: manufacturing, energy use, and electronic waste affect the environment.',
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <LessonImage
              fileName="16-computer-benefits-education-business.png"
              alt="Realistic students and professionals benefiting from computers in education and business"
              caption="Computers improve speed, accuracy, communication, learning, storage, and productivity."
            />
          </div>
          <div>
            <LessonImage
              fileName="17-computer-risks-health-cybersecurity.png"
              alt="A realistic split scene showing poor computer posture eye strain and a cybersecurity threat"
              caption="Unsafe or irresponsible computer use can cause health, privacy, security, employment, and financial problems."
            />
          </div>
        </div>

        <ConceptExplainer
          title="Computer Misuse, Ownership and Responsible Use"
          introduction="Computer disadvantages are reduced through lawful behaviour, security controls, backups, ergonomic practice and informed users. The following terms describe different risks and responsibilities."
          accent="blue"
          concepts={[
            {
              name: 'Cybercrime',
              definition: 'Illegal activity in which a computer, network or digital data is the target, tool or evidence.',
              explanation: 'Cybercrime includes stealing information, deceiving users, damaging services and obtaining money unlawfully. Security incidents should be preserved as evidence and reported through the organisation’s approved procedure.',
              examples: ['Online banking fraud', 'Ransomware attack', 'Identity theft using stolen records'],
              examTip: 'State the unlawful action and its effect rather than calling every computer fault a cybercrime.',
            },
            {
              name: 'Unauthorised Access',
              definition: 'Entering or using an account, device, file or network without permission.',
              explanation: 'An intruder may guess credentials, exploit a vulnerability or misuse someone else’s logged-in session. Strong authentication, least-privilege permissions, updates and audit logs reduce the risk.',
              examples: ['Using another learner’s password', 'Entering a restricted payroll folder', 'Breaking into a remote server'],
              examTip: 'Authorisation concerns permission; knowing a password does not automatically make access authorised.',
            },
            {
              name: 'Software Piracy',
              definition: 'Copying, installing, distributing or selling software in breach of its copyright licence.',
              explanation: 'Buying one licence does not always permit unlimited installations. Pirated copies deny creators lawful payment and may contain malware or lack security updates and support.',
              examples: ['Sharing an unlicensed installer', 'Using one personal licence on many business computers', 'Selling counterfeit software copies'],
              examTip: 'Piracy is an intellectual-property and licensing issue, even when no physical item is stolen.',
            },
            {
              name: 'Copyright',
              definition: 'Legal protection given to original creative works, including software, text, images, music and video.',
              explanation: 'The owner controls copying, adaptation and distribution subject to licences and lawful exceptions. Users should check permissions, acknowledge sources and use original, licensed or openly licensed material correctly.',
              examples: ['Source code', 'Digital photograph', 'Educational video'],
              examTip: 'Owning a copy of a file is different from owning the copyright in the work.',
            },
          ]}
        />
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: Factors to Consider When Buying a Computer',
    content: (
      <div className="space-y-6">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Key Hardware Specifications</h3>
          <div className="mb-6">
            <LessonImage
              fileName="18-computer-buying-components.png"
              alt="A realistic desktop computer and laptop with processor memory and storage components arranged nearby"
              caption="When buying a computer, compare the processor, RAM, storage, graphics capability, form factor, and intended use."
            />
          </div>
          <ConceptExplainer
            title="A Complete Computer-Buying Checklist"
            introduction="Begin with the intended tasks and required software, then select balanced hardware. One impressive specification cannot compensate for a serious bottleneck elsewhere."
            accent="blue"
            concepts={[
              {
                name: 'Intended Workload',
                definition: 'The programs, data and tasks the computer must handle.',
                explanation: 'Office documents, programming, video editing, gaming and scientific modelling place very different demands on the processor, memory, graphics and storage. Required software should be checked before hardware is ordered.',
                examples: ['School assignments', 'Architectural CAD', 'High-resolution video editing'],
                examTip: 'Always connect a recommended specification to a stated user task.',
              },
              {
                name: 'Processor Capability',
                definition: 'The CPU’s ability to complete the required instructions within an acceptable time.',
                explanation: 'Clock speed is only one factor. Architecture, number of cores, cache and software optimisation also affect performance, so processors should be compared using the intended workload rather than GHz alone.',
                examples: ['Core count', 'Clock frequency', 'Processor generation and architecture'],
                examTip: 'Do not state that doubling GHz always doubles total computer performance.',
              },
              {
                name: 'RAM Capacity',
                definition: 'The amount of fast working memory available to active programs and data.',
                explanation: 'Insufficient RAM forces the system to move working data to slower storage, causing delays. Extra RAM helps when several or memory-intensive programs run, but unused RAM does not automatically speed every task.',
                examples: ['Browser with many tabs', 'Large image project', 'Several office applications open together'],
                examTip: 'RAM is volatile working storage, not the place for permanent files.',
              },
              {
                name: 'Storage Type and Capacity',
                definition: 'The technology, speed and space available for the operating system, applications and saved files.',
                explanation: 'An SSD improves startup and loading because it has no moving parts, while a high-capacity HDD may provide cheaper bulk storage. Capacity must include expected growth, backups and free working space.',
                examples: ['Fast internal SSD', 'Large archive HDD', 'External backup drive'],
                examTip: 'Compare both speed and capacity; “larger is always better” ignores cost and purpose.',
              },
              {
                name: 'Graphics and Display',
                definition: 'The hardware responsible for rendering images and the screen used to present them.',
                explanation: 'Integrated graphics may be sufficient for office work, while 3D design, games or video effects may need a dedicated GPU. Display size, resolution, colour accuracy and accessibility must suit the task.',
                examples: ['Integrated graphics for documents', 'Dedicated GPU for 3D work', 'Colour-accurate monitor for design'],
                examTip: 'A dedicated GPU is not necessary for every user.',
              },
              {
                name: 'Ports, Networking and Expansion',
                definition: 'The connections and upgrade options required for peripherals and communication.',
                explanation: 'Check the exact number and type of ports, wireless standards, network interface and internal expansion. Adapters add cost and may not supply every feature of a native port.',
                examples: ['USB for peripherals', 'HDMI or DisplayPort for a monitor', 'Ethernet or Wi-Fi for networking'],
                examTip: 'Name the peripheral or service that will use the connection.',
              },
              {
                name: 'Form Factor and Portability',
                definition: 'The physical design, size, weight and power arrangement of the computer.',
                explanation: 'A desktop is easier to cool and upgrade, while a laptop trades some expansion for portability and battery operation. Rugged or compact systems may be needed in harsh or limited spaces.',
                examples: ['Desktop tower', 'Lightweight laptop', 'Rugged field tablet'],
                examTip: 'Relate portability to movement, battery life and physical working conditions.',
              },
              {
                name: 'Compatibility',
                definition: 'The ability to run required software and work with existing devices and file formats.',
                explanation: 'Confirm operating-system support, drivers, processor architecture and peripheral requirements. A powerful computer is unsuitable if a critical application or specialist device cannot operate on it.',
                examples: ['Required operating system', 'Printer or scanner driver', 'Specialist application support'],
                examTip: 'Check software and peripherals before buying, not after installation fails.',
              },
              {
                name: 'Reliability, Warranty and Support',
                definition: 'The expected dependability of the system and help available when it fails.',
                explanation: 'Build quality, cooling, repairability, warranty terms, spare-part availability and supplier response time matter when downtime affects learning or business.',
                examples: ['On-site warranty', 'Available replacement parts', 'Local technical support'],
                examTip: 'The cheapest purchase may have the highest downtime and repair cost.',
              },
              {
                name: 'Total Cost and Future Growth',
                definition: 'All costs across the useful life of the computer and its ability to meet later needs.',
                explanation: 'Include software, peripherals, electricity, maintenance, repairs, connectivity, training and disposal. Upgradeable memory or storage may extend useful life, but paying for unrealistic future needs wastes money.',
                examples: ['Purchase and licence cost', 'Maintenance and energy cost', 'Planned RAM or storage upgrade'],
                examTip: 'Total cost of ownership is broader than the price shown in the shop.',
              },
            ]}
          />
          <div className="mt-6">
            <LessonImage
              fileName="19-computer-ports-expandability.png"
              alt="A realistic close view of common computer ports and internal expansion slots"
              caption="Ports and expansion options determine which devices and upgrades the computer can support."
            />
          </div>
        </div>

        <div className="p-5 bg-amber-50 rounded-xl">
          <h4 className="font-bold text-amber-800">Budget & Future‑proofing</h4>
          <p className="text-amber-700">Consider not only the purchase price but also maintenance, upgrades, and software costs. Choose a system that can grow with your needs.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-blue-700">Data & Info</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>Data = raw facts</li>
            <li>Information = processed data</li>
            <li>GIGO – quality in = quality out</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🕰️</span>
            <h4 className="text-lg font-bold text-blue-700">Generations</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>1st: Valves</li>
            <li>2nd: Transistors</li>
            <li>3rd: ICs</li>
            <li>4th: Microprocessors</li>
            <li>5th: AI</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🖥️</span>
            <h4 className="text-lg font-bold text-blue-700">Types</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>Micro, Mini, Mainframe, Super</li>
            <li>Embedded (appliances)</li>
            <li>General vs Special purpose</li>
          </ul>
        </div>

        <div className="md:col-span-3 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔧</span>
            <h4 className="text-lg font-bold text-blue-700">Buying Factors</h4>
          </div>
          <p className="text-slate-700 mt-1">Consider RAM, storage, processor speed, intended use, expandability, and budget.</p>
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
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
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

interface ComputerStudiesProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const ComputerStudies: React.FC<ComputerStudiesProps> = ({
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
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            COMPUTER STUDIES
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Introduction to Computers
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand what a computer is, how it processes data, the evolution of computers, their types,
            and what to look for when buying one.
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
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Data vs Information:</strong> Data is raw; information is processed data. GIGO – quality in = quality out.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Generations:</strong> From valves to AI – each generation made computers smaller, faster, cheaper.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Types:</strong> Micro, mini, mainframe, super, and embedded – each suited for different tasks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Buying factors:</strong> RAM, storage, processor speed, intended use, expandability, and budget.</span>
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
                Next: <span className="text-blue-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputerStudies;

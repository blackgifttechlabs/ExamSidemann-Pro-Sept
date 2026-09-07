import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Pie Chart Example (Rainfall data)
const pieChartSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="100%" height="100%">
  <rect width="400" height="350" fill="white" />
  <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Rainfall Pie Chart</text>
  <circle cx="200" cy="180" r="120" fill="none" stroke="#1e293b" stroke-width="2" />
  <!-- January 40mm = 67.6° -->
  <path d="M200 180 L200 60 A120 120 0 0 1 311 160 Z" fill="#3b82f6" />
  <text x="250" y="80" font-size="10" fill="white">Jan</text>
  <!-- February 50mm = 84.5° -->
  <path d="M200 180 L311 160 A120 120 0 0 1 355 230 Z" fill="#22c55e" />
  <text x="330" y="180" font-size="10" fill="white">Feb</text>
  <!-- March 45mm = 76.1° -->
  <path d="M200 180 L355 230 A120 120 0 0 1 300 290 Z" fill="#eab308" />
  <text x="310" y="270" font-size="10" fill="white">Mar</text>
  <!-- April 35mm = 59.2° -->
  <path d="M200 180 L300 290 A120 120 0 0 1 200 300 Z" fill="#ef4444" />
  <text x="250" y="280" font-size="10" fill="white">Apr</text>
  <!-- May 20mm = 33.8° -->
  <path d="M200 180 L200 300 A120 120 0 0 1 110 230 Z" fill="#8b5cf6" />
  <text x="140" y="280" font-size="10" fill="white">May</text>
  <!-- June 10mm = 16.9° -->
  <path d="M200 180 L110 230 A120 120 0 0 1 200 60 Z" fill="#f59e0b" />
  <text x="140" y="90" font-size="10" fill="white">Jun</text>
  <line x1="200" y1="180" x2="200" y2="60" stroke="#1e293b" stroke-width="1" />
  <text x="200" y="330" text-anchor="middle" font-size="11" fill="#475569">Distribution of rainfall (mm)</text>
</svg>
`;

// Bar Graph Example
const barGraphSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Monthly Rainfall (mm)</text>
  <!-- Axes -->
  <line x1="60" y1="300" x2="460" y2="300" stroke="#1e293b" stroke-width="2" />
  <line x1="60" y1="300" x2="60" y2="40" stroke="#1e293b" stroke-width="2" />
  <!-- Bars -->
  <rect x="80" y="220" width="40" height="80" fill="#3b82f6" />
  <text x="100" y="315" text-anchor="middle" font-size="10">Jan</text>
  <rect x="150" y="200" width="40" height="100" fill="#22c55e" />
  <text x="170" y="315" text-anchor="middle" font-size="10">Feb</text>
  <rect x="220" y="210" width="40" height="90" fill="#eab308" />
  <text x="240" y="315" text-anchor="middle" font-size="10">Mar</text>
  <rect x="290" y="230" width="40" height="70" fill="#ef4444" />
  <text x="310" y="315" text-anchor="middle" font-size="10">Apr</text>
  <rect x="360" y="260" width="40" height="40" fill="#8b5cf6" />
  <text x="380" y="315" text-anchor="middle" font-size="10">May</text>
  <rect x="430" y="280" width="40" height="20" fill="#f59e0b" />
  <text x="450" y="315" text-anchor="middle" font-size="10">Jun</text>
  <!-- Scale -->
  <text x="50" y="300" text-anchor="end" font-size="10">0</text>
  <text x="50" y="220" text-anchor="end" font-size="10">20</text>
  <text x="50" y="140" text-anchor="end" font-size="10">40</text>
  <text x="50" y="60" text-anchor="end" font-size="10">60</text>
  <text x="30" y="170" font-size="11" transform="rotate(-90, 30, 170)" fill="#1e293b">Rainfall (mm)</text>
</svg>
`;

// Circuit diagram
const circuitDiagramSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="100%" height="100%">
  <rect width="500" height="250" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Circuit Diagram</text>
  <!-- Cell -->
  <rect x="60" y="90" width="10" height="40" fill="#1e293b" />
  <rect x="70" y="95" width="10" height="30" fill="#3b82f6" />
  <line x1="55" y1="110" x2="45" y2="110" stroke="#1e293b" stroke-width="2" />
  <text x="30" y="105" font-size="11" fill="#475569">Battery</text>
  <!-- Switch -->
  <line x1="45" y1="110" x2="150" y2="110" stroke="#1e293b" stroke-width="2" />
  <circle cx="150" cy="110" r="4" fill="#1e293b" />
  <line x1="150" y1="110" x2="180" y2="90" stroke="#1e293b" stroke-width="2" />
  <circle cx="180" cy="90" r="4" fill="#1e293b" />
  <text x="160" y="80" font-size="11" fill="#475569">Switch</text>
  <!-- Resistor -->
  <rect x="210" y="100" width="60" height="20" rx="3" fill="#f59e0b" stroke="#d97706" stroke-width="1" />
  <text x="240" y="115" text-anchor="middle" font-size="10" fill="white">R</text>
  <line x1="180" y1="110" x2="210" y2="110" stroke="#1e293b" stroke-width="2" />
  <line x1="270" y1="110" x2="310" y2="110" stroke="#1e293b" stroke-width="2" />
  <!-- Ammeter -->
  <circle cx="340" cy="110" r="20" fill="none" stroke="#3b82f6" stroke-width="2" />
  <text x="340" y="115" text-anchor="middle" font-size="12" fill="#3b82f6">A</text>
  <line x1="310" y1="110" x2="320" y2="110" stroke="#1e293b" stroke-width="2" />
  <!-- Voltmeter (parallel) -->
  <line x1="270" y1="110" x2="270" y2="50" stroke="#1e293b" stroke-width="2" />
  <circle cx="300" cy="50" r="20" fill="none" stroke="#ef4444" stroke-width="2" />
  <text x="300" y="55" text-anchor="middle" font-size="12" fill="#ef4444">V</text>
  <line x1="320" y1="50" x2="340" y2="110" stroke="#1e293b" stroke-width="2" />
  <!-- Return path -->
  <line x1="360" y1="110" x2="430" y2="110" stroke="#1e293b" stroke-width="2" />
  <line x1="430" y1="110" x2="430" y2="170" stroke="#1e293b" stroke-width="2" />
  <line x1="55" y1="170" x2="430" y2="170" stroke="#1e293b" stroke-width="2" />
  <line x1="55" y1="170" x2="55" y2="110" stroke="#1e293b" stroke-width="2" />
</svg>
`;

// Petrol engine strokes
const engineStrokesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 180" width="100%" height="100%">
  <rect width="700" height="180" fill="white" />
  <text x="350" y="20" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Petrol Engine Strokes</text>
  <!-- Intake -->
  <rect x="20" y="40" width="130" height="120" rx="5" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="85" y="60" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">Intake</text>
  <rect x="50" y="70" width="70" height="60" rx="3" fill="none" stroke="#94a3b8" stroke-width="1" />
  <text x="85" y="100" text-anchor="middle" font-size="10" fill="#475569">Air +</text>
  <text x="85" y="115" text-anchor="middle" font-size="10" fill="#475569">Fuel in</text>
  <text x="85" y="145" text-anchor="middle" font-size="9" fill="#475569">↓ piston down</text>
  <!-- Compression -->
  <rect x="170" y="40" width="130" height="120" rx="5" fill="#fef9c3" stroke="#eab308" stroke-width="2" />
  <text x="235" y="60" text-anchor="middle" font-size="11" font-weight="bold" fill="#ca8a04">Compression</text>
  <rect x="200" y="70" width="70" height="40" rx="3" fill="none" stroke="#94a3b8" stroke-width="1" />
  <text x="235" y="95" text-anchor="middle" font-size="10" fill="#854d0e">Gas</text>
  <text x="235" y="110" text-anchor="middle" font-size="10" fill="#854d0e">compressed</text>
  <text x="235" y="145" text-anchor="middle" font-size="9" fill="#854d0e">↑ piston up</text>
  <!-- Power/Ignition -->
  <rect x="320" y="40" width="130" height="120" rx="5" fill="#fef2f2" stroke="#ef4444" stroke-width="2" />
  <text x="385" y="60" text-anchor="middle" font-size="11" font-weight="bold" fill="#dc2626">Power/Ignition</text>
  <rect x="350" y="70" width="70" height="40" rx="3" fill="none" stroke="#94a3b8" stroke-width="1" />
  <text x="385" y="90" text-anchor="middle" font-size="10" fill="#dc2626">💥 Spark</text>
  <text x="385" y="110" text-anchor="middle" font-size="10" fill="#dc2626">ignites fuel</text>
  <text x="385" y="145" text-anchor="middle" font-size="9" fill="#dc2626">↓ piston down</text>
  <!-- Exhaust -->
  <rect x="470" y="40" width="130" height="120" rx="5" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
  <text x="535" y="60" text-anchor="middle" font-size="11" font-weight="bold" fill="#475569">Exhaust</text>
  <rect x="500" y="70" width="70" height="40" rx="3" fill="none" stroke="#94a3b8" stroke-width="1" />
  <text x="535" y="90" text-anchor="middle" font-size="10" fill="#475569">Gases</text>
  <text x="535" y="110" text-anchor="middle" font-size="10" fill="#475569">out</text>
  <text x="535" y="145" text-anchor="middle" font-size="9" fill="#475569">↑ piston up</text>
</svg>
`;

// Heat transfer - conduction experiment
const conductionExperimentSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200" width="100%" height="100%">
  <rect width="400" height="200" fill="white" />
  <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Conduction Experiment</text>
  <!-- Flame -->
  <path d="M60 180 L60 140 Q60 130 70 120 Q80 130 80 140 L80 180 Z" fill="#f59e0b" />
  <path d="M60 180 L60 150 Q65 140 70 150 L70 180 Z" fill="#fcd34d" />
  <rect x="50" y="180" width="40" height="10" fill="#d1d5db" />
  <!-- Rods -->
  <rect x="110" y="140" width="250" height="8" fill="#94a3b8" />
  <rect x="110" y="160" width="250" height="8" fill="#f59e0b" />
  <rect x="110" y="180" width="250" height="8" fill="#22c55e" />
  <!-- Wax drops -->
  <circle cx="220" cy="145" r="4" fill="#fef9c3" />
  <circle cx="280" cy="145" r="4" fill="#fef9c3" />
  <circle cx="340" cy="145" r="4" fill="#fef9c3" />
  <circle cx="220" cy="165" r="4" fill="#fef9c3" />
  <circle cx="280" cy="165" r="4" fill="#fef9c3" />
  <circle cx="340" cy="165" r="4" fill="#fef9c3" />
  <circle cx="220" cy="185" r="4" fill="#fef9c3" />
  <circle cx="280" cy="185" r="4" fill="#fef9c3" />
  <circle cx="340" cy="185" r="4" fill="#fef9c3" />
  <text x="200" y="200" text-anchor="middle" font-size="10" fill="#475569">Different metals conduct heat at different rates</text>
</svg>
`;

// Electroscope
const electroscopeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
  <rect width="300" height="300" fill="white" />
  <text x="150" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Electroscope</text>
  <!-- Cap -->
  <circle cx="150" cy="60" r="12" fill="#d1d5db" stroke="#6b7280" stroke-width="1" />
  <text x="150" y="50" text-anchor="middle" font-size="10" fill="#374151">Cap</text>
  <!-- Rod -->
  <line x1="150" y1="72" x2="150" y2="160" stroke="#6b7280" stroke-width="3" />
  <!-- Glass -->
  <rect x="90" y="80" width="120" height="170" rx="10" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4,2" />
  <text x="80" y="180" font-size="10" fill="#475569">Glass case</text>
  <!-- Leaves -->
  <line x1="150" y1="160" x2="120" y2="220" stroke="#3b82f6" stroke-width="2" />
  <line x1="150" y1="160" x2="180" y2="220" stroke="#3b82f6" stroke-width="2" />
  <text x="110" y="240" font-size="10" fill="#3b82f6">Leaves</text>
  <!-- When charged - leaves separate -->
  <line x1="150" y1="160" x2="110" y2="230" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
  <line x1="150" y1="160" x2="190" y2="230" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
  <text x="100" y="270" font-size="10" fill="#ef4444">Charged: leaves diverge</text>
</svg>
`;

// Lightning conductor
const lightningConductorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 350" width="100%" height="100%">
  <rect width="400" height="350" fill="white" />
  <text x="200" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Lightning Conductor</text>
  <!-- Building -->
  <rect x="120" y="80" width="160" height="200" rx="5" fill="#d1d5db" stroke="#6b7280" stroke-width="2" />
  <text x="200" y="180" text-anchor="middle" font-size="12" fill="#374151">Building</text>
  <!-- Lightning rod -->
  <line x1="200" y1="40" x2="200" y2="80" stroke="#f59e0b" stroke-width="3" />
  <circle cx="200" cy="40" r="5" fill="#f59e0b" />
  <text x="210" y="55" font-size="10" fill="#d97706">Rod</text>
  <!-- Wire down -->
  <line x1="200" y1="80" x2="200" y2="280" stroke="#f59e0b" stroke-width="3" />
  <text x="210" y="150" font-size="10" fill="#d97706">Conductor</text>
  <!-- Earth -->
  <rect x="180" y="280" width="40" height="20" rx="3" fill="#6b7280" />
  <text x="200" y="295" text-anchor="middle" font-size="10" fill="white">Earth</text>
  <!-- Lightning bolt -->
  <path d="M300 40 L270 100 L290 100 L250 180 L280 180 L230 280" fill="none" stroke="#facc15" stroke-width="3" />
  <text x="310" y="120" font-size="10" fill="#facc15">Lightning</text>
  <!-- Arrow to rod -->
  <line x1="260" y1="80" x2="210" y2="60" stroke="#facc15" stroke-width="1" stroke-dasharray="4,2" marker-end="url(#arrow)" />
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#facc15" />
    </marker>
  </defs>
</svg>
`;

// Resistors in series and parallel
const resistorsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 250" width="100%" height="100%">
  <rect width="600" height="250" fill="white" />
  <text x="300" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Resistors: Series and Parallel</text>
  
  <!-- Series -->
  <text x="150" y="60" text-anchor="middle" font-size="14" font-weight="bold" fill="#3b82f6">Series</text>
  <line x1="50" y1="100" x2="80" y2="100" stroke="#1e293b" stroke-width="2" />
  <rect x="80" y="90" width="40" height="20" rx="3" fill="#f59e0b" />
  <text x="100" y="105" text-anchor="middle" font-size="10" fill="white">R₁</text>
  <line x1="120" y1="100" x2="150" y2="100" stroke="#1e293b" stroke-width="2" />
  <rect x="150" y="90" width="40" height="20" rx="3" fill="#f59e0b" />
  <text x="170" y="105" text-anchor="middle" font-size="10" fill="white">R₂</text>
  <line x1="190" y1="100" x2="220" y2="100" stroke="#1e293b" stroke-width="2" />
  <rect x="220" y="90" width="40" height="20" rx="3" fill="#f59e0b" />
  <text x="240" y="105" text-anchor="middle" font-size="10" fill="white">R₃</text>
  <line x1="260" y1="100" x2="290" y2="100" stroke="#1e293b" stroke-width="2" />
  <text x="170" y="130" text-anchor="middle" font-size="11" fill="#475569">Rₜ = R₁ + R₂ + R₃</text>
  
  <!-- Parallel -->
  <text x="450" y="60" text-anchor="middle" font-size="14" font-weight="bold" fill="#22c55e">Parallel</text>
  <line x1="340" y1="100" x2="370" y2="100" stroke="#1e293b" stroke-width="2" />
  <line x1="370" y1="100" x2="370" y2="80" stroke="#1e293b" stroke-width="2" />
  <line x1="370" y1="100" x2="370" y2="120" stroke="#1e293b" stroke-width="2" />
  <!-- Top branch -->
  <line x1="370" y1="80" x2="400" y2="80" stroke="#1e293b" stroke-width="2" />
  <rect x="400" y="70" width="40" height="20" rx="3" fill="#22c55e" />
  <text x="420" y="85" text-anchor="middle" font-size="10" fill="white">R₁</text>
  <line x1="440" y1="80" x2="460" y2="80" stroke="#1e293b" stroke-width="2" />
  <!-- Bottom branch -->
  <line x1="370" y1="120" x2="400" y2="120" stroke="#1e293b" stroke-width="2" />
  <rect x="400" y="110" width="40" height="20" rx="3" fill="#22c55e" />
  <text x="420" y="125" text-anchor="middle" font-size="10" fill="white">R₂</text>
  <line x1="440" y1="120" x2="460" y2="120" stroke="#1e293b" stroke-width="2" />
  <!-- Join -->
  <line x1="460" y1="80" x2="460" y2="120" stroke="#1e293b" stroke-width="2" />
  <line x1="460" y1="100" x2="490" y2="100" stroke="#1e293b" stroke-width="2" />
  <text x="420" y="160" text-anchor="middle" font-size="11" fill="#475569">1/Rₜ = 1/R₁ + 1/R₂</text>
</svg>
`;

// Generic placeholder image loader
const foundationImage = (fileName: string) =>
  new URL(`../physics/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const physicsImages = {
  pieChart: svgToDataUri(pieChartSvg),
  barGraph: svgToDataUri(barGraphSvg),
  circuit: svgToDataUri(circuitDiagramSvg),
  engineStrokes: svgToDataUri(engineStrokesSvg),
  conduction: svgToDataUri(conductionExperimentSvg),
  electroscope: svgToDataUri(electroscopeSvg),
  lightning: svgToDataUri(lightningConductorSvg),
  resistors: svgToDataUri(resistorsSvg),
};

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const PlaceholderImage: React.FC<{ placeholder: string; alt: string; className?: string }> = ({
  placeholder,
  alt,
  className = 'mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm',
}) => (
  <img
    src={placeholderToImage(placeholder)}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={className}
  />
);

const sections: TopicSection[] = [
  {
    id: 'data-presentation',
    title: 'Data Presentation',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Scientists record data in the form of <strong>tables, tallies, line graphs, pie charts</strong>, etc. These help in analysing and interpreting experimental results.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Pie Chart</h4>
            <p className="text-sm text-slate-700">A circular diagram used to represent data proportions. Each segment's angle is proportional to its percentage of the total.</p>
            <div className="mt-2">
              <img src={physicsImages.pieChart} alt="Pie chart example" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2"><strong>How to construct:</strong> Calculate percentages, multiply by 360° for angles, draw segments with a protractor, label and shade.</p>
            <p className="text-sm text-slate-700 mt-1"><strong>Interpretation:</strong> Visually appealing and easy to understand proportions.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Bar and Line Graphs</h4>
            <div className="mt-2">
              <img src={physicsImages.barGraph} alt="Bar graph example" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Bar graph:</strong> Compare quantities using bars.</li>
              <li><strong>Line graph:</strong> Show relationships between two variables or changes over time.</li>
              <li>X‑axis: controlled variable; Y‑axis: measured variable.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Data Presentation Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Pie chart – proportions</li>
              <li>Bar graph – comparisons</li>
              <li>Line graph – trends/relationships</li>
              <li>Tables – organised data</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'measurement',
    title: 'Measurement',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Physics experiments involve measuring quantities such as <strong>length, mass, voltage, current, and time</strong>. The SI system is used.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Length</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>SI unit: metre (m).</li>
              <li><strong>Ruler:</strong> Measures 1mm to 1m.</li>
              <li><strong>Measuring tape:</strong> For curved or flexible objects.</li>
              <li><strong>Vernier callipers:</strong> Precise measurements to 0.1mm.</li>
            </ul>
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Conversions:</strong> 1cm = 10mm, 1m = 100cm, 1km = 1000m.
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Density</h4>
            <p className="text-sm text-slate-700">Density (ρ) = Mass (m) / Volume (V).</p>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>To find density of a liquid:</strong> Weigh measuring cylinder empty and full; mass difference = mass of liquid; read volume.</li>
              <li><strong>To find density of irregular object:</strong> Use water displacement method to find volume.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Voltage and Current</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Voltage (V):</strong> Potential difference – measured by voltmeter (parallel). Unit: volts (V).</li>
              <li><strong>Current (I):</strong> Flow of charge – measured by ammeter (series). Unit: amperes (A).</li>
              <li><strong>Formula:</strong> Voltage = Energy / Charge (V = E / C).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Circuit Diagram</h4>
            <div className="mt-2">
              <img src={physicsImages.circuit} alt="Circuit diagram" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-1">Shows battery, switch, resistor (R), ammeter (A – series), and voltmeter (V – parallel).</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Measurement Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Ruler – length</li>
              <li>Vernier callipers – precise length</li>
              <li>Ammeter – current (series)</li>
              <li>Voltmeter – voltage (parallel)</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'forces',
    title: 'Forces and Motion',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>force</strong> is a push or a pull that can change a body's motion, shape, or size. The unit of force is the <strong>newton (N)</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Key Force Concepts</h4>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Mass (m):</strong> Amount of matter – measured in kg.</li>
              <li><strong>Weight (W):</strong> Force due to gravity – W = mg (g = 9.8 m/s²).</li>
              <li><strong>Friction:</strong> Force opposing motion – produces heat, wears materials.</li>
              <li><strong>Inertia:</strong> Tendency of an object to resist change in its state of motion.</li>
              <li><strong>Momentum:</strong> Mass in motion – p = mv (kg·m/s).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Newton's Laws</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>First Law:</strong> A body stays at rest or moves with uniform velocity unless acted on by an external force.</li>
              <li><strong>Second Law:</strong> Acceleration is proportional to force and inversely proportional to mass – F = ma.</li>
              <li><strong>Third Law:</strong> For every action, there is an equal and opposite reaction.</li>
            </ul>
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Example:</strong> A 10N force on a 15kg mass gives a = 10/15 = 0.67 m/s².
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Centre of Mass</h4>
            <p className="text-sm text-slate-700">The point where the mass of an object is centred. Important in understanding stability and balance.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Forces Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Force (N) = mass × acceleration</li>
              <li>Weight = mass × gravity</li>
              <li>Friction opposes motion</li>
              <li>Momentum = mass × velocity</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'machines',
    title: 'Machines',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>machine</strong> makes work easier. Key principles: <strong>Mechanical Advantage (MA)</strong>, <strong>Velocity Ratio (VR)</strong>, and <strong>Efficiency</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Levers</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>MA = Load / Effort</strong></li>
              <li><strong>VR = Distance moved by effort / Distance moved by load</strong></li>
              <li><strong>Efficiency = (Work output / Work input) × 100%</strong></li>
              <li>Example: Effort 40N lifts 80N load → MA = 80/40 = 2.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Inclined Planes</h4>
            <p className="text-sm text-slate-700">A sloping surface that reduces the effort needed to lift a load. Smaller angle = smaller effort.</p>
            <p className="text-sm text-slate-700"><strong>VR = 1 / sin(θ)</strong></p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Pulleys</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Single fixed pulley:</strong> MA = VR = 1 (changes direction).</li>
              <li><strong>Single movable pulley:</strong> MA = VR = 2.</li>
              <li><strong>Block and tackle:</strong> VR = number of pulleys.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Gears and Wheel & Axle</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Gears:</strong> VR = Teeth on load / Teeth on effort.</li>
              <li><strong>Wheel & Axle:</strong> VR = Radius of wheel / Radius of axle.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Improving Efficiency</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Lubrication (oil/grease)</li>
              <li>Using rollers or ball bearings</li>
              <li>Using lighter parts</li>
              <li>Making surfaces smooth</li>
            </ul>
            <p className="text-sm text-slate-700 mt-1"><strong>Note:</strong> Friction is useful in brakes, for stopping, and for balance.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Machine Formulas</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>MA = Load / Effort</li>
              <li>VR = Distance effort / Distance load</li>
              <li>Efficiency = (MA / VR) × 100%</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'engines',
    title: 'Petrol and Diesel Engines',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Fuel engines convert <strong>chemical energy → heat energy → kinetic energy</strong>. Both petrol and diesel engines use internal combustion.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Petrol Engine Strokes</h4>
            <div className="mt-2">
              <img src={physicsImages.engineStrokes} alt="Engine strokes" className="w-full rounded-xl" />
            </div>
            <ol className="list-decimal list-inside text-sm text-slate-700 mt-2">
              <li><strong>Intake:</strong> Piston down, air+fuel in.</li>
              <li><strong>Compression:</strong> Piston up, gas compressed.</li>
              <li><strong>Power/Ignition:</strong> Spark ignites fuel, piston down – drives crankshaft.</li>
              <li><strong>Exhaust:</strong> Piston up, gases out.</li>
            </ol>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Diesel Engine Strokes</h4>
            <ol className="list-decimal list-inside text-sm text-slate-700">
              <li><strong>Induction:</strong> Air drawn in.</li>
              <li><strong>Compression:</strong> Air compressed (heats up).</li>
              <li><strong>Power/Ignition:</strong> Fuel injected, ignites spontaneously.</li>
              <li><strong>Exhaust:</strong> Gases out.</li>
            </ol>
            <p className="text-sm text-slate-700 mt-1"><strong>Key difference:</strong> Diesel uses compression ignition (no spark plug).</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">The Crankshaft</h4>
            <p className="text-sm text-slate-700">Converts the up‑and‑down motion of pistons into rotary motion to drive the wheels.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Engine Comparison</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Petrol: spark plug ignition</li>
              <li>Diesel: compression ignition</li>
              <li>Both: 4-stroke cycle</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'heat-transfer',
    title: 'Energy and Heat Transfer',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Heat is transferred by <strong>conduction</strong> (solids), <strong>convection</strong> (liquids/gases), and <strong>radiation</strong> (through empty space).
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Conduction</h4>
            <div className="mt-2">
              <img src={physicsImages.conduction} alt="Conduction experiment" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li>Metals conduct heat better than non‑metals.</li>
              <li>Order of conductivity: copper → brass → aluminium → iron.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Convection</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Occurs in liquids and gases.</li>
              <li>Heated fluid expands, becomes less dense, rises.</li>
              <li>Cooler fluid sinks – convection current.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Radiation</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Heat transfer through vacuum.</li>
              <li><strong>Black/dull surfaces:</strong> Good absorbers and emitters.</li>
              <li><strong>White/shiny surfaces:</strong> Poor absorbers, good reflectors.</li>
              <li>Application: Milk/petrol tanks painted white to reflect heat.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Heat Transfer Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Conduction – solids</li>
              <li>Convection – liquids/gases</li>
              <li>Radiation – vacuum</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Electromagnetism</strong> is the relationship between electricity and magnetism. A current‑carrying wire generates a magnetic field.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Motor Effect</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>A current‑carrying conductor in a magnetic field experiences a force.</li>
              <li><strong>DC Motor:</strong> Converts electrical energy → mechanical energy.</li>
              <li>Speed factors: current size, magnet strength, number of turns.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Generator Principle</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>A conductor moving in a magnetic field induces an electromotive force (emf).</li>
              <li><strong>DC Generator:</strong> Produces direct current (split‑ring commutator).</li>
              <li><strong>AC Generator:</strong> Produces alternating current (slip rings).</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Electromagnetism Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Current → magnetic field</li>
              <li>Motor: electrical → mechanical</li>
              <li>Generator: mechanical → electrical</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'electrostatics',
    title: 'Electricity and Electrostatics',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Electrostatics</strong> is the study of static electricity – charge due to excess or deficiency of electrons.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Static Electricity</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Like charges repel, unlike charges attract.</li>
              <li><strong>Conductors:</strong> Allow electron flow (metals, carbon).</li>
              <li><strong>Insulators:</strong> Electrons firmly held (plastic, rubber, nylon).</li>
              <li>Charges generated by friction = triboelectricity.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Electroscope</h4>
            <div className="mt-2">
              <img src={physicsImages.electroscope} alt="Electroscope" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-1">Detects static charges and their magnitude. Leaves diverge when charged.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Lightning</h4>
            <div className="mt-2">
              <img src={physicsImages.lightning} alt="Lightning conductor" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li>Thunderclouds build up static charge.</li>
              <li><strong>Lightning conductor:</strong> Provides a safe path to ground.</li>
              <li><strong>Precautions:</strong> Avoid trees, high ground, metal objects; unplug electronics.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Electrostatics Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Conductors vs insulators</li>
              <li>Like charges repel</li>
              <li>Lightning conductor – safety</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'ohm-law',
    title: 'Ohm\'s Law and Resistors',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Ohm's Law</strong> states that the current through a conductor is proportional to the potential difference across it, provided temperature remains constant: <strong>V = I × R</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Resistance</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>R = V / I</strong></li>
              <li><strong>Factors affecting resistance:</strong> Length (direct), cross‑sectional area (inverse), material, temperature.</li>
              <li><strong>Ohmic conductors:</strong> Metals obey Ohm's law.</li>
              <li><strong>Non‑ohmic:</strong> Semiconductors, diodes.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Resistors in Series and Parallel</h4>
            <div className="mt-2">
              <img src={physicsImages.resistors} alt="Resistors" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Series:</strong> Rₜ = R₁ + R₂ + R₃</li>
              <li><strong>Parallel:</strong> 1/Rₜ = 1/R₁ + 1/R₂</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Power</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Power (P) = Current × Voltage = I × V</strong></li>
              <li><strong>Electrical energy = Voltage × Current × Time = V × I × t</strong></li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Ohm's Law Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>V = I × R</li>
              <li>Series: add resistances</li>
              <li>Parallel: reciprocal sum</li>
              <li>Power = V × I</li>
            </ul>
          </div>
        </aside>
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
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-blue-700">Data Presentation</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Pie charts – proportions</li>
            <li>Bar graphs – comparisons</li>
            <li>Line graphs – trends</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📏</span>
            <h4 className="text-lg font-bold text-blue-700">Measurement</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Length: ruler, vernier</li>
            <li>Density = mass/volume</li>
            <li>Current (A) – series</li>
            <li>Voltage (V) – parallel</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-blue-700">Forces & Machines</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>F = ma, W = mg</li>
            <li>MA = Load/Effort</li>
            <li>VR = distance ratio</li>
            <li>Efficiency = MA/VR × 100%</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <h4 className="text-lg font-bold text-blue-700">Heat Transfer</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Conduction – solids</li>
            <li>Convection – fluids</li>
            <li>Radiation – vacuum</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h4 className="text-lg font-bold text-blue-700">Electricity & Electromagnetism</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>V = IR (Ohm's Law)</li>
            <li>Series: Rₜ = R₁ + R₂; Parallel: 1/Rₜ = 1/R₁ + 1/R₂</li>
            <li>Motor: electrical → mechanical</li>
            <li>Generator: mechanical → electrical</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔋</span>
            <h4 className="text-lg font-bold text-blue-700">Engines & Electrostatics</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Petrol: spark ignition, 4 strokes</li>
            <li>Diesel: compression ignition</li>
            <li>Like charges repel, unlike attract</li>
            <li>Lightning conductor protects buildings</li>
          </ul>
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
          onClick={() => scroll('left')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

interface LearningOutcome3Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome3: React.FC<LearningOutcome3Props> = ({
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
      <div className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            PHYSICS
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Physics: Data, Measurement, Forces, Machines, Heat, Electricity & Magnetism
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Comprehensive notes covering data presentation, measurement, forces and motion, machines, petrol/diesel engines,
            heat transfer, electromagnetism, electrostatics, and Ohm's law.
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
                <span><strong className="text-white">Data Presentation:</strong> Pie charts, bar graphs, and line graphs help visualise and interpret data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Measurement:</strong> Length (ruler/vernier), density (mass/volume), current (ammeter), voltage (voltmeter).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Forces:</strong> F = ma, W = mg; Newton's laws; friction opposes motion.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Machines:</strong> MA = Load/Effort, VR = distance ratio, Efficiency = MA/VR × 100%.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Engines:</strong> Petrol (spark ignition) and Diesel (compression ignition) both have 4-stroke cycles.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Heat Transfer:</strong> Conduction (solids), Convection (fluids), Radiation (vacuum).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Electricity:</strong> V = IR (Ohm's Law); resistors in series (add) and parallel (reciprocal sum).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Electromagnetism:</strong> Motor (electrical → mechanical) and Generator (mechanical → electrical).</span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'Ready for the next section?' : `Section ${activeIndex + 1} of ${sections.length}`}
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
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Section'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcome3;

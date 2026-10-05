import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';
import { DataPresentationLesson } from '../../shared/DataPresentationLesson';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Pie Chart Example (Rainfall data). Slices are generated from the data so the angles are exact.
const RAINFALL: [string, number, string][] = [
  ['Jan', 40, '#3b82f6'],
  ['Feb', 50, '#22c55e'],
  ['Mar', 45, '#eab308'],
  ['Apr', 35, '#ef4444'],
  ['May', 20, '#8b5cf6'],
  ['Jun', 10, '#f59e0b'],
];
const pieChartSvg = (() => {
  const cx = 200, cy = 180, r = 115;
  const total = RAINFALL.reduce((sum, row) => sum + row[1], 0);
  const point = (deg: number, radius: number) => {
    const rad = ((deg - 90) * Math.PI) / 180; // 0° is 12 o'clock, going clockwise
    return [cx + radius * Math.cos(rad), cy + radius * Math.sin(rad)];
  };
  let start = 0;
  const slices = RAINFALL.map(([name, value, colour]) => {
    const angle = (value / total) * 360;
    const [x1, y1] = point(start, r);
    const [x2, y2] = point(start + angle, r);
    const [lx, ly] = point(start + angle / 2, r + 26);
    const percent = Math.round((value / total) * 1000) / 10;
    start += angle;
    return `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${angle > 180 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="${colour}" stroke="white" stroke-width="2" />
  <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" font-size="13" font-weight="bold" fill="#1e293b">${name} ${percent}%</text>`;
  });
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 0 460 350" width="100%" height="100%">
  <rect x="-30" width="460" height="350" fill="white" />
  <text x="200" y="24" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">Rainfall Pie Chart</text>
  ${slices.join('\n  ')}
  <text x="200" y="338" text-anchor="middle" font-size="12" fill="#475569">Total rainfall: ${total} mm (each slice = share of the total)</text>
</svg>
`;
})();

// Bar Graph Example (same rainfall data as the pie chart)
const barGraphSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">Monthly Rainfall (mm)</text>
  <line x1="60" y1="300" x2="480" y2="300" stroke="#1e293b" stroke-width="2" />
  <line x1="60" y1="300" x2="60" y2="40" stroke="#1e293b" stroke-width="2" />
  <rect x="80" y="140" width="40" height="160" fill="#3b82f6" />
  <text x="100" y="135" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">40</text>
  <text x="100" y="318" text-anchor="middle" font-size="12">Jan</text>
  <rect x="150" y="100" width="40" height="200" fill="#22c55e" />
  <text x="170" y="95" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">50</text>
  <text x="170" y="318" text-anchor="middle" font-size="12">Feb</text>
  <rect x="220" y="120" width="40" height="180" fill="#eab308" />
  <text x="240" y="115" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">45</text>
  <text x="240" y="318" text-anchor="middle" font-size="12">Mar</text>
  <rect x="290" y="160" width="40" height="140" fill="#ef4444" />
  <text x="310" y="155" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">35</text>
  <text x="310" y="318" text-anchor="middle" font-size="12">Apr</text>
  <rect x="360" y="220" width="40" height="80" fill="#8b5cf6" />
  <text x="380" y="215" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">20</text>
  <text x="380" y="318" text-anchor="middle" font-size="12">May</text>
  <rect x="430" y="260" width="40" height="40" fill="#f59e0b" />
  <text x="450" y="255" text-anchor="middle" font-size="11" font-weight="bold" fill="#1e293b">10</text>
  <text x="450" y="318" text-anchor="middle" font-size="12">Jun</text>
  <text x="50" y="304" text-anchor="end" font-size="11">0</text>
  <text x="50" y="224" text-anchor="end" font-size="11">20</text>
  <text x="50" y="144" text-anchor="end" font-size="11">40</text>
  <text x="50" y="64" text-anchor="end" font-size="11">60</text>
  <text x="22" y="170" font-size="12" transform="rotate(-90, 22, 170)" text-anchor="middle" fill="#1e293b">Rainfall (mm)</text>
  <text x="270" y="342" text-anchor="middle" font-size="12" fill="#1e293b">Month</text>
</svg>
`;

// Circuit diagram: cell, closed switch, resistor, ammeter in series, voltmeter in parallel with the resistor
const circuitDiagramSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 300" width="100%" height="100%" font-family="Arial, Helvetica, sans-serif">
  <rect width="520" height="300" fill="white" />
  <text x="260" y="24" text-anchor="middle" font-size="16" font-weight="bold" fill="#1e293b">Circuit Diagram</text>

  <g stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <!-- main loop -->
    <path d="M70 168V120H150" />
    <path d="M210 120H240" />
    <path d="M340 120H380" />
    <path d="M420 120H450V250H70V182" />

    <!-- cell: long plate is positive, short thick plate is negative -->
    <path d="M54 168H86" />
    <path d="M62 182H78" stroke-width="6" />

    <!-- closed switch -->
    <path d="M150 120L208 118" stroke="#2563eb" />

    <!-- resistor -->
    <rect x="240" y="107" width="100" height="26" rx="3" fill="white" />

    <!-- ammeter in series -->
    <circle cx="400" cy="120" r="20" stroke="#2563eb" fill="white" />

    <!-- voltmeter branch in parallel with the resistor -->
    <path d="M240 120V60H272" />
    <path d="M308 60H340V120" />
    <circle cx="290" cy="60" r="18" stroke="#dc2626" fill="white" />
  </g>

  <!-- terminals and junctions -->
  <circle cx="150" cy="120" r="4.5" fill="#1e293b" />
  <circle cx="210" cy="119" r="4.5" fill="#1e293b" />
  <circle cx="240" cy="120" r="4.5" fill="#1e293b" />
  <circle cx="340" cy="120" r="4.5" fill="#1e293b" />

  <!-- conventional current direction (from + round to -) -->
  <polygon points="122,120 110,114 110,126" fill="#1e293b" />
  <polygon points="262,250 274,244 274,256" fill="#1e293b" />

  <!-- symbols inside components -->
  <text x="290" y="125" text-anchor="middle" font-size="15" font-weight="bold" fill="#1e293b">R</text>
  <text x="400" y="126" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">A</text>
  <text x="290" y="66" text-anchor="middle" font-size="16" font-weight="bold" fill="#dc2626">V</text>
  <text x="96" y="166" font-size="13" font-weight="bold" fill="#1e293b">+</text>
  <text x="90" y="192" font-size="15" font-weight="bold" fill="#1e293b">&#8722;</text>

  <!-- labels -->
  <text x="48" y="179" text-anchor="end" font-size="13" fill="#475569">Cell</text>
  <text x="180" y="100" text-anchor="middle" font-size="13" fill="#475569">Switch (closed)</text>
  <text x="290" y="156" text-anchor="middle" font-size="13" fill="#475569">Resistor</text>
  <text x="400" y="162" text-anchor="middle" font-size="13" fill="#475569">Ammeter</text>
  <text x="400" y="178" text-anchor="middle" font-size="11" fill="#64748b">(in series)</text>
  <text x="354" y="58" font-size="12" fill="#475569">Voltmeter</text>
  <text x="354" y="72" font-size="11" fill="#64748b">(in parallel with R)</text>
  <text x="260" y="278" text-anchor="middle" font-size="11" fill="#64748b">Arrows show conventional current, from + round to &#8722;</text>
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
    content: <DataPresentationLesson />,
  },
  {
    id: 'measurement',
    title: 'Measurement',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Physics experiments involve measuring quantities such as <strong>length, mass, voltage, current, and time</strong>. The SI system is used.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Length</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>SI unit: metre (m).</li>
              <li><strong>Ruler:</strong> Measures 1mm to 1m.</li>
              <li><strong>Measuring tape:</strong> For curved or flexible objects.</li>
              <li><strong>Vernier callipers:</strong> Precise measurements to 0.1mm.</li>
            </ul>
            <div className="mt-2 p-2 bg-slate-50 rounded text-base">
              <strong>Conversions:</strong> 1cm = 10mm, 1m = 100cm, 1km = 1000m.
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Density</h4>
            <p className="text-base text-slate-700">Density (ρ) = Mass (m) / Volume (V).</p>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>To find density of a liquid:</strong> Weigh measuring cylinder empty and full; mass difference = mass of liquid; read volume.</li>
              <li><strong>To find density of irregular object:</strong> Use water displacement method to find volume.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Voltage and Current</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>Voltage (V):</strong> Potential difference – measured by voltmeter (parallel). Unit: volts (V).</li>
              <li><strong>Current (I):</strong> Flow of charge – measured by ammeter (series). Unit: amperes (A).</li>
              <li><strong>Formula:</strong> Voltage = Energy / Charge (V = E / C).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Circuit Diagram</h4>
            <div className="mt-2">
              <img src={physicsImages.circuit} alt="Circuit diagram" className="mx-auto block max-h-[55vh] w-full max-w-lg rounded-xl object-contain" />
            </div>
            <p className="text-base text-slate-700 mt-1">Shows battery, switch, resistor (R), ammeter (A – series), and voltmeter (V – parallel).</p>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'forces',
    title: 'Forces and Motion',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>force</strong> is a push or a pull that can change a body's motion, shape, or size. The unit of force is the <strong>newton (N)</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Key Force Concepts</h4>
            <ul className="list-disc list-inside text-base text-slate-700 space-y-1">
              <li><strong>Mass (m):</strong> Amount of matter – measured in kg.</li>
              <li><strong>Weight (W):</strong> Force due to gravity – W = mg (g = 9.8 m/s²).</li>
              <li><strong>Friction:</strong> Force opposing motion – produces heat, wears materials.</li>
              <li><strong>Inertia:</strong> Tendency of an object to resist change in its state of motion.</li>
              <li><strong>Momentum:</strong> Mass in motion – p = mv (kg·m/s).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Newton's Laws</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>First Law:</strong> A body stays at rest or moves with uniform velocity unless acted on by an external force.</li>
              <li><strong>Second Law:</strong> Acceleration is proportional to force and inversely proportional to mass – F = ma.</li>
              <li><strong>Third Law:</strong> For every action, there is an equal and opposite reaction.</li>
            </ul>
            <div className="mt-2 p-2 bg-slate-50 rounded text-base">
              <strong>Example:</strong> A 10N force on a 15kg mass gives a = 10/15 = 0.67 m/s².
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Centre of Mass</h4>
            <p className="text-base text-slate-700">The point where the mass of an object is centred. Important in understanding stability and balance.</p>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'machines',
    title: 'Machines',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>machine</strong> makes work easier. Key principles: <strong>Mechanical Advantage (MA)</strong>, <strong>Velocity Ratio (VR)</strong>, and <strong>Efficiency</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Levers</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>MA = Load / Effort</strong></li>
              <li><strong>VR = Distance moved by effort / Distance moved by load</strong></li>
              <li><strong>Efficiency = (Work output / Work input) × 100%</strong></li>
              <li>Example: Effort 40N lifts 80N load → MA = 80/40 = 2.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Inclined Planes</h4>
            <p className="text-base text-slate-700">A sloping surface that reduces the effort needed to lift a load. Smaller angle = smaller effort.</p>
            <p className="text-base text-slate-700"><strong>VR = 1 / sin(θ)</strong></p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Pulleys</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>Single fixed pulley:</strong> MA = VR = 1 (changes direction).</li>
              <li><strong>Single movable pulley:</strong> MA = VR = 2.</li>
              <li><strong>Block and tackle:</strong> VR = number of pulleys.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Gears and Wheel & Axle</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>Gears:</strong> VR = Teeth on load / Teeth on effort.</li>
              <li><strong>Wheel & Axle:</strong> VR = Radius of wheel / Radius of axle.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Improving Efficiency</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>Lubrication (oil/grease)</li>
              <li>Using rollers or ball bearings</li>
              <li>Using lighter parts</li>
              <li>Making surfaces smooth</li>
            </ul>
            <p className="text-base text-slate-700 mt-1"><strong>Note:</strong> Friction is useful in brakes, for stopping, and for balance.</p>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'engines',
    title: 'Petrol and Diesel Engines',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Fuel engines convert <strong>chemical energy → heat energy → kinetic energy</strong>. Both petrol and diesel engines use internal combustion.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Petrol Engine Strokes</h4>
            <div className="mt-2">
              <img src={physicsImages.engineStrokes} alt="Engine strokes" className="w-full rounded-xl" />
            </div>
            <ol className="list-decimal list-inside text-base text-slate-700 mt-2">
              <li><strong>Intake:</strong> Piston down, air+fuel in.</li>
              <li><strong>Compression:</strong> Piston up, gas compressed.</li>
              <li><strong>Power/Ignition:</strong> Spark ignites fuel, piston down – drives crankshaft.</li>
              <li><strong>Exhaust:</strong> Piston up, gases out.</li>
            </ol>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Diesel Engine Strokes</h4>
            <ol className="list-decimal list-inside text-base text-slate-700">
              <li><strong>Induction:</strong> Air drawn in.</li>
              <li><strong>Compression:</strong> Air compressed (heats up).</li>
              <li><strong>Power/Ignition:</strong> Fuel injected, ignites spontaneously.</li>
              <li><strong>Exhaust:</strong> Gases out.</li>
            </ol>
            <p className="text-base text-slate-700 mt-1"><strong>Key difference:</strong> Diesel uses compression ignition (no spark plug).</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">The Crankshaft</h4>
            <p className="text-base text-slate-700">Converts the up‑and‑down motion of pistons into rotary motion to drive the wheels.</p>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'heat-transfer',
    title: 'Energy and Heat Transfer',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Heat is transferred by <strong>conduction</strong> (solids), <strong>convection</strong> (liquids/gases), and <strong>radiation</strong> (through empty space).
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Conduction</h4>
            <div className="mt-2">
              <img src={physicsImages.conduction} alt="Conduction experiment" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-base text-slate-700 mt-2">
              <li>Metals conduct heat better than non‑metals.</li>
              <li>Order of conductivity: copper → brass → aluminium → iron.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Convection</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>Occurs in liquids and gases.</li>
              <li>Heated fluid expands, becomes less dense, rises.</li>
              <li>Cooler fluid sinks – convection current.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Radiation</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>Heat transfer through vacuum.</li>
              <li><strong>Black/dull surfaces:</strong> Good absorbers and emitters.</li>
              <li><strong>White/shiny surfaces:</strong> Poor absorbers, good reflectors.</li>
              <li>Application: Milk/petrol tanks painted white to reflect heat.</li>
            </ul>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'electromagnetism',
    title: 'Electromagnetism',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Electromagnetism</strong> is the relationship between electricity and magnetism. A current‑carrying wire generates a magnetic field.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Motor Effect</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>A current‑carrying conductor in a magnetic field experiences a force.</li>
              <li><strong>DC Motor:</strong> Converts electrical energy → mechanical energy.</li>
              <li>Speed factors: current size, magnet strength, number of turns.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Generator Principle</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>A conductor moving in a magnetic field induces an electromotive force (emf).</li>
              <li><strong>DC Generator:</strong> Produces direct current (split‑ring commutator).</li>
              <li><strong>AC Generator:</strong> Produces alternating current (slip rings).</li>
            </ul>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'electrostatics',
    title: 'Electricity and Electrostatics',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Electrostatics</strong> is the study of static electricity – charge due to excess or deficiency of electrons.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Static Electricity</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li>Like charges repel, unlike charges attract.</li>
              <li><strong>Conductors:</strong> Allow electron flow (metals, carbon).</li>
              <li><strong>Insulators:</strong> Electrons firmly held (plastic, rubber, nylon).</li>
              <li>Charges generated by friction = triboelectricity.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Electroscope</h4>
            <div className="mt-2">
              <img src={physicsImages.electroscope} alt="Electroscope" className="w-full rounded-xl" />
            </div>
            <p className="text-base text-slate-700 mt-1">Detects static charges and their magnitude. Leaves diverge when charged.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Lightning</h4>
            <div className="mt-2">
              <img src={physicsImages.lightning} alt="Lightning conductor" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-base text-slate-700 mt-2">
              <li>Thunderclouds build up static charge.</li>
              <li><strong>Lightning conductor:</strong> Provides a safe path to ground.</li>
              <li><strong>Precautions:</strong> Avoid trees, high ground, metal objects; unplug electronics.</li>
            </ul>
          </div>
        </div>

      </div>
    ),
  },
  {
    id: 'ohm-law',
    title: 'Ohm\'s Law and Resistors',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Ohm's Law</strong> states that the current through a conductor is proportional to the potential difference across it, provided temperature remains constant: <strong>V = I × R</strong>.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Resistance</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>R = V / I</strong></li>
              <li><strong>Factors affecting resistance:</strong> Length (direct), cross‑sectional area (inverse), material, temperature.</li>
              <li><strong>Ohmic conductors:</strong> Metals obey Ohm's law.</li>
              <li><strong>Non‑ohmic:</strong> Semiconductors, diodes.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Resistors in Series and Parallel</h4>
            <div className="mt-2">
              <img src={physicsImages.resistors} alt="Resistors" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-base text-slate-700 mt-2">
              <li><strong>Series:</strong> Rₜ = R₁ + R₂ + R₃</li>
              <li><strong>Parallel:</strong> 1/Rₜ = 1/R₁ + 1/R₂</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-700">Power</h4>
            <ul className="list-disc list-inside text-base text-slate-700">
              <li><strong>Power (P) = Current × Voltage = I × V</strong></li>
              <li><strong>Electrical energy = Voltage × Current × Time = V × I × t</strong></li>
            </ul>
          </div>
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
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-slate-700">Data Presentation</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
            <li>Pie charts – proportions</li>
            <li>Bar graphs – comparisons</li>
            <li>Line graphs – trends</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📏</span>
            <h4 className="text-lg font-bold text-slate-700">Measurement</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
            <li>Length: ruler, vernier</li>
            <li>Density = mass/volume</li>
            <li>Current (A) – series</li>
            <li>Voltage (V) – parallel</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-slate-700">Forces & Machines</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
            <li>F = ma, W = mg</li>
            <li>MA = Load/Effort</li>
            <li>VR = distance ratio</li>
            <li>Efficiency = MA/VR × 100%</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <h4 className="text-lg font-bold text-slate-700">Heat Transfer</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
            <li>Conduction – solids</li>
            <li>Convection – fluids</li>
            <li>Radiation – vacuum</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <h4 className="text-lg font-bold text-slate-700">Electricity & Electromagnetism</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
            <li>V = IR (Ohm's Law)</li>
            <li>Series: Rₜ = R₁ + R₂; Parallel: 1/Rₜ = 1/R₁ + 1/R₂</li>
            <li>Motor: electrical → mechanical</li>
            <li>Generator: mechanical → electrical</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔋</span>
            <h4 className="text-lg font-bold text-slate-700">Engines & Electrostatics</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-base">
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
      <div className="w-full px-4 sm:px-6 md:px-8 relative flex items-center">
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap ${
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
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
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

      <div className="w-full px-4 sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-base">
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
                In the next section, we will learn about <span className="text-slate-700">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-slate-700">{sections[activeIndex + 1].title}</span>
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

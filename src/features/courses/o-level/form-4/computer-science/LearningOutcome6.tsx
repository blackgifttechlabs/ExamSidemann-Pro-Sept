import React, { useState, useRef } from 'react';
import ConceptExplainer from './ConceptExplainer';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Programming Language Generations
const langGenerationsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 470" role="img" aria-labelledby="pl-title pl-desc">
  <title id="pl-title">Programming language generations</title>
  <desc id="pl-desc">Five levels move from machine-oriented binary code toward higher abstraction, declarative problem solving and logic or constraint-based languages.</desc>
  <defs><linearGradient id="pl-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><linearGradient id="pl-line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#f97316"/><stop offset=".5" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient><filter id="pl-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter></defs>
  <rect width="900" height="470" rx="28" fill="url(#pl-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Programming Language Generations</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">“Generation” describes abstraction—not a strict replacement timeline</text>
  <path d="M85 235h730" stroke="url(#pl-line)" stroke-width="8" stroke-linecap="round"/>
  <g font-family="Inter,Arial,sans-serif" filter="url(#pl-shadow)" text-anchor="middle">
    <g><rect x="28" y="112" width="150" height="96" rx="18" fill="#fff"/><circle cx="103" cy="235" r="18" fill="#f97316" stroke="#fff" stroke-width="6"/><text x="103" y="140" font-size="12" font-weight="800" fill="#c2410c">1GL</text><text x="103" y="166" font-size="18" font-weight="800" fill="#0f172a">Machine code</text><text x="103" y="190" font-size="11" fill="#64748b">binary CPU instructions</text></g>
    <g><rect x="202" y="262" width="150" height="96" rx="18" fill="#fff"/><circle cx="277" cy="235" r="18" fill="#d97706" stroke="#fff" stroke-width="6"/><text x="277" y="290" font-size="12" font-weight="800" fill="#b45309">2GL</text><text x="277" y="316" font-size="18" font-weight="800" fill="#0f172a">Assembly</text><text x="277" y="340" font-size="11" fill="#64748b">mnemonics and addresses</text></g>
    <g><rect x="375" y="112" width="150" height="96" rx="18" fill="#fff"/><circle cx="450" cy="235" r="18" fill="#2563eb" stroke="#fff" stroke-width="6"/><text x="450" y="140" font-size="12" font-weight="800" fill="#1d4ed8">3GL</text><text x="450" y="166" font-size="18" font-weight="800" fill="#0f172a">High-level</text><text x="450" y="190" font-size="11" fill="#64748b">procedural languages</text></g>
    <g><rect x="548" y="262" width="150" height="96" rx="18" fill="#fff"/><circle cx="623" cy="235" r="18" fill="#0891b2" stroke="#fff" stroke-width="6"/><text x="623" y="290" font-size="12" font-weight="800" fill="#0e7490">4GL</text><text x="623" y="316" font-size="18" font-weight="800" fill="#0f172a">Declarative</text><text x="623" y="340" font-size="11" fill="#64748b">state the required result</text></g>
    <g><rect x="722" y="112" width="150" height="96" rx="18" fill="#fff"/><circle cx="797" cy="235" r="18" fill="#7c3aed" stroke="#fff" stroke-width="6"/><text x="797" y="140" font-size="12" font-weight="800" fill="#6d28d9">5GL</text><text x="797" y="166" font-size="18" font-weight="800" fill="#0f172a">Logic / constraints</text><text x="797" y="190" font-size="11" fill="#64748b">rules describe a solution</text></g>
  </g>
  <rect x="178" y="402" width="544" height="40" rx="20" fill="#172554"/><text x="450" y="427" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#dbeafe">MORE HARDWARE CONTROL  →  GREATER HUMAN-ORIENTED ABSTRACTION</text>
</svg>
`;

// Compiler vs Interpreter
const translatorSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 470" role="img" aria-labelledby="translator-title translator-desc">
  <title id="translator-title">Compiler and interpreter comparison</title>
  <desc id="translator-desc">A compiler translates an entire source program before execution and can produce executable object code, while an interpreter translates and executes statements during each run.</desc>
  <defs><linearGradient id="translator-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient><filter id="translator-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter><marker id="translator-arrow" markerWidth="11" markerHeight="11" refX="9" refY="5.5" orient="auto"><path d="M1 1l9 4.5L1 10z" fill="#64748b"/></marker></defs>
  <rect width="900" height="470" rx="28" fill="url(#translator-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Language Translators</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Both convert source code into instructions a processor can execute</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#translator-shadow)">
    <g><rect x="45" y="115" width="385" height="300" rx="24" fill="#fff"/><rect x="45" y="115" width="385" height="64" rx="24" fill="#2563eb"/><path d="M45 151h385v28H45z" fill="#2563eb"/><text x="238" y="155" text-anchor="middle" font-size="23" font-weight="800" fill="#fff">COMPILER</text><rect x="77" y="213" width="100" height="64" rx="13" fill="#dbeafe"/><text x="127" y="239" text-anchor="middle" font-size="12" font-weight="700" fill="#1d4ed8">WHOLE</text><text x="127" y="258" text-anchor="middle" font-size="11" fill="#1d4ed8">source program</text><path d="M177 245h62" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><rect x="239" y="213" width="82" height="64" rx="13" fill="#172554"/><text x="280" y="249" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">COMPILE</text><path d="M321 245h62" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><rect x="333" y="298" width="65" height="50" rx="12" fill="#d1fae5"/><text x="366" y="319" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">OBJECT /</text><text x="366" y="335" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">EXECUTABLE</text><path d="M383 245v53" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><text x="238" y="374" text-anchor="middle" font-size="13" fill="#334155">Errors reported after compilation</text><text x="238" y="397" text-anchor="middle" font-size="12" fill="#64748b">Compiled program can run repeatedly without source</text></g>
    <g><rect x="470" y="115" width="385" height="300" rx="24" fill="#fff"/><rect x="470" y="115" width="385" height="64" rx="24" fill="#7c3aed"/><path d="M470 151h385v28H470z" fill="#7c3aed"/><text x="663" y="155" text-anchor="middle" font-size="23" font-weight="800" fill="#fff">INTERPRETER</text><rect x="502" y="213" width="100" height="64" rx="13" fill="#ede9fe"/><text x="552" y="239" text-anchor="middle" font-size="12" font-weight="700" fill="#6d28d9">NEXT</text><text x="552" y="258" text-anchor="middle" font-size="11" fill="#6d28d9">source statement</text><path d="M602 245h62" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><rect x="664" y="213" width="82" height="64" rx="13" fill="#172554"/><text x="705" y="241" text-anchor="middle" font-size="11" font-weight="800" fill="#fff">TRANSLATE</text><text x="705" y="258" text-anchor="middle" font-size="10" fill="#bfdbfe">&amp; EXECUTE</text><path d="M746 245h62" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><circle cx="808" cy="323" r="29" fill="#d1fae5"/><path d="M808 274v20" stroke="#64748b" stroke-width="4" marker-end="url(#translator-arrow)"/><path d="M793 323l10 10 20-23" fill="none" stroke="#059669" stroke-width="5" stroke-linecap="round"/><text x="663" y="374" text-anchor="middle" font-size="13" fill="#334155">Stops and reports an error at the affected statement</text><text x="663" y="397" text-anchor="middle" font-size="12" fill="#64748b">Source and interpreter are required for each run</text></g>
  </g>
</svg>
`;

// Flowchart symbols
const flowchartSymbolsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="flow-symbol-title flow-symbol-desc">
  <title id="flow-symbol-title">Standard program flowchart symbols</title>
  <desc id="flow-symbol-desc">Cards show the standard shapes for terminal, process, input or output, decision, connector, predefined process and flow line.</desc>
  <defs><linearGradient id="flow-symbol-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><filter id="flow-symbol-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter><marker id="flow-symbol-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker></defs>
  <rect width="900" height="500" rx="28" fill="url(#flow-symbol-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Program Flowchart Symbols</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Use standard shapes consistently so an algorithm is unambiguous</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#flow-symbol-shadow)" text-anchor="middle">
    <g><rect x="35" y="112" width="195" height="145" rx="22" fill="#fff"/><rect x="72" y="143" width="121" height="52" rx="26" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><text x="133" y="174" font-size="13" font-weight="700" fill="#1d4ed8">START / END</text><text x="133" y="226" font-size="15" font-weight="800" fill="#0f172a">Terminal</text></g>
    <g><rect x="247" y="112" width="195" height="145" rx="22" fill="#fff"/><rect x="284" y="143" width="121" height="52" fill="#ede9fe" stroke="#7c3aed" stroke-width="3"/><text x="345" y="174" font-size="13" font-weight="700" fill="#6d28d9">CALCULATE</text><text x="345" y="226" font-size="15" font-weight="800" fill="#0f172a">Process</text></g>
    <g><rect x="459" y="112" width="195" height="145" rx="22" fill="#fff"/><path d="M513 143h121l-28 52H485z" fill="#cffafe" stroke="#0891b2" stroke-width="3"/><text x="559" y="174" font-size="13" font-weight="700" fill="#0e7490">READ / PRINT</text><text x="557" y="226" font-size="15" font-weight="800" fill="#0f172a">Input / Output</text></g>
    <g><rect x="671" y="112" width="195" height="145" rx="22" fill="#fff"/><path d="M769 134l58 35-58 35-58-35z" fill="#fef3c7" stroke="#d97706" stroke-width="3"/><text x="769" y="174" font-size="13" font-weight="700" fill="#92400e">VALID?</text><text x="769" y="226" font-size="15" font-weight="800" fill="#0f172a">Decision</text></g>
    <g><rect x="140" y="280" width="195" height="145" rx="22" fill="#fff"/><circle cx="238" cy="337" r="30" fill="#d1fae5" stroke="#059669" stroke-width="3"/><text x="238" y="343" font-size="15" font-weight="800" fill="#047857">A</text><text x="238" y="394" font-size="15" font-weight="800" fill="#0f172a">On-page connector</text></g>
    <g><rect x="353" y="280" width="195" height="145" rx="22" fill="#fff"/><rect x="390" y="311" width="121" height="52" fill="#fee2e2" stroke="#e11d48" stroke-width="3"/><path d="M403 311v52M498 311v52" stroke="#e11d48" stroke-width="3"/><text x="451" y="342" font-size="12" font-weight="700" fill="#be123c">SUBROUTINE</text><text x="451" y="394" font-size="15" font-weight="800" fill="#0f172a">Predefined process</text></g>
    <g><rect x="565" y="280" width="195" height="145" rx="22" fill="#fff"/><path d="M600 337h125" stroke="#2563eb" stroke-width="5" stroke-linecap="round" marker-end="url(#flow-symbol-arrow)"/><text x="663" y="394" font-size="15" font-weight="800" fill="#0f172a">Flow line</text></g>
  </g>
</svg>
`;

// SDLC cycle
const sdlcSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620" role="img" aria-labelledby="sdlc-title sdlc-desc">
  <title id="sdlc-title">Seven-stage systems development life cycle</title>
  <desc id="sdlc-desc">The cycle proceeds through problem identification, feasibility, analysis, design, implementation, conversion and maintenance, with review feeding future change.</desc>
  <defs><linearGradient id="sdlc-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><linearGradient id="sdlc-core" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1d4ed8"/><stop offset="1" stop-color="#7c3aed"/></linearGradient><filter id="sdlc-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter><marker id="sdlc-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#64748b"/></marker></defs>
  <rect width="900" height="620" rx="28" fill="url(#sdlc-bg)"/>
  <text x="450" y="50" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Systems Development Life Cycle</text>
  <text x="450" y="77" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">A controlled process for investigating, creating, introducing and improving a system</text>
  <g fill="none" stroke="#94a3b8" stroke-width="4" marker-end="url(#sdlc-arrow)"><path d="M520 140q105 8 145 66"/><path d="M730 250q30 70 5 123"/><path d="M690 425q-50 68-125 82"/><path d="M480 530H365"/><path d="M285 507q-75-17-110-82"/><path d="M150 373q-25-67 7-123"/><path d="M220 206q55-65 160-66"/></g>
  <g font-family="Inter,Arial,sans-serif" filter="url(#sdlc-shadow)">
    <circle cx="450" cy="330" r="92" fill="url(#sdlc-core)"/><text x="450" y="317" text-anchor="middle" font-size="31" font-weight="900" fill="#fff">SDLC</text><text x="450" y="345" text-anchor="middle" font-size="13" fill="#dbeafe">PLAN • BUILD • USE</text><text x="450" y="366" text-anchor="middle" font-size="13" fill="#dbeafe">REVIEW • IMPROVE</text>
    <g><rect x="340" y="105" width="220" height="78" rx="20" fill="#2563eb"/><circle cx="375" cy="144" r="20" fill="#fff" fill-opacity=".2"/><text x="375" y="151" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">1</text><text x="411" y="139" font-size="17" font-weight="800" fill="#fff">Problem identification</text><text x="411" y="160" font-size="11" fill="#dbeafe">define the need for change</text></g>
    <g><rect x="630" y="188" width="230" height="78" rx="20" fill="#7c3aed"/><circle cx="665" cy="227" r="20" fill="#fff" fill-opacity=".2"/><text x="665" y="234" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">2</text><text x="701" y="222" font-size="17" font-weight="800" fill="#fff">Feasibility study</text><text x="701" y="243" font-size="11" fill="#ede9fe">technical • economic • social</text></g>
    <g><rect x="650" y="372" width="210" height="78" rx="20" fill="#0891b2"/><circle cx="685" cy="411" r="20" fill="#fff" fill-opacity=".2"/><text x="685" y="418" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">3</text><text x="721" y="406" font-size="17" font-weight="800" fill="#fff">Analysis</text><text x="721" y="427" font-size="11" fill="#cffafe">study data, users and processes</text></g>
    <g><rect x="455" y="488" width="220" height="78" rx="20" fill="#059669"/><circle cx="490" cy="527" r="20" fill="#fff" fill-opacity=".2"/><text x="490" y="534" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">4</text><text x="526" y="522" font-size="17" font-weight="800" fill="#fff">System design</text><text x="526" y="543" font-size="11" fill="#d1fae5">specify inputs, outputs and files</text></g>
    <g><rect x="225" y="488" width="220" height="78" rx="20" fill="#d97706"/><circle cx="260" cy="527" r="20" fill="#fff" fill-opacity=".2"/><text x="260" y="534" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">5</text><text x="296" y="522" font-size="17" font-weight="800" fill="#fff">Implementation</text><text x="296" y="543" font-size="11" fill="#fef3c7">build, test and train users</text></g>
    <g><rect x="40" y="372" width="210" height="78" rx="20" fill="#e11d48"/><circle cx="75" cy="411" r="20" fill="#fff" fill-opacity=".2"/><text x="75" y="418" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">6</text><text x="111" y="406" font-size="17" font-weight="800" fill="#fff">Conversion</text><text x="111" y="427" font-size="11" fill="#ffe4e6">change from old to new</text></g>
    <g><rect x="40" y="188" width="230" height="78" rx="20" fill="#475569"/><circle cx="75" cy="227" r="20" fill="#fff" fill-opacity=".2"/><text x="75" y="234" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">7</text><text x="111" y="222" font-size="17" font-weight="800" fill="#fff">Maintenance</text><text x="111" y="243" font-size="11" fill="#e2e8f0">correct, adapt and improve</text></g>
  </g>
</svg>
`;

// Data Flow Diagram symbols
const dfdSymbolsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" role="img" aria-labelledby="dfd-title dfd-desc">
  <title id="dfd-title">Data flow diagram symbols</title>
  <desc id="dfd-desc">Standard symbols represent an external entity, a process, a data store and a labelled data flow.</desc>
  <defs><linearGradient id="dfd-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><filter id="dfd-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter><marker id="dfd-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker></defs>
  <rect width="900" height="420" rx="28" fill="url(#dfd-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Data Flow Diagram Symbols</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">A DFD shows where data comes from, how it changes, where it is stored, and where it goes</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#dfd-shadow)" text-anchor="middle">
    <g><rect x="35" y="118" width="195" height="235" rx="22" fill="#fff"/><rect x="76" y="165" width="113" height="72" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><text x="133" y="207" font-size="13" font-weight="700" fill="#1d4ed8">CUSTOMER</text><text x="133" y="281" font-size="17" font-weight="800" fill="#0f172a">External entity</text><text x="133" y="306" font-size="11" fill="#64748b">source or destination</text><text x="133" y="324" font-size="11" fill="#64748b">outside the system</text></g>
    <g><rect x="247" y="118" width="195" height="235" rx="22" fill="#fff"/><rect x="286" y="165" width="117" height="72" rx="28" fill="#ede9fe" stroke="#7c3aed" stroke-width="3"/><text x="345" y="195" font-size="11" font-weight="700" fill="#6d28d9">1.0</text><text x="345" y="216" font-size="13" font-weight="700" fill="#6d28d9">VALIDATE ORDER</text><text x="345" y="281" font-size="17" font-weight="800" fill="#0f172a">Process</text><text x="345" y="306" font-size="11" fill="#64748b">transforms incoming</text><text x="345" y="324" font-size="11" fill="#64748b">data into output data</text></g>
    <g><rect x="459" y="118" width="195" height="235" rx="22" fill="#fff"/><path d="M496 166h124M496 166v70M496 236h124" fill="#cffafe" stroke="#0891b2" stroke-width="3"/><text x="558" y="205" font-size="13" font-weight="700" fill="#0e7490">D1 ORDERS</text><text x="557" y="281" font-size="17" font-weight="800" fill="#0f172a">Data store</text><text x="557" y="306" font-size="11" fill="#64748b">data held for</text><text x="557" y="324" font-size="11" fill="#64748b">later retrieval</text></g>
    <g><rect x="671" y="118" width="195" height="235" rx="22" fill="#fff"/><path d="M703 202h131" stroke="#2563eb" stroke-width="5" marker-end="url(#dfd-arrow)"/><text x="768" y="183" font-size="11" font-weight="700" fill="#1d4ed8">ORDER DETAILS</text><text x="769" y="281" font-size="17" font-weight="800" fill="#0f172a">Data flow</text><text x="769" y="306" font-size="11" fill="#64748b">labelled data moving</text><text x="769" y="324" font-size="11" fill="#64748b">between components</text></g>
  </g>
</svg>
`;

// System flowchart symbols (simplified)
const systemFlowchartSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 420" role="img" aria-labelledby="system-symbol-title system-symbol-desc">
  <title id="system-symbol-title">System flowchart symbols</title>
  <desc id="system-symbol-desc">Standard symbols identify computer processing, a paper document, a manual operation, stored data and display output.</desc>
  <defs><linearGradient id="system-symbol-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient><filter id="system-symbol-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter></defs>
  <rect width="900" height="420" rx="28" fill="url(#system-symbol-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">System Flowchart Symbols</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">System flowcharts show physical inputs, processes, storage and outputs</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#system-symbol-shadow)" text-anchor="middle">
    <g><rect x="25" y="120" width="160" height="230" rx="22" fill="#fff"/><rect x="55" y="170" width="100" height="65" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/><text x="105" y="207" font-size="12" font-weight="700" fill="#1d4ed8">PROCESS</text><text x="105" y="284" font-size="16" font-weight="800" fill="#0f172a">Computer process</text><text x="105" y="309" font-size="10" fill="#64748b">automatic operation</text></g>
    <g><rect x="198" y="120" width="160" height="230" rx="22" fill="#fff"/><path d="M228 169h100v59c-17-14-33 14-50 0s-33 14-50 0z" fill="#ede9fe" stroke="#7c3aed" stroke-width="3"/><text x="278" y="201" font-size="12" font-weight="700" fill="#6d28d9">REPORT</text><text x="278" y="284" font-size="16" font-weight="800" fill="#0f172a">Document</text><text x="278" y="309" font-size="10" fill="#64748b">paper input or output</text></g>
    <g><rect x="371" y="120" width="160" height="230" rx="22" fill="#fff"/><path d="M401 169h100l-18 66h-64z" fill="#fef3c7" stroke="#d97706" stroke-width="3"/><text x="451" y="205" font-size="11" font-weight="700" fill="#92400e">MANUAL TASK</text><text x="451" y="284" font-size="16" font-weight="800" fill="#0f172a">Manual operation</text><text x="451" y="309" font-size="10" fill="#64748b">performed by a person</text></g>
    <g><rect x="544" y="120" width="160" height="230" rx="22" fill="#fff"/><path d="M574 181c0-17 100-17 100 0v49c0 17-100 17-100 0z" fill="#d1fae5" stroke="#059669" stroke-width="3"/><ellipse cx="624" cy="181" rx="50" ry="14" fill="#a7f3d0" stroke="#059669" stroke-width="3"/><text x="624" y="211" font-size="11" font-weight="700" fill="#047857">DATA FILE</text><text x="624" y="284" font-size="16" font-weight="800" fill="#0f172a">Stored data</text><text x="624" y="309" font-size="10" fill="#64748b">disk or database</text></g>
    <g><rect x="717" y="120" width="160" height="230" rx="22" fill="#fff"/><path d="M747 170h90l12 32-12 33h-90c12-20 12-45 0-65z" fill="#cffafe" stroke="#0891b2" stroke-width="3"/><text x="799" y="207" font-size="11" font-weight="700" fill="#0e7490">SCREEN</text><text x="797" y="284" font-size="16" font-weight="800" fill="#0f172a">Display</text><text x="797" y="309" font-size="10" fill="#64748b">visual soft-copy output</text></g>
  </g>
</svg>
`;

// Input validation and error-detection checks
const validationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-labelledby="validation-title validation-desc">
  <title id="validation-title">Input validation and error detection checks</title>
  <desc id="validation-desc">Type, range, presence, length and spelling checks test input rules; check digits detect identifier entry errors and parity detects transmission errors.</desc>
  <defs><linearGradient id="validation-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><filter id="validation-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter></defs>
  <rect width="900" height="520" rx="28" fill="url(#validation-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Validation and Error Detection</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Checks reject data that breaks a rule; they do not prove that accepted data is factually correct</text>
  <text x="55" y="119" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="800" fill="#1d4ed8">INPUT VALIDATION</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#validation-shadow)">
    <g><rect x="45" y="140" width="150" height="145" rx="20" fill="#fff"/><circle cx="78" cy="173" r="20" fill="#2563eb"/><text x="78" y="180" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">T</text><text x="110" y="174" font-size="17" font-weight="800" fill="#1d4ed8">Type</text><text x="70" y="220" font-size="12" fill="#334155">Expected data type</text><text x="70" y="244" font-size="11" fill="#64748b">e.g. number, date, text</text></g>
    <g><rect x="210" y="140" width="150" height="145" rx="20" fill="#fff"/><circle cx="243" cy="173" r="20" fill="#7c3aed"/><text x="243" y="180" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">R</text><text x="275" y="174" font-size="17" font-weight="800" fill="#6d28d9">Range</text><text x="235" y="220" font-size="12" fill="#334155">Between set limits</text><text x="235" y="244" font-size="11" fill="#64748b">e.g. mark 0–100</text></g>
    <g><rect x="375" y="140" width="150" height="145" rx="20" fill="#fff"/><circle cx="408" cy="173" r="20" fill="#059669"/><text x="408" y="180" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">P</text><text x="440" y="174" font-size="17" font-weight="800" fill="#047857">Presence</text><text x="400" y="220" font-size="12" fill="#334155">Required field entered</text><text x="400" y="244" font-size="11" fill="#64748b">rejects a blank value</text></g>
    <g><rect x="540" y="140" width="150" height="145" rx="20" fill="#fff"/><circle cx="573" cy="173" r="20" fill="#d97706"/><text x="573" y="180" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">L</text><text x="605" y="174" font-size="17" font-weight="800" fill="#b45309">Length</text><text x="565" y="220" font-size="12" fill="#334155">Correct character count</text><text x="565" y="244" font-size="11" fill="#64748b">e.g. 8-digit ID</text></g>
    <g><rect x="705" y="140" width="150" height="145" rx="20" fill="#fff"/><circle cx="738" cy="173" r="20" fill="#e11d48"/><text x="738" y="180" text-anchor="middle" font-size="16" font-weight="800" fill="#fff">S</text><text x="770" y="174" font-size="17" font-weight="800" fill="#be123c">Spelling</text><text x="730" y="220" font-size="12" fill="#334155">Compares with dictionary</text><text x="730" y="244" font-size="11" fill="#64748b">flags unknown words</text></g>
  </g>
  <text x="55" y="337" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="800" fill="#6d28d9">ERROR-DETECTION METHODS</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#validation-shadow)">
    <g><rect x="120" y="360" width="300" height="112" rx="21" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><circle cx="164" cy="416" r="25" fill="#ede9fe"/><text x="164" y="423" text-anchor="middle" font-size="18" font-weight="800" fill="#6d28d9">#</text><text x="205" y="405" font-size="18" font-weight="800" fill="#6d28d9">Check digit</text><text x="205" y="429" font-size="12" fill="#334155">Calculated from identifier digits</text><text x="205" y="450" font-size="11" fill="#64748b">detects common entry/transposition errors</text></g>
    <g><rect x="480" y="360" width="300" height="112" rx="21" fill="#fff" stroke="#bae6fd" stroke-width="2"/><circle cx="524" cy="416" r="25" fill="#cffafe"/><text x="524" y="423" text-anchor="middle" font-size="18" font-weight="800" fill="#0e7490">0/1</text><text x="565" y="405" font-size="18" font-weight="800" fill="#0e7490">Parity bit</text><text x="565" y="429" font-size="12" fill="#334155">Adds even or odd bit count</text><text x="565" y="450" font-size="11" fill="#64748b">detects some transmission errors</text></g>
  </g>
</svg>
`;

// Generic placeholder image loader
const foundationImage = (fileName: string) =>
  new URL(`../computer/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const progImages = {
  langGenerations: svgToDataUri(langGenerationsSvg),
  translator: svgToDataUri(translatorSvg),
  flowchartSymbols: svgToDataUri(flowchartSymbolsSvg),
  sdlc: svgToDataUri(sdlcSvg),
  dfdSymbols: svgToDataUri(dfdSymbolsSvg),
  systemFlowchart: svgToDataUri(systemFlowchartSvg),
  validation: svgToDataUri(validationSvg),
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
    id: 'part-a',
    title: 'Part A: Programming Languages and Translators',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>program</strong> is a set of instructions that tells a computer what to do. <strong>Programming</strong> is the process of designing, coding, and testing programs.
            </p>
          </div>

          <ConceptExplainer
            title="Programming-Language Levels and Translators"
            introduction="Language generations describe increasing abstraction from processor instructions toward problem statements. Higher abstraction normally improves human productivity, while lower levels expose more machine detail."
            accent="cyan"
            concepts={[
              {
                name: 'First Generation Language (1GL)',
                definition: 'Machine code represented as binary instruction and data patterns.',
                explanation: 'The processor executes machine instructions directly. A program is tied to one instruction-set architecture, difficult for humans to read and vulnerable to small coding errors.',
                examples: ['Binary load instruction', 'Binary arithmetic instruction', 'Binary branch instruction'],
                examTip: 'Machine code needs no language translator, although tools may still load or link it.',
              },
              {
                name: 'Second Generation Language (2GL)',
                definition: 'Assembly language using mnemonics, labels and symbolic operands.',
                explanation: 'Assembly closely maps to processor instructions and gives detailed hardware control. An assembler resolves symbols and produces machine/object code for the target architecture.',
                examples: ['MOV register instruction', 'ADD mnemonic', 'Label used by a branch'],
                examTip: 'Assembly is low level and machine dependent, but it is not written only as 0s and 1s.',
              },
              {
                name: 'Third Generation Language (3GL)',
                definition: 'General high-level language expressing algorithms with variables, procedures and control structures.',
                explanation: 'One statement can represent many machine instructions. Source is easier to develop and can often be moved between systems when an appropriate compiler or interpreter exists.',
                examples: ['Python', 'Java', 'C'],
                examTip: 'High-level source is more portable, not automatically independent of every library and platform.',
              },
              {
                name: 'Fourth Generation Language (4GL)',
                definition: 'Very high-level or domain-focused language that states a desired result with fewer procedural steps.',
                explanation: 'A 4GL often concentrates on databases, reports, analytics or application generation. The system chooses much of the detailed procedure, improving productivity for its specialised domain.',
                examples: ['SQL query', 'Report generator', 'Low-code database form tool'],
                examTip: 'SQL is declarative: it states what result is wanted more than every step used to obtain it.',
              },
              {
                name: 'Fifth Generation Language (5GL)',
                definition: 'A language or environment where problems are expressed through facts, rules or constraints.',
                explanation: 'The system searches for a solution consistent with the supplied knowledge or constraints. The category is associated with logic programming and AI but is not simply any program containing artificial intelligence.',
                examples: ['Prolog facts and rules', 'Constraint-solving language', 'Knowledge-based reasoning environment'],
                examTip: 'LISP is historically important in AI but is generally a high-level programming language, not automatically a 5GL by syntax.',
              },
              {
                name: 'Compiler',
                definition: 'A translator that analyses a complete source program and produces object code or another target form before normal execution.',
                explanation: 'Compilation can optimise code and report many diagnostics. A linker may then combine object files and libraries into an executable. The resulting program can run repeatedly without translating every source statement again.',
                examples: ['GCC for C', 'Rust compiler', 'Java compiler producing bytecode'],
                examTip: 'Compilation and linking are related but distinct stages.',
              },
              {
                name: 'Interpreter',
                definition: 'A system that executes source or intermediate instructions through an interpreting runtime.',
                explanation: 'It supports interactive testing and can stop close to the statement causing an error. The interpreting environment is needed at runtime, and repeated translation or dispatch can add overhead.',
                examples: ['CPython', 'JavaScript engine', 'BASIC interpreter'],
                examTip: 'Modern runtimes may combine interpretation and just-in-time compilation; use the syllabus distinction when comparing basics.',
              },
              {
                name: 'Assembler',
                definition: 'A translator that converts assembly mnemonics and labels into machine/object code.',
                explanation: 'The assembler calculates addresses, checks operands and creates relocatable object code or a machine image. Because instructions match a target architecture, the source is hardware dependent.',
                examples: ['NASM for x86', 'ARM assembler', 'Microcontroller assembler'],
                examTip: 'Always include assembler when asked to name the three main translators.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Language Generations</h4>
            <div className="mt-2">
              <img src={progImages.langGenerations} alt="Language generations" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>1GL:</strong> Machine code (0s and 1s) – fast, machine‑dependent</li>
              <li><strong>2GL:</strong> Assembly (mnemonics) – easier but still low‑level</li>
              <li><strong>3GL:</strong> High‑level (BASIC, COBOL, Pascal) – English‑like, problem‑oriented</li>
              <li><strong>4GL:</strong> Very high‑level (SQL) – non‑procedural</li>
              <li><strong>5GL:</strong> Logic or constraint-based problem solving (e.g., Prolog environments)</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Low Level vs High Level</h4>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr><th className="border p-2">Low Level</th><th className="border p-2">High Level</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Machine code or assembly mnemonics</td><td className="border p-2">More abstract problem-oriented statements</td></tr>
                <tr><td className="border p-2">Difficult to learn</td><td className="border p-2">Easier to understand</td></tr>
                <tr><td className="border p-2">Machine code executes directly; assembly requires an assembler</td><td className="border p-2">Requires a compiler, interpreter or runtime</td></tr>
                <tr><td className="border p-2">Machine dependent</td><td className="border p-2">Usually more portable between systems</td></tr>
                <tr><td className="border p-2">Detailed hardware control</td><td className="border p-2">Faster development and easier maintenance</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Translators</h4>
            <div className="mt-2">
              <img src={progImages.translator} alt="Translators" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Compiler:</strong> Translates entire program at once → object code. Faster execution, but slower first run.</li>
              <li><strong>Interpreter:</strong> Translates and executes line by line. Easier debugging, but slower for large programs.</li>
              <li><strong>Assembler:</strong> Converts assembly-language mnemonics and labels into machine/object code.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Language Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Source code – HLL program</li>
              <li>Object code – machine code</li>
              <li>Assembler – converts assembly</li>
              <li>Compiler – whole program</li>
              <li>Interpreter – line by line</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Top‑Down Design and Algorithms',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Top‑down design</strong> splits a program into smaller modules (subroutines). This makes development easier. An <strong>algorithm</strong> is a set of steps to solve a problem, expressed using flowcharts, pseudocode, or structure diagrams.
            </p>
          </div>

          <ConceptExplainer
            title="Algorithm Design from Problem to Modules"
            introduction="An algorithm must be finite, ordered and unambiguous. Top-down design controls complexity by moving from the whole problem to smaller modules that can be understood, tested and reused."
            accent="cyan"
            concepts={[
              {
                name: 'Top-Down Decomposition',
                definition: 'Breaking a large problem into smaller modules and refining each module until it is manageable.',
                explanation: 'The designer starts with the overall required result, identifies major tasks and repeatedly divides them. Clear module inputs, outputs and responsibilities reduce duplication and make team development easier.',
                examples: ['Input module', 'Calculate-results module', 'Print-report module'],
                examTip: 'A module should perform one coherent responsibility with a clear interface.',
              },
              {
                name: 'Algorithm',
                definition: 'A finite sequence of precise steps that transforms valid input into required output.',
                explanation: 'An algorithm should handle normal and boundary situations, finish after a finite number of steps and avoid dependence on one programming language unless implementation detail is required.',
                examples: ['Calculate an average', 'Find the largest value', 'Validate a password length'],
                examTip: 'Test the algorithm with a trace before translating it into code.',
              },
              {
                name: 'Pseudocode',
                definition: 'Structured language-independent notation resembling programming statements.',
                explanation: 'Pseudocode focuses on logic using meaningful identifiers, indentation and standard control words. It avoids decorative prose while remaining easier to change than compiled source code.',
                examples: ['INPUT Mark', 'IF Mark >= 50 THEN', 'FOR Index = 1 TO 10'],
                examTip: 'Keep one action per line and close every structure clearly.',
              },
              {
                name: 'Flowchart',
                definition: 'A diagram using standard symbols and arrows to show algorithm flow.',
                explanation: 'Terminals mark start/end, parallelograms represent input/output, rectangles show processing and diamonds show decisions. Crossing lines and ambiguous arrows should be avoided.',
                examples: ['Decision with Yes/No branches', 'Input symbol for a mark', 'Loop arrow returning to a test'],
                examTip: 'Write a question or condition inside a decision and label its outgoing branches.',
              },
              {
                name: 'Sequence',
                definition: 'Statements executed once in a specified order.',
                explanation: 'Sequence is the default flow: later calculations may depend on earlier assignments. Reordering steps can change the result even when every individual statement is valid.',
                examples: ['Read price', 'Calculate total', 'Display total'],
                examTip: 'Initialise accumulators before using them.',
              },
              {
                name: 'Selection',
                definition: 'Choosing one path according to a Boolean condition or matched case.',
                explanation: 'IF handles one- or two-way choices, nested IF handles dependent tests and CASE is useful when one expression has several discrete alternatives. Conditions should be complete and non-overlapping where required.',
                examples: ['IF age >= 18', 'IF…ELSE pass decision', 'CASE menu choice'],
                examTip: 'Test both true and false paths.',
              },
              {
                name: 'Iteration',
                definition: 'Repeating a block under count or condition control.',
                explanation: 'FOR suits a known count, WHILE tests before the body and may run zero times, and REPEAT…UNTIL tests after the body and therefore runs at least once. The loop must make progress toward termination.',
                examples: ['FOR ten marks', 'WHILE password is invalid', 'REPEAT menu UNTIL Exit'],
                examTip: 'Identify initial value, condition, body and update to avoid an infinite loop.',
              },
              {
                name: 'Trace Table and Dry Run',
                definition: 'Manually following an algorithm step by step while recording variable values and output.',
                explanation: 'A trace exposes logic errors, wrong initialisation and incorrect loop boundaries before coding. Columns should represent variables, conditions and outputs that change.',
                examples: ['Trace a running total', 'Trace a counter loop', 'Trace both branches of a decision'],
                examTip: 'Use the exact test data and record changes in execution order.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Flowchart Symbols</h4>
            <div className="mt-2">
              <img src={progImages.flowchartSymbols} alt="Flowchart symbols" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2">Common symbols: Terminal (start/end), Process, Input/Output, Decision, Connector, Pre‑defined process, Flow arrows.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Pseudocode Control Structures</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Sequence:</strong> Execute statements in order.</li>
              <li><strong>Selection:</strong> IF...THEN...ELSE or CASE.</li>
              <li><strong>Iteration:</strong> FOR...NEXT (known count), REPEAT...UNTIL (at least once), WHILE...WEND (maybe zero).</li>
            </ul>
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-slate-700">
              <strong>Example (WHILE):</strong><br />
              WHILE Count {'<'} 6 DO<br />
              &nbsp;&nbsp;Enter Number<br />
              &nbsp;&nbsp;Sum = Sum + Number<br />
              &nbsp;&nbsp;Count = Count + 1<br />
              ENDWHILE
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Structure Diagrams</h4>
            <p className="text-sm text-slate-700">Show module hierarchy (e.g., Process Numbers → Initialise, Accept, Process, Display, Exit). Each module can be further subdivided.</p>
            <PlaceholderImage placeholder="{structure_diagram}" alt="Structure diagram" />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Algorithm Tips</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Use modules for large problems</li>
              <li>Flowcharts show logic visually</li>
              <li>Pseudocode is language‑independent</li>
              <li>Structure diagrams show hierarchy</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Testing, Errors, and Validation',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Programs must be tested against expected results. <strong>Debugging</strong> locates and corrects
              defects. <strong>Validation</strong> checks whether input is sensible and follows rules; it does not
              prove that an accepted value is factually correct.
            </p>
          </div>

          <ConceptExplainer
            title="Errors, Testing and Data-Quality Controls"
            introduction="Testing should be planned before execution. Each case records input, the reason for choosing it, expected output and actual output. Validation, verification and transmission error detection solve different problems."
            accent="cyan"
            concepts={[
              {
                name: 'Syntax Error',
                definition: 'A violation of the grammar rules of the programming language.',
                explanation: 'The translator cannot correctly parse the statement and reports a diagnostic. Correcting syntax allows translation but does not prove that the algorithm is logically right.',
                examples: ['Missing closing bracket', 'Misspelled keyword', 'Invalid statement structure'],
                examTip: 'Syntax errors are normally detected by a translator before or during execution.',
              },
              {
                name: 'Logic Error',
                definition: 'A valid program instruction or algorithm that produces an unintended result.',
                explanation: 'The program can run normally, so planned expected results, traces and reviews are needed. The defect may be a wrong formula, condition, order or loop boundary.',
                examples: ['Adding instead of multiplying', 'Using > instead of >=', 'A loop repeats nine instead of ten times'],
                examTip: 'The translator usually cannot know the intended business rule.',
              },
              {
                name: 'Runtime Error',
                definition: 'A failure that occurs while the program is executing.',
                explanation: 'It may depend on particular data, missing resources or an unavailable service. Defensive checks and exception handling can produce a controlled message or recovery path.',
                examples: ['Division by zero', 'File not found', 'Attempt to access outside an array'],
                examTip: 'Give the triggering condition, not merely “the program crashes.”',
              },
              {
                name: 'Normal, Boundary and Invalid Test Data',
                definition: 'Purposefully selected cases representing ordinary values, limits and values that should be rejected.',
                explanation: 'For an allowed mark of 0–100, 50 is normal, 0 and 100 are boundaries, and −1 or 101 are invalid. Values just inside and outside limits expose comparison mistakes.',
                examples: ['Normal mark 65', 'Boundary marks 0 and 100', 'Invalid mark 101'],
                examTip: 'Write the expected result for every case, including the rejection message.',
              },
              {
                name: 'Validation',
                definition: 'Automatic checking that input satisfies predefined acceptability rules.',
                explanation: 'Type, range, length, format, presence and lookup checks reduce impossible or unsuitable values. A plausible value can still be the wrong real-world value.',
                examples: ['Age range 0–120', 'Required surname', 'Date format check'],
                examTip: 'Validation cannot prove that a correctly formatted date was copied accurately.',
              },
              {
                name: 'Verification',
                definition: 'Checking that data has been copied or entered exactly as the source intended.',
                explanation: 'Double entry compares two independent entries, while visual verification asks a person to compare displayed data with the source. Verification detects transcription difference but not false source data.',
                examples: ['Enter a password twice', 'Double-enter account data', 'Compare a screen record with a paper form'],
                examTip: 'Verification is about accurate copying; validation is about rule compliance.',
              },
              {
                name: 'Check Digit',
                definition: 'An extra digit calculated from the other digits of an identifier to detect common entry errors.',
                explanation: 'The receiving system recalculates the digit using the same weighting rule. A mismatch shows that the identifier was probably mistyped, but a matching digit does not authenticate the person or encrypt the number.',
                examples: ['ISBN check digit', 'Product identifier check digit', 'Account-reference check digit'],
                examTip: 'A check digit is an error-detection calculation, not a range check.',
              },
              {
                name: 'Parity Bit',
                definition: 'An additional bit selected so the total number of 1 bits follows an even- or odd-parity rule.',
                explanation: 'The receiver counts the bits and detects a parity mismatch. Simple parity detects every odd number of changed bits but can miss an even number, so stronger codes are used when higher assurance is needed.',
                examples: ['Even-parity byte', 'Odd-parity serial link', 'Detected single-bit transmission change'],
                examTip: 'Parity checks transmission corruption; it does not validate the meaning of a field.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Error Types</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Syntax:</strong> Violates language rules (caught by compiler).</li>
              <li><strong>Logic:</strong> Wrong algorithm – produces wrong results (not caught).</li>
              <li><strong>Runtime:</strong> Occurs during execution (e.g., division by zero).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Test Data Types</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Extreme:</strong> Boundary values (e.g., min/max).</li>
              <li><strong>Standard:</strong> Normal, expected values.</li>
              <li><strong>Abnormal:</strong> Outside range (should be rejected).</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Validation Checks</h4>
            <div className="mt-2">
              <img src={progImages.validation} alt="Validation checks" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Type check:</strong> Correct data type (numeric, text, date).</li>
              <li><strong>Range check:</strong> Value within acceptable limits.</li>
              <li><strong>Presence check:</strong> Mandatory fields not blank.</li>
              <li><strong>Length check:</strong> Correct number of characters.</li>
              <li><strong>Spell check:</strong> Compare against dictionary.</li>
            </ul>
            <p className="mt-3 rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">
              <strong>Separate error-detection controls:</strong> Check digits detect likely identifier-entry errors,
              while parity bits detect certain bit changes during transmission. They are not ordinary validation checks.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Testing Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Dry run – manual testing</li>
              <li>Debugging – finding errors</li>
              <li>Unit testing – individual modules</li>
              <li>System testing – whole program</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Systems Analysis and Design (SDLC)',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Systems Analysis and Design</strong> is the process of identifying problems in an existing system and designing a new solution. The <strong>Systems Development Life Cycle (SDLC)</strong> provides a structured approach.
            </p>
          </div>

          <ConceptExplainer
            title="Systems Development Life Cycle Explained"
            introduction="The SDLC is iterative: evidence from testing, users or operation can send the team back to earlier decisions. Each stage should produce documented outputs and obtain appropriate approval."
            accent="cyan"
            concepts={[
              {
                name: 'Problem Definition and Objectives',
                definition: 'Agreeing what is wrong, who is affected, the scope and measurable outcomes of change.',
                explanation: 'The analyst separates symptoms from causes and records constraints, stakeholders and success criteria. A vague objective such as “make it better” cannot guide evaluation.',
                examples: ['Reduce duplicate entry', 'Produce reports within one minute', 'Prevent unauthorised record access'],
                examTip: 'Objectives should be linked directly to identified problems.',
              },
              {
                name: 'Feasibility Study',
                definition: 'A preliminary assessment of whether a proposed solution is practical and worthwhile.',
                explanation: 'Technical, economic, operational, legal and schedule feasibility are considered along with risks and alternatives. The output recommends whether and how to proceed.',
                examples: ['Required hardware exists', 'Benefits justify lifetime cost', 'Users and procedures can support the change'],
                examTip: 'Feasibility asks whether the project should proceed, not how every screen will look.',
              },
              {
                name: 'Analysis and Requirements',
                definition: 'Studying the current system and specifying what the new system must achieve.',
                explanation: 'The analyst gathers facts, models data and processes, identifies controls and records functional and non-functional requirements without prematurely choosing every implementation detail.',
                examples: ['Required input fields', 'Maximum response time', 'Access-control requirement'],
                examTip: 'Analysis defines what is needed; design determines how it will be provided.',
              },
              {
                name: 'Fact-Finding',
                definition: 'Collecting evidence about current work, data, problems and stakeholder needs.',
                explanation: 'Interviews provide depth, questionnaires cover many people, observation reveals actual practice and document inspection provides objective examples. Sampling and workshops can supplement them.',
                examples: ['Interview accounts clerk', 'Observe order entry', 'Inspect current invoice'],
                examTip: 'Choose a method by explaining why its evidence suits the situation.',
              },
              {
                name: 'System Design',
                definition: 'Converting requirements into detailed plans for data, processes, interfaces, controls and infrastructure.',
                explanation: 'Design specifies inputs, outputs, database or file structures, validation, security, algorithms, hardware, software and testing approach. Prototypes can obtain early user feedback.',
                examples: ['Input-form design', 'Database relationship design', 'Backup and access-control design'],
                examTip: 'Every important requirement should be traceable to a design element.',
              },
              {
                name: 'Development and Testing',
                definition: 'Building configured or coded components and checking them against requirements.',
                explanation: 'Unit tests check modules, integration tests check interfaces, system tests check the complete solution and acceptance testing allows users to confirm fitness for purpose.',
                examples: ['Test validation module', 'Test application–database connection', 'User acceptance test of monthly report'],
                examTip: 'Testing should compare actual output with a pre-calculated expected result.',
              },
              {
                name: 'Implementation',
                definition: 'Preparing the organisation and technical environment to operate the new system.',
                explanation: 'Hardware and software are installed, data is cleaned and migrated, users are trained, procedures and support are established and access is configured before go-live.',
                examples: ['Install server', 'Migrate customer records', 'Train help-desk staff'],
                examTip: 'Implementation includes people, data and procedures—not only copying the program.',
              },
              {
                name: 'Conversion',
                definition: 'Changing operational work from the old system to the new system.',
                explanation: 'Direct, parallel, phased and pilot strategies balance speed, cost and risk differently. A rollback plan, reconciled data and support are needed regardless of the selected strategy.',
                examples: ['Overnight direct switch', 'Parallel payroll runs', 'Pilot at one branch'],
                examTip: 'Select a method from the organisation’s risk tolerance and ability to duplicate work.',
              },
              {
                name: 'Evaluation and Maintenance',
                definition: 'Assessing whether objectives were met and modifying the system throughout operation.',
                explanation: 'Corrective maintenance fixes defects, adaptive maintenance responds to environmental change and perfective maintenance improves performance or usability. Reviews compare real outcomes with original success criteria.',
                examples: ['Fix incorrect tax calculation', 'Adapt to a new operating system', 'Improve report speed'],
                examTip: 'Maintenance is planned continuing work, not proof that the original project failed.',
              },
              {
                name: 'DFD and System Flowchart Models',
                definition: 'Complementary diagrams showing logical data movement and physical processing resources.',
                explanation: 'A DFD shows external entities, processes, data stores and labelled data flows without program control sequence. A system flowchart shows documents, files, devices and manual or computer operations in an implementation.',
                examples: ['Customer external entity', 'Validate Order process', 'Printed invoice in a system flowchart'],
                examTip: 'A DFD arrow carries named data; it is not a program-control arrow.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">SDLC Stages</h4>
            <div className="mt-2">
              <img src={progImages.sdlc} alt="SDLC" className="w-full rounded-xl" />
            </div>
            <ol className="list-decimal list-inside text-sm text-slate-700 mt-2">
              <li><strong>Problem Identification:</strong> Recognise need for change.</li>
              <li><strong>Feasibility Study:</strong> Economic, technical, social feasibility.</li>
              <li><strong>Analysis:</strong> Study current system, gather facts.</li>
              <li><strong>Design:</strong> Plan new system (input, output, files, programs).</li>
              <li><strong>Implementation:</strong> Code, test, train users.</li>
              <li><strong>Conversion:</strong> Switch from old to new (parallel, direct, phased, pilot).</li>
              <li><strong>Maintenance:</strong> Review and update.</li>
            </ol>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Fact‑Finding Methods</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Interview:</strong> Face‑to‑face – rich detail but time‑consuming.</li>
              <li><strong>Questionnaire:</strong> Large samples – cheap but low response.</li>
              <li><strong>Observation:</strong> See system in action – but people may alter behaviour.</li>
              <li><strong>Record Inspection:</strong> Examine existing documents – accurate but tedious.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Data Flow Diagrams (DFD)</h4>
            <div className="mt-2">
              <img src={progImages.dfdSymbols} alt="DFD symbols" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2">Show movement of data between external entities, processes, and data stores.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">System Flowcharts</h4>
            <div className="mt-2">
              <img src={progImages.systemFlowchart} alt="System flowchart" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2">Show overall system flow, including manual and computer operations, documents, files, and displays.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">SDLC Quick Guide</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Problem → Feasibility → Analysis → Design → Implementation → Conversion → Maintenance</li>
              <li>Systems Analyst – key role</li>
              <li>Fact‑finding: interviews, questionnaires, observation, records</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: Implementation, Conversion, and Documentation',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              After design, the system is <strong>implemented</strong>, <strong>converted</strong>, and <strong>documented</strong>. User training and proper documentation are essential for success.
            </p>
          </div>

          <ConceptExplainer
            title="Putting a New System into Operation"
            introduction="Successful change combines a suitable conversion strategy with reconciled data, trained users, reliable support and documentation that remains current."
            accent="cyan"
            concepts={[
              {
                name: 'Direct Conversion',
                definition: 'The old system stops and the new system becomes operational at one planned point.',
                explanation: 'It is fast and avoids duplicate operation, but a serious failure can stop work because the old process is no longer running. It suits lower-risk or well-tested changes with a strong rollback plan.',
                examples: ['Switch after final backup', 'Weekend system replacement', 'Replace one simple standalone tool'],
                examTip: 'Direct is quick and relatively cheap operationally, but carries the greatest immediate risk.',
              },
              {
                name: 'Parallel Conversion',
                definition: 'Old and new systems operate together for a limited period.',
                explanation: 'Outputs can be compared and the old system remains a fallback. Duplicate entry, staffing and reconciliation make it expensive and burdensome, especially for high-volume work.',
                examples: ['Compare two payroll runs', 'Produce old and new invoices', 'Reconcile both stock systems'],
                examTip: 'Parallel is safe only when users genuinely maintain and compare both systems.',
              },
              {
                name: 'Phased Conversion',
                definition: 'Features, departments or processes move to the new system in planned stages.',
                explanation: 'Problems affect a limited part and lessons improve later stages. Temporary interfaces between old and new components can be complex, and full benefits arrive gradually.',
                examples: ['Introduce stock before payroll', 'Move one department each month', 'Enable modules in sequence'],
                examTip: 'A phase is part of the system; a pilot is a complete or substantial system at one site or group.',
              },
              {
                name: 'Pilot Conversion',
                definition: 'The new system is first operated by one representative site or user group.',
                explanation: 'Real use exposes problems before organisation-wide deployment. The pilot must be representative, supported and evaluated; unusual conditions elsewhere may still require changes.',
                examples: ['One bank branch', 'One school department', 'One regional warehouse'],
                examTip: 'Pilot limits the number of users or locations exposed first.',
              },
              {
                name: 'Data Migration and Reconciliation',
                definition: 'Extracting, cleaning, transforming and loading existing data into the new structure, then proving completeness.',
                explanation: 'Duplicates and invalid values should be resolved before conversion. Counts, totals, samples and exception reports are compared between old source and new database.',
                examples: ['Convert date formats', 'Remove duplicate customers', 'Reconcile account-balance totals'],
                examTip: 'Migration is not complete merely because a file copied without an error message.',
              },
              {
                name: 'User Documentation',
                definition: 'Guidance that helps end users complete tasks safely and recover from common problems.',
                explanation: 'It should match real screens and roles, use step-by-step procedures, explain messages and include support contacts. Accessible formats, search and screenshots improve usefulness.',
                examples: ['Getting-started guide', 'Backup procedure', 'Troubleshooting article'],
                examTip: 'Write for the user’s task and ability, not for the programmer.',
              },
              {
                name: 'Technical Documentation',
                definition: 'Detailed information needed to operate, support, audit and modify the system.',
                explanation: 'Architecture, data dictionary, algorithms, source modules, configuration, security, test evidence, interfaces and recovery procedures should be version controlled and updated with changes.',
                examples: ['Database schema', 'Program module specification', 'Disaster-recovery runbook'],
                examTip: 'Technical documentation supports future maintainers and administrators.',
              },
              {
                name: 'Training and Support',
                definition: 'Preparing users and support staff to perform their roles competently.',
                explanation: 'Classroom training gives focus, on-the-job training gives realistic practice, online learning supports flexible review and train-the-trainer scales knowledge. Competence should be checked rather than attendance alone.',
                examples: ['Hands-on classroom exercise', 'Supervised workplace task', 'Role-based online module'],
                examTip: 'Choose training by role, risk, number of users and available time.',
              },
              {
                name: 'Project Evidence and Evaluation',
                definition: 'A traceable record showing how the problem was analysed, solved, tested and reviewed.',
                explanation: 'Objectives, alternative solutions, design models, algorithms, test plans, sample output, documentation and evaluation should agree with one another. Evaluation uses evidence to judge each objective and recommend improvement.',
                examples: ['Requirement linked to a test', 'Annotated sample run', 'Evaluation against response-time objective'],
                examTip: 'Do not merely state “the project was successful”; compare evidence with each measurable objective.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Conversion Methods</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Parallel:</strong> Old and new run together – safe but expensive.</li>
              <li><strong>Direct (Abrupt):</strong> Switch overnight – risky but cheap.</li>
              <li><strong>Phased:</strong> Gradual introduction – less risk.</li>
              <li><strong>Pilot:</strong> Test in one department first – then roll out.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Documentation</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>User Documentation:</strong> For end‑users – installation, operation, backup, troubleshooting.</li>
              <li><strong>Technical Documentation:</strong> For programmers – algorithms, code listings, file structures, system flowcharts.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">User Training</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>On‑the‑job:</strong> Training at workplace – practical but distractions.</li>
              <li><strong>Classroom:</strong> External courses – expensive but focused.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Project Work (Paper 2)</h4>
            <p className="text-sm text-slate-700">Candidates must produce a documented project including:</p>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Problem statement (justify computerisation)</li>
              <li>Aims and objectives (linked to problems)</li>
              <li>Data flow in existing solution</li>
              <li>Description of existing solution</li>
              <li>Evaluation of existing and alternative solutions</li>
              <li>Overall plan (hierarchy chart, modules)</li>
              <li>Algorithms (flowcharts/pseudocode)</li>
              <li>Hardware/software requirements</li>
              <li>Testing (extreme, standard, abnormal data)</li>
              <li>User and technical documentation</li>
              <li>Sample runs and evaluation</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Key Points</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Conversion: parallel, direct, phased, pilot</li>
              <li>Documentation: user and technical</li>
              <li>Training: on‑the‑job or classroom</li>
              <li>Project: follows SDLC, includes all stages</li>
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
            <span className="text-2xl">🖥️</span>
            <h4 className="text-lg font-bold text-blue-700">Programming Languages</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>1GL: Machine code</li>
            <li>2GL: Assembly</li>
            <li>3GL: HLL (BASIC, COBOL)</li>
            <li>4GL: SQL, non‑procedural</li>
            <li>5GL: AI / Natural language</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-blue-700">Translators</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Compiler – whole program, object code</li>
            <li>Interpreter – line by line</li>
            <li>Assembler – assembly to machine</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-blue-700">Algorithms & Testing</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Flowcharts, pseudocode</li>
            <li>Errors: syntax, logic, runtime</li>
            <li>Validation: type, range, check digit</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📋</span>
            <h4 className="text-lg font-bold text-blue-700">SDLC & Documentation</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>SDLC: 7 stages</li>
            <li>Fact‑finding: interviews, questionnaires</li>
            <li>Conversion: parallel, direct, phased, pilot</li>
            <li>User & technical docs</li>
          </ul>
        </div>

        <div className="md:col-span-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📁</span>
            <h4 className="text-lg font-bold text-blue-700">Project Work</h4>
          </div>
          <p className="text-slate-700 mt-1">Follow SDLC: problem → analysis → design → implementation → conversion → maintenance. Produce algorithms, test with extreme/standard/abnormal data, document fully.</p>
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
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200'
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

interface LearningOutcome6Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome6: React.FC<LearningOutcome6Props> = ({
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
      <div className="bg-gradient-to-r from-cyan-600 to-blue-800 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            PROGRAMMING & SYSTEMS
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Programming Concepts & Systems Analysis
          </h1>
          <p className="text-lg text-cyan-100 max-w-2xl leading-relaxed">
            Learn about programming languages, translators, algorithms, testing, SDLC, system design, conversion methods, documentation, and project work.
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
          <div className="mt-12 p-6 bg-gradient-to-r from-cyan-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-cyan-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Programming Languages:</strong> Five generations – from machine code to AI. Low‑level is fast but hard; high‑level is easier but needs translation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Translators:</strong> Compilers translate whole program; interpreters do line by line. Assemblers convert assembly language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Algorithms & Testing:</strong> Use flowcharts, pseudocode, structure diagrams. Test with extreme, standard, abnormal data. Validate using type, range, presence, length, check digits, parity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">SDLC:</strong> Seven stages: Problem, Feasibility, Analysis, Design, Implementation, Conversion, Maintenance. Fact‑finding: interviews, questionnaires, observation, records.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Documentation & Projects:</strong> User and technical docs. Project follows SDLC with problem statement, aims, data flow, evaluation, algorithms, testing, and full documentation.</span>
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
                Next: <span className="text-cyan-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-cyan-600 text-white rounded-full font-bold hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200 hover:shadow-cyan-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export as LearningOutcome6
export default LearningOutcome6;

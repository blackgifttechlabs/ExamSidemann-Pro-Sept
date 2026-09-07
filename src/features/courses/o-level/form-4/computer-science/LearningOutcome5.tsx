import React, { useState, useRef } from 'react';
import ConceptExplainer from './ConceptExplainer';
import ProsConsComparison from './ProsConsComparison';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Data logging setup (pollution monitoring)
const dataLoggingSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="log-title log-desc">
  <title id="log-title">Environmental data logging system</title>
  <desc id="log-desc">Sensors measure the environment, an analogue-to-digital converter digitises readings, a data logger timestamps and stores them, and a computer analyses the results.</desc>
  <defs>
    <linearGradient id="log-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ecfeff"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <linearGradient id="log-river" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#38bdf8"/><stop offset="1" stop-color="#2563eb"/></linearGradient>
    <filter id="log-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="log-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#log-bg)"/>
  <text x="450" y="50" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Automatic Environmental Data Logging</text>
  <text x="450" y="77" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Example: continuously monitoring water quality downstream from a factory</text>
  <path d="M0 356c130-55 230 40 360-10s240 35 380-5 160-5 160-5v164H0z" fill="url(#log-river)" opacity=".18"/>
  <path d="M0 356c130-55 230 40 360-10s240 35 380-5 160-5 160-5" fill="none" stroke="url(#log-river)" stroke-width="9"/>
  <g font-family="Inter,Arial,sans-serif" filter="url(#log-shadow)">
    <g><rect x="35" y="165" width="145" height="132" rx="20" fill="#fff"/><path d="M67 261v-50l28 16v-30l28 16v48zM77 197v-32h18v42" fill="#64748b"/><path d="M86 156c-12-17 14-21 2-39M106 156c-12-17 14-21 2-39" fill="none" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/><text x="108" y="283" text-anchor="middle" font-size="12" font-weight="700" fill="#475569">MEASURING SITE</text></g>
    <g><rect x="210" y="165" width="145" height="132" rx="20" fill="#fff" stroke="#a7f3d0" stroke-width="2"/><circle cx="283" cy="218" r="30" fill="#d1fae5"/><path d="M283 198v40M263 218h40" stroke="#059669" stroke-width="5" stroke-linecap="round"/><text x="283" y="272" text-anchor="middle" font-size="16" font-weight="800" fill="#047857">SENSORS</text><text x="283" y="289" text-anchor="middle" font-size="10" fill="#64748b">pH • temperature • oxygen</text></g>
    <g><rect x="385" y="165" width="120" height="132" rx="20" fill="#fff" stroke="#fde68a" stroke-width="2"/><path d="M412 208c18-20 34 20 52 0v42c-18 20-34-20-52 0z" fill="none" stroke="#d97706" stroke-width="4"/><text x="445" y="272" text-anchor="middle" font-size="18" font-weight="800" fill="#b45309">ADC</text><text x="445" y="289" text-anchor="middle" font-size="10" fill="#64748b">analogue → digital</text></g>
    <g><rect x="535" y="165" width="140" height="132" rx="20" fill="#172554"/><rect x="565" y="193" width="80" height="50" rx="8" fill="#dbeafe"/><path d="M580 218h50" stroke="#2563eb" stroke-width="5" stroke-dasharray="7 5"/><text x="605" y="272" text-anchor="middle" font-size="17" font-weight="800" fill="#fff">DATA LOGGER</text><text x="605" y="289" text-anchor="middle" font-size="10" fill="#bfdbfe">samples • timestamps • stores</text></g>
    <g><rect x="705" y="165" width="160" height="132" rx="20" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><rect x="735" y="190" width="100" height="63" rx="8" fill="#dbeafe"/><path d="M748 236l20-16 18 8 32-25" fill="none" stroke="#2563eb" stroke-width="4"/><text x="785" y="272" text-anchor="middle" font-size="17" font-weight="800" fill="#1d4ed8">COMPUTER</text><text x="785" y="289" text-anchor="middle" font-size="10" fill="#64748b">analyses • graphs • alerts</text></g>
  </g>
  <path d="M180 231h30M355 231h30M505 231h30M675 231h30" stroke="#2563eb" stroke-width="5" marker-end="url(#log-arrow)"/>
  <g font-family="Inter,Arial,sans-serif" font-size="11" font-weight="700" fill="#475569" text-anchor="middle"><text x="370" y="210">analogue signal</text><text x="520" y="210">digital samples</text><text x="690" y="210">stored readings</text></g>
  <rect x="228" y="401" width="444" height="46" rx="23" fill="#fff" stroke="#bae6fd" stroke-width="2"/><text x="450" y="429" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="#0e7490">Continuous, automatic and consistent measurement at set intervals</text>
</svg>
`;

// Database types (relational, hierarchical, network)
const databaseTypesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="db-title db-desc">
  <title id="db-title">Database models</title>
  <desc id="db-desc">Relational databases use linked tables, hierarchical databases use a parent-child tree, and network databases allow records to have multiple relationships.</desc>
  <defs>
    <linearGradient id="db-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <filter id="db-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#db-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Database Models</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">A model defines how records are organised and related</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#db-shadow)">
    <g><rect x="40" y="112" width="260" height="325" rx="22" fill="#fff"/><rect x="40" y="112" width="260" height="58" rx="22" fill="#2563eb"/><path d="M40 148h260v22H40z" fill="#2563eb"/><text x="170" y="148" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">RELATIONAL</text><text x="170" y="199" text-anchor="middle" font-size="12" fill="#64748b">Tables linked using matching keys</text><rect x="67" y="227" width="166" height="84" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/><path d="M67 255h166M112 227v84" stroke="#93c5fd" stroke-width="2"/><text x="90" y="247" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">ID</text><text x="170" y="247" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">STUDENT</text><text x="90" y="276" text-anchor="middle" font-size="10" fill="#475569">101</text><text x="170" y="276" text-anchor="middle" font-size="10" fill="#475569">Tariro</text><text x="90" y="298" text-anchor="middle" font-size="10" fill="#475569">102</text><text x="170" y="298" text-anchor="middle" font-size="10" fill="#475569">Farai</text><path d="M233 269h18v70H215" fill="none" stroke="#2563eb" stroke-width="3"/><rect x="90" y="339" width="166" height="54" rx="10" fill="#eff6ff" stroke="#93c5fd" stroke-width="2"/><text x="173" y="362" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">RESULTS TABLE</text><text x="173" y="381" text-anchor="middle" font-size="10" fill="#475569">Student ID is the foreign key</text></g>
    <g><rect x="320" y="112" width="260" height="325" rx="22" fill="#fff"/><rect x="320" y="112" width="260" height="58" rx="22" fill="#d97706"/><path d="M320 148h260v22H320z" fill="#d97706"/><text x="450" y="148" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">HIERARCHICAL</text><text x="450" y="199" text-anchor="middle" font-size="12" fill="#64748b">One parent can have many children</text><path d="M450 250v35M450 285h-70v35M450 285h70v35M380 355v28M520 355v28" fill="none" stroke="#f59e0b" stroke-width="4"/><rect x="405" y="224" width="90" height="40" rx="12" fill="#f59e0b"/><text x="450" y="249" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">SCHOOL</text><rect x="335" y="320" width="90" height="40" rx="12" fill="#fef3c7"/><text x="380" y="345" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">FORM 3</text><rect x="475" y="320" width="90" height="40" rx="12" fill="#fef3c7"/><text x="520" y="345" text-anchor="middle" font-size="12" font-weight="700" fill="#92400e">FORM 4</text><circle cx="380" cy="393" r="16" fill="#fde68a"/><circle cx="520" cy="393" r="16" fill="#fde68a"/></g>
    <g><rect x="600" y="112" width="260" height="325" rx="22" fill="#fff"/><rect x="600" y="112" width="260" height="58" rx="22" fill="#7c3aed"/><path d="M600 148h260v22H600z" fill="#7c3aed"/><text x="730" y="148" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">NETWORK</text><text x="730" y="199" text-anchor="middle" font-size="12" fill="#64748b">Records can have several parents and links</text><path d="M665 260h130M665 360h130M665 260v100M795 260v100M665 260l130 100M795 260L665 360" fill="none" stroke="#a78bfa" stroke-width="4"/><circle cx="665" cy="260" r="24" fill="#7c3aed"/><circle cx="795" cy="260" r="24" fill="#7c3aed"/><circle cx="665" cy="360" r="24" fill="#7c3aed"/><circle cx="795" cy="360" r="24" fill="#7c3aed"/><g text-anchor="middle" font-size="9" font-weight="700" fill="#fff"><text x="665" y="264">A</text><text x="795" y="264">B</text><text x="665" y="364">C</text><text x="795" y="364">D</text></g></g>
  </g>
</svg>
`;

// File organisation types (serial, sequential, indexed, random)
const fileOrganisationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="org-title org-desc">
  <title id="org-title">File organisation methods</title>
  <desc id="org-desc">Serial records follow arrival order, sequential records follow key order, indexed sequential adds an index, and direct access locates a record by address or key.</desc>
  <defs>
    <linearGradient id="org-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <filter id="org-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="org-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1l8 4-8 4z" fill="#64748b"/></marker>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#org-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">File Organisation Methods</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">How records are arranged determines how they can be found and updated</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#org-shadow)">
    <g><rect x="35" y="115" width="195" height="310" rx="22" fill="#fff"/><circle cx="72" cy="153" r="22" fill="#2563eb"/><text x="72" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">1</text><text x="108" y="151" font-size="20" font-weight="800" fill="#1d4ed8">Serial</text><text x="132" y="194" text-anchor="middle" font-size="12" fill="#64748b">Stored in arrival order</text><g><rect x="65" y="225" width="134" height="34" rx="8" fill="#dbeafe"/><text x="132" y="247" text-anchor="middle" font-size="11" fill="#1e3a8a">K8 • K2 • K9 • K1</text><path d="M132 264v40" stroke="#64748b" stroke-width="3" marker-end="url(#org-arrow)"/></g><text x="132" y="333" text-anchor="middle" font-size="12" fill="#334155">Search from the beginning</text><text x="132" y="359" text-anchor="middle" font-size="11" fill="#64748b">Simple; slow retrieval</text><rect x="73" y="382" width="118" height="27" rx="14" fill="#dbeafe"/><text x="132" y="400" text-anchor="middle" font-size="10" font-weight="700" fill="#1d4ed8">Example: transaction log</text></g>
    <g><rect x="247" y="115" width="195" height="310" rx="22" fill="#fff"/><circle cx="284" cy="153" r="22" fill="#d97706"/><text x="284" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">2</text><text x="320" y="151" font-size="20" font-weight="800" fill="#b45309">Sequential</text><text x="344" y="194" text-anchor="middle" font-size="12" fill="#64748b">Sorted by a record key</text><rect x="277" y="225" width="134" height="34" rx="8" fill="#fef3c7"/><text x="344" y="247" text-anchor="middle" font-size="11" fill="#92400e">K1 • K2 • K8 • K9</text><path d="M344 264v40" stroke="#64748b" stroke-width="3" marker-end="url(#org-arrow)"/><text x="344" y="333" text-anchor="middle" font-size="12" fill="#334155">Process records in order</text><text x="344" y="359" text-anchor="middle" font-size="11" fill="#64748b">Good for batch processing</text><rect x="285" y="382" width="118" height="27" rx="14" fill="#fef3c7"/><text x="344" y="400" text-anchor="middle" font-size="10" font-weight="700" fill="#92400e">Example: payroll</text></g>
    <g><rect x="459" y="115" width="195" height="310" rx="22" fill="#fff"/><circle cx="496" cy="153" r="22" fill="#7c3aed"/><text x="496" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">3</text><text x="532" y="145" font-size="18" font-weight="800" fill="#6d28d9">Indexed-</text><text x="532" y="164" font-size="18" font-weight="800" fill="#6d28d9">sequential</text><text x="556" y="194" text-anchor="middle" font-size="12" fill="#64748b">Sorted records plus an index</text><rect x="486" y="221" width="54" height="82" rx="9" fill="#ede9fe"/><text x="513" y="241" text-anchor="middle" font-size="9" font-weight="700" fill="#6d28d9">INDEX</text><text x="513" y="261" text-anchor="middle" font-size="9" fill="#6d28d9">A → 1</text><text x="513" y="278" text-anchor="middle" font-size="9" fill="#6d28d9">M → 8</text><rect x="560" y="221" width="67" height="82" rx="9" fill="#f5f3ff"/><text x="594" y="244" text-anchor="middle" font-size="9" fill="#6d28d9">K1</text><text x="594" y="263" text-anchor="middle" font-size="9" fill="#6d28d9">K2</text><text x="594" y="282" text-anchor="middle" font-size="9" fill="#6d28d9">K8</text><path d="M540 261h20" stroke="#7c3aed" stroke-width="3" marker-end="url(#org-arrow)"/><text x="556" y="333" text-anchor="middle" font-size="12" fill="#334155">Sequential or direct access</text><text x="556" y="359" text-anchor="middle" font-size="11" fill="#64748b">Index requires maintenance</text><rect x="497" y="382" width="118" height="27" rx="14" fill="#ede9fe"/><text x="556" y="400" text-anchor="middle" font-size="10" font-weight="700" fill="#6d28d9">Example: stock file</text></g>
    <g><rect x="671" y="115" width="195" height="310" rx="22" fill="#fff"/><circle cx="708" cy="153" r="22" fill="#059669"/><text x="708" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">4</text><text x="744" y="151" font-size="20" font-weight="800" fill="#047857">Direct</text><text x="768" y="194" text-anchor="middle" font-size="12" fill="#64748b">Jump straight to a location</text><circle cx="768" cy="264" r="55" fill="#d1fae5" stroke="#34d399" stroke-width="4"/><path d="M768 209v110M713 264h110M729 225l78 78M807 225l-78 78" stroke="#6ee7b7" stroke-width="2"/><circle cx="795" cy="237" r="9" fill="#059669"/><path d="M768 264l27-27" stroke="#047857" stroke-width="4" marker-end="url(#org-arrow)"/><text x="768" y="343" text-anchor="middle" font-size="12" fill="#334155">Address/key locates record</text><text x="768" y="365" text-anchor="middle" font-size="11" fill="#64748b">Fast on direct-access media</text><rect x="709" y="382" width="118" height="27" rx="14" fill="#d1fae5"/><text x="768" y="400" text-anchor="middle" font-size="10" font-weight="700" fill="#047857">Example: reservation</text></g>
  </g>
</svg>
`;

// File updating - grandfather-father-son
const fileGenerationsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="generation-title generation-desc">
  <title id="generation-title">Grandfather father son file updating</title>
  <desc id="generation-desc">A current master file and transaction file are processed to create a new master while three dated generations are retained for recovery.</desc>
  <defs>
    <linearGradient id="generation-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <filter id="generation-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
    <marker id="generation-arrow" markerWidth="12" markerHeight="12" refX="9" refY="6" orient="auto"><path d="M1 1l10 5-10 5z" fill="#2563eb"/></marker>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#generation-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Sequential File Updating</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">The update run creates a new master without overwriting the previous version</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#generation-shadow)">
    <rect x="55" y="135" width="190" height="100" rx="21" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><text x="150" y="171" text-anchor="middle" font-size="18" font-weight="800" fill="#1d4ed8">CURRENT MASTER</text><text x="150" y="197" text-anchor="middle" font-size="12" fill="#64748b">existing permanent records</text><text x="150" y="216" text-anchor="middle" font-size="11" fill="#64748b">read sequentially</text>
    <rect x="55" y="265" width="190" height="100" rx="21" fill="#fff" stroke="#fde68a" stroke-width="2"/><text x="150" y="301" text-anchor="middle" font-size="18" font-weight="800" fill="#b45309">TRANSACTIONS</text><text x="150" y="327" text-anchor="middle" font-size="12" fill="#64748b">add • amend • delete</text><text x="150" y="346" text-anchor="middle" font-size="11" fill="#64748b">sorted into the same key order</text>
    <path d="M245 185l95 65M245 315l95-65" stroke="#2563eb" stroke-width="5" marker-end="url(#generation-arrow)"/>
    <rect x="340" y="185" width="185" height="130" rx="24" fill="#172554"/><path d="M382 225h101M382 250h101M382 275h70" stroke="#93c5fd" stroke-width="7" stroke-linecap="round"/><text x="433" y="341" text-anchor="middle" font-size="13" font-weight="800" fill="#1e3a8a">UPDATE / MERGE PROCESS</text>
    <path d="M525 250h80" stroke="#2563eb" stroke-width="5" marker-end="url(#generation-arrow)"/>
    <rect x="605" y="185" width="240" height="130" rx="24" fill="#059669"/><text x="725" y="228" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">NEW MASTER FILE</text><text x="725" y="257" text-anchor="middle" font-size="13" fill="#d1fae5">updated permanent records</text><rect x="647" y="275" width="156" height="25" rx="13" fill="#fff" fill-opacity=".18"/><text x="725" y="292" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">validated before becoming current</text>
  </g>
  <text x="450" y="391" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="800" fill="#0f172a">Retained backup generations</text>
  <path d="M245 438h410" stroke="#cbd5e1" stroke-width="5" stroke-linecap="round"/>
  <g font-family="Inter,Arial,sans-serif" text-anchor="middle"><circle cx="280" cy="438" r="17" fill="#94a3b8"/><text x="280" y="442" font-size="11" font-weight="800" fill="#fff">G</text><text x="280" y="474" font-size="12" font-weight="700" fill="#475569">Grandfather</text><circle cx="450" cy="438" r="17" fill="#d97706"/><text x="450" y="442" font-size="11" font-weight="800" fill="#fff">F</text><text x="450" y="474" font-size="12" font-weight="700" fill="#92400e">Father</text><circle cx="620" cy="438" r="17" fill="#2563eb"/><text x="620" y="442" font-size="11" font-weight="800" fill="#fff">S</text><text x="620" y="474" font-size="12" font-weight="700" fill="#1d4ed8">Son (newest)</text></g>
</svg>
`;

// Fixed vs variable length records
const fixedVariableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 430" role="img" aria-labelledby="record-title record-desc">
  <title id="record-title">Fixed and variable length records</title>
  <desc id="record-desc">Fixed records reserve equal space for every record, while variable records use only the space required and need length information or delimiters.</desc>
  <defs>
    <linearGradient id="record-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <filter id="record-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="430" rx="28" fill="url(#record-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Record Structures</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">A record’s length controls storage use and the complexity of locating the next record</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#record-shadow)">
    <g><rect x="45" y="115" width="385" height="255" rx="22" fill="#fff"/><text x="72" y="151" font-size="21" font-weight="800" fill="#1d4ed8">FIXED LENGTH</text><text x="72" y="176" font-size="12" fill="#64748b">Every record reserves the same number of bytes</text><g><rect x="72" y="211" width="100" height="62" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/><rect x="186" y="211" width="100" height="62" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/><rect x="300" y="211" width="100" height="62" rx="10" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/></g><g text-anchor="middle" font-size="11" font-weight="700" fill="#1e3a8a"><text x="122" y="239">RECORD 1</text><text x="122" y="258">40 bytes</text><text x="236" y="239">RECORD 2</text><text x="236" y="258">40 bytes</text><text x="350" y="239">RECORD 3</text><text x="350" y="258">40 bytes</text></g><rect x="72" y="306" width="145" height="35" rx="18" fill="#d1fae5"/><text x="145" y="328" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">✓ Simple direct calculation</text><rect x="230" y="306" width="170" height="35" rx="18" fill="#fee2e2"/><text x="315" y="328" text-anchor="middle" font-size="11" font-weight="700" fill="#b91c1c">! May waste unused space</text></g>
    <g><rect x="470" y="115" width="385" height="255" rx="22" fill="#fff"/><text x="497" y="151" font-size="21" font-weight="800" fill="#6d28d9">VARIABLE LENGTH</text><text x="497" y="176" font-size="12" fill="#64748b">Each record uses the bytes its fields require</text><g><rect x="497" y="211" width="72" height="62" rx="10" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/><rect x="583" y="211" width="130" height="62" rx="10" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/><rect x="727" y="211" width="100" height="62" rx="10" fill="#ede9fe" stroke="#a78bfa" stroke-width="2"/></g><g text-anchor="middle" font-size="11" font-weight="700" fill="#5b21b6"><text x="533" y="239">REC 1</text><text x="533" y="258">18 B</text><text x="648" y="239">RECORD 2</text><text x="648" y="258">52 bytes</text><text x="777" y="239">RECORD 3</text><text x="777" y="258">34 bytes</text></g><rect x="497" y="306" width="145" height="35" rx="18" fill="#d1fae5"/><text x="570" y="328" text-anchor="middle" font-size="11" font-weight="700" fill="#047857">✓ Uses space efficiently</text><rect x="655" y="306" width="172" height="35" rx="18" fill="#fef3c7"/><text x="741" y="328" text-anchor="middle" font-size="11" font-weight="700" fill="#92400e">! Needs length/delimiter data</text></g>
  </g>
</svg>
`;

// Generic placeholder image loader
const foundationImage = (fileName: string) =>
  new URL(`../computer/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const dataImages = {
  dataLogging: svgToDataUri(dataLoggingSvg),
  databaseTypes: svgToDataUri(databaseTypesSvg),
  fileOrganisation: svgToDataUri(fileOrganisationSvg),
  fileGenerations: svgToDataUri(fileGenerationsSvg),
  fixedVariable: svgToDataUri(fixedVariableSvg),
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
    title: 'Part A: Data Logging',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Data logging</strong> is the process of automatically collecting data from a source at set intervals for later use. A <strong>data logger</strong> is a device that does this, featuring a processor, storage, and sensors.
            </p>
          </div>

          <ConceptExplainer
            title="How a Data-Logging System Works"
            introduction="Data logging is more than connecting a sensor. A complete system must measure the correct variable, condition and convert the signal, sample at sensible intervals, timestamp and store readings, then present or act on reliable information."
            accent="emerald"
            concepts={[
              {
                name: 'Sensor',
                definition: 'An input transducer that detects a physical condition and produces a corresponding signal.',
                explanation: 'The chosen sensor must have the required range, sensitivity, response time and environmental protection. Many sensors produce an analogue voltage or current that changes with the measured variable.',
                examples: ['Temperature sensor', 'pH probe', 'Light sensor'],
                examTip: 'Name the physical variable, not only “a sensor.”',
              },
              {
                name: 'Signal Conditioning and ADC',
                definition: 'Preparing an analogue sensor signal and converting sampled values into binary numbers.',
                explanation: 'Signal conditioning may amplify, filter or isolate the signal. The ADC samples it and assigns a digital value; sampling rate and resolution determine how faithfully change can be represented.',
                examples: ['Amplifying a weak probe signal', 'Filtering electrical noise', 'Converting voltage into a digital reading'],
                examTip: 'The ADC comes before digital processing and is needed only when the source signal is analogue.',
              },
              {
                name: 'Sampling and Timing',
                definition: 'Measuring and recording a variable at planned moments.',
                explanation: 'The interval must be short enough to capture important change but not so short that it creates wasteful duplicate data. A real-time clock attaches timestamps for sequence and comparison.',
                examples: ['Temperature every minute', 'River level every fifteen minutes', 'Vibration thousands of times per second'],
                examTip: 'A suitable interval depends on how rapidly the variable can change.',
              },
              {
                name: 'Data Logger and Storage',
                definition: 'A processor-controlled device that collects, timestamps and stores readings.',
                explanation: 'A logger can operate independently near sensors and later transfer records to a computer. It needs sufficient storage, reliable power and protection against environmental damage or unauthorised access.',
                examples: ['Portable field logger', 'Weather-station logger', 'Industrial multi-channel logger'],
                examTip: 'The logger stores repeated readings; the sensor performs the measurement.',
              },
              {
                name: 'Calibration and Data Quality',
                definition: 'Checking measurements against a trusted reference and correcting systematic error.',
                explanation: 'Sensors can drift, become dirty or respond incorrectly outside their range. Calibration, maintenance, range checks and comparison with expected patterns help prevent precise-looking but false data.',
                examples: ['Calibrating a pH probe', 'Zeroing a pressure sensor', 'Comparing two temperature probes'],
                examTip: 'Automatic collection reduces typing errors but does not guarantee sensor accuracy.',
              },
              {
                name: 'Analysis, Alert and Control',
                definition: 'Turning logged readings into graphs, summaries, warnings or automatic actions.',
                explanation: 'Software can calculate trends, compare thresholds and notify an operator. In a control system, the processor uses feedback to command an actuator, while a pure logging system may only record for later analysis.',
                examples: ['Pollution trend graph', 'High-temperature alarm', 'Cooling valve opened by a controller'],
                examTip: 'Logging records; control changes the physical process through an actuator.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Data Logger Features</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li>Contains a processor and storage</li>
              <li>Uses sensors to collect data</li>
              <li>Connects to an ADC (Analogue‑to‑Digital Converter)</li>
              <li>Can work 24/7, very fast and accurate</li>
            </ul>
            <div className="mt-3">
              <img src={dataImages.dataLogging} alt="Data logging setup" className="w-full rounded-xl" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Example: Pollution Monitoring</h4>
            <p className="text-sm text-slate-700">Sensors (pH, temperature, dissolved oxygen) placed downstream of a factory detect pollution levels. Their analogue signals are converted to digital values by an ADC, sampled and stored by the data logger, then analysed on a computer. If levels exceed thresholds, alerts are triggered.</p>
            <div className="mt-4">
              <ProsConsComparison
                title="Data Logging Advantages and Disadvantages"
                advantages={[
                  'Measurements can be collected automatically at fixed intervals.',
                  'The system can operate continuously throughout the day and night.',
                  'Automatic capture reduces transcription mistakes from manual entry.',
                  'Readings are timestamped consistently.',
                  'Sensors can collect data in dangerous or inaccessible locations.',
                  'Large numbers of readings can be stored for later analysis.',
                  'Software can graph results and reveal trends quickly.',
                  'Thresholds can trigger immediate warnings or control actions.',
                  'Several sensors can monitor different variables at the same time.',
                  'Repeated automatic measurements make experiments easier to reproduce.',
                ]}
                disadvantages={[
                  'Sensors, interfaces, loggers, and software can be expensive.',
                  'Sensors require calibration to remain accurate.',
                  'A failed or dirty sensor may record misleading values.',
                  'Power loss can interrupt collection unless backup power is provided.',
                  'Storage can fill when readings are collected very frequently.',
                  'Equipment must be protected from weather, damage, and theft.',
                  'Incorrect sampling intervals may miss important changes or create unnecessary data.',
                  'Analogue signals can be affected by noise before conversion.',
                  'Specialist knowledge may be needed to install and maintain the system.',
                  'Automatic readings still require human interpretation and validation.',
                ]}
              />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Nuclear Reactor Monitoring</h4>
            <p className="text-sm text-slate-700">Sensors (pressure, temperature, radiation, gas) monitor the core. ADC converts signals. The computer uses feedback to control gas flow, ensuring safety.</p>
            <PlaceholderImage placeholder="{reactor}" alt="Reactor monitoring" />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Data Logging Key Points</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Automatic data collection</li>
              <li>Sensors + ADC + data logger</li>
              <li>Used in environmental monitoring, reactors</li>
              <li>Fast, accurate, continuous</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Data Capturing and Coding',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Data capturing</strong> is the process of collecting and converting source data into machine‑sensible form. Methods include key‑to‑disk, voice recognition, OMR, OCR, MICR, barcodes, and turnaround documents.
            </p>
          </div>

          <ConceptExplainer
            title="Data-Capture Methods Explained"
            introduction="Source-data automation usually improves speed and removes retyping, but every method must match the source document or signal. Captured data still needs validation and, where appropriate, verification."
            accent="emerald"
            concepts={[
              {
                name: 'Key-to-Disk Entry',
                definition: 'A person reads source data and types it directly into a computer system.',
                explanation: 'It accepts flexible text and numbers but requires operator time and can introduce transcription errors. On-screen validation and double-entry verification can improve quality.',
                examples: ['Typing a registration form', 'Entering an invoice', 'Recording survey answers'],
                examTip: 'It is data capture, not automatic source-data capture.',
              },
              {
                name: 'Optical Mark Recognition (OMR)',
                definition: 'Detection of filled positions on a specially designed document.',
                explanation: 'The reader identifies which answer bubbles or boxes are darkened. It is fast for high volumes but cannot interpret arbitrary handwriting and needs accurately designed forms.',
                examples: ['Multiple-choice answer sheet', 'Survey tick boxes', 'Attendance form'],
                examTip: 'OMR identifies mark position; OCR recognises characters.',
              },
              {
                name: 'Optical Character Recognition (OCR)',
                definition: 'Software conversion of character images into editable or searchable text.',
                explanation: 'A scanner or camera first creates an image, then OCR analyses shapes. Fonts, handwriting, skew and poor image quality can cause recognition errors that need checking.',
                examples: ['Digitising a printed book', 'Reading a printed account number', 'Making a scanned document searchable'],
                examTip: 'Scanning alone produces an image; OCR adds character recognition.',
              },
              {
                name: 'Magnetic Ink Character Recognition (MICR)',
                definition: 'Reading characters printed with magnetisable ink in a standard font.',
                explanation: 'MICR readers detect the magnetic pattern even when the document contains marks or stamps. It was designed for reliable high-volume cheque processing.',
                examples: ['Cheque routing code', 'Cheque account number', 'Bank document sorting'],
                examTip: 'Mention magnetic ink and the banking/cheque context.',
              },
              {
                name: 'Barcode and Smart-Code Capture',
                definition: 'Reading a machine-readable symbol that identifies an item or links to stored data.',
                explanation: 'A barcode scanner decodes bars or a two-dimensional pattern. The code usually supplies an identifier, and the application retrieves description, price or stock details from a database.',
                examples: ['Retail product barcode', 'Library book code', 'QR-coded event ticket'],
                examTip: 'The price is normally in the database, not permanently encoded in an ordinary product barcode.',
              },
              {
                name: 'Voice Recognition',
                definition: 'Converting spoken audio into commands or text.',
                explanation: 'The microphone captures sound and recognition software matches audio patterns to language. Background noise, accents, specialist vocabulary and privacy affect accuracy and suitability.',
                examples: ['Dictating a report', 'Hands-free command', 'Creating live captions'],
                examTip: 'Differentiate recording audio from recognising its words.',
              },
              {
                name: 'Turnaround Document',
                definition: 'Output produced by one processing cycle that is completed and later returned as input.',
                explanation: 'The computer prints identifiers or machine-readable areas; a customer adds information or payment; the returned document is scanned to update the original account accurately.',
                examples: ['Utility bill payment slip', 'Subscription renewal form', 'Order form with customer code'],
                examTip: 'It “turns around” from computer output back into computer input.',
              },
              {
                name: 'Data Coding',
                definition: 'Representing longer categories with short standard codes.',
                explanation: 'A good code is unique, consistent, documented, easy to validate and long enough for future categories. Coding speeds entry and comparison but users need a lookup or clear meaning.',
                examples: ['Department code SCI', 'Airport code HRE', 'Status code P for pending'],
                examTip: 'Codes represent categories; encryption is intended to conceal meaning.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Data Capturing Techniques</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Key‑to‑disk:</strong> Manual entry via keyboard</li>
              <li><strong>Voice Recognition:</strong> Speech input</li>
              <li><strong>OMR / OCR / MICR:</strong> Automated document reading</li>
              <li><strong>Barcodes / Kimball Tags:</strong> Product identification</li>
              <li><strong>Turnaround Document:</strong> Computer‑produced document used as input (e.g., bills)</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Coding Data</h4>
            <p className="text-sm text-slate-700">Coding shortens data for faster entry and smaller files. Examples: F/M for sex, colour codes.</p>
            <p className="text-sm text-slate-700 mt-1"><strong>Features:</strong> Same length, easy to use, unique.</p>
            <PlaceholderImage placeholder="{coding}" alt="Data coding example" />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Capturing Methods</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Keyboard – manual</li>
              <li>OMR – marks</li>
              <li>OCR – characters</li>
              <li>MICR – magnetic ink</li>
              <li>Barcode – product codes</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Implications of Computer Application',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Computerisation brings social, economic, and health implications. It affects employment, skills, security, and personal well‑being.
            </p>
          </div>

          <ConceptExplainer
            title="Implications of Computerisation"
            introduction="Computerisation creates benefits and costs that are distributed unevenly. A strong answer identifies affected people, explains the mechanism and proposes a realistic safeguard."
            accent="emerald"
            concepts={[
              {
                name: 'Employment and Skills',
                definition: 'Automation changes the number, location and content of jobs.',
                explanation: 'Repetitive roles may decline, existing jobs may require new digital skills and new technical or service roles may appear. Training and transition support determine whether workers can move into changed work.',
                examples: ['Automated checkout', 'Database administrator role', 'Worker retraining for CNC machinery'],
                examTip: 'Computerisation can remove some tasks while creating others; avoid claiming that every job disappears.',
              },
              {
                name: 'Productivity and Economic Change',
                definition: 'Computers can increase output, consistency and the speed of transactions.',
                explanation: 'Lower unit costs and faster services can benefit customers, but investment, maintenance, market concentration and failure risk create costs. Gains depend on good process design, not hardware alone.',
                examples: ['Automated stock reordering', 'Faster payroll processing', 'Online service available outside office hours'],
                examTip: 'Link the technology to a measurable change in time, cost, quality or output.',
              },
              {
                name: 'Health and Ergonomics',
                definition: 'Physical and psychological effects caused by equipment, posture, repetition or patterns of use.',
                explanation: 'Risk is reduced by adjustable furniture, neutral wrist posture, suitable lighting, screen placement, movement breaks and manageable workload. Symptoms should prompt changes rather than simply adding more hours.',
                examples: ['Repetitive strain injury', 'Eye discomfort', 'Back and neck pain'],
                examTip: 'Name both the health risk and a matching prevention method.',
              },
              {
                name: 'Data Security',
                definition: 'Protecting data and systems against unauthorised access, alteration, loss or unavailability.',
                explanation: 'Authentication, least privilege, encryption, physical controls, updates, monitoring and backups address different threats. Confidentiality, integrity and availability should be considered together.',
                examples: ['Multi-factor login', 'Encrypted storage', 'Offline backup'],
                examTip: 'A backup supports recovery; it does not prevent unauthorised reading.',
              },
              {
                name: 'Data Integrity and Quality',
                definition: 'Keeping data accurate, complete, consistent and valid throughout its life.',
                explanation: 'Validation, verification, controlled updates, transaction rules and audit trails reduce accidental or deliberate corruption. Integrity is about trustworthiness, not secrecy.',
                examples: ['Range validation', 'Unique primary key', 'Audit log of record changes'],
                examTip: 'Security and integrity overlap, but they are not identical concepts.',
              },
              {
                name: 'Privacy and Responsible Data Use',
                definition: 'Handling personal data lawfully, fairly, transparently and only for justified purposes.',
                explanation: 'Organisations should collect necessary data, keep it accurate and secure, limit retention and access, and respect rights under applicable data-protection rules. Consent is not the only possible lawful basis, and responsibility continues after collection.',
                examples: ['Restricting medical records', 'Deleting data after its retention period', 'Explaining why personal data is collected'],
                examTip: 'Avoid relying on an outdated foreign act name; explain the data-protection principle.',
              },
              {
                name: 'Digital Divide and Accessibility',
                definition: 'Unequal ability to obtain devices, connectivity, skills and accessible digital services.',
                explanation: 'Cost, location, language, disability and education can exclude users. Inclusive design, training, public access and alternative service channels reduce exclusion.',
                examples: ['Rural connection gap', 'Website inaccessible to a screen reader', 'Learner without a suitable device'],
                examTip: 'Access includes skills and accessibility, not only owning hardware.',
              },
              {
                name: 'Online Safety and Well-Being',
                definition: 'Protecting users from harmful content, contact, conduct and excessive or manipulative use.',
                explanation: 'Age-appropriate settings, supervision, reporting tools, privacy education and open discussion work better together than filtering alone. Young users should know how to block, report and seek trusted help.',
                examples: ['Cyberbullying', 'Inappropriate content', 'Deceptive request for personal information'],
                examTip: 'Filtering is one control and can make mistakes; education and supervision still matter.',
              },
              {
                name: 'Environmental Impact',
                definition: 'Effects of manufacturing, electricity use, repair, replacement and electronic waste.',
                explanation: 'Longer device life, energy efficiency, repair, responsible purchasing and certified recycling reduce harm. Cloud services still use physical data centres and electricity.',
                examples: ['Electronic waste', 'Data-centre energy use', 'Repairing instead of replacing a device'],
                examTip: 'Consider the complete lifecycle, not only electricity used while the device is on.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Social & Economic Effects</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Unemployment:</strong> Job losses due to automation</li>
                <li><strong>Deskilling:</strong> Traditional skills become obsolete</li>
                <li><strong>Electronic scabbing:</strong> Switching work to non‑striking workers</li>
                <li><strong>New jobs:</strong> Programmers, technicians, administrators</li>
                <li><strong>Cheaper goods:</strong> Increased productivity</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Health Problems</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>RSI:</strong> Repetitive Strain Injury from keyboard use</li>
                <li><strong>Eye strain:</strong> Glare from screens – use antiglare filters</li>
                <li><strong>Back problems:</strong> Poor posture – use adjustable chairs</li>
                <li><strong>Lack of exercise</strong></li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Data Security & Integrity</h4>
              <p className="text-sm text-slate-700"><strong>Security:</strong> Protecting from unauthorised access or loss. Measures: passwords, encryption, firewalls, physical locks.</p>
              <p className="text-sm text-slate-700 mt-1"><strong>Integrity:</strong> Correctness and accuracy of data.</p>
              <p className="text-sm text-slate-700 mt-1"><strong>Data protection principles:</strong> Personal data should be collected and used lawfully, kept accurate and secure, limited to a justified purpose and retained only as long as necessary under applicable law.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Children & Internet</h4>
              <p className="text-sm text-slate-700">Exposure to inappropriate content can be prevented by using filtering software (Net‑Nanny, Surfwatch) and supervision.</p>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Implications Quick List</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Unemployment & new jobs</li>
              <li>Health: RSI, eye/back strain</li>
              <li>Security: passwords, encryption</li>
              <li>Data Protection Act</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Databases',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>database</strong> is an organised collection of related data designed for controlled storage,
              retrieval and update. A <strong>Database Management System (DBMS)</strong> is the software that defines,
              protects and manipulates that data.
            </p>
          </div>

          <ConceptExplainer
            title="Database Structure and Management Explained"
            introduction="A useful database is not simply a large file. Its structure, keys, relationships, validation, queries, security and recovery rules work together to keep shared data consistent."
            accent="emerald"
            concepts={[
              {
                name: 'Field, Record and Table',
                definition: 'A field stores one attribute; a record combines attributes for one instance; a table stores similar records.',
                explanation: 'Each field has a name and data type. In a student table, one row represents one student while columns hold values such as StudentID, Surname and DateOfBirth.',
                examples: ['Surname field', 'One student record', 'Student table'],
                examTip: 'A field is normally a column and a record is normally a row in a relational table.',
              },
              {
                name: 'Primary and Foreign Keys',
                definition: 'A primary key uniquely identifies a row; a foreign key refers to a key in another table.',
                explanation: 'Stable keys allow exact retrieval and relationships without repeating all related details. A secondary search key can help locate records but does not have to be unique.',
                examples: ['StudentID primary key', 'StudentID foreign key in Enrolment', 'Surname used as a secondary search key'],
                examTip: 'A surname is unsuitable as a primary key because several people can share it.',
              },
              {
                name: 'Relationships',
                definition: 'Rules connecting records in different tables.',
                explanation: 'One-to-one, one-to-many and many-to-many relationships model real associations. A many-to-many relationship is normally resolved through an intermediate table containing foreign keys.',
                examples: ['One class has many students', 'One person has one profile', 'Students take many subjects through Enrolment'],
                examTip: 'State the relationship in both directions and identify the linking key.',
              },
              {
                name: 'Database Models',
                definition: 'Formal ways of organising data and its relationships.',
                explanation: 'The relational model uses linked tables; the hierarchical model uses parent–child trees; the network model permits records to participate in multiple links. The model affects flexibility and navigation.',
                examples: ['Relational school database', 'Hierarchical organisation chart', 'Network model with multiple ownership links'],
                examTip: 'Do not confuse the network database model with a computer network.',
              },
              {
                name: 'DBMS',
                definition: 'Software used to create, query, update, secure and recover databases.',
                explanation: 'A DBMS enforces structure, transactions, permissions and constraints while coordinating concurrent users. SQL is a language used with many DBMS products, not itself the complete DBMS.',
                examples: ['Microsoft Access', 'MySQL', 'PostgreSQL'],
                examTip: 'Name product examples separately from SQL commands.',
              },
              {
                name: 'Queries, Forms and Reports',
                definition: 'Database tools for retrieving data, entering it safely and presenting useful output.',
                explanation: 'Queries filter, join, calculate or summarise; forms guide entry and validation; reports format selected information for an audience. The underlying stored data can support many different outputs.',
                examples: ['Query overdue library books', 'Student-entry form', 'Monthly sales report'],
                examTip: 'A query asks for data; a report presents selected results.',
              },
              {
                name: 'Validation, Integrity and Transactions',
                definition: 'Rules that keep stored values and multi-step updates logically correct.',
                explanation: 'Data types, ranges, required fields, uniqueness and referential integrity reject invalid changes. A transaction should complete all related updates or roll them back together.',
                examples: ['Unique StudentID', 'Mark range 0–100', 'Transfer debits one account and credits another'],
                examTip: 'Validation checks plausibility; it cannot prove that every accepted value is factually true.',
              },
              {
                name: 'Database Administrator (DBA)',
                definition: 'The specialist responsible for availability, security, performance and recovery of organisational databases.',
                explanation: 'The DBA manages accounts, permissions, backups, restoration tests, monitoring, capacity, updates and changes. Developers design applications, while data owners decide business access rules.',
                examples: ['Creating a least-privilege role', 'Testing backup restoration', 'Investigating a slow query'],
                examTip: 'Backups are incomplete until restoration has been tested.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Database Building Blocks</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Bit:</strong> 0 or 1</li>
              <li><strong>Byte:</strong> 8 bits = character</li>
              <li><strong>Field:</strong> Category (e.g., Surname)</li>
              <li><strong>Record:</strong> Set of related fields (e.g., one person)</li>
              <li><strong>File:</strong> Set of related records</li>
              <li><strong>Database:</strong> Set of related files</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Database Models</h4>
            <div className="mt-2">
              <img src={dataImages.databaseTypes} alt="Database types" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Relational:</strong> Tables linked by keys (most common)</li>
              <li><strong>Hierarchical:</strong> Tree structure, one‑to‑many</li>
              <li><strong>Network:</strong> Many‑to‑many relationships</li>
            </ul>
            <p className="text-sm text-slate-700 mt-2"><strong>Primary Key:</strong> Unique identifier (e.g., Student Number). <strong>Secondary search key:</strong> A non-primary field used to retrieve records and not necessarily unique (e.g., Surname).</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">DBMS & DBA</h4>
            <p className="text-sm text-slate-700"><strong>DBMS:</strong> Software to maintain and access databases, such as Microsoft Access, MySQL or PostgreSQL. SQL is a language used to define and query data in many DBMS products.</p>
            <p className="text-sm text-slate-700 mt-1"><strong>DBA:</strong> Person responsible for overall management, backup, security, and performance.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <ProsConsComparison
              title="Database Advantages and Disadvantages"
              advantages={[
                'Queries can search and retrieve records quickly.',
                'Several authorised users can share the same organised data.',
                'Central control can reduce unnecessary duplicate data.',
                'Validation rules improve data accuracy and integrity.',
                'Relationships connect related information without repeating every field.',
                'Access permissions can protect sensitive records.',
                'Backup and recovery can be managed systematically.',
                'Records can be updated without rewriting an entire paper filing system.',
                'Reports, totals, and summaries can be generated automatically.',
                'A DBMS supports consistent data definitions and standards.',
              ]}
              disadvantages={[
                'Database software, servers, and licences can be expensive.',
                'Designing a correct database requires specialist knowledge.',
                'A central database failure can affect many users and services.',
                'Attackers may obtain a large amount of information from one breach.',
                'Regular backups, security updates, and maintenance are essential.',
                'Converting old files into a new database can take time and money.',
                'Complex queries or many simultaneous users may reduce performance.',
                'Incorrect design can create duplication, inconsistency, or update problems.',
                'Users need training to enter data and use the DBMS correctly.',
                'Hardware failure or corruption can cause major loss without tested recovery procedures.',
              ]}
            />
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Database Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Field – column</li>
              <li>Record – row</li>
              <li>Primary Key – unique</li>
              <li>SQL – query language</li>
              <li>DBA – database admin</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: File Handling',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A data file stores related records. A <strong>master file</strong> holds the current relatively permanent
              state, a <strong>transaction file</strong> holds events that change that state and a
              <strong> reference file</strong> supplies relatively stable lookup values.
            </p>
          </div>

          <ConceptExplainer
            title="File Types, Organisation and Updating"
            introduction="File handling separates what a file contains from how records are physically or logically organised. The access pattern and update method determine the most suitable organisation."
            accent="emerald"
            concepts={[
              {
                name: 'Master, Transaction and Reference Files',
                definition: 'Files with different roles in an information-processing system.',
                explanation: 'The master file represents current entities or balances, transactions describe additions, changes or deletions, and reference data supplies codes or standard values used during processing.',
                examples: ['Customer master file', 'Daily sales transaction file', 'Product-category reference file'],
                examTip: 'A transaction record describes an event; it is applied to update the master.',
              },
              {
                name: 'Serial Organisation',
                definition: 'Records are stored in the order they arrive without sorting by a key.',
                explanation: 'New records are easy to append, but finding one may require searching from the start. Serial files suit logs or temporary transaction collection where arrival order matters.',
                examples: ['Event log', 'Unsorted survey responses', 'Incoming transaction file'],
                examTip: 'Serial describes unsorted arrival order, not merely any file read one item at a time.',
              },
              {
                name: 'Sequential Organisation',
                definition: 'Records are stored in order of a chosen key.',
                explanation: 'Sequential files are efficient when most records are processed in key order, especially in batch work. Inserting one record while preserving order may require rewriting or merging.',
                examples: ['Payroll ordered by employee number', 'Billing file ordered by account number', 'Class list ordered by student ID'],
                examTip: 'Name the ordering key and the process that benefits.',
              },
              {
                name: 'Indexed-Sequential Organisation',
                definition: 'Ordered records are supported by an index that points to blocks or locations.',
                explanation: 'The index speeds targeted retrieval while the ordered file still supports sequential processing. Space and maintenance are required to keep index entries correct after changes.',
                examples: ['Stock file', 'Customer account file', 'Library catalogue file'],
                examTip: 'It supports both indexed lookup and sequential traversal.',
              },
              {
                name: 'Direct or Random Organisation',
                definition: 'A key or address is transformed into a location for direct record access.',
                explanation: 'Direct access is suitable for interactive systems requiring one record quickly. Collisions, free space and reorganisation must be managed by the chosen addressing or hashing method.',
                examples: ['Airline reservation record', 'Bank account lookup', 'Online inventory item'],
                examTip: '“Random” means direct access order, not that records are meaningless.',
              },
              {
                name: 'Fixed and Variable-Length Records',
                definition: 'Fixed records reserve the same size; variable records use space according to content.',
                explanation: 'Fixed length makes location calculation and processing simpler but can waste unused field space. Variable length uses storage flexibly but needs delimiters, length values or pointers and adds processing complexity.',
                examples: ['Fixed payroll record', 'Variable customer note', 'Variable-length message'],
                examTip: 'Fixed length is predictable; variable length is flexible.',
              },
              {
                name: 'Copy Update and In-Place Update',
                definition: 'Two approaches to applying transactions to master records.',
                explanation: 'A copy update merges the old master and sorted transactions into a new master, preserving generations. In-place update changes the located record directly and therefore needs strong journaling and backup.',
                examples: ['Old master plus transactions creates new master', 'Direct stock-quantity update', 'Database account transaction'],
                examTip: 'Copy update naturally preserves the old version; in-place update needs separate recovery protection.',
              },
              {
                name: 'Backup Generations and Recovery',
                definition: 'Keeping known versions and copies so data can be restored after error, corruption or loss.',
                explanation: 'Grandfather–father–son rotation preserves several dated generations. Backups should be separated from the live system, protected, documented and periodically restored in a test.',
                examples: ['Grandfather weekly copy', 'Father previous master', 'Son current master'],
                examTip: 'A synchronised copy can also copy corruption; retention and restoration testing matter.',
              },
              {
                name: 'File Processing Operations',
                definition: 'Standard actions used to retrieve, arrange, combine and maintain stored records.',
                explanation: 'Interrogation searches, sorting changes order, merging combines compatible ordered files, updating changes content and maintenance reorganises structure or removes obsolete records.',
                examples: ['Search one customer', 'Sort by account number', 'Merge two branch files'],
                examTip: 'State the input files and resulting change for an operation.',
              },
            ]}
          />

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">File Organisation</h4>
            <div className="mt-2">
              <img src={dataImages.fileOrganisation} alt="File organisation" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Serial:</strong> As they occur – no order (tapes)</li>
              <li><strong>Sequential:</strong> Sorted by key – high hit rate (payroll)</li>
              <li><strong>Indexed‑Sequential:</strong> Ordered with index – fast direct access (stock control)</li>
              <li><strong>Random:</strong> Direct access by address – fastest (airline reservations)</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Fixed vs Variable Length Records</h4>
            <div className="mt-2">
              <img src={dataImages.fixedVariable} alt="Fixed vs variable" className="w-full rounded-xl" />
            </div>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2">
              <li><strong>Fixed:</strong> Same allocated size – predictable and fast to locate, but unused field space may be wasted.</li>
              <li><strong>Variable:</strong> Size varies with content – flexible use of space, but requires length markers or delimiters and more complex processing.</li>
            </ul>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">File Updating</h4>
            <p className="text-sm text-slate-700">Two methods:</p>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>By copying:</strong> Creates new master file from old master + transaction (sequential). Uses grandfather‑father‑son versions.</li>
              <li><strong>In situ (overlay):</strong> Directly updates record in place (random/ indexed).</li>
            </ul>
            <div className="mt-2">
              <img src={dataImages.fileGenerations} alt="File generations" className="w-full rounded-xl" />
            </div>
            <p className="text-sm text-slate-700 mt-2"><strong>Backup:</strong> Copy of file for recovery. Generations protect against data loss.</p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">File Processing Operations</h4>
            <ul className="list-disc list-inside text-sm text-slate-700">
              <li><strong>Interrogation:</strong> Search and display</li>
              <li><strong>Sorting:</strong> Arrange records</li>
              <li><strong>Merging:</strong> Combine files</li>
              <li><strong>Maintenance:</strong> Reorganise structure</li>
              <li><strong>Updating:</strong> Change records</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">File Handling Summary</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Master – permanent</li>
              <li>Transaction – updates</li>
              <li>Serial, sequential, indexed, random</li>
              <li>Fixed vs variable length</li>
              <li>Generations for backup</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-f',
    title: 'Part F: Programming Concepts',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Programming</strong> is the process of designing, coding, and testing programs. A <strong>program</strong> is a set of instructions that tells the computer what to do.
            </p>
          </div>

          <ConceptExplainer
            title="Programming Foundations Explained"
            introduction="Programming turns a defined problem into an unambiguous algorithm and then into tested, maintainable source code. Correct syntax is necessary, but a program must also implement the correct logic."
            accent="emerald"
            concepts={[
              {
                name: 'Problem Analysis',
                definition: 'Identifying required inputs, processing, outputs, constraints and success criteria.',
                explanation: 'A programmer should understand the problem before choosing a language or writing code. Ambiguous requirements lead to software that may run correctly but solve the wrong problem.',
                examples: ['Required student marks', 'Average calculation rule', 'Expected grade report'],
                examTip: 'Write inputs, processing and outputs explicitly.',
              },
              {
                name: 'Algorithm Design',
                definition: 'Creating a finite ordered method that solves the defined problem.',
                explanation: 'Pseudocode, flowcharts and structure diagrams expose logic before language syntax is introduced. A good algorithm is unambiguous, terminates and handles expected edge cases.',
                examples: ['Sequence of calculations', 'IF selection for a grade', 'Loop through a list of marks'],
                examTip: 'An algorithm is the solution method; source code is one implementation.',
              },
              {
                name: 'Variables, Constants and Data Types',
                definition: 'Named values and rules describing what kind of data operations are valid.',
                explanation: 'Variables can change, constants should not, and types such as integer, real, Boolean, character and string guide storage, validation and operations.',
                examples: ['Integer Count', 'Real Average', 'Boolean IsValid'],
                examTip: 'Choose a type based on possible values, not the variable’s name.',
              },
              {
                name: 'Control Structures',
                definition: 'The patterns that determine the order in which statements execute.',
                explanation: 'Sequence performs steps in order, selection chooses a path from a condition and iteration repeats steps. These structures can express any structured algorithm when combined correctly.',
                examples: ['Straight-line sequence', 'IF…THEN…ELSE', 'FOR or WHILE loop'],
                examTip: 'Use a count-controlled loop when repetitions are known and a condition loop otherwise.',
              },
              {
                name: 'Source Code and Translation',
                definition: 'Source code is the human-written program; a translator converts it into executable operations.',
                explanation: 'A compiler translates a complete program, an interpreter executes source statements through an interpreting environment and an assembler converts assembly mnemonics to machine instructions.',
                examples: ['C source compiled by GCC', 'Python program run by CPython', 'Assembly source processed by NASM'],
                examTip: 'An assembler is also a translator and should not be omitted.',
              },
              {
                name: 'Testing and Debugging',
                definition: 'Executing planned cases, comparing actual with expected results and correcting defects.',
                explanation: 'Normal, boundary and invalid data reveal different faults. Syntax errors break language rules, runtime errors occur during execution and logic errors produce an incorrect result.',
                examples: ['Valid mark 65', 'Boundary mark 0', 'Invalid mark 120'],
                examTip: 'Validation cannot prove the whole algorithm is correct; expected results are required.',
              },
              {
                name: 'Documentation and Maintenance',
                definition: 'Explaining how to use and modify the software and changing it safely after release.',
                explanation: 'User documentation supports operation; technical documentation explains design, code, data and testing. Maintenance corrects faults, adapts to new environments and improves features.',
                examples: ['User guide', 'Commented module specification', 'Change log and regression tests'],
                examTip: 'Documentation is produced throughout development, not only after coding.',
              },
            ]}
          />

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Programming Languages</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Low Level Languages (LLL):</strong> Machine code (0s and 1s) – fast but hard for humans.</li>
                <li><strong>High Level Languages (HLL):</strong> English‑like (e.g., Python, Java, C++) – easier to write and understand, but need translators (compilers/interpreters).</li>
              </ul>
              <p className="text-sm text-slate-700 mt-2"><strong>Translators:</strong> Compilers convert entire program; interpreters convert line by line.</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Program Development Cycle</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Analysis:</strong> Understand problem</li>
                <li><strong>Design:</strong> Plan solution (flowcharts, pseudocode)</li>
                <li><strong>Coding:</strong> Write program in chosen language</li>
                <li><strong>Testing:</strong> Run with test data to find errors</li>
                <li><strong>Documentation:</strong> User guides, technical manuals</li>
                <li><strong>Maintenance:</strong> Updates and bug fixes</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Key Programming Terms</h4>
              <ul className="list-disc list-inside text-sm text-slate-700">
                <li><strong>Syntax:</strong> Rules of the language</li>
                <li><strong>Logic error:</strong> Program runs but gives wrong results</li>
                <li><strong>Syntax error:</strong> Violates language rules (compiler catches)</li>
                <li><strong>Run‑time error:</strong> Occurs during execution (e.g., division by zero)</li>
              </ul>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Programming Quick Guide</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Program – instructions</li>
              <li>LLL – machine code</li>
              <li>HLL – English‑like</li>
              <li>Compiler/Interpreter – translators</li>
              <li>Errors: syntax, logic, run‑time</li>
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
            <h4 className="text-lg font-bold text-blue-700">Data Logging</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Automatic data collection</li>
            <li>Sensors + ADC</li>
            <li>Pollution, reactor monitoring</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📝</span>
            <h4 className="text-lg font-bold text-blue-700">Data Capturing</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Key‑to‑disk, OMR, OCR, MICR</li>
            <li>Barcodes, voice recognition</li>
            <li>Coding for speed and space</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛡️</span>
            <h4 className="text-lg font-bold text-blue-700">Implications</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Employment, health, security</li>
            <li>Data Protection Act</li>
            <li>Physical & logical security</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🗄️</span>
            <h4 className="text-lg font-bold text-blue-700">Databases</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Relational, hierarchical, network</li>
            <li>DBMS, DBA, SQL</li>
            <li>Primary key, fields, records</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📁</span>
            <h4 className="text-lg font-bold text-blue-700">File Handling</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Master, transaction, reference files</li>
            <li>Organisation: serial, sequential, indexed, random</li>
            <li>Fixed vs variable length, updating (copy vs in situ)</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💻</span>
            <h4 className="text-lg font-bold text-blue-700">Programming</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>LLL (machine code) vs HLL (Python, Java)</li>
            <li>Translators: compilers / interpreters</li>
            <li>Development cycle: analysis → design → code → test → document → maintain</li>
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
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.title.replace(/^Part [A-F]: /, '')}
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

interface LearningOutcome5Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome5: React.FC<LearningOutcome5Props> = ({
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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            DATA LOGGING & DATABASES
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Data Logging, Databases, File Handling & Programming
          </h1>
          <p className="text-lg text-emerald-100 max-w-2xl leading-relaxed">
            Explore automatic data collection, data capturing techniques, the social implications of computing,
            database models, file organisation, and the fundamentals of programming.
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
          <div className="mt-12 p-6 bg-gradient-to-r from-emerald-600 to-teal-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-emerald-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Data Logging:</strong> Automatic collection using sensors and ADC – used in environmental monitoring and industrial control.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Data Capturing:</strong> Methods include keyboard, OMR/OCR/MICR, barcodes, and voice recognition. Coding saves space and time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Implications:</strong> Computerisation affects employment, health, and security; data protection laws regulate personal data.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Databases:</strong> Relational, hierarchical, network models; managed by DBMS and DBA; use keys to link records.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">File Handling:</strong> Master/transaction files; organisation (serial, sequential, indexed, random); fixed/variable records; updating by copy or in situ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Programming:</strong> Low‑level vs high‑level languages; compilers/interpreters; development cycle and error types.</span>
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
                Next: <span className="text-emerald-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export as LearningOutcome5
export default LearningOutcome5;

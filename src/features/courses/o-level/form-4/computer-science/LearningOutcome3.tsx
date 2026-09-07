import React, { useState, useRef } from 'react';
import ProsConsComparison from './ProsConsComparison';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Software classification hierarchy
const softwareHierarchySvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 530" role="img" aria-labelledby="soft-title soft-desc">
  <title id="soft-title">Software classification hierarchy</title>
  <desc id="soft-desc">Software divides into systems software that manages the computer and application software that performs user tasks.</desc>
  <defs>
    <linearGradient id="soft-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <linearGradient id="soft-root" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#1d4ed8"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
    <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="9" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="530" rx="28" fill="url(#soft-bg)"/>
  <text x="450" y="48" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">How Software Is Classified</text>
  <text x="450" y="75" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Programs either manage the computer or help users complete tasks</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#soft-shadow)">
    <rect x="325" y="103" width="250" height="66" rx="20" fill="url(#soft-root)"/>
    <text x="450" y="144" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">SOFTWARE</text>
    <path d="M450 169v34M450 203H230v38M450 203h220v38" fill="none" stroke="#64748b" stroke-width="4" stroke-linecap="round"/>

    <rect x="85" y="241" width="290" height="76" rx="20" fill="#172554"/>
    <text x="230" y="272" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">Systems Software</text>
    <text x="230" y="297" text-anchor="middle" font-size="13" fill="#bfdbfe">Runs and manages the computer</text>
    <rect x="525" y="241" width="290" height="76" rx="20" fill="#0f766e"/>
    <text x="670" y="272" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">Application Software</text>
    <text x="670" y="297" text-anchor="middle" font-size="13" fill="#ccfbf1">Performs tasks for the user</text>

    <path d="M230 317v28M230 345H125v24M230 345v24M230 345h105v24M670 317v28M670 345H565v24M670 345v24M670 345h105v24" fill="none" stroke="#94a3b8" stroke-width="3"/>
    <g font-size="14" font-weight="700" text-anchor="middle">
      <rect x="50" y="369" width="150" height="62" rx="16" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><text x="125" y="397" fill="#1d4ed8">Operating systems</text><text x="125" y="417" font-size="11" font-weight="500" fill="#64748b">Windows • Linux</text>
      <rect x="155" y="446" width="150" height="62" rx="16" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><text x="230" y="474" fill="#1d4ed8">Utility programs</text><text x="230" y="494" font-size="11" font-weight="500" fill="#64748b">Backup • antivirus</text>
      <rect x="260" y="369" width="150" height="62" rx="16" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><text x="335" y="397" fill="#1d4ed8">Translators</text><text x="335" y="417" font-size="11" font-weight="500" fill="#64748b">Compiler • interpreter</text>
      <rect x="490" y="369" width="150" height="62" rx="16" fill="#fff" stroke="#99f6e4" stroke-width="2"/><text x="565" y="397" fill="#0f766e">General-purpose</text><text x="565" y="417" font-size="11" font-weight="500" fill="#64748b">Word processor • sheet</text>
      <rect x="595" y="446" width="150" height="62" rx="16" fill="#fff" stroke="#99f6e4" stroke-width="2"/><text x="670" y="474" fill="#0f766e">Special-purpose</text><text x="670" y="494" font-size="11" font-weight="500" fill="#64748b">Payroll • school records</text>
      <rect x="700" y="369" width="150" height="62" rx="16" fill="#fff" stroke="#99f6e4" stroke-width="2"/><text x="775" y="397" fill="#0f766e">Custom-written</text><text x="775" y="417" font-size="11" font-weight="500" fill="#64748b">Built for one client</text>
    </g>
  </g>
</svg>
`;

// Operating system types
const osTypesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520" role="img" aria-labelledby="os-title os-desc">
  <title id="os-title">Types of operating systems</title>
  <desc id="os-desc">Five cards distinguish single-user, multi-user, multiprogramming, multiprocessing and batch operating systems.</desc>
  <defs>
    <linearGradient id="os-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fafc"/><stop offset="1" stop-color="#eff6ff"/></linearGradient>
    <filter id="os-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="520" rx="28" fill="url(#os-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Operating System Types</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Classified by users, processor use and how jobs are scheduled</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#os-shadow)">
    <g><rect x="45" y="115" width="250" height="145" rx="22" fill="#fff" stroke="#bfdbfe" stroke-width="2"/><circle cx="83" cy="153" r="22" fill="#2563eb"/><text x="83" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">1</text><text x="119" y="151" font-size="20" font-weight="800" fill="#1d4ed8">Single-user</text><text x="70" y="199" font-size="14" fill="#334155">One user controls the system</text><text x="70" y="224" font-size="12" fill="#64748b">May be single-task or multitasking</text></g>
    <g><rect x="325" y="115" width="250" height="145" rx="22" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><circle cx="363" cy="153" r="22" fill="#7c3aed"/><text x="363" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">2</text><text x="399" y="151" font-size="20" font-weight="800" fill="#6d28d9">Multi-user</text><text x="350" y="199" font-size="14" fill="#334155">Many users share resources</text><text x="350" y="224" font-size="12" fill="#64748b">Time-sharing gives each a CPU slice</text></g>
    <g><rect x="605" y="115" width="250" height="145" rx="22" fill="#fff" stroke="#a7f3d0" stroke-width="2"/><circle cx="643" cy="153" r="22" fill="#059669"/><text x="643" y="160" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">3</text><text x="679" y="151" font-size="20" font-weight="800" fill="#047857">Multiprogramming</text><text x="630" y="199" font-size="14" fill="#334155">Several programs stay in memory</text><text x="630" y="224" font-size="12" fill="#64748b">CPU switches when one job waits</text></g>
    <g><rect x="185" y="300" width="250" height="145" rx="22" fill="#fff" stroke="#fed7aa" stroke-width="2"/><circle cx="223" cy="338" r="22" fill="#ea580c"/><text x="223" y="345" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">4</text><text x="259" y="336" font-size="20" font-weight="800" fill="#c2410c">Multiprocessing</text><text x="210" y="384" font-size="14" fill="#334155">Two or more processors/cores</text><text x="210" y="409" font-size="12" fill="#64748b">Instructions run in parallel</text></g>
    <g><rect x="465" y="300" width="250" height="145" rx="22" fill="#fff" stroke="#fde68a" stroke-width="2"/><circle cx="503" cy="338" r="22" fill="#d97706"/><text x="503" y="345" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">5</text><text x="539" y="336" font-size="20" font-weight="800" fill="#b45309">Batch processing</text><text x="490" y="384" font-size="14" fill="#334155">Similar jobs collected into batches</text><text x="490" y="409" font-size="12" fill="#64748b">Runs without direct user interaction</text></g>
  </g>
</svg>
`;

// Network types by geographical coverage
const networkCoverageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560" role="img" aria-labelledby="coverage-title coverage-desc">
  <title id="coverage-title">Network types classified by geographical coverage</title>
  <desc id="coverage-desc">A professional scale diagram compares a personal area network, local area network, metropolitan area network and wide area network from the smallest to the largest coverage.</desc>
  <defs>
    <linearGradient id="coverage-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef2ff"/><stop offset=".55" stop-color="#f8fafc"/><stop offset="1" stop-color="#ecfeff"/></linearGradient>
    <linearGradient id="coverage-line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#8b5cf6"/><stop offset=".36" stop-color="#2563eb"/><stop offset=".68" stop-color="#0891b2"/><stop offset="1" stop-color="#059669"/></linearGradient>
    <filter id="coverage-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0f172a" flood-opacity=".13"/></filter>
  </defs>
  <rect width="900" height="560" rx="30" fill="url(#coverage-bg)"/>
  <text x="450" y="52" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Network Types by Geographic Coverage</text>
  <text x="450" y="80" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">The categories describe the area connected—not the cable layout or topology</text>
  <path d="M105 466H795" stroke="url(#coverage-line)" stroke-width="12" stroke-linecap="round"/>
  <path d="M780 449l28 17-28 17" fill="#059669"/>
  <text x="450" y="515" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="#475569">INCREASING GEOGRAPHICAL COVERAGE  →</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#coverage-shadow)">
    <g>
      <rect x="45" y="120" width="185" height="305" rx="24" fill="#fff" stroke="#ddd6fe" stroke-width="2"/>
      <circle cx="138" cy="190" r="46" fill="#f3e8ff"/><circle cx="138" cy="177" r="13" fill="#7c3aed"/><path d="M111 220c5-32 49-32 54 0" fill="none" stroke="#7c3aed" stroke-width="8" stroke-linecap="round"/>
      <circle cx="84" cy="166" r="11" fill="#8b5cf6"/><rect x="181" y="160" width="22" height="36" rx="5" fill="#8b5cf6"/><path d="M94 174l21 8M161 183l20-7" stroke="#c4b5fd" stroke-width="4" stroke-dasharray="5 5"/>
      <text x="138" y="270" text-anchor="middle" font-size="30" font-weight="900" fill="#6d28d9">PAN</text>
      <text x="138" y="299" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">Around one person</text>
      <text x="138" y="328" text-anchor="middle" font-size="12" fill="#64748b">Phone • earbuds • watch</text>
      <rect x="76" y="354" width="124" height="35" rx="17" fill="#f3e8ff"/><text x="138" y="377" text-anchor="middle" font-size="12" font-weight="800" fill="#7c3aed">A FEW METRES</text>
    </g>
    <g>
      <rect x="253" y="120" width="185" height="305" rx="24" fill="#fff" stroke="#bfdbfe" stroke-width="2"/>
      <rect x="287" y="157" width="117" height="86" rx="8" fill="#dbeafe"/><path d="M302 225v-46h25v46M337 225v-62h25v62M372 225v-34h17v34" fill="#2563eb"/><path d="M278 243h135" stroke="#1d4ed8" stroke-width="6" stroke-linecap="round"/>
      <text x="346" y="270" text-anchor="middle" font-size="30" font-weight="900" fill="#1d4ed8">LAN</text>
      <text x="346" y="299" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">One local site</text>
      <text x="346" y="328" text-anchor="middle" font-size="12" fill="#64748b">Home • office • school</text>
      <rect x="284" y="354" width="124" height="35" rx="17" fill="#dbeafe"/><text x="346" y="377" text-anchor="middle" font-size="12" font-weight="800" fill="#2563eb">BUILDING / SITE</text>
    </g>
    <g>
      <rect x="461" y="120" width="185" height="305" rx="24" fill="#fff" stroke="#a5f3fc" stroke-width="2"/>
      <path d="M490 238v-54h30v54M527 238v-83h35v83M570 238v-64h45v64" fill="#0891b2"/><g fill="#cffafe"><rect x="499" y="195" width="7" height="8"/><rect x="537" y="168" width="7" height="8"/><rect x="549" y="168" width="7" height="8"/><rect x="580" y="190" width="8" height="8"/><rect x="597" y="190" width="8" height="8"/></g>
      <text x="554" y="270" text-anchor="middle" font-size="30" font-weight="900" fill="#0e7490">MAN</text>
      <text x="554" y="299" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">Across a city</text>
      <text x="554" y="328" text-anchor="middle" font-size="12" fill="#64748b">Sites joined metro-wide</text>
      <rect x="492" y="354" width="124" height="35" rx="17" fill="#cffafe"/><text x="554" y="377" text-anchor="middle" font-size="12" font-weight="800" fill="#0891b2">TOWN / CITY</text>
    </g>
    <g>
      <rect x="669" y="120" width="185" height="305" rx="24" fill="#fff" stroke="#a7f3d0" stroke-width="2"/>
      <circle cx="762" cy="196" r="53" fill="#d1fae5" stroke="#059669" stroke-width="4"/><path d="M709 196h106M762 143c-25 24-25 82 0 106M762 143c25 24 25 82 0 106M719 167c27 13 59 13 86 0M719 225c27-13 59-13 86 0" fill="none" stroke="#059669" stroke-width="3"/>
      <text x="762" y="270" text-anchor="middle" font-size="30" font-weight="900" fill="#047857">WAN</text>
      <text x="762" y="299" text-anchor="middle" font-size="15" font-weight="700" fill="#334155">Across large regions</text>
      <text x="762" y="328" text-anchor="middle" font-size="12" fill="#64748b">Countries • continents</text>
      <rect x="700" y="354" width="124" height="35" rx="17" fill="#d1fae5"/><text x="762" y="377" text-anchor="middle" font-size="12" font-weight="800" fill="#059669">GLOBAL SCALE</text>
    </g>
  </g>
</svg>
`;

// Network topologies
const networkTopologiesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 535" role="img" aria-labelledby="topology-title topology-desc">
  <title id="topology-title">Network topologies</title>
  <desc id="topology-desc">Accurate diagrams compare star, ring, bus and full mesh network layouts.</desc>
  <defs>
    <linearGradient id="topology-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
    <filter id="topology-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="535" rx="28" fill="url(#topology-bg)"/>
  <text x="450" y="51" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Network Topologies</text>
  <text x="450" y="78" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">The physical or logical arrangement of devices and communication links</text>
  <g font-family="Inter,Arial,sans-serif" filter="url(#topology-shadow)">
    <g><rect x="45" y="110" width="385" height="180" rx="22" fill="#fff"/><text x="72" y="144" font-size="20" font-weight="800" fill="#1d4ed8">STAR</text><text x="72" y="168" font-size="12" fill="#64748b">Every device connects to a central switch</text><rect x="211" y="192" width="54" height="34" rx="8" fill="#2563eb"/><text x="238" y="214" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">SWITCH</text><path d="M211 200l-70-15M211 218l-70 28M265 200l70-15M265 218l70 28" stroke="#60a5fa" stroke-width="4"/><g fill="#172554"><rect x="111" y="169" width="30" height="24" rx="5"/><rect x="111" y="239" width="30" height="24" rx="5"/><rect x="335" y="169" width="30" height="24" rx="5"/><rect x="335" y="239" width="30" height="24" rx="5"/></g></g>
    <g><rect x="470" y="110" width="385" height="180" rx="22" fill="#fff"/><text x="497" y="144" font-size="20" font-weight="800" fill="#6d28d9">RING</text><text x="497" y="168" font-size="12" fill="#64748b">Each device has exactly two neighbours</text><path d="M620 195l62-25 62 25-24 57h-76z" fill="none" stroke="#8b5cf6" stroke-width="5"/><g fill="#6d28d9"><circle cx="620" cy="195" r="13"/><circle cx="682" cy="170" r="13"/><circle cx="744" cy="195" r="13"/><circle cx="720" cy="252" r="13"/><circle cx="644" cy="252" r="13"/></g></g>
    <g><rect x="45" y="315" width="385" height="180" rx="22" fill="#fff"/><text x="72" y="349" font-size="20" font-weight="800" fill="#0e7490">BUS</text><text x="72" y="373" font-size="12" fill="#64748b">All devices share one backbone cable</text><path d="M100 435h275" stroke="#0891b2" stroke-width="7" stroke-linecap="round"/><path d="M145 405v30M215 405v30M285 405v30M355 405v30" stroke="#67e8f9" stroke-width="4"/><g fill="#155e75"><rect x="128" y="387" width="34" height="24" rx="5"/><rect x="198" y="387" width="34" height="24" rx="5"/><rect x="268" y="387" width="34" height="24" rx="5"/><rect x="338" y="387" width="34" height="24" rx="5"/></g><rect x="91" y="422" width="10" height="26" rx="3" fill="#f59e0b"/><rect x="374" y="422" width="10" height="26" rx="3" fill="#f59e0b"/><text x="100" y="468" font-size="10" fill="#a16207">terminator</text><text x="330" y="468" font-size="10" fill="#a16207">terminator</text></g>
    <g><rect x="470" y="315" width="385" height="180" rx="22" fill="#fff"/><text x="497" y="349" font-size="20" font-weight="800" fill="#047857">FULL MESH</text><text x="497" y="373" font-size="12" fill="#64748b">Every device has a direct link to every other</text><path d="M610 397h130v65H610zM610 397l130 65M740 397l-130 65" fill="none" stroke="#34d399" stroke-width="4"/><g fill="#047857"><circle cx="610" cy="397" r="14"/><circle cx="740" cy="397" r="14"/><circle cx="610" cy="462" r="14"/><circle cx="740" cy="462" r="14"/></g></g>
  </g>
</svg>
`;

// Internet services
const internetServicesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 500" role="img" aria-labelledby="internet-title internet-desc">
  <title id="internet-title">Internet services</title>
  <desc id="internet-desc">The internet connects users to the web, email, video conferencing, ecommerce, file transfer and online communities.</desc>
  <defs>
    <linearGradient id="internet-bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eff6ff"/><stop offset="1" stop-color="#f5f3ff"/></linearGradient>
    <linearGradient id="internet-core" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient>
    <filter id="internet-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="7" stdDeviation="8" flood-color="#0f172a" flood-opacity=".12"/></filter>
  </defs>
  <rect width="900" height="500" rx="28" fill="url(#internet-bg)"/>
  <text x="450" y="50" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="29" font-weight="800" fill="#0f172a">Services Delivered Through the Internet</text>
  <text x="450" y="77" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" fill="#475569">Different services use agreed protocols to exchange data worldwide</text>
  <g stroke="#93c5fd" stroke-width="4"><path d="M450 250L200 145M450 250L200 250M450 250L200 355M450 250L700 145M450 250L700 250M450 250L700 355"/></g>
  <g font-family="Inter,Arial,sans-serif" filter="url(#internet-shadow)">
    <circle cx="450" cy="250" r="82" fill="url(#internet-core)"/><circle cx="450" cy="250" r="48" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/><path d="M402 250h96M450 202c-24 23-24 73 0 96M450 202c24 23 24 73 0 96" fill="none" stroke="#fff" stroke-width="3"/><text x="450" y="337" text-anchor="middle" font-size="13" font-weight="800" fill="#4338ca">GLOBAL NETWORK</text>
    <g text-anchor="middle">
      <rect x="75" y="100" width="250" height="90" rx="20" fill="#fff"/><circle cx="115" cy="145" r="23" fill="#dbeafe"/><path d="M102 135h26v20h-26zM102 136l13 10 13-10" fill="none" stroke="#2563eb" stroke-width="3"/><text x="220" y="139" font-size="19" font-weight="800" fill="#1d4ed8">E-mail</text><text x="220" y="162" font-size="12" fill="#64748b">Electronic messages &amp; attachments</text>
      <rect x="75" y="205" width="250" height="90" rx="20" fill="#fff"/><circle cx="115" cy="250" r="23" fill="#d1fae5"/><path d="M102 238h26v24h-26zM108 244h14" fill="none" stroke="#059669" stroke-width="3"/><text x="220" y="244" font-size="19" font-weight="800" fill="#047857">World Wide Web</text><text x="220" y="267" font-size="12" fill="#64748b">Linked pages accessed in a browser</text>
      <rect x="75" y="310" width="250" height="90" rx="20" fill="#fff"/><circle cx="115" cy="355" r="23" fill="#ede9fe"/><path d="M102 344h20v22h-20zM122 350l9-5v20l-9-5" fill="none" stroke="#7c3aed" stroke-width="3"/><text x="220" y="349" font-size="19" font-weight="800" fill="#6d28d9">Video conferencing</text><text x="220" y="372" font-size="12" fill="#64748b">Live audio, video &amp; screen sharing</text>
      <rect x="575" y="100" width="250" height="90" rx="20" fill="#fff"/><circle cx="615" cy="145" r="23" fill="#ffedd5"/><path d="M602 135h26l-3 18h-20zM608 158h1M621 158h1" fill="none" stroke="#ea580c" stroke-width="3"/><text x="720" y="139" font-size="19" font-weight="800" fill="#c2410c">E-commerce</text><text x="720" y="162" font-size="12" fill="#64748b">Buying, selling &amp; paying online</text>
      <rect x="575" y="205" width="250" height="90" rx="20" fill="#fff"/><circle cx="615" cy="250" r="23" fill="#cffafe"/><path d="M604 239h22v22h-22zM615 232v18M608 243l7 7 7-7" fill="none" stroke="#0891b2" stroke-width="3"/><text x="720" y="244" font-size="19" font-weight="800" fill="#0e7490">File transfer</text><text x="720" y="267" font-size="12" fill="#64748b">Upload and download using FTP/SFTP</text>
      <rect x="575" y="310" width="250" height="90" rx="20" fill="#fff"/><circle cx="615" cy="355" r="23" fill="#fef3c7"/><circle cx="609" cy="350" r="5" fill="none" stroke="#d97706" stroke-width="3"/><circle cx="622" cy="350" r="5" fill="none" stroke="#d97706" stroke-width="3"/><path d="M600 366c3-9 15-9 18 0M616 366c3-9 15-9 18 0" fill="none" stroke="#d97706" stroke-width="3"/><text x="720" y="349" font-size="19" font-weight="800" fill="#b45309">Online communities</text><text x="720" y="372" font-size="12" fill="#64748b">Forums, groups &amp; shared discussions</text>
    </g>
  </g>
</svg>
`;

// Generic placeholder image loader (assumes images are in ../computer/images/)
const foundationImage = (fileName: string) =>
  new URL(`../computer/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const softwareImages = {
  softwareHierarchy: svgToDataUri(softwareHierarchySvg),
  osTypes: svgToDataUri(osTypesSvg),
  networkCoverage: svgToDataUri(networkCoverageSvg),
  networkTopologies: svgToDataUri(networkTopologiesSvg),
  internetServices: svgToDataUri(internetServicesSvg),
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

interface ApplicationSoftwareType {
  name: string;
  purpose: string;
  explanation: string;
  examples: readonly string[];
  exampleUse: string;
}

interface AcquisitionMethod {
  name: string;
  alsoKnownAs: string;
  definition: string;
  howItWorks: string;
  examples: readonly string[];
  advantages: readonly string[];
  disadvantages: readonly string[];
}

interface SystemType {
  name: string;
  definition: string;
  howItWorks: string;
  examples: readonly string[];
  examClue: string;
  advantages?: readonly string[];
  disadvantages?: readonly string[];
}

interface NetworkCoverageType {
  abbreviation: string;
  name: string;
  scope: string;
  definition: string;
  explanation: string;
  examples: readonly string[];
  technologies: string;
  advantages: readonly string[];
  disadvantages: readonly string[];
}

const applicationSoftwareTypes: readonly ApplicationSoftwareType[] = [
  {
    name: 'Word Processing',
    purpose: 'Creating, editing, formatting, saving and printing text-based documents.',
    explanation: 'A word processor combines text entry with tools such as spelling and grammar checking, page layout, tables, mail merge, headers, footers and track changes. It is best when the main content is continuous text rather than calculations or page-perfect commercial artwork.',
    examples: ['Microsoft Word', 'Google Docs', 'LibreOffice Writer'],
    exampleUse: 'A school secretary types a letter, uses mail merge to insert every parent’s name and prints personalised copies.',
  },
  {
    name: 'Spreadsheets',
    purpose: 'Organising numeric data in rows and columns and calculating results with formulas.',
    explanation: 'Spreadsheet software uses cells, formulas, functions, charts, sorting and what-if modelling. When an input value changes, dependent formulas recalculate automatically, making spreadsheets useful for budgets, marks, stock figures and financial forecasts.',
    examples: ['Microsoft Excel', 'Google Sheets', 'LibreOffice Calc'],
    exampleUse: 'A teacher enters test marks, uses AVERAGE and IF functions, then produces a chart showing class performance.',
  },
  {
    name: 'Databases',
    purpose: 'Storing, organising, searching and updating structured collections of related data.',
    explanation: 'A database management system stores data in tables or other organised structures and provides queries, forms, reports, validation, relationships and access controls. It is preferred when many records must be searched or updated accurately without unnecessary duplication.',
    examples: ['Microsoft Access', 'MySQL', 'PostgreSQL'],
    exampleUse: 'A clinic searches a patient ID, updates the patient’s visit and prints a report without retyping personal details.',
  },
  {
    name: 'Presentation Software',
    purpose: 'Preparing and displaying information as a sequence of visual slides.',
    explanation: 'Presentation software combines text, charts, images, audio, video, animation and speaker notes. Slides should support the speaker with clear key points; they should not become crowded pages of continuous text.',
    examples: ['Microsoft PowerPoint', 'Google Slides', 'LibreOffice Impress'],
    exampleUse: 'A learner creates a science presentation containing labelled diagrams, a results chart and short speaker notes.',
  },
  {
    name: 'Graphics Software',
    purpose: 'Drawing, creating or editing bitmap and vector images.',
    explanation: 'Bitmap editors manipulate pixels and are suitable for photographs, while vector drawing programs create shapes and paths that can be enlarged without becoming pixelated. Common tools include layers, cropping, colour correction, brushes and object alignment.',
    examples: ['CorelDRAW', 'Adobe Photoshop', 'GIMP'],
    exampleUse: 'A designer removes a photograph’s background, corrects its colour and creates a scalable logo for a poster.',
  },
  {
    name: 'Desktop Publishing (DTP)',
    purpose: 'Producing professional publications that require precise control of text and graphics.',
    explanation: 'DTP software provides master pages, columns, text frames, image wrapping, typography, margins, bleed and print-ready export. Unlike a word processor, it gives exact control over where every page element is placed.',
    examples: ['Microsoft Publisher', 'Adobe InDesign', 'Scribus'],
    exampleUse: 'A school creates a multi-column magazine with repeated page numbers, consistent headings and print-ready photographs.',
  },
  {
    name: 'Communication Software',
    purpose: 'Enabling people or computers to exchange messages, files, voice, video or shared data.',
    explanation: 'Communication applications use network protocols to connect users and services. The category includes browsers, email clients, messaging tools and video-conferencing applications; the chosen tool depends on whether communication is live or delayed.',
    examples: ['Google Chrome', 'Microsoft Outlook', 'Zoom'],
    exampleUse: 'A class joins a live video lesson, shares a screen and sends the assignment through an online platform.',
  },
  {
    name: 'Authoring Software',
    purpose: 'Combining media and interaction to build computer-based learning or other interactive products.',
    explanation: 'Authoring tools let a developer arrange text, sound, animation, video, navigation buttons, quizzes and feedback, often with less programming than building the product from scratch. They are commonly used for computer-assisted instruction (CAI), simulations and e-learning.',
    examples: ['Adobe Captivate', 'Articulate Storyline', 'H5P'],
    exampleUse: 'A teacher builds an interactive lesson that explains a concept, asks questions and gives immediate feedback for each answer.',
  },
];

const acquisitionMethods: readonly AcquisitionMethod[] = [
  {
    name: 'Off-the-Shelf Software',
    alsoKnownAs: 'packaged, ready-made or generic software',
    definition: 'A completed application produced for a broad market and licensed to many customers with similar needs.',
    howItWorks: 'The buyer selects an existing product, checks its licence and requirements, purchases or downloads it, installs or activates it and configures the available options. The buyer normally cannot change the core source code.',
    examples: ['Microsoft Office', 'Adobe Photoshop', 'Sage Accounting'],
    advantages: [
      'It is available immediately, so implementation can begin quickly.',
      'Development cost is shared by many customers, making it cheaper than a new bespoke system.',
      'Popular products have already been tested by a large user base.',
      'Reviews and demonstrations make products easier to compare before purchase.',
      'User manuals, tutorials and training courses are usually available.',
      'The supplier normally provides updates and security patches.',
      'Many technicians already know how to install and support common packages.',
      'Files are often compatible with those used by other organisations.',
      'Trial versions may allow evaluation before committing money.',
      'A mature product may include more features than one organisation could afford to develop.',
    ],
    disadvantages: [
      'The software may not match every organisational procedure.',
      'Users may pay for many features they never need.',
      'The organisation may have to change its workflow to suit the package.',
      'Customisation is limited to the options provided by the supplier.',
      'Licence conditions may restrict users, devices, copying or modification.',
      'Subscription, upgrade or support charges can continue for many years.',
      'The supplier controls when features change or an old version is discontinued.',
      'A widely used package can be a common target for malware and attacks.',
      'Integration with unusual existing systems may be difficult.',
      'Different versions or proprietary file formats may create compatibility problems.',
    ],
  },
  {
    name: 'Bespoke Software from a Software House',
    alsoKnownAs: 'custom-written or tailor-made software',
    definition: 'A new system commissioned from an external developer for the requirements of one particular customer.',
    howItWorks: 'The customer supplies requirements; analysts study the current system; the software house designs, develops, tests and installs the solution; then the customer accepts it under an agreed contract.',
    examples: ['A bank’s custom loan-processing platform', 'A hospital patient-record system', 'A school’s custom admissions portal'],
    advantages: [
      'The system is designed around the customer’s exact requirements.',
      'It can follow existing specialist rules and workflows.',
      'Unnecessary features can be excluded from the design.',
      'It can integrate directly with the customer’s current databases and equipment.',
      'The customer can request reports and controls unique to the organisation.',
      'Training and documentation can use the organisation’s own terminology.',
      'A well-written contract can specify ownership, support and service levels.',
      'The system can provide a competitive advantage because rivals do not own the same solution.',
      'Future changes can be planned around the customer’s priorities.',
      'Security controls can be designed for the organisation’s particular risks.',
    ],
    disadvantages: [
      'Analysis, design, programming and testing make it expensive.',
      'Development can take months or years before the system is ready.',
      'Requirements may be misunderstood or may change during development.',
      'The first release may contain faults not found by a large user community.',
      'The customer depends heavily on the selected software house.',
      'Changes outside the original contract can increase cost and delay delivery.',
      'Specialist training may be required because users do not know the new system.',
      'The project can fail if the supplier lacks skills or stops trading.',
      'Maintenance may be difficult if documentation or source-code access is poor.',
      'The finished system may become obsolete before its development cost is recovered.',
    ],
  },
  {
    name: 'In-House Development',
    alsoKnownAs: 'internal development',
    definition: 'Software designed, programmed and maintained by the organisation’s own employees.',
    howItWorks: 'An internal development team gathers requirements from colleagues, builds prototypes, tests the system with users, deploys it and remains responsible for maintenance and improvement.',
    examples: ['An internal staff-leave system', 'A retailer’s stock dashboard', 'A university room-booking application'],
    advantages: [
      'Internal developers understand the organisation’s daily work and terminology.',
      'Users can communicate directly with the development team.',
      'Priorities can be changed without negotiating a new external contract.',
      'Confidential requirements and source code can remain inside the organisation.',
      'The software can be closely integrated with internal systems.',
      'Improvements can be released in small stages after user feedback.',
      'The organisation keeps technical knowledge about how the system works.',
      'Urgent faults may be handled by staff already on site.',
      'The organisation has greater control over the development schedule.',
      'Reusable internal components can reduce the cost of later projects.',
    ],
    disadvantages: [
      'Skilled analysts, programmers, testers and security staff are expensive to employ.',
      'Small teams may lack specialist knowledge required by the project.',
      'Development can distract the IT department from normal support duties.',
      'Staff turnover can remove essential knowledge about the source code.',
      'Internal relationships can make it difficult to reject unrealistic requests.',
      'Testing may be less independent and may miss familiar assumptions.',
      'The organisation must provide development tools, infrastructure and training.',
      'A project may take longer if team members have several responsibilities.',
      'The organisation carries the full risk of cost overruns and failure.',
      'Documentation may be neglected when developers are under time pressure.',
    ],
  },
  {
    name: 'Open-Source Software',
    alsoKnownAs: 'community-developed software',
    definition: 'Software whose licence allows users to inspect, use and modify its source code under stated conditions.',
    howItWorks: 'The organisation downloads an existing open-source project, verifies its licence and security, installs it and may use internal staff or a support company to configure or modify it.',
    examples: ['LibreOffice', 'Moodle', 'GIMP'],
    advantages: [
      'There is usually no per-user purchase fee.',
      'The source code can be inspected for security and quality.',
      'The organisation can modify the software to meet local needs.',
      'Open formats can reduce dependence on one supplier.',
      'Large communities may find faults and publish fixes quickly.',
      'The software can often be installed on many computers legally.',
      'Users can continue maintaining it even if one supplier stops operating.',
      'Community documentation, extensions and translations may be available.',
      'It encourages learning and local software-development skills.',
      'Competing support companies can provide choice instead of one compulsory vendor.',
    ],
    disadvantages: [
      'Installation and configuration may require strong technical skills.',
      'Official telephone support may not be included.',
      'Documentation and user experience can vary in quality.',
      'Some specialist proprietary file formats may not work perfectly.',
      'The organisation becomes responsible for evaluating updates and security.',
      'Useful extensions may be abandoned by their maintainers.',
      'Custom modifications can make later upgrades difficult.',
      'Training may be needed when staff are familiar with a proprietary alternative.',
      'There may be fewer certified technicians for a less common project.',
      'Although the licence is free, migration, hosting, support and maintenance still cost money.',
    ],
  },
  {
    name: 'Software as a Service (SaaS)',
    alsoKnownAs: 'cloud software or subscription software',
    definition: 'Software accessed as an online service while the provider hosts and maintains the application and its infrastructure.',
    howItWorks: 'The customer creates accounts and pays a recurring fee or uses a limited free plan. Users sign in through a browser or app while the provider operates the servers, stores data and releases updates.',
    examples: ['Microsoft 365', 'Google Workspace', 'Salesforce'],
    advantages: [
      'Users can begin without installing a large local server system.',
      'The provider handles most updates and routine maintenance.',
      'The service can be accessed from different authorised devices and locations.',
      'Capacity and user numbers can often be increased quickly.',
      'Subscription payments can avoid a large initial purchase cost.',
      'Teams can collaborate on shared cloud data in real time.',
      'All users normally receive the same current software version.',
      'Backups and disaster-recovery facilities may be included.',
      'The provider may offer high availability and specialist security staff.',
      'New features can be delivered without reinstalling software on every computer.',
    ],
    disadvantages: [
      'Reliable Internet access is required for full use of most services.',
      'Recurring fees can become expensive over a long period.',
      'The provider may increase prices or change the service conditions.',
      'An outage at the provider can affect every customer.',
      'Sensitive data is stored on infrastructure controlled by another organisation.',
      'Customisation may be limited to features exposed by the service.',
      'Moving data to another provider can be difficult because of vendor lock-in.',
      'Performance may fall when the connection is slow or congested.',
      'The organisation has limited control over when interface changes are introduced.',
      'Account theft or poor access control can expose cloud data from anywhere.',
    ],
  },
];

const systemTypes: readonly SystemType[] = [
  {
    name: 'Real-Time Processing System',
    definition: 'A system that processes input immediately and produces a response within a guaranteed time limit.',
    howItWorks: 'Sensors or transactions enter the system, the processor evaluates them at once, and the output changes the current situation. A late answer may be useless or dangerous, so response time is part of correctness.',
    examples: ['Anti-lock braking system', 'Intensive-care patient monitor', 'Aircraft flight-control system'],
    examClue: 'Look for immediate monitoring or control where delay could produce an incorrect or unsafe result.',
  },
  {
    name: 'Transaction Processing System (TPS)',
    definition: 'A system that records and processes routine business events called transactions.',
    howItWorks: 'Each sale, payment, booking or withdrawal is validated and recorded. A TPS may process transactions immediately or collect them for a later batch, so “transaction processing” describes the work, not necessarily the response speed.',
    examples: ['Supermarket point-of-sale system', 'Bank deposit system', 'Airline reservation system'],
    examClue: 'Look for repeated business events that change a record, such as a balance, stock level or booking.',
  },
  {
    name: 'Online System',
    definition: 'A system in which a user or device connects directly to a computer service through a communication network.',
    howItWorks: 'A terminal, browser or mobile app exchanges data with a host while the connection is active. “Online” means connected; it does not by itself guarantee a strict real-time deadline.',
    examples: ['Online banking portal', 'School learning-management system', 'Web-based ticket booking'],
    examClue: 'Look for remote interactive access to a host, database or Internet service.',
  },
  {
    name: 'Batch Processing System',
    definition: 'A system that collects similar jobs or transactions and processes them together at a scheduled time.',
    howItWorks: 'Input is gathered first, checked and placed in a batch. The computer then runs the whole batch with little or no user interaction and later produces reports, files or payments.',
    examples: ['Monthly payroll', 'Electricity-bill production', 'End-of-day bank clearing'],
    examClue: 'Look for large volumes, repeated processing and results that do not have to be immediate.',
  },
  {
    name: 'Distributed System',
    definition: 'A system whose processing and data are shared among independent networked computers that cooperate as one service.',
    howItWorks: 'Different nodes perform parts of the workload and exchange messages. Data may be stored at several sites, so the system must coordinate communication, security and consistency.',
    examples: ['Cloud-computing platform', 'Multi-branch banking system', 'Distributed scientific-computing project'],
    examClue: 'Look for cooperating computers at different locations rather than one machine doing all processing.',
    advantages: [
      'Local sites can continue useful processing without sending every task to one centre.',
      'Workload can be shared across several computers.',
      'Users receive faster responses when processing happens near them.',
      'The system can expand by adding more nodes when demand grows.',
      'Failure of one non-critical node does not always stop the entire system.',
      'Local staff can control data and services relevant to their site.',
      'Resources and specialist services can still be shared across locations.',
      'Network traffic may be reduced by processing data locally.',
      'Different sites can operate concurrently.',
      'It supports geographically separated organisations and remote work.',
    ],
    disadvantages: [
      'Designing and managing distributed software is complex.',
      'Data can become inconsistent when copies are updated at different sites.',
      'Strong network security is required across every connected location.',
      'Communication failures can interrupt coordination between nodes.',
      'Troubleshooting is harder because faults may occur on several machines or links.',
      'Duplicate hardware, software or data can increase costs.',
      'Backup and recovery must be coordinated across multiple sites.',
      'Different systems may have compatibility problems.',
      'Skilled administrators are needed to manage the network and services.',
      'Synchronising transactions can introduce delay and processing overhead.',
    ],
  },
  {
    name: 'Centralised System',
    definition: 'A system in which the main processing, control and usually the master data are kept at one central computer or site.',
    howItWorks: 'Users send requests to the central server, which applies common rules and returns results. This makes control and consistency easier but can create a single critical point of failure.',
    examples: ['School database on one central server', 'Central government payroll system', 'Mainframe-based reservation system'],
    examClue: 'Look for one controlling computer or location serving many terminals or departments.',
  },
  {
    name: 'Multimedia System',
    definition: 'A system that combines two or more media types such as text, graphics, sound, animation and video.',
    howItWorks: 'The computer stores, processes and presents several forms of media, often allowing the user to navigate or interact. Multimedia needs suitable input/output devices, storage and processing capacity.',
    examples: ['Interactive museum kiosk', 'Computer-assisted learning package', 'Video-editing workstation'],
    examClue: 'Look for several media forms integrated into one presentation or interactive product.',
  },
  {
    name: 'Computer Control System',
    definition: 'A system that uses a computer to monitor conditions and automatically operate physical equipment.',
    howItWorks: 'Sensors measure physical conditions, an analogue-to-digital converter supplies digital data, the processor compares values with programmed rules, and actuators change the process. Feedback allows continuous correction.',
    examples: ['Greenhouse climate controller', 'Traffic-light controller', 'Industrial robot assembly line'],
    examClue: 'Look for sensors as input, programmed decisions and actuators producing a physical output.',
  },
];

const networkHistory = [
  {
    period: '1960s',
    event: 'Time-sharing and packet-switching research',
    explanation: 'Large computers were expensive, so researchers connected terminals to share processing time. Packet switching divided messages into small packets that could travel efficiently through a network.',
  },
  {
    period: '1969',
    event: 'ARPANET connected its first sites',
    explanation: 'The research network linked computers at several United States universities and demonstrated communication between different locations using packet switching.',
  },
  {
    period: '1973–1980',
    event: 'Ethernet and internetworking developed',
    explanation: 'Ethernet provided a practical way to connect computers on local networks, while TCP/IP research created common rules for joining different networks.',
  },
  {
    period: '1983',
    event: 'ARPANET adopted TCP/IP',
    explanation: 'A common protocol suite allowed separate networks to communicate as an “internet”—a network of networks.',
  },
  {
    period: '1989–1991',
    event: 'The World Wide Web was introduced',
    explanation: 'The Web added linked pages, URLs and browsers on top of the Internet. The Internet is the network infrastructure; the Web is one service that uses it.',
  },
  {
    period: '1990s',
    event: 'Commercial and public networking expanded',
    explanation: 'Businesses, schools and homes connected through Internet service providers, while email and websites became everyday communication tools.',
  },
  {
    period: '2000s',
    event: 'Broadband and Wi-Fi became widespread',
    explanation: 'Faster always-on connections and wireless local networking supported richer websites, online media and portable devices.',
  },
  {
    period: '2010s–today',
    event: 'Mobile, cloud and Internet of Things networking',
    explanation: 'Smartphones, cloud platforms and connected sensors now exchange data continuously across local, cellular and global networks.',
  },
] as const;

const networkCoverageTypes: readonly NetworkCoverageType[] = [
  {
    abbreviation: 'PAN',
    name: 'Personal Area Network',
    scope: 'A few metres around one person',
    definition: 'A small network connecting an individual’s personal devices.',
    explanation: 'A PAN normally links devices that one person owns or uses. Connections are commonly wireless, although a USB cable can also form part of a PAN. It is the smallest coverage category.',
    examples: ['Phone connected to wireless earbuds', 'Smartwatch synchronised with a phone', 'Laptop using a phone’s Bluetooth connection'],
    technologies: 'Bluetooth, USB, NFC and short-range Wi-Fi',
    advantages: [
      'It connects a person’s devices without a large network installation.',
      'Short-range wireless connections reduce the need for cables.',
      'Most modern personal devices include PAN technology.',
      'Setup is usually quick and requires little specialist knowledge.',
      'The equipment cost is low because no dedicated server is required.',
      'Files and contacts can be exchanged directly between personal devices.',
      'Wearable devices can synchronise health data and notifications.',
      'A phone can share a connection with a nearby laptop or tablet.',
      'The small coverage area can reduce accidental access from far away.',
      'Portable devices remain connected while the user moves within the short range.',
    ],
    disadvantages: [
      'Its very short range cannot cover a building or organisation.',
      'Walls, bodies and radio interference can weaken wireless signals.',
      'Wireless use consumes battery power on portable devices.',
      'Pairing mistakes may connect to the wrong nearby device.',
      'Weak authentication can allow eavesdropping or unauthorised access.',
      'Different manufacturers may implement features incompatibly.',
      'PAN technologies usually support fewer devices than a LAN.',
      'Transfer speed can be lower than wired local networking.',
      'A lost central device, such as a phone, can break several connections.',
      'Frequent connection prompts and synchronisation faults can inconvenience users.',
    ],
  },
  {
    abbreviation: 'LAN',
    name: 'Local Area Network',
    scope: 'A room, home, building or local campus',
    definition: 'A privately managed network covering a limited geographical area.',
    explanation: 'A LAN connects nearby devices at one site. Ethernet switches provide wired connections and wireless access points provide Wi-Fi. The organisation usually owns or controls the network equipment.',
    examples: ['School computer-laboratory network', 'Office network in one building', 'Home router connecting family devices'],
    technologies: 'Ethernet, switches, Wi-Fi access points and network interface cards',
    advantages: [
      'High local transfer speeds support file and media sharing.',
      'Users can share printers, storage and an Internet connection.',
      'Central user accounts can control access to local resources.',
      'Central backups are easier to organise.',
      'Local communication can continue even when an outside Internet service fails.',
      'The owner can choose and enforce local security policies.',
      'Shared applications and licences may reduce duplication.',
      'Teams can collaborate on common files and databases.',
      'A LAN can be expanded by adding switches or access points.',
      'Faults are contained within a relatively small area and can be located quickly.',
    ],
    disadvantages: [
      'Switches, access points, servers and cabling require initial investment.',
      'Installation and administration need networking knowledge.',
      'A failed central switch or server can interrupt many users.',
      'Malware can spread quickly between poorly protected devices.',
      'Unauthorised users may access shared resources if permissions are weak.',
      'Cabling can be disruptive or expensive in existing buildings.',
      'Wi-Fi may suffer interference, dead zones and congestion.',
      'Hardware and security software require ongoing maintenance.',
      'Performance falls when too many users share limited capacity.',
      'The network is restricted to the local site unless connected to another network.',
    ],
  },
  {
    abbreviation: 'MAN',
    name: 'Metropolitan Area Network',
    scope: 'A town, city or large metropolitan area',
    definition: 'A network that interconnects multiple LANs across a metropolitan area.',
    explanation: 'A MAN is larger than a LAN but usually smaller than a WAN. It may be operated by a city authority, university, large organisation or telecommunications provider using high-capacity fibre links.',
    examples: ['Municipal network linking public offices', 'University network joining campuses across a city', 'City-wide network connecting bank branches'],
    technologies: 'Metro Ethernet, fibre-optic rings and high-capacity wireless links',
    advantages: [
      'It connects separate sites across one town or city.',
      'High-capacity links can carry voice, video and business data.',
      'Organisations can share central services between metropolitan branches.',
      'It is faster for local inter-site traffic than routing everything through distant services.',
      'A fibre ring can provide an alternative path when one link fails.',
      'Central administration can apply policies across several city sites.',
      'Shared data centres can reduce duplicate infrastructure at each site.',
      'It can support city services such as traffic monitoring and public safety.',
      'Additional local sites can be connected as the organisation grows.',
      'Economies of scale can make a shared metropolitan backbone efficient.',
    ],
    disadvantages: [
      'Fibre routes and carrier-grade equipment are expensive.',
      'Planning links across public land may require permits and coordination.',
      'Management is more complex than for a single LAN.',
      'A backbone fault can disrupt several organisations or branches.',
      'Longer distances introduce more failure points than a LAN.',
      'The operator must secure traffic travelling between many sites.',
      'Specialist equipment and technicians may be required.',
      'Customers may depend on one metropolitan service provider.',
      'Expanding beyond the city requires connection to a WAN.',
      'Repairing underground or shared infrastructure can take significant time.',
    ],
  },
  {
    abbreviation: 'WAN',
    name: 'Wide Area Network',
    scope: 'Regions, countries or continents',
    definition: 'A network that connects LANs or other networks across a very large geographical area.',
    explanation: 'A WAN uses telecommunications providers and long-distance links such as leased fibre, undersea cables, microwave, cellular networks or satellites. The Internet is the largest example of interconnected wide-area networks.',
    examples: ['A bank network linking national branches', 'A multinational company network', 'The Internet'],
    technologies: 'Leased lines, fibre backbones, cellular links, microwave, satellite, routers and VPNs',
    advantages: [
      'It connects users and branches over national or international distances.',
      'Remote sites can access central databases and applications.',
      'Organisations can communicate and collaborate globally.',
      'Central services can be shared without installing a full system at every branch.',
      'Remote workers can connect through secure virtual private networks.',
      'Data can be replicated to distant locations for disaster recovery.',
      'Businesses can serve customers across a wider market.',
      'Several link technologies can reach urban and remote areas.',
      'Cloud services can be accessed from geographically separated sites.',
      'A carefully designed WAN can use alternative routes for resilience.',
    ],
    disadvantages: [
      'Long-distance links and provider contracts can be expensive.',
      'Latency is usually higher than on a local network.',
      'Fault diagnosis is difficult because several providers and locations may be involved.',
      'Traffic crossing external networks faces greater security risks.',
      'Encryption, firewalls and monitoring add cost and complexity.',
      'A provider outage can disconnect an entire branch or region.',
      'Available speed may vary greatly between locations.',
      'Configuration requires skilled network engineers.',
      'International data transfer may have legal and privacy requirements.',
      'Satellite and remote links may be affected by weather, signal delay or limited capacity.',
    ],
  },
];

const networkTopologies = [
  {
    name: 'Star topology',
    definition: 'Every device has a separate link to a central switch or wireless access point.',
    explanation: 'All normal traffic passes through the central device. A broken end cable affects one node, but failure of the central device can stop the whole network.',
    examples: ['Modern switched Ethernet LAN', 'School laboratory connected to one switch', 'Home devices connected to a Wi-Fi router'],
  },
  {
    name: 'Bus topology',
    definition: 'All devices share one main backbone cable, with terminators at both ends.',
    explanation: 'A transmitted signal travels along the shared cable. It is simple and uses little cable, but collisions and backbone faults reduce performance and reliability.',
    examples: ['Early coaxial Ethernet', 'Small temporary legacy network', 'Some industrial fieldbus systems'],
  },
  {
    name: 'Ring topology',
    definition: 'Each device connects to two neighbours to form a closed loop.',
    explanation: 'Frames travel around the ring, often under token control. Predictable access can reduce collisions, but a single unprotected break can interrupt the loop.',
    examples: ['Legacy Token Ring network', 'Fibre Distributed Data Interface ring', 'Metropolitan fibre ring'],
  },
  {
    name: 'Mesh topology',
    definition: 'Devices have several interconnections; in a full mesh every device connects directly to every other device.',
    explanation: 'Multiple possible paths provide high resilience. A full mesh needs n(n−1)/2 links for n devices, so cost and complexity rise quickly as nodes are added.',
    examples: ['Wireless mesh network', 'Resilient router backbone', 'Full-mesh links between a few critical sites'],
  },
] as const;

const sections: TopicSection[] = [
  {
    id: 'part-a',
    title: 'Part A: Software Overview & Systems Software',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Software</strong> is a set of instructions written in computer language that tells the computer
              what to do. Without software, a computer is useless. Software is divided into <strong>Systems Software</strong> and <strong>Application Software</strong>.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <img src={softwareImages.softwareHierarchy} alt="Software hierarchy" className="w-full rounded-xl" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
              Systems Software
            </h3>
            <p className="text-slate-700 mb-3">
              <strong>Systems software</strong> operates and maintains the computer itself. It creates the working
              environment in which application programs run and acts as a bridge between users, applications and
              hardware. Its three important groups are operating systems, translators and utilities.
            </p>
            <div className="grid gap-4">
              <article className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xl font-black text-blue-800">Operating System (OS)</h4>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700">Resource manager</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  An <strong>operating system</strong> is the main systems software that starts the computer, manages
                  its hardware and provides services and an interface for users and applications. When an application
                  wants to save a file, display a window or print a page, it requests the OS to use the relevant
                  storage, screen or printer safely.
                </p>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-blue-50 p-4">
                    <h5 className="font-bold text-blue-800">How an OS works</h5>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      <li>Firmware starts and loads the OS kernel into memory.</li>
                      <li>The kernel detects hardware and loads device drivers.</li>
                      <li>The OS starts services and presents a user interface.</li>
                      <li>Applications request resources through OS services.</li>
                      <li>The OS schedules, protects and monitors those resources.</li>
                    </ol>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <h5 className="font-bold text-slate-800">Important OS functions</h5>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      <li><strong>Process management:</strong> schedules programs and CPU time.</li>
                      <li><strong>Memory management:</strong> allocates RAM and virtual memory.</li>
                      <li><strong>File management:</strong> organises files, folders and permissions.</li>
                      <li><strong>Device management:</strong> controls peripherals through drivers.</li>
                      <li><strong>User interface:</strong> provides GUI or command-line interaction.</li>
                      <li><strong>Security:</strong> authenticates users and protects resources.</li>
                      <li><strong>Error handling:</strong> detects, records and responds to faults.</li>
                      <li><strong>Networking:</strong> manages connections and shared services.</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-5">
                  <h5 className="mb-3 font-bold text-slate-800">Three operating-system examples</h5>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ['Microsoft Windows 11', 'A desktop OS with a graphical interface, broad business-software support and extensive hardware-driver support.'],
                      ['Ubuntu Linux', 'An open-source Linux distribution used on desktops and servers, with strong command-line and package-management tools.'],
                      ['Android', 'A mobile OS based on the Linux kernel that manages touch input, phone hardware, apps and mobile permissions.'],
                    ].map(([name, explanation]) => (
                      <div key={name} className="rounded-xl border border-blue-100 bg-white p-3">
                        <p className="font-bold text-blue-700">{name}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  <strong>Do not confuse the OS with applications:</strong> Windows, Ubuntu and Android manage the
                  computer; Word, Chrome and games run on top of an OS to perform user tasks.
                </div>

                <div className="mt-5">
                  <img src={softwareImages.osTypes} alt="OS types" className="w-full rounded-xl" />
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {[
                    ['Single-user OS', 'Designed for one active user. It may run one task at a time or allow that user to multitask.', 'Windows 11 on a personal laptop'],
                    ['Multi-user OS', 'Allows several users to access the same computer’s services while accounts, permissions and CPU time remain controlled.', 'UNIX serving university terminals'],
                    ['Multiprogramming OS', 'Keeps several programs in memory and switches the CPU to another job when one program waits for input or output.', 'A server OS running web, database and backup jobs'],
                    ['Multiprocessing OS', 'Uses two or more processors or CPU cores so instructions can execute in parallel.', 'Linux running on a multicore server'],
                    ['Batch OS', 'Collects similar jobs into batches and processes them with little direct interaction from users.', 'A mainframe processing monthly payroll jobs'],
                  ].map(([type, explanation, example]) => (
                    <div key={type} className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                      <h5 className="font-black text-blue-800">{type}</h5>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{explanation}</p>
                      <p className="mt-2 text-xs text-blue-900"><strong>Example:</strong> {example}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xl font-black text-violet-800">Translators</h4>
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-violet-700">Code converter</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  A <strong>translator</strong> is systems software that converts a program from a language humans can
                  write into a form the processor can execute. The original instructions are <strong>source code</strong>;
                  translated machine-language instructions are <strong>object code</strong>. Translation is necessary
                  because the CPU directly understands machine instructions, not statements such as
                  <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5">total = price * quantity</code>.
                </p>

                <div className="mt-5 grid gap-4">
                  {[
                    {
                      type: 'Compiler',
                      explanation: 'Translates the complete source program before execution. It reports a list of errors and, when successful, normally creates object code or an executable file. Compilation may take time, but the translated program can run quickly many times without translating every source statement again.',
                      example: 'GCC compiling a C or C++ program',
                      use: 'Suitable for finished applications that will be distributed or run repeatedly.',
                    },
                    {
                      type: 'Interpreter',
                      explanation: 'Translates and executes one statement at a time while the program runs. It usually stops at the first error, which makes testing interactive, but the source must be interpreted again during later runs.',
                      example: 'CPython executing a Python program',
                      use: 'Suitable for learning, scripting, rapid testing and interactive development.',
                    },
                    {
                      type: 'Assembler',
                      explanation: 'Converts assembly-language mnemonics such as MOV and ADD into the machine-code instructions for a particular processor architecture. Assembly is low-level, so the resulting code is hardware dependent.',
                      example: 'NASM assembling an x86 assembly program',
                      use: 'Suitable for device drivers, embedded code and routines needing close hardware control.',
                    },
                  ].map((translator) => (
                    <div key={translator.type} className="rounded-xl border border-violet-100 bg-violet-50/60 p-4">
                      <h5 className="font-black text-violet-800">{translator.type}</h5>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{translator.explanation}</p>
                      <p className="mt-2 text-sm text-slate-700"><strong>Example:</strong> {translator.example}</p>
                      <p className="text-sm text-slate-700"><strong>Best suited to:</strong> {translator.use}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="min-w-[680px] w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-800">
                      <tr><th className="p-3">Feature</th><th className="p-3">Compiler</th><th className="p-3">Interpreter</th><th className="p-3">Assembler</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      <tr><th className="p-3">Input</th><td className="p-3">High-level program</td><td className="p-3">High-level program</td><td className="p-3">Assembly program</td></tr>
                      <tr><th className="p-3">Translation</th><td className="p-3">Whole program first</td><td className="p-3">Statement by statement</td><td className="p-3">Mnemonic to machine instruction</td></tr>
                      <tr><th className="p-3">Saved executable</th><td className="p-3">Usually produced</td><td className="p-3">Usually not produced directly</td><td className="p-3">Object code is produced</td></tr>
                      <tr><th className="p-3">Error handling</th><td className="p-3">Reports errors after analysis</td><td className="p-3">Usually stops at the current error</td><td className="p-3">Reports invalid mnemonics or operands</td></tr>
                    </tbody>
                  </table>
                </div>
              </article>

              <article className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-xl font-black text-emerald-800">Utility Programs</h4>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700">Maintain and protect</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  A <strong>utility program</strong> performs a focused maintenance, protection, management or
                  optimisation task. Utilities support the OS and data rather than creating the user’s main work.
                  Some are supplied with an operating system; others are installed separately.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Security utilities', 'Scan for malware, quarantine harmful files and monitor suspicious behaviour.'],
                    ['Backup and recovery', 'Copy selected files or a complete system so data can be restored after loss.'],
                    ['Compression utilities', 'Reduce file size and package several files into an archive for storage or transfer.'],
                    ['Disk and file tools', 'Check storage errors, remove temporary files, search, rename or securely delete files.'],
                    ['Encryption utilities', 'Transform readable data into ciphertext that requires a key to open.'],
                    ['Diagnostic tools', 'Test memory, storage, temperature or network behaviour to locate faults.'],
                  ].map(([name, explanation]) => (
                    <div key={name} className="rounded-xl bg-emerald-50 p-3">
                      <p className="font-bold text-emerald-800">{name}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-600">{explanation}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <h5 className="mb-3 font-bold text-slate-800">Three utility-program examples</h5>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ['Microsoft Defender', 'Scans for malware, monitors threats and can quarantine suspicious files.'],
                      ['7-Zip', 'Compresses files into archives and extracts supported compressed formats.'],
                      ['Windows Backup', 'Creates recoverable copies of selected data to protect against deletion or failure.'],
                    ].map(([name, explanation]) => (
                      <div key={name} className="rounded-xl border border-emerald-100 p-3">
                        <p className="font-bold text-emerald-700">{name}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                  <strong>Exam distinction:</strong> an operating system manages the complete computing environment;
                  a utility concentrates on a narrower support task such as backup, malware scanning or compression.
                </p>
              </article>
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Systems Software Check</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>OS manages the whole environment</li>
              <li>Compiler translates the whole program</li>
              <li>Interpreter works statement by statement</li>
              <li>Assembler converts assembly language</li>
              <li>Utilities maintain and protect</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-b',
    title: 'Part B: Application Software',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Application Software</strong> is designed to perform specific tasks for users, such as word processing, spreadsheets, databases, etc.
            </p>
          </div>

          <div className="grid gap-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="max-w-3xl">
                <h4 className="text-xl font-black text-blue-800">Types of Application Software</h4>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Application software is grouped according to the <strong>main user task</strong> it performs.
                  The same product may contain overlapping features, but its category is determined by its primary
                  purpose. For example, a word processor can contain a small table, yet a spreadsheet is the correct
                  choice when formulas and recalculation are central to the task.
                </p>
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {applicationSoftwareTypes.map((application, index) => (
                  <article key={application.name} className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50/60 p-5">
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">{index + 1}</span>
                      <div>
                        <h5 className="text-lg font-black text-blue-800">{application.name}</h5>
                        <p className="mt-1 text-sm font-semibold text-slate-700">{application.purpose}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{application.explanation}</p>
                    <div className="mt-3">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">Three examples</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {application.examples.map((example) => (
                          <span key={example} className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-bold text-blue-700">{example}</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 rounded-xl bg-blue-100/70 p-3 text-xs leading-5 text-blue-900">
                      <strong>Practical example:</strong> {application.exampleUse}
                    </p>
                  </article>
                ))}
              </div>
              <PlaceholderImage placeholder="{app_software}" alt="Application software examples" />
            </section>

            <section className="rounded-2xl border border-violet-200 bg-violet-50/40 p-5 shadow-sm">
              <h4 className="text-xl font-black text-violet-800">Methods of Acquiring Software</h4>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
                <strong>Software acquisition</strong> is the process of obtaining the legal right and practical means
                to use a software solution. An organisation may buy a ready-made package, commission an external
                developer, build internally, adopt open-source software or subscribe to a hosted cloud service.
                The correct method depends on how unusual the requirements are, the available time, skills, budget,
                control and long-term support.
              </p>

              <div className="mt-6 space-y-8">
                {acquisitionMethods.map((method, index) => (
                  <article key={method.name} className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-500">Method {index + 1}</p>
                        <h5 className="mt-1 text-xl font-black text-violet-800">{method.name}</h5>
                        <p className="mt-1 text-xs font-semibold text-slate-500">Also called: {method.alsoKnownAs}</p>
                      </div>
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700">10 advantages • 10 disadvantages</span>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div className="rounded-xl bg-slate-50 p-4">
                        <h6 className="font-bold text-slate-800">Definition</h6>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{method.definition}</p>
                      </div>
                      <div className="rounded-xl bg-violet-50 p-4">
                        <h6 className="font-bold text-violet-800">How it is acquired</h6>
                        <p className="mt-1 text-sm leading-6 text-slate-700">{method.howItWorks}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">Three examples</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {method.examples.map((example) => (
                          <span key={example} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">{example}</span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-5">
                      <ProsConsComparison
                        title={`${method.name}: Advantages and Disadvantages`}
                        advantages={method.advantages}
                        disadvantages={method.disadvantages}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-cyan-200 bg-white p-5 shadow-sm">
              <h4 className="text-xl font-black text-cyan-800">Factors to Consider When Purchasing Application Software</h4>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
                A buyer should begin with documented user requirements and then evaluate the complete life of the
                software, not only its advertised features or purchase price. A low-cost package can become expensive
                if it needs new computers, difficult data conversion or constant support.
              </p>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[
                  ['Fitness for purpose', 'Does it perform every essential task accurately and produce the required outputs?', 'A payroll package must support the organisation’s deductions, reports and pay rules.'],
                  ['Compatibility', 'Will it work with the current operating system, file formats, peripherals and other applications?', 'Confirm that reports can open on existing computers and printers.'],
                  ['Hardware requirements', 'Compare the required processor, RAM, storage, display and network capacity with available equipment.', 'A graphics package may require more RAM and a stronger GPU.'],
                  ['Total cost of ownership', 'Include purchase, subscription, hardware, installation, migration, training, support, upgrades and maintenance.', 'A cheaper licence may cost more after compulsory annual support.'],
                  ['Licence and user limits', 'Check whether use is per person, device, site or concurrent user and whether copying is legally allowed.', 'A laboratory may need 30 device licences rather than one personal licence.'],
                  ['Ease of use', 'The interface, workflow and error messages should suit the ability of intended users.', 'A school should test the package with teachers before purchasing it.'],
                  ['Reliability and performance', 'The system should remain stable and respond fast enough with realistic data and user numbers.', 'Test a database with thousands of records, not only a small demonstration.'],
                  ['Security and privacy', 'Check authentication, permissions, encryption, audit trails, update policy and protection of personal data.', 'Medical software must restrict records to authorised staff.'],
                  ['Support and maintenance', 'Identify who solves faults, available support hours, response times and the cost of updates.', 'A critical business system may require a guaranteed service-level agreement.'],
                  ['Documentation and training', 'Good manuals, help screens, tutorials and training reduce mistakes and adoption time.', 'Confirm that beginner and administrator guidance are both available.'],
                  ['Data migration and integration', 'Existing data must be imported accurately and the package should exchange data with required systems.', 'Run a trial conversion and reconcile record totals before going live.'],
                  ['Scalability', 'The package should handle expected growth in users, records, branches and transaction volume.', 'A small shop may later add several branches and online sales.'],
                  ['Accessibility and localisation', 'Check keyboard access, screen-reader support, readable design, language, currency and date formats.', 'A Zimbabwean system may need local currency and day-month-year dates.'],
                  ['Supplier reputation and continuity', 'Review the supplier’s experience, financial stability, references and product-development plans.', 'Avoid depending on an unsupported product that may soon be discontinued.'],
                  ['Trial and acceptance testing', 'Use a demonstration, pilot or trial to test real requirements before full purchase.', 'Users should complete normal tasks and record faults against agreed criteria.'],
                ].map(([factor, explanation, example], index) => (
                  <article key={factor} className="rounded-xl border border-cyan-100 bg-cyan-50/50 p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-700 text-xs font-black text-white">{index + 1}</span>
                      <h5 className="font-black text-cyan-900">{factor}</h5>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{explanation}</p>
                    <p className="mt-2 text-xs leading-5 text-cyan-900"><strong>Example:</strong> {example}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Acquisition Summary</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Off-the-shelf – existing package</li>
              <li>Bespoke – commissioned externally</li>
              <li>In-house – built by employees</li>
              <li>Open source – adaptable source code</li>
              <li>SaaS – hosted subscription service</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-c',
    title: 'Part C: Types of Systems',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="text-xl font-black text-blue-900">What is a computer system?</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>computer system</strong> is a complete combination of hardware, software, data, procedures and
              people working together to perform a purpose. Systems are classified using different questions:
              <strong> when</strong> data is processed, <strong>how</strong> processing is organised,
              <strong>where</strong> users connect and <strong>what</strong> the system controls or presents.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              These labels can overlap. For example, an online airline reservation system is also a transaction
              processing system and usually processes bookings immediately. A factory control system is normally
              real-time. In an examination, identify the feature named in the question instead of assuming each
              system can have only one label.
            </p>
          </div>

          <div className="grid gap-4">
            {systemTypes.map((system, index) => (
              <article key={system.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">{index + 1}</span>
                  <div>
                    <h4 className="text-lg font-black text-blue-800">{system.name}</h4>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{system.definition}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
                  <div>
                    <h5 className="font-bold text-slate-800">How it works</h5>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{system.howItWorks}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">Three examples</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-700">
                      {system.examples.map((example) => <li key={example}>{example}</li>)}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                  <strong>Exam clue:</strong> {system.examClue}
                </p>
                {system.advantages && system.disadvantages && (
                  <div className="mt-4">
                    <ProsConsComparison
                      title="Distributed System Advantages and Disadvantages"
                      advantages={system.advantages}
                      disadvantages={system.disadvantages}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">System Types at a Glance</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Real‑time – immediate</li>
              <li>Batch – delayed, no interaction</li>
              <li>Online – connected</li>
              <li>TPS – handles business transactions</li>
              <li>Distributed – multiple locations</li>
              <li>Centralised – one location</li>
              <li>Multimedia – combines media types</li>
              <li>Control – sensors and actuators</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-d',
    title: 'Part D: Computer Networks',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-cyan-50 p-5">
            <h3 className="text-2xl font-black text-indigo-950">What is networking?</h3>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              <strong>Computer networking</strong> is the practice of connecting two or more computing devices so
              that they can communicate and share data, services and resources. A <strong>computer network</strong> is
              the resulting system of connected devices, communication links and agreed rules.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Each connected device is a <strong>node</strong>. Data travels through a wired or wireless
              <strong> communication link</strong> and follows a <strong>protocol</strong> such as TCP/IP. Network
              interface cards connect devices; switches join devices inside a LAN; routers move packets between
              different networks; servers provide shared services; and security controls decide who may connect.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Communication', 'Email, messaging, voice, video and shared work.'],
                ['Resource sharing', 'Printers, files, applications, storage and Internet access.'],
                ['Central services', 'Accounts, security policies, backups, databases and administration.'],
              ].map(([purpose, explanation]) => (
                <div key={purpose} className="rounded-xl border border-indigo-100 bg-white/80 p-3">
                  <h4 className="font-black text-indigo-800">{purpose}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">A Brief History of Computer Networking</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Networking developed from sharing expensive central computers to connecting billions of personal,
              mobile and embedded devices. The timeline below highlights the ideas learners should connect.
            </p>
            <ol className="relative mt-5 space-y-5 border-l-2 border-indigo-200 pl-6">
              {networkHistory.map((item) => (
                <li key={item.period} className="relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-100" />
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-black text-indigo-700">{item.period}</span>
                    <h4 className="font-black text-slate-800">{item.event}</h4>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.explanation}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-cyan-200 bg-cyan-50/50 p-5">
            <h3 className="text-xl font-black text-cyan-900">Why networks are grouped into types</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A network can be classified in several independent ways. <strong>Coverage types</strong>—PAN, LAN, MAN
              and WAN—answer “how large an area does it connect?” <strong>Architecture</strong>—peer-to-peer or
              client-server—answers “how are services controlled?” <strong>Topology</strong>—star, bus, ring or
              mesh—answers “how are nodes and links arranged?” This lesson first compares network types by
              geographical coverage, then explains topologies separately.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-white p-3"><strong className="text-cyan-800">Coverage:</strong><p className="mt-1 text-xs leading-5 text-slate-600">PAN, LAN, MAN and WAN. Based on physical area and distance.</p></div>
              <div className="rounded-xl bg-white p-3"><strong className="text-cyan-800">Architecture:</strong><p className="mt-1 text-xs leading-5 text-slate-600">Peer-to-peer or client-server. Based on roles and control.</p></div>
              <div className="rounded-xl bg-white p-3"><strong className="text-cyan-800">Topology:</strong><p className="mt-1 text-xs leading-5 text-slate-600">Star, bus, ring or mesh. Based on the arrangement of links.</p></div>
            </div>
            <img
              src={softwareImages.networkCoverage}
              alt="PAN, LAN, MAN and WAN arranged from smallest to largest geographical coverage"
              className="mt-5 w-full rounded-2xl border border-cyan-100 bg-white"
            />
          </section>

          <section>
            <div className="mb-4">
              <h3 className="text-xl font-black text-blue-900">Network Types by Geographical Coverage</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The boundary is practical rather than an exact number of kilometres. Ownership, link technology and
                the area served help determine the category.
              </p>
            </div>
            <div className="space-y-8">
              {networkCoverageTypes.map((network, index) => (
                <article key={network.abbreviation} className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-blue-700 px-2 text-sm font-black text-white">{network.abbreviation}</span>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-blue-500">Coverage type {index + 1}</p>
                        <h4 className="text-xl font-black text-blue-900">{network.name}</h4>
                        <p className="mt-1 text-sm font-bold text-slate-600">{network.scope}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700">10 advantages • 10 disadvantages</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-slate-800">{network.definition}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{network.explanation}</p>
                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <h5 className="font-black text-blue-800">Three examples</h5>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                        {network.examples.map((example) => <li key={example}>{example}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h5 className="font-black text-slate-800">Common technologies</h5>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{network.technologies}</p>
                    </div>
                  </div>
                  <div className="mt-5">
                    <ProsConsComparison
                      title={`${network.abbreviation} Advantages and Disadvantages`}
                      advantages={network.advantages}
                      disadvantages={network.disadvantages}
                    />
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-violet-900">Network Architecture: A Separate Classification</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <article className="rounded-xl bg-violet-50 p-4">
                <h4 className="font-black text-violet-800">Peer-to-peer (P2P)</h4>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Computers have broadly equal roles and share their own resources directly. It is inexpensive and
                  suitable for a very small group, but accounts, backups and security are difficult to control
                  consistently as the network grows.
                </p>
                <p className="mt-2 text-xs text-violet-800"><strong>Example:</strong> five office computers sharing folders directly.</p>
              </article>
              <article className="rounded-xl bg-violet-50 p-4">
                <h4 className="font-black text-violet-800">Client-server</h4>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Dedicated servers provide files, accounts, databases or applications to client devices. Central
                  management, security and backup are stronger, but servers, licences and skilled administration cost
                  more and server availability becomes important.
                </p>
                <p className="mt-2 text-xs text-violet-800"><strong>Example:</strong> school computers signing in to a central file server.</p>
              </article>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">Network Topologies: How Links Are Arranged</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              A <strong>network topology</strong> describes the physical or logical arrangement of nodes and
              communication links. It is not a coverage type: a LAN can use a star topology, while a MAN can use a
              resilient ring.
            </p>
            <div className="mt-4">
              <img src={softwareImages.networkTopologies} alt="Accurate star, ring, bus and full-mesh network topology diagrams" className="w-full rounded-xl" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {networkTopologies.map((topology) => (
                <article key={topology.name} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h4 className="font-black text-blue-800">{topology.name}</h4>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{topology.definition}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{topology.explanation}</p>
                  <p className="mt-3 text-xs font-black uppercase tracking-wider text-slate-500">Three examples</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-xs leading-5 text-slate-600">
                    {topology.examples.map((example) => <li key={example}>{example}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <ProsConsComparison
              title="Computer Networking: Overall Advantages and Disadvantages"
              advantages={[
                'Users can share printers, storage, Internet connections and other hardware.',
                'Files and databases can be shared between authorised users.',
                'Email, messaging and collaboration tools improve communication.',
                'Central storage can reduce unnecessary duplicate copies of files.',
                'Central backups make recovery easier to organise.',
                'Administrators can apply security rules and updates centrally.',
                'Shared applications can reduce software deployment costs.',
                'Teams can work on common documents and projects.',
                'Users can access permitted resources from different networked computers.',
                'A network can grow by adding more devices and services.',
              ]}
              disadvantages={[
                'Servers, switches, cables, wireless equipment and licences can be expensive.',
                'A network failure can interrupt access for many users.',
                'An insecure network can expose confidential data to attackers.',
                'Malware may spread rapidly between connected devices.',
                'Skilled staff are needed to install, secure and maintain the network.',
                'Busy networks may become slow because of congestion.',
                'A failed central server can make shared services unavailable.',
                'Users may access or alter files without correct permissions.',
                'Regular maintenance, monitoring and upgrades create ongoing costs.',
                'Poor configuration can cause address conflicts, data loss or unreliable connections.',
              ]}
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Network Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>PAN – around one person</li>
              <li>LAN – one local site</li>
              <li>MAN – town or city</li>
              <li>WAN – regions or countries</li>
              <li>Intranet – private network</li>
              <li>Extranet – extended to outsiders</li>
              <li>Switch – joins LAN devices</li>
              <li>Router – joins different networks</li>
              <li>Protocol – set of rules</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'part-e',
    title: 'Part E: The Internet and Its Services',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              The <strong>Internet</strong> is the worldwide system of interconnected networks that exchange data
              using the TCP/IP protocol suite. It provides services that have transformed communication, business
              and access to information.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <img src={softwareImages.internetServices} alt="Internet services" className="w-full rounded-xl" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Hardware & Software Requirements for Internet Connection</h4>
              <p className="text-sm text-slate-700"><strong>Hardware:</strong> Modem, communication link (phone/satellite), network card.</p>
              <p className="text-sm text-slate-700"><strong>Software:</strong> TCP/IP, web browser, network OS.</p>
              <p className="text-sm text-slate-700"><strong>Service:</strong> An account or data plan from an Internet Service Provider (ISP).</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Internet Services</h4>
              <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                <li><strong>E‑mail:</strong> Electronic messages and attachments sent between unique addresses such as username@domain.</li>
                <li><strong>World Wide Web (WWW):</strong> Collection of web pages. Accessed via browsers (e.g., Firefox, Chrome).</li>
                <li><strong>Teleconferencing / Video Conferencing:</strong> Meetings with audio/video. Saves travel costs but requires high bandwidth.</li>
                <li><strong>E‑Commerce (Online Shopping):</strong> Buying, selling, ordering, and paying for goods or services online.</li>
                <li><strong>File Transfer Protocol (FTP):</strong> Transfer files between computers.</li>
                <li><strong>Newsgroups:</strong> Online discussion boards.</li>
              </ul>
              <div className="mt-6">
                <ProsConsComparison
                  title="E-mail Advantages and Disadvantages"
                  advantages={[
                    'Messages usually reach recipients within seconds.',
                    'Sending email is inexpensive compared with physical mail.',
                    'One message can be sent to several recipients at once.',
                    'Documents, pictures, and other files can be attached.',
                    'Messages create a searchable written record.',
                    'Email can be accessed from many Internet-connected devices.',
                    'Users can reply or forward information quickly.',
                    'Folders and filters help organise communication.',
                    'Messages can be scheduled and automated.',
                    'It reduces paper, printing, and physical delivery.',
                  ]}
                  disadvantages={[
                    'Spam can waste time and storage.',
                    'Phishing messages may steal passwords or financial information.',
                    'Malicious attachments can contain malware.',
                    'Email requires a device, an account, and network access.',
                    'Messages may be misunderstood because tone and body language are absent.',
                    'Incorrect addresses can send information to the wrong person.',
                    'Large attachments may be blocked or slow to download.',
                    'Unencrypted email can expose confidential information.',
                    'Important messages may be hidden by filters or crowded inboxes.',
                    'Recipients may not read or respond immediately.',
                  ]}
                />
              </div>
              <div className="mt-6">
                <ProsConsComparison
                  title="E-commerce Advantages and Disadvantages"
                  advantages={[
                    'Customers can shop at any time of day.',
                    'People can buy from sellers outside their local area.',
                    'Websites make it easy to compare products and prices.',
                    'Businesses can reach a wider market.',
                    'Online stores can operate with lower premises costs.',
                    'Electronic ordering can speed up transactions.',
                    'Customer reviews provide additional purchasing information.',
                    'Digital records make orders and payments easier to track.',
                    'Home delivery benefits customers who cannot travel easily.',
                    'Automated stock and payment systems improve business efficiency.',
                  ]}
                  disadvantages={[
                    'Fraudulent websites or sellers may steal money.',
                    'Customers cannot physically inspect goods before buying.',
                    'Delivery can be delayed, expensive, lost, or damaged.',
                    'Payment details and personal information may be stolen.',
                    'Returns and refunds can be difficult.',
                    'Online shopping requires Internet access and digital skills.',
                    'Photographs or descriptions may misrepresent products.',
                    'Technical failures can prevent ordering or payment.',
                    'Local physical shops may lose customers and jobs.',
                    'Easy purchasing can encourage impulsive spending.',
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-blue-700">Effects of E‑Commerce and Cashless Society</h4>
              <div className="mt-4">
                <ProsConsComparison
                  title="Cashless Society Advantages and Disadvantages"
                  advantagesLabel="Benefits"
                  disadvantagesLabel="Drawbacks"
                  advantages={[
                    'Payments can be completed quickly without counting cash.',
                    'People can pay remotely through banking or mobile services.',
                    'Carrying less cash may reduce some forms of physical theft.',
                    'Electronic records help users track spending and transactions.',
                    'Businesses spend less time handling, counting, and transporting cash.',
                    'Automatic payments reduce the risk of forgetting regular bills.',
                    'Governments and businesses can detect some suspicious transaction patterns.',
                    'Digital payments support online commerce and remote services.',
                    'Lost payment cards can be blocked, unlike lost banknotes.',
                    'Electronic systems can improve the speed of financial reporting.',
                  ]}
                  disadvantages={[
                    'People without accounts, devices, connectivity, or skills may be excluded.',
                    'Power, network, or system failures can stop payments.',
                    'Criminals may steal account details through fraud or hacking.',
                    'Transactions create records that may reduce personal privacy.',
                    'Easy electronic payment may encourage overspending.',
                    'Fees may be charged for accounts, transfers, or merchant services.',
                    'A frozen or compromised account can prevent access to money.',
                    'Older people and other vulnerable users may struggle with digital systems.',
                    'Payment providers can gain significant control over transactions.',
                    'Cash-handling jobs and some physical banking services may decline.',
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <ProsConsComparison
                title="Internet Advantages and Disadvantages"
                advantages={[
                  'Provides rapid access to a very large range of information.',
                  'Search engines help users locate relevant resources.',
                  'Email, messaging, and calls support worldwide communication.',
                  'Learners can access courses, tutorials, and digital libraries.',
                  'Businesses can advertise, sell, and support customers online.',
                  'Remote work tools allow teams to collaborate across distances.',
                  'Online banking and government services save travel and waiting time.',
                  'Multimedia combines text, sound, images, animation, and video.',
                  'Cloud services make files available across several devices.',
                  'News, research, maps, and weather information can be updated quickly.',
                ]}
                disadvantages={[
                  'False, biased, or outdated information can mislead users.',
                  'Hacking, malware, phishing, and fraud create security risks.',
                  'Tracking and data collection can reduce privacy.',
                  'Cyberbullying and harassment can harm users.',
                  'Excessive use may affect sleep, concentration, health, or relationships.',
                  'Inappropriate or harmful content may be accessible.',
                  'Devices, data, and reliable connectivity can be expensive.',
                  'Unequal access creates a digital divide.',
                  'Copyrighted material can be copied or distributed illegally.',
                  'Internet or service outages can interrupt work, learning, and communication.',
                ]}
              />
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Key Internet Terms</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>ISP – Internet Service Provider</li>
              <li>Browser – views web pages</li>
              <li>Search Engine – finds information</li>
              <li>E‑mail address – unique identifier</li>
              <li>Domain types: .com, .org, .edu</li>
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
            <span className="text-2xl">⚙️</span>
            <h4 className="text-lg font-bold text-blue-700">Systems Software</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>OS – manages hardware</li>
            <li>Translators – compiler, interpreter, assembler</li>
            <li>Utilities – protect and maintain</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📄</span>
            <h4 className="text-lg font-bold text-blue-700">Application Software</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Word processing, spreadsheets</li>
            <li>Database, DTP, graphics, authoring</li>
            <li>Five acquisition methods</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌐</span>
            <h4 className="text-lg font-bold text-blue-700">Networks</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>PAN, LAN, MAN and WAN</li>
            <li>Topologies: star, ring, bus, mesh</li>
            <li>Architecture: P2P or client-server</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📡</span>
            <h4 className="text-lg font-bold text-blue-700">Internet Services</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>E‑mail, WWW, video conf.</li>
            <li>E‑commerce, FTP</li>
            <li>ISP, browser, search engine</li>
          </ul>
        </div>

        <div className="md:col-span-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔑</span>
            <h4 className="text-lg font-bold text-blue-700">Key Takeaway</h4>
          </div>
          <p className="text-slate-700 mt-1">Software is the heart of a computer – systems software manages the hardware, while application software helps users perform tasks. Networks and the internet connect everything, enabling communication and global access.</p>
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
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
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
      <div className="bg-gradient-to-r from-violet-600 to-indigo-800 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            SOFTWARE & NETWORKS
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Software, Computer Systems and Networks
          </h1>
          <p className="text-lg text-violet-100 max-w-2xl leading-relaxed">
            Understand systems software, application packages, acquisition decisions, processing systems,
            network coverage, architecture, topologies and Internet services.
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
          <div className="mt-12 p-6 bg-gradient-to-r from-violet-600 to-indigo-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-violet-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Systems Software</strong> – OS, translators, utilities – manages the computer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Application Software</strong> – word processors, spreadsheets, databases – helps users do tasks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Computer Systems</strong> – real‑time, batch, online, distributed – differ in processing style.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Networks</strong> – LAN/WAN, topologies (star, ring, bus, mesh) – connect computers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Internet Services</strong> – e‑mail, WWW, video conferencing, e‑commerce – revolutionise communication and business.</span>
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
                Next: <span className="text-violet-600">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-violet-600 text-white rounded-full font-bold hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Chapter'} →
          </button>
        </div>
      </div>
    </div>
  );
};

// Default export as LearningOutcome3
export default LearningOutcome3;

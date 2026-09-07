// Matrices2.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { requestGroqCompletion } from '../../../../../services/groq';

/* =========================================================================
   ICONS (inline SVGs)
   ========================================================================= */
const CircleHelp = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LoaderCircle = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const RotateCcw = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9m0 0-3 3m3-3 3 3" />
  </svg>
);

const Play = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const Pause = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const X = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* =========================================================================
   FLAGS
   ========================================================================= */
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
    <clipPath id="uk-clip-fa-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath id="uk-clip-fa-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g clipPath="url(#uk-clip-fa-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-fa-t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
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
    <path d="M 6.8 12.8 C 7.5 12 8.5 12.3 8.7 13 C 8.5 14 7.2 14.8 7.5 16 L 8.5 16.5 L 6.5 16.5 Z" fill="#ffd200" />
  </svg>
);

/* =========================================================================
   STYLES (injected as <style> tag)
   ========================================================================= */
const InkStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
    .gc-hand { font-family: 'Patrick Hand', cursive; }
    .gc-ink { font-family: 'Kalam', cursive; }
    @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .gc-timeline { appearance: none; -webkit-appearance: none; height: 6px; border-radius: 999px; outline: none; }
    .gc-timeline::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-timeline::-moz-range-thumb { width: 18px; height: 18px; border: 0; border-radius: 999px; background: #059669; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,.25); }
    .gc-paper { background-image: repeating-linear-gradient(#fbfaf6, #fbfaf6 26px, #e7e2d6 27px); background-position: 0 -2px; }
    .gc-frac-bar { transform: rotate(-0.6deg); box-shadow: 0 1px 0 rgba(23,23,23,0.15); }
    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 999px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 999px; }
    .custom-scrollbar { scrollbar-width: thin; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .section-enter { animation: gcEnter 320ms ease-out; }
  `}</style>
);

/* =========================================================================
   UTILITY FUNCTIONS
   ========================================================================= */
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const T = (value) => ({ type: 'text', value });
const F = (num, den) => ({ type: 'frac', num, den });
const M = (data) => ({ type: 'matrix', data }); // data is 2D array
// A + B = Result shown as one animated flow: numbers travel down from A/B into the result cell.
const MFLOW = (aData, bData, resultData, operator, label = '') => ({ type: 'matrixflow', aData, bData, resultData, operator, label });
// Animated "result" matrix: shows each cell's two source values merging into the answer.
const MR = (data, aData, bData, operator) => ({ type: 'matrixresult', data, aData, bData, operator });

let stepUid = 0;
const nextStepId = () => `ms${stepUid++}`;

const mkStep = (
  seg: any[],
  note: string,
  opts: { noteShona?: string; duration?: number; isFinal?: boolean } = {},
) => {
  const len = seg.reduce((s, p) => {
    if (p.type === 'text') return s + p.value.length;
    if (p.type === 'frac') return s + p.num.length + p.den.length + 3;
    if (p.type === 'matrix') {
      // approximate length: sum of all characters across all rows plus spaces
      let total = 0;
      p.data.forEach(row => {
        row.forEach(cell => {
          total += String(cell).length;
        });
        total += row.length - 1; // spaces
      });
      return s + total + 10; // brackets and spacing
    }
    if (p.type === 'matrixresult') {
      // needs extra time per cell for the raise/merge animation
      const cells = p.data.reduce((acc, row) => acc + row.length, 0);
      return s + cells * 22 + 20;
    }
    if (p.type === 'matrixflow') {
      const cells = p.resultData.reduce((acc, row) => acc + row.length, 0);
      return s + cells * 60 + 30;
    }
    return s;
  }, 0);
  return {
    id: nextStepId(),
    seg,
    note,
    noteShona: opts.noteShona || '',
    duration: opts.duration ?? Math.max(1800, len * 70),
    isFinal: opts.isFinal ?? false,
  };
};

const glyphMetrics = (char) => {
  if (/\s/.test(char)) return { cssWidth: 0.32, viewWidth: 10 };
  if (/[1ilI.,'()$%]/.test(char)) return { cssWidth: 0.4, viewWidth: 13 };
  if (/[mwMW]/.test(char)) return { cssWidth: 0.9, viewWidth: 28 };
  return { cssWidth: 0.66, viewWidth: 21 };
};

// Convert matrix data to a string with brackets (for fallback if needed)
const matrixToString = (data) => {
  const rows = data.map(row => row.join(' '));
  return '⎡' + rows.join(' ⎤ ⎡') + '⎦'; // not perfect but placeholder
};

// Describe a full step's math content as plain text, for feeding to the AI as context only
const describeStepForPrompt = (step, lang) => {
  const mathText = step.seg.map(s => {
    if (s.type === 'text') return s.value;
    if (s.type === 'frac') return `(${s.num})/(${s.den})`;
    if (s.type === 'matrix') return matrixToString(s.data);
    if (s.type === 'matrixresult') return matrixToString(s.data);
    if (s.type === 'matrixflow') return `${matrixToString(s.aData)} ${s.operator} ${matrixToString(s.bData)} = ${matrixToString(s.resultData)}`;
    return '';
  }).join('');
  const note = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;
  return `${mathText}  [reason given: ${note}]`;
};

/* =========================================================================
   MATRIX RENDERER (SVG with brackets)
   ========================================================================= */
const MatrixDisplay = ({ data, progress, compact = false, nested = false }) => {
  const rows = data;
  const numRows = rows.length;
  const numCols = rows[0] ? rows[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;

  // Estimate cell widths based on content (simplified: use max length per column)
  const colWidths = Array(numCols).fill(0);
  rows.forEach(row => {
    row.forEach((cell, ci) => {
      const len = String(cell).length;
      if (len > colWidths[ci]) colWidths[ci] = len;
    });
  });
  // Convert to pixel widths (approx)
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));

  const totalWidth = colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const totalHeight = numRows * rowHeight + cellPadding * 2;

  // Bracket path: curvy left bracket and right bracket
  const drawBracket = (x, y, height, direction = 1) => {
    // direction: 1 for left, -1 for right
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    // Path: from top tip to bottom tip with curved hooks instead of hard corners
    let path = '';
    if (direction === 1) { // left bracket
      path = `M ${x + hw} ${topY}
              Q ${x} ${topY} ${x} ${topY + curveSize}
              L ${x} ${botY - curveSize}
              Q ${x} ${botY} ${x + hw} ${botY}`;
    } else { // right bracket
      path = `M ${x} ${topY}
              Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize}
              L ${x + hw} ${botY - curveSize}
              Q ${x + hw} ${botY} ${x} ${botY}`;
    }
    return path;
  };

  // We'll render the entire matrix inside an SVG with a reveal opacity
  const overallProgress = clamp01(progress);
  const opacity = clamp01((overallProgress - 0.5) / 0.5); // fade in

  const svgStyle = nested
    ? { opacity }
    : { opacity, width: `min(100%, ${totalWidth}px)`, height: 'auto' };

  return (
    <svg
      width={nested ? totalWidth : undefined}
      height={nested ? totalHeight : undefined}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={nested ? 'shrink-0 overflow-visible' : 'block max-w-full overflow-visible'}
      style={svgStyle}
    >
      {/* Brackets */}
      <path
        d={drawBracket(0, 0, totalHeight, 1)}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={drawBracket(totalWidth - bracketWidth, 0, totalHeight, -1)}
        stroke="#1e3a8a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cells */}
      {rows.map((row, ri) => {
        let xOffset = bracketWidth + cellPadding;
        return row.map((cell, ci) => {
          const cellWidth = colPx[ci];
          const cx = xOffset + cellWidth / 2;
          const cy = ri * rowHeight + rowHeight / 2 + cellPadding;
          const cellStr = String(cell);
          xOffset += cellWidth;
          // Render each cell as a handwritten text
          return (
            <text
              key={`${ri}-${ci}`}
              x={cx}
              y={cy + fontSize * 0.35}
              fontFamily="Kalam, cursive"
              fontSize={fontSize}
              fontWeight="700"
              fill="#1e3a8a"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {cellStr}
            </text>
          );
        });
      })}
    </svg>
  );
};

/* =========================================================================
   ANIMATED RESULT MATRIX: per-cell "raise the two operands, merge, drop in"
   ========================================================================= */
const MatrixResultDisplay = ({ resultData, aData, bData, operator, progress, compact = false }) => {
  const rows = resultData;
  const numRows = rows.length;
  const numCols = rows[0] ? rows[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const exprFontSize = compact ? 13 : 16;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;

  const colWidths = Array(numCols).fill(0);
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      const exprLen = `${aData[ri][ci]} ${operator} ${bData[ri][ci]}`.length;
      const resLen = String(cell).length;
      const len = Math.max(exprLen * 0.72, resLen);
      if (len > colWidths[ci]) colWidths[ci] = len;
    });
  });
  const colPx = colWidths.map(w => Math.max(44, w * (compact ? 10 : 13) + cellPadding * 2));

  const totalWidth = colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const totalHeight = numRows * rowHeight + cellPadding * 2;

  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) {
      return `M ${x + hw} ${topY}
              Q ${x} ${topY} ${x} ${topY + curveSize}
              L ${x} ${botY - curveSize}
              Q ${x} ${botY} ${x + hw} ${botY}`;
    }
    return `M ${x} ${topY}
            Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize}
            L ${x + hw} ${botY - curveSize}
            Q ${x + hw} ${botY} ${x} ${botY}`;
  };

  const overallProgress = clamp01(progress);
  const containerOpacity = clamp01((overallProgress - 0.02) / 0.1);

  const totalCells = Math.max(1, numRows * numCols);
  let cellIndex = 0;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="block max-w-full overflow-visible"
      style={{ opacity: containerOpacity, width: `min(100%, ${totalWidth}px)`, height: 'auto' }}
    >
      <path d={drawBracket(0, 0, totalHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={drawBracket(totalWidth - bracketWidth, 0, totalHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {rows.map((row, ri) => {
        let xOffset = bracketWidth + cellPadding;
        return row.map((cell, ci) => {
          const cellWidth = colPx[ci];
          const cx = xOffset + cellWidth / 2;
          const cy = ri * rowHeight + rowHeight / 2 + cellPadding;
          xOffset += cellWidth;

          const myIndex = cellIndex++;
          const cellStart = myIndex / totalCells;
          const cellEnd = (myIndex + 1) / totalCells;
          const p = clamp01((overallProgress - cellStart) / (cellEnd - cellStart));

          const aVal = aData[ri][ci];
          const bVal = bData[ri][ci];
          const exprText = `${aVal} ${operator} ${bVal}`;
          const resText = String(cell);

          // Phase 1 (0 - 0.3): the two operands rise up into place, red.
          const riseP = clamp01(p / 0.3);
          const exprY = cy + (1 - riseP) * 16;
          // Phase 2 (0.3 - 0.65): they hold, visible, red, combined as "a + b".
          // Phase 3 (0.65 - 0.93): crossfade + shrink out red expr, grow in blue result.
          const exprOpacity = p <= 0.65 ? clamp01(p / 0.15) : clamp01(1 - (p - 0.65) / 0.15);
          const resultOpacity = clamp01((p - 0.68) / 0.28);
          const resultScale = 0.82 + resultOpacity * 0.18;

          return (
            <g key={`${ri}-${ci}`}>
              <text
                x={cx}
                y={exprY + exprFontSize * 0.32}
                fontFamily="Kalam, cursive"
                fontSize={exprFontSize}
                fontWeight="700"
                fill="#dc2626"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={exprOpacity}
              >
                {exprText}
              </text>
              <text
                x={cx}
                y={cy + fontSize * 0.35}
                fontFamily="Kalam, cursive"
                fontSize={fontSize}
                fontWeight="700"
                fill="#1e3a8a"
                textAnchor="middle"
                dominantBaseline="middle"
                opacity={resultOpacity}
                style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${resultScale})` }}
              >
                {resText}
              </text>
            </g>
          );
        });
      })}
    </svg>
  );
};

/* =========================================================================
   MATRIX FLOW: A and B render via MatrixDisplay (unchanged), then each
   source number physically travels down from its real cell position into
   the result cell, pauses in red as "a op b", then the merged value is
   hand-drawn (stroke reveal) in blue at its final spot.
   ========================================================================= */
const MatrixFlowDisplay = ({ aData, bData, resultData, operator, label = '', progress, compact = false }) => {
  const numRows = resultData.length;
  const numCols = resultData[0] ? resultData[0].length : 0;
  const fontSize = compact ? 20 : 26;
  const rowHeight = fontSize * 1.6;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;
  const rowGap = compact ? 30 : 40;
  const midGap = compact ? 16 : 22;
  const eqSymbolWidth = compact ? 18 : 24;
  const labelWidth = label ? Array.from(label).length * (fontSize * 0.62) + midGap : 0;

  const opGap = compact ? 22 : 34;
  const opSymbolWidth = compact ? 26 : 34;
  const opGlyphNudge = 0;

  const colWidthsFor = (data) => {
    const w = Array(numCols).fill(0);
    data.forEach(row => row.forEach((cell, ci) => {
      const len = String(cell).length;
      if (len > w[ci]) w[ci] = len;
    }));
    return w.map(w0 => Math.max(30, w0 * (compact ? 12 : 16) + cellPadding * 2));
  };

  const colPxA = colWidthsFor(aData);
  const colPxB = colWidthsFor(bData);
  const colPxR = colWidthsFor(resultData);

  const matrixWidth = (colPx) => colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
  const widthA = matrixWidth(colPxA);
  const widthB = matrixWidth(colPxB);
  const widthR = matrixWidth(colPxR);
  const matrixHeight = numRows * rowHeight + cellPadding * 2;

  // Row 1: [label] A op B — left-aligned, starting at x=0
  const aX = labelWidth;
  const opX = aX + widthA + opGap;
  const bX = opX + opSymbolWidth + opGap;
  const row1Width = aX + widthA + opGap + opSymbolWidth + opGap + widthB;

  // Row 2: "=" Result — indented to start where A starts, so it visually
  // sits "under" the expression it came from, on every screen size.
  const eqX = labelWidth;
  const rX = eqX + eqSymbolWidth + midGap;
  const row2Width = eqX + eqSymbolWidth + midGap + widthR;

  const totalWidth = Math.max(row1Width, row2Width);

  const row1Y = 0;
  const row2Y = matrixHeight + rowGap;
  const totalHeight = matrixHeight * 2 + rowGap;

  const drawBracket = (x, y, height, direction = 1) => {
    const hw = bracketWidth;
    const pad = 4;
    const topY = y + pad;
    const botY = y + height - pad;
    const curveSize = Math.min(hw * 1.6, (height - pad * 2) * 0.18);
    if (direction === 1) {
      return `M ${x + hw} ${topY} Q ${x} ${topY} ${x} ${topY + curveSize} L ${x} ${botY - curveSize} Q ${x} ${botY} ${x + hw} ${botY}`;
    }
    return `M ${x} ${topY} Q ${x + hw} ${topY} ${x + hw} ${topY + curveSize} L ${x + hw} ${botY - curveSize} Q ${x + hw} ${botY} ${x} ${botY}`;
  };

  const cellCenter = (matrixX, matrixY, colPx, ri, ci) => {
    let xOff = matrixX + bracketWidth + cellPadding;
    for (let k = 0; k < ci; k++) xOff += colPx[k];
    const cx = xOff + colPx[ci] / 2;
    const cy = matrixY + ri * rowHeight + rowHeight / 2 + cellPadding;
    return [cx, cy];
  };

  const overall = clamp01(progress);
  const introP = clamp01(overall / 0.1);
  const totalCells = Math.max(1, numRows * numCols);
  const cellsStart = 0.1;
  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const labelDashLen = label ? Array.from(label).length * 30 + 20 : 0;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="block max-w-full overflow-visible"
      style={{ width: `min(100%, ${totalWidth}px)`, height: 'auto' }}
    >
      {label && (
        <text
          x={0}
          y={row1Y + matrixHeight / 2 + fontSize * 0.35}
          fontFamily="Kalam, cursive"
          fontSize={fontSize}
          fontWeight="700"
          fill="#1e3a8a"
          stroke="#1e3a8a"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={labelDashLen}
          strokeDashoffset={labelDashLen * (1 - introP)}
          fillOpacity={clamp01((introP - 0.6) / 0.4)}
          textAnchor="start"
          dominantBaseline="middle"
        >
          {label}
        </text>
      )}

      <g style={{ opacity: introP }}>
        <g transform={`translate(${aX}, ${row1Y})`}>
          <MatrixDisplay data={aData} progress={1} compact={compact} nested />
        </g>
        <text
          x={opX + opSymbolWidth / 2}
          y={row1Y + matrixHeight / 2}
          fontFamily="system-ui, -apple-system, sans-serif, Kalam"
          fontSize={compact ? 22 : 28}
          fontWeight="800"
          fill="#0284c7"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {operator}
        </text>
        <g transform={`translate(${bX}, ${row1Y})`}>
          <MatrixDisplay data={bData} progress={1} compact={compact} nested />
        </g>
      </g>

      <g style={{ opacity: introP }}>
        <text x={eqX + eqSymbolWidth / 2} y={row2Y + matrixHeight / 2} fontFamily="Kalam, cursive" fontSize={fontSize} fontWeight="700" fill="#1e3a8a" textAnchor="middle" dominantBaseline="central">
          =
        </text>
        <path d={drawBracket(rX, row2Y, matrixHeight, 1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={drawBracket(rX + widthR - bracketWidth, row2Y, matrixHeight, -1)} stroke="#1e3a8a" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {resultData.map((row, ri) => row.map((cell, ci) => {
        const cellIdx = ri * numCols + ci;
        const cellStart = cellsStart + (cellIdx / totalCells) * (1 - cellsStart);
        const cellEnd = cellsStart + ((cellIdx + 1) / totalCells) * (1 - cellsStart);
        const p = clamp01((overall - cellStart) / (cellEnd - cellStart));

        const [aCx, aCy] = cellCenter(aX, row1Y, colPxA, ri, ci);
        const [bCx, bCy] = cellCenter(bX, row1Y, colPxB, ri, ci);
        const [rCx, rCy] = cellCenter(rX, row2Y, colPxR, ri, ci);

        const aVal = aData[ri][ci];
        const bVal = bData[ri][ci];
        const resVal = String(cell);

        const slotOffset = fontSize * 0.6;
        const leftSlot = [rCx - slotOffset, rCy];
        const rightSlot = [rCx + slotOffset, rCy];

        const travelP = ease(clamp01(p / 0.45));
        const aTravelX = aCx + (leftSlot[0] - aCx) * travelP;
        const aTravelY = aCy + (leftSlot[1] - aCy) * travelP;
        const bTravelX = bCx + (rightSlot[0] - bCx) * travelP;
        const bTravelY = bCy + (rightSlot[1] - bCy) * travelP;

        const travelOpacity = clamp01(p / 0.12);
        const holdEndFade = p >= 0.68 ? clamp01(1 - (p - 0.68) / 0.12) : 1;
        const operandsOpacity = travelOpacity * holdEndFade;
        const operandsScale = p >= 0.68 ? Math.max(0.2, holdEndFade) : 1;

        const opSignOpacity = clamp01((p - 0.3) / 0.15) * holdEndFade;
        const resultDrawP = clamp01((p - 0.72) / 0.28);
        const dashLen = resVal.length * 46 + 20;
        const showOperands = p < 0.85;

        return (
          <g key={`${ri}-${ci}`}>
            {showOperands && (
              <>
                <text
                  x={aTravelX}
                  y={aTravelY + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.82}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={operandsOpacity}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}
                >
                  {aVal}
                </text>
                <text
                  x={rCx}
                  y={rCy + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.7}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={opSignOpacity}
                >
                  {operator}
                </text>
                <text
                  x={bTravelX}
                  y={bTravelY + fontSize * 0.3}
                  fontFamily="Kalam, cursive"
                  fontSize={fontSize * 0.82}
                  fontWeight="700"
                  fill="#dc2626"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  opacity={operandsOpacity}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center', transform: `scale(${operandsScale})` }}
                >
                  {bVal}
                </text>
              </>
            )}

            <text
              x={rCx}
              y={rCy + fontSize * 0.35}
              fontFamily="Kalam, cursive"
              fontSize={fontSize}
              fontWeight="700"
              fill="#1e3a8a"
              stroke="#1e3a8a"
              strokeWidth="0.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={dashLen}
              strokeDashoffset={dashLen * (1 - resultDrawP)}
              fillOpacity={clamp01((resultDrawP - 0.55) / 0.45)}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {resVal}
            </text>
          </g>
        );
      }))}
    </svg>
  );
};

// Handwritten character rendering (unchanged)
const HandwrittenRun = ({
  value,
  progress,
  compact = false,
}: {
  value: string;
  progress: number;
  compact?: boolean;
}) => {
  const chars = Array.from(value);
  const totalChars = chars.length;

  const renderGlyph = (ch, idx) => {
    const gp = clamp01(progress * totalChars - idx);
    const { cssWidth, viewWidth } = glyphMetrics(ch);
    return (
      <svg
        key={idx}
        aria-hidden="true"
        viewBox={`0 0 ${viewWidth} 30`}
        className={compact ? 'h-[1.4em] shrink-0 overflow-visible' : 'h-[1.55em] shrink-0 overflow-visible'}
        style={{ width: `${cssWidth}em` }}
      >
        <text
          x="1"
          y="23"
          fontFamily="Kalam, cursive"
          fontSize={compact ? 24 : 27}
          fontWeight="700"
          fill="#1e3a8a"
          fillOpacity={clamp01((gp - 0.72) / 0.28)}
          stroke="#1e3a8a"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          strokeDashoffset={240 * (1 - gp)}
        >
          {ch}
        </text>
      </svg>
    );
  };

  // Group characters into words so a word never splits across a line break,
  // while still letting long lines wrap naturally at the spaces between words.
  const words = [];
  let currentWord = [];
  let globalIdx = 0;
  chars.forEach((ch) => {
    if (/\s/.test(ch)) {
      if (currentWord.length) { words.push(currentWord); currentWord = []; }
      words.push([{ ch, idx: globalIdx }]);
    } else {
      currentWord.push({ ch, idx: globalIdx });
    }
    globalIdx += 1;
  });
  if (currentWord.length) words.push(currentWord);

  return (
    <span
      className={`inline-flex flex-wrap items-baseline ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}
      aria-label={value}
    >
      {words.map((word, wi) => {
        if (word.length === 1 && /\s/.test(word[0].ch)) {
          const { cssWidth } = glyphMetrics(word[0].ch);
          return <span key={wi} aria-hidden="true" style={{ width: `${cssWidth}em` }} />;
        }
        return (
          <span key={wi} className="inline-flex shrink-0 flex-nowrap whitespace-nowrap items-baseline">
            {word.map(({ ch, idx }) => renderGlyph(ch, idx))}
          </span>
        );
      })}
    </span>
  );
};

// Mirrors MatrixDisplay's totalWidth calculation so the wrapper span can have an
// explicit pixel width matching the SVG — this prevents the span from stretching
// inside a flex row and creating a gap between the matrix and the operator symbol.
const matrixNaturalWidth = (data, compact = false) => {
  const numCols = data[0] ? data[0].length : 0;
  const cellPadding = compact ? 8 : 12;
  const bracketWidth = compact ? 10 : 14;
  const colWidths = Array(numCols).fill(0);
  data.forEach(row => row.forEach((cell, ci) => {
    const len = String(cell).length;
    if (len > colWidths[ci]) colWidths[ci] = len;
  }));
  const colPx = colWidths.map(w => Math.max(30, w * (compact ? 12 : 16) + cellPadding * 2));
  return colPx.reduce((a, b) => a + b, 0) + bracketWidth * 2 + cellPadding * 2;
};

// Single-line math display – now with matrix support
const MathLine = ({ seg, progress, isFinal }) => {
  // We'll compute total "length" for progress: each element consumes a portion
  // For simplicity, we assign each element equal weight (1)
  const total = seg.length;
  const revealed = clamp01(progress) * total;
  let consumed = 0;

  const rendered = seg.map((s, i) => {
    const localProgress = clamp01((revealed - consumed) / 1);
    consumed += 1;

    if (s.type === 'text') {
      // Render pure operator symbols (×, +, −, =, ÷) as large, bold, vertically-centred
      // spans so they look correct next to matrix brackets instead of being tiny SVG glyphs
      const trimmed = s.value.trim();
      const MATRIX_OPS = ['×', '×', '+', '−', '-', '=', '÷', '·'];
      if (MATRIX_OPS.includes(trimmed)) {
        return (
          <span
            key={i}
            className="mx-2 inline-flex shrink-0 items-center self-center font-black text-sky-600"
            style={{ fontSize: '1.45rem', lineHeight: 1, opacity: clamp01((localProgress - 0.5) / 0.5) }}
            aria-label={trimmed}
          >
            {trimmed}
          </span>
        );
      }
      // Split text into individual characters for handwriting reveal
      return <HandwrittenRun key={i} value={s.value} progress={localProgress} />;
    } else if (s.type === 'frac') {
      const nProg = clamp01(localProgress * 2);
      const barProg = clamp01(localProgress * 2 - 1);
      const dProg = clamp01(localProgress * 2 - 1.5);
      return (
        <span key={i} className="mx-1.5 inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap">
          <HandwrittenRun value={s.num} progress={nProg} compact />
          <span className="my-0.5 h-[2px] w-full min-w-5 origin-left bg-blue-900" style={{ transform: `scaleX(${barProg})` }} />
          <HandwrittenRun value={s.den} progress={dProg} compact />
        </span>
      );
        } else if (s.type === 'matrix') {
      // Compute natural SVG width so the wrapper span doesn't stretch in the flex row
      const mw = matrixNaturalWidth(s.data, true);
      return (
        <span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}>
          <MatrixDisplay data={s.data} progress={localProgress} compact />
        </span>
      );
    } else if (s.type === 'matrixresult') {
      const mw = matrixNaturalWidth(s.data, true);
      return (
        <span key={i} className="mx-1 shrink-0 inline-block align-middle" style={{ width: mw }}>
          <MatrixResultDisplay
            resultData={s.data}
            aData={s.aData}
            bData={s.bData}
            operator={s.operator}
            progress={localProgress}
            compact
          />
        </span>
      );
    } else if (s.type === 'matrixflow') {
      return (
        <span key={i} className="mx-1 block w-full max-w-full min-w-0 align-middle">
          <MatrixFlowDisplay
            aData={s.aData}
            bData={s.bData}
            resultData={s.resultData}
            operator={s.operator}
            label={s.label}
            progress={localProgress}
            compact
          />
        </span>
      );
    }
    return null;
  });

  const safe = clamp01(progress);
  const doneFinal = isFinal && safe >= 1;

  return (
    <div
      className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-y-1 py-1.5 ${doneFinal ? 'border-b-4 border-double border-red-600 pb-1 pr-2' : ''}`}
    >
      {rendered}
    </div>
  );
};

// AI explanation popup for each worked step.
const StepExplanationHelp = ({ question, stepsThroughCurrent, stepNumber, lang = 'en' }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thinkingIndex, setThinkingIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const thinkingWords = lang === 'sn'
    ? ['Kufunga', 'Kutarisa', 'Kunzvera', 'Kuongorora', 'Kufambisa', 'Kutsvaga', 'Kupimisa', 'Kuverenga', 'Kudzokorora', 'Kuronga']
    : ['Delving', 'Pondering', 'Navigating', 'Unraveling', 'Elucidating', 'Deciphering', 'Charting', 'Weighing', 'Cross-checking', 'Reasoning'];

  useEffect(() => {
    if (!loading) { setThinkingIndex(0); return undefined; }
    const iv = setInterval(() => setThinkingIndex(c => (c + 1) % thinkingWords.length), 850);
    return () => clearInterval(iv);
  }, [loading, thinkingWords]);

  const askForExplanation = async () => {
    setOpen(true);
    if (response || loading) return;
    setLoading(true);
    setError('');

    const selected = stepsThroughCurrent[stepsThroughCurrent.length - 1];
    const previousSteps = stepsThroughCurrent.slice(0, -1);

    const contextLines = [
      `The original question was: ${question}`,
      previousSteps.length > 0
        ? `Steps already shown to the student before this one:\n${previousSteps.map((s, i) => `${i + 1}. ${describeStepForPrompt(s, lang)}`).join('\n')}`
        : `This is the first step.`,
      `The current step the student is asking about is: ${describeStepForPrompt(selected, lang)}`
    ].join('\n\n');

    const isShona = lang === 'sn';
    const systemPrompt = isShona
      ? `Uri mudzidzisi wemasvomhu anobatsira vadzidzi vechikoro veZimbabwe kunzwisisa matrix algebra. Tsanangura nhanho iyi zvakajeka, uchishandisa mazwi eChiShona chiri nyore. Taura kuti chii chinotorwa kubva panhanho yakapfuura, chii chinoitwa kwachiri, uye kuti sei zvichipa mhinduro yaunoona. Nyorai mitsara mishoma (2-4), musingadzokorore mabhii ese emumatrix, asi tsanangura maitiro.`
      : `You are a math tutor helping a Zimbabwean secondary school student understand matrix algebra step by step. Explain this specific step clearly in plain English: what is being taken from the previous step, what operation is applied to it, and why that produces the result shown. Keep it to 2-4 short sentences, conversational, no restating every raw number, focus on the reasoning.`;

    try {
      const text = await requestGroqCompletion({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contextLines },
        ],
        maxTokens: 500,
        temperature: 0.2,
      });

      setResponse({
        explanation: text.split(/\n+/).map((line) => line.trim()).filter(Boolean),
        mathLines: [selected.seg]
      });
    } catch (requestError) {
      setError(requestError instanceof Error
        ? requestError.message
        : isShona
          ? 'Zvakatadzika kuwana tsananguro. Edza zvakare.'
          : 'Could not get an explanation right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-flex shrink-0 align-middle">
      <button
        type="button"
        onClick={askForExplanation}
        aria-label={`Explain step ${stepNumber}`}
        aria-expanded={open}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-emerald-500 bg-white text-emerald-600 transition hover:bg-emerald-50 active:translate-y-px"
      >
        <CircleHelp className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute left-1/2 top-9 z-40 block w-[min(30rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left shadow-[0_4px_0_#e2e8f0] sm:left-auto sm:right-0 sm:translate-x-0 sm:p-5">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-slate-200 bg-white sm:left-auto sm:right-4 sm:translate-x-0" />
          <span className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
              {lang === 'sn' ? 'Sei nhanho iyi?' : 'Why this step?'}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close explanation"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </span>

          {loading && (
            <span className="block" role="status" aria-live="polite">
              <span className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span key={thinkingIndex} className="animate-pulse">{thinkingWords[thinkingIndex]}…</span>
              </span>
              <span className="mt-4 block animate-pulse space-y-3" aria-hidden="true">
                <span className="block h-3 w-full rounded-full bg-slate-200" />
                <span className="block h-3 w-11/12 rounded-full bg-slate-200" />
                <span className="block h-3 w-3/4 rounded-full bg-slate-200" />
              </span>
            </span>
          )}

          {error && <span className="block text-sm leading-relaxed text-rose-600">{error}</span>}

          {response && (
            <span className="block space-y-3">
              {response.explanation.map((p, idx) => (
                <span key={idx} className="gc-ink block text-base font-bold leading-relaxed text-blue-900 sm:text-lg">
                  {p}
                </span>
              ))}
              {response.mathLines.map((line, idx) => (
                <span key={idx} className="block overflow-x-auto rounded-xl bg-[#fffdf5] px-3 py-2">
                  <span className="flex items-center gap-x-1 whitespace-nowrap">
                    {line.map((seg, si) =>
                      seg.type === 'text' ? (
                        <span key={si} className="gc-ink text-base font-bold text-blue-900 sm:text-lg">
                          {seg.value}
                        </span>
                      ) : seg.type === 'frac' ? (
                        <span key={si} className="mx-1 inline-flex flex-col items-center align-middle">
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.num}</span>
                          <span className="my-0.5 h-[2px] w-full min-w-4 bg-blue-900" />
                          <span className="gc-ink text-sm font-bold text-blue-900">{seg.den}</span>
                        </span>
                      ) : seg.type === 'matrix' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.data} progress={1} compact />
                        </span>
                      ) : seg.type === 'matrixresult' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.data} progress={1} compact />
                        </span>
                      ) : seg.type === 'matrixflow' ? (
                        <span key={si} className="mx-1 inline-block align-middle">
                          <MatrixDisplay data={seg.resultData} progress={1} compact />
                        </span>
                      ) : null
                    )}
                  </span>
                </span>
              ))}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Working Player – unchanged from ConsumerArithmetic2 (includes docked bar)
const formatPlayerTime = (ms) => {
  const secs = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;
};

const WorkingPlayer = ({ title, steps, caption, question, lang = 'en' }) => {
  const total = useMemo(() => steps.reduce((s, p) => s + p.duration, 0), [steps]);
  const [time, setTime] = useState(total);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.35);
  const [isDockVisible, setIsDockVisible] = useState(false);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    let rafId;

    const tick = (now) => {
      const dt = now - last;
      last = now;
      setTime((prev) => {
        const next = prev + dt * speed;
        if (next >= total) {
          setPlaying(false);
          setIsDockVisible(false);
          return total;
        }
        return next;
      });
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [playing, speed, total]);

  const toggle = () => {
    if (time >= total) {
      setTime(0);
      setPlaying(true);
      setIsDockVisible(true);
    } else {
      const nextPlaying = !playing;
      setPlaying(nextPlaying);
      if (nextPlaying) setIsDockVisible(true);
    }
  };

  const restart = () => {
    setTime(0);
    setPlaying(true);
    setIsDockVisible(true);
  };

  const timelinePercent = total > 0 ? (time / total) * 100 : 0;

  const withRange = useMemo(() => {
    let acc = 0;
    return steps.map(s => {
      const start = acc;
      acc += s.duration;
      return { ...s, start, end: acc };
    });
  }, [steps]);

  const rows = withRange.map(s => {
    const progress = time <= s.start ? 0 : time >= s.end ? 1 : (time - s.start) / (s.end - s.start);
    return { ...s, progress };
  });

  const activeStepIdx = rows.findIndex((r) => r.progress < 1);
  const currentStepIndex = activeStepIdx === -1 ? rows.length - 1 : activeStepIdx;

  return (
    <div className="mb-5 w-full min-w-0 max-w-full">
      {title && <h4 className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{title}</h4>}

      <div className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
              style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            >
              <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
              {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
              <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
            </button>
            <button
              type="button"
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
            </button>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="hidden sm:inline">{lang === 'sn' ? 'Kumhanya' : 'Speed'}</span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500"
                aria-label="Playback speed"
              >
                <option value={0.1}>Very slow</option>
                <option value={0.2}>Slow</option>
                <option value={0.35}>Steady</option>
                <option value={0.5}>Medium</option>
                <option value={0.75}>Fast</option>
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold tabular-nums text-slate-500">
            <span>{formatPlayerTime(time)}</span>
            <span className="text-slate-300">/</span>
            <span>{formatPlayerTime(total)}</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={total}
          value={time}
          onChange={(e) => {
            setPlaying(false);
            const newTime = Number(e.target.value);
            setTime(newTime);
            if (newTime >= total) setIsDockVisible(false);
          }}
          aria-label="Working timeline"
          className="gc-timeline mt-3 block w-full cursor-pointer"
          style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
        />
      </div>

      <ol className="gc-paper relative min-w-0 overflow-hidden rounded-2xl border-2 border-b-4 border-slate-200 py-4 pl-9 pr-2 shadow-sm sm:pl-11 sm:pr-4">
        <div aria-hidden="true" className="absolute left-5 sm:left-6 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-emerald-200" />
        {rows.map((step, idx) => {
          const started = step.progress > 0;
          const writingProgress = clamp01((step.progress - 0.15) / 0.85);
          const explanationText = (lang === 'sn' && step.noteShona) ? step.noteShona : step.note;

          return (
            <li key={step.id} className="relative min-h-28 pb-8 last:pb-2">
              <span
                className={`absolute left-[-1.25rem] sm:left-[-1.5rem] top-0 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full text-xs font-black ring-4 ring-[#fbfaf6] z-10 ${started ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}
              >
                {idx + 1}
              </span>
              <div className={`mb-3 flex max-w-4xl items-start gap-2 text-base font-medium leading-relaxed transition-opacity duration-300 ${started ? 'text-slate-700 opacity-100' : 'opacity-0'}`}>
                <p className="min-w-0 flex-1">{explanationText}</p>
                {started && (
                  <StepExplanationHelp
                    question={question}
                    stepsThroughCurrent={steps.slice(0, idx + 1)}
                    stepNumber={idx + 1}
                    lang={lang}
                  />
                )}
              </div>
              <div className="min-h-14 min-w-0 pr-2">
                <MathLine seg={step.seg} progress={writingProgress} isFinal={step.isFinal} />
              </div>
            </li>
          );
        })}
      </ol>
      {caption && <p className="mt-3 border-t border-slate-100 px-1 py-2 text-xs italic text-slate-500">{caption}</p>}

      {isDockVisible && (
        <div
          className="fixed bottom-0 left-0 lg:left-[280px] right-0 z-50 animate-in fade-in slide-in-from-bottom duration-200 border-t-2 border-emerald-500 bg-white/95 px-4 py-3 shadow-[0_-6px_25px_rgba(0,0,0,0.15)] backdrop-blur-md dark:bg-slate-900/95"
          role="region"
          aria-label="Working playback controls"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={toggle}
                className="inline-flex items-center gap-2 relative overflow-hidden rounded-full px-5 py-2 text-xs font-black text-white transition-all active:scale-95"
                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 4px 0 #155208, 0 6px 8px rgba(0,0,0,0.25)', textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
              >
                <span className="absolute inset-x-3 top-0.5 h-2 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                {playing ? <Pause className="h-4 w-4 fill-white relative z-10" /> : <Play className="h-4 w-4 fill-white relative z-10" />}
                <span className="relative z-10">{playing ? (lang === 'sn' ? 'Misa' : 'PAUSE') : time >= total ? (lang === 'sn' ? 'Tanga Patsva' : 'REPLAY') : (lang === 'sn' ? 'Tanga' : 'PLAY')}</span>
              </button>
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-3.5 py-2 text-xs font-black text-slate-700 transition hover:bg-slate-50 active:translate-y-0.5 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
              >
                <RotateCcw className="h-4 w-4" /> {lang === 'sn' ? 'Tangidza' : 'Restart'}
              </button>
              <span className="hidden sm:inline-flex items-center rounded-xl bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                {lang === 'sn' ? `Nhanho ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}
              </span>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="rounded-xl border-2 border-slate-200 bg-white px-2 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-emerald-500 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                aria-label="Playback speed"
              >
                <option value={0.1}>0.1x</option>
                <option value={0.2}>0.2x</option>
                <option value={0.35}>0.35x</option>
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
              </select>
            </div>
            <div className="flex flex-1 items-center gap-3 min-w-[180px]">
              <input
                type="range"
                min={0}
                max={total}
                value={time}
                onChange={(e) => {
                  setPlaying(false);
                  const newTime = Number(e.target.value);
                  setTime(newTime);
                  if (newTime >= total) setIsDockVisible(false);
                }}
                aria-label="Working timeline"
                className="gc-timeline block flex-1 cursor-pointer"
                style={{ background: `linear-gradient(to right, #059669 0%, #059669 ${timelinePercent}%, #d1d5db ${timelinePercent}%, #d1d5db 100%)` }}
              />
              <div className="text-xs font-semibold tabular-nums text-slate-500 shrink-0">
                <span>{formatPlayerTime(time)}</span>
                <span className="mx-1 text-slate-300">/</span>
                <span>{formatPlayerTime(total)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsDockVisible(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition dark:hover:bg-slate-800"
              aria-label="Close docked player"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Static fraction line – used for rules and answers (no matrix rendering here)
const StaticFractionLine = ({ seg, align = 'start', answer = false, compact = false }) => (
  <div className={`flex w-full min-w-0 max-w-full flex-wrap items-center gap-x-2 gap-y-1.5 py-1 ${align === 'start' ? 'justify-start' : 'justify-center'}`}>
    {seg.map((s, i) =>
      s.type === 'text' ? (
        <span key={i} className={`gc-ink min-w-0 break-words font-bold ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>
          {s.value}
        </span>
      ) :       s.type === 'frac' ? (
        <span key={i} className={`${compact ? 'mx-1.5' : 'mx-3'} inline-flex shrink-0 flex-col items-center align-middle whitespace-nowrap`}>
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.num}</span>
          <span className={`gc-frac-bar my-1 block h-[3px] rounded-full ${answer ? 'bg-emerald-700' : 'bg-slate-900'}`} style={{ width: 'calc(100% + 16px)' }} />
          <span className={`gc-ink whitespace-nowrap px-1.5 font-bold leading-tight ${compact ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'} ${answer ? 'text-emerald-700' : 'text-blue-900'}`}>{s.den}</span>
        </span>
      ) : s.type === 'matrix' ? (
        <span key={i} className="mx-1 inline-block max-w-[160px] min-w-0 align-middle sm:max-w-[220px]">
          <MatrixDisplay data={s.data} progress={1} compact={compact} />
        </span>
      ) : s.type === 'matrixresult' ? (
        <span key={i} className="mx-1 inline-block max-w-[160px] min-w-0 align-middle sm:max-w-[220px]">
          <MatrixDisplay data={s.data} progress={1} compact={compact} />
        </span>
      ) : s.type === 'matrixflow' ? (
        <span key={i} className="mx-1 block w-full max-w-full min-w-0 overflow-x-auto custom-scrollbar py-1 align-middle">
          <MatrixFlowDisplay
            aData={s.aData}
            bData={s.bData}
            resultData={s.resultData}
            operator={s.operator}
            label={s.label}
            progress={1}
            compact={compact}
          />
        </span>
      ) : null
    )}
  </div>
);

// Renders a worked-example question: breaks onto a new line after each full
// stop, so long questions read like normal sentences instead of one long
// horizontally-scrolling line — while still showing any inline matrices.
const QuestionLine = ({ seg }) => {
  const lines = [];
  let current = [];

  seg.forEach((s, i) => {
    if (s.type === 'text') {
      const sentences = s.value.split(/(?<=\.)\s+/).filter(Boolean);
      sentences.forEach((sentence, si) => {
        current.push(
          <span key={`${i}-${si}`} className="gc-ink font-bold text-blue-900">
            {sentence}
          </span>
        );
        if (si < sentences.length - 1) {
          lines.push(current);
          current = [];
        }
      });
    } else if (s.type === 'matrix' || s.type === 'matrixresult') {
      current.push(
        <span key={i} className="mx-1.5 inline-block align-middle">
          <MatrixDisplay data={s.data} progress={1} compact />
        </span>
      );
    } else if (s.type === 'matrixflow') {
      current.push(
        <span key={i} className="mx-1.5 inline-block align-middle">
          <MatrixDisplay data={s.resultData} progress={1} compact />
        </span>
      );
    }
  });
  lines.push(current);

  return (
    <div className="flex flex-col gap-1.5">
      {lines.map((line, li) => (
        <div key={li} className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xl leading-relaxed sm:text-2xl">
          {line}
        </div>
      ))}
    </div>
  );
};

// Definition / rule box
export const DefinitionBox = ({ lines, label = 'Rule' }) => (
  <div className="my-4 w-full max-w-full overflow-hidden rounded-2xl border-2 border-b-4 border-rose-300 bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5">
    <span className="gc-hand block text-center text-sm font-bold uppercase tracking-wider text-rose-500">{label}</span>
    <div className="mt-3 flex flex-col gap-3">
      {lines.map((line, i) => {
        const seg = Array.isArray(line) ? line : line.seg;
        const note = Array.isArray(line) ? null : line.note;
        return (
          <div key={i} className="flex w-full flex-col gap-1.5 border-b border-slate-100 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <StaticFractionLine seg={seg} align="start" />
            </div>
            {note && (
              <p className="shrink-0 text-sm font-medium leading-snug text-slate-600 sm:max-w-[13rem] sm:text-right sm:text-[0.88rem]">
                <span className="mr-1 text-rose-400">✎</span>
                {note}
              </p>
            )}
          </div>
        );
      })}
    </div>
    <div className="mx-auto mt-4 h-1.5 w-16 rounded-full bg-rose-200" />
  </div>
);

// Example card
export const ExampleCard = ({ index, example, lang = 'en' }) => {
  const answerSegs = example.answerSeg || (() => {
    // For matrices, answer may be a matrix object or text
    if (typeof example.answer === 'string') {
      return [T(example.answer)];
    } else if (Array.isArray(example.answer)) {
      // assume it's a matrix data
      return [M(example.answer)];
    }
    return [T(String(example.answer))];
  })();

  return (
    <article className="mb-5 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-3 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-sm">{index}</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-xs font-black uppercase tracking-wider text-emerald-600">
            {lang === 'sn' ? `Muenzaniso wakagadziriswa ${index}` : `Worked example ${index}`}
          </div>
          <QuestionLine seg={example.questionSeg || [T(example.question)]} />
        </div>
      </div>
      <WorkingPlayer
        title={lang === 'sn' ? 'Nhanho Dzekuverenga' : 'Working'}
        steps={example.steps}
        caption={example.caption}
        question={example.question}
        lang={lang}
      />
      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-2xl bg-emerald-50/80 p-3.5 border border-emerald-200">
        <span className="gc-hand text-base font-bold text-emerald-800">{lang === 'sn' ? 'Mhinduro:' : 'Answer:'}</span>
        <StaticFractionLine seg={answerSegs} align="start" answer />
      </div>
    </article>
  );
};

// Practice zone
export const PracticeZone = ({ items }) => (
  <div className="rounded-3xl border-2 border-b-4 border-slate-800 bg-slate-900 p-5 text-white shadow-lg sm:p-7">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-black">
      <span className="text-2xl">✍️</span> Practice Zone
    </h3>
    <div className="space-y-4">
      {items.map((q, i) => (
        <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
          <span className="font-black text-emerald-400">{i + 1}.</span>
          <span className="gc-ink whitespace-pre-line text-lg leading-snug text-slate-200">{q}</span>
        </div>
      ))}
    </div>
  </div>
);

/* =========================================================================
   CONTENT – MATRICES 2 (all examples with proper matrix rendering)
   ========================================================================= */

// Example 1: Addition, subtraction, scalar
const ex1 = {
  question: 'If A = [[3,-2],[1,0],[0,4]] and B = [[-5,2],[2,3],[-1,0]], find (a) A+B, (b) A-B, (c) 3A.',
  questionSeg: [
    T('If 𝐀 = '), M([[3,-2],[1,0],[0,4]]),
    T(' and 𝐁 = '), M([[-5,2],[2,3],[-1,0]]),
    T(', find (a) 𝐀+𝐁, (b) 𝐀−𝐁, (c) 3𝐀.')
  ],
  steps: [
    mkStep(
      [MFLOW([[3,-2],[1,0],[0,4]], [[-5,2],[2,3],[-1,0]], [[-2,0],[3,3],[-1,4]], '+', '𝐀 + 𝐁 =')],
      'Add corresponding elements to get the result.',
      { noteShona: 'Wedzera zvinhu zvinofanana kuti uwane mhinduro.', duration: 6500 }
    ),
    mkStep(
      [MFLOW([[3,-2],[1,0],[0,4]], [[-5,2],[2,3],[-1,0]], [[8,-4],[-1,-3],[1,4]], '−', '𝐀 − 𝐁 =')],
      'Subtract corresponding elements to get the result.',
      { noteShona: 'Bvisa zvinhu zvinofanana kuti uwane mhinduro.', duration: 6500 }
    ),
    mkStep([T('3𝐀 = 3 × '), M([[3,-2],[1,0],[0,4]])],
      'Multiply every element by 3.', { noteShona: 'Wanza zvinhu zvese ne 3.' }),
    mkStep([T('= '), M([[9,-6],[3,0],[0,12]])],
      'Result of scalar multiplication.', { noteShona: 'Mhinduro yekuwedzera scalar.', isFinal: true })
  ],
    answer: '(a) [[-2,0],[3,3],[-1,4]] (b) [[8,-4],[-1,-3],[1,4]] (c) [[9,-6],[3,0],[0,12]]',
  answerSeg: [
    T('(a) '), M([[-2,0],[3,3],[-1,4]]),
    T('      (b) '), M([[8,-4],[-1,-3],[1,4]]),
    T('      (c) '), M([[9,-6],[3,0],[0,12]])
  ],
  caption: 'Matrices must be of the same order for addition/subtraction; scalar multiplication multiplies every element.'
};

// Example 2: Matrix multiplication
const ex2 = {
  question: 'If M = [[-2,4],[3,5]] and N = [[6,0],[-1,2]], find (a) MN, (b) NM, (c) M^2.',
  questionSeg: [
    T('If 𝐌 = '), M([[-2,4],[3,5]]),
    T(' and 𝐍 = '), M([[6,0],[-1,2]]),
    T(', find (a) 𝐌𝐍, (b) 𝐍𝐌, (c) 𝐌².')
  ],
  steps: [
    mkStep([T('𝐌𝐍 = '), M([[-2,4],[3,5]]), T(' × '), M([[6,0],[-1,2]])],
      'Multiply rows of M by columns of N.', { noteShona: 'Wanza mitsara ye M nemakoramu e N.' }),
    mkStep([T('= '), M([[-16,8],[13,10]])],
      'Result of MN.', { noteShona: 'Mhinduro ye MN.' }),
    mkStep([T('𝐍𝐌 = '), M([[6,0],[-1,2]]), T(' × '), M([[-2,4],[3,5]])],
      'Multiply rows of N by columns of M.', { noteShona: 'Wanza mitsara ye N nemakoramu e M.' }),
    mkStep([T('= '), M([[-12,24],[8,6]])],
      'Result of NM.', { noteShona: 'Mhinduro ye NM.' }),
    mkStep([T('𝐌² = 𝐌 × 𝐌 = '), M([[-2,4],[3,5]]), T(' × '), M([[-2,4],[3,5]])],
      'Square the matrix.', { noteShona: 'Squara matrix.' }),
    mkStep([T('= '), M([[16,12],[9,37]])],
      'Result of M².', { noteShona: 'Mhinduro ye M².', isFinal: true })
  ],
  answer: '(a) [[-16,8],[13,10]] (b) [[-12,24],[8,6]] (c) [[16,12],[9,37]]',
  answerSeg: [
    T('(a) '), M([[-16,8],[13,10]]),
    T('      (b) '), M([[-12,24],[8,6]]),
    T('      (c) '), M([[16,12],[9,37]])
  ],
  caption: 'Matrix multiplication is not commutative; AB ≠ BA in general.'
};

// Example 3: Inverse of 2x2 matrices
const ex3 = {
  question: 'Find the inverse of (a) [[3,-2],[-4,1]], (b) [[2,5],[3,8]], (c) [[6,3],[2,1]].',
  questionSeg: [
    T('Find the inverse of (a) '), M([[3,-2],[-4,1]]),
    T(', (b) '), M([[2,5],[3,8]]),
    T(', (c) '), M([[6,3],[2,1]]),
    T('.')
  ],
  steps: [
    mkStep([T('(a) det = 3×1 − (−2)×4 = 11')],
      'Calculate determinant.', { noteShona: 'Verenga determinant.' }),
    mkStep([T('Inverse = 1/11 × '), M([[1,2],[-4,3]])],
      'Apply formula: swap a,d, negate b,c, divide by det.', { noteShona: 'Shandisa formula.' }),
    mkStep([T('(b) det = 2×8 − 3×5 = 1')],
      'Determinant is 1.', { noteShona: 'Determinant ndi 1.' }),
    mkStep([T('Inverse = '), M([[8,-5],[-3,2]])],
      'Since det=1, inverse is just the adjugate.', { noteShona: 'Sezvo det=1, inverse ndiyo adjugate.' }),
    mkStep([T('(c) det = 6×1 − 2×3 = 0')],
      'Determinant is zero.', { noteShona: 'Determinant ndi zero.' }),
    mkStep([T('No inverse exists (singular matrix).')],
      'A matrix with zero determinant has no inverse.', { noteShona: 'Matrix ine determinant zero haina inverse.', isFinal: true })
  ],
  answer: '(a) 1/11 [[1,2],[-4,3]] (b) [[8,-5],[-3,2]] (c) No inverse',
  answerSeg: [
    T('(a) 1/11 '), M([[1,2],[-4,3]]),
    T('      (b) '), M([[8,-5],[-3,2]]),
    T('      (c) No inverse')
  ],
  caption: 'A 2x2 matrix has an inverse iff its determinant is non-zero.'
};

// Example 4: Solving simultaneous equations using inverse
const ex4 = {
  question: 'Solve the equations 3x − 4y = 1 and 7x + y = 23 using matrices.',
  steps: [
    mkStep([T('Write as '), M([[3,-4],[7,1]]), T(' × '), M([['x'],['y']]), T(' = '), M([[1],[23]])],
      'Convert to matrix equation.', { noteShona: 'Chinja kuita matrix equation.' }),
    mkStep([T('det = 31, inverse = '), F('1', '31'), T(' '), M([[1,4],[-7,3]])],
      'Find inverse of coefficient matrix.', { noteShona: 'Tsvaga inverse ye coefficient matrix.' }),
    mkStep([T('Pre-multiply both sides by inverse:')],
      'Multiply both sides by the inverse matrix.', { noteShona: 'Wanza mativi ese ne inverse matrix.' }),
    mkStep([M([['x'],['y']]), T(' = '), F('1', '31'), T(' '), M([[1,4],[-7,3]]), T(' × '), M([[1],[23]])],
      'Right side calculation.', { noteShona: 'Verenga divi rekurudyi.' }),
    mkStep([T('= '), F('1', '31'), T(' '), M([[93],[62]]), T(' = '), M([[3],[2]])],
      'Result gives x=3, y=2.', { noteShona: 'Mhinduro inopa x=3, y=2.', isFinal: true })
  ],
  answer: 'x = 3, y = 2',
  caption: 'Using the inverse matrix allows solving simultaneous equations efficiently.'
};

/* =========================================================================
   SECTIONS & THEMES
   ========================================================================= */
const sectionThemes = {
  'matrix-arithmetic': {
    bgGradient: 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600',
    borderColor: 'border-b-4 border-sky-700',
    badgeBg: 'bg-sky-400/30 text-white border border-sky-200/40',
    navActiveBg: 'bg-sky-500 border-b-4 border-sky-700 text-white shadow-sm',
    cardBorder: 'border-sky-300'
  },
  'multiplication': {
    bgGradient: 'bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600',
    borderColor: 'border-b-4 border-emerald-700',
    badgeBg: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    navActiveBg: 'bg-emerald-500 border-b-4 border-emerald-700 text-white shadow-sm',
    cardBorder: 'border-emerald-300'
  },
  'identity-inverse': {
    bgGradient: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    borderColor: 'border-b-4 border-amber-700',
    badgeBg: 'bg-amber-400/30 text-white border border-amber-200/40',
    navActiveBg: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    cardBorder: 'border-amber-300'
  },
  'simultaneous': {
    bgGradient: 'bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600',
    borderColor: 'border-b-4 border-violet-800',
    badgeBg: 'bg-violet-400/30 text-white border border-violet-200/40',
    navActiveBg: 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm',
    cardBorder: 'border-violet-300'
  },
  'exercises': {
    bgGradient: 'bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600',
    borderColor: 'border-b-4 border-rose-700',
    badgeBg: 'bg-rose-400/30 text-white border border-rose-200/40',
    navActiveBg: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    cardBorder: 'border-rose-300'
  }
};

const sections = [
  {
    id: 'matrix-arithmetic',
    eyebrow: 'Chapter 13.1',
    title: 'Matrix Arithmetic',
    heading: 'Addition, Subtraction and Scalar Multiplication',
    intro: 'Matrices can be added or subtracted only if they are of the same order. Scalar multiplication multiplies every element by the scalar.',
    introShona: 'Matrix dzinogona kuwedzerwa kana kubviswa chete kana dziri dze order imwechete. Scalar multiplication inowanza zvinhu zvese ne scalar.',
    rules: [
      [
        { seg: [T('For addition/subtraction, matrices must have same dimensions.')], note: 'Corresponding elements are added/subtracted.' },
        { seg: [T('Scalar multiplication: k × [[a,b],[c,d]] = [[ka,kb],[kc,kd]]')], note: 'Every element is multiplied by k.' }
      ]
    ],
    examples: [ex1],
    practice: [
      'If A = [[3,9],[2,1]] and B = [[4,0],[-6,2]], find A+B.',
      'If C = [[1,-1],[-2,7]] and D = [[1,-7],[3,0]], find C-D.',
      'If E = [[3,0],[9,5]] and F = [[2],[6]], find E+F (if possible).',
      'If A = [[-1,5],[2,3]] and B = [[6,0],[4,-8]], find 3A - 2B.'
    ]
  },
  {
    id: 'multiplication',
    eyebrow: 'Chapter 13.2',
    title: 'Matrix Multiplication',
    heading: 'Multiplying Matrices',
    intro: 'Two matrices can be multiplied if the number of columns in the first equals the number of rows in the second. The product is a matrix with dimensions rows of first × columns of second.',
    introShona: 'Matrix mbiri dzinogona kuwedzerwa kana nhamba yemakoramu mune yekutanga yakaenzana nenhamba yemitsara mune yechipiri. Chibereko chinova matrix ine mitsara yekutanga × makoramu echipiri.',
    rules: [
      [
        { seg: [T('(m×n) × (n×p) → (m×p)')], note: 'The inner dimensions must match.' },
        { seg: [T('In general, AB ≠ BA')], note: 'Multiplication is not commutative.' }
      ]
    ],
    examples: [ex2],
    practice: [
      'Find AB if A = [[5,1],[8,2]] and B = [[-2],[3]].',
      'Find CD if C = [[1,4],[0,1]] and D = [[1,4],[0,1]].',
      'If M = [[-2,4],[3,5]] and N = [[6,0],[-1,2]], compute MN and NM and compare.'
    ]
  },
  {
    id: 'identity-inverse',
    eyebrow: 'Chapter 13.3',
    title: 'Identity & Inverse',
    heading: 'Identity Matrix and Inverse',
    intro: 'The identity matrix I = [[1,0],[0,1]] acts like 1 for matrices. The inverse of a matrix A is a matrix A⁻¹ such that A·A⁻¹ = I.',
    introShona: 'Identity matrix I = [[1,0],[0,1]] inoshanda se 1 yematrix. Inverse ye matrix A ndi matrix A⁻¹ yakadai kuti A·A⁻¹ = I.',
    rules: [
      [
        { seg: [T('det = ad - bc for [[a,b],[c,d]]')], note: 'Determinant' },
        { seg: [T('Inverse = 1/det [[d, -b],[-c, a]]')], note: 'If det ≠ 0' }
      ]
    ],
    examples: [ex3],
    practice: [
      'Find the inverse of [[6,3],[1,2]] (if it exists).',
      'Find the inverse of [[5,3],[2,3]].',
      'Find the inverse of [[4,3],[2,1]].',
      'Find the determinant of [[-2,-4],[5,3]] and hence its inverse.'
    ]
  },
  {
    id: 'simultaneous',
    eyebrow: 'Chapter 13.4',
    title: 'Solving Equations with Matrices',
    heading: 'Solving Simultaneous Linear Equations',
    intro: 'A system of linear equations can be written as a matrix equation AX = B. Multiply both sides by A⁻¹ to find X = A⁻¹B.',
    introShona: 'Mutsara wezvigadziriso zvine mitsara inogona kunyorwa se matrix equation AX = B. Wanza mativi ese ne A⁻¹ kuwana X = A⁻¹B.',
    examples: [ex4],
    practice: [
      'Solve 6x + 11y = 29, 2x + y = 5 using matrix inverse.',
      'Solve 3x + y = 3, 2x + y = 5.',
      'Solve 4x - 2y = 9, 2x + y = 3.',
      'Solve 2a - 3b = 3, 2a + b = 4.'
    ]
  },
  {
    id: 'exercises',
    eyebrow: 'Practice',
    title: 'Exercise 13d',
    heading: 'Miscellaneous Practice',
    intro: 'Mixed problems covering all matrix operations, determinants, inverses, and solving equations.',
    introShona: 'Zviedzo zvakasanganiswa zvinosanganisira matrix operations, determinants, inverses, uye kugadzirisa equations.',
    examples: [], // No worked examples in this section
    practice: [
      'Evaluate [[-3,-8],[6,2]] + 2[[-2,1],[-3,5]].',
      'If M = [[2,-6],[-1,4]], find det(M) and its inverse.',
      'Find the value of k for which [[4,k-2],[8,6]] has no inverse.',
      'Given that [[3,2,4],[6,0,1]] find m and n such that ...',
      'If P is 2×2 and 3P - P = [[-2,0],[2,4]], find P.',
      'Solve the simultaneous equations using matrix method: 3y = -5x + 3, 2y = -3x - 1.'
    ]
  }
];

/* =========================================================================
   SECTION COMPONENT (renders a single section)
   ========================================================================= */
const Section = ({ section, lang = 'en' }) => {
  return (
    <section id={section.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
      <div className="mb-5">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-600">{section.eyebrow}</span>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{section.heading}</h2>
      </div>

      <div className="mb-6">
        <p className="mb-4 leading-relaxed text-slate-700 text-base sm:text-lg">
          {lang === 'sn' && section.introShona ? section.introShona : section.intro}
        </p>

        {section.rules && section.rules.length > 0 && (
          <div className="mb-6 space-y-3">
            {section.rules.map((r, i) => (
              <DefinitionBox key={i} label={section.rules.length > 1 ? `Rule ${i+1}` : 'Rule'} lines={r} />
            ))}
          </div>
        )}
      </div>

      {section.examples && section.examples.length > 0 && (
        <div className="mb-8">
          <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
            {lang === 'sn' ? 'Mienzaniso Yakagadziriswa' : 'Worked Examples'}
          </h3>
          {section.examples.map((ex, i) => (
            <ExampleCard key={i} index={i + 1} example={ex} lang={lang} />
          ))}
        </div>
      )}

      {section.practice && section.practice.length > 0 && (
        <PracticeZone items={section.practice} />
      )}
    </section>
  );
};

/* =========================================================================
   MAIN COMPONENT – Matrices2
   ========================================================================= */
export const Matrices2 = () => {
  const [active, setActive] = useState(sections[0].id);
  const [lang, setLang] = useState('en');

  const activeIndex = Math.max(0, sections.findIndex(s => s.id === active));
  const activeSection = sections[activeIndex] || sections[0];
  const activeTheme = sectionThemes[activeSection.id] || sectionThemes['matrix-arithmetic'];

  const handleNavigate = (id) => {
    setActive(id);
  };

  const goNext = () => {
    const n = sections[activeIndex + 1];
    if (n) handleNavigate(n.id);
  };
  const goPrev = () => {
    const p = sections[activeIndex - 1];
    if (p) handleNavigate(p.id);
  };

  return (
    <div id="fa-scroll-area" className="min-h-screen w-full bg-[#f8fafc] pb-24 font-sans text-slate-900">
      <InkStyles />

      {/* Top Banner */}
      <div className={`relative overflow-hidden transition-all duration-300 ${activeTheme.bgGradient} ${activeTheme.borderColor} pb-8 pt-10 text-white shadow-md`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${activeTheme.badgeBg}`}>
                CHAPTER 13
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                O-Level Mathematics
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button
                type="button"
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <UkFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">English</span>
              </button>
              <button
                type="button"
                onClick={() => setLang('sn')}
                aria-pressed={lang === 'sn'}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${
                  lang === 'sn'
                    ? 'bg-white text-slate-900 shadow-md scale-100'
                    : 'text-white/85 hover:bg-white/10 hover:text-white'
                }`}
              >
                <ZwFlag className="h-3.5 w-5" />
                <span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">
            {activeSection.title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' && activeSection.introShona ? activeSection.introShona : activeSection.intro}
          </p>
        </div>
      </div>

      {/* Navigation Rail */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2 sm:py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
          <div
            id="math-topic-rail"
            data-math-chapter-scroller="true"
            className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sections.map((s) => {
              const theme = sectionThemes[s.id] || sectionThemes['matrix-arithmetic'];
              const isActive = active === s.id;
              return (
                <button
                  key={s.id}
                  data-topic-id={s.id}
                  onClick={() => handleNavigate(s.id)}
                  title={s.title}
                  className={`shrink-0 truncate sm:whitespace-nowrap max-w-[84px] sm:max-w-none rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${
                    isActive
                      ? theme.navActiveBg
                      : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 max-w-full overflow-x-hidden px-4 pt-8 sm:px-6 sm:pt-10 md:px-8 lg:px-10">
        <div key={`${activeSection.id}-${lang}`}>
          <Section section={activeSection} lang={lang} />
        </div>

        {/* Prev / Next Footer */}
        <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
          <button
            onClick={goPrev}
            disabled={activeIndex === 0}
            className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
          </button>
          <span className="text-xs font-black tracking-wider text-slate-400">
            {activeIndex + 1} / {sections.length}
          </span>
          <button
            onClick={goNext}
            disabled={activeIndex === sections.length - 1}
            className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0"
          >
            {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Matrices2;

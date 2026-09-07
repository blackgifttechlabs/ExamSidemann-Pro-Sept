import React, { useId } from 'react';

/** Shared Exam Sidemann opening screen used by resource libraries. */
export const SlideLoader: React.FC<{ label?: string }> = ({ label }) => {
  const uid = useId().replace(/:/g, '');
  const mask = (name: string) => `${name}-${uid}`;

  return (
    <div className="ex-resource-loader" role="status" aria-live="polite" aria-label={label || 'Loading Exam Sidemann'}>
      <style>{`
        .ex-resource-loader {
          display: flex;
          min-height: 100%;
          width: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #081929;
          color: #fff;
          animation: exLoaderFade 2s cubic-bezier(.4,0,.2,1) both;
        }
        .ex-resource-loader__mark {
          width: min(315px, 78vw);
          height: auto;
          overflow: visible;
          transform-origin: center;
          filter: drop-shadow(0 8px 18px rgba(0,0,0,.28));
          animation: exLoaderGrow 1.4s cubic-bezier(.16,1,.3,1) both;
        }
        .ex-resource-loader__draw {
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: exLoaderDraw .6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .ex-resource-loader__e { animation-delay: .05s; }
        .ex-resource-loader__wedge { animation-delay: .28s; }
        .ex-resource-loader__main { animation-delay: .48s; }
        .ex-resource-loader__bottom { animation-delay: .75s; }
        .ex-resource-loader__registered { animation-delay: 1.08s; animation-duration: .28s; }
        .ex-resource-loader__label {
          margin: -22px 0 0;
          color: rgba(255,255,255,.58);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
        }
        @keyframes exLoaderDraw { to { stroke-dashoffset: 0; } }
        @keyframes exLoaderGrow {
          0% { transform: scale(.56); opacity: .28; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes exLoaderFade {
          0%, 78% { opacity: 1; }
          100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ex-resource-loader, .ex-resource-loader__mark, .ex-resource-loader__draw {
            animation-duration: .01ms !important;
            animation-delay: 0ms !important;
          }
        }
      `}</style>

      <svg className="ex-resource-loader__mark" viewBox="80 120 370 270" shapeRendering="geometricPrecision" aria-hidden="true">
        <defs>
          <mask id={mask('ex-e')} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <path className="ex-resource-loader__draw ex-resource-loader__e" pathLength="1" d="M119 248 L254 248 M241 288 C218 327 135 321 114 271 C92 218 125 175 181 174 C230 173 261 206 256 250" stroke="#fff" strokeWidth="68" />
          </mask>
          <mask id={mask('ex-wedge')} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <path className="ex-resource-loader__draw ex-resource-loader__wedge" pathLength="1" d="M200 205 L258 260" stroke="#fff" strokeWidth="72" />
          </mask>
          <mask id={mask('ex-main')} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <path className="ex-resource-loader__draw ex-resource-loader__main" pathLength="1" d="M159 354 L382 151" stroke="#fff" strokeWidth="78" />
          </mask>
          <mask id={mask('ex-bottom')} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <path className="ex-resource-loader__draw ex-resource-loader__bottom" pathLength="1" d="M270 244 L351 306" stroke="#fff" strokeWidth="76" />
          </mask>
          <mask id={mask('ex-registered')} maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
            <path className="ex-resource-loader__draw ex-resource-loader__registered" pathLength="1" d="M418 157 A15 15 0 1 1 417.9 157" stroke="#fff" strokeWidth="22" />
          </mask>
        </defs>
        <path d="M191 203 H246 Q250 203 253 206 L262 215 Q266 219 262 224 L239 247 Q235 251 231 247 L191 207 Z" fill="#504e4f" mask={`url(#${mask('ex-wedge')})`} />
        <path d="M199 253 H129 C131 267 140 275 154 275 C165 275 174 271 181 264 L194 274 C184 287 170 293 153 293 C126 293 108 275 108 248 C108 221 126 202 153 202 C181 202 199 220 199 248 Z M130 237 H178 C174 226 165 220 154 220 C143 220 134 226 130 237 Z" fill="#fffdfa" fillRule="evenodd" clipRule="evenodd" mask={`url(#${mask('ex-e')})`} />
        <path d="M347 151 H396 L299 249 Q296 253 300 258 L342 300 L340 302 H299 Q294 302 290 299 L270 281 L193 357 H142 L222 277 L337 160 Q341 151 347 151 Z" fill="#ff5a08" mask={`url(#${mask('ex-main')})`} />
        <path d="M347 151 H396 L299 249 Q296 253 300 258 L342 300 L340 302 H299 Q294 302 290 299 L270 281 L193 357 H142 L222 277 L337 160 Q341 151 347 151 Z" fill="#ff5a08" mask={`url(#${mask('ex-bottom')})`} />
        <text x="410" y="166" fill="#fffdfa" fontFamily="Arial, sans-serif" fontSize="20" fontWeight="700" mask={`url(#${mask('ex-registered')})`}>®</text>
      </svg>
      {label && <p className="ex-resource-loader__label">{label}</p>}
    </div>
  );
};

export default SlideLoader;

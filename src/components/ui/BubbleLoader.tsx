import type { CSSProperties } from "react";

interface BubbleLoaderProps {
  label?: string;
  className?: string;
  style?: CSSProperties;
}

/** Blue bubbling flask loader adapted from Uiverse.io by Mhyar-nsi. */
export function BubbleLoader({
  label = "Loading",
  className = "",
  style,
}: BubbleLoaderProps) {
  return (
    <div
      className={`ex-bubble-loader-wrap ${className}`.trim()}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <style>{`
        @keyframes ex-loader-bubbles {
          0% { box-shadow: 0 -10px #3b82f6, 3px 0 #3b82f6, 5px 0 #3b82f6; }
          30% { box-shadow: 3px -20px rgba(239,223,255,0), 5px -10px #3b82f6, 5px 0 #3b82f6; }
          60% { box-shadow: 3px 0 rgba(239,223,255,0), 4px -20px rgba(239,223,255,0), 3px -10px #3b82f6; }
          61% { box-shadow: 3px 0 #3b82f6, 4px -20px rgba(239,223,255,0), 3px -10px #3b82f6; }
          100% { box-shadow: 0 -10px #3b82f6, 4px -20px rgba(239,223,255,0), 5px -20px rgba(239,223,255,0); }
        }
        .ex-bubble-loader-wrap {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
        }
        .ex-bubble-loader {
          display: inline-block;
          vertical-align: middle;
          position: relative;
          width: 10px;
          height: 20px;
          margin: 18px 20px 10px;
          background: #3b82f6;
        }
        .ex-bubble-loader::before,
        .ex-bubble-loader::after {
          content: '';
          position: absolute;
        }
        .ex-bubble-loader::before {
          top: -8px;
          left: -13px;
          width: 0;
          height: 0;
          border: 18px solid transparent;
          border-bottom: 20px solid #3b82f6;
          border-radius: 3px;
        }
        .ex-bubble-loader::after {
          top: 0;
          left: 0;
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          animation: ex-loader-bubbles 1s linear infinite forwards;
        }
        .ex-bubble-loader-label {
          color: #94a3b8;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .25em;
          line-height: 1;
          text-transform: uppercase;
        }
        @media (prefers-reduced-motion: reduce) {
          .ex-bubble-loader::after { animation-duration: 2.5s; }
        }
      `}</style>
      <span className="ex-bubble-loader" aria-hidden="true" />
      {label && <span className="ex-bubble-loader-label">{label}</span>}
    </div>
  );
}

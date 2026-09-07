import React, { useCallback, useRef, useState } from "react";
import { FileText, HelpCircle } from "lucide-react";

export function ExperimentPaperButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200 shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300/50 hover:bg-emerald-400/20 hover:text-white sm:px-4"
    >
      <FileText size={16} />
      <span className="hidden sm:inline">Experiment Paper</span>
      <span className="sm:hidden">Paper</span>
    </button>
  );
}

export function ExperimentHowToButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      data-experiment-tour="how-to"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-xs font-bold text-cyan-100 shadow-lg shadow-cyan-950/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-400/20 hover:text-white sm:px-4"
    >
      <HelpCircle size={16} />
      <span className="hidden sm:inline">How To</span>
      <span className="sm:hidden">How</span>
    </button>
  );
}

interface ExperimentPaperModalProps {
  filename: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function ExperimentPaperModal({
  filename,
  onClose,
  children,
}: ExperimentPaperModalProps) {
  const paperRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!paperRef.current || downloading) return;
    setDownloading(true);
    setDownloadComplete(false);

    try {
      const { jsPDF } = await import("jspdf");
      const paperClone = paperRef.current.cloneNode(true) as HTMLDivElement;
      paperClone.querySelectorAll(".no-print").forEach((element) => element.remove());

      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      const ensureSpace = (height: number) => {
        if (y + height <= pageHeight - margin) return;
        doc.addPage();
        y = margin;
      };

      const writeText = (text: string, size = 11, style: "normal" | "bold" = "normal", gap = 10) => {
        const clean = text.replace(/\s+/g, " ").trim();
        if (!clean) return;
        doc.setFont("times", style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(clean, maxWidth);
        ensureSpace(lines.length * (size + 4) + gap);
        doc.text(lines, margin, y);
        y += lines.length * (size + 4) + gap;
      };

      const writeTable = (table: HTMLTableElement) => {
        const rows = Array.from(table.rows).map((row) => Array.from(row.cells).map((cell) => cell.textContent?.replace(/\s+/g, " ").trim() ?? ""));
        if (rows.length === 0) return;
        const columns = Math.max(...rows.map((row) => row.length));
        const cellWidth = maxWidth / columns;
        doc.setFontSize(8);
        rows.forEach((row, rowIndex) => {
          const wrapped = row.map((cell) => doc.splitTextToSize(cell, cellWidth - 8));
          const rowHeight = Math.max(24, ...wrapped.map((cell) => cell.length * 10 + 10));
          ensureSpace(rowHeight);
          row.forEach((_, colIndex) => {
            const x = margin + colIndex * cellWidth;
            doc.setFillColor(rowIndex === 0 ? 226 : 255, rowIndex === 0 ? 232 : 255, rowIndex === 0 ? 240 : 255);
            doc.rect(x, y - 10, cellWidth, rowHeight, "FD");
            doc.setFont("times", rowIndex === 0 ? "bold" : "normal");
            doc.text(wrapped[colIndex] ?? [""], x + 4, y + 4);
          });
          y += rowHeight;
        });
        y += 14;
      };

      Array.from(paperClone.children).forEach((element) => {
        if (element instanceof HTMLHeadingElement) {
          writeText(element.textContent ?? "", element.tagName === "H1" ? 15 : 12, "bold", 12);
        } else if (element instanceof HTMLParagraphElement) {
          writeText(element.textContent ?? "");
        } else if (element instanceof HTMLUListElement || element instanceof HTMLOListElement) {
          Array.from(element.querySelectorAll(":scope > li")).forEach((li, index) => {
            const prefix = element instanceof HTMLOListElement ? `${index + 1}. ` : "- ";
            writeText(prefix + (li.textContent ?? ""), 10, "normal", 4);
          });
          y += 6;
        } else if (element instanceof HTMLTableElement) {
          writeTable(element);
        } else {
          element.querySelectorAll("h1,h2,p,ul,ol,table").forEach((child) => {
            if (child instanceof HTMLHeadingElement) writeText(child.textContent ?? "", child.tagName === "H1" ? 15 : 12, "bold", 12);
            else if (child instanceof HTMLParagraphElement) writeText(child.textContent ?? "");
            else if (child instanceof HTMLTableElement) writeTable(child);
            else if (child instanceof HTMLUListElement || child instanceof HTMLOListElement) {
              Array.from(child.querySelectorAll(":scope > li")).forEach((li, index) => {
                const prefix = child instanceof HTMLOListElement ? `${index + 1}. ` : "- ";
                writeText(prefix + (li.textContent ?? ""), 10, "normal", 4);
              });
              y += 6;
            }
          });
        }
      });

      doc.save(filename.replace(/\.html?$/i, ".pdf"));
      setDownloading(false);
      setDownloadComplete(true);
      window.setTimeout(() => setDownloadComplete(false), 1800);
    } catch {
      setDownloading(false);
    }
  }, [downloading, filename]);

  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[calc(4rem+1.5cm)] flex items-start justify-center overflow-y-auto bg-black/70 p-4 print:static print:bg-white print:p-0"
      style={{ zIndex: 2147483647 }}
    >
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #experiment-paper, #experiment-paper * { visibility: visible; }
          #experiment-paper { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
        @keyframes downloadToastIn {
          from { opacity: 0; transform: translate(-50%, -10px) scale(0.96); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes tickPop {
          0% { transform: scale(0.4); opacity: 0; }
          70% { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        id="experiment-paper"
        ref={paperRef}
        className="relative mb-6 mt-4 w-full max-w-3xl rounded-sm bg-white text-slate-900 shadow-2xl print:my-0 print:max-w-none print:shadow-none"
      >
        <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-sm font-semibold text-slate-500">Experiment Paper Preview</span>
          <div className="flex gap-2">
            <button
              data-experiment-tour="paper-download"
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex min-w-24 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-500 disabled:bg-emerald-700/80"
            >
              {downloading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />}
              {downloading ? "Downloading" : "Download PDF"}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-300"
            >
              Close
            </button>
          </div>
        </div>

        {downloadComplete && (
          <div
            className="no-print fixed left-1/2 top-[calc(4rem+2.25cm)] -translate-x-1/2 animate-[downloadToastIn_280ms_ease-out] rounded-2xl border border-emerald-300/40 bg-white px-5 py-4 text-center shadow-2xl"
            style={{ zIndex: 2147483647 }}
          >
            <div className="mx-auto mb-2 flex h-12 w-12 animate-[tickPop_420ms_ease-out] items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="text-sm font-black text-slate-900">Download started successfully</div>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

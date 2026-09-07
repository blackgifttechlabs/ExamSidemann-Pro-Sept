import React, { useEffect, useRef, useState } from 'react';
import type { CodeRunResult } from './codeRunnerApi';

export function ProgramConsole({ isExecuting, result, pendingInput }: {
  pendingInput?: { kind: 'line' | 'key' | 'char'; reply: (value: string) => void } | null;
  stdin?: string;
  onInputChange?: (value: string) => void;
  isExecuting: boolean;
  hasExecuted: boolean;
  result: Omit<CodeRunResult, 'executionTime'> & { executionTime?: number };
  onRun: () => void;
}) {
  const [liveInput, setLiveInput] = useState('');
  const keyTarget = useRef<HTMLInputElement>(null);
  const lineTarget = useRef<HTMLInputElement>(null);
  const outputTarget = useRef<HTMLDivElement>(null);

  const focusInput = () => {
    if (pendingInput?.kind === 'line') lineTarget.current?.focus();
    else if (pendingInput) keyTarget.current?.focus();
  };

  useEffect(() => {
    setLiveInput('');
    focusInput();
  }, [pendingInput]);

  useEffect(() => {
    if (outputTarget.current) {
      outputTarget.current.scrollTop = outputTarget.current.scrollHeight;
    }
  }, [result.output, pendingInput, liveInput]);

  const onKey = (event: React.KeyboardEvent) => {
    if (!pendingInput || pendingInput.kind === 'line' || ['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
    event.preventDefault();
    const char = event.key.length === 1 ? event.key : event.key === 'Enter' ? '\r' : event.key === 'Tab' ? '\t' : event.key === 'Backspace' ? '\b' : '';
    if (pendingInput.kind === 'char') {
      if (char) pendingInput.reply(char);
      return;
    }
    const codes: Record<string, number> = {
      Enter: 13, Tab: 9, Escape: 27, Backspace: 8, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40,
      Delete: 46, Home: 36, End: 35, PageUp: 33, PageDown: 34, Insert: 45
    };
    const keyCode = codes[event.key] ?? (/^F\d+$/.test(event.key) ? 111 + Number(event.key.slice(1)) : char ? char.toUpperCase().charCodeAt(0) : 0);
    pendingInput.reply(JSON.stringify({ char, keyCode, shift: event.shiftKey, alt: event.altKey, ctrl: event.ctrlKey }));
  };

  const handleLineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingInput) return;
    const submitted = liveInput;
    setLiveInput('');
    pendingInput.reply(submitted);
  };

  const rawOutputText = result.output.join('\n');

  return (
    <div
      onClick={focusInput}
      className="flex min-h-0 flex-1 flex-col bg-[#0c0c0c] font-mono text-sm text-gray-100 cursor-text select-text"
    >
      <div
        ref={outputTarget}
        role="log"
        aria-label="Program output"
        aria-busy={isExecuting}
        className="min-h-0 flex-1 overflow-auto p-4 font-mono leading-relaxed"
      >
        {result.output.length > 0 && (
          <span className="whitespace-pre-wrap break-words">{rawOutputText}</span>
        )}

        {pendingInput && (
          <span className="inline-flex items-baseline max-w-full">
            {pendingInput.kind === 'line' ? (
              <form onSubmit={handleLineSubmit} className="inline-flex items-baseline m-0 p-0">
                <input
                  ref={lineTarget}
                  type="text"
                  aria-label="Console input"
                  value={liveInput}
                  onChange={(e) => setLiveInput(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  className="bg-transparent border-0 outline-none text-emerald-400 font-mono p-0 m-0 caret-transparent inline-block"
                  style={{ width: `${Math.max(1, liveInput.length)}ch` }}
                  autoFocus
                />
              </form>
            ) : (
              <input
                ref={keyTarget}
                type="text"
                aria-label="Console keyboard input"
                value=""
                onKeyDown={onKey}
                onChange={(e) => {
                  const char = e.target.value.charAt(0);
                  if (!char) return;
                  pendingInput.reply(
                    pendingInput.kind === 'char'
                      ? char
                      : JSON.stringify({ char, keyCode: char.toUpperCase().charCodeAt(0), shift: /[A-Z]/.test(char), alt: false, ctrl: false })
                  );
                }}
                autoComplete="off"
                spellCheck={false}
                className="w-1 bg-transparent border-0 outline-none text-transparent font-mono p-0 m-0 caret-transparent inline-block"
                autoFocus
              />
            )}
            <span className="inline-block w-2.5 h-4 bg-emerald-400 animate-pulse ml-0.5 align-middle" />
          </span>
        )}

        {!result.success && result.error && (
          <div role="alert" className="whitespace-pre-wrap break-words text-red-400 mt-2">
            {result.error}
          </div>
        )}
        {result.diagnostics && result.diagnostics.length > 0 && (
          <div className="mt-2 space-y-1">
            {result.diagnostics.map((item, index) => (
              <div key={index} className="whitespace-pre-wrap break-words text-amber-300 text-xs">
                {item.line ? `Line ${item.line}: ` : ''}{item.message}
              </div>
            ))}
          </div>
        )}
        {result.stderr && (
          <div className="whitespace-pre-wrap break-words text-red-400 mt-2">
            {result.stderr}
          </div>
        )}
      </div>
    </div>
  );
}


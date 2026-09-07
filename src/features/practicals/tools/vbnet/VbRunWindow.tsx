import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { VbControl, VbForm } from './vbProject';
import {
  parseVb,
  toVbString,
  VbHost,
  VbObject,
  VbRuntime,
  VbRuntimeError,
  vbToBoolean,
  vbToNumber,
} from './vbInterpreter';

/**
 * The window you get when you press Start: the form drawn as a real Windows
 * window, with the designed controls live and the code running behind them.
 *
 * Control state lives in a ref so the interpreter can read and write it
 * synchronously mid-statement, with a forced render after each change — React
 * state alone would hand the interpreter a stale value inside a loop.
 */

interface ControlState {
  text: string;
  checked: boolean;
  enabled: boolean;
  visible: boolean;
  items: string[];
  selectedIndex: number;
  value: number;
  backColor: string;
  foreColor: string;
}

interface PendingDialog {
  kind: 'message' | 'input';
  prompt: string;
  title: string;
  buttons: string;
  defaultValue: string;
  resolve: (value: string | null) => void;
}

export interface RunLogEntry {
  kind: 'output' | 'error';
  text: string;
}

const initialState = (control: VbControl): ControlState => ({
  text: control.text,
  checked: control.checked,
  enabled: control.enabled,
  visible: control.visible,
  items: [...control.items],
  selectedIndex: -1,
  value: control.value,
  backColor: control.backColor,
  foreColor: control.foreColor,
});

export const VbRunWindow: React.FC<{
  form: VbForm;
  onClose: () => void;
  onLog: (entry: RunLogEntry) => void;
}> = ({ form, onClose, onLog }) => {
  const stateRef = useRef<Record<string, ControlState>>({});
  const [, forceRender] = useReducer((count: number) => count + 1, 0);
  const [dialog, setDialog] = useState<PendingDialog | null>(null);
  const [inputDraft, setInputDraft] = useState('');
  const [crashed, setCrashed] = useState<string | null>(null);
  const nodeRefs = useRef<Record<string, HTMLElement | null>>({});
  const timers = useRef<Record<string, number>>({});
  const runtimeRef = useRef<VbRuntime | null>(null);
  const closedRef = useRef(false);

  if (Object.keys(stateRef.current).length === 0 && form.controls.length > 0) {
    form.controls.forEach((control) => {
      stateRef.current[control.name.toLowerCase()] = initialState(control);
    });
  }

  const read = useCallback((name: string): ControlState | undefined => stateRef.current[name.toLowerCase()], []);

  const write = useCallback(
    (name: string, patch: Partial<ControlState>) => {
      const key = name.toLowerCase();
      const current = stateRef.current[key];
      if (!current) return;
      stateRef.current[key] = { ...current, ...patch };
      forceRender();
    },
    []
  );

  const controlByName = useCallback(
    (name: string) => form.controls.find((control) => control.name.toLowerCase() === name.toLowerCase()),
    [form.controls]
  );

  const reportError = useCallback(
    (error: unknown) => {
      if (error instanceof VbRuntimeError) {
        const text = `${error.message}  (line ${error.line})`;
        setCrashed(text);
        onLog({ kind: 'error', text: `Unhandled exception: ${text}` });
        return;
      }
      if (error && typeof error === 'object' && 'kind' in (error as Record<string, unknown>)) {
        // A bare `End` statement — the program asked to stop.
        onClose();
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      setCrashed(message);
      onLog({ kind: 'error', text: `Unhandled exception: ${message}` });
    },
    [onClose, onLog]
  );

  /* -------------------------------------------------------- object model */

  const itemsObject = useCallback(
    (name: string): VbObject => ({
      __vb: true,
      typeName: 'ObjectCollection',
      get: (property) => {
        const state = read(name);
        if (property.toLowerCase() === 'count') return state?.items.length ?? 0;
        return null;
      },
      set: () => undefined,
      invoke: (method, args) => {
        const state = read(name);
        if (!state) return null;
        const items = [...state.items];
        switch (method.toLowerCase()) {
          case 'add':
            items.push(toVbString(args[0]));
            write(name, { items });
            return items.length - 1;
          case 'clear':
            write(name, { items: [], selectedIndex: -1 });
            return null;
          case 'remove': {
            const position = items.indexOf(toVbString(args[0]));
            if (position >= 0) items.splice(position, 1);
            write(name, { items });
            return null;
          }
          case 'removeat':
            items.splice(vbToNumber(args[0]), 1);
            write(name, { items });
            return null;
          case 'insert':
            items.splice(vbToNumber(args[0]), 0, toVbString(args[1]));
            write(name, { items });
            return null;
          case 'contains':
            return items.includes(toVbString(args[0]));
          case 'indexof':
            return items.indexOf(toVbString(args[0]));
          default:
            throw new VbRuntimeError(`'${method}' is not a member of 'ObjectCollection'.`, 0);
        }
      },
      index: (args) => {
        const state = read(name);
        const position = vbToNumber(args[0]);
        if (!state || position < 0 || position >= state.items.length) {
          throw new VbRuntimeError(
            `InvalidArgument=Value of '${position}' is not valid for 'index'.`,
            0
          );
        }
        return state.items[position];
      },
    }),
    [read, write]
  );

  const controlObject = useCallback(
    (control: VbControl): VbObject => {
      const name = control.name;
      return {
        __vb: true,
        typeName: control.kind,
        get: (property) => {
          const state = read(name);
          if (!state) return null;
          switch (property.toLowerCase()) {
            case 'text':
              if (control.kind === 'ListBox' || control.kind === 'ComboBox') {
                return state.selectedIndex >= 0 ? state.items[state.selectedIndex] : state.text;
              }
              return state.text;
            case 'items':
              return itemsObject(name);
            case 'checked':
              return state.checked;
            case 'enabled':
              return state.enabled;
            case 'visible':
              return state.visible;
            case 'value':
              return state.value;
            case 'selectedindex':
              return state.selectedIndex;
            case 'selecteditem':
              return state.selectedIndex >= 0 ? state.items[state.selectedIndex] : '';
            case 'backcolor':
              return state.backColor;
            case 'forecolor':
              return state.foreColor;
            case 'name':
              return name;
            case 'left':
              return control.x;
            case 'top':
              return control.y;
            case 'width':
              return control.width;
            case 'height':
              return control.height;
            case 'interval':
              return control.interval;
            case 'textlength':
              return state.text.length;
            case 'maximum':
              return control.maximum;
            case 'minimum':
              return control.minimum;
            default:
              throw new VbRuntimeError(
                `'${property}' is not a member of '${control.kind}'.`,
                0
              );
          }
        },
        set: (property, value) => {
          switch (property.toLowerCase()) {
            case 'text':
              write(name, { text: toVbString(value) });
              return;
            case 'checked':
              write(name, { checked: vbToBoolean(value) });
              return;
            case 'enabled':
              if (control.kind === 'Timer') {
                if (vbToBoolean(value)) startTimer(control);
                else stopTimer(name);
                return;
              }
              write(name, { enabled: vbToBoolean(value) });
              return;
            case 'visible':
              write(name, { visible: vbToBoolean(value) });
              return;
            case 'value':
              write(name, { value: vbToNumber(value) });
              return;
            case 'selectedindex':
              write(name, { selectedIndex: vbToNumber(value) });
              return;
            case 'selecteditem': {
              const state = read(name);
              write(name, { selectedIndex: state ? state.items.indexOf(toVbString(value)) : -1 });
              return;
            }
            case 'backcolor':
              write(name, { backColor: toVbString(value) });
              return;
            case 'forecolor':
              write(name, { foreColor: toVbString(value) });
              return;
            default:
              throw new VbRuntimeError(
                `'${property}' cannot be set on '${control.kind}'.`,
                0
              );
          }
        },
        invoke: (method, args) => {
          switch (method.toLowerCase()) {
            case 'clear':
              write(name, { text: '', items: [], selectedIndex: -1 });
              return null;
            case 'focus':
            case 'select':
              nodeRefs.current[name.toLowerCase()]?.focus();
              return null;
            case 'show':
              write(name, { visible: true });
              return null;
            case 'hide':
              write(name, { visible: false });
              return null;
            case 'start':
              startTimer(control);
              return null;
            case 'stop':
              stopTimer(name);
              return null;
            case 'refresh':
            case 'update':
              forceRender();
              return null;
            case 'appendtext':
              write(name, { text: (read(name)?.text ?? '') + toVbString(args[0]) });
              return null;
            case 'tostring':
              return read(name)?.text ?? '';
            default:
              throw new VbRuntimeError(`'${method}' is not a member of '${control.kind}'.`, 0);
          }
        },
      };
    },
    // startTimer / stopTimer are stable closures declared below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [read, write, itemsObject]
  );

  const raise = useCallback(async (controlName: string, eventName: string) => {
    const runtime = runtimeRef.current;
    if (!runtime || closedRef.current) return;
    try {
      await runtime.raiseEvent(controlName, eventName);
    } catch (error) {
      reportError(error);
    }
  }, [reportError]);

  const startTimer = useCallback(
    (control: VbControl) => {
      stopTimer(control.name);
      const handle = window.setInterval(() => {
        void raise(control.name, 'Tick');
      }, Math.max(15, control.interval));
      timers.current[control.name.toLowerCase()] = handle;
    },
    [raise]
  );

  const stopTimer = (name: string) => {
    const handle = timers.current[name.toLowerCase()];
    if (handle) {
      window.clearInterval(handle);
      delete timers.current[name.toLowerCase()];
    }
  };

  /* ------------------------------------------------------------ the host */

  const host: VbHost = useMemo(
    () => ({
      getControl: (name) => {
        const control = controlByName(name);
        return control ? controlObject(control) : undefined;
      },
      showMessage: (prompt, title, buttons) =>
        new Promise<string>((resolve) => {
          setDialog({
            kind: 'message',
            prompt,
            title,
            buttons,
            defaultValue: '',
            resolve: (value) => resolve(value ?? 'Cancel'),
          });
        }),
      showInput: (prompt, title, defaultValue) =>
        new Promise<string | null>((resolve) => {
          setInputDraft(defaultValue);
          setDialog({ kind: 'input', prompt, title, buttons: 'OKCancel', defaultValue, resolve });
        }),
      print: (text) => onLog({ kind: 'output', text }),
      formObject: (name) => {
        const lower = name.toLowerCase();
        if (lower !== 'me' && lower !== form.name.toLowerCase()) return undefined;
        return {
          __vb: true,
          typeName: 'Form',
          get: (property) => {
            switch (property.toLowerCase()) {
              case 'text':
                return form.text;
              case 'name':
                return form.name;
              case 'width':
                return form.width;
              case 'height':
                return form.height;
              default:
                return null;
            }
          },
          set: () => undefined,
          invoke: (method) => {
            const lowerMethod = method.toLowerCase();
            if (lowerMethod === 'close' || lowerMethod === 'hide') {
              closedRef.current = true;
              window.setTimeout(onClose, 0);
              return null;
            }
            if (lowerMethod === 'refresh') {
              forceRender();
              return null;
            }
            return null;
          },
        };
      },
    }),
    [controlByName, controlObject, form, onClose, onLog]
  );

  /* ---------------------------------------------------------- start-up */

  useEffect(() => {
    closedRef.current = false;
    const module = parseVb(form.code);
    const runtime = new VbRuntime(module, host);
    runtimeRef.current = runtime;

    const boot = async () => {
      try {
        await runtime.start();
        await runtime.raiseEvent(form.name, 'Load');
        await runtime.raiseEvent('Me', 'Load');
        // Timers whose Enabled was ticked in the designer start with the form.
        form.controls
          .filter((control) => control.kind === 'Timer' && control.timerEnabled)
          .forEach(startTimer);
      } catch (error) {
        reportError(error);
      }
    };
    void boot();

    return () => {
      closedRef.current = true;
      runtime.stop();
      Object.values(timers.current).forEach((handle) => window.clearInterval(handle));
      timers.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -------------------------------------------------------------- render */

  const renderControl = (control: VbControl) => {
    const state = read(control.name);
    if (!state || !state.visible) return null;

    const style: React.CSSProperties = {
      position: 'absolute',
      left: control.x,
      top: control.y,
      width: control.width,
      height: control.height,
      fontSize: control.fontSize + 2,
      fontWeight: control.bold ? 700 : 400,
      fontStyle: control.italic ? 'italic' : 'normal',
      color: state.foreColor,
      textAlign: control.textAlign.toLowerCase() as React.CSSProperties['textAlign'],
      fontFamily: 'Microsoft Sans Serif, Segoe UI, sans-serif',
    };
    const background = state.backColor === 'transparent' ? undefined : state.backColor;
    const setNode = (node: HTMLElement | null) => {
      nodeRefs.current[control.name.toLowerCase()] = node;
    };

    switch (control.kind) {
      case 'Button':
        return (
          <button
            key={control.id}
            ref={setNode}
            type="button"
            disabled={!state.enabled}
            style={{ ...style, background: background || '#e1e1e1' }}
            onClick={() => void raise(control.name, 'Click')}
            onMouseEnter={() => void raise(control.name, 'MouseEnter')}
            onMouseLeave={() => void raise(control.name, 'MouseLeave')}
            className="border border-[#adadad] active:border-[#0078d7] disabled:text-[#a0a0a0] hover:border-[#0078d7] hover:bg-[#e5f1fb]"
          >
            {state.text}
          </button>
        );

      case 'Label':
        return (
          <span
            key={control.id}
            ref={setNode}
            style={{ ...style, background, display: 'flex', alignItems: 'center' }}
            onClick={() => void raise(control.name, 'Click')}
          >
            {state.text}
          </span>
        );

      case 'TextBox':
        return control.multiline ? (
          <textarea
            key={control.id}
            ref={setNode as (node: HTMLTextAreaElement | null) => void}
            value={state.text}
            disabled={!state.enabled}
            style={{ ...style, background: background || '#ffffff', resize: 'none' }}
            onChange={(event) => {
              write(control.name, { text: event.target.value });
              void raise(control.name, 'TextChanged');
            }}
            onFocus={() => void raise(control.name, 'Enter')}
            onBlur={() => void raise(control.name, 'Leave')}
            className="border border-[#7a7a7a] px-1 outline-none focus:border-[#0078d7]"
          />
        ) : (
          <input
            key={control.id}
            ref={setNode as (node: HTMLInputElement | null) => void}
            type={control.passwordChar ? 'password' : 'text'}
            value={state.text}
            disabled={!state.enabled}
            style={{ ...style, background: background || '#ffffff' }}
            onChange={(event) => {
              write(control.name, { text: event.target.value });
              void raise(control.name, 'TextChanged');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void raise(control.name, 'KeyPress');
            }}
            onFocus={() => void raise(control.name, 'Enter')}
            onBlur={() => void raise(control.name, 'Leave')}
            className="border border-[#7a7a7a] px-1 outline-none focus:border-[#0078d7]"
          />
        );

      case 'CheckBox':
        return (
          <label key={control.id} style={{ ...style, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              ref={setNode as (node: HTMLInputElement | null) => void}
              type="checkbox"
              checked={state.checked}
              disabled={!state.enabled}
              onChange={(event) => {
                write(control.name, { checked: event.target.checked });
                void raise(control.name, 'CheckedChanged');
                void raise(control.name, 'Click');
              }}
              className="h-[13px] w-[13px] accent-[#0078d7]"
            />
            {state.text}
          </label>
        );

      case 'RadioButton':
        return (
          <label key={control.id} style={{ ...style, display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              ref={setNode as (node: HTMLInputElement | null) => void}
              type="radio"
              checked={state.checked}
              disabled={!state.enabled}
              onChange={() => {
                // Radio buttons are mutually exclusive within the form, the way
                // they are within a container in Windows Forms.
                form.controls
                  .filter((item) => item.kind === 'RadioButton')
                  .forEach((item) => write(item.name, { checked: item.name === control.name }));
                void raise(control.name, 'CheckedChanged');
                void raise(control.name, 'Click');
              }}
              className="h-[13px] w-[13px] accent-[#0078d7]"
            />
            {state.text}
          </label>
        );

      case 'ComboBox':
        return (
          <select
            key={control.id}
            ref={setNode as (node: HTMLSelectElement | null) => void}
            value={state.selectedIndex >= 0 ? String(state.selectedIndex) : ''}
            disabled={!state.enabled}
            style={{ ...style, background: background || '#ffffff' }}
            onChange={(event) => {
              write(control.name, { selectedIndex: Number(event.target.value) });
              void raise(control.name, 'SelectedIndexChanged');
            }}
            className="border border-[#7a7a7a] px-1 outline-none"
          >
            <option value="" />
            {state.items.map((item, index) => (
              <option key={`${item}-${index}`} value={index}>
                {item}
              </option>
            ))}
          </select>
        );

      case 'ListBox':
        return (
          <div
            key={control.id}
            ref={setNode}
            tabIndex={0}
            style={{ ...style, background: background || '#ffffff', overflowY: 'auto', textAlign: 'left' }}
            className="border border-[#7a7a7a] outline-none"
          >
            {state.items.map((item, index) => (
              <div
                key={`${item}-${index}`}
                onClick={() => {
                  write(control.name, { selectedIndex: index });
                  void raise(control.name, 'SelectedIndexChanged');
                }}
                onDoubleClick={() => void raise(control.name, 'DoubleClick')}
                className={`cursor-default px-1 ${
                  state.selectedIndex === index ? 'bg-[#0078d7] text-white' : ''
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        );

      case 'GroupBox':
        return (
          <fieldset
            key={control.id}
            style={{ ...style, background }}
            className="border border-[#d0d0d0] px-2"
          >
            <legend className="px-1">{state.text}</legend>
          </fieldset>
        );

      case 'PictureBox':
        return (
          <div
            key={control.id}
            ref={setNode}
            style={{ ...style, background: background || '#ffffff' }}
            onClick={() => void raise(control.name, 'Click')}
            className="overflow-hidden border border-[#d0d0d0]"
          >
            {control.imageUrl && (
              <img src={control.imageUrl} alt="" className="h-full w-full object-contain" />
            )}
          </div>
        );

      case 'NumericUpDown':
        return (
          <input
            key={control.id}
            ref={setNode as (node: HTMLInputElement | null) => void}
            type="number"
            value={state.value}
            min={control.minimum}
            max={control.maximum}
            disabled={!state.enabled}
            style={{ ...style, background: background || '#ffffff' }}
            onChange={(event) => {
              write(control.name, { value: Number(event.target.value) });
              void raise(control.name, 'ValueChanged');
            }}
            className="border border-[#7a7a7a] px-1 outline-none"
          />
        );

      case 'ProgressBar': {
        const span = Math.max(1, control.maximum - control.minimum);
        const percent = Math.min(100, Math.max(0, ((state.value - control.minimum) / span) * 100));
        return (
          <div
            key={control.id}
            style={{ ...style, background: '#e6e6e6' }}
            className="overflow-hidden border border-[#bcbcbc]"
          >
            <div style={{ width: `${percent}%` }} className="h-full bg-[#06b025]" />
          </div>
        );
      }

      case 'DateTimePicker':
        return (
          <input
            key={control.id}
            ref={setNode as (node: HTMLInputElement | null) => void}
            type="date"
            disabled={!state.enabled}
            style={{ ...style, background: background || '#ffffff' }}
            onChange={() => void raise(control.name, 'ValueChanged')}
            className="border border-[#7a7a7a] px-1 outline-none"
          />
        );

      default:
        return null;
    }
  };

  const messageButtons = (buttons: string): string[] => {
    const key = buttons.toLowerCase();
    if (key.includes('yesnocancel')) return ['Yes', 'No', 'Cancel'];
    if (key.includes('yesno')) return ['Yes', 'No'];
    if (key.includes('okcancel')) return ['OK', 'Cancel'];
    if (key.includes('retrycancel')) return ['Retry', 'Cancel'];
    return ['OK'];
  };

  return (
    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/25">
      <div
        className="flex flex-col border border-[#8a8a8a] bg-[#f0f0f0] shadow-2xl"
        style={{ width: form.width, minHeight: form.height }}
      >
        {/* Windows title bar */}
        <div className="flex h-[30px] shrink-0 items-center justify-between bg-gradient-to-b from-[#ffffff] to-[#e8ecf0] px-2 text-[12px] text-[#1a1a1a]">
          <span className="truncate font-[Segoe_UI,sans-serif]">{form.text}</span>
          <div className="flex items-center">
            <span className="flex h-[24px] w-[34px] items-center justify-center text-[#555] hover:bg-black/5">
              <Minus size={13} />
            </span>
            <span className="flex h-[24px] w-[34px] items-center justify-center text-[#555] hover:bg-black/5">
              <Square size={11} />
            </span>
            <button
              type="button"
              onClick={onClose}
              title="Close (stops debugging)"
              className="flex h-[24px] w-[38px] items-center justify-center text-[#555] hover:bg-[#e81123] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Client area */}
        <div
          className="relative flex-1 overflow-hidden"
          style={{ background: form.backColor, height: form.height }}
        >
          {form.controls.map(renderControl)}

          {form.controls.length === 0 && (
            <p className="p-6 text-center text-[12px] text-[#666]">
              This form has no controls. Stop debugging and drag some from the Toolbox.
            </p>
          )}
        </div>

        {/* A crash puts up the exception box Visual Studio shows */}
        {crashed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 p-4">
            <div className="w-[420px] border border-[#8a8a8a] bg-[#f0f0f0] shadow-2xl">
              <div className="bg-gradient-to-b from-[#ffffff] to-[#e8ecf0] px-3 py-1.5 text-[12px] font-semibold">
                {form.name} — Unhandled exception
              </div>
              <div className="p-4 text-[12px] leading-relaxed text-[#1a1a1a]">{crashed}</div>
              <div className="flex justify-end gap-2 border-t border-[#d0d0d0] px-3 py-2">
                <WindowsButton label="Break" onClick={onClose} />
                <WindowsButton label="Continue" onClick={() => setCrashed(null)} />
              </div>
            </div>
          </div>
        )}

        {/* MsgBox / InputBox */}
        {dialog && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-4">
            <div className="min-w-[300px] max-w-[420px] border border-[#8a8a8a] bg-[#f0f0f0] shadow-2xl">
              <div className="bg-gradient-to-b from-[#ffffff] to-[#e8ecf0] px-3 py-1.5 text-[12px] font-semibold">
                {dialog.title}
              </div>
              <div className="px-4 py-4 text-[12px] leading-relaxed text-[#1a1a1a]">
                <p className="whitespace-pre-wrap">{dialog.prompt}</p>
                {dialog.kind === 'input' && (
                  <input
                    autoFocus
                    value={inputDraft}
                    onChange={(event) => setInputDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        dialog.resolve(inputDraft);
                        setDialog(null);
                      }
                    }}
                    className="mt-3 h-[22px] w-full border border-[#7a7a7a] px-1 outline-none focus:border-[#0078d7]"
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 border-t border-[#d0d0d0] bg-[#f0f0f0] px-3 py-2">
                {dialog.kind === 'input' ? (
                  <>
                    <WindowsButton
                      label="OK"
                      onClick={() => {
                        dialog.resolve(inputDraft);
                        setDialog(null);
                      }}
                    />
                    <WindowsButton
                      label="Cancel"
                      onClick={() => {
                        dialog.resolve(null);
                        setDialog(null);
                      }}
                    />
                  </>
                ) : (
                  messageButtons(dialog.buttons).map((label) => (
                    <WindowsButton
                      key={label}
                      label={label}
                      onClick={() => {
                        dialog.resolve(label);
                        setDialog(null);
                      }}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WindowsButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="min-w-[76px] border border-[#adadad] bg-[#e1e1e1] px-3 py-1 text-[12px] hover:border-[#0078d7] hover:bg-[#e5f1fb]"
  >
    {label}
  </button>
);

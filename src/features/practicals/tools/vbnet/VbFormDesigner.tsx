import React, { useEffect, useRef, useState } from 'react';
import { VbControl, VbControlKind, VbForm, isComponent } from './vbProject';

/**
 * The Windows Forms design surface: the form drawn as a window on a grey
 * workspace, controls you drag and resize with the eight sizing handles, snap
 * lines when an edge lines up with a neighbour, and the component tray along
 * the bottom for things with no visual presence, like a Timer.
 */

type Handle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

const SNAP = 6;

interface Drag {
  mode: 'move' | 'resize' | 'form-resize';
  id: string;
  handle?: Handle;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  originW: number;
  originH: number;
}

export const VbFormDesigner: React.FC<{
  form: VbForm;
  onChange: (form: VbForm) => void;
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** The Toolbox item armed for the next click on the surface. */
  pending: VbControlKind | null;
  onDropControl: (kind: VbControlKind, x: number, y: number) => void;
  /** Double-clicking a control writes its default event handler. */
  onOpenHandler: (control: VbControl) => void;
}> = ({ form, onChange, selected, onSelect, pending, onDropControl, onOpenHandler }) => {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const deltaX = event.clientX - drag.startX;
      const deltaY = event.clientY - drag.startY;

      if (drag.mode === 'form-resize') {
        // The designer gives the form three grips: the right edge sizes it
        // across, the bottom edge sizes it down, the corner does both.
        const grip = drag.handle ?? 'se';
        onChange({
          ...form,
          width: grip === 's' ? form.width : Math.max(200, drag.originW + deltaX),
          height: grip === 'e' ? form.height : Math.max(120, drag.originH + deltaY),
        });
        return;
      }

      const control = form.controls.find((item) => item.id === drag.id);
      if (!control) return;

      if (drag.mode === 'move') {
        let x = Math.max(0, drag.originX + deltaX);
        let y = Math.max(0, drag.originY + deltaY);
        const guideX: number[] = [];
        const guideY: number[] = [];

        // Snap to the edges and centres of the other controls.
        form.controls.forEach((other) => {
          if (other.id === control.id || isComponent(other.kind)) return;
          [other.x, other.x + other.width - control.width, other.x + (other.width - control.width) / 2].forEach(
            (candidate) => {
              if (Math.abs(x - candidate) <= SNAP) {
                x = Math.round(candidate);
                guideX.push(x);
              }
            }
          );
          [other.y, other.y + other.height - control.height, other.y + (other.height - control.height) / 2].forEach(
            (candidate) => {
              if (Math.abs(y - candidate) <= SNAP) {
                y = Math.round(candidate);
                guideY.push(y);
              }
            }
          );
        });

        setGuides({ x: guideX, y: guideY });
        onChange({
          ...form,
          controls: form.controls.map((item) =>
            item.id === control.id ? { ...item, x: Math.round(x), y: Math.round(y) } : item
          ),
        });
        return;
      }

      const handle = drag.handle || 'se';
      let { originX: x, originY: y, originW: width, originH: height } = drag;
      if (handle.includes('e')) width = Math.max(8, drag.originW + deltaX);
      if (handle.includes('s')) height = Math.max(8, drag.originH + deltaY);
      if (handle.includes('w')) {
        width = Math.max(8, drag.originW - deltaX);
        x = drag.originX + deltaX;
      }
      if (handle.includes('n')) {
        height = Math.max(8, drag.originH - deltaY);
        y = drag.originY + deltaY;
      }

      onChange({
        ...form,
        controls: form.controls.map((item) =>
          item.id === control.id
            ? {
                ...item,
                x: Math.round(Math.max(0, x)),
                y: Math.round(Math.max(0, y)),
                width: Math.round(width),
                height: Math.round(height),
              }
            : item
        ),
      });
    };

    const onUp = () => {
      dragRef.current = null;
      setGuides({ x: [], y: [] });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [form, onChange]);

  const dropPending = (event: React.MouseEvent) => {
    if (!pending) {
      onSelect(null);
      return;
    }
    const bounds = surfaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    onDropControl(
      pending,
      Math.round(event.clientX - bounds.left),
      Math.round(event.clientY - bounds.top)
    );
  };

  const visualControls = form.controls.filter((control) => !isComponent(control.kind));
  const trayControls = form.controls.filter((control) => isComponent(control.kind));

  return (
    <div className="flex h-full flex-col overflow-auto bg-[#f5f5f7] p-6">
      <div className="w-fit">
        {/* The form window, drawn the way the designer paints it: a blue
            gradient caption, the two pale window buttons and the red close. */}
        <div
          className="relative border border-[#8a9bb0] shadow-[0_3px_14px_rgba(0,0,0,0.22)]"
          style={{ width: form.width, background: form.backColor }}
        >
          <div className="flex h-[30px] items-center justify-between border-b border-[#a9bdd4] bg-gradient-to-b from-[#dce9f8] to-[#b3cee9] pl-2 pr-1 text-[12px] text-[#1e1e1e]">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-[13px] w-[13px] shrink-0 items-center justify-center border border-[#7a94b4] bg-white text-[8px] text-[#68217a]">
                ▤
              </span>
              <span className="truncate">{form.text}</span>
            </span>
            <span className="flex items-center gap-[3px]">
              <span className="flex h-[19px] w-[27px] items-end justify-center border border-[#9fb6d0] bg-gradient-to-b from-[#f2f7fc] to-[#d5e3f2] pb-[3px] text-[10px] leading-none text-[#33475e]">
                ─
              </span>
              <span className="flex h-[19px] w-[27px] items-center justify-center border border-[#9fb6d0] bg-gradient-to-b from-[#f2f7fc] to-[#d5e3f2] text-[9px] leading-none text-[#33475e]">
                ▢
              </span>
              <span className="flex h-[19px] w-[41px] items-center justify-center border border-[#b03a33] bg-gradient-to-b from-[#e9635c] to-[#cf3730] text-[11px] leading-none text-white">
                ✕
              </span>
            </span>
          </div>

          <div
            ref={surfaceRef}
            onMouseDown={dropPending}
            className={`relative overflow-hidden ${pending ? 'cursor-crosshair' : ''}`}
            style={{ height: form.height }}
          >
            {guides.x.map((x, index) => (
              <span key={`gx-${index}`} className="absolute top-0 h-full w-px bg-[#d800d8]" style={{ left: x }} />
            ))}
            {guides.y.map((y, index) => (
              <span key={`gy-${index}`} className="absolute left-0 h-px w-full bg-[#d800d8]" style={{ top: y }} />
            ))}

            {visualControls.map((control) => {
              const isSelected = control.id === selected;
              return (
                <div
                  key={control.id}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    onSelect(control.id);
                    dragRef.current = {
                      mode: 'move',
                      id: control.id,
                      startX: event.clientX,
                      startY: event.clientY,
                      originX: control.x,
                      originY: control.y,
                      originW: control.width,
                      originH: control.height,
                    };
                  }}
                  onDoubleClick={(event) => {
                    event.stopPropagation();
                    onOpenHandler(control);
                  }}
                  className={`absolute cursor-move select-none ${
                    isSelected ? 'outline outline-1 outline-[#0078d7]' : ''
                  }`}
                  style={{ left: control.x, top: control.y, width: control.width, height: control.height }}
                >
                  <DesignPreview control={control} />

                  {isSelected && (
                    <>
                      {(['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'] as Handle[]).map((handle) => (
                        <span
                          key={handle}
                          onMouseDown={(event) => {
                            event.stopPropagation();
                            dragRef.current = {
                              mode: 'resize',
                              id: control.id,
                              handle,
                              startX: event.clientX,
                              startY: event.clientY,
                              originX: control.x,
                              originY: control.y,
                              originW: control.width,
                              originH: control.height,
                            };
                          }}
                          className="absolute h-[7px] w-[7px] border border-[#0078d7] bg-white"
                          style={{
                            cursor: `${handle}-resize`,
                            left:
                              handle.includes('w')
                                ? -4
                                : handle.includes('e')
                                  ? 'calc(100% - 3px)'
                                  : 'calc(50% - 3px)',
                            top:
                              handle.includes('n')
                                ? -4
                                : handle.includes('s')
                                  ? 'calc(100% - 3px)'
                                  : 'calc(50% - 3px)',
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* The three black sizing grips the designer puts on a form. */}
          {(
            [
              ['e', 'top-1/2 -right-[4px] -translate-y-1/2 cursor-ew-resize'],
              ['s', 'left-1/2 -bottom-[4px] -translate-x-1/2 cursor-ns-resize'],
              ['se', '-bottom-[4px] -right-[4px] cursor-nwse-resize'],
            ] as Array<[Handle, string]>
          ).map(([grip, place]) => (
            <span
              key={grip}
              onMouseDown={(event) => {
                event.stopPropagation();
                dragRef.current = {
                  mode: 'form-resize',
                  id: 'form',
                  handle: grip,
                  startX: event.clientX,
                  startY: event.clientY,
                  originX: 0,
                  originY: 0,
                  originW: form.width,
                  originH: form.height,
                };
              }}
              className={`absolute h-[7px] w-[7px] bg-[#1e1e1e] ${place}`}
            />
          ))}
        </div>

        {/* Component tray */}
        {trayControls.length > 0 && (
          <div className="mt-6 flex min-h-[64px] w-full items-start gap-4 border border-[#c4c9d4] bg-[#e8ebf1] p-3">
            {trayControls.map((control) => (
              <button
                key={control.id}
                type="button"
                onClick={() => onSelect(control.id)}
                onDoubleClick={() => onOpenHandler(control)}
                className={`flex w-[74px] flex-col items-center gap-1 rounded p-1 text-[11px] ${
                  control.id === selected ? 'bg-[#cde0f5] outline outline-1 outline-[#0078d7]' : 'hover:bg-black/5'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-[#8a8a8a] bg-white text-[16px]">
                  ⏱
                </span>
                <span className="truncate">{control.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/** How each control looks on the design surface, with no behaviour attached. */
const DesignPreview: React.FC<{ control: VbControl }> = ({ control }) => {
  const style: React.CSSProperties = {
    fontSize: control.fontSize + 2,
    fontWeight: control.bold ? 700 : 400,
    fontStyle: control.italic ? 'italic' : 'normal',
    color: control.enabled ? control.foreColor : '#a0a0a0',
    textAlign: control.textAlign.toLowerCase() as React.CSSProperties['textAlign'],
    fontFamily: 'Microsoft Sans Serif, Segoe UI, sans-serif',
    background: control.backColor === 'transparent' ? undefined : control.backColor,
  };

  switch (control.kind) {
    case 'Button':
      return (
        <div
          style={{ ...style, background: control.backColor === 'transparent' ? '#e1e1e1' : control.backColor }}
          className="pointer-events-none flex h-full w-full items-center justify-center border border-[#adadad]"
        >
          {control.text}
        </div>
      );
    case 'Label':
      return (
        <div style={style} className="pointer-events-none flex h-full w-full items-center">
          {control.text}
        </div>
      );
    case 'TextBox':
      return (
        <div
          style={{ ...style, background: '#ffffff' }}
          className="pointer-events-none flex h-full w-full items-center border border-[#7a7a7a] px-1"
        >
          {control.passwordChar ? control.passwordChar.repeat(Math.min(8, control.text.length)) : control.text}
        </div>
      );
    case 'CheckBox':
    case 'RadioButton':
      return (
        <div style={style} className="pointer-events-none flex h-full w-full items-center gap-1.5">
          <span
            className={`h-[13px] w-[13px] shrink-0 border border-[#7a7a7a] bg-white ${
              control.kind === 'RadioButton' ? 'rounded-full' : ''
            }`}
          >
            {control.checked && (
              <span className="flex h-full w-full items-center justify-center text-[9px] leading-none text-[#0078d7]">
                {control.kind === 'RadioButton' ? '●' : '✓'}
              </span>
            )}
          </span>
          {control.text}
        </div>
      );
    case 'ComboBox':
      return (
        <div
          style={{ ...style, background: '#ffffff' }}
          className="pointer-events-none flex h-full w-full items-center justify-between border border-[#7a7a7a] px-1"
        >
          <span className="truncate">{control.items[0] || ''}</span>
          <span className="text-[9px]">▼</span>
        </div>
      );
    case 'ListBox':
      return (
        <div
          style={{ ...style, background: '#ffffff', textAlign: 'left' }}
          className="pointer-events-none h-full w-full overflow-hidden border border-[#7a7a7a]"
        >
          {control.items.slice(0, 8).map((item, index) => (
            <div key={index} className="truncate px-1">
              {item}
            </div>
          ))}
        </div>
      );
    case 'GroupBox':
      return (
        <fieldset style={style} className="pointer-events-none h-full w-full border border-[#d0d0d0] px-2">
          <legend className="px-1">{control.text}</legend>
        </fieldset>
      );
    case 'PictureBox':
      return (
        <div
          style={{ ...style, background: '#ffffff' }}
          className="pointer-events-none flex h-full w-full items-center justify-center overflow-hidden border border-[#d0d0d0] text-[10px] text-[#999]"
        >
          {control.imageUrl ? (
            <img src={control.imageUrl} alt="" className="h-full w-full object-contain" />
          ) : (
            'PictureBox'
          )}
        </div>
      );
    case 'NumericUpDown':
      return (
        <div
          style={{ ...style, background: '#ffffff' }}
          className="pointer-events-none flex h-full w-full items-center justify-between border border-[#7a7a7a] px-1"
        >
          <span>{control.value}</span>
          <span className="text-[8px] leading-[8px]">
            ▲
            <br />▼
          </span>
        </div>
      );
    case 'ProgressBar': {
      const span = Math.max(1, control.maximum - control.minimum);
      const percent = Math.min(100, Math.max(0, ((control.value - control.minimum) / span) * 100));
      return (
        <div className="pointer-events-none h-full w-full overflow-hidden border border-[#bcbcbc] bg-[#e6e6e6]">
          <div style={{ width: `${percent}%` }} className="h-full bg-[#06b025]" />
        </div>
      );
    }
    case 'DateTimePicker':
      return (
        <div
          style={{ ...style, background: '#ffffff' }}
          className="pointer-events-none flex h-full w-full items-center justify-between border border-[#7a7a7a] px-1"
        >
          <span>{new Date().toLocaleDateString('en-GB')}</span>
          <span className="text-[9px]">▼</span>
        </div>
      );
    default:
      return null;
  }
};

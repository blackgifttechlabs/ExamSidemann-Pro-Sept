import React, { useEffect, useRef, useState } from 'react';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Filter, Plus, Search } from 'lucide-react';
import {
  AccessDatabase,
  AccessForm,
  AccessValue,
  BUTTON_ACTIONS,
  ButtonAction,
  displayValue,
  findTable,
  FormControl,
  FormControlKind,
  newId,
} from './accessModel';
import { recordSourceFields, recordSourceRows } from './accessSql';

/**
 * Forms, in the two views a student needs: Design View, where controls are
 * dragged around a grid-dotted detail section, and Form View, where the form is
 * bound to its record source and the navigation buttons walk the records.
 *
 * A control's Control Source is what binds it to a field. Bound text boxes in
 * Form View write straight back into the underlying table.
 */

const GRID_DOT =
  'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.22) 1px, transparent 0)';

export const makeFormControl = (
  kind: FormControlKind,
  patch: Partial<FormControl> = {}
): FormControl => ({
  kind,
  name: patch.name || `${kind === 'textbox' ? 'Text' : kind === 'button' ? 'Command' : 'Label'}${Math.floor(Math.random() * 90) + 10}`,
  caption: patch.caption ?? (kind === 'button' ? 'Command' : 'Label'),
  controlSource: patch.controlSource ?? '',
  x: patch.x ?? 24,
  y: patch.y ?? 24,
  width: patch.width ?? (kind === 'label' ? 110 : kind === 'button' ? 96 : 170),
  height: patch.height ?? 22,
  fontSize: patch.fontSize ?? 11,
  bold: patch.bold ?? false,
  foreColor: patch.foreColor ?? '#000000',
  backColor: patch.backColor ?? (kind === 'textbox' ? '#ffffff' : 'transparent'),
  align: patch.align ?? 'left',
  action: patch.action ?? 'None',
  ...patch,
  id: newId('ctl'),
});

/** The layout the Form button produces: a label and a bound box per field. */
export const autoFormControls = (db: AccessDatabase, recordSource: string): FormControl[] => {
  const fields = recordSourceFields(db, recordSource);
  const controls: FormControl[] = [];
  fields.forEach((field, index) => {
    const y = 16 + index * 28;
    controls.push(
      makeFormControl('label', {
        name: `lbl${field}`,
        caption: `${field}:`,
        x: 16,
        y,
        width: 120,
        height: 22,
      })
    );
    controls.push(
      makeFormControl('textbox', {
        name: field,
        caption: field,
        controlSource: field,
        x: 144,
        y,
        width: 200,
        height: 22,
      })
    );
  });
  return controls;
};

/* ------------------------------------------------------------------ Design */

export const AccessFormDesign: React.FC<{
  db: AccessDatabase;
  form: AccessForm;
  onChange: (form: AccessForm) => void;
  selected: string | null;
  onSelect: (id: string | null) => void;
  /** The control the toolbox has armed; the next click on the grid drops it. */
  pendingControl: FormControlKind | null;
  onPendingHandled: () => void;
}> = ({ db, form, onChange, selected, onSelect, pendingControl, onPendingHandled }) => {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const drag = useRef<
    | { mode: 'move'; id: string; offsetX: number; offsetY: number }
    | { mode: 'resize'; id: string; startX: number; startY: number; startW: number; startH: number }
    | null
  >(null);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      const current = drag.current;
      const bounds = surfaceRef.current?.getBoundingClientRect();
      if (!current || !bounds) return;
      onChange({
        ...form,
        controls: form.controls.map((control) => {
          if (control.id !== current.id) return control;
          if (current.mode === 'move') {
            return {
              ...control,
              x: Math.max(0, Math.round((event.clientX - bounds.left - current.offsetX) / 4) * 4),
              y: Math.max(0, Math.round((event.clientY - bounds.top - current.offsetY) / 4) * 4),
            };
          }
          return {
            ...control,
            width: Math.max(24, Math.round((current.startW + event.clientX - current.startX) / 4) * 4),
            height: Math.max(16, Math.round((current.startH + event.clientY - current.startY) / 4) * 4),
          };
        }),
      });
    };
    const onUp = () => {
      drag.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [form, onChange]);

  const dropControl = (event: React.MouseEvent) => {
    if (!pendingControl) {
      onSelect(null);
      return;
    }
    const bounds = surfaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const control = makeFormControl(pendingControl, {
      x: Math.round((event.clientX - bounds.left) / 4) * 4,
      y: Math.round((event.clientY - bounds.top) / 4) * 4,
      caption:
        pendingControl === 'button'
          ? 'Command'
          : pendingControl === 'checkbox'
            ? 'Check'
            : pendingControl === 'label'
              ? 'Label'
              : '',
    });
    onChange({ ...form, controls: [...form.controls, control] });
    onSelect(control.id);
    onPendingHandled();
  };

  return (
    <div className="h-full overflow-auto bg-[#b8c8d8] p-4">
      <div className="w-fit min-w-full">
        <SectionBar label="Form Header" />
        <div
          className="border border-t-0 border-[#7f7f7f] bg-white"
          style={{ width: form.width, height: form.headerHeight }}
        >
          <div className="px-3 py-2 text-[15px] font-semibold text-[#1a1a1a]">{form.caption || form.name}</div>
        </div>

        <SectionBar label="Detail" />
        <div
          ref={surfaceRef}
          onMouseDown={dropControl}
          className={`relative border border-t-0 border-[#7f7f7f] bg-white ${
            pendingControl ? 'cursor-crosshair' : ''
          }`}
          style={{
            width: form.width,
            height: form.detailHeight,
            backgroundImage: GRID_DOT,
            backgroundSize: '8px 8px',
          }}
        >
          {form.controls.map((control) => {
            const isSelected = control.id === selected;
            return (
              <div
                key={control.id}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  const bounds = surfaceRef.current?.getBoundingClientRect();
                  if (!bounds) return;
                  onSelect(control.id);
                  drag.current = {
                    mode: 'move',
                    id: control.id,
                    offsetX: event.clientX - bounds.left - control.x,
                    offsetY: event.clientY - bounds.top - control.y,
                  };
                }}
                className={`absolute cursor-move select-none ${isSelected ? 'outline outline-1 outline-[#0a64c8]' : ''}`}
                style={{ left: control.x, top: control.y, width: control.width, height: control.height }}
              >
                <DesignControl control={control} />
                {isSelected && (
                  <>
                    {[
                      ['-3px', '-3px'],
                      ['calc(50% - 3px)', '-3px'],
                      ['calc(100% - 3px)', '-3px'],
                      ['-3px', 'calc(50% - 3px)'],
                      ['calc(100% - 3px)', 'calc(50% - 3px)'],
                      ['-3px', 'calc(100% - 3px)'],
                      ['calc(50% - 3px)', 'calc(100% - 3px)'],
                    ].map(([left, top]) => (
                      <span
                        key={`${left}-${top}`}
                        className="absolute h-[6px] w-[6px] bg-[#0a64c8]"
                        style={{ left, top }}
                      />
                    ))}
                    <span
                      role="presentation"
                      onMouseDown={(event) => {
                        event.stopPropagation();
                        drag.current = {
                          mode: 'resize',
                          id: control.id,
                          startX: event.clientX,
                          startY: event.clientY,
                          startW: control.width,
                          startH: control.height,
                        };
                      }}
                      className="absolute h-[6px] w-[6px] cursor-nwse-resize bg-[#0a64c8]"
                      style={{ left: 'calc(100% - 3px)', top: 'calc(100% - 3px)' }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>

        <SectionBar label="Form Footer" />
        <div className="h-[26px] border border-t-0 border-[#7f7f7f] bg-white" style={{ width: form.width }} />

        <p className="mt-3 max-w-[520px] text-[11px] text-[#33475b]">
          Record Source: <strong>{form.recordSource || '(none)'}</strong>. Drop a control from the Controls
          group on the Design tab, then set its Control Source in the Property Sheet to bind it to a field.
        </p>
      </div>
    </div>
  );
};

const SectionBar: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-[18px] items-center border border-[#7f7f7f] bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] px-2 text-[11px] font-semibold text-[#333]">
    {label}
  </div>
);

const DesignControl: React.FC<{ control: FormControl }> = ({ control }) => {
  const style: React.CSSProperties = {
    fontSize: control.fontSize,
    fontWeight: control.bold ? 700 : 400,
    color: control.foreColor,
    textAlign: control.align,
  };
  if (control.kind === 'label') {
    return (
      <div className="flex h-full w-full items-center px-1" style={style}>
        {control.caption}
      </div>
    );
  }
  if (control.kind === 'button') {
    return (
      <div
        className="flex h-full w-full items-center justify-center border border-[#8a8a8a] bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0]"
        style={style}
      >
        {control.caption}
      </div>
    );
  }
  if (control.kind === 'checkbox') {
    return (
      <div className="flex h-full w-full items-center gap-1.5 px-1" style={style}>
        <span className="h-3 w-3 border border-[#8a8a8a] bg-white" />
        {control.caption}
      </div>
    );
  }
  if (control.kind === 'combobox') {
    return (
      <div className="flex h-full w-full items-center justify-between border border-[#8a8a8a] bg-white px-1" style={style}>
        <span className="truncate text-[#666]">{control.controlSource || 'Unbound'}</span>
        <span className="text-[9px]">▼</span>
      </div>
    );
  }
  return (
    <div className="flex h-full w-full items-center border border-[#8a8a8a] bg-white px-1" style={style}>
      <span className="truncate text-[#666]">{control.controlSource || 'Unbound'}</span>
    </div>
  );
};

/* -------------------------------------------------------------- Form View */

export const AccessFormRun: React.FC<{
  db: AccessDatabase;
  form: AccessForm;
  onEdit: (field: string, value: string) => void;
  onAction: (action: ButtonAction) => void;
  currentRow: number;
  onCurrentRowChange: (index: number) => void;
}> = ({ db, form, onEdit, onAction, currentRow, onCurrentRowChange }) => {
  const source = recordSourceRows(db, form.recordSource);
  const table = findTable(db, form.recordSource);
  const rows = source.rows;
  const record = rows[currentRow] || {};

  return (
    <div className="flex h-full flex-col bg-[#dfe6ee]">
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <div className="w-fit border border-[#7f7f7f] bg-white shadow-md" style={{ width: form.width }}>
          <div className="border-b border-[#d4d4d4] bg-[#f0f4f8] px-3 py-2 text-[15px] font-semibold text-[#1a1a1a]">
            {form.caption || form.name}
          </div>
          <div className="relative" style={{ height: form.detailHeight }}>
            {source.error && (
              <p className="p-3 text-[11px] text-[#8a2f31]">{source.error}</p>
            )}
            {form.controls.map((control) => {
              const bound = control.controlSource;
              const field = table?.fields.find((item) => item.name === bound);
              const value = bound ? (record[bound] as AccessValue) : null;
              return (
                <div
                  key={control.id}
                  className="absolute"
                  style={{ left: control.x, top: control.y, width: control.width, height: control.height }}
                >
                  {control.kind === 'label' && (
                    <div
                      className="flex h-full w-full items-center px-1"
                      style={{
                        fontSize: control.fontSize,
                        fontWeight: control.bold ? 700 : 400,
                        color: control.foreColor,
                        textAlign: control.align,
                      }}
                    >
                      {control.caption}
                    </div>
                  )}
                  {control.kind === 'textbox' && (
                    <input
                      value={bound ? displayValue(field, value) : ''}
                      readOnly={!bound || !table}
                      onChange={(event) => bound && onEdit(bound, event.target.value)}
                      style={{
                        fontSize: control.fontSize,
                        fontWeight: control.bold ? 700 : 400,
                        color: control.foreColor,
                        textAlign: control.align,
                      }}
                      className="h-full w-full border border-[#8a8a8a] bg-white px-1 outline-none focus:ring-1 focus:ring-[#0a64c8]"
                    />
                  )}
                  {control.kind === 'checkbox' && (
                    <label className="flex h-full w-full items-center gap-1.5 px-1" style={{ fontSize: control.fontSize }}>
                      <input
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(event) => bound && onEdit(bound, event.target.checked ? 'Yes' : 'No')}
                        className="h-3 w-3 accent-[#8a2f31]"
                      />
                      {control.caption}
                    </label>
                  )}
                  {control.kind === 'combobox' && (
                    <select
                      value={value === null || value === undefined ? '' : String(value)}
                      onChange={(event) => bound && onEdit(bound, event.target.value)}
                      className="h-full w-full border border-[#8a8a8a] bg-white px-1 outline-none"
                      style={{ fontSize: control.fontSize }}
                    >
                      <option value="">(none)</option>
                      {[...new Set(rows.map((row) => String(row[bound] ?? '')))]
                        .filter(Boolean)
                        .map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                    </select>
                  )}
                  {control.kind === 'button' && (
                    <button
                      type="button"
                      onClick={() => onAction(control.action)}
                      className="h-full w-full border border-[#8a8a8a] bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] hover:from-[#e9f0f9] hover:to-[#d4e3f5]"
                      style={{ fontSize: control.fontSize, fontWeight: control.bold ? 700 : 400 }}
                    >
                      {control.caption}
                    </button>
                  )}
                </div>
              );
            })}
            {form.controls.length === 0 && (
              <p className="p-4 text-[12px] text-[#666]">
                This form has no controls yet. Switch to Design View and add some.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[24px] shrink-0 items-center gap-1 border-t border-[#d4d4d4] bg-[#f0f0f0] px-1 text-[11px]">
        <span className="px-1">Record:</span>
        <FormNav Icon={ChevronFirst} disabled={currentRow <= 0} onClick={() => onCurrentRowChange(0)} />
        <FormNav
          Icon={ChevronLeft}
          disabled={currentRow <= 0}
          onClick={() => onCurrentRowChange(Math.max(0, currentRow - 1))}
        />
        <span className="border border-[#b5b5b5] bg-white px-2">{rows.length === 0 ? 0 : currentRow + 1}</span>
        <span className="px-1">of {rows.length}</span>
        <FormNav
          Icon={ChevronRight}
          disabled={currentRow >= rows.length - 1}
          onClick={() => onCurrentRowChange(Math.min(rows.length - 1, currentRow + 1))}
        />
        <FormNav
          Icon={ChevronLast}
          disabled={currentRow >= rows.length - 1}
          onClick={() => onCurrentRowChange(rows.length - 1)}
        />
        <FormNav Icon={Plus} disabled={!table} onClick={() => onAction('Add New Record')} />
        <span className="ml-2 flex items-center gap-1 text-[#666]">
          <Filter size={11} />
          No Filter
        </span>
        <span className="ml-auto flex items-center gap-1 pr-1 text-[#666]">
          <Search size={11} />
          Search
        </span>
      </div>
    </div>
  );
};

const FormNav: React.FC<{
  Icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  disabled?: boolean;
}> = ({ Icon, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`flex h-[18px] w-[18px] items-center justify-center rounded-sm ${
      disabled ? 'text-[#bbb]' : 'text-[#333] hover:bg-[#dcdcdc]'
    }`}
  >
    <Icon size={13} />
  </button>
);

/* -------------------------------------------------------- Property Sheet */

export const FormPropertySheet: React.FC<{
  db: AccessDatabase;
  form: AccessForm;
  onChange: (form: AccessForm) => void;
  selected: string | null;
  onDelete: (id: string) => void;
}> = ({ db, form, onChange, selected, onDelete }) => {
  const [tab, setTab] = useState<'Format' | 'Data' | 'All'>('All');
  const control = form.controls.find((item) => item.id === selected) || null;
  const fields = recordSourceFields(db, form.recordSource);

  const patch = (changes: Partial<FormControl>) => {
    if (!control) return;
    onChange({
      ...form,
      controls: form.controls.map((item) => (item.id === control.id ? { ...item, ...changes } : item)),
    });
  };

  return (
    <div className="flex h-full w-[240px] shrink-0 flex-col border-l border-[#d4d4d4] bg-[#f0f0f0] text-[11px]">
      <div className="border-b border-[#d4d4d4] bg-[#e8e8e8] px-2 py-1 font-semibold text-[#333]">
        Property Sheet
      </div>
      <div className="border-b border-[#d4d4d4] px-2 py-1 text-[#555]">
        Selection type: {control ? control.kind === 'textbox' ? 'Text Box' : control.kind === 'button' ? 'Command Button' : control.kind === 'checkbox' ? 'Check Box' : control.kind === 'combobox' ? 'Combo Box' : 'Label' : 'Form'}
      </div>
      <div className="flex gap-0 border-b border-[#d4d4d4] bg-[#e8e8e8] px-1 pt-1">
        {(['Format', 'Data', 'All'] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            className={`border border-b-0 border-[#b5b5b5] px-2 py-[2px] ${
              tab === name ? 'bg-white' : 'bg-[#dcdcdc] text-[#555]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-white">
        {!control ? (
          <PropertyTable
            rows={[
              {
                label: 'Record Source',
                control: (
                  <select
                    value={form.recordSource}
                    onChange={(event) => onChange({ ...form, recordSource: event.target.value })}
                    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                  >
                    <option value="">(none)</option>
                    {db.tables.map((table) => (
                      <option key={table.id}>{table.name}</option>
                    ))}
                    {db.queries.map((query) => (
                      <option key={query.id}>{query.name}</option>
                    ))}
                  </select>
                ),
              },
              {
                label: 'Caption',
                control: (
                  <input
                    value={form.caption}
                    onChange={(event) => onChange({ ...form, caption: event.target.value })}
                    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                  />
                ),
              },
              {
                label: 'Width',
                control: (
                  <input
                    type="number"
                    value={form.width}
                    onChange={(event) => onChange({ ...form, width: Number(event.target.value) || 480 })}
                    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                  />
                ),
              },
              {
                label: 'Detail Height',
                control: (
                  <input
                    type="number"
                    value={form.detailHeight}
                    onChange={(event) => onChange({ ...form, detailHeight: Number(event.target.value) || 240 })}
                    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                  />
                ),
              },
              { label: 'Default View', control: <ReadOnlyProperty value="Single Form" /> },
              { label: 'Allow Filters', control: <ReadOnlyProperty value="Yes" /> },
              { label: 'Pop Up', control: <ReadOnlyProperty value="No" /> },
            ]}
          />
        ) : (
          <PropertyTable
            rows={[
              {
                label: 'Name',
                control: (
                  <input
                    value={control.name}
                    onChange={(event) => patch({ name: event.target.value })}
                    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                  />
                ),
              },
              ...(tab !== 'Format'
                ? [
                    {
                      label: 'Control Source',
                      control: (
                        <select
                          value={control.controlSource}
                          onChange={(event) => patch({ controlSource: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                        >
                          <option value="">(unbound)</option>
                          {fields.map((field) => (
                            <option key={field}>{field}</option>
                          ))}
                        </select>
                      ),
                    },
                  ]
                : []),
              ...(control.kind === 'button'
                ? [
                    {
                      label: 'On Click',
                      control: (
                        <select
                          value={control.action}
                          onChange={(event) => patch({ action: event.target.value as ButtonAction })}
                          className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                        >
                          {BUTTON_ACTIONS.map((action) => (
                            <option key={action}>{action}</option>
                          ))}
                        </select>
                      ),
                    },
                  ]
                : []),
              ...(control.kind !== 'textbox' && control.kind !== 'combobox'
                ? [
                    {
                      label: 'Caption',
                      control: (
                        <input
                          value={control.caption}
                          onChange={(event) => patch({ caption: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                        />
                      ),
                    },
                  ]
                : []),
              ...(tab !== 'Data'
                ? [
                    {
                      label: 'Left',
                      control: <NumberProperty value={control.x} onChange={(value) => patch({ x: value })} />,
                    },
                    {
                      label: 'Top',
                      control: <NumberProperty value={control.y} onChange={(value) => patch({ y: value })} />,
                    },
                    {
                      label: 'Width',
                      control: <NumberProperty value={control.width} onChange={(value) => patch({ width: value })} />,
                    },
                    {
                      label: 'Height',
                      control: <NumberProperty value={control.height} onChange={(value) => patch({ height: value })} />,
                    },
                    {
                      label: 'Font Size',
                      control: (
                        <NumberProperty value={control.fontSize} onChange={(value) => patch({ fontSize: value })} />
                      ),
                    },
                    {
                      label: 'Font Weight',
                      control: (
                        <select
                          value={control.bold ? 'Bold' : 'Normal'}
                          onChange={(event) => patch({ bold: event.target.value === 'Bold' })}
                          className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                        >
                          <option>Normal</option>
                          <option>Bold</option>
                        </select>
                      ),
                    },
                    {
                      label: 'Fore Color',
                      control: (
                        <input
                          type="color"
                          value={control.foreColor}
                          onChange={(event) => patch({ foreColor: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5]"
                        />
                      ),
                    },
                    {
                      label: 'Text Align',
                      control: (
                        <select
                          value={control.align}
                          onChange={(event) => patch({ align: event.target.value as FormControl['align'] })}
                          className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
                        >
                          <option value="left">Left</option>
                          <option value="center">Center</option>
                          <option value="right">Right</option>
                        </select>
                      ),
                    },
                  ]
                : []),
              { label: 'Visible', control: <ReadOnlyProperty value="Yes" /> },
              { label: 'Enabled', control: <ReadOnlyProperty value="Yes" /> },
            ]}
          />
        )}
      </div>

      {control && (
        <button
          type="button"
          onClick={() => onDelete(control.id)}
          className="border-t border-[#d4d4d4] bg-[#f5f5f5] py-1.5 text-[11px] text-[#8a2f31] hover:bg-[#fdf0f0]"
        >
          Delete selected control
        </button>
      )}
    </div>
  );
};

const NumberProperty: React.FC<{ value: number; onChange: (value: number) => void }> = ({ value, onChange }) => (
  <input
    type="number"
    value={value}
    onChange={(event) => onChange(Number(event.target.value) || 0)}
    className="h-[19px] w-full border border-[#b5b5b5] px-1 outline-none"
  />
);

const ReadOnlyProperty: React.FC<{ value: string }> = ({ value }) => (
  <input
    value={value}
    readOnly
    disabled
    className="h-[19px] w-full border border-[#d8d8d8] bg-[#f5f5f5] px-1 text-[#a6a6a6] outline-none"
  />
);

const PropertyTable: React.FC<{ rows: Array<{ label: string; control: React.ReactNode }> }> = ({ rows }) => (
  <table className="w-full border-separate border-spacing-0">
    <tbody>
      {rows.map((row) => (
        <tr key={row.label}>
          <td className="w-[104px] border-b border-r border-[#e4e4e4] px-1.5 py-[2px] align-middle">{row.label}</td>
          <td className="border-b border-[#e4e4e4] px-1 py-[2px]">{row.control}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

import React, { useState } from 'react';
import { Key } from 'lucide-react';
import {
  AccessDataType,
  AccessField,
  AccessTable,
  DATA_TYPES,
  IndexedSetting,
  makeField,
  renameField,
} from './accessModel';

/**
 * Table Design View: the three-column grid on top, the Field Properties pane
 * below it, and the help column on the right that explains whichever property
 * has focus. Properties this lab does not act on are shown but disabled, so the
 * pane still looks like the one in the exam room.
 */

const HELP: Record<string, string> = {
  'Field Name':
    'A field name can be up to 64 characters long, including spaces. Press F1 for help on field names.',
  'Data Type': 'The data type determines the kind of values that users can store in the field.',
  Description:
    'The field description is optional. It helps you describe the field and is also displayed in the status bar when you select this field on a form.',
  'Field Size': 'The maximum number of characters you can enter in the field. The largest maximum you can set is 255.',
  Format: 'The display layout for the field. Select a pre-defined format or enter a custom format.',
  Caption: 'The label for the field when used on a form. If you don\'t enter a caption, the field name is used as the label.',
  'Default Value': 'The value that is automatically entered in this field for new records.',
  'Validation Rule': 'An expression that limits the values that can be entered in the field.',
  'Validation Text': 'The error message that appears when you enter a value prohibited by the validation rule.',
  Required: 'Require data entry in this field?',
  Indexed:
    'An index speeds up searches and sorting on the field, but may slow updates. Selecting "Yes - No Duplicates" prohibits duplicate values in the field.',
};

const FIELD_SIZES: Record<string, string[]> = {
  'Short Text': ['255', '50', '30', '20', '10', '5'],
  Number: ['Long Integer', 'Integer', 'Byte', 'Single', 'Double'],
  AutoNumber: ['Long Integer'],
};

export const AccessTableDesign: React.FC<{
  table: AccessTable;
  onChange: (table: AccessTable) => void;
  selectedField: number;
  onSelectField: (index: number) => void;
}> = ({ table, onChange, selectedField, onSelectField }) => {
  const [focusedProperty, setFocusedProperty] = useState('Field Name');
  const [tab, setTab] = useState<'General' | 'Lookup'>('General');

  const field: AccessField | undefined = table.fields[selectedField];

  const update = (index: number, patch: Partial<AccessField>) => {
    const next = { ...table, fields: table.fields.map((item) => ({ ...item })), rows: table.rows.map((row) => ({ ...row })) };
    const target = next.fields[index];
    if (!target) return;
    if (patch.name !== undefined && patch.name !== target.name) {
      renameField(next, target.name, patch.name);
    }
    if (patch.type !== undefined && patch.type !== target.type) {
      // Access resets Field Size when the data type changes.
      patch.size = FIELD_SIZES[patch.type]?.[0] ?? '';
    }
    next.fields[index] = { ...target, ...patch };
    onChange(next);
  };

  const addRow = (name: string) => {
    const next = {
      ...table,
      fields: [...table.fields, makeField(name || `Field${table.fields.length + 1}`, 'Short Text')],
    };
    onChange(next);
    onSelectField(next.fields.length - 1);
  };

  const deleteRow = (index: number) => {
    const removed = table.fields[index];
    if (!removed) return;
    if (!window.confirm(`Do you want to permanently delete the selected field(s) and all the data in the field(s)?`)) return;
    const next = {
      ...table,
      fields: table.fields.filter((_, position) => position !== index),
      rows: table.rows.map((row) => {
        const copy = { ...row };
        delete copy[removed.name];
        return copy;
      }),
    };
    onChange(next);
    onSelectField(Math.max(0, index - 1));
  };

  const togglePrimaryKey = (index: number) => {
    const next = {
      ...table,
      fields: table.fields.map((item, position) => ({
        ...item,
        primaryKey: position === index ? !item.primaryKey : false,
        indexed:
          position === index && !item.primaryKey
            ? ('Yes (No Duplicates)' as IndexedSetting)
            : item.indexed,
      })),
    };
    onChange(next);
  };

  return (
    <div className="flex h-full flex-col bg-[#f0f0f0] text-[12px] text-[#1a1a1a]">
      {/* Field grid */}
      <div className="min-h-[140px] flex-1 overflow-auto bg-white">
        <table className="w-full border-separate border-spacing-0">
          <colgroup>
            <col style={{ width: 22 }} />
            <col style={{ width: 260 }} />
            <col style={{ width: 180 }} />
            <col />
          </colgroup>
          <thead className="sticky top-0">
            <tr className="bg-gradient-to-b from-[#f5f5f5] to-[#e4e4e4]">
              <th className="h-[24px] border-b border-r border-[#b5b5b5]" />
              <th className="h-[24px] border-b border-r border-[#b5b5b5] px-2 text-left font-semibold">Field Name</th>
              <th className="h-[24px] border-b border-r border-[#b5b5b5] px-2 text-left font-semibold">Data Type</th>
              <th className="h-[24px] border-b border-[#b5b5b5] px-2 text-left font-semibold">Description (Optional)</th>
            </tr>
          </thead>
          <tbody>
            {table.fields.map((item, index) => (
              <tr
                key={item.id}
                className={index === selectedField ? 'bg-[#fdf3d1]' : 'bg-white'}
                onClick={() => onSelectField(index)}
              >
                <td
                  className="cursor-pointer border-b border-r border-[#d4d4d4] bg-[#e8e8e8] text-center align-middle"
                  onClick={() => onSelectField(index)}
                  onDoubleClick={() => togglePrimaryKey(index)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    deleteRow(index);
                  }}
                  title="Double-click to set the primary key, right-click to delete the field"
                >
                  {item.primaryKey ? (
                    <Key size={11} className="mx-auto text-[#c8a415]" />
                  ) : index === selectedField ? (
                    <span className="text-[9px] text-[#8a2f31]">▶</span>
                  ) : null}
                </td>
                <td className="border-b border-r border-[#d4d4d4] p-0">
                  <input
                    value={item.name}
                    onFocus={() => {
                      onSelectField(index);
                      setFocusedProperty('Field Name');
                    }}
                    onChange={(event) => update(index, { name: event.target.value })}
                    className="h-[22px] w-full bg-transparent px-2 outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#0a64c8]"
                  />
                </td>
                <td className="border-b border-r border-[#d4d4d4] p-0">
                  <select
                    value={item.type}
                    onFocus={() => {
                      onSelectField(index);
                      setFocusedProperty('Data Type');
                    }}
                    onChange={(event) => update(index, { type: event.target.value as AccessDataType })}
                    className="h-[22px] w-full bg-transparent px-1 outline-none focus:bg-white"
                  >
                    {DATA_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-b border-[#d4d4d4] p-0">
                  <input
                    value={item.description}
                    onFocus={() => {
                      onSelectField(index);
                      setFocusedProperty('Description');
                    }}
                    onChange={(event) => update(index, { description: event.target.value })}
                    className="h-[22px] w-full bg-transparent px-2 outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#0a64c8]"
                  />
                </td>
              </tr>
            ))}
            {/* The blank row at the bottom is how you add a field in Access. */}
            <tr>
              <td className="border-b border-r border-[#d4d4d4] bg-[#e8e8e8]" />
              <td className="border-b border-r border-[#d4d4d4] p-0">
                <input
                  value=""
                  placeholder=""
                  onChange={(event) => addRow(event.target.value)}
                  className="h-[22px] w-full bg-transparent px-2 outline-none focus:bg-white focus:ring-1 focus:ring-inset focus:ring-[#0a64c8]"
                />
              </td>
              <td className="border-b border-r border-[#d4d4d4]" />
              <td className="border-b border-[#d4d4d4]" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Field Properties */}
      <div className="flex h-[210px] shrink-0 border-t-2 border-[#b5b5b5] bg-[#f0f0f0]">
        <div className="w-[120px] shrink-0 border-r border-[#d4d4d4] bg-[#e8e8e8] px-2 pt-2 text-[11px] font-semibold text-[#333]">
          Field Properties
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex gap-0 border-b border-[#d4d4d4] bg-[#e8e8e8] px-1 pt-1">
            {(['General', 'Lookup'] as const).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setTab(name)}
                className={`border border-b-0 border-[#b5b5b5] px-3 py-[2px] text-[11px] ${
                  tab === name ? 'bg-white' : 'bg-[#dcdcdc] text-[#555]'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-auto bg-white">
              {!field ? (
                <p className="p-3 text-[11px] text-[#666]">Select a field to see its properties.</p>
              ) : tab === 'Lookup' ? (
                <PropertyRows
                  rows={[
                    { label: 'Display Control', control: <DisabledValue value={field.type === 'Yes/No' ? 'Check Box' : 'Text Box'} /> },
                  ]}
                  onFocusProperty={setFocusedProperty}
                />
              ) : (
                <PropertyRows
                  onFocusProperty={setFocusedProperty}
                  rows={[
                    {
                      label: 'Field Size',
                      control: FIELD_SIZES[field.type] ? (
                        <select
                          value={field.size}
                          onChange={(event) => update(selectedField, { size: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        >
                          {FIELD_SIZES[field.type].map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <DisabledValue value="" />
                      ),
                    },
                    {
                      label: 'Format',
                      control: (
                        <input
                          value={field.format}
                          onChange={(event) => update(selectedField, { format: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        />
                      ),
                    },
                    { label: 'Input Mask', control: <DisabledValue value="" /> },
                    {
                      label: 'Caption',
                      control: (
                        <input
                          value={field.caption}
                          onChange={(event) => update(selectedField, { caption: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        />
                      ),
                    },
                    {
                      label: 'Default Value',
                      control: (
                        <input
                          value={field.defaultValue}
                          onChange={(event) => update(selectedField, { defaultValue: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        />
                      ),
                    },
                    {
                      label: 'Validation Rule',
                      control: (
                        <input
                          value={field.validationRule}
                          onChange={(event) => update(selectedField, { validationRule: event.target.value })}
                          placeholder="e.g. Between 0 And 100"
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none placeholder:text-[#bbb]"
                        />
                      ),
                    },
                    {
                      label: 'Validation Text',
                      control: (
                        <input
                          value={field.validationText}
                          onChange={(event) => update(selectedField, { validationText: event.target.value })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        />
                      ),
                    },
                    {
                      label: 'Required',
                      control: (
                        <select
                          value={field.required ? 'Yes' : 'No'}
                          onChange={(event) => update(selectedField, { required: event.target.value === 'Yes' })}
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        >
                          <option>No</option>
                          <option>Yes</option>
                        </select>
                      ),
                    },
                    {
                      label: 'Indexed',
                      control: (
                        <select
                          value={field.indexed}
                          onChange={(event) =>
                            update(selectedField, { indexed: event.target.value as IndexedSetting })
                          }
                          className="h-[19px] w-full border border-[#b5b5b5] bg-white px-1 outline-none"
                        >
                          <option>No</option>
                          <option>Yes (Duplicates OK)</option>
                          <option>Yes (No Duplicates)</option>
                        </select>
                      ),
                    },
                    { label: 'Unicode Compression', control: <DisabledValue value="Yes" /> },
                    { label: 'IME Mode', control: <DisabledValue value="No Control" /> },
                    { label: 'Text Align', control: <DisabledValue value="General" /> },
                  ]}
                />
              )}
            </div>

            <div className="w-[240px] shrink-0 border-l border-[#d4d4d4] bg-[#f0f0f0] p-3 text-[11px] leading-snug text-[#333]">
              {HELP[focusedProperty] || HELP['Field Name']}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DisabledValue: React.FC<{ value: string }> = ({ value }) => (
  <input
    value={value}
    readOnly
    disabled
    className="h-[19px] w-full border border-[#d8d8d8] bg-[#f5f5f5] px-1 text-[#a6a6a6] outline-none"
  />
);

const PropertyRows: React.FC<{
  rows: Array<{ label: string; control: React.ReactNode }>;
  onFocusProperty: (label: string) => void;
}> = ({ rows, onFocusProperty }) => (
  <table className="w-full border-separate border-spacing-0 text-[11px]">
    <tbody>
      {rows.map((row) => (
        <tr key={row.label} onFocus={() => onFocusProperty(row.label)} onMouseEnter={() => onFocusProperty(row.label)}>
          <td className="w-[150px] border-b border-r border-[#e4e4e4] px-2 py-[2px] align-middle">{row.label}</td>
          <td className="border-b border-[#e4e4e4] px-1 py-[2px]">{row.control}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Filter, Pencil, Plus, Search } from 'lucide-react';
import { AccessField, AccessRow, AccessValue, displayValue } from './accessModel';

/**
 * The datasheet. Access uses the same grid for a table, a query's results and a
 * form in Datasheet View, so this one component serves all three: pass
 * `editable={false}` and it becomes the read-only result sheet a query opens
 * in.
 */

export interface DatasheetColumn {
  name: string;
  field?: AccessField;
  width: number;
}

interface Props {
  columns: DatasheetColumn[];
  rows: AccessRow[];
  editable: boolean;
  /** Returns an error message to refuse the edit, or null to accept it. */
  onCommit?: (rowIndex: number, column: string, text: string) => string | null;
  onNewRow?: () => void;
  onDeleteRow?: (rowIndex: number) => void;
  onColumnResize?: (column: string, width: number) => void;
  onSort?: (column: string, direction: 'Ascending' | 'Descending') => void;
  currentRow: number;
  onCurrentRowChange: (index: number) => void;
  /** Shown centred when there is nothing to display. */
  emptyMessage?: string;
}

export const AccessDatasheet: React.FC<Props> = ({
  columns,
  rows,
  editable,
  onCommit,
  onNewRow,
  onDeleteRow,
  onColumnResize,
  onSort,
  currentRow,
  onCurrentRowChange,
  emptyMessage,
}) => {
  const [editing, setEditing] = useState<{ row: number; column: string } | null>(null);
  const [draft, setDraft] = useState('');
  const [selection, setSelection] = useState<{ row: number; column: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [headerMenu, setHeaderMenu] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resizing = useRef<{ column: string; startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!resizing.current || !onColumnResize) return;
      const next = Math.max(40, resizing.current.startWidth + event.clientX - resizing.current.startX);
      onColumnResize(resizing.current.column, next);
    };
    const onUp = () => {
      resizing.current = null;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [onColumnResize]);

  const beginEdit = (rowIndex: number, column: DatasheetColumn, initial?: string) => {
    if (!editable || !onCommit) return;
    if (column.field?.type === 'AutoNumber') return;
    const value = rows[rowIndex]?.[column.name];
    setEditing({ row: rowIndex, column: column.name });
    setDraft(initial ?? (value === null || value === undefined ? '' : String(value)));
  };

  const commit = () => {
    if (!editing || !onCommit) return;
    const message = onCommit(editing.row, editing.column, draft);
    setError(message);
    if (!message) setEditing(null);
  };

  const cancel = () => {
    setEditing(null);
    setError(null);
  };

  const matchedRows = useMemo(() => {
    if (!search.trim()) return null;
    const needle = search.trim().toLowerCase();
    return new Set(
      rows
        .map((row, index) =>
          columns.some((column) =>
            displayValue(column.field, row[column.name]).toLowerCase().includes(needle)
          )
            ? index
            : -1
        )
        .filter((index) => index >= 0)
    );
  }, [search, rows, columns]);

  const totalWidth = columns.reduce((sum, column) => sum + column.width, 0) + 24;

  return (
    <div className="flex h-full flex-col bg-white text-[#1a1a1a]">
      <div className="min-h-0 flex-1 overflow-auto" onClick={() => setHeaderMenu(null)}>
        <table
          className="border-separate border-spacing-0 text-[12px]"
          style={{ width: Math.max(totalWidth, 100), tableLayout: 'fixed' }}
        >
          <colgroup>
            <col style={{ width: 24 }} />
            {columns.map((column) => (
              <col key={column.name} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="h-[24px] border-b border-r border-[#b5b5b5] bg-[#e8e8e8]" />
              {columns.map((column) => (
                <th
                  key={column.name}
                  className="relative h-[24px] border-b border-r border-[#b5b5b5] bg-gradient-to-b from-[#f5f5f5] to-[#e4e4e4] px-1.5 text-left align-middle font-semibold"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-1 truncate text-left"
                    onClick={(event) => {
                      event.stopPropagation();
                      setHeaderMenu(headerMenu === column.name ? null : column.name);
                    }}
                  >
                    <span className="truncate">{column.field?.caption || column.name}</span>
                    <ChevronDown size={11} className="shrink-0 text-[#666]" />
                  </button>
                  <span
                    role="presentation"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      resizing.current = {
                        column: column.name,
                        startX: event.clientX,
                        startWidth: column.width,
                      };
                    }}
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize"
                  />
                  {headerMenu === column.name && (
                    <div
                      className="absolute left-0 top-full z-30 w-44 border border-[#b5b5b5] bg-white py-1 text-[11px] font-normal shadow-lg"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left hover:bg-[#e9f0f9]"
                        onClick={() => {
                          onSort?.(column.name, 'Ascending');
                          setHeaderMenu(null);
                        }}
                        disabled={!onSort}
                      >
                        Sort A to Z
                      </button>
                      <button
                        type="button"
                        className="block w-full px-3 py-1 text-left hover:bg-[#e9f0f9]"
                        onClick={() => {
                          onSort?.(column.name, 'Descending');
                          setHeaderMenu(null);
                        }}
                        disabled={!onSort}
                      >
                        Sort Z to A
                      </button>
                      <div className="my-1 border-t border-[#e0e0e0]" />
                      <span className="block px-3 py-1 text-[#a6a6a6]">Text Filters</span>
                      <span className="block px-3 py-1 text-[#a6a6a6]">Clear filter from field</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isCurrent = rowIndex === currentRow;
              const isMatch = matchedRows?.has(rowIndex);
              return (
                <tr
                  key={rowIndex}
                  className={isCurrent ? 'bg-[#fdf3d1]' : rowIndex % 2 === 1 ? 'bg-[#f5f5f5]' : 'bg-white'}
                >
                  <td
                    className="cursor-pointer border-b border-r border-[#d4d4d4] bg-[#e8e8e8] text-center align-middle"
                    onClick={() => onCurrentRowChange(rowIndex)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      if (editable && onDeleteRow && window.confirm('You are about to delete 1 record.\n\nAre you sure you want to delete these records?')) {
                        onDeleteRow(rowIndex);
                      }
                    }}
                    title={editable ? 'Right-click to delete this record' : undefined}
                  >
                    {editing?.row === rowIndex ? (
                      <Pencil size={10} className="mx-auto text-[#8a2f31]" />
                    ) : isCurrent ? (
                      <span className="text-[9px] text-[#8a2f31]">▶</span>
                    ) : null}
                  </td>
                  {columns.map((column) => {
                    const isEditing = editing?.row === rowIndex && editing.column === column.name;
                    const isSelected =
                      selection?.row === rowIndex && selection.column === column.name;
                    const value = row[column.name];
                    return (
                      <td
                        key={column.name}
                        className={`h-[22px] overflow-hidden border-b border-r border-[#d4d4d4] px-1.5 align-middle ${
                          isSelected && !isEditing ? 'bg-[#0a64c8] text-white' : ''
                        } ${isMatch ? 'ring-1 ring-inset ring-amber-400' : ''}`}
                        onClick={() => {
                          setSelection({ row: rowIndex, column: column.name });
                          onCurrentRowChange(rowIndex);
                        }}
                        onDoubleClick={() => beginEdit(rowIndex, column)}
                        onKeyDown={(event) => {
                          if (isEditing) return;
                          if (event.key === 'F2' || event.key === 'Enter') {
                            beginEdit(rowIndex, column);
                          } else if (event.key.length === 1) {
                            beginEdit(rowIndex, column, event.key);
                          } else if (event.key === 'Delete' && editable && onCommit) {
                            onCommit(rowIndex, column.name, '');
                          }
                        }}
                        tabIndex={0}
                      >
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            value={draft}
                            onChange={(event) => setDraft(event.target.value)}
                            onBlur={commit}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') commit();
                              if (event.key === 'Escape') cancel();
                            }}
                            className="h-[20px] w-full border border-[#0a64c8] px-0.5 text-[12px] outline-none"
                          />
                        ) : column.field?.type === 'Yes/No' ? (
                          <input
                            type="checkbox"
                            checked={Boolean(value)}
                            disabled={!editable}
                            onChange={(event) =>
                              onCommit?.(rowIndex, column.name, event.target.checked ? 'Yes' : 'No')
                            }
                            className="h-3 w-3 accent-[#8a2f31]"
                          />
                        ) : (
                          <span
                            className={`block truncate ${
                              column.field?.type === 'Number' ||
                              column.field?.type === 'Currency' ||
                              column.field?.type === 'AutoNumber'
                                ? 'text-right'
                                : ''
                            }`}
                          >
                            {displayValue(column.field, value as AccessValue)}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {editable && onNewRow && (
              <tr className="bg-white">
                <td className="border-b border-r border-[#d4d4d4] bg-[#e8e8e8] text-center align-middle text-[10px] text-[#8a2f31]">
                  *
                </td>
                {columns.map((column, index) => (
                  <td
                    key={column.name}
                    className="h-[22px] cursor-text border-b border-r border-[#d4d4d4] px-1.5 align-middle text-[#999]"
                    onClick={onNewRow}
                  >
                    {index === 0 && columns.length > 0 ? (
                      <span className="text-[11px] italic">(New)</span>
                    ) : null}
                  </td>
                ))}
              </tr>
            )}

            {rows.length === 0 && !editable && (
              <tr>
                <td colSpan={columns.length + 1} className="p-6 text-center text-[12px] text-[#666]">
                  {emptyMessage || 'The query returned no records.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {columns.length === 0 && (
          <div className="p-8 text-center text-[12px] text-[#666]">
            {emptyMessage || 'There are no fields to show.'}
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 border-t border-[#e0b4b4] bg-[#fdf0f0] px-3 py-1.5 text-[11px] text-[#8a2f31]">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="font-semibold underline">
            OK
          </button>
        </div>
      )}

      {/* Record navigator, exactly the strip along the bottom of a datasheet */}
      <div className="flex h-[24px] shrink-0 items-center gap-1 border-t border-[#d4d4d4] bg-[#f0f0f0] px-1 text-[11px]">
        <span className="px-1">Record:</span>
        <NavButton
          Icon={ChevronFirst}
          onClick={() => onCurrentRowChange(0)}
          disabled={currentRow <= 0 || rows.length === 0}
        />
        <NavButton
          Icon={ChevronLeft}
          onClick={() => onCurrentRowChange(Math.max(0, currentRow - 1))}
          disabled={currentRow <= 0 || rows.length === 0}
        />
        <input
          value={rows.length === 0 ? 0 : currentRow + 1}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onCurrentRowChange(Math.min(rows.length - 1, Math.max(0, next - 1)));
          }}
          className="h-[17px] w-9 border border-[#b5b5b5] bg-white px-1 text-center"
        />
        <span className="px-1">of {rows.length}</span>
        <NavButton
          Icon={ChevronRight}
          onClick={() => onCurrentRowChange(Math.min(rows.length - 1, currentRow + 1))}
          disabled={currentRow >= rows.length - 1 || rows.length === 0}
        />
        <NavButton
          Icon={ChevronLast}
          onClick={() => onCurrentRowChange(rows.length - 1)}
          disabled={currentRow >= rows.length - 1 || rows.length === 0}
        />
        <NavButton Icon={Plus} onClick={() => onNewRow?.()} disabled={!editable || !onNewRow} />

        <span className="ml-2 flex items-center gap-1 text-[#666]">
          <Filter size={11} />
          No Filter
        </span>

        <span className="ml-auto flex items-center gap-1 pr-1">
          <Search size={11} className="text-[#666]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="h-[17px] w-32 border border-[#b5b5b5] bg-white px-1"
          />
        </span>
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  Icon: React.ComponentType<{ size?: number; className?: string }>;
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

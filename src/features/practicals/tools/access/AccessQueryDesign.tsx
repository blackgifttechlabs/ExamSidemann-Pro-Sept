import React, { useMemo, useRef, useState } from 'react';
import { Key, X } from 'lucide-react';
import {
  AccessDatabase,
  AccessQuery,
  findTable,
  newId,
  QueryColumn,
} from './accessModel';
import { buildQuerySql } from './accessSql';

/**
 * Query Design View. The top pane holds the field lists you drag tables into,
 * with join lines drawn between them; the bottom pane is the QBE grid —
 * Field, Table, Sort, Show, Criteria, or — that Access turns into SQL.
 *
 * Double-clicking a field adds it to the next free column, dragging a field
 * onto a field in another list creates the join, and both are reflected in the
 * SQL view straight away.
 */

const BOX_WIDTH = 168;
const ROW_HEIGHT = 16;
const HEADER_HEIGHT = 20;

export const AccessQueryDesign: React.FC<{
  db: AccessDatabase;
  query: AccessQuery;
  onChange: (query: AccessQuery) => void;
  onShowTable: () => void;
}> = ({ db, query, onChange, onShowTable }) => {
  const paneRef = useRef<HTMLDivElement>(null);
  const dragBox = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [joinDrag, setJoinDrag] = useState<{
    table: string;
    field: string;
    x: number;
    y: number;
  } | null>(null);

  const columns = query.columns;

  const setColumns = (next: QueryColumn[]) =>
    onChange({ ...query, columns: next, sqlEdited: false });

  const addColumn = (table: string, field: string) => {
    const blank = columns.findIndex((column) => column.field.trim() === '');
    const entry: QueryColumn = {
      id: newId('col'),
      field,
      table,
      sort: '',
      show: true,
      criteria: '',
      or: '',
    };
    if (blank >= 0) {
      setColumns(columns.map((column, index) => (index === blank ? entry : column)));
    } else {
      setColumns([...columns, entry]);
    }
  };

  const updateColumn = (index: number, patch: Partial<QueryColumn>) =>
    setColumns(columns.map((column, position) => (position === index ? { ...column, ...patch } : column)));

  const removeColumn = (index: number) =>
    setColumns(columns.filter((_, position) => position !== index));

  const removeSource = (id: string) => {
    const source = query.sources.find((item) => item.id === id);
    if (!source) return;
    onChange({
      ...query,
      sources: query.sources.filter((item) => item.id !== id),
      joins: query.joins.filter(
        (join) => join.leftTable !== source.table && join.rightTable !== source.table
      ),
      columns: query.columns.filter((column) => column.table !== source.table),
      sqlEdited: false,
    });
  };

  const addJoin = (leftTable: string, leftField: string, rightTable: string, rightField: string) => {
    if (leftTable === rightTable) return;
    const exists = query.joins.some(
      (join) =>
        (join.leftTable === leftTable && join.rightTable === rightTable) ||
        (join.leftTable === rightTable && join.rightTable === leftTable)
    );
    if (exists) return;
    onChange({
      ...query,
      joins: [...query.joins, { id: newId('join'), leftTable, leftField, rightTable, rightField }],
      sqlEdited: false,
    });
  };

  // Join line endpoints, worked out from where each field sits in its box.
  const joinLines = useMemo(() => {
    const positionOf = (tableName: string, fieldName: string) => {
      const source = query.sources.find((item) => item.table === tableName);
      const table = findTable(db, tableName);
      if (!source || !table) return null;
      const index = table.fields.findIndex((field) => field.name === fieldName);
      const y = source.y + HEADER_HEIGHT + ROW_HEIGHT * (index + 1) + ROW_HEIGHT / 2;
      return { left: source.x, right: source.x + BOX_WIDTH, y };
    };

    return query.joins
      .map((join) => {
        const from = positionOf(join.leftTable, join.leftField);
        const to = positionOf(join.rightTable, join.rightField);
        if (!from || !to) return null;
        const leftFirst = from.right <= to.left || from.left < to.left;
        return {
          id: join.id,
          x1: leftFirst ? from.right : from.left,
          y1: from.y,
          x2: leftFirst ? to.left : to.right,
          y2: to.y,
        };
      })
      .filter(Boolean) as Array<{ id: string; x1: number; y1: number; x2: number; y2: number }>;
  }, [query.joins, query.sources, db]);

  return (
    <div className="flex h-full flex-col bg-[#f0f0f0] text-[12px] text-[#1a1a1a]">
      {/* Field lists */}
      <div
        ref={paneRef}
        className="relative min-h-[150px] flex-1 overflow-auto bg-[#b8c8d8]"
        onMouseMove={(event) => {
          const bounds = paneRef.current?.getBoundingClientRect();
          if (!bounds) return;
          if (dragBox.current) {
            const { id, offsetX, offsetY } = dragBox.current;
            const x = Math.max(4, event.clientX - bounds.left - offsetX);
            const y = Math.max(4, event.clientY - bounds.top - offsetY);
            onChange({
              ...query,
              sources: query.sources.map((source) => (source.id === id ? { ...source, x, y } : source)),
            });
          }
          if (joinDrag) {
            setJoinDrag({
              ...joinDrag,
              x: event.clientX - bounds.left,
              y: event.clientY - bounds.top,
            });
          }
        }}
        onMouseUp={() => {
          dragBox.current = null;
          setJoinDrag(null);
        }}
        onMouseLeave={() => {
          dragBox.current = null;
        }}
        onDoubleClick={(event) => {
          if (event.target === event.currentTarget) onShowTable();
        }}
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {joinLines.map((line) => (
            <g key={line.id}>
              <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke="#333" strokeWidth={1} />
              <rect
                x={(line.x1 + line.x2) / 2 - 4}
                y={(line.y1 + line.y2) / 2 - 4}
                width={8}
                height={8}
                fill="#fff"
                stroke="#333"
              />
            </g>
          ))}
          {joinDrag && <line x1={joinDrag.x} y1={joinDrag.y} x2={joinDrag.x} y2={joinDrag.y} stroke="#333" />}
        </svg>

        {query.sources.length === 0 && (
          <button
            type="button"
            onClick={onShowTable}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-[#8a9aaa] bg-white/85 px-4 py-2 text-[11px] text-[#333] shadow"
          >
            Double-click here, or use Show Table, to add a table to the query.
          </button>
        )}

        {query.sources.map((source) => {
          const table = findTable(db, source.table);
          if (!table) return null;
          return (
            <div
              key={source.id}
              className="absolute border border-[#7f7f7f] bg-white shadow-sm"
              style={{ left: source.x, top: source.y, width: BOX_WIDTH }}
            >
              <div
                className="flex cursor-move items-center justify-between bg-gradient-to-b from-[#e4e4e4] to-[#d0d0d0] px-1.5 text-[11px] font-semibold"
                style={{ height: HEADER_HEIGHT }}
                onMouseDown={(event) => {
                  const bounds = paneRef.current?.getBoundingClientRect();
                  if (!bounds) return;
                  dragBox.current = {
                    id: source.id,
                    offsetX: event.clientX - bounds.left - source.x,
                    offsetY: event.clientY - bounds.top - source.y,
                  };
                }}
              >
                <span className="truncate">{table.name}</span>
                <button
                  type="button"
                  onClick={() => removeSource(source.id)}
                  className="text-[#666] hover:text-[#8a2f31]"
                  title="Remove table from query"
                >
                  <X size={11} />
                </button>
              </div>
              <ul className="max-h-[190px] overflow-auto py-[1px] text-[11px]">
                <li
                  className="flex cursor-pointer items-center px-1.5 hover:bg-[#e9f0f9]"
                  style={{ height: ROW_HEIGHT }}
                  onDoubleClick={() => addColumn(table.name, '*')}
                >
                  *
                </li>
                {table.fields.map((field) => (
                  <li
                    key={field.id}
                    className="flex cursor-pointer select-none items-center gap-1 px-1.5 hover:bg-[#e9f0f9]"
                    style={{ height: ROW_HEIGHT }}
                    onDoubleClick={() => addColumn(table.name, field.name)}
                    onMouseDown={(event) => {
                      const bounds = paneRef.current?.getBoundingClientRect();
                      if (!bounds) return;
                      setJoinDrag({
                        table: table.name,
                        field: field.name,
                        x: event.clientX - bounds.left,
                        y: event.clientY - bounds.top,
                      });
                    }}
                    onMouseUp={() => {
                      if (joinDrag && joinDrag.table !== table.name) {
                        addJoin(joinDrag.table, joinDrag.field, table.name, field.name);
                      }
                      setJoinDrag(null);
                    }}
                    title="Double-click to add to the grid, or drag onto a field in another table to join them"
                  >
                    {field.primaryKey && <Key size={9} className="shrink-0 text-[#c8a415]" />}
                    <span className={`truncate ${field.primaryKey ? 'font-semibold' : ''}`}>{field.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* QBE grid */}
      <div className="h-[196px] shrink-0 overflow-auto border-t-2 border-[#8a8a8a] bg-[#d4d0c8]">
        <table className="border-separate border-spacing-0 text-[11px]">
          <colgroup>
            <col style={{ width: 74 }} />
            {columns.map((column) => (
              <col key={column.id} style={{ width: 148 }} />
            ))}
            <col style={{ width: 148 }} />
          </colgroup>
          <tbody>
            {(
              [
                ['Field:', 'field'],
                ['Table:', 'table'],
                ['Sort:', 'sort'],
                ['Show:', 'show'],
                ['Criteria:', 'criteria'],
                ['or:', 'or'],
              ] as Array<[string, keyof QueryColumn | 'show']>
            ).map(([label, key]) => (
              <tr key={label}>
                <th className="h-[22px] border-b border-r border-[#8a8a8a] bg-[#d4d0c8] px-1 text-left font-semibold">
                  {label}
                </th>
                {columns.map((column, index) => (
                  <td key={column.id} className="h-[22px] border-b border-r border-[#8a8a8a] bg-white p-0">
                    {key === 'field' && (
                      <select
                        value={column.field}
                        onChange={(event) => {
                          if (event.target.value === '') removeColumn(index);
                          else updateColumn(index, { field: event.target.value });
                        }}
                        className="h-[21px] w-full bg-transparent px-1 outline-none"
                      >
                        <option value="">{'(remove)'}</option>
                        {(findTable(db, column.table)?.fields || []).map((field) => (
                          <option key={field.id} value={field.name}>
                            {field.name}
                          </option>
                        ))}
                        <option value="*">*</option>
                      </select>
                    )}
                    {key === 'table' && (
                      <select
                        value={column.table}
                        onChange={(event) => updateColumn(index, { table: event.target.value, field: '' })}
                        className="h-[21px] w-full bg-transparent px-1 outline-none"
                      >
                        {query.sources.map((source) => (
                          <option key={source.id} value={source.table}>
                            {source.table}
                          </option>
                        ))}
                      </select>
                    )}
                    {key === 'sort' && (
                      <select
                        value={column.sort}
                        onChange={(event) =>
                          updateColumn(index, { sort: event.target.value as QueryColumn['sort'] })
                        }
                        className="h-[21px] w-full bg-transparent px-1 outline-none"
                      >
                        <option value="">(not sorted)</option>
                        <option value="Ascending">Ascending</option>
                        <option value="Descending">Descending</option>
                      </select>
                    )}
                    {key === 'show' && (
                      <div className="flex h-[21px] items-center justify-center">
                        <input
                          type="checkbox"
                          checked={column.show}
                          onChange={(event) => updateColumn(index, { show: event.target.checked })}
                          className="h-3 w-3 accent-[#8a2f31]"
                        />
                      </div>
                    )}
                    {(key === 'criteria' || key === 'or') && (
                      <input
                        value={key === 'criteria' ? column.criteria : column.or}
                        onChange={(event) =>
                          updateColumn(index, key === 'criteria'
                            ? { criteria: event.target.value }
                            : { or: event.target.value })
                        }
                        placeholder={key === 'criteria' && index === 0 ? 'e.g. >=50' : ''}
                        className="h-[21px] w-full bg-transparent px-1 outline-none placeholder:text-[#c4c4c4]"
                      />
                    )}
                  </td>
                ))}
                <td className="h-[22px] border-b border-r border-[#8a8a8a] bg-white p-0">
                  {key === 'field' && query.sources.length > 0 && (
                    <select
                      value=""
                      onChange={(event) => {
                        const [table, field] = event.target.value.split('|');
                        if (table && field) addColumn(table, field);
                      }}
                      className="h-[21px] w-full bg-transparent px-1 text-[#666] outline-none"
                    >
                      <option value="">(add a field)</option>
                      {query.sources.map((source) => {
                        const table = findTable(db, source.table);
                        if (!table) return null;
                        return (
                          <optgroup key={source.id} label={table.name}>
                            {table.fields.map((field) => (
                              <option key={field.id} value={`${table.name}|${field.name}`}>
                                {field.name}
                              </option>
                            ))}
                          </optgroup>
                        );
                      })}
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {/* Access keeps a couple of empty criteria rows below "or:" */}
            {[0, 1].map((row) => (
              <tr key={`spare-${row}`}>
                <th className="h-[22px] border-b border-r border-[#8a8a8a] bg-[#d4d0c8]" />
                {columns.map((column) => (
                  <td key={column.id} className="h-[22px] border-b border-r border-[#8a8a8a] bg-white" />
                ))}
                <td className="h-[22px] border-b border-r border-[#8a8a8a] bg-white" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/** SQL View: the statement the grid produced, editable in place. */
export const AccessQuerySqlView: React.FC<{
  query: AccessQuery;
  onChange: (query: AccessQuery) => void;
}> = ({ query, onChange }) => {
  const value = query.sqlEdited && query.sql ? query.sql : buildQuerySql(query);
  return (
    <div className="flex h-full flex-col bg-white">
      <textarea
        value={value}
        spellCheck={false}
        onChange={(event) => onChange({ ...query, sql: event.target.value, sqlEdited: true })}
        className="h-full w-full resize-none p-3 font-mono text-[12px] leading-relaxed text-[#1a1a1a] outline-none"
      />
      {query.sqlEdited && (
        <div className="flex items-center justify-between border-t border-[#d4d4d4] bg-[#fff8e1] px-3 py-1 text-[11px] text-[#7a5c00]">
          <span>This query is now driven by the SQL above; the design grid no longer writes it.</span>
          <button
            type="button"
            onClick={() => onChange({ ...query, sqlEdited: false, sql: '' })}
            className="font-semibold underline"
          >
            Go back to the design grid
          </button>
        </div>
      )}
    </div>
  );
};

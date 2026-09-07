import React from 'react';
import { AccessDatabase, AccessReport, AccessValue, findTable, newId } from './accessModel';
import { recordSourceFields, recordSourceRows } from './accessSql';

/**
 * Reports. The Report button builds a tabular report over whatever is selected
 * in the navigation pane, and Print Preview lays it out on an A4 page with the
 * page header, the date and the "Page 1 of 1" footer Access prints.
 *
 * Grouping is one level deep — that is what the syllabus asks for, and a second
 * level would need a designer this lab does not have room for.
 */

export const makeReport = (db: AccessDatabase, name: string, recordSource: string): AccessReport => ({
  id: newId('rpt'),
  name,
  recordSource,
  title: recordSource,
  columns: recordSourceFields(db, recordSource)
    .slice(0, 8)
    .map((field) => ({ id: newId('rcol'), field, width: 120 })),
  groupBy: '',
  sortBy: '',
  sortDirection: 'Ascending',
});

const formatCell = (value: AccessValue) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

export const AccessReportView: React.FC<{
  db: AccessDatabase;
  report: AccessReport;
  onChange: (report: AccessReport) => void;
  mode: 'report' | 'preview' | 'design';
}> = ({ db, report, onChange, mode }) => {
  const source = recordSourceRows(db, report.recordSource);
  const fields = recordSourceFields(db, report.recordSource);
  const table = findTable(db, report.recordSource);

  const rows = [...source.rows];
  if (report.sortBy) {
    rows.sort((left, right) => {
      const a = left[report.sortBy];
      const b = right[report.sortBy];
      const compare =
        typeof a === 'number' && typeof b === 'number'
          ? a - b
          : String(a ?? '').localeCompare(String(b ?? ''));
      return report.sortDirection === 'Descending' ? -compare : compare;
    });
  }

  const groups = report.groupBy
    ? [...new Set(rows.map((row) => formatCell(row[report.groupBy])))].map((key) => ({
        key,
        rows: rows.filter((row) => formatCell(row[report.groupBy]) === key),
      }))
    : [{ key: '', rows }];

  const today = new Date();
  const printedOn = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  if (mode === 'design') {
    return (
      <div className="h-full overflow-auto bg-[#b8c8d8] p-4 text-[12px]">
        <div className="w-fit min-w-full space-y-0">
          <SectionBar label="Report Header" />
          <Band>
            <input
              value={report.title}
              onChange={(event) => onChange({ ...report, title: event.target.value })}
              className="w-[320px] border border-dashed border-[#8a8a8a] px-1 py-0.5 text-[16px] font-semibold outline-none"
            />
          </Band>

          <SectionBar label="Page Header" />
          <Band>
            <div className="flex gap-1">
              {report.columns.map((column) => (
                <span
                  key={column.id}
                  className="border border-dashed border-[#8a8a8a] px-1 text-[11px] font-semibold"
                  style={{ width: column.width }}
                >
                  {column.field}
                </span>
              ))}
            </div>
          </Band>

          <SectionBar label="Detail" />
          <Band>
            <div className="flex gap-1">
              {report.columns.map((column) => (
                <span
                  key={column.id}
                  className="border border-dashed border-[#8a8a8a] px-1 text-[11px] text-[#666]"
                  style={{ width: column.width }}
                >
                  ={column.field}
                </span>
              ))}
            </div>
          </Band>

          <SectionBar label="Page Footer" />
          <Band>
            <span className="text-[11px] text-[#666]">=&quot;Page &quot; &amp; [Page] &amp; &quot; of &quot; &amp; [Pages]</span>
          </Band>

          <div className="mt-4 max-w-[420px] space-y-2 rounded border border-[#8a9aaa] bg-white/85 p-3">
            <p className="text-[11px] font-semibold text-[#333]">Group, Sort, and Total</p>
            <label className="flex items-center gap-2 text-[11px]">
              <span className="w-16">Group on</span>
              <select
                value={report.groupBy}
                onChange={(event) => onChange({ ...report, groupBy: event.target.value })}
                className="h-[20px] flex-1 border border-[#b5b5b5] px-1 outline-none"
              >
                <option value="">(no grouping)</option>
                {fields.map((field) => (
                  <option key={field}>{field}</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-[11px]">
              <span className="w-16">Sort by</span>
              <select
                value={report.sortBy}
                onChange={(event) => onChange({ ...report, sortBy: event.target.value })}
                className="h-[20px] flex-1 border border-[#b5b5b5] px-1 outline-none"
              >
                <option value="">(no sort)</option>
                {fields.map((field) => (
                  <option key={field}>{field}</option>
                ))}
              </select>
              <select
                value={report.sortDirection}
                onChange={(event) =>
                  onChange({ ...report, sortDirection: event.target.value as AccessReport['sortDirection'] })
                }
                className="h-[20px] border border-[#b5b5b5] px-1 outline-none"
              >
                <option>Ascending</option>
                <option>Descending</option>
              </select>
            </label>
            <div className="space-y-1 pt-1">
              <p className="text-[11px] font-semibold text-[#333]">Fields on the report</p>
              <div className="flex flex-wrap gap-1">
                {fields.map((field) => {
                  const on = report.columns.some((column) => column.field === field);
                  return (
                    <button
                      key={field}
                      type="button"
                      onClick={() =>
                        onChange({
                          ...report,
                          columns: on
                            ? report.columns.filter((column) => column.field !== field)
                            : [...report.columns, { id: newId('rcol'), field, width: 120 }],
                        })
                      }
                      className={`rounded border px-1.5 py-0.5 text-[10px] ${
                        on
                          ? 'border-[#8a2f31] bg-[#f6e6e6] text-[#8a2f31]'
                          : 'border-[#b5b5b5] bg-white text-[#555]'
                      }`}
                    >
                      {field}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const page = (
    <div
      className={`mx-auto bg-white text-[#1a1a1a] shadow-lg ${mode === 'preview' ? 'my-6 w-[794px] px-12 py-10' : 'w-full px-8 py-6'}`}
      style={mode === 'preview' ? { minHeight: 1123 } : undefined}
    >
      <div className="flex items-end justify-between border-b-2 border-[#333] pb-1">
        <h1 className="text-[22px] font-semibold">{report.title || report.name}</h1>
        <span className="text-[11px] text-[#555]">{printedOn}</span>
      </div>

      {source.error && <p className="mt-3 text-[12px] text-[#8a2f31]">{source.error}</p>}

      {groups.map((group) => (
        <div key={group.key || 'all'} className="mt-4">
          {report.groupBy && (
            <p className="mb-1 border-b border-[#999] pb-0.5 text-[13px] font-semibold">
              {report.groupBy}: {group.key || '(blank)'}
            </p>
          )}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-[#333]">
                {report.columns.map((column) => (
                  <th key={column.id} className="px-1 py-1 text-left font-semibold">
                    {column.field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {group.rows.map((row, index) => (
                <tr key={index} className="border-b border-[#e0e0e0]">
                  {report.columns.map((column) => {
                    const field = table?.fields.find((item) => item.name === column.field);
                    const numeric = field?.type === 'Number' || field?.type === 'Currency' || field?.type === 'AutoNumber';
                    return (
                      <td key={column.id} className={`px-1 py-0.5 ${numeric ? 'text-right' : ''}`}>
                        {formatCell(row[column.field])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {report.groupBy && (
            <p className="mt-1 text-[11px] text-[#555]">
              Count: {group.rows.length}
            </p>
          )}
        </div>
      ))}

      <div className="mt-8 flex items-center justify-between border-t border-[#999] pt-1 text-[10px] text-[#555]">
        <span>{printedOn}</span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  );

  return (
    <div className={`h-full overflow-auto ${mode === 'preview' ? 'bg-[#8a8a8a]' : 'bg-white'}`}>{page}</div>
  );
};

const SectionBar: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex h-[18px] w-[640px] items-center border border-[#7f7f7f] bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] px-2 text-[11px] font-semibold text-[#333]">
    {label}
  </div>
);

const Band: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-[640px] border border-t-0 border-[#7f7f7f] bg-white p-2">{children}</div>
);

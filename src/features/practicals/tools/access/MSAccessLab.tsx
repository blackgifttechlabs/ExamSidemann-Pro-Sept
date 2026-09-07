import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDownAZ,
  ArrowLeft,
  ArrowUpAZ,
  Bold,
  Braces,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardPaste,
  Copy,
  Database,
  Eraser,
  FileSpreadsheet,
  FileText,
  Filter,
  FolderOpen,
  Grid3x3,
  Import,
  Italic,
  Key,
  LayoutGrid,
  LayoutList,
  Link2,
  Mail,
  Minus,
  Pencil,
  Play,
  Plus,
  Printer,
  RefreshCw,
  Replace,
  Rows3,
  Save,
  Scissors,
  Search,
  SeparatorHorizontal,
  Settings2,
  Sheet,
  SpellCheck,
  Square,
  SquareCheck,
  SquareMousePointer,
  Table2,
  Tag,
  Trash2,
  Underline,
  Undo2,
  Redo2,
  Wand2,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { TeachMeLaunchButton } from '../shared/TeachMeLaunchButton';
import {
  AccessDatabase,
  AccessForm,
  AccessQuery,
  AccessReport,
  AccessTable,
  blankRow,
  buildSampleDatabase,
  ButtonAction,
  clearSavedDatabase,
  coerceValue,
  findQuery,
  findTable,
  FormControlKind,
  loadDatabase,
  makeTable,
  newId,
  nextObjectName,
  ObjectKind,
  objectNames,
  saveDatabase,
  stampAutoNumbers,
  validateRow,
} from './accessModel';
import { runQuery } from './accessSql';
import { AccessRibbon, RibbonCommand, RibbonTab } from './AccessRibbon';
import { AccessDatasheet, DatasheetColumn } from './AccessDatasheet';
import { AccessTableDesign } from './AccessTableDesign';
import { AccessQueryDesign, AccessQuerySqlView } from './AccessQueryDesign';
import {
  AccessFormDesign,
  AccessFormRun,
  autoFormControls,
  FormPropertySheet,
} from './AccessFormView';
import { AccessReportView, makeReport } from './AccessReportView';
import { DESKTOP_APP_STYLES } from '../shared/desktopAppStyles';

/**
 * Microsoft Access, rebuilt for the Computer Science practical: the maroon
 * title bar, the ribbon, the navigation pane and the tabbed document window,
 * with tables, queries, forms and reports that actually work.
 *
 * Everything the syllabus examines is live. Everything else — importing from
 * Excel, macros, SharePoint, the analysers — is drawn greyed out rather than
 * removed, so the window a student learns here is the window they sit in front
 * of in the exam.
 */

type DocView = 'datasheet' | 'design' | 'sql' | 'form' | 'report' | 'preview';

interface OpenDoc {
  key: string;
  kind: ObjectKind;
  name: string;
  view: DocView;
}

const docKey = (kind: ObjectKind, name: string) => `${kind}:${name}`;

const VIEW_LABEL: Record<DocView, string> = {
  datasheet: 'Datasheet View',
  design: 'Design View',
  sql: 'SQL View',
  form: 'Form View',
  report: 'Report View',
  preview: 'Print Preview',
};

const DEFAULT_COLUMN_WIDTH = 118;

export const MSAccessLab: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [db, setDb] = useState<AccessDatabase>(() => loadDatabase() || buildSampleDatabase());
  const [docs, setDocs] = useState<OpenDoc[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [ribbonTab, setRibbonTab] = useState('home');
  const [ribbonCollapsed, setRibbonCollapsed] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [navSelection, setNavSelection] = useState<{ kind: ObjectKind; name: string } | null>(null);
  const [navSearch, setNavSearch] = useState('');
  const [navMenu, setNavMenu] = useState<{ kind: ObjectKind; name: string; x: number; y: number } | null>(null);
  const [backstage, setBackstage] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [saveAs, setSaveAs] = useState<{ kind: ObjectKind; name: string; draft: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState(0);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [pendingControl, setPendingControl] = useState<FormControlKind | null>(null);
  const [rowCursor, setRowCursor] = useState<Record<string, number>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [dirty, setDirty] = useState(false);

  const activeDoc = docs.find((doc) => doc.key === activeKey) || null;

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const commitDb = useCallback((next: AccessDatabase) => {
    setDb(next);
    setDirty(true);
  }, []);

  const save = useCallback(() => {
    saveDatabase(db);
    setDirty(false);
    setToast('Saved to this browser.');
  }, [db]);

  /* ----------------------------------------------------------- opening */

  const openObject = (kind: ObjectKind, name: string, view?: DocView) => {
    const key = docKey(kind, name);
    const defaultView: DocView =
      kind === 'table' ? 'datasheet' : kind === 'query' ? 'datasheet' : kind === 'form' ? 'form' : 'report';
    setDocs((current) => {
      const existing = current.find((doc) => doc.key === key);
      if (existing) {
        return current.map((doc) => (doc.key === key ? { ...doc, view: view ?? doc.view } : doc));
      }
      return [...current, { key, kind, name, view: view ?? defaultView }];
    });
    setActiveKey(key);
    setNavSelection({ kind, name });
    setSelectedField(0);
    setSelectedControl(null);
  };

  const closeDoc = (key: string) => {
    setDocs((current) => current.filter((doc) => doc.key !== key));
    if (activeKey === key) {
      const remaining = docs.filter((doc) => doc.key !== key);
      setActiveKey(remaining.length > 0 ? remaining[remaining.length - 1].key : null);
    }
  };

  const setView = (view: DocView) => {
    if (!activeDoc) return;
    setDocs((current) => current.map((doc) => (doc.key === activeDoc.key ? { ...doc, view } : doc)));
  };

  const renameObject = (kind: ObjectKind, from: string, to: string) => {
    const trimmed = to.trim();
    if (!trimmed || trimmed === from) return;
    if (objectNames(db, kind).some((name) => name.toLowerCase() === trimmed.toLowerCase())) {
      setToast(`The name '${trimmed}' is already used for another ${kind}.`);
      return;
    }
    const next: AccessDatabase = {
      ...db,
      tables: db.tables.map((table) => (kind === 'table' && table.name === from ? { ...table, name: trimmed } : table)),
      queries: db.queries.map((query) => {
        if (kind === 'query' && query.name === from) return { ...query, name: trimmed };
        if (kind === 'table') {
          return {
            ...query,
            sources: query.sources.map((source) => (source.table === from ? { ...source, table: trimmed } : source)),
            columns: query.columns.map((column) => (column.table === from ? { ...column, table: trimmed } : column)),
            joins: query.joins.map((join) => ({
              ...join,
              leftTable: join.leftTable === from ? trimmed : join.leftTable,
              rightTable: join.rightTable === from ? trimmed : join.rightTable,
            })),
          };
        }
        return query;
      }),
      forms: db.forms.map((form) => {
        if (kind === 'form' && form.name === from) return { ...form, name: trimmed };
        if (form.recordSource === from && (kind === 'table' || kind === 'query')) {
          return { ...form, recordSource: trimmed };
        }
        return form;
      }),
      reports: db.reports.map((report) => {
        if (kind === 'report' && report.name === from) return { ...report, name: trimmed };
        if (report.recordSource === from && (kind === 'table' || kind === 'query')) {
          return { ...report, recordSource: trimmed };
        }
        return report;
      }),
    };
    commitDb(next);
    setDocs((current) =>
      current.map((doc) =>
        doc.kind === kind && doc.name === from ? { ...doc, name: trimmed, key: docKey(kind, trimmed) } : doc
      )
    );
    setActiveKey((current) => (current === docKey(kind, from) ? docKey(kind, trimmed) : current));
    setNavSelection({ kind, name: trimmed });
  };

  const deleteObject = (kind: ObjectKind, name: string) => {
    if (
      !window.confirm(
        `Do you want to delete the ${kind} '${name}'?\n\nIf you delete this object, you won't be able to undo the deletion.`
      )
    ) {
      return;
    }
    commitDb({
      ...db,
      tables: kind === 'table' ? db.tables.filter((table) => table.name !== name) : db.tables,
      queries: kind === 'query' ? db.queries.filter((query) => query.name !== name) : db.queries,
      forms: kind === 'form' ? db.forms.filter((form) => form.name !== name) : db.forms,
      reports: kind === 'report' ? db.reports.filter((report) => report.name !== name) : db.reports,
    });
    closeDoc(docKey(kind, name));
    setNavSelection(null);
  };

  /* ---------------------------------------------------------- creating */

  const createTable = (view: DocView) => {
    const name = nextObjectName(objectNames(db, 'table'), 'Table');
    commitDb({ ...db, tables: [...db.tables, makeTable(name)] });
    openObject('table', name, view);
    setRibbonTab(view === 'design' ? 'table-design' : 'table-fields');
  };

  const createQuery = () => {
    const name = nextObjectName(objectNames(db, 'query'), 'Query');
    const query: AccessQuery = {
      id: newId('qry'),
      name,
      sources: [],
      joins: [],
      columns: [],
      sql: '',
      sqlEdited: false,
    };
    commitDb({ ...db, queries: [...db.queries, query] });
    openObject('query', name, 'design');
    setRibbonTab('query-design');
    setShowTableDialog(true);
  };

  /** The Form button binds a new form to whatever is selected, like Access. */
  const createForm = (blank: boolean) => {
    const recordSource =
      !blank && navSelection && (navSelection.kind === 'table' || navSelection.kind === 'query')
        ? navSelection.name
        : '';
    if (!blank && !recordSource) {
      setToast('Select a table or query in the Navigation Pane first, then click Form.');
      return;
    }
    const name = nextObjectName(objectNames(db, 'form'), 'Form');
    const controls = recordSource ? autoFormControls(db, recordSource) : [];
    const form: AccessForm = {
      id: newId('frm'),
      name,
      recordSource,
      caption: recordSource || name,
      controls,
      width: 480,
      detailHeight: Math.max(180, controls.length * 14 + 40),
      headerHeight: 40,
    };
    commitDb({ ...db, forms: [...db.forms, form] });
    openObject('form', name, blank ? 'design' : 'form');
    setRibbonTab(blank ? 'form-design' : 'home');
  };

  const createReport = (blank: boolean) => {
    const recordSource =
      !blank && navSelection && (navSelection.kind === 'table' || navSelection.kind === 'query')
        ? navSelection.name
        : '';
    if (!blank && !recordSource) {
      setToast('Select a table or query in the Navigation Pane first, then click Report.');
      return;
    }
    const name = nextObjectName(objectNames(db, 'report'), 'Report');
    const report = makeReport(db, name, recordSource);
    commitDb({ ...db, reports: [...db.reports, report] });
    openObject('report', name, blank ? 'design' : 'report');
    setRibbonTab(blank ? 'report-design' : 'home');
  };

  /* ------------------------------------------------------ table editing */

  const updateTable = (name: string, updater: (table: AccessTable) => AccessTable) => {
    commitDb({
      ...db,
      tables: db.tables.map((table) => (table.name === name ? updater(table) : table)),
    });
  };

  const updateQuery = (name: string, query: AccessQuery) => {
    commitDb({ ...db, queries: db.queries.map((item) => (item.name === name ? query : item)) });
  };

  const updateForm = (name: string, form: AccessForm) => {
    commitDb({ ...db, forms: db.forms.map((item) => (item.name === name ? form : item)) });
  };

  const updateReport = (name: string, report: AccessReport) => {
    commitDb({ ...db, reports: db.reports.map((item) => (item.name === name ? report : item)) });
  };

  const commitCell = (tableName: string, rowIndex: number, column: string, text: string): string | null => {
    const table = findTable(db, tableName);
    if (!table) return 'Table not found.';
    const field = table.fields.find((item) => item.name === column);
    if (!field) return 'Field not found.';

    const { value, error } = coerceValue(field, text);
    if (error) return error;

    const rows = table.rows.map((row) => ({ ...row }));
    if (!rows[rowIndex]) return 'Record not found.';
    rows[rowIndex][column] = value;

    const candidate = { ...table, rows };
    const message = validateRow(candidate, rows[rowIndex], rowIndex);
    if (message) return message;

    updateTable(tableName, (current) => ({ ...current, rows }));
    return null;
  };

  const addRecord = (tableName: string) => {
    const table = findTable(db, tableName);
    if (!table) return;
    updateTable(tableName, (current) => {
      const copy = { ...current, rows: [...current.rows] };
      copy.rows.push(stampAutoNumbers(copy, blankRow(copy)));
      return copy;
    });
    setRowCursor((current) => ({ ...current, [docKey('table', tableName)]: table.rows.length }));
  };

  const deleteRecord = (tableName: string, rowIndex: number) => {
    updateTable(tableName, (current) => ({
      ...current,
      rows: current.rows.filter((_, index) => index !== rowIndex),
    }));
  };

  const sortRows = (tableName: string, column: string, direction: 'Ascending' | 'Descending') => {
    updateTable(tableName, (current) => {
      const rows = [...current.rows].sort((left, right) => {
        const a = left[column];
        const b = right[column];
        if (typeof a === 'number' && typeof b === 'number') return a - b;
        return String(a ?? '').localeCompare(String(b ?? ''));
      });
      return { ...current, rows: direction === 'Descending' ? rows.reverse() : rows };
    });
  };

  /* ------------------------------------------------------- form actions */

  const formAction = (form: AccessForm, action: ButtonAction) => {
    const key = docKey('form', form.name);
    const table = findTable(db, form.recordSource);
    const rowCount = table ? table.rows.length : 0;
    const cursor = rowCursor[key] ?? 0;

    switch (action) {
      case 'Add New Record':
        if (!table) return;
        addRecord(table.name);
        setRowCursor((current) => ({ ...current, [key]: rowCount }));
        break;
      case 'Delete Record':
        if (!table || rowCount === 0) return;
        if (window.confirm('You are about to delete 1 record.\n\nAre you sure you want to delete these records?')) {
          deleteRecord(table.name, cursor);
          setRowCursor((current) => ({ ...current, [key]: Math.max(0, cursor - 1) }));
        }
        break;
      case 'Save Record':
        save();
        break;
      case 'Go To First Record':
        setRowCursor((current) => ({ ...current, [key]: 0 }));
        break;
      case 'Go To Previous Record':
        setRowCursor((current) => ({ ...current, [key]: Math.max(0, cursor - 1) }));
        break;
      case 'Go To Next Record':
        setRowCursor((current) => ({ ...current, [key]: Math.min(rowCount - 1, cursor + 1) }));
        break;
      case 'Go To Last Record':
        setRowCursor((current) => ({ ...current, [key]: Math.max(0, rowCount - 1) }));
        break;
      case 'Close Form':
        closeDoc(key);
        break;
      default:
        setToast('This command button has no action set. Set On Click in the Property Sheet.');
    }
  };

  /* ------------------------------------------------------------- ribbon */

  const isTable = activeDoc?.kind === 'table';
  const isQuery = activeDoc?.kind === 'query';
  const isForm = activeDoc?.kind === 'form';
  const isReport = activeDoc?.kind === 'report';

  const cursorFor = (key: string) => rowCursor[key] ?? 0;
  const setCursorFor = (key: string, value: number) =>
    setRowCursor((current) => ({ ...current, [key]: value }));

  const runActiveQuery = () => {
    if (!activeDoc || activeDoc.kind !== 'query') return;
    setView('datasheet');
  };

  const viewCommands = (): RibbonCommand[] => {
    if (isTable) {
      return [
        {
          id: 'view-datasheet',
          label: 'Datasheet\nView',
          Icon: Sheet,
          color: 'text-[#2b579a]',
          active: activeDoc?.view === 'datasheet',
          onClick: () => setView('datasheet'),
        },
        {
          id: 'view-design',
          label: 'Design\nView',
          Icon: Wrench,
          size: 'small',
          color: 'text-[#8a2f31]',
          active: activeDoc?.view === 'design',
          onClick: () => setView('design'),
        },
      ];
    }
    if (isQuery) {
      return [
        {
          id: 'view-datasheet',
          label: 'Datasheet\nView',
          Icon: Sheet,
          color: 'text-[#2b579a]',
          active: activeDoc?.view === 'datasheet',
          onClick: () => setView('datasheet'),
        },
        {
          id: 'view-sql',
          label: 'SQL View',
          Icon: Braces,
          size: 'small',
          color: 'text-[#217346]',
          active: activeDoc?.view === 'sql',
          onClick: () => setView('sql'),
        },
        {
          id: 'view-design',
          label: 'Design View',
          Icon: Wrench,
          size: 'small',
          color: 'text-[#8a2f31]',
          active: activeDoc?.view === 'design',
          onClick: () => setView('design'),
        },
      ];
    }
    if (isForm) {
      return [
        {
          id: 'view-form',
          label: 'Form\nView',
          Icon: LayoutGrid,
          color: 'text-[#2b579a]',
          active: activeDoc?.view === 'form',
          onClick: () => setView('form'),
        },
        {
          id: 'view-design',
          label: 'Design View',
          Icon: Wrench,
          size: 'small',
          color: 'text-[#8a2f31]',
          active: activeDoc?.view === 'design',
          onClick: () => setView('design'),
        },
        { id: 'view-layout', label: 'Layout View', Icon: LayoutList, size: 'small', disabled: true },
      ];
    }
    if (isReport) {
      return [
        {
          id: 'view-report',
          label: 'Report\nView',
          Icon: FileText,
          color: 'text-[#2b579a]',
          active: activeDoc?.view === 'report',
          onClick: () => setView('report'),
        },
        {
          id: 'view-preview',
          label: 'Print Preview',
          Icon: Printer,
          size: 'small',
          color: 'text-[#8a2f31]',
          active: activeDoc?.view === 'preview',
          onClick: () => {
            setView('preview');
            setRibbonTab('print-preview');
          },
        },
        {
          id: 'view-design',
          label: 'Design View',
          Icon: Wrench,
          size: 'small',
          color: 'text-[#8a2f31]',
          active: activeDoc?.view === 'design',
          onClick: () => setView('design'),
        },
      ];
    }
    return [{ id: 'view-none', label: 'View', Icon: Sheet, disabled: true, dropdown: true }];
  };

  const homeTab: RibbonTab = {
    id: 'home',
    label: 'Home',
    groups: [
      { id: 'views', label: 'Views', commands: viewCommands() },
      {
        id: 'clipboard',
        label: 'Clipboard',
        commands: [
          { id: 'paste', label: 'Paste', Icon: ClipboardPaste, color: 'text-[#8a2f31]', disabled: true, dropdown: true },
          { id: 'cut', label: 'Cut', Icon: Scissors, size: 'small', disabled: true },
          { id: 'copy', label: 'Copy', Icon: Copy, size: 'small', disabled: true },
          { id: 'painter', label: 'Format Painter', Icon: Pencil, size: 'small', disabled: true },
        ],
      },
      {
        id: 'sort',
        label: 'Sort & Filter',
        commands: [
          {
            id: 'asc',
            label: 'Ascending',
            Icon: ArrowUpAZ,
            color: 'text-[#217346]',
            disabled: !(isTable && activeDoc?.view === 'datasheet'),
            onClick: () => {
              const table = activeDoc && findTable(db, activeDoc.name);
              if (table && table.fields[0]) sortRows(table.name, table.fields[0].name, 'Ascending');
            },
          },
          {
            id: 'desc',
            label: 'Descending',
            Icon: ArrowDownAZ,
            color: 'text-[#217346]',
            disabled: !(isTable && activeDoc?.view === 'datasheet'),
            onClick: () => {
              const table = activeDoc && findTable(db, activeDoc.name);
              if (table && table.fields[0]) sortRows(table.name, table.fields[0].name, 'Descending');
            },
          },
          { id: 'remove-sort', label: 'Remove Sort', Icon: Eraser, size: 'small', disabled: true },
          { id: 'filter', label: 'Filter', Icon: Filter, size: 'small', disabled: true },
          { id: 'advanced', label: 'Advanced', Icon: Settings2, size: 'small', disabled: true, dropdown: true },
        ],
      },
      {
        id: 'records',
        label: 'Records',
        commands: [
          {
            id: 'refresh',
            label: 'Refresh\nAll',
            Icon: RefreshCw,
            color: 'text-[#2b579a]',
            onClick: () => setToast('All open objects refreshed.'),
            dropdown: true,
          },
          {
            id: 'new-record',
            label: 'New',
            Icon: Plus,
            size: 'small',
            color: 'text-[#217346]',
            disabled: !isTable,
            onClick: () => activeDoc && addRecord(activeDoc.name),
          },
          { id: 'save-record', label: 'Save', Icon: Save, size: 'small', color: 'text-[#2b579a]', onClick: save },
          {
            id: 'delete-record',
            label: 'Delete',
            Icon: Trash2,
            size: 'small',
            color: 'text-[#8a2f31]',
            dropdown: true,
            disabled: !isTable,
            onClick: () => {
              if (!activeDoc) return;
              const index = cursorFor(activeDoc.key);
              if (window.confirm('You are about to delete 1 record.\n\nAre you sure you want to delete these records?')) {
                deleteRecord(activeDoc.name, index);
              }
            },
          },
          { id: 'totals', label: 'Totals', Icon: SeparatorHorizontal, size: 'small', disabled: true },
          { id: 'spelling', label: 'Spelling', Icon: SpellCheck, size: 'small', disabled: true },
        ],
      },
      {
        id: 'find',
        label: 'Find',
        commands: [
          { id: 'find', label: 'Find', Icon: Search, color: 'text-[#2b579a]', disabled: true },
          { id: 'replace', label: 'Replace', Icon: Replace, size: 'small', disabled: true },
          { id: 'goto', label: 'Go To', Icon: ChevronRight, size: 'small', disabled: true, dropdown: true },
          { id: 'select', label: 'Select', Icon: SquareMousePointer, size: 'small', disabled: true, dropdown: true },
        ],
      },
      {
        id: 'text',
        label: 'Text Formatting',
        render: (
          <div className="flex flex-col gap-1 pr-1 pt-1">
            <div className="flex items-center gap-1">
              <select disabled className="h-[20px] w-[110px] border border-[#d8d8d8] bg-[#f5f5f5] px-1 text-[11px] text-[#a6a6a6]">
                <option>Calibri</option>
              </select>
              <select disabled className="h-[20px] w-[46px] border border-[#d8d8d8] bg-[#f5f5f5] px-1 text-[11px] text-[#a6a6a6]">
                <option>11</option>
              </select>
            </div>
            <div className="flex items-center gap-0.5 text-[#b8b8b8]">
              <Bold size={14} />
              <Italic size={14} />
              <Underline size={14} />
              <span className="mx-1 h-4 w-px bg-[#d8d8d8]" />
              <AlignLeft size={14} />
              <AlignCenter size={14} />
              <AlignRight size={14} />
              <span className="mx-1 h-4 w-px bg-[#d8d8d8]" />
              <Grid3x3 size={14} />
              <Rows3 size={14} />
            </div>
          </div>
        ),
        commands: [],
      },
    ],
  };

  const createTab: RibbonTab = {
    id: 'create',
    label: 'Create',
    groups: [
      {
        id: 'templates',
        label: 'Templates',
        commands: [{ id: 'app-parts', label: 'Application\nParts', Icon: LayoutGrid, disabled: true, dropdown: true }],
      },
      {
        id: 'tables',
        label: 'Tables',
        commands: [
          {
            id: 'table',
            label: 'Table',
            Icon: Table2,
            color: 'text-[#2b579a]',
            onClick: () => createTable('datasheet'),
          },
          {
            id: 'table-design',
            label: 'Table\nDesign',
            Icon: Wrench,
            color: 'text-[#8a2f31]',
            onClick: () => createTable('design'),
          },
          { id: 'sharepoint', label: 'SharePoint Lists', Icon: Link2, size: 'small', disabled: true, dropdown: true },
        ],
      },
      {
        id: 'queries',
        label: 'Queries',
        commands: [
          { id: 'query-wizard', label: 'Query\nWizard', Icon: Wand2, disabled: true },
          {
            id: 'query-design',
            label: 'Query\nDesign',
            Icon: Filter,
            color: 'text-[#217346]',
            onClick: createQuery,
          },
        ],
      },
      {
        id: 'forms',
        label: 'Forms',
        commands: [
          {
            id: 'form',
            label: 'Form',
            Icon: LayoutGrid,
            color: 'text-[#2b579a]',
            onClick: () => createForm(false),
          },
          {
            id: 'form-design',
            label: 'Form\nDesign',
            Icon: Wrench,
            color: 'text-[#8a2f31]',
            onClick: () => createForm(true),
          },
          { id: 'blank-form', label: 'Blank Form', Icon: Square, size: 'small', disabled: true },
          { id: 'form-wizard', label: 'Form Wizard', Icon: Wand2, size: 'small', disabled: true },
          { id: 'navigation', label: 'Navigation', Icon: LayoutList, size: 'small', disabled: true, dropdown: true },
          { id: 'more-forms', label: 'More Forms', Icon: Rows3, size: 'small', disabled: true, dropdown: true },
        ],
      },
      {
        id: 'reports',
        label: 'Reports',
        commands: [
          {
            id: 'report',
            label: 'Report',
            Icon: FileText,
            color: 'text-[#8a2f31]',
            onClick: () => createReport(false),
          },
          {
            id: 'report-design',
            label: 'Report\nDesign',
            Icon: Wrench,
            color: 'text-[#8a2f31]',
            onClick: () => createReport(true),
          },
          { id: 'blank-report', label: 'Blank Report', Icon: Square, size: 'small', disabled: true },
          { id: 'report-wizard', label: 'Report Wizard', Icon: Wand2, size: 'small', disabled: true },
          { id: 'labels', label: 'Labels', Icon: Tag, size: 'small', disabled: true },
        ],
      },
      {
        id: 'macros',
        label: 'Macros & Code',
        commands: [
          { id: 'macro', label: 'Macro', Icon: Zap, disabled: true },
          { id: 'module', label: 'Module', Icon: Braces, size: 'small', disabled: true },
          { id: 'class-module', label: 'Class Module', Icon: Braces, size: 'small', disabled: true },
          { id: 'vba', label: 'Visual Basic', Icon: Braces, size: 'small', disabled: true },
        ],
      },
    ],
  };

  const externalDataTab: RibbonTab = {
    id: 'external',
    label: 'External Data',
    groups: [
      {
        id: 'import-link',
        label: 'Import & Link',
        commands: [
          { id: 'new-source', label: 'New Data\nSource', Icon: Import, disabled: true, dropdown: true },
          { id: 'saved-imports', label: 'Saved Imports', Icon: FolderOpen, size: 'small', disabled: true },
          { id: 'linked-manager', label: 'Linked Table Manager', Icon: Link2, size: 'small', disabled: true },
        ],
      },
      {
        id: 'export',
        label: 'Export',
        commands: [
          { id: 'saved-exports', label: 'Saved\nExports', Icon: FolderOpen, disabled: true },
          { id: 'excel', label: 'Excel', Icon: FileSpreadsheet, size: 'small', disabled: true },
          { id: 'text-file', label: 'Text File', Icon: FileText, size: 'small', disabled: true },
          { id: 'xml-file', label: 'XML File', Icon: Braces, size: 'small', disabled: true },
          { id: 'pdf', label: 'PDF or XPS', Icon: Printer, size: 'small', disabled: true },
          { id: 'email', label: 'Email', Icon: Mail, size: 'small', disabled: true },
          { id: 'more-export', label: 'More', Icon: ChevronDown, size: 'small', disabled: true, dropdown: true },
        ],
      },
    ],
  };

  const databaseToolsTab: RibbonTab = {
    id: 'tools',
    label: 'Database Tools',
    groups: [
      {
        id: 'compact',
        label: 'Tools',
        commands: [
          {
            id: 'compact-repair',
            label: 'Compact and\nRepair Database',
            Icon: Wrench,
            color: 'text-[#2b579a]',
            onClick: () => {
              save();
              setToast('Database compacted and repaired.');
            },
          },
        ],
      },
      {
        id: 'macro-tools',
        label: 'Macro',
        commands: [
          { id: 'vba-tools', label: 'Visual\nBasic', Icon: Braces, disabled: true },
          { id: 'run-macro', label: 'Run Macro', Icon: Play, size: 'small', disabled: true },
        ],
      },
      {
        id: 'relationships',
        label: 'Relationships',
        commands: [
          { id: 'relationships', label: 'Relationships', Icon: Link2, disabled: true },
          { id: 'dependencies', label: 'Object Dependencies', Icon: LayoutList, size: 'small', disabled: true },
        ],
      },
      {
        id: 'analyze',
        label: 'Analyze',
        commands: [
          { id: 'documenter', label: 'Database\nDocumenter', Icon: FileText, disabled: true },
          { id: 'analyze-performance', label: 'Analyze Performance', Icon: Zap, size: 'small', disabled: true },
          { id: 'analyze-table', label: 'Analyze Table', Icon: Table2, size: 'small', disabled: true },
        ],
      },
      {
        id: 'move-data',
        label: 'Move Data',
        commands: [
          { id: 'access-db', label: 'Access\nDatabase', Icon: Database, disabled: true },
          { id: 'sharepoint-move', label: 'SharePoint', Icon: Link2, size: 'small', disabled: true },
        ],
      },
    ],
  };

  const tabs: RibbonTab[] = [homeTab, createTab, externalDataTab, databaseToolsTab];

  if (isTable && activeDoc?.view === 'design') {
    tabs.push({
      id: 'table-design',
      label: 'Design',
      contextual: { label: 'Table Tools', color: '#b85c00' },
      groups: [
        { id: 'td-views', label: 'Views', commands: viewCommands() },
        {
          id: 'td-tools',
          label: 'Tools',
          commands: [
            {
              id: 'primary-key',
              label: 'Primary\nKey',
              Icon: Key,
              color: 'text-[#c8a415]',
              onClick: () => {
                const table = findTable(db, activeDoc.name);
                if (!table) return;
                updateTable(table.name, (current) => ({
                  ...current,
                  fields: current.fields.map((field, index) => ({
                    ...field,
                    primaryKey: index === selectedField ? !field.primaryKey : false,
                  })),
                }));
              },
            },
            {
              id: 'insert-rows',
              label: 'Insert Rows',
              Icon: Plus,
              size: 'small',
              color: 'text-[#217346]',
              onClick: () => {
                const table = findTable(db, activeDoc.name);
                if (!table) return;
                updateTable(table.name, (current) => {
                  const fields = [...current.fields];
                  fields.splice(selectedField, 0, {
                    ...current.fields[0],
                    id: newId('fld'),
                    name: `Field${fields.length + 1}`,
                    type: 'Short Text',
                    primaryKey: false,
                    description: '',
                  });
                  return { ...current, fields };
                });
              },
            },
            {
              id: 'delete-rows',
              label: 'Delete Rows',
              Icon: Minus,
              size: 'small',
              color: 'text-[#8a2f31]',
              onClick: () => {
                const table = findTable(db, activeDoc.name);
                if (!table || table.fields.length <= 1) return;
                const removed = table.fields[selectedField];
                updateTable(table.name, (current) => ({
                  ...current,
                  fields: current.fields.filter((_, index) => index !== selectedField),
                  rows: current.rows.map((row) => {
                    const copy = { ...row };
                    delete copy[removed.name];
                    return copy;
                  }),
                }));
                setSelectedField(0);
              },
            },
            { id: 'lookup', label: 'Modify Lookups', Icon: LayoutList, size: 'small', disabled: true },
          ],
        },
        {
          id: 'td-show',
          label: 'Show/Hide',
          commands: [
            { id: 'property-sheet', label: 'Property\nSheet', Icon: LayoutList, disabled: true },
            { id: 'indexes', label: 'Indexes', Icon: Key, size: 'small', disabled: true },
          ],
        },
      ],
    });
  }

  if (isTable && activeDoc?.view === 'datasheet') {
    const addField = (type: 'Short Text' | 'Number' | 'Currency' | 'Date/Time' | 'Yes/No') => {
      const table = findTable(db, activeDoc.name);
      if (!table) return;
      updateTable(table.name, (current) => ({
        ...current,
        fields: [
          ...current.fields,
          {
            ...current.fields[0],
            id: newId('fld'),
            name: `Field${current.fields.length + 1}`,
            type,
            primaryKey: false,
            description: '',
            size: type === 'Short Text' ? '255' : type === 'Number' ? 'Long Integer' : '',
            required: false,
            indexed: 'No',
          },
        ],
      }));
    };
    tabs.push({
      id: 'table-fields',
      label: 'Fields',
      contextual: { label: 'Table Tools', color: '#b85c00' },
      groups: [
        { id: 'tf-views', label: 'Views', commands: viewCommands() },
        {
          id: 'tf-add',
          label: 'Add & Delete',
          commands: [
            { id: 'af-text', label: 'Short\nText', Icon: FileText, color: 'text-[#2b579a]', onClick: () => addField('Short Text') },
            { id: 'af-number', label: 'Number', Icon: Plus, size: 'small', color: 'text-[#217346]', onClick: () => addField('Number') },
            { id: 'af-currency', label: 'Currency', Icon: Plus, size: 'small', color: 'text-[#217346]', onClick: () => addField('Currency') },
            { id: 'af-date', label: 'Date & Time', Icon: Plus, size: 'small', color: 'text-[#217346]', onClick: () => addField('Date/Time') },
            { id: 'af-yesno', label: 'Yes/No', Icon: SquareCheck, size: 'small', color: 'text-[#217346]', onClick: () => addField('Yes/No') },
            { id: 'af-more', label: 'More Fields', Icon: ChevronDown, size: 'small', disabled: true, dropdown: true },
            {
              id: 'af-delete',
              label: 'Delete',
              Icon: Trash2,
              size: 'small',
              color: 'text-[#8a2f31]',
              onClick: () => {
                const table = findTable(db, activeDoc.name);
                if (!table || table.fields.length <= 1) return;
                const removed = table.fields[table.fields.length - 1];
                updateTable(table.name, (current) => ({
                  ...current,
                  fields: current.fields.slice(0, -1),
                  rows: current.rows.map((row) => {
                    const copy = { ...row };
                    delete copy[removed.name];
                    return copy;
                  }),
                }));
              },
            },
          ],
        },
        {
          id: 'tf-properties',
          label: 'Properties',
          commands: [
            { id: 'name-caption', label: 'Name &\nCaption', Icon: Tag, disabled: true },
            { id: 'default-value', label: 'Default Value', Icon: Pencil, size: 'small', disabled: true },
            { id: 'field-size', label: 'Field Size', Icon: Settings2, size: 'small', disabled: true },
          ],
        },
        {
          id: 'tf-validation',
          label: 'Field Validation',
          commands: [
            { id: 'validation', label: 'Validation', Icon: SquareCheck, disabled: true, dropdown: true },
            { id: 'required', label: 'Required', Icon: SquareCheck, size: 'small', disabled: true },
            { id: 'unique', label: 'Unique', Icon: Key, size: 'small', disabled: true },
            { id: 'indexed-field', label: 'Indexed', Icon: Key, size: 'small', disabled: true },
          ],
        },
      ],
    });
  }

  if (isQuery && (activeDoc?.view === 'design' || activeDoc?.view === 'sql')) {
    tabs.push({
      id: 'query-design',
      label: 'Design',
      contextual: { label: 'Query Tools', color: '#2b579a' },
      groups: [
        { id: 'qd-results', label: 'Results', commands: viewCommands() },
        {
          id: 'qd-run',
          label: 'Run',
          commands: [
            {
              id: 'run-query',
              label: 'Run',
              Icon: Play,
              color: 'text-[#c8102e]',
              onClick: runActiveQuery,
            },
          ],
        },
        {
          id: 'qd-type',
          label: 'Query Type',
          commands: [
            { id: 'qt-select', label: 'Select', Icon: Filter, color: 'text-[#217346]', active: true, onClick: () => undefined },
            { id: 'qt-maketable', label: 'Make\nTable', Icon: Table2, disabled: true },
            { id: 'qt-append', label: 'Append', Icon: Plus, size: 'small', disabled: true },
            { id: 'qt-update', label: 'Update', Icon: Pencil, size: 'small', disabled: true },
            { id: 'qt-crosstab', label: 'Crosstab', Icon: Grid3x3, size: 'small', disabled: true },
            { id: 'qt-delete', label: 'Delete', Icon: Trash2, size: 'small', disabled: true },
          ],
        },
        {
          id: 'qd-setup',
          label: 'Query Setup',
          commands: [
            {
              id: 'show-table',
              label: 'Show\nTable',
              Icon: Table2,
              color: 'text-[#2b579a]',
              onClick: () => setShowTableDialog(true),
            },
            { id: 'insert-columns', label: 'Insert Columns', Icon: Plus, size: 'small', disabled: true },
            { id: 'delete-columns', label: 'Delete Columns', Icon: Minus, size: 'small', disabled: true },
            { id: 'builder', label: 'Builder', Icon: Wrench, size: 'small', disabled: true },
            { id: 'return', label: 'Return: All', Icon: Rows3, size: 'small', disabled: true },
          ],
        },
        {
          id: 'qd-showhide',
          label: 'Show/Hide',
          commands: [
            { id: 'totals', label: 'Totals', Icon: SeparatorHorizontal, disabled: true },
            { id: 'parameters', label: 'Parameters', Icon: Settings2, size: 'small', disabled: true },
            { id: 'property-sheet-q', label: 'Property Sheet', Icon: LayoutList, size: 'small', disabled: true },
          ],
        },
      ],
    });
  }

  if (isForm && activeDoc?.view === 'design') {
    const control = (kind: FormControlKind, label: string, Icon: RibbonCommand['Icon']) => ({
      id: `ctl-${kind}-${label}`,
      label,
      Icon,
      size: 'small' as const,
      color: 'text-[#2b579a]',
      active: pendingControl === kind,
      onClick: () => setPendingControl(pendingControl === kind ? null : kind),
    });
    tabs.push({
      id: 'form-design',
      label: 'Design',
      contextual: { label: 'Form Design Tools', color: '#6b3fa0' },
      groups: [
        { id: 'fd-views', label: 'Views', commands: viewCommands() },
        {
          id: 'fd-themes',
          label: 'Themes',
          commands: [
            { id: 'themes', label: 'Themes', Icon: LayoutGrid, disabled: true, dropdown: true },
            { id: 'colors', label: 'Colors', Icon: Square, size: 'small', disabled: true, dropdown: true },
            { id: 'fonts', label: 'Fonts', Icon: Bold, size: 'small', disabled: true, dropdown: true },
          ],
        },
        {
          id: 'fd-controls',
          label: 'Controls',
          commands: [
            control('textbox', 'Text Box', Square),
            control('label', 'Label', Tag),
            control('button', 'Button', SquareMousePointer),
            control('checkbox', 'Check Box', SquareCheck),
            control('combobox', 'Combo Box', ChevronDown),
            { id: 'ctl-more', label: 'More', Icon: ChevronDown, size: 'small', disabled: true, dropdown: true },
          ],
        },
        {
          id: 'fd-header',
          label: 'Header / Footer',
          commands: [
            { id: 'logo', label: 'Logo', Icon: Square, size: 'small', disabled: true },
            { id: 'title', label: 'Title', Icon: Tag, size: 'small', disabled: true },
            { id: 'date-time', label: 'Date and Time', Icon: FileText, size: 'small', disabled: true },
          ],
        },
        {
          id: 'fd-tools',
          label: 'Tools',
          commands: [
            { id: 'add-fields', label: 'Add Existing\nFields', Icon: Rows3, disabled: true },
            { id: 'property-sheet-f', label: 'Property Sheet', Icon: LayoutList, size: 'small', active: true, onClick: () => undefined },
            { id: 'tab-order', label: 'Tab Order', Icon: LayoutList, size: 'small', disabled: true },
          ],
        },
      ],
    });
  }

  if (isReport && (activeDoc?.view === 'design' || activeDoc?.view === 'report')) {
    tabs.push({
      id: 'report-design',
      label: 'Design',
      contextual: { label: 'Report Design Tools', color: '#8a2f31' },
      groups: [
        { id: 'rd-views', label: 'Views', commands: viewCommands() },
        {
          id: 'rd-grouping',
          label: 'Grouping & Totals',
          commands: [
            {
              id: 'group-sort',
              label: 'Group\n& Sort',
              Icon: LayoutList,
              color: 'text-[#217346]',
              onClick: () => setView('design'),
            },
            { id: 'totals-r', label: 'Totals', Icon: SeparatorHorizontal, size: 'small', disabled: true, dropdown: true },
            { id: 'hide-details', label: 'Hide Details', Icon: Rows3, size: 'small', disabled: true },
          ],
        },
        {
          id: 'rd-tools',
          label: 'Tools',
          commands: [
            { id: 'add-fields-r', label: 'Add Existing\nFields', Icon: Rows3, disabled: true },
            {
              id: 'print-preview-r',
              label: 'Print Preview',
              Icon: Printer,
              size: 'small',
              color: 'text-[#2b579a]',
              onClick: () => {
                setView('preview');
                setRibbonTab('print-preview');
              },
            },
          ],
        },
      ],
    });
  }

  if (isReport && activeDoc?.view === 'preview') {
    tabs.push({
      id: 'print-preview',
      label: 'Print Preview',
      contextual: { label: 'Print Preview', color: '#8a2f31' },
      groups: [
        {
          id: 'pp-print',
          label: 'Print',
          commands: [
            {
              id: 'print',
              label: 'Print',
              Icon: Printer,
              color: 'text-[#2b579a]',
              onClick: () => window.print(),
            },
          ],
        },
        {
          id: 'pp-size',
          label: 'Page Size',
          commands: [
            { id: 'size', label: 'Size', Icon: Square, disabled: true, dropdown: true },
            { id: 'margins', label: 'Margins', Icon: Grid3x3, size: 'small', disabled: true, dropdown: true },
          ],
        },
        {
          id: 'pp-layout',
          label: 'Page Layout',
          commands: [
            { id: 'portrait', label: 'Portrait', Icon: FileText, size: 'small', active: true, onClick: () => undefined },
            { id: 'landscape', label: 'Landscape', Icon: FileText, size: 'small', disabled: true },
            { id: 'columns', label: 'Columns', Icon: Rows3, size: 'small', disabled: true },
          ],
        },
        {
          id: 'pp-close',
          label: 'Close Preview',
          commands: [
            {
              id: 'close-preview',
              label: 'Close Print\nPreview',
              Icon: X,
              color: 'text-[#8a2f31]',
              onClick: () => {
                setView('report');
                setRibbonTab('home');
              },
            },
          ],
        },
      ],
    });
  }

  // Access jumps to the contextual tab the moment one applies — open a query in
  // Design View and the ribbon is already on Query Tools > Design.
  const contextualTabId = tabs.find((tab) => tab.contextual)?.id;
  useEffect(() => {
    if (contextualTabId) {
      setRibbonTab(contextualTabId);
      return;
    }
    setRibbonTab((current) => (current === 'create' || current === 'external' || current === 'tools' ? current : 'home'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextualTabId]);

  /* -------------------------------------------------------- document body */

  const datasheetColumns = (kind: 'table' | 'query', name: string): DatasheetColumn[] => {
    if (kind === 'table') {
      const table = findTable(db, name);
      if (!table) return [];
      return table.fields.map((field) => ({
        name: field.name,
        field,
        width: columnWidths[`${name}.${field.name}`] ?? DEFAULT_COLUMN_WIDTH,
      }));
    }
    const query = findQuery(db, name);
    if (!query) return [];
    const result = runQuery(db, query);
    return result.columns.map((column) => ({
      name: column,
      field: db.tables
        .flatMap((table) => table.fields)
        .find((field) => field.name === column),
      width: columnWidths[`${name}.${column}`] ?? DEFAULT_COLUMN_WIDTH,
    }));
  };

  const renderDocument = () => {
    if (!activeDoc) {
      return (
        <div className="flex h-full items-center justify-center bg-[#dfe6ee]">
          <div className="max-w-md rounded border border-[#c4cdd6] bg-white/85 p-6 text-center text-[12px] text-[#33475b] shadow-sm">
            <Database className="mx-auto mb-2 text-[#8a2f31]" size={28} />
            <p className="text-[14px] font-semibold text-[#1a1a1a]">{db.fileName}</p>
            <p className="mt-2">
              Double-click an object in the Navigation Pane to open it, or use the Create tab to make a new
              table, query, form or report.
            </p>
          </div>
        </div>
      );
    }

    if (activeDoc.kind === 'table') {
      const table = findTable(db, activeDoc.name);
      if (!table) return null;
      if (activeDoc.view === 'design') {
        return (
          <AccessTableDesign
            table={table}
            onChange={(next) => updateTable(table.name, () => next)}
            selectedField={selectedField}
            onSelectField={setSelectedField}
          />
        );
      }
      return (
        <AccessDatasheet
          columns={datasheetColumns('table', table.name)}
          rows={table.rows}
          editable
          onCommit={(rowIndex, column, text) => commitCell(table.name, rowIndex, column, text)}
          onNewRow={() => addRecord(table.name)}
          onDeleteRow={(rowIndex) => deleteRecord(table.name, rowIndex)}
          onColumnResize={(column, width) =>
            setColumnWidths((current) => ({ ...current, [`${table.name}.${column}`]: width }))
          }
          onSort={(column, direction) => sortRows(table.name, column, direction)}
          currentRow={cursorFor(activeDoc.key)}
          onCurrentRowChange={(index) => setCursorFor(activeDoc.key, index)}
        />
      );
    }

    if (activeDoc.kind === 'query') {
      const query = findQuery(db, activeDoc.name);
      if (!query) return null;
      if (activeDoc.view === 'design') {
        return (
          <AccessQueryDesign
            db={db}
            query={query}
            onChange={(next) => updateQuery(query.name, next)}
            onShowTable={() => setShowTableDialog(true)}
          />
        );
      }
      if (activeDoc.view === 'sql') {
        return <AccessQuerySqlView query={query} onChange={(next) => updateQuery(query.name, next)} />;
      }
      const result = runQuery(db, query);
      if (result.error) {
        return (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-[#dfe6ee] p-6">
            <div className="max-w-lg border border-[#b5b5b5] bg-white p-4 text-[12px] shadow-lg">
              <p className="mb-2 font-semibold text-[#8a2f31]">Microsoft Access</p>
              <p className="text-[#333]">{result.error}</p>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setView('design')}
                  className="border border-[#8a8a8a] bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] px-4 py-1 text-[11px]"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        );
      }
      return (
        <AccessDatasheet
          columns={datasheetColumns('query', query.name)}
          rows={result.rows}
          editable={false}
          onColumnResize={(column, width) =>
            setColumnWidths((current) => ({ ...current, [`${query.name}.${column}`]: width }))
          }
          currentRow={cursorFor(activeDoc.key)}
          onCurrentRowChange={(index) => setCursorFor(activeDoc.key, index)}
        />
      );
    }

    if (activeDoc.kind === 'form') {
      const form = db.forms.find((item) => item.name === activeDoc.name);
      if (!form) return null;
      if (activeDoc.view === 'design') {
        return (
          <div className="flex h-full">
            <div className="min-w-0 flex-1">
              <AccessFormDesign
                db={db}
                form={form}
                onChange={(next) => updateForm(form.name, next)}
                selected={selectedControl}
                onSelect={setSelectedControl}
                pendingControl={pendingControl}
                onPendingHandled={() => setPendingControl(null)}
              />
            </div>
            <FormPropertySheet
              db={db}
              form={form}
              onChange={(next) => updateForm(form.name, next)}
              selected={selectedControl}
              onDelete={(id) => {
                updateForm(form.name, {
                  ...form,
                  controls: form.controls.filter((control) => control.id !== id),
                });
                setSelectedControl(null);
              }}
            />
          </div>
        );
      }
      return (
        <AccessFormRun
          db={db}
          form={form}
          currentRow={cursorFor(activeDoc.key)}
          onCurrentRowChange={(index) => setCursorFor(activeDoc.key, index)}
          onEdit={(field, value) => {
            const table = findTable(db, form.recordSource);
            if (!table) return;
            const error = commitCell(table.name, cursorFor(activeDoc.key), field, value);
            if (error) setToast(error);
          }}
          onAction={(action) => formAction(form, action)}
        />
      );
    }

    const report = db.reports.find((item) => item.name === activeDoc.name);
    if (!report) return null;
    return (
      <AccessReportView
        db={db}
        report={report}
        onChange={(next) => updateReport(report.name, next)}
        mode={activeDoc.view === 'design' ? 'design' : activeDoc.view === 'preview' ? 'preview' : 'report'}
      />
    );
  };

  /* -------------------------------------------------------------- render */

  const navGroups: Array<{ kind: ObjectKind; label: string; names: string[] }> = useMemo(
    () => [
      { kind: 'table', label: 'Tables', names: db.tables.map((table) => table.name) },
      { kind: 'query', label: 'Queries', names: db.queries.map((query) => query.name) },
      { kind: 'form', label: 'Forms', names: db.forms.map((form) => form.name) },
      { kind: 'report', label: 'Reports', names: db.reports.map((report) => report.name) },
    ],
    [db]
  );

  const objectIcon = (kind: ObjectKind) =>
    kind === 'table' ? Table2 : kind === 'query' ? Filter : kind === 'form' ? LayoutGrid : FileText;

  return (
    <div
      className="desktop-app fixed inset-0 z-[150] flex select-none flex-col bg-[#dfe6ee] font-[Segoe_UI,system-ui,sans-serif] text-[12px] text-[#1a1a1a]"
      onClick={() => setNavMenu(null)}
    >
      <style>{DESKTOP_APP_STYLES}</style>

      {/* Title bar */}
      <div className="flex h-[30px] shrink-0 items-center gap-2 bg-[#a4373a] px-2 text-white">
        <button
          type="button"
          onClick={onBack}
          title="Back to Practical Labs"
          className="flex h-[22px] w-[22px] items-center justify-center rounded-sm hover:bg-white/20"
        >
          <ArrowLeft size={15} />
        </button>
        <Database size={14} className="opacity-90" />
        <div className="flex items-center gap-0.5">
          <TitleBarButton Icon={Save} title="Save" onClick={save} />
          <TitleBarButton Icon={Undo2} title="Undo (not available)" disabled />
          <TitleBarButton Icon={Redo2} title="Redo (not available)" disabled />
          <TitleBarButton Icon={ChevronDown} title="Customize Quick Access Toolbar" disabled />
        </div>
        <p className="flex-1 truncate text-center text-[12px]">
          {db.fileName} : Database- C:\Users\Student\Documents\{db.fileName} (Access 2007 - 2016 file format) -
          Access{dirty ? ' *' : ''}
        </p>
        <div className="flex items-center gap-0.5">
          <TeachMeLaunchButton size="sm" className="teachme-btn mr-2 flex h-[22px] shrink-0 items-center gap-1.5 rounded-[3px] px-2.5 text-[11px] font-bold" />
          <TitleBarButton Icon={Minus} title="Minimize" disabled />
          <TitleBarButton Icon={Square} title="Restore Down" disabled />
          <button
            type="button"
            onClick={onBack}
            title="Close"
            className="flex h-[22px] w-[30px] items-center justify-center hover:bg-[#c8102e]"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <AccessRibbon
        tabs={tabs}
        activeTab={ribbonTab}
        onTabChange={setRibbonTab}
        onFile={() => setBackstage(true)}
        collapsed={ribbonCollapsed}
        onToggleCollapsed={() => setRibbonCollapsed((current) => !current)}
        tellMe={
          <span className="flex items-center gap-1 text-[11px] italic text-white/80">
            <Search size={11} />
            Tell me what you want to do
          </span>
        }
      />

      {/* Body: navigation pane + documents */}
      <div className="flex min-h-0 flex-1">
        {navCollapsed ? (
          <button
            type="button"
            onClick={() => setNavCollapsed(false)}
            className="flex w-[24px] shrink-0 items-center justify-center border-r border-[#b5b5b5] bg-[#e8e8e8] hover:bg-[#dcdcdc]"
            title="Open the Navigation Pane"
          >
            <ChevronRight size={13} />
          </button>
        ) : (
          <div className="flex w-[210px] shrink-0 flex-col border-r border-[#b5b5b5] bg-[#f0f0f0]">
            <div className="flex h-[26px] items-center justify-between bg-[#dcdcdc] px-2 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                All Access Objects
                <ChevronDown size={11} />
              </span>
              <button type="button" onClick={() => setNavCollapsed(true)} title="Shutter Bar Open/Close Button">
                <ChevronLeft size={13} />
              </button>
            </div>
            <div className="border-b border-[#d4d4d4] p-1">
              <div className="flex items-center gap-1 border border-[#b5b5b5] bg-white px-1">
                <Search size={11} className="text-[#888]" />
                <input
                  value={navSearch}
                  onChange={(event) => setNavSearch(event.target.value)}
                  placeholder="Search..."
                  className="h-[19px] w-full text-[11px] outline-none"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto py-1">
              {navGroups.map((group) => {
                const names = group.names.filter((name) =>
                  name.toLowerCase().includes(navSearch.trim().toLowerCase())
                );
                return (
                  <div key={group.kind} className="mb-1">
                    <div className="flex items-center gap-1 bg-[#d8e0e8] px-2 py-[2px] text-[11px] font-semibold text-[#33475b]">
                      <ChevronDown size={10} />
                      {group.label}
                    </div>
                    {names.length === 0 && (
                      <p className="px-4 py-1 text-[11px] italic text-[#999]">No {group.label.toLowerCase()}</p>
                    )}
                    {names.map((name) => {
                      const Icon = objectIcon(group.kind);
                      const selected =
                        navSelection?.kind === group.kind && navSelection.name === name;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setNavSelection({ kind: group.kind, name })}
                          onDoubleClick={() => openObject(group.kind, name)}
                          onContextMenu={(event) => {
                            event.preventDefault();
                            setNavSelection({ kind: group.kind, name });
                            setNavMenu({ kind: group.kind, name, x: event.clientX, y: event.clientY });
                          }}
                          className={`flex w-full items-center gap-1.5 px-4 py-[2px] text-left text-[11px] ${
                            selected ? 'bg-[#cde0f5]' : 'hover:bg-[#e9f0f9]'
                          }`}
                          title="Double-click to open, right-click for more"
                        >
                          <Icon size={12} className="shrink-0 text-[#2b579a]" />
                          <span className="truncate">{name}</span>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Document tabs */}
          <div className="flex h-[24px] shrink-0 items-end gap-[2px] overflow-x-auto border-b border-[#b5b5b5] bg-[#e0e6ec] px-1">
            {docs.map((doc) => {
              const Icon = objectIcon(doc.kind);
              const isActive = doc.key === activeKey;
              return (
                <div
                  key={doc.key}
                  className={`flex h-[21px] shrink-0 items-center gap-1 rounded-t-[3px] border border-b-0 px-2 text-[11px] ${
                    isActive
                      ? 'border-[#b5b5b5] bg-white font-semibold'
                      : 'border-transparent bg-[#cfd8e0] text-[#333] hover:bg-[#dce3ea]'
                  }`}
                >
                  <button type="button" onClick={() => setActiveKey(doc.key)} className="flex items-center gap-1">
                    <Icon size={11} className="text-[#2b579a]" />
                    {doc.name}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeDoc(doc.key)}
                    className="text-[#777] hover:text-[#8a2f31]"
                    title="Close"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">{renderDocument()}</div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex h-[22px] shrink-0 items-center justify-between border-t border-[#b5b5b5] bg-[#a4373a] px-2 text-[11px] text-white">
        <span>{activeDoc ? VIEW_LABEL[activeDoc.view] : 'Ready'}</span>
        <div className="flex items-center gap-1">
          {activeDoc && (
            <>
              <StatusViewButton
                Icon={activeDoc.kind === 'report' ? FileText : activeDoc.kind === 'form' ? LayoutGrid : Sheet}
                title={activeDoc.kind === 'report' ? 'Report View' : activeDoc.kind === 'form' ? 'Form View' : 'Datasheet View'}
                active={['datasheet', 'form', 'report'].includes(activeDoc.view)}
                onClick={() =>
                  setView(activeDoc.kind === 'report' ? 'report' : activeDoc.kind === 'form' ? 'form' : 'datasheet')
                }
              />
              {activeDoc.kind === 'query' && (
                <StatusViewButton
                  Icon={Braces}
                  title="SQL View"
                  active={activeDoc.view === 'sql'}
                  onClick={() => setView('sql')}
                />
              )}
              {activeDoc.kind === 'report' && (
                <StatusViewButton
                  Icon={Printer}
                  title="Print Preview"
                  active={activeDoc.view === 'preview'}
                  onClick={() => setView('preview')}
                />
              )}
              <StatusViewButton
                Icon={Wrench}
                title="Design View"
                active={activeDoc.view === 'design'}
                onClick={() => setView('design')}
              />
            </>
          )}
        </div>
      </div>

      {/* Toast — Access uses a message bar for this kind of note */}
      {toast && (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-[200] -translate-x-1/2 rounded border border-[#c8a415] bg-[#fff4c8] px-4 py-2 text-[12px] text-[#5a4500] shadow-lg">
          {toast}
        </div>
      )}

      {/* Navigation pane context menu */}
      {navMenu && (
        <div
          className="fixed z-[210] w-44 border border-[#b5b5b5] bg-white py-1 text-[11px] shadow-lg"
          style={{ left: navMenu.x, top: navMenu.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <MenuItem
            label="Open"
            onClick={() => {
              openObject(navMenu.kind, navMenu.name);
              setNavMenu(null);
            }}
          />
          <MenuItem
            label="Design View"
            onClick={() => {
              openObject(navMenu.kind, navMenu.name, 'design');
              setNavMenu(null);
            }}
          />
          <div className="my-1 border-t border-[#e0e0e0]" />
          <MenuItem
            label="Rename"
            onClick={() => {
              setSaveAs({ kind: navMenu.kind, name: navMenu.name, draft: navMenu.name });
              setNavMenu(null);
            }}
          />
          <MenuItem
            label="Delete"
            onClick={() => {
              deleteObject(navMenu.kind, navMenu.name);
              setNavMenu(null);
            }}
          />
          <div className="my-1 border-t border-[#e0e0e0]" />
          <MenuItem label="Export" disabled />
          <MenuItem label="Table Properties" disabled />
        </div>
      )}

      {/* Show Table dialog */}
      {showTableDialog && activeDoc?.kind === 'query' && (
        <Dialog title="Show Table" onClose={() => setShowTableDialog(false)}>
          <div className="flex gap-3">
            <div className="h-[190px] w-[220px] overflow-auto border border-[#b5b5b5] bg-white">
              {db.tables.map((table) => (
                <button
                  key={table.id}
                  type="button"
                  onDoubleClick={() => {
                    const query = findQuery(db, activeDoc.name);
                    if (!query) return;
                    const offset = query.sources.length;
                    updateQuery(query.name, {
                      ...query,
                      sources: [
                        ...query.sources,
                        { id: newId('src'), table: table.name, x: 24 + offset * 200, y: 16 },
                      ],
                      sqlEdited: false,
                    });
                  }}
                  className="flex w-full items-center gap-1.5 px-2 py-[3px] text-left text-[11px] hover:bg-[#cde0f5]"
                >
                  <Table2 size={12} className="text-[#2b579a]" />
                  {table.name}
                </button>
              ))}
              {db.tables.length === 0 && (
                <p className="p-3 text-[11px] text-[#666]">There are no tables in this database yet.</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <DialogButton
                label="Add"
                onClick={() => {
                  const query = findQuery(db, activeDoc.name);
                  const table = navSelection?.kind === 'table' ? findTable(db, navSelection.name) : db.tables[0];
                  if (!query || !table) return;
                  updateQuery(query.name, {
                    ...query,
                    sources: [
                      ...query.sources,
                      { id: newId('src'), table: table.name, x: 24 + query.sources.length * 200, y: 16 },
                    ],
                    sqlEdited: false,
                  });
                }}
              />
              <DialogButton label="Close" onClick={() => setShowTableDialog(false)} />
            </div>
          </div>
          <p className="mt-2 text-[11px] text-[#555]">
            Double-click a table to add it to the query.
          </p>
        </Dialog>
      )}

      {/* Save As / Rename dialog */}
      {saveAs && (
        <Dialog title="Save As" onClose={() => setSaveAs(null)}>
          <label className="block text-[11px]">
            {saveAs.kind === 'table' ? 'Table Name:' : saveAs.kind === 'query' ? 'Query Name:' : saveAs.kind === 'form' ? 'Form Name:' : 'Report Name:'}
            <input
              autoFocus
              value={saveAs.draft}
              onChange={(event) => setSaveAs({ ...saveAs, draft: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  renameObject(saveAs.kind, saveAs.name, saveAs.draft);
                  setSaveAs(null);
                  save();
                }
              }}
              className="mt-1 h-[22px] w-full border border-[#b5b5b5] px-1 text-[12px] outline-none"
            />
          </label>
          <div className="mt-3 flex justify-end gap-2">
            <DialogButton
              label="OK"
              onClick={() => {
                renameObject(saveAs.kind, saveAs.name, saveAs.draft);
                setSaveAs(null);
                save();
              }}
            />
            <DialogButton label="Cancel" onClick={() => setSaveAs(null)} />
          </div>
        </Dialog>
      )}

      {/* File backstage */}
      {backstage && (
        <div className="absolute inset-0 z-[220] flex bg-[#a4373a] text-white">
          <div className="w-[190px] shrink-0 pt-3">
            <button
              type="button"
              onClick={() => setBackstage(false)}
              className="mb-4 ml-3 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[12px] hover:bg-white/25"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            {['Info', 'New', 'Open', 'Save', 'Save As', 'Print', 'Close', 'Options'].map((item) => (
              <BackstageItem
                key={item}
                label={item}
                disabled={!['New', 'Save', 'Save As', 'Close', 'Info'].includes(item)}
                onClick={() => {
                  if (item === 'Save') {
                    save();
                    setBackstage(false);
                  }
                  if (item === 'Save As' && activeDoc) {
                    setSaveAs({ kind: activeDoc.kind, name: activeDoc.name, draft: activeDoc.name });
                    setBackstage(false);
                  }
                  if (item === 'Close') {
                    setBackstage(false);
                    onBack?.();
                  }
                  if (item === 'New') {
                    if (
                      window.confirm(
                        'Create a new blank database? The database currently open in this browser will be replaced.'
                      )
                    ) {
                      clearSavedDatabase();
                      const fresh: AccessDatabase = {
                        fileName: 'Database1.accdb',
                        tables: [makeTable('Table1')],
                        queries: [],
                        forms: [],
                        reports: [],
                      };
                      setDb(fresh);
                      setDocs([]);
                      setActiveKey(null);
                      setNavSelection(null);
                      setBackstage(false);
                      setDirty(true);
                    }
                  }
                }}
              />
            ))}
          </div>
          <div className="min-w-0 flex-1 bg-white p-8 text-[#1a1a1a]">
            <h2 className="text-[26px] font-light">{db.fileName}</h2>
            <p className="mt-1 text-[12px] text-[#555]">C:\Users\Student\Documents\{db.fileName}</p>
            <dl className="mt-6 grid max-w-md grid-cols-2 gap-y-2 text-[12px]">
              <dt className="text-[#555]">Tables</dt>
              <dd>{db.tables.length}</dd>
              <dt className="text-[#555]">Queries</dt>
              <dd>{db.queries.length}</dd>
              <dt className="text-[#555]">Forms</dt>
              <dd>{db.forms.length}</dd>
              <dt className="text-[#555]">Reports</dt>
              <dd>{db.reports.length}</dd>
              <dt className="text-[#555]">Records</dt>
              <dd>{db.tables.reduce((total, table) => total + table.rows.length, 0)}</dd>
            </dl>
            <div className="mt-8 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Load the sample School database again? Any changes will be lost.')) {
                    setDb(buildSampleDatabase());
                    setDocs([]);
                    setActiveKey(null);
                    setBackstage(false);
                    setDirty(true);
                  }
                }}
                className="border border-[#8a8a8a] bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] px-4 py-1.5 text-[12px] hover:from-[#e9f0f9] hover:to-[#d4e3f5]"
              >
                Reload the sample School database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TitleBarButton: React.FC<{
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ Icon, title, onClick, disabled }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`flex h-[22px] w-[22px] items-center justify-center rounded-sm ${
      disabled ? 'text-white/40' : 'hover:bg-white/20'
    }`}
  >
    <Icon size={13} />
  </button>
);

const StatusViewButton: React.FC<{
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  active: boolean;
  onClick: () => void;
}> = ({ Icon, title, active, onClick }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`flex h-[18px] w-[20px] items-center justify-center rounded-sm ${
      active ? 'bg-white/30' : 'hover:bg-white/20'
    }`}
  >
    <Icon size={12} />
  </button>
);

const MenuItem: React.FC<{ label: string; onClick?: () => void; disabled?: boolean }> = ({
  label,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`block w-full px-3 py-1 text-left ${
      disabled ? 'text-[#a6a6a6]' : 'hover:bg-[#e9f0f9]'
    }`}
  >
    {label}
  </button>
);

const Dialog: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({
  title,
  onClose,
  children,
}) => (
  <div className="absolute inset-0 z-[215] flex items-center justify-center bg-black/20">
    <div className="w-fit border border-[#7f7f7f] bg-[#f0f0f0] shadow-2xl">
      <div className="flex items-center justify-between bg-gradient-to-b from-[#e8e8e8] to-[#d4d4d4] px-2 py-1 text-[11px] font-semibold">
        {title}
        <button type="button" onClick={onClose} className="text-[#666] hover:text-[#8a2f31]">
          <X size={12} />
        </button>
      </div>
      <div className="p-3">{children}</div>
    </div>
  </div>
);

const DialogButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-[74px] border border-[#8a8a8a] bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0] px-3 py-[3px] text-[11px] hover:from-[#e9f0f9] hover:to-[#d4e3f5]"
  >
    {label}
  </button>
);

const BackstageItem: React.FC<{ label: string; onClick: () => void; disabled?: boolean }> = ({
  label,
  onClick,
  disabled,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`block w-full px-6 py-1.5 text-left text-[13px] ${
      disabled ? 'text-white/40' : 'hover:bg-white/15'
    }`}
  >
    {label}
  </button>
);

export default MSAccessLab;

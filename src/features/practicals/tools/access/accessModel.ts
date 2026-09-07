/**
 * The database behind the Access practical: tables, queries, forms and reports,
 * held in memory and mirrored into localStorage so a student can close the tab
 * and come back to the same .accdb.
 *
 * Field values are stored keyed by field *name*, the way a datasheet reads, so
 * renaming a field has to walk the rows — that is handled in `renameField`.
 */

export type AccessDataType =
  | 'AutoNumber'
  | 'Short Text'
  | 'Long Text'
  | 'Number'
  | 'Date/Time'
  | 'Currency'
  | 'Yes/No';

export const DATA_TYPES: AccessDataType[] = [
  'Short Text',
  'Long Text',
  'Number',
  'Date/Time',
  'Currency',
  'AutoNumber',
  'Yes/No',
];

export type AccessValue = string | number | boolean | null;
export type AccessRow = Record<string, AccessValue>;

export type IndexedSetting = 'No' | 'Yes (Duplicates OK)' | 'Yes (No Duplicates)';

export interface AccessField {
  id: string;
  name: string;
  type: AccessDataType;
  description: string;
  primaryKey: boolean;
  /** Field Properties, General tab. Only the ones this lab honours are stored. */
  size: string;
  format: string;
  decimalPlaces: string;
  caption: string;
  defaultValue: string;
  validationRule: string;
  validationText: string;
  required: boolean;
  indexed: IndexedSetting;
}

export interface AccessTable {
  id: string;
  name: string;
  fields: AccessField[];
  rows: AccessRow[];
  nextAutoNumber: number;
}

export interface QueryColumn {
  id: string;
  field: string;
  table: string;
  sort: '' | 'Ascending' | 'Descending';
  show: boolean;
  criteria: string;
  or: string;
}

export interface QuerySource {
  id: string;
  table: string;
  x: number;
  y: number;
}

export interface QueryJoin {
  id: string;
  leftTable: string;
  leftField: string;
  rightTable: string;
  rightField: string;
}

export interface AccessQuery {
  id: string;
  name: string;
  sources: QuerySource[];
  joins: QueryJoin[];
  columns: QueryColumn[];
  /** Hand-written SQL wins over the grid once the SQL view has been edited. */
  sql: string;
  sqlEdited: boolean;
}

export type FormControlKind = 'label' | 'textbox' | 'button' | 'checkbox' | 'combobox';

export interface FormControl {
  id: string;
  kind: FormControlKind;
  name: string;
  caption: string;
  /** Bound field on the record source; blank for unbound controls. */
  controlSource: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  bold: boolean;
  foreColor: string;
  backColor: string;
  align: 'left' | 'center' | 'right';
  /** Buttons carry one of the built-in Command Button Wizard actions. */
  action: ButtonAction;
}

export type ButtonAction =
  | 'None'
  | 'Add New Record'
  | 'Save Record'
  | 'Delete Record'
  | 'Go To Next Record'
  | 'Go To Previous Record'
  | 'Go To First Record'
  | 'Go To Last Record'
  | 'Close Form';

export const BUTTON_ACTIONS: ButtonAction[] = [
  'None',
  'Add New Record',
  'Save Record',
  'Delete Record',
  'Go To First Record',
  'Go To Previous Record',
  'Go To Next Record',
  'Go To Last Record',
  'Close Form',
];

export interface AccessForm {
  id: string;
  name: string;
  recordSource: string;
  caption: string;
  controls: FormControl[];
  width: number;
  detailHeight: number;
  headerHeight: number;
}

export interface ReportColumn {
  id: string;
  field: string;
  width: number;
}

export interface AccessReport {
  id: string;
  name: string;
  recordSource: string;
  title: string;
  columns: ReportColumn[];
  groupBy: string;
  sortBy: string;
  sortDirection: 'Ascending' | 'Descending';
}

export interface AccessDatabase {
  fileName: string;
  tables: AccessTable[];
  queries: AccessQuery[];
  forms: AccessForm[];
  reports: AccessReport[];
}

export type ObjectKind = 'table' | 'query' | 'form' | 'report';

let idCounter = 0;
export const newId = (prefix: string) => {
  idCounter += 1;
  return `${prefix}-${Date.now().toString(36)}-${idCounter}`;
};

export const makeField = (
  name: string,
  type: AccessDataType,
  extra: Partial<AccessField> = {}
): AccessField => ({
  id: newId('fld'),
  name,
  type,
  description: '',
  primaryKey: false,
  size: type === 'Short Text' ? '255' : type === 'Number' ? 'Long Integer' : '',
  format: '',
  decimalPlaces: 'Auto',
  caption: '',
  defaultValue: '',
  validationRule: '',
  validationText: '',
  required: false,
  indexed: 'No',
  ...extra,
});

/** Access hands a brand-new table an AutoNumber primary key called ID. */
export const makeTable = (name: string): AccessTable => ({
  id: newId('tbl'),
  name,
  fields: [makeField('ID', 'AutoNumber', { primaryKey: true, indexed: 'Yes (No Duplicates)' })],
  rows: [],
  nextAutoNumber: 1,
});

/** The next free "Table1 / Table2" style name for a kind of object. */
export const nextObjectName = (existing: string[], stem: string) => {
  let index = 1;
  const taken = new Set(existing.map((name) => name.toLowerCase()));
  while (taken.has(`${stem}${index}`.toLowerCase())) index += 1;
  return `${stem}${index}`;
};

export const objectNames = (db: AccessDatabase, kind: ObjectKind): string[] => {
  if (kind === 'table') return db.tables.map((table) => table.name);
  if (kind === 'query') return db.queries.map((query) => query.name);
  if (kind === 'form') return db.forms.map((form) => form.name);
  return db.reports.map((report) => report.name);
};

export const findTable = (db: AccessDatabase, name: string) =>
  db.tables.find((table) => table.name.toLowerCase() === name.toLowerCase());

export const findQuery = (db: AccessDatabase, name: string) =>
  db.queries.find((query) => query.name.toLowerCase() === name.toLowerCase());

/**
 * Turns whatever was typed in a datasheet cell into the value the field's data
 * type stores. Returning `{ error }` is how the datasheet shows Access's own
 * "The value you entered isn't valid for this field" complaint.
 */
export const coerceValue = (
  field: AccessField,
  raw: string
): { value: AccessValue; error?: string } => {
  const text = raw.trim();
  if (text === '') {
    if (field.required) {
      return {
        value: null,
        error: `You must enter a value in the '${field.name}' field.`,
      };
    }
    return { value: null };
  }

  switch (field.type) {
    case 'Number':
    case 'Currency': {
      const numeric = Number(text.replace(/[$,\s]/g, ''));
      if (Number.isNaN(numeric)) {
        return {
          value: null,
          error: `The value you entered isn't valid for this field. '${field.name}' expects a number.`,
        };
      }
      if (field.type === 'Number' && field.size === 'Long Integer' && !Number.isInteger(numeric)) {
        return { value: Math.round(numeric) };
      }
      return { value: numeric };
    }
    case 'Yes/No': {
      const lower = text.toLowerCase();
      if (['yes', 'true', '-1', '1', 'on'].includes(lower)) return { value: true };
      if (['no', 'false', '0', 'off'].includes(lower)) return { value: false };
      return {
        value: null,
        error: `'${field.name}' accepts Yes or No.`,
      };
    }
    case 'Date/Time': {
      const parsed = new Date(text);
      if (Number.isNaN(parsed.getTime())) {
        return {
          value: null,
          error: `The value you entered isn't valid for this field. '${field.name}' expects a date.`,
        };
      }
      return { value: formatDate(parsed) };
    }
    case 'Short Text': {
      const limit = Number(field.size);
      if (Number.isFinite(limit) && limit > 0 && text.length > limit) {
        return {
          value: text.slice(0, limit),
          error: `The value is too long for '${field.name}' (Field Size ${limit}).`,
        };
      }
      return { value: text };
    }
    default:
      return { value: text };
  }
};

export const formatDate = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

/** Datasheet rendering: Yes/No shows a checkbox, Currency shows $#,##0.00. */
export const displayValue = (field: AccessField | undefined, value: AccessValue): string => {
  if (value === null || value === undefined) return '';
  if (field?.type === 'Yes/No') return value ? 'Yes' : 'No';
  if (field?.type === 'Currency' && typeof value === 'number') {
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

/** A blank record with every field at its Default Value. */
export const blankRow = (table: AccessTable): AccessRow => {
  const row: AccessRow = {};
  table.fields.forEach((field) => {
    if (field.type === 'AutoNumber') {
      row[field.name] = null;
      return;
    }
    if (field.defaultValue) {
      row[field.name] = coerceValue(field, field.defaultValue).value;
      return;
    }
    row[field.name] = field.type === 'Yes/No' ? false : null;
  });
  return row;
};

/** Stamps AutoNumber fields as the row is committed, like Access does. */
export const stampAutoNumbers = (table: AccessTable, row: AccessRow): AccessRow => {
  const stamped = { ...row };
  table.fields.forEach((field) => {
    if (field.type === 'AutoNumber' && (stamped[field.name] === null || stamped[field.name] === undefined)) {
      stamped[field.name] = table.nextAutoNumber;
      table.nextAutoNumber += 1;
    }
  });
  return stamped;
};

export const renameField = (table: AccessTable, oldName: string, newName: string) => {
  if (oldName === newName) return;
  table.rows.forEach((row) => {
    if (Object.prototype.hasOwnProperty.call(row, oldName)) {
      row[newName] = row[oldName];
      delete row[oldName];
    }
  });
};

/**
 * Checks a row against Required, Validation Rule and the primary key before it
 * is written back, so the lab enforces the constraints the syllabus asks about.
 */
export const validateRow = (
  table: AccessTable,
  row: AccessRow,
  rowIndex: number
): string | null => {
  for (const field of table.fields) {
    const value = row[field.name];
    if (field.required && (value === null || value === '' || value === undefined) && field.type !== 'AutoNumber') {
      return (
        field.validationText ||
        `You must enter a value in the '${table.name}.${field.name}' field.`
      );
    }
    if (field.validationRule && value !== null && value !== undefined && value !== '') {
      if (!evaluateValidationRule(field.validationRule, value)) {
        return (
          field.validationText ||
          `One or more values are prohibited by the validation rule '${field.validationRule}' set for '${field.name}'.`
        );
      }
    }
  }

  const key = table.fields.find((field) => field.primaryKey);
  if (key) {
    const value = row[key.name];
    const clash = table.rows.some(
      (other, index) => index !== rowIndex && other[key.name] === value && value !== null
    );
    if (clash) {
      return `The changes you requested to the table were not successful because they would create duplicate values in the primary key '${key.name}'.`;
    }
  }
  return null;
};

/**
 * A deliberately small validation-rule reader: the comparisons the syllabus
 * uses — `>=0`, `<100`, `Between 0 And 100`, `In ("M","F")`, `Is Not Null` —
 * and nothing else, so an unrecognised rule passes rather than blocking work.
 */
const evaluateValidationRule = (rule: string, value: AccessValue): boolean => {
  const text = rule.trim();
  const number = typeof value === 'number' ? value : Number(String(value));

  const between = /^between\s+(-?[\d.]+)\s+and\s+(-?[\d.]+)$/i.exec(text);
  if (between) return number >= Number(between[1]) && number <= Number(between[2]);

  const inList = /^in\s*\((.*)\)$/i.exec(text);
  if (inList) {
    const options = inList[1]
      .split(',')
      .map((item) => item.trim().replace(/^["']|["']$/g, '').toLowerCase());
    return options.includes(String(value).toLowerCase());
  }

  if (/^is\s+not\s+null$/i.test(text)) return value !== null && value !== '';
  if (/^is\s+null$/i.test(text)) return value === null || value === '';

  const comparison = /^(<>|>=|<=|=|>|<)\s*(.+)$/.exec(text);
  if (comparison) {
    const [, operator, operandRaw] = comparison;
    const operandText = operandRaw.trim().replace(/^["']|["']$/g, '');
    const operandNumber = Number(operandText);
    const numeric = Number.isFinite(operandNumber) && Number.isFinite(number);
    const left = numeric ? number : String(value).toLowerCase();
    const right = numeric ? operandNumber : operandText.toLowerCase();
    switch (operator) {
      case '>':
        return left > right;
      case '<':
        return left < right;
      case '>=':
        return left >= right;
      case '<=':
        return left <= right;
      case '=':
        return left === right;
      case '<>':
        return left !== right;
      default:
        return true;
    }
  }
  return true;
};

/**
 * The database the lab opens with. A school registry is the example the
 * syllabus keeps coming back to, and having three related tables means joins,
 * a real query and a report have something to work on from the first minute.
 */
export const buildSampleDatabase = (): AccessDatabase => {
  const students: AccessTable = {
    id: newId('tbl'),
    name: 'Students',
    fields: [
      makeField('StudentID', 'AutoNumber', { primaryKey: true, indexed: 'Yes (No Duplicates)' }),
      makeField('FirstName', 'Short Text', { size: '30', required: true }),
      makeField('Surname', 'Short Text', { size: '30', required: true }),
      makeField('Form', 'Short Text', { size: '10' }),
      makeField('DateOfBirth', 'Date/Time', { format: 'Short Date' }),
      makeField('Boarder', 'Yes/No', {}),
      makeField('FeesPaid', 'Currency', {}),
    ],
    rows: [],
    nextAutoNumber: 1,
  };
  students.rows = [
    { StudentID: 1, FirstName: 'Tendai', Surname: 'Moyo', Form: '4A', DateOfBirth: '14/03/2009', Boarder: true, FeesPaid: 320 },
    { StudentID: 2, FirstName: 'Rudo', Surname: 'Chikwature', Form: '4B', DateOfBirth: '02/11/2008', Boarder: false, FeesPaid: 280 },
    { StudentID: 3, FirstName: 'Farai', Surname: 'Ncube', Form: '4A', DateOfBirth: '27/06/2009', Boarder: true, FeesPaid: 400 },
    { StudentID: 4, FirstName: 'Chipo', Surname: 'Dube', Form: '4C', DateOfBirth: '09/01/2009', Boarder: false, FeesPaid: 150 },
    { StudentID: 5, FirstName: 'Blessing', Surname: 'Sibanda', Form: '4B', DateOfBirth: '18/08/2008', Boarder: true, FeesPaid: 365 },
    { StudentID: 6, FirstName: 'Nyasha', Surname: 'Mutasa', Form: '4C', DateOfBirth: '30/05/2009', Boarder: false, FeesPaid: 210 },
  ];
  students.nextAutoNumber = 7;

  const subjects: AccessTable = {
    id: newId('tbl'),
    name: 'Subjects',
    fields: [
      makeField('SubjectCode', 'Short Text', { size: '10', primaryKey: true, indexed: 'Yes (No Duplicates)' }),
      makeField('SubjectName', 'Short Text', { size: '40', required: true }),
      makeField('Teacher', 'Short Text', { size: '30' }),
    ],
    rows: [
      { SubjectCode: 'CS', SubjectName: 'Computer Science', Teacher: 'Mr Zulu' },
      { SubjectCode: 'MA', SubjectName: 'Mathematics', Teacher: 'Mrs Banda' },
      { SubjectCode: 'EN', SubjectName: 'English Language', Teacher: 'Ms Chirwa' },
      { SubjectCode: 'PH', SubjectName: 'Physics', Teacher: 'Mr Gumbo' },
    ],
    nextAutoNumber: 1,
  };

  const results: AccessTable = {
    id: newId('tbl'),
    name: 'Results',
    fields: [
      makeField('ResultID', 'AutoNumber', { primaryKey: true, indexed: 'Yes (No Duplicates)' }),
      makeField('StudentID', 'Number', { size: 'Long Integer', required: true }),
      makeField('SubjectCode', 'Short Text', { size: '10', required: true }),
      makeField('Mark', 'Number', {
        size: 'Long Integer',
        validationRule: 'Between 0 And 100',
        validationText: 'Marks must be between 0 and 100.',
      }),
      makeField('TermTest', 'Short Text', { size: '15' }),
    ],
    rows: [],
    nextAutoNumber: 1,
  };
  results.rows = [
    { ResultID: 1, StudentID: 1, SubjectCode: 'CS', Mark: 78, TermTest: 'Term 1' },
    { ResultID: 2, StudentID: 1, SubjectCode: 'MA', Mark: 65, TermTest: 'Term 1' },
    { ResultID: 3, StudentID: 2, SubjectCode: 'CS', Mark: 91, TermTest: 'Term 1' },
    { ResultID: 4, StudentID: 2, SubjectCode: 'EN', Mark: 72, TermTest: 'Term 1' },
    { ResultID: 5, StudentID: 3, SubjectCode: 'CS', Mark: 45, TermTest: 'Term 1' },
    { ResultID: 6, StudentID: 3, SubjectCode: 'PH', Mark: 58, TermTest: 'Term 1' },
    { ResultID: 7, StudentID: 4, SubjectCode: 'MA', Mark: 83, TermTest: 'Term 1' },
    { ResultID: 8, StudentID: 5, SubjectCode: 'CS', Mark: 67, TermTest: 'Term 1' },
    { ResultID: 9, StudentID: 5, SubjectCode: 'EN', Mark: 88, TermTest: 'Term 1' },
    { ResultID: 10, StudentID: 6, SubjectCode: 'PH', Mark: 39, TermTest: 'Term 1' },
  ];
  results.nextAutoNumber = 11;

  const passQuery: AccessQuery = {
    id: newId('qry'),
    name: 'Computer Science Passes',
    sources: [
      { id: newId('src'), table: 'Students', x: 24, y: 16 },
      { id: newId('src'), table: 'Results', x: 300, y: 16 },
    ],
    joins: [
      {
        id: newId('join'),
        leftTable: 'Students',
        leftField: 'StudentID',
        rightTable: 'Results',
        rightField: 'StudentID',
      },
    ],
    columns: [
      { id: newId('col'), field: 'FirstName', table: 'Students', sort: '', show: true, criteria: '', or: '' },
      { id: newId('col'), field: 'Surname', table: 'Students', sort: 'Ascending', show: true, criteria: '', or: '' },
      { id: newId('col'), field: 'SubjectCode', table: 'Results', sort: '', show: true, criteria: '"CS"', or: '' },
      { id: newId('col'), field: 'Mark', table: 'Results', sort: '', show: true, criteria: '>=50', or: '' },
    ],
    sql: '',
    sqlEdited: false,
  };

  return {
    fileName: 'School.accdb',
    tables: [students, subjects, results],
    queries: [passQuery],
    forms: [],
    reports: [],
  };
};

const STORAGE_KEY = 'sidemann-access-db-v1';

export const saveDatabase = (db: AccessDatabase) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // A full or blocked localStorage must not stop the lab working.
  }
};

export const loadDatabase = (): AccessDatabase | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AccessDatabase;
    if (!parsed || !Array.isArray(parsed.tables)) return null;
    return {
      fileName: parsed.fileName || 'School.accdb',
      tables: parsed.tables,
      queries: parsed.queries || [],
      forms: parsed.forms || [],
      reports: parsed.reports || [],
    };
  } catch {
    return null;
  }
};

export const clearSavedDatabase = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

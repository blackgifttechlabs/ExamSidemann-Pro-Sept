/**
 * Query execution for the Access lab.
 *
 * The design grid writes Access SQL — bracketed identifiers, `Like "T*"`,
 * `Between 10 And 20` — and this module translates that to what alasql
 * understands before running it. Brackets are kept rather than stripped: alasql
 * accepts `[Field Name]` and that is what stops a field called `Total` or
 * `Class` from becoming a parse error.
 */

import alasqlModule from 'alasql';
import {
  AccessDatabase,
  AccessQuery,
  AccessTable,
  AccessValue,
  findQuery,
  findTable,
  QueryColumn,
} from './accessModel';

const alasql: any = (alasqlModule as any).default || alasqlModule;

export interface QueryResult {
  columns: string[];
  rows: Record<string, AccessValue>[];
  error?: string;
  /** Set for action queries, which report a row count instead of a datasheet. */
  message?: string;
}

const SQL_TYPES: Record<string, string> = {
  AutoNumber: 'INT',
  Number: 'FLOAT',
  Currency: 'FLOAT',
  'Short Text': 'STRING',
  'Long Text': 'STRING',
  'Date/Time': 'STRING',
  'Yes/No': 'BOOLEAN',
};

let scratchReady = false;
const SCRATCH_DB = 'sidemann_access';

/**
 * Rebuilds the whole scratch database before every run. The datasheet is the
 * source of truth and it is small enough that reloading beats keeping alasql in
 * step with each edit.
 */
const loadScratchDatabase = (db: AccessDatabase) => {
  if (!scratchReady) {
    try {
      alasql(`DROP DATABASE IF EXISTS ${SCRATCH_DB}`);
    } catch {
      // first run in this tab
    }
    alasql(`CREATE DATABASE ${SCRATCH_DB}`);
    scratchReady = true;
  }
  alasql(`USE ${SCRATCH_DB}`);

  db.tables.forEach((table) => {
    try {
      alasql(`DROP TABLE IF EXISTS [${table.name}]`);
    } catch {
      // ignore
    }
    const columns = table.fields
      .map((field) => `[${field.name}] ${SQL_TYPES[field.type] || 'STRING'}`)
      .join(', ');
    if (!columns) return;
    alasql(`CREATE TABLE [${table.name}] (${columns})`);
    if (table.rows.length === 0) return;
    const target = alasql.databases[SCRATCH_DB].tables[table.name];
    target.data = table.rows.map((row) => {
      const record: Record<string, AccessValue> = {};
      table.fields.forEach((field) => {
        const value = row[field.name];
        record[field.name] = value === undefined ? null : value;
      });
      return record;
    });
  });
};

/** Access wildcards and keywords that alasql spells differently. */
export const toAlaSql = (sql: string) => {
  let translated = sql;

  // Like "T*" / Like "*a?e" — Access uses * and ?, SQL uses % and _
  translated = translated.replace(
    /\blike\s+("([^"]*)"|'([^']*)')/gi,
    (_match, _quoted, doubleQuoted, singleQuoted) => {
      const pattern = (doubleQuoted ?? singleQuoted ?? '')
        .replace(/%/g, '\\%')
        .replace(/\*/g, '%')
        .replace(/\?/g, '_');
      return `LIKE '${pattern.replace(/'/g, "''")}'`;
    }
  );

  // #12/05/2024# date literals become plain strings, which is how dates are stored here.
  translated = translated.replace(/#([^#]+)#/g, (_match, inner) => `'${inner}'`);

  // Access writes string literals in double quotes; alasql wants single quotes.
  translated = translated.replace(/"([^"]*)"/g, (_match, inner) => `'${String(inner).replace(/'/g, "''")}'`);

  // Yes/No literals
  translated = translated.replace(/\b(=\s*)Yes\b/gi, '$1true').replace(/\b(=\s*)No\b/gi, '$1false');

  return translated;
};

const isActionQuery = (sql: string) =>
  /^\s*(insert|update|delete|create|drop|alter)\b/i.test(sql);

export const runSql = (db: AccessDatabase, sql: string): QueryResult => {
  const trimmed = sql.trim().replace(/;\s*$/, '');
  if (!trimmed) {
    return { columns: [], rows: [], error: 'The SQL statement is empty.' };
  }

  try {
    loadScratchDatabase(db);
    const result = alasql(toAlaSql(trimmed));

    if (isActionQuery(trimmed)) {
      const count = typeof result === 'number' ? result : 0;
      return {
        columns: [],
        rows: [],
        message: `You are about to run an action query that will modify data in ${count} row(s).`,
      };
    }

    const rows: Record<string, AccessValue>[] = Array.isArray(result) ? result : [];
    const columns: string[] = [];
    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (!columns.includes(key)) columns.push(key);
      });
    });
    return { columns, rows };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      columns: [],
      rows: [],
      error: `Syntax error in query expression. ${message}`,
    };
  }
};

/**
 * Access lets a criteria cell hold either a bare value (`"CS"`, `50`) or an
 * expression missing its left-hand side (`>=50`, `Like "T*"`, `Is Null`). Both
 * have to come out as a complete WHERE clause term.
 */
export const criteriaToCondition = (columnRef: string, criteria: string) => {
  const text = criteria.trim();
  if (!text) return '';

  if (/^(is\s+null|is\s+not\s+null)$/i.test(text)) return `${columnRef} ${text}`;
  if (/^(<>|>=|<=|=|>|<)/.test(text)) return `${columnRef} ${text}`;
  if (/^(like|not\s+like|between|in|not\s+in)\b/i.test(text)) return `${columnRef} ${text}`;
  if (/^not\b/i.test(text)) return `${columnRef} <> ${text.replace(/^not\s+/i, '')}`;
  return `${columnRef} = ${text}`;
};

const columnRef = (column: QueryColumn) =>
  column.table ? `[${column.table}].[${column.field}]` : `[${column.field}]`;

/** Builds the SELECT the design grid describes, the way Access's SQL view does. */
export const buildQuerySql = (query: AccessQuery): string => {
  const used = query.columns.filter((column) => column.field.trim() !== '');
  if (query.sources.length === 0 || used.length === 0) return '';

  const shown = used.filter((column) => column.show);
  const selectList =
    shown.length > 0
      ? shown.map((column) => columnRef(column)).join(', ')
      : `${columnRef(used[0])}`;

  let from = `[${query.sources[0].table}]`;
  const joined = new Set([query.sources[0].table.toLowerCase()]);
  query.joins.forEach((join) => {
    const nextTable = joined.has(join.leftTable.toLowerCase()) ? join.rightTable : join.leftTable;
    if (joined.has(nextTable.toLowerCase())) return;
    from += ` INNER JOIN [${nextTable}] ON [${join.leftTable}].[${join.leftField}] = [${join.rightTable}].[${join.rightField}]`;
    joined.add(nextTable.toLowerCase());
  });
  // A source dragged in without a join line is a cross product, which is what
  // Access does too.
  query.sources.slice(1).forEach((source) => {
    if (joined.has(source.table.toLowerCase())) return;
    from += `, [${source.table}]`;
    joined.add(source.table.toLowerCase());
  });

  const andTerms = used
    .map((column) => criteriaToCondition(columnRef(column), column.criteria))
    .filter(Boolean);
  const orTerms = used
    .map((column) => criteriaToCondition(columnRef(column), column.or))
    .filter(Boolean);

  const whereParts: string[] = [];
  if (andTerms.length > 0) whereParts.push(andTerms.join(' AND '));
  if (orTerms.length > 0) whereParts.push(orTerms.join(' AND '));
  const where =
    whereParts.length === 0
      ? ''
      : ` WHERE ${whereParts.map((part) => (whereParts.length > 1 ? `(${part})` : part)).join(' OR ')}`;

  const sorts = used
    .filter((column) => column.sort)
    .map((column) => `${columnRef(column)}${column.sort === 'Descending' ? ' DESC' : ''}`);
  const orderBy = sorts.length > 0 ? ` ORDER BY ${sorts.join(', ')}` : '';

  return `SELECT ${selectList}\nFROM ${from}${where}${orderBy};`;
};

export const querySql = (query: AccessQuery) =>
  query.sqlEdited && query.sql.trim() ? query.sql : buildQuerySql(query);

export const runQuery = (db: AccessDatabase, query: AccessQuery): QueryResult => {
  const sql = querySql(query);
  if (!sql.trim()) {
    return {
      columns: [],
      rows: [],
      error: 'The query has no fields in the design grid. Add a field, then run it.',
    };
  }
  return runSql(db, sql);
};

/**
 * Rows behind a form or report. Both accept either a table or a query as their
 * Record Source, so this resolves whichever it is.
 */
export const recordSourceRows = (
  db: AccessDatabase,
  recordSource: string
): { columns: string[]; rows: Record<string, AccessValue>[]; error?: string } => {
  if (!recordSource) return { columns: [], rows: [] };

  const table = findTable(db, recordSource);
  if (table) {
    return {
      columns: table.fields.map((field) => field.name),
      rows: table.rows,
    };
  }

  const query = findQuery(db, recordSource);
  if (query) {
    const result = runQuery(db, query);
    return { columns: result.columns, rows: result.rows, error: result.error };
  }

  return { columns: [], rows: [], error: `The record source '${recordSource}' does not exist.` };
};

/** Field names offered by a record source, used by the form and report designers. */
export const recordSourceFields = (db: AccessDatabase, recordSource: string): string[] => {
  const table = findTable(db, recordSource);
  if (table) return table.fields.map((field) => field.name);
  const query = findQuery(db, recordSource);
  if (!query) return [];
  const declared = query.columns.filter((column) => column.show && column.field).map((column) => column.field);
  if (declared.length > 0) return declared;
  return runQuery(db, query).columns;
};

export const tableFieldNames = (table: AccessTable | undefined) =>
  table ? table.fields.map((field) => field.name) : [];

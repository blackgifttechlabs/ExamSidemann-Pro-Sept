import * as alasqlModule from 'alasql';

// In some module systems, the default export is nested
const alasql = (alasqlModule as any).default || alasqlModule;

export class SQLEngine {
  private static instance: SQLEngine;
  
  private constructor() {
    try {
      alasql("CREATE TABLE student (firstname STRING, lastname STRING, username STRING, roll INT)");
      alasql("INSERT INTO student VALUES ('x', 'y', 'z', 45)");
      alasql("INSERT INTO student VALUES ('Tatenda', 'Moyo', 'tmoyo', 1001)");
    } catch(err) {
      console.error("Initial DB setup failed", err);
    }
  }

  public static getInstance(): SQLEngine {
    if (!SQLEngine.instance) {
      SQLEngine.instance = new SQLEngine();
    }
    return SQLEngine.instance;
  }

  public execute(query: string): any {
    try {
      const res = alasql(query);
      let columns: string[] | undefined;
      
      if (Array.isArray(res)) {
        if (res.length > 0) {
          columns = Object.keys(res[0]);
        } else {
          try {
            const ast = alasql.parse(query);
            if (ast && ast.statements && ast.statements.length > 0) {
              const stmt = ast.statements[ast.statements.length - 1] || ast.statements[0];
              if (stmt.columns && stmt.from && stmt.from.length > 0) {
                const tableName = stmt.from[0].tableid;
                const cols = stmt.columns.map((c: any) => c.columnid);
                if (cols.includes('*')) {
                  const tablesDict = alasql.databases.alasql.tables;
                  const tableKey = Object.keys(tablesDict).find(k => k.toLowerCase() === tableName.toLowerCase());
                  if (tableKey) {
                    const table = tablesDict[tableKey];
                    if (table && table.columns) {
                      columns = table.columns.map((c: any) => c.columnid);
                    }
                  }
                } else {
                  columns = cols;
                }
              }
            }
          } catch (e) {
            // Ignore parser errors
          }
        }
      }
      return { success: true, data: res, columns };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  public getTables(): string[] {
    const res = alasql("SHOW TABLES");
    return res.map((r: any) => Object.values(r)[0] as string);
  }
}

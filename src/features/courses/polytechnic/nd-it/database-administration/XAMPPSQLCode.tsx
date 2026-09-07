import React, { useState, useEffect } from 'react';
import { Terminal, Copy, Play, Eraser, Code2, Database, Table as TableIcon, Search, Settings, CheckCircle, RotateCcw, X, Lightbulb, BookOpen } from 'lucide-react';
import { SQLEngine } from './SQLEngine';

interface SQLConsoleProps {
  code: string;
  databaseName?: string;
  tableName?: string;
  isDarkMode?: boolean;
}

export const SQLConsole: React.FC<SQLConsoleProps> = ({ 
  code: initialCode, 
  databaseName = 'school_db', 
  tableName, 
  isDarkMode = false 
}) => {

  const [code, setCode] = useState(initialCode);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ success: boolean; data?: any; columns?: string[]; error?: string; executionTime?: string }>({ success: true, data: [] });
  const [suggestions, setSuggestions] = useState<{label: string, query: string}[]>([]);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenSQLConsoleTutorial');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      const timer = setTimeout(() => {
        setShowTutorial(false);
        localStorage.setItem('hasSeenSQLConsoleTutorial', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('hasSeenSQLConsoleTutorial', 'true');
  };

  const highlightSQL = (sql: string) => {
    let escaped = sql
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const tokens: { val: string; cls: string }[] = [];
    
    const addToken = (match: string, cls: string) => {
      const id = tokens.length;
      tokens.push({ val: match, cls });
      return `__SQL_TOKEN_${id}__`;
    };

    // 1. Comments
    escaped = escaped.replace(/(--.*$|\/\*[\s\S]*?\*\/)/gm, (m) => addToken(m, "text-gray-500 dark:text-gray-400 italic"));
    
    // 2. Strings
    escaped = escaped.replace(/'[^']*'|"[^"]*"/g, (m) => addToken(m, "text-green-600 dark:text-green-400"));
    
    // 3. Keywords
    const keywords = /\b(SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|TABLE|ALTER|DROP|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|UNIQUE|DEFAULT|CHECK|INDEX|GRANT|REVOKE|ALL|PRIVILEGES|TO|ADD|MODIFY|COLUMN|CONSTRAINT|INT|VARCHAR|DATE|DECIMAL|CHAR|AUTO_INCREMENT|OR|AND|LIKE|TABLESPACE|DATAFILE|SIZE|JOIN|LEFT|RIGHT|INNER|ON|GROUP|BY|ORDER|LIMIT|ASC|DESC|IF|EXISTS|DATABASE|SCHEMA|TRUNCATE|UNION|VIEW|PROCEDURE|FUNCTION|TRIGGER|BEFORE|AFTER|BEGIN|END|DECLARE|CASE|WHEN|THEN|ELSE|ELSEIF|WHILE|LOOP|LEAVE|ITERATE|RETURN|COMMIT|ROLLBACK|START|TRANSACTION|SAVEPOINT|LOCK|TABLES|UNLOCK|SHOW|DESCRIBE|EXPLAIN)\b/gi;
    escaped = escaped.replace(keywords, (m) => addToken(m, "text-blue-600 dark:text-blue-400 font-bold"));
    
    // 4. Functions
    const functions = /\b(count|sum|avg|min|max|now|curdate|curtime|datediff|concat|upper|lower|substring|trim|ifnull|coalesce|version|user|database)\b/gi;
    escaped = escaped.replace(functions, (m) => addToken(m, "text-purple-600 dark:text-purple-400 font-medium"));
    
    // 5. Numbers
    escaped = escaped.replace(/\b\d+(\.\d+)?\b/g, (m) => addToken(m, "text-orange-600 dark:text-orange-400"));

    // Final pass: replace tokens with spans
    return escaped.replace(/__SQL_TOKEN_(\d+)__/g, (_, id) => {
      const token = tokens[parseInt(id)];
      return `<span class="${token.cls}">${token.val}</span>`;
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleGo = () => {
    setIsExecuting(true);
    
    setTimeout(() => {
      try {
        const engine = SQLEngine.getInstance();
        const startTime = performance.now();
        
        // Let's execute each statement separately if there are multiple separated by ';'
        const statements = code.split(';').map(s => s.trim()).filter(s => s.length > 0);
        let res: any = { success: true, data: [] };
        let lastResult: any = [];
        let lastColumns: string[] | undefined = undefined;
        
        for (const stmt of statements) {
          res = engine.execute(stmt);
          if (!res.success) break;
          lastResult = res.data;
          lastColumns = res.columns;
        }
        
        const endTime = performance.now();
        const executionTime = ((endTime - startTime) / 1000).toFixed(4);

        if (res.success) {
          let newSuggestions: {label: string, query: string}[] = [];
          if (typeof lastResult === 'number' || lastResult === 1) {
            // It's a DML/DDL that succeeded without returning rows.
            // Let's try to infer the table name from the query and show its contents.
            const createMatch = code.match(/CREATE\s+TABLE\s+`?([a-zA-Z0-9_]+)`?/i);
            const insertMatch = code.match(/INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?/i);
            const tblName = createMatch ? createMatch[1] : (insertMatch ? insertMatch[1] : null);
            if (tblName) {
               const finalRes = engine.execute(`SELECT * FROM ${tblName}`);
               if (finalRes.success) {
                  lastResult = finalRes.data;
                  lastColumns = finalRes.columns;
               }
               newSuggestions.push({ label: 'View Table', query: `SELECT * FROM ${tblName};` });
               if (createMatch) {
                 newSuggestions.push({ label: 'Insert Row', query: `INSERT INTO ${tblName} VALUES (...);` });
               } else if (insertMatch) {
                 newSuggestions.push({ label: 'Insert Another Row', query: `INSERT INTO ${tblName} VALUES (...);` });
                 newSuggestions.push({ label: 'Filter Rows', query: `SELECT * FROM ${tblName} WHERE ...;` });
               }
            } else {
               lastResult = [];
            }
          } else {
             // If query was a SELECT query
             const selectMatch = code.match(/FROM\s+`?([a-zA-Z0-9_]+)`?/i);
             if (selectMatch && Array.isArray(lastResult) && lastResult.length > 0) {
                 newSuggestions.push({ label: 'Count Rows', query: `SELECT COUNT(*) FROM ${selectMatch[1]};` });
                 newSuggestions.push({ label: 'Add Filter', query: `SELECT * FROM ${selectMatch[1]} WHERE ...;` });
             } else {
                 newSuggestions.push({ label: 'Show Tables', query: `SHOW TABLES;` });
             }
          }
          setSuggestions(newSuggestions);
          res.data = lastResult;
          res.columns = lastColumns;
        }

        setResult({ ...res, executionTime });
      } catch (err: any) {
        setResult({ success: false, error: err.message || String(err) });
      } finally {
        setShowResult(true);
        setIsExecuting(false);
      }
    }, 600); // Animation delay
  };

  const handleReset = () => {
    setShowResult(false);
  };

  return (
    <div className={`my-8 overflow-hidden rounded-xl border shadow-2xl transition-all duration-300 w-full ${
      isDarkMode ? 'border-gray-700 bg-gray-900 shadow-indigo-900/10' : 'border-gray-200 bg-white shadow-gray-200/50'
    }`}>
      {/* phpMyAdmin Style Header/Tabs */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 pt-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'browse', icon: <Search size={14} />, label: 'Browse' },
            { id: 'structure', icon: <TableIcon size={14} />, label: 'Structure' },
            { id: 'sql', icon: <Terminal size={14} />, label: 'SQL', active: true },
            { id: 'search', icon: <Search size={14} />, label: 'Search' },
            { id: 'insert', icon: <Play size={14} className="rotate-90" />, label: 'Insert' },
            { id: 'export', icon: <Code2 size={14} />, label: 'Export' },
            { id: 'import', icon: <Database size={14} />, label: 'Import' },
            { id: 'privileges', icon: <Settings size={14} />, label: 'Privileges' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                tab.active
                  ? isDarkMode ? 'bg-gray-900 text-blue-400 border-x border-t border-gray-700' : 'bg-white text-blue-600 border-x border-t border-gray-200'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <span className={tab.active ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 uppercase tracking-tighter'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb Area */}
      <div className={`${isDarkMode ? 'bg-gray-850' : 'bg-gray-50'} px-4 py-2 text-[10px] sm:text-xs flex items-center gap-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <Database size={12} className="text-gray-400" />
        <span className="text-gray-500 uppercase tracking-wider">Server: 127.0.0.1</span>
        <span className="text-gray-400">{'>'}</span>
        <span className="font-semibold text-blue-600 dark:text-blue-400">Database: {databaseName}</span>
        {tableName && (
          <>
            <span className="text-gray-400">{'>'}</span>
            <span className="font-semibold text-green-600 dark:text-green-400">Table: {tableName}</span>
          </>
        )}
      </div>

      {/* Query Title */}
      <div className="px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
          <Terminal size={14} className="text-blue-500" />
          Run SQL query/queries on database <span className="text-blue-500 lowercase">{databaseName}</span>:
        </h3>
      </div>

      <div className="relative">
        {/* State 1: Code Editor */}
        <div className={`transition-all duration-700 transform ${showResult || isExecuting ? 'opacity-0 translate-y-8 pointer-events-none absolute w-full h-0 scale-y-0 origin-top' : 'opacity-100 translate-y-0 scale-y-100 relative'}`}>
          {/* Code Editor Area */}
          <div className="relative flex min-h-[140px]">
            {/* Line Numbers */}
            <div className={`hidden sm:flex flex-col text-right px-3 py-4 font-mono text-xs select-none border-r ${
              isDarkMode ? 'bg-gray-950 border-gray-800 text-gray-600' : 'bg-gray-50 border-gray-100 text-gray-400'
            }`}>
              {code.split('\n').map((_, i) => (
                <span key={i} className="leading-6">{i + 1}</span>
              ))}
            </div>

            {/* The Code */}
            <div className={`flex-1 overflow-x-auto relative ${
              isDarkMode ? 'bg-gray-950' : 'bg-white'
            }`}>
               <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-blue-500 font-mono text-sm leading-6 p-[10px] md:p-4 resize-y z-10 outline-none"
                spellCheck={false}
              />
              <pre 
                className="absolute inset-0 w-full h-full font-mono text-sm leading-6 p-[10px] md:p-4 pointer-events-none"
                style={{ color: isDarkMode ? '#cbd5e1' : '#1f2937' }}
                dangerouslySetInnerHTML={{ __html: highlightSQL(code) }}
              />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute top-2 right-2 flex gap-2 z-20">
              <button 
                onClick={handleCopy}
                title="Copy to clipboard"
                className={`p-1.5 rounded-md transition-all ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-500 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
                }`}
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Footer / Buttons */}
          <div className={`px-4 py-3 border-t flex flex-wrap justify-between items-center gap-3 relative ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex gap-2 relative">
              <button 
                onClick={handleGo}
                className={`flex items-center gap-2 px-[5px] sm:px-6 md:px-8 md:px-6 py-2 text-xs font-bold rounded shadow-md transition-all active:scale-95 z-10 ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#e5e5e5] border border-gray-300 hover:bg-[#d4d4d4] text-[#333]'
                }`}>
                <Play size={12} fill="currentColor" /> Go
              </button>
              
              {showTutorial && (
                 <div className="absolute -top-14 left-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-2 z-50 animate-bounce">
                    <Lightbulb size={12} fill="currentColor" /> Click to execute!
                    <button onClick={dismissTutorial} className="ml-1 opacity-70 hover:opacity-100 transition-opacity p-0.5">
                       <X size={10} />
                    </button>
                    {/* Triangle pointer */}
                    <div className="absolute -bottom-1 left-4 w-2 h-2 bg-indigo-600 rotate-45"></div>
                 </div>
              )}

              <button 
                onClick={() => setCode('')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium rounded border transition-all ${
                  isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}>
                <Eraser size={12} /> Clear
              </button>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300">Retain query box</span>
              </label>
            </div>
          </div>
        </div>

        {/* State 2: Result Table */}
        <div className={`transition-all duration-700 transform ${!showResult && !isExecuting ? 'opacity-0 -translate-y-8 pointer-events-none absolute w-full h-0 scale-y-0 origin-bottom' : 'opacity-100 translate-y-0 scale-y-100 relative'}`}>
           {!isExecuting && showResult && (
             <div className={`w-full overflow-hidden text-sm font-sans ${isDarkMode ? 'bg-gray-900 border-t border-gray-700' : 'bg-white border-t border-gray-200'}`}>
                {/* Top Banner */}
                {result.success ? (
                  <div className="bg-[#dff0d8] border-b border-[#d6e9c6] text-[#3c763d] px-4 py-3 flex items-center gap-2 shadow-inner">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-[15px]">
                      {Array.isArray(result.data) 
                        ? `Showing rows 0 - ${Math.max(result.data.length - 1, 0)} (${result.data.length} total, Query took ${result.executionTime} seconds.)`
                        : `Query executed successfully! (${result.executionTime} seconds.)`
                      }
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#f2dede] border-b border-[#ebccd1] text-[#a94442] px-4 py-3 flex items-center gap-2 shadow-inner">
                    <span className="font-semibold text-[15px]">Error in SQL query: {result.error}</span>
                  </div>
                )}

                {/* SQL Query Echo */}
                <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#f5f5f5] border-gray-200'} px-4 py-4 border-b`}>
                  <code className={`${isDarkMode ? 'text-purple-400' : 'text-[#800080]'} font-mono text-[14px] break-words whitespace-pre-wrap`}>
                    {code}
                  </code>
                </div>

                {/* Suggestions Bar */}
                {suggestions.length > 0 && (
                  <div className={`px-4 py-3 border-b flex flex-wrap items-center gap-2 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-50/50 border-gray-200'}`}>
                     <span className="text-xs font-semibold text-gray-500 mr-2 flex items-center gap-1"><Lightbulb size={12}/> Suggestions:</span>
                     {suggestions.map((s, idx) => (
                        <button 
                          key={idx}
                          onClick={() => {
                             setCode(s.query);
                             handleReset(); // go back to editor
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-700 text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                              : 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm'
                          }`}
                        >
                           {s.label}
                        </button>
                     ))}
                  </div>
                )}

                {/* Controls Bar */}
                {result.success && Array.isArray(result.data) && result.data.length > 0 && (
                  <div className={`px-4 py-3 border-b flex flex-wrap items-center gap-[10px] md:p-6 ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-600'}`}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded-sm border-gray-300" />
                      <span>Show all</span>
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <span>Number of rows:</span>
                      <select className={`border rounded px-2 py-1 focus:outline-none focus:border-blue-400 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                        <option>25</option>
                        <option>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <span>Filter rows:</span>
                      <input type="text" placeholder="Search this table" className={`border rounded px-3 py-1 focus:outline-none focus:border-blue-400 w-48 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'}`} />
                    </div>
                  </div>
                )}

                {/* Data Table */}
                {result.success && Array.isArray(result.data) ? (
                  result.data.length > 0 || (result.columns && result.columns.length > 0) ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr>
                            {(result.data.length > 0 ? Object.keys(result.data[0] || {}) : (result.columns || [])).map((col: string, idx: number) => (
                              <th key={idx} className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-[#e5e5e5] border-gray-300 text-[#333]'} border-r border-b px-3 py-1.5 font-bold tracking-wide text-[13px]`}>
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {result.data.length > 0 ? result.data.map((row: any, idx: number) => (
                            <tr key={idx} className={`${idx % 2 === 0 ? (isDarkMode ? 'bg-gray-900' : 'bg-[#f9f9f9]') : (isDarkMode ? 'bg-gray-850' : 'bg-white')} hover:bg-[#e8f4ff] dark:hover:bg-gray-800 transition-colors`}>
                              {Object.values(row).map((val: any, vIdx: number) => (
                                <td key={vIdx} className={`${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-800'} border-r border-b px-3 py-1.5 whitespace-nowrap`}>
                                  {val !== null && val !== undefined ? String(val) : <span className="text-gray-400 italic">NULL</span>}
                                </td>
                              ))}
                            </tr>
                          )) : (
                             <tr>
                               <td colSpan={(result.columns || []).length} className="px-4 py-8 text-left text-gray-500 dark:text-gray-400 italic">
                                  MySQL returned an empty result set (i.e. zero rows).
                               </td>
                             </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={`p-[10px] md:p-6 text-left italic ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      MySQL returned an empty result set (i.e. zero rows).
                    </div>
                  )
                ) : null}

                {/* Action area */}
                <div className={`px-4 py-4 border-t flex justify-end ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <button
                    onClick={handleReset}
                    className={`flex items-center gap-2 px-5 py-2 font-semibold rounded shadow-sm transition-all text-[13px] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-100 border'}`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Edit Query
                  </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};


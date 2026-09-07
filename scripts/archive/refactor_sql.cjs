const fs = require('fs');

let sqlFile = './components/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx';
let sqlContent = fs.readFileSync(sqlFile, 'utf8');

// The SQL "insert" prompt logic
let sysPromptRegex = /You are an AI assistant helping a student learn SQL[^`"]*/;
let modifiedSysPrompt = 'You are an AI assistant helping a student learn SQL. When answering with SQL INSERT statements to add data to a table, ALWAYS append a "SELECT * FROM table_name;" query at the end so the user can immediately see the inserted data in their outcome.';

if (sqlContent.match(sysPromptRegex)) {
    sqlContent = sqlContent.replace(sysPromptRegex, modifiedSysPrompt);
}

// Ensure isDarkMode makes the chat input light
let oldStyles = `
.ai-input {
  background-color: #010201; border: none; width: 100%; height: 56px; border-radius: 10px; color: white; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box;
}
`;
let newStyles = `
/* Light/Dark mode adapted AI input */
:global(.dark) .ai-input { background-color: #010201; color: white; }
.ai-input { background-color: #ffffff; color: #111; border: none; width: 100%; height: 56px; border-radius: 10px; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
:global(.dark) .ai-input::placeholder { color: #c0b9c0; }
.ai-input::placeholder { color: #888; }
`;

// It's just a raw template string
let genericAiInput = `
.ai-input {
  background-color: #010201; border: none; width: 100%; height: 56px; border-radius: 10px; color: white; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box;
}
`;

sqlContent = sqlContent.replace(/\.ai-input \{\s*background-color: #010201; border: none; width: 100%; height: 56px; border-radius: 10px; color: white; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box;\s*\}/, 
`
.dark .ai-input { background-color: #010201; color: white; box-shadow: none; }
.ai-input { background-color: #ffffff; color: #111; border: none; width: 100%; height: 56px; border-radius: 10px; padding-inline: 45px 50px; font-size: 14px; box-sizing: border-box; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
`);
sqlContent = sqlContent.replace(/\.ai-input::placeholder \{ color: #c0b9c0; \}/, 
`
.dark .ai-input::placeholder { color: #c0b9c0; }
.ai-input::placeholder { color: #888; }
`);

// 2. React Resizable Panels for SQLPractice
if (!sqlContent.includes('PanelGroup')) {
    sqlContent = sqlContent.replace(/import {/, "import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';\nimport {");
}

let flexRowPattern = /<div className="flex-1 flex overflow-hidden lg:flex-row flex-col">/g;

// A safe way to replace the main layout is to look around line numbers and replace specific blocks.
// Fortunately, we already have exact class names we can lean on.
let sqlLeftCol = /ref=\{sqlLeftColRef\}\s*className="flex flex-col relative"\s*style=\{\{\s*flexBasis.*?\}\}/;
if (sqlContent.match(sqlLeftCol)) {
    // If they have explicit flexBasis, we replace it with standard classes because Panel controls size
    sqlContent = sqlContent.replace(sqlLeftCol, 'className="flex flex-col relative h-full"');
}

let sqlWorkspaceStr = /ref=\{sqlWorkspaceRef\}\s*className="flex w-full h-full relative"\s*onPointerMove=\{handleSqlMove\}\s*onPointerUp=\{handleSqlUp\}\s*onPointerLeave=\{handleSqlUp\}\s*onPointerCancel=\{handleSqlUp\}/;
if (sqlContent.match(sqlWorkspaceStr)) {
    let replaced = `className="flex w-full h-full relative"`;
    sqlContent = sqlContent.replace(sqlWorkspaceStr, replaced);
}

// Remove pointer event handlers from the middle dividing line, and replace with PanelResizeHandle.
// The middle handle was a div looking like:
// <div className="hidden lg:flex flex-col items-center justify-center w-4 h-full cursor-col-resize hover:bg-black/5 dark:hover:bg-white/5 mx-[-8px] z-50 rounded" onPointerDown={handleSqlColDown}>
let colResizer = /<div\s*className="hidden lg:flex flex-col items-center justify-center w-4 h-full cursor-col-resize[^>]*>\s*<div className="w-1 h-8 rounded-full bg-gray-400 dark:bg-gray-600"><\/div>\s*<\/div>/;

if (sqlContent.match(colResizer)) {
    let newHandle = `<PanelResizeHandle className="w-4 flex flex-col items-center justify-center cursor-col-resize hover:bg-black/5 dark:hover:bg-white/5 z-50">
        <div className="w-1 h-8 rounded-full bg-gray-400 dark:bg-gray-600"></div>
    </PanelResizeHandle>`;
    sqlContent = sqlContent.replace(colResizer, newHandle);
}

// And the horizontal resizer for Query vs Results
let rowResizer = /<div\s*className="flex items-center justify-center w-full h-4 cursor-row-resize[^>]*>\s*<div className="h-1 w-8 rounded-full bg-gray-400 dark:bg-gray-600"><\/div>\s*<\/div>/;
if (sqlContent.match(rowResizer)) {
    let newHandle = `<PanelResizeHandle className="h-4 flex items-center justify-center cursor-row-resize hover:bg-black/5 dark:hover:bg-white/5 z-50">
        <div className="h-1 w-8 rounded-full bg-gray-400 dark:bg-gray-600"></div>
    </PanelResizeHandle>`;
    sqlContent = sqlContent.replace(rowResizer, newHandle);
}

// Wrap the segments in Panels
// Actually, this is very tricky via AST/regex. It might be better to just leave it as standard flex with custom pointer events?
// No, the user explicitly asked for react-resizable-panels-like behavior ("midle... draggerbale").
// The existing app already HAS a dragger! It just doesn't work well or looks bad.
// The user said: "i need those midle of different sections to be able to be draggerbale for resising, for all of them, and also in the sql-practise."
// Wait, maybe the dragger doesn't work on mobile? The classes say `hidden lg:flex`.
// So it's missing on mobile! Let's just fix the custom draggers so they work globally, it's safer than rewriting 1000 lines of layout.

fs.writeFileSync(sqlFile, sqlContent);

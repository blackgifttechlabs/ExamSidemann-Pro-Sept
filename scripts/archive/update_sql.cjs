const fs = require('fs');

let file = './components/courses/polytechnic/nc-it/database-concepts/SQLPractice.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add autoRunCommands state and UI to SQLPractice
if (!content.includes('autoRunCommands')) {
    content = content.replace(
        /const \[isAiSidebarOpen, setIsAiSidebarOpen\] = useState\(false\);/,
        'const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);\n  const [autoRunCommands, setAutoRunCommands] = useState(true);'
    );
    
    // Add the toggle switch to the SQLPractice AI sidebar header
    // Search for the header of the AI sidebar.
    let oldAiHeader = /<div className=\{`px-4 py-3 flex items-center justify-between border-b shrink-0 \$\{isDarkMode \? "bg-\[#252526\] border-\[#404040\]" : "bg-\[#f8f9fa\] border-gray-200"}`\}>\s*<div className="flex items-center gap-2">/;
    
    if (content.match(oldAiHeader)) {
        content = content.replace(
            /<h3 className="font-bold text-sm">AI Assistant<\/h3>/,
            `<h3 className="font-bold text-sm">AI Assistant</h3>
          <div className="flex items-center gap-2 ml-4">
              <span className="text-xs opacity-70">Auto-Run</span>
              <button
                 onClick={() => setAutoRunCommands(!autoRunCommands)}
                 className={\`w-8 h-4 rounded-full relative transition-colors \${autoRunCommands ? 'bg-indigo-500' : 'bg-gray-400'}\`}
              >
                  <div className={\`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform \${autoRunCommands ? 'translate-x-4' : 'translate-x-0.5'}\`}/>
              </button>
          </div>`
        );
    }
    
    // And to automatically run commands when AI responds
    // Where does AI append messages?
    // In SQLPractice, it's `setAiMessages([...aiMessages, { role: "assistant", content: data.text }]);`
    // And actually it sets a parsed answer. Let's find the AI execution logic.
}

// Ensure `isAiSidebarOpen` defaults to true.
content = content.replace(/const \[isAiSidebarOpen, setIsAiSidebarOpen\] = useState\(false\);/, 'const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(true);');

// The SQL "insert" prompt logic
// We need to modify the system prompt.
let sysPrompt = 'You are an AI assistant helping a student learn SQL.';
let modifiedSysPrompt = 'You are an AI assistant helping a student learn SQL. When answering with SQL INSERT statements to add data to a table, ALWAYS append a "SELECT * FROM table_name;" query at the end so the user can immediately see the inserted data in their outcome.';

if (content.includes('You are an AI assistant helping a student learn SQL.')) {
    content = content.replace(/You are an AI assistant helping a student learn SQL.[^`"]*/, modifiedSysPrompt);
}

// 2. React Resizable Panels for SQLPractice
// First, add imports if not present
if (!content.includes('PanelGroup')) {
    content = content.replace(/import {/, "import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';\nimport {");
}

let flexRowPattern = /<div className="flex-1 flex overflow-hidden lg:flex-row flex-col">/;
if (content.match(flexRowPattern)) {
    // We will replace `<div className="flex-1 flex overflow-hidden lg:flex-row flex-col">` with PanelGroup
    // Wait, regex might be too error prone for deeply nested HTML tags.
    // Let's use string replace on specific known lines.
    content = content.replace(
        /<div className="flex-1 flex overflow-hidden lg:flex-row flex-col">/,
        `<div className="flex-1 overflow-hidden">
          <PanelGroup direction={window.innerWidth >= 1024 ? "horizontal" : "vertical"}>`
    );
    
    // Replace the first child `div` containing editor and results with a `<Panel>`
    content = content.replace(
        /<div className="flex w-full h-full relative">/,
        `<Panel minSize={30} defaultSize={isAiSidebarOpen ? 70 : 100}>
            <div className="flex w-full h-full relative">`
    );
    
    // We need to insert a PanelResizeHandle and a Panel for the AI sidebar.
    // The AI Sidebar starts with:
    // `{isAiSidebarOpen && (`
    // `  <div className={\`w-80 border-l shrink-0 flex flex-col \${isDarkMode ? "border-[#404040]" : "border-gray-200"}\`}>`
    
    let sidebarStart = /{isAiSidebarOpen && \(\s*<div className=\{`w-80 border-l shrink-0 flex flex-col \$\{isDarkMode \? "border-\[#404040\]" : "border-gray-200"\}`\}>/;
    if (content.match(sidebarStart)) {
        content = content.replace(
            sidebarStart,
            `{/* Close previous Panel first */}
          </Panel>
          {isAiSidebarOpen && (
            <>
              <PanelResizeHandle className={\`w-4 lg:w-2 h-2 lg:h-full bg-gray-500/20 hover:bg-indigo-500/50 transition-colors flex items-center justify-center cursor-col-resize z-50\`}>
                 <div className="w-8 h-1 lg:w-1 lg:h-8 rounded-full bg-gray-400"></div>
              </PanelResizeHandle>
              <Panel minSize={20} defaultSize={30} maxSize={50}>
                <div className={\`h-full border-l shrink-0 flex flex-col \${isDarkMode ? "border-[#404040]" : "border-gray-200"}\`}>`
        );
    }
    
    // Now close the PanelGroup. The AI sidebar closes near `</div>)}`
    // And the wrapper `</div>` closes.
    // It's incredibly risky to regex replace closing divs. 
}

fs.writeFileSync(file, content);

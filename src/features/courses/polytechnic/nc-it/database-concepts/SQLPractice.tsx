import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Play,
  ArrowLeft,
  CheckCircle,
  Database,
  AlertCircle,
  Download,
  LayoutDashboard,
  Lightbulb,
  X,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Bot,
  User,
  Table,
  Key,
  Link2,
  Eye,
  Users,
  Type,
  Calendar,
  BarChart2,
  Edit,
  GraduationCap,
  ChevronRight } from "lucide-react";
import { SQLEngine } from "./SQLEngine";
import {
  TeachMeButton,
  TeachMeCaptionBar,
  TeachMePanel,
  TeachSpotlight,
  TeachWhiteboard,
  useSqlTeachMe,
  type TeachMeActions } from "./SQLTeachMe";
import type { TeachFocus } from "./sqlTeachMeContent";
import Editor, { useMonaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { GROQ_MODELS, groqReasoningParams } from '../../../../../services/groq';
import {
  vscDarkPlus,
  vs } from "react-syntax-highlighter/dist/esm/styles/prism";

const customInputStyles = `
.grid-bg-ai { background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 1rem 1rem; background-position: center center; position: absolute; inset: 0; z-index: 0; }
.ai-w, .ai-b, .ai-db, .ai-g {
  height: 100%; width: 100%; position: absolute; overflow: hidden; z-index: -1; border-radius: 12px; filter: blur(3px);
}
.ai-input {
  background-color: var(--ai-input-bg, #0d0d12); border: none; width: 100%; height: 58px; border-radius: 14px; color: var(--ai-input-fg, white); padding-inline: 18px 64px; font-size: 15px; box-sizing: border-box;
}
.ai-input-light { --ai-input-bg: #f4f4f5; --ai-input-fg: #1f1f1f; }
.ai-input-light::placeholder { color: #8b8b93 !important; }
#poda { display: flex; align-items: center; justify-content: center; position: relative; width: 100%; box-sizing: border-box; }
.ai-input::placeholder { color: #c0b9c0; }
.ai-input:focus { outline: none; }
#main:focus-within > #input-mask { display: none; }
#input-mask { pointer-events: none; width: 100px; height: 20px; position: absolute; background: linear-gradient(90deg, transparent, black); top: 18px; left: 70px; }
#pink-mask { pointer-events: none; width: 30px; height: 20px; position: absolute; background: #cf30aa; top: 10px; left: 5px; filter: blur(20px); opacity: 0.8; transition: all 2s; }
#main:hover > #pink-mask { opacity: 0; }
.ai-w::before, .ai-b::before, .ai-db::before, .ai-g:before { content: ""; z-index: -2; text-align: center; top: 50%; left: 50%; position: absolute; width: 600px; height: 600px; background-repeat: no-repeat; background-position: 0 0; transition: all 2s; }
.ai-w::before { transform: translate(-50%, -50%) rotate(83deg); filter: brightness(1.4); background-image: conic-gradient(rgba(0,0,0,0) 0%, #a099d8, rgba(0,0,0,0) 8%, rgba(0,0,0,0) 50%, #dfa2da, rgba(0,0,0,0) 58%); }
.ai-b::before { transform: translate(-50%, -50%) rotate(70deg); filter: brightness(1.3); background-image: conic-gradient(#1c191c, #402fb5 5%, #1c191c 14%, #1c191c 50%, #cf30aa 60%, #1c191c 64%); }
.ai-db::before { transform: translate(-50%, -50%) rotate(82deg); background-image: conic-gradient(rgba(0,0,0,0), #18116a, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 50%, #6e1b60, rgba(0,0,0,0) 60%); }
#poda:hover > .ai-db::before { transform: translate(-50%, -50%) rotate(-98deg); }
#poda:hover > .ai-g::before { transform: translate(-50%, -50%) rotate(-120deg); }
#poda:hover > .ai-w::before { transform: translate(-50%, -50%) rotate(-97deg); }
#poda:hover > .ai-b::before { transform: translate(-50%, -50%) rotate(-110deg); }
#poda:focus-within > .ai-db::before { transform: translate(-50%, -50%) rotate(442deg); transition: all 4s; }
#poda:focus-within > .ai-g::before { transform: translate(-50%, -50%) rotate(420deg); transition: all 4s; }
#poda:focus-within > .ai-w::before { transform: translate(-50%, -50%) rotate(443deg); transition: all 4s; }
#poda:focus-within > .ai-b::before { transform: translate(-50%, -50%) rotate(430deg); transition: all 4s; }
.ai-g { filter: blur(30px); opacity: 0.4; overflow: hidden; max-height: 200px; border-radius: 20px;}
.ai-g:before { content: ""; position: absolute; transform: translate(-50%, -50%) rotate(60deg); width: 900px; height: 900px; background-image: conic-gradient(#000, #402fb5 5%, #000 38%, #000 50%, #cf30aa 60%, #000 87%); }
#main { position: relative; width: 100%; box-sizing: border-box; }
#search-icon { position: absolute; left: 15px; top: 16px; pointer-events: none; }
#filter-icon { position: absolute; top: 8px; right: 8px; display: flex; align-items: center; justify-content: center; z-index: 2; height: 40px; width: 40px; isolation: isolate; overflow: hidden; border-radius: 10px; background: linear-gradient(180deg, #161329, black, #1d1b4b); border: 1px solid transparent; cursor: pointer; transition: transform 0.2s; }
#filter-icon:active { transform: scale(0.95); }
.filterBorder { height: 42px; width: 42px; position: absolute; overflow: hidden; top: -1px; right: -1px; border-radius: 10px; z-index: -1; }
.filterBorder::before { content: ""; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(90deg); position: absolute; width: 100px; height: 100px; background-repeat: no-repeat; background-position: 0 0; filter: brightness(1.35); background-image: conic-gradient(rgba(0,0,0,0), #3d3a4f, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 50%, #3d3a4f, rgba(0,0,0,0) 100%); animation: ai-rotate 4s linear infinite; }
@keyframes ai-rotate { 100% { transform: translate(-50%, -50%) rotate(450deg); } }
.prose-chat { font-family: Arial, Helvetica, sans-serif; font-size: 0.95rem; line-height: 1.65; }
.prose-chat p { margin: 0.5rem 0; }
.prose-chat li { line-height: 1.55; }
.prose-chat ul { list-style: disc; padding-left: 1.25rem; margin: 0.4rem 0; }
.prose-chat ol { list-style: decimal; padding-left: 1.25rem; margin: 0.4rem 0; }
.chat-text { font-family: Arial, Helvetica, sans-serif; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(148, 163, 184, 0.65) transparent; scrollbar-gutter: stable; }
.custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.55); border-radius: 999px; border: 2px solid transparent; background-clip: content-box; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.75); background-clip: content-box; }
@media (max-width: 1023px) {
  .mobile-tab-panel { animation: mobile-tab-enter 220ms cubic-bezier(0.22, 1, 0.36, 1); }
}
@media (prefers-reduced-motion: reduce) {
  .mobile-tab-panel { animation: none; }
}
@keyframes mobile-tab-enter {
  from { opacity: 0; transform: translateY(10px) scale(0.995); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
`;

/**
 * The lesson's pointing finger. A narrated step rings whichever part of the
 * console the narrator is talking about, which is the text-console equivalent
 * of the pointing hand the 3D practicals use.
 */
const teachSpotlightStyles = `
.teach-spotlight {
  position: relative; z-index: 46; border-radius: 10px;
  animation: teach-lift 620ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
/* Raise the thing being explained off the page, and let it settle back when
   the narrator moves on. */
@keyframes teach-lift {
  from { transform: translateY(0) scale(1); }
  to { transform: translateY(-6px) scale(1.012); }
}
.teach-hand { animation: teach-hand-bob 1.3s ease-in-out infinite; }
@keyframes teach-hand-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.teach-board-lift { animation: teach-board-lift 520ms cubic-bezier(0.22, 1, 0.36, 1); }
@keyframes teach-board-lift {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  60% { opacity: 1; transform: translateY(-6px) scale(1.02); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.teach-board-lift > * { box-shadow: 0 12px 30px rgba(79, 70, 229, 0.22); border-radius: 12px; }
@media (prefers-reduced-motion: reduce) {
  .teach-spotlight, .teach-hand, .teach-board-lift { animation: none; }
}
/* The install prompt is pinned above everything at z-index 10020, right where
   the subtitles sit. A lesson is a full-attention mode, so it stands down. */
body.teach-lesson-running .pwa-install-card { display: none !important; }
/* The fragment of SQL the narrator is talking about, lit inside the editor. */
.teach-code-mark {
  background: rgba(250, 204, 21, 0.38) !important;
  border-radius: 3px;
  box-shadow: 0 0 0 1px rgba(202, 138, 4, 0.55);
  animation: teach-code-mark-in 1.4s ease-in-out infinite;
}
@keyframes teach-code-mark-in {
  0%, 100% { background: rgba(250, 204, 21, 0.30) !important; }
  50% { background: rgba(250, 204, 21, 0.62) !important; }
}
@media (prefers-reduced-motion: reduce) { .teach-code-mark { animation: none; } }
`;

interface Props {
  onBack?: () => void;
}

export const SQLPractice: React.FC<Props> = ({ onBack }) => {
  const [query, setQuery] = useState(
    "CREATE TABLE users (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n  username VARCHAR(50),\n  role VARCHAR(50)\n);\n\nINSERT INTO users (username, role) VALUES ('John', 'admin');\nINSERT INTO users (username, role) VALUES ('Jane', 'user');\n\nSELECT * FROM users;",
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    data?: any;
    columns?: string[];
    error?: string;
    executionTime?: string;
  }>({ success: true, data: [] });
  const [hasExecuted, setHasExecuted] = useState(false);
  const [leftColumnRatio, setLeftColumnRatio] = useState(65);
  const [topRowRatio, setTopRowRatio] = useState(50);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [autoRunCommands, setAutoRunCommands] = useState(true);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"code" | "teach" | "chat">("code");
  const queryRef = useRef(query);
  // A lesson types character by character; a new step must be able to cut the
  // previous step's typing off mid-word rather than fight it for the editor.
  const typingRunRef = useRef(0);
  const editorRef = useRef<any>(null);
  const markDecorationsRef = useRef<string[]>([]);
  const markAttemptRef = useRef(0);
  
  const sqlWorkspaceRef = useRef<HTMLDivElement>(null);
  const sqlLeftColRef = useRef<HTMLDivElement>(null);

  const handleSqlColDown = (e: React.PointerEvent) => { setIsColDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  const handleSqlRowDown = (e: React.PointerEvent) => { setIsRowDragging(true); e.currentTarget.setPointerCapture(e.pointerId); };
  
  const handleSqlMove = (e: React.PointerEvent) => {
    if (isColDragging && sqlWorkspaceRef.current) {
       const { left, width } = sqlWorkspaceRef.current.getBoundingClientRect();
       if (window.innerWidth < 1024) return;
       let newRatio = ((e.clientX - left) / width) * 100;
       newRatio = Math.max(30, Math.min(80, newRatio));
       setLeftColumnRatio(newRatio);
    } else if (isRowDragging && sqlLeftColRef.current) {
       const { top, height } = sqlLeftColRef.current.getBoundingClientRect();
       let newRatio = ((e.clientY - top) / height) * 100;
       newRatio = Math.max(20, Math.min(80, newRatio));
       setTopRowRatio(newRatio);
    }
  };
  
  const handleSqlUp = (e: React.PointerEvent) => {
    setIsColDragging(false);
    setIsRowDragging(false);
    if(e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [suggestions, setSuggestions] = useState<
    { label: string; query: string }[]
  >([]);
  const [showTutorial, setShowTutorial] = useState(false);

  const [activeTab, setActiveTab] = useState<"teach" | "snippets" | "ai">("teach");
  const [messages, setMessages] = useState<{ role: string; content: any }[]>([
    {
      role: "assistant",
      content:
        "Hi! I am your AI SQL tutor. Ask me a question or tell me what to write for you!" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRunText, setAutoRunText] = useState("Executing Query...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading, activeTab]);

  useEffect(() => {
    const updateLayoutMode = () => setIsMobileLayout(window.innerWidth < 1024);
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) setAttachedImage(event.target.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) setAttachedImage(event.target.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       const reader = new FileReader();
       reader.onload = (event) => {
         if (event.target?.result) setAttachedImage(event.target.result as string);
       };
       reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() && !attachedImage) return;

    let userContent: any = chatInput;
    if (attachedImage) {
      userContent = [];
      if (chatInput.trim()) {
        userContent.push({ type: "text", text: chatInput });
      }
      userContent.push({
        type: "image_url",
        image_url: { url: attachedImage } });
    }

    const newMsg = { role: "user", content: userContent };
    
    // Check if any history or current message has images
    const hasAnyImages = messages.some((m: any) => Array.isArray(m.content)) || !!attachedImage;

    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");
    setAttachedImage(null);
    setIsAiLoading(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI tutor. You can get a free key from console.groq.com." },
        ]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt =
        `You are an expert SQL database tutor for students. Help them learn SQL. Keep explanations concise.
If the student greets you, jokes casually, says thanks, or asks a normal non-code question, respond naturally and briefly. Do not force a SQL lesson or code sample unless they ask for one.
If the user's intent is unclear, ask one short clarifying question.
If the user asks you to write code for a SINGLE question, provide it inside \`\`\`sql ... \`\`\` blocks so the app can extract and inject it into the editor.
IMPORTANT: If you provide an INSERT statement, you MUST append a \`SELECT * FROM <table_name>;\` statement at the end of the sql block so the user can see the newly inserted data.
CRITICAL: If the user uploads an image with multiple questions (like an assignment) or asks MULTIPLE questions at once, you MUST group them and return a JSON block exactly like this:
\`\`\`json
{
  "questions": [
    { "title": "1. Find all users", "sql": "SELECT * FROM users;" },
    { "title": "2. Insert user", "sql": "INSERT INTO users (name) VALUES ('John');\\nSELECT * FROM users;" }
  ]
}
\`\`\`
Return ONLY the json block when multiple questions are provided.
`;

      // One shared list — see services/groq.ts. No model on this account reads
      // images, so an attachment is described by the learner, not analysed.
      const modelsToTry = GROQ_MODELS;

      let data: any = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}` },
              body: JSON.stringify({
                model: model,
                ...groqReasoningParams(model),
                messages: [
                  { role: "system", content: systemPrompt },
                  ...messages.map((m) => ({
                    role: m.role,
                    content: m.content })),
                  newMsg,
                ],
                temperature: 0.7,
                max_tokens: 1024 }) },
          );

          data = await response.json();
          if (!data.error) {
            break; // Success!
          } else {
            lastError = new Error(data.error.message || "API Error");
          }
        } catch (e: any) {
          lastError = e;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error("All models failed to respond.");
      }

      let aiText = data.choices[0].message.content || "";
      
      let extractedSql = "";
      try {
        const jsonMatch = aiText.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[1]);
          if (parsed.questions && parsed.questions.length > 0) {
            extractedSql = parsed.questions.map((q: any) => `-- ${q.title}\n${q.sql}`).join("\n\n");
          }
        } else {
          const sqlMatch = aiText.match(/```sql\s*([\s\S]*?)\s*```/);
          if (sqlMatch) {
            extractedSql = sqlMatch[1].trim();
          }
        }
      } catch (e) {}

      setIsAiLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      
      let currentText = "";
      const chunkSize = Math.max(1, Math.floor(aiText.length / 30)); 
      for (let i = 0; i < aiText.length; i += chunkSize) {
        currentText += aiText.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentText;
          return newMessages;
        });
        await new Promise(r => setTimeout(r, 15));
      }
      
      setMessages((prev) => {
         const newMessages = [...prev];
         newMessages[newMessages.length - 1].content = aiText;
         return newMessages;
      });

      if (extractedSql && autoRunCommands) {
         handleSnippetClick(extractedSql, true);
      }

    } catch (e: any) {
      setIsAiLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${e.message}` },
      ]);
    }
  };

  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const snippetData = [
    {
      title: "Create a Database",
      description: "Learn how to create a new database.",
      code: `-- Create a new database\nCREATE DATABASE school_db;\n\n-- Select it to use\nUSE school_db;` },
    {
      title: "Create a Simple Table",
      description: "Create a basic table without keys.",
      code: `-- Create a students table\nCREATE TABLE students (\n    first_name VARCHAR(50),\n    last_name VARCHAR(50),\n    age INT\n);` },
    {
      title: "Primary Key & Auto-Increment",
      description: "Create a table with a unique, auto-incrementing ID.",
      code: `-- Creating a table with Primary Key\nCREATE TABLE employees (\n    -- id will automatically increase (1, 2, 3...)\n    id INT AUTO_INCREMENT,\n    name VARCHAR(100),\n    role VARCHAR(50),\n    -- Set id as Primary Key\n    PRIMARY KEY (id)\n);` },
    {
      title: "Link Two Tables (Foreign Key)",
      description: "Establish relationships between tables.",
      code: `-- 1. Publishers Table\nCREATE TABLE publishers (\n    pub_id INT AUTO_INCREMENT PRIMARY KEY,\n    name VARCHAR(100)\n);\n\n-- 2. Books Table with a Foreign Key\nCREATE TABLE books (\n    book_id INT AUTO_INCREMENT PRIMARY KEY,\n    title VARCHAR(150),\n    -- Column to hold publisher's ID\n    publisher_id INT,\n    -- Create the link\n    FOREIGN KEY (publisher_id) REFERENCES publishers(pub_id)\n);` },
    {
      title: "Create a View",
      description: "Save a complex query as a virtual table.",
      code: `-- Create a View to see only adult students\nCREATE VIEW AdultStudents AS\nSELECT * FROM students \nWHERE age >= 18;\n\n-- Now query the view like a normal table\nSELECT * FROM AdultStudents;` },
    {
      title: "Create User & Permissions",
      description: "Manage database users and their access.",
      code: `-- Create a new user with a password\nCREATE USER 'teacher_bob'@'localhost' IDENTIFIED BY 'securepass123';\n\n-- Grant SELECT (read) permission on school_db\nGRANT SELECT ON school_db.* TO 'teacher_bob'@'localhost';\n\n-- To remove permissions:\n-- REVOKE SELECT ON school_db.* FROM 'teacher_bob'@'localhost';` },
    {
      title: "Find Names Starting with 'T'",
      description: "Use LIKE operator with wildcards.",
      code: `-- Find all staff whose name starts with 'T'\nSELECT * FROM staff\nWHERE name LIKE 'T%';\n\n-- '%T' means ends with T\n-- '%T%' means contains T` },
    {
      title: "Filter by Date & Numeric ranges",
      description: "Combine multiple conditions using operators.",
      code: `-- Find employees with salary > 50000\nSELECT name, DOB, salary \nFROM employees\nWHERE DOB > '1990-01-01' \n  AND salary > 50000;` },
    {
      title: "Grouping Data (Aggregate)",
      description: "Calculate SUM, COUNT, or AVG per category.",
      code: `-- Calculate average salary per department\nSELECT department, AVG(salary) as average_salary, COUNT(*) as employee_count\nFROM employees\nGROUP BY department;` },
    {
      title: "Update Existing Records",
      description: "Modify data safely with a WHERE condition.",
      code: `-- Increase salary by 10% for the 'IT' department\nUPDATE employees\nSET salary = salary * 1.10\nWHERE department = 'IT';` },
  ];

  const handleSnippetClick = async (snippet: string, autoRun = false) => {
    if (autoRun) {
      setActiveMobileTab("code");
    }
    setIsTyping(true);
    setTypingMessage(autoRun ? "Auto-generating code..." : "Loading instructions...");
    queryRef.current = "";
    setQuery("");
    setHasExecuted(false);

    await new Promise((r) => setTimeout(r, 300));
    setTypingMessage("Putting code into the editor...");

    let currentCode = "";
    const step = autoRun ? 5 : 2;
    await new Promise((r) => setTimeout(r, 200));
    setTypingMessage("");

    for (let i = 0; i < snippet.length; i += step) {
      currentCode += snippet.slice(i, i + step);
      queryRef.current = currentCode;
      setQuery(currentCode);
      await new Promise((r) => setTimeout(r, 10));
    }
    queryRef.current = snippet;
    setQuery(snippet);
    setIsTyping(false);

    if (autoRun) {
      handleGo(true);
    }
  };

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenSQLPracticeTutorial");
    if (!hasSeenTutorial) {
      setShowTutorial(true);
      const timer = setTimeout(() => {
        setShowTutorial(false);
        localStorage.setItem("hasSeenSQLPracticeTutorial", "true");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("hasSeenSQLPracticeTutorial", "true");
  };

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleGo = (isAuto = false) => {
    const sqlToRun = queryRef.current;
    if (!sqlToRun.trim()) return;

    if (!isAuto) {
      setActiveMobileTab("code");
    }

    setAutoRunText(isAuto ? "Auto running the query..." : "Executing Query...");
    setIsExecuting(true);
    setHasExecuted(false);

    // Simulate slight delay for loader (feels more professional and gives UI time to paint)
    setTimeout(() => {
      try {
        const engine = SQLEngine.getInstance();
        const startTime = performance.now();

        const statements = sqlToRun
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);
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
          let newSuggestions: { label: string; query: string }[] = [];
          if (typeof lastResult === "number" || lastResult === 1) {
            // It's a DML/DDL that succeeded without returning rows. Let's try to show the table if we can guess it.
            const createMatch = sqlToRun.match(
              /CREATE\s+TABLE\s+`?([a-zA-Z0-9_]+)`?/i,
            );
            const insertMatch = sqlToRun.match(
              /INSERT\s+INTO\s+`?([a-zA-Z0-9_]+)`?/i,
            );
            const tblName = createMatch
              ? createMatch[1]
              : insertMatch
                ? insertMatch[1]
                : null;
            if (tblName) {
              const finalRes = engine.execute(`SELECT * FROM ${tblName}`);
              if (finalRes.success) {
                lastResult = finalRes.data;
                lastColumns = finalRes.columns;
              }
              newSuggestions.push({
                label: "View Table",
                query: `SELECT * FROM ${tblName};` });
              if (createMatch) {
                newSuggestions.push({
                  label: "Insert Row",
                  query: `INSERT INTO ${tblName} VALUES (...);` });
              } else if (insertMatch) {
                newSuggestions.push({
                  label: "Insert Another Row",
                  query: `INSERT INTO ${tblName} VALUES (...);` });
                newSuggestions.push({
                  label: "Filter Rows",
                  query: `SELECT * FROM ${tblName} WHERE ...;` });
              }
            } else {
              lastResult = [];
            }
          } else {
            const selectMatch = sqlToRun.match(/FROM\s+`?([a-zA-Z0-9_]+)`?/i);
            if (
              selectMatch &&
              Array.isArray(lastResult) &&
              lastResult.length > 0
            ) {
              newSuggestions.push({
                label: "Count Rows",
                query: `SELECT COUNT(*) FROM ${selectMatch[1]};` });
              newSuggestions.push({
                label: "Add Filter",
                query: `SELECT * FROM ${selectMatch[1]} WHERE ...;` });
            } else {
              newSuggestions.push({
                label: "Show Tables",
                query: `SHOW TABLES;` });
            }
          }
          setSuggestions(newSuggestions);
          res.data = lastResult;
          res.columns = lastColumns;
        }

        setResult({ ...res, executionTime });
      } catch (err: any) {
        setResult({
          success: false,
          error: err.message || String(err),
          data: [] });
      } finally {
        setHasExecuted(true);
        setIsExecuting(false);
      }
    }, 400); // Animation delay
  };

  const handleEditorChange = (value: string | undefined) => {
    const nextQuery = value || "";
    queryRef.current = nextQuery;
    setQuery(nextQuery);
    setHasExecuted(false);
    setResult({ success: true, data: [] });
    setSuggestions([]);
  };

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      // Configure editor settings if needed on load
    }
  }, [monaco]);

  /* ---- Teach me: the narrated lesson drives the console through these ---- */

  const clearEditor = useCallback(() => {
    typingRunRef.current += 1;
    queryRef.current = "";
    setQuery("");
    setHasExecuted(false);
    setResult({ success: true, data: [] });
    setSuggestions([]);
  }, []);

  /**
   * Types SQL out at a human pace rather than pasting it, so the learner can
   * read the command being built while the narrator describes it.
   *
   * About thirty characters a second — roughly a confident typist, and slow
   * enough to follow a line of SQL as it appears. Long blocks speed up just
   * enough to still land inside their clip.
   */
  const typeIntoEditor = useCallback((code: string) => {
    typingRunRef.current += 1;
    const runId = typingRunRef.current;
    queryRef.current = "";
    setQuery("");

    const TICK_MS = 24;
    const MS_PER_CHARACTER = 33;
    const targetMs = Math.min(14000, Math.max(1200, code.length * MS_PER_CHARACTER));
    const step = Math.max(1, Math.ceil(code.length / (targetMs / TICK_MS)));

    let index = 0;
    const tick = () => {
      if (typingRunRef.current !== runId) return;
      index = Math.min(code.length, index + step);
      const next = code.slice(0, index);
      queryRef.current = next;
      setQuery(next);
      if (index < code.length) window.setTimeout(tick, TICK_MS);
    };
    tick();
  }, []);

  /**
   * Runs a lesson's setup data without putting it in the editor. Each lesson
   * rebuilds the tables it needs this way, so lessons can be taken in any order
   * and replayed as often as the learner likes.
   */
  const runSilently = useCallback((sql: string) => {
    const engine = SQLEngine.getInstance();
    sql
      .split(";")
      .map((statement) => statement.trim())
      .filter(Boolean)
      .forEach((statement) => {
        // A setup statement that fails (dropping a table that was never there)
        // is expected and must not stop the rest of the setup.
        engine.execute(statement);
      });
  }, []);

  // handleGo is re-created every render; the lesson holds it through a ref so
  // its cue callbacks always press the current Run button.
  const handleGoRef = useRef(handleGo);
  handleGoRef.current = handleGo;

  /**
   * Lights a fragment of the SQL inside the editor while the narrator talks
   * about it — the two dashes of a comment, the words SHOW TABLES, the comma
   * that should not be there.
   *
   * The SQL is still being typed out when some of these cues fire, so a search
   * that finds nothing is retried a few times rather than silently doing
   * nothing.
   */
  const markCode = useCallback((find: string | null) => {
    markAttemptRef.current += 1;
    const attemptId = markAttemptRef.current;

    const apply = (remaining: number) => {
      if (markAttemptRef.current !== attemptId) return;
      const editor = editorRef.current;
      const model = editor?.getModel?.();
      if (!editor || !model) return;

      if (!find) {
        markDecorationsRef.current = editor.deltaDecorations(markDecorationsRef.current, []);
        return;
      }

      const matches = model.findMatches(find, false, false, false, null, false);
      if (matches.length === 0) {
        // Still mid-typing — look again shortly.
        if (remaining > 0) window.setTimeout(() => apply(remaining - 1), 220);
        return;
      }

      markDecorationsRef.current = editor.deltaDecorations(
        markDecorationsRef.current,
        matches.map((match: any) => ({
          range: match.range,
          options: { inlineClassName: "teach-code-mark", overviewRuler: null },
        })),
      );
      editor.revealLineInCenterIfOutsideViewport?.(matches[0].range.startLineNumber);
    };

    apply(8);
  }, []);

  const teachActions = useMemo<TeachMeActions>(
    () => ({
      typeCode: typeIntoEditor,
      clearCode: clearEditor,
      runCode: () => handleGoRef.current(true),
      runSilently,
      markCode,
      showCode: () => setActiveMobileTab("code"),
    }),
    [clearEditor, markCode, runSilently, typeIntoEditor],
  );

  const teach = useSqlTeachMe(teachActions);
  const teachRunning = teach.phase === "playing" || teach.phase === "paused";
  const spotlight = teach.spotlight;

  useEffect(() => {
    document.body.classList.toggle("teach-lesson-running", teachRunning);
    return () => document.body.classList.remove("teach-lesson-running");
  }, [teachRunning]);

  const openTeachMe = () => {
    setActiveTab("teach");
    setActiveMobileTab("teach");
  };

  const isResultOpen = hasExecuted || isExecuting;
  const codeTabStatus = isExecuting
    ? "Running..."
    : hasExecuted
      ? result.success
        ? "Ran"
        : "Error"
      : "";
  const codeTabStatusColor = isExecuting
    ? "bg-amber-500"
    : hasExecuted
      ? result.success
        ? "bg-emerald-500"
        : "bg-red-500"
      : "bg-slate-400";
  const mobileEditorBasis = !isResultOpen ? "100%" : hasExecuted && !result.success ? "55%" : "65%";
  const mobileResultBasis = !isResultOpen ? "0%" : hasExecuted && !result.success ? "45%" : "35%";

  const handleDownloadCSV = () => {
    if (
      !result.success ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    )
      return;

    const keys = Object.keys(result.data[0]);
    const csvContent = [
      keys.join(","),
      ...result.data.map((row: any) =>
        keys
          .map((k) => {
            let val =
              row[k] === null || row[k] === undefined ? "" : String(row[k]);
            return `"${val.replace(/"/g, '""')}"`;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "query_result.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}
    >
      <style>{teachSpotlightStyles}</style>

      {/* Top Navbar */}
      <div
        className={`h-14 border-b flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 shadow-sm ${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {onBack && (
            <button
              onClick={onBack}
              className={`p-1.5 rounded-md shrink-0 transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-sm sm:text-lg tracking-tight truncate max-w-[52vw] sm:max-w-none">
              <span className="sm:hidden">SQL Console</span>
              <span className="hidden sm:inline">SQL Console Environment</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <TeachMeButton
            onClick={openTeachMe}
            isActive={activeTab === "teach" && teachRunning}
            isDarkMode={isDarkMode}
          />
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-md ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"} transition-colors`}
            title="Toggle Theme"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div 
        ref={sqlWorkspaceRef}
        data-teach-target="screen"
        onPointerMove={handleSqlMove}
        onPointerUp={handleSqlUp}
        onPointerLeave={handleSqlUp}
        className="flex-1 flex overflow-hidden lg:flex-row flex-col pb-[72px] lg:pb-0"
      >
        <div className="flex w-full h-full relative lg:flex-row flex-col">
          <div 
            ref={sqlLeftColRef}
            className={`${activeMobileTab === "code" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full ${
              // Reserve the strip the caption bar sits in, so it never covers
              // the Run button the narrator is telling the learner to watch.
              teachRunning ? "pb-[124px]" : ""
            }`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : { flexBasis: `${leftColumnRatio}%`, flexGrow: 0, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
            }
          >
            {/* Editor Section */}
            <div
              className={`flex flex-col overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.05)] ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
              style={
                isMobileLayout
                  ? { flexBasis: mobileEditorBasis, flexGrow: 0, transition: "flex-basis 0.25s ease" }
                  : { flexBasis: hasExecuted ? `${topRowRatio}%` : '100%', flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
              }
            >
              <div
                className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 border-b shrink-0 ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Database className="w-4 h-4 text-indigo-500 shrink-0 lg:hidden" />
                  <span
                    className={`hidden lg:flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-indigo-600`}
                  >
                    1
                  </span>
                  <h2 className="text-sm font-semibold tracking-wide truncate">
                    <span className="lg:hidden">Code</span>
                    <span className="hidden lg:inline">Write SQL Query</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`hidden lg:block ml-2 px-1.5 py-0.5 rounded text-[10px] font-mono border ${isDarkMode ? "border-gray-600 text-gray-400 bg-gray-800" : "border-gray-200 text-gray-500 bg-white"}`}
                  >
                    Ctrl-Enter / Cmd-Enter to Run
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasExecuted((prev) => !prev)}
                    className={`lg:hidden p-2 rounded-md border transition-colors ${
                      hasExecuted
                        ? isDarkMode
                          ? "bg-sky-950/40 border-sky-800 text-sky-300"
                          : "bg-sky-50 border-sky-200 text-sky-700"
                        : isDarkMode
                          ? "bg-[#333] border-[#555] text-gray-200"
                          : "bg-white border-gray-300 text-gray-700 shadow-sm"
                    }`}
                    title={hasExecuted ? "Hide output" : "Show output"}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo()}
                    disabled={isExecuting || !query.trim()}
                    className={`lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all active:scale-95 ${
                      isExecuting || !query.trim()
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white shadow"
                    }`}
                  >
                    {isExecuting ? <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    Run
                  </button>
                </div>
              </div>

              <div
                data-teach-target="editor"
                className={`relative flex-1 min-h-0 bg-[#fffffe] dark:bg-[#1e1e1e] ${
                  spotlight === "editor" || spotlight === "screen" ? "teach-spotlight" : ""
                }`}
              >
                <Editor
                  height="100%"
                  language="sql"
                  theme={isDarkMode ? "vs-dark" : "light"}
                  value={query}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily:
                      "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
                    wordWrap: "on",
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                    lineNumbersMinChars: 3 }}
                  onMount={(editor, monacoInstance) => {
                    editorRef.current = editor;
                    editor.addCommand(
                      monacoInstance.KeyMod.CtrlCmd |
                        monacoInstance.KeyCode.Enter,
                      () => {
                        handleGo();
                      },
                    );
                  }}
                />

              </div>

              <div
                className={`px-4 py-3 flex flex-wrap items-center justify-between shrink-0 gap-3 ${isDarkMode ? "bg-[#252526]" : "bg-[#f8f9fa] border-t border-gray-200"}`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div
                    data-teach-target="run"
                    className={`relative ${spotlight === "run" ? "teach-spotlight" : ""}`}
                  >
                    <button
                      onClick={() => handleGo()}
                      disabled={isExecuting || !query.trim()}
                      className={`relative z-10 flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-sm transition-all ${
                        isExecuting || !query.trim()
                          ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:shadow-md active:scale-[0.98]"
                      }`}
                    >
                      {isExecuting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          {autoRunText}
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-current" />
                          Run
                        </>
                      )}
                    </button>
  
                    {showTutorial && !isExecuting && query.trim() && (
                      <div className="absolute -top-14 left-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg shadow-indigo-600/30 flex items-center gap-2 z-50 animate-bounce whitespace-nowrap">
                        <Lightbulb size={12} fill="currentColor" /> Click to
                        execute!
                        <button
                          onClick={dismissTutorial}
                          className="ml-1 opacity-70 hover:opacity-100 transition-opacity p-0.5"
                        >
                          <X size={10} />
                        </button>
                        {/* Triangle pointer */}
                        <div className="absolute -bottom-1 left-6 w-2 h-2 bg-indigo-600 rotate-45"></div>
                      </div>
                    )}
                  </div>
  
                  {hasExecuted && (
                    <div className="flex items-center">
                      {result.success ? (
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border hidden lg:flex ${isDarkMode ? "bg-purple-900/20 text-purple-400 border-purple-800" : "bg-purple-50 text-purple-700 border-purple-200"}`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {Array.isArray(result.data)
                            ? `${result.data.length} rows returned. Executed in ${result.executionTime} ms.`
                            : `Executed successfully in ${result.executionTime} ms.`}
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border hidden lg:flex ${isDarkMode ? "bg-red-900/20 text-red-400 border-red-800" : "bg-[#ff7400]/10 text-red-700 border-red-200"}`}
                        >
                          <AlertCircle className="w-3.5 h-3.5" />
                          Error executing query ({result.executionTime} ms)
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {hasExecuted && (
                   <div className="flex items-center gap-2">
                   {result.success &&
                     Array.isArray(result.data) &&
                     result.data.length > 0 && (
                       <button
                         onClick={handleDownloadCSV}
                         className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded border transition-colors ${
                           isDarkMode
                             ? "bg-[#333] border-[#555] text-gray-200 hover:bg-[#444]"
                             : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                         }`}
                         title="Download Output (CSV)"
                       >
                         <Download className="w-3.5 h-3.5" />
                         Download CSV
                       </button>
                     )}
                     <button
                         onClick={() => setHasExecuted(false)}
                         className={`p-2 rounded-md transition-colors ${
                           isDarkMode
                             ? "bg-[#1e1e1e] border border-[#404040] text-gray-400 hover:bg-[#333] hover:text-white"
                             : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm"
                         }`}
                         title="Minimize output"
                       >
                         <X className="w-4 h-4" />
                     </button>
                 </div>
                )}
              </div>
            </div>

            {/* Result Section */}
            {hasExecuted && (
                <div
                  className={`hidden lg:flex items-center justify-center relative z-20 cursor-row-resize ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-full h-2 group hover:bg-purple-500 active:bg-purple-600 transition-colors border-y ${isDarkMode ? 'border-[#404040]' : 'border-gray-300'}`}
                  onPointerDown={handleSqlRowDown}
                >
                  <div className={`w-8 h-1 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-purple-300`} />
                </div>
            )}
            <div
              data-teach-target="result"
              className={`flex flex-col border-t shrink-0 ${isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"} ${
                spotlight === "result" ? "teach-spotlight" : ""
              }`}
              style={
                isMobileLayout
                  ? { flexBasis: mobileResultBasis, opacity: hasExecuted || isExecuting ? 1 : 0, overflow: hasExecuted || isExecuting ? "hidden" : "hidden", flexGrow: 0, transition: "flex-basis 0.25s ease, opacity 0.25s ease" }
                  : { flexBasis: isResultOpen ? `${100 - topRowRatio}%` : '0%', opacity: isResultOpen ? 1 : 0, overflow: isResultOpen ? 'visible' : 'hidden', flexGrow: 0, transition: isRowDragging ? 'none' : 'flex-basis 0.3s ease-in-out, opacity 0.3s' }
              }
            >
              <div
                className={`px-4 py-3 flex items-center gap-4 border-b flex-wrap ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}`}
              >
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-indigo-600`}
                  >
                    2
                  </span>
                  <h2 className="text-sm font-semibold tracking-wide">
                    Query Result
                  </h2>
                </div>

                {suggestions.length > 0 && result.success && (
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0 px-2 lg:px-4">
                    <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1 shrink-0">
                      <Lightbulb size={12} /> Suggestions:
                    </span>
                    <div className="flex items-center gap-2 flex-wrap"> 
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setQuery(s.query);
                          }}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            isDarkMode
                              ? "bg-[#1e1e1e] border-[#404040] text-indigo-400 hover:bg-[#333] hover:text-indigo-300"
                              : "bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm"
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative flex-1 min-h-0 overflow-auto custom-scrollbar">
                {isExecuting ? (
                  <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3 text-center">
                    <div className="w-9 h-9 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                      {autoRunText}
                    </span>
                  </div>
                ) : !result.success ? (
                  <div className="p-6">
                    <div
                      className={`p-4 rounded-lg border flex gap-3 ${isDarkMode ? "bg-[#ff7400]/10 border-red-900/50 text-red-400" : "bg-[#ff7400]/10 border-red-200 text-red-700"}`}
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm mb-1">SQL Error</h3>
                        <p className="text-sm font-mono whitespace-pre-wrap">
                          {result.error}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : Array.isArray(result.data) ? (
                  result.data.length > 0 ||
                  (result.columns && result.columns.length > 0) ? (
                    <table className="w-full text-left text-sm border-collapse rounded-xl overflow-hidden shadow-sm ring-1 ring-purple-200 dark:ring-purple-500/20">
                      <thead
                        className={`sticky top-0 z-10`}
                      >
                        <tr>
                          {(result.data.length > 0
                            ? Object.keys(result.data[0] || {})
                            : result.columns || []
                          ).map((col: string, idx: number) => (
                            <th
                              key={idx}
                              className={`px-4 py-3 font-semibold uppercase tracking-wider text-[11px] whitespace-nowrap border-b border-r last:border-r-0 ${
                                isDarkMode
                                  ? "bg-[#1E1B2E] text-purple-300 border-purple-500/30"
                                  : "bg-purple-100 text-purple-800 border-purple-200"
                              }`}
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-100 dark:divide-purple-500/20">
                        {result.data.length > 0 ? (
                          result.data.map((row: any, idx: number) => (
                            <tr
                              key={idx}
                              className={`transition-colors ${
                                isDarkMode
                                  ? "bg-[#161b22] hover:bg-[#252238] even:bg-[#1A1829]"
                                  : "bg-white hover:bg-purple-50 even:bg-[#faf5ff]"
                              }`}
                            >
                              {Object.values(row).map(
                                (val: any, vIdx: number) => (
                                  <td
                                    key={vIdx}
                                    className={`px-4 py-2.5 whitespace-nowrap border-r last:border-r-0 ${
                                      isDarkMode
                                        ? "text-gray-300 border-purple-500/10"
                                        : "text-gray-700 border-purple-100"
                                    }`}
                                  >
                                    {val !== null && val !== undefined ? (
                                      <span
                                        className={
                                          typeof val === "number"
                                            ? "text-purple-600 dark:text-purple-400 font-mono font-medium"
                                            : ""
                                        }
                                      >
                                        {String(val)}
                                      </span>
                                    ) : (
                                      <span className="text-purple-400/50 dark:text-purple-600/50 italic text-xs">
                                        NULL
                                      </span>
                                    )}
                                  </td>
                                ),
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={(result.columns || []).length}
                              className="px-4 py-8 text-center text-purple-500 dark:text-purple-400 italic"
                            >
                              0 rows returned
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-gray-500 dark:text-gray-400">
                      <Database className="w-8 h-8 mb-3 opacity-20" />
                      <p>Query returned 0 rows.</p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-purple-600 dark:text-purple-400">
                    <CheckCircle className="w-8 h-8 mb-3 opacity-50" />
                    <p className="font-medium">Query executed successfully.</p>
                  </div>
                )}
              </div>
            </div>

            <TeachMeCaptionBar controller={teach} isDarkMode={isDarkMode} />
          </div>

          {/* Right Sidebar: Tabs */}
          
          <div
             className={`hidden lg:flex items-center justify-center relative z-30 cursor-col-resize ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-200'} w-2 h-full group hover:bg-purple-500 active:bg-purple-600 transition-colors border-x ${isDarkMode ? 'border-[#404040]' : 'border-gray-300'}`}
             onPointerDown={handleSqlColDown}
          >
              <div className={`w-1 h-8 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} group-hover:bg-purple-300`} />
          </div>

          <div
             className={`${activeMobileTab === "chat" || activeMobileTab === "teach" ? "flex mobile-tab-panel" : "hidden"} lg:flex w-full flex-shrink-0 flex-col h-full border-l ${isDarkMode ? "bg-[#1e1e1e] border-[#404040] text-gray-300" : "bg-white border-gray-200 text-gray-700"}`}
             style={
               isMobileLayout
                 ? { flexBasis: "auto", flexGrow: 1 }
                 : { flexBasis: `${100 - leftColumnRatio}%`, flexGrow: 0, transition: isColDragging ? 'none' : 'flex-basis 0.3s ease-in-out' }
             }
          >
            {/* Tabs Header */}
            <div
              className={`flex border-b ${isDarkMode ? "border-[#404040]" : "border-gray-200"}`}
            >
              <button
                onClick={() => setActiveTab("teach")}
                className={`flex-1 py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border-b-2 ${activeTab === "teach" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <GraduationCap className="w-4 h-4" /> Teach me
              </button>
              <button
                onClick={() => setActiveTab("snippets")}
                className={`flex-1 py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border-b-2 ${activeTab === "snippets" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <Lightbulb className="w-4 h-4" /> Snippets
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={`flex-1 py-3 px-2 sm:px-4 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border-b-2 ${activeTab === "ai" ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400" : "border-transparent opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"}`}
              >
                <Bot className="w-4 h-4" /> AI tutor
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 no-scrollbar flex flex-col gap-4 relative min-h-[400px]">
              {activeTab === "teach" ? (
                <TeachMePanel controller={teach} isDarkMode={isDarkMode} />
              ) : activeTab === "snippets" ? (
                <>
                  {isTyping && (
                    <div
                      className={`p-4 rounded-xl text-center text-sm font-semibold animate-pulse border ${isDarkMode ? "bg-indigo-900/40 text-blue-300 border-indigo-700" : "bg-blue-50 text-blue-600 border-blue-200"}`}
                    >
                      {typingMessage || "Typing..."}
                    </div>
                  )}

                  {!isTyping &&
                    snippetData.map((snippet, idx) => {
                      const icons = [Database, Table, Key, Link2, Eye, Users, Type, Calendar, BarChart2, Edit];
                      const Icon = icons[idx % icons.length];
                      
                      const colors = [
                        { bg: 'bg-purple-100', text: 'text-purple-600', darkBg: 'bg-indigo-900/40', darkText: 'text-fuchsia-400' },
                        { bg: 'bg-blue-100', text: 'text-blue-600', darkBg: 'bg-blue-900/40', darkText: 'text-blue-400' },
                        { bg: 'bg-emerald-100', text: 'text-emerald-600', darkBg: 'bg-emerald-900/40', darkText: 'text-emerald-400' },
                        { bg: 'bg-pink-100', text: 'text-pink-600', darkBg: 'bg-fuchsia-900/40', darkText: 'text-fuchsia-400' },
                        { bg: 'bg-amber-100', text: 'text-amber-600', darkBg: 'bg-amber-900/40', darkText: 'text-amber-400' },
                        { bg: 'bg-teal-100', text: 'text-teal-600', darkBg: 'bg-teal-900/40', darkText: 'text-teal-400' },
                        { bg: 'bg-indigo-100', text: 'text-indigo-600', darkBg: 'bg-indigo-900/40', darkText: 'text-indigo-400' },
                        { bg: 'bg-sky-100', text: 'text-sky-600', darkBg: 'bg-sky-900/40', darkText: 'text-sky-400' },
                        { bg: 'bg-green-100', text: 'text-green-600', darkBg: 'bg-green-900/40', darkText: 'text-green-400' },
                        { bg: 'bg-orange-100', text: 'text-orange-600', darkBg: 'bg-orange-900/40', darkText: 'text-orange-400' },
                      ];
                      
                      const color = isDarkMode 
                        ? { bg: colors[idx % colors.length].darkBg, text: colors[idx % colors.length].darkText }
                        : { bg: colors[idx % colors.length].bg, text: colors[idx % colors.length].text };

                      return (
                        <div
                          key={idx}
                          onClick={() => handleSnippetClick(snippet.code)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all hover:-translate-y-1 group flex items-center gap-4 ${
                            isDarkMode
                              ? "bg-[#161b22] border-[#30363d] hover:border-indigo-500"
                              : "bg-white border-gray-200 hover:border-indigo-500 hover:shadow-md"
                          }`}
                        >
                          <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${color.bg} ${color.text}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold text-sm mb-1 truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {snippet.title}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                              {snippet.description}
                            </p>
                          </div>
                          
                          <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${color.text}`} />
                        </div>
                      )
                    })}
                </>
              ) : (
                <div 
                  className={`flex flex-col h-full absolute inset-0 transition-all ${isDarkMode ? 'bg-[#07070b]' : 'bg-indigo-50'} ${isDragging ? (isDarkMode ? 'ring-2 ring-purple-500 ring-inset bg-[#100c20]' : 'ring-2 ring-purple-500 ring-inset bg-indigo-100') : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <style>{customInputStyles}</style>
                  
                  {/* Background grid */}
                  <div className={`grid-bg-ai ${!isDarkMode ? 'opacity-30' : ''}`}></div>
                  
                  {isDragging && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm border-2 border-dashed border-purple-500 m-2 rounded-xl">
                      <div className="text-purple-300 font-semibold flex flex-col items-center gap-2">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        Drop image to attach
                      </div>
                    </div>
                  )}

                  {/* Auto-run Toggle for AI Chat */}
                  <div className={`p-2 flex items-center justify-between z-10 shrink-0 border-b ${isDarkMode ? 'border-purple-500/20 bg-[#07070b]/80' : 'border-purple-200 bg-indigo-50/80'} backdrop-blur-md`}>
                     <div className="flex items-center gap-2 min-w-0">
                       <Bot className="w-4 h-4 text-purple-500 shrink-0" />
                       <span className={`font-semibold text-xs uppercase tracking-wider truncate ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>AI SQL Tutor</span>
                     </div>
                     <label className={`flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>Auto Injection:</span>
                        <input
                          type="checkbox"
                          checked={autoRunCommands}
                          onChange={(e) => setAutoRunCommands(e.target.checked)}
                          className="rounded border-gray-400 checked:bg-pink-500 accent-pink-500 w-3 h-3 cursor-pointer"
                        />
                     </label>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar z-10">
                     {messages.map((m, i) => (
                       <div key={i} className={`flex items-start ${m.role === "user" ? "ml-auto flex-row-reverse gap-3 max-w-[85%]" : "mr-auto max-w-full"}`}>
                         {m.role === "user" && (
                           <div className="w-7 h-7 mt-0.5 rounded-full shrink-0 flex items-center justify-center bg-purple-600 text-white">
                             <User className="w-4 h-4" />
                           </div>
                         )}
                         <div className={
                            m.role === "user"
                              ? `rounded-xl px-3 py-2 text-sm leading-normal chat-text shadow-sm border ${isDarkMode ? "bg-purple-900/40 border-purple-800 text-white" : "bg-purple-50 border-purple-100 text-purple-900"}`
                              : `pt-1 text-sm leading-relaxed chat-text w-full max-w-[72ch] min-w-0 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`
                          }>
                           {m.role === "user" ? (
                             <>
                               {typeof m.content === 'string' ? (
                                   <p className="whitespace-pre-wrap">{m.content}</p>
                               ) : (
                                   <div className="flex flex-col gap-2">
                                     {m.content.map((item: any, idx: number) => {
                                        if (item.type === 'text') return <p key={idx} className="whitespace-pre-wrap">{item.text}</p>;
                                        if (item.type === 'image_url') return <img key={idx} src={item.image_url.url} alt="Uploaded" className="rounded-lg max-w-full h-auto max-h-48 object-contain border border-white/20 bg-black/20" />;
                                        return null;
                                     })}
                                   </div>
                               )}
                             </>
                           ) : (
                             <div className={`markdown-body prose-chat ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                               <ReactMarkdown
                                 components={{
                                   p({ children }) {
                                      return <p className="mb-3 last:mb-0 leading-relaxed font-sans">{children}</p>;
                                   },
                                   code(props) {
                                     const { children, className, node, ...rest } = props as any;
                                     const match = /language-(\w+)/.exec(className || "");
                                     const codeString = String(children).replace(/\n$/, "");
                                     
                                     if (match && match[1] === 'json') {
                                       try {
                                         const parsed = JSON.parse(codeString);
                                         if (parsed.questions && Array.isArray(parsed.questions)) {
                                           return (
                                              <div className="flex flex-col gap-2 my-3">
                                                 {parsed.questions.map((q: any, idx: number) => (
                                                   <details key={idx} className={`border rounded-lg overflow-hidden group shadow-sm ${isDarkMode ? 'bg-[#1a1128] border-purple-500/30' : 'bg-purple-50/50 border-purple-200'}`}>
                                                      <summary className={`px-4 py-3 cursor-pointer text-sm font-semibold flex items-center justify-between list-none transition-colors ${isDarkMode ? 'text-purple-200 hover:bg-[#251a3a]' : 'text-purple-900 hover:bg-purple-100/50'}`}>
                                                        <span className="flex items-center gap-2">
                                                            <Database className="w-4 h-4 text-purple-500" />
                                                            {q.title}
                                                        </span>
                                                        <span className={`px-2 py-1 text-[11px] rounded-md border font-medium ${isDarkMode ? 'bg-[#251a3a] border-purple-500/30 text-purple-300' : 'bg-white border-purple-200 text-purple-700'}`}>Click to expand</span>
                                                      </summary>
                                                      <div className={`p-0 border-t ${isDarkMode ? 'border-purple-500/30' : 'border-purple-200'}`}>
                                                         <div className={`flex justify-between items-center px-4 py-2 border-b ${isDarkMode ? 'bg-[#251a3a] border-purple-500/30' : 'bg-white border-purple-200'}`}>
                                                           <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>SQL</span>
                                                           {!autoRunCommands && (
                                                              <button 
                                                                onClick={(e) => { e.preventDefault(); handleSnippetClick(q.sql, true); }}
                                                                className={`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border shadow-sm ${isDarkMode ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 hover:bg-purple-600/40 hover:border-purple-400' : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'}`}
                                                              >
                                                                <Play className={`w-3 h-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-50'}`} /> Auto run
                                                              </button>
                                                           )}
                                                         </div>
                                                         <div className={`p-4 overflow-x-auto text-[13px] ${isDarkMode ? 'bg-[#110b1a]' : 'bg-[#fcfaff]'}`}>
                                                            <SyntaxHighlighter
                                                               {...rest}
                                                               PreTag="div"
                                                               className="!m-0 !p-0 !bg-transparent font-mono leading-relaxed"
                                                               children={q.sql}
                                                               language="sql"
                                                               style={isDarkMode ? vscDarkPlus : vs}
                                                            />
                                                         </div>
                                                      </div>
                                                    </details>
                                                 ))}
                                              </div>
                                           );
                                         }
                                       } catch (e) {}
                                     }

                                     if (match && match[1] === 'sql') {
                                       return (
                                         <div className={`border rounded-xl overflow-hidden my-4 shadow-sm ${isDarkMode ? 'bg-[#1a1128] border-purple-500/30' : 'bg-purple-50/50 border-purple-200'}`}>
                                             <div className={`flex justify-between items-center px-4 py-2 border-b ${isDarkMode ? 'bg-[#251a3a] border-purple-500/30' : 'bg-white border-purple-200'}`}>
                                               <span className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>SQL</span>
                                               {!autoRunCommands && (
                                                  <button 
                                                    onClick={() => handleSnippetClick(codeString, true)}
                                                    className={`flex flex-row items-center gap-1.5 text-xs px-2.5 py-1 rounded-md transition-colors font-medium border shadow-sm ${isDarkMode ? 'bg-purple-600/20 border-purple-500/50 text-purple-200 hover:bg-purple-600/40 hover:border-purple-400' : 'bg-purple-600 text-white border-purple-600 hover:bg-purple-700'}`}
                                                  >
                                                    <Play className={`w-3 h-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-50'}`} /> Auto run
                                                  </button>
                                               )}
                                             </div>
                                             <div className={`p-4 overflow-x-auto text-[13px] ${isDarkMode ? 'bg-[#110b1a]' : 'bg-[#fcfaff]'}`}>
                                                <SyntaxHighlighter
                                                   {...rest}
                                                   PreTag="div"
                                                   className="!m-0 !p-0 !bg-transparent font-mono leading-relaxed"
                                                   children={codeString}
                                                   language={match[1]}
                                                   style={isDarkMode ? vscDarkPlus : vs}
                                                />
                                             </div>
                                          </div>
                                        );
                                     }

                                     return match ? (
                                       <SyntaxHighlighter
                                          {...rest}
                                          PreTag="div"
                                          className="rounded-md !my-2 text-xs"
                                          children={codeString}
                                          language={match[1]}
                                          style={isDarkMode ? vscDarkPlus : vs}
                                       />
                                     ) : (
                                       <code {...rest} className={className + ` ${isDarkMode ? 'bg-black/30 text-[#dfa2da]' : 'bg-purple-100 text-purple-700'} rounded px-1`}>
                                         {children}
                                       </code>
                                     );
                                   } }}
                               >
                                 {m.content}
                               </ReactMarkdown>
                             </div>
                           )}
                         </div>
                       </div>
                     ))}
                     
                     {isAiLoading && (
                       <div className="flex flex-col items-start mb-2">
                           <div className="flex items-end gap-2 mb-1 ml-1">
                             <div className="w-9 h-9 rounded-full bg-[#1c191c] border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_purple] animate-pulse">
                               <Bot className="w-5 h-5 text-purple-400" />
                             </div>
                           </div>
                         <div className="max-w-[85%] rounded-2xl p-4 text-sm flex gap-1 items-center bg-[#18112e]/90 border border-purple-900/40 rounded-bl-none text-gray-200">
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-75"></div>
                            <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-150"></div>
                         </div>
                       </div>
                     )}
                     <div ref={endOfMessagesRef} />
                  </div>
                  
                  <div className="p-4 z-10 flex flex-col gap-2 relative">
                    
                    {attachedImage && (
                        <div className="relative inline-block self-start mb-2 ml-4">
                            <img src={attachedImage} alt="Attachment" className="h-16 rounded-md border border-white/20 object-cover" />
                            <button onClick={() => setAttachedImage(null)} className="absolute -top-2 -right-2 bg-[#ff7400]/100 text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                        </div>
                    )}
                    
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                    
                    <div id="poda">
                      <div className="ai-g"></div>
                      <div className="ai-db"></div>
                      <div className="ai-db"></div>
                      <div className="ai-db"></div>
                      <div className="ai-w"></div>
                      <div className="ai-b"></div>

                      <div id="main">
                        <input 
                           placeholder="Ask Sidemann" 
                           type="text" 
                           name="text" 
                           className={`ai-input font-medium ${!isDarkMode ? "ai-input-light" : ""}`}
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(e); }}
                           onPaste={handlePaste}
                        />
                        <button
                          type="button"
                          onClick={() => handleSendMessage()}
                          disabled={isAiLoading || (!chatInput.trim() && !attachedImage)}
                          className={`absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                            isDarkMode
                              ? "bg-pink-600 text-white hover:bg-pink-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
                              : "bg-pink-600 text-white hover:bg-pink-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                          }`}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TeachSpotlight controller={teach} />
      <TeachWhiteboard controller={teach} isDarkMode={isDarkMode} />

      <div
        className={`lg:hidden fixed left-0 right-0 bottom-0 z-[170] border-t px-4 pt-2 ${
          isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-white border-gray-200"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveMobileTab("code")}
            className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
              activeMobileTab === "code"
                ? isDarkMode
                  ? "bg-indigo-950/40 text-indigo-300"
                  : "bg-indigo-50 text-indigo-700"
                : isDarkMode
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Code</span>
            {(isExecuting || hasExecuted) && (
              <span
                className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isDarkMode ? "bg-white/10 text-gray-200" : "bg-slate-100 text-slate-700"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${codeTabStatusColor} ${isExecuting ? "animate-pulse" : ""}`} />
                {codeTabStatus}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("teach");
              setActiveMobileTab("teach");
            }}
            className={`h-12 rounded-xl flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors ${
              activeMobileTab === "teach"
                ? isDarkMode
                  ? "bg-indigo-950/40 text-indigo-300"
                  : "bg-indigo-50 text-indigo-700"
                : isDarkMode
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Teach
            {teachRunning && (
              <span className="ml-0.5 h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-indigo-500" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("ai");
              setActiveMobileTab("chat");
            }}
            className={`h-12 rounded-xl flex items-center justify-center gap-1.5 text-sm font-semibold transition-colors ${
              activeMobileTab === "chat"
                ? isDarkMode
                  ? "bg-pink-950/40 text-pink-300"
                  : "bg-pink-50 text-pink-700"
                : isDarkMode
                  ? "text-gray-400 hover:bg-white/5"
                  : "text-gray-500 hover:bg-slate-100"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
};

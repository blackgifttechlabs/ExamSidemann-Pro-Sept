import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowLeft,
  CheckCircle,
  Code2,
  AlertCircle,
  Lightbulb,
  X,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Bot,
  Terminal,
  Bookmark,
  RotateCcw,
  Square,
  User,
} from "lucide-react";
import { TeachMeLaunchButton } from "../shared/TeachMeLaunchButton";
import Editor, { useMonaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { CppDiagnostic, runCppCode } from "./cppRunnerApi";
import { GROQ_MODELS, groqReasoningParams } from '../../../../services/groq';
import {
  IDE_PRACTICE_STYLES,
  makeMarkdownComponents,
} from "../shared/idePracticeChrome";

interface Props {
  onBack?: () => void;
}

const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main()
{
    // Declare two numbers
    int num1 = 15;
    int num2 = 25;

    // Add the numbers together
    int sum = num1 + num2;

    // Display the result
    cout << "The sum of " << num1 << " and " << num2 << " is: " << sum << endl;

    return 0;
}`;

interface ConsolePrompt {
  /** What the terminal shows above the input caret. */
  label: string;
  /** The literal the program itself prints, stripped from captured output. */
  raw: string;
}

/**
 * Walks the source for `cin >>` / `getline(cin, ...)` sites so the terminal can
 * collect every value up front and pipe them in as stdin — the compiled binary
 * runs to completion in one shot, it cannot pause and ask mid-run.
 *
 * Each `>>` in a chained read consumes its own whitespace-delimited token, so a
 * statement like `cin >> a >> b;` asks for two values.
 */
const extractConsoleInputPrompts = (code: string): ConsolePrompt[] => {
  const prompts: ConsolePrompt[] = [];
  const inputPattern =
    /(?:std::)?getline\s*\(\s*(?:std::)?cin\b[^;]*;|(?:std::)?cin\s*(?:>>[^;]*)+;/g;
  let previousEnd = 0;
  let match: RegExpExecArray | null;

  while ((match = inputPattern.exec(code)) !== null) {
    const segment = code.slice(previousEnd, match.index);

    // The prompt a student sees is whatever the last cout before the read printed.
    let lastCout = "";
    const coutPattern = /(?:std::)?cout\s*<<[^;]*;/g;
    let coutMatch: RegExpExecArray | null;
    while ((coutMatch = coutPattern.exec(segment)) !== null) {
      lastCout = coutMatch[0];
    }

    let raw = "";
    if (lastCout) {
      const literalPattern = /"((?:\\.|[^"\\])*)"/g;
      let literalMatch: RegExpExecArray | null;
      while ((literalMatch = literalPattern.exec(lastCout)) !== null) {
        raw = literalMatch[1];
      }
    }

    const label = raw
      .replace(/\\n/g, " ")
      .replace(/\\t/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim();

    const statement = match[0];
    const isGetline = /getline/.test(statement);
    const valueCount = isGetline
      ? (statement.match(/getline/g) || []).length
      : (statement.match(/>>/g) || []).length;

    for (let index = 0; index < Math.max(1, valueCount); index += 1) {
      prompts.push({
        label:
          index === 0
            ? label || `Input ${prompts.length + 1}:`
            : `Value ${index + 1}:`,
        raw: index === 0 ? raw.replace(/\\n/g, "\n").replace(/\\"/g, '"') : "",
      });
    }

    previousEnd = inputPattern.lastIndex;
  }

  return prompts;
};

let cppMonacoConfigured = false;

const configureCppMonaco = (monacoInstance: any) => {
  if (!monacoInstance || cppMonacoConfigured) return;

  monacoInstance.editor.defineTheme("sidemann-cpp-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "7C3AED", fontStyle: "bold" },
      { token: "keyword.directive", foreground: "0E7490", fontStyle: "bold" },
      { token: "keyword.directive.include", foreground: "0E7490", fontStyle: "bold" },
      { token: "type.identifier", foreground: "0F766E" },
      { token: "identifier", foreground: "0F172A" },
      { token: "string", foreground: "B45309" },
      { token: "string.include.identifier", foreground: "B45309" },
      { token: "number", foreground: "2563EB" },
      { token: "comment", foreground: "64748B", fontStyle: "italic" },
      { token: "operator", foreground: "DB2777" },
    ],
    colors: {
      "editor.background": "#fffffe",
      "editor.foreground": "#0f172a",
    },
  });

  monacoInstance.editor.defineTheme("sidemann-cpp-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "C084FC", fontStyle: "bold" },
      { token: "keyword.directive", foreground: "22D3EE", fontStyle: "bold" },
      { token: "keyword.directive.include", foreground: "22D3EE", fontStyle: "bold" },
      { token: "type.identifier", foreground: "5EEAD4" },
      { token: "identifier", foreground: "E5E7EB" },
      { token: "string", foreground: "FBBF24" },
      { token: "string.include.identifier", foreground: "FBBF24" },
      { token: "number", foreground: "93C5FD" },
      { token: "comment", foreground: "94A3B8", fontStyle: "italic" },
      { token: "operator", foreground: "F472B6" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#e5e7eb",
    },
  });

  cppMonacoConfigured = true;
};

/**
 * VS Code-style IntelliSense for the subset of C++ these practicals use:
 * standard library calls, container members and the block snippets students
 * type over and over. Registered once per editor and disposed with it.
 */
const registerCppCompletions = (monacoInstance: any) => {
  const snippetRule =
    monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  const Kind = monacoInstance.languages.CompletionItemKind;

  const entries: Array<{
    label: string;
    kind: any;
    insertText: string;
    documentation: string;
    snippet?: boolean;
  }> = [
    {
      label: "#include <iostream>",
      kind: Kind.Module,
      insertText: "#include <iostream>",
      documentation: "Input/output stream library — needed for cout and cin.",
    },
    {
      label: "#include <string>",
      kind: Kind.Module,
      insertText: "#include <string>",
      documentation: "The std::string class.",
    },
    {
      label: "#include <vector>",
      kind: Kind.Module,
      insertText: "#include <vector>",
      documentation: "The std::vector dynamic array.",
    },
    {
      label: "#include <cmath>",
      kind: Kind.Module,
      insertText: "#include <cmath>",
      documentation: "Maths functions: sqrt, pow, abs, round.",
    },
    {
      label: "#include <iomanip>",
      kind: Kind.Module,
      insertText: "#include <iomanip>",
      documentation: "Output formatting: setprecision, setw, fixed.",
    },
    {
      label: "using namespace std;",
      kind: Kind.Keyword,
      insertText: "using namespace std;",
      documentation: "Lets you write cout instead of std::cout.",
    },
    {
      label: "main",
      kind: Kind.Snippet,
      insertText: "int main()\n{\n\t$0\n\n\treturn 0;\n}",
      documentation: "The entry point every C++ program starts from.",
      snippet: true,
    },
    {
      label: "cout",
      kind: Kind.Method,
      insertText: 'cout << ${1:"text"} << endl;',
      documentation: "Writes to the console output stream.",
      snippet: true,
    },
    {
      label: "cin",
      kind: Kind.Method,
      insertText: "cin >> ${1:variable};",
      documentation: "Reads one whitespace-delimited value from the keyboard.",
      snippet: true,
    },
    {
      label: "getline",
      kind: Kind.Method,
      insertText: "getline(cin, ${1:line});",
      documentation: "Reads a whole line, spaces included, into a string.",
      snippet: true,
    },
    {
      label: "endl",
      kind: Kind.Constant,
      insertText: "endl",
      documentation: "Ends the current line and flushes the stream.",
    },
    {
      label: "for",
      kind: Kind.Snippet,
      insertText:
        "for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++)\n{\n\t$0\n}",
      documentation: "Counted loop.",
      snippet: true,
    },
    {
      label: "forrange",
      kind: Kind.Snippet,
      insertText: "for (auto ${1:item} : ${2:collection})\n{\n\t$0\n}",
      documentation: "Range-based for loop over a container.",
      snippet: true,
    },
    {
      label: "while",
      kind: Kind.Snippet,
      insertText: "while (${1:condition})\n{\n\t$0\n}",
      documentation: "Repeats while the condition stays true.",
      snippet: true,
    },
    {
      label: "dowhile",
      kind: Kind.Snippet,
      insertText: "do\n{\n\t$0\n} while (${1:condition});",
      documentation: "Runs the body once, then repeats while true.",
      snippet: true,
    },
    {
      label: "if",
      kind: Kind.Snippet,
      insertText: "if (${1:condition})\n{\n\t$0\n}",
      documentation: "Runs the block when the condition is true.",
      snippet: true,
    },
    {
      label: "ifelse",
      kind: Kind.Snippet,
      insertText: "if (${1:condition})\n{\n\t$2\n}\nelse\n{\n\t$0\n}",
      documentation: "Two-way decision.",
      snippet: true,
    },
    {
      label: "switch",
      kind: Kind.Snippet,
      insertText:
        "switch (${1:value})\n{\n\tcase ${2:1}:\n\t\t$0\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}",
      documentation: "Selects one branch by matching a value.",
      snippet: true,
    },
    {
      label: "class",
      kind: Kind.Snippet,
      insertText:
        "class ${1:Name}\n{\npublic:\n\t${1:Name}()\n\t{\n\t\t$0\n\t}\n};",
      documentation: "Class with a public constructor.",
      snippet: true,
    },
    {
      label: "struct",
      kind: Kind.Snippet,
      insertText: "struct ${1:Name}\n{\n\t$0\n};",
      documentation: "Plain data structure.",
      snippet: true,
    },
    {
      label: "function",
      kind: Kind.Snippet,
      insertText: "${1:int} ${2:name}(${3:int value})\n{\n\t$0\n}",
      documentation: "Free function definition.",
      snippet: true,
    },
    {
      label: "vector",
      kind: Kind.Class,
      insertText: "vector<${1:int}> ${2:items};",
      documentation: "Dynamic array that grows as you push values in.",
      snippet: true,
    },
    {
      label: "string",
      kind: Kind.Class,
      insertText: "string ${1:text} = ${2:\"\"};",
      documentation: "Text variable.",
      snippet: true,
    },
    {
      label: "push_back",
      kind: Kind.Method,
      insertText: "push_back(${1:value})",
      documentation: "Appends a value to the end of a vector.",
      snippet: true,
    },
    {
      label: "size",
      kind: Kind.Method,
      insertText: "size()",
      documentation: "Number of elements currently stored.",
    },
    {
      label: "length",
      kind: Kind.Method,
      insertText: "length()",
      documentation: "Number of characters in a string.",
    },
    {
      label: "sqrt",
      kind: Kind.Function,
      insertText: "sqrt(${1:value})",
      documentation: "Square root (needs <cmath>).",
      snippet: true,
    },
    {
      label: "pow",
      kind: Kind.Function,
      insertText: "pow(${1:base}, ${2:exponent})",
      documentation: "Raises base to the power of exponent (needs <cmath>).",
      snippet: true,
    },
    {
      label: "abs",
      kind: Kind.Function,
      insertText: "abs(${1:value})",
      documentation: "Absolute value.",
      snippet: true,
    },
    {
      label: "stoi",
      kind: Kind.Function,
      insertText: "stoi(${1:text})",
      documentation: "Converts a string to an int.",
      snippet: true,
    },
    {
      label: "to_string",
      kind: Kind.Function,
      insertText: "to_string(${1:value})",
      documentation: "Converts a number to a string.",
      snippet: true,
    },
    {
      label: "setprecision",
      kind: Kind.Function,
      insertText: "fixed << setprecision(${1:2})",
      documentation: "Fixes how many decimal places cout prints (needs <iomanip>).",
      snippet: true,
    },
  ];

  return monacoInstance.languages.registerCompletionItemProvider("cpp", {
    triggerCharacters: [".", ">", ":", "#", "<", "_"],
    provideCompletionItems: (model: any, position: any) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: entries.map((entry) => ({
          label: entry.label,
          kind: entry.kind,
          insertText: entry.insertText,
          documentation: entry.documentation,
          detail: "C++",
          range,
          ...(entry.snippet ? { insertTextRules: snippetRule } : {}),
        })),
      };
    },
  });
};

export const PracticeCpp: React.FC<Props> = ({ onBack }) => {
  const [query, setQuery] = useState(DEFAULT_CODE);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    output: string[];
    error?: string;
    diagnostics?: CppDiagnostic[];
    executionTime?: number;
  }>({ success: true, output: [] });
  const [hasExecuted, setHasExecuted] = useState(false);
  const [leftColumnRatio, setLeftColumnRatio] = useState(65);
  const [topRowRatio, setTopRowRatio] = useState(100);
  const [isColDragging, setIsColDragging] = useState(false);
  const [isRowDragging, setIsRowDragging] = useState(false);
  const [autoRunCommands, setAutoRunCommands] = useState(true);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "code">("code");

  const workspaceRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [consoleInputValue, setConsoleInputValue] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [pendingRunCode, setPendingRunCode] = useState<string | null>(null);
  const [pendingPrompts, setPendingPrompts] = useState<ConsolePrompt[]>([]);
  const [collectedInputs, setCollectedInputs] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState(0);

  const handleColDown = (e: React.PointerEvent) => {
    setIsColDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleRowDown = (e: React.PointerEvent) => {
    setIsRowDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (isColDragging && workspaceRef.current) {
      const { left, width } = workspaceRef.current.getBoundingClientRect();
      if (window.innerWidth < 1024) return;
      let newRatio = ((e.clientX - left) / width) * 100;
      newRatio = Math.max(30, Math.min(80, newRatio));
      setLeftColumnRatio(newRatio);
    } else if (isRowDragging && leftColRef.current) {
      const { top, height } = leftColRef.current.getBoundingClientRect();
      let newRatio = ((e.clientY - top) / height) * 100;
      newRatio = Math.max(20, Math.min(80, newRatio));
      setTopRowRatio(newRatio);
    }
  };

  const handleUp = (e: React.PointerEvent) => {
    setIsColDragging(false);
    setIsRowDragging(false);
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);

  const [messages, setMessages] = useState<{ role: string; content: any }[]>([
    {
      role: "assistant",
      content:
        "Hi! I am your AI C++ Programming tutor. Ask me any conceptual question, or ask me for a code solution so we can compile and run it inside our execution engine!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRunText, setAutoRunText] = useState("Compiling C++ source...");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading]);

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
      if (file.type.startsWith("image/")) {
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
      if (items[i].type.indexOf("image") !== -1) {
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
      userContent.push({ type: "image_url", image_url: { url: attachedImage } });
    }

    const newMsg = { role: "user", content: userContent };
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
              "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI C++ Programming tutor.",
          },
        ]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt = `You are an expert C++ programming tutor for NC/ND IT polytechnic students. Help them master structured and object-oriented programming in C++.
- If the student greets you, jokes casually, says thanks, or asks a normal non-code question, respond naturally and briefly. Do not force a C++ lesson, code sample, or long explanation unless they ask for one.
- If the student's intent is unclear, ask one short clarifying question instead of guessing a topic.
- Keep C++ examples clean and use pure, console-compilable C++17 with a single int main() in one file.
- Always start programs with the includes they need (e.g. #include <iostream>) and using namespace std; so beginners can read them.
- Use simple, easy-to-understand code and add short English comments explaining what each main part does.
- End main() with return 0;. Never use system("pause"), getch(), conio.h, or Windows-only libraries.
- Console input must use cin >> or getline(cin, ...); the runner collects those values before the program runs.
- If you write code for a student, wrap it inside \`\`\`cpp ... \`\`\` code blocks.
- Since code is sent to a real g++ compiler, only use the standard library (iostream, string, vector, cmath, iomanip, algorithm).
- Provide explanations simply and professionally, without sales jargon.`;

      // One shared list, strongest first — see services/groq.ts. Groq retires
      // model names periodically, and a dead name fails the whole request.
      const modelsToTry = GROQ_MODELS;

      let data: any = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: model,
              ...groqReasoningParams(model),
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                newMsg,
              ],
              temperature: 0.7,
              max_tokens: 1200,
            }),
          });

          data = await response.json();
          if (!data.error) {
            break;
          } else {
            lastError = new Error(data.error.message || "API Error");
          }
        } catch (e: any) {
          lastError = e;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error("All Groq models failed to respond.");
      }

      let aiText = data.choices[0].message.content || "";
      let extractedCpp = "";

      const cppMatch =
        aiText.match(/```cpp\s*([\s\S]*?)\s*```/) ||
        aiText.match(/```c\+\+\s*([\s\S]*?)\s*```/) ||
        aiText.match(/```c\s*([\s\S]*?)\s*```/);
      if (cppMatch) {
        extractedCpp = cppMatch[1].trim();
      }

      setIsAiLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let currentText = "";
      const chunkSize = Math.max(1, Math.floor(aiText.length / 32));
      for (let i = 0; i < aiText.length; i += chunkSize) {
        currentText += aiText.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentText;
          return newMessages;
        });
        await new Promise((r) => setTimeout(r, 12));
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = aiText;
        return newMessages;
      });

      if (extractedCpp && autoRunCommands) {
        handleSnippetClick(extractedCpp, true);
      }
    } catch (e: any) {
      setIsAiLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `API tutor execution error: ${e.message}` },
      ]);
    }
  };

  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const snippetData = [
    {
      title: "1. Mathematical problems",
      description: "Perform basic mathematical operations.",
      code: `#include <iostream>
#include <cmath>
using namespace std;

int main()
{
    // 1. Addition
    int num1 = 15;
    int num2 = 25;
    int sum = num1 + num2;
    cout << "Sum: " << num1 << " + " << num2 << " = " << sum << endl;

    // 2. Square root
    double root = sqrt(144);
    cout << "Square root of 144 is: " << root << endl;

    return 0;
}`,
    },
    {
      title: "2. If else statements",
      description: "Determine flow based on condition evaluation.",
      code: `#include <iostream>
using namespace std;

int main()
{
    int score = 85;

    // Check condition
    if (score >= 80)
    {
        cout << "Congratulations! You got a Distinction." << endl;
    }
    else if (score >= 60)
    {
        cout << "You passed with a Merit." << endl;
    }
    else
    {
        cout << "You need to work harder." << endl;
    }

    return 0;
}`,
    },
    {
      title: "3. Select statement (switch)",
      description: "Switch cases to select matching executions.",
      code: `#include <iostream>
using namespace std;

int main()
{
    int day = 3;

    // Make a choice based on day number
    switch (day)
    {
        case 1:
            cout << "Monday" << endl;
            break;
        case 2:
            cout << "Tuesday" << endl;
            break;
        case 3:
            cout << "Wednesday" << endl; // Switch matches here
            break;
        default:
            cout << "Other day" << endl;
            break;
    }

    return 0;
}`,
    },
    {
      title: "4. The for loop",
      description: "Looping through numbers counting up.",
      code: `#include <iostream>
using namespace std;

int main()
{
    cout << "Counting up:" << endl;

    // Loop from 1 to 5
    for (int i = 1; i <= 5; i++)
    {
        cout << "Count: " << i << endl;
    }

    return 0;
}`,
    },
    {
      title: "5. Patterns (nested loops)",
      description: "Using for loops inside other for loops to create shapes.",
      code: `#include <iostream>
using namespace std;

int main()
{
    cout << "Printing a right triangle pattern:" << endl;

    // Outer loop controls rows
    for (int row = 1; row <= 5; row++)
    {
        // Inner loop controls columns (stars per row)
        for (int col = 1; col <= row; col++)
        {
            cout << "* ";
        }
        // Move to the next line after each row
        cout << endl;
    }

    return 0;
}`,
    },
    {
      title: "6. Arrays",
      description: "Storing multiple values in a single variable.",
      code: `#include <iostream>
using namespace std;

int main()
{
    // Declare an array of numbers
    int numbers[5] = { 10, 20, 30, 40, 50 };

    cout << "Values in the array:" << endl;

    // Go through the array elements
    for (int i = 0; i < 5; i++)
    {
        cout << "Element at index " << i << " is " << numbers[i] << endl;
    }

    return 0;
}`,
    },
    {
      title: "7. Functions",
      description: "Making reusable blocks of code that take arguments.",
      code: `#include <iostream>
using namespace std;

// Function that takes two numbers and returns a double
double calculateArea(double width, double length)
{
    return width * length;
}

int main()
{
    // Call the function to calculate area
    double area = calculateArea(5, 10);

    cout << "The area of a 5x10 rectangle is: " << area << endl;

    return 0;
}`,
    },
    {
      title: "8. Classes",
      description: "Creating custom structures with variables and functions.",
      code: `#include <iostream>
#include <string>
using namespace std;

// Define the blueprint for a Student
class Student
{
public:
    string name;
    int age;

    // Constructor to set initial values
    Student(string studentName, int studentAge)
    {
        name = studentName;
        age = studentAge;
    }

    // Class function
    void greet()
    {
        cout << "Hi, my name is " << name << " and I am " << age << " years old." << endl;
    }
};

int main()
{
    // 1. Create a Student object
    Student stu("Alice", 20);

    // 2. Call a method on the object
    stu.greet();

    return 0;
}`,
    },
    {
      title: "9. Keyboard input",
      description: "Reading values typed by the user with cin.",
      code: `#include <iostream>
#include <string>
using namespace std;

int main()
{
    string name;
    int age;

    // Ask for the name, then read the whole line
    cout << "Enter your name: ";
    getline(cin, name);

    // Ask for the age and read one number
    cout << "Enter your age: ";
    cin >> age;

    cout << "Hello " << name << ", next year you will be " << (age + 1) << "." << endl;

    return 0;
}`,
    },
    {
      title: "10. Pointers",
      description: "Holding the address of a variable and reading through it.",
      code: `#include <iostream>
using namespace std;

int main()
{
    int marks = 72;

    // A pointer stores the address of another variable
    int *pointerToMarks = &marks;

    cout << "The value stored in marks is: " << marks << endl;
    cout << "The value read through the pointer is: " << *pointerToMarks << endl;

    // Changing the value through the pointer changes the original variable
    *pointerToMarks = 90;
    cout << "After the pointer changed it, marks is now: " << marks << endl;

    return 0;
}`,
    },
  ];

  const handleSnippetClick = async (snippet: string, autoRun = false) => {
    if (autoRun) {
      setActiveMobileTab("code");
    }
    setIsTyping(true);
    setTypingMessage(autoRun ? "Auto-generating C++ structure..." : "Loading boilerplate...");
    setQuery("");
    setHasExecuted(false);

    await new Promise((r) => setTimeout(r, 260));
    setTypingMessage("Streaming text to the code editor...");

    let currentCode = "";
    const step = autoRun ? 5 : 2;
    await new Promise((r) => setTimeout(r, 120));
    setTypingMessage("");

    for (let i = 0; i < snippet.length; i += step) {
      currentCode += snippet.slice(i, i + step);
      setQuery(currentCode);
      await new Promise((r) => setTimeout(r, 6));
    }
    setQuery(snippet);
    setIsTyping(false);

    if (autoRun) {
      handleGo(true, snippet);
    }
  };

  useEffect(() => {
    setShowTutorial(true);
    const timer = setTimeout(() => {
      setShowTutorial(false);
    }, 5500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const executeThroughApi = async (
    code: string,
    stdin = "",
    isAuto = false,
    preserveTerminal = false,
    promptsToStrip: string[] = []
  ) => {
    setAutoRunText(isAuto ? "Sending C++ code to the compiler..." : "Compiling and running C++...");
    setIsExecuting(true);
    setHasExecuted(false);
    setResult({ success: true, output: [] });

    setTimeout(async () => {
      try {
        const execRes = await runCppCode(code, stdin);
        const resultToShow = preserveTerminal
          ? {
              ...execRes,
              output: execRes.output
                .map((line) =>
                  promptsToStrip.reduce(
                    (currentLine, prompt) =>
                      prompt ? currentLine.replaceAll(prompt, "") : currentLine,
                    line
                  )
                )
                .filter((line) => line.trim().length > 0),
            }
          : execRes;
        setResult(resultToShow);
        if (!preserveTerminal) {
          setTerminalLines([]);
        }
      } catch (err: any) {
        setResult({
          success: false,
          output: [],
          error:
            err.message ||
            "Unable to reach the C++ compiler API. Check VITE_CPP_RUN_API_URL or the /api/cpp/run endpoint.",
          executionTime: 0,
        });
      } finally {
        setHasExecuted(true);
        setIsExecuting(false);
        setIsWaitingForInput(false);
      }
    }, 450);
  };

  const handleGo = (isAuto = false, codeOverride?: string) => {
    const codeToPrepare = codeOverride ?? query;
    if (!codeToPrepare.trim()) return;

    if (!isAuto) {
      setActiveMobileTab("code");
    }

    if (topRowRatio === 100) {
      setTopRowRatio(60);
    }

    const prompts = extractConsoleInputPrompts(codeToPrepare);
    setResult({ success: true, output: [] });
    setHasExecuted(false);
    setTerminalLines([]);
    setConsoleInputValue("");

    if (prompts.length > 0) {
      setPendingRunCode(codeToPrepare);
      setPendingPrompts(prompts);
      setCollectedInputs([]);
      setActiveInputIndex(0);
      setIsWaitingForInput(true);
      setTerminalLines([prompts[0].label]);
      return;
    }

    setPendingRunCode(null);
    setPendingPrompts([]);
    setCollectedInputs([]);
    setActiveInputIndex(0);
    setIsWaitingForInput(false);
    executeThroughApi(codeToPrepare, "", isAuto);
  };

  const resetWorkspaceState = () => {
    setTerminalLines([]);
    setPendingRunCode(null);
    setPendingPrompts([]);
    setCollectedInputs([]);
    setActiveInputIndex(0);
    setIsWaitingForInput(false);
    setConsoleInputValue("");
  };

  const handleTerminalInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingRunCode || !isWaitingForInput) return;

    const value = consoleInputValue;
    const nextInputs = [...collectedInputs, value];
    const nextIndex = activeInputIndex + 1;
    setTerminalLines((prev) => [...prev, `> ${value}`]);
    setConsoleInputValue("");
    setCollectedInputs(nextInputs);

    if (nextIndex < pendingPrompts.length) {
      setActiveInputIndex(nextIndex);
      setTerminalLines((prev) => [...prev, pendingPrompts[nextIndex].label]);
      return;
    }

    const codeToRun = pendingRunCode;
    const promptsToStrip = pendingPrompts.flatMap((prompt) =>
      [prompt.raw, prompt.label].filter(Boolean)
    );
    setPendingRunCode(null);
    setPendingPrompts([]);
    setCollectedInputs([]);
    setActiveInputIndex(0);
    setIsWaitingForInput(false);
    executeThroughApi(codeToRun, `${nextInputs.join("\n")}\n`, false, true, promptsToStrip);
  };

  const handleEditorChange = (value: string | undefined) => {
    setQuery(value || "");
  };

  const openMobileCodeTab = () => {
    setActiveMobileTab("code");
    window.setTimeout(() => {
      terminalOutputRef.current?.scrollTo({
        top: terminalOutputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      configureCppMonaco(monaco);
      monaco.editor.setTheme(isDarkMode ? "sidemann-cpp-dark" : "sidemann-cpp-light");
    }
  }, [monaco, isDarkMode]);

  // handleGo is captured by the Ctrl+Enter command below; keeping the latest
  // version in a ref stops the shortcut running against stale editor state.
  const handleGoRef = useRef(handleGo);
  handleGoRef.current = handleGo;

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
  const isConsoleOpen = topRowRatio < 100;
  const mobileEditorBasis = !isConsoleOpen ? "100%" : hasExecuted && !result.success ? "55%" : "65%";
  const mobileTerminalBasis = !isConsoleOpen ? "0%" : hasExecuted && !result.success ? "45%" : "35%";

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}
    >
      <style>{IDE_PRACTICE_STYLES}</style>

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
            <div className="p-1.5 rounded bg-[#003153]/10 text-[#003153] dark:text-blue-400 shrink-0">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-sm sm:text-lg tracking-tight truncate max-w-[46vw] sm:max-w-none">
              <span className="sm:hidden">Practice &amp; Compile</span>
              <span className="hidden sm:inline">C++ Practice &amp; Compilation Lab</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <TeachMeLaunchButton isDarkMode={isDarkMode} />
          <button
            onClick={() => setIsSyllabusOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"}`}
            title="Syllabus Topics"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden sm:inline">Syllabus Topics</span>
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-md ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"} transition-colors`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div
        ref={workspaceRef}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
        className="flex-1 flex overflow-hidden lg:flex-row flex-col pb-[72px] lg:pb-0"
      >
        <div className="flex w-full h-full relative lg:flex-row flex-col">
          <div
            ref={leftColRef}
            className={`${activeMobileTab === "code" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : {
                    flexBasis: `${leftColumnRatio}%`,
                    flexGrow: 0,
                    transition: isColDragging ? "none" : "flex-basis 0.3s ease-in-out",
                  }
            }
          >
            {/* Editor Section */}
            <div
              className={`flex flex-col overflow-hidden shadow-[2px_0_8px_rgba(0,0,0,0.05)] ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
              style={
                isMobileLayout
                  ? { flexBasis: mobileEditorBasis, flexGrow: 0, transition: "flex-basis 0.25s ease" }
                  : {
                      flexBasis: `${topRowRatio}%`,
                      flexGrow: 0,
                      transition: isRowDragging ? "none" : "flex-basis 0.3s ease-in-out",
                    }
              }
            >
              <div
                className={`px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-b shrink-0 gap-3 ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}`}
              >
                <div className="hidden lg:flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white bg-indigo-600">
                    1
                  </span>
                  <h2 className="text-sm font-semibold tracking-wide">
                    C++ Editor Environment (main.cpp)
                  </h2>
                </div>
                <div className="lg:hidden flex items-center gap-2 min-w-0">
                  <Code2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-sm font-semibold truncate">Code</span>
                </div>

                <div className="hidden lg:flex items-center gap-3">
                  <div
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono border hidden sm:block ${isDarkMode ? "border-gray-600 text-gray-400 bg-gray-800" : "border-gray-200 text-gray-500 bg-white"}`}
                  >
                    Ctrl+Enter
                  </div>

                  <button
                    onClick={() => {
                      setQuery(DEFAULT_CODE);
                      setResult({ success: true, output: [] });
                      setHasExecuted(false);
                      resetWorkspaceState();
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
                      isDarkMode
                        ? "bg-[#333] border-[#555] text-gray-200 hover:bg-[#444]"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                    title="Reset to default compilable program"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <div className="relative">
                    {topRowRatio < 100 && !isExecuting ? (
                      <button
                        onClick={() => {
                          setTopRowRatio(100);
                          setHasExecuted(false);
                          setResult({ success: true, output: [] });
                          resetWorkspaceState();
                        }}
                        className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all bg-red-600 hover:bg-red-700 text-white shadow hover:shadow-md active:scale-[0.98]"
                      >
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGo()}
                        disabled={isExecuting || !query.trim()}
                        className={`relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all ${
                          isExecuting || !query.trim()
                            ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                            : "bg-[#003153] hover:bg-blue-800 text-white shadow hover:shadow-md active:scale-[0.98]"
                        }`}
                      >
                        {isExecuting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Executing...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Run</span>
                          </>
                        )}
                      </button>
                    )}

                    {showTutorial && !isExecuting && query.trim() && (
                      <div className="absolute top-10 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce whitespace-nowrap">
                        <Lightbulb size={12} fill="currentColor" /> Click to compile!
                        <div className="absolute -top-1 right-6 w-2 h-2 bg-indigo-600 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="lg:hidden flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTopRowRatio(isConsoleOpen ? 100 : 60)}
                    className={`p-2 rounded-md border transition-colors ${
                      isConsoleOpen
                        ? isDarkMode
                          ? "bg-sky-950/40 border-sky-800 text-sky-300"
                          : "bg-sky-50 border-sky-200 text-sky-700"
                        : isDarkMode
                          ? "bg-[#333] border-[#555] text-gray-200"
                          : "bg-white border-gray-300 text-gray-700 shadow-sm"
                    }`}
                    title={isConsoleOpen ? "Hide output" : "Show output"}
                  >
                    <Terminal className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGo()}
                    disabled={isExecuting || !query.trim()}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-all active:scale-95 ${
                      isExecuting || !query.trim()
                        ? "bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                        : "bg-[#003153] hover:bg-blue-800 text-white shadow"
                    }`}
                    title="Run C++ code"
                  >
                    {isExecuting ? (
                      <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    Run
                  </button>
                </div>
              </div>

              <div className="relative flex-1 min-h-0 bg-[#fffffe] dark:bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language="cpp"
                  path="main.cpp"
                  theme={isDarkMode ? "sidemann-cpp-dark" : "sidemann-cpp-light"}
                  value={query}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace",
                    // Long lines run off to the right with a scrollbar, as in
                    // VS Code, rather than wrapping and shifting the line up.
                    wordWrap: "off",
                    scrollbar: { horizontal: "auto", horizontalScrollbarSize: 12 },
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    padding: { top: 16, bottom: 16 },
                    lineNumbersMinChars: 3,
                    // VS Code-style editing aids
                    autoClosingBrackets: "always",
                    autoClosingQuotes: "always",
                    autoIndent: "full",
                    formatOnPaste: true,
                    formatOnType: true,
                    tabCompletion: "on",
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    quickSuggestions: { other: true, comments: false, strings: false },
                    snippetSuggestions: "top",
                    suggestSelection: "first",
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true, indentation: true },
                  }}
                  beforeMount={configureCppMonaco}
                  onMount={(editor, monacoInstance) => {
                    configureCppMonaco(monacoInstance);
                    monacoInstance.editor.setTheme(
                      isDarkMode ? "sidemann-cpp-dark" : "sidemann-cpp-light"
                    );
                    editor.addCommand(
                      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
                      () => {
                        handleGoRef.current();
                      }
                    );

                    const completionProvider = registerCppCompletions(monacoInstance);
                    editor.onDidDispose(() => completionProvider.dispose());
                  }}
                />
              </div>
            </div>

            {/* Drag Handle (Row splitting editor and Terminal Output) */}
            <div
              className={`hidden lg:flex items-center justify-center relative z-20 cursor-row-resize ${isDarkMode ? "bg-[#2a2a2a]" : "bg-gray-200"} w-full h-2 group hover:bg-indigo-500 active:bg-indigo-600 transition-colors border-y ${isDarkMode ? "border-[#404040]" : "border-gray-300"}`}
              onPointerDown={handleRowDown}
            >
              <div
                className={`w-8 h-1 rounded-full ${isDarkMode ? "bg-gray-500" : "bg-gray-400"} group-hover:bg-indigo-300`}
              />
            </div>

            {/* Console Output Section */}
            <div
              className={`flex flex-col border-t shrink-0 ${isDarkMode ? "bg-[#181818]" : "bg-white"}`}
              style={
                isMobileLayout
                  ? {
                      flexBasis: mobileTerminalBasis,
                      overflow: "hidden",
                      flexGrow: 0,
                      transition: "flex-basis 0.25s ease",
                    }
                  : {
                      flexBasis: `${100 - topRowRatio}%`,
                      overflow: "hidden",
                      flexGrow: 0,
                      transition: isRowDragging ? "none" : "flex-basis 0.3s ease-in-out",
                    }
              }
            >
              <div
                className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${isDarkMode ? "bg-[#1f1f1f] border-[#404040]" : "bg-slate-100 border-slate-300"}`}
              >
                <div className={`flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-800"}`}>
                  <Terminal size={16} className="text-sky-500" />
                  <h2 className="text-xs font-bold tracking-wider font-mono uppercase text-sky-500">
                    Console output Terminal
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  {hasExecuted &&
                    (result.success ? (
                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-mono font-medium ${isDarkMode ? "text-purple-400" : "text-indigo-600"}`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        Executed in {result.executionTime} ms.
                      </div>
                    ) : (
                      <div
                        className={`flex items-center gap-1.5 text-[10px] font-mono font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}
                      >
                        <AlertCircle className="w-3 h-3" />
                        Compilation error
                      </div>
                    ))}
                  <button
                    onClick={() => {
                      setTopRowRatio(100);
                      setHasExecuted(false);
                      setResult({ success: true, output: [] });
                      resetWorkspaceState();
                    }}
                    className={`p-1 rounded transition-colors ${isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-300/60 text-slate-500 hover:text-slate-900"}`}
                    title="Close console output"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div
                ref={terminalOutputRef}
                className={`flex-1 min-h-0 overflow-auto p-4 font-mono text-xs md:text-sm custom-scrollbar whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-white bg-slate-950" : "text-slate-800 bg-white"}`}
              >
                {isExecuting ? (
                  <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3 text-center">
                    <div className="w-9 h-9 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>
                      {autoRunText}
                    </span>
                  </div>
                ) : !result.success ? (
                  <div
                    className={`p-3 rounded space-y-3 border ${isDarkMode ? "text-red-400 bg-red-950/20 border-red-900/30" : "text-red-700 bg-red-50 border-red-200"}`}
                  >
                    <span className="font-bold text-[#ff7400] uppercase block mb-1 font-sans">
                      [C++ Compiler / Runtime Error]:
                    </span>
                    {result.diagnostics && result.diagnostics.length > 0 ? (
                      <div className="space-y-2">
                        {result.diagnostics.map((diagnostic, index) => (
                          <div key={index} className="rounded border border-red-900/40 bg-black/20 p-2">
                            <div className="text-[11px] uppercase tracking-wider text-red-300 font-bold">
                              {diagnostic.severity || "error"}
                              {diagnostic.code ? ` ${diagnostic.code}` : ""}
                              {diagnostic.line !== undefined
                                ? ` at line ${diagnostic.line}${diagnostic.column !== undefined ? `, column ${diagnostic.column}` : ""}`
                                : " at unknown location"}
                            </div>
                            <div className="mt-1 text-red-100">{diagnostic.message}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>{result.error}</div>
                    )}
                  </div>
                ) : (
                  <>
                    {terminalLines.map((line, lIdx) => (
                      <div
                        key={`terminal-${lIdx}`}
                        className={`border-b border-transparent py-0.5 px-2 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
                      >
                        <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">
                          {line.startsWith(">") ? "" : "?"}
                        </span>
                        {line}
                      </div>
                    ))}
                    {result.output.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={`border-b border-transparent py-0.5 px-2 ${isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"}`}
                      >
                        <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">
                          &gt;
                        </span>
                        {line}
                      </div>
                    ))}
                    {isWaitingForInput && (
                      <form className="flex mt-2 items-center w-full px-2" onSubmit={handleTerminalInputSubmit}>
                        <span className="text-slate-500 select-none mr-2 font-mono text-[11px] inline-block w-4">
                          &gt;
                        </span>
                        <input
                          autoFocus
                          className={`flex-1 bg-transparent border-none outline-none font-mono ${isDarkMode ? "text-white" : "text-slate-800"}`}
                          value={consoleInputValue}
                          onChange={(e) => setConsoleInputValue(e.target.value)}
                          placeholder={`Input ${activeInputIndex + 1} of ${pendingPrompts.length}`}
                        />
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Drag Handle (Column resize slider for Editor/Terminal/Chat) */}
          <div
            className={`hidden lg:flex items-center justify-center relative z-20 cursor-col-resize ${isDarkMode ? "bg-[#2a2a2a]" : "bg-gray-200"} w-2 h-full group hover:bg-pink-500 active:bg-pink-600 transition-colors border-x ${isDarkMode ? "border-[#404040]" : "border-gray-300"}`}
            onPointerDown={handleColDown}
          >
            <div
              className={`w-1 h-8 rounded-full ${isDarkMode ? "bg-gray-500" : "bg-gray-400"} group-hover:bg-pink-300`}
            />
          </div>

          {/* Sidebar Area (AI Tutor) */}
          <div
            className={`${activeMobileTab === "chat" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full ${
              isDarkMode ? "bg-[#252526] border-l border-[#404040]" : "bg-[#fafafa] border-l border-gray-200"
            }`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : {
                    flexBasis: `${100 - leftColumnRatio}%`,
                    flexGrow: 0,
                    transition: isColDragging ? "none" : "flex-basis 0.3s ease-in-out",
                  }
            }
          >
            {/* Sidebar Header */}
            <div
              className={`flex items-center justify-between gap-3 shrink-0 h-11 px-4 border-b ${isDarkMode ? "bg-[#1e1e1e] border-[#404040] text-pink-400" : "bg-gray-50 border-gray-200 text-pink-600"}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider truncate">
                  AI C++ Tutor
                </span>
              </div>
              <label
                className={`flex items-center gap-1.5 shrink-0 text-[10px] font-mono font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                <span>Auto Injection:</span>
                <input
                  type="checkbox"
                  checked={autoRunCommands}
                  onChange={(e) => setAutoRunCommands(e.target.checked)}
                  className="rounded border-gray-400 checked:bg-pink-500 accent-pink-500 w-3 h-3 cursor-pointer"
                  id="checkbox-auto-inject-run"
                />
              </label>
            </div>

            {/* Container Scroll Area */}
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col h-full">
              <div className="flex-1 flex flex-col min-h-0 relative h-full">
                {/* AI Chat History */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-5 px-4 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-4 select-text">
                  {messages.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className={`flex items-start ${
                        m.role === "user" ? "ml-auto flex-row-reverse gap-3 max-w-[85%]" : "mr-auto max-w-full"
                      }`}
                    >
                      {m.role === "user" && (
                        <div className="w-7 h-7 mt-0.5 rounded-full shrink-0 flex items-center justify-center bg-purple-600 text-white">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                      <div
                        className={
                          m.role === "user"
                            ? `rounded-xl px-3 py-2 text-sm leading-normal chat-text shadow-sm border ${
                                isDarkMode
                                  ? "bg-purple-900/40 border-purple-800 text-white"
                                  : "bg-purple-50 border-purple-100 text-purple-900"
                              }`
                            : `pt-1 text-sm leading-relaxed chat-text w-full max-w-[72ch] min-w-0 ${
                                isDarkMode ? "text-gray-300" : "text-gray-800"
                              }`
                        }
                      >
                        {typeof m.content === "string" ? (
                          <div className="markdown-body prose-chat">
                            <ReactMarkdown components={makeMarkdownComponents(isDarkMode, "cpp")}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        ) : Array.isArray(m.content) ? (
                          m.content.map((elem: any, elemIdx: number) => {
                            if (elem.type === "text") {
                              return (
                                <div key={elemIdx} className="markdown-body prose-chat">
                                  <ReactMarkdown components={makeMarkdownComponents(isDarkMode, "cpp")}>
                                    {elem.text}
                                  </ReactMarkdown>
                                </div>
                              );
                            }
                            if (elem.type === "image_url") {
                              return (
                                <img
                                  key={elemIdx}
                                  src={elem.image_url.url}
                                  alt="User Attachment"
                                  className="max-h-48 rounded-lg mt-2 border shadow-sm border-gray-600"
                                />
                              );
                            }
                            return null;
                          })
                        ) : null}
                      </div>
                    </div>
                  ))}
                  {isAiLoading && (
                    <div className="flex gap-3 max-w-full mr-auto">
                      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-pink-600/10 text-pink-600 dark:text-pink-400">
                        <Bot className="w-4 h-4 animate-pulse" />
                      </div>
                      <div
                        className={`pt-1 text-sm chat-text w-full max-w-[72ch] min-w-0 ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500">Thinking</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endOfMessagesRef} />
                </div>

                {/* AI Input Box */}
                <form
                  onSubmit={handleSendMessage}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onPaste={handlePaste}
                  className={`mt-auto px-4 sm:px-5 lg:px-6 xl:px-8 pt-4 pb-4 border-t flex flex-col gap-2 shrink-0 ${
                    isDarkMode ? "bg-[#252526] border-gray-800" : "bg-white border-gray-200"
                  }`}
                >
                  {isDragging && (
                    <div
                      className={`py-8 border-2 border-dashed border-pink-500 rounded-xl flex items-center justify-center animate-pulse mb-2 text-xs font-semibold ${
                        isDarkMode ? "bg-pink-500/10 text-pink-300" : "bg-pink-50 text-pink-600"
                      }`}
                    >
                      Drop your assignment or error screenshot here!
                    </div>
                  )}

                  {attachedImage && (
                    <div
                      className={`relative inline-block w-max self-start mb-2 group border rounded-lg p-1.5 ${
                        isDarkMode ? "border-[#3a3a3c] bg-[#1e1e1e]" : "border-gray-300 bg-slate-100"
                      }`}
                    >
                      <img
                        src={attachedImage}
                        alt="Attachment"
                        className={`max-h-20 rounded shadow-md border ${isDarkMode ? "border-[#3a3a3c]" : "border-slate-200"}`}
                      />
                      <button
                        type="button"
                        onClick={() => setAttachedImage(null)}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white p-0.5 rounded-full shadow hover:bg-red-700 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <div id="poda" className="flex-1 relative">
                      <div className="ai-w"></div>
                      <div className="ai-b"></div>
                      <div className="ai-db"></div>
                      <div className="ai-g"></div>
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Ask Sidemann"
                        className={`ai-input font-medium ${!isDarkMode ? "ai-input-light" : ""}`}
                        id="ai-text-input"
                      />
                      <button
                        type="submit"
                        disabled={isAiLoading || (!chatInput.trim() && !attachedImage)}
                        className={`absolute right-2 top-2 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                          isDarkMode
                            ? "bg-pink-600 text-white hover:bg-pink-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:shadow-none"
                            : "bg-pink-600 text-white hover:bg-pink-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                        }`}
                        id="btn-ai-send"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                      id="ai-hidden-file-input"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`lg:hidden fixed left-0 right-0 bottom-0 z-[170] border-t px-4 pt-2 ${
          isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-white border-gray-200"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={openMobileCodeTab}
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
            <Code2 className="w-4 h-4" />
            <span>Code</span>
            {(isExecuting || hasExecuted) && (
              <span
                className={`ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isDarkMode ? "bg-white/10 text-gray-200" : "bg-slate-100 text-slate-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${codeTabStatusColor} ${isExecuting ? "animate-pulse" : ""}`}
                />
                {codeTabStatus}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab("chat")}
            className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
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

      {/* Syllabus Topics Slide-in Panel */}
      <div className={`fixed inset-0 z-[200] ${isSyllabusOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setIsSyllabusOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isSyllabusOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute top-0 left-0 h-full w-[300px] max-w-[85vw] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
            isSyllabusOpen ? "translate-x-0" : "-translate-x-full"
          } ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-white text-gray-900"}`}
        >
          <div
            className={`flex items-center justify-between px-4 h-14 border-b shrink-0 ${isDarkMode ? "border-[#404040]" : "border-gray-200"}`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <h2 className="font-semibold text-sm">Syllabus Topics</h2>
            </div>
            <button
              onClick={() => setIsSyllabusOpen(false)}
              className={`p-1.5 rounded-md transition-colors ${isDarkMode ? "hover:bg-[#333] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"}`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-3 space-y-2">
            {snippetData.map((snippet, sIdx) => (
              <div
                key={sIdx}
                onClick={() => {
                  handleSnippetClick(snippet.code);
                  setIsSyllabusOpen(false);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all group flex items-center gap-3 ${
                  isDarkMode
                    ? "bg-[#252526] border-[#3a3a3c] hover:border-indigo-500/80 hover:bg-[#2c2c2e]"
                    : "bg-slate-50 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${isDarkMode ? "bg-indigo-950/50 text-indigo-400" : "bg-indigo-100 text-indigo-600"}`}
                >
                  {sIdx + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate group-hover:text-indigo-500">
                    {snippet.title.replace(/^\d+\.\s*/, "")}
                  </h4>
                  <p className={`text-[10px] leading-snug truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {snippet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isTyping && typingMessage && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[210] px-3 py-1.5 rounded-full bg-indigo-600 text-white text-[11px] font-semibold shadow-lg">
          {typingMessage}
        </div>
      )}
    </div>
  );
};

export default PracticeCpp;

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Play,
  ArrowLeft,
  Code2,
  X,
  Sun,
  Moon,
  MessageSquare,
  Send,
  Bot,
  Terminal,
  Bookmark,
  RotateCcw,
  Lightbulb,
  User,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  FileCode2,
  Palette,
  Braces,
  Eye,
  AlertCircle,
  Download,
  Maximize2,
  Minimize2,
  Plus,
} from "lucide-react";
import { TeachMeLaunchButton } from "../shared/TeachMeLaunchButton";
import Editor, { useMonaco } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import {
  IDE_PRACTICE_STYLES,
  makeMarkdownComponents,
} from "../shared/idePracticeChrome";
import { buildPreviewDocument, WebProjectFiles } from "./webPreviewDocument";
import { GROQ_MODELS, groqReasoningParams } from '../../../../services/groq';
import {
  applyEditBlocks,
  buildFilesContext,
  parseEditBlocks,
  parseTutorJson,
  stripEditBlocks,
  summariseOutcomes,
} from "./webAiEdits";
import {
  CSS_PROPERTIES,
  CSS_VALUES,
  EMBEDDED_JS_SNIPPETS,
  regionAt,
} from "./webLanguageData";

interface Props {
  onBack?: () => void;
}

type FileKey = "html" | "css" | "js";

const FILE_TABS: Array<{
  key: FileKey;
  name: string;
  language: string;
  path: string;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
}> = [
  { key: "html", name: "index.html", language: "html", path: "index.html", Icon: FileCode2, accent: "text-orange-500" },
  { key: "css", name: "styles.css", language: "css", path: "styles.css", Icon: Palette, accent: "text-sky-500" },
  { key: "js", name: "script.js", language: "javascript", path: "script.js", Icon: Braces, accent: "text-amber-500" },
];

/**
 * The starter project is the plainest possible page: headings in index.html and
 * nothing else. Students add a <style> or <script> block in the same file, or
 * use the CSS and JS tabs — whatever is in those is merged into the page too.
 */
const DEFAULT_FILES: WebProjectFiles = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>My first page</title>
</head>
<body>

  <!-- HTML gives you six heading levels. h1 is the biggest, h6 the smallest -->
  <h1>Heading level 1</h1>
  <h2>Heading level 2</h2>
  <h3>Heading level 3</h3>
  <h4>Heading level 4</h4>
  <h5>Heading level 5</h5>
  <h6>Heading level 6</h6>

  <p>This is a paragraph. Change the headings above, then press Run.</p>

</body>
</html>`,
  css: "",
  js: "",
};

interface ConsoleEntry {
  level: string;
  text: string;
}

const PREVIEW_WIDTHS: Record<string, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

let webMonacoConfigured = false;

const configureWebMonaco = (monacoInstance: any) => {
  if (!monacoInstance || webMonacoConfigured) return;

  // VS Code's own Light+ palette. Students move between this editor and the real
  // VS Code in the labs, so the colours are the stock ones rather than a
  // house style: maroon tags, red attribute names, blue values, green comments.
  monacoInstance.editor.defineTheme("sidemann-web-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "008000" },
      { token: "tag", foreground: "800000" },
      { token: "metatag", foreground: "800000" },
      { token: "metatag.content.html", foreground: "0451A5" },
      { token: "delimiter.html", foreground: "800000" },
      { token: "attribute.name", foreground: "E50000" },
      { token: "attribute.name.css", foreground: "FF0000" },
      { token: "attribute.value", foreground: "0451A5" },
      { token: "attribute.value.number.css", foreground: "098658" },
      { token: "attribute.value.hex.css", foreground: "098658" },
      { token: "attribute.value.unit.css", foreground: "098658" },
      { token: "string", foreground: "A31515" },
      { token: "string.html", foreground: "0451A5" },
      { token: "number", foreground: "098658" },
      { token: "keyword", foreground: "0000FF" },
      { token: "identifier", foreground: "001080" },
      { token: "type", foreground: "267F99" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#000000",
      "editorLineNumber.foreground": "#237893",
      "editorLineNumber.activeForeground": "#0b216f",
    },
  });

  // VS Code's Dark+ palette, same reasoning.
  monacoInstance.editor.defineTheme("sidemann-web-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955" },
      { token: "tag", foreground: "569CD6" },
      { token: "tag.css", foreground: "D7BA7D" },
      { token: "metatag", foreground: "569CD6" },
      { token: "metatag.content.html", foreground: "9CDCFE" },
      { token: "delimiter.html", foreground: "808080" },
      { token: "attribute.name", foreground: "9CDCFE" },
      { token: "attribute.value", foreground: "CE9178" },
      { token: "attribute.value.number.css", foreground: "B5CEA8" },
      { token: "attribute.value.hex.css", foreground: "B5CEA8" },
      { token: "attribute.value.unit.css", foreground: "B5CEA8" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "keyword", foreground: "569CD6" },
      { token: "identifier", foreground: "9CDCFE" },
      { token: "type", foreground: "4EC9B0" },
      { token: "delimiter", foreground: "D4D4D4" },
    ],
    colors: {
      "editor.background": "#1e1e1e",
      "editor.foreground": "#d4d4d4",
      "editorLineNumber.foreground": "#858585",
      "editorLineNumber.activeForeground": "#c6c6c6",
    },
  });

  // The browser DOM/JS typings ship with Monaco; turning the diagnostics on
  // gives red squiggles and member completion on document/window like VS Code.
  monacoInstance.languages.typescript?.javascriptDefaults?.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  monacoInstance.languages.typescript?.javascriptDefaults?.setCompilerOptions({
    target: monacoInstance.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    lib: ["es2020", "dom"],
    checkJs: false,
  });

  webMonacoConfigured = true;
};

/**
 * Monaco already ships full IntelliSense for HTML, CSS and JavaScript. These
 * extra snippets sit on top of it and cover the blocks students in this course
 * type most, so the suggestion list opens with something useful.
 */
const registerWebSnippets = (monacoInstance: any) => {
  const snippetRule = monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  const Kind = monacoInstance.languages.CompletionItemKind;

  const packs: Record<string, Array<{ label: string; insertText: string; documentation: string }>> = {
    html: [
      {
        label: "html5",
        insertText:
          '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="utf-8" />\n\t<meta name="viewport" content="width=device-width, initial-scale=1" />\n\t<title>${1:Page title}</title>\n</head>\n<body>\n\t$0\n</body>\n</html>',
        documentation: "Complete HTML5 document skeleton.",
      },
      {
        label: "link:css",
        insertText: '<link rel="stylesheet" href="${1:styles.css}" />',
        documentation: "Attach an external stylesheet.",
      },
      {
        label: "script:src",
        insertText: '<script src="${1:script.js}"></script>',
        documentation: "Attach an external JavaScript file.",
      },
      {
        label: "form",
        insertText:
          '<form id="${1:myForm}">\n\t<label for="${2:name}">${3:Name}</label>\n\t<input type="text" id="${2:name}" name="${2:name}" required />\n\t<button type="submit">${4:Submit}</button>\n</form>',
        documentation: "Form with a labelled input and submit button.",
      },
      {
        label: "table",
        insertText:
          "<table>\n\t<thead>\n\t\t<tr>\n\t\t\t<th>${1:Column}</th>\n\t\t</tr>\n\t</thead>\n\t<tbody>\n\t\t<tr>\n\t\t\t<td>${2:Value}</td>\n\t\t</tr>\n\t</tbody>\n</table>",
        documentation: "Table with a head and body row.",
      },
      {
        label: "nav",
        insertText:
          '<nav>\n\t<ul>\n\t\t<li><a href="#${1:home}">${2:Home}</a></li>\n\t\t<li><a href="#${3:about}">${4:About}</a></li>\n\t</ul>\n</nav>',
        documentation: "Navigation list.",
      },
      {
        label: "img",
        insertText: '<img src="${1:image.jpg}" alt="${2:description}" />',
        documentation: "Image with the alt text accessibility needs.",
      },
    ],
    css: [
      {
        label: "flex-center",
        insertText: "display: flex;\njustify-content: center;\nalign-items: center;",
        documentation: "Centre children horizontally and vertically.",
      },
      {
        label: "grid-columns",
        insertText: "display: grid;\ngrid-template-columns: repeat(${1:3}, 1fr);\ngap: ${2:16px};",
        documentation: "Equal-width responsive grid.",
      },
      {
        label: "media-query",
        insertText: "@media (max-width: ${1:768px}) {\n\t$0\n}",
        documentation: "Style rules for narrower screens.",
      },
      {
        label: "transition",
        insertText: "transition: ${1:all} ${2:0.3s} ${3:ease};",
        documentation: "Animate a property change.",
      },
      {
        label: "box-shadow",
        insertText: "box-shadow: 0 ${1:4px} ${2:12px} rgba(0, 0, 0, ${3:0.15});",
        documentation: "Soft drop shadow.",
      },
      {
        label: "font-stack",
        insertText: "font-family: Arial, Helvetica, sans-serif;",
        documentation: "Safe sans-serif font stack.",
      },
    ],
    javascript: [
      {
        label: "getElementById",
        insertText: 'const ${1:element} = document.getElementById("${2:id}");',
        documentation: "Find one element by its id.",
      },
      {
        label: "querySelector",
        insertText: 'const ${1:element} = document.querySelector("${2:.selector}");',
        documentation: "Find the first element matching a CSS selector.",
      },
      {
        label: "addEventListener",
        insertText:
          '${1:element}.addEventListener("${2:click}", function (event) {\n\t$0\n});',
        documentation: "Run code when an event happens.",
      },
      {
        label: "function",
        insertText: "function ${1:name}(${2:parameters}) {\n\t$0\n}",
        documentation: "Function declaration.",
      },
      {
        label: "forloop",
        insertText: "for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t$0\n}",
        documentation: "Counted loop over an array.",
      },
      {
        label: "forEach",
        insertText: "${1:array}.forEach(function (${2:item}) {\n\t$0\n});",
        documentation: "Run a function for every item in an array.",
      },
      {
        label: "submit-handler",
        insertText:
          '${1:form}.addEventListener("submit", function (event) {\n\tevent.preventDefault();\n\t$0\n});',
        documentation: "Handle a form submit without reloading the page.",
      },
      {
        label: "log",
        insertText: "console.log(${1:value});",
        documentation: "Print a value to the console panel.",
      },
    ],
  };

  const providers = Object.entries(packs).map(([language, entries]) =>
    monacoInstance.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ["<", ".", "#", "-", ":"],
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        // In HTML these snippets already carry their own `<`, so a `<` the
        // student typed has to be replaced rather than left in front.
        const swallowsAngle =
          language === "html" &&
          model.getLineContent(position.lineNumber)[word.startColumn - 2] === "<";
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: swallowsAngle ? word.startColumn - 1 : word.startColumn,
          endColumn: word.endColumn,
        };

        return {
          suggestions: entries.map((entry) => ({
            label: entry.label,
            kind: Kind.Snippet,
            insertText: entry.insertText,
            insertTextRules: snippetRule,
            documentation: entry.documentation,
            detail: "ExamSidemann snippet",
            range,
          })),
        };
      },
    })
  );

  providers.push(registerHtmlCompletions(monacoInstance));
  return providers;
};

/** Tags offered as whole elements, so `p` completes to `<p></p>`. */
const HTML_TAGS: Array<{ tag: string; documentation: string; selfClosing?: boolean; attributes?: string }> = [
  { tag: "h1", documentation: "Main page heading. Use one per page." },
  { tag: "h2", documentation: "Section heading." },
  { tag: "h3", documentation: "Sub-section heading." },
  { tag: "h4", documentation: "Fourth-level heading." },
  { tag: "h5", documentation: "Fifth-level heading." },
  { tag: "h6", documentation: "Smallest heading." },
  { tag: "p", documentation: "Paragraph of text." },
  { tag: "div", documentation: "Generic block container." },
  { tag: "span", documentation: "Generic inline container." },
  { tag: "a", documentation: "Link to another page.", attributes: ' href="${1:#}"' },
  { tag: "ul", documentation: "Unordered (bulleted) list." },
  { tag: "ol", documentation: "Ordered (numbered) list." },
  { tag: "li", documentation: "List item." },
  { tag: "table", documentation: "Table." },
  { tag: "thead", documentation: "Table head section." },
  { tag: "tbody", documentation: "Table body section." },
  { tag: "tr", documentation: "Table row." },
  { tag: "th", documentation: "Table heading cell." },
  { tag: "td", documentation: "Table data cell." },
  { tag: "button", documentation: "Clickable button." },
  { tag: "form", documentation: "Form that collects input." },
  { tag: "label", documentation: "Label for an input.", attributes: ' for="${1:id}"' },
  { tag: "select", documentation: "Drop-down list." },
  { tag: "option", documentation: "One choice inside a select." },
  { tag: "textarea", documentation: "Multi-line text box." },
  { tag: "header", documentation: "Page or section header." },
  { tag: "footer", documentation: "Page or section footer." },
  { tag: "main", documentation: "Main content of the page." },
  { tag: "section", documentation: "Standalone section." },
  { tag: "article", documentation: "Self-contained piece of content." },
  { tag: "aside", documentation: "Side content." },
  { tag: "nav", documentation: "Navigation block." },
  { tag: "strong", documentation: "Important text (bold)." },
  { tag: "em", documentation: "Emphasised text (italic)." },
  { tag: "style", documentation: "CSS for this page." },
  { tag: "script", documentation: "JavaScript for this page." },
  { tag: "title", documentation: "Title shown on the browser tab." },
  { tag: "head", documentation: "Document head." },
  { tag: "body", documentation: "Visible page content." },
  { tag: "html", documentation: "Root element.", attributes: ' lang="${1:en}"' },
  { tag: "br", documentation: "Line break.", selfClosing: true },
  { tag: "hr", documentation: "Horizontal rule.", selfClosing: true },
  {
    tag: "img",
    documentation: "Image.",
    selfClosing: true,
    attributes: ' src="${1:image.jpg}" alt="${2:description}"',
  },
  {
    tag: "input",
    documentation: "Form input.",
    selfClosing: true,
    attributes: ' type="${1:text}" id="${2:name}"',
  },
  { tag: "meta", documentation: "Page metadata.", selfClosing: true, attributes: ' charset="${1:utf-8}"' },
  {
    tag: "link",
    documentation: "External resource, usually a stylesheet.",
    selfClosing: true,
    attributes: ' rel="stylesheet" href="${1:styles.css}"',
  },
];

/**
 * Completions for index.html. Monaco proposes tags only after a `<` has been
 * typed, and offers nothing at all inside <style> or <script>, so this provider
 * covers all three regions: bare-word tag completion in the markup, CSS
 * properties and values in a <style> block, and DOM snippets in a <script> one.
 */
const registerHtmlCompletions = (monacoInstance: any) => {
  const snippetRule = monacoInstance.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  const Kind = monacoInstance.languages.CompletionItemKind;

  return monacoInstance.languages.registerCompletionItemProvider("html", {
    triggerCharacters: ["<", ":", ".", "-"],
    provideCompletionItems: (model: any, position: any) => {
      const before = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });
      const region = regionAt(before);
      const word = model.getWordUntilPosition(position);
      const lineText = model.getLineContent(position.lineNumber);
      const baseRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      if (region === "style") {
        const lineBefore = lineText.slice(0, position.column - 1);
        const declaration = /([a-z-]+)\s*:\s*[^;]*$/i.exec(lineBefore);

        // After `property:` propose that property's values, otherwise properties.
        if (declaration) {
          const values = CSS_VALUES[declaration[1].toLowerCase()] || [];
          return {
            suggestions: values.map((value) => ({
              label: value,
              kind: Kind.Value,
              insertText: value,
              detail: declaration[1],
              range: baseRange,
            })),
          };
        }

        return {
          suggestions: CSS_PROPERTIES.map(({ name, documentation }) => ({
            label: name,
            kind: Kind.Property,
            insertText: `${name}: $0;`,
            insertTextRules: snippetRule,
            documentation,
            detail: "CSS",
            range: baseRange,
          })),
        };
      }

      if (region === "script") {
        return {
          suggestions: EMBEDDED_JS_SNIPPETS.map(({ label, insertText, documentation }) => ({
            label,
            kind: Kind.Snippet,
            insertText,
            insertTextRules: snippetRule,
            documentation,
            detail: "JavaScript",
            range: baseRange,
          })),
        };
      }

      const charBeforeWord = lineText[word.startColumn - 2];

      // Already typing an attribute inside a tag — leave that to Monaco.
      const openTagBefore = lineText.slice(0, word.startColumn - 1).lastIndexOf("<");
      const closeTagBefore = lineText.slice(0, word.startColumn - 1).lastIndexOf(">");
      if (openTagBefore > closeTagBefore && charBeforeWord !== "<") {
        return { suggestions: [] };
      }

      const range = {
        ...baseRange,
        // Swallow the `<` when there is one so it is never doubled up.
        startColumn: charBeforeWord === "<" ? word.startColumn - 1 : word.startColumn,
      };

      return {
        suggestions: HTML_TAGS.map(({ tag, documentation, selfClosing, attributes }) => ({
          label: tag,
          kind: Kind.Snippet,
          detail: `<${tag}>`,
          documentation,
          insertText: selfClosing
            ? `<${tag}${attributes || ""} />$0`
            : `<${tag}${attributes || ""}>$0</${tag}>`,
          insertTextRules: snippetRule,
          range,
        })),
      };
    },
  });
};

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

/**
 * Closes a tag as soon as its `>` is typed and leaves the caret between the
 * pair, so `<div>` becomes `<div>|</div>`. Monaco's own `autoClosingTags`
 * option is not in the build loaded here, so this does the same job.
 */
const attachTagAutoClosing = (editor: any, monacoInstance: any) =>
  editor.onDidType((typed: string) => {
    if (typed !== ">") return;
    if (editor.getModel()?.getLanguageId() !== "html") return;

    const position = editor.getPosition();
    if (!position) return;

    const lineBefore = editor.getModel().getLineContent(position.lineNumber).slice(0, position.column - 1);
    const openTag = /<([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^<>"'])*)>$/.exec(lineBefore);
    if (!openTag) return;

    const [, tagName, attributes] = openTag;
    if (VOID_TAGS.has(tagName.toLowerCase()) || attributes.trim().endsWith("/")) return;

    editor.executeEdits("auto-close-tag", [
      {
        range: new monacoInstance.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: `</${tagName}>`,
      },
    ]);
    editor.setPosition(position);
  });

const TUTOR_GREETING = {
  role: "assistant",
  content:
    "Hi! I am your AI Web Development tutor. Ask me about HTML, CSS or JavaScript, ask me to fix or restyle something you have already written, or ask me for a whole page.",
};

export const WebDevIDE: React.FC<Props> = ({ onBack }) => {
  const [files, setFiles] = useState<WebProjectFiles>(DEFAULT_FILES);
  const [activeFile, setActiveFile] = useState<FileKey>("html");
  const [previewDocument, setPreviewDocument] = useState(() => buildPreviewDocument(DEFAULT_FILES));
  const [previewKey, setPreviewKey] = useState(0);
  const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
  const [bottomTab, setBottomTab] = useState<"preview" | "console">("preview");
  const [previewWidth, setPreviewWidth] = useState<keyof typeof PREVIEW_WIDTHS>("desktop");
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);

  // The rendered page opens as its own column between the editor and the tutor
  // once the student runs, and closes again from the X in its header.
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editorRatio, setEditorRatio] = useState(60);
  const [previewRatio, setPreviewRatio] = useState(0);
  const [dragTarget, setDragTarget] = useState<null | "editor" | "preview">(null);
  const [isMobileLayout, setIsMobileLayout] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<"chat" | "code" | "preview">("code");

  const workspaceRef = useRef<HTMLDivElement>(null);
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [autoRunCommands, setAutoRunCommands] = useState(true);

  const [messages, setMessages] = useState<{ role: string; content: any }[]>([TUTOR_GREETING]);
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const activeTab = FILE_TABS.find((tab) => tab.key === activeFile) || FILE_TABS[0];
  const errorCount = consoleEntries.filter((entry) => entry.level === "error").length;

  // The tutor patches whatever is in the editor at the moment its reply lands,
  // not the snapshot from when the student pressed send.
  const filesRef = useRef(files);
  filesRef.current = files;

  const chatRatio = Math.max(0, 100 - editorRatio - previewRatio);

  const handleDividerDown = (target: "editor" | "preview") => (e: React.PointerEvent) => {
    setDragTarget(target);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent) => {
    if (!dragTarget || !workspaceRef.current) return;
    if (window.innerWidth < 1024) return;

    const { left, width } = workspaceRef.current.getBoundingClientRect();
    const pointerRatio = ((e.clientX - left) / width) * 100;

    // Every column keeps a usable minimum width, so a drag can never collapse
    // the tutor or the preview to a sliver.
    if (dragTarget === "editor") {
      setEditorRatio(Math.max(22, Math.min(100 - previewRatio - 18, pointerRatio)));
    } else {
      setPreviewRatio(
        Math.max(18, Math.min(100 - editorRatio - 18, pointerRatio - editorRatio))
      );
    }
  };

  const handleUp = (e: React.PointerEvent) => {
    setDragTarget(null);
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading]);

  useEffect(() => {
    const updateLayoutMode = () => setIsMobileLayout(window.innerWidth < 1024);
    updateLayoutMode();
    window.addEventListener("resize", updateLayoutMode);
    return () => window.removeEventListener("resize", updateLayoutMode);
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

  useEffect(() => {
    setShowTutorial(true);
    const timer = setTimeout(() => setShowTutorial(false), 5500);
    return () => clearTimeout(timer);
  }, []);

  // Console messages bubbled up from the sandboxed preview frame.
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object" || !(data as any).__sidemannWebConsole) return;
      setConsoleEntries((prev) => [
        ...prev.slice(-199),
        { level: String((data as any).level || "log"), text: String((data as any).text ?? "") },
      ]);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    consoleOutputRef.current?.scrollTo({
      top: consoleOutputRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [consoleEntries, bottomTab]);

  // Escape leaves the full-page view, the way every other overlay here behaves.
  useEffect(() => {
    if (!isPreviewMaximized) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsPreviewMaximized(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isPreviewMaximized]);

  /** Rebuilds the frame's document without touching the layout. */
  const renderProject = useCallback(
    (source?: WebProjectFiles) => {
      const project = source ?? files;
      setConsoleEntries([]);
      setPreviewDocument(buildPreviewDocument(project));
      setPreviewKey((key) => key + 1);
      setHasRendered(true);
    },
    [files]
  );

  /** Run: renders the page and opens the preview column next to the editor. */
  const runProject = useCallback(
    (source?: WebProjectFiles) => {
      setIsRendering(true);
      renderProject(source);
      setBottomTab("preview");
      setIsPreviewOpen(true);
      // First open borrows its width from the editor rather than the tutor.
      setPreviewRatio((current) => (current > 0 ? current : 34));
      setEditorRatio((current) => (current > 44 ? 40 : current));
      setActiveMobileTab("preview");
      window.setTimeout(() => setIsRendering(false), 260);
    },
    [renderProject]
  );

  const closePreview = () => {
    setIsPreviewOpen(false);
    setIsPreviewMaximized(false);
    setEditorRatio((current) => Math.min(70, current + previewRatio));
    setActiveMobileTab("code");
  };

  const runProjectRef = useRef(runProject);
  runProjectRef.current = runProject;

  // Auto-refresh keeps an open preview in step with typing, debounced so a
  // burst of keystrokes rebuilds the frame once rather than on every character.
  useEffect(() => {
    if (!autoRefresh || !isPreviewOpen) return;
    const timer = window.setTimeout(() => {
      setConsoleEntries([]);
      setPreviewDocument(buildPreviewDocument(files));
      setPreviewKey((key) => key + 1);
      setHasRendered(true);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [files, autoRefresh, isPreviewOpen]);

  const updateFile = (key: FileKey, value: string) => {
    setFiles((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditorChange = (value: string | undefined) => {
    updateFile(activeFile, value || "");
  };

  const handleReset = () => {
    setFiles(DEFAULT_FILES);
    setConsoleEntries([]);
    if (isPreviewOpen) renderProject(DEFAULT_FILES);
  };

  const handleDownload = () => {
    const blob = new Blob([buildPreviewDocument(files)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "index.html";
    anchor.click();
    URL.revokeObjectURL(url);
  };

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

  /** Types a project into the three editors, then previews it. */
  const loadProject = async (project: WebProjectFiles, autoRun = false) => {
    if (autoRun) setActiveMobileTab("code");
    setIsTyping(true);
    setTypingMessage(autoRun ? "Writing the tutor's page into the editor..." : "Loading boilerplate...");

    setFiles({ html: "", css: "", js: "" });
    await new Promise((r) => setTimeout(r, 200));
    setTypingMessage("");

    const order: FileKey[] = ["html", "css", "js"];
    for (const key of order) {
      const content = project[key];
      if (!content) continue;
      setActiveFile(key);
      let current = "";
      const step = Math.max(4, Math.ceil(content.length / 120));
      for (let i = 0; i < content.length; i += step) {
        current += content.slice(i, i + step);
        const snapshot = current;
        setFiles((prev) => ({ ...prev, [key]: snapshot }));
        await new Promise((r) => setTimeout(r, 6));
      }
      setFiles((prev) => ({ ...prev, [key]: content }));
    }

    setActiveFile("html");
    setIsTyping(false);
    setBottomTab("preview");
    runProjectRef.current(project);
  };

  const startNewChat = () => {
    setMessages([TUTOR_GREETING]);
    setChatInput("");
    setAttachedImage(null);
    setIsAiLoading(false);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() && !attachedImage) return;

    let userContent: any = chatInput;
    if (attachedImage) {
      userContent = [];
      if (chatInput.trim()) userContent.push({ type: "text", text: chatInput });
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
              "Please configure your environment variable VITE_GROQ_API_KEY in Vercel to use the AI Web Development tutor.",
          },
        ]);
        setIsAiLoading(false);
        return;
      }

      const systemPrompt = `You are an expert web development tutor for NC/ND IT polytechnic students. Help them master HTML, CSS and JavaScript.
- If the student greets you, jokes casually, says thanks, or asks a normal non-code question, respond naturally and briefly. Do not force a lesson or long explanation unless they ask for one.
- If the student's intent is unclear, ask one short clarifying question instead of guessing a topic.
- By default the student writes ONE complete file: index.html holding the whole document, with its CSS in a <style> block inside <head> and its JavaScript in a <script> block before </body>. Answer that way unless the student asks you to separate the files.
- Put that whole document in a single \`\`\`html block, starting at <!DOCTYPE html>.
- Only when the student asks for separate files, use a \`\`\`css block and a \`\`\`javascript block as well — those land in styles.css and script.js and are merged into the page automatically, so never write <link> or <script src> tags for them. Use at most one block per language.
- Use plain HTML, CSS and vanilla JavaScript only. No React, no jQuery, no Bootstrap, no CDN links — the preview frame cannot load external files.
- Add short English comments explaining what each main part does.
- Use console.log where it helps the student see what is happening in the console panel.
- Provide explanations simply and professionally, without sales jargon.

HOW TO REPLY
You must always reply with a single JSON object and nothing else. The JSON has this shape:

{
  "reply": "your answer to the student, in markdown",
  "edits": [ { "file": "index.html", "find": "the exact text to look for", "replace": "the text that takes its place" } ],
  "newPage": { "html": "...", "css": "...", "js": "..." }
}

- "reply" is always present. For a plain question, answer there and send "edits": [] with no "newPage".
- Use "edits" whenever the student asks you to change, fix, style or add to code that is already in their files. This is the normal case.
  - "find" must be copied from their file character for character, including indentation. Never invent text that is not there.
  - Keep "find" as short as possible: the one line that changes, not the whole element or file. To fix the word "labl" you match that one line only.
  - To add something new, either set "find" to "" (the code is appended to that file) or match the line it must come after and repeat that line at the start of "replace".
  - Use several small edits rather than one large one when several places change.
  - Never send an edit that rewrites the whole document.
- Use "newPage" only when the student asks for a brand new page built from scratch. Put the complete document in "html". Leave "css" and "js" as "" when the styling and script live inside the HTML.
- Never wrap the JSON in a code fence and never write anything outside it.`;

      // One shared list, strongest first — see services/groq.ts. Following the
      // edit contract needs a model that can copy a line back exactly, which the
      // smallest ones do not manage, so the order matters here.
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
              model,
              ...groqReasoningParams(model),
              messages: [
                { role: "system", content: systemPrompt },
                ...messages.map((m) => ({ role: m.role, content: m.content })),
                {
                  role: "system",
                  content: `The student's project as it stands right now:\n\n${buildFilesContext(
                    filesRef.current,
                    activeFile
                  )}`,
                },
                newMsg,
              ],
              temperature: 0.3,
              max_tokens: 2000,
              response_format: { type: "json_object" },
            }),
          });

          data = await response.json();
          if (!data.error) break;
          lastError = new Error(data.error.message || "API Error");
        } catch (err: any) {
          lastError = err;
        }
      }

      if (!data || data.error) {
        throw lastError || new Error("All Groq models failed to respond.");
      }

      const aiText = data.choices[0].message.content || "";

      // The tutor is asked for a JSON object; older/weaker replies come back as
      // markdown with conflict-marker blocks, so both shapes are accepted.
      const structured = parseTutorJson(aiText);
      const editBlocks = structured ? structured.edits : parseEditBlocks(aiText);
      const markdown = structured ? structured.reply : aiText;

      const htmlMatch = markdown.match(/```html\s*([\s\S]*?)\s*```/i);
      const cssMatch = markdown.match(/```css\s*([\s\S]*?)\s*```/i);
      const jsMatch = markdown.match(/```(?:javascript|js)\s*([\s\S]*?)\s*```/i);

      // A patch is applied to the files straight away — the student sees the
      // one changed line appear rather than the whole file being retyped.
      let displayText = structured ? markdown : stripEditBlocks(aiText) || aiText;
      if (autoRunCommands && editBlocks.length > 0) {
        const { files: patched, outcomes } = applyEditBlocks(filesRef.current, editBlocks);
        setFiles(patched);
        if (isPreviewOpen) renderProject(patched);
        displayText = `${displayText}\n\n${summariseOutcomes(outcomes)}`.trim();
      }

      if (autoRunCommands && structured?.newPage) {
        const page = structured.newPage;
        loadProject(
          {
            html: page.html || filesRef.current.html,
            css: page.css || "",
            js: page.js || "",
          },
          true
        );
      }

      setIsAiLoading(false);
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let currentText = "";
      const chunkSize = Math.max(1, Math.floor(displayText.length / 32));
      for (let i = 0; i < displayText.length; i += chunkSize) {
        currentText += displayText.slice(i, i + chunkSize);
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = currentText;
          return newMessages;
        });
        await new Promise((r) => setTimeout(r, 12));
      }

      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = displayText;
        return newMessages;
      });

      // Whole-file blocks are only for a page built from scratch.
      if (autoRunCommands && !structured && editBlocks.length === 0 && (htmlMatch || cssMatch || jsMatch)) {
        // Files the tutor did not touch keep whatever the student already wrote.
        loadProject({
          html: htmlMatch ? htmlMatch[1].trim() : filesRef.current.html,
          css: cssMatch ? cssMatch[1].trim() : filesRef.current.css,
          js: jsMatch ? jsMatch[1].trim() : filesRef.current.js,
        }, true);
      }
    } catch (err: any) {
      setIsAiLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `API tutor execution error: ${err.message}` },
      ]);
    }
  };

  const syllabusProjects = useMemo(
    () => [
      {
        title: "1. Page structure with HTML",
        description: "One file: headings, paragraphs, lists, links and images.",
        project: {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Department page</title>

  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      padding: 24px;
      line-height: 1.6;
      color: #1f2937;
    }

    h1 { color: #003153; }
  </style>
</head>
<body>
  <!-- Headings tell the browser how important text is -->
  <h1>Chinhoyi Technical College</h1>
  <h2>National Certificate in Information Technology</h2>

  <p>Welcome to our department page. We train students in <strong>software</strong>,
  <em>networking</em> and database administration.</p>

  <h3>What you will study</h3>
  <ul>
    <li>Web development</li>
    <li>Programming in C++</li>
    <li>Database concepts</li>
  </ul>

  <h3>Useful link</h3>
  <a href="https://example.com">Visit the college website</a>

  <script>
    console.log("The page structure has loaded.");
  </script>
</body>
</html>`,
          css: "",
          js: "",
        },
      },
      {
        title: "2. Styling with CSS",
        description: "Colours, fonts, the box model and borders.",
        project: {
          html: `<div class="box">
  <h2>The box model</h2>
  <p>Every element is a box: content, then padding, then border, then margin.</p>
</div>

<div class="box highlight">
  <h2>Second box</h2>
  <p>This one uses an extra class to change its colours.</p>
</div>`,
          css: `body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f8fafc;
  padding: 24px;
}

/* Content -> padding -> border -> margin */
.box {
  background: #ffffff;
  padding: 20px;          /* space inside the border */
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  margin-bottom: 16px;    /* space outside the border */
}

.highlight {
  background: #003153;
  color: #ffffff;
  border-color: #003153;
}`,
          js: `console.log("Styling demo loaded.");`,
        },
      },
      {
        title: "3. Flexbox layout",
        description: "Arranging cards in a row that wraps on small screens.",
        project: {
          html: `<div class="row">
  <div class="card">
    <h3>Hardware</h3>
    <p>Servicing and assembling computers.</p>
  </div>
  <div class="card">
    <h3>Software</h3>
    <p>Writing programs that solve problems.</p>
  </div>
  <div class="card">
    <h3>Networking</h3>
    <p>Connecting machines so they can share data.</p>
  </div>
</div>`,
          css: `body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f1f5f9;
  padding: 24px;
}

/* Flexbox lays children out in a row and wraps them when space runs out */
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px;
  flex: 1 1 200px;   /* grow, shrink, minimum width */
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
}

h3 { color: #003153; margin-top: 0; }`,
          js: `console.log("Flex layout loaded.");`,
        },
      },
      {
        title: "4. Responsive design",
        description: "Media queries that change the layout on phones.",
        project: {
          html: `<header>
  <h1>Responsive page</h1>
  <p>Use the phone, tablet and desktop buttons above the preview to test this.</p>
</header>

<main class="layout">
  <section class="content">
    <h2>Main content</h2>
    <p>On a wide screen this sits next to the sidebar. On a narrow screen it stacks on top.</p>
  </section>
  <aside class="sidebar">
    <h2>Sidebar</h2>
    <p>Extra links and notes.</p>
  </aside>
</main>`,
          css: `body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 20px;
  background: #f8fafc;
}

.layout {
  display: flex;
  gap: 20px;
}

.content { flex: 3; background: #ffffff; padding: 18px; border-radius: 12px; }
.sidebar { flex: 1; background: #003153; color: #ffffff; padding: 18px; border-radius: 12px; }

/* Below 768px the two columns stack into one */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
}`,
          js: `console.log("Resize the preview to see the layout change.");`,
        },
      },
      {
        title: "5. Forms and validation",
        description: "Collecting input and checking it with JavaScript.",
        project: {
          html: `<form id="registrationForm">
  <h2>Student registration</h2>

  <label for="fullName">Full name</label>
  <input type="text" id="fullName" name="fullName" />

  <label for="email">Email address</label>
  <input type="email" id="email" name="email" />

  <button type="submit">Register</button>
</form>

<p id="feedback"></p>`,
          css: `body {
  font-family: Arial, Helvetica, sans-serif;
  background: #f1f5f9;
  padding: 24px;
}

form {
  background: #ffffff;
  max-width: 380px;
  padding: 22px;
  border-radius: 12px;
}

label { display: block; margin-top: 12px; font-size: 14px; font-weight: bold; }
input { width: 100%; padding: 9px; margin-top: 4px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
button { margin-top: 16px; background: #003153; color: #fff; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; }

.error { color: #b91c1c; font-weight: bold; }
.success { color: #047857; font-weight: bold; }`,
          js: `const form = document.getElementById("registrationForm");
const feedback = document.getElementById("feedback");

form.addEventListener("submit", function (event) {
  // Stop the browser from reloading the page
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();

  // Check the name was filled in
  if (name === "") {
    feedback.textContent = "Please enter your full name.";
    feedback.className = "error";
    return;
  }

  // Check the email looks like an email
  if (!email.includes("@") || !email.includes(".")) {
    feedback.textContent = "Please enter a valid email address.";
    feedback.className = "error";
    return;
  }

  feedback.textContent = "Thank you " + name + ", you are registered.";
  feedback.className = "success";
  console.log("Registered:", name, email);
});`,
        },
      },
      {
        title: "6. JavaScript events",
        description: "Reacting to clicks and changing the page.",
        project: {
          html: `<h2>Colour changer</h2>
<p>Click a button to change the box below.</p>

<button id="blueButton">Blue</button>
<button id="greenButton">Green</button>
<button id="resetButton">Reset</button>

<div id="colourBox"></div>`,
          css: `body {
  font-family: Arial, Helvetica, sans-serif;
  padding: 24px;
}

button {
  padding: 9px 16px;
  margin-right: 8px;
  border: none;
  border-radius: 8px;
  background: #003153;
  color: #ffffff;
  cursor: pointer;
}

#colourBox {
  margin-top: 20px;
  width: 220px;
  height: 140px;
  border: 2px solid #cbd5e1;
  border-radius: 12px;
  background: #f1f5f9;
}`,
          js: `const colourBox = document.getElementById("colourBox");

// Each button listens for its own click
document.getElementById("blueButton").addEventListener("click", function () {
  colourBox.style.background = "#2563eb";
  console.log("Box turned blue.");
});

document.getElementById("greenButton").addEventListener("click", function () {
  colourBox.style.background = "#16a34a";
  console.log("Box turned green.");
});

document.getElementById("resetButton").addEventListener("click", function () {
  colourBox.style.background = "#f1f5f9";
  console.log("Box reset.");
});`,
        },
      },
      {
        title: "7. Arrays and loops in the DOM",
        description: "Building a list on the page from data.",
        project: {
          html: `<h2>Module marks</h2>

<ul id="moduleList"></ul>

<p id="average"></p>`,
          css: `body { font-family: Arial, Helvetica, sans-serif; padding: 24px; }
li { margin-bottom: 6px; }
#average { font-weight: bold; color: #003153; }`,
          js: `// The data we want to display
const modules = [
  { name: "Web Development", mark: 78 },
  { name: "C++ Programming", mark: 65 },
  { name: "Database Concepts", mark: 82 },
  { name: "Networking", mark: 59 }
];

const list = document.getElementById("moduleList");
let total = 0;

// Loop through the array and build one list item per module
for (let i = 0; i < modules.length; i++) {
  const item = document.createElement("li");
  item.textContent = modules[i].name + ": " + modules[i].mark + "%";
  list.appendChild(item);

  total = total + modules[i].mark;
}

// Work out the average and show it
const average = total / modules.length;
document.getElementById("average").textContent = "Average mark: " + average.toFixed(1) + "%";
console.log("Modules displayed:", modules.length);`,
        },
      },
      {
        title: "8. Tables and CSS grid",
        description: "Presenting records and a picture gallery.",
        project: {
          html: `<h2>Class register</h2>
<table>
  <thead>
    <tr><th>Student number</th><th>Name</th><th>Programme</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Tanaka</td><td>NC IT</td></tr>
    <tr><td>2</td><td>Rudo</td><td>ND IT</td></tr>
    <tr><td>3</td><td>Farai</td><td>NC IT</td></tr>
  </tbody>
</table>

<h2>Grid gallery</h2>
<div class="gallery">
  <div class="tile">1</div>
  <div class="tile">2</div>
  <div class="tile">3</div>
  <div class="tile">4</div>
  <div class="tile">5</div>
  <div class="tile">6</div>
</div>`,
          css: `body { font-family: Arial, Helvetica, sans-serif; padding: 24px; background: #f8fafc; }

table {
  border-collapse: collapse;
  width: 100%;
  background: #ffffff;
}

th, td {
  border: 1px solid #cbd5e1;
  padding: 10px;
  text-align: left;
}

th { background: #003153; color: #ffffff; }

/* Grid places the tiles in equal columns automatically */
.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.tile {
  background: #003153;
  color: #ffffff;
  height: 90px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

@media (max-width: 600px) {
  .gallery { grid-template-columns: repeat(2, 1fr); }
}`,
          js: `console.log("Table and grid demo loaded.");`,
        },
      },
    ],
    []
  );

  const monaco = useMonaco();
  useEffect(() => {
    if (monaco) {
      configureWebMonaco(monaco);
      monaco.editor.setTheme(isDarkMode ? "sidemann-web-dark" : "sidemann-web-light");
    }
  }, [monaco, isDarkMode]);

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
              <span className="sm:hidden">Web Dev IDE</span>
              <span className="hidden sm:inline">Web Development Practice IDE</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <TeachMeLaunchButton isDarkMode={isDarkMode} />
          <button
            onClick={handleDownload}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-300 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-black"}`}
            title="Download the finished page as one HTML file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline">Download</span>
          </button>
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
          {/* Editor column */}
          <div
            className={`${activeMobileTab === "code" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-1 min-w-0 flex-col relative h-full`}
            style={
              isMobileLayout
                ? { flexBasis: "auto", flexGrow: 1 }
                : {
                    flexBasis: `${editorRatio}%`,
                    flexGrow: 0,
                    transition: dragTarget ? "none" : "flex-basis 0.3s ease-in-out",
                  }
            }
          >
            <div
              className={`flex flex-col overflow-hidden h-full shadow-[2px_0_8px_rgba(0,0,0,0.05)] ${isDarkMode ? "bg-[#1e1e1e]" : "bg-white"}`}
            >
              {/* File tabs + run controls */}
              <div
                className={`px-2 sm:px-3 py-2 flex items-center justify-between border-b shrink-0 gap-2 ${isDarkMode ? "bg-[#252526] border-[#404040]" : "bg-[#f8f9fa] border-gray-200"}`}
              >
                <div className="flex items-center gap-1 min-w-0 overflow-x-auto custom-scrollbar">
                  {FILE_TABS.map((tab) => {
                    const isActive = tab.key === activeFile;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveFile(tab.key)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors border ${
                          isActive
                            ? isDarkMode
                              ? "bg-[#1e1e1e] border-[#555] text-white"
                              : "bg-white border-gray-300 text-gray-900 shadow-sm"
                            : isDarkMode
                              ? "border-transparent text-gray-400 hover:bg-[#333]"
                              : "border-transparent text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        <tab.Icon className={`w-3.5 h-3.5 ${isActive ? tab.accent : ""}`} />
                        {tab.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    className={`hidden xl:flex items-center gap-1.5 text-[10px] font-mono font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                    title="Re-render the preview as you type"
                  >
                    <span>Live</span>
                    <input
                      type="checkbox"
                      checked={autoRefresh}
                      onChange={(e) => setAutoRefresh(e.target.checked)}
                      className="rounded border-gray-400 accent-indigo-500 w-3 h-3 cursor-pointer"
                    />
                  </label>

                  <button
                    onClick={handleReset}
                    className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded border transition-colors ${
                      isDarkMode
                        ? "bg-[#333] border-[#555] text-gray-200 hover:bg-[#444]"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                    title="Reset to the starter project"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">Reset</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => {
                        setBottomTab("preview");
                        runProject();
                      }}
                      className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-md font-semibold text-xs sm:text-sm transition-all bg-[#003153] hover:bg-blue-800 text-white shadow hover:shadow-md active:scale-[0.98]"
                    >
                      {isRendering ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                      <span>Run</span>
                    </button>

                    {showTutorial && (
                      <div className="absolute top-10 right-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-bounce whitespace-nowrap">
                        <Lightbulb size={12} fill="currentColor" /> Edit and watch it render!
                        <div className="absolute -top-1 right-6 w-2 h-2 bg-indigo-600 rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex-1 min-h-0 bg-[#fffffe] dark:bg-[#1e1e1e]">
                <Editor
                  height="100%"
                  language={activeTab.language}
                  path={activeTab.path}
                  theme={isDarkMode ? "sidemann-web-dark" : "sidemann-web-light"}
                  value={files[activeFile]}
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
                    // Closes <div> as you type </ — the option is newer than the
                    // typings bundled with @monaco-editor/react, hence the cast.
                    ...({ autoClosingTags: true } as any),
                    formatOnPaste: true,
                    formatOnType: true,
                    tabCompletion: "on",
                    suggestOnTriggerCharacters: true,
                    acceptSuggestionOnEnter: "on",
                    quickSuggestions: { other: true, comments: false, strings: true },
                    snippetSuggestions: "top",
                    suggestSelection: "first",
                    bracketPairColorization: { enabled: true },
                    guides: { bracketPairs: true, indentation: true },
                    colorDecorators: true,
                  }}
                  beforeMount={configureWebMonaco}
                  onMount={(editor, monacoInstance) => {
                    configureWebMonaco(monacoInstance);
                    monacoInstance.editor.setTheme(
                      isDarkMode ? "sidemann-web-dark" : "sidemann-web-light"
                    );
                    editor.addCommand(
                      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Enter,
                      () => {
                        runProjectRef.current();
                      }
                    );

                    const providers = registerWebSnippets(monacoInstance);
                    const autoClosing = attachTagAutoClosing(editor, monacoInstance);
                    editor.onDidDispose(() => {
                      providers.forEach((provider: any) => provider.dispose());
                      autoClosing.dispose();
                    });
                  }}
                />
              </div>
            </div>

          </div>

          {/* Drag Handle (editor / preview) */}
          {isPreviewOpen && (
            <div
              className={`hidden lg:flex items-center justify-center relative z-20 cursor-col-resize ${isDarkMode ? "bg-[#2a2a2a]" : "bg-gray-200"} w-2 h-full group hover:bg-indigo-500 active:bg-indigo-600 transition-colors border-x ${isDarkMode ? "border-[#404040]" : "border-gray-300"}`}
              onPointerDown={handleDividerDown("editor")}
            >
              <div
                className={`w-1 h-8 rounded-full ${isDarkMode ? "bg-gray-500" : "bg-gray-400"} group-hover:bg-indigo-300`}
              />
            </div>
          )}

          {/* Rendered page column: sits between the editor and the AI tutor,
              or fills the whole screen when maximised. */}
          {isPreviewOpen && (
            <div
              className={
                isPreviewMaximized
                  ? `fixed inset-0 z-[190] flex flex-col ${isDarkMode ? "bg-[#181818]" : "bg-white"}`
                  : `${activeMobileTab === "preview" ? "flex mobile-tab-panel" : "hidden"} lg:flex flex-col min-w-0 h-full ${isDarkMode ? "bg-[#181818]" : "bg-white"}`
              }
              style={
                isPreviewMaximized
                  ? undefined
                  : isMobileLayout
                    ? { flexBasis: "auto", flexGrow: 1 }
                    : {
                        flexBasis: `${previewRatio}%`,
                        flexGrow: 0,
                        overflow: "hidden",
                        transition: dragTarget ? "none" : "flex-basis 0.3s ease-in-out",
                      }
              }
            >
              <div
                className={`px-3 py-2 flex items-center justify-between border-b shrink-0 gap-2 ${isDarkMode ? "bg-[#1f1f1f] border-[#404040]" : "bg-slate-100 border-slate-300"}`}
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBottomTab("preview")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      bottomTab === "preview"
                        ? "text-sky-500"
                        : isDarkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setBottomTab("console")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      bottomTab === "console"
                        ? "text-sky-500"
                        : isDarkMode
                          ? "text-gray-500 hover:text-gray-300"
                          : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <Terminal size={14} />
                    Console
                    {errorCount > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px]">
                        {errorCount}
                      </span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {bottomTab === "preview" ? (
                    <>
                      {(
                        [
                          ["desktop", Monitor],
                          ["tablet", Tablet],
                          ["mobile", Smartphone],
                        ] as const
                      ).map(([key, Icon]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setPreviewWidth(key)}
                          className={`p-1.5 rounded transition-colors ${
                            previewWidth === key
                              ? isDarkMode
                                ? "bg-sky-950/50 text-sky-300"
                                : "bg-sky-100 text-sky-700"
                              : isDarkMode
                                ? "text-gray-500 hover:text-gray-300"
                                : "text-slate-400 hover:text-slate-600"
                          }`}
                          title={`${key} width`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => renderProject()}
                        className={`p-1.5 rounded transition-colors ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-300/60"}`}
                        title="Reload preview"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConsoleEntries([])}
                      className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-slate-500 hover:text-slate-900 hover:bg-slate-300/60"}`}
                      title="Clear console"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsPreviewMaximized((current) => !current)}
                    className={`p-1.5 rounded transition-colors ${isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-300/60 text-slate-500 hover:text-slate-900"}`}
                    title={isPreviewMaximized ? "Exit full page" : "View the page full screen"}
                  >
                    {isPreviewMaximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={closePreview}
                    className={`p-1.5 rounded transition-colors ${isDarkMode ? "hover:bg-white/10 text-gray-400 hover:text-white" : "hover:bg-slate-300/60 text-slate-500 hover:text-slate-900"}`}
                    title="Close the rendered page"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {bottomTab === "preview" ? (
                <div
                  className={`flex-1 min-h-0 overflow-auto flex justify-center ${isDarkMode ? "bg-[#0f0f0f]" : "bg-slate-200"}`}
                >
                  <iframe
                    key={previewKey}
                    title="Live preview"
                    srcDoc={previewDocument}
                    sandbox="allow-scripts allow-modals allow-forms allow-popups"
                    className="h-full border-0 bg-white transition-[width] duration-200"
                    style={{ width: PREVIEW_WIDTHS[previewWidth] }}
                  />
                </div>
              ) : (
                <div
                  ref={consoleOutputRef}
                  className={`flex-1 min-h-0 overflow-auto p-3 font-mono text-xs md:text-sm custom-scrollbar whitespace-pre-wrap leading-relaxed ${isDarkMode ? "text-white bg-slate-950" : "text-slate-800 bg-white"}`}
                >
                  {consoleEntries.length === 0 ? (
                    <div className={`px-2 py-1 ${isDarkMode ? "text-gray-500" : "text-slate-400"}`}>
                      Nothing logged yet. Use console.log(...) in your script and run the page.
                    </div>
                  ) : (
                    consoleEntries.map((entry, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 border-b border-transparent py-0.5 px-2 ${
                          isDarkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                        } ${
                          entry.level === "error"
                            ? isDarkMode
                              ? "text-red-400"
                              : "text-red-600"
                            : entry.level === "warn"
                              ? isDarkMode
                                ? "text-amber-300"
                                : "text-amber-600"
                              : ""
                        }`}
                      >
                        <span className="select-none font-mono text-[11px] mt-[3px] shrink-0">
                          {entry.level === "error" ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <span className="text-slate-500">&gt;</span>
                          )}
                        </span>
                        <span className="min-w-0 break-words">{entry.text}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Drag Handle (preview / tutor) */}
          <div
            className={`hidden lg:flex items-center justify-center relative z-20 cursor-col-resize ${isDarkMode ? "bg-[#2a2a2a]" : "bg-gray-200"} w-2 h-full group hover:bg-pink-500 active:bg-pink-600 transition-colors border-x ${isDarkMode ? "border-[#404040]" : "border-gray-300"}`}
            onPointerDown={handleDividerDown(isPreviewOpen ? "preview" : "editor")}
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
                    flexBasis: `${chatRatio}%`,
                    flexGrow: 0,
                    transition: dragTarget ? "none" : "flex-basis 0.3s ease-in-out",
                  }
            }
          >
            <div
              className={`flex items-center justify-between gap-3 shrink-0 h-11 px-4 border-b ${isDarkMode ? "bg-[#1e1e1e] border-[#404040] text-pink-400" : "bg-gray-50 border-gray-200 text-pink-600"}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="w-4 h-4 shrink-0" />
                <span className="font-semibold text-xs uppercase tracking-wider truncate">
                  AI Web Dev Tutor
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  role="switch"
                  aria-checked={autoRunCommands}
                  onClick={() => setAutoRunCommands((current) => !current)}
                  id="toggle-auto-inject-run"
                  title="Let the tutor write its changes straight into the editor"
                  className={`flex items-center gap-1.5 text-[10px] font-mono font-medium transition-colors ${
                    isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <span>Auto Injection</span>
                  <span
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                      autoRunCommands
                        ? "bg-pink-500"
                        : isDarkMode
                          ? "bg-gray-600"
                          : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                        autoRunCommands ? "translate-x-3.5" : "translate-x-0.5"
                      }`}
                    />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={startNewChat}
                  title="Start a new chat"
                  className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                    isDarkMode
                      ? "text-gray-300 hover:bg-white/10 hover:text-white"
                      : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">New chat</span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col h-full">
              <div className="flex-1 flex flex-col min-h-0 relative h-full">
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
                            <ReactMarkdown components={makeMarkdownComponents(isDarkMode, "html")}>
                              {m.content}
                            </ReactMarkdown>
                          </div>
                        ) : Array.isArray(m.content) ? (
                          m.content.map((elem: any, elemIdx: number) => {
                            if (elem.type === "text") {
                              return (
                                <div key={elemIdx} className="markdown-body prose-chat">
                                  <ReactMarkdown components={makeMarkdownComponents(isDarkMode, "html")}>
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
                      Drop a screenshot of the design you want to build!
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

      {/* Mobile tab bar */}
      <div
        className={`lg:hidden fixed left-0 right-0 bottom-0 z-[170] border-t px-4 pt-2 ${
          isDarkMode ? "bg-[#1e1e1e] border-[#404040]" : "bg-white border-gray-200"
        }`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8px)" }}
      >
        <div className={`grid gap-2 ${isPreviewOpen ? "grid-cols-3" : "grid-cols-2"}`}>
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
            <Code2 className="w-4 h-4" />
            <span>Code</span>
          </button>
          {isPreviewOpen && (
            <button
              type="button"
              onClick={() => setActiveMobileTab("preview")}
              className={`h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors ${
                activeMobileTab === "preview"
                  ? isDarkMode
                    ? "bg-sky-950/40 text-sky-300"
                    : "bg-sky-50 text-sky-700"
                  : isDarkMode
                    ? "text-gray-400 hover:bg-white/5"
                    : "text-gray-500 hover:bg-slate-100"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Page</span>
              {hasRendered && (
                <span
                  className={`h-1.5 w-1.5 rounded-full ${errorCount > 0 ? "bg-red-500" : "bg-emerald-500"}`}
                />
              )}
            </button>
          )}
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
            {syllabusProjects.map((topic, index) => (
              <div
                key={index}
                onClick={() => {
                  loadProject(topic.project);
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
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate group-hover:text-indigo-500">
                    {topic.title.replace(/^\d+\.\s*/, "")}
                  </h4>
                  <p className={`text-[10px] leading-snug truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {topic.description}
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

export default WebDevIDE;

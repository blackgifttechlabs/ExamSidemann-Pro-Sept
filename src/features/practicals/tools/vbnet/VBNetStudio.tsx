import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  ArrowLeft,
  BringToFront,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleArrowLeft,
  CircleArrowRight,
  Code2,
  FileCode2,
  FilePlus2,
  Filter,
  FolderOpen,
  FolderTree,
  Home,
  Info,
  LayoutGrid,
  ListOrdered,
  Lock,
  MoveHorizontal,
  MoveVertical,
  Minus,
  Pin,
  Play,
  Redo,
  RefreshCw,
  RotateCcw,
  Save,
  SaveAll,
  Scaling,
  Search,
  SendToBack,
  Settings2,
  Square,
  SquareCode,
  TriangleAlert,
  Undo,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { TeachMeLaunchButton } from '../shared/TeachMeLaunchButton';
import {
  clearSavedProject,
  EVENTS_FOR,
  FORM_PROPERTY_ROWS,
  isComponent,
  loadProject,
  makeControl,
  nextControlName,
  PropertyRow,
  propertyRowsFor,
  saveProject,
  TOOLBOX,
  VbControl,
  VbControlKind,
  VbForm,
  VbProject,
  vbId,
} from './vbProject';
import { defaultFormCode, designerCode, ensureHandler, renameInCode } from './vbCodeGen';
import { parseVb, VbDiagnostic } from './vbInterpreter';
import { VbFormDesigner } from './VbFormDesigner';
import { RunLogEntry, VbRunWindow } from './VbRunWindow';
import { DESKTOP_APP_STYLES } from '../shared/desktopAppStyles';

/**
 * Microsoft Visual Studio, rebuilt around a working VB.NET Windows Forms
 * project: the menu bar, the Toolbox, the design surface, Solution Explorer,
 * the Properties window with its Events tab, the code editor, and Error List /
 * Output docked along the bottom.
 *
 * Start (F5) opens the form as a live window and runs the code behind it. The
 * menus and toolbar carry the commands the real IDE carries; the ones this lab
 * does not implement are greyed out rather than dropped, so the window is the
 * one a student meets in the lab.
 */

/**
 * The Visual Studio 2019 "Blue" theme, which is what the lab machines run.
 *
 * Every band in the shell takes its colour from here rather than carrying its
 * own hex in a class name, so the whole IDE is re-tinted from one place. The
 * values are read off the IDE itself: a light strip under the menus, the blue
 * window caption and status bar, and the gold caption a tool window wears while
 * it holds focus.
 */
const VS = {
  /** Window caption and status bar. */
  caption: '#4a76a8',
  captionText: '#ffffff',
  /** The light strip the logo, menus and Ctrl+Q box sit on. */
  menuStrip: '#eeeef2',
  toolStrip: '#e9edf5',
  hairline: '#c3cdda',
  /** Docked tool windows. */
  toolWindow: '#f0f4fa',
  paneCaption: '#e5ecf6',
  /** A focused tool window caption goes gold in this theme. */
  paneCaptionActive: '#f6cb72',
  paneBody: '#ffffff',
  /** The document well behind the file tabs. */
  tabWell: '#dfe3ec',
  tabActiveAccent: '#e8a33d',
  /** Tree and list selection, and the hover wash. */
  selection: '#c9c5e8',
  hover: '#dbe8f7',
} as const;

type TabKind = 'design' | 'code' | 'designer-code';

interface OpenTab {
  key: string;
  formId: string;
  kind: TabKind;
}

const STARTER_CODE = `Public Class Form1

    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        ' Read the two boxes, add them up and show the answer
        Dim first As Double = Val(TextBox1.Text)
        Dim second As Double = Val(TextBox2.Text)
        Label3.Text = "Total: " & (first + second)
    End Sub

End Class
`;

const starterProject = (): VbProject => {
  const controls: VbControl[] = [
    makeControl('Label', 'Label1', { text: 'First number', x: 24, y: 24, width: 90, height: 17 }),
    makeControl('TextBox', 'TextBox1', { x: 130, y: 21, width: 130, height: 23 }),
    makeControl('Label', 'Label2', { text: 'Second number', x: 24, y: 60, width: 95, height: 17 }),
    makeControl('TextBox', 'TextBox2', { x: 130, y: 57, width: 130, height: 23 }),
    makeControl('Button', 'Button1', { text: 'Add', x: 130, y: 96, width: 90, height: 30 }),
    makeControl('Label', 'Label3', { text: 'Total:', x: 24, y: 142, width: 236, height: 20, bold: true }),
  ];

  return {
    name: 'WindowsApplication1',
    startupForm: 'Form1',
    forms: [
      {
        id: vbId('frm'),
        name: 'Form1',
        text: 'Form1',
        width: 320,
        height: 200,
        backColor: '#f0f0f0',
        startPosition: 'CenterScreen',
        formBorderStyle: 'Sizable',
        controls,
        code: STARTER_CODE,
      },
    ],
  };
};

const MENUS: Array<{ label: string; items: Array<{ label: string; enabled?: boolean; action?: string; shortcut?: string }> }> = [
  {
    label: 'File',
    items: [
      { label: 'New Project...', enabled: true, action: 'new-project' },
      { label: 'Open Project...' },
      { label: 'Add Windows Form...', enabled: true, action: 'add-form' },
      { label: 'Save All', enabled: true, action: 'save', shortcut: 'Ctrl+Shift+S' },
      { label: 'Page Setup...' },
      { label: 'Print...' },
      { label: 'Exit', enabled: true, action: 'exit', shortcut: 'Alt+F4' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { label: 'Delete', enabled: true, action: 'delete-control', shortcut: 'Del' },
      { label: 'Find and Replace' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Code', enabled: true, action: 'view-code', shortcut: 'F7' },
      { label: 'Designer', enabled: true, action: 'view-designer', shortcut: 'Shift+F7' },
      { label: 'Solution Explorer', enabled: true, action: 'toggle-solution', shortcut: 'Ctrl+Alt+L' },
      { label: 'Properties Window', enabled: true, action: 'toggle-properties', shortcut: 'F4' },
      { label: 'Toolbox', enabled: true, action: 'toggle-toolbox', shortcut: 'Ctrl+Alt+X' },
      { label: 'Error List', enabled: true, action: 'error-list', shortcut: 'Ctrl+\\, E' },
      { label: 'Output', enabled: true, action: 'output', shortcut: 'Ctrl+Alt+O' },
    ],
  },
  {
    label: 'Project',
    items: [
      { label: 'Add Windows Form...', enabled: true, action: 'add-form' },
      { label: 'Add Class...' },
      { label: 'Add Module...' },
      { label: 'Add Reference...' },
      { label: 'WindowsApplication1 Properties...' },
    ],
  },
  {
    label: 'Build',
    items: [
      { label: 'Build Solution', enabled: true, action: 'build', shortcut: 'Ctrl+Shift+B' },
      { label: 'Rebuild Solution', enabled: true, action: 'build' },
      { label: 'Clean Solution' },
      { label: 'Publish WindowsApplication1' },
    ],
  },
  {
    label: 'Debug',
    items: [
      { label: 'Start Debugging', enabled: true, action: 'run', shortcut: 'F5' },
      { label: 'Start Without Debugging', enabled: true, action: 'run', shortcut: 'Ctrl+F5' },
      { label: 'Stop Debugging', enabled: true, action: 'stop', shortcut: 'Shift+F5' },
      { label: 'Step Into', shortcut: 'F11' },
      { label: 'Step Over', shortcut: 'F10' },
      { label: 'Toggle Breakpoint', shortcut: 'F9' },
    ],
  },
  {
    label: 'Format',
    items: [
      { label: 'Align' },
      { label: 'Make Same Size' },
      { label: 'Horizontal Spacing' },
      { label: 'Vertical Spacing' },
      { label: 'Center in Form' },
      { label: 'Order' },
      { label: 'Lock Controls' },
    ],
  },
  { label: 'Test', items: [{ label: 'Run' }, { label: 'Debug' }, { label: 'Test Settings' }] },
  { label: 'Analyze', items: [{ label: 'Run Code Analysis' }, { label: 'Calculate Code Metrics' }] },
  {
    label: 'Tools',
    items: [
      { label: 'Connect to Database...' },
      { label: 'Code Snippets Manager...' },
      { label: 'Options...' },
    ],
  },
  {
    label: 'Extensions',
    items: [{ label: 'Manage Extensions' }, { label: 'Check for Updates' }],
  },
  {
    label: 'Window',
    items: [
      { label: 'New Window' },
      { label: 'Split' },
      { label: 'Close All Documents', enabled: true, action: 'close-all' },
      { label: 'Reset Window Layout', enabled: true, action: 'reset-layout' },
    ],
  },
  { label: 'Help', items: [{ label: 'View Help' }, { label: 'About Microsoft Visual Studio' }] },
];

let vbMonacoConfigured = false;

const configureVbMonaco = (monaco: any) => {
  if (!monaco || vbMonacoConfigured) return;
  vbMonacoConfigured = true;

  // Visual Studio's own light palette: blue keywords, red string literals,
  // green comments — students move between this and the real IDE.
  monaco.editor.defineTheme('vs-vbnet', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000ff' },
      { token: 'string', foreground: 'a31515' },
      { token: 'comment', foreground: '008000' },
      { token: 'number', foreground: '098658' },
      { token: 'identifier', foreground: '000000' },
      { token: 'type', foreground: '2b91af' },
    ],
    colors: {
      'editor.background': '#ffffff',
      'editorLineNumber.foreground': '#2b91af',
      'editor.selectionBackground': '#add6ff',
    },
  });

  monaco.languages.registerCompletionItemProvider('vb', {
    provideCompletionItems: () => ({
      suggestions: [
        ...['Dim', 'As Integer', 'As String', 'As Double', 'As Boolean', 'If', 'Then', 'ElseIf', 'Else', 'End If',
          'For', 'To', 'Step', 'Next', 'While', 'End While', 'Do', 'Loop', 'Select Case', 'Case', 'End Select',
          'Sub', 'Function', 'Return', 'Exit For', 'Exit Sub', 'Try', 'Catch', 'Finally', 'End Try'].map((word) => ({
          label: word,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: word,
        })),
        ...['MsgBox', 'MessageBox.Show', 'InputBox', 'Val', 'CInt', 'CDbl', 'CStr', 'Len', 'Mid', 'Left', 'Right',
          'UCase', 'LCase', 'Trim', 'InStr', 'Replace', 'Split', 'Format', 'IsNumeric', 'Rnd', 'Int',
          'Math.Sqrt', 'Math.Round', 'Math.Abs', 'Math.Max', 'Math.Min'].map((word) => ({
          label: word,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: word,
        })),
      ],
    }),
  });
};

export const VBNetStudio: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const monaco = useMonaco();
  const editorRef = useRef<any>(null);

  // The project and the first tab have to come from the *same* object: two
  // calls to starterProject() would mint different form ids and the opening tab
  // would point at a form that is not in the project.
  const [project, setProject] = useState<VbProject>(() => loadProject() || starterProject());
  const [tabs, setTabs] = useState<OpenTab[]>(() => []);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [selectedControl, setSelectedControl] = useState<string | null>(null);
  const [pendingTool, setPendingTool] = useState<VbControlKind | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openToolboxGroups, setOpenToolboxGroups] = useState<string[]>(['Common Controls']);
  const [propertyTab, setPropertyTab] = useState<'properties' | 'events'>('properties');
  const [propertySort, setPropertySort] = useState<'categorised' | 'alphabetical'>('categorised');
  const [focusedProperty, setFocusedProperty] = useState<PropertyRow | null>(null);
  const [bottomPane, setBottomPane] = useState<'errors' | 'output'>('errors');
  const [showToolbox, setShowToolbox] = useState(true);
  /** The docked pane holding focus; its caption goes gold, as in the IDE. */
  const [activePane, setActivePane] = useState<'toolbox' | 'solution' | 'properties'>('toolbox');
  const [showSolution, setShowSolution] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Ready');

  const activeTabRecord = tabs.find((tab) => tab.key === activeTab) || tabs[0] || null;
  const activeForm =
    project.forms.find((form) => form.id === activeTabRecord?.formId) || project.forms[0];

  // Visual Studio opens the startup form's designer when the solution loads —
  // once, on load, so Close All Documents leaves the workspace empty.
  useEffect(() => {
    const first = project.forms.find((form) => form.name === project.startupForm) || project.forms[0];
    if (!first) return;
    const key = `${first.id}:design`;
    setTabs([{ key, formId: first.id, kind: 'design' }]);
    setActiveTab(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    configureVbMonaco(monaco);
  }, [monaco]);

  /* ------------------------------------------------------------ mutation */

  const updateForm = useCallback(
    (formId: string, updater: (form: VbForm) => VbForm) => {
      setProject((current) => ({
        ...current,
        forms: current.forms.map((form) => (form.id === formId ? updater(form) : form)),
      }));
      setSaved(false);
    },
    []
  );

  const save = useCallback(() => {
    saveProject(project);
    setSaved(true);
    setStatusMessage('Project saved to this browser');
  }, [project]);

  const openTab = (formId: string, kind: TabKind) => {
    const key = `${formId}:${kind}`;
    setTabs((current) => (current.some((tab) => tab.key === key) ? current : [...current, { key, formId, kind }]));
    setActiveTab(key);
  };

  const closeTab = (key: string) => {
    setTabs((current) => {
      const next = current.filter((tab) => tab.key !== key);
      if (activeTab === key) setActiveTab(next.length > 0 ? next[next.length - 1].key : null);
      return next;
    });
  };

  const selected = activeForm?.controls.find((control) => control.id === selectedControl) || null;

  const addControl = (kind: VbControlKind, x: number, y: number) => {
    if (!activeForm) return;
    const name = nextControlName(activeForm.controls, kind);
    const control = makeControl(kind, name, isComponent(kind) ? {} : { x, y });
    updateForm(activeForm.id, (form) => ({ ...form, controls: [...form.controls, control] }));
    setSelectedControl(control.id);
    setPendingTool(null);
    setStatusMessage(`${name} added to ${activeForm.name}`);
  };

  const patchControl = (controlId: string, patch: Partial<VbControl>) => {
    if (!activeForm) return;
    const control = activeForm.controls.find((item) => item.id === controlId);
    if (!control) return;

    updateForm(activeForm.id, (form) => {
      const controls = form.controls.map((item) => (item.id === controlId ? { ...item, ...patch } : item));
      // Renaming a control has to follow it into the code behind.
      const code =
        patch.name && patch.name !== control.name
          ? renameInCode(form.code, control.name, patch.name)
          : form.code;
      return { ...form, controls, code };
    });
  };

  const deleteControl = (controlId: string) => {
    if (!activeForm) return;
    updateForm(activeForm.id, (form) => ({
      ...form,
      controls: form.controls.filter((control) => control.id !== controlId),
    }));
    setSelectedControl(null);
  };

  /** Double-clicking a control writes (or jumps to) its default handler. */
  const openHandler = (control: VbControl, eventName?: string) => {
    if (!activeForm) return;
    const event = eventName || EVENTS_FOR[control.kind][0];
    const { code, line } = ensureHandler(activeForm.code, control.name, event);
    updateForm(activeForm.id, (form) => ({ ...form, code }));
    openTab(activeForm.id, 'code');
    window.setTimeout(() => {
      editorRef.current?.revealLineInCenter(line);
      editorRef.current?.setPosition({ lineNumber: line, column: 9 });
      editorRef.current?.focus();
    }, 120);
  };

  /* ------------------------------------------------------------- errors */

  const diagnostics: VbDiagnostic[] = useMemo(() => {
    if (!activeForm) return [];
    const parsed = parseVb(activeForm.code);
    const found = [...parsed.diagnostics];

    // A Handles clause pointing at a control that is no longer on the form is
    // the mistake students hit most after renaming or deleting one.
    const names = new Set(activeForm.controls.map((control) => control.name.toLowerCase()));
    names.add(activeForm.name.toLowerCase());
    names.add('me');
    parsed.procedures.forEach((procedure) => {
      procedure.handles.forEach((handle) => {
        const owner = handle.split('.')[0];
        if (!names.has(owner.toLowerCase())) {
          found.push({
            severity: 'error',
            message: `Handles clause requires a WithEvents variable defined in the containing type or one of its base types: '${owner}' is not declared.`,
            line: procedure.line,
            column: 1,
          });
        }
      });
    });
    return found;
  }, [activeForm]);

  const errorCount = diagnostics.filter((item) => item.severity === 'error').length;
  const warningCount = diagnostics.filter((item) => item.severity === 'warning').length;

  /* --------------------------------------------------------------- run */

  const start = () => {
    if (!activeForm) return;
    if (errorCount > 0) {
      setBottomPane('errors');
      setStatusMessage('Build failed — fix the errors in the Error List, then press Start again');
      setOutput((current) => [
        ...current,
        `------ Build started: Project: ${project.name} ------`,
        `Build FAILED with ${errorCount} error(s).`,
      ]);
      return;
    }
    const startup = project.forms.find((form) => form.name === project.startupForm) || activeForm;
    setOutput((current) => [
      ...current,
      `------ Build started: Project: ${project.name}, Configuration: Debug Any CPU ------`,
      `  ${project.name} -> C:\\Users\\Student\\Documents\\${project.name}\\bin\\Debug\\${project.name}.exe`,
      '========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========',
    ]);
    setBottomPane('output');
    setStatusMessage('Running');
    setRunning(startup.id);
  };

  const stop = () => {
    setRunning(null);
    setStatusMessage('Ready');
    setOutput((current) => [...current, `The program '[0x1F4] ${project.name}.exe' has exited with code 0 (0x0).`]);
  };

  const build = () => {
    setBottomPane(errorCount > 0 ? 'errors' : 'output');
    setOutput((current) => [
      ...current,
      `------ Build started: Project: ${project.name}, Configuration: Debug Any CPU ------`,
      errorCount > 0
        ? `Build FAILED with ${errorCount} error(s), ${warningCount} warning(s).`
        : '========== Build: 1 succeeded, 0 failed, 0 up-to-date, 0 skipped ==========',
    ]);
    setStatusMessage(errorCount > 0 ? 'Build failed' : 'Build succeeded');
  };

  const addForm = () => {
    const index = project.forms.length + 1;
    const name = `Form${index}`;
    const form: VbForm = {
      id: vbId('frm'),
      name,
      text: name,
      width: 320,
      height: 200,
      backColor: '#f0f0f0',
      startPosition: 'CenterScreen',
      formBorderStyle: 'Sizable',
      controls: [],
      code: defaultFormCode(name),
    };
    setProject((current) => ({ ...current, forms: [...current.forms, form] }));
    setSaved(false);
    openTab(form.id, 'design');
  };

  const runMenuAction = (action?: string) => {
    setOpenMenu(null);
    switch (action) {
      case 'run':
        start();
        break;
      case 'stop':
        stop();
        break;
      case 'build':
        build();
        break;
      case 'save':
        save();
        break;
      case 'add-form':
        addForm();
        break;
      case 'view-code':
        if (activeForm) openTab(activeForm.id, 'code');
        break;
      case 'view-designer':
        if (activeForm) openTab(activeForm.id, 'design');
        break;
      case 'toggle-toolbox':
        setShowToolbox((current) => !current);
        break;
      case 'toggle-solution':
        setShowSolution((current) => !current);
        break;
      case 'toggle-properties':
        setShowProperties((current) => !current);
        break;
      case 'error-list':
        setBottomPane('errors');
        break;
      case 'output':
        setBottomPane('output');
        break;
      case 'delete-control':
        if (selectedControl) deleteControl(selectedControl);
        break;
      case 'close-all':
        setTabs([]);
        setActiveTab(null);
        break;
      case 'reset-layout':
        setShowToolbox(true);
        setShowSolution(true);
        setShowProperties(true);
        break;
      case 'new-project':
        if (window.confirm('Create a new project? The project in this browser will be replaced.')) {
          clearSavedProject();
          const fresh = starterProject();
          setProject(fresh);
          setTabs([{ key: `${fresh.forms[0].id}:design`, formId: fresh.forms[0].id, kind: 'design' }]);
          setActiveTab(`${fresh.forms[0].id}:design`);
          setSelectedControl(null);
        }
        break;
      case 'exit':
        onBack?.();
        break;
      default:
        break;
    }
  };

  // F5 / Shift+F5 / F7 behave the way they do in the IDE.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault();
        if (event.shiftKey) stop();
        else start();
      }
      if (event.key === 'F7' && activeForm) {
        event.preventDefault();
        openTab(activeForm.id, event.shiftKey ? 'design' : 'code');
      }
      if (event.key === 'Delete' && selectedControl && activeTabRecord?.kind === 'design') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
          event.preventDefault();
          deleteControl(selectedControl);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* ------------------------------------------------------------- render */

  const propertyRows: PropertyRow[] = selected
    ? propertyRowsFor(selected.kind)
    : FORM_PROPERTY_ROWS;

  const groupedRows = useMemo(() => {
    if (propertySort === 'alphabetical') {
      return [{ category: '', rows: [...propertyRows].sort((a, b) => a.name.localeCompare(b.name)) }];
    }
    const categories = ['Appearance', 'Behavior', 'Data', 'Design', 'Layout', 'Misc'];
    return categories
      .map((category) => ({ category, rows: propertyRows.filter((row) => row.category === category) }))
      .filter((group) => group.rows.length > 0);
  }, [propertyRows, propertySort]);

  const readProperty = (row: PropertyRow): string => {
    if (!activeForm) return '';
    if (!selected) {
      switch (row.name) {
        case '(Name)':
          return activeForm.name;
        case 'BackColor':
          return activeForm.backColor;
        case 'FormBorderStyle':
          return activeForm.formBorderStyle;
        case 'StartPosition':
          return activeForm.startPosition;
        case 'Text':
          return activeForm.text;
        case 'Width':
          return String(activeForm.width);
        case 'Height':
          return String(activeForm.height);
        default:
          return '';
      }
    }
    if (row.name === 'Location') return `${selected.x}, ${selected.y}`;
    if (row.name === 'Size') return `${selected.width}, ${selected.height}`;
    if (!row.key) return '';
    const value = selected[row.key];
    if (Array.isArray(value)) return `(Collection) ${value.length} items`;
    return String(value);
  };

  const writeProperty = (row: PropertyRow, raw: string | boolean | string[]) => {
    if (!activeForm) return;
    if (!selected) {
      const text = String(raw);
      switch (row.name) {
        case '(Name)':
          updateForm(activeForm.id, (form) => ({
            ...form,
            name: text,
            code: renameInCode(form.code, form.name, text),
          }));
          setProject((current) => ({
            ...current,
            startupForm: current.startupForm === activeForm.name ? text : current.startupForm,
          }));
          return;
        case 'BackColor':
          updateForm(activeForm.id, (form) => ({ ...form, backColor: text }));
          return;
        case 'FormBorderStyle':
          updateForm(activeForm.id, (form) => ({ ...form, formBorderStyle: text as VbForm['formBorderStyle'] }));
          return;
        case 'StartPosition':
          updateForm(activeForm.id, (form) => ({ ...form, startPosition: text as VbForm['startPosition'] }));
          return;
        case 'Text':
          updateForm(activeForm.id, (form) => ({ ...form, text }));
          return;
        case 'Width':
          updateForm(activeForm.id, (form) => ({ ...form, width: Math.max(160, Number(text) || 320) }));
          return;
        case 'Height':
          updateForm(activeForm.id, (form) => ({ ...form, height: Math.max(100, Number(text) || 200) }));
          return;
        default:
          return;
      }
    }
    if (!row.key) return;
    const key = row.key;
    if (row.editor === 'number') patchControl(selected.id, { [key]: Number(raw) || 0 } as Partial<VbControl>);
    else if (row.editor === 'bool') patchControl(selected.id, { [key]: Boolean(raw) } as Partial<VbControl>);
    else if (row.editor === 'items') patchControl(selected.id, { items: raw as string[] });
    else patchControl(selected.id, { [key]: String(raw) } as Partial<VbControl>);
  };

  const runningForm = project.forms.find((form) => form.id === running) || null;

  return (
    <div
      className="desktop-app fixed inset-0 z-[150] flex select-none flex-col bg-[#eeeef2] font-[Segoe_UI,system-ui,sans-serif] text-[12px] text-[#1e1e1e]"
      onClick={() => setOpenMenu(null)}
    >
      <style>{DESKTOP_APP_STYLES}</style>

      {/* Title bar. Visual Studio 2019 folds the caption and the menu into a
          single light band: logo, menus, the Ctrl+Q search box, the solution
          name, the signed-in account, then the window buttons. */}
      <div
        className="relative flex h-[30px] shrink-0 items-center gap-0 px-1 text-[12px]"
        style={{ background: VS.caption, color: VS.captionText }}
      >
        {/* The menus and the Ctrl+Q box sit on a light strip inset into the
            blue caption, which is how the theme lays the title bar out. */}
        <span
          className="flex h-full shrink-0 items-center px-1"
          style={{ background: VS.menuStrip, color: '#1e1e1e' }}
        >
        <button
          type="button"
          onClick={onBack}
          title="Back to Practical Labs"
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center hover:bg-[#c9def5]"
        >
          <ArrowLeft size={15} />
        </button>
        <VisualStudioLogo />
        <TeachMeLaunchButton size="sm" />
        {MENUS.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setOpenMenu(openMenu === menu.label ? null : menu.label);
              }}
              onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
              className={`h-[24px] px-[9px] ${openMenu === menu.label ? 'bg-[#c9def5]' : 'hover:bg-[#c9def5]'}`}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && (
              <div
                className="absolute left-0 top-full z-[190] w-[264px] border border-[#c8c8c8] bg-white py-1 shadow-lg"
                onClick={(event) => event.stopPropagation()}
              >
                {menu.items.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    disabled={!item.enabled}
                    onClick={() => runMenuAction(item.action)}
                    className={`flex w-full items-center justify-between px-6 py-[3px] text-left ${
                      item.enabled ? 'hover:bg-[#c9def5]' : 'text-[#a6a6a6]'
                    }`}
                  >
                    {item.label}
                    {item.shortcut && <span className="pl-6 text-[11px] text-[#888]">{item.shortcut}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {/* The magnifier sits on the right inside the field, as it does in the
            real Ctrl+Q box. */}
        <label className="ml-2 flex h-[22px] w-[214px] shrink-0 items-center gap-1.5 border border-[#c9ccd6] bg-white px-2 text-[12px] text-[#6d6d6d]">
          <input
            readOnly
            value=""
            placeholder="Search (Ctrl+Q)"
            className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#6d6d6d]"
          />
          <Search size={12} className="shrink-0" />
        </label>
        </span>

        <span className="ml-3 truncate text-[12px]">
          {project.name}
          {saved ? '' : ' *'}
        </span>

        <div className="ml-auto flex shrink-0 items-center">
          <AccountAvatar />
          <span className="flex h-[24px] w-[30px] items-center justify-center">
            <Minus size={13} />
          </span>
          <span className="flex h-[24px] w-[30px] items-center justify-center">
            <Square size={11} />
          </span>
          <button
            type="button"
            onClick={onBack}
            title="Close"
            className="flex h-[24px] w-[34px] items-center justify-center hover:bg-[#e81123]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Standard toolbar, then the Layout toolbar the designer brings with it.
          Each band starts with a drag grip and the groups are hairline-ruled. */}
      <div
        className="flex h-[30px] shrink-0 items-center gap-[1px] overflow-hidden border-b pl-1 pr-2"
        style={{ background: VS.toolStrip, borderColor: VS.hairline }}
      >
        <ToolGrip />
        <ToolbarButton Icon={CircleArrowLeft} title="Navigate Backward (Ctrl+-)" disabled dropdown />
        <ToolbarButton Icon={CircleArrowRight} title="Navigate Forward (Ctrl+Shift+-)" disabled />

        <ToolGrip />
        <ToolbarButton Icon={FilePlus2} title="New Project (Ctrl+Shift+N)" color="text-[#c27d1a]" disabled dropdown />
        <ToolbarButton Icon={FolderOpen} title="Open Project (Ctrl+Shift+O)" color="text-[#c27d1a]" disabled />
        <ToolbarButton Icon={Save} title="Save Form1.vb (Ctrl+S)" color="text-[#2b579a]" onClick={save} />
        <ToolbarButton Icon={SaveAll} title="Save All (Ctrl+Shift+S)" color="text-[#2b579a]" onClick={save} />

        <ToolGrip />
        <ToolbarButton Icon={Undo} title="Undo (Ctrl+Z)" color="text-[#2b579a]" disabled dropdown />
        <ToolbarButton Icon={Redo} title="Redo (Ctrl+Y)" color="text-[#2b579a]" disabled dropdown />

        <ToolGrip />
        <VsCombo value="Debug" title="Solution Configurations" />
        <VsCombo value="Any CPU" title="Solution Platforms" width={110} />

        {running ? (
          <button
            type="button"
            onClick={stop}
            title="Stop Debugging (Shift+F5)"
            className="ml-1 flex h-[24px] items-center gap-1.5 px-2 text-[12px] text-[#1e1e1e] hover:bg-[#c9def5]"
          >
            <Square size={10} className="fill-[#a1260d] text-[#a1260d]" />
            Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            title="Start Debugging (F5)"
            className="ml-1 flex h-[24px] items-center gap-1.5 px-2 text-[12px] text-[#1e1e1e] hover:bg-[#c9def5]"
          >
            <Play size={12} className="fill-[#3fa34d] text-[#3fa34d]" />
            Start
            <ChevronDown size={9} className="opacity-60" />
          </button>
        )}

        <ToolGrip />
        <ToolbarButton Icon={Wrench} title="Build Solution (Ctrl+Shift+B)" color="text-[#8a6d3b]" onClick={build} />
        <ToolbarButton Icon={Search} title="Find in Files (Ctrl+Shift+F)" color="text-[#2b579a]" disabled dropdown />

        {/* Layout toolbar — everything on it needs two or more controls
            selected, so it is drawn greyed exactly as it appears in the IDE. */}
        <ToolGrip />
        <ToolbarButton Icon={AlignStartVertical} title="Align Lefts" disabled />
        <ToolbarButton Icon={AlignCenterVertical} title="Align Centers" disabled />
        <ToolbarButton Icon={AlignEndVertical} title="Align Rights" disabled />
        <ToolGrip />
        <ToolbarButton Icon={AlignStartHorizontal} title="Align Tops" disabled />
        <ToolbarButton Icon={AlignCenterHorizontal} title="Align Middles" disabled />
        <ToolbarButton Icon={AlignEndHorizontal} title="Align Bottoms" disabled />
        <ToolGrip />
        <ToolbarButton Icon={MoveHorizontal} title="Make Same Width" disabled />
        <ToolbarButton Icon={MoveVertical} title="Make Same Height" disabled />
        <ToolbarButton Icon={Scaling} title="Make Same Size" disabled />
        <ToolbarButton Icon={AlignHorizontalDistributeCenter} title="Make Horizontal Spacing Equal" disabled />
        <ToolbarButton Icon={AlignVerticalDistributeCenter} title="Make Vertical Spacing Equal" disabled />
        <ToolGrip />
        <ToolbarButton Icon={BringToFront} title="Bring To Front" disabled />
        <ToolbarButton Icon={SendToBack} title="Send To Back" disabled />
        <ToolbarButton Icon={ListOrdered} title="Tab Order" disabled />
        <ToolbarButton Icon={Lock} title="Lock Controls" disabled />
      </div>

      {/* Main area */}
      <div className="flex min-h-0 flex-1">
        {/* The auto-hide rail down the left edge, where the IDE parks Toolbox
            and Data Sources when they are not pinned open. */}
        <div className="flex w-[22px] shrink-0 flex-col items-center gap-4 border-r pt-3 text-[11px] text-[#1e1e1e]"
          style={{ background: VS.toolWindow, borderColor: VS.hairline }}>
          <button
            type="button"
            onClick={() => setShowToolbox((open) => !open)}
            title={showToolbox ? 'Auto Hide Toolbox' : 'Show Toolbox'}
            style={{ writingMode: 'vertical-rl' }}
            className="py-1 hover:text-[#0e70c0]"
          >
            Toolbox
          </button>
          <span style={{ writingMode: 'vertical-rl' }} className="py-1 text-[#555]">
            Data Sources
          </span>
        </div>

        {/* Toolbox */}
        {showToolbox && (
          <div
            onMouseDown={() => setActivePane('toolbox')}
            className="flex w-[210px] shrink-0 flex-col border-r"
            style={{ borderColor: VS.hairline, background: VS.paneBody }}
          >
            <PaneHeader
              title="Toolbox"
              active={activePane === 'toolbox'}
              onClose={() => setShowToolbox(false)}
            />

            <label
              className="flex h-[22px] shrink-0 items-center gap-1.5 border-b px-2 text-[12px] text-[#6d6d6d]"
              style={{ borderColor: VS.hairline, background: VS.paneBody }}
            >
              <input
                readOnly
                value=""
                placeholder="Search Toolbox"
                className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#6d6d6d]"
              />
              <Search size={12} className="shrink-0" />
              <ChevronDown size={10} className="shrink-0" />
            </label>

            <div className="min-h-0 flex-1 overflow-auto py-1 text-[12px]">
              {TOOLBOX.map((category) => {
                const open = openToolboxGroups.includes(category.name);
                return (
                  <div key={category.name}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenToolboxGroups((current) =>
                          current.includes(category.name)
                            ? current.filter((name) => name !== category.name)
                            : [...current, category.name]
                        )
                      }
                      className="flex w-full items-center gap-1 px-1.5 py-[3px] text-left"
                      style={open ? { background: VS.selection } : undefined}
                    >
                      {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                      {category.name}
                    </button>
                    {open && (
                      <div className="py-0.5">
                        {category.empty && (
                          <p className="px-4 py-3 text-center text-[11px] leading-snug text-[#5a5a5a]">
                            There are no usable controls in this group. Drag an item onto this text to
                            add it to the toolbox.
                          </p>
                        )}
                        {category.items.map((item) => (
                          <button
                            key={item.kind}
                            type="button"
                            onClick={() =>
                              isComponent(item.kind)
                                ? addControl(item.kind, 0, 0)
                                : setPendingTool(pendingTool === item.kind ? null : item.kind)
                            }
                            className="flex w-full items-center gap-2 px-5 py-[2px] text-left"
                            style={
                              pendingTool === item.kind ? { background: VS.selection } : undefined
                            }
                            title={
                              isComponent(item.kind)
                                ? 'Click to drop this component into the tray'
                                : 'Click, then click on the form to place it'
                            }
                          >
                            <ToolboxGlyph kind={item.kind} />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {pendingTool && (
              <p
                className="border-t bg-[#fff8dc] px-2 py-1.5 text-[11px] text-[#7a5c00]"
                style={{ borderColor: VS.hairline }}
              >
                Click on the form to place the {pendingTool}.
              </p>
            )}
          </div>
        )}

        {/* Documents */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="flex h-[26px] shrink-0 items-end gap-[2px] overflow-x-auto border-b px-1"
            style={{ background: VS.tabWell, borderColor: VS.hairline }}
          >
            {tabs.map((tab) => {
              const form = project.forms.find((item) => item.id === tab.formId);
              if (!form) return null;
              const label =
                tab.kind === 'design'
                  ? `${form.name}.vb [Design]`
                  : tab.kind === 'designer-code'
                    ? `${form.name}.Designer.vb`
                    : `${form.name}.vb`;
              const isActive = tab.key === activeTab;
              return (
                <div
                  key={tab.key}
                  style={isActive ? { borderBottomColor: VS.tabActiveAccent } : undefined}
                  className={`flex h-[24px] shrink-0 items-center gap-1.5 border-x border-t px-2 text-[12px] ${
                    isActive
                      ? 'border-[#c9ccd6] border-b-2 bg-white'
                      : 'border-transparent bg-[#dcdce0] hover:bg-[#e6e6ea]'
                  }`}
                >
                  <button type="button" onClick={() => setActiveTab(tab.key)} className="flex items-center gap-1.5">
                    <FileCode2 size={11} className="text-[#68217a]" />
                    {label}
                  </button>
                  {isActive && <Pin size={10} className="rotate-45 text-[#6d6d6d]" />}
                  <button
                    type="button"
                    onClick={() => closeTab(tab.key)}
                    className="text-[#888] hover:text-[#a1260d]"
                  >
                    <X size={10} />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="relative min-h-0 flex-1">
            {!activeTabRecord || !activeForm ? (
              <div className="flex h-full items-center justify-center bg-[#f0f0f4] text-[12px] text-[#666]">
                Open a form from Solution Explorer.
              </div>
            ) : activeTabRecord.kind === 'design' ? (
              <VbFormDesigner
                form={activeForm}
                onChange={(next) => updateForm(activeForm.id, () => next)}
                selected={selectedControl}
                onSelect={setSelectedControl}
                pending={pendingTool}
                onDropControl={addControl}
                onOpenHandler={(control) => openHandler(control)}
              />
            ) : activeTabRecord.kind === 'designer-code' ? (
              <Editor
                height="100%"
                language="vb"
                theme="vs-vbnet"
                value={designerCode(activeForm)}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  fontFamily: 'Consolas, Menlo, monospace',
                  scrollBeyondLastLine: false,
                }}
              />
            ) : (
              <div className="flex h-full flex-col">
                {/* Class / method navigation bars, as above the real editor */}
                <div className="flex h-[26px] shrink-0 items-center gap-1 border-b border-[#e0e0e6] bg-[#f0f0f4] px-1 text-[12px]">
                  <select
                    value={activeForm.name}
                    onChange={() => undefined}
                    className="h-[21px] w-[220px] border border-[#c9ccd6] bg-white px-1"
                  >
                    <option>{activeForm.name}</option>
                  </select>
                  <select
                    value=""
                    onChange={(event) => {
                      const [controlName, eventName] = event.target.value.split('|');
                      const control = activeForm.controls.find((item) => item.name === controlName);
                      if (control) openHandler(control, eventName);
                    }}
                    className="h-[21px] w-[260px] border border-[#c9ccd6] bg-white px-1"
                  >
                    <option value="">(Declarations)</option>
                    {activeForm.controls.map((control) =>
                      EVENTS_FOR[control.kind].map((eventName) => (
                        <option key={`${control.name}-${eventName}`} value={`${control.name}|${eventName}`}>
                          {control.name}_{eventName}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="min-h-0 flex-1">
                  <Editor
                    height="100%"
                    language="vb"
                    theme="vs-vbnet"
                    value={activeForm.code}
                    onMount={(editor) => {
                      editorRef.current = editor;
                    }}
                    onChange={(value) => updateForm(activeForm.id, (form) => ({ ...form, code: value ?? '' }))}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      fontFamily: 'Consolas, Menlo, monospace',
                      scrollBeyondLastLine: false,
                      tabSize: 4,
                      renderLineHighlight: 'line',
                      automaticLayout: true,
                    }}
                  />
                </div>
              </div>
            )}

            {runningForm && (
              <VbRunWindow
                form={runningForm}
                onClose={stop}
                onLog={(entry: RunLogEntry) => {
                  setOutput((current) => [...current, entry.text]);
                  if (entry.kind === 'error') setStatusMessage('Exception thrown');
                }}
              />
            )}
          </div>

          {/* Error List / Output */}
          <div className="flex h-[150px] shrink-0 flex-col border-t border-[#c9ccd6] bg-white">
            <div className="flex h-[24px] shrink-0 items-center gap-2 border-b border-[#e0e0e6] bg-[#eeeef2] px-2 text-[12px]">
              <button
                type="button"
                onClick={() => setBottomPane('errors')}
                className={`px-2 py-[2px] ${bottomPane === 'errors' ? 'border-b-2 border-[#68217a] font-semibold' : 'text-[#555]'}`}
              >
                Error List
              </button>
              <button
                type="button"
                onClick={() => setBottomPane('output')}
                className={`px-2 py-[2px] ${bottomPane === 'output' ? 'border-b-2 border-[#68217a] font-semibold' : 'text-[#555]'}`}
              >
                Output
              </button>
              {bottomPane === 'errors' && (
                <span className="ml-3 flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <CircleAlert size={12} className="text-[#a1260d]" />
                    {errorCount} Error{errorCount === 1 ? '' : 's'}
                  </span>
                  <span className="flex items-center gap-1">
                    <TriangleAlert size={12} className="text-[#bf8803]" />
                    {warningCount} Warning{warningCount === 1 ? '' : 's'}
                  </span>
                  <span className="flex items-center gap-1 text-[#888]">
                    <Info size={12} />0 Messages
                  </span>
                </span>
              )}
              {bottomPane === 'output' && (
                <button
                  type="button"
                  onClick={() => setOutput([])}
                  className="ml-auto flex items-center gap-1 text-[11px] text-[#555] hover:text-[#1e1e1e]"
                >
                  <RotateCcw size={11} />
                  Clear
                </button>
              )}
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
              {bottomPane === 'errors' ? (
                diagnostics.length === 0 ? (
                  <p className="p-3 text-[12px] text-[#666]">No errors — press Start (F5) to run the form.</p>
                ) : (
                  <table className="w-full border-separate border-spacing-0 text-[12px]">
                    <thead className="sticky top-0 bg-[#f0f0f4]">
                      <tr className="text-left">
                        <th className="border-b border-[#e0e0e6] px-2 py-1 font-semibold">Code</th>
                        <th className="border-b border-[#e0e0e6] px-2 py-1 font-semibold">Description</th>
                        <th className="w-[130px] border-b border-[#e0e0e6] px-2 py-1 font-semibold">File</th>
                        <th className="w-[54px] border-b border-[#e0e0e6] px-2 py-1 font-semibold">Line</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diagnostics.map((item, index) => (
                        <tr
                          key={index}
                          onDoubleClick={() => {
                            if (!activeForm) return;
                            openTab(activeForm.id, 'code');
                            window.setTimeout(() => {
                              editorRef.current?.revealLineInCenter(item.line);
                              editorRef.current?.setPosition({ lineNumber: item.line, column: item.column });
                              editorRef.current?.focus();
                            }, 120);
                          }}
                          className="cursor-default hover:bg-[#e6f0fa]"
                        >
                          <td className="border-b border-[#f0f0f0] px-2 py-1">
                            <span className="flex items-center gap-1">
                              {item.severity === 'error' ? (
                                <CircleAlert size={12} className="text-[#a1260d]" />
                              ) : (
                                <TriangleAlert size={12} className="text-[#bf8803]" />
                              )}
                              BC300{(index % 90) + 10}
                            </span>
                          </td>
                          <td className="border-b border-[#f0f0f0] px-2 py-1">{item.message}</td>
                          <td className="border-b border-[#f0f0f0] px-2 py-1">{activeForm?.name}.vb</td>
                          <td className="border-b border-[#f0f0f0] px-2 py-1">{item.line}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                <pre className="whitespace-pre-wrap p-2 font-mono text-[12px] leading-relaxed text-[#1e1e1e]">
                  {output.length === 0 ? 'Show output from: Debug' : output.join('\n')}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Right rail: Solution Explorer + Properties */}
        {(showSolution || showProperties) && (
          <div className="flex w-[300px] shrink-0 flex-col border-l border-[#c9ccd6] bg-[#f0f0f4]">
            {showSolution && (
              <div
                onMouseDown={() => setActivePane('solution')}
                className="flex h-[248px] shrink-0 flex-col border-b"
                style={{ borderColor: VS.hairline }}
              >
                <PaneHeader
                  title="Solution Explorer"
                  active={activePane === 'solution'}
                  onClose={() => setShowSolution(false)}
                />

                {/* The command strip and the filter box the real pane carries
                    above its tree. */}
                <div className="flex h-[24px] shrink-0 items-center gap-[1px] border-b border-[#d4d8e2] bg-[#e9ecf4] px-1">
                  <ToolbarButton Icon={CircleArrowLeft} title="Back" disabled />
                  <ToolbarButton Icon={CircleArrowRight} title="Forward" disabled />
                  <ToolbarButton Icon={Home} title="Home" color="text-[#2b579a]" disabled />
                  <ToolbarButton Icon={Filter} title="Pending Changes Filter" color="text-[#2b579a]" disabled dropdown />
                  <ToolbarButton Icon={RefreshCw} title="Refresh" color="text-[#2b579a]" disabled />
                  <ToolbarButton Icon={FolderTree} title="Show All Files" color="text-[#c27d1a]" disabled />
                  <ToolbarButton Icon={Code2} title="View Code" color="text-[#2b579a]" disabled />
                  <ToolbarButton Icon={Wrench} title="Properties" color="text-[#8a6d3b]" disabled />
                </div>
                <label className="flex h-[22px] shrink-0 items-center gap-1.5 border-b border-[#e0e0e6] bg-white px-2 text-[12px] text-[#6d6d6d]">
                  <input
                    readOnly
                    value=""
                    placeholder="Search Solution Explorer (Ctrl+;)"
                    className="w-full bg-transparent text-[12px] outline-none placeholder:text-[#6d6d6d]"
                  />
                  <Search size={12} className="shrink-0" />
                </label>

                <div className="min-h-0 flex-1 overflow-auto bg-white py-1 text-[12px]">
                  <TreeRow
                    depth={0}
                    label={`Solution '${project.name}' (1 of 1 project)`}
                    Icon={LayoutGrid}
                  />
                  <TreeRow depth={1} label={project.name} Icon={SquareCode} bold />
                  <TreeRow depth={2} label="My Project" Icon={FolderOpen} muted />
                  <TreeRow depth={2} label="References" Icon={FolderOpen} muted />
                  <TreeRow depth={2} label="App.config" Icon={FileCode2} muted />
                  {project.forms.map((form) => (
                    <React.Fragment key={form.id}>
                      <TreeRow
                        depth={2}
                        label={`${form.name}.vb`}
                        Icon={FileCode2}
                        onClick={() => openTab(form.id, 'design')}
                        bold={form.name === project.startupForm}
                      />
                      <TreeRow
                        depth={3}
                        label={`${form.name}.Designer.vb`}
                        Icon={FileCode2}
                        onClick={() => openTab(form.id, 'designer-code')}
                        muted
                      />
                      <TreeRow
                        depth={3}
                        label={`${form.name}.vb (Code)`}
                        Icon={FileCode2}
                        onClick={() => openTab(form.id, 'code')}
                        muted
                      />
                    </React.Fragment>
                  ))}
                </div>

                {/* Docked pane tabs along the bottom of the pane group. */}
                <div className="flex h-[22px] shrink-0 items-end gap-[2px] border-t border-[#c9ccd6] bg-[#e4e8f1] px-1 text-[11px]">
                  <span className="h-[20px] border-x border-t border-[#c9ccd6] bg-white px-2 pt-[2px]">
                    Solution Explorer
                  </span>
                  <span className="h-[20px] bg-[#cfd8ea] px-2 pt-[2px] text-[#3a3a3a]">Team Explorer</span>
                </div>
              </div>
            )}

            {showProperties && (
              <div onMouseDown={() => setActivePane('properties')} className="flex min-h-0 flex-1 flex-col">
                <PaneHeader
                  title="Properties"
                  active={activePane === 'properties'}
                  onClose={() => setShowProperties(false)}
                />

                <div className="border-b border-[#e0e0e6] text-[12px]">
                  <select
                    value={selected ? selected.id : 'form'}
                    onChange={(event) =>
                      setSelectedControl(event.target.value === 'form' ? null : event.target.value)
                    }
                    className="h-[23px] w-full bg-white px-2 font-semibold outline-none"
                  >
                    <option value="form">
                      {activeForm?.name} System.Windows.Forms.Form
                    </option>
                    {activeForm?.controls.map((control) => (
                      <option key={control.id} value={control.id}>
                        {control.name} System.Windows.Forms.{control.kind}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1 border-b border-[#e0e0e6] bg-[#eeeef2] px-1 py-1">
                  <IconToggle
                    Icon={LayoutGrid}
                    title="Categorized"
                    active={propertySort === 'categorised' && propertyTab === 'properties'}
                    onClick={() => {
                      setPropertySort('categorised');
                      setPropertyTab('properties');
                    }}
                  />
                  <IconToggle
                    Icon={ChevronDown}
                    title="Alphabetical"
                    active={propertySort === 'alphabetical' && propertyTab === 'properties'}
                    onClick={() => {
                      setPropertySort('alphabetical');
                      setPropertyTab('properties');
                    }}
                  />
                  <span className="mx-1 h-4 w-px bg-[#cccedb]" />
                  <IconToggle
                    Icon={Settings2}
                    title="Properties"
                    active={propertyTab === 'properties'}
                    onClick={() => setPropertyTab('properties')}
                  />
                  <IconToggle
                    Icon={Zap}
                    title="Events"
                    active={propertyTab === 'events'}
                    onClick={() => setPropertyTab('events')}
                  />
                </div>

                <div className="min-h-0 flex-1 overflow-auto bg-white text-[12px]">
                  {propertyTab === 'events' ? (
                    selected ? (
                      <table className="w-full border-separate border-spacing-0">
                        <tbody>
                          {EVENTS_FOR[selected.kind].map((eventName) => {
                            const handlerName = `${selected.name}_${eventName}`;
                            const exists = new RegExp(`\\bSub\\s+${handlerName}\\b`, 'i').test(
                              activeForm?.code || ''
                            );
                            return (
                              <tr key={eventName}>
                                <td className="w-[110px] border-b border-r border-[#f0f0f0] px-2 py-[3px]">
                                  {eventName}
                                </td>
                                <td className="border-b border-[#f0f0f0] p-0">
                                  <button
                                    type="button"
                                    onDoubleClick={() => openHandler(selected, eventName)}
                                    onClick={() => openHandler(selected, eventName)}
                                    className="h-[21px] w-full px-1 text-left hover:bg-[#e6f0fa]"
                                    title="Click to create or open this handler"
                                  >
                                    {exists ? handlerName : ''}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    ) : (
                      <p className="p-3 text-[11px] text-[#666]">
                        Select a control to see the events it can raise.
                      </p>
                    )
                  ) : (
                    groupedRows.map((group) => (
                      <div key={group.category || 'all'}>
                        {group.category && (
                          <div className="bg-[#f0f0f0] px-2 py-[2px] font-semibold">{group.category}</div>
                        )}
                        <table className="w-full border-separate border-spacing-0">
                          <tbody>
                            {group.rows.map((row) => (
                              <tr
                                key={row.name}
                                onMouseEnter={() => setFocusedProperty(row)}
                                onFocus={() => setFocusedProperty(row)}
                              >
                                <td className="w-[112px] border-b border-r border-[#f0f0f0] px-2 py-[2px] align-middle">
                                  {row.name}
                                </td>
                                <td className="border-b border-[#f0f0f0] px-1 py-[2px]">
                                  <PropertyEditorCell
                                    row={row}
                                    value={readProperty(row)}
                                    items={selected && row.editor === 'items' ? selected.items : []}
                                    onChange={(value) => writeProperty(row, value)}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))
                  )}
                </div>

                <div className="h-[62px] shrink-0 overflow-auto border-t border-[#e0e0e6] bg-[#f0f0f4] p-2 text-[11px] leading-snug">
                  <p className="font-semibold">{focusedProperty?.name || '(Name)'}</p>
                  <p className="text-[#555]">
                    {focusedProperty?.help || 'Indicates the name used in code to identify the object.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="flex h-[22px] shrink-0 items-center justify-between px-2 text-[11px] text-white"
        style={{ background: running ? '#ca5100' : VS.caption }}
      >
        <span>{running ? 'Running' : statusMessage}</span>
        <span className="flex items-center gap-4">
          <span>{errorCount} error{errorCount === 1 ? '' : 's'}</span>
          <span>{project.forms.length} form{project.forms.length === 1 ? '' : 's'}</span>
          <span>{saved ? 'Saved' : 'Unsaved changes'}</span>
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- pieces */

/**
 * The Visual Studio mark: the ribbon that folds back on itself. Drawn inline so
 * the bar carries the logo the real one does without pulling in an asset.
 */
/** The signed-in account chip that closes the title bar. */
const AccountAvatar: React.FC = () => (
  <span
    title="Account manager"
    className="mr-2 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[#68217a] text-white"
  >
    <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 12a4.2 4.2 0 1 0 0-8.4 4.2 4.2 0 0 0 0 8.4Zm0 1.9c-3.4 0-7.2 1.7-7.2 4v1.8h14.4v-1.8c0-2.3-3.8-4-7.2-4Z"
      />
    </svg>
  </span>
);

const VisualStudioLogo: React.FC = () => (
  <svg viewBox="0 0 24 24" width="19" height="19" className="mr-2 shrink-0" aria-hidden="true">
    <path
      fill="#68217A"
      d="M17.8 1.2 23.4 4v16l-5.6 2.8-7.5-7.2-6.3 4.8L1.4 18.7V5.3l2.6-1.7 6.3 4.8ZM4.6 8.6v6.8L8.2 12Zm12.3-1.4L11 12l5.9 4.8Z"
    />
  </svg>
);

/** The dotted grip that starts each toolbar band and separates its groups. */
const ToolGrip: React.FC = () => (
  <span className="mx-[3px] flex h-[18px] w-[6px] shrink-0 flex-col items-center justify-center gap-[2px]">
    {[0, 1, 2, 3, 4].map((dot) => (
      <span key={dot} className="h-[1px] w-[3px] bg-[#b9bcc6]" />
    ))}
  </span>
);

const ToolbarButton: React.FC<{
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  /** Icon tint when enabled; Visual Studio colours its toolbar glyphs. */
  color?: string;
  /** Split buttons carry a small caret on their right. */
  dropdown?: boolean;
}> = ({ Icon, title, onClick, disabled, color, dropdown }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`flex h-[24px] shrink-0 items-center justify-center gap-[1px] px-[3px] ${
      disabled ? 'text-[#c3c3c3]' : `${color || 'text-[#3c3c3c]'} hover:bg-[#c9def5]`
    }`}
  >
    <Icon size={15} />
    {dropdown && <ChevronDown size={8} className="opacity-70" />}
  </button>
);

/** The configuration and platform pickers, styled like the real combo boxes. */
const VsCombo: React.FC<{ value: string; title: string; width?: number }> = ({
  value,
  title,
  width = 96,
}) => (
  <span
    title={title}
    style={{ width }}
    className="ml-[3px] flex h-[22px] shrink-0 items-center justify-between border border-[#c9ccd6] bg-white pl-1.5 text-[12px] text-[#1e1e1e]"
  >
    <span className="truncate">{value}</span>
    <span className="flex h-full w-[15px] items-center justify-center border-l border-[#e3e5ee] text-[#5a5a5a]">
      <ChevronDown size={9} />
    </span>
  </span>
);

/**
 * A docked tool window's caption: the title on the left, then the window's own
 * dropdown, pin and close buttons, on the pale blue band the IDE gives them.
 */
const PaneHeader: React.FC<{ title: string; onClose: () => void; active?: boolean }> = ({
  title,
  onClose,
  active,
}) => (
  <div
    className="flex h-[26px] shrink-0 items-center justify-between border-b pl-2 pr-1 text-[12px]"
    style={{
      background: active ? VS.paneCaptionActive : VS.paneCaption,
      borderColor: VS.hairline,
    }}
  >
    {title}
    <span className="flex items-center text-[#5a5a5a]">
      <span title="Window position" className="flex h-[18px] w-[18px] items-center justify-center hover:bg-[#c9def5]">
        <ChevronDown size={11} />
      </span>
      <span title="Auto Hide" className="flex h-[18px] w-[18px] items-center justify-center hover:bg-[#c9def5]">
        <Pin size={11} className="rotate-45" />
      </span>
      <button
        type="button"
        onClick={onClose}
        title="Close"
        className="flex h-[18px] w-[18px] items-center justify-center hover:bg-[#c9def5] hover:text-[#1e1e1e]"
      >
        <X size={11} />
      </button>
    </span>
  </div>
);

const TreeRow: React.FC<{
  depth: number;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick?: () => void;
  bold?: boolean;
  muted?: boolean;
}> = ({ depth, label, Icon, onClick, bold, muted }) => (
  <button
    type="button"
    onClick={onClick}
    onDoubleClick={onClick}
    className={`flex w-full items-center gap-1.5 py-[2px] text-left hover:bg-[#e6f0fa] ${
      muted ? 'text-[#555]' : ''
    } ${bold ? 'font-semibold' : ''}`}
    style={{ paddingLeft: 8 + depth * 14 }}
  >
    <Icon size={12} className="shrink-0 text-[#68217a]" />
    <span className="truncate">{label}</span>
  </button>
);

const IconToggle: React.FC<{
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  active: boolean;
  onClick: () => void;
}> = ({ Icon, title, active, onClick }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`flex h-[20px] w-[20px] items-center justify-center rounded-sm ${
      active ? 'bg-[#cde0f5] ring-1 ring-[#9dc3e6]' : 'hover:bg-[#e6f0fa]'
    }`}
  >
    <Icon size={13} />
  </button>
);

/** A little coloured glyph per Toolbox entry, standing in for the VS icons. */
const ToolboxGlyph: React.FC<{ kind: VbControlKind }> = ({ kind }) => {
  const glyphs: Record<VbControlKind, string> = {
    Button: 'ab',
    Label: 'A',
    TextBox: '|',
    CheckBox: '☑',
    RadioButton: '◉',
    ComboBox: '▼',
    ListBox: '≡',
    GroupBox: '▭',
    PictureBox: '🖼',
    NumericUpDown: '⇅',
    ProgressBar: '▰',
    DateTimePicker: '📅',
    Timer: '⏱',
  };
  return (
    <span className="flex h-[15px] w-[15px] shrink-0 items-center justify-center border border-[#9dc3e6] bg-white text-[9px] leading-none text-[#2b579a]">
      {glyphs[kind]}
    </span>
  );
};

const PropertyEditorCell: React.FC<{
  row: PropertyRow;
  value: string;
  items: string[];
  onChange: (value: string | boolean | string[]) => void;
}> = ({ row, value, items, onChange }) => {
  const [editingItems, setEditingItems] = useState(false);

  if (row.editor === 'readonly') {
    return <span className="block px-1 text-[#555]">{value}</span>;
  }
  if (row.editor === 'bool') {
    return (
      <select
        value={value === 'true' ? 'True' : 'False'}
        onChange={(event) => onChange(event.target.value === 'True')}
        className="h-[19px] w-full border border-transparent bg-transparent px-0.5 outline-none hover:border-[#c9ccd6] focus:border-[#0078d7] focus:bg-white"
      >
        <option>False</option>
        <option>True</option>
      </select>
    );
  }
  if (row.editor === 'choice') {
    return (
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[19px] w-full border border-transparent bg-transparent px-0.5 outline-none hover:border-[#c9ccd6] focus:border-[#0078d7] focus:bg-white"
      >
        {(row.choices || []).map((choice) => (
          <option key={choice}>{choice}</option>
        ))}
      </select>
    );
  }
  if (row.editor === 'color') {
    return (
      <div className="flex items-center gap-1">
        <input
          type="color"
          value={value === 'transparent' ? '#f0f0f0' : value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[17px] w-[26px] border border-[#c9ccd6] bg-white"
        />
        <span className="truncate text-[11px] text-[#555]">{value}</span>
      </div>
    );
  }
  if (row.editor === 'number') {
    return (
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[19px] w-full border border-transparent bg-transparent px-0.5 outline-none hover:border-[#c9ccd6] focus:border-[#0078d7] focus:bg-white"
      />
    );
  }
  if (row.editor === 'items') {
    return (
      <>
        <button
          type="button"
          onClick={() => setEditingItems(true)}
          className="flex h-[19px] w-full items-center justify-between px-0.5 text-left hover:bg-[#e6f0fa]"
        >
          <span className="truncate text-[#555]">(Collection)</span>
          <span className="text-[10px]">…</span>
        </button>
        {editingItems && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/25">
            <div className="w-[420px] border border-[#8a8a8a] bg-[#f0f0f0] shadow-2xl">
              <div className="bg-gradient-to-b from-[#ffffff] to-[#e8ecf0] px-3 py-1.5 text-[12px] font-semibold">
                String Collection Editor
              </div>
              <div className="p-3">
                <p className="mb-2 text-[11px] text-[#555]">Enter the strings in the collection (one per line):</p>
                <textarea
                  autoFocus
                  defaultValue={items.join('\n')}
                  onBlur={(event) =>
                    onChange(event.target.value.split('\n').map((line) => line.trim()).filter(Boolean))
                  }
                  className="h-[180px] w-full border border-[#7a7a7a] bg-white p-2 font-mono text-[12px] outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 border-t border-[#d0d0d0] px-3 py-2">
                <button
                  type="button"
                  onClick={() => setEditingItems(false)}
                  className="min-w-[76px] border border-[#adadad] bg-[#e1e1e1] px-3 py-1 text-[12px] hover:bg-[#e5f1fb]"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[19px] w-full border border-transparent bg-transparent px-0.5 outline-none hover:border-[#c9ccd6] focus:border-[#0078d7] focus:bg-white"
    />
  );
};

export default VBNetStudio;

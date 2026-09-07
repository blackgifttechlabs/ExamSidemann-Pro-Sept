/**
 * The Windows Forms project model: what a form and its controls are made of,
 * what the Toolbox offers, and which properties the Properties window shows for
 * each kind of control.
 *
 * Property names, defaults and categories are the real ones, because a student
 * who learns "Name, Text, Enabled, Visible" here should find the same rows in
 * Visual Studio.
 */

export type VbControlKind =
  | 'Button'
  | 'Label'
  | 'TextBox'
  | 'CheckBox'
  | 'RadioButton'
  | 'ComboBox'
  | 'ListBox'
  | 'GroupBox'
  | 'PictureBox'
  | 'NumericUpDown'
  | 'ProgressBar'
  | 'DateTimePicker'
  | 'Timer';

export interface VbControl {
  id: string;
  kind: VbControlKind;
  name: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  foreColor: string;
  backColor: string;
  enabled: boolean;
  visible: boolean;
  checked: boolean;
  /** ComboBox and ListBox items, one per line in the designer. */
  items: string[];
  multiline: boolean;
  passwordChar: string;
  textAlign: 'Left' | 'Center' | 'Right';
  /** NumericUpDown / ProgressBar */
  value: number;
  minimum: number;
  maximum: number;
  /** Timer */
  interval: number;
  timerEnabled: boolean;
  /** PictureBox */
  imageUrl: string;
}

export interface VbForm {
  id: string;
  name: string;
  text: string;
  width: number;
  height: number;
  backColor: string;
  startPosition: 'CenterScreen' | 'Manual' | 'WindowsDefaultLocation';
  formBorderStyle: 'Sizable' | 'FixedSingle' | 'Fixed3D' | 'None';
  controls: VbControl[];
  code: string;
}

export interface VbProject {
  name: string;
  forms: VbForm[];
  startupForm: string;
}

let counter = 0;
export const vbId = (prefix: string) => {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
};

/** Controls that have no on-screen presence sit in the component tray. */
export const isComponent = (kind: VbControlKind) => kind === 'Timer';

const BASE: Omit<VbControl, 'id' | 'kind' | 'name'> = {
  text: '',
  x: 24,
  y: 24,
  width: 100,
  height: 23,
  fontSize: 9,
  bold: false,
  italic: false,
  foreColor: '#000000',
  backColor: '#f0f0f0',
  enabled: true,
  visible: true,
  checked: false,
  items: [],
  multiline: false,
  passwordChar: '',
  textAlign: 'Left',
  value: 0,
  minimum: 0,
  maximum: 100,
  interval: 1000,
  timerEnabled: false,
  imageUrl: '',
};

const DEFAULTS: Partial<Record<VbControlKind, Partial<VbControl>>> = {
  Button: { width: 90, height: 30, backColor: '#e1e1e1', textAlign: 'Center' },
  Label: { width: 90, height: 17, backColor: 'transparent' },
  TextBox: { width: 130, height: 23, backColor: '#ffffff' },
  CheckBox: { width: 110, height: 20, backColor: 'transparent' },
  RadioButton: { width: 110, height: 20, backColor: 'transparent' },
  ComboBox: { width: 130, height: 23, backColor: '#ffffff' },
  ListBox: { width: 140, height: 95, backColor: '#ffffff' },
  GroupBox: { width: 190, height: 110, backColor: 'transparent' },
  PictureBox: { width: 120, height: 90, backColor: '#ffffff' },
  NumericUpDown: { width: 90, height: 23, backColor: '#ffffff' },
  ProgressBar: { width: 180, height: 23, backColor: '#e6e6e6' },
  DateTimePicker: { width: 190, height: 23, backColor: '#ffffff' },
  Timer: { width: 0, height: 0 },
};

/** Visual Studio numbers each control per type: Button1, Button2, Label1… */
export const nextControlName = (controls: VbControl[], kind: VbControlKind) => {
  let index = 1;
  const taken = new Set(controls.map((control) => control.name.toLowerCase()));
  while (taken.has(`${kind}${index}`.toLowerCase())) index += 1;
  return `${kind}${index}`;
};

export const makeControl = (
  kind: VbControlKind,
  name: string,
  patch: Partial<VbControl> = {}
): VbControl => {
  const control: VbControl = {
    ...BASE,
    ...DEFAULTS[kind],
    id: vbId('ctl'),
    kind,
    name,
    ...patch,
  };
  // The designer seeds Text from the control name, exactly like Visual Studio.
  if (control.text === '' && ['Button', 'Label', 'CheckBox', 'RadioButton', 'GroupBox'].includes(kind)) {
    control.text = name;
  }
  return control;
};

export interface ToolboxItem {
  kind: VbControlKind;
  label: string;
}

export interface ToolboxCategory {
  name: string;
  items: ToolboxItem[];
  /** Categories drawn but not stocked, the way the real Toolbox lists them. */
  empty?: boolean;
}

export const TOOLBOX: ToolboxCategory[] = [
  {
    name: 'Common Controls',
    items: [
      { kind: 'Button', label: 'Button' },
      { kind: 'CheckBox', label: 'CheckBox' },
      { kind: 'ComboBox', label: 'ComboBox' },
      { kind: 'DateTimePicker', label: 'DateTimePicker' },
      { kind: 'Label', label: 'Label' },
      { kind: 'ListBox', label: 'ListBox' },
      { kind: 'NumericUpDown', label: 'NumericUpDown' },
      { kind: 'PictureBox', label: 'PictureBox' },
      { kind: 'ProgressBar', label: 'ProgressBar' },
      { kind: 'RadioButton', label: 'RadioButton' },
      { kind: 'TextBox', label: 'TextBox' },
    ],
  },
  { name: 'Containers', items: [{ kind: 'GroupBox', label: 'GroupBox' }] },
  { name: 'Components', items: [{ kind: 'Timer', label: 'Timer' }] },
  { name: 'Menus & Toolbars', items: [], empty: true },
  { name: 'Data', items: [], empty: true },
  { name: 'Dialogs', items: [], empty: true },
  { name: 'Printing', items: [], empty: true },
];

/** The events each control offers in the Properties window's lightning-bolt tab. */
export const EVENTS_FOR: Record<VbControlKind, string[]> = {
  Button: ['Click', 'MouseEnter', 'MouseLeave'],
  Label: ['Click'],
  TextBox: ['TextChanged', 'KeyPress', 'Enter', 'Leave'],
  CheckBox: ['CheckedChanged', 'Click'],
  RadioButton: ['CheckedChanged', 'Click'],
  ComboBox: ['SelectedIndexChanged', 'TextChanged'],
  ListBox: ['SelectedIndexChanged', 'DoubleClick'],
  GroupBox: ['Click'],
  PictureBox: ['Click'],
  NumericUpDown: ['ValueChanged'],
  ProgressBar: ['Click'],
  DateTimePicker: ['ValueChanged'],
  Timer: ['Tick'],
};

export type PropertyEditor = 'text' | 'number' | 'bool' | 'color' | 'choice' | 'items' | 'readonly';

export interface PropertyRow {
  name: string;
  category: 'Appearance' | 'Behavior' | 'Data' | 'Design' | 'Layout' | 'Misc';
  editor: PropertyEditor;
  key?: keyof VbControl;
  choices?: string[];
  /** Shown in the description pane under the grid. */
  help: string;
}

const COMMON_ROWS: PropertyRow[] = [
  { name: '(Name)', category: 'Design', editor: 'text', key: 'name', help: 'Indicates the name used in code to identify the object.' },
  { name: 'BackColor', category: 'Appearance', editor: 'color', key: 'backColor', help: 'The background color of the component.' },
  { name: 'Enabled', category: 'Behavior', editor: 'bool', key: 'enabled', help: 'Indicates whether the control is enabled.' },
  { name: 'Font', category: 'Appearance', editor: 'number', key: 'fontSize', help: 'The font used to display text in the control.' },
  { name: 'Bold', category: 'Appearance', editor: 'bool', key: 'bold', help: 'Indicates whether the font is bold.' },
  { name: 'ForeColor', category: 'Appearance', editor: 'color', key: 'foreColor', help: 'The foreground color of this component.' },
  { name: 'Location', category: 'Layout', editor: 'readonly', help: 'The coordinates of the upper-left corner of the control relative to its container.' },
  { name: 'Size', category: 'Layout', editor: 'readonly', help: 'The size of the control in pixels.' },
  { name: 'Text', category: 'Appearance', editor: 'text', key: 'text', help: 'The text associated with the control.' },
  { name: 'TextAlign', category: 'Appearance', editor: 'choice', key: 'textAlign', choices: ['Left', 'Center', 'Right'], help: 'The alignment of the text that will be displayed on the control.' },
  { name: 'Visible', category: 'Behavior', editor: 'bool', key: 'visible', help: 'Determines whether the control is visible or hidden.' },
];

const EXTRA_ROWS: Partial<Record<VbControlKind, PropertyRow[]>> = {
  TextBox: [
    { name: 'Multiline', category: 'Behavior', editor: 'bool', key: 'multiline', help: 'Controls whether the text of the edit control can span more than one line.' },
    { name: 'PasswordChar', category: 'Behavior', editor: 'text', key: 'passwordChar', help: 'Indicates the character to display for password input.' },
  ],
  CheckBox: [
    { name: 'Checked', category: 'Appearance', editor: 'bool', key: 'checked', help: 'Indicates whether the component is in the checked state.' },
  ],
  RadioButton: [
    { name: 'Checked', category: 'Appearance', editor: 'bool', key: 'checked', help: 'Indicates whether the component is in the checked state.' },
  ],
  ComboBox: [
    { name: 'Items', category: 'Data', editor: 'items', key: 'items', help: 'The items in the combo box.' },
  ],
  ListBox: [
    { name: 'Items', category: 'Data', editor: 'items', key: 'items', help: 'The items in the list box.' },
  ],
  NumericUpDown: [
    { name: 'Value', category: 'Data', editor: 'number', key: 'value', help: 'The current value of the spin box.' },
    { name: 'Minimum', category: 'Data', editor: 'number', key: 'minimum', help: 'Indicates the minimum value for the spin box.' },
    { name: 'Maximum', category: 'Data', editor: 'number', key: 'maximum', help: 'Indicates the maximum value for the spin box.' },
  ],
  ProgressBar: [
    { name: 'Value', category: 'Behavior', editor: 'number', key: 'value', help: 'The current value of the progress bar.' },
    { name: 'Minimum', category: 'Behavior', editor: 'number', key: 'minimum', help: 'The lower bound of the range of the progress bar.' },
    { name: 'Maximum', category: 'Behavior', editor: 'number', key: 'maximum', help: 'The upper bound of the range of the progress bar.' },
  ],
  PictureBox: [
    { name: 'ImageLocation', category: 'Data', editor: 'text', key: 'imageUrl', help: 'The path or URL of the image displayed in the control.' },
  ],
  Timer: [
    { name: 'Interval', category: 'Behavior', editor: 'number', key: 'interval', help: 'The frequency of Tick events in milliseconds.' },
    { name: 'Enabled', category: 'Behavior', editor: 'bool', key: 'timerEnabled', help: 'Determines whether the timer is running.' },
  ],
};

/** Properties this control kind does not have are dropped from the grid. */
const HIDDEN_ROWS: Partial<Record<VbControlKind, string[]>> = {
  Timer: ['BackColor', 'ForeColor', 'Font', 'Bold', 'Location', 'Size', 'Text', 'TextAlign', 'Visible', 'Enabled'],
  ListBox: ['Text', 'TextAlign'],
  ComboBox: ['TextAlign'],
  ProgressBar: ['Text', 'TextAlign', 'ForeColor'],
  PictureBox: ['Text', 'TextAlign', 'ForeColor'],
  DateTimePicker: ['Text', 'TextAlign'],
  NumericUpDown: ['Text'],
};

export const propertyRowsFor = (kind: VbControlKind): PropertyRow[] => {
  const hidden = new Set(HIDDEN_ROWS[kind] || []);
  return [...COMMON_ROWS.filter((row) => !hidden.has(row.name)), ...(EXTRA_ROWS[kind] || [])];
};

export const FORM_PROPERTY_ROWS: PropertyRow[] = [
  { name: '(Name)', category: 'Design', editor: 'text', help: 'Indicates the name used in code to identify the object.' },
  { name: 'BackColor', category: 'Appearance', editor: 'color', help: 'The background color of the component.' },
  {
    name: 'FormBorderStyle',
    category: 'Appearance',
    editor: 'choice',
    choices: ['Sizable', 'FixedSingle', 'Fixed3D', 'None'],
    help: 'Indicates the border and title bar appearance of the form.',
  },
  {
    name: 'StartPosition',
    category: 'Layout',
    editor: 'choice',
    choices: ['CenterScreen', 'Manual', 'WindowsDefaultLocation'],
    help: 'Determines the position of the form when it first appears.',
  },
  { name: 'Text', category: 'Appearance', editor: 'text', help: 'The text associated with the control.' },
  { name: 'Width', category: 'Layout', editor: 'number', help: 'The width of the form in pixels.' },
  { name: 'Height', category: 'Layout', editor: 'number', help: 'The height of the form in pixels.' },
];

const STORAGE_KEY = 'sidemann-vbnet-project-v1';

export const saveProject = (project: VbProject) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch {
    // ignore a blocked or full localStorage
  }
};

export const loadProject = (): VbProject | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as VbProject;
    if (!parsed || !Array.isArray(parsed.forms) || parsed.forms.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearSavedProject = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
};

import type { WebProjectFiles } from "./webPreviewDocument";

export type EditTarget = keyof WebProjectFiles;

export interface EditBlock {
  /** File the tutor named on the fence, when it named one. */
  hint?: EditTarget;
  search: string;
  replace: string;
}

export interface EditOutcome {
  file: EditTarget;
  applied: boolean;
  search: string;
}

const FILE_LABELS: Record<EditTarget, string> = {
  html: "index.html",
  css: "styles.css",
  js: "script.js",
};

const TARGET_ORDER: EditTarget[] = ["html", "css", "js"];

const FENCE = /^\s*```/;
const START_MARKER = /^\s*<{3,}\s*(.*?)\s*$/;
const SEPARATOR = /^\s*(?:={3,}|>{3,}|-{5,})\s*(.*?)\s*$/;
const END_MARKER = /^\s*>{3,}\s*(.*?)\s*$/;

/** Reads a file name out of a fence or marker line, e.g. "```edit styles.css". */
const hintFromLabel = (label: string): EditTarget | undefined => {
  const text = label.toLowerCase();
  if (/styles\.css|\bcss\b/.test(text)) return "css";
  if (/script\.js|\bjavascript\b|\bjs\b/.test(text)) return "js";
  if (/index\.html|\bhtml\b/.test(text)) return "html";
  return undefined;
};

/**
 * Scans the reply for edit blocks line by line rather than with one strict
 * pattern, because small models drift on the markers: the file name turns up on
 * the fence or on the SEARCH line, the separator comes back as `=======` or
 * `>>>>>>>`, and the closing `>>>>>>> REPLACE` is often missing entirely. All of
 * those still describe the same edit, so all of them are accepted.
 */
const scanEditBlocks = (text: string): Array<EditBlock & { firstLine: number; lastLine: number }> => {
  const lines = text.split("\n");
  const blocks: Array<EditBlock & { firstLine: number; lastLine: number }> = [];
  let fenceHint: EditTarget | undefined;
  let fenceLine = -1;
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (FENCE.test(line)) {
      fenceHint = hintFromLabel(line);
      fenceLine = index;
      index += 1;
      continue;
    }

    const start = START_MARKER.exec(line);
    if (!start) {
      index += 1;
      continue;
    }

    const hint = hintFromLabel(start[1]) ?? fenceHint;
    const firstLine = fenceLine === index - 1 ? fenceLine : index;
    index += 1;

    const searchLines: string[] = [];
    let separatorLabel: string | null = null;
    while (index < lines.length) {
      const separator = SEPARATOR.exec(lines[index]);
      if (separator) {
        separatorLabel = separator[1];
        index += 1;
        break;
      }
      searchLines.push(lines[index]);
      index += 1;
    }

    // A block with no separator at all is not an edit, just prose.
    if (separatorLabel === null) break;

    const replaceLines: string[] = [];
    let lastLine = index - 1;
    while (index < lines.length) {
      const current = lines[index];
      if (END_MARKER.test(current) || FENCE.test(current) || START_MARKER.test(current)) {
        // Consume the terminator, but leave a following block's start alone.
        lastLine = END_MARKER.test(current) || FENCE.test(current) ? index : index - 1;
        if (END_MARKER.test(current) || FENCE.test(current)) index += 1;
        break;
      }
      replaceLines.push(current);
      lastLine = index;
      index += 1;
    }

    // A trailing fence that closes the block belongs to it.
    if (index < lines.length && FENCE.test(lines[index])) {
      lastLine = index;
      index += 1;
    }

    blocks.push({
      hint,
      search: searchLines.join("\n").replace(/^\n+|\n+$/g, ""),
      replace: replaceLines.join("\n").replace(/^\n+|\n+$/g, ""),
      firstLine,
      lastLine,
    });
    fenceHint = undefined;
    fenceLine = -1;
  }

  return blocks;
};

export const parseEditBlocks = (text: string): EditBlock[] =>
  scanEditBlocks(text).map(({ hint, search, replace }) => ({ hint, search, replace }));

/** Removes the machine-readable blocks so the chat shows only the explanation. */
export const stripEditBlocks = (text: string) => {
  const blocks = scanEditBlocks(text);
  if (blocks.length === 0) return text.trim();

  const lines = text.split("\n");
  const dropped = new Set<number>();
  blocks.forEach((block) => {
    for (let line = block.firstLine; line <= block.lastLine; line += 1) dropped.add(line);
  });

  return lines
    .filter((_, index) => !dropped.has(index))
    .join("\n")
    .replace(/```(?:edit|html|css|javascript|js)?\s*```/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/**
 * Locates `search` in `content` allowing for indentation drift: an exact hit
 * wins, otherwise the lines are compared with their surrounding whitespace
 * trimmed, which is what a model usually gets wrong when it retypes a snippet.
 */
const findRange = (content: string, search: string): { start: number; end: number } | null => {
  const exact = content.indexOf(search);
  if (exact !== -1) return { start: exact, end: exact + search.length };

  const contentLines = content.split("\n");
  const searchLines = search.split("\n");
  if (searchLines.length === 0) return null;

  const normalise = (line: string) => line.trim();
  const target = searchLines.map(normalise);

  for (let index = 0; index + target.length <= contentLines.length; index += 1) {
    const window = contentLines.slice(index, index + target.length).map(normalise);
    if (window.every((line, offset) => line === target[offset])) {
      const start = contentLines.slice(0, index).reduce((total, line) => total + line.length + 1, 0);
      const end =
        start +
        contentLines.slice(index, index + target.length).reduce((total, line) => total + line.length + 1, 0) -
        1;
      return { start, end };
    }
  }

  return null;
};

/**
 * Applies the tutor's edits to the student's files, touching only the matched
 * lines. An edit whose SEARCH text cannot be found is reported rather than
 * guessed at, so a bad match never overwrites work.
 */
export const applyEditBlocks = (
  files: WebProjectFiles,
  blocks: EditBlock[]
): { files: WebProjectFiles; outcomes: EditOutcome[] } => {
  const next: WebProjectFiles = { ...files };
  const outcomes: EditOutcome[] = [];

  for (const block of blocks) {
    // An empty SEARCH means "add this", which goes on the end of the file.
    if (!block.search.trim()) {
      const file = block.hint ?? "html";
      const existing = next[file];
      next[file] = existing.trim() ? `${existing.replace(/\s*$/, "")}\n\n${block.replace}\n` : `${block.replace}\n`;
      outcomes.push({ file, applied: true, search: block.search });
      continue;
    }

    const candidates = block.hint
      ? [block.hint, ...TARGET_ORDER.filter((target) => target !== block.hint)]
      : TARGET_ORDER;

    let done = false;
    for (const file of candidates) {
      const range = findRange(next[file], block.search);
      if (!range) continue;
      next[file] = next[file].slice(0, range.start) + block.replace + next[file].slice(range.end);
      outcomes.push({ file, applied: true, search: block.search });
      done = true;
      break;
    }

    if (!done) {
      outcomes.push({ file: block.hint ?? "html", applied: false, search: block.search });
    }
  }

  return { files: next, outcomes };
};

export interface TutorResponse {
  reply: string;
  edits: EditBlock[];
  newPage: WebProjectFiles | null;
}

const targetFromName = (value: unknown): EditTarget | undefined => {
  if (typeof value !== "string") return undefined;
  return hintFromLabel(value);
};

const firstString = (source: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string") return value;
  }
  return "";
};

/** Pulls the JSON object out of a reply that may be fenced or have prose around it. */
const extractJsonObject = (text: string) => {
  const trimmed = text.trim();
  if (trimmed.startsWith("{")) return trimmed;

  const fenced = /```(?:json)?\s*(\{[\s\S]*\})\s*```/.exec(trimmed);
  if (fenced) return fenced[1];

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) return trimmed.slice(start, end + 1);
  return null;
};

/**
 * Reads the structured reply the tutor is asked for: an explanation plus the
 * exact find/replace pairs to apply. Returns null when the reply is not that
 * shape, so the caller can fall back to reading plain markdown.
 */
export const parseTutorJson = (text: string): TutorResponse | null => {
  const candidate = extractJsonObject(text);
  if (!candidate) return null;

  let data: any;
  try {
    data = JSON.parse(candidate);
  } catch {
    return null;
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;

  const edits: EditBlock[] = Array.isArray(data.edits)
    ? data.edits
        .filter((edit: unknown): edit is Record<string, unknown> => Boolean(edit) && typeof edit === "object")
        .map((edit: Record<string, unknown>) => ({
          hint: targetFromName(edit.file ?? edit.filename ?? edit.target),
          search: firstString(edit, ["find", "search", "old", "from"]),
          replace: firstString(edit, ["replace", "new", "to", "with"]),
        }))
        .filter((edit: EditBlock) => Boolean(edit.search || edit.replace))
    : [];

  let newPage: WebProjectFiles | null = null;
  const page = data.newPage ?? data.newFiles ?? data.files;
  if (page && typeof page === "object") {
    const html = firstString(page, ["html", "index.html"]);
    const css = firstString(page, ["css", "styles.css"]);
    const js = firstString(page, ["js", "javascript", "script.js"]);
    if (html || css || js) newPage = { html, css, js };
  }

  const reply = firstString(data, ["reply", "explanation", "message", "answer", "text"]);
  if (!reply && edits.length === 0 && !newPage) return null;

  return { reply: reply || "Done.", edits, newPage };
};

/** One line for the chat describing what actually changed. */
export const summariseOutcomes = (outcomes: EditOutcome[]) => {
  const applied = outcomes.filter((outcome) => outcome.applied);
  const failed = outcomes.length - applied.length;

  if (applied.length === 0) {
    return "_I could not find that code in your files, so nothing was changed. Paste the part you want fixed and I will try again._";
  }

  const touched = [...new Set(applied.map((outcome) => FILE_LABELS[outcome.file]))].join(", ");
  const editWord = applied.length === 1 ? "edit" : "edits";
  const note = failed > 0 ? ` (${failed} could not be matched and was skipped)` : "";
  return `_Applied ${applied.length} ${editWord} to ${touched}${note}._`;
};

/** The current project, formatted for the model to read before it answers. */
export const buildFilesContext = (files: WebProjectFiles, activeFile: EditTarget) => {
  const clip = (value: string) => (value.length > 6000 ? `${value.slice(0, 6000)}\n... (truncated)` : value);

  return TARGET_ORDER.map((target) => {
    const body = files[target].trim() ? clip(files[target]) : "(empty)";
    const marker = target === activeFile ? "  <-- the file the student is looking at" : "";
    return `=== ${FILE_LABELS[target]} ===${marker}\n${body}`;
  }).join("\n\n");
};

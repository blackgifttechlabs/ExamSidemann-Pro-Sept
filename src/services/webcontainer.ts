/**
 * services/webcontainer.ts
 * Browser-based WebContainer runner with:
 * 1. Local Folder Import & Drag-and-Drop Tree Parser
 * 2. Diff Engine (+lines / -lines)
 * 3. AI Self-Verification & Auto-Fix Loop
 * 4. AI Agent Tool-Calling System (list_directory, read_file, write_file, search_folder, run_command)
 */

import { WebContainer, type FileSystemTree } from '@webcontainer/api';
import { diffLines } from 'diff';
import { requestGeminiCompletion } from './gemini';

let webcontainerPromise: Promise<WebContainer> | null = null;
let webcontainerInstance: WebContainer | null = null;
let devServerUrl: string | null = null;
let isServerStarting = false;
let buildErrorLog = '';
let mountedFolderName: string | null = null;

const initialProjectFiles: FileSystemTree = {
  'package.json': {
    file: {
      contents: JSON.stringify(
        {
          name: 'ai-code-sandbox',
          type: 'module',
          scripts: {
            dev: 'vite --host',
          },
          dependencies: {
            react: '^18.3.1',
            'react-dom': '^18.3.1',
            'lucide-react': '^0.468.0',
            clsx: '^2.1.1',
          },
          devDependencies: {
            vite: '^5.4.2',
            '@vitejs/plugin-react': '^4.3.1',
            autoprefixer: '^10.4.20',
            postcss: '^8.4.47',
            tailwindcss: '^3.4.11',
          },
        },
        null,
        2
      ),
    },
  },
  'vite.config.js': {
    file: {
      contents: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    hmr: true,
  },
});
`,
    },
  },
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI Code Sandbox</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-white text-slate-900 antialiased p-0 m-0">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,
    },
  },
  src: {
    directory: {
      'main.tsx': {
        file: {
          contents: `
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
`,
        },
      },
      'App.tsx': {
        file: {
          contents: `
import React from 'react';

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-slate-50">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <h1 className="text-xl font-bold text-slate-900">AI Code Sandbox Ready</h1>
        <p className="text-xs text-slate-500 mt-2">Run code snippets or drag & drop a folder to mount a full project.</p>
      </div>
    </div>
  );
}
`,
        },
      },
    },
  },
};

/**
 * Boots or retrieves the singleton WebContainer instance.
 */
export async function getWebContainer(): Promise<WebContainer> {
  if (webcontainerInstance) return webcontainerInstance;

  if (typeof window !== 'undefined' && !window.crossOriginIsolated) {
    throw new Error(
      'Black-Tonet needs cross-origin isolation to run projects. Restart the dev server or redeploy the site with COOP/COEP headers, then reload this page.'
    );
  }

  if (!webcontainerPromise) {
    webcontainerPromise = (async () => {
      const container = await WebContainer.boot();
      webcontainerInstance = container;
      await container.mount(initialProjectFiles);
      return container;
    })().catch((error) => {
      webcontainerPromise = null;
      webcontainerInstance = null;
      throw error;
    });
  }

  return webcontainerPromise;
}

export function getMountedFolderName(): string | null {
  return mountedFolderName;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. FOLDER IMPORT & DRAG-AND-DROP PARSER
// ─────────────────────────────────────────────────────────────────────────────

const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  'dist',
  'build',
  '.vscode',
  '.idea',
  '.DS_Store',
  'coverage',
]);

/**
 * Converts a FileSystemDirectoryHandle (showDirectoryPicker) into WebContainer FileSystemTree.
 */
export async function buildFileSystemTreeFromHandle(
  dirHandle: FileSystemDirectoryHandle
): Promise<{ tree: FileSystemTree; fileCount: number }> {
  let fileCount = 0;

  async function traverse(handle: FileSystemDirectoryHandle): Promise<FileSystemTree> {
    const tree: FileSystemTree = {};

    for await (const [name, entry] of (handle as any).entries()) {
      if (IGNORED_DIRECTORIES.has(name) || name.startsWith('.')) continue;

      if (entry.kind === 'file') {
        const file = await entry.getFile();
        const contents = await file.text();
        tree[name] = { file: { contents } };
        fileCount++;
      } else if (entry.kind === 'directory') {
        tree[name] = {
          directory: await traverse(entry),
        };
      }
    }

    return tree;
  }

  const tree = await traverse(dirHandle);
  return { tree, fileCount };
}

/**
 * Builds a WebContainer tree from the fallback `<input webkitdirectory>` API.
 */
export async function buildFileSystemTreeFromFileList(
  files: FileList
): Promise<{ tree: FileSystemTree; folderName: string; fileCount: number }> {
  const tree: FileSystemTree = {};
  let folderName = 'project';

  for (const file of Array.from(files)) {
    const relativePath = file.webkitRelativePath || file.name;
    const parts = relativePath.split('/').filter(Boolean);
    if (parts.length > 1) folderName = parts.shift() || folderName;
    if (!parts.length || parts.some((part) => IGNORED_DIRECTORIES.has(part) || part.startsWith('.'))) continue;

    let cursor = tree;
    for (let index = 0; index < parts.length - 1; index++) {
      const part = parts[index];
      const existing = cursor[part];
      if (!existing || !('directory' in existing)) {
        cursor[part] = { directory: {} };
      }
      cursor = (cursor[part] as { directory: FileSystemTree }).directory;
    }

    cursor[parts[parts.length - 1]] = { file: { contents: await file.text() } };
  }

  return { tree, folderName, fileCount: Object.keys(flattenFileSystemTree(tree)).length };
}

/** Returns text-file paths and contents from a WebContainer tree. */
export function flattenFileSystemTree(tree: FileSystemTree, basePath = ''): Record<string, string> {
  const files: Record<string, string> = {};
  for (const [name, entry] of Object.entries(tree)) {
    const path = `${basePath}/${name}`;
    if ('file' in entry) {
      if ('contents' in entry.file) {
        const contents = entry.file.contents;
        files[path] = typeof contents === 'string' ? contents : new TextDecoder().decode(contents);
      }
    } else if ('directory' in entry) {
      Object.assign(files, flattenFileSystemTree(entry.directory, path));
    }
  }
  return files;
}

/**
 * Recursively parses FileSystemEntry (from drag-and-drop DataTransferItem).
 */
async function readEntryRecursively(
  entry: any
): Promise<{ name: string; isFile: boolean; contents?: string; directory?: FileSystemTree }> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file: File) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: entry.name,
            isFile: true,
            contents: (reader.result as string) || '',
          });
        };
        reader.onerror = () => {
          resolve({ name: entry.name, isFile: true, contents: '' });
        };
        reader.readAsText(file);
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const entriesList: any[] = [];

      const readBatch = () => {
        dirReader.readEntries(async (results: any[]) => {
          if (!results.length) {
            const dirTree: FileSystemTree = {};
            for (const child of entriesList) {
              if (IGNORED_DIRECTORIES.has(child.name) || child.name.startsWith('.')) continue;
              const childResult = await readEntryRecursively(child);
              if (childResult.isFile) {
                dirTree[childResult.name] = { file: { contents: childResult.contents || '' } };
              } else if (childResult.directory) {
                dirTree[childResult.name] = { directory: childResult.directory };
              }
            }
            resolve({
              name: entry.name,
              isFile: false,
              directory: dirTree,
            });
          } else {
            entriesList.push(...results);
            readBatch();
          }
        });
      };

      readBatch();
    } else {
      resolve({ name: entry.name, isFile: true, contents: '' });
    }
  });
}

/**
 * Parses drag & drop DataTransferItemList into a WebContainer FileSystemTree.
 */
export async function buildFileSystemTreeFromDataTransfer(
  items: DataTransferItemList
): Promise<{ tree: FileSystemTree; folderName: string; fileCount: number }> {
  const tree: FileSystemTree = {};
  let fileCount = 0;
  let detectedFolderName = 'project';

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const entry = (item as any).webkitGetAsEntry ? (item as any).webkitGetAsEntry() : null;

    if (entry) {
      if (entry.isDirectory) {
        detectedFolderName = entry.name;
        const res = await readEntryRecursively(entry);
        if (res.directory) {
          Object.assign(tree, res.directory);
        }
      } else if (entry.isFile) {
        const res = await readEntryRecursively(entry);
        tree[entry.name] = { file: { contents: res.contents || '' } };
        fileCount++;
      }
    }
  }

  // Count files recursively
  const countFiles = (node: FileSystemTree) => {
    for (const val of Object.values(node)) {
      if ('file' in val) fileCount++;
      else if ('directory' in val) countFiles(val.directory);
    }
  };
  fileCount = 0;
  countFiles(tree);

  return { tree, folderName: detectedFolderName, fileCount };
}

/**
 * Mounts a full project folder into WebContainer and boots its environment.
 */
export async function mountFolderIntoWebContainer(
  tree: FileSystemTree,
  folderName: string,
  onStatus?: (status: string) => void
): Promise<string> {
  mountedFolderName = folderName;
  onStatus?.(`Mounting ${folderName} (${Object.keys(tree).length} root items)...`);

  const container = await getWebContainer();
  await container.mount(tree);

  // Check the imported tree rather than the container root. The container has
  // a starter package.json, which must not make a plain HTML folder look like
  // an npm project.
  const packageEntry = tree['package.json'];
  const hasPackageJson = Boolean(packageEntry && 'file' in packageEntry);

  if (hasPackageJson) {
    onStatus?.('Installing dependencies for imported project...');
    const install = await container.spawn('npm', ['install', '--prefer-offline', '--no-audit']);
    await install.exit;

    onStatus?.('Starting project dev server...');
    const dev = await container.spawn('npm', ['run', 'dev']);
    dev.output.pipeTo(
      new WritableStream({
        write(chunk) {
          if (
            chunk.includes('[vite] Internal server error') ||
            chunk.includes('Uncaught SyntaxError') ||
            chunk.includes('Transform failed') ||
            chunk.includes('SyntaxError:')
          ) {
            buildErrorLog = (buildErrorLog + '\n' + chunk).slice(-2000);
          }
        },
      })
    );

    return new Promise<string>((resolve) => {
      container.on('server-ready', (port, url) => {
        devServerUrl = url;
        onStatus?.(`Dev server live on port ${port}`);
        resolve(url);
      });
      setTimeout(() => resolve(devServerUrl || ''), 15_000);
    });
  }

  onStatus?.(`Mounted ${folderName} successfully.`);
  return devServerUrl || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. AI TOOL-CALLING SYSTEM (Navigation, Extraction & Execution)
// ─────────────────────────────────────────────────────────────────────────────

export type ToolResult = {
  success: boolean;
  data?: any;
  error?: string;
};

/**
 * AI Tool definitions formatted for Gemini / LLM function calling.
 */
export const WEBCONTAINER_AI_TOOLS = [
  {
    name: 'list_directory',
    description: 'Lists all files and directories inside a specified path in the project workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        path: {
          type: 'STRING',
          description: 'The directory path to list, e.g. "/" or "/src" or "/src/components". Defaults to "/".',
        },
      },
    },
  },
  {
    name: 'read_file',
    description: 'Reads the complete text content of a file from the workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        filePath: {
          type: 'STRING',
          description: 'The path of the file to read, e.g. "/src/App.tsx" or "/package.json".',
        },
      },
      required: ['filePath'],
    },
  },
  {
    name: 'write_file',
    description: 'Creates or overwrites a file with new content in the workspace.',
    parameters: {
      type: 'OBJECT',
      properties: {
        filePath: {
          type: 'STRING',
          description: 'The path of the file to write, e.g. "/src/components/Header.tsx".',
        },
        content: {
          type: 'STRING',
          description: 'The complete content to write into the file.',
        },
      },
      required: ['filePath', 'content'],
    },
  },
  {
    name: 'search_folder',
    description: 'Searches for a text pattern or symbol across all files in a directory.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: {
          type: 'STRING',
          description: 'The text snippet or function/variable name to search for.',
        },
        directory: {
          type: 'STRING',
          description: 'The directory to search inside, e.g. "/src". Defaults to "/".',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'run_command',
    description: 'Runs a terminal shell command inside the WebContainer environment (e.g. "ls", "npm test", "tsc").',
    parameters: {
      type: 'OBJECT',
      properties: {
        command: {
          type: 'STRING',
          description: 'The command binary name, e.g. "npm", "ls", "node", "grep".',
        },
        args: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Array of command-line arguments, e.g. ["test"], ["-la", "src"].',
        },
      },
      required: ['command'],
    },
  },
];

/**
 * Executes a tool called by the AI agent against the live WebContainer.
 */
export async function executeAiToolCall(toolName: string, args: any): Promise<ToolResult> {
  const container = await getWebContainer();
  const safeArgs: Record<string, any> = args && typeof args === 'object' && !Array.isArray(args) ? args : {};

  try {
    switch (toolName) {
      case 'list_directory': {
        const targetPath = String(safeArgs.path || '/').trim();
        const entries = await container.fs.readdir(targetPath, { withFileTypes: true });
        const files = entries.map((e) => ({
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
        }));
        return { success: true, data: { path: targetPath, entries: files } };
      }

      case 'read_file': {
        const filePath = String(safeArgs.filePath || '').trim();
        if (!filePath) return { success: false, error: 'filePath argument is required.' };
        const content = await container.fs.readFile(filePath, 'utf-8');
        return { success: true, data: { filePath, content } };
      }

      case 'write_file': {
        const filePath = String(safeArgs.filePath || '').trim();
        const content = String(safeArgs.content ?? '');
        if (!filePath) return { success: false, error: 'filePath argument is required.' };

        // Ensure parent directory exists
        const parts = filePath.split('/').filter(Boolean);
        if (parts.length > 1) {
          const parentDir = '/' + parts.slice(0, -1).join('/');
          await container.fs.mkdir(parentDir, { recursive: true }).catch(() => undefined);
        }

        let oldCode = '';
        try {
          oldCode = await container.fs.readFile(filePath, 'utf-8');
        } catch {
          oldCode = '';
        }

        await container.fs.writeFile(filePath, content);
        const diff = calculateDiffStats(oldCode, content);

        return {
          success: true,
          data: {
            filePath,
            diff,
            message: `Wrote ${content.length} characters to ${filePath} (+${diff.linesAdded} / -${diff.linesRemoved})`,
          },
        };
      }

      case 'search_folder': {
        const query = String(safeArgs.query || '').trim();
        const targetDir = String(safeArgs.directory || '/').trim();
        if (!query) return { success: false, error: 'query argument is required.' };

        const matches: Array<{ file: string; line: number; text: string }> = [];

        async function searchDirectory(dir: string) {
          const entries = await container.fs.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            if (IGNORED_DIRECTORIES.has(entry.name) || entry.name.startsWith('.')) continue;
            const fullPath = dir === '/' ? `/${entry.name}` : `${dir}/${entry.name}`;

            if (entry.isDirectory()) {
              await searchDirectory(fullPath);
            } else if (entry.isFile()) {
              try {
                const text = await container.fs.readFile(fullPath, 'utf-8');
                const lines = text.split('\n');
                lines.forEach((line, idx) => {
                  if (line.toLowerCase().includes(query.toLowerCase())) {
                    matches.push({ file: fullPath, line: idx + 1, text: line.trim() });
                  }
                });
              } catch {
                // Ignore binary/unreadable files
              }
            }
          }
        }

        await searchDirectory(targetDir);
        return {
          success: true,
          data: {
            query,
            totalMatches: matches.length,
            matches: matches.slice(0, 50),
          },
        };
      }

      case 'run_command': {
        const cmd = String(safeArgs.command || 'ls');
        const cmdArgs = Array.isArray(safeArgs.args) ? safeArgs.args.map(String) : [];

        const process = await container.spawn(cmd, cmdArgs);
        let output = '';

        process.output.pipeTo(
          new WritableStream({
            write(chunk) {
              output += chunk;
            },
          })
        );

        const exitCode = await process.exit;
        return {
          success: exitCode === 0,
          data: {
            command: `${cmd} ${cmdArgs.join(' ')}`,
            exitCode,
            output: output.trim(),
          },
        };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolName}` };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. DIFF ENGINE & VERIFICATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates line diff stats (+linesAdded / -linesRemoved) between two code strings.
 */
export function calculateDiffStats(oldCode: string, newCode: string): { linesAdded: number; linesRemoved: number } {
  if (!oldCode && !newCode) return { linesAdded: 0, linesRemoved: 0 };
  if (!oldCode) return { linesAdded: newCode.split('\n').length, linesRemoved: 0 };
  if (!newCode) return { linesAdded: 0, linesRemoved: oldCode.split('\n').length };

  const changes = diffLines(oldCode, newCode);
  let linesAdded = 0;
  let linesRemoved = 0;

  changes.forEach((change) => {
    if (change.added) {
      linesAdded += change.count || 0;
    } else if (change.removed) {
      linesRemoved += change.count || 0;
    }
  });

  return { linesAdded, linesRemoved };
}

/**
 * Normalizes React/TSX code into a valid App.tsx module.
 */
export function wrapIntoAppModule(rawCode: string): string {
  const trimmed = rawCode.trim();

  if (/export\s+default\b/.test(trimmed)) {
    if (!/import\s+React\b|import\s+.*\bfrom\s+['"]react['"]/.test(trimmed)) {
      return `import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';\n${trimmed}`;
    }
    return trimmed;
  }

  const componentMatch = trimmed.match(/(?:function|const)\s+([A-Z]\w*)/);
  if (componentMatch) {
    const compName = componentMatch[1];
    let code = trimmed;
    if (!/import\s+React\b|import\s+.*\bfrom\s+['"]react['"]/.test(code)) {
      code = `import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';\n${code}`;
    }
    return `${code}\n\nexport default ${compName};`;
  }

  return `
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-slate-50">
      ${trimmed}
    </div>
  );
}
`;
}

function cleanAiCodeResponse(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:tsx|jsx|typescript|javascript|html)?\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned.trim();
}

export type WebContainerRunnerState = {
  url: string | null;
  status: 'idle' | 'booting' | 'installing' | 'starting' | 'verifying' | 'fixing' | 'ready' | 'error';
  logs: string;
  diff?: { linesAdded: number; linesRemoved: number };
  fixedCode?: string;
  mountedFolder?: string;
};

/**
 * Writes an HTML document into the sandbox and reports its line diff. The
 * caller may still render the document with srcDoc while no dev server exists.
 */
export async function runHtmlInWebContainer(
  html: string,
  onStatusChange?: (state: WebContainerRunnerState) => void
): Promise<string> {
  const container = await getWebContainer();
  let previousHtml = '';
  try {
    previousHtml = await container.fs.readFile('/index.html', 'utf-8');
  } catch {
    previousHtml = '';
  }

  const diff = calculateDiffStats(previousHtml, html);
  await container.fs.writeFile('/index.html', html);
  onStatusChange?.({
    url: devServerUrl,
    status: 'ready',
    logs: `HTML updated (+${diff.linesAdded} / -${diff.linesRemoved})\n`,
    diff,
    mountedFolder: mountedFolderName || undefined,
  });
  return devServerUrl || '';
}

/**
 * Executes React/TSX code inside the WebContainer with Diff tracking and AI Self-Verification Loop.
 */
export async function runReactInWebContainer(
  code: string,
  onStatusChange?: (state: WebContainerRunnerState) => void
): Promise<string> {
  let currentDiff: { linesAdded: number; linesRemoved: number } | undefined;

  const notify = (
    status: WebContainerRunnerState['status'],
    logAppend?: string,
    diff?: { linesAdded: number; linesRemoved: number },
    fixedCode?: string
  ) => {
    if (diff) currentDiff = diff;
    onStatusChange?.({
      url: devServerUrl,
      status,
      logs: logAppend || '',
      diff: currentDiff,
      fixedCode,
      mountedFolder: mountedFolderName || undefined,
    });
  };

  try {
    notify('booting', 'Booting WebAssembly micro-container...\n');
    const container = await getWebContainer();

    // 1. Read existing App.tsx to compute diff stats
    let oldCode = '';
    try {
      oldCode = await container.fs.readFile('/src/App.tsx', 'utf-8');
    } catch {
      oldCode = '';
    }

    let activeCode = wrapIntoAppModule(code);
    const diffStats = calculateDiffStats(oldCode, activeCode);
    currentDiff = diffStats;

    // 2. Write file
    await container.fs.writeFile('/src/App.tsx', activeCode);
    buildErrorLog = '';

    // 3. Boot dev server if not yet running
    if (!devServerUrl && !isServerStarting) {
      isServerStarting = true;

      notify('installing', 'Installing container dependencies...\n', diffStats);
      const installProcess = await container.spawn('npm', ['install', '--prefer-offline', '--no-audit']);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            notify('installing', data, diffStats);
          },
        })
      );

      const exitCode = await installProcess.exit;
      if (exitCode !== 0) {
        throw new Error(`npm install failed with exit code ${exitCode}`);
      }

      notify('starting', 'Starting Vite development server...\n', diffStats);
      const devProcess = await container.spawn('npm', ['run', 'dev']);

      devProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            notify('starting', data, diffStats);
            if (
              data.includes('[vite] Internal server error') ||
              data.includes('Uncaught SyntaxError') ||
              data.includes('Transform failed') ||
              data.includes('Failed to parse source') ||
              data.includes('error during build') ||
              data.includes('SyntaxError:')
            ) {
              buildErrorLog = (buildErrorLog + '\n' + data).slice(-2000);
            }
          },
        })
      );

      await new Promise<string>((resolve, reject) => {
        container.on('server-ready', (port, url) => {
          devServerUrl = url;
          resolve(url);
        });

        setTimeout(() => {
          if (devServerUrl) resolve(devServerUrl);
          else reject(new Error('Timed out waiting for Vite server-ready event'));
        }, 20_000);
      });
    }

    // 4. AI Self-Verification Loop
    notify('verifying', 'Verifying build and runtime compilation...\n', diffStats);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    let verificationAttempts = 0;
    const MAX_FIX_ATTEMPTS = 2;

    while (buildErrorLog && verificationAttempts < MAX_FIX_ATTEMPTS) {
      verificationAttempts++;
      const detectedError = buildErrorLog;
      buildErrorLog = '';

      notify(
        'fixing',
        `Error detected! AI is self-fixing (attempt ${verificationAttempts}/${MAX_FIX_ATTEMPTS})...\n${detectedError}\n`,
        diffStats
      );

      try {
        const fixPrompt = `You wrote a React / TSX component that caused the following Vite build/syntax error in WebContainer:

ERROR LOG:
${detectedError}

CURRENT CODE:
\`\`\`tsx
${activeCode}
\`\`\`

TASK:
Fix the error completely. Make sure all imports and JSX tags are valid.
Output ONLY the clean corrected TSX/React code without explanations or markdown formatting tags.`;

        const fixedRaw = await requestGeminiCompletion({
          messages: [
            {
              role: 'system',
              content: 'You are an expert React TypeScript engineer that writes bug-free components.',
            },
            {
              role: 'user',
              content: fixPrompt,
            },
          ],
          maxTokens: 3500,
          temperature: 0.2,
        });

        const fixedCode = cleanAiCodeResponse(fixedRaw);
        if (fixedCode && fixedCode.length > 20) {
          const newAppCode = wrapIntoAppModule(fixedCode);
          const newDiffStats = calculateDiffStats(oldCode, newAppCode);
          currentDiff = newDiffStats;
          activeCode = newAppCode;

          await container.fs.writeFile('/src/App.tsx', newAppCode);
          notify('verifying', 'Applying auto-fix and re-verifying build...\n', newDiffStats, newAppCode);
          await new Promise((resolve) => setTimeout(resolve, 1400));
        } else {
          break;
        }
      } catch (err: any) {
        console.warn('Self-verification fix error:', err);
        break;
      }
    }

    notify(
      'ready',
      `Changes applied successfully (+${currentDiff?.linesAdded || 0} / -${currentDiff?.linesRemoved || 0})\n`,
      currentDiff,
      activeCode
    );

    return devServerUrl || '';
  } catch (err: any) {
    notify('error', `Error: ${err?.message || err}\n`);
    throw err;
  }
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FileSystemTree } from '@webcontainer/api';
import { diffLines } from 'diff';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, Bot, Boxes, Bug, Check, ChevronDown, ChevronRight, CircleDot, Clock, Copy, Download, Eye,
  FileCode2, FilePlus2, Files, Folder, FolderOpen, FolderPlus, GitBranch, Home, Loader2, MoreHorizontal,
  Play, RefreshCw, Search, Send, Settings, Sparkles, Trash2, UploadCloud, X,
} from 'lucide-react';
import { requestGeminiCompletion, type RateLimitWaitInfo } from '../../services/gemini';
import {
  buildFileSystemTreeFromDataTransfer, buildFileSystemTreeFromFileList,
  buildFileSystemTreeFromHandle, executeAiToolCall, flattenFileSystemTree,
  mountFolderIntoWebContainer,
} from '../../services/webcontainer';
import {
  type CachedCodeAgentProject,
  deleteCachedCodeAgentProject,
  downloadCodeAgentProjectZip,
  fileMapToWebContainerTree,
  listCachedCodeAgentProjects,
  saveCachedCodeAgentProject,
} from '../../services/codeAgentProjects';

type Message = { id: string; role: 'assistant' | 'user'; text: string };
type AgentAction = {
  tool: 'list_directory' | 'read_file' | 'write_file' | 'search_folder' | 'run_command';
  args: Record<string, unknown>;
};
type AgentActivity = {
  id: string;
  tool: AgentAction['tool'];
  label: string;
  detail: string;
  status: 'running' | 'done' | 'error';
  linesAdded?: number;
  linesRemoved?: number;
  type?: 'tool' | 'command' | 'file_edit';
  oldContent?: string;
  newContent?: string;
  input?: string;
  output?: string;
  groupId?: string;
};
type ActivityGroup = {
  id: string;
  title: string;
  subtitle: string;
  kind: 'inspection' | 'modification' | 'command' | 'mixed';
  status: 'running' | 'done' | 'error';
  activities: AgentActivity[];
  linesAdded: number;
  linesRemoved: number;
};
type AgentStatusEvent = {
  type: 'status';
  status: string;
  detail?: string;
  state: 'idle' | 'running' | 'waiting' | 'completed' | 'error';
  phase?: 'plan' | 'inspect' | 'build' | 'verify';
};
type TreeNode = { name: string; path: string; type: 'file' | 'directory'; children: TreeNode[] };

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const basename = (path: string) => path.split('/').filter(Boolean).pop() || path;

const agentSystemPrompt = `You are Black-Tonet, an expert autonomous coding agent working inside a browser WebContainer environment.
Your goal is to solve full engineering requests autonomously with minimal round-trips while maintaining strict precision.

OPERATING PRINCIPLES:
1. BATCH AGGRESSIVELY:
   - Group all related operations together into ONE turn.
   - When inspecting: Call read_file for all relevant components, list_directory, or search_folder TOGETHER (up to 8 actions per response).
   - When implementing: Generate write_file for all required components, styles, configurations, and helpers TOGETHER.
   - When verifying: Run commands and inspect output TOGETHER.
2. MINIMIZE ROUND-TRIPS:
   - Aim to complete standard tasks in 2 to 4 turns total:
     * Turn 1: Inspect project structure + read all related files at once.
     * Turn 2: Apply all file edits & creations in batch.
     * Turn 3: Run verification commands / checks.
     * Final turn: Return empty actions array with comprehensive summary.
3. OUTPUT FORMAT:
   - Always respond with ONLY valid JSON (no markdown wrappers, no reasoning before or after JSON):
{"message":"Concise description of this phase","actions":[{"tool":"read_file","args":{"filePath":"/src/App.tsx"}},{"tool":"read_file","args":{"filePath":"/src/index.css"}}]}

AVAILABLE TOOLS:
- list_directory {"path":"/src"}
- read_file {"filePath":"/src/App.tsx"}
- write_file {"filePath":"/src/components/Header.tsx","content":"..."}
- search_folder {"query":"handleLogin","directory":"/src"}
- run_command {"command":"npm","args":["run","build"]}

COMPLETION:
When all work is finished, return {"message":"Clear markdown summary of all work","actions":[]}
The final message must clearly detail:
- Summary of what was accomplished
- Files and components modified/created
- What was verified
- Any notes or next steps for the user.`;

const parseAgentResponse = (raw: string): { message: string; actions: AgentAction[] } | null => {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    const supportedTools = new Set<AgentAction['tool']>(['list_directory', 'read_file', 'write_file', 'search_folder', 'run_command']);
    const actions = Array.isArray(parsed?.actions)
      ? parsed.actions.flatMap((candidate: unknown) => {
          if (!candidate || typeof candidate !== 'object') return [];
          const value = candidate as { tool?: unknown; args?: unknown };
          if (typeof value.tool !== 'string' || !supportedTools.has(value.tool as AgentAction['tool'])) return [];
          const args = value.args && typeof value.args === 'object' && !Array.isArray(value.args)
            ? value.args as Record<string, unknown>
            : {};
          return [{ tool: value.tool as AgentAction['tool'], args }];
        })
      : [];
    return { message: typeof parsed?.message === 'string' ? parsed.message : '', actions };
  } catch { return null; }
};

const buildTree = (paths: string[]): TreeNode[] => {
  const root: TreeNode = { name: '', path: '', type: 'directory', children: [] };
  for (const rawPath of paths) {
    const parts = rawPath.split('/').filter(Boolean);
    let cursor = root;
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      let child = cursor.children.find((item) => item.name === part);
      if (!child) {
        child = { name: part, path: `/${parts.slice(0, index + 1).join('/')}`, type: isFile ? 'file' : 'directory', children: [] };
        cursor.children.push(child);
      }
      cursor = child;
    });
  }
  const sort = (nodes: TreeNode[]): TreeNode[] => nodes
    .sort((a, b) => a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'directory' ? -1 : 1)
    .map((node) => ({ ...node, children: sort(node.children) }));
  return sort(root.children);
};

const languageForPath = (path: string) => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  return ({ tsx: 'tsx', jsx: 'jsx', ts: 'typescript', js: 'javascript', mjs: 'javascript', cjs: 'javascript', html: 'html', htm: 'html', css: 'css', scss: 'scss', json: 'json', md: 'markdown', py: 'python', php: 'php', java: 'java', cs: 'csharp', cpp: 'cpp', c: 'c', xml: 'xml', yaml: 'yaml', yml: 'yaml' } as Record<string, string>)[ext] || 'text';
};

const editorLanguageForPath = (path: string) => {
  const language = languageForPath(path);
  if (language === 'tsx') return 'typescript';
  if (language === 'jsx') return 'javascript';
  if (language === 'text') return 'plaintext';
  return language;
};

const configureCodeAgentEditor = (monaco: any) => {
  monaco.editor.defineTheme('black-tonet-editor', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#ffffff',
      'editorLineNumber.foreground': '#ffffff',
      'editorLineNumber.activeForeground': '#ffffff',
      'editorLineNumber.dimmedForeground': '#ffffff',
      'editorGutter.background': '#1e1e1e',
      'editorIndentGuide.background1': '#505050',
      'editorIndentGuide.activeBackground1': '#8a8a8a',
      'editorBracketPairGuide.background1': '#505050',
      'editorBracketPairGuide.activeBackground1': '#9a9a9a',
    },
  });
};

const FileTypeIcon: React.FC<{ path: string; large?: boolean }> = ({ path, large = false }) => {
  const ext = path.split('.').pop()?.toLowerCase() || '';
  const box = large ? 'h-5 w-5' : 'h-4 w-4';
  const imageClass = `${box} shrink-0 object-contain`;
  if (['tsx', 'jsx'].includes(ext)) return <img src="https://img.icons8.com/color/48/react-native.png" alt="React" className={imageClass} draggable={false} />;
  if (ext === 'ts') return <img src="https://img.icons8.com/fluency/48/typescript--v2.png" alt="TypeScript" className={imageClass} draggable={false} />;
  if (['js', 'mjs', 'cjs'].includes(ext)) return <span className={`${box} flex shrink-0 items-center justify-center rounded-[2px] bg-yellow-400 text-[8px] font-black text-black`}>JS</span>;
  if (['html', 'htm'].includes(ext)) return <img src="https://img.icons8.com/fluency/48/source-code.png" alt="HTML" className={imageClass} draggable={false} />;
  if (['css', 'scss'].includes(ext)) return <img src="https://img.icons8.com/fluency/48/css3.png" alt="CSS" className={imageClass} draggable={false} />;
  if (ext === 'json') return <span aria-label="JSON" title="JSON" className={`${box} shrink-0 bg-yellow-400`} style={{ WebkitMask: 'url(https://cdn-icons-png.flaticon.com/512/6577/6577207.png) center / contain no-repeat', mask: 'url(https://cdn-icons-png.flaticon.com/512/6577/6577207.png) center / contain no-repeat' }} />;
  if (ext === 'md') return <span className={`${box} flex shrink-0 items-center justify-center rounded-[2px] bg-sky-600 text-[8px] font-black text-white`}>M</span>;
  return <FileCode2 className="shrink-0 text-slate-500" size={large ? 16 : 14} />;
};

const activityCopy = (tool: AgentAction['tool'], args: Record<string, unknown> = {}) => {
  if (tool === 'read_file') return { label: `Reading ${basename(String(args.filePath || 'file'))}`, detail: String(args.filePath || '') };
  if (tool === 'write_file') return { label: `Editing ${basename(String(args.filePath || 'file'))}`, detail: String(args.filePath || '') };
  if (tool === 'list_directory') return { label: `Listing ${String(args.path || '/')}`, detail: 'Inspecting folder structure' };
  if (tool === 'search_folder') return { label: `Searching “${String(args.query || '')}”`, detail: String(args.directory || '/') };
  return { label: 'Running command', detail: `$ ${String(args.command || 'command')} ${Array.isArray(args.args) ? args.args.join(' ') : ''}`.trim() };
};

const completedActivityLabel = (tool: AgentAction['tool'], args: Record<string, unknown>) => {
  if (tool === 'read_file') return `Read ${basename(String(args.filePath || 'file'))}`;
  if (tool === 'write_file') return `Updated ${basename(String(args.filePath || 'file'))}`;
  if (tool === 'list_directory') return `Listed ${String(args.path || '/')}`;
  if (tool === 'search_folder') return `Searched for “${String(args.query || '')}”`;
  return `Ran $ ${String(args.command || 'cmd')}`;
};

const activityInput = (action: AgentAction) => {
  if (action.tool === 'run_command') return `$ ${String(action.args.command || '')} ${Array.isArray(action.args.args) ? action.args.args.join(' ') : ''}`.trim();
  if (action.tool === 'write_file') return `write_file(${JSON.stringify(String(action.args.filePath || ''))})`;
  return `${action.tool}(${JSON.stringify(action.args)})`;
};

const activityType = (tool: AgentAction['tool']): NonNullable<AgentActivity['type']> => tool === 'write_file' ? 'file_edit' : tool === 'run_command' ? 'command' : 'tool';

const activityOutput = (result: any) => {
  if (typeof result?.data?.output === 'string') return result.data.output.slice(0, 20000);
  if (typeof result?.data?.content === 'string') return result.data.content.slice(0, 12000);
  return JSON.stringify(result?.data ?? result?.error ?? {}, null, 2).slice(0, 12000);
};

const DiffViewer: React.FC<{ oldContent: string; newContent: string }> = ({ oldContent, newContent }) => {
  let oldLine = 1;
  let newLine = 1;
  const rows: Array<{ key: string; kind: 'same' | 'added' | 'removed'; oldNo: number | null; newNo: number | null; text: string }> = [];
  diffLines(oldContent, newContent).forEach((change, chunkIndex) => {
    change.value.replace(/\n$/, '').split('\n').forEach((text, lineIndex) => {
      const kind = change.added ? 'added' : change.removed ? 'removed' : 'same';
      rows.push({ key: `${chunkIndex}-${lineIndex}`, kind, oldNo: kind === 'added' ? null : oldLine++, newNo: kind === 'removed' ? null : newLine++, text });
    });
  });
  const changed = rows.map((row, index) => row.kind !== 'same' ? index : -1).filter((index) => index >= 0);
  const first = changed[0] ?? 0;
  const last = changed[changed.length - 1] ?? Math.min(rows.length - 1, 24);
  return <div className="max-h-72 overflow-auto border-t border-white/[0.07] bg-[#0c0e12] font-mono text-[11px] leading-5">
    {rows.slice(Math.max(0, first - 3), Math.min(rows.length, last + 4)).map((row) => <div key={row.key} className={`grid grid-cols-[34px_34px_18px_minmax(0,1fr)] ${row.kind === 'added' ? 'bg-emerald-500/15' : row.kind === 'removed' ? 'bg-rose-500/15' : ''}`}>
      <span className="border-r border-white/5 pr-2 text-right text-slate-600">{row.oldNo ?? ''}</span><span className="border-r border-white/5 pr-2 text-right text-slate-600">{row.newNo ?? ''}</span>
      <span className={row.kind === 'added' ? 'text-emerald-400' : row.kind === 'removed' ? 'text-rose-400' : 'text-slate-700'}>{row.kind === 'added' ? '+' : row.kind === 'removed' ? '-' : ' '}</span><span className="whitespace-pre px-2 text-slate-300">{row.text || ' '}</span>
    </div>)}
  </div>;
};

/**
 * Animated dynamic working status bar with shimmer loading and phase indicators.
 * Works completely independently without consuming API tokens.
 */
const AgentWorkingStatus: React.FC<{
  status: string;
  detail?: string;
  state: AgentStatusEvent['state'];
  phase?: AgentStatusEvent['phase'];
}> = ({ status, detail, state, phase = 'plan' }) => {
  const isWaiting = state === 'waiting';
  const isError = state === 'error';

  const phases = [
    { id: 'plan', label: 'Plan' },
    { id: 'inspect', label: 'Inspect' },
    { id: 'build', label: 'Build' },
    { id: 'verify', label: 'Verify' },
  ];

  const currentPhaseIndex = phases.findIndex((p) => p.id === phase);

  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1b1e] p-3.5 text-white shadow-lg">
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold">
          {isWaiting ? (
            <Clock size={14} className="animate-spin text-amber-400" />
          ) : isError ? (
            <X size={14} className="text-rose-400" />
          ) : (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </span>
          )}
          <span className={isWaiting ? 'text-amber-400' : isError ? 'text-rose-400' : 'text-orange-400'}>
            {isWaiting ? 'Queued / Rate Limit' : isError ? 'Interrupted' : 'Black-Tonet Active'}
          </span>
        </div>

        {/* Dynamic phase indicators */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {phases.map((p, idx) => {
            const isCurrent = idx === currentPhaseIndex;
            const isDone = idx < currentPhaseIndex;
            return (
              <span
                key={p.id}
                className={`rounded px-1.5 py-0.5 font-medium transition ${
                  isCurrent
                    ? 'bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/40'
                    : isDone
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-white/[0.04] text-slate-500'
                }`}
              >
                {isDone ? '✓ ' : ''}{p.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Shimmer skeleton progress bar */}
      <div className="relative mb-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
        <span className="absolute inset-y-0 w-full animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-orange-400/90 to-transparent" />
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <Sparkles size={14} className="shrink-0 text-orange-400 animate-pulse" />
          <span className="truncate">{status}</span>
        </div>
        {detail && <div className="ml-5 text-xs text-slate-400 truncate">{detail}</div>}
      </div>
    </div>
  );
};

/**
 * Compact expandable activity panel with intelligent action grouping.
 * Automatically keeps current active action expanded and previous completed actions collapsed.
 */
const AgentActivityPanel: React.FC<{
  activities: AgentActivity[];
  open: boolean;
  expandedGroups: Set<string>;
  expandedItems: Set<string>;
  onToggleOpen: () => void;
  onToggleGroup: (id: string) => void;
  onToggleItem: (id: string) => void;
}> = ({ activities, open, expandedGroups, expandedItems, onToggleOpen, onToggleGroup, onToggleItem }) => {
  if (!activities.length) return null;

  // Group activities intelligently by batch / intent
  const groups: ActivityGroup[] = useMemo(() => {
    const list: ActivityGroup[] = [];

    activities.forEach((act) => {
      const lastGroup = list[list.length - 1];
      const sameGroupId = act.groupId && lastGroup && lastGroup.id === act.groupId;

      if (sameGroupId) {
        lastGroup.activities.push(act);
        if (act.linesAdded) lastGroup.linesAdded += act.linesAdded;
        if (act.linesRemoved) lastGroup.linesRemoved += act.linesRemoved;
        if (act.status === 'running') lastGroup.status = 'running';
        else if (act.status === 'error' && lastGroup.status !== 'running') lastGroup.status = 'error';
      } else {
        const kind: ActivityGroup['kind'] =
          act.tool === 'write_file' ? 'modification' :
          act.tool === 'run_command' ? 'command' :
          ['read_file', 'list_directory', 'search_folder'].includes(act.tool) ? 'inspection' : 'mixed';

        const title =
          kind === 'inspection' ? (act.tool === 'read_file' ? `Read ${basename(act.detail)}` : act.label) :
          kind === 'modification' ? `Edited ${basename(act.detail)}` :
          kind === 'command' ? act.label : act.label;

        list.push({
          id: act.groupId || act.id,
          title,
          subtitle: act.detail,
          kind,
          status: act.status,
          activities: [act],
          linesAdded: act.linesAdded || 0,
          linesRemoved: act.linesRemoved || 0,
        });
      }
    });

    // Update group titles if batched
    list.forEach((grp) => {
      if (grp.activities.length > 1) {
        if (grp.kind === 'inspection') {
          const fileCount = grp.activities.filter((a) => a.tool === 'read_file').length;
          grp.title = fileCount > 0 ? `Inspected ${fileCount} file${fileCount > 1 ? 's' : ''}` : `Project inspection (${grp.activities.length} steps)`;
          grp.subtitle = grp.activities.map((a) => basename(a.detail)).slice(0, 3).join(', ') + (grp.activities.length > 3 ? '…' : '');
        } else if (grp.kind === 'modification') {
          grp.title = `Applied edits to ${grp.activities.length} files`;
          grp.subtitle = grp.activities.map((a) => basename(a.detail)).join(', ');
        }
      }
    });

    return list;
  }, [activities]);

  const running = activities.some((item) => item.status === 'running');
  const failures = activities.filter((item) => item.status === 'error').length;
  const changes = activities.reduce((total, item) => ({ added: total.added + (item.linesAdded || 0), removed: total.removed + (item.linesRemoved || 0) }), { added: 0, removed: 0 });

  return (
    <section className="mb-4 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1a1b1e] shadow-sm">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-xs font-semibold text-white hover:bg-white/[0.04]"
      >
        {running ? (
          <Loader2 size={15} className="animate-spin text-orange-400" />
        ) : failures ? (
          <X size={15} className="text-rose-400" />
        ) : (
          <Check size={15} className="text-emerald-400" />
        )}
        <span className="min-w-0 flex-1">
          <span className="block">{running ? 'Live Agent Actions' : failures ? 'Completed with issues' : 'All Actions Completed'}</span>
          <span className="block font-normal text-[11px] text-[#9ca3af]">
            {activities.length} action{activities.length === 1 ? '' : 's'} across {groups.length} batch{groups.length === 1 ? '' : 'es'}
            {changes.added || changes.removed ? ` · +${changes.added} −${changes.removed}` : ''}
          </span>
        </span>
        {open ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
      </button>

      {open && (
        <div className="border-t border-white/[0.06] divide-y divide-white/[0.04]">
          {groups.map((group) => {
            const isGroupExpanded = expandedGroups.has(group.id);

            return (
              <div key={group.id} className="bg-[#141517]">
                {/* Group Header */}
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.id)}
                  className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-xs text-white hover:bg-white/[0.035]"
                >
                  {group.status === 'running' ? (
                    <Loader2 size={13} className="animate-spin text-orange-400 shrink-0" />
                  ) : group.status === 'done' ? (
                    <Check size={13} className="text-emerald-400 shrink-0" />
                  ) : (
                    <X size={13} className="text-rose-400 shrink-0" />
                  )}

                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-[12px]">{group.title}</span>
                    <span className="block truncate text-[10px] text-slate-400">{group.subtitle}</span>
                  </div>

                  {(group.linesAdded || group.linesRemoved) ? (
                    <span className="shrink-0 font-mono text-[10px] mr-1">
                      <span className="text-emerald-400">+{group.linesAdded}</span> <span className="text-rose-400">-{group.linesRemoved}</span>
                    </span>
                  ) : null}

                  {isGroupExpanded ? <ChevronDown size={12} className="text-slate-500" /> : <ChevronRight size={12} className="text-slate-500" />}
                </button>

                {/* Group Body: List of Items inside this batch */}
                {isGroupExpanded && (
                  <div className="bg-[#0f1012] border-t border-white/[0.04] pl-2">
                    {group.activities.map((act) => {
                      const isItemExpanded = expandedItems.has(act.id);
                      const hasDetails = Boolean(act.input || act.output || act.oldContent !== undefined);

                      return (
                        <div key={act.id} className="border-b border-white/[0.03] last:border-0">
                          <button
                            type="button"
                            disabled={!hasDetails}
                            onClick={() => onToggleItem(act.id)}
                            className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-[11px] text-slate-300 hover:bg-white/[0.02] disabled:cursor-default"
                          >
                            <span className="w-4 shrink-0 flex justify-center">
                              {act.status === 'running' ? (
                                <Loader2 size={11} className="animate-spin text-orange-400" />
                              ) : act.status === 'done' ? (
                                <Check size={11} className="text-emerald-400" />
                              ) : (
                                <X size={11} className="text-rose-400" />
                              )}
                            </span>

                            <FileTypeIcon path={act.detail} />
                            <span className="truncate flex-1 font-mono text-[11px]">{act.label}</span>

                            {(act.linesAdded || act.linesRemoved) ? (
                              <span className="font-mono text-[10px]">
                                <span className="text-emerald-400">+{act.linesAdded}</span> <span className="text-rose-400">-{act.linesRemoved}</span>
                              </span>
                            ) : null}

                            {hasDetails && (
                              <span className="text-[10px] text-slate-500">
                                {isItemExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                              </span>
                            )}
                          </button>

                          {/* Item Expansion: Diff or Output Drawer */}
                          {isItemExpanded && hasDetails && (
                            <div className="border-t border-white/[0.04] bg-[#090a0c] p-2.5 text-[11px]">
                              {act.tool === 'write_file' && act.oldContent !== undefined ? (
                                <div>
                                  <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                                    <span className="font-mono">{act.detail}</span>
                                    <span className="text-emerald-400 font-mono">+{act.linesAdded || 0} / -{act.linesRemoved || 0}</span>
                                  </div>
                                  <DiffViewer oldContent={act.oldContent || ''} newContent={act.newContent || ''} />
                                </div>
                              ) : (
                                <div>
                                  {act.input && (
                                    <div className="mb-2">
                                      <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Input</div>
                                      <pre className="overflow-x-auto rounded bg-black/40 p-2 font-mono text-[10px] text-slate-300 whitespace-pre-wrap">{act.input}</pre>
                                    </div>
                                  )}
                                  {act.output && (
                                    <div>
                                      <div className="mb-1 text-[9px] uppercase tracking-wider text-slate-500 font-semibold">Result Output</div>
                                      <pre className={`max-h-56 overflow-y-auto rounded bg-black/40 p-2 font-mono text-[10px] whitespace-pre-wrap ${act.status === 'error' ? 'text-rose-300' : 'text-slate-300'}`}>{act.output}</pre>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export const CodeAgentWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const selectedFileRef = useRef<string | null>(null);
  const liveDraftsRef = useRef<Record<string, string>>({});
  const manualSaveTimerRef = useRef<number | null>(null);
  const agentScrollRef = useRef<HTMLDivElement>(null);
  const [project, setProject] = useState<{ id: string; name: string; fileCount: number } | null>(null);
  const [cachedProjects, setCachedProjects] = useState<CachedCodeAgentProject[]>([]);
  const [cachedFiles, setCachedFiles] = useState<Record<string, string>>({});
  const [filePaths, setFilePaths] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['/src', '/public']));
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewKey, setPreviewKey] = useState(0);
  const [editorMode, setEditorMode] = useState<'code' | 'preview'>('code');
  const [explorerOpen, setExplorerOpen] = useState(true);
  const [agentOpen, setAgentOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [status, setStatus] = useState('Ready');
  const [agentStatusEvent, setAgentStatusEvent] = useState<AgentStatusEvent>({ type: 'status', status: 'Ready', state: 'idle', phase: 'plan' });
  const [prompt, setPrompt] = useState('');
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('Untitled Project');
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: makeId(), role: 'assistant', text: '👋 Hi! I am Black-Tonet, your autonomous engineering agent.\nDrop a project folder or start a new workspace to begin.' }
  ]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activitiesOpen, setActivitiesOpen] = useState(true);

  const tree = useMemo(() => buildTree(filePaths), [filePaths]);
  const trailingAgentMessage = !isAgentRunning && messages[messages.length - 1]?.role === 'assistant' ? messages[messages.length - 1] : null;
  const timelineMessages = trailingAgentMessage ? messages.slice(0, -1) : messages;

  const addMessage = (role: Message['role'], text: string) => setMessages((current) => [...current, { id: makeId(), role, text }]);

  const updateActivity = (activityId: string, update: Partial<AgentActivity>) => {
    setActivities((current) => current.map((item) => item.id === activityId ? { ...item, ...update } : item));
  };

  const updateWorkingStatus = (
    nextStatus: string,
    state: AgentStatusEvent['state'] = 'running',
    phase?: AgentStatusEvent['phase'],
    detail?: string
  ) => {
    setStatus(nextStatus);
    setAgentStatusEvent({ type: 'status', status: nextStatus, detail, state, phase });
  };

  useEffect(() => {
    listCachedCodeAgentProjects().then(setCachedProjects).catch(() => undefined);
  }, []);

  useEffect(() => {
    agentScrollRef.current?.scrollTo({ top: agentScrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, activities, status, isAgentRunning, activitiesOpen]);

  useEffect(() => {
    if (!project || !Object.keys(cachedFiles).length) return;
    const timer = window.setTimeout(() => {
      const record: CachedCodeAgentProject = {
        ...project,
        updatedAt: Date.now(),
        files: cachedFiles,
        openTabs,
        selectedFile,
        messages,
        activities,
      };
      saveCachedCodeAgentProject(record)
        .then(() => setCachedProjects((current) => [record, ...current.filter((item) => item.id !== record.id)]))
        .catch(() => undefined);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [project, cachedFiles, openTabs, selectedFile, messages, activities]);

  const refreshPreview = async (serverUrl?: string) => {
    if (serverUrl || previewUrl) {
      if (serverUrl) setPreviewUrl(serverUrl);
      setPreviewKey((value) => value + 1);
      return;
    }
    for (const filePath of ['/index.html', '/public/index.html']) {
      const result = await executeAiToolCall('read_file', { filePath });
      if (result.success && typeof result.data?.content === 'string') {
        setPreviewHtml(result.data.content);
        setPreviewKey((value) => value + 1);
        return;
      }
    }
  };

  const openFile = async (filePath: string) => {
    selectedFileRef.current = filePath;
    setSelectedFile(filePath);
    setOpenTabs((current) => current.includes(filePath) ? current : [...current, filePath]);
    setEditorMode('code');
    if (liveDraftsRef.current[filePath] !== undefined) {
      setSelectedContent(liveDraftsRef.current[filePath]);
      return;
    }
    const result = await executeAiToolCall('read_file', { filePath });
    if (selectedFileRef.current === filePath) setSelectedContent(result.success ? String(result.data?.content || '') : String(result.error || 'Unable to read file.'));
  };

  const editSelectedFile = (content: string) => {
    const filePath = selectedFileRef.current;
    if (!filePath) return;
    setSelectedContent(content);
    setCachedFiles((current) => ({ ...current, [filePath]: content }));
    setStatus(`Editing ${basename(filePath)}`);
    if (manualSaveTimerRef.current !== null) window.clearTimeout(manualSaveTimerRef.current);
    manualSaveTimerRef.current = window.setTimeout(async () => {
      const result = await executeAiToolCall('write_file', { filePath, content });
      if (result.success) {
        setStatus(`Saved ${basename(filePath)}`);
        void refreshPreview();
      } else {
        setStatus(`Could not save ${basename(filePath)}`);
      }
    }, 450);
  };

  useEffect(() => () => {
    if (manualSaveTimerRef.current !== null) window.clearTimeout(manualSaveTimerRef.current);
  }, []);

  const animateCodeWrite = async (filePath: string, oldContent: string, newContent: string, activityId: string) => {
    selectedFileRef.current = filePath;
    setSelectedFile(filePath);
    setOpenTabs((current) => current.includes(filePath) ? current : [...current, filePath]);
    setEditorMode('code');
    liveDraftsRef.current[filePath] = oldContent;
    setSelectedContent(oldContent);
    const chunkSize = Math.max(1, Math.ceil(newContent.length / 75));
    let step = 0;
    for (let end = chunkSize; end < newContent.length; end += chunkSize) {
      const partial = newContent.slice(0, end);
      liveDraftsRef.current[filePath] = partial;
      if (selectedFileRef.current === filePath) setSelectedContent(partial);
      if (step++ % 3 === 0) {
        let linesAdded = 0;
        let linesRemoved = 0;
        diffLines(oldContent, partial).forEach((change) => {
          const lineCount = change.value ? change.value.replace(/\n$/, '').split('\n').length : 0;
          if (change.added) linesAdded += lineCount;
          if (change.removed) linesRemoved += lineCount;
        });
        updateActivity(activityId, { linesAdded, linesRemoved });
      }
      await new Promise((resolve) => window.setTimeout(resolve, 8));
    }
    liveDraftsRef.current[filePath] = newContent;
    if (selectedFileRef.current === filePath) setSelectedContent(newContent);
  };

  const closeTab = (filePath: string) => {
    setOpenTabs((current) => {
      const next = current.filter((path) => path !== filePath);
      if (selectedFile === filePath) {
        const replacement = next[next.length - 1] || null;
        selectedFileRef.current = replacement;
        setSelectedFile(replacement);
        if (replacement) void openFile(replacement);
        else setSelectedContent('');
      }
      return next;
    });
  };

  /**
   * Main Autonomous Coding Agent Execution Loop
   * Batches tool operations, stays safely below 15 RPM, handles rate limiting smoothly,
   * and renders live status simulations without consuming excess API calls.
   */
  const runAgent = async (task: string, projectName = project?.name) => {
    const request = task.trim();
    if (!request || !projectName || isAgentRunning) return;

    setIsAgentRunning(true);
    setAgentOpen(true);
    setActivitiesOpen(true);
    addMessage('user', request);
    setPrompt('');
    updateWorkingStatus('Understanding your request…', 'running', 'plan', 'Analyzing goal and scoping changes');

    const conversation: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: agentSystemPrompt },
      { role: 'user', content: `Project: ${projectName}\nTask: ${request}\nWorkspace files:\n${filePaths.slice(0, 50).join('\n')}` },
    ];

    const editedFiles = new Set<string>();
    const errors: string[] = [];
    let finalResponse = '';

    // Handle rate-limiter waiting events smoothly in the UI
    const handleRateLimitWait = (info: RateLimitWaitInfo) => {
      if (info.state === 'waiting_slot' || info.state === 'queued') {
        updateWorkingStatus(
          `Waiting for API availability…`,
          'waiting',
          undefined,
          `Rate limit protection active (safe 13 RPM limit) · Continuing in ${info.waitSeconds}s`
        );
      } else if (info.state === 'retrying') {
        updateWorkingStatus(
          `Retrying shortly…`,
          'waiting',
          undefined,
          `Rate limit backoff · Retrying in ${info.waitSeconds}s`
        );
      }
    };

    try {
      let invalidResponses = 0;
      const maxRounds = 6;

      for (let round = 0; round < maxRounds; round++) {
        const currentPhase: AgentStatusEvent['phase'] =
          round === 0 ? 'inspect' :
          round === 1 ? 'build' : 'verify';

        const phaseStatus =
          round === 0 ? 'Inspecting project structure…' :
          round === 1 ? 'Applying changes to components…' :
          'Verifying results and preview…';

        updateWorkingStatus(phaseStatus, 'running', currentPhase, `Turn ${round + 1} of ${maxRounds}`);

        // Call Gemini API through the rate limiter queue
        const raw = await requestGeminiCompletion({
          messages: conversation,
          maxTokens: 12000,
          temperature: 0.2,
          onWait: handleRateLimitWait,
        });

        const decision = parseAgentResponse(raw);

        if (!decision) {
          invalidResponses += 1;
          if (invalidResponses >= 2) {
            errors.push('The generated edit response was incomplete or invalid JSON.');
            break;
          }
          updateWorkingStatus('Repairing response format…', 'running', currentPhase, 'Requesting valid JSON payload');
          conversation.push({ role: 'assistant', content: raw });
          conversation.push({
            role: 'user',
            content: 'Your response was not valid JSON. Return ONLY valid JSON with {"message":"...","actions":[...]} and no markdown wrapping.',
          });
          continue;
        }

        invalidResponses = 0;

        // If no actions returned, the agent is done!
        if (!decision.actions.length) {
          finalResponse = decision.message;
          break;
        }

        // Add assistant response to history
        conversation.push({ role: 'assistant', content: raw });

        const batchGroupId = makeId();
        setExpandedGroups(new Set([batchGroupId]));

        // Separate actions into reads/searches (can be parallelized) and writes (sequenced)
        const readActions = decision.actions.filter((a) => ['read_file', 'list_directory', 'search_folder'].includes(a.tool));
        const writeActions = decision.actions.filter((a) => a.tool === 'write_file');
        const commandActions = decision.actions.filter((a) => a.tool === 'run_command');

        const results: Array<{ tool: string; result: unknown }> = [];

        // 1. Process Batched Reads & Inspections
        if (readActions.length > 0) {
          updateWorkingStatus(
            readActions.length === 1 ? `Inspecting ${basename(String(readActions[0].args.filePath || ''))}` : `Inspecting ${readActions.length} files in parallel…`,
            'running',
            'inspect',
            `Batch inspection of ${readActions.length} items`
          );

          const readActivities = readActions.map((action) => {
            const copy = activityCopy(action.tool, action.args);
            const actId = makeId();
            return {
              id: actId,
              groupId: batchGroupId,
              type: activityType(action.tool),
              tool: action.tool,
              ...copy,
              status: 'running' as const,
              input: activityInput(action),
              action,
            };
          });

          setActivities((current) => [...current, ...readActivities.map(({ action, ...rest }) => rest)]);

          // Execute read tools concurrently for high speed
          const readResults = await Promise.all(
            readActivities.map(async (item) => {
              const res = await executeAiToolCall(item.tool, item.action.args);
              if (res.success) {
                updateActivity(item.id, {
                  status: 'done',
                  label: completedActivityLabel(item.tool, item.action.args),
                  output: activityOutput(res),
                });
              } else {
                updateActivity(item.id, {
                  status: 'error',
                  detail: String(res.error || 'Read failed'),
                  output: String(res.error || 'Read failed'),
                });
              }
              return { tool: item.tool, result: res };
            })
          );

          results.push(...readResults);
        }

        // 2. Process Batched File Writes
        if (writeActions.length > 0) {
          updateWorkingStatus('Applying code modifications…', 'running', 'build', `Updating ${writeActions.length} files`);

          for (const action of writeActions) {
            const filePath = String(action.args.filePath || 'file');
            const copy = activityCopy(action.tool, action.args);
            const actId = makeId();

            setActivities((current) => [
              ...current,
              {
                id: actId,
                groupId: batchGroupId,
                type: 'file_edit',
                tool: action.tool,
                ...copy,
                status: 'running',
                input: activityInput(action),
              },
            ]);

            setExpandedItems(new Set([actId]));
            updateWorkingStatus(`Writing ${basename(filePath)}…`, 'running', 'build');

            let oldContent = '';
            const previous = await executeAiToolCall('read_file', { filePath });
            if (previous.success) oldContent = String(previous.data?.content || '');

            const newContent = String(action.args.content || '');
            await animateCodeWrite(filePath, oldContent, newContent, actId);

            const writeRes = await executeAiToolCall(action.tool, action.args);
            results.push({ tool: action.tool, result: writeRes });

            if (!writeRes.success) {
              delete liveDraftsRef.current[filePath];
              if (selectedFileRef.current === filePath) setSelectedContent(oldContent);
              const errText = String(writeRes.error || 'Write failed');
              errors.push(errText);
              updateActivity(actId, { status: 'error', detail: errText, output: errText });
            } else {
              editedFiles.add(filePath);
              delete liveDraftsRef.current[filePath];
              const linesAdded = Number(writeRes.data?.diff?.linesAdded || 0);
              const linesRemoved = Number(writeRes.data?.diff?.linesRemoved || 0);

              updateActivity(actId, {
                status: 'done',
                label: completedActivityLabel(action.tool, action.args),
                oldContent,
                newContent,
                output: String(writeRes.data?.message || 'Changes saved.'),
                linesAdded,
                linesRemoved,
              });

              setFilePaths((current) => current.includes(filePath) ? current : [...current, filePath].sort());
              setCachedFiles((current) => ({ ...current, [filePath]: newContent }));
              if (selectedFileRef.current === filePath) setSelectedContent(newContent);
            }
          }
        }

        // 3. Process Batched Commands
        if (commandActions.length > 0) {
          updateWorkingStatus('Running verification commands…', 'running', 'verify', `Executing ${commandActions.length} commands`);

          for (const action of commandActions) {
            const copy = activityCopy(action.tool, action.args);
            const actId = makeId();

            setActivities((current) => [
              ...current,
              {
                id: actId,
                groupId: batchGroupId,
                type: 'command',
                tool: action.tool,
                ...copy,
                status: 'running',
                input: activityInput(action),
              },
            ]);

            const cmdRes = await executeAiToolCall(action.tool, action.args);
            results.push({ tool: action.tool, result: cmdRes });

            if (!cmdRes.success) {
              const errText = String(cmdRes.error || cmdRes.data?.output || 'Command failed');
              errors.push(errText);
              updateActivity(actId, {
                status: 'error',
                detail: `Exit code ${cmdRes.data?.exitCode ?? 1}`,
                output: errText,
              });
            } else {
              updateActivity(actId, {
                status: 'done',
                label: completedActivityLabel(action.tool, action.args),
                output: activityOutput(cmdRes),
              });
            }
          }
        }

        // Send all batched tool execution outputs back in ONE follow-up turn
        conversation.push({
          role: 'user',
          content: `Batched tool results (${results.length} actions):\n${JSON.stringify(results).slice(0, 24000)}\nAnalyze results and proceed with remaining work or provide final completion summary.`,
        });
      }

      // Final Verification & UI Polish
      updateWorkingStatus('Finalizing & refreshing preview…', 'running', 'verify');
      await refreshPreview();
      if (selectedFileRef.current) await openFile(selectedFileRef.current);

      const changedFileList = [...editedFiles];
      const changedSummary = changedFileList.length
        ? `\n\n### 📝 Modified Files (${changedFileList.length})\n` + changedFileList.map((f) => `• \`${f}\``).join('\n')
        : '';

      const verificationSummary = `\n\n### ✅ Verification\n• Local WebContainer files synchronized\n• Browser live preview refreshed`;

      if (errors.length) {
        addMessage(
          'assistant',
          `### ⚠️ Completed with an issue\n\n${finalResponse || 'The requested operations were executed, but one or more steps encountered errors.'}${changedSummary}\n\n### ❌ Issues\n• ${errors[0]}${verificationSummary}`
        );
        updateWorkingStatus('Completed with issues', 'error', 'verify');
      } else {
        addMessage(
          'assistant',
          `### ✨ Task Complete\n\n${finalResponse || 'All requested changes were applied and verified successfully.'}${changedSummary}${verificationSummary}`
        );
        updateWorkingStatus('Task completed successfully', 'completed', 'verify');
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : 'The task failed.';
      addMessage('assistant', `### ⚠️ Task Stopped\n\nI was unable to complete the task.\n\n**Details:**\n• ${errorText}`);
      updateWorkingStatus('Agent stopped', 'error');
    } finally {
      setIsAgentRunning(false);
      setActivitiesOpen(false); // Automatically collapse activities for a clean view on finish
    }
  };

  const mountProject = async (
    projectTree: FileSystemTree,
    name: string,
    fileCount: number,
    restored?: CachedCodeAgentProject,
  ) => {
    setIsImporting(true);
    setImportProgress((current) => Math.max(current, 28));
    setStatus(`Mounting ${name}`);
    setActivities([]);
    const flattened = flattenFileSystemTree(projectTree);
    const paths = Object.keys(flattened).sort();

    try {
      const url = await mountFolderIntoWebContainer(projectTree, name, (nextStatus) => {
        setStatus(nextStatus);
        const normalized = nextStatus.toLowerCase();
        if (normalized.includes('mounting')) setImportProgress(35);
        else if (normalized.includes('installing')) setImportProgress(58);
        else if (normalized.includes('starting')) setImportProgress(82);
        else if (normalized.includes('live') || normalized.includes('success')) setImportProgress(94);
      });

      const projectId = restored?.id || `${Date.now()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
      setImportProgress(100);
      await new Promise((resolve) => window.setTimeout(resolve, 250));

      setProject({ id: projectId, name, fileCount });
      setFilePaths(paths);
      setCachedFiles(flattened);
      setExpandedFolders(new Set(paths.map((path) => `/${path.split('/').filter(Boolean)[0]}`).filter(Boolean)));

      const firstFile = restored?.selectedFile || paths.find((path) => /(?:^|\/)index\.html$/i.test(path)) || paths.find((path) => /\.(tsx?|jsx?)$/i.test(path)) || paths[0] || null;
      if (firstFile) {
        selectedFileRef.current = firstFile;
        setOpenTabs(restored?.openTabs?.length ? restored.openTabs : [firstFile]);
        setSelectedFile(firstFile);
        setSelectedContent(flattened[firstFile] || '');
      }

      if (restored?.messages?.length) setMessages(restored.messages);
      else addMessage('assistant', `**${name}** is mounted and ready. Tell me what you'd like to build or update.`);

      if (restored?.activities?.length) {
        setActivities(restored.activities.map((item) => item.status === 'running' ? { ...item, status: 'error' as const, detail: `${item.detail} · interrupted` } : item));
      }

      if (url) setPreviewUrl(url);
      else if (flattened['/index.html']) setPreviewHtml(flattened['/index.html']);

      setStatus('Project ready');
    } catch (error) {
      addMessage('assistant', error instanceof Error ? error.message : 'The folder could not be imported.');
      setStatus('Import failed');
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const chooseFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        const handle = await (window as Window & { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }).showDirectoryPicker();
        setIsImporting(true);
        setImportProgress(8);
        setStatus('Reading folder contents');
        const imported = await buildFileSystemTreeFromHandle(handle);
        setImportProgress(24);
        await mountProject(imported.tree, handle.name || 'project', imported.fileCount);
      } catch (error) {
        setIsImporting(false);
        setImportProgress(0);
        if ((error as { name?: string })?.name !== 'AbortError') addMessage('assistant', 'The folder could not be opened.');
      }
    } else {
      folderInputRef.current?.click();
    }
  };

  const handleFolderDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    if (!event.dataTransfer.items?.length || isImporting) return;
    setIsImporting(true);
    setImportProgress(8);
    setStatus('Reading dropped folder');
    const imported = await buildFileSystemTreeFromDataTransfer(event.dataTransfer.items);
    setImportProgress(24);
    if (imported.fileCount) await mountProject(imported.tree, imported.folderName, imported.fileCount);
    else {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  const openCachedProject = async (cached: CachedCodeAgentProject) => {
    if (isImporting) return;
    setIsImporting(true);
    setImportProgress(15);
    setStatus('Restoring cached project');
    await mountProject(fileMapToWebContainerTree(cached.files), cached.name, cached.fileCount, cached);
  };

  const startEmptyProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    setNewProjectOpen(false);
    setIsImporting(true);
    setImportProgress(18);
    setStatus('Creating workspace');
    const safeName = name.replace(/[<>&"']/g, '');
    const packageName = name.toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-|-$/g, '') || 'black-tonet-app';
    const starterTree: FileSystemTree = {
      'package.json': {
        file: {
          contents: JSON.stringify({
            name: packageName,
            private: true,
            version: '0.0.0',
            type: 'module',
            scripts: { dev: 'vite --host 0.0.0.0', build: 'vite build', preview: 'vite preview' },
            dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
            devDependencies: { '@vitejs/plugin-react': '^4.3.1', typescript: '^5.5.4', vite: '^5.4.2' },
          }, null, 2),
        },
      },
      'vite.config.js': {
        file: {
          contents: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()],\n});\n`,
        },
      },
      'index.html': {
        file: {
          contents: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${safeName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n`,
        },
      },
      src: {
        directory: {
          'main.tsx': {
            file: {
              contents: `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\nReactDOM.createRoot(document.getElementById('root')!).render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>,\n);\n`,
            },
          },
          'App.tsx': {
            file: {
              contents: `export default function App() {\n  return (\n    <main className="app">\n      <h1>${safeName}</h1>\n      <p>Your React app is ready. Ask Black-Tonet what you want to build.</p>\n    </main>\n  );\n}\n`,
            },
          },
          'index.css': {
            file: {
              contents: `:root {\n  font-family: Inter, system-ui, sans-serif;\n  color: #f8fafc;\n  background: #0f172a;\n  font-synthesis: none;\n}\n\n* { box-sizing: border-box; }\nbody { margin: 0; min-width: 320px; min-height: 100vh; }\n\n.app {\n  min-height: 100vh;\n  display: grid;\n  place-content: center;\n  padding: 2rem;\n  text-align: center;\n}\n\nh1 { margin: 0 0 0.75rem; font-size: clamp(2rem, 7vw, 4.5rem); }\np { margin: 0; color: #94a3b8; }\n`,
            },
          },
        },
      },
    };
    await mountProject(starterTree, name, 6);
    await openFile('/src/App.tsx');
  };

  const createFile = async () => {
    const requested = window.prompt('File path', 'src/new-file.ts')?.trim();
    if (!requested) return;
    const filePath = `/${requested.replace(/^\/+/, '')}`;
    if (cachedFiles[filePath] !== undefined) {
      window.alert('That file already exists.');
      return;
    }
    const result = await executeAiToolCall('write_file', { filePath, content: '' });
    if (!result.success) {
      window.alert(result.error || 'Could not create the file.');
      return;
    }
    setCachedFiles((current) => ({ ...current, [filePath]: '' }));
    setFilePaths((current) => [...current, filePath].sort());
    setProject((current) => current ? { ...current, fileCount: current.fileCount + 1 } : current);
    setActivities((current) => [...current, { id: makeId(), tool: 'write_file', label: `Created ${basename(filePath)}`, detail: filePath, status: 'done', oldContent: '', newContent: '' }]);
    await openFile(filePath);
  };

  const createFolder = async () => {
    const requested = window.prompt('Folder path', 'src/components')?.trim();
    if (!requested) return;
    const folderPath = `/${requested.replace(/^\/+|\/+$/g, '')}`;
    const placeholder = `${folderPath}/.gitkeep`;
    const result = await executeAiToolCall('write_file', { filePath: placeholder, content: '' });
    if (!result.success) {
      window.alert(result.error || 'Could not create the folder.');
      return;
    }
    setCachedFiles((current) => ({ ...current, [placeholder]: '' }));
    setFilePaths((current) => current.includes(placeholder) ? current : [...current, placeholder].sort());
    setExpandedFolders((current) => new Set(current).add(folderPath));
    setProject((current) => current ? { ...current, fileCount: current.fileCount + 1 } : current);
    setActivities((current) => [...current, { id: makeId(), tool: 'write_file', label: `Created folder ${basename(folderPath)}`, detail: folderPath, status: 'done' }]);
  };

  const removeCachedProject = async (projectId: string) => {
    await deleteCachedCodeAgentProject(projectId);
    setCachedProjects((current) => current.filter((item) => item.id !== projectId));
  };

  const closeProject = () => {
    if (project && Object.keys(cachedFiles).length) {
      const record: CachedCodeAgentProject = {
        ...project,
        updatedAt: Date.now(),
        files: cachedFiles,
        openTabs,
        selectedFile,
        messages,
        activities,
      };
      void saveCachedCodeAgentProject(record);
      setCachedProjects((current) => [record, ...current.filter((item) => item.id !== record.id)]);
    }
    setProject(null);
    setFilePaths([]);
    setCachedFiles({});
    setOpenTabs([]);
    selectedFileRef.current = null;
    liveDraftsRef.current = {};
    setSelectedFile(null);
    setSelectedContent('');
    setPreviewUrl('');
    setPreviewHtml('');
    setActivities([]);
    setMessages([{ id: makeId(), role: 'assistant', text: '👋 Hi! I am Black-Tonet, your autonomous engineering agent.\nDrop a project folder or start a new workspace to begin.' }]);
  };

  const renderNodes = (nodes: TreeNode[]): React.ReactNode => nodes.map((node) => {
    if (node.type === 'file' && node.name === '.gitkeep') return null;
    const expanded = expandedFolders.has(node.path);
    if (node.type === 'directory') return (
      <React.Fragment key={node.path}>
        <button
          type="button"
          onClick={() => setExpandedFolders((current) => {
            const next = new Set(current);
            if (expanded) next.delete(node.path);
            else next.add(node.path);
            return next;
          })}
          className="flex h-[23px] w-full items-center pl-[7px] text-left text-[12px] text-[#cccccc] hover:bg-white/[0.055]"
        >
          {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          {expanded ? <FolderOpen size={14} className="mx-1 text-[#dcb67a]" /> : <Folder size={14} className="mx-1 text-[#dcb67a]" />}
          <span className="truncate">{node.name}</span>
        </button>
        {expanded && <div className="ml-[13px] w-[calc(100%-13px)] border-l border-white/[0.16]">{renderNodes(node.children)}</div>}
      </React.Fragment>
    );

    return (
      <button
        key={node.path}
        type="button"
        onClick={() => void openFile(node.path)}
        className={`flex h-[23px] w-full items-center gap-1.5 pl-[10px] text-left text-[12px] hover:bg-white/[0.055] ${
          selectedFile === node.path ? 'bg-[#37373d] text-white' : 'text-[#cccccc]'
        }`}
      >
        <FileTypeIcon path={node.path} />
        <span className="truncate">{node.name}</span>
        {activities.some((item) => item.detail === node.path && item.tool === 'write_file') && (
          <span className="ml-auto mr-2 text-[10px] text-amber-400 font-semibold">M</span>
        )}
      </button>
    );
  });

  if (!project) {
    return (
      <div className="flex h-screen w-full flex-col overflow-y-auto bg-[#111214] text-[#d4d4d4]">
        <div className="flex h-11 shrink-0 items-center px-4">
          <button onClick={() => navigate('/dashboard')} className="rounded p-2 text-[#777] hover:bg-white/5 hover:text-white" title="Home" aria-label="Home">
            <Home size={17} />
          </button>
        </div>
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-10">
          <button
            type="button"
            onClick={chooseFolder}
            onDragOver={(event) => { event.preventDefault(); if (!isImporting) setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFolderDrop}
            disabled={isImporting}
            className={`flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed bg-[#17181b] px-6 text-center transition ${
              isDragging ? 'border-orange-400 bg-orange-500/[0.06]' : 'border-[#35363a] hover:border-[#55565b]'
            } disabled:cursor-wait`}
          >
            {isImporting ? (
              <>
                <Loader2 size={24} className="mb-4 animate-spin text-orange-400" />
                <span className="text-sm font-medium text-[#e2e2e2]">Importing project</span>
                <span className="mt-2 text-xs text-[#74767c]">{status}</span>
                <span className="mt-5 h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
                  <span className="block h-full rounded-full bg-orange-500 transition-[width] duration-300" style={{ width: `${importProgress}%` }} />
                </span>
                <span className="mt-2 font-mono text-[10px] text-[#60636a]">{importProgress}%</span>
              </>
            ) : (
              <>
                <UploadCloud size={25} className="mb-4 text-[#8b8d94]" />
                <span className="text-sm font-medium text-[#dedede]">Drop a project folder</span>
                <span className="mt-1.5 text-xs text-[#707279]">or click to browse local files</span>
              </>
            )}
          </button>

          {!isImporting && (
            <button
              type="button"
              onClick={() => { setNewProjectName('Untitled Project'); setNewProjectOpen(true); }}
              className="mx-auto mt-4 text-xs text-[#777a81] underline decoration-[#414349] underline-offset-4 hover:text-white"
            >
              Start empty project
            </button>
          )}

          {cachedProjects.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#62646a]">Recent projects</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {cachedProjects.map((cached) => (
                  <div key={cached.id} className="group flex items-center rounded-lg border border-white/[0.055] bg-[#17181b] p-3 hover:border-white/[0.12]">
                    <button type="button" onClick={() => void openCachedProject(cached)} disabled={isImporting} className="flex min-w-0 flex-1 items-center text-left">
                      <span className="mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/[0.045] text-[#a4a6ad]"><FolderOpen size={17} /></span>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium text-[#d8d8d8]">{cached.name}</span>
                        <span className="mt-1 block text-[10px] text-[#666970]">{cached.fileCount} files · {new Date(cached.updatedAt).toLocaleDateString()}</span>
                      </span>
                    </button>
                    <button type="button" onClick={() => void removeCachedProject(cached.id)} className="ml-2 rounded p-2 text-[#55585e] opacity-0 hover:bg-white/5 hover:text-rose-400 group-hover:opacity-100" title="Remove cached project">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {newProjectOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-[3px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setNewProjectOpen(false); }}>
            <form onSubmit={(event) => { event.preventDefault(); void startEmptyProject(); }} className="w-full max-w-sm rounded-xl border border-white/[0.09] bg-[#1a1b1e] p-5 shadow-2xl shadow-black/50">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[#eeeeee]">Create a project</h2>
                  <p className="mt-1 text-[11px] text-[#74767d]">Choose a name for your local workspace.</p>
                </div>
                <button type="button" onClick={() => setNewProjectOpen(false)} className="rounded p-1 text-[#666970] hover:bg-white/5 hover:text-white" aria-label="Close">
                  <X size={15} />
                </button>
              </div>
              <label htmlFor="black-tonet-project-name" className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-[#686a71]">Project name</label>
              <input
                id="black-tonet-project-name"
                value={newProjectName}
                onChange={(event) => setNewProjectName(event.target.value)}
                autoFocus
                onFocus={(event) => event.currentTarget.select()}
                placeholder="My project"
                className="h-10 w-full rounded-lg border border-white/[0.08] bg-[#121316] px-3 text-sm text-white outline-none placeholder:text-[#505258] focus:border-orange-500/60 focus:ring-2 focus:ring-orange-500/10"
              />
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setNewProjectOpen(false)} className="rounded-lg px-3.5 py-2 text-xs font-medium text-[#92949a] hover:bg-white/5 hover:text-white">Cancel</button>
                <button type="submit" disabled={!newProjectName.trim()} className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40">Create project</button>
              </div>
            </form>
          </div>
        )}
        <input ref={folderInputRef} type="file" className="hidden" {...({ webkitdirectory: '', directory: '', multiple: true } as any)} onChange={async (event) => { if (!event.target.files?.length) return; setIsImporting(true); setImportProgress(8); setStatus('Reading selected folder'); const imported = await buildFileSystemTreeFromFileList(event.target.files); setImportProgress(24); await mountProject(imported.tree, imported.folderName, imported.fileCount); event.target.value = ''; }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#181818] font-sans text-[#cccccc]">
      <div className="flex min-h-0 flex-1">
        {/* Left Activity Bar */}
        <aside className="flex w-11 shrink-0 flex-col items-center border-r border-black/60 bg-[#181818] py-1">
          <button onClick={() => { closeProject(); navigate('/dashboard'); }} className="flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white" title="Save and go home" aria-label="Home">
            <Home size={20} strokeWidth={1.6} />
          </button>
          {[Files, Bot, Search, GitBranch, Play, Bug, Boxes].map((Icon, index) => (
            <button
              key={index}
              onClick={() => {
                if (index === 0) setExplorerOpen((value) => !value);
                if (index === 1) setAgentOpen((value) => !value);
              }}
              className={`relative flex h-12 w-11 items-center justify-center hover:text-white ${
                (index === 0 && explorerOpen) || (index === 1 && agentOpen)
                  ? 'text-white before:absolute before:left-0 before:h-8 before:w-0.5 before:bg-orange-500'
                  : 'text-[#858585]'
              }`}
              title={index === 0 ? 'Explorer' : index === 1 ? 'Black-Tonet agent' : undefined}
            >
              <Icon size={21} strokeWidth={1.5} />
            </button>
          ))}
          <div className="mt-auto">
            <button onClick={() => downloadCodeAgentProjectZip(project.name, cachedFiles)} className="flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white" title="Export project as ZIP">
              <Download size={19} />
            </button>
            <button onClick={closeProject} className="flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white" title="Close project">
              <X size={19} />
            </button>
            <button className="flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white"><CircleDot size={20} /></button>
            <button className="flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white"><Settings size={20} /></button>
          </div>
        </aside>

        {/* Explorer Sidebar */}
        {explorerOpen && (
          <aside className="flex w-[238px] shrink-0 flex-col border-r border-black/60 bg-[#181818]">
            <div className="flex h-9 items-center justify-between px-4 text-[11px] uppercase tracking-wide text-[#bbbbbb]">
              <span>Explorer</span>
              <span className="flex items-center gap-0.5">
                <button onClick={() => void createFile()} className="rounded p-1 hover:bg-white/10" title="New file"><FilePlus2 size={14} /></button>
                <button onClick={() => void createFolder()} className="rounded p-1 hover:bg-white/10" title="New folder"><FolderPlus size={14} /></button>
                <button onClick={() => downloadCodeAgentProjectZip(project.name, cachedFiles)} className="rounded p-1 hover:bg-white/10" title="Export ZIP"><Download size={14} /></button>
                <MoreHorizontal size={15} />
              </span>
            </div>
            <div className="flex h-6 items-center gap-1 border-y border-white/[0.035] px-1 text-[11px] font-bold uppercase">
              <ChevronDown size={13} /> Open Editors
            </div>
            <div className="max-h-28 overflow-y-auto py-1">
              {openTabs.map((path) => (
                <button key={path} onClick={() => void openFile(path)} className="flex h-[22px] w-full items-center gap-1.5 px-4 text-left text-[12px] hover:bg-white/5">
                  <FileTypeIcon path={path} />
                  <span className="truncate">{basename(path)}</span>
                  <X onClick={(event) => { event.stopPropagation(); closeTab(path); }} size={12} className="ml-auto" />
                </button>
              ))}
            </div>
            <div className="flex h-6 items-center gap-1 border-y border-white/[0.035] px-1 text-[11px] font-bold uppercase">
              <ChevronDown size={13} />
              <span className="truncate">{project.name}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-auto py-1">{renderNodes(tree)}</div>
          </aside>
        )}

        {/* AI Agent Chat & Activity Panel */}
        {agentOpen && (
          <section className="order-3 flex w-[410px] min-w-[340px] shrink-0 flex-col border-l border-black/60 bg-[#181818]">
            <div className="flex h-9 items-center border-b border-black/50 px-3 text-sm text-white">
              <Sparkles size={15} className="mr-2 text-orange-400" />
              <span className="font-semibold text-xs tracking-wide">Black-Tonet Autonomous Agent</span>
              <span className="ml-auto rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-mono text-orange-400 ring-1 ring-orange-500/30">13 RPM Safe</span>
            </div>

            {/* Scrollable Conversation Stream */}
            <div ref={agentScrollRef} className="min-h-0 flex-1 overflow-y-auto px-3.5 py-4 space-y-4">
              {timelineMessages.map((message) => (
                <div
                  key={message.id}
                  className={`text-xs leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-6 rounded-xl border border-white/[0.08] bg-[#24262b] p-3 text-white shadow-sm'
                      : 'rounded-xl border border-white/[0.05] bg-[#1a1b1e] p-3 text-slate-200 shadow-sm prose prose-invert max-w-none text-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-5">{message.text}</p>
                </div>
              ))}

              {/* Dynamic Animated Status Simulator */}
              {isAgentRunning && (
                <AgentWorkingStatus
                  status={agentStatusEvent.status}
                  detail={agentStatusEvent.detail}
                  state={agentStatusEvent.state}
                  phase={agentStatusEvent.phase}
                />
              )}

              {/* Expandable Grouped Activity Panel */}
              <AgentActivityPanel
                activities={activities}
                open={activitiesOpen}
                expandedGroups={expandedGroups}
                expandedItems={expandedItems}
                onToggleOpen={() => setActivitiesOpen((value) => !value)}
                onToggleGroup={(groupId) => setExpandedGroups((current) => {
                  const next = new Set(current);
                  if (next.has(groupId)) next.delete(groupId);
                  else next.add(groupId);
                  return next;
                })}
                onToggleItem={(itemId) => setExpandedItems((current) => {
                  const next = new Set(current);
                  if (next.has(itemId)) next.delete(itemId);
                  else next.add(itemId);
                  return next;
                })}
              />

              {trailingAgentMessage && (
                <div className="rounded-xl border border-emerald-500/20 bg-[#16201a] p-3.5 text-xs text-slate-200 shadow-md">
                  <div className="mb-2 flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">
                    <Check size={14} /> Agent Summary
                  </div>
                  <div className="whitespace-pre-wrap leading-relaxed prose prose-invert text-xs">{trailingAgentMessage.text}</div>
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={(event) => { event.preventDefault(); void runAgent(prompt); }} className="p-3">
              <div className="rounded-xl border border-white/[0.08] bg-[#222222] shadow-[0_8px_28px_rgba(0,0,0,0.22)] focus-within:border-orange-500/60 focus-within:ring-1 focus-within:ring-orange-500/20 transition">
                <textarea
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      void runAgent(prompt);
                    }
                  }}
                  rows={3}
                  placeholder={project ? 'Ask Black-Tonet to inspect, build, or fix…' : 'Open a folder to begin…'}
                  disabled={!project || isAgentRunning}
                  className="w-full resize-none rounded-t-xl border-0 bg-transparent px-3 py-2.5 text-xs text-white outline-none ring-0 placeholder:text-[#666] focus:border-0 focus:outline-none focus:ring-0"
                />
                <div className="flex items-center px-2.5 pb-2">
                  <button type="button" onClick={chooseFolder} className="rounded p-1 text-[#888] hover:bg-white/10 hover:text-white" title="Open folder">
                    <FolderOpen size={14} />
                  </button>
                  <span className="ml-2 text-[10px] text-[#777]">Autonomous batching active</span>
                  <button
                    type="submit"
                    disabled={!prompt.trim() || !project || isAgentRunning}
                    className="ml-auto flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-400 disabled:opacity-30 transition"
                  >
                    <Send size={13} />
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Central Editor & Live Preview Area */}
        <main className="order-2 flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
          <div className="flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-black/60 bg-[#181818]">
            {openTabs.map((path) => (
              <button
                key={path}
                onClick={() => void openFile(path)}
                className={`group flex min-w-[130px] max-w-[210px] items-center gap-2 border-r border-black/50 px-3 text-[11px] ${
                  selectedFile === path && editorMode === 'code' ? 'border-t border-t-orange-500 bg-[#1e1e1e] text-white' : 'bg-[#181818] text-[#888]'
                }`}
              >
                <FileTypeIcon path={path} />
                <span className="truncate">{basename(path)}</span>
                {activities.some((item) => item.detail === path && item.tool === 'write_file') && (
                  <span className="text-amber-400 font-semibold">M</span>
                )}
                <X onClick={(event) => { event.stopPropagation(); closeTab(path); }} size={12} className="ml-auto opacity-0 group-hover:opacity-100" />
              </button>
            ))}
            {project && (
              <button
                onClick={() => setEditorMode('preview')}
                className={`flex min-w-[105px] items-center gap-2 border-r border-black/50 px-3 text-[11px] ${
                  editorMode === 'preview' ? 'border-t border-t-orange-500 bg-[#1e1e1e] text-white' : 'text-[#888]'
                }`}
              >
                <Eye size={13} /> Preview
              </button>
            )}
          </div>

          {!project ? (
            <button
              onClick={chooseFolder}
              onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={async (event) => {
                event.preventDefault();
                setIsDragging(false);
                const imported = await buildFileSystemTreeFromDataTransfer(event.dataTransfer.items);
                if (imported.fileCount) await mountProject(imported.tree, imported.folderName, imported.fileCount);
              }}
              className={`m-auto flex h-72 w-[min(520px,85%)] flex-col items-center justify-center rounded-xl border border-dashed transition ${
                isDragging ? 'border-orange-400 bg-orange-500/10' : 'border-[#444] bg-[#1b1b1b] hover:border-[#666]'
              }`}
            >
              <UploadCloud size={34} className="mb-4 text-orange-400" />
              <span className="text-base font-semibold text-white">{isImporting ? status : 'Drop a project folder'}</span>
              <span className="mt-2 text-xs text-[#777]">or click to open one</span>
            </button>
          ) : editorMode === 'preview' ? (
            <div className="min-h-0 flex-1 bg-white">
              {previewUrl || previewHtml ? (
                <iframe key={previewKey} src={previewUrl || undefined} srcDoc={previewUrl ? undefined : previewHtml} className="h-full w-full border-0" title="Project preview" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-[#1e1e1e] text-[#777]">
                  <Play size={28} />
                  <p className="mt-3 text-xs">No preview is available</p>
                </div>
              )}
            </div>
          ) : selectedFile ? (
            <div className="relative min-h-0 flex-1 bg-[#1e1e1e]">
              <div className="absolute right-3 top-2 z-10 flex gap-1">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedContent);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }}
                  className="rounded bg-[#2a2a2a] p-1.5 text-[#999] hover:text-white"
                  title="Copy file"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button onClick={() => void openFile(selectedFile)} className="rounded bg-[#2a2a2a] p-1.5 text-[#999] hover:text-white" title="Refresh file">
                  <RefreshCw size={13} />
                </button>
              </div>
              <Editor
                path={selectedFile}
                value={selectedContent}
                language={editorLanguageForPath(selectedFile)}
                beforeMount={configureCodeAgentEditor}
                theme="black-tonet-editor"
                onChange={(value) => editSelectedFile(value || '')}
                options={{
                  automaticLayout: true,
                  fontSize: 14,
                  lineHeight: 22,
                  fontFamily: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
                  lineNumbers: 'on',
                  lineNumbersMinChars: 4,
                  glyphMargin: false,
                  folding: true,
                  foldingHighlight: true,
                  showFoldingControls: 'mouseover',
                  guides: { indentation: true, highlightActiveIndentation: true, bracketPairs: true, highlightActiveBracketPair: true },
                  bracketPairColorization: { enabled: true },
                  minimap: { enabled: true },
                  padding: { top: 12, bottom: 28 },
                  renderLineHighlight: 'line',
                  scrollBeyondLastLine: false,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'off',
                }}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-xs text-[#666]">Select a file from Explorer</div>
          )}

          <footer className="flex h-[22px] shrink-0 items-center bg-[#181818] px-2 text-[9px] text-[#888]">
            <GitBranch size={11} className="mr-1" /> main
            <span className="ml-3">{status}</span>
            <span className="ml-auto">Ln 1, Col 1</span>
            <span className="ml-3">Spaces: 2</span>
            <span className="ml-3">UTF-8</span>
            <span className="ml-3 capitalize">{selectedFile ? languageForPath(selectedFile) : 'Plain Text'}</span>
          </footer>
        </main>
      </div>
      <input ref={folderInputRef} type="file" className="hidden" {...({ webkitdirectory: '', directory: '', multiple: true } as any)} onChange={async (event) => { if (!event.target.files?.length) return; setIsImporting(true); setImportProgress(8); setStatus('Reading selected folder'); const imported = await buildFileSystemTreeFromFileList(event.target.files); setImportProgress(24); await mountProject(imported.tree, imported.folderName, imported.fileCount); event.target.value = ''; }} />
    </div>
  );
};

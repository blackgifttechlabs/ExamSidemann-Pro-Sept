import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * The Access ribbon, laid out the way the real one is: a maroon tab strip, the
 * File backstage button, groups of commands separated by hairlines with the
 * group name underneath, and large buttons on the left of each group with the
 * small stacked ones after them.
 *
 * Commands this lab does not implement are still drawn — greyed out and
 * unclickable — because a student sitting the practical needs to recognise the
 * window, and a ribbon with half its buttons missing is not the window they
 * will meet in the exam room.
 */

export type RibbonIcon = React.ComponentType<{ className?: string; size?: number | string }>;

export interface RibbonCommand {
  id: string;
  label: string;
  Icon: RibbonIcon;
  /** Large buttons stack icon over label; small ones sit on one line. */
  size?: 'large' | 'small';
  /** Icon tint, matching Access's own colour coding. */
  color?: string;
  disabled?: boolean;
  active?: boolean;
  dropdown?: boolean;
  onClick?: () => void;
  title?: string;
}

export interface RibbonGroup {
  id: string;
  label: string;
  commands: RibbonCommand[];
  /** Extra content (font pickers, checkboxes) rendered before the buttons. */
  render?: React.ReactNode;
}

export interface RibbonTab {
  id: string;
  label: string;
  groups: RibbonGroup[];
  /** Contextual tabs sit under a coloured banner, e.g. "Table Tools". */
  contextual?: { label: string; color: string };
}

const LargeButton: React.FC<{ command: RibbonCommand }> = ({ command }) => (
  <button
    type="button"
    disabled={command.disabled}
    onClick={command.onClick}
    title={command.title || command.label}
    className={`flex h-[68px] w-[62px] shrink-0 flex-col items-center justify-start gap-1 rounded-sm px-1 pt-1.5 text-[11px] leading-[1.1] transition-colors ${
      command.disabled
        ? 'cursor-default text-[#a6a6a6]'
        : command.active
          ? 'bg-[#d4e3f5] text-[#1a1a1a] ring-1 ring-[#a6c8ed]'
          : 'text-[#1a1a1a] hover:bg-[#e9f0f9] hover:ring-1 hover:ring-[#c5d9f1]'
    }`}
  >
    <command.Icon
      size={22}
      className={command.disabled ? 'text-[#b8b8b8]' : command.color || 'text-[#4a5568]'}
    />
    <span className="flex flex-col items-center text-center">
      <span className="block max-w-[58px] whitespace-pre-line">{command.label}</span>
      {command.dropdown && <ChevronDown size={9} className="mt-[1px] opacity-70" />}
    </span>
  </button>
);

const SmallButton: React.FC<{ command: RibbonCommand }> = ({ command }) => (
  <button
    type="button"
    disabled={command.disabled}
    onClick={command.onClick}
    title={command.title || command.label}
    className={`flex h-[22px] w-full items-center gap-1.5 rounded-sm px-1.5 text-left text-[11px] leading-none transition-colors ${
      command.disabled
        ? 'cursor-default text-[#a6a6a6]'
        : command.active
          ? 'bg-[#d4e3f5] text-[#1a1a1a] ring-1 ring-[#a6c8ed]'
          : 'text-[#1a1a1a] hover:bg-[#e9f0f9] hover:ring-1 hover:ring-[#c5d9f1]'
    }`}
  >
    <command.Icon
      size={14}
      className={`shrink-0 ${command.disabled ? 'text-[#b8b8b8]' : command.color || 'text-[#4a5568]'}`}
    />
    <span className="truncate">{command.label.replace(/\n/g, ' ')}</span>
    {command.dropdown && <ChevronDown size={9} className="ml-auto shrink-0 opacity-70" />}
  </button>
);

/** Small commands run down a column three at a time, exactly like the ribbon. */
const columnise = (commands: RibbonCommand[]) => {
  const columns: RibbonCommand[][] = [];
  commands.forEach((command, index) => {
    const columnIndex = Math.floor(index / 3);
    if (!columns[columnIndex]) columns[columnIndex] = [];
    columns[columnIndex].push(command);
  });
  return columns;
};

const Group: React.FC<{ group: RibbonGroup }> = ({ group }) => {
  const large = group.commands.filter((command) => command.size !== 'small');
  const small = group.commands.filter((command) => command.size === 'small');

  return (
    <div className="flex h-full shrink-0 flex-col border-r border-[#d4d4d4] px-1.5 pb-0.5 pt-1">
      <div className="flex flex-1 items-start gap-1">
        {group.render}
        {large.map((command) => (
          <LargeButton key={command.id} command={command} />
        ))}
        {columnise(small).map((column, index) => (
          <div key={index} className="flex w-[104px] flex-col gap-[2px] pt-1">
            {column.map((command) => (
              <SmallButton key={command.id} command={command} />
            ))}
          </div>
        ))}
      </div>
      <div className="pt-0.5 text-center text-[10px] leading-none text-[#666]">{group.label}</div>
    </div>
  );
};

export const AccessRibbon: React.FC<{
  tabs: RibbonTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onFile: () => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  /** Right-hand side of the tab strip, e.g. "Tell me what you want to do". */
  tellMe?: React.ReactNode;
}> = ({ tabs, activeTab, onTabChange, onFile, collapsed, onToggleCollapsed, tellMe }) => {
  const current = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  // Contextual tabs are banded above the strip: "Table Tools" spanning the tabs
  // that belong to it.
  const contextualGroups: Array<{ label: string; color: string; tabs: RibbonTab[] }> = [];
  tabs.forEach((tab) => {
    if (!tab.contextual) return;
    const existing = contextualGroups.find((group) => group.label === tab.contextual!.label);
    if (existing) existing.tabs.push(tab);
    else contextualGroups.push({ label: tab.contextual.label, color: tab.contextual.color, tabs: [tab] });
  });
  const plainTabs = tabs.filter((tab) => !tab.contextual);

  return (
    <div className="shrink-0 select-none bg-[#a4373a] font-[Segoe_UI,system-ui,sans-serif]">
      {contextualGroups.length > 0 && (
        <div className="flex items-end gap-4 px-[104px] text-[10px] font-semibold text-white/90">
          {contextualGroups.map((group) => (
            <span
              key={group.label}
              className="rounded-t-sm px-3 pt-[2px] uppercase tracking-wide"
              style={{ background: group.color }}
            >
              {group.label}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-end gap-0 px-1">
        <button
          type="button"
          onClick={onFile}
          className="mr-1 h-[26px] bg-[#8a2f31] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#7a2a2c]"
        >
          File
        </button>

        {[...plainTabs, ...contextualGroups.flatMap((group) => group.tabs)].map((tab) => {
          const isActive = tab.id === current?.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              onDoubleClick={onToggleCollapsed}
              className={`h-[26px] px-3 text-[12px] transition-colors ${
                isActive
                  ? 'rounded-t-[3px] bg-white text-[#1a1a1a]'
                  : 'text-white/90 hover:bg-white/15'
              }`}
              style={
                !isActive && tab.contextual ? { color: '#ffe4e4' } : undefined
              }
            >
              {tab.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 pb-[3px] pr-1">{tellMe}</div>
      </div>

      {!collapsed && current && (
        <div className="flex h-[94px] items-stretch overflow-x-auto border-b border-[#d4d4d4] bg-white">
          {current.groups.map((group) => (
            <Group key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

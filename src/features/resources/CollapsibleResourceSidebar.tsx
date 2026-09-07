import React, { useEffect, useState } from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  X,
  type LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

export type ResourceSidebarAction = {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
};

type CollapsibleResourceSidebarProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  open: boolean;
  onClose: () => void;
  showPageHeader?: boolean;
  collapsedActions?: ResourceSidebarAction[];
  children: React.ReactNode;
};

const STORAGE_KEY = 'resource-sidebar-collapsed';

export const CollapsibleResourceSidebar: React.FC<CollapsibleResourceSidebarProps> = ({
  title,
  subtitle,
  icon: PageIcon,
  open,
  onClose,
  showPageHeader = true,
  collapsedActions = [],
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={`Close ${title} menu`}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-[286px] shrink-0 flex-col border-r border-slate-200 bg-white transition-[transform,width] duration-300 ease-in-out dark:border-white/10 dark:bg-[#111111] lg:static lg:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          isCollapsed ? 'lg:w-[88px]' : 'lg:w-[264px]',
        )}
      >
        {/* Mobile keeps only the drawer control. The repeated Exam Sidemann
            brand block was removed so resource sidebars begin with navigation. */}
        <div className="flex h-14 shrink-0 items-center justify-end border-b border-slate-100 px-3 dark:border-white/10 lg:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label={`Close ${title} menu`}
          >
            <X size={18} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          className="absolute -right-3 top-4 z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-[#fdba74] hover:text-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] dark:border-white/15 dark:bg-[#1b1b1b] dark:text-slate-300 lg:flex"
          aria-label={isCollapsed ? `Expand ${title} sidebar` : `Collapse ${title} sidebar`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </button>

        <div className={clsx('custom-scrollbar flex-1 overflow-x-hidden overflow-y-auto py-6', isCollapsed ? 'lg:px-3' : 'lg:px-4')}>
          {showPageHeader && <div className="px-4 lg:px-0">
            <div
              className={clsx(
                'flex h-14 items-center gap-3 rounded-full bg-[#13141d] px-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(15,17,27,0.18)] dark:bg-[#f5f5f5] dark:text-[#111111]',
                isCollapsed && 'lg:justify-center lg:gap-0 lg:bg-transparent lg:px-1 lg:shadow-none lg:dark:bg-transparent',
              )}
            >
              <span
                className={clsx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb02e] to-[#f97316] text-white shadow-[0_5px_14px_rgba(249,115,22,0.35)] ring-2 ring-white dark:ring-[#111111]',
                  isCollapsed && 'lg:h-12 lg:w-12 lg:ring-[3px] lg:ring-[#13141d] lg:dark:ring-white',
                )}
              >
                <PageIcon size={20} strokeWidth={1.9} />
              </span>
              <span className={clsx('min-w-0', isCollapsed && 'lg:hidden')}>
                <span className="block truncate text-sm font-black text-[#fb923c] dark:text-[#ea580c]">{title}</span>
                <span className="block truncate text-[9px] font-bold uppercase text-slate-400">{subtitle}</span>
              </span>
            </div>
          </div>}

          {isCollapsed && collapsedActions.length > 0 && (
            <nav className={clsx('hidden space-y-2 px-3 lg:block', showPageHeader ? 'mt-3' : 'mt-0')} aria-label={`${title} shortcuts`}>
              {collapsedActions.map((action) => {
                const ActionIcon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      action.onClick?.();
                      setIsCollapsed(false);
                    }}
                    className="group flex h-14 w-full items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] dark:text-slate-400 dark:hover:bg-white/5"
                    aria-label={action.label}
                    title={action.label}
                  >
                    <ActionIcon size={20} strokeWidth={1.9} className="transition-colors group-hover:text-slate-950 dark:group-hover:text-white" />
                  </button>
                );
              })}
            </nav>
          )}

          <div className={clsx(showPageHeader ? 'mt-5 px-3 lg:px-0' : 'px-3 lg:px-0', isCollapsed && 'lg:hidden')}>
            {children}
          </div>
        </div>
      </aside>
    </>
  );
};

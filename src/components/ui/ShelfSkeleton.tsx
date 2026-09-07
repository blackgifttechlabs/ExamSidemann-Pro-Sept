import React from 'react';

/**
 * The shelf, drawn empty.
 *
 * Switching level swaps the whole grid, and a spinner there says nothing about
 * what is coming. This is the same layout the books and papers land in — cover
 * tile, title line, subtitle line — so the page keeps its shape while the new
 * level loads and nothing jumps when it arrives.
 */
export const SHELF_GRID =
  'grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 2xl:grid-cols-8';

export const ShelfSkeleton: React.FC<{ count?: number }> = ({ count = 12 }) => (
  <div className={SHELF_GRID} aria-hidden="true">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="aspect-[1/1.45] w-full rounded-[10px] bg-slate-200/80 dark:bg-white/10" />
        <div className="mt-2 h-3 w-4/5 rounded bg-slate-200/80 dark:bg-white/10" />
        <div className="mt-1.5 h-2.5 w-3/5 rounded bg-slate-200/60 dark:bg-white/5" />
      </div>
    ))}
  </div>
);

export default ShelfSkeleton;

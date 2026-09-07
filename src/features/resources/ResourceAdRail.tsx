import React from 'react';
import { AdSense } from '../analytics/AdSense';
import type { ApprovedAdPlacement } from '../analytics/AdSense';

type ResourceAdRailProps = {
  slots?: [string, string, string];
  /** Required after a placement review; intentionally excludes list/navigation pages. */
  approvedContentPlacement?: ApprovedAdPlacement;
};

export const ResourceAdRail: React.FC<ResourceAdRailProps> = ({
  slots = ['7822405452', '7822405452', '7822405452'],
  approvedContentPlacement,
}) => {
  // Existing rail calls are primarily on selectors, libraries, directories, and
  // search results. They deliberately render nothing until a substantive detail
  // page is individually reviewed and opts in through this prop.
  if (!approvedContentPlacement) return null;

  return (
    <>
      <div className="hidden w-[260px] shrink-0 xl:block" aria-hidden="true" />
      <aside
        aria-label="Sponsored content"
        className="fixed bottom-0 right-0 top-16 z-30 hidden w-[260px] overflow-y-auto border-l border-slate-200 bg-white/90 p-2.5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0c0c10]/90 xl:block"
      >
        <div className="space-y-2.5">
          {slots.map((slot, index) => (
            <div key={`${slot}-${index}`} className="min-h-[170px] overflow-hidden rounded-[15px] border border-slate-200 bg-white p-1.5 dark:border-white/10 dark:bg-white/[0.035]">
              <AdSense
                adSlot={slot}
                approvedContentPlacement={approvedContentPlacement}
                className="!my-0 min-h-[152px] !border-0 !bg-transparent !p-0"
                style={{ display: 'block', width: '100%', minHeight: 140 }}
              />
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

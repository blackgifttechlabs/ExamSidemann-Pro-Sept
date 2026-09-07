"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Lets a simulation hand its controls to whatever experiment header is on screen,
 * without the header and the simulation having to be in the same React tree.
 * Only one experiment is ever mounted at a time, so a module-level registry is
 * enough.
 *
 * Two slots exist:
 *   `narration` — middle of the bar: the Tinashe "Show me" walkthrough controls.
 *   `actions`   — right of the bar, before How-to / Paper: the Learning · Doing
 *                 toggle and anything else the simulation owns.
 *
 * The desktop header and the mobile top bar each register their own copy of a
 * slot; CSS hides the one that does not apply to the current viewport, so the
 * controls are rendered into *every* registered slot and the browser shows the
 * right copy.
 */

export type ExperimentHeaderSlotName = "narration" | "actions";

const registry: Record<ExperimentHeaderSlotName, HTMLElement[]> = { narration: [], actions: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const EMPTY: HTMLElement[] = [];

/**
 * Ref callback for a header to expose one of its areas as a slot. Attach it to
 * the empty element the controls should land in.
 */
export function useExperimentHeaderSlotRef(name: ExperimentHeaderSlotName) {
  const nodeRef = useRef<HTMLElement | null>(null);

  const detach = useCallback(() => {
    const node = nodeRef.current;
    if (!node) return;
    registry[name] = registry[name].filter((slot) => slot !== node);
    nodeRef.current = null;
    emit();
  }, [name]);

  useEffect(() => detach, [detach]);

  return useCallback(
    (node: HTMLElement | null) => {
      if (nodeRef.current === node) return;
      detach();
      if (node) {
        nodeRef.current = node;
        registry[name] = [...registry[name], node];
        emit();
      }
    },
    [detach, name],
  );
}

function useSlotTargets(name: ExperimentHeaderSlotName) {
  return useSyncExternalStore(
    subscribe,
    () => registry[name],
    () => EMPTY,
  );
}

/** True while at least one experiment header is offering the given slot. */
export function useHasExperimentHeaderSlot(name: ExperimentHeaderSlotName = "narration") {
  return useSlotTargets(name).length > 0;
}

/**
 * Renders `children` into the named header slot(s). If no header is mounted the
 * children are drawn in place instead, so a bare simulation still works.
 */
export function ExperimentHeaderPortal({
  name = "narration",
  children,
  fallbackClassName,
}: {
  name?: ExperimentHeaderSlotName;
  children: ReactNode;
  /** Wrapper used when there is no header to portal into. */
  fallbackClassName?: string;
}) {
  const targets = useSlotTargets(name);
  // The registry fills in after the header mounts; this keeps the portal from
  // flashing the fallback for a frame on the very first paint.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  if (!ready) return null;
  if (targets.length === 0) {
    return fallbackClassName ? <div className={fallbackClassName}>{children}</div> : <>{children}</>;
  }

  return (
    <>
      {targets.map((target, index) => (
        <ExperimentHeaderSlotPortal key={index} target={target}>
          {children}
        </ExperimentHeaderSlotPortal>
      ))}
    </>
  );
}

function ExperimentHeaderSlotPortal({ target, children }: { target: HTMLElement; children: ReactNode }) {
  return createPortal(children, target);
}

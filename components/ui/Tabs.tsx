"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";

export type TabItem = {
  id: string;
  label: string;
};

export type TabsProps = {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  className?: string;
};

export function Tabs({ tabs, activeId, onChange, ariaLabel = "Tabs", className = "" }: TabsProps) {
  const baseId = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusByOffset(currentId: string, offset: number) {
    const idx = tabs.findIndex((t) => t.id === currentId);
    if (idx < 0) return;
    const next = (idx + offset + tabs.length) % tabs.length;
    const target = tabs[next];
    refs.current[target.id]?.focus();
    onChange(target.id);
  }

  function handleKey(e: KeyboardEvent<HTMLButtonElement>, tabId: string) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      focusByOffset(tabId, 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      focusByOffset(tabId, -1);
    } else if (e.key === "Home") {
      e.preventDefault();
      const first = tabs[0];
      refs.current[first.id]?.focus();
      onChange(first.id);
    } else if (e.key === "End") {
      e.preventDefault();
      const last = tabs[tabs.length - 1];
      refs.current[last.id]?.focus();
      onChange(last.id);
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 bg-surface-muted rounded-pill p-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            role="tab"
            id={`${baseId}-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${baseId}-${tab.id}-panel`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKey(e, tab.id)}
            className={[
              "rounded-pill px-5 py-3 text-label transition-all duration-200 ease-spring",
              isActive
                ? "bg-surface text-text shadow-sm"
                : "text-text-muted hover:text-text",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export type TabPanelProps = {
  tabsId?: string;
  tabId: string;
  active: boolean;
  children: ReactNode;
  className?: string;
};

export function TabPanel({ tabId, active, children, className = "" }: TabPanelProps) {
  if (!active) return null;
  return (
    <div role="tabpanel" id={`${tabId}-panel`} aria-labelledby={tabId} className={className}>
      {children}
    </div>
  );
}

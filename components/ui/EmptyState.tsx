import type { ReactNode } from "react";

export type EmptyStateProps = {
  emoji?: string;
  illustration?: ReactNode;
  title: string;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  emoji,
  illustration,
  title,
  body,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center text-center bg-surface rounded-xl shadow-sm py-9 px-7 ${className}`}
    >
      {illustration ? (
        <div className="mb-4">{illustration}</div>
      ) : emoji ? (
        <div className="text-[96px] leading-none mb-4" aria-hidden="true">
          {emoji}
        </div>
      ) : null}
      <h3 className="font-display text-h3 text-text mb-2">{title}</h3>
      {body ? <p className="text-body text-text-muted max-w-md mb-6">{body}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

import type { ReactNode } from "react";

export type ChipVariant =
  | "primary"
  | "accent"
  | "highlight"
  | "success"
  | "mauve"
  | "peach"
  | "mint"
  | "neutral";

export type ChipProps = {
  variant?: ChipVariant;
  children: ReactNode;
  leadingIcon?: ReactNode;
  className?: string;
};

const VARIANT_STYLES: Record<ChipVariant, { bg: string; text: string }> = {
  primary: { bg: "bg-primary-soft", text: "text-primary" },
  accent: { bg: "bg-accent-soft", text: "text-accent" },
  // highlight uses an amber-700-ish text per design.md §7.5
  highlight: { bg: "bg-highlight-soft", text: "text-[#A16207]" },
  success: { bg: "bg-success-soft", text: "text-success" },
  mauve: { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]" },
  peach: { bg: "bg-[#FFEDD5]", text: "text-[#C2410C]" },
  mint: { bg: "bg-[#CCFBF1]", text: "text-[#0F766E]" },
  neutral: { bg: "bg-surface-muted", text: "text-text-muted" },
};

export function Chip({ variant = "neutral", children, leadingIcon, className = "" }: ChipProps) {
  const v = VARIANT_STYLES[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-[26px] px-3 rounded-pill text-tiny font-semibold ${v.bg} ${v.text} ${className}`}
    >
      {leadingIcon ? <span className="inline-flex shrink-0">{leadingIcon}</span> : null}
      {children}
    </span>
  );
}

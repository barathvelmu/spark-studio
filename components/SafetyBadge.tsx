import { ShieldCheck } from "lucide-react";

export type SafetyBadgeProps = {
  className?: string;
  label?: string;
};

export function SafetyBadge({ className = "", label = "Safety checked" }: SafetyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-3 rounded-pill bg-success-soft text-success text-tiny font-semibold ${className}`}
    >
      <ShieldCheck size={14} strokeWidth={2.25} aria-hidden="true" />
      {label}
    </span>
  );
}

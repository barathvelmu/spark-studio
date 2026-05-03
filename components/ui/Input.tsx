import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: ReactNode;
  error?: string;
  leadingIcon?: ReactNode;
  trailingSlot?: ReactNode;
  containerClassName?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helper,
    error,
    leadingIcon,
    trailingSlot,
    id,
    className = "",
    containerClassName = "",
    ...rest
  },
  ref
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-helper`;

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label ? (
        <label htmlFor={inputId} className="text-body-sm font-semibold text-text">
          {label}
        </label>
      ) : null}
      <div
        className={[
          "flex items-center gap-2 h-[48px] px-4 rounded-md transition-colors",
          "bg-surface-muted border-[1.5px] border-transparent",
          "focus-within:bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]",
          error ? "border-danger focus-within:border-danger" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {leadingIcon ? <span className="inline-flex shrink-0 text-text-muted">{leadingIcon}</span> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={helper || error ? helperId : undefined}
          className={`flex-1 bg-transparent outline-none text-body text-text placeholder:text-text-subtle ${className}`}
          {...rest}
        />
        {trailingSlot ? <span className="inline-flex shrink-0">{trailingSlot}</span> : null}
      </div>
      {helper || error ? (
        <p id={helperId} className={`text-tiny ${error ? "text-danger" : "text-text-muted"}`}>
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
});

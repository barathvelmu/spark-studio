import { forwardRef, useId, type ReactNode, type TextareaHTMLAttributes } from "react";

export type TextareaSize = "default" | "giant";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: ReactNode;
  error?: string;
  textareaSize?: TextareaSize;
  trailingSlot?: ReactNode;
  containerClassName?: string;
};

const SIZE_CLASSES: Record<TextareaSize, { wrapper: string; field: string }> = {
  default: {
    wrapper: "min-h-[96px] p-4",
    field: "text-body",
  },
  giant: {
    wrapper: "min-h-[180px] p-6",
    field: "text-h3 leading-relaxed",
  },
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    helper,
    error,
    textareaSize = "default",
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
  const sizeStyles = SIZE_CLASSES[textareaSize];

  return (
    <div className={`flex flex-col gap-2 ${containerClassName}`}>
      {label ? (
        <label htmlFor={inputId} className="text-body-sm font-semibold text-text">
          {label}
        </label>
      ) : null}
      <div
        className={[
          "relative flex rounded-md transition-colors",
          "bg-surface-muted border-[1.5px] border-transparent",
          "focus-within:bg-surface focus-within:border-primary focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.15)]",
          error ? "border-danger focus-within:border-danger" : "",
          sizeStyles.wrapper,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <textarea
          ref={ref}
          id={inputId}
          aria-invalid={!!error || undefined}
          aria-describedby={helper || error ? helperId : undefined}
          className={`flex-1 bg-transparent outline-none resize-y text-text placeholder:text-text-subtle ${sizeStyles.field} ${className}`}
          {...rest}
        />
        {trailingSlot ? (
          <div className="absolute bottom-3 right-3 inline-flex">{trailingSlot}</div>
        ) : null}
      </div>
      {helper || error ? (
        <p id={helperId} className={`text-tiny ${error ? "text-danger" : "text-text-muted"}`}>
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
});

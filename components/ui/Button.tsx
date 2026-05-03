import Link, { type LinkProps } from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-[36px] px-5 text-label",
  md: "h-[44px] px-6 text-label",
  lg: "h-[52px] px-7 text-body-lg",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover active:bg-primary-pressed text-white shadow-sm hover:shadow-md active:shadow-press font-bold",
  secondary:
    "bg-surface text-text border-[1.5px] border-border-strong hover:border-primary hover:bg-primary-soft font-bold",
  ghost:
    "bg-transparent text-text-muted hover:bg-surface-muted hover:text-text font-semibold",
};

export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
}: ButtonStyleProps = {}): string {
  return [
    "inline-flex items-center justify-center gap-3 rounded-lg",
    "transition-all duration-150 ease-spring",
    "hover:-translate-y-[1.5px] active:translate-y-0 active:scale-[0.97]",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth ? "w-full" : "",
    isLoading ? "cursor-wait" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & {
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    fullWidth,
    isLoading,
    leadingIcon,
    trailingIcon,
    className = "",
    children,
    disabled,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`${buttonStyles({ variant, size, fullWidth, isLoading })} ${className}`}
      {...rest}
    >
      {isLoading ? (
        <span
          aria-hidden="true"
          className="inline-block w-4 h-4 rounded-pill border-2 border-current border-t-transparent animate-spin"
        />
      ) : leadingIcon ? (
        <span className="inline-flex shrink-0">{leadingIcon}</span>
      ) : null}
      <span>{children}</span>
      {trailingIcon ? <span className="inline-flex shrink-0">{trailingIcon}</span> : null}
    </button>
  );
});

export type ButtonLinkProps = LinkProps &
  ButtonStyleProps & {
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    className?: string;
    children?: ReactNode;
  };

export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth,
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      {...linkProps}
      className={`${buttonStyles({ variant, size, fullWidth })} ${className}`}
    >
      {leadingIcon ? <span className="inline-flex shrink-0">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span className="inline-flex shrink-0">{trailingIcon}</span> : null}
    </Link>
  );
}

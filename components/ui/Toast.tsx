"use client";

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

export type ToastVariant = "success" | "info" | "warning" | "danger";

export type ToastInput = {
  variant?: ToastVariant;
  title: string;
  body?: string;
  duration?: number;
};

type Toast = ToastInput & { id: string };

type ToastContextValue = {
  show: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const VARIANT_CLASSES: Record<ToastVariant, { bg: string; text: string; Icon: typeof CheckCircle2 }> = {
  success: { bg: "bg-success-soft", text: "text-success", Icon: CheckCircle2 },
  info: { bg: "bg-accent-soft", text: "text-info", Icon: Info },
  warning: { bg: "bg-highlight-soft", text: "text-warning", Icon: AlertTriangle },
  danger: { bg: "bg-[#FEE2E2]", text: "text-danger", Icon: AlertCircle },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    setMounted(true);
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
      timers.current = {};
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
    const t = timers.current[id];
    if (t) {
      clearTimeout(t);
      delete timers.current[id];
    }
  }, []);

  const show = useCallback(
    (toast: ToastInput) => {
      const id = `t_${Math.random().toString(36).slice(2, 9)}`;
      const duration = toast.duration ?? 4000;
      setToasts((cur) => [...cur, { ...toast, id }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show, dismiss }}>
      {children}
      {mounted
        ? createPortal(
            <div
              aria-live="polite"
              aria-atomic="false"
              className="fixed z-50 flex flex-col gap-3 w-full max-w-[360px] pointer-events-none top-7 right-7 left-auto md:left-auto md:right-7 md:top-7 max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-auto max-md:bottom-7"
            >
              {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
              ))}
              <style>{`
                @keyframes spark-toast-in {
                  from { opacity: 0; transform: translateY(16px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const variant = toast.variant ?? "info";
  const v = VARIANT_CLASSES[variant];
  const Icon = v.Icon;

  return (
    <div
      role="status"
      className="pointer-events-auto bg-surface rounded-lg shadow-lg flex items-start gap-3 p-4"
      style={{
        animation: "spark-toast-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <span
        className={`inline-flex items-center justify-center w-8 h-8 rounded-pill shrink-0 ${v.bg} ${v.text}`}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-body font-semibold text-text">{toast.title}</div>
        {toast.body ? <div className="text-body-sm text-text-muted mt-1">{toast.body}</div> : null}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onClose}
        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-text-subtle hover:bg-surface-muted hover:text-text transition-colors shrink-0"
      >
        <X size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside a <ToastProvider>");
  }
  return ctx;
}

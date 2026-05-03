"use client";

import { Copy, RefreshCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useAuth, type AuthGateReason } from "@/lib/auth";
import { AVATAR_OPTIONS } from "@/lib/usernameGenerator";

type Step = "email" | "code" | "profile" | "done";

const REASON_HEADLINES: Record<AuthGateReason, { title: string; subtitle: string }> = {
  build: {
    title: "Save your project",
    subtitle: "Create a quick account so we can save what you build. No password needed.",
  },
  remix: {
    title: "Sign in to remix",
    subtitle: "Remixes get credited to you. No password needed — just your email.",
  },
  publish: {
    title: "Sign in to publish",
    subtitle: "Publish to Discover so other kids can play and remix your project.",
  },
  sign_in: {
    title: "Welcome back",
    subtitle: "Just enter your email — we'll send you a 6-digit code.",
  },
};

const DEFAULT_HEADLINE = {
  title: "Welcome to Spark Studio",
  subtitle: "Just your email. No password. We'll send you a 6-digit code.",
};

function emailLooksValid(email: string): boolean {
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

export function AuthModal() {
  // #region agent log
  if (typeof window !== 'undefined') { fetch('http://127.0.0.1:7394/ingest/23981fe7-6960-4080-92f1-749112831cbd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'747a76'},body:JSON.stringify({sessionId:'747a76',hypothesisId:'A',location:'AuthModal.tsx:render',message:'AuthModal render',data:{},timestamp:Date.now()})}).catch(()=>{}); }
  // #endregion
  const auth = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>(undefined);
  const [issuedCode, setIssuedCode] = useState<string | undefined>(undefined);
  const [isReturning, setIsReturning] = useState(false);
  const [busy, setBusy] = useState(false);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const headline = useMemo(() => {
    if (auth.gateReason && REASON_HEADLINES[auth.gateReason]) {
      return REASON_HEADLINES[auth.gateReason];
    }
    return DEFAULT_HEADLINE;
  }, [auth.gateReason]);

  // Reset every time the gate opens.
  useEffect(() => {
    if (auth.isGateOpen) {
      setStep("email");
      setEmail("");
      setEmailError(undefined);
      setCode("");
      setCodeError(undefined);
      setIssuedCode(undefined);
      setIsReturning(false);
      setBusy(false);
    }
  }, [auth.isGateOpen]);

  function close(didSucceed: boolean) {
    auth.closeGate(didSucceed);
  }

  function handleEmailSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    if (!emailLooksValid(email)) {
      setEmailError("That doesn't look like an email yet.");
      return;
    }
    setEmailError(undefined);
    setBusy(true);

    // Simulate a tiny send delay so the UI doesn't jump.
    window.setTimeout(() => {
      const result = auth.requestCode(email);
      setIssuedCode(result.code);
      setIsReturning(result.isReturning);
      setStep("code");
      setBusy(false);
      window.setTimeout(() => codeInputRef.current?.focus(), 50);
    }, 300);
  }

  function handleCodeSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (busy) return;
    if (code.trim().length !== 6) {
      setCodeError("Please enter the 6-digit code.");
      return;
    }
    setCodeError(undefined);
    setBusy(true);

    window.setTimeout(() => {
      const result = auth.verifyAndContinue(email, code);
      if (!result.ok) {
        setBusy(false);
        if (result.reason === "expired") {
          setCodeError("That code expired. Tap Resend to get a new one.");
        } else if (result.reason === "no_code") {
          setCodeError("No code on file. Tap Resend.");
        } else {
          setCodeError("That code didn't match. Try again.");
        }
        return;
      }
      // Success!
      if (result.isNew) {
        // Show the auto-handle confirmation step before closing.
        setStep("profile");
        setBusy(false);
        toast.show({
          variant: "success",
          title: "Email verified",
          body: "We made you a handle — feel free to reroll.",
        });
      } else {
        toast.show({
          variant: "success",
          title: `Welcome back, @${result.account.handle}`,
        });
        setStep("done");
        setBusy(false);
        close(true);
      }
    }, 250);
  }

  function handleResend() {
    if (busy) return;
    const result = auth.requestCode(email);
    setIssuedCode(result.code);
    setIsReturning(result.isReturning);
    setCode("");
    setCodeError(undefined);
    toast.show({ variant: "info", title: "New code sent (demo)" });
  }

  function copyCode() {
    if (!issuedCode) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(issuedCode).catch(() => undefined);
    }
    toast.show({ variant: "info", title: "Code copied" });
  }

  function handleConfirmProfile() {
    if (auth.account) {
      toast.show({
        variant: "success",
        title: `Welcome, @${auth.account.handle}`,
        body: "Your account is ready.",
      });
    }
    close(true);
  }

  return (
    <Modal
      open={auth.isGateOpen}
      onClose={() => close(false)}
      ariaLabel="Sign in"
      size={step === "profile" ? "large" : "default"}
    >
      {step === "email" ? (
        <EmailStep
          headline={headline}
          email={email}
          onEmail={setEmail}
          error={emailError}
          busy={busy}
          onSubmit={handleEmailSubmit}
          onCancel={() => close(false)}
        />
      ) : null}

      {step === "code" ? (
        <CodeStep
          email={email}
          isReturning={isReturning}
          issuedCode={issuedCode}
          code={code}
          onCode={setCode}
          error={codeError}
          busy={busy}
          onSubmit={handleCodeSubmit}
          onResend={handleResend}
          onBack={() => {
            setStep("email");
            setCode("");
            setCodeError(undefined);
          }}
          onCopy={copyCode}
          inputRef={codeInputRef}
        />
      ) : null}

      {step === "profile" ? <ProfileStep onConfirm={handleConfirmProfile} /> : null}
    </Modal>
  );
}

// ---------- Step components ----------

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-h2 text-text mb-2">{title}</h2>
      <p className="text-body text-text-muted">{subtitle}</p>
    </div>
  );
}

function EmailStep({
  headline,
  email,
  onEmail,
  error,
  busy,
  onSubmit,
  onCancel,
}: {
  headline: { title: string; subtitle: string };
  email: string;
  onEmail: (v: string) => void;
  error: string | undefined;
  busy: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <StepHeader title={headline.title} subtitle={headline.subtitle} />
      <Input
        type="email"
        autoComplete="email"
        autoFocus
        inputMode="email"
        label="Email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => {
          // #region agent log
          fetch('http://127.0.0.1:7394/ingest/23981fe7-6960-4080-92f1-749112831cbd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'747a76'},body:JSON.stringify({sessionId:'747a76',hypothesisId:'C',location:'AuthModal.tsx:emailChange',message:'email onChange fired',data:{valueLen:e.target.value.length,activeElLabel:(document.activeElement as HTMLElement)?.getAttribute('aria-label'),activeElTag:(document.activeElement as HTMLElement)?.tagName},timestamp:Date.now()})}).catch(()=>{});
          // #endregion
          onEmail(e.target.value);
        }}
        error={error}
        helper="We only use this to send your sign-in code. No spam."
      />
      <div className="flex items-center gap-3 mt-6 text-body-sm text-text-muted">
        <ShieldCheck size={16} className="text-success" strokeWidth={2} />
        <span>No password. Just a 6-digit code from your email.</span>
      </div>
      <div className="flex items-center justify-end gap-3 mt-7">
        <Button type="button" variant="ghost" size="md" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={busy}
          disabled={!email.trim()}
        >
          {busy ? "Sending…" : "Send code"}
        </Button>
      </div>
    </form>
  );
}

function CodeStep({
  email,
  isReturning,
  issuedCode,
  code,
  onCode,
  error,
  busy,
  onSubmit,
  onResend,
  onBack,
  onCopy,
  inputRef,
}: {
  email: string;
  isReturning: boolean;
  issuedCode: string | undefined;
  code: string;
  onCode: (v: string) => void;
  error: string | undefined;
  busy: boolean;
  onSubmit: (e?: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
  onCopy: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <form onSubmit={onSubmit}>
      <StepHeader
        title="Check your email"
        subtitle={
          isReturning
            ? `Enter the 6-digit code we sent to ${email}.`
            : `We sent a 6-digit code to ${email}. Enter it to continue.`
        }
      />

      {issuedCode ? (
        <div
          className="mb-6 rounded-md bg-highlight-soft p-4 flex items-center gap-3"
          role="note"
          aria-label="Demo verification code"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-pill bg-highlight text-text shrink-0">
            <Sparkles size={16} strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-body-sm text-text font-semibold">Demo mode</div>
            <div className="text-body text-text">
              Your code is{" "}
              <span className="font-mono tracking-widest text-text font-bold">{issuedCode}</span>
            </div>
            <div className="text-tiny text-text-muted mt-1">
              We aren't sending real emails yet — this code is just for the demo.
            </div>
          </div>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1 h-9 px-4 rounded-pill bg-surface text-text-muted hover:text-text hover:bg-surface-muted text-label font-semibold transition-colors shrink-0"
            aria-label="Copy code"
          >
            <Copy size={14} strokeWidth={2} />
            <span>Copy</span>
          </button>
        </div>
      ) : null}

      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6}
        label="6-digit code"
        placeholder="• • • • • •"
        value={code}
        onChange={(e) => onCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
        error={error}
        className="font-mono tracking-[0.4em] text-h3"
      />

      <div className="flex items-center justify-between gap-3 mt-7 flex-wrap">
        <Button type="button" variant="ghost" size="md" onClick={onBack} disabled={busy}>
          ← Use another email
        </Button>
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="md" onClick={onResend} disabled={busy}>
            Resend
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={busy}
            disabled={code.length !== 6}
          >
            {busy ? "Verifying…" : "Verify"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function ProfileStep({ onConfirm }: { onConfirm: () => void }) {
  const auth = useAuth();
  const account = auth.account;
  if (!account) return null;

  return (
    <div>
      <StepHeader
        title="You're in!"
        subtitle="Here's the handle we picked for you. You can reroll it now or change it later in your profile."
      />

      <div className="bg-primary-soft rounded-xl p-7 flex items-center gap-5 mb-6">
        <div
          className="text-6xl w-20 h-20 rounded-pill bg-surface flex items-center justify-center shadow-sm"
          aria-hidden="true"
        >
          {account.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-tiny text-text-muted uppercase tracking-wide font-semibold mb-1">
            Your handle
          </div>
          <div className="font-display text-h2 text-text break-all">@{account.handle}</div>
          <div className="text-body-sm text-text-muted mt-1">{account.email}</div>
        </div>
      </div>

      <label className="block text-body-sm font-semibold text-text mb-2">Avatar</label>
      <div className="flex flex-wrap gap-2 mb-6">
        {AVATAR_OPTIONS.map((emoji) => {
          const active = emoji === account.emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => auth.setAvatar(emoji)}
              className={[
                "w-11 h-11 rounded-pill text-2xl inline-flex items-center justify-center transition-all",
                active
                  ? "bg-primary-soft ring-2 ring-primary scale-105"
                  : "bg-surface-muted hover:bg-primary-soft",
              ].join(" ")}
              aria-pressed={active}
              aria-label={`Choose ${emoji}`}
            >
              <span aria-hidden="true">{emoji}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={() => auth.regenerateHandle()}
          leadingIcon={<RefreshCcw size={16} strokeWidth={2} />}
        >
          Reroll handle
        </Button>
        <Button type="button" variant="primary" size="md" onClick={onConfirm}>
          Looks good
        </Button>
      </div>
    </div>
  );
}

export default AuthModal;

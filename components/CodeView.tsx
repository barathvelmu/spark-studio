"use client";

import { useId, useMemo, useState, type JSX, type KeyboardEvent } from "react";

export type CodeFile = "html" | "css" | "js";

export type CodeViewProps = {
  codeHtml: string;
  codeCss: string;
  codeJs: string;
  activeFile?: CodeFile;
  onActiveFileChange?: (f: CodeFile) => void;
  highlightLines?: { file: CodeFile; lines: number[] };
  onAskAboutLine?: (file: CodeFile, line: number) => void;
};

type Token = { text: string; cls?: string };

const FILES: ReadonlyArray<{ id: CodeFile; label: string }> = [
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "js", label: "JS" },
];

const KEYWORDS = new Set([
  "let", "const", "var", "function", "if", "else", "return",
  "for", "while", "document", "true", "false", "null",
]);

// Tokenize a single line into typed spans. Order: comments → strings →
// numbers → keywords → function calls → HTML tag names → plain.
function tokenizeLine(line: string, file: CodeFile): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = line.length;

  const pushPlain = (s: string) => {
    if (s) tokens.push({ text: s });
  };

  // Whole-line comment for HTML/CSS/JS block remnants is handled inline below.
  // Detect a leading `//` line comment quickly.
  const ltrim = line.trimStart();
  if (file === "js" && ltrim.startsWith("//")) {
    return [{ text: line, cls: "text-code-comment italic" }];
  }

  let buf = "";
  while (i < n) {
    const ch = line[i];
    const next = line[i + 1];

    // /* ... */ block comment fragment on this line
    if (ch === "/" && next === "*") {
      pushPlain(buf);
      buf = "";
      const end = line.indexOf("*/", i + 2);
      const stop = end === -1 ? n : end + 2;
      tokens.push({ text: line.slice(i, stop), cls: "text-code-comment italic" });
      i = stop;
      continue;
    }

    // <!-- ... --> HTML comment fragment on this line
    if (ch === "<" && line.startsWith("<!--", i)) {
      pushPlain(buf);
      buf = "";
      const end = line.indexOf("-->", i + 4);
      const stop = end === -1 ? n : end + 3;
      tokens.push({ text: line.slice(i, stop), cls: "text-code-comment italic" });
      i = stop;
      continue;
    }

    // // line comment within JS line
    if (file === "js" && ch === "/" && next === "/") {
      pushPlain(buf);
      buf = "";
      tokens.push({ text: line.slice(i), cls: "text-code-comment italic" });
      i = n;
      continue;
    }

    // Strings: ' " `
    if (ch === '"' || ch === "'" || ch === "`") {
      pushPlain(buf);
      buf = "";
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        if (line[j] === "\\" && j + 1 < n) { j += 2; continue; }
        if (line[j] === quote) { j++; break; }
        j++;
      }
      tokens.push({ text: line.slice(i, j), cls: "text-code-string" });
      i = j;
      continue;
    }

    // HTML tag: <tag or </tag
    if (file === "html" && ch === "<" && (/[a-zA-Z/]/.test(next ?? ""))) {
      pushPlain(buf);
      buf = "";
      // emit '<' or '</'
      let j = i + 1;
      let prefix = "<";
      if (line[j] === "/") { prefix = "</"; j++; }
      tokens.push({ text: prefix });
      const start = j;
      while (j < n && /[a-zA-Z0-9-]/.test(line[j]!)) j++;
      if (j > start) {
        tokens.push({ text: line.slice(start, j), cls: "text-code-keyword font-semibold" });
      }
      i = j;
      continue;
    }

    // Numbers (integer / decimal) when not part of an identifier
    if (/[0-9]/.test(ch) && !/[a-zA-Z_]/.test(line[i - 1] ?? "")) {
      pushPlain(buf);
      buf = "";
      let j = i;
      while (j < n && /[0-9.]/.test(line[j]!)) j++;
      tokens.push({ text: line.slice(i, j), cls: "text-code-number" });
      i = j;
      continue;
    }

    // Identifier (keyword / function call / plain)
    if (/[a-zA-Z_$@]/.test(ch)) {
      pushPlain(buf);
      buf = "";
      let j = i;
      while (j < n && /[a-zA-Z0-9_$-]/.test(line[j]!)) j++;
      const word = line.slice(i, j);
      const bare = word.startsWith("@") ? word.slice(1) : word;
      const isCssAtRule = file === "css" && word.startsWith("@");
      if (KEYWORDS.has(bare) || isCssAtRule) {
        tokens.push({ text: word, cls: "text-code-keyword font-semibold" });
      } else if (line[j] === "(") {
        tokens.push({ text: word, cls: "text-code-function" });
      } else {
        tokens.push({ text: word });
      }
      i = j;
      continue;
    }

    buf += ch;
    i++;
  }
  pushPlain(buf);
  return tokens;
}

export function CodeView(props: CodeViewProps): JSX.Element {
  const {
    codeHtml,
    codeCss,
    codeJs,
    activeFile,
    onActiveFileChange,
    highlightLines,
    onAskAboutLine,
  } = props;

  const [internalFile, setInternalFile] = useState<CodeFile>("html");
  const current: CodeFile = activeFile ?? internalFile;
  const tablistId = useId();

  const setFile = (f: CodeFile) => {
    if (activeFile === undefined) setInternalFile(f);
    onActiveFileChange?.(f);
  };

  const source = current === "html" ? codeHtml : current === "css" ? codeCss : codeJs;

  const lines = useMemo(() => source.split("\n"), [source]);
  const tokenized = useMemo(
    () => lines.map((l) => tokenizeLine(l, current)),
    [lines, current],
  );

  const highlightSet = useMemo(() => {
    if (!highlightLines || highlightLines.file !== current) return new Set<number>();
    return new Set(highlightLines.lines);
  }, [highlightLines, current]);

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const nextIdx = (idx + dir + FILES.length) % FILES.length;
      setFile(FILES[nextIdx]!.id);
      const root = document.getElementById(tablistId);
      const btn = root?.querySelectorAll<HTMLButtonElement>("[role='tab']")[nextIdx];
      btn?.focus();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setFile(FILES[idx]!.id);
    }
  };

  const gutterCh = String(lines.length).length;

  return (
    <div className="w-full">
      {/* Tab strip */}
      <div
        id={tablistId}
        role="tablist"
        aria-label="Source files"
        className="inline-flex items-center bg-surface-muted rounded-pill p-1 mb-4"
      >
        {FILES.map((f, idx) => {
          const active = current === f.id;
          return (
            <button
              key={f.id}
              role="tab"
              type="button"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => setFile(f.id)}
              onKeyDown={(e) => onTabKeyDown(e, idx)}
              className={[
                "rounded-pill px-5 py-3 text-label transition-colors",
                active
                  ? "bg-surface shadow-sm text-text"
                  : "text-text-muted hover:text-text",
              ].join(" ")}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Code area */}
      <div
        className="bg-code-bg text-code-text rounded-xl p-6 font-mono text-code max-h-[480px] overflow-auto overflow-x-auto"
        aria-live="polite"
      >
        <pre className="m-0">
          <code className="block">
            {tokenized.map((tokens, idx) => {
              const lineNo = idx + 1;
              const isHi = highlightSet.has(lineNo);
              return (
                <div
                  key={lineNo}
                  className={[
                    "group relative flex items-start whitespace-pre",
                    "border-l-[3px] pl-3 -mx-3",
                    isHi
                      ? "bg-code-line-highlight border-primary"
                      : "border-transparent",
                  ].join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className="select-none text-text-subtle pr-4 text-right"
                    style={{ minWidth: `${Math.max(2, gutterCh)}ch` }}
                  >
                    {lineNo}
                  </span>
                  <span className="flex-1 min-w-0">
                    {tokens.length === 0 ? (
                      <span> </span>
                    ) : (
                      tokens.map((t, ti) => (
                        <span key={ti} className={t.cls}>
                          {t.text}
                        </span>
                      ))
                    )}
                  </span>
                  {onAskAboutLine && (
                    <button
                      type="button"
                      onClick={() => onAskAboutLine(current, lineNo)}
                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity bg-primary-soft text-primary rounded-pill px-3 h-7 text-tiny font-semibold ml-3 sticky right-2 self-center"
                      aria-label={`Ask about line ${lineNo}`}
                    >
                      Ask about this
                    </button>
                  )}
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeView;

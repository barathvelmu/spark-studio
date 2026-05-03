import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          pressed: "var(--color-primary-pressed)",
          soft: "var(--color-primary-soft)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
        },
        highlight: {
          DEFAULT: "var(--color-highlight)",
          soft: "var(--color-highlight-soft)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          soft: "var(--color-success-soft)",
        },
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
        bg: "var(--color-bg)",
        surface: {
          DEFAULT: "var(--color-surface)",
          muted: "var(--color-surface-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
        },
        code: {
          bg: "var(--code-bg)",
          text: "var(--code-text)",
          keyword: "var(--code-keyword)",
          string: "var(--code-string)",
          number: "var(--code-number)",
          comment: "var(--code-comment)",
          function: "var(--code-function)",
          "line-highlight": "var(--code-line-highlight)",
        },
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 2px 4px rgba(44, 24, 16, 0.06)",
        md: "0 6px 16px rgba(44, 24, 16, 0.08), 0 2px 4px rgba(44, 24, 16, 0.04)",
        lg: "0 16px 32px rgba(44, 24, 16, 0.10), 0 4px 8px rgba(44, 24, 16, 0.06)",
        xl: "0 24px 48px rgba(44, 24, 16, 0.14), 0 8px 16px rgba(44, 24, 16, 0.08)",
        press: "0 1px 0 rgba(44, 24, 16, 0.10)",
      },
      fontFamily: {
        display: ["var(--font-nunito)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: ["3.5rem", { lineHeight: "1.05", fontWeight: "800" }],
        h1: ["2.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        h2: ["1.75rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["1.375rem", { lineHeight: "1.3", fontWeight: "700" }],
        h4: ["1.125rem", { lineHeight: "1.35", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.55", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.55", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5", fontWeight: "400" }],
        label: ["0.8125rem", { lineHeight: "1.3", fontWeight: "600" }],
        tiny: ["0.75rem", { lineHeight: "1.3", fontWeight: "500" }],
        code: ["0.875rem", { lineHeight: "1.65", fontWeight: "400" }],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "7": "32px",
        "8": "40px",
        "9": "56px",
        "10": "80px",
        "11": "120px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
        quick: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      maxWidth: {
        page: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;

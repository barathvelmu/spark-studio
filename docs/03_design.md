# design.md — Spark Studio Visual & Interaction Spec

> This file is the **visual contract** for Spark Studio. Claude Code must follow the tokens, type scale, spacing, radii, and component patterns defined here. Use these values directly — do not invent new ones. When a situation is not covered, follow the **Principles** at the top and ask before introducing new tokens.

---

## 1. Principles (the lens for every decision)

1. **Playful, never childish.** Soft and bright, but with the precision of a real creative tool. If it would look at home in Canva or Linear, it's right. If it would look at home in a 2008 kids' learning CD, it's wrong.
2. **Spacious before clever.** Generous padding and whitespace beat decoration. When in doubt, add more space.
3. **Pillowy, not flat, not skeuomorphic.** Rounded corners (20–32px), soft chunky shadows, no glassmorphism, no neumorphism, no gradients-on-everything.
4. **Show the code with respect.** The Code tab is a first-class surface. It is monospaced, syntax-highlighted, calm — never hidden or condescended to.
5. **Every surface earns its emoji.** Use emoji for *project templates* and *empty states*. Do not sprinkle them through the chrome.
6. **Motion is reward, not decoration.** Spring easings on user-initiated actions (build, remix, publish). Quiet fades on incidental UI.
7. **Kid-safe by visible default.** Safety badges, structured reactions, and "Safety checked" labels appear *on* the UI, not hidden in settings.

**Never do:**
- Dense IDE chrome, multi-toolbar layouts, gray-on-gray panels.
- Comic Sans, Papyrus, or any heavily-stylized display font.
- Open text inputs for social interaction (only structured reactions).
- Skeuomorphic 3D or "kiddie" cartoon gradients (rainbow buttons, glossy beveled edges).
- Jargon: *repository, commit, branch, PR, deploy, framework*.

---

## 2. Color tokens

All colors as both `hex` and CSS custom property name. Use the property names in code.

### Brand
| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#6366F1` | Primary buttons, active tab underline, focus ring base |
| `--color-primary-hover` | `#4F46E5` | Primary button hover |
| `--color-primary-pressed` | `#4338CA` | Primary button active |
| `--color-primary-soft` | `#EEF2FF` | Primary button ghost bg, selected card bg |
| `--color-accent` | `#38BDF8` | Sky-blue accent — links, secondary highlights |
| `--color-accent-soft` | `#E0F2FE` | Accent chip bg |
| `--color-highlight` | `#FACC15` | Warm yellow — sparkle/celebration moments only |
| `--color-highlight-soft` | `#FEF9C3` | Highlight chip bg |

### Semantic
| Token | Hex | Use |
|---|---|---|
| `--color-success` | `#22C55E` | "Safety checked", learning concepts, success toast |
| `--color-success-soft` | `#DCFCE7` | Success badge bg |
| `--color-warning` | `#F59E0B` | Caution toast (rare) |
| `--color-danger` | `#EF4444` | Destructive only — delete confirmation |
| `--color-info` | `#0EA5E9` | Info toast |

### Neutrals (slightly cool, never pure gray)
| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#FAFAFF` | Page background (a hair of lavender) |
| `--color-surface` | `#FFFFFF` | Cards, panels, modals |
| `--color-surface-muted` | `#F4F4FB` | Code viewer bg, input bg |
| `--color-border` | `#E5E7F0` | Default border |
| `--color-border-strong` | `#CBD0E0` | Hovered/focused border |
| `--color-text` | `#1E1B4B` | Body text (deep indigo-black, not pure black) |
| `--color-text-muted` | `#5B5F7A` | Secondary text, captions |
| `--color-text-subtle` | `#8B90A8` | Placeholders, disabled |

### Code viewer palette (single, always-light theme)
| Token | Hex | Use |
|---|---|---|
| `--code-bg` | `#F8F8FC` | Editor background |
| `--code-text` | `#1E1B4B` | Default text |
| `--code-keyword` | `#6366F1` | `if`, `function`, `let`, `const` |
| `--code-string` | `#22C55E` | String literals |
| `--code-number` | `#F59E0B` | Number literals |
| `--code-comment` | `#8B90A8` | Comments |
| `--code-function` | `#0EA5E9` | Function names |
| `--code-line-highlight` | `#EEF2FF` | "Look here" line highlight |

**Rule:** No new colors. If a state needs emphasis, use an existing soft variant (e.g. `primary-soft`).

---

## 3. Typography

### Families
- **Display / UI headings:** `"Nunito", system-ui, sans-serif` — weights 600, 700, 800. Rounded, friendly.
- **Body / UI text:** `"Inter", system-ui, sans-serif` — weights 400, 500, 600.
- **Code:** `"JetBrains Mono", "Fira Code", ui-monospace, monospace` — weight 400, 500.

Load via `next/font` (preferred) or Google Fonts. Always set `font-display: swap`.

### Type scale (px / rem)
| Token | Size | Line | Weight | Family | Use |
|---|---|---|---|---|---|
| `text-display` | 56 / 3.5rem | 1.05 | 800 | Nunito | Hero headline only |
| `text-h1` | 40 / 2.5rem | 1.1 | 700 | Nunito | Page title |
| `text-h2` | 28 / 1.75rem | 1.2 | 700 | Nunito | Section title |
| `text-h3` | 22 / 1.375rem | 1.3 | 700 | Nunito | Card title, modal title |
| `text-h4` | 18 / 1.125rem | 1.35 | 600 | Nunito | Subsection |
| `text-body-lg` | 18 / 1.125rem | 1.55 | 400 | Inter | Lead paragraph, marketing |
| `text-body` | 16 / 1rem | 1.55 | 400 | Inter | Default |
| `text-body-sm` | 14 / 0.875rem | 1.5 | 400 | Inter | Captions, helper |
| `text-label` | 13 / 0.8125rem | 1.3 | 600 | Inter | Buttons, tabs, chips (uppercase optional) |
| `text-tiny` | 12 / 0.75rem | 1.3 | 500 | Inter | Metadata |
| `text-code` | 14 / 0.875rem | 1.65 | 400 | JetBrains Mono | Code viewer |

Never go below 14px for body. Never bold body text mid-sentence; use a chip or callout instead.

---

## 4. Spacing, radius, shadow

### Spacing scale (4px base)
`0, 4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 120` — exposed as `--space-1` through `--space-12`. Use **only** these.

### Radius
| Token | Px | Use |
|---|---|---|
| `--radius-sm` | 8 | Chips, small badges |
| `--radius-md` | 16 | Inputs, small buttons |
| `--radius-lg` | 24 | Buttons (default), cards |
| `--radius-xl` | 32 | Large cards, modals, panels |
| `--radius-pill` | 999 | Tabs (active pill), reaction buttons |

Pillowy is the rule — cards and buttons default to `--radius-lg` (24px) or larger.

### Shadow (chunky and soft, never tight)
```css
--shadow-sm: 0 2px 4px rgba(30, 27, 75, 0.06);
--shadow-md: 0 6px 16px rgba(30, 27, 75, 0.08), 0 2px 4px rgba(30, 27, 75, 0.04);
--shadow-lg: 0 16px 32px rgba(30, 27, 75, 0.10), 0 4px 8px rgba(30, 27, 75, 0.06);
--shadow-xl: 0 24px 48px rgba(30, 27, 75, 0.14), 0 8px 16px rgba(30, 27, 75, 0.08);
--shadow-press: 0 1px 0 rgba(30, 27, 75, 0.10);  /* button "pressed" inset */
```

Cards default to `--shadow-md`; on hover lift to `--shadow-lg` and translate `-2px` Y.

### Borders
1px default. Cards usually rely on shadow alone (no border) on white surfaces; add a 1px `--color-border` only when card sits on white-on-white.

---

## 5. Motion

Bouncy, but tasteful. Use **spring easings** for user-initiated actions, **smooth easings** for incidental UI.

### Easings
```css
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);   /* slight overshoot */
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);      /* clean ease-out */
--ease-quick:  cubic-bezier(0.4, 0, 0.2, 1);        /* default */
```

### Durations
- **120ms** — hover/focus state changes
- **200ms** — small UI transitions (toast slide-in, chip selection)
- **320ms** — modal/sheet open, tab content swap
- **500ms** — celebration moments (publish, remix complete)

### Patterns
- **Buttons:** 120ms color, 1.5px Y lift on hover, 0.97 scale on press, spring easing.
- **Cards:** 200ms shadow + Y(-2px) on hover, smooth easing.
- **Modals:** 320ms scale 0.96→1 + opacity, spring easing.
- **Toasts:** 200ms slide-up + fade.
- **Celebrations** (publish, first remix): a brief 500ms scale-up with `--color-highlight` confetti or sparkle. Use sparingly.

Respect `prefers-reduced-motion` — fall back to opacity-only transitions.

---

## 6. Layout

### Container
- Page max-width: **1200px**, centered, `--space-7` (32px) horizontal padding mobile, `--space-9` (56px) desktop.
- Builder page is full-bleed, three-column.

### Builder three-panel layout
| Panel | Width (desktop ≥1280px) | Notes |
|---|---|---|
| Left (prompt + controls) | 360px fixed | `--color-surface` panel, `--radius-xl` |
| Center (preview) | flex 1 | Light checkered or `--color-bg` backdrop, project card centered |
| Right (Learn / Code summary) | 380px fixed | `--color-surface` panel, sticky on scroll |

Below 1100px: stack as cards in this order — Prompt, Preview, Learn.

### Project Detail
Top-of-page tab strip (Play / Code / Learn / Ask the Code as panel within Code).
Tabs are pill-style (see Components).

### Grid for cards
- Discover & Idea Wall: CSS grid `repeat(auto-fill, minmax(280px, 1fr))`, gap `--space-7` (32px).

---

## 7. Components

### 7.1 Buttons

Three variants. Sizes: `sm` (h 36), `md` (h 44, default), `lg` (h 52).

**Primary** — main action ("Start Building", "Remix this", "Publish")
- bg `--color-primary`, text white, weight 700, `--radius-lg`.
- Hover: bg `--color-primary-hover`, lift Y(-1.5px), `--shadow-md`.
- Press: bg `--color-primary-pressed`, `--shadow-press`, scale 0.97.
- Disabled: bg `--color-text-subtle`, no shadow, cursor not-allowed.

**Secondary** — alternate action ("Explore Projects")
- bg `--color-surface`, border 1.5px `--color-border-strong`, text `--color-text`, weight 700.
- Hover: bg `--color-primary-soft`, border `--color-primary`.

**Ghost** — tertiary, in toolbars
- bg transparent, text `--color-text-muted`, weight 600.
- Hover: bg `--color-surface-muted`, text `--color-text`.

Padding: `0 24px` md, `0 20px` sm, `0 32px` lg. Gap to icon `--space-3` (12px).

### 7.2 Inputs & textareas

- Height 48px (input), min 96px (textarea). `--radius-md` (16px).
- bg `--color-surface-muted`, border 1.5px transparent.
- Focus: bg `--color-surface`, border `--color-primary`, ring `0 0 0 4px rgba(99, 102, 241, 0.15)`.
- Placeholder `--color-text-subtle`.
- Label sits *above*, weight 600, `--space-2` (8px) gap, `text-body-sm` size.
- Helper text below in `text-tiny`, `--color-text-muted`. Errors swap to `--color-danger`.
- The Idea Wall's main prompt input is a giant textarea: 64px min height, 24px text, full-width, with a Build button anchored bottom-right inside.

### 7.3 Project Card

Anatomy (top to bottom):
1. **Thumbnail block** — 16:9, `--radius-xl` top corners only, content depends on state:
   - *Template/empty:* big centered emoji on a soft gradient (one of: indigo, sky, mint, peach, lavender — randomly assigned per project, stable by project id).
   - *Built project:* live screenshot of the Play preview.
2. **Body** — `--space-5` (20px) padding.
   - **Title** `text-h3`.
   - **Description** `text-body-sm`, `--color-text-muted`, max 2 lines, ellipsis.
   - **Concept chips row** — up to 3 visible, "+N" overflow chip if more.
   - **Meta row** — creator handle (with small avatar dot), remix count (`🌱 12 remixes`), all `text-tiny` `--color-text-muted`.
3. **Footer** — `--space-4` (16px) horizontal padding, `--space-3` (12px) vertical.
   - Left: Safety badge.
   - Right: Remix button (secondary, sm).

Card itself: `--color-surface`, `--radius-xl`, `--shadow-md`. Hover: `--shadow-lg`, translate Y(-2px), 200ms.

### 7.4 Tabs (Play / Code / Learn)

Pill-on-rail style.
- Container: `--color-surface-muted` rounded `--radius-pill` rail, `--space-1` (4px) inner padding.
- Each tab: `--radius-pill`, `--space-3 --space-5` padding, `text-label` weight 600.
- Active tab: `--color-surface` bg, `--shadow-sm`, text `--color-text`.
- Inactive: text `--color-text-muted`, hover text `--color-text`.
- Animate the active pill with `layoutId` (Framer) or a CSS transform sliding 200ms `--ease-spring`.

### 7.5 Badges & Concept Chips

**Safety badge** (always visible on cards and project header)
- Shape: pill, h 24, `--space-3` horizontal padding.
- bg `--color-success-soft`, text `--color-success`, weight 600, `text-tiny`.
- Leading icon: small ✓ in a circle (Lucide `ShieldCheck` works).
- Copy: "Safety checked".

**Concept chip**
- Pill, h 26, weight 600, `text-tiny`.
- Each concept gets a stable color pairing:
  - Variables → `primary-soft` / `primary`
  - Loops → `accent-soft` / `accent`
  - Events → `highlight-soft` / `#A16207`
  - Conditionals → `success-soft` / `success`
  - Collision → mauve `#F3E8FF` / `#7C3AED`
  - Score → peach `#FFEDD5` / `#C2410C`
  - Branching → mint `#CCFBF1` / `#0F766E`
- Never invent new concept colors — extend the table here.

**Reaction button** (structured reactions, no open comments)
- Pill, h 36, ghost style, leading emoji + label.
- Active state: `--color-primary-soft` bg, `--color-primary` text, scale-up bounce 200ms on click.
- Set: 💡 Inspired me · 🔁 I remixed this · ✨ Cool idea · 🎨 Great design · 🧠 Smart logic · 📚 I learned from this.

### 7.6 Modal / Dialog

- Centered, max-width 520px (default) / 720px (large).
- `--color-surface`, `--radius-xl` (32px), `--shadow-xl`.
- Padding `--space-8` (40px).
- Backdrop: `rgba(30, 27, 75, 0.40)`, 200ms fade.
- Open animation: 320ms scale 0.96→1 + opacity, `--ease-spring`.
- Close affordance: ghost icon button top-right (`X`), 40×40 hit target.
- Title `text-h3`, body `text-body`, action row right-aligned with `--space-3` gap, primary on the right.

### 7.7 Empty / Loading / Error states

**Empty** — always has all three:
1. A large emoji or simple SVG illustration (96–120px).
2. A friendly headline (`text-h3`) — voice = playful curious. e.g. "Nothing here yet — let's make something!"
3. A primary CTA.
Center-aligned in a card, `--space-9` (56px) vertical padding.

**Loading**
- Skeletons, never spinners on cards. Use `--color-surface-muted` blocks at the actual sizes/radii of the content.
- Shimmer: 1.4s linear, gradient sweep, 8% opacity.
- Generation/AI loading: a dedicated state — small floating card in center of preview saying "Building your project…" with a bouncing dot trio (3 dots, scale 0.7→1 staggered 120ms, infinite).

**Error**
- Soft, never alarming. `--color-danger` reserved for actual destructive problems.
- For most failures: card with 🤔 emoji, headline "Hmm, that didn't work", body explaining briefly, primary "Try again" + secondary "Back".

### 7.8 Toasts / confirmations

- Bottom-center on mobile, top-right on desktop, `--space-7` from edge.
- 360px max width, `--radius-lg`, `--shadow-lg`, `--color-surface`.
- Leading icon in a 32×32 colored circle (success/info/warning/danger soft bg).
- Title `text-body` weight 600, optional body `text-body-sm` muted.
- Auto-dismiss 4s default, hover pauses, swipe/X to dismiss.
- Animation: 200ms slide 16px + fade, `--ease-spring`.

### 7.9 Code viewer

- bg `--code-bg`, `--radius-xl`, padding `--space-6` (24px), `text-code`.
- Line numbers in `--color-text-subtle`, right-aligned, `--space-4` gutter.
- "Look here" highlight: `--code-line-highlight` row bg, 3px `--color-primary` left border on that row only.
- Hover any line → tiny "Ask about this" button slides in on the right edge of the row.
- No raw scrollbars — use overlay scrollbars styled to `--color-border`.
- For beginner-friendly snippets, supplement with **annotations**: callouts in `--color-primary-soft` cards in the right gutter, with a hairline connector to the line they describe.

### 7.10 Ask the Code panel

- Right-side panel inside the Code tab; full-height on desktop, sheet on mobile.
- Header: `text-h3` "Ask the code", subtitle muted "I only know about *this* project."
- Suggested questions appear as **chip buttons** in a wrapping row: "What does this line do?" · "How does the score work?" · "How can I make it harder?"
- Conversation: alternating bubbles.
  - User bubble: right-aligned, `--color-primary-soft` bg, `--color-text`, `--radius-xl` (mask bottom-right corner to `--radius-sm`).
  - Assistant bubble: left-aligned, `--color-surface` bg, `--shadow-sm`, same radius treatment mirrored.
  - Code references inside answers: inline `code` chip with `--code-bg`, `--radius-sm`, monospace, that on click highlights the line in the viewer.
- Input pinned bottom: same as 7.2 input style, with a Send icon button (primary) at right.
- Empty state: warm, "Ask me anything about this project's code 👇" with three chip suggestions.

---

## 8. Iconography

- **Library:** Lucide (lucide-react). Stroke 1.75px. Size 20px in body, 16px in chips, 24px in headers.
- **Color:** match surrounding text color or `--color-text-muted` for decorative.
- **Never** mix icon styles. No emoji *in* button labels (use icon + label) — emoji are for thumbnails, reactions, and empty states only.

---

## 9. Illustration / thumbnails

- **Templates / unbuilt projects:** centered emoji (96px) on a soft 2-stop gradient. Five gradient presets, picked stably by project id:
  - Indigo: `linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)`
  - Sky: `linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)`
  - Mint: `linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)`
  - Peach: `linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)`
  - Lavender: `linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)`
- **Built projects:** live screenshot at 16:9, fit cover. Add a 1px inner shadow `inset 0 0 0 1px rgba(30,27,75,0.04)` to give it a subtle frame.

Never auto-generate AI illustrations as decorative chrome. Real screenshots > generated images for built projects.

---

## 10. Voice & copy

Mix three tones, by surface:

| Surface | Tone | Example |
|---|---|---|
| Hero / marketing | Warm + encouraging | "Make something only you would think of." |
| Idea Wall, prompts | Playful + curious | "What do you want to make?" "Let's see what happens!" |
| Builder progress | Calm + clear | "Building your project…" "Your project is ready." |
| Empty states | Playful + curious | "Nothing here yet — let's make something!" |
| Errors | Calm + clear, never blamey | "Hmm, that didn't work. Want to try again?" |
| Celebration (publish) | Warm + encouraging | "Nice one! It's live on Discover." |
| Code tab / Learn | Calm + clear, beginner-friendly | "This line keeps track of the score." |

**Words we use:** make, build, play, remix, idea, project, code, ask, learn, try, share.
**Words we avoid:** repository, commit, branch, PR, deploy, ship, framework, instance, runtime, environment.
**Sentence length:** ≤ 14 words for kid-facing UI strings.

---

## 11. Accessibility

- Color contrast: text on bg ≥ 4.5:1 for body, ≥ 3:1 for large headings. Verified for the tokens above on `--color-bg` and `--color-surface`.
- Focus ring: 4px `rgba(99, 102, 241, 0.35)` halo + 2px `--color-primary` inner — visible on **every** interactive element.
- Hit targets: minimum 44×44px.
- Respect `prefers-reduced-motion` (see Motion).
- Reaction buttons and tabs operable with keyboard (Tab, Enter/Space, arrow keys for tab strip).
- Code viewer: line numbers as `aria-hidden`, code as plain text for screen readers, highlights announced via `aria-live="polite"` only on user-triggered "look here".

---

## 12. Implementation notes for Claude Code

- Use **Tailwind** with these tokens mapped in `tailwind.config.ts` under `theme.extend.colors`, `borderRadius`, `boxShadow`, `fontFamily`, `fontSize`, `spacing` — **don't use Tailwind defaults for these.**
- Mirror tokens in a `tokens.css` (CSS variables) so non-Tailwind contexts (code viewer themes, embeds) can read them.
- Component library: build small, headless-style primitives in `components/ui/*`. Don't pull in shadcn defaults wholesale; their radii/shadows are too tight for this brand.
- Before adding any new color, font size, radius, or shadow value: **stop and ask.** If the answer is "we need a new token," update this file *first*, then code.

---

## 13. Quick reference cheat sheet

```
Primary CTA:    bg-primary, text-white, radius-lg, shadow-md, weight 700
Card:           bg-surface, radius-xl, shadow-md, hover lift -2px shadow-lg
Tab (active):   bg-surface, radius-pill, shadow-sm, in muted rail
Chip:           radius-pill, text-tiny weight 600, soft semantic bg
Modal:          radius-xl, shadow-xl, padding space-8, scale-in spring 320ms
Input:          bg-surface-muted, radius-md, focus ring primary 4px halo
Code:           bg code-bg, radius-xl, JetBrains Mono 14/24
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## UI/UX & Copywriting Directive: Design Like a Grounded Human Product Designer

You are designing and building a real product for real, everyday people—including non-technical users, clients, and customers. You must strictly avoid "AI-slop" and "vibecoded" aesthetics.

### 1. Banned "Vibecoded" Tropes (Never Do These)
- **No Sci-Fi / Hacker / Terminal Cosplay:** Do not use `// SLASHES`, `[BRACKETED LABELS]`, monospace serial numbers (`01`, `02`, `SYS_ONLINE`), fake command bars, or "mission control" jargon unless the product is literally a CLI tool.
- **No Pulsing Dots & Fake Live Tickers:** Do not add glowing green status dots (`● 24 AUDITED CANDIDATES`, `LAST SYNCED: 09:42 UTC`, `⚡ 99.9% VELOCITY`) or fake real-time telemetry strips to make a static page look busy.
- **No Made-Up Marketing Buzzwords:** Never invent pompous labels like *"Stack DNA"*, *"Production-Ready Architects"*, *"Dossier Viewport"*, *"Neural Engine"*, or *"Deploy Intro Request"*.
- **No Badge & Pill Clutter:** Do not stack 4–5 tiny badges, holographic stamps, glowing borders, and status chips on a single card. If everything is highlighted, nothing is readable.
- **No Generic AI Gradient Slop:** Avoid dark-mode neon purple/cyan glows, glassmorphism overload, floating 3D blobs, or centered hero sections with three generic Lucide-icon feature boxes below them.

### 2. Write Plain, Human Copy
- **Pass the "Read It Out Loud" Test:** Every headline, button, and label should sound like something a normal person would actually say in conversation.
  - *Bad (AI):* `DEPLOY TALENT ACQUISITION REQUEST ➔`
  - *Good (Human):* `Request an introduction`
  - *Bad (AI):* `VERIFIED BUILDERS · PRODUCTION-READY ARCHITECTS`
  - *Good (Human):* `Hire trained tech talent from NitHub.`
- **Explain Value Simply:** A non-technical business owner or HR manager should understand what the page does and what to click within 3 seconds, without knowing developer slang.

### 3. Visual Restraint & Hierarchy
- **Let Whitespace and Typography Work:** Use generous padding, clean white or warm neutral surfaces, and strong typographic contrast instead of decorative boxes and borders.
- **Strict Color Discipline:**
  - 80–85% of the screen should be calm neutral surfaces (white, off-white, soft grey).
  - 10–15% should be your primary dark anchor color (`#0D1836`) for sharp, legible typography and key structural surfaces.
  - 5% should be your accent color (`#27a810` / `#62cf3a`)—reserved strictly for primary buttons, active states, and the single most important action on the screen.
- **One Primary Action Per Component:** A card or section should have one obvious primary action, not five competing buttons, icons, and toggles.

### 4. Grounded Component Design
- **Real-World Inspiration:** Benchmark your layouts against mature, human-crafted editorial and product sites (e.g., Read.cv, Contra, Stripe Press, Airbnb, Notion, GOV.UK)—not Dribbble sci-fi concept art.
- **Prioritize Real Content:** Show real faces, clear project screenshots, plain-English one-line descriptions, and straightforward navigation. Get the UI out of the way of the content.
- **Familiar Patterns Over Gimmicks:** Use filters, forms, drawers, and buttons that behave the way normal web users already expect. Never rename a simple cart, shortlist, or contact form into a "Squad Dock" or "Command Matrix".

Before proposing or coding any screen, ask yourself: *"Would a thoughtful human designer at a real company ship this to non-technical customers, or does this look like an AI trying to look clever?"* If it looks like AI trying to look clever, strip it back by 50%.

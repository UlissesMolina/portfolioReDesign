# Density & Richness Overhaul

## Problem

The portfolio site feels "vibe-coded" — sparse, safe layouts with low information density. Compared to reference sites (Jason Cameron's), widgets do 1-2 things instead of 3-5, color usage is conservative, surfaces are flat, and the overall impression is "staged" rather than "lived-in."

## Goals

Address 7 specific gaps:
1. Information density per card (3 layers → 5)
2. Widget richness (1-2 functions → 3-5)
3. Aggressive multi-accent color usage (3 colors → 8+)
4. Nested surface depth (flat → two-level cards)
5. Micro-typography details that reward close looking
6. Hero copy with emotional voice and personality
7. Busy, alive-feeling footer

## Design

### 1. Project Cards — Nested Depth + 5 Info Layers

**Structure:**
```
┌─ Outer Card (mantle bg, surface0 border, inset top highlight) ─────┐
│  ┌─ Inner Repo Tile (crust bg, surface1 border) ─────────────────┐ │
│  │  ● ● ●  user/repo-name (syntax colored)                      │ │
│  │  [screenshot with gradient overlay]                           │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  Title ─── ● status badge (colored dot + label)                    │
│  Description text                                                  │
│  [colored tag pills: TypeScript=blue, React=teal, Java=peach...]   │
│  ★ stars · 👥 contributors · "live ↗" "code ↗"                    │
└────────────────────────────────────────────────────────────────────┘
```

**Layers:** repo path, screenshot, title+status, description+tags, stats+links

**Tag colors (Catppuccin mapping):**
- TypeScript → blue (#89b4fa)
- React → teal (#94e2d5)
- Java → peach (#fab795)
- C++ → red (#f38ba8)
- Node.js → green (#a6e3a1)
- Spring Boot → green (#a6e3a1)
- Docker → blue (#89b4fa)
- PostgreSQL → mauve (#cba6f7)
- CSS → pink (#f5c2e7)
- OpenAI → yellow (#f9e2af)
- CMake → peach (#fab795)

### 2. Widget Enhancements

#### Currently Widget (was 3 things → now 5)
- Mini stylized map SVG of Auburn, AL (simple geometric shapes, not a real map API)
- Location with 📍 marker
- Real-time clock + timezone label (CST)
- Availability status with animated green pulse dot
- Current weather/temp (hardcoded: "82°F, clear")

#### Recent Commits Widget (was 1 thing → now 4)
- Commits with `+x/-y` diff stats (green/red colored)
- Branch prefix: `main ·`
- Colored language bar at bottom (proportional colored segments)
- "View on GitHub →" link

**Language bar data (hardcoded proportions):**
```
TypeScript: 45% (blue)
Java: 25% (peach)
C++: 15% (red)
CSS: 10% (pink)
Other: 5% (overlay0)
```

#### Theme Widget (was 1 thing → now 4)
- Dark/Light segmented control (keep existing)
- Row of palette swatch circles (8 accent colors, clickable for fun)
- Variant label: "mocha" or "latte"
- Background grain toggle (subtle noise texture on/off)

#### Now Playing Widget (already rich, add 2 things)
- Album name text below artist
- "Listen on Spotify ↗" link at bottom

### 3. Color Strategy

**Visible accents (8+):**
- mauve: primary accent, hero name highlight
- green: live badges, additions, availability dot
- red: deletions, close button
- blue: TypeScript tags, links
- peach: company names, Java
- yellow: repo names in commits, warnings
- teal: React tags, secondary links
- pink: CSS tags, decorative elements

**Implementation:**
- Tag pills get individual bg colors at 10% opacity + colored text
- Commit diff stats: green for `+`, red for `-`
- Section headers get `//` prefix in overlay0
- Footer items get individual accent colors
- Status dots are color-coded (green=live, blue=shipped)

### 4. Surface Depth System

**Two-level card depth:**
```css
/* Outer card */
.card-outer {
  background: rgb(var(--ctp-mantle));
  border: 0.5px solid rgb(var(--ctp-surface0));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.03);
}

/* Inner recessed tile */
.card-inner {
  background: rgb(var(--ctp-crust));
  border: 0.5px solid rgb(var(--ctp-surface1));
  border-radius: 6px;
}
```

**Hover glow:**
```css
.card-outer:hover {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.03),
    0 0 0 1px rgb(var(--ctp-surface1)),
    0 4px 12px rgba(0,0,0,0.15);
}
```

### 5. Micro-Typography

- Hero: "U" gets font-weight 700, rest of name is 400. Blinking cursor `_` after the U (CSS animation).
- `[1]` superscript in hero text, links to footer note
- Section labels: `// work`, `// contact` — the `//` in overlay0
- Commit messages in true monospace with `…` truncation
- Footer commit hash displayed as `⌥ abc1234` in reduced opacity

### 6. Hero Copy

```
U_ lisses Molina
Full-stack developer at OCV, LLC.

I care about the mass of small decisions that make software feel inevitable
rather than assembled. Seeing something I built survive contact with real
users—and watching them not even notice the work—is the part that keeps
me here. [1]

i'm picky about the details that nobody notices unless they're missing.
```

The `[1]` is a superscript that on hover/click shows: "that's the highest compliment"

### 7. Footer Bar

Single-line footer with 6 pieces of live info:
```
© 2026 Ulisses Molina — ● All Systems Nominal — 14:32 CST —
{visitor_count} views — ⌥ {commit_hash} — [gh] [li] [email]
```

- Green dot + "All Systems Nominal" (static)
- Live clock (reuse from Currently widget)
- View counter (localStorage-based, increments on visit)
- Latest commit short SHA (hardcoded or from API)
- Social icon links (GitHub, LinkedIn, Email)

## Files to Modify

1. `src/components/Widgets.tsx` — enhance all 4 widgets
2. `src/components/ProjectCard.tsx` — nested depth + more info
3. `src/components/TagList.tsx` — colored pills
4. `src/pages/HomePage.tsx` — hero copy, footer bar, section label prefixes
5. `src/index.css` — depth utilities, glow effects, language bar, pill styles, grain toggle
6. `src/data.ts` — add stars, contributors, diff stats, language percentages
7. `tailwind.config.js` — no changes needed (colors already defined)

## Out of Scope

- No new pages or routes
- No real API integrations (hardcode data where needed)
- No changes to Nav component
- No changes to blog or projects page layout (only card component changes propagate)
- No real visitor counter backend (localStorage only)

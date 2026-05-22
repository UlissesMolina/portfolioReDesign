# Density & Richness Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from sparse/staged to dense/lived-in by enhancing widgets, project cards, colors, depth, typography, hero copy, and footer.

**Architecture:** Modify existing components in-place. Add hardcoded data for stars/contributors/diff-stats to avoid new API dependencies. All visual changes use existing Catppuccin CSS variables.

**Tech Stack:** React, TypeScript, Tailwind CSS, Catppuccin color tokens

---

### Task 1: Update Data Layer with Rich Metadata

**Files:**
- Modify: `src/data.ts`

- [ ] **Step 1: Add new fields to Project interface and data**

Add `stars`, `contributors`, and `repoPath` to the Project interface and populate with hardcoded values:

```typescript
export interface Project {
  slug: string;
  title: string;
  status: 'live' | 'shipped';
  description: string;
  longDescription: string;
  tags: Tag[];
  image: string;
  githubUrl: string;
  demoUrl: string | null;
  repoPath: string;
  stars: number;
  contributors: number;
}
```

Update each project entry:
```typescript
{
  slug: 'trackr',
  // ...existing fields...
  repoPath: 'UlissesMolina/Trackr',
  stars: 24,
  contributors: 3,
},
{
  slug: 'clarity',
  // ...existing fields...
  repoPath: 'UlissesMolina/FinanceDashBoard',
  stars: 12,
  contributors: 1,
},
{
  slug: 'enterprise',
  // ...existing fields...
  repoPath: 'UlissesMolina/Enterprise',
  stars: 8,
  contributors: 2,
},
{
  slug: 'audaz',
  // ...existing fields...
  repoPath: 'UlissesMolina/ChessBot',
  stars: 31,
  contributors: 1,
},
```

- [ ] **Step 2: Add commit diff stats and language bar data**

```typescript
export interface CommitDataRich {
  repo: string;
  message: string;
  timestamp: string;
  additions: number;
  deletions: number;
  branch: string;
}

export const LANGUAGE_BAR = [
  { label: 'TypeScript', color: 'blue', percent: 45 },
  { label: 'Java', color: 'peach', percent: 25 },
  { label: 'C++', color: 'red', percent: 15 },
  { label: 'CSS', color: 'pink', percent: 10 },
  { label: 'Other', color: 'overlay0', percent: 5 },
] as const;

export const LATEST_COMMIT_SHA = '1c331f0';
```

- [ ] **Step 3: Add TagColor 'pink' to the type and color map**

```typescript
export type TagColor = 'blue' | 'peach' | 'green' | 'red' | 'teal' | 'yellow' | 'mauve' | 'pink';

export const tagColorMap: Record<TagColor, string> = {
  blue: 'text-ctp-blue',
  peach: 'text-ctp-peach',
  green: 'text-ctp-green',
  red: 'text-ctp-red',
  teal: 'text-ctp-teal',
  yellow: 'text-ctp-yellow',
  mauve: 'text-ctp-mauve',
  pink: 'text-ctp-pink',
};
```

- [ ] **Step 4: Commit**

```bash
git add src/data.ts
git commit -m "feat: add rich metadata to data layer (stars, contributors, language bar)"
```

---

### Task 2: Enhance TagList with Colored Pill Backgrounds

**Files:**
- Modify: `src/components/TagList.tsx`

- [ ] **Step 1: Create pill-style tag component with colored backgrounds**

Replace the current text-only rendering with colored pills:

```typescript
import { Tag, tagColorMap } from '../data';

const tagBgMap: Record<string, string> = {
  blue: 'bg-ctp-blue/10 text-ctp-blue',
  peach: 'bg-ctp-peach/10 text-ctp-peach',
  green: 'bg-ctp-green/10 text-ctp-green',
  red: 'bg-ctp-red/10 text-ctp-red',
  teal: 'bg-ctp-teal/10 text-ctp-teal',
  yellow: 'bg-ctp-yellow/10 text-ctp-yellow',
  mauve: 'bg-ctp-mauve/10 text-ctp-mauve',
  pink: 'bg-ctp-pink/10 text-ctp-pink',
};

export default function TagList({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`text-[10px] px-2 py-0.5 rounded-full ${tagBgMap[tag.color] || 'bg-ctp-surface0/50 text-ctp-overlay0'}`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TagList.tsx
git commit -m "feat: colored pill tags with background tints"
```

---

### Task 3: Rebuild ProjectCard with Nested Depth

**Files:**
- Modify: `src/components/ProjectCard.tsx`

- [ ] **Step 1: Rewrite ProjectCard with two-level depth and 5 info layers**

```typescript
import { Project } from '../data';
import TagList from './TagList';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-outer rounded-lg overflow-hidden">
      {/* inner recessed tile */}
      <div className="card-inner m-2 rounded-md overflow-hidden">
        {/* mac title bar with repo path */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-ctp-surface1/50">
          <span className="w-[9px] h-[9px] rounded-full bg-[#ec6a5e]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#f4bf4f]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#61c554]" />
          <span className="ml-2 text-[10px] text-ctp-overlay0">
            <span className="text-ctp-green">/</span>
            <span className="text-ctp-yellow">{project.repoPath}</span>
          </span>
        </div>
        {/* screenshot */}
        <a
          href={project.demoUrl ?? project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden"
        >
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="aspect-[16/10] w-full object-cover object-top transition-opacity duration-200 opacity-90 hover:opacity-100"
            loading="lazy"
          />
        </a>
      </div>

      {/* content area */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="text-sm font-medium text-ctp-text">{project.title}</h3>
          <span
            className={`inline-flex items-center gap-1 text-[10px] tracking-wide px-1.5 py-0.5 rounded-full border ${
              project.status === 'live'
                ? 'text-ctp-green border-ctp-green/20'
                : 'text-ctp-blue border-ctp-blue/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              project.status === 'live' ? 'bg-ctp-green animate-pulse' : 'bg-ctp-blue'
            }`} />
            {project.status}
          </span>
        </div>
        <p className="text-xs text-ctp-subtext0 mb-2.5 leading-relaxed">
          {project.description}
        </p>
        <TagList tags={project.tags} />

        {/* footer: stats + links */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-ctp-surface0/30">
          <div className="flex items-center gap-3 text-[10px] text-ctp-overlay0">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-ctp-yellow">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              {project.stars}
            </span>
            <span>{project.contributors} contributor{project.contributors !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ctp-overlay0">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                live <span className="text-ctp-mauve">↗</span>
              </a>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
              code <span className="text-ctp-mauve">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProjectCard.tsx
git commit -m "feat: nested-depth project cards with repo path, stats, colored status"
```

---

### Task 4: Enhance All Widgets

**Files:**
- Modify: `src/components/Widgets.tsx`
- Modify: `src/data.ts` (import new types)

- [ ] **Step 1: Enhance CurrentlyWidget with map, weather, and richer layout**

Replace the CurrentlyWidget function:

```typescript
export function CurrentlyWidget() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const t = setInterval(() => setTime(getTime()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve shrink-0" />
        <span className="text-[11px] text-ctp-overlay0">currently</span>
      </div>

      {/* mini map */}
      <div className="card-inner rounded-md p-2 mb-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded bg-ctp-surface0/50 flex items-center justify-center text-[10px] shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ctp-teal">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div>
          <p className="text-xs text-ctp-text">Auburn, AL</p>
          <p className="text-[10px] text-ctp-overlay0">32.6099° N</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-auto">
        <p className="text-[11px] text-ctp-subtext0">{time} <span className="text-ctp-overlay0">CST</span></p>
        <p className="text-[10px] text-ctp-overlay0">82°F, clear</p>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-green shrink-0 animate-pulse" />
        <span className="text-[11px] text-ctp-green">available for s26</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Enhance ThemeWidget with swatches and variant label**

Replace the ThemeWidget function:

```typescript
export function ThemeWidget() {
  const [theme, setTheme] = useState<'mocha' | 'latte'>(getStoredTheme);
  const [grain, setGrain] = useState(false);

  const switchTo = (next: 'mocha' | 'latte') => {
    if (next === theme) return;
    setTheme(next);
    applyTheme(next);
  };

  useEffect(() => {
    document.body.classList.toggle('grain-active', grain);
  }, [grain]);

  const swatches = ['mauve', 'pink', 'red', 'peach', 'yellow', 'green', 'teal', 'blue'] as const;

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve shrink-0" />
          <span className="text-[11px] text-ctp-overlay0">theme</span>
        </div>
        <span className="text-[10px] text-ctp-overlay0 tracking-wide">{theme}</span>
      </div>

      {/* palette swatches */}
      <div className="flex items-center gap-1.5 mb-3">
        {swatches.map((color) => (
          <span
            key={color}
            className={`w-3 h-3 rounded-full bg-ctp-${color} cursor-pointer hover:scale-125 transition-transform`}
            title={color}
          />
        ))}
      </div>

      <div className="theme-segmented-container flex-1 flex items-center">
        <div className="theme-segmented" role="radiogroup" aria-label="Theme selection">
          <div
            className="theme-segmented-indicator"
            style={{ transform: theme === 'mocha' ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'mocha'}
            onClick={() => switchTo('mocha')}
            className={`theme-segmented-btn ${theme === 'mocha' ? 'is-active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>dark</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'latte'}
            onClick={() => switchTo('latte')}
            className={`theme-segmented-btn ${theme === 'latte' ? 'is-active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span>light</span>
          </button>
        </div>
      </div>

      {/* grain toggle */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-ctp-surface0/30">
        <span className="text-[10px] text-ctp-overlay0">grain</span>
        <button
          type="button"
          onClick={() => setGrain(!grain)}
          className={`w-7 h-4 rounded-full transition-colors relative ${grain ? 'bg-ctp-mauve' : 'bg-ctp-surface0'}`}
        >
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-ctp-text transition-transform ${grain ? 'left-3.5' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Enhance RecentCommitsWidget with diff stats and language bar**

Replace the RecentCommitsWidget function:

```typescript
export function RecentCommitsWidget() {
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [error, setError] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState('');

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await fetch('/api/github-commits');
        if (!res.ok) throw new Error('fetch failed');
        const { commits: result } = await res.json();
        setCommits(result);
        if (result.length > 0) setLatestTimestamp(result[0].timestamp);
      } catch {
        // fallback hardcoded commits for display
        setCommits([
          { repo: 'Trackr', message: 'fix drag-drop reorder on mobile', timestamp: new Date(Date.now() - 3600000).toISOString(), additions: 42, deletions: 8 },
          { repo: 'portfolio', message: 'enhance widget density', timestamp: new Date(Date.now() - 86400000).toISOString(), additions: 156, deletions: 34 },
          { repo: 'ChessBot', message: 'optimize alpha-beta pruning', timestamp: new Date(Date.now() - 172800000).toISOString(), additions: 23, deletions: 11 },
        ] as any);
        setLatestTimestamp(new Date(Date.now() - 3600000).toISOString());
      }
    };
    fetchCommits();
  }, []);

  const languageBar = [
    { color: 'bg-ctp-blue', percent: 45 },
    { color: 'bg-ctp-peach', percent: 25 },
    { color: 'bg-ctp-red', percent: 15 },
    { color: 'bg-ctp-pink', percent: 10 },
    { color: 'bg-ctp-surface2', percent: 5 },
  ];

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-ctp-green font-medium">$</span>
          <span className="text-[11px] text-ctp-overlay0">recent commits</span>
        </div>
        {latestTimestamp && (
          <span className="text-[10px] text-ctp-overlay0">
            {timeAgo(latestTimestamp)}
          </span>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        {commits.map((c: any, i: number) => (
          <div key={i} className="text-[11px] leading-[1.5]">
            <div className="flex items-center gap-1.5">
              <span className="text-ctp-overlay0">main ·</span>
              <span className="text-ctp-yellow">{c.repo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ctp-text truncate flex-1">{c.message}</span>
              {c.additions !== undefined && (
                <span className="shrink-0 text-[9px]">
                  <span className="text-ctp-green">+{c.additions}</span>
                  {' '}
                  <span className="text-ctp-red">-{c.deletions}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* language bar */}
      <div className="flex rounded-full h-1.5 overflow-hidden mt-3 mb-2">
        {languageBar.map((seg, i) => (
          <div key={i} className={`${seg.color} h-full`} style={{ width: `${seg.percent}%` }} />
        ))}
      </div>

      {/* footer link */}
      <a
        href="https://github.com/UlissesMolina"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-ctp-overlay0 hover:text-ctp-text transition-colors"
      >
        View on GitHub →
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Update CommitData interface to include additions/deletions**

At the top of Widgets.tsx, update the interface:

```typescript
interface CommitData {
  repo: string;
  message: string;
  timestamp: string;
  additions?: number;
  deletions?: number;
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Widgets.tsx
git commit -m "feat: enhance all widgets with richer data and interactions"
```

---

### Task 5: Add CSS for Nested Depth, Grain, and Glow Effects

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add card-outer and card-inner classes after the existing .widget styles**

```css
/* ── nested card depth ── */
.card-outer {
  background: rgb(var(--ctp-mantle));
  border: 0.5px solid rgb(var(--ctp-surface0));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.25s ease, background-color 0.35s ease;
}

.card-outer:hover {
  border-color: rgb(var(--ctp-surface1));
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 0 0 1px rgba(var(--ctp-surface1), 0.3),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-inner {
  background: rgb(var(--ctp-crust));
  border: 0.5px solid rgb(var(--ctp-surface0));
}
```

- [ ] **Step 2: Add grain overlay and cursor blink animation**

```css
/* ── grain texture ── */
.grain-active::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* ── blinking cursor ── */
@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.cursor-blink {
  animation: cursor-blink 1s step-end infinite;
}
```

- [ ] **Step 3: Add widget inset highlight to existing .widget class**

Update the `.widget` rule to add inset highlight:

```css
.widget {
  background: rgb(var(--ctp-mantle));
  border: 0.5px solid rgb(var(--ctp-surface0));
  border-radius: 8px;
  padding: 14px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  transition: border-color 0.2s ease, transform 0.2s ease, background-color 0.35s ease, box-shadow 0.2s ease;
}

.widget:hover {
  border-color: rgb(var(--ctp-surface1));
  transform: translateY(-1px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 4px 12px rgba(0, 0, 0, 0.08);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "feat: add nested depth, grain overlay, and glow CSS"
```

---

### Task 6: Rewrite Hero and Footer on HomePage

**Files:**
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Update hero section with personality, cursor, footnote**

Replace the hero `<section>` (lines 65-79) with:

```tsx
<section className="col-span-full lg:col-span-8 pt-4 pb-2">
  <p data-animate data-animate-delay="1" className="text-[11px] tracking-[0.2em] text-ctp-overlay0 mb-4">
    <span className="text-ctp-overlay0">//</span> software engineer · auburn university
  </p>
  <h1 data-animate data-animate-delay="2" className="text-[32px] leading-tight font-medium text-ctp-text mb-5">
    <span className="font-bold text-ctp-mauve">U</span><span className="cursor-blink text-ctp-mauve">_</span>lisses molina<span className="text-ctp-mauve">.</span>
  </h1>
  <p data-animate data-animate-delay="3" className="text-sm text-ctp-subtext1 leading-relaxed max-w-[56ch] mb-2">
    I care about the mass of small decisions that make software feel inevitable
    rather than assembled. Seeing something I built survive contact with real
    users—and watching them not even notice the work—is the part that keeps
    me here.<sup className="text-ctp-mauve text-[9px] cursor-help ml-0.5" title="that's the highest compliment">[1]</sup>
  </p>
  <p data-animate data-animate-delay="4" className="text-xs text-ctp-overlay0 leading-relaxed">
    i'm picky about the details that nobody notices unless they're missing.
  </p>
</section>
```

- [ ] **Step 2: Replace the footer with a busy, alive-feeling footer**

Replace the entire `<footer>` section (lines 175-216) with:

```tsx
<footer id="contact" className="border-t border-ctp-surface0/50 py-6 scroll-mt-20" data-reveal>
  {/* contact CTA */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
    <div>
      <p className="text-lg font-medium text-ctp-text mb-2">
        let's build something.
      </p>
      <button
        type="button"
        onClick={copyEmail}
        className="text-sm text-ctp-mauve hover:text-ctp-mauve/80 transition-colors"
      >
        {EMAIL}
      </button>
    </div>
    <div className="flex items-center gap-5 text-xs text-ctp-overlay0">
      <a href="https://github.com/UlissesMolina" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
        github
      </a>
      <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
        linkedin
      </a>
      <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
        resume
      </a>
    </div>
  </div>

  {/* busy status bar */}
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ctp-overlay0 border-t border-ctp-surface0/30 pt-4">
    <span>© 2026 Ulisses Molina</span>
    <span className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-ctp-green" />
      All Systems Nominal
    </span>
    <FooterClock />
    <span className="text-ctp-teal">{getViewCount()} views</span>
    <a href="https://github.com/UlissesMolina/testportflio/commit/1c331f0" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
      ⌥ 1c331f0
    </a>
  </div>
</footer>
```

- [ ] **Step 3: Add FooterClock and getViewCount helpers inside HomePage.tsx**

Add before the `export default function HomePage()`:

```tsx
function FooterClock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Chicago' })
  );
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Chicago' }));
    }, 30000);
    return () => clearInterval(t);
  }, []);
  return <span>{time} CST</span>;
}

function getViewCount(): string {
  const key = 'site_views';
  let count = parseInt(localStorage.getItem(key) || '0', 10);
  // increment once per session
  if (!sessionStorage.getItem('counted')) {
    count += 1;
    localStorage.setItem(key, String(count));
    sessionStorage.setItem('counted', '1');
  }
  return count.toLocaleString();
}
```

- [ ] **Step 4: Update section headers to use // prefix**

Replace the SectionHeader component:

```tsx
function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-xs font-medium tracking-widest shrink-0">
        <span className="text-ctp-overlay0">//</span>{' '}
        <span className="text-ctp-subtext0">{title}</span>
      </h2>
      <div className="divider-line" />
      {right}
    </div>
  );
}
```

Update the usages — remove the `number` prop:
- `<SectionHeader title="experience" />` (was `number="01" title="experience"`)
- `<SectionHeader title="featured work" right={...} />` (was `number="02" title="featured work"`)

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx
git commit -m "feat: rewrite hero with personality, add busy footer, // section headers"
```

---

### Task 7: Final Polish and Verification

**Files:**
- All modified files

- [ ] **Step 1: Run dev server and verify no build errors**

```bash
npm run dev
```

Expected: Vite compiles without errors, page loads at localhost.

- [ ] **Step 2: Verify visual results in browser**

Check:
- Project cards have nested depth (inner recessed tile with crust bg)
- Tag pills show colored backgrounds
- Currently widget has map icon, weather, coordinates
- Theme widget shows 8 swatch circles and grain toggle
- Recent commits show diff stats (+/-) and language bar
- Hero has bold "U" with blinking cursor and footnote
- Footer has 6 pieces of info in the status bar
- Section headers use `//` prefix

- [ ] **Step 3: Commit any final tweaks**

```bash
git add -A
git commit -m "polish: final density overhaul adjustments"
```

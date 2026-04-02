# Personal Portfolio

A single-page developer portfolio built with React and Vite. Dark/light mode, custom accent color, self-hosted fonts, no third-party analytics.

## Features

- **Accent color** — color picker on the left rail (large screens); updates CSS variables live
- **Dark / light mode** — toggle next to the GitHub shortcut in the same rail
- **Konami code** — ↑↑↓↓←→←→ B A
- **Scroll animations** — section content animates in when it enters the viewport (`IntersectionObserver`)
- **Loading bar** — brief top bar when jumping to a section (smooth scroll)
- **Reduced motion** — `prefers-reduced-motion` shortens animations and transitions (`index.css`)
- **Privacy** — no Google Analytics, no external font CDNs for bundled fonts

## Sections

### Hero (`#about`)

Grid-style background, serif name, subtitle, and CTAs (View Projects, resume PDF).

### Experience

Roles with dates, company, and tech tags in a responsive grid.

### Stack

Icon + label chips for tools (React, TypeScript, Java, Spring Boot, etc.).

### Projects

Responsive grid of cards with optional screenshots (click to zoom), tags, and GitHub / demo links.

- **Trackr** — Job tracker with Kanban and GPT-4o cover letters
- **Clarity Finance** — Income and expense dashboard
- **Enterprise Expense API** — Spring Boot API with JWT and roles
- **Audaz** — C++ chess engine (move generation, search, evaluation)

### Contact (`#contact`)

Email (click copies to clipboard), social links, resume download, and a local-time clock with timezone.

## Tech stack

- React 19, Vite 7
- Tailwind CSS 3
- react-icons
- Fonts: Satoshi (local `fonts/`), Instrument Serif and JetBrains Mono via `@fontsource`

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              # App mount, global CSS + font imports
  App.jsx               # Page layout, sections, theme + accent state
  App.css               # Surface/ink CSS variables, scrollbar, load bar,
                        # hero grid background, slide-up hero, experience grid
  index.css             # Tailwind layers, scroll/toast animations, reduced motion
  fonts/                # Satoshi woff2 + fonts.css
  components/
    SideBars.jsx        # lg+ fixed left rail: GitHub, theme toggle, accent picker
    ProjectCard.jsx     # Card layout, image modal, tags, links
    NavBar.jsx          # Sticky nav prototype (not imported in App.jsx)
  lib/                  # e.g. firebase.js — optional / future use
```

## License

Private — portfolio use.

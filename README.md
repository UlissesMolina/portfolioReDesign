# Personal Portfolio

A modern, single-page developer portfolio built with React and Vite featuring smooth animations, interactive elements, and a dark/light theme system.

## Features

- **Accent color picker** — live preview while dragging; ships with Coral, Matrix, Dracula, and Frost presets
- **Dark / Light mode** — toggle from the left sidebar; full theme-aware surface & ink tokens
- **Konami code** — ↑↑↓↓←→←→ B A for a small surprise
- **Loading bar** — accent-colored progress bar when navigating between sections
- **Scroll animations** — sections fade/scale in as they enter the viewport

## Sections

### Hero
Large serif heading with per-character hover lift, scramble-number section markers, and animated CTA buttons.

### Experience
Timeline of work history with tech tags, period labels, and hover highlights.

### Projects
Filterable tag bar with a responsive 2-column grid. Featured projects get a side-by-side code preview layout. Each card includes syntax-highlighted snippets, tech icons, and GitHub/demo links.

- **Trackr** — Full-stack job tracker with Kanban board, analytics, and GPT-4o cover letters
- **Tiger Scheduler** — Python/Selenium auto-register tool for Auburn's TigerScheduler
- **Clarity Finance** — Income/expense dashboard
- **Enterprise Expense API** — Spring Boot REST API with JWT auth and Docker
- **ChessBot** — C++ chess engine with move generation, search, and evaluation

### At a Glance (Bento Grid)
- **Map** — Leaflet map pinned to Auburn, AL with dark/light tiles
- **Click Counter** — Global visitor click count powered by Firebase with geo and device tracking
- **Stack** — 3×3 icon grid of core technologies
- **GitHub Heatmap** — Contribution graph and recent commits fetched from GitHub

### Contact
Email (click to copy), GitHub, LinkedIn, and resume download.

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS
- Firebase (click counter persistence)
- Leaflet (map)
- react-icons

## Run Locally

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

## Project Structure

```
src/
  App.jsx                  # Layout, sections, theme & easter-egg state
  App.css                  # Theme tokens, animations, bento grid, hero bg
  components/
    NavBar.jsx             # Sticky nav, section links, accent picker, mobile menu
    ProjectCard.jsx        # Code preview, syntax highlight, tags, links
    ContributionHeatmap.jsx# GitHub heatmap + recent commits
    MapCard.jsx            # Leaflet map with dark/light tiles
    ClickCounter.jsx       # Firebase-backed global click counter
    StackCard.jsx          # 3×3 tech stack icon grid
    SideBars.jsx           # Desktop side rails (social links, dark mode toggle)
```

## License

Private — portfolio use.

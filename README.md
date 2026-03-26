# Personal Portfolio

A modern, single-page developer portfolio built with React and Vite. Dark/light mode, custom accent color, self-hosted fonts, no third-party tracking.

## Features

- **Accent color picker** — live preview while dragging
- **Dark / Light mode** — toggle from the left sidebar
- **Konami code** — ↑↑↓↓←→←→ B A
- **Scroll animations** — sections fade/scale in as they enter the viewport
- **Reduced motion** — respects `prefers-reduced-motion`
- **GDPR compliant** — no Google Analytics, no external font loading, no IP tracking

## Sections

### Hero
Serif heading, subtitle, and CTA buttons (View Projects, Resume).

### Experience
Work history with period labels and tech tags.

### Projects
Responsive 2-column grid with screenshot previews (click to expand). Each card has tech tags and GitHub/demo links.

- **Trackr** — Job tracker with Kanban board and GPT-4o cover letters
- **Clarity Finance** — Income/expense dashboard
- **Enterprise Expense API** — Spring Boot REST API with JWT auth
- **Audaz** — C++ chess engine with move generation, search, and eval

### Contact
Email (click to copy), GitHub, LinkedIn, and resume download.

## Tech Stack

- React 19 + Vite 7
- Tailwind CSS
- react-icons
- Self-hosted fonts (Satoshi, Instrument Serif, JetBrains Mono)

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
  App.jsx              # Layout, sections, theme state
  App.css              # Theme tokens, animations, hero bg
  fonts/               # Self-hosted Satoshi woff2 files
  components/
    NavBar.jsx         # Sticky nav, section links, accent picker, mobile menu
    ProjectCard.jsx    # Screenshot preview, image modal, tags, links
    SideBars.jsx       # Desktop side rail (social links, dark mode toggle)
```

## License

Private — portfolio use.

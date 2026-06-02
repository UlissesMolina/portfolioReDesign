# Personal Portfolio

My personal portfolio built with React, TypeScript, and Vite. Pretty cool bento grid 

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 3 (Catppuccin palette)
- React Router
- JetBrains Mono via `@fontsource`

## Project structure

```
src/
  main.tsx              # App mount, global CSS + font imports
  App.tsx               # Router, theme init, page layout
  index.css             # Tailwind layers, animations, theming
  data.ts               # Project/experience data
  components/
    Nav.tsx             # Navigation bar
    ProjectCard.tsx     # Project card with tags and links
    TagList.tsx         # Reusable tag/chip list
    Widgets.tsx         # Theme toggle, accent picker, utilities
  pages/
    HomePage.tsx        # Landing page with hero, experience, projects
    ProjectsPage.tsx    # Full projects listing
    BlogPage.tsx        # Blog page
```

## License

Private — portfolio use.

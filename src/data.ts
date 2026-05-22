export type TagColor = 'blue' | 'peach' | 'green' | 'red' | 'teal' | 'yellow' | 'mauve' | 'pink';

export interface Tag {
  label: string;
  color: TagColor;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  tags: Tag[];
}

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

// ─── constants ───────────────────────────────────────────────────────────────

export const NOW = {
  company: 'OCV',
  learning: 'production React patterns',
  shipping: 'Trackr v2',
};

export const GITHUB_USERNAME = 'UlissesMolina';
export const EMAIL = 'umolina2005@gmail.com';

// Update this to your Spotify proxy endpoint (Cloudflare Worker / Next API route)
// Should return { isPlaying, track, artist, progressMs, durationMs } or { isPlaying: false }
export const SPOTIFY_ENDPOINT = '/api/now-playing';

export const LANGUAGE_BAR = [
  { label: 'TypeScript', color: 'blue', percent: 45 },
  { label: 'Java', color: 'peach', percent: 25 },
  { label: 'C++', color: 'red', percent: 15 },
  { label: 'CSS', color: 'pink', percent: 10 },
  { label: 'Other', color: 'overlay0', percent: 5 },
] as const;

export const LATEST_COMMIT_SHA = '1c331f0';

// ─── color map ───────────────────────────────────────────────────────────────

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

// ─── experience ──────────────────────────────────────────────────────────────

export const experiences: Experience[] = [
  {
    title: 'software engineering intern',
    company: 'Room2Room Movers',
    period: '01.2026 – 05.2026',
    description:
      'Built internal dashboards in React used daily by operations staff to manage jobs and scheduling. Designed and shipped UI components focused on speed, clarity, and mobile usability.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'typescript', color: 'blue' },
      { label: 'node.js', color: 'green' },
    ],
  },
  {
    title: 'software engineering intern',
    company: 'OCV, LLC',
    period: '09.2025 – present',
    description:
      'Contributed to client-facing business software handling real user data and workflows. Improved reliability through bug fixes, test coverage, and code review.',
    tags: [
      { label: 'java', color: 'peach' },
      { label: 'spring boot', color: 'green' },
      { label: 'postgresql', color: 'blue' },
    ],
  },
];

// ─── projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'trackr',
    title: 'trackr',
    status: 'live',
    description: 'job tracker with kanban board and gpt-4o cover letter generation.',
    longDescription:
      'I was tracking internship apps in a Google Sheet and got tired of it, so I built this instead. Drag-and-drop Kanban board, application timeline, and a cover letter generator that uses GPT-4o. A few friends started using it too.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'typescript', color: 'blue' },
      { label: 'node.js', color: 'green' },
      { label: 'openai', color: 'mauve' },
    ],
    image: '/trackr.png',
    githubUrl: 'https://github.com/UlissesMolina/Trackr',
    demoUrl: 'https://usetrackr.netlify.app/',
    repoPath: 'UlissesMolina/Trackr',
    stars: 24,
    contributors: 3,
  },
  {
    slug: 'clarity',
    title: 'clarity finance',
    status: 'live',
    description: 'track income, expenses, and savings in one clean dashboard.',
    longDescription:
      'Personal finance dashboard. Income, expenses, savings, spending trends. Most budgeting apps try to do everything. This one just shows you where your money goes.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'typescript', color: 'blue' },
      { label: 'css', color: 'peach' },
    ],
    image: '/clarity.png',
    githubUrl: 'https://github.com/UlissesMolina/FinanceDashBoard',
    demoUrl: 'https://clarityfi.netlify.app/',
    repoPath: 'UlissesMolina/FinanceDashBoard',
    stars: 12,
    contributors: 1,
  },
  {
    slug: 'enterprise',
    title: 'enterprise expense api',
    status: 'shipped',
    description: 'expense approval workflow with jwt auth and role-based access.',
    longDescription:
      'REST API for expense report submissions and approvals. JWT auth, role-based access, multi-step approval workflow. I wanted to learn how enterprise backends actually work, so I built one.',
    tags: [
      { label: 'java', color: 'peach' },
      { label: 'spring boot', color: 'green' },
      { label: 'postgresql', color: 'blue' },
      { label: 'docker', color: 'blue' },
    ],
    image: '/enterprise.png',
    githubUrl: 'https://github.com/UlissesMolina/Enterprise',
    demoUrl: null,
    repoPath: 'UlissesMolina/Enterprise',
    stars: 8,
    contributors: 2,
  },
  {
    slug: 'audaz',
    title: 'audaz',
    status: 'shipped',
    description: 'chess engine with move generation, search, and eval.',
    longDescription:
      'Chess engine in C++. Wrote the move generator, alpha-beta search, and eval function from scratch. Learned more about bitboards than I expected to.',
    tags: [
      { label: 'c++', color: 'red' },
      { label: 'cmake', color: 'teal' },
    ],
    image: '/audaz.png',
    githubUrl: 'https://github.com/UlissesMolina/ChessBot',
    demoUrl: null,
    repoPath: 'UlissesMolina/ChessBot',
    stars: 31,
    contributors: 1,
  },
];

// featured projects shown on homepage (slugs)
export const FEATURED_SLUGS = ['trackr', 'audaz'];
export const featuredProjects = projects.filter((p) =>
  FEATURED_SLUGS.includes(p.slug),
);

// ─── blog ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  body: string;
  tags: Tag[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'spring-boot-testing',
    title: 'what I learned writing tests at OCV',
    date: '2026-05-18',
    body: 'Writing integration tests for real user workflows changed how I think about code. Most of what I write now starts with the test. Still figuring out the balance between coverage and speed.',
    tags: [
      { label: 'java', color: 'peach' },
      { label: 'testing', color: 'green' },
    ],
  },
  {
    slug: 'trackr-v2-rewrite',
    title: 'rewriting trackr in typescript',
    date: '2026-04-30',
    body: "Trackr started as a plain React app with no types. Migrating to TypeScript caught a dozen bugs I didn't know existed. The kanban drag-and-drop logic was especially painful to type correctly.",
    tags: [
      { label: 'typescript', color: 'blue' },
      { label: 'react', color: 'blue' },
    ],
  },
  {
    slug: 'why-i-built-this-site',
    title: 'why I rebuilt my portfolio from scratch',
    date: '2026-03-15',
    body: 'I wanted something that felt like mine — not a template, not a drag-and-drop builder. Catppuccin colors, monospace type, and a layout that gets out of the way. Still tweaking it.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'design', color: 'mauve' },
    ],
  },
];

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
  status: 'live' | 'shipped' | 'archived';
  description: string;
  longDescription: string;
  tags: Tag[];
  image: string;
  githubUrl: string;
  demoUrl: string | null;
  year: string;
  buildTime: string;
}

// ─── constants ───────────────────────────────────────────────────────────────

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
      { label: 'xcode', color: 'blue' },
      { label: 'github', color: 'mauve' },
      { label: 'aws', color: 'peach' },
    ],
  },
];

// ─── projects ────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'trackr',
    title: 'trackr',
    status: 'live',
    description: 'Job application tracker with a Kanban board, timeline, and GPT-4o cover letter generation.',
    longDescription:
      'Job application tracker with a Kanban board, timeline, and GPT-4o cover letter generation.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'typescript', color: 'blue' },
      { label: 'node.js', color: 'green' },
      { label: 'openai', color: 'mauve' },
    ],
    image: '/trackr.png',
    githubUrl: 'https://github.com/UlissesMolina/Trackr',
    demoUrl: 'https://usetrackr.netlify.app/',
    year: '2025',
    buildTime: '2025',
  },
  {
    slug: 'tiger-scheduler',
    title: 'tiger scheduler',
    status: 'shipped',
    description: 'Auto-register tool for Auburn University course scheduling. Automates seat monitoring and registration.',
    longDescription:
      'Auto-register tool for Auburn University course scheduling. Automates seat monitoring and registration.',
    tags: [
      { label: 'python', color: 'green' },
      { label: 'selenium', color: 'teal' },
    ],
    image: '/auburn.png',
    githubUrl: 'https://github.com/UlissesMolina/Tiger-Scheduler-Course-Auto-Register-Tool',
    demoUrl: null,
    year: '2025',
    buildTime: '2025',
  },
  {
    slug: 'audaz',
    title: 'audaz',
    status: 'shipped',
    description: 'Chess engine in C++. Move generator, alpha-beta search, evaluation function. Bitboards.',
    longDescription:
      'Chess engine in C++. Move generator, alpha-beta search, evaluation function. Bitboards.',
    tags: [
      { label: 'c++', color: 'red' },
      { label: 'cmake', color: 'teal' },
    ],
    image: '/audaz.png',
    githubUrl: 'https://github.com/UlissesMolina/ChessBot',
    demoUrl: null,
    year: '2025',
    buildTime: '2025',
  },
  {
    slug: 'expense-flow',
    title: 'expense flow',
    status: 'shipped',
    description: 'REST API for expense report submissions. JWT auth, role-based access, multi-step approval workflow.',
    longDescription:
      'REST API for expense report submissions. JWT auth, role-based access, multi-step approval workflow.',
    tags: [
      { label: 'java', color: 'peach' },
      { label: 'spring boot', color: 'green' },
      { label: 'postgresql', color: 'blue' },
      { label: 'docker', color: 'blue' },
    ],
    image: '/enterprise.png',
    githubUrl: 'https://github.com/UlissesMolina/Enterprise',
    demoUrl: null,
    year: '2026',
    buildTime: '2026',
  },
  {
    slug: 'clarity',
    title: 'clarity finance',
    status: 'live',
    description: 'Personal finance dashboard. Income, expenses, savings, spending trends.',
    longDescription:
      'Personal finance dashboard. Income, expenses, savings, spending trends.',
    tags: [
      { label: 'react', color: 'blue' },
      { label: 'typescript', color: 'blue' },
      { label: 'css', color: 'peach' },
    ],
    image: '/clarity.png',
    githubUrl: 'https://github.com/UlissesMolina/FinanceDashBoard',
    demoUrl: 'https://clarityfi.netlify.app/',
    year: '2025',
    buildTime: '2025',
  },
];

// featured projects shown on homepage (slugs)
export const FEATURED_SLUGS = ['trackr', 'tiger-scheduler'];
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

export const blogPosts: BlogPost[] = [];

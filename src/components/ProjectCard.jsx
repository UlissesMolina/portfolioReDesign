import { useRef } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FaPython, FaReact } from 'react-icons/fa';
import { SiTypescript, SiSpringboot, SiPostgresql, SiDocker, SiNodedotjs, SiCplusplus, SiCmake } from 'react-icons/si';

const TAG_COLORS = {
  React:            'text-sky-400 border-sky-400/30',
  TypeScript:       'text-sky-400 border-sky-400/30',
  CSS:              'text-sky-400 border-sky-400/30',
  'Node.js':        'text-emerald-400 border-emerald-400/30',
  'Spring Boot':    'text-emerald-400 border-emerald-400/30',
  Java:             'text-emerald-400 border-emerald-400/30',
  Python:           'text-emerald-400 border-emerald-400/30',
  PostgreSQL:       'text-violet-400 border-violet-400/30',
  Prisma:           'text-violet-400 border-violet-400/30',
  Docker:           'text-orange-400 border-orange-400/30',
  JWT:              'text-orange-400 border-orange-400/30',
  Testcontainers:   'text-orange-400 border-orange-400/30',
  Selenium:         'text-amber-400 border-amber-400/30',
  'Web Automation': 'text-amber-400 border-amber-400/30',
  Clerk:            'text-pink-400 border-pink-400/30',
  OpenAI:           'text-pink-400 border-pink-400/30',
  'C++':            'text-indigo-400 border-indigo-400/30',
  CMake:            'text-cyan-400 border-cyan-400/30',
};
const TAG_DEFAULT = 'text-ink-dim border-surface-border';

const TAG_ICONS = {
  Python: FaPython,
  React: FaReact,
  TypeScript: SiTypescript,
  Java: SiSpringboot,
  'Spring Boot': SiSpringboot,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  'Node.js': SiNodedotjs,
  'C++': SiCplusplus,
  CMake: SiCmake,
};

function CodeBar({ filename }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-surface-inset border-b border-surface-border shrink-0">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] transition-transform duration-150 group-hover:scale-125" style={{ transitionDelay: '0ms' }} />
      <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e] transition-transform duration-150 group-hover:scale-125" style={{ transitionDelay: '40ms' }} />
      <span className="h-2.5 w-2.5 rounded-full bg-[#28c840] transition-transform duration-150 group-hover:scale-125" style={{ transitionDelay: '80ms' }} />
      {filename && (
        <span className="ml-2 text-[10px] font-mono text-ink-dim/70 transition-colors duration-200 group-hover:text-ink-dim">
          {filename}
        </span>
      )}
    </div>
  );
}

const KEYWORDS = new Set([
  // JS/TS
  'from', 'import', 'export', 'default', 'const', 'let', 'var',
  'function', 'class', 'return', 'async', 'await', 'type', 'interface',
  'if', 'else', 'while', 'for', 'in', 'of', 'break', 'new',
  // Python
  'def', 'True', 'False', 'None', 'and', 'or', 'not',
  // Java
  'public', 'private', 'protected', 'static', 'final', 'void',
  // C++
  'struct', 'namespace', 'bool', 'int', 'virtual', 'explicit',
]);

const TOKEN_RE = new RegExp(
  `\\b(${[...KEYWORDS].join('|')})\\b` +
  `|(@\\w+)` +
  `|("(?:[^"\\\\]|\\\\.)*")` +
  `|('(?:[^'\\\\]|\\\\.)*')`,
  'g'
);

function highlightLine(line) {
  const parts = [];
  let lastEnd = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(line)) !== null) {
    if (m.index > lastEnd) parts.push({ t: 'plain', s: line.slice(lastEnd, m.index) });
    const word = m[0];
    if (word.startsWith('@'))               parts.push({ t: 'annotation', s: word });
    else if (KEYWORDS.has(word))            parts.push({ t: 'keyword', s: word });
    else if (word.startsWith('"') || word.startsWith("'")) parts.push({ t: 'string', s: word });
    else                                    parts.push({ t: 'plain', s: word });
    lastEnd = TOKEN_RE.lastIndex;
  }
  if (lastEnd < line.length) parts.push({ t: 'plain', s: line.slice(lastEnd) });

  return parts.map((p, i) => {
    const cl =
      p.t === 'keyword'    ? 'text-accent' :
      p.t === 'annotation' ? 'text-sky-400' :
      p.t === 'string'     ? 'text-emerald-400/90' :
                             'text-ink-muted';
    return <span key={i} className={cl}>{p.s}</span>;
  });
}

function CodePreview({ project, featured }) {
  const lines = (project.snippet || '').split('\n');
  return (
    <div className={`code-inner h-full bg-surface-inset transition-colors duration-300 group-hover:bg-surface-inset/80 ${featured ? 'border-b border-surface-border' : 'border-b border-surface-border'}`}>
      <CodeBar filename={project.snippetFile} />
      <div className={`relative overflow-hidden px-3 pt-2 ${featured ? 'h-[140px]' : 'h-[108px]'}`}>
        <div className="font-mono text-[11px] leading-[1.6] flex">
          <div className="select-none pr-3 tabular-nums shrink-0 border-r border-white/10 text-right min-w-[1.5rem]">
            {lines.map((_, i) => <div key={i} className="text-ink-dim/40">{i + 1}</div>)}
          </div>
          <pre className="pl-3 flex-1 m-0 overflow-hidden">
            {lines.map((line, i) => <div key={i}>{highlightLine(line)}</div>)}
          </pre>
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-surface-inset to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

export default function ProjectCard({ project, roundedClass = 'rounded-lg', featured = false }) {
  return (
    <div
      className={`group relative overflow-hidden ${roundedClass} bg-surface-card border border-surface-border transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 flex ${featured ? 'card-featured' : 'flex-col h-full'}`}
    >
      {/* Code preview */}
      <div className={featured ? 'code-panel' : ''}>
        <CodePreview project={project} featured={featured} />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {featured && (
            <span className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded bg-accent/15 text-accent">
              Featured
            </span>
          )}
          {project.type && (
            <span className="font-mono text-[10px] tracking-wide uppercase px-2 py-0.5 rounded text-ink-dim border border-surface-border">
              {project.type}
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl text-ink group-hover:text-accent/90 transition-colors mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed mb-3 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag, i) => {
            const Icon = TAG_ICONS[tag];
            return (
              <span
                key={i}
                className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${TAG_COLORS[tag] ?? TAG_DEFAULT}`}
              >
                {Icon ? <Icon size={10} /> : null}
                {tag}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-auto">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-accent text-surface-bg hover:bg-accent-light transition-colors"
            >
              <FaExternalLinkAlt size={10} />
              Live site
            </a>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-ink-dim hover:text-accent transition-colors"
          >
            <FaGithub size={12} />
            Code
          </a>
        </div>
      </div>
    </div>
  );
}

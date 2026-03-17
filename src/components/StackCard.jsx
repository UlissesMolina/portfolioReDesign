import { FaReact, FaPython, FaGitAlt } from 'react-icons/fa';
import {
  SiTypescript, SiNodedotjs, SiSpringboot,
  SiPostgresql, SiDocker, SiTailwindcss,
} from 'react-icons/si';

const STACK = [
  { icon: FaReact,       label: 'React',       color: 'text-sky-400'     },
  { icon: SiTypescript,  label: 'TypeScript',  color: 'text-sky-400'     },
  { icon: SiNodedotjs,   label: 'Node.js',     color: 'text-emerald-400' },
  { icon: FaPython,      label: 'Python',      color: 'text-emerald-400' },
  { icon: SiSpringboot,  label: 'Spring Boot', color: 'text-emerald-400' },
  { icon: SiPostgresql,  label: 'PostgreSQL',  color: 'text-violet-400'  },
  { icon: SiDocker,      label: 'Docker',      color: 'text-orange-400'  },
  { icon: SiTailwindcss, label: 'Tailwind',    color: 'text-sky-400'     },
  { icon: FaGitAlt,      label: 'Git',         color: 'text-orange-400'  },
];

export default function StackCard() {
  return (
    <div className="font-sans w-full h-full rounded-xl border border-surface-border bg-surface-card overflow-hidden flex flex-col p-6">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-ink-dim mb-4">
        Stack
      </p>
      <div className="grid grid-cols-3 gap-4 flex-1 content-start">
        {STACK.map(({ icon: Icon, label, color }) => (
          <div key={label} className="group/item flex flex-col items-center gap-1.5 rounded-lg p-1.5 cursor-default hover:bg-surface-border/50 transition-colors duration-150">
            <Icon size={36} className={`${color} transition-transform duration-200 group-hover/item:scale-110`} />
            <span className="text-xs font-mono text-ink-dim group-hover/item:text-ink-muted text-center leading-tight transition-colors duration-150">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

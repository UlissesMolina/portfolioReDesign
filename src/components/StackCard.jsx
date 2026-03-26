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
    <div className="font-sans w-full h-full rounded-xl border border-surface-border bg-surface-card overflow-hidden flex flex-col p-4">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-ink-dim mb-3">
        Stack
      </p>
      <div className="grid grid-cols-3 gap-2 flex-1 place-content-center">
        {STACK.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-1.5">
            <Icon size={28} className={color} />
            <span className="text-[10px] font-mono text-ink-dim text-center leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

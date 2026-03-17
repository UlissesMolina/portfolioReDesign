import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa';

const LINKS = [
  {
    icon: FaGithub,
    href: 'https://github.com/UlissesMolina',
    label: 'GitHub',
    external: true,
  },
  {
    icon: FaLinkedin,
    href: 'https://www.linkedin.com/in/ulissesmolina',
    label: 'LinkedIn',
    external: true,
  },
  {
    icon: FaEnvelope,
    href: 'mailto:umolina2005@gmail.com',
    label: 'Email',
    external: false,
  },
];

export default function SideBars({ isDark = true, onToggleDark }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  const baseBar = `hidden lg:flex fixed bottom-0 flex-col items-center gap-5 z-20 transition-opacity duration-700 ${
    visible ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <>
      {/* Left bar */}
      <div className={`${baseBar} left-8 2xl:left-12`}>
        {LINKS.map(({ icon: Icon, href, label, external }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="group text-ink-dim hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
          >
            <Icon size={20} />
          </a>
        ))}
        <button
          type="button"
          onClick={onToggleDark}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="text-ink-dim hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
        >
          {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>
        <div className="w-px h-24 mt-1 bg-gradient-to-b from-surface-border to-transparent" />
      </div>

      {/* Right bar */}
      <div className={`${baseBar} right-8 2xl:right-12`}>
        <span
          className="text-[11px] font-mono text-ink-dim tracking-[0.2em] select-none"
          style={{ writingMode: 'vertical-rl' }}
        >
          scroll
        </span>
        <div className="w-px h-24 mt-2 bg-gradient-to-b from-surface-border to-transparent" />
      </div>
    </>
  );
}

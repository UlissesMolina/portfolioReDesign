import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getThemeState, toggleLightDark } from './Widgets';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => getThemeState().isDark);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  const links: { label: string; action: () => void; active?: boolean }[] = [
    {
      label: 'work',
      action: () => {
        if (isHome) {
          document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/');
          setTimeout(() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      },
    },
    {
      label: 'projects',
      action: () => navigate('/projects'),
      active: location.pathname === '/projects',
    },
    {
      label: 'blog',
      action: () => navigate('/blog'),
      active: location.pathname === '/blog',
    },
    {
      label: 'resume',
      action: () => window.open('/uliResume.pdf', '_blank'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ctp-base/90 backdrop-blur-md" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="mx-auto max-w-content w-full flex items-center justify-between px-8 py-4">
        <Link
          to="/"
          className="group/logo relative text-sm font-medium text-ctp-text tracking-tight hover:text-ctp-accent transition-colors"
        >
          umolina.dev
          <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap rounded-md bg-ctp-surface0 border border-ctp-surface1/60 px-2.5 py-1.5 text-[10px] text-ctp-subtext0 shadow-lg opacity-0 scale-95 transition-all duration-200 group-hover/logo:opacity-100 group-hover/logo:scale-100">
            buying the domain soon...
          </span>
        </Link>

        {/* desktop nav */}
        <nav
          className="hidden sm:flex items-center gap-1 relative"
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.action}
              onMouseEnter={() => setHovered(link.label)}
              className={`relative z-10 px-3 py-1.5 text-xs transition-colors rounded-full ${
                link.active
                  ? 'text-ctp-text'
                  : 'text-ctp-subtext0 hover:text-ctp-text'
              }`}
            >
              {hovered === link.label && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-ctp-surface0/20 border border-ctp-surface0/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </button>
          ))}
        </nav>

        {/* light/dark toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const newIsDark = toggleLightDark();
              setIsDark(newIsDark);
            }}
            className="text-ctp-subtext0 hover:text-ctp-text transition-colors p-1.5"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            )}
          </button>

          {/* mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden text-ctp-subtext0 hover:text-ctp-text transition-colors p-1"
            aria-label={menuOpen ? 'close menu' : 'open menu'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? (
                <>
                  <line x1="4" y1="4" x2="14" y2="14" />
                  <line x1="14" y1="4" x2="4" y2="14" />
                </>
              ) : (
                <>
                  <line x1="3" y1="5" x2="15" y2="5" />
                  <line x1="3" y1="9" x2="15" y2="9" />
                  <line x1="3" y1="13" x2="15" y2="13" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-ctp-surface0/50 bg-ctp-base/95 backdrop-blur-md px-6 pb-4 pt-2">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                link.action();
                setMenuOpen(false);
              }}
              className="block w-full text-left py-2.5 text-xs text-ctp-subtext0 hover:text-ctp-text transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

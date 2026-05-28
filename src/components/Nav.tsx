import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
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
    <header className="sticky top-0 z-40 bg-ctp-base/90 backdrop-blur-md border-b border-ctp-surface0/50">
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
        <nav className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={link.action}
              className={`text-xs transition-colors ${
                link.active
                  ? 'text-ctp-text'
                  : 'text-ctp-overlay0 hover:text-ctp-text'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-ctp-overlay0 hover:text-ctp-text transition-colors p-1"
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
              className="block w-full text-left py-2.5 text-xs text-ctp-overlay0 hover:text-ctp-text transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

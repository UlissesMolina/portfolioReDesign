import { useState, useEffect, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

function useColorInput(onCommit) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onInput = (e) => {
      document.documentElement.classList.add('no-transitions');
      document.documentElement.style.setProperty('--accent', e.target.value);
      document.documentElement.style.setProperty('--accent-light', e.target.value + 'cc');
    };
    const onChange = (e) => {
      document.documentElement.classList.remove('no-transitions');
      onCommit(e.target.value);
    };
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('change', onChange);
    };
  }, [onCommit]);
  return ref;
}

export default function NavBar({ activeSection = '', onNavClick, customColor = '#c62d42', onCustomColor }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navAnimated, setNavAnimated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const desktopColorRef = useColorInput(onCustomColor ?? (() => {}));
  const mobileColorRef = useColorInput(onCustomColor ?? (() => {}));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNavAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const navLinks = [
    { href: '#experience', label: 'Work' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  const linkClass = (id) => {
    const base = 'text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md';
    const active = id === activeSection;
    if (active) return `${base} text-accent bg-accent/10`;
    return `${base} text-ink-muted hover:text-ink hover:bg-white/6`;
  };

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') closeMobile(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <nav className={`sticky top-0 z-30 w-full border-b transition-all duration-300 bg-surface-bg/90 backdrop-blur-[20px] ${scrolled ? 'border-surface-border' : 'border-transparent'} ${navAnimated ? 'animate-nav-slide-in' : 'opacity-0 -translate-y-full'}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <a
          href="#"
          onClick={closeMobile}
          className="text-base sm:text-lg font-sans font-semibold tracking-tight transition-colors shrink-0 hover:text-accent text-ink animate-nav-link-in"
        >
          Ulisses Molina
        </a>

        <div className="hidden md:flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); onNavClick?.(href.slice(1)); }}
              className={`${linkClass(href.slice(1))} animate-nav-link-in`}
            >
              {label}
            </a>
          ))}
          <a
            href="/uliResume.pdf"
            download="uliResume.pdf"
            className="text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md text-ink-muted hover:text-accent hover:bg-accent/8 animate-nav-link-in"
          >
            Resume
          </a>
          {onCustomColor && (
            <label title="Accent color" className="cursor-pointer animate-nav-link-in relative" style={{ lineHeight: 0 }}>
              <input
                ref={desktopColorRef}
                type="color"
                defaultValue={customColor}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Accent color"
              />
              <span
                className="block w-7 h-7 rounded-lg border-2 border-surface-border hover:border-accent transition-all duration-200"
                style={{ background: 'var(--accent)' }}
              />
            </label>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          {onCustomColor && (
            <label title="Accent color" className="cursor-pointer relative" style={{ lineHeight: 0 }}>
              <input
                ref={mobileColorRef}
                type="color"
                defaultValue={customColor}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Accent color"
              />
              <span
                className="block w-7 h-7 rounded-lg border-2 border-surface-border"
                style={{ background: 'var(--accent)' }}
              />
            </label>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded transition-colors text-ink-muted hover:text-ink hover:bg-white/5"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      <div
          className={`md:hidden overflow-hidden transition-[max-height] duration-300 ease-out ${mobileOpen ? 'max-h-64' : 'max-h-0'}`}
      >
        <div className="border-t py-4 px-4 flex flex-col gap-0.5 border-surface-border bg-surface-bg/98">
          {navLinks.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => { e.preventDefault(); onNavClick?.(href.slice(1)); closeMobile(); }}
              className={`py-3 px-3 text-base ${linkClass(href.slice(1))} hover:bg-white/5`}
            >
              {label}
            </a>
          ))}
          <a
            href="/uliResume.pdf"
            download="uliResume.pdf"
            onClick={closeMobile}
            className="py-3 px-3 text-base font-medium transition-colors hover:underline underline-offset-2 text-ink-muted hover:text-accent hover:bg-white/5"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
}

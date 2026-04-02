import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa';

export default function SideBars({ isDark = true, onToggleDark, customColor = '#c62d42', onCustomColor }) {
  const [visible, setVisible] = useState(false);
  const colorRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = colorRef.current;
    if (!el || !onCustomColor) return;
    const onInput = (e) => {
      document.documentElement.classList.add('no-transitions');
      document.documentElement.style.setProperty('--accent', e.target.value);
      document.documentElement.style.setProperty('--accent-light', e.target.value + 'cc');
    };
    const onChange = (e) => {
      document.documentElement.classList.remove('no-transitions');
      onCustomColor(e.target.value);
    };
    el.addEventListener('input', onInput);
    el.addEventListener('change', onChange);
    return () => {
      el.removeEventListener('input', onInput);
      el.removeEventListener('change', onChange);
    };
  }, [onCustomColor]);

  const baseBar = `hidden lg:flex fixed bottom-0 flex-col items-center z-20 transition-opacity duration-700 ${
    visible ? 'opacity-100' : 'opacity-0'
  }`;

  return (
    <>
      {/* Left bar */}
      <div className={`${baseBar} left-8 2xl:left-12`}>
        <div className="flex flex-col items-center gap-4 px-2.5 py-3 rounded-full border border-surface-border bg-surface-card/50 backdrop-blur-sm">
          <a
            href="https://github.com/UlissesMolina"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-ink-dim hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
          >
            <FaGithub size={18} />
          </a>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-ink-dim hover:text-accent transition-all duration-200 hover:-translate-y-0.5"
          >
            {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
          </button>
          {onCustomColor && (
            <label title="Accent color" className="cursor-pointer relative" style={{ lineHeight: 0 }}>
              <input
                ref={colorRef}
                type="color"
                defaultValue={customColor}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Accent color"
              />
              <span
                className="block w-4 h-4 rounded-full border-2 border-surface-border hover:border-accent transition-all duration-200"
                style={{ background: 'var(--accent)' }}
              />
            </label>
          )}
        </div>
        <div className="w-px h-24 mt-3 bg-gradient-to-b from-surface-border to-transparent" />
      </div>
    </>
  );
}

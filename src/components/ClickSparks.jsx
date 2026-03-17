import { useEffect, useRef } from 'react';

const SYMBOLS = ['✦', '{}', '=>', '</>', '//', '★', '→', '/*', ';;', '[]'];

export default function ClickSparks() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const handleClick = (e) => {
      // Don't fire on interactive elements
      if (e.target.closest('a, button, input, select, textarea')) return;

      const count = 3 + Math.floor(Math.random() * 3);
      const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent')
        .trim() || '#ff6b35';

      for (let i = 0; i < count; i++) {
        const el = document.createElement('span');
        el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        const angle = (i / count) * 360 + Math.random() * 40 - 20;
        const dist = 40 + Math.random() * 30;
        const dx = Math.cos((angle * Math.PI) / 180) * dist;
        const dy = Math.sin((angle * Math.PI) / 180) * dist - 20;
        const size = 10 + Math.floor(Math.random() * 8);

        el.style.cssText = `
          position: fixed;
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          font-size: ${size}px;
          font-family: monospace;
          color: ${accent};
          pointer-events: none;
          user-select: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          animation: click-spark 0.65s ease-out forwards;
          --dx: ${dx}px;
          --dy: ${dy}px;
        `;

        container.appendChild(el);
        el.addEventListener('animationend', () => el.remove(), { once: true });
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return <div ref={containerRef} aria-hidden="true" />;
}

import { useEffect, useRef } from 'react';

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '255, 107, 53';
  return `${r}, ${g}, ${b}`;
}

const MAX_POINTS = 48;
const DECAY = 0.038;

export default function CursorTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const trail = [];
    let raf;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e) => {
      trail.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.length > MAX_POINTS) trail.shift();
    };
    window.addEventListener('mousemove', onMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Decay
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life -= DECAY;
        if (trail[i].life <= 0) trail.splice(i, 1);
      }

      if (trail.length >= 2) {
        const hex = getComputedStyle(document.documentElement)
          .getPropertyValue('--accent')
          .trim();
        const rgb = hexToRgb(hex);

        // Draw connected segments — width and opacity taper toward the tail
        for (let i = 1; i < trail.length; i++) {
          const p0 = trail[i - 1];
          const p1 = trail[i];
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.strokeStyle = `rgba(${rgb}, ${p1.life * 0.6})`;
          ctx.lineWidth = p1.life * 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.stroke();
        }

        // Bright dot at the head
        const head = trail[trail.length - 1];
        ctx.beginPath();
        ctx.arc(head.x, head.y, head.life * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${head.life * 0.9})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}
    />
  );
}

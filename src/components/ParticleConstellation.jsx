import { useEffect, useRef } from 'react';

// Read accent from inline style only — no getComputedStyle, no layout reflow
function parseAccent() {
  const hex = (document.documentElement.style.getPropertyValue('--accent') || '#c0392b')
    .trim().replace('#', '');
  if (hex.length < 6) return [255, 107, 53];
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

export default function ParticleConstellation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = canvas.clientWidth;
    let H = canvas.clientHeight;
    canvas.width = W;
    canvas.height = H;

    let rgb = parseAccent();
    const mouse = { x: -9999, y: -9999 };
    let raf;
    let frame = 0;

    const COUNT = 72;
    const CONNECT = 120;
    const REPEL = 150;

    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.2 + 0.9,   // 0.9–2.1 px
      o: Math.random() * 0.5 + 0.2,   // 0.2–0.7 opacity
    }));

    const tick = () => {
      // Poll accent color every 60 frames — cheap inline style read, no layout cost
      if (frame % 60 === 0) rgb = parseAccent();
      frame++;

      ctx.clearRect(0, 0, W, H);
      const [r, g, b] = rgb;

      // Update positions
      for (const p of particles) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < REPEL * REPEL && d2 > 0) {
          const d = Math.sqrt(d2);
          const f = ((REPEL - d) / REPEL) * 0.35;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f;
        }
        p.vx *= 0.95;
        p.vy *= 0.95;
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 2) { p.vx = (p.vx / spd) * 2; p.vy = (p.vy / spd) * 2; }
        // Gentle random nudge when nearly stopped to maintain drift
        if (spd < 0.06) { p.vx += (Math.random() - 0.5) * 0.15; p.vy += (Math.random() - 0.5) * 0.15; }
        // Wrap around
        p.x = ((p.x + p.vx) % W + W) % W;
        p.y = ((p.y + p.vy) % H + H) % H;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.hypot(dx, dy);
          if (d < CONNECT) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - d / CONNECT) * 0.3})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.o})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    // Track mouse globally — canvas has pointer-events:none so we listen on window
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Resize canvas
    const ro = new ResizeObserver(() => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W;
      canvas.height = H;
    });
    ro.observe(canvas);

    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        // Soft radial fade so edges blend into page rather than hard cutoff
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 55% 50%, black 20%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 80% 80% at 55% 50%, black 20%, transparent 100%)',
      }}
    />
  );
}

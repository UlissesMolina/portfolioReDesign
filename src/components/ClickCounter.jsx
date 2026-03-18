import { useState, useCallback, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';

const STORAGE_KEY = 'portfolio-click-count';
const VISITOR_KEY = 'portfolio-visitor-id';
const COUNTER_PATH = 'clickCount';
const CLICKS_PATH = 'clicks';

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  let isNew = false;
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(VISITOR_KEY, id);
    isNew = true;
  }
  return { id, isNew };
}

function parseDevice() {
  const ua = navigator.userAgent;
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const browser = /Edg/.test(ua) ? 'Edge' : /Chrome/.test(ua) ? 'Chrome' : /Firefox/.test(ua) ? 'Firefox' : /Safari/.test(ua) ? 'Safari' : 'Other';
  return `${mobile ? 'Mobile' : 'Desktop'} / ${browser}`;
}

async function fetchGeo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return { country: data.country_name ?? '?', city: data.city ?? '?' };
  } catch {
    return { country: '?', city: '?' };
  }
}

function getLocalCount() {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val !== null) return parseInt(val, 10) || 0;
  } catch {}
  return 0;
}

export default function ClickCounter() {
  const [count, setCount] = useState(0);
  const [punching, setPunching] = useState(false);
  const [plusOnes, setPlusOnes] = useState([]);
  const punchTimer = useRef(null);
  const geoCache = useRef(null);

  useEffect(() => {
    if (!db) { setCount(getLocalCount()); return; }
    let unsubscribe;
    import('firebase/database').then(({ ref, onValue }) => {
      const counterRef = ref(db, COUNTER_PATH);
      unsubscribe = onValue(counterRef, (snap) => { setCount(snap.val() ?? 0); });
    });
    return () => unsubscribe?.();
  }, []);

  const handleClick = useCallback(() => {
    // Punch animation on number
    setPunching(false);
    clearTimeout(punchTimer.current);
    requestAnimationFrame(() => {
      setPunching(true);
      punchTimer.current = setTimeout(() => setPunching(false), 350);
    });

    // Spawn +1 at a random position inside the card (10–90% range to stay visible)
    const id = Date.now() + Math.random();
    const x = 10 + Math.random() * 80; // percent
    const y = 15 + Math.random() * 60; // percent
    setPlusOnes((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setPlusOnes((prev) => prev.filter((p) => p.id !== id)), 700);

    // Persist
    if (!db) {
      setCount((prev) => {
        const next = prev + 1;
        try { localStorage.setItem(STORAGE_KEY, String(next)); } catch {}
        return next;
      });
      return;
    }
    import('firebase/database').then(async ({ ref, runTransaction, update, increment }) => {
      runTransaction(ref(db, COUNTER_PATH), (current) => (current ?? 0) + 1)
        .catch((err) => console.error('Firebase write FAILED:', err));

      if (!geoCache.current) geoCache.current = await fetchGeo();
      const { country, city } = geoCache.current;
      const { id: visitorId, isNew } = getVisitorId();
      const payload = {
        country,
        city,
        device: parseDevice(),
        lastSeen: Date.now(),
        count: increment(1),
      };
      if (isNew) payload.firstSeen = Date.now();
      update(ref(db, `${CLICKS_PATH}/${visitorId}`), payload)
        .catch((err) => console.error('clicks write failed:', err));
    });
  }, []);

  useEffect(() => () => clearTimeout(punchTimer.current), []);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Click to increment"
      className="font-sans relative w-full h-full rounded-xl border border-surface-border bg-surface-card overflow-hidden flex flex-col items-center justify-center cursor-pointer select-none group"
    >
      {/* +1 floaters */}
      {plusOnes.map((p) => (
        <span
          key={p.id}
          className="pointer-events-none absolute font-semibold text-accent text-sm"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: 'plusone-float 0.7s ease-out forwards',
          }}
        >
          +1
        </span>
      ))}

      {/* Count */}
      <span className={`text-6xl font-bold text-ink tabular-nums leading-none ${punching ? 'animate-click-punch' : ''}`}>
        {count}
      </span>

      {/* Label */}
      <p className="text-xs text-ink-dim mt-3 tracking-wide group-hover:text-accent transition-colors duration-200">
        click me
      </p>
      <p className="text-[10px] text-ink-dim/50 mt-1">
        {db ? 'from everyone who visited' : 'and counting'}
      </p>
    </button>
  );
}

import { useEffect, useState, useRef } from 'react';
import { SPOTIFY_ENDPOINT } from '../data';

// ─── types ───────────────────────────────────────────────────────────────────

interface SpotifyData {
  isPlaying: boolean;
  track?: string;
  artist?: string;
  progressMs?: number;
  durationMs?: number;
  lastTrack?: string;
  lastArtist?: string;
}

interface CommitData {
  repo: string;
  message: string;
  timestamp: string;
  additions?: number;
  deletions?: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ─── theme widget ────────────────────────────────────────────────────────────

const THEME_KEY = 'ctp-theme';

export function getStoredTheme(): 'mocha' | 'latte' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'latte') return 'latte';
  } catch { /* noop */ }
  return 'mocha';
}

function applyTheme(theme: 'mocha' | 'latte') {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function ThemeWidget() {
  const [theme, setTheme] = useState<'mocha' | 'latte'>(getStoredTheme);
  const [grain, setGrain] = useState(false);

  const switchTo = (next: 'mocha' | 'latte') => {
    if (next === theme) return;
    setTheme(next);
    applyTheme(next);
  };

  useEffect(() => {
    document.body.classList.toggle('grain-active', grain);
  }, [grain]);

  const swatches = ['mauve', 'pink', 'red', 'peach', 'yellow', 'green', 'teal', 'blue'] as const;

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve shrink-0" />
          <span className="text-[11px] text-ctp-overlay0">theme</span>
        </div>
        <span className="text-[10px] text-ctp-overlay0 tracking-wide">{theme}</span>
      </div>

      {/* palette swatches */}
      <div className="flex items-center gap-1.5 mb-3">
        {swatches.map((color) => (
          <span
            key={color}
            className={`w-3 h-3 rounded-full bg-ctp-${color} cursor-pointer hover:scale-125 transition-transform`}
            title={color}
          />
        ))}
      </div>

      <div className="theme-segmented-container flex-1 flex items-center">
        <div className="theme-segmented" role="radiogroup" aria-label="Theme selection">
          <div
            className="theme-segmented-indicator"
            style={{ transform: theme === 'mocha' ? 'translateX(0)' : 'translateX(100%)' }}
          />
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'mocha'}
            onClick={() => switchTo('mocha')}
            className={`theme-segmented-btn ${theme === 'mocha' ? 'is-active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span>dark</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={theme === 'latte'}
            onClick={() => switchTo('latte')}
            className={`theme-segmented-btn ${theme === 'latte' ? 'is-active' : ''}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span>light</span>
          </button>
        </div>
      </div>

      {/* grain toggle */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-ctp-surface0/30">
        <span className="text-[10px] text-ctp-overlay0">grain</span>
        <button
          type="button"
          onClick={() => setGrain(!grain)}
          className={`w-7 h-4 rounded-full transition-colors relative ${grain ? 'bg-ctp-mauve' : 'bg-ctp-surface0'}`}
        >
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-ctp-text transition-transform ${grain ? 'left-3.5' : 'left-0.5'}`} />
        </button>
      </div>
    </div>
  );
}

// ─── now playing ─────────────────────────────────────────────────────────────

const LAST_TRACK_KEY = 'spotify_last_track';

function loadLastTrack(): { track: string; artist: string } | null {
  try {
    const raw = localStorage.getItem(LAST_TRACK_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLastTrack(track: string, artist: string) {
  localStorage.setItem(LAST_TRACK_KEY, JSON.stringify({ track, artist }));
}

export function NowPlayingWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch(SPOTIFY_ENDPOINT);
        if (res.ok) {
          const json: SpotifyData = await res.json();

          if (json.isPlaying && json.track && json.artist) {
            saveLastTrack(json.track, json.artist);
          } else if (json.lastTrack && json.lastArtist) {
            saveLastTrack(json.lastTrack, json.lastArtist);
          }

          if (!json.isPlaying && !json.lastTrack) {
            const saved = loadLastTrack();
            if (saved) {
              json.lastTrack = saved.track;
              json.lastArtist = saved.artist;
            }
          }

          setData(json);
          if (json.isPlaying && json.progressMs && json.durationMs) {
            setProgress((json.progressMs / json.durationMs) * 100);
          }
        } else {
          const saved = loadLastTrack();
          setData({
            isPlaying: false,
            lastTrack: saved?.track,
            lastArtist: saved?.artist,
          });
        }
      } catch {
        const saved = loadLastTrack();
        setData({
          isPlaying: false,
          lastTrack: saved?.track,
          lastArtist: saved?.artist,
        });
      }
    };

    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // animate progress bar locally between polls
  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) return;

    const tick = setInterval(() => {
      setProgress((prev) => {
        const increment = (1000 / data.durationMs!) * 100;
        return Math.min(prev + increment, 100);
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [data]);

  const isPlaying = data?.isPlaying && data.track;
  const hasLastTrack = data && !data.isPlaying && data.lastTrack;

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <div className={`eq-bars ${isPlaying ? '' : 'eq-bars-stopped'}`}>
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>
        <span className="text-[11px] text-ctp-overlay0">now playing</span>
      </div>

      {isPlaying ? (
        <div className="flex items-center gap-3 flex-1">
          {/* vinyl record */}
          <div className="vinyl-record vinyl-spinning" />

          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-xs text-ctp-text truncate mb-0.5">{data.track}</p>
            <p className="text-[11px] text-ctp-overlay0 truncate">{data.artist}</p>
            <div className="h-[3px] rounded-full bg-ctp-surface0 overflow-hidden mt-2">
              <div
                className="h-full bg-ctp-mauve rounded-full transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : hasLastTrack ? (
        <div className="flex items-center gap-3 flex-1">
          {/* vinyl record — stopped */}
          <div className="vinyl-record vinyl-stopped" />

          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] text-ctp-overlay0 italic mb-1">last played</p>
            <p className="text-xs text-ctp-text truncate mb-0.5">{data.lastTrack}</p>
            <p className="text-[11px] text-ctp-overlay0 truncate">{data.lastArtist}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 flex-1">
          <div className="vinyl-record vinyl-stopped" />
          <p className="text-[11px] text-ctp-overlay0 italic">silence.</p>
        </div>
      )}
    </div>
  );
}

// ─── currently ───────────────────────────────────────────────────────────────

export function CurrentlyWidget() {
  const [time, setTime] = useState(getTime());

  useEffect(() => {
    const t = setInterval(() => setTime(getTime()), 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-mauve shrink-0" />
        <span className="text-[11px] text-ctp-overlay0">currently</span>
      </div>

      {/* mini map */}
      <div className="card-inner rounded-md p-2 mb-2.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded bg-ctp-surface0/50 flex items-center justify-center text-[10px] shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-ctp-teal">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <div>
          <p className="text-xs text-ctp-text">Auburn, AL</p>
          <p className="text-[10px] text-ctp-overlay0">32.6099° N</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-auto">
        <p className="text-[11px] text-ctp-subtext0">{time} <span className="text-ctp-overlay0">CST</span></p>
        <p className="text-[10px] text-ctp-overlay0">82°F, clear</p>
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-green shrink-0 animate-pulse" />
        <span className="text-[11px] text-ctp-green">available for s26</span>
      </div>
    </div>
  );
}

function getTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Chicago',
  }).toLowerCase();
}

// ─── recent commits ──────────────────────────────────────────────────────────

export function RecentCommitsWidget() {
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [latestTimestamp, setLatestTimestamp] = useState('');

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await fetch('/api/github-commits');
        if (!res.ok) throw new Error('fetch failed');
        const { commits: result } = await res.json();
        setCommits(result);
        if (result.length > 0) setLatestTimestamp(result[0].timestamp);
      } catch {
        // fallback hardcoded commits
        setCommits([
          { repo: 'Trackr', message: 'fix drag-drop reorder on mobile', timestamp: new Date(Date.now() - 3600000).toISOString(), additions: 42, deletions: 8 },
          { repo: 'portfolio', message: 'enhance widget density', timestamp: new Date(Date.now() - 86400000).toISOString(), additions: 156, deletions: 34 },
          { repo: 'ChessBot', message: 'optimize alpha-beta pruning', timestamp: new Date(Date.now() - 172800000).toISOString(), additions: 23, deletions: 11 },
        ]);
        setLatestTimestamp(new Date(Date.now() - 3600000).toISOString());
      }
    };
    fetchCommits();
  }, []);

  const languageBar = [
    { color: 'bg-ctp-blue', percent: 45 },
    { color: 'bg-ctp-peach', percent: 25 },
    { color: 'bg-ctp-red', percent: 15 },
    { color: 'bg-ctp-pink', percent: 10 },
    { color: 'bg-ctp-surface2', percent: 5 },
  ];

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-ctp-green font-medium">$</span>
          <span className="text-[11px] text-ctp-overlay0">recent commits</span>
        </div>
        {latestTimestamp && (
          <span className="text-[10px] text-ctp-overlay0">
            {timeAgo(latestTimestamp)}
          </span>
        )}
      </div>

      <div className="space-y-1.5 flex-1">
        {commits.map((c, i) => (
          <div key={i} className="text-[11px] leading-[1.5]">
            <div className="flex items-center gap-1.5">
              <span className="text-ctp-overlay0">main ·</span>
              <span className="text-ctp-yellow">{c.repo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-ctp-text truncate flex-1">{c.message}</span>
              {c.additions !== undefined && (
                <span className="shrink-0 text-[9px]">
                  <span className="text-ctp-green">+{c.additions}</span>
                  {' '}
                  <span className="text-ctp-red">-{c.deletions}</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* language bar */}
      <div className="flex rounded-full h-1.5 overflow-hidden mt-3 mb-2">
        {languageBar.map((seg, i) => (
          <div key={i} className={`${seg.color} h-full`} style={{ width: `${seg.percent}%` }} />
        ))}
      </div>

      {/* footer link */}
      <a
        href="https://github.com/UlissesMolina"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-ctp-overlay0 hover:text-ctp-text transition-colors"
      >
        View on GitHub →
      </a>
    </div>
  );
}

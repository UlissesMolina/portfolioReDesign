import { useEffect, useState, useRef, useCallback } from 'react';
import { SPOTIFY_ENDPOINT, GITHUB_USERNAME } from '../data';

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
  repoLang: string | null;
  message: string;
  timestamp: string;
  additions?: number;
  deletions?: number;
}

interface LangSegment {
  label: string;
  color: string;
  percent: number;
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

type PresetId = 'mocha' | 'tokyo-night' | 'rose-pine' | 'gruvbox' | 'nord';

interface Preset {
  id: PresetId;
  label: string;
  accent: string;   // RGB triplet for --ctp-accent
  bg: string;        // hex for swatch circle
  accentHex: string; // hex for swatch pip
}

const PRESETS: Preset[] = [
  { id: 'mocha',       label: 'Mocha',       accent: '203 166 247', bg: '#1e1e2e', accentHex: '#cba6f7' },
  { id: 'tokyo-night', label: 'Tokyo',       accent: '187 154 247', bg: '#1a1b26', accentHex: '#bb9af7' },
  { id: 'rose-pine',   label: 'Rosé Pine',   accent: '196 167 231', bg: '#191724', accentHex: '#c4a7e7' },
  { id: 'gruvbox',     label: 'Gruvbox',     accent: '254 128 25',  bg: '#282828', accentHex: '#fe8019' },
  { id: 'nord',        label: 'Nord',        accent: '136 192 208', bg: '#2e3440', accentHex: '#88c0d0' },
];

const PRESET_IDS = new Set(PRESETS.map(p => p.id));

function getStoredPreset(): PresetId {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && PRESET_IDS.has(stored as PresetId)) return stored as PresetId;
  } catch { /* noop */ }
  return 'mocha';
}

function applyThemeById(id: PresetId, animate = false) {
  const preset = PRESETS.find(p => p.id === id);
  if (!preset) return;

  const root = document.documentElement;

  if (animate) {
    root.classList.add('theme-transitioning');
  }

  root.setAttribute('data-theme', id);
  localStorage.setItem(THEME_KEY, id);

  const r = root.style;
  r.setProperty('--ctp-accent', preset.accent);
  r.setProperty('--ctp-accent-glow', `rgba(${preset.accent.replace(/ /g, ', ')}, 0.12)`);
  r.setProperty('--ctp-accent-border', `rgba(${preset.accent.replace(/ /g, ', ')}, 0.25)`);
  r.setProperty('--selection-bg', `rgba(${preset.accent.replace(/ /g, ', ')}, 0.22)`);

  if (animate) {
    setTimeout(() => root.classList.remove('theme-transitioning'), 600);
  }
}

export function initTheme() {
  applyThemeById(getStoredPreset());
}

export function ThemeWidget() {
  const [active, setActive] = useState<PresetId>(getStoredPreset);
  const gridRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState<{left: number; top: number; color: string} | null>(null);
  const initialised = useRef(false);

  const pick = (id: PresetId) => {
    setActive(id);
    applyThemeById(id, true);
  };

  // measure the active swatch position and update the sliding highlight
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const idx = PRESETS.findIndex(p => p.id === active);
    const btn = grid.children[idx + 1] as HTMLElement | undefined; // +1 for the highlight div
    if (!btn) return;
    const swatch = btn.querySelector('.palette-swatch-lg') as HTMLElement | null;
    if (!swatch) return;

    const preset = PRESETS[idx];
    const gridRect = grid.getBoundingClientRect();
    const swatchRect = swatch.getBoundingClientRect();
    const left = swatchRect.left - gridRect.left - 3;
    const top = swatchRect.top - gridRect.top - 3;

    initialised.current = true;
    setHighlight({ left, top, color: preset.accentHex });
  }, [active]);

  return (
    <div className="widget">
      <div className="flex items-center gap-1.5 mb-2">
        <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.1-.7-.4-1-.3-.3-.4-.6-.4-1 0-.8.7-1.5 1.5-1.5H16c3.3 0 6-2.7 6-6 0-5.5-4.5-10-10-10z"/>
        </svg>
        <span className="text-[11px] text-ctp-overlay0">theme</span>
      </div>

      <div className="palette-grid-labeled" ref={gridRef} role="radiogroup" aria-label="Theme selection" style={{ position: 'relative' }}>
        {/* sliding highlight ring */}
        {highlight && (
          <div
            className="palette-highlight-ring"
            style={{
              transform: `translate(${highlight.left}px, ${highlight.top}px)`,
              borderColor: highlight.color,
              boxShadow: `0 0 8px ${highlight.color}30`,
            }}
          />
        )}
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active === p.id}
            onClick={() => pick(p.id)}
            className={`palette-dot-labeled ${active === p.id ? 'is-active' : ''}`}
          >
            <div
              className="palette-swatch-lg"
              style={{
                backgroundColor: p.bg,
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 7,
                  height: 7,
                  borderRadius: '2.5px',
                  backgroundColor: p.accentHex,
                  boxShadow: `0 0 0 1px ${p.bg}`,
                }}
              />
            </div>
            <span className={`palette-label ${active === p.id ? 'is-active' : ''}`}>
              {p.label.toLowerCase()}
            </span>
          </button>
        ))}
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

  const recentTracks = [
    { track: 'Luther', artist: 'Kendrick Lamar' },
    { track: 'Runaway', artist: 'Kanye West' },
    { track: 'Pink + White', artist: 'Frank Ocean' },
  ];

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span className="text-[11px] text-ctp-overlay0">now playing</span>
        <div className={`eq-bars ${isPlaying ? '' : 'eq-bars-stopped'} ml-auto`}>
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>
      </div>

      {isPlaying ? (
        <div className="flex items-center gap-3">
          <div className="vinyl-record vinyl-spinning" />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-xs text-ctp-text truncate mb-0.5">{data.track}</p>
            <p className="text-[11px] text-ctp-overlay0 truncate">{data.artist}</p>
            <div className="h-[3px] rounded-full bg-ctp-surface0 overflow-hidden mt-2">
              <div
                className="h-full bg-ctp-accent rounded-full transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      ) : hasLastTrack ? (
        <div className="flex items-center gap-3">
          <div className="vinyl-record vinyl-stopped" />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] text-ctp-overlay0 italic mb-1">last played</p>
            <p className="text-xs text-ctp-text truncate mb-0.5">{data.lastTrack}</p>
            <p className="text-[11px] text-ctp-overlay0 truncate">{data.lastArtist}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="vinyl-record vinyl-stopped" />
          <p className="text-[11px] text-ctp-overlay0 italic">silence.</p>
        </div>
      )}

      {/* recently played */}
      <div className="mt-auto pt-2.5 border-t border-ctp-surface0/50">
        <p className="text-[10px] text-ctp-overlay0 mb-1.5">recently played</p>
        <div className="space-y-1">
          {recentTracks.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px]">
              <span className="text-ctp-overlay0">♪</span>
              <span className="text-ctp-subtext0 truncate">{t.track}</span>
              <span className="text-ctp-overlay0">·</span>
              <span className="text-ctp-overlay0 truncate">{t.artist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── this week ──────────────────────────────────────────────────────────────

interface PrData {
  title: string;
  repo: string;
  url: string;
  state: string;
  draft: boolean;
  createdAt: string;
}

export function ThisWeekWidget() {
  const [prs, setPrs] = useState<PrData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr+is:open&sort=created&order=desc&per_page=4`
        );
        if (!res.ok) { setLoading(false); return; }
        const json = await res.json();
        const items: PrData[] = (json.items || []).map((item: { title: string; html_url: string; pull_request?: { url: string }; draft?: boolean; created_at: string; repository_url: string; state: string }) => ({
          title: item.title,
          repo: item.repository_url.split('/').pop() || '',
          url: item.html_url,
          state: item.state,
          draft: item.draft || false,
          createdAt: item.created_at,
        }));
        setPrs(items);
      } catch { /* noop */ }
      setLoading(false);
    };
    fetchPRs();
  }, []);

  return (
    <div className="widget">
      <div className="flex items-center gap-1.5 mb-3">
        <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
          <path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/>
        </svg>
        <span className="text-[11px] text-ctp-overlay0">open prs</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-[22px] rounded bg-ctp-surface0/30 animate-pulse" />
          ))}
        </div>
      ) : prs.length === 0 ? (
        <p className="text-[11px] text-ctp-overlay0 italic">no open prs right now</p>
      ) : (
        <ul className="space-y-2">
          {prs.map((pr, i) => (
            <li key={i}>
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-[11px] leading-relaxed group"
              >
                <span className={`mt-[2px] shrink-0 ${pr.draft ? 'text-ctp-overlay0' : 'text-ctp-green'}`}>
                  {pr.draft ? '○' : '●'}
                </span>
                <span className="flex flex-col min-w-0">
                  <span className="text-ctp-subtext0 truncate group-hover:text-ctp-text transition-colors">{pr.title}</span>
                  <span className="text-[10px] text-ctp-overlay0">{pr.repo} · {timeAgo(pr.createdAt)}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── location ───────────────────────────────────────────────────────────────


export function LocationWidget() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago',
    }).toLowerCase()
  );

  useEffect(() => {
    const t = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
          timeZone: 'America/Chicago',
        }).toLowerCase()
      );
    }, 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="widget h-full flex flex-col justify-center">
      <div className="flex items-center gap-1.5 mb-3">
        <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        <span className="text-[11px] text-ctp-overlay0">currently</span>
      </div>

      <p className="text-xs text-ctp-text mb-1">Auburn, AL</p>
      <p className="text-[10px] text-ctp-overlay0 mb-3 tracking-wide">32.6099° N, 85.4808° W</p>
      <p className="text-[11px] text-ctp-subtext0 mb-3">{time} · CST</p>

      <div className="flex items-center gap-1.5 mt-auto">
        <span className="w-1.5 h-1.5 rounded-full bg-ctp-green shrink-0 animate-pulse" />
        <span className="text-[11px] text-ctp-green">open to work</span>
      </div>
    </div>
  );
}

// ─── recent commits ──────────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: 'bg-ctp-blue',
  JavaScript: 'bg-ctp-yellow',
  Java: 'bg-ctp-peach',
  'C++': 'bg-ctp-red',
  Python: 'bg-ctp-green',
  CSS: 'bg-ctp-pink',
  HTML: 'bg-ctp-peach',
  Go: 'bg-ctp-teal',
  Rust: 'bg-ctp-red',
  Shell: 'bg-ctp-green',
};

const LANG_TEXT_COLORS: Record<string, string> = {
  TypeScript: 'text-ctp-blue',
  JavaScript: 'text-ctp-yellow',
  Java: 'text-ctp-peach',
  'C++': 'text-ctp-red',
  Python: 'text-ctp-green',
  CSS: 'text-ctp-pink',
  HTML: 'text-ctp-peach',
  Go: 'text-ctp-teal',
  Rust: 'text-ctp-red',
  Shell: 'text-ctp-green',
};

export function RecentCommitsWidget() {
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [languages, setLanguages] = useState<LangSegment[]>([]);
  const [latestTimestamp, setLatestTimestamp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFromGitHub = async (): Promise<{ commits: CommitData[]; langs: LangSegment[] }> => {
      const reposRes = await fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=5&type=owner`
      );
      if (!reposRes.ok) return { commits: [], langs: [] };
      const repos: { full_name: string; name: string; language: string | null; size: number }[] = await reposRes.json();

      // Fetch commits with repo language attached
      const all: CommitData[] = [];
      const results = await Promise.all(
        repos.slice(0, 4).map(async (repo) => {
          const res = await fetch(
            `https://api.github.com/repos/${repo.full_name}/commits?per_page=2`
          );
          if (!res.ok) return [];
          const data: { commit: { message: string; author: { date: string } } }[] = await res.json();
          return data.map((c) => ({
            repo: repo.name,
            repoLang: repo.language,
            message: c.commit.message.split('\n')[0],
            timestamp: c.commit.author.date,
          }));
        })
      );
      for (const rc of results) all.push(...rc);
      all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      const top = all.slice(0, 3);

      // Build language breakdown from the commits we're showing
      const langCount: Record<string, number> = {};
      for (const c of top) {
        if (c.repoLang) {
          langCount[c.repoLang] = (langCount[c.repoLang] || 0) + 1;
        }
      }
      const total = Object.values(langCount).reduce((a, b) => a + b, 0);
      const langs: LangSegment[] = Object.entries(langCount)
        .sort((a, b) => b[1] - a[1])
        .map(([label, count]) => ({
          label,
          color: LANG_COLORS[label] || 'bg-ctp-surface2',
          percent: Math.round((count / total) * 100),
        }));

      return { commits: top, langs };
    };

    const fetchCommits = async () => {
      try {
        const { commits: result, langs } = await fetchFromGitHub();
        setCommits(result);
        setLanguages(langs);
        if (result.length > 0) setLatestTimestamp(result[0].timestamp);
      } catch {
        setCommits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommits();
  }, []);

  return (
    <div className="widget h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/>
          </svg>
          <span className="text-[11px] text-ctp-overlay0">recent commits</span>
        </div>
        {latestTimestamp && (
          <span className="text-[10px] text-ctp-overlay0">
            {timeAgo(latestTimestamp)}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2 flex-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[30px] rounded bg-ctp-surface0/30 animate-pulse" />
          ))}
        </div>
      ) : commits.length === 0 ? (
        <p className="text-[11px] text-ctp-overlay0 italic">no recent commits</p>
      ) : (
        <>
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

          {/* language bar + labels — always visible */}
          {languages.length > 0 && (
            <div className="mt-auto pt-3">
              <div className="flex rounded-full h-1.5 overflow-hidden">
                {languages.map((seg, i) => (
                  <div key={i} className={`${seg.color} h-full`} style={{ width: `${seg.percent}%` }} />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                {languages.map((seg, i) => (
                  <span key={i} className="flex items-center gap-1 text-[9px]">
                    <span className={`w-1.5 h-1.5 rounded-full ${seg.color} shrink-0`} />
                    <span className={LANG_TEXT_COLORS[seg.label] || 'text-ctp-overlay0'}>{seg.label}</span>
                    <span className="text-ctp-overlay0">{seg.percent}%</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { useEffect, useState, useRef, useCallback } from 'react';
import { SPOTIFY_ENDPOINT, GITHUB_USERNAME, YOUTUBE_CHANNEL, videos } from '../data';

// ─── types ───────────────────────────────────────────────────────────────────

interface SpotifyData {
  isPlaying: boolean;
  track?: string;
  artist?: string;
  albumArt?: string;
  spotifyUrl?: string;
  progressMs?: number;
  durationMs?: number;
  lastTrack?: string;
  lastArtist?: string;
  recentTracks?: { track: string; artist: string; albumArt?: string }[];
}

interface CommitData {
  repo: string;
  repoFullName: string;
  repoLang: string | null;
  message: string;
  timestamp: string;
  sha: string;
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

type PresetId = 'mono' | 'light' | 'mocha' | 'tokyo-night' | 'rose-pine' | 'gruvbox' | 'nord';

interface Preset {
  id: PresetId;
  accent: string;
  isDark: boolean;
}

const PRESETS: Preset[] = [
  { id: 'mono',        accent: '130 180 255', isDark: true },
  { id: 'light',       accent: '50 90 160',   isDark: false },
  { id: 'mocha',       accent: '203 166 247', isDark: true },
  { id: 'tokyo-night', accent: '187 154 247', isDark: true },
  { id: 'rose-pine',   accent: '196 167 231', isDark: true },
  { id: 'gruvbox',     accent: '254 128 25',  isDark: true },
  { id: 'nord',        accent: '136 192 208', isDark: true },
];

const PRESET_IDS = new Set(PRESETS.map(p => p.id));

function getStoredPreset(): PresetId {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored && PRESET_IDS.has(stored as PresetId)) return stored as PresetId;
  } catch { /* noop */ }
  return 'mono';
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
    setTimeout(() => root.classList.remove('theme-transitioning'), 350);
  }
}

export function initTheme() {
  applyThemeById(getStoredPreset());
}

/** Returns whether the current theme is dark, and a function to toggle */
export function getThemeState(): { isDark: boolean } {
  const id = getStoredPreset();
  const preset = PRESETS.find(p => p.id === id);
  return { isDark: preset?.isDark ?? true };
}

export function toggleLightDark() {
  const current = getStoredPreset();
  const preset = PRESETS.find(p => p.id === current);
  const newId: PresetId = preset?.isDark ? 'light' : 'mono';
  applyThemeById(newId, true);
  return !preset?.isDark; // returns new isDark
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

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export function NowPlayingWidget() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
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
            setElapsedMs(json.progressMs);
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

  // animate progress bar + elapsed time locally between polls
  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) return;

    const tick = setInterval(() => {
      setProgress((prev) => {
        const increment = (1000 / data.durationMs!) * 100;
        return Math.min(prev + increment, 100);
      });
      setElapsedMs((prev) => Math.min(prev + 1000, data.durationMs!));
    }, 1000);

    return () => clearInterval(tick);
  }, [data]);

  const isPlaying = data?.isPlaying && data.track;
  const hasLastTrack = data && !data.isPlaying && data.lastTrack;

  const recentTracks = data?.recentTracks ?? [];

  // get album arts from recent tracks for the stack effect
  const stackArts = recentTracks
    .filter((t) => t.albumArt && t.albumArt !== data?.albumArt)
    .slice(0, 2)
    .map((t) => t.albumArt!);

  const [hovered, setHovered] = useState(false);

  return (
    <div className="py-1">
      {isPlaying ? (
        <div className="grid grid-cols-[150px_1fr] gap-6 max-sm:grid-cols-1">
          {/* Album art stack */}
          {data.albumArt ? (
            <div
              className="relative w-[150px] h-[150px] shrink-0 max-sm:w-full max-sm:h-auto max-sm:aspect-square"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {/* past album covers behind */}
              {stackArts.map((art, i) => (
                <img
                  key={art}
                  src={art}
                  alt="recent album"
                  className="absolute inset-0 w-full h-full rounded-lg object-cover pointer-events-none"
                  style={{
                    transform: hovered
                      ? `rotate(${(i + 1) * -12}deg) translate(${(i + 1) * -42}px, ${(i + 1) * 14}px) scale(${1 - (i + 1) * 0.04})`
                      : 'rotate(0deg) translate(0, 0) scale(1)',
                    opacity: hovered ? 0.95 - i * 0.10 : 0,
                    transition: `transform ${280 + i * 60}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${220 + i * 40}ms ease`,
                    zIndex: -1 - i,
                  }}
                />
              ))}
              {/* current album */}
              <img
                src={data.albumArt}
                alt={`${data.track} album art`}
                className="relative z-10 w-full h-full rounded-lg object-cover"
                style={{
                  transition: 'transform 280ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transform: hovered && stackArts.length > 0 ? 'rotate(2deg) translateY(-2px)' : 'none',
                }}
              />
            </div>
          ) : (
            <div className={`vinyl-record vinyl-spinning shrink-0`} style={{ width: 150, height: 150 }} />
          )}

          {/* Track info */}
          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div className={`eq-bars ${isPlaying ? '' : 'eq-bars-stopped'}`}>
                <div className="eq-bar" /><div className="eq-bar" /><div className="eq-bar" /><div className="eq-bar" />
              </div>
              <span className="text-[11px] text-ctp-overlay0">now playing</span>
            </div>

            {data.spotifyUrl ? (
              <a href={data.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-ctp-text truncate mb-1 hover:text-ctp-accent transition-colors no-underline">{data.track}</a>
            ) : (
              <p className="text-base font-medium text-ctp-text truncate mb-1">{data.track}</p>
            )}
            <p className="text-sm text-ctp-subtext0 truncate mb-3">{data.artist}</p>

            <div className="h-1 rounded-full bg-ctp-surface0 overflow-hidden">
              <div
                className="h-full bg-ctp-accent rounded-full transition-[width] duration-1000 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            {data.durationMs && (
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-ctp-subtext0">{formatMs(elapsedMs)}</span>
                <span className="text-[10px] text-ctp-subtext0">{formatMs(data.durationMs)}</span>
              </div>
            )}

            {/* recently played */}
            {recentTracks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-ctp-surface0/50">
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
            )}
          </div>
        </div>
      ) : hasLastTrack ? (
        <div className="flex items-center gap-4">
          <div className="vinyl-record vinyl-stopped" style={{ width: 64, height: 64 }} />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-[11px] text-ctp-subtext0 italic mb-1">last played</p>
            <p className="text-sm text-ctp-text truncate mb-0.5">{data.lastTrack}</p>
            <p className="text-[11px] text-ctp-subtext0 truncate">{data.lastArtist}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="vinyl-record vinyl-stopped" style={{ width: 64, height: 64 }} />
          <p className="text-[11px] text-ctp-overlay0 italic">silence.</p>
        </div>
      )}
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
    <div className="status-row">
      <span className="status-label">status</span>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-ctp-text">Auburn, AL</span>
        <span className="text-ctp-overlay0">·</span>
        <span className="text-ctp-subtext0">{time} CST</span>
        <span className="text-ctp-overlay0">·</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-ctp-green shrink-0 animate-pulse" />
          <span className="text-[11px] text-ctp-green">open to work</span>
        </span>
      </div>
    </div>
  );
}

// ─── latest upload ───────────────────────────────────────────────────────────

export function LatestUploadWidget() {
  const latest = videos[0];
  if (!latest) return null;

  return (
    <a
      href={latest.url}
      target="_blank"
      rel="noopener noreferrer"
      className="widget h-full grid grid-cols-[240px_1fr] gap-5 items-center no-underline group max-sm:grid-cols-1 p-[14px]"
         >
      {/* thumbnail */}
      <div className="video-thumbnail relative w-full aspect-video rounded-md overflow-hidden bg-ctp-surface0/30 shrink-0">
        <img
          src={latest.thumbnailUrl}
          alt={latest.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <span className="play-pill">watch ↗</span>
        <span className="absolute bottom-1 right-1 text-[9px] bg-ctp-base/80 text-ctp-text px-1 py-0.5 rounded font-medium z-10">
          {latest.duration}
        </span>
      </div>

      {/* content */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 text-ctp-accent shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
          <span className="text-[11px] text-ctp-overlay0">latest upload</span>
        </div>

        <p className="text-xs text-ctp-text leading-snug mb-1 group-hover:text-ctp-accent transition-colors line-clamp-2">
          {latest.title}
        </p>
        <p className="text-[10px] text-ctp-overlay0 tracking-wide">{latest.tag}</p>

        <div className="flex items-center gap-1 mt-auto pt-2">
          <span className="text-[10px] text-ctp-subtext0 group-hover:text-ctp-accent transition-colors">
            watch on youtube
          </span>
          <svg className="w-2.5 h-2.5 text-ctp-subtext0 group-hover:text-ctp-accent transition-colors arrow-nudge" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7" /><path d="M7 7h10v10" />
          </svg>
        </div>
      </div>
    </a>
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
          const data: { sha: string; commit: { message: string; author: { date: string } } }[] = await res.json();
          return data.map((c) => ({
            repo: repo.name,
            repoFullName: repo.full_name,
            repoLang: repo.language,
            message: c.commit.message.split('\n')[0],
            timestamp: c.commit.author.date,
            sha: c.sha,
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

  // summary line
  const commitCount = commits.length;
  const langSummary = languages.map(l => `${l.label} ${l.percent}%`).join(' · ');

  return (
    <div className="flex flex-col gap-3">
      {/* summary */}
      <div className="flex items-center gap-3 text-xs">
        <span className="text-ctp-subtext1">{loading ? '...' : `${commitCount} recent commits`}</span>
        {langSummary && <span className="text-ctp-overlay0">{langSummary}</span>}
        {languages.length > 0 && (
          <div className="flex rounded-full h-1.5 overflow-hidden flex-1 max-w-[140px] ml-auto">
            {languages.map((seg, i) => (
              <div key={i} className={`${seg.color} h-full`} style={{ width: `${seg.percent}%` }} />
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-[26px] rounded bg-ctp-surface0/30 animate-pulse" />
          ))}
        </div>
      ) : commits.length === 0 ? (
        <p className="text-xs text-ctp-overlay0 italic">no recent commits</p>
      ) : (
        <div className="space-y-2">
          {commits.map((c, i) => (
            <a
              key={i}
              href={`https://github.com/${c.repoFullName}/commit/${c.sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-xs leading-[1.5] no-underline group"
            >
              <span className="text-ctp-overlay0 shrink-0">{c.repo}</span>
              <span className="text-ctp-subtext0 truncate flex-1 group-hover:text-ctp-text transition-colors">{c.message}</span>
              <span className="text-[10px] text-ctp-overlay0 shrink-0">{timeAgo(c.timestamp)}</span>
              <svg
                className="w-3 h-3 shrink-0 text-ctp-overlay0 group-hover:text-ctp-accent transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

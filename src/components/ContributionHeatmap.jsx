import { useEffect, useState } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const GITHUB_USER = 'UlissesMolina';
const ALL_REPOS = [
  'personal-portflio',
  'Trackr',
  'Tiger-Scheduler-Course-Auto-Register-Tool',
  'FinanceDashBoard',
  'Enterprise',
];
const MAX_DISPLAY = 3;

const REPO_LABELS = {
  'personal-portflio': 'portfolio',
  'Trackr': 'trackr',
  'Tiger-Scheduler-Course-Auto-Register-Tool': 'tiger-scheduler',
  'FinanceDashBoard': 'clarity-finance',
  'Enterprise': 'enterprise-api',
};

const LEVEL_BG = [
  'rgb(var(--surface-border))', // level 0 — adapts to light/dark
  'color-mix(in srgb, var(--accent) 20%, transparent)',
  'color-mix(in srgb, var(--accent) 45%, transparent)',
  'color-mix(in srgb, var(--accent) 70%, transparent)',
  'var(--accent)',
];

function truncateMessage(msg, maxLen = 52) {
  if (!msg || msg.length <= maxLen) return msg || '';
  return msg.slice(0, maxLen).trim() + '…';
}

function formatRelativeDate(date) {
  if (!date || isNaN(date)) return '';
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

async function fetchRepoCommits(repo) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=3`;
    const res = await fetch(url, { headers: { Accept: 'application/vnd.github.v3+json' } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((c) => ({
      repoLabel: REPO_LABELS[repo] ?? repo,
      message: c.commit?.message?.split('\n')[0] || '',
      date: c.commit?.author?.date ? new Date(c.commit.author.date) : null,
      url: c.html_url,
    }));
  } catch {
    return [];
  }
}

export default function ContributionHeatmap() {
  const [contributions, setContributions] = useState([]);
  const [total, setTotal] = useState(0);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  const [commits, setCommits] = useState([]);
  const [commitsLoading, setCommitsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        const contribs = data.contributions || [];
        setContributions(contribs);
        setTotal(contribs.reduce((sum, c) => sum + c.count, 0));
        setHeatmapLoading(false);
      })
      .catch(() => {
        if (!cancelled) setHeatmapLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      const results = await Promise.all(ALL_REPOS.map(fetchRepoCommits));
      if (cancelled) return;
      const all = results
        .flat()
        .filter((c) => c.date)
        .sort((a, b) => b.date - a.date)
        .slice(0, MAX_DISPLAY);
      setCommits(all);
      setCommitsLoading(false);
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // Build 52×7 grid, padded to start on Sunday
  const weeks = [];
  if (contributions.length > 0) {
    const firstDate = new Date(contributions[0].date);
    const dayOfWeek = firstDate.getDay();
    const padded = [...Array(dayOfWeek).fill(null), ...contributions];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7));
    }
  }

  return (
    <div className="font-sans w-full rounded-xl border border-surface-border bg-surface-card overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-ink-muted font-medium">
            <span className="text-ink font-semibold">{total}</span> contributions in the last year
          </span>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-ink-dim hover:text-accent transition-colors flex items-center gap-1"
          >
            GitHub <FaExternalLinkAlt size={8} />
          </a>
        </div>

        {heatmapLoading ? (
          <div className="h-[88px] flex items-center justify-center text-xs text-ink-dim">
            Loading heatmap...
          </div>
        ) : (
          <div className="flex gap-[3px] overflow-x-auto scrollbar-hide pb-1">
            {weeks.map((week, wi) => {
              const padded = week.length < 7
                ? [...week, ...Array(7 - week.length).fill(null)]
                : week;
              return (
                <div key={wi} className="flex flex-col gap-[3px] shrink-0">
                  {padded.map((day, di) => (
                    <div
                      key={di}
                      title={
                        day
                          ? `${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`
                          : ''
                      }
                      className="h-2.5 w-2.5 rounded-[2px] transition-transform duration-100 hover:scale-150 hover:z-10 relative cursor-default"
                      style={{
                        backgroundColor: day ? LEVEL_BG[day.level ?? 0] : 'transparent',
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-surface-border divide-y divide-surface-border">
        {commitsLoading ? (
          <div className="px-4 py-3 text-xs text-ink-dim">Loading commits...</div>
        ) : commits.length === 0 ? (
          <div className="px-4 py-3 text-xs text-ink-dim">No recent commits found.</div>
        ) : (
          commits.map((commit, i) => (
            <a
              key={i}
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-border/30 transition-all duration-150 group hover:translate-x-0.5"
            >
              <span className="font-mono text-[11px] text-ink-dim shrink-0 w-16 tabular-nums">
                {formatRelativeDate(commit.date)}
              </span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md text-ink-dim border border-surface-border group-hover:border-accent/30 group-hover:text-accent/70 shrink-0 transition-colors duration-150">
                {commit.repoLabel}
              </span>
              <span className="text-sm text-ink-muted truncate group-hover:text-ink transition-colors duration-150">
                {truncateMessage(commit.message)}
              </span>
              <FaExternalLinkAlt size={9} className="ml-auto shrink-0 text-ink-dim opacity-0 group-hover:opacity-60 transition-opacity duration-150" />
            </a>
          ))
        )}
      </div>
    </div>
  );
}

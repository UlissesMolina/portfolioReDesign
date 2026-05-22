import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NOW, experiences, featuredProjects, EMAIL } from '../data';
import TagList from '../components/TagList';
import ProjectCard from '../components/ProjectCard';
import { NowPlayingWidget, CurrentlyWidget, RecentCommitsWidget, ThemeWidget } from '../components/Widgets';

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-xs font-medium tracking-widest shrink-0">
        <span className="text-ctp-overlay0">//</span>{' '}
        <span className="text-ctp-subtext0">{title}</span>
      </h2>
      <div className="divider-line" />
      {right}
    </div>
  );
}

function FooterClock() {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Chicago' })
  );
  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Chicago' }));
    }, 30000);
    return () => clearInterval(t);
  }, []);
  return <span>{time} CST</span>;
}

function getViewCount(): string {
  const key = 'site_views';
  let count = parseInt(localStorage.getItem(key) || '0', 10);
  if (!sessionStorage.getItem('counted')) {
    count += 1;
    localStorage.setItem(key, String(count));
    sessionStorage.setItem('counted', '1');
  }
  return count.toLocaleString();
}

export default function HomePage() {
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2200);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      showToast('email copied');
    });
  };

  // scroll-triggered reveal
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-content w-full px-8 pt-16 pb-8">
        {/* ════════════════════════════════════════════════════════════════════
            ROW 1 — hero + stacked widgets (currently + theme)
        ════════════════════════════════════════════════════════════════════ */}
        <div className="bento-grid mb-[14px]">
          {/* hero: col 1–8 */}
          <section className="col-span-full lg:col-span-8 pt-4 pb-2">
            <p data-animate data-animate-delay="1" className="text-[11px] tracking-[0.2em] text-ctp-overlay0 mb-4">
              <span className="text-ctp-overlay0">//</span> software engineer · auburn university
            </p>
            <h1 data-animate data-animate-delay="2" className="text-[32px] leading-tight font-medium text-ctp-text mb-5">
              <span className="font-bold text-ctp-mauve">U</span><span className="cursor-blink text-ctp-mauve">_</span>lisses molina<span className="text-ctp-mauve">.</span>
            </h1>
            <p data-animate data-animate-delay="3" className="text-sm text-ctp-subtext1 leading-relaxed max-w-[56ch] mb-2">
              I care about the mass of small decisions that make software feel inevitable
              rather than assembled. Seeing something I built survive contact with real
              users—and watching them not even notice the work—is the part that keeps
              me here.<sup className="text-ctp-mauve text-[9px] cursor-help ml-0.5" title="that's the highest compliment">[1]</sup>
            </p>
            <p data-animate data-animate-delay="4" className="text-xs text-ctp-overlay0 leading-relaxed">
              i'm picky about the details that nobody notices unless they're missing.
            </p>
          </section>

          {/* widgets column: col 9–12 */}
          <div className="col-span-full lg:col-span-4 flex flex-col gap-[14px]" data-animate data-animate-delay="3">
            <CurrentlyWidget />
            <ThemeWidget />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            ROW 2 — now playing + now callout + recent commits
        ════════════════════════════════════════════════════════════════════ */}
        <div className="bento-grid mb-[14px] items-stretch" data-animate data-animate-delay="5">
          {/* now callout: col 1–4 */}
          <div className="col-span-full lg:col-span-4 min-h-[170px]">
            <NowPlayingWidget />
          </div>

          {/* now status: col 5–8 */}
          <div className="col-span-full lg:col-span-4 min-h-[170px]">
            <div className="widget h-full border-l-2 !border-l-ctp-mauve !rounded-l-none text-xs text-ctp-subtext0 leading-relaxed flex items-center">
              <div>
                <span className="text-ctp-mauve font-medium">now</span>
                <span className="text-ctp-surface2 mx-2">→</span>
                interning at{' '}
                <span className="text-ctp-peach">{NOW.company}</span>, learning{' '}
                <span className="text-ctp-text">{NOW.learning}</span>, shipping{' '}
                <span className="text-ctp-text">{NOW.shipping}</span>
              </div>
            </div>
          </div>

          {/* recent commits: col 9–12 */}
          <div className="col-span-full lg:col-span-4 min-h-[170px]">
            <RecentCommitsWidget />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            ROW 3 — experience
        ════════════════════════════════════════════════════════════════════ */}
        <section id="work" className="mb-[14px] scroll-mt-20" data-reveal>
          <SectionHeader title="experience" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {experiences.map((exp) => (
              <div
                key={`${exp.company}-${exp.title}`}
                className="widget"
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <p className="text-sm text-ctp-text">
                    {exp.title}{' '}
                    <span className="text-ctp-overlay0">@</span>{' '}
                    <span className="text-ctp-peach">{exp.company}</span>
                  </p>
                  <p className="text-[11px] text-ctp-overlay0 shrink-0 tracking-wide">
                    {exp.period}
                  </p>
                </div>
                <p className="text-xs text-ctp-subtext0 leading-relaxed mb-2.5">
                  {exp.description}
                </p>
                <TagList tags={exp.tags} />
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            ROW 4 — featured work
        ════════════════════════════════════════════════════════════════════ */}
        <section id="projects" className="mb-[14px] scroll-mt-20" data-reveal>
          <SectionHeader
            title="featured work"
            right={
              <Link
                to="/projects"
                className="text-[11px] text-ctp-mauve hover:text-ctp-mauve/80 transition-colors shrink-0"
              >
                view all →
              </Link>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            ROW 5 — footer
        ════════════════════════════════════════════════════════════════════ */}
        <footer id="contact" className="border-t border-ctp-surface0/50 py-6 scroll-mt-20" data-reveal>
          {/* contact CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-lg font-medium text-ctp-text mb-2">
                let's build something.
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="text-sm text-ctp-mauve hover:text-ctp-mauve/80 transition-colors"
              >
                {EMAIL}
              </button>
            </div>
            <div className="flex items-center gap-5 text-xs text-ctp-overlay0">
              <a href="https://github.com/UlissesMolina" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                github
              </a>
              <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                linkedin
              </a>
              <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                resume
              </a>
            </div>
          </div>

          {/* busy status bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ctp-overlay0 border-t border-ctp-surface0/30 pt-4">
            <span>© 2026 Ulisses Molina</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-ctp-green" />
              All Systems Nominal
            </span>
            <FooterClock />
            <span className="text-ctp-teal">{getViewCount()} views</span>
            <a href="https://github.com/UlissesMolina/testportflio/commit/1c331f0" target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
              ⌥ 1c331f0
            </a>
          </div>
        </footer>
      </div>

      {/* toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-ctp-mantle border border-ctp-surface0 text-ctp-text text-xs px-3 py-2 rounded-lg pointer-events-none">
          {toast}
        </div>
      )}
    </>
  );
}

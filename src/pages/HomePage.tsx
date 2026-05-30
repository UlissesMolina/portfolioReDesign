import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { experiences, featuredProjects, EMAIL, GITHUB_USERNAME } from '../data';
import TagList from '../components/TagList';
import ProjectCard from '../components/ProjectCard';
import { NowPlayingWidget, ThisWeekWidget, RecentCommitsWidget, ThemeWidget, LocationWidget } from '../components/Widgets';

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
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Chicago',
    });

  const [time, setTime] = useState(fmt);

  useEffect(() => {
    const t = setInterval(() => setTime(fmt()), 60000);
    return () => clearInterval(t);
  }, []);

  return <span>{time} CST</span>;
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
        {/* ═══════════════════════════════════════════════════════════════
            ROW 1 — hero (1–7) + this week / theme (8–12)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bento-grid mb-[14px]" style={{ alignItems: 'start' }}>
          {/* hero: col 1–7 */}
          <section className="col-span-full lg:col-span-7 pt-4 pb-2">
            <p data-animate data-animate-delay="1" className="text-[11px] tracking-[0.2em] text-ctp-overlay0 mb-4">
              <span className="text-ctp-overlay0">//</span> software engineer · auburn university
            </p>
            <h1 data-animate data-animate-delay="2" className="text-[32px] leading-tight font-medium text-ctp-text mb-5">
              Ulisses molina<span className="cursor-blink text-ctp-accent">.</span>
            </h1>
            <p data-animate data-animate-delay="3" className="text-sm text-ctp-subtext1 leading-relaxed max-w-[56ch]">
              Software engineering intern @ OCV LLC. Studying at Auburn University. Interested in full-stack development or AI development. Feel free to{' '}
              <button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-ctp-accent hover:text-ctp-accent/80 transition-colors">reach out</button>!
            </p>
            <div data-animate data-animate-delay="4" className="flex items-center gap-4 mt-4 text-xs text-ctp-overlay0">
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">github</a>
              <span className="text-ctp-surface1">·</span>
              <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">linkedin</a>
              <span className="text-ctp-surface1">·</span>
              <button type="button" onClick={copyEmail} className="link-underline hover:text-ctp-text transition-colors">email</button>
              <span className="text-ctp-surface1">·</span>
              <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">resume</a>
            </div>
          </section>

          {/* widgets column: col 8–12 */}
          <div className="col-span-full lg:col-span-5 flex flex-col gap-[14px]" data-animate data-animate-delay="3">
            <ThisWeekWidget />
            <ThemeWidget />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ROW 2 — now playing + currently/location + recent commits
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bento-grid mb-[14px] items-stretch" data-animate data-animate-delay="5">
          <div className="col-span-full lg:col-span-4">
            <NowPlayingWidget />
          </div>
          <div className="col-span-full lg:col-span-4">
            <LocationWidget />
          </div>
          <div className="col-span-full lg:col-span-4">
            <RecentCommitsWidget />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ROW 3 — experience
        ═══════════════════════════════════════════════════════════════ */}
        <section id="work" className="mb-[14px] scroll-mt-20">
          <div data-reveal><SectionHeader title="experience" /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {experiences.map((exp, i) => (
              <div
                key={`${exp.company}-${exp.title}`}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
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

        {/* ═══════════════════════════════════════════════════════════════
            ROW 4 — featured work
        ═══════════════════════════════════════════════════════════════ */}
        <section id="projects" className="mb-[14px] scroll-mt-20">
          <div data-reveal><SectionHeader
            title="featured work"
            right={
              <Link
                to="/projects"
                className="text-[11px] text-ctp-accent hover:text-ctp-accent/80 transition-colors shrink-0"
              >
                view all →
              </Link>
            }
          /></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
            {featuredProjects.map((project, i) => (
              <div key={project.title} data-reveal style={{ transitionDelay: `${i * 100}ms` }}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            ROW 5 — footer
        ═══════════════════════════════════════════════════════════════ */}
        <footer id="contact" className="border-t border-ctp-surface0/50 py-6 scroll-mt-20" data-reveal>
          {/* contact CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-lg font-medium text-ctp-text mb-2">
                get in touch
              </p>
              <button
                type="button"
                onClick={copyEmail}
                className="text-sm text-ctp-accent hover:text-ctp-accent/80 transition-colors"
              >
                {EMAIL}
              </button>
            </div>
            <div className="flex items-center gap-5 text-xs text-ctp-overlay0">
              <a href="https://github.com/UlissesMolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
                github
              </a>
              <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
                linkedin
              </a>
              <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
                resume
              </a>
            </div>
          </div>

          {/* status bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ctp-overlay0 border-t border-ctp-surface0/30 pt-4">
            <span>© 2026 Ulisses Molina</span>
            <FooterClock />
          </div>
        </footer>
      </div>

      {/* toast */}
      <div className={`fixed bottom-6 right-6 z-50 bg-ctp-mantle border border-ctp-surface0 text-ctp-text text-xs px-3 py-2 rounded-lg pointer-events-none transition-all duration-200 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {toast || '\u00A0'}
      </div>
    </>
  );
}

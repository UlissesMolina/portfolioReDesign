import './App.css'
import { useEffect, useRef, useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import ContributionHeatmap from './components/ContributionHeatmap';
import MapCard from './components/MapCard';
import ClickCounter from './components/ClickCounter';
import StackCard from './components/StackCard';
import SideBars from './components/SideBars';
import CursorTrail from './components/CursorTrail';
import ParticleConstellation from './components/ParticleConstellation';

function ScrambleNumber({ number }) {
  const [display, setDisplay] = useState(number);
  const intervalRef = useRef(null);
  const handleMouseEnter = () => {
    let iterations = 0;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setDisplay(
        number.split('').map((char, i) =>
          i < iterations ? char : String(Math.floor(Math.random() * 10))
        ).join('')
      );
      iterations++;
      if (iterations > number.length) {
        clearInterval(intervalRef.current);
        setDisplay(number);
      }
    }, 120);
  };
  return (
    <span
      className="font-mono text-sm text-accent cursor-default select-none"
      onMouseEnter={handleMouseEnter}
    >
      {display}
    </span>
  );
}

function SectionHeader({ number, title, visible }) {
  return (
    <div className={`flex items-center gap-4 mb-8 w-full ${visible ? 'anim-float-up' : 'opacity-0'}`}>
      <ScrambleNumber number={number} />
      <h2 className="font-serif text-2xl sm:text-3xl text-ink whitespace-nowrap">{title}</h2>
      <div className="flex-1 h-px bg-surface-border" />
    </div>
  );
}

function App() {
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState('');
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [loadingBarActive, setLoadingBarActive] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [customColor, setCustomColor] = useState('#c0392b');
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);
  const [clockTime, setClockTime] = useState('');
  const [nameGlitch, setNameGlitch] = useState(false);
  const nameClickRef = useRef({ timestamps: [] });
  const [activeTag, setActiveTag] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
  };

  const handleNameClick = () => {
    const now = Date.now();
    const ts = nameClickRef.current.timestamps;
    ts.push(now);
    const recent = ts.filter(t => now - t < 1800);
    nameClickRef.current.timestamps = recent;
    if (recent.length >= 7) {
      nameClickRef.current.timestamps = [];
      setNameGlitch(false);
      requestAnimationFrame(() => {
        setNameGlitch(true);
        setTimeout(() => setNameGlitch(false), 800);
      });
      showToast('secret unlocked.');
    }
  };

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('umolina2005@gmail.com').then(() => showToast('✓ Email copied'));
  };

  const scrollToSection = (id) => {
    setLoadingBarActive(true);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!loadingBarActive) return;
    const t = setTimeout(() => setLoadingBarActive(false), 500);
    return () => clearTimeout(t);
  }, [loadingBarActive]);

  useEffect(() => {
    const ids = ['about', 'experience', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          if (ids.includes(id)) setActiveSection(id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      if (nearBottom) setActiveSection('contact');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, [isDark]);

  useEffect(() => {
    const fmt = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setClockTime(fmt());
    const id = setInterval(() => setClockTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', customColor);
    document.documentElement.style.setProperty('--accent-light', customColor + 'cc');
  }, [customColor]);

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  useEffect(() => {
    let idx = 0;
    const onKey = (e) => {
      const key = e.key.toLowerCase() === 'a' ? 'a' : e.key;
      if (key === KONAMI[idx]) {
        idx += 1;
        if (idx === KONAMI.length) {
          showToast('No way you tried the Konami code.');
          idx = 0;
        }
      } else { idx = 0; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => {
            if (prev.has(entry.target.id)) return prev;
            return new Set([...prev, entry.target.id]);
          });
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -120px 0px' });
    sectionRefs.current.forEach(ref => { if (ref) observer.observe(ref); });
    return () => {
      sectionRefs.current.forEach(ref => { if (ref) observer.unobserve(ref); });
      observer.disconnect();
    };
  }, []);

  const experiences = [
    {
      company: 'Room2Room Movers',
      title: 'Part-Time Software Engineering Intern',
      period: 'January 2026 – Present',
      tech: ['React', 'TypeScript', 'Firebase', 'Jira'],
    },
    {
      company: 'OCV, LLC',
      title: 'Part-Time Software Engineering Intern',
      period: 'September 2025 – Present',
      tech: ['JSON', 'iOS', 'Android', 'QC'],
    },
  ];

  const projects = [
    {
      title: 'Trackr',
      description: 'Full-stack job application tracker with a Kanban board, analytics dashboard, and CSV bulk import. Uses OpenAI GPT-4o to generate personalized cover letters from resume data. Clerk auth, RESTful API, TanStack Query.',
      tags: ['React', 'TypeScript', 'Node.js', 'OpenAI'],
      githubUrl: 'https://github.com/UlissesMolina/Trackr',
      demoUrl: 'https://usetrackr.netlify.app/',
      featured: true,
      type: 'Web App',
      snippetFile: 'useJobs.ts',
      snippet: `const { data: jobs } = useQuery({
  queryKey: ['jobs', filters],
  queryFn: () => api.getJobs(filters),
  staleTime: 1000 * 60 * 5,
});`,
    },
    {
      title: 'Tiger Scheduler Course Auto-Register Tool',
      description: 'Python automation that polls Auburn\'s TigerScheduler every 60 seconds, detects open seats, and auto-registers — handling login, course filtering, and retries.',
      tags: ['Python', 'Selenium', 'Web Automation'],
      githubUrl: 'https://github.com/UlissesMolina/Tiger-Scheduler-Course-Auto-Register-Tool',
      demoUrl: null,
      featured: false,
      type: 'Automation',
      snippetFile: 'scheduler.py',
      snippet: `while True:
    driver.get(SCHEDULE_URL)
    seats = driver.find_element(By.ID, 'open_seats')
    if seats.text != '0':
        enroll(driver, course_id)
        break
    time.sleep(60)`,
    },
    {
      title: 'Clarity Finance',
      description: 'See your money clearly. Track your income, expenses, and savings in one place.',
      tags: ['React', 'TypeScript', 'CSS'],
      githubUrl: 'https://github.com/UlissesMolina/FinanceDashBoard',
      demoUrl: 'https://clarityfi.netlify.app/',
      featured: false,
      type: 'Web App',
      snippetFile: 'useSummary.ts',
      snippet: `const balance = transactions.reduce(
  (sum, tx) =>
    tx.type === 'income'
      ? sum + tx.amount
      : sum - tx.amount,
  0
);`,
    },
    {
      title: 'Enterprise Expense Management API',
      description: 'Layered Spring Boot REST API with JWT auth and role-based access control via Spring Security. Features transactional approval workflows, audit logging, and PostgreSQL persistence. Integration-tested with Testcontainers and documented with OpenAPI/Swagger. Containerized with Docker and Docker Compose.',
      tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com/UlissesMolina/Enterprise',
      demoUrl: null,
      featured: true,
      type: 'REST API',
      snippetFile: 'ExpenseController.java',
      snippet: `@PostMapping("/{id}/approve")
@PreAuthorize("hasRole('MANAGER')")
public ResponseEntity<Expense> approve(
    @PathVariable Long id) {
  return ResponseEntity.ok(
    service.approve(id));
}`,
    },
  ];

  return (
    <div className="relative min-h-screen font-sans transition-colors duration-300 bg-surface-grid">
      <CursorTrail />
      {loadingBarActive && <div className="load-bar" aria-hidden="true" />}
      <SideBars isDark={isDark} onToggleDark={() => setIsDark(d => !d)} />
      <NavBar
        activeSection={activeSection}
        onNavClick={scrollToSection}
        customColor={customColor}
        onCustomColor={setCustomColor}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 z-10 flex flex-col">

        {/* ── HERO ── */}
        <header id="about" className="relative pt-20 pb-14 scroll-mt-[5rem]">
          {/* Grid background */}
          <div className="hero-bg" aria-hidden="true" />
          {/* Particle constellation */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute hidden sm:block"
            style={{ width: '560px', height: '560px', right: '-50px', top: '50%', transform: 'translateY(-50%)', zIndex: 0 }}
          >
            <ParticleConstellation />
          </div>

          <div className="relative z-10 max-w-3xl">
            <p
              className="slide-up group flex items-center gap-3 font-mono text-xs text-accent tracking-widest uppercase mb-5"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="h-px w-8 bg-accent shrink-0 group-hover:w-14 transition-all duration-300" />
              {'Software Engineer'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block hover:text-ink hover:-translate-y-1 transition-all duration-150 ease-out"
                  style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                >
                  {char}
                </span>
              ))}
            </p>

            <h1
              className={`slide-up font-serif text-ink leading-[1.0] tracking-tight mb-6 cursor-pointer select-none${nameGlitch ? ' name-glitch' : ''}`}
              style={{ fontSize: 'clamp(56px, 8vw, 110px)', animationDelay: '0.2s' }}
              onClick={handleNameClick}
            >
              {'Ulisses Molina'.split('').map((char, i) => (
                <span
                  key={i}
                  className="inline-block hover:text-accent hover:-translate-y-2 transition-all duration-150 ease-out"
                  style={{ whiteSpace: char === ' ' ? 'pre' : undefined }}
                >
                  {char}
                </span>
              ))}
            </h1>

            <p
              className="slide-up text-ink-muted text-base sm:text-lg leading-relaxed mb-8 max-w-[55ch]"
              style={{ animationDelay: '0.35s' }}
            >
              Full-stack development, SWE @ Auburn University.
            </p>

            <div
              className="slide-up flex flex-wrap gap-3"
              style={{ animationDelay: '0.48s' }}
            >
              <button
                type="button"
                onClick={() => scrollToSection('projects')}
                className="px-5 py-2.5 rounded-lg bg-accent text-surface-bg text-sm font-semibold transition-colors duration-200 hover:bg-accent-light"
              >
                View Projects
              </button>
              <button
                type="button"
                onClick={() => window.open('/uliResume.pdf', '_blank')}
                className="px-5 py-2.5 rounded-lg border border-surface-border text-ink-muted hover:border-accent/50 hover:text-ink text-sm font-medium transition-all duration-200"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('experience')}
                className="px-5 py-2.5 rounded-lg border border-surface-border text-ink-muted hover:border-accent/50 hover:text-ink text-sm font-medium transition-all duration-200"
              >
                View Work
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-14">

          {/* ── EXPERIENCE ── */}
          <section
            id="experience"
            ref={el => sectionRefs.current[0] = el}
            className="flex flex-col items-start w-full"
          >
            <SectionHeader number="01" title="Experience" visible={visibleSections.has('experience')} />
            <div className="w-full max-w-3xl divide-y divide-surface-border">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`group grid exp-row gap-2 py-8 hover:bg-surface-card/30 px-3 -mx-3 rounded-lg transition-colors duration-200 ${visibleSections.has('experience') ? 'anim-from-left' : 'opacity-0'}`}
                  style={{ animationDelay: visibleSections.has('experience') ? `${index * 120}ms` : undefined }}
                >
                  <p className="font-mono text-xs text-ink-dim leading-relaxed pt-0.5">{exp.period}</p>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {exp.period.includes('Present') && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" aria-hidden />
                      )}
                      <span className="font-medium text-ink text-sm">{exp.title}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{exp.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-md border border-surface-border text-ink-dim group-hover:border-accent/30 group-hover:text-accent/70 hover:border-accent hover:text-accent hover:scale-110 hover:-translate-y-0.5 transition-all duration-150 cursor-default"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── PROJECTS ── */}
          <section
            id="projects"
            ref={el => sectionRefs.current[1] = el}
            className="flex flex-col items-start w-full"
          >
            <SectionHeader number="02" title="Projects" visible={visibleSections.has('projects')} />

            {/* Tag filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-all duration-150 ${activeTag === null ? 'bg-accent text-surface-bg border-accent' : 'border-surface-border text-ink-dim hover:border-accent/50 hover:text-ink-muted'}`}
              >
                all
              </button>
              {[...new Set(projects.flatMap(p => p.tags))].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full font-mono text-[11px] border transition-all duration-150 ${activeTag === tag ? 'bg-accent text-surface-bg border-accent' : 'border-surface-border text-ink-dim hover:border-accent/50 hover:text-ink-muted'}`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid gap-4 w-full max-w-4xl grid-cols-1 sm:grid-cols-2">
              {projects
                .filter(p => activeTag === null || p.tags.includes(activeTag))
                .map((project, index) => (
                  <div
                    key={project.title}
                    className={`${project.featured ? 'sm:col-span-2' : ''} ${visibleSections.has('projects') ? 'anim-scale-up' : 'opacity-0'}`}
                    style={{ animationDelay: visibleSections.has('projects') ? `${index * 90}ms` : undefined }}
                  >
                    <ProjectCard project={project} roundedClass="rounded-xl" featured={project.featured} />
                  </div>
                ))}
            </div>
          </section>

          {/* ── AT A GLANCE ── */}
          <section
            id="activity"
            ref={el => sectionRefs.current[2] = el}
            className="flex flex-col items-start w-full"
          >
            <SectionHeader number="03" title="At a Glance" visible={visibleSections.has('activity')} />

            <div className="bento-grid w-full max-w-4xl">
              <div
                className={`bento-map h-[260px] sm:h-auto ${visibleSections.has('activity') ? 'anim-float-up' : 'opacity-0'}`}
                style={{ animationDelay: '0ms' }}
              >
                <MapCard isDark={isDark} />
              </div>
              <div
                className={`bento-count h-[200px] sm:h-auto ${visibleSections.has('activity') ? 'anim-float-up' : 'opacity-0'}`}
                style={{ animationDelay: '80ms' }}
              >
                <ClickCounter />
              </div>
              <div
                className={`bento-stack h-[300px] sm:h-auto ${visibleSections.has('activity') ? 'anim-float-up' : 'opacity-0'}`}
                style={{ animationDelay: '160ms' }}
              >
                <StackCard />
              </div>
              <div
                className={`bento-github ${visibleSections.has('activity') ? 'anim-float-up' : 'opacity-0'}`}
                style={{ animationDelay: '240ms' }}
              >
                <ContributionHeatmap />
              </div>
            </div>
          </section>

        </main>

        {/* ── CONTACT ── */}
        <footer
          id="contact"
          ref={el => sectionRefs.current[3] = el}
          className="w-full py-16 mt-12 border-t border-surface-border scroll-mt-[5rem]"
        >
          <SectionHeader number="04" title="Contact" visible={visibleSections.has('contact')} />

          <div className={`text-center mb-10 ${visibleSections.has('contact') ? 'anim-float-up' : 'opacity-0'}`} style={{ animationDelay: '80ms' }}>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-4">
              Let's build something <span className="italic text-accent">{'together.'.split('').map((char, i) => (
                <span key={i} className="inline-block hover:text-ink hover:-translate-y-2 transition-all duration-150 ease-out">{char}</span>
              ))}</span>
            </h2>
            <p className="text-ink-muted text-sm max-w-[50ch] mx-auto leading-relaxed">
              Looking for Summer 2026 SWE internships — full-stack, backend, or automation.
            </p>
          </div>

          <div className={`flex flex-wrap gap-3 justify-center mb-12 ${visibleSections.has('contact') ? 'anim-float-up' : 'opacity-0'}`} style={{ animationDelay: '160ms' }}>
            <a
              href="mailto:umolina2005@gmail.com"
              onClick={handleCopyEmail}
              title="Click to copy"
              className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-surface-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
            >
              <FaEnvelope size={14} className="text-ink-dim group-hover:text-accent transition-colors" />
              <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">umolina2005@gmail.com</span>
            </a>
            <a
              href="https://github.com/UlissesMolina"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-surface-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
            >
              <FaGithub size={14} className="text-ink-dim group-hover:text-accent transition-colors" />
              <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">github.com/UlissesMolina</span>
            </a>
            <a
              href="https://www.linkedin.com/in/ulissesmolina"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-surface-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
            >
              <FaLinkedin size={14} className="text-ink-dim group-hover:text-accent transition-colors" />
              <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">linkedin.com/in/ulissesmolina</span>
            </a>
            <a
              href="/uliResume.pdf"
              download="uliResume.pdf"
              className="group flex items-center gap-3 px-5 py-3 rounded-xl border border-surface-border hover:border-accent hover:bg-accent/5 transition-all duration-200"
            >
              <FaFileAlt size={14} className="text-ink-dim group-hover:text-accent transition-colors" />
              <span className="text-sm text-ink-muted group-hover:text-ink transition-colors">Resume (PDF)</span>
            </a>
          </div>

          <div className={`text-center flex flex-col gap-1.5 ${visibleSections.has('contact') ? 'anim-float-up' : 'opacity-0'}`} style={{ animationDelay: '240ms' }}>
            <p className="font-mono text-[11px] text-ink-dim">
              Built with React · Vite · Tailwind
            </p>
            {clockTime && (
              <p className="font-mono text-[11px] text-ink-dim tabular-nums">
                {clockTime} — {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            )}
          </div>
        </footer>
      </div>

      {toast && (
        <div className="toast-enter fixed bottom-6 right-6 z-50 font-mono text-xs px-3 py-2 rounded-lg border bg-surface-card border-surface-border text-ink shadow-lg pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;

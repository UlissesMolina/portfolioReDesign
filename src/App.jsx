import './App.css'
import { useEffect, useRef, useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import NavBar from './components/NavBar';
import ProjectCard from './components/ProjectCard';
import SideBars from './components/SideBars';

function SectionHeader({ title, visible }) {
  return (
    <div className={`flex items-center gap-4 mb-8 w-full ${visible ? 'anim-float-up' : 'opacity-0'}`}>
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

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2000);
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
      title: 'Software Engineering Intern',
      period: 'January 2026 – Present',
      tech: ['React', 'TypeScript', 'Firebase', 'Jira'],
    },
    {
      company: 'OCV, LLC',
      title: 'Software Engineering Intern',
      period: 'September 2025 – Present',
      tech: ['JSON', 'iOS', 'Android', 'QC'],
    },
  ];

  const projects = [
    {
      title: 'Trackr',
      description: 'Job tracker with Kanban board and GPT-4o cover letter generation.',
      tags: ['React', 'TypeScript', 'Node.js', 'OpenAI'],
      githubUrl: 'https://github.com/UlissesMolina/Trackr',
      demoUrl: 'https://usetrackr.netlify.app/',
      image: '/trackr.png',
    },
{
      title: 'Clarity Finance',
      description: 'Track income, expenses, and savings in one place.',
      tags: ['React', 'TypeScript', 'CSS'],
      githubUrl: 'https://github.com/UlissesMolina/FinanceDashBoard',
      demoUrl: 'https://clarityfi.netlify.app/',
      image: '/clarity.png',
    },
    {
      title: 'Enterprise Expense API',
      description: 'Expense approval workflow with JWT auth and role-based access.',
      tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'],
      githubUrl: 'https://github.com/UlissesMolina/Enterprise',
      demoUrl: null,
    },
    {
      title: 'Audaz',
      description: 'Chess engine with move generation, search, and eval.',
      tags: ['C++', 'CMake'],
      githubUrl: 'https://github.com/UlissesMolina/ChessBot',
      demoUrl: null,
      image: '/audaz.png',
    },
  ];


  return (
    <div className="relative min-h-screen font-sans transition-colors duration-300 bg-surface-grid">
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

          <div className="relative z-10 max-w-3xl">
            <p
              className="slide-up group flex items-center gap-3 font-mono text-xs text-accent tracking-widest uppercase mb-5"
              style={{ animationDelay: '0.1s' }}
            >
              <span className="h-px w-8 bg-accent shrink-0" />
              Software Engineer
            </p>

            <h1
              className="slide-up font-serif text-ink leading-[1.0] tracking-tight mb-6 select-none"
              style={{ fontSize: 'clamp(56px, 8vw, 110px)', animationDelay: '0.2s' }}
            >
              Ulisses Molina
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
            <SectionHeader title="Experience" visible={visibleSections.has('experience')} />
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
                      <span className="font-medium text-ink text-sm">{exp.title}</span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--accent)' }}>{exp.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:justify-end">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="inline-block font-mono text-[10px] px-2 py-0.5 rounded-md border border-surface-border text-ink-dim"
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
            <SectionHeader title="Projects" visible={visibleSections.has('projects')} />

            <div className="grid gap-4 w-full max-w-4xl grid-cols-1 sm:grid-cols-2">
              {projects.map((project, index) => (
                <div
                  key={project.title}
                  className={`${projects.length % 2 !== 0 && index === projects.length - 1 ? 'sm:col-span-2 sm:max-w-[calc((100%-1rem)/2)] sm:mx-auto' : ''} ${visibleSections.has('projects') ? 'anim-scale-up' : 'opacity-0'}`}
                  style={{ animationDelay: visibleSections.has('projects') ? `${index * 90}ms` : undefined }}
                >
                  <ProjectCard project={project} roundedClass="rounded-xl" />
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* ── CONTACT ── */}
        <footer
          id="contact"
          ref={el => sectionRefs.current[3] = el}
          className="w-full py-16 mt-12 scroll-mt-[5rem]"
        >
          <SectionHeader title="Contact" visible={visibleSections.has('contact')} />

          <div className={`text-center mb-10 ${visibleSections.has('contact') ? 'anim-float-up' : 'opacity-0'}`} style={{ animationDelay: '80ms' }}>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-4">
              Get in <span className="italic text-accent">touch.</span>
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

          {clockTime && (
            <div className={`text-center ${visibleSections.has('contact') ? 'anim-float-up' : 'opacity-0'}`} style={{ animationDelay: '240ms' }}>
              <p className="font-mono text-[11px] text-ink-dim tabular-nums">
                {clockTime} — {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </p>
            </div>
          )}
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

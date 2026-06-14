import { useRef, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { experiences, featuredProjects, EMAIL, GITHUB_USERNAME, YOUTUBE_CHANNEL } from '../data';
import TagList from '../components/TagList';
import ProjectCard from '../components/ProjectCard';
import { NowPlayingWidget, RecentCommitsWidget, ThemeWidget, LocationWidget, LatestUploadWidget } from '../components/Widgets';

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const scrollReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h2 className="text-[13px] font-medium tracking-[0.08em] shrink-0">
        <span className="text-ctp-overlay0">//</span>{' '}
        <span className="text-ctp-subtext1">{title}</span>
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

  return (
    <>
      {/* ── Hero strip ── */}
      <motion.section
        className="section-strip pt-[72px] pb-[52px] border-t-0"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-[11px] tracking-[0.2em] text-white/[0.42] mb-4">
          <span className="text-white/[0.3]">//</span> software engineer · auburn university
        </motion.p>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-[44px] leading-none font-medium text-ctp-text mb-5 tracking-[-0.04em]">
          ulisses molina<span className="text-ctp-accent">.</span>
        </motion.h1>
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="text-[15px] text-ctp-subtext1 leading-[1.75] max-w-[620px]">
          Software engineering intern @ OCV LLC. Studying at Auburn University. Interested in full-stack development or AI development. Feel free to{' '}
          <button type="button" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="text-ctp-accent hover:text-ctp-accent/80 transition-colors">reach out</button>!
        </motion.p>
        <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mt-5 text-xs text-ctp-subtext0">
          <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">github</a>
          <span className="text-ctp-surface1">·</span>
          <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">linkedin</a>
          <span className="text-ctp-surface1">·</span>
          <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">youtube</a>
          <span className="text-ctp-surface1">·</span>
          <button type="button" onClick={copyEmail} className="link-underline hover:text-ctp-text transition-colors">email</button>
          <span className="text-ctp-surface1">·</span>
          <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">resume</a>
        </motion.div>
      </motion.section>

      {/* ── Widget strip — theme + currently ── */}
      <motion.section
        className="section-strip py-3"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <ThemeWidget />
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <LocationWidget />
          </motion.div>
        </div>
      </motion.section>

      {/* ── Experience strip ── */}
      <section id="work" className="section-strip scroll-mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={scrollReveal}
        >
          <SectionHeader title="experience" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {experiences.map((exp, i) => (
            <motion.div
              key={`${exp.company}-${exp.title}`}
              className={`widget${exp.period.includes('present') ? ' widget-highlight' : ''}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scrollReveal}
              transition={{ delay: i * 0.08 }}
            >
              <p className="text-sm font-semibold text-ctp-text mb-0.5">
                {exp.title}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-ctp-accent">{exp.company}</span>
                <span className="text-[11px] text-ctp-overlay0 ml-auto shrink-0">
                  {exp.period}
                </span>
              </div>
              <p className="text-xs text-ctp-subtext1 leading-relaxed mb-2.5">
                {exp.description}
              </p>
              <TagList tags={exp.tags} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Featured Projects strip ── */}
      <section id="projects" className="section-strip scroll-mt-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={scrollReveal}
        >
          <SectionHeader
            title="featured work"
            right={
              <Link
                to="/projects"
                className="text-[11px] text-ctp-accent hover:text-ctp-accent/80 transition-colors shrink-0"
              >
                view all →
              </Link>
            }
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scrollReveal}
              transition={{ delay: i * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Latest Video strip ── */}
      <section className="section-strip">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={scrollReveal}
        >
          <SectionHeader title="latest video" />
          <LatestUploadWidget />
        </motion.div>
      </section>

      {/* ── Listening strip ── */}
      <section className="section-strip">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={scrollReveal}
        >
          <SectionHeader title="listening" />
          <NowPlayingWidget />
        </motion.div>
      </section>

      {/* ── Recent Activity strip (compact) ── */}
      <section className="section-strip">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={scrollReveal}
        >
          <SectionHeader title="recent activity" />
          <RecentCommitsWidget />
        </motion.div>
      </section>

      {/* ── Footer/Contact strip ── */}
      <motion.footer
        id="contact"
        className="section-strip scroll-mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={scrollReveal}
      >
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
          <div className="flex items-center gap-5 text-xs text-ctp-subtext0">
            <a href="https://github.com/UlissesMolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
              github
            </a>
            <a href="https://www.linkedin.com/in/ulissesmolina" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
              linkedin
            </a>
            <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
              youtube
            </a>
            <a href="/uliResume.pdf" target="_blank" rel="noopener noreferrer" className="link-underline hover:text-ctp-text transition-colors">
              resume
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-ctp-subtext0 border-t border-ctp-surface0/30 pt-4">
          <span>© 2026 Ulisses Molina</span>
          <FooterClock />
        </div>
      </motion.footer>

      {/* toast */}
      <div className={`fixed bottom-6 right-6 z-50 bg-ctp-mantle border border-ctp-surface0 text-ctp-text text-xs px-3 py-2 rounded-lg pointer-events-none transition-all duration-200 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {toast || '\u00A0'}
      </div>
    </>
  );
}

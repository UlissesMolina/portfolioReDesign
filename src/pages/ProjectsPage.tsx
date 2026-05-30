import { useEffect, useRef } from 'react';
import { projects } from '../data';
import TagList from '../components/TagList';
import type { Project } from '../data';

function ProjectRow({ project }: { project: Project }) {
  const statusColor =
    project.status === 'live' ? 'bg-ctp-green' : 'bg-ctp-mauve';

  return (
    <article className="project-card flex gap-0 border border-ctp-surface0/50 rounded-lg overflow-hidden">
      {/* status accent bar */}
      <div className={`accent-bar w-[3px] shrink-0 ${statusColor} opacity-40`} />

      <div className="flex-1 px-5 py-4">
        {/* top row: title + status + year */}
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-sm font-medium text-ctp-text">{project.title}</h2>
          <span className="text-[10px] text-ctp-overlay0 ml-auto">{project.year}</span>
        </div>

        {/* description */}
        <p className="text-xs text-ctp-subtext0 leading-relaxed mb-3 max-w-[65ch]">
          {project.description}
        </p>

        {/* bottom row: tags + links */}
        <div className="flex items-center justify-between gap-4">
          <TagList tags={project.tags} />
          <div className="flex items-center gap-4 text-[11px] shrink-0">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ctp-accent hover:text-ctp-accent/80 transition-colors"
              >
                live <span className="arrow-nudge">↗</span>
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ctp-overlay0 hover:text-ctp-text transition-colors"
            >
              code <span className="arrow-nudge">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const els = listRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
      if (!els?.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -20px 0px' },
      );

      els.forEach((el) => observer.observe(el));
      cleanupRef.current = () => observer.disconnect();
    });

    const cleanupRef = { current: () => {} };
    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current();
    };
  }, []);

  return (
    <div ref={listRef} className="mx-auto max-w-content w-full px-8">
      <section className="pt-20 pb-16">
        <div className="flex items-center gap-4 mb-10" data-reveal>
          <h1 className="text-xs font-medium text-ctp-overlay0 tracking-widest shrink-0">
            projects
          </h1>
          <div className="divider-line" />
        </div>

        <div className="flex flex-col gap-3">
          {projects.map((project, i) => (
            <div
              key={project.slug}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <ProjectRow project={project} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

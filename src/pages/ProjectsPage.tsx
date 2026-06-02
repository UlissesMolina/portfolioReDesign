import { motion } from 'motion/react';
import { projects } from '../data';
import TagList from '../components/TagList';
import type { Project } from '../data';

const scrollReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-content w-full px-8">
      <motion.section
        className="pt-20 pb-16"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div className="flex items-center gap-4 mb-10" variants={fadeUp}>
          <h1 className="text-xs font-medium text-ctp-overlay0 tracking-widest shrink-0">
            projects
          </h1>
          <div className="divider-line" />
        </motion.div>

        <motion.div className="flex flex-col gap-3" variants={stagger}>
          {projects.map((project) => (
            <motion.div key={project.slug} variants={fadeUp}>
              <ProjectRow project={project} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { FaPython, FaReact } from 'react-icons/fa';
import { SiTypescript, SiSpringboot, SiPostgresql, SiDocker, SiNodedotjs, SiCplusplus, SiCmake } from 'react-icons/si';

const TAG_COLORS = {
  React:            'text-sky-400 border-sky-400/30',
  TypeScript:       'text-sky-400 border-sky-400/30',
  CSS:              'text-sky-400 border-sky-400/30',
  'Node.js':        'text-emerald-400 border-emerald-400/30',
  'Spring Boot':    'text-emerald-400 border-emerald-400/30',
  Java:             'text-emerald-400 border-emerald-400/30',
  Python:           'text-emerald-400 border-emerald-400/30',
  PostgreSQL:       'text-violet-400 border-violet-400/30',
  Docker:           'text-orange-400 border-orange-400/30',
  OpenAI:           'text-pink-400 border-pink-400/30',
  'C++':            'text-indigo-400 border-indigo-400/30',
  CMake:            'text-cyan-400 border-cyan-400/30',
};
const TAG_DEFAULT = 'text-ink-dim border-surface-border';

const TAG_ICONS = {
  Python: FaPython,
  React: FaReact,
  TypeScript: SiTypescript,
  Java: SiSpringboot,
  'Spring Boot': SiSpringboot,
  PostgreSQL: SiPostgresql,
  Docker: SiDocker,
  'Node.js': SiNodedotjs,
  'C++': SiCplusplus,
  CMake: SiCmake,
};

function ImageModal({ src, alt, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-zoom-out"
      style={{
        background: visible ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0)',
        transition: 'background 0.25s ease',
      }}
      onClick={handleClose}
    >
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors text-xl"
        aria-label="Close"
      >
        &times;
      </button>
      <img
        src={src}
        alt={alt}
        className="w-[90vw] max-h-[85vh] object-contain rounded-lg"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 0.25s ease, transform 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

export default function ProjectCard({ project, roundedClass = 'rounded-lg' }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`group relative overflow-hidden ${roundedClass} bg-surface-card border border-surface-border transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10 flex flex-col h-full`}
      >
        {project.image && (
          <div
            className="overflow-hidden border-b border-surface-border cursor-zoom-in"
            onClick={() => setModalOpen(true)}
          >
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              className="w-full aspect-video object-cover object-top"
            />
          </div>
        )}

        <div className="flex flex-col flex-1 p-3">
          <h3 className="font-serif text-lg text-ink mb-1 leading-tight">
            {project.title}
          </h3>
          <p className="text-xs text-ink-muted leading-relaxed mb-2 flex-1">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {project.tags.map((tag, i) => {
              const Icon = TAG_ICONS[tag];
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-md border ${TAG_COLORS[tag] ?? TAG_DEFAULT}`}
                >
                  {Icon ? <Icon size={10} /> : null}
                  {tag}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-auto">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-accent text-surface-bg hover:bg-accent-light transition-colors"
              >
                <FaExternalLinkAlt size={10} />
                Live
              </a>
            )}
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-ink-dim hover:text-accent transition-colors"
            >
              <FaGithub size={12} />
              Code
            </a>
          </div>
        </div>
      </div>

      {modalOpen && createPortal(
        <ImageModal
          src={project.image}
          alt={`${project.title} screenshot`}
          onClose={() => setModalOpen(false)}
        />,
        document.body
      )}
    </>
  );
}

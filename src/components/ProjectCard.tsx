import { Project } from '../data';
import TagList from './TagList';

export default function ProjectCard({ project }: { project: Project }) {
  const statusColor =
    project.status === 'live' ? 'bg-ctp-green' : 'bg-ctp-mauve';

  return (
    <article className="flex gap-0 border border-ctp-surface0/50 rounded-lg overflow-hidden hover:border-ctp-surface1 transition-colors">
      {/* status accent bar */}
      <div className={`w-[3px] shrink-0 ${statusColor} opacity-40`} />

      <div className="flex-1 px-4 py-4">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="text-sm font-medium text-ctp-text">{project.title}</h3>
        </div>

        <p className="text-xs text-ctp-subtext0 mb-2.5 leading-relaxed">
          {project.description}
        </p>

        <TagList tags={project.tags} />

        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-ctp-surface0/30">
          <span className="text-[10px] text-ctp-overlay0">{project.year}</span>
          <div className="flex items-center gap-3 text-[11px] text-ctp-overlay0">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                live <span className="text-ctp-accent">↗</span>
              </a>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
              code <span className="text-ctp-accent">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

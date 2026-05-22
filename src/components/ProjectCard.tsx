import { Project } from '../data';
import TagList from './TagList';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card-outer rounded-lg overflow-hidden">
      {/* inner recessed tile */}
      <div className="card-inner m-2 rounded-md overflow-hidden">
        {/* mac title bar with repo path */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-ctp-surface1/50">
          <span className="w-[9px] h-[9px] rounded-full bg-[#ec6a5e]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#f4bf4f]" />
          <span className="w-[9px] h-[9px] rounded-full bg-[#61c554]" />
          <span className="ml-2 text-[10px] text-ctp-overlay0">
            <span className="text-ctp-green">/</span>
            <span className="text-ctp-yellow">{project.repoPath}</span>
          </span>
        </div>
        {/* screenshot */}
        <a
          href={project.demoUrl ?? project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden"
        >
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="aspect-[16/10] w-full object-cover object-top transition-opacity duration-200 opacity-90 hover:opacity-100"
            loading="lazy"
          />
        </a>
      </div>

      {/* content area */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2.5 mb-1.5">
          <h3 className="text-sm font-medium text-ctp-text">{project.title}</h3>
          <span
            className={`inline-flex items-center gap-1 text-[10px] tracking-wide px-1.5 py-0.5 rounded-full border ${
              project.status === 'live'
                ? 'text-ctp-green border-ctp-green/20'
                : 'text-ctp-blue border-ctp-blue/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              project.status === 'live' ? 'bg-ctp-green animate-pulse' : 'bg-ctp-blue'
            }`} />
            {project.status}
          </span>
        </div>
        <p className="text-xs text-ctp-subtext0 mb-2.5 leading-relaxed">
          {project.description}
        </p>
        <TagList tags={project.tags} />

        {/* footer: stats + links */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-ctp-surface0/30">
          <div className="flex items-center gap-3 text-[10px] text-ctp-overlay0">
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" className="text-ctp-yellow">
                <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
              </svg>
              {project.stars}
            </span>
            <span>{project.contributors} contributor{project.contributors !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-ctp-overlay0">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
                live <span className="text-ctp-mauve">↗</span>
              </a>
            )}
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ctp-text transition-colors">
              code <span className="text-ctp-mauve">↗</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

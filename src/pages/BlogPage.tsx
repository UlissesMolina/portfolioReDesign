import { useEffect, useRef } from 'react';
import { blogPosts } from '../data';
import TagList from '../components/TagList';

export default function BlogPage() {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = listRef.current?.querySelectorAll<HTMLElement>('[data-animate]');
    if (!els) return;
    els.forEach((el) => {
      el.style.animation = 'none';
      el.getBoundingClientRect();
      el.style.animation = '';
    });
  }, []);

  return (
    <div ref={listRef} className="mx-auto max-w-content w-full px-8">
      <section className="pt-20 pb-16">
        <div className="flex items-center gap-4 mb-4" data-animate data-animate-delay="1">
          <h1 className="text-xs font-medium text-ctp-overlay0 tracking-widest shrink-0">
            blog
          </h1>
          <div className="divider-line" />
        </div>
        <p className="text-xs text-ctp-subtext0 leading-relaxed mb-10" data-animate data-animate-delay="2">
          short dev log posts — things I'm learning, building, and thinking about.
        </p>

        {blogPosts.length === 0 ? (
          <div className="widget text-center py-12" data-animate data-animate-delay="3">
            <p className="text-sm text-ctp-overlay0">nothing here yet — check back soon.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[14px]">
            {blogPosts.map((post, i) => (
              <article
                key={post.slug}
                className="widget"
                data-animate
                data-animate-delay={Math.min(i + 3, 7)}
              >
                <div className="flex items-baseline justify-between gap-3 mb-1.5">
                  <h2 className="text-sm font-medium text-ctp-text">{post.title}</h2>
                  <time className="text-[11px] text-ctp-overlay0 shrink-0 tracking-wide">
                    {post.date}
                  </time>
                </div>
                <p className="text-xs text-ctp-subtext0 leading-relaxed mb-2.5">
                  {post.body}
                </p>
                <TagList tags={post.tags} />
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

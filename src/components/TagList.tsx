import { Tag } from '../data';

const tagBgMap: Record<string, string> = {
  blue: 'bg-ctp-blue/10 text-ctp-blue',
  peach: 'bg-ctp-peach/10 text-ctp-peach',
  green: 'bg-ctp-green/10 text-ctp-green',
  red: 'bg-ctp-red/10 text-ctp-red',
  teal: 'bg-ctp-teal/10 text-ctp-teal',
  yellow: 'bg-ctp-yellow/10 text-ctp-yellow',
  mauve: 'bg-ctp-mauve/10 text-ctp-mauve',
  pink: 'bg-ctp-pink/10 text-ctp-pink',
};

export default function TagList({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag.label}
          className={`text-[10px] px-2 py-0.5 rounded-full transition-transform duration-150 hover:scale-110 ${tagBgMap[tag.color] || 'bg-ctp-surface0/50 text-ctp-overlay0'}`}
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}

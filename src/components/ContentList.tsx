import { Link } from 'react-router-dom'
import type { ContentEntry } from '../lib/notes'

type ContentListProps = {
  entries: ContentEntry[]
  emptyLabel: string
  emptyDescription: string
}

const ContentList = ({ entries, emptyLabel, emptyDescription }: ContentListProps) => (
  <div className="border-t border-white/10">
    {entries.length === 0 ? (
      <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[9px] tracking-[.2em] text-sky-400">{emptyLabel}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/35">{emptyDescription}</p>
        </div>
        <span className="font-mono text-[9px] tracking-[.15em] text-white/20">BUILDING</span>
      </div>
    ) : (
      entries.map((entry, index) => (
        <Link
          key={entry.slug}
          to={`/notes/${entry.slug}`}
          className="group flex flex-col gap-4 border-b border-white/10 py-8 transition hover:bg-white/[.02] sm:flex-row sm:items-center sm:justify-between sm:px-4"
        >
          <div className="flex items-start gap-5">
            <span className="font-mono text-[9px] tracking-[.15em] text-white/20">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[9px] tracking-[.18em]">
                <span className="text-sky-400">{entry.type.toUpperCase()}</span>
                <span className="text-white/25">{entry.category.toUpperCase()}</span>
              </div>
              <h3 className="text-sm font-medium tracking-[.05em] text-white sm:text-base">{entry.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/30">{entry.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-7 sm:pl-0">
            <span className="font-mono text-[9px] tracking-[.15em] text-white/20">{entry.date}</span>
            <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">→</span>
          </div>
        </Link>
      ))
    )}
  </div>
)

export default ContentList

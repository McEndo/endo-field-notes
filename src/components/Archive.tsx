import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import ContentList from './ContentList'
import { entries, type ContentEntry } from '../lib/notes'

type ArchiveProps = {
  type: ContentEntry['type']
}

const copy = {
  writeup: {
    eyebrow: 'HANDS-ON DOCUMENTATION',
    title: 'WRITEUPS',
    description: 'Lab and penetration-testing writeups focused on methodology, findings, and lessons learned.',
    emptyLabel: 'NO PUBLISHED WRITEUPS YET',
    emptyDescription: 'Completed lab and penetration-testing work will appear here once it has been documented and published.',
  },
  note: {
    eyebrow: 'TECHNICAL EXPLANATIONS',
    title: 'NOTES',
    description: 'Original technical explanations, security concepts, research, and experiments.',
    emptyLabel: 'NO PUBLISHED NOTES YET',
    emptyDescription: 'Original technical notes will appear here once the underlying study, research, or experimentation has been completed and documented.',
  },
}

const Archive = ({ type }: ArchiveProps) => {
  const content = copy[type]
  const filteredEntries = entries.filter((entry) => entry.type === type)

  return (
    <main className="min-h-screen bg-[#080808] pt-32">
      <section className="mx-auto max-w-7xl px-8 pb-24 sm:pb-32">
        <Reveal>
          <header className="max-w-3xl border-b border-white/10 pb-12 sm:pb-16">
            <Link to="/" className="font-mono text-[9px] tracking-[.2em] text-white/30 transition hover:text-white">
              ← FIELD NOTES
            </Link>
            <p className="mt-10 font-mono text-[9px] tracking-[.3em] text-sky-400 sm:text-[10px]">{content.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-medium tracking-[-.05em] sm:text-7xl">{content.title}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">{content.description}</p>
          </header>
        </Reveal>
        <Reveal delay={.08}>
          <div className="pt-12 sm:pt-16">
            <ContentList entries={filteredEntries} emptyLabel={content.emptyLabel} emptyDescription={content.emptyDescription} />
          </div>
        </Reveal>
      </section>
    </main>
  )
}

export default Archive

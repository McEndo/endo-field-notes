import { Link, useParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { entries } from '../lib/notes'
import TableOfContents from './TableOfContents'

const Article = () => {
  const { slug } = useParams()
  const entry = entries.find((item) => item.slug === slug)

  if (!entry) {
    return (
      <main className="min-h-screen bg-[#080808] pt-32">
        <div className="mx-auto max-w-3xl px-8 pb-24">
          <Link to="/" className="font-mono text-[9px] tracking-[.2em] text-white/30 transition hover:text-white">
            ← BACK TO FIELD NOTES
          </Link>
          <h1 className="mt-16 text-4xl font-medium tracking-[-.04em] sm:text-6xl">CONTENT NOT FOUND</h1>
        </div>
      </main>
    )
  }

  const Content = entry.component
  const archivePath = entry.type === 'writeup' ? '/writeups' : '/notes'
  const archiveLabel = entry.type === 'writeup' ? 'WRITEUPS' : 'NOTES'

  return (
    <main className="min-h-screen bg-[#080808] pt-32">
      <div className="mx-auto max-w-3xl px-8 pb-24">
        <Link to={archivePath} className="font-mono text-[9px] tracking-[.2em] text-white/30 transition hover:text-white">
          ← BACK TO {archiveLabel}
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          className="mt-12 border-b border-white/10 pb-10"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] tracking-[.2em]">
            <span className="text-sky-400">{entry.type.toUpperCase()}</span>
            <span className="text-white/35">{entry.category.toUpperCase()}</span>
            {entry.date && <span className="text-white/20">{entry.date}</span>}
          </div>
          <h1 className="mt-4 text-4xl font-medium tracking-[-.04em] sm:text-6xl">{entry.title}</h1>
          {entry.description && (
            <p className="mt-5 text-sm leading-7 text-white/35">{entry.description}</p>
          )}
        </motion.header>

        <div className="relative">
          <TableOfContents key={entry.slug} entries={entry.toc} />
          <article className="note-content pt-8">
            <Content />
          </article>
        </div>
      </div>
    </main>
  )
}

export default Article

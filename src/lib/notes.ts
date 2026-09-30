import type { ComponentType } from 'react'
import type { TocEntry } from '../components/TableOfContents'
import metadata from '../../.content/current/metadata.json'

export type ContentEntry = {
  slug: string
  title: string
  description: string
  category: string
  type: 'writeup' | 'note'
  date: string
  status: 'published' | 'draft'
  component: ComponentType
  toc: TocEntry[]
}

type NoteModule = {
  default: ComponentType
  toc: TocEntry[]
}

const modules = import.meta.glob<NoteModule>(
  '../../.content/current/notes/*.md',
  { eager: true },
)

export const entries: ContentEntry[] = (metadata as Omit<ContentEntry, 'component' | 'toc'>[])
  .map((entry): ContentEntry => {
    const module = modules[`../../.content/current/notes/${entry.slug}.md`]
    if (!module || entry.status !== 'published') {
      throw new Error(`Invalid prepared content for ${entry.slug}. Run npm run content:sync.`)
    }
    return { ...entry, status: 'published', component: module.default, toc: module.toc }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

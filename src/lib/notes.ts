import type { ComponentType } from 'react'
import type { TocEntry } from '../components/TableOfContents'
import metadata from '../../.content/current/metadata.json'

export type Note = {
  slug: string
  title: string
  description: string
  category: string
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

export const notes: Note[] = (metadata as Omit<Note, 'component' | 'toc'>[])
  .map((note): Note => {
    const module = modules[`../../.content/current/notes/${note.slug}.md`]
    if (!module || note.status !== 'published') {
      throw new Error(`Invalid prepared content for ${note.slug}. Run npm run content:sync.`)
    }
    return { ...note, status: 'published', component: module.default, toc: module.toc }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

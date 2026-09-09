import type { ComponentType } from 'react'

export type Note = {
  slug: string
  title: string
  description: string
  category: string
  date: string
  status: 'published' | 'draft'
  component: ComponentType
}

type NoteModule = {
  default: ComponentType
  frontmatter?: Partial<Omit<Note, 'slug' | 'component'>>
}

const modules = import.meta.glob<NoteModule>(
  '../content/writeups/*.mdx',
  { eager: true },
)

export const notes: Note[] = Object.entries(modules)
  .map(([path, module]) => {
    const filename = path.split('/').pop() ?? ''
    const slug = filename.replace(/\.mdx$/, '').toLowerCase()
    const frontmatter = module.frontmatter ?? {}

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? '',
      category: frontmatter.category ?? 'UNCATEGORIZED',
      date: frontmatter.date ?? '',
      status: frontmatter.status ?? 'draft',
      component: module.default,
    }
  })
  .filter((note) => note.status === 'published')
  .sort((a, b) => b.date.localeCompare(a.date))

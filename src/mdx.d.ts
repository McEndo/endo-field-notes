declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXComponent: ComponentType
  export default MDXComponent

  export const frontmatter: {
    title?: string
    description?: string
    category?: string
    date?: string
    status?: 'published' | 'draft'
  }
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from './scripts/remark-toc.mjs'

export default defineConfig({
  publicDir: 'public',
  plugins: [
    mdx({
      format: 'md',
      remarkPlugins: [
        remarkFrontmatter,
        remarkToc,
      ],
    }),
    react(),
    tailwindcss(),
  ],
})

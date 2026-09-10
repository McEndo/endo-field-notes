import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'

export default defineConfig({
  publicDir: '.content/current/public',
  plugins: [
    mdx({
      format: 'md',
      remarkPlugins: [
        remarkFrontmatter,
      ],
    }),
    react(),
    tailwindcss(),
  ],
})

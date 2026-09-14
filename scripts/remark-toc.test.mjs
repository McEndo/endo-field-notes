import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluate } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import { renderToStaticMarkup } from 'react-dom/server'
import remarkFrontmatter from 'remark-frontmatter'
import remarkToc from './remark-toc.mjs'
import fs from 'node:fs/promises'

const compile = source => evaluate(source, { ...runtime, format: 'md', remarkPlugins: [remarkFrontmatter, remarkToc] })

test('anchors handle formatting, Unicode, punctuation and collisions', async () => {
  const result = await compile('# Title\n## Repeat\n### Repeat\n## Repeat-2\n## **Café** `code`\n#### 東京\n## !!!')
  assert.deepEqual(result.toc.map(entry => entry.id), ['section-repeat', 'section-repeat-2', 'section-repeat-2-2', 'section-cafe-code', 'section-東京', 'section-section'])
  assert.equal(result.toc[3].title, 'Café code')
  const html = renderToStaticMarkup(runtime.jsx(result.default, {}))
  for (const entry of result.toc) assert.ok(html.includes(`id="${entry.id}"`))
  assert.deepEqual((await compile('No headings')).toc, [])
})

test('current Pickle Rick headings and content survive TOC compilation', async () => {
  const source = await fs.readFile(new URL('../.content/current/notes/pickle-rick.md', import.meta.url), 'utf8')
  const withToc = await compile(source)
  const withoutToc = await evaluate(source, { ...runtime, format: 'md', remarkPlugins: [remarkFrontmatter] })
  const titles = withToc.toc.map(entry => entry.title)
  for (const title of ['Enumeration', 'Nmap (RustScan)', 'PORT22 (SSH)', 'PORT80 (HTTP)', 'Content Discovery', 'Inspecting the site', 'Initial Access', 'Getting The Flags', 'First Flag', 'Second Flag', 'Third Flag', 'Conclusion']) assert.ok(titles.includes(title), title)
  const render = Component => renderToStaticMarkup(runtime.jsx(Component, {}))
  assert.equal(render(withToc.default).replace(/ id="section-[^"]+"/g, ''), render(withoutToc.default))
})

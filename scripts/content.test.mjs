import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import { metadata, prepare } from './content.mjs'

const valid = { title: 'Fixture', description: 'Test fixture only', date: '2026-09-09', status: 'published' }
const markdown = (extra = {}, body = '# Fixture\n\n**bold** and *emphasis*.\n\n- item\n\n1. item\n\n> quote\n\n[link](https://example.com)\n\n```sh\necho test\n```') => `---\n${Object.entries({ ...valid, ...extra }).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n${body}`

test('metadata enforces category, dates, required fields and URL-safe slugs', () => {
  assert.equal(metadata(valid, 'research/Mixed Case/index.md').slug, 'mixed-case')
  assert.equal(metadata(valid, 'research/Mixed Case.md').slug, 'mixed-case')
  for (const extra of [{ title: '' }, { description: null }, { date: '2026-02-30' }, { status: 'public' }, { slug: 'Bad Slug' }, { category: 'tryhackme' }]) {
    assert.throws(() => metadata({ ...valid, ...extra }, 'research/test.md'), /research\/test.md:/)
  }
  assert.throws(() => metadata(valid, 'other/test.md'), /unsupported category/)
})

test('preparation handles empty content, drafts, images, Markdown and failures', async () => {
  const cache = fileURLToPath(new URL('../.content/', import.meta.url))
  await fs.mkdir(cache, { recursive: true })
  const temporary = await fs.mkdtemp(path.join(cache, 'test-'))
  const repository = path.join(temporary, 'repository')
  const output = path.join(temporary, 'output')
  try {
    await fs.mkdir(repository)
    assert.equal(await prepare(repository, output, 'test'), 0)
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(output, 'metadata.json'), 'utf8')), [])
    await fs.mkdir(path.join(repository, 'research', 'fixture', 'images'), { recursive: true })
    await fs.writeFile(path.join(repository, 'README.md'), 'No metadata required')
    await fs.writeFile(path.join(repository, 'research', 'draft.md'), markdown({ status: 'draft' }, 'DRAFT BODY'))
    const note = path.join(repository, 'research', 'fixture', 'index.md')
    const asset = path.join(repository, 'research', 'fixture', 'images', 'sample.png')
    await fs.writeFile(asset, 'fixture bytes')
    await fs.writeFile(note, markdown({}, '# Fixture\n\n![inline](./images/sample.png)\n\n![reference][shot]\n\n[shot]: ./images/sample.png'))
    assert.equal(await prepare(repository, output, 'test'), 1)
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(output, 'metadata.json'), 'utf8')), [{ ...valid, category: 'research', slug: 'fixture' }])
    assert.deepEqual(await fs.readdir(path.join(output, 'notes')), ['fixture.md'])
    const generated = await fs.readFile(path.join(output, 'notes', 'fixture.md'), 'utf8')
    assert.equal((generated.match(/\/content-assets\/research\/fixture\/images\/sample.png/g) ?? []).length, 2)
    assert.equal(await fs.readFile(path.join(output, 'public', 'content-assets', 'research', 'fixture', 'images', 'sample.png'), 'utf8'), 'fixture bytes')
    const compiled = String(await compile(generated, { format: 'md', remarkPlugins: [remarkFrontmatter] }))
    assert.doesNotMatch(compiled, /export const frontmatter|Test fixture only/)
    assert.match(compiled, /img/)
    const normal = String(await compile(markdown(), { format: 'md', remarkPlugins: [remarkFrontmatter] }))
    for (const tag of ['h1', 'strong', 'em', 'ul', 'ol', 'blockquote', 'pre', 'a']) assert.match(normal, new RegExp(`\\b${tag}\\b`))
    await fs.writeFile(path.join(repository, 'research', 'duplicate.md'), markdown({ slug: 'fixture' }))
    await assert.rejects(prepare(repository, output, 'test'), /duplicate slug/)
    await fs.writeFile(path.join(repository, 'research', 'duplicate.md'), markdown({ slug: 'different', status: 'draft' }))
    await fs.writeFile(note, markdown({}, '![missing](images/missing.png)'))
    await assert.rejects(prepare(repository, output, 'test'), /research\/fixture\/index.md: missing image/)
    await fs.writeFile(note, markdown({}, '![escape](../../../outside.png)'))
    await assert.rejects(prepare(repository, output, 'test'), /invalid image path/)
    await fs.writeFile(note, markdown({ date: '2026-02-30' }))
    await assert.rejects(prepare(repository, output, 'test'), /valid YYYY-MM-DD/)
  } finally {
    assert.equal(path.dirname(temporary), path.resolve(cache))
    await fs.rm(temporary, { recursive: true, force: true })
  }
})

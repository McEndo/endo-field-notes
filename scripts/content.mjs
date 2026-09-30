import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs/promises'
import matter from 'gray-matter'
import { createProcessor } from '@mdx-js/mdx'

const exec = promisify(execFile)
const root = fileURLToPath(new URL('../', import.meta.url))
const cache = path.join(root, '.content')
const categories = new Set(['tryhackme', 'research', 'security-concepts'])
const types = new Set(['writeup', 'note'])
const images = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg'])
const parser = createProcessor({ format: 'md' })
const fail = (file, message) => { throw new Error(`${file}: ${message}`) }

function inside(base, target) {
  const relative = path.relative(base, target)
  return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)
}

async function removeGenerated(target) {
  if (target === cache || !inside(cache, target)) throw new Error('Unsafe generated path')
  await fs.rm(target, { recursive: true, force: true })
}

export function metadata(data, file) {
  const category = file.split('/')[0]
  if (!categories.has(category)) fail(file, 'unsupported category')
  for (const key of ['title', 'description', 'status']) {
    if (typeof data[key] !== 'string' || !data[key].trim()) fail(file, `${key} is required and must be a non-empty string`)
  }
  if (typeof data.type !== 'string' || !types.has(data.type)) fail(file, 'type is required and must be writeup or note')
  if (!['draft', 'published'].includes(data.status)) fail(file, 'status must be draft or published')
  // YAML may parse an unquoted ISO date as a Date.
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) fail(file, 'date must be a valid YYYY-MM-DD calendar date')
  if (data.category !== undefined && data.category !== category) fail(file, 'category must match its top-level directory')
  const basename = path.posix.basename(file, '.md')
  const derived = basename.toLowerCase() === 'index' ? path.posix.basename(path.posix.dirname(file)) : basename
  const slug = data.slug ?? derived.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (typeof slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(file, 'slug must contain lowercase letters/numbers separated by hyphens')
  return { title: data.title.trim(), description: data.description.trim(), date, status: data.status, type: data.type, slug, category }
}

async function walk(directory, relative = '') {
  const files = []
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const name = relative ? `${relative}/${entry.name}` : entry.name
    if (entry.isSymbolicLink()) fail(name, 'symbolic links are not supported')
    if (entry.isDirectory()) files.push(...await walk(path.join(directory, entry.name), name))
    else if (entry.isFile()) files.push(name)
  }
  return files.sort()
}

export async function prepare(repository, destination, sha) {
  const files = await walk(repository)
  const notes = []
  const slugs = new Map()
  for (const file of files) {
    if (!file.toLowerCase().endsWith('.md') || path.posix.basename(file).toLowerCase() === 'readme.md') continue
    const source = await fs.readFile(path.join(repository, file), 'utf8')
    let parsed
    try { parsed = matter(source) }
    catch (error) { fail(file, `invalid frontmatter: ${error.message}`) }
    const meta = metadata(parsed.data, file)
    // Validate the original date spelling too: YAML Date conversion can normalize invalid days.
    const dateLine = source.match(/^date:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)
    if (!dateLine || dateLine[1] !== meta.date) fail(file, 'date must be a valid YYYY-MM-DD calendar date')
    if (slugs.has(meta.slug)) fail(file, `duplicate slug "${meta.slug}" also used by ${slugs.get(meta.slug)}`)
    slugs.set(meta.slug, file)
    notes.push({ file, meta, body: parsed.content })
  }
  await fs.mkdir(path.join(destination, 'notes'), { recursive: true })
  await fs.mkdir(path.join(destination, 'public', 'content-assets'), { recursive: true })
  let published = 0
  const manifest = []
  for (const { file, meta, body } of notes) {
    if (meta.status !== 'published') continue
    const tree = parser.parse(body)
    const nodes = []
    const visit = node => { nodes.push(node); node.children?.forEach(visit) }
    visit(tree)
    const definitions = new Map(nodes.filter(node => node.type === 'definition').map(node => [node.identifier, node]))
    const replacements = []
    for (const node of nodes.filter(node => ['image', 'imageReference'].includes(node.type))) {
      const image = node.type === 'imageReference' ? definitions.get(node.identifier) : node
      if (!image) fail(file, `undefined image reference ${node.identifier}`)
      if (/^https?:\/\//i.test(image.url)) continue
      if (/^(?:[a-z][a-z\d+.-]*:|\/|\\)/i.test(image.url)) fail(file, `unsupported image URL: ${image.url}`)
      let decoded
      try { decoded = decodeURIComponent(image.url.split(/[?#]/)[0]) }
      catch { fail(file, `invalid image URL: ${image.url}`) }
      const asset = path.resolve(repository, path.posix.dirname(file), decoded)
      if (!inside(repository, asset) || !images.has(path.extname(asset).toLowerCase())) fail(file, `invalid image path: ${image.url}`)
      let real
      try { real = await fs.realpath(asset) }
      catch { fail(file, `missing image: ${image.url}`) }
      if (!inside(repository, real) || !(await fs.stat(real)).isFile()) fail(file, `invalid image: ${image.url}`)
      const relative = path.relative(repository, asset).split(path.sep).join('/')
      const output = path.join(destination, 'public', 'content-assets', relative)
      await fs.mkdir(path.dirname(output), { recursive: true })
      await fs.copyFile(real, output)
      const suffix = image.url.slice(image.url.split(/[?#]/)[0].length)
      const url = `/content-assets/${relative.split('/').map(encodeURIComponent).join('/')}${suffix}`
      const alt = (node.alt ?? '').replace(/[\\[\]]/g, '\\$&')
      replacements.push({ start: node.position.start.offset, end: node.position.end.offset, text: `![${alt}](<${url}>${image.title ? ` ${JSON.stringify(image.title)}` : ''})` })
    }
    let content = body
    for (const edit of replacements.sort((a, b) => b.start - a.start)) content = content.slice(0, edit.start) + edit.text + content.slice(edit.end)
    const frontmatter = Object.entries(meta).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
    await fs.writeFile(path.join(destination, 'notes', `${meta.slug}.md`), `---\n${frontmatter}\n---\n${content}`)
    published++
    manifest.push(meta)
  }
  await fs.writeFile(path.join(destination, 'metadata.json'), JSON.stringify(manifest, null, 2))
  await fs.writeFile(path.join(destination, 'snapshot.json'), JSON.stringify({ sha, published }, null, 2))
  return published
}

async function sync() {
  await fs.mkdir(cache, { recursive: true })
  const staging = await fs.mkdtemp(path.join(cache, 'staging-'))
  const repository = path.join(staging, 'repository')
  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        await exec('git', ['-c', 'credential.helper=', 'clone', '--depth', '1', '--single-branch', '--branch', 'main', 'https://github.com/McEndo/endo-security-writeups.git', repository], { timeout: 60000, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', GCM_INTERACTIVE: 'Never' } })
        break
      } catch (error) {
        if (attempt === 2) throw error
        console.warn('Content fetch failed; retrying once.')
        await removeGenerated(repository)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    const { stdout } = await exec('git', ['-C', repository, 'rev-parse', 'HEAD'])
    const sha = stdout.trim()
    console.log(`Content source commit: ${sha}`)
    const published = await prepare(repository, staging, sha)
    const current = path.join(cache, 'current')
    const previous = path.join(cache, 'previous')
    await removeGenerated(previous)
    let hadCurrent = false
    try { await fs.rename(current, previous); hadCurrent = true } catch (error) { if (error.code !== 'ENOENT') throw error }
    try { await fs.rename(staging, current) }
    catch (error) { if (hadCurrent) await fs.rename(previous, current); throw error }
    await removeGenerated(previous)
    console.log(`Prepared ${published} published notes.`)
  } finally {
    await removeGenerated(staging)
  }
}

async function check() {
  try {
    const snapshot = JSON.parse(await fs.readFile(path.join(cache, 'current', 'snapshot.json'), 'utf8'))
    await fs.access(path.join(cache, 'current', 'metadata.json'))
    console.log(`Using content ${snapshot.sha} (${snapshot.published} published notes). Run npm run content:sync to refresh.`)
  } catch { throw new Error('No prepared content snapshot. Run npm run content:sync first.') }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { await (process.argv[2] === '--check' ? check() : sync()) }
  catch (error) { console.error(`Content preparation failed: ${error.message}`); process.exitCode = 1 }
}

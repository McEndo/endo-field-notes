# ENDO Field Notes

React/Vite frontend for genuine security notes published from
https://github.com/McEndo/endo-security-writeups (branch `main`).

## Development

Use Node 24, npm, and Git. Public content downloads need no credentials.

```sh
npm ci
npm run content:sync
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.
Development uses the last successful snapshot. Run `content:sync` again and
restart the dev server to refresh it. There is no automatic remote watching.

`npm run build` always fetches fresh content, validates and prepares it, then
runs TypeScript and Vite. `npm run lint` checks source and ingestion scripts.
The production output is `dist`. Failed fetching/validation stops the build;
the previous local snapshot is retained but is never used as a build fallback.
The source commit SHA is printed and saved in the ignored snapshot manifest.

## Authoring in endo-security-writeups

Create ordinary Markdown under an actual category directory:
`tryhackme`, `research`, or `security-concepts`.
Use either `category/note-slug/index.md` or `category/note-slug.md`.
README.md files and hidden files/directories are ignored.

Required YAML frontmatter fields:

- `title`: non-empty string
- `description`: non-empty string
- `date`: calendar date in `YYYY-MM-DD` form (quote it for clarity)
- `status`: `draft` or `published`

Optional `slug` must use lowercase letters/numbers separated by hyphens.
Otherwise it is derived from the containing directory for `index.md`, or the
filename for other notes. Slugs must be unique across all notes, including drafts.
Category comes from the top-level directory; an optional category field must match.
Metadata errors identify the exact source path. Draft metadata is validated, but
draft bodies and assets are excluded. Zero published notes is valid.

Write standard Markdown: headings, paragraphs, emphasis, lists, links, fenced
code, blockquotes, and images. JSX/MDX expressions and imports are not supported.
Raw HTML is not part of the supported authoring contract. No syntax highlighting
is added. Relative links to other Markdown files are not rewritten in this version.

Keep screenshots alongside the note and reference them with Markdown, such as
`![Description](./images/nmap.png)`. Inline and reference-style images work.
Referenced PNG/JPEG/GIF/WebP/AVIF/SVG files are copied to the deployed site.
Relative paths must stay inside the content repository; missing images fail sync.
HTTP(S) images remain external. Repository symlinks are unsupported.

Publish genuine work by committing and pushing the note and images to the content
repository, then manually trigger a website build. Website source edits are not
needed for individual notes. Automatic rebuild hooks are not configured yet.

## Generated files

`.content/current` contains the shallow checkout, prepared published Markdown,
referenced assets, `metadata.json` (validated published-note metadata), and the
source snapshot manifest. It is ignored by Git and ESLint. The app joins the JSON
metadata to compiled Markdown components by slug. YAML remains the authoring
format; the Markdown compiler consumes the YAML block without exporting metadata.
No TOML parser is required.
The historical local MDX test draft is no longer a content source.
Never commit downloaded repositories or generated content.

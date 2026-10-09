# ENDO Field Notes — AI Handoff

Last reviewed: 2026-10-09

## Current status

The planned Writeups/Notes organization is implemented. The site currently publishes one remote entry, the Pickle Rick writeup, at the preserved URL `/notes/pickle-rick`. The Notes archive is intentionally empty and displays an explicit empty state.

The production build was verified against content repository commit `47760cdf0375c89b670569cfad9eec83cd09ca09`. No published article content was edited during this review.

## Architecture

- React 19 and React Router provide the application and client-side routes.
- Vite builds the site; Netlify rewrites all paths to `index.html` for client-side routing.
- Tailwind CSS supplies utility styling through the Vite plugin.
- Remote Markdown is prepared at build time and compiled by the MDX Vite plugin in Markdown mode. Remote JSX and MDX expressions are not part of the authoring contract.
- Generated content is stored under `.content/current` and production output under `dist`; both are ignored by Git.

## Content repository integration

The public source of truth is `https://github.com/McEndo/endo-security-writeups`, branch `main`.

`scripts/content.mjs` performs the integration:

1. Shallow-clones the remote repository into a staging directory.
2. Recursively discovers `.md` files while ignoring `README.md` and hidden paths.
3. Uses `gray-matter` to parse YAML frontmatter.
4. Validates category, title, description, date, status, type, slug, and global slug uniqueness. Supported categories are `tryhackme`, `research`, and `security-concepts`; supported types are `writeup` and `note`.
5. Validates metadata for both drafts and published entries. Draft bodies and assets are not prepared.
6. Rewrites supported relative image references, checks that assets remain inside the repository, and copies them to `public/content-assets`.
7. Writes published Markdown to `.content/current/notes`, metadata to `metadata.json`, and the remote commit/published count to `snapshot.json`.
8. Atomically replaces the last successful snapshot only after preparation succeeds. A failed production sync stops the build rather than silently using stale content.

`src/lib/notes.ts` eagerly joins `metadata.json` to the compiled Markdown modules by slug and sorts entries newest-first by the validated `YYYY-MM-DD` date.

## Publishing workflow

1. Add genuine Markdown and local assets to the separate content repository under one of the supported category directories.
2. Include required frontmatter: `title`, `description`, `date`, `status`, and `type`. Optional `slug` values must be URL-safe and globally unique.
3. Commit and push the content repository change separately.
4. Trigger a Field Notes build. `npm run build` always fetches and validates fresh remote content before compiling the application.

Do not edit the remote content repository from this frontend project. Automatic build hooks are not currently configured.

## Content types and routing

- `type: writeup`: TryHackMe rooms, CTF challenges, walkthroughs, and other hands-on lab documentation.
- `type: note`: original research, technical explanations, networking material, security concepts, and experiments.
- `/`: combined published content, sorted newest-first and labeled by type.
- `/writeups`: only `writeup` entries.
- `/notes`: only `note` entries.
- `/notes/:slug`: shared article route for both types. This intentionally preserves `/notes/pickle-rick` and keeps URLs independent of type.
- `/#about`: homepage About section.

## Important files

- `scripts/content.mjs`: remote discovery, validation, asset handling, and atomic snapshot preparation.
- `scripts/content.test.mjs`: ingestion and validation regression tests.
- `scripts/remark-toc.mjs`: heading IDs and generated table-of-contents metadata.
- `scripts/remark-toc.test.mjs`: TOC and Pickle Rick compilation regression tests.
- `vite.config.ts`: Markdown/MDX and Tailwind build configuration.
- `src/lib/notes.ts`: generated metadata/module join and publication ordering.
- `src/App.tsx`: route definitions.
- `src/components/Home.tsx`: combined homepage archive.
- `src/components/Archive.tsx`: type-filtered Writeups and Notes archives and empty states.
- `src/components/Article.tsx`: shared article renderer and type-aware back navigation.
- `src/components/Navbar.tsx`: desktop/mobile navigation and mobile accessibility state.
- `netlify.toml`: SPA route fallback.
- `README.md`: authoring and local development contract.

## Validation commands

```sh
npm test
npx tsc -b
npm run lint
npm run build
npm audit --audit-level=low
```

`npm run build` requires network access to GitHub. `npm audit` requires access to the npm advisory service.

## Known issues and risks

- `npm audit` reports four moderate package findings, all propagated from one advisory: [CVE-2026-97058 / GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c), an uncaught `RangeError` denial of service when an attacker controls a `sprintf-js` floating-point format string with an out-of-range precision. The installed path is `gray-matter@4.0.3 -> js-yaml@3.15.2 -> argparse@1.0.10 -> sprintf-js@1.0.3`. The advisory affects `sprintf-js <=1.1.3`; npm consequently reports `argparse 1.0.0-1.0.10`, `js-yaml 3.2.7-3.15.2`, and `gray-matter >=2.0.2` through dependency propagation. No patched `sprintf-js` release exists as of this review.
- The vulnerable path is not reachable through this project's Markdown processing. `gray-matter` calls the `js-yaml` library's `safeLoad` function. In `js-yaml@3.15.2`, only the separate `bin/js-yaml.js` command imports `argparse`; parsing frontmatter does not load either `argparse` or `sprintf-js`. A runtime module-cache check confirmed that normal `gray-matter` parsing loads `gray-matter` and `js-yaml` parser modules but not those CLI dependencies. Even the unused CLI supplies its own static help-format strings rather than deriving `sprintf-js` format strings from Markdown.
- There is no compatible package-only fix. `gray-matter@4.0.3` is the latest release and declares `js-yaml ^3.13.1`; the maintained `js-yaml` majors use `argparse ^2.0.1`, but overriding that major would be outside the declared compatibility range. Overriding `js-yaml` would also require changing `safeLoad` to `load` and could alter YAML semantics. npm's suggested `--force` action downgrades to the older, breaking `gray-matter@2.0.1`. Do not apply any of these solely to silence the audit.
- Mitigate the residual low practical risk by keeping frontmatter parsing build-only, reviewing content-repository changes, retaining lockfile pinning and fail-closed builds, not invoking the bundled `js-yaml` CLI on attacker-defined CLI/help configuration, and monitoring for a patched `sprintf-js` or a compatible `gray-matter` release. Reassess promptly when either becomes available.
- Automatic rebuild hooks from the content repository to the Field Notes deployment are not configured.
- Relative links to other Markdown files are not rewritten. Raw HTML, remote JSX, and MDX expressions are unsupported by design.
- Draft metadata is validated, but draft Markdown bodies and referenced assets are not compiled or checked until publication.
- Responsive navigation behavior is covered by source/build review and accessibility state checks, but this repository has no browser-level automated test suite.

## Recommended next steps

1. Commit the reviewed frontend changes after inspecting the diff; do not include `.content` or `dist`.
2. Monitor the upstream advisory and `gray-matter` releases; adopt a compatible patched dependency when one exists. Do not add an unsupported major-version override merely to make `npm audit` exit cleanly.
3. Add a small browser-level smoke suite if future navigation changes become frequent; cover the mobile menu, `/writeups`, `/notes`, and `/notes/pickle-rick`.
4. Configure a content-repository build hook only when deployment automation is desired and its ownership is clear.

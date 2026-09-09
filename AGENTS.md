# ENDO Field Notes — Agent Instructions

## Project Purpose

ENDO Field Notes is the technical documentation site connected to Michael's cybersecurity portfolio.

Its purpose is to publish genuine technical documentation from:

- TryHackMe labs
- Security research
- Security concepts
- Hands-on technical experiments

The site should feel like technical field notes, not a generic blog.

Everything published must reflect real work.

Never invent:

- TryHackMe rooms completed
- Commands supposedly executed
- Flags
- Findings
- Vulnerabilities
- Screenshots
- Research results
- Tool output
- Project history
- Certifications
- Experience

If information is missing, leave it unfinished or ask rather than fabricating it.

---

## Visual Identity

Field Notes should match the broader ENDO portfolio visual language without copying it literally.

Preferred style:

- Dark minimalist interface
- Black / charcoal backgrounds
- White and muted gray typography
- Subtle sky-blue accent
- Thin borders
- Large editorial headings
- Generous whitespace
- Technical/professional feel
- Restrained motion

Avoid:

- Neon hacker clichés
- Matrix effects
- Excessive gradients
- Excessive glow
- Fake terminal gimmicks
- Unnecessary dashboards
- Overuse of cards
- Excessive animation
- Generic cybersecurity stock imagery

Fewer intentional elements are preferred over many decorative ones.

---

## Current Site Direction

Field Notes is a separate site from the main portfolio.

The main portfolio links into Field Notes through:

- FIELD NOTES
- EXPLORE FIELD NOTES

Field Notes should focus on readable technical content and archive/navigation.

Expected major areas include:

- Landing / archive
- Search
- Category filtering
- Individual note pages
- Code blocks
- Metadata
- Back navigation
- Responsive layout
- Footer/navigation consistent with ENDO

Do not redesign the site unless explicitly asked.

---

## Content Categories

The current public content categories are:

- tryhackme
- research
- security-concepts

Do not add more categories just to make the site look fuller.

If a new category is proposed, explain why it is useful before implementing it.

---

## Content Source

The public technical content repository is:

McEndo/endo-security-writeups

That repository is intended to become the source of truth for published technical notes.

Desired direction:

technical work
→ Markdown content
→ GitHub repository
→ Field Notes build
→ Netlify deployment

Do not make the browser fetch raw GitHub content on every page load unless explicitly approved.

Prefer a build-time content workflow for reliability and maintainability.

---

## Writeup Quality

A good TryHackMe writeup should focus on:

- Objective
- Scope/environment
- Enumeration
- Methodology
- Reasoning
- Findings
- Tools used where relevant
- Lessons learned
- Defensive takeaway where useful

A research note should document actual research or experimentation.

A security-concept note should explain something the author genuinely studied and understands.

Do not turn notes into copied walkthroughs or filler content.

---

## Development Rules

Before changing code:

1. Inspect the current repository.
2. Read package.json.
3. Read relevant configuration.
4. Understand the current routing/content pipeline.
5. Preserve working architecture unless there is a strong reason to change it.

For small fixes:

- Edit only the files necessary.
- Do not regenerate the whole project.

For larger changes:

- Explain the intended architecture first.
- Make coordinated edits.
- Validate afterward.

Do not replace working code just because another implementation is possible.

---

## Validation

After meaningful code changes, where practical run:

npm run build

Also run the configured lint/test scripts if present.

Do not claim something works unless it was actually validated.

If validation cannot be completed, say so explicitly.

---

## Git Practices

Do not perform destructive Git operations without explicit approval.

Do not force-push.

Do not commit secrets.

Never commit:

- .env files
- tokens
- API keys
- passwords
- credentials
- node_modules
- generated secrets

Check Git status before major changes.

---

## Working Style

Be candid.

If an idea:

- weakens the site,
- adds unnecessary complexity,
- creates filler,
- looks misleading,
- or is technically poor,

say so and explain why.

Prioritize:

1. Credibility
2. Readability
3. Technical quality
4. Maintainability
5. Usability
6. Visual polish
7. Quantity of content

The goal is not to make Field Notes look busy.

The goal is to make genuine technical work easy to read and professionally presented.
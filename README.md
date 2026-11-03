# Shradha Thakur · Portfolio

Personal portfolio site: Next.js (App Router) + TypeScript + Tailwind CSS v4, exported as a fully
static site and hosted on GitHub Pages at **https://setusher.github.io**.

## Run locally

```bash
npm install
npm run dev            # http://localhost:3000  (use -- -p 3125 for another port)
```

## Checks and build

```bash
npm run lint
npm run typecheck
npm run build          # static export to ./out
npx serve out          # or: python3 -m http.server -d out 8080
```

## Deploy (GitHub Pages)

The repo is `setusher/setusher.github.io`, a user site, so it is served at the domain root and needs
no `basePath`.

1. In the repo settings, open **Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. `.github/workflows/deploy.yml` lints, type-checks, builds and publishes `out/`.

`public/.nojekyll` stops GitHub Pages from ignoring the `_next/` folder.

## Editing content

All copy lives in [`src/lib/content.ts`](src/lib/content.ts): bio, stats, skills, projects,
experience and links. Open TODOs:

- `site.linkedin`: LinkedIn URL. LinkedIn links stay hidden while it is empty.
- `site.email`: confirm the public email (currently the one on the GitHub profile).
- `site.resume`: put the PDF at `public/resume.pdf` and set this to `"/resume.pdf"`. The
  "Download Resume" button in About appears once it is set.
- ShySnap has no link because its repo is private.

The contact form has no backend. Submitting opens the visitor's mail app with the message filled
in, addressed to `site.email`.

## Structure

```
src/app/            layout (fonts, metadata), page, globals.css (tokens and effects), icon.svg
src/components/     Sidebar, Hero, Section frame, About, Skills, Work, Experience, Contact, Footer
src/lib/content.ts  all site content
src/lib/ribbon.ts   generative ribbon renderer (pure canvas code)
src/lib/ribbon.worker.ts  runs the renderer off the main thread on an OffscreenCanvas
```

## Notes

- **Hero art**: 240 thin threads follow a Catmull-Rom spine and twist around it like a silk
  ribbon, with a small tail ending in a glint. It draws in a Web Worker when the browser supports
  `OffscreenCanvas`, and on the main thread otherwise. It runs at about 30 fps, starts after the
  page loads, pauses when the tab is hidden or the hero is off screen, and shows a single still
  frame under `prefers-reduced-motion`.
- **Decorative code tags** (`<h1>`, `</html>` …) are drawn with CSS `content: attr(data-tag)`
  and `aria-hidden`, so they are not page text.
- **Motion**: section reveals, the hero line reveal, the bobbing arrow and the tag flicker are
  all turned off under `prefers-reduced-motion`.

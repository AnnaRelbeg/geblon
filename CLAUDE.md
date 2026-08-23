# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static single-page website for **GEBLON** — a Polish interior finishing/renovation company based in Bydgoszcz. Deployed via GitHub Pages at `www.geblon.pl` (see `CNAME`).

**No build tools, no package manager, no framework.** The entire site is three files: `index.html`, `style.css`, `script.js`.

## Development

Open `index.html` directly in a browser, or serve locally:

```powershell
# Quick local server (Python)
python -m http.server 8080

# Or with Node
npx serve .
```

No build step, no lint step, no tests.

## Architecture

All content lives in `index.html` as a single scrolling page with anchor-linked sections (`#cena`, `#dlaczego`, `#oferta`, `#kontakt`, `#realizacje`).

**CSS** (`style.css`) uses CSS custom properties defined in `:root`:
- `--accent-color: #D4AF37` — gold, used throughout for borders, highlights, hover states
- `--font-main: 'Montserrat'` / `--font-display: 'Playfair Display'` — loaded from Google Fonts
- `--bg-color: #fcfcfc` / `--text-color: #333333` — light theme

**JS** (`script.js`) handles four features (all vanilla JS, no dependencies):
1. **Custom cursor** — `.cursor` div follows mouse; enlarges on `.hover-trigger`, `a`, `.btn`, `.logo-img`; switches to white theme inside `.hero`
2. **Scroll reveal** — `.reveal` class triggers `.active` when element scrolls into view (150px threshold)
3. **Hamburger menu** — toggles `.active` on `.nav-links` for mobile
4. **Before/after comparison slider** — code exists for `.comparison-container` elements (currently no such elements in HTML)

The hero slideshow is fully commented out in `script.js` — only the first slide is visible.

## Content Language

All site copy is in **Polish**. Keep new content in Polish to match.

## Contact Form

Uses [Formspree](https://formspree.io/f/mojkqgag) — `action` attribute on the `<form>` tag. No backend needed.

## Images

All images are in `images/`. The hero uses one local image and two Unsplash URLs. Gallery uses only local files.

## SEO / Structured Data

`index.html` includes:
- OG meta tags
- Schema.org `HomeAndConstructionBusiness` JSON-LD (inline `<script>` at bottom of `<body>`)
- `sitemap.xml` in root

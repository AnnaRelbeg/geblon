# CLAUDE.md

Guidance for Claude (and anyone else) working on this repository.

## Project overview

Static one-page website for **Geblon**, a Polish laser engraving workshop run by Grzegorz Gebler. The site's main job is to **send customers to the Geblon Allegro shop** (https://allegro.pl/uzytkownik/Geblon) and to collect engraving projects through the kreator.

No build step, no framework, no package manager. Open `index.html` in a browser to preview, or serve the folder with any static server (`npx serve .`).

Production domain is **https://www.geblon.pl/** (GitHub Pages, set in `CNAME`; keep that file). If it changes, update it in: `index.html` (canonical, Open Graph, JSON-LD `@id`s and URLs), `sitemap.xml`, `robots.txt`, `llms.txt`.

## File structure

| Path | Purpose |
|---|---|
| `index.html` | All content and sections, plus SEO head and JSON-LD structured data |
| `style.css` | All styles, design tokens in `:root`, responsive rules, reduced-motion rules |
| `script.js` | Mobile menu, header video loader, product filter, slideshow, kreator logic, form sending |
| `images/produkty/` | Product photos from the Allegro listings (`.jpg` + `.webp`) |
| `images/realizacje/` | Slideshow photos of finished work (`.jpg` + `.webp`) |
| `images/logo/` | Icon SVG, favicon PNG, apple-touch-icon, 512 px icon |
| `images/og-geblon.jpg` | 1200 × 630 social sharing image |
| `video/` | Header background video: `geblon-header.webm`, `geblon-header.mp4`, poster `.webp` / `.jpg` |
| `robots.txt` | Allows all search engines and AI crawlers, links the sitemap |
| `sitemap.xml` | Sitemap with image entries |
| `llms.txt` | Plain-language summary for AI assistants (products, prices, sizes, contact) |
| `site.webmanifest` | Icons and theme colour |

## Section order

1. Nav (sticky, navy) with gold "Sklep na Allegro" button
2. Hero: full-width looping background video (xTool laser engraving the products), heading, two CTAs
3. Produkty: Allegro-style cards with "Dodaj do koszyka" linking to each Allegro offer, category filter
4. Wymiary, materiały i pole graweru: spec table + key facts
5. Realizacje: slideshow of 9 finished products (the same products used in the header video)
6. Jak zamówić: 4 steps
7. Kreator: product pick (pudełko jasne with size / pudełko ciemne / wizytówka), then two surfaces, each with "Mój gotowy projekt" (upload), "Tekst + motyw" (free text + optional theme image) or "Bez graweru"
   - Boxes: **Wieczko na zewnątrz** and **Wieczko w środku**
   - Business card: **Przód wizytówki** and **Tył wizytówki**
8. Dedykacje: ready-made dedication texts per occasion + how to prepare a file for laser engraving
9. Kontakt: details + contact form
10. FAQ (mirrors the FAQPage JSON-LD; keep both in sync)
11. Footer (navy)

## Design tokens

```
--navy:       #151A24   nav, products, slideshow, footer
--bg:         #F6F3EE   warm off-white page background
--paper:      #FFFFFF   cards, kreator section
--ink:        #1F2026   body text
--gold:       #C8A46A   buttons and accents
--gold-text:  #7A5E32   gold text on light backgrounds (AA contrast)
--gold-light: #D4B37A   gold text on navy
--buy:        #C2410C   Allegro-style "Dodaj do koszyka" button
```

Fonts (Google Fonts): **Cormorant Garamond** for headings, **Inter** for body text.

## Content rules

- All copy is in **Polish**. Never use em dashes (U+2014) in copy; use commas or shorter sentences.
- Facts that must stay consistent everywhere (HTML, FAQ, JSON-LD, llms.txt):
  - Pudełko jasne: 22 × 17 × 8 cm, 28 × 17 × 8 cm, 30 × 20 × 13 cm
  - Pudełko ciemne: 28 × 17 × 8 cm
  - One engraving field: 10 × 10 cm; several fields per box; inside and outside of the lid
  - Business cards: 86 × 54 mm, both sides
- Note: the Allegro listings currently state 16 cm depth for some boxes. Align Allegro and the site before publishing.
- No invented reviews, ratings or statistics. Do not add `aggregateRating` to the JSON-LD unless it comes from real, visible reviews.

## Updating products

Products are static HTML in `#lista-produktow` (good for SEO) and mirrored in the JSON-LD `ItemList`. When an offer changes on Allegro:

1. Update the card (title, price, delivery price, URL, image) in `index.html`.
2. Update the matching `Product` in the JSON-LD (price uses a dot: `"99.90"`).
3. Update `llms.txt`.
4. Save new photos to `images/produkty/` as both `.jpg` and `.webp` (max 720 px).

Optional later: an automatic feed from the Allegro API (seller's own offers) via a small serverless function; `script.js` would render the cards from JSON, keeping the static HTML as a fallback.

## Forms

`script.js` has `FORM_ENDPOINT` at the top. It is empty, so both forms currently open the visitor's email app with a pre-filled message (files cannot be attached this way).

To receive projects with uploaded files, create a form on a service that supports file uploads (e.g. Formspree on a plan with file uploads, or Netlify Forms if hosted on Netlify), paste the endpoint URL into `FORM_ENDPOINT`, and test both forms. Hidden fields: `_subject` (email subject) and `_gotcha` (spam honeypot).

## Header video

- Made with Higgsfield (MiniMax H3) from real product photos and a reference photo of the xTool laser.
- Encoded as a forward + reverse loop (30 s) so it loops seamlessly; plays at 0.8× speed.
- Loaded by `script.js` only on screens ≥ 768 px, without data saver and without reduced motion. Phones get the poster image.
- Paused automatically when scrolled out of view.

## SEO and AI visibility (keep when editing)

- One `<h1>`, logical `<h2>`/`<h3>` structure, descriptive Polish `alt` text on every image, `width`/`height` on images, lazy loading below the fold.
- JSON-LD `@graph`: `Organization`, `Person` (founder), `WebSite`, `ItemList` of `Product` + `Offer` (price, PLN, Allegro URL), `FAQPage`.
- Target queries (Polish): pudełko z grawerem, drewniane pudełko z dedykacją, pamiątka chrztu pudełko, prezent na złote gody, prezent ślubny z grawerem, prezent na 18 urodziny, podziękowanie dla nauczyciela, metalowe wizytówki, wizytówki aluminiowe z grawerem, długopis z grawerem.
- Information gain content (unique to this site, keep and extend): spec table with sizes and the 10 × 10 cm engraving field, inside-lid engraving, both-sided business cards, ready-made dedication texts per occasion, file preparation tips for laser engraving.
- `robots.txt` explicitly allows AI crawlers; `llms.txt` gives assistants a factual summary with prices and links.
- Off-site (outside this repo, highest impact): keep Allegro listing titles and descriptions consistent with the site, collect real Allegro reviews, link the site from the Allegro seller profile and LinkedIn, and set up Google Search Console + Bing Webmaster Tools and submit `sitemap.xml`.

## Accessibility

- Visible focus styles, skip link, `aria-pressed` / `aria-current` on toggles, `aria-live` on the slideshow caption and form status.
- Everything respects `prefers-reduced-motion: reduce` (no video, no slideshow autoplay, no zoom).
- Touch targets ≥ 44 px.

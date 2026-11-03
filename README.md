# Quasar Studio

The design system and production toolkit of **The Quasar Lab**. Confidential: internal use only.

Version line lives in `assets/js/site.js`:

```js
var SITE = { nome: 'Quasar Studio', versao: 'V.1.2 - November 2026' };
```

## What is in the box

```
index.html                 single page, hash routing (#/overview … #/backgrounds)
assets/
  css/studio.css           interface styles (tokens mirror Q.TOKENS)
  fonts/                   Unbounded, Space Grotesk, JetBrains Mono (.ttf + .woff2, SIL OFL 1.1)
    fonts.css              @font-face rules
    fonts-embed.js         base64 copies, embedded into exported SVG/PNG so files render anywhere
  img/favicon.svg
  js/brand.js              colors, tokens, logo + lockups, patterns, icons, quasar motif
  js/export.js             PNG/JPG/WebP, SVG with fonts, PDF with bleed + crop marks, ZIP, MP4/WebM, PNG sequences
  js/illus.js              illustration system
  js/stings.js             motion engine (all stings and transitions)
  js/textures.js           texture library + presets (noise, grain, screen, paper, print, film)
  fonts/lab/ + fonts-lab*  candidate fonts for the Lab (OFL), loaded only on #/lab
  js/templates.js          editable templates used by Create, Studio and Collection
  js/site.js               SITE version, router, theme, shared UI
  app/<section>.js         one file per section/tool
```

No external requests. No build step. No libraries.

## Sections

`#/overview` `#/foundations` `#/variations` `#/pieces` `#/lab` `#/studio` `#/create` `#/export` `#/collection` `#/stings` `#/illustrations` `#/stickers` `#/badges` `#/merch` `#/panels` `#/sponsors` `#/team` `#/backgrounds`

## How to update

- **Version:** edit `versao` in `assets/js/site.js`. Add a line to the changelog below.
- **Colors and tokens:** `Q.PAL` and `Q.TOKENS` in `assets/js/brand.js`. Mirror token changes in the two `:root` blocks at the top of `assets/css/studio.css`.
- **Event names, dates, venues:** `Q.EVENTS` in `brand.js` and `KITS` in `assets/app/studio.js`. Anything marked "confirm" on the site still needs confirming.
- **Default template copy:** `Q.TPL_DEFAULTS` in `assets/js/templates.js`.
- **A new template:** add an entry to `Q.TPL` and a renderer in `templates.js`; it appears in Create, Collection and the Create ZIP.
- **A new section:** create `assets/app/<key>.js` calling `QS.app('<key>', { title, desc, lede, items?, render(el) })`, add a `<script>` tag in `index.html`, and add the key to `QS.ORDER` in `site.js`. If `items()` returns exportable items, the section gets a ZIP button and shows up in Collection automatically.
- **Fonts:** replace files in `assets/fonts/`, then regenerate `fonts-embed.js` (base64 of each `*-latin.woff2`, keys `Unbounded`, `SpaceGrotesk`, `JetBrainsMono`).

Item shape used everywhere:

```js
{ id, title, w, h, svg(o), register: 'research'|'party'|'core', format, section,
  vector?: false, transparent?: true, webp?: true, presets?: [{label,w,h}],
  print?: { mm: [w, h], bleed } }
```

## Export notes

- File names: `quasar_[piece]_[format]_[size].ext`, e.g. `quasar_rollup-research_pdf_850x2000mm-bleed5.pdf`.
- PDFs are image-based (up to 300 dpi, capped near 9000 px on the long side) inside a page with TrimBox, BleedBox, crop marks and a slug line. Send the SVG when a printer wants vector.
- WebM with alpha records in Chromium (Chrome, Edge, Arc). MP4 records in Chrome 126+ and Safari.
- Convert WebM alpha to ProRes 4444 for Premiere / Final Cut:
  `ffmpeg -c:v libvpx-vp9 -i in.webm -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le out.mov`
- PNG sequences are frame-exact and always keep alpha.
- Partner logos and team photos load from the user's device into memory only. They are never stored or uploaded.

## Run locally

Open `index.html` directly, or serve the folder (needed for the fonts ZIP button):

```
npx serve .        # or: python3 -m http.server 8080
```

## Deploy on Cloudflare Pages with Cloudflare Access

The site is confidential. Deploy it behind Access so only allow-listed emails can open it.

1. **Repository.** Push this folder to a **private** GitHub or GitLab repo.
2. **Pages project.** Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git. Pick the repo. Framework preset: *None*. Build command: *(empty)*. Build output directory: `/`. Deploy.
   - No Git? Use Direct Upload instead, or `npx wrangler pages deploy . --project-name quasar-studio`.
3. **Protect production and previews.** Workers & Pages → your project → Settings → General → *Enable access policy*. This creates an Access application covering `*.quasar-studio.pages.dev` (preview deployments).
4. **Protect the main domain too.** Zero Trust → Access → Applications → Add → Self-hosted. Domain: `quasar-studio.pages.dev` (and any custom domain you attach). Session duration: 24 h.
5. **Policy.** Action *Allow*. Include → *Emails* → add each address (or *Emails ending in* `@yourlab.org`). Save.
6. **Login method.** Zero Trust → Settings → Authentication → One-time PIN is on by default (a code is emailed). Add Google or GitHub if preferred.
7. **Test** in a private window: you should hit the Cloudflare Access login before anything loads.
8. **Keep it out of search.** `index.html` already sends `noindex,nofollow`. Optionally add `_headers` at the root:
   ```
   /*
     X-Robots-Tag: noindex, nofollow
     Referrer-Policy: no-referrer
   ```

To add or remove someone, edit the policy's email list. No redeploy needed.

## Confidentiality

No personal, health or financial details about anyone. No sponsor amounts. Team templates use placeholder names. Never redraw third-party logos: partners supply their own files.

## Fonts

Unbounded, Space Grotesk and JetBrains Mono are licensed under the SIL Open Font License 1.1 (see `assets/fonts/OFL-*.txt`).

## Changelog

- **V.1.2 - November 2026** Removed the uncrossed Not Designed For sticker and the NDF enamel pin.
- **V.1.1 - November 2026** Tote art uses the crossed line, with the X knocked out of NOT. UnitedXR panel title is now "Designing for the people systems missed".
- **V.1 - November 2026** First release: foundations, 16 sections, export engine, stings, kits.

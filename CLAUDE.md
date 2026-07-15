# CLAUDE.md — naghdyan.com

Project context for Claude Code. Read this first; it saves re-exploring the repo.

## What this is

Personal site for **Ruben Naghdyan** — scientist & psychologist, founder of
*psychoontology*. A small, static, content-driven marketing/portfolio site:
hero, about, focus areas, psychoontology, books (with detail pages), articles,
lectures, contact. Content is editable by non-developers through a CMS.

## Stack

- **Astro 5** (`output: 'static'`), **React 19** islands, **SCSS**, **TypeScript**.
- **Sveltia CMS** (Decap-compatible) at `/admin`, GitHub backend + OAuth.
- Hosted on **Vercel** (auto-deploys on push to `main`). `@vercel/analytics`.
- `scopedStyleStrategy: 'class'`. Sitemap via `@astrojs/sitemap`.

## Scripts

- `npm run dev` — dev server (usually :4321).
- `npm run build` — static build to `dist/` (Vercel runs this too).
- `npm run preview` — serve the built `dist/` (faithful CSS; use this to verify).
- `npm run check` — `astro check` (typecheck; should be 0 errors).
- `npm run cms:proxy` — `decap-server` for local CMS editing (with `local_backend: true`).

## i18n architecture — THE key thing to understand

The site is **trilingual: EN / RU / HY** (English, Russian, Armenian).
**Russian is the default.** The mechanism is unusual but consistent:

- **Every language is rendered into the DOM at once.** There is no per-locale
  routing or build. A translatable string produces sibling nodes tagged
  `data-lang-en` / `data-lang-ru` / `data-lang-hy`.
- **CSS toggles visibility** based on `html[data-lang="…"]` (see the "Language"
  block in `src/styles/global.scss`). Only the active language's nodes show.
- **`LangToggle.tsx`** (a `client:load` island in the nav) flips
  `html[data-lang]` + `html[lang]` and saves the choice to
  `localStorage['naghdyan-lang']`.
- **`Base.astro`** has an inline pre-paint script that applies the saved lang
  (default `'ru'`) before first paint to avoid a flash. `<html>` ships with
  `lang="ru" data-lang="ru"`.

### How to add/edit translatable text

- **In content (preferred):** every visible string is a `{ en, ru, hy }` object
  (the `bilingual` zod schema in `src/content.config.ts` — name is legacy;
  it now has 3 fields). Add all three languages.
- **Hardcoded in a component:** emit one node per language, e.g.
  `<span data-lang-en>…</span><span data-lang-ru>…</span><span data-lang-hy>…</span>`.
  The `T.astro` component does this for you: `<T en=… ru=… hy=… />`.
- **Rule:** wherever you see `data-lang-ru`, there must be a matching
  `data-lang-hy` (and `-en`). Quick audit:
  `for f in $(grep -rl data-lang-ru src); do echo "$f $(grep -c data-lang-ru $f)/$(grep -c data-lang-hy $f)"; done`

## Content model

Astro content collections (`src/content.config.ts`), all YAML under
`src/content/<collection>/`:

- `books/*.yaml` → each is a page at `/books/<id>` (`src/pages/books/[id].astro`).
  Fields: title, subtitle, year, cover, images[], facts[], buyLink, description[].
- `articles/*.yaml` — title, source, date, url (external links).
- `lectures/*.yaml` — title, description, tag, video `{ type: youtube|vimeo, id }`.
- `settings/site.yaml` (singleton) — brand, logo, favicon, portrait, seo, contact, footer.
- `settings/home.yaml` (singleton) — all homepage section copy (hero/about/focus/
  psychoontology/contact).

Note: book/article/lecture **descriptions are placeholder text** in all three
languages until real copy is supplied.

## CMS

- Config: `public/admin/config.yml`. Its fields mirror `content.config.ts` 1:1.
- **Every translatable field has three sub-fields**: English / Русский / Հայերեն.
  If you add a translatable field to the schema, add the matching `hy` field here.
- Auth handlers: `api/auth.js`, `api/callback.js`; `vercel.json` rewrites
  `/auth`→`/api/auth`, `/callback`→`/api/callback`. See `docs/deployment.md`.
- The CMS commits directly to `main` with messages like
  `Update Site content "site"` — so **remote `main` can move under you**;
  always `git fetch` before pushing. (This bit us once: a CMS logo upload to
  `site.yaml` collided with a local edit.)

## Key files

- `src/layouts/Base.astro` — html shell, head/SEO, pre-paint lang script, reveal-on-scroll.
- `src/components/Nav.astro`, `Brand.astro`, `Footer.astro` — chrome.
- `src/components/T.astro` — trilingual text helper.
- `src/components/LangToggle.tsx` — the EN/RU/HY switch (React island).
- `src/components/VideoCard.tsx` — click-to-load YouTube/Vimeo (privacy-friendly).
- `src/styles/global.scss` — all styling (single global sheet), incl. the
  language toggle rules and the responsive nav.
- `src/lib/` — `content.ts` (getSite/getHome helpers), `richtext.ts`
  (`inline()` renders **bold**/*italic*), `video.ts` (thumb/embed URLs).

## Gotchas learned the hard way

- **CSS specificity vs `display:revert`.** The language rules use
  `html[data-lang="ru"] [data-lang-ru]{display:revert}` (specificity 0,2,1).
  Any rule that tries to *hide* a translated node on mobile must **out-specify**
  that, or the active-language node re-appears. Two fixes live in the mobile nav
  block (`@media(max-width:820px)`): hide the whole `.nav-links` **container**
  (a `display:none` parent beats child `revert`), and use
  `.nav-inner .brand span.full` (0,3,1) to hide the brand label. Don't
  "simplify" these back to lower-specificity selectors.
- **Dev server `jsxDEV is not a function`.** A stale Vite dep cache makes React
  islands fail to hydrate (toggle/back-to-top silently vanish). Fix:
  `rm -rf node_modules/.vite` and restart `npm run dev`. Not a code bug; doesn't
  affect production builds.
- **Headless Chrome min width ~500px (macOS).** `--window-size=402` is clamped to
  500, and adding `--force-device-scale-factor` can push the computed layout back
  over the 820px breakpoint. For a faithful mobile screenshot, use
  `--headless=new --window-size=500,H` against `npm run preview` (not dev — dev
  injects CSS via JS). 500px is still < 820 so it exercises the mobile rules.

## Workflow / deploy conventions

- Work on a `feat/<name>` branch, then merge into `main` with `--no-ff` and a
  message like `Merge feat/<name>: <summary>`. (See `git log --merges`.)
- **Deploy = push `main`.** Vercel builds and deploys automatically; there is no
  manual deploy step.
- Commit/push only when asked. `git fetch` before pushing `main` (CMS may have
  pushed).

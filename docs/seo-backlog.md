# SEO backlog — naghdyan.com

Target query: **the name** — "Ruben Naghdyan", "Рубен Нагдян", "Ռուբեն Նաղդյան",
"naghdyan ruben". Not generic terms like "психолог"; a static personal site
cannot win those and effort spent there is wasted.

Status as of 2026-08-04.

---

## Done

- **Search Console verified** (both the meta tag and
  `/google3c76e16d046befd3.html` — keep both; Google re-checks periodically and
  silently unverifies if a token disappears).
- `robots.txt` + sitemap (27 URLs).
- Canonical URLs, per-page `og:url` (it was hardcoded to the homepage on every
  detail page), share card at `/assets/og.png`, Twitter card meta.
- **`Person` schema** with the Cyrillic/Armenian spellings and transliterations
  in `alternateName` — the main lever for a name search, since Google cannot
  infer that an English-titled page is about Рубен Нагдян. Plus the doctorate
  and `affiliation`/`worksFor` → ISEC NAS RA (verified against the
  institution's own staff listing).
- `Book` and `ScholarlyArticle` schema on detail pages, authored by that Person
  via `@id` so all pages form one connected graph.

See `src/lib/seo.ts`.

---

## Blocked on Ruben — highest impact remaining

**He has no scholarly or social profiles.** Verified 2026-08-04: the ORCID
public API returns *zero* records for the surname; nothing on Google Scholar or
ResearchGate; no personal YouTube or Facebook. The lecture videos live on
Mindset's channel (`@mindset3165`), not his.

This is why `seo.sameAs` in `src/content/settings/site.yaml` is an empty list.
Each profile created is both a `sameAs` target *and* a real backlink — together
they decide a name query more than anything left in the code.

1. **ORCID** — orcid.org/register. Free, instant, permanent.
2. **Google Scholar profile** — his CyberLeninka papers are already indexed; a
   profile claims them and ties them to the name.
3. **ResearchGate** — high domain authority, ranks well for academic names.
4. Any Facebook / Instagram / Telegram he actually uses.

Each profile must link back to `naghdyan.com`. Then add the URLs at
`/admin` → Site content → **Branding & contact** → SEO → *Profile links
elsewhere* (note: SEO is a section inside that page, not a top-level entry).

**Deliberately excluded:** his books circulate on koob.ru and klex.ru as free
downloads. They would be decent signals but they give the books away — the
author's call, not ours.

## Blocked on us (non-code)

- Ask Mindset to put `naghdyan.com` in their video descriptions — the lectures
  are already embedded here, so the link is natural and it is the easiest real
  backlink available.

---

## The big one: per-locale routes

All three languages live on **one URL** (see the i18n section in `CLAUDE.md`).
Consequences:

- Nothing for `hreflang` to point at, so no Russian or Armenian page exists for
  Google to rank — only an English-titled one.
- `<title>` and meta description are English-only even though Russian is the
  default UI, so a Russian searcher sees an English snippet.
- `<html lang="ru">` is hardcoded in `Base.astro`; the real value is only
  applied by JS after load.
- CSS-hidden text is discounted, so roughly two thirds of the words on every
  page carry little weight.

**Fix:** real routes — `/` (RU), `/en/`, `/hy/` — each with its own `lang`,
title, description, canonical, and reciprocal `hreflang`. Content collections
stay as they are; the change is routing plus turning `T.astro` /
`data-lang-*` into a locale prop. Roughly half a day, touches every component,
needs careful checking against the specificity gotchas in `CLAUDE.md`.

Do this before spending effort on Russian- or Armenian-language content — until
it lands, that content has no page of its own to rank.

---

## Measuring

Search Console → **Performance**, filter queries containing "naghdyan". Expect
nothing for the first few days after verification; that is normal, not a bug.
Ranking for a distinctive name with a matching domain is very achievable, but
it typically takes weeks and moves on backlinks, not on-page changes.

# Deployment & CMS setup — naghdyan.com

How the site ships and how to wire up editor logins. **Keep this project fully
separate from anjoy.space** — every row below is its own thing, so the two sites
can never interfere. See [Isolation](#isolation-why-this-cant-affect-anjoyspace).

| Concern | naghdyan.com uses | Shared with anjoy? |
|---|---|---|
| Git repo | `ashotpahlevanyan/naghdyan` | ❌ separate |
| Vercel project (same account is fine) | its own project, linked to this repo | ❌ separate |
| Domain | `naghdyan.com` | ❌ separate |
| GitHub OAuth App | **its own app** → `naghdyan.com/callback` | ❌ separate |
| Sveltia CMS (`public/admin/`) | self-hosted from this repo | ❌ separate |

---

## 1. Vercel project

- You do **not** need a separate Vercel account — one account holds many
  isolated **projects**. Just make sure there is a project linked to **this**
  repo (`ashotpahlevanyan/naghdyan`), not the anjoy repo.
- Framework preset: **Astro**. Build command `npm run build`, output `dist/`.
- Deploys happen automatically on push to `main` (Vercel Git integration).
  GitHub Actions (`.github/workflows/ci.yml`) only *guards* that `main` builds;
  it does not deploy.
- Add the custom domain `naghdyan.com` in **Project → Settings → Domains**, then
  point DNS at Vercel.

---

## 2. GitHub OAuth App (required for Sveltia CMS login)

Sveltia CMS uses GitHub as its backend. The `/auth` and `/callback` endpoints
(`api/auth.js`, `api/callback.js`) run the OAuth handshake. They need **their
own** GitHub OAuth App — do **not** reuse anjoy's, because one OAuth App allows
only a single callback URL.

### Checklist

- [ ] Go to **https://github.com/settings/developers → OAuth Apps**.
      Check whether a naghdyan app already exists (callback = `naghdyan.com/callback`).
      If yes, reuse it and skip to step "Copy credentials". If no, create one:
- [ ] **New OAuth App** with:
  - **Application name:** `naghdyan.com CMS`
  - **Homepage URL:** `https://naghdyan.com`
  - **Authorization callback URL:** `https://naghdyan.com/callback`
        *(exactly this — it is the `/callback` rewrite in `vercel.json`)*
  - Leave "Enable Device Flow" unchecked.
- [ ] Click **Register application**.
- [ ] Copy the **Client ID**.
- [ ] Click **Generate a new client secret**, copy it now (shown once).
- [ ] In **Vercel → this project → Settings → Environment Variables**, add — for
      the **Production** (and Preview, if you want CMS on previews) environment:
  - [ ] `GITHUB_CLIENT_ID` = the Client ID
  - [ ] `GITHUB_CLIENT_SECRET` = the client secret
- [ ] **Redeploy** (env vars only apply to new deployments).
- [ ] Test: open `https://naghdyan.com/admin`, click **Login with GitHub**, and
      confirm the popup completes and returns you to the CMS.

> Secrets live **only** in Vercel env vars — never commit them. `api/auth.js`
> refuses to run and returns a clear 500 if `GITHUB_CLIENT_ID` is missing.

### Local CMS preview (optional)

`npm run cms:proxy` runs `decap-server` so you can test the CMS against local
files without GitHub auth. Point the CMS `local_backend` at it during dev.

---

## 3. Sveltia CMS front-end (built)

Already in the repo:

- `public/admin/index.html` — loads Sveltia CMS.
- `public/admin/config.yml` — GitHub backend + `books` / `articles` /
  `lectures` collections that mirror `src/content.config.ts`, each field
  bilingual `{ en, ru }`.

Reach it at **`https://naghdyan.com/admin`**. Login needs the OAuth App and env
vars from §2. Editors get a form UI; saving commits YAML to `src/content/…` on
`main`, which triggers a Vercel rebuild — the edit is live in ~1 min.

Collections:

- **Site content** → *Branding & contact* (logo, favicon, portrait, brand name,
  contact email/Telegram, footer, SEO) and *Homepage text* (hero, about, focus
  cards, psychoontology, contact copy). Prose fields accept `**bold**` /
  `*italic*`.
- **Books / Articles / Lectures** — the listed content.

Images (logo, favicon, portrait, book covers) upload to `public/assets/uploads`.

New entries are named from the **URL slug** field; existing entries already carry
a `slug:` matching their filename. There is no "Sveltia account" — it is static
JS served from this repo that commits back to this repo. Fully self-contained.

---

## Isolation: why this can't affect anjoy.space

Vercel's deploy boundary is the **project**, and each project is bound to **one
repo**. A push to the `naghdyan` repo can only ever build the project linked to
that repo — it is structurally impossible for it to touch anjoy's project, which
is bound to the anjoy repo. The GitHub OAuth Apps are separate (different
callback URLs), and each site's Sveltia files live in its own repo. Nothing is
shared, so nothing can collide.

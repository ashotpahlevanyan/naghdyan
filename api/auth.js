import crypto from 'node:crypto';

/**
 * OAuth step 1 — start the GitHub authorization flow for the CMS.
 *
 * Sveltia/Decap CMS opens this endpoint in a popup (via backend.base_url in
 * public/admin/config.yml). We redirect the popup to GitHub's consent screen
 * and stash an anti-CSRF `state` value in a short-lived cookie that /callback
 * verifies. Reached at /auth through the rewrite in vercel.json.
 *
 * Configure with env vars on the host (NO secrets committed):
 *   GITHUB_CLIENT_ID       — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET   — used only in /callback
 */
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(500).send('OAuth is not configured: missing GITHUB_CLIENT_ID env var.');
    return;
  }

  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${proto}://${host}/callback`;

  const state = crypto.randomBytes(16).toString('hex');
  const scope = (req.query && req.query.scope) || 'repo';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    allow_signup: 'false',
  });

  res.setHeader(
    'Set-Cookie',
    `nf_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
  );
  res.setHeader('Location', `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.status(302).end();
}

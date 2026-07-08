/**
 * OAuth step 2 — GitHub redirects back here with a temporary `code`.
 *
 * We verify the `state` against the cookie set by /auth, exchange the code for
 * an access token using the client secret (server-side only), then hand the
 * token back to the CMS window via the postMessage handshake that
 * Sveltia/Decap expects. Reached at /callback through the vercel.json rewrite,
 * which is also the Authorization callback URL registered on the GitHub OAuth App.
 *
 * Env vars (NO secrets committed):
 *   GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
 */
export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const provider = 'github';

  const code = req.query && req.query.code;
  const state = req.query && req.query.state;
  const expectedState = parseCookies(req.headers.cookie).nf_oauth_state;

  // Always clear the one-time state cookie.
  res.setHeader('Set-Cookie', 'nf_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');

  if (!clientId || !clientSecret) {
    return sendResult(res, provider, 'error', { error: 'OAuth is not configured on the server.' });
  }
  if (!code || !state || !expectedState || state !== expectedState) {
    return sendResult(res, provider, 'error', {
      error: 'Invalid or expired OAuth state — please try signing in again.',
    });
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, state }),
    });
    const data = await tokenRes.json();

    if (data.access_token) {
      return sendResult(res, provider, 'success', { token: data.access_token, provider });
    }
    return sendResult(res, provider, 'error', {
      error: data.error_description || data.error || 'No access token returned by GitHub.',
    });
  } catch (err) {
    return sendResult(res, provider, 'error', {
      error: 'Token exchange failed: ' + (err && err.message ? err.message : String(err)),
    });
  }
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    if (key) out[key] = decodeURIComponent(part.slice(idx + 1).trim());
  }
  return out;
}

function sendResult(res, provider, status, payload) {
  const message = `authorization:${provider}:${status}:${JSON.stringify(payload)}`;
  const html = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><title>Signing in…</title></head>
<body>
<p>Completing sign-in… you can close this window.</p>
<script>
  (function () {
    var authMessage = ${JSON.stringify(message)};
    function receiveMessage(e) {
      if (window.opener) window.opener.postMessage(authMessage, e.origin);
      window.removeEventListener('message', receiveMessage, false);
    }
    window.addEventListener('message', receiveMessage, false);
    if (window.opener) window.opener.postMessage('authorizing:${provider}', '*');
  })();
</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}

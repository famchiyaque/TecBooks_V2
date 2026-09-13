import { deleteCookie, setCookie } from 'hono/cookie';

const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function sessionCookieOptions(context) {
  const isHttps = new URL(context.req.url).protocol === 'https:';
  return {
    path: '/',
    httpOnly: true,
    secure: isHttps,
    // Frontend (tecbooks.org) and worker (*.workers.dev) are different
    // registrable domains, so the cookie must be sendable cross-site.
    // SameSite=None requires Secure, which local http dev doesn't have.
    sameSite: isHttps ? 'None' : 'Lax',
  };
}

export function setSessionCookie(context, token) {
  setCookie(context, 'session', token, {
    ...sessionCookieOptions(context),
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(context) {
  deleteCookie(context, 'session', sessionCookieOptions(context));
}

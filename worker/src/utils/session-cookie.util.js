const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export function setSessionCookie(context, token) {
  context.header(
    'Set-Cookie',
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_COOKIE_MAX_AGE_SECONDS}`
  );
}

export function clearSessionCookie(context) {
  context.header(
    'Set-Cookie',
    'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  );
}

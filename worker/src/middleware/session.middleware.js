import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';

export const SESSION_INVALID = 'session_invalid';

function sessionInvalid() {
  const error = new Error(SESSION_INVALID);
  error.status = 401;
  return error;
}

export async function sessionMiddleware(context, next) {
  const token = getCookie(context, 'session');
  if (!token) {
    throw sessionInvalid();
  }

  try {
    const payload = await verify(token, context.env.JWT_SECRET, 'HS256');
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      throw sessionInvalid();
    }
    context.set('userId', userId);
  } catch (error) {
    if (error.status === 401) throw error;
    throw sessionInvalid();
  }

  await next();
}

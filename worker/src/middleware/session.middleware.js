import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';

function unauthorized() {
  const error = new Error('unauthorized');
  error.status = 401;
  return error;
}

export async function sessionMiddleware(context, next) {
  const token = getCookie(context, 'session');
  if (!token) {
    throw unauthorized();
  }

  try {
    const payload = await verify(token, context.env.JWT_SECRET);
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      throw unauthorized();
    }
    context.set('userId', userId);
  } catch (error) {
    if (error.status === 401) throw error;
    throw unauthorized();
  }

  await next();
}

import { sign } from 'hono/jwt';
import { createClerkSignInTicket } from './clerk-auth.service.js';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

async function createSessionToken(env, user) {
  return sign(
    {
      sub: String(user.id),
      role_id: user.role_id,
      school_id: user.school_id,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    env.JWT_SECRET
  );
}

export async function buildAuthSession(env, user) {
  const [token, clerkTicket] = await Promise.all([
    createSessionToken(env, user),
    createClerkSignInTicket(env, user.clerk_user_id),
  ]);

  return { token, clerkTicket };
}

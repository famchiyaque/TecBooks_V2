import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { createClerkClient } from '@clerk/backend';
import { findUserByEmail } from '../models/users.model.js';

const BLOCKED_STATUSES = ['banned', 'deactivated', 'locked'];
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function toSafeUser(usuario) {
  return {
    id: usuario.id,
    email: usuario.email,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
    role_id: usuario.role_id,
    school_id: usuario.school_id,
  };
}

// Ticket de un solo uso (Clerk "Sign-in Tokens"): nuestro backend ya
// verifico password, le pedimos a Clerk que arme la sesion sin volver
// a pedir credenciales. El frontend lo canjea con @clerk/clerk-react.
async function createClerkSignInTicket(env, clerkUserId) {
  if (!env.CLERK_SECRET_KEY || !clerkUserId) return null;

  const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  const signInToken = await clerkClient.signInTokens.createSignInToken({
    userId: clerkUserId,
    expiresInSeconds: 60,
  });
  return signInToken.token;
}

export async function login(env, email, password) {
  const usuario = await findUserByEmail(env.DB, email);
  if (!usuario) {
    const error = new Error('form_identifier_not_found');
    error.status = 401;
    throw error;
  }

  if (BLOCKED_STATUSES.includes(usuario.status)) {
    const error = new Error('user_banned');
    error.status = 403;
    throw error;
  }

  const passwordMatches = usuario.hashed_password
    ? await bcrypt.compare(password, usuario.hashed_password)
    : false;

  if (!passwordMatches) {
    const error = new Error('form_password_incorrect');
    error.status = 401;
    throw error;
  }

  const safeUser = toSafeUser(usuario);

  const clerkTicket = await createClerkSignInTicket(env, usuario.clerk_user_id);

  const token = await sign(
    {
      sub: String(usuario.id),
      role_id: usuario.role_id,
      school_id: usuario.school_id,
      exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    },
    env.JWT_SECRET
  );

  return { safeUser, token, clerkTicket };
}

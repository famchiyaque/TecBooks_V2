import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';
import { createClerkClient } from '@clerk/backend';
import { findUserByEmail, createUser, findRoleIdByName, findSchoolIdBySlug } from '../models/users.model.js';

const BLOCKED_STATUSES = ['banned', 'deactivated', 'locked'];
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 dias
const DEFAULT_SIGNUP_ROLE = 'student';
const DEFAULT_SIGNUP_SCHOOL_SLUG = 'general';

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

  return buildSession(env, usuario, toSafeUser(usuario));
}

async function buildSession(env, usuario, safeUser) {
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

export async function register(env, { email, password, first_name, last_name }) {
  const existing = await findUserByEmail(env.DB, email);
  if (existing) {
    const error = new Error('email_already_registered');
    error.status = 409;
    throw error;
  }

  const roleId = await findRoleIdByName(env.DB, DEFAULT_SIGNUP_ROLE);
  const schoolId = await findSchoolIdBySlug(env.DB, DEFAULT_SIGNUP_SCHOOL_SLUG);
  if (!roleId || !schoolId) {
    const error = new Error('signup_not_configured');
    error.status = 500;
    throw error;
  }

  const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });
  let clerkUser;
  try {
    clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName: first_name,
      lastName: last_name,
    });
  } catch (err) {
    const code = err.errors?.[0]?.code;
    if (code === 'form_identifier_exists') {
      const error = new Error('email_already_registered');
      error.status = 409;
      throw error;
    }
    if (code?.startsWith('form_password_')) {
      const error = new Error('weak_password');
      error.status = 422;
      throw error;
    }
    const error = new Error('signup_failed');
    error.status = 500;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = await createUser(env.DB, {
    school_id: schoolId,
    email,
    first_name,
    last_name,
    role_id: roleId,
    hashed_password: hashedPassword,
    status: 'active',
    clerk_user_id: clerkUser.id,
  });

  const usuario = { id: userId, email, first_name, last_name, role_id: roleId, school_id: schoolId, clerk_user_id: clerkUser.id };

  return buildSession(env, usuario, toSafeUser(usuario));
}

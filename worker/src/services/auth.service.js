import { findUserByEmail, createUser, findRoleIdByName, findSchoolIdBySlug } from '../models/users.model.js';
import { toSafeUser } from '../mappers/user.mapper.js';
import { hashPassword, verifyPassword } from './password.service.js';
import { createClerkUserAccount } from './clerk-auth.service.js';
import { buildAuthSession } from './session.service.js';

const BLOCKED_STATUSES = ['banned', 'deactivated', 'locked'];
const DEFAULT_SIGNUP_ROLE = 'student';
const DEFAULT_SIGNUP_SCHOOL_SLUG = 'general';

export async function login(env, email, password) {
  try {
    const user = await findUserByEmail(env.DB, email);
    if (!user) {
      const error = new Error('form_identifier_not_found');
      error.status = 401;
      throw error;
    }

    if (BLOCKED_STATUSES.includes(user.status)) {
      const error = new Error('user_banned');
      error.status = 403;
      throw error;
    }

    const passwordMatches = await verifyPassword(password, user.hashed_password);
    if (!passwordMatches) {
      const error = new Error('form_password_incorrect');
      error.status = 401;
      throw error;
    }

    const session = await buildAuthSession(env, user);
    return { safeUser: toSafeUser(user), ...session };
  } catch (error) {
    if (!error.status) {
      console.error('[auth.service] login failed:', error);
    }
    throw error;
  }
}

export async function register(env, { email, password, first_name: firstName, last_name: lastName }) {
  try {
    const existingUser = await findUserByEmail(env.DB, email);
    if (existingUser) {
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

    const clerkUser = await createClerkUserAccount(env, { email, password, firstName, lastName });
    const hashedPassword = await hashPassword(password);

    const userId = await createUser(env.DB, {
      school_id: schoolId,
      email,
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      hashed_password: hashedPassword,
      status: 'active',
      clerk_user_id: clerkUser.id,
    });

    const newUser = {
      id: userId,
      email,
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      school_id: schoolId,
      clerk_user_id: clerkUser.id,
    };

    const session = await buildAuthSession(env, newUser);
    return { safeUser: toSafeUser(newUser), ...session };
  } catch (error) {
    if (!error.status) {
      console.error('[auth.service] register failed:', error);
    }
    throw error;
  }
}

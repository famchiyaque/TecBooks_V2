import { z } from 'zod';
import { loginUseCase, registerUseCase } from '../usecases/auth.usecase.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
});

function setSessionCookie(c, token) {
  c.header(
    'Set-Cookie',
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );
}

function clearSessionCookie(c) {
  c.header(
    'Set-Cookie',
    'session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
  );
}

export async function loginController(c) {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'invalid_body', details: parsed.error.flatten() }, 400);
  }

  const { safeUser, token, clerkTicket } = await loginUseCase(c.env, parsed.data);

  setSessionCookie(c, token);

  return c.json({ user: safeUser, token, clerkTicket }, 200);
}

export async function registerController(c) {
  const body = await c.req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'invalid_body', details: parsed.error.flatten() }, 400);
  }

  const { safeUser, token, clerkTicket } = await registerUseCase(c.env, parsed.data);

  setSessionCookie(c, token);

  return c.json({ user: safeUser, token, clerkTicket }, 201);
}

export async function logoutController(c) {
  clearSessionCookie(c);
  return c.json({ ok: true }, 200);
}

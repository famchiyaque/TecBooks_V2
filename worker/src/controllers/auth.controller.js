import { loginUseCase, registerUseCase } from '../usecases/auth.usecase.js';
import { loginRequestSchema, registerRequestSchema } from '../requests/auth.request.js';
import { setSessionCookie, clearSessionCookie } from '../utils/session-cookie.util.js';

export async function loginController(context) {
  const requestBody = await context.req.json();
  const validationResult = loginRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return context.json({ error: 'invalid_body', details: validationResult.error.flatten() }, 400);
  }

  const { safeUser, token, clerkTicket } = await loginUseCase(context.env, validationResult.data);

  setSessionCookie(context, token);

  return context.json({ user: safeUser, token, clerkTicket }, 200);
}

export async function registerController(context) {
  const requestBody = await context.req.json();
  const validationResult = registerRequestSchema.safeParse(requestBody);
  if (!validationResult.success) {
    return context.json({ error: 'invalid_body', details: validationResult.error.flatten() }, 400);
  }

  const { safeUser, token, clerkTicket } = await registerUseCase(context.env, validationResult.data);

  setSessionCookie(context, token);

  return context.json({ user: safeUser, token, clerkTicket }, 201);
}

export async function logoutController(context) {
  clearSessionCookie(context);
  return context.json({ ok: true }, 200);
}

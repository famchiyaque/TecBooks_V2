import { z } from 'zod';
import { loginUseCase } from '../usecases/auth.usecase.js';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function loginController(c) {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: 'invalid_body', details: parsed.error.flatten() }, 400);
  }

  const { safeUser, token, clerkTicket } = await loginUseCase(c.env, parsed.data);

  c.header(
    'Set-Cookie',
    `session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 7}`
  );

  return c.json({ user: safeUser, token, clerkTicket }, 200);
}

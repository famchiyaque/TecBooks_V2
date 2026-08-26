import { login } from '../services/auth.service.js';

export async function loginUseCase(env, { email, password }) {
  return login(env, email, password);
}

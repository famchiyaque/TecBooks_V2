import { login, register } from '../services/auth.service.js';

export async function loginUseCase(env, { email, password }) {
  return login(env, email, password);
}

export async function registerUseCase(env, { email, password, first_name, last_name }) {
  return register(env, { email, password, first_name, last_name });
}

import { login, register } from '../services/auth.service.js';

export async function loginUseCase(env, { email, password }) {
  try {
    return await login(env, email, password);
  } catch (error) {
    if (!error.status) {
      console.error('[auth.usecase] loginUseCase failed:', error);
    }
    throw error;
  }
}

export async function registerUseCase(env, { email, password, first_name, last_name }) {
  try {
    return await register(env, { email, password, first_name, last_name });
  } catch (error) {
    if (!error.status) {
      console.error('[auth.usecase] registerUseCase failed:', error);
    }
    throw error;
  }
}

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(plainTextPassword) {
  try {
    return await bcrypt.hash(plainTextPassword, SALT_ROUNDS);
  } catch (error) {
    console.error('[password.service] hashPassword failed:', error);
    throw error;
  }
}

export async function verifyPassword(plainTextPassword, hashedPassword) {
  try {
    if (!hashedPassword) return false;
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    console.error('[password.service] verifyPassword failed:', error);
    throw error;
  }
}

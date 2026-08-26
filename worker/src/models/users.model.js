export async function findUserByEmail(db, email) {
  return db
    .prepare(
      'SELECT id, school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id FROM users WHERE email = ?'
    )
    .bind(email)
    .first();
}

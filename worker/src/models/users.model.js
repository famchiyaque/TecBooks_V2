export async function findUserByEmail(database, email) {
  return database
    .prepare(
      'SELECT id, school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id FROM users WHERE email = ?'
    )
    .bind(email)
    .first();
}

export async function createUser(database, { school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id }) {
  const row = await database
    .prepare(
      `INSERT INTO users (school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
       RETURNING id`
    )
    .bind(school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id)
    .first();
  return row.id;
}

export async function findRoleIdByName(database, roleName) {
  const row = await database.prepare('SELECT id FROM roles WHERE role = ?').bind(roleName).first();
  return row?.id ?? null;
}

export async function findSchoolIdBySlug(database, slug) {
  const row = await database.prepare('SELECT id FROM schools WHERE slug = ?').bind(slug).first();
  return row?.id ?? null;
}

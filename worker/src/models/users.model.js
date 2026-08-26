export async function findUserByEmail(database, email) {
  try {
    return await database
      .prepare(
        'SELECT id, school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id FROM users WHERE email = ?'
      )
      .bind(email)
      .first();
  } catch (error) {
    console.error('[users.model] findUserByEmail failed:', error);
    throw error;
  }
}

export async function createUser(database, { school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id }) {
  try {
    const row = await database
      .prepare(
        `INSERT INTO users (school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
         RETURNING id`
      )
      .bind(school_id, email, first_name, last_name, role_id, hashed_password, status, clerk_user_id)
      .first();
    return row.id;
  } catch (error) {
    console.error('[users.model] createUser failed:', error);
    throw error;
  }
}

export async function findRoleIdByName(database, roleName) {
  try {
    const row = await database.prepare('SELECT id FROM roles WHERE role = ?').bind(roleName).first();
    return row?.id ?? null;
  } catch (error) {
    console.error('[users.model] findRoleIdByName failed:', error);
    throw error;
  }
}

export async function findSchoolIdBySlug(database, slug) {
  try {
    const row = await database.prepare('SELECT id FROM schools WHERE slug = ?').bind(slug).first();
    return row?.id ?? null;
  } catch (error) {
    console.error('[users.model] findSchoolIdBySlug failed:', error);
    throw error;
  }
}

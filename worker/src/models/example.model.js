export async function findExampleById(db, id) {
  return db.prepare('SELECT id, name, created_at FROM examples WHERE id = ?').bind(id).first();
}

export async function listExamples(db) {
  const { results } = await db.prepare('SELECT id, name, created_at FROM examples ORDER BY id DESC').all();
  return results;
}

export async function insertExample(db, name) {
  return db.prepare('INSERT INTO examples (name) VALUES (?) RETURNING id, name, created_at').bind(name).first();
}

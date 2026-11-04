import { verify } from "hono/jwt";

async function authenticate(c, gameId) {
  const token = c.req.query("token");
  if (!token) return null;

  const student = await c.env.DB.prepare(
    `
      SELECT s.id, s.display_name FROM game_team_students s
      JOIN game_teams t ON t.id = s.game_team_id
      WHERE s.session_token = ? AND t.game_id = ?
    `,
  )
    .bind(token, gameId)
    .first();
  if (student)
    return { role: "student", id: student.id, name: student.display_name };

  // Teacher: JWT
  try {
    const p = await verify(token, c.env.JWT_SECRET, "HS256");
    return { role: "teacher", id: p.id, name: p.name ?? "Teacher" };
  } catch {
    return null;
  }
}

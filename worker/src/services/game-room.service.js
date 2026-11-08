export async function createGameRoom(c, roomData, projectIds) {
  console.log({ roomData, projectIds });
  const { code, name, userId, numTeams, timePerRound } = roomData;
  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO game_rooms (code, game_name, created_by, created_at, n_teams, time_round)
       VALUES (?,?,?,?,?,?)`,
    ).bind(
      code,
      name,
      userId,
      new Date().toISOString(),
      numTeams,
      timePerRound,
    ),

    ...projectIds.map((projectId) =>
      c.env.DB.prepare(
        `INSERT INTO game_project (game_id, project_id)
         SELECT game_id, ? FROM game_rooms WHERE code = ?`,
      ).bind(projectId, code),
    ),
  ]);
}

export async function validateProjects(c, placeholders, projectIds) {
  return await c.env.DB.prepare(
    `SELECT COUNT(*) AS n FROM projects_temp WHERE project_id IN (${placeholders})`,
  )
    .bind(...projectIds)
    .all();
}

async function getRoom(db, code) {
  return db
    .prepare(
      "SELECT game_id, game_name, created_by FROM game_rooms WHERE code = ? AND closed_at IS NULL",
    )
    .bind(code)
    .first(); // null if not found
}

export async function joinRoom(c) {
  const { inviteCode, displayName } = await c.req.json();
  const code = c.req.param("code");

  const room = await getRoom(c.env.DB, code);
  if (!room) return c.json({ error: "Room not found" }, 404);

  const student = await c.env.DB.prepare(
    `SELECT s.id FROM game_team_students s
     JOIN game_team t ON t.id = s.game_team_id
     WHERE s.invite_code = ? AND t.game_id = ?`, // check the real column name
  )
    .bind(inviteCode, room.game_id)
    .first();

  if (!student) return c.json({ error: "Invalid invite" }, 403);

  const token = crypto.randomUUID();
  await c.env.DB.prepare(
    "UPDATE game_team_students SET session_token = ?, joined_at = ?, display_name = ? WHERE id = ?",
  )
    .bind(token, new Date().toISOString(), displayName, student.id)
    .run();

  return c.json({ sessionToken: token, wsPath: `/ws/rooms/${code}` });
}

export async function connectCode(c) {
  if (c.req.header("Upgrade") !== "websocket")
    return c.text("Expected WebSocket", 426);

  const room = await getRoom(c.env.DB, c.req.param("code"));
  if (!room) return c.json({ error: "Room not found" }, 404);

  const identity = await authenticate(c, room);
  if (!identity) return c.text("Unauthorized", 401);

  const stub = c.env.GAME_ROOM.get(
    c.env.GAME_ROOM.idFromName(`games-${room.game_id}`),
  );

  const headers = new Headers(c.req.raw.headers);
  headers.set("X-Role", identity.role);
  headers.set("X-User-Id", String(identity.id));
  headers.set("X-Name", identity.name);

  return stub.fetch(new Request(c.req.raw, { headers }));
}

async function authenticate(c, room) {
  const token = c.req.query("token");
  if (!token) return null;

  // 1. Student: session token issued by joinRoom
  const student = await c.env.DB.prepare(
    `SELECT s.id, s.display_name FROM game_team_students s
     JOIN game_team t ON t.id = s.game_team_id
     WHERE s.session_token = ? AND t.game_id = ?`,
  )
    .bind(token, room.game_id)
    .first();

  if (student)
    return { role: "student", id: student.id, name: student.display_name };

  // 2. Teacher: reuse the same verification your auth middleware does
  const userId = c.get("userId");
  if (userId && Number(userId) === room.created_by)
    return { role: "teacher", id: userId, name: "Teacher" };

  return null;
}

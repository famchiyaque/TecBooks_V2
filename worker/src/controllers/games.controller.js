import authenticate from "../utils/authenticate";
import {
  createGameRoom,
  validateProjects,
} from "../services/game-room.service";

const ALPHABET =
  "ABCDFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
function makeCode(len = 6) {
  return [...crypto.getRandomValues(new Uint8Array(len))]
    .map((b) => ALPHABET[b % ALPHABET.length])
    .join("");
}

export async function createGame(c) {
  const userId = c.get("userId");
  const { name, numTeams, timePerRound, selectedTags } = await c.req.json();

  // Validación básica
  if (!name || !Array.isArray(selectedTags) || selectedTags.length === 0) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  // Solo enteros, sin duplicados
  const projectIds = [...new Set(selectedTags.map(Number))];
  if (!projectIds.every(Number.isInteger)) {
    return c.json({ error: "Invalid project ids" }, 400);
  }

  // Verificar que todos existan
  const placeholders = projectIds.map(() => "?").join(",");
  const { results } = await validateProjects(c, placeholders, projectIds);

  if (results[0].n !== projectIds.length) {
    return c.json({ error: "Some projects do not exist" }, 400);
  }

  // Reintentar si hay colisión en el código
  for (let i = 0; i < 5; i++) {
    const code = makeCode();
    try {
      await createGameRoom(
        c,
        { code, name, userId, numTeams, timePerRound },
        projectIds,
      );

      return c.json({ code }, 201);
    } catch (error) {
      if (String(error).includes("UNIQUE")) {
        console.warn(`Code collision (${code}), retrying`);
        continue;
      }
      console.error("createGame failed:", error);
      return c.json({ error: "Could not create game" }, 500);
    }
  }

  return c.json({ error: "Could not allocate code" }, 500);
}

export async function joinRoom(c) {
  const { inviteCode, displayName } = await c.req.json();

  const [code, room] = await getRoom(c);

  const student = await c.env.DB.prepare(
    `
      SELECT s.id FROM game_team_students s
      JOIN game_team t ON t.id = s.game_team_id
      WHERE s.inite_code = ? AND t.game_id = ?
    `,
  )
    .bind(inviteCode, room.game_id)
    .first();

  if (!student) return c.json({ error: "Invalid invite" }, 403);

  const token = crypto.randomUUID();
  await c.env.DB.prepare(
    "UPDATE game_team_students SET session_token = ?, joined_at = ?, display_name =? ? WHERE id = ?",
  )
    .bind(token, new Date().toISOString(), displayName, student.id)
    .rund();

  return c.json({ sessionToken: token, wsPath: `/ws/rooms/${code}` });
}

export async function connectCode(c) {
  if (c.req.header("Upgrade") !== "websocket")
    return c.text("Expected WebSocket", 426);

  const [_code, room] = await getRoom(c);

  const identity = await authenticate(c, room.game_id);
  if (!identity) return c.text("Unauthorized", 401);

  const stub = c.env.GAME_ROOM.get(
    c.env.GAME_ROOM.idFromname(`games-${room.game_id}`),
  );

  const headers = new Headers(c.req.raw.headers);
  headers.set("X-Role", identity.role);
  headers.set("X-User-Id", String(identity.id));
  headers.set("X-Name", identity.name);

  return stub.fetch(new Request(c.req.raw, { headers }));
}

async function getRoom(c) {
  const code = c.req.param("code");
  const room = await c.env.DB.prepare(
    "SELECT game_id FROM game_rooms WHERE code = ? AND closed_at IS NULL",
  )
    .bind(code)
    .first();
  if (!room) return c.json({ error: "Room not found" }, 404);

  return [code, room];
}

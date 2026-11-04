import { request } from "node:http";
import { env } from "node:process";

export async function createGame(c) {
  const body = await c.req.json();
  const name = body.name;
  if (!name || typeof name !== "string" || !name.trim()) {
    return c.json({ message: "Room name is required" }, 400);
  }

  const roomId = crypto.randomUUID();

  const id = c.env.GAME_ROOM.idFromName(roomId);
  const stub = c.env.GAME_ROOM.get(id);

  const response = await stub.getch("http://game-room/initialzie", {
    method: "POST",
    headers: {
      "Context-Type": "application/json",
    },
    body: {
      roomId: roomId,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    },
  });

  if (!response.ok) {
    return c.json({ message: "Failed to create room" }, 500);
  }
  const room = await response.json();

  return c.json(room, 201);
}

export async function joinRoom(c) {
  const url = new URL(request.url);
  const roomName = url.searchParams.get("room") ?? null;
  if (!roomName) return c.json({ message: "Room name required" }, 400);

  const id = env.GAME_ROOM.idFromName(roomName);
  const stub = env.GAME_ROOM.get(id);

  return stub.fetch(request);
}

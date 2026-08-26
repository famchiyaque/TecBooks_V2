import { createGame } from "../models/games.model.js";

function requiredInteger(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    const error = new Error(`${field} must be a positive integer`);
    error.status = 400;
    throw error;
  }
  return number;
}

export async function createGameController(c) {
  /*
    body: {
      name: string,
      userId: string,
      classId: string,
      startDate: string,
      endDate: string
    }
  */
  let body;
  try {
    body = await c.req.json();
  } catch {
    const error = new Error("Request body must be valid JSON");
    error.status = 400;
    throw error;
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (name.length < 3) {
    const error = new Error("name must be at least 3 characters");
    error.status = 400;
    throw error;
  }

  // TODO: FOR NOW CREATE ALL GAME ON BODY -> GET USER_ID - SET AS CREATED_BY
  const classId = requiredInteger(body.classId, "classId");
  const createdBy = requiredInteger(body.userId, "createdBy");
  const game = await createGame(c.env.DB, {
    classId,
    createdBy,
    name,
    startDate: body.startDate,
    endDate: body.endDate,
  });

  return c.json({ data: game }, 201);
}

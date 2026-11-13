import {
  listTableRowsUseCase,
  replaceTableRowsUseCase,
  deleteTableRowUseCase,
} from '../usecases/row-table.usecase.js';

function parseGameId(context) {
  const gameId = Number(context.req.param('gameId'));
  return Number.isInteger(gameId) && gameId > 0 ? gameId : null;
}

function isValidRow(row) {
  return (
    row &&
    typeof row.rowId === 'string' && row.rowId.length > 0 &&
    typeof row.label === 'string' &&
    typeof row.values === 'object' && row.values !== null &&
    Object.values(row.values).every((value) => value === null || typeof value === 'number')
  );
}

export async function listTableRowsController(context) {
  const gameId = parseGameId(context);
  if (!gameId) {
    return context.json({ error: 'invalid_game_id' }, 400);
  }

  const rows = await listTableRowsUseCase(context.env, {
    gameId,
    userId: context.get('userId'),
  });

  return context.json(rows, 200);
}

export async function replaceTableRowsController(context) {
  const gameId = parseGameId(context);
  const tableKey = context.req.param('tableKey');
  if (!gameId || !tableKey) {
    return context.json({ error: 'invalid_game_id' }, 400);
  }

  let body;
  try {
    body = await context.req.json();
  } catch {
    return context.json({ error: 'invalid_body' }, 400);
  }

  if (!Array.isArray(body?.rows) || !body.rows.every(isValidRow)) {
    return context.json({ error: 'invalid_body' }, 400);
  }

  await replaceTableRowsUseCase(context.env, {
    gameId,
    tableKey,
    rows: body.rows,
    userId: context.get('userId'),
  });

  return context.json({ ok: true }, 200);
}

export async function deleteTableRowController(context) {
  const gameId = parseGameId(context);
  const tableKey = context.req.param('tableKey');
  const rowId = context.req.param('rowId');
  if (!gameId || !tableKey || !rowId) {
    return context.json({ error: 'invalid_game_id' }, 400);
  }

  await deleteTableRowUseCase(context.env, {
    gameId,
    tableKey,
    rowId,
    userId: context.get('userId'),
  });

  return context.json({ ok: true }, 200);
}

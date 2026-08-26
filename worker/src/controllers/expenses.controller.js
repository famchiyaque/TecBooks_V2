export async function getExpensesController(c) {
  // const id = c.req.param("gameId");
  const gameId = 1;
  const example = await getExpensesUseCase(c.env, gameId);
  return c.json(example);
}

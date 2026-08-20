export async function loggerMiddleware(c, next) {
  const start = Date.now();
  await next();
  console.log(`${c.req.method} ${c.req.path} -> ${c.res.status} (${Date.now() - start}ms)`);
}

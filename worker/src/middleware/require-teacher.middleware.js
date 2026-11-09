import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";

export const requireTeacher = createMiddleware(async (c, next) => {
  console.log(`RequireTeacher is disabled: Letting through to: ${c.req.path}`);
  // const token = c.req.header("Authorization")?.replace("Bearer ", "");
  // if (!token) return c.json({ error: "Unauthorized" }, 401);
  // try {
  //   const payload = await verify(token, c.env.JWT_SECRET, "HS256");
  //   c.set("user", payload);
  // } catch {
  //   return c.json({ error: "Unauthorized" }, 401);
  // }
  await next();
});

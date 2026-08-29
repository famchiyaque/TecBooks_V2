import { Hono } from "hono";
import { exampleRoute } from "./example.route";
import { expensesRoute } from "./expenses.route";
import { authRoute } from "./auth.route.js";

const router = new Hono();

router.route("/example", exampleRoute);
router.route("/expenses", expensesRoute);
router.route("/auth", authRoute);

export default router;

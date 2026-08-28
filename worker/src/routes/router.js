import { Hono } from "hono";
import { exampleRoute } from "./example.route";
import { expensesRoute } from "./expenses.route";

const router = new Hono();

router.route("/example", exampleRoute);
router.route("/expenses", expensesRoute);

export default router;

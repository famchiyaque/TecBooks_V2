import Hono from "hono";
import { getPrices } from "../controllers/prices.controller";

const router = Hono();

router.get("/:projectId/:programId", getPrices);

export default router;

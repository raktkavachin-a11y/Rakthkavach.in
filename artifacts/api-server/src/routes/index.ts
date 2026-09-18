import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bloodGridRouter from "./blood-grid";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bloodGridRouter);

export default router;

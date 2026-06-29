import { Router, type IRouter } from "express";
import healthRouter from "./health";
import stationsRouter from "./stations";
import tripsRouter from "./trips";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(stationsRouter);
router.use(tripsRouter);
router.use(authRouter);

export default router;

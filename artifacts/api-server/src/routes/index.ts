import { Router, type IRouter } from "express";
import healthRouter from "./health";
import contactRouter from "./contact";
import reviewsRouter from "./reviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(contactRouter);
router.use(reviewsRouter);

export default router;

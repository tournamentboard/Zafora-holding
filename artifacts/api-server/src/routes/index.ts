import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import projectsRouter from "./projects";
import documentsRouter from "./documents";
import statsRouter from "./stats";
import servicesRouter from "./services";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(projectsRouter);
router.use(documentsRouter);
router.use(statsRouter);
router.use(servicesRouter);

export default router;

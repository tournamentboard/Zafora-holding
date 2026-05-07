import { Router, type IRouter } from "express";
import healthRouter from "./health";
import leadsRouter from "./leads";
import projectsRouter from "./projects";
import documentsRouter from "./documents";
import statsRouter from "./stats";
import servicesRouter from "./services";
import contentRouter from "./content";
import notificationsRouter from "./notifications";
import testimonialsRouter from "./testimonials";
import auditRouter from "./audit";
import adminAuthRouter from "./adminAuth";
import storageRouter from "./storage";

const router: IRouter = Router();

router.use(healthRouter);
router.use(leadsRouter);
router.use(projectsRouter);
router.use(documentsRouter);
router.use(statsRouter);
router.use(servicesRouter);
router.use(contentRouter);
router.use(notificationsRouter);
router.use(testimonialsRouter);
router.use(auditRouter);
router.use(adminAuthRouter);
router.use(storageRouter);

export default router;

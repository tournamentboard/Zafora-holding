import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import leadsRouter from "./leads.js";
import projectsRouter from "./projects.js";
import documentsRouter from "./documents.js";
import statsRouter from "./stats.js";
import servicesRouter from "./services.js";
import contentRouter from "./content.js";
import notificationsRouter from "./notifications.js";
import testimonialsRouter from "./testimonials.js";
import auditRouter from "./audit.js";
import adminAuthRouter from "./adminAuth.js";
import storageRouter from "./storage.js";

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

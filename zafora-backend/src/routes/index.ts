import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import { authRouter } from "@/modules/auth/index.js";
import { leadsRouter } from "@/modules/leads/index.js";
import { projectsRouter } from "@/modules/projects/index.js";
import { documentsRouter } from "@/modules/documents/index.js";
import { statsRouter } from "@/modules/stats/index.js";
import { servicesRouter } from "@/modules/services/index.js";
import { contentRouter } from "@/modules/content/index.js";
import { notificationsRouter } from "@/modules/notifications/index.js";
import { testimonialsRouter } from "@/modules/testimonials/index.js";
import { auditRouter } from "@/modules/audit/index.js";
import { faqsRouter } from "@/modules/faqs/index.js";
import { storageRouter } from "@/modules/storage/index.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(leadsRouter);
router.use(projectsRouter);
router.use(documentsRouter);
router.use(statsRouter);
router.use(servicesRouter);
router.use(contentRouter);
router.use(notificationsRouter);
router.use(testimonialsRouter);
router.use(auditRouter);
router.use(faqsRouter);
router.use(storageRouter);

export default router;

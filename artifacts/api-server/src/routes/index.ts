import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statusRouter from "./status";
import projectsRouter from "./projects";
import certificationsRouter from "./certifications";
import skillsRouter from "./skills";
import competitionsRouter from "./competitions";
import eventsRouter from "./events";
import galleryRouter from "./gallery";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statusRouter);
router.use(projectsRouter);
router.use(certificationsRouter);
router.use(skillsRouter);
router.use(competitionsRouter);
router.use(eventsRouter);
router.use(galleryRouter);
router.use(dashboardRouter);

export default router;

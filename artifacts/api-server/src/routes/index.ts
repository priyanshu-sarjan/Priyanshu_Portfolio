import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import experiencesRouter from "./experiences";
import assetsRouter from "./assets";
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
router.use("/auth", authRouter);
router.use("/experiences", experiencesRouter);
router.use("/assets", assetsRouter);
router.use(statusRouter);
router.use(projectsRouter);
router.use(certificationsRouter);
router.use(skillsRouter);
router.use(competitionsRouter);
router.use(eventsRouter);
router.use(galleryRouter);
router.use(dashboardRouter);

export default router;

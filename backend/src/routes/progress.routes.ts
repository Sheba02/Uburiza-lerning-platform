import { Router } from "express";
import { markComplete, getCourseProgress } from "../controllers/progress.controller";
import { authenticate } from "../middleware/auth";
import { validate, progressSchema } from "../middleware/validate";

const router = Router();

router.post("/progress", authenticate, validate(progressSchema), markComplete);
router.get("/progress/:courseId", authenticate, getCourseProgress);

export default router;

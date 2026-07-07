import { Router } from "express";
import { getLearners, getAnalytics, generateAccessCodes, exportLearners } from "../controllers/admin.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/learners", getLearners);
router.get("/analytics", getAnalytics);
router.post("/access-codes", generateAccessCodes);
router.get("/export/learners", exportLearners);

export default router;

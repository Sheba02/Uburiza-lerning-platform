import { Router } from "express";
import { enroll, getMyCourses } from "../controllers/enrollment.controller";
import { authenticate } from "../middleware/auth";
import { validate, enrollSchema } from "../middleware/validate";

const router = Router();

router.post("/enroll", authenticate, validate(enrollSchema), enroll);
router.get("/my-courses", authenticate, getMyCourses);

export default router;

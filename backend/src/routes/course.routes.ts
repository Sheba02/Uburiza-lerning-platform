import { Router } from "express";
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse } from "../controllers/course.controller";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate, courseSchema } from "../middleware/validate";

const router = Router();

router.get("/courses", getCourses);
router.get("/courses/:id", getCourse);
router.post("/courses", authenticate, requireAdmin, validate(courseSchema), createCourse);
router.put("/courses/:id", authenticate, requireAdmin, validate(courseSchema), updateCourse);
router.delete("/courses/:id", authenticate, requireAdmin, deleteCourse);

export default router;

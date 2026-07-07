import { Router } from "express";
import { register, login, logout, resetPassword } from "../controllers/auth.controller";
import { validate, registerSchema, loginSchema } from "../middleware/validate";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.post("/reset-password", authLimiter, resetPassword);

export default router;

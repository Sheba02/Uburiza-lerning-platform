import { Router } from "express";
import { getUserCertificates, verifyCertificate, generateCertificate } from "../controllers/certificate.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/certificates/:userId", authenticate, getUserCertificates);
router.get("/certificate/:uid", verifyCertificate);
router.post("/certificate/generate", authenticate, generateCertificate);

export default router;

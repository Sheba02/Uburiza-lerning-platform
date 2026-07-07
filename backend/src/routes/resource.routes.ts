import { Router } from "express";
import { getResources, createResource, deleteResource } from "../controllers/resource.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", getResources);
router.post("/", authenticate, requireAdmin, createResource);
router.delete("/:id", authenticate, requireAdmin, deleteResource);

export default router;

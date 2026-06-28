import { Router } from "express";
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication
} from "../controllers/applicationController";

const router = Router();

router.get("/", getApplications);
router.post("/", createApplication);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

export default router;

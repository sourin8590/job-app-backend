import express from "express";
import {
  employeeGetAllApplications,
  jobseekerDeleteApplications,
  jobseekerGetAllApplications,
  postApplication,
} from "../controller/applicationController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router();

router.get("/jobseeker/getall", isAuthorized, jobseekerGetAllApplications);
router.get("/employer/getall", isAuthorized, employeeGetAllApplications);
router.delete("/delete/:id", isAuthorized, jobseekerDeleteApplications);

router.post("/post", isAuthorized, postApplication);

export default router;

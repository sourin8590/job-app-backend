import express from "express";
import {
  deleteJob,
  getAllJobs,
  getMyjobs,
  getSingelJob,
  postJob,
  updateJob,
} from "../controller/jobController.js";
import { isAuthorized } from "../middleware/auth.js";

const router = express.Router();

router.get("/getall", getAllJobs);
router.post("/post", isAuthorized, postJob);
router.get("/getMyjobs", isAuthorized, getMyjobs);
router.put("/update/:id", isAuthorized, updateJob);
router.delete("/delete/:id", isAuthorized, deleteJob);
router.get("/:id", isAuthorized, getSingelJob);

export default router;

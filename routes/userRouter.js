import express from "express";
import {
  register,
  login,
  logout,
  getUser,
} from "../controller/userController.js";
import { isAuthorized } from "../middleware/auth.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthorized, logout);
router.get("/getUser", isAuthorized, getUser);

export default router;

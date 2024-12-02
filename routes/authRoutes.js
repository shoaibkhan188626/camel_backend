import express, { Router } from "express";
import {
  signup,
  login,
  passwordResetRequest,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);

export default router;

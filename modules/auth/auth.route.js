import express from "express";
const router = express.Router();
import {
  controllerRegisterSendOTP,
  controllerForgotPasswordSendOTP,
  controllerForgotPasswordVerifyOTP,
  controllerNewPassword,
  controllerRegister,
  controllerLogin,
  controllerToken,
  controllerUnclock,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { protect } from "../../middleware/auth.middleware.js";

// routes
router.post("/registerSendOTP", asyncHandler(controllerRegisterSendOTP));
router.post("/register", asyncHandler(controllerRegister));
router.post(
  "/forgotPasswordSendOTP",
  asyncHandler(controllerForgotPasswordSendOTP),
);
router.post(
  "/forgotPasswordVerifyOTP",
  asyncHandler(controllerForgotPasswordVerifyOTP),
);
router.patch("/newPassword", asyncHandler(controllerNewPassword))
router.post("/login", asyncHandler(controllerLogin));
router.get("/token", protect, asyncHandler(controllerToken));
router.post("/unlock", protect, asyncHandler(controllerUnclock));

export default router;

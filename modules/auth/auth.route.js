import express from "express";
const router = express.Router();
import {
  controllerRegisterSendOTP,
  controllerForgotPasswordSendOTP,
  controllerForgotPasswordVerifyOTP,
  controllerForgotMasterPasswordSendOTP,
  controllerForgotMasterPasswordVerifyOTP,
  controllerNewPassword,
  controllerNewMasterPassword,
  controllerRegister,
  controllerLogin,
  controllerToken,
  controllerUnclock,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { protect } from "../../middleware/auth.middleware.js";

// routes

// send otp when register
router.post("/registerSendOTP", asyncHandler(controllerRegisterSendOTP));
// register
router.post("/register", asyncHandler(controllerRegister));

// sendOTP when password forgot
router.post(
  "/forgotPasswordSendOTP",
  asyncHandler(controllerForgotPasswordSendOTP),
);
// verify otp when password forgot
router.post(
  "/forgotPasswordVerifyOTP",
  asyncHandler(controllerForgotPasswordVerifyOTP),
);
// set new password
router.patch("/newPassword", asyncHandler(controllerNewPassword));

// send otp when master password forgot
router.post(
  "/forgotMasterPasswordSendOTP",
  protect,
  asyncHandler(controllerForgotMasterPasswordSendOTP),
);
// verify otp when mastaer pasword forgot
router.post(
  "/forgotMasterPasswordVerifyOTP",
  asyncHandler(controllerForgotMasterPasswordVerifyOTP),
);
// set new master password
router.patch("/newMasterPassword", asyncHandler(controllerNewMasterPassword))

// login
router.post("/login", asyncHandler(controllerLogin));

// verify token
router.get("/token", protect, asyncHandler(controllerToken));

// unlock with master password
router.post("/unlock", protect, asyncHandler(controllerUnclock));

export default router;

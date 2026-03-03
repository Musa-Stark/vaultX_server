import express from "express";
const router = express.Router();
import {
  controllerSendOTP,
  controllerRegister,
  controllerLogin,
  controllerToken,
  controllerUnclock,
} from "./auth.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { protect } from "../../middleware/auth.middleware.js";

router.post("/sendOTP", asyncHandler(controllerSendOTP))
router.post("/register", asyncHandler(controllerRegister));
router.post("/login", asyncHandler(controllerLogin));
router.get("/token", protect, asyncHandler(controllerToken));
router.post("/unlock", protect, asyncHandler(controllerUnclock));

export default router;

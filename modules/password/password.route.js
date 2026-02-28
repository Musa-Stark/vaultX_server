import express from "express";
const router = express.Router();
import { protect } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/index.js";
import {
  newPassword,
  getAllPasswords,
  updatePassword,
  deletePassword,
} from "./password.controller.js";

router.get("/", protect, asyncHandler(getAllPasswords));
router.post("/", protect, asyncHandler(newPassword));
router.patch("/", protect, asyncHandler(updatePassword));
router.delete("/", protect, asyncHandler(deletePassword));

export default router;

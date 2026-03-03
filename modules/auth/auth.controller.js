import { successResponse, AppError } from "../../utils/index.js";
import { registerValidation } from "./auth.register.validation.js";
import { loginValidation } from "./auth.login.validation.js";
import {
  serviceRegisterSendOTP,
  serviceForgotPasswordSendOTP,
  serviceForgotPasswordVerifyOTP,
  serviceNewPassword,
  serviceRegister,
  serviceLogin,
  serviceUnlock,
} from "./auth.service.js";

// sending OTP while registering
export const controllerRegisterSendOTP = async (req, res) => {
  const userData = await req.body;

  const error = registerValidation(userData);
  if (error) throw new AppError(error, 409);

  await serviceRegisterSendOTP(userData);

  successResponse(res, { message: "OTP sent" }, 200);
};

// registration
export const controllerRegister = async (req, res) => {
  const userData = await req.body;

  const newUser = await serviceRegister(userData);

  successResponse(res, newUser, 201);
};

// sending OTP when password forgot
export const controllerForgotPasswordSendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) throw new AppError("Email is required", 409);

  await serviceForgotPasswordSendOTP(email);

  successResponse(res, { message: "OTP sent" }, 200);
};

// verfication OTP when password forgot
export const controllerForgotPasswordVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) throw new AppError("Email and OTP are required", 409);

  await serviceForgotPasswordVerifyOTP(email, otp);

  successResponse(res, { message: "OTP verified" }, 200);
};

// updating, new password when forgot password
export const controllerNewPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword)
    throw new AppError("Email and new password are required", 409);

  await serviceNewPassword(email, newPassword);

  successResponse(res, { message: "Password updated" }, 200);
};

// login
export const controllerLogin = async (req, res) => {
  const userData = await req.body;

  const error = loginValidation(userData);
  if (error) throw new AppError(error, 409);

  const token = await serviceLogin(userData);
  const data = { token };

  successResponse(res, data, 200);
};

// jwt token verification
export const controllerToken = async (req, res) => {
  const user = req.user;
  successResponse(res, user, 200);
};

// vault unlock
export const controllerUnclock = async (req, res) => {
  const id = req.user._id.toString();
  const userData = req.body;

  const user = await serviceUnlock(id, userData);

  successResponse(res, user, 200);
};

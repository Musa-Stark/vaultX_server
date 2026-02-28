import { successResponse, AppError } from "../../utils/index.js";
import { registerValidation } from "./auth.register.validation.js";
import { loginValidation } from "./auth.login.validation.js";
import {
  serviceRegister,
  serviceLogin,
  serviceUnlock,
} from "./auth.service.js";

export const controllerRegister = async (req, res) => {
  const userData = await req.body;

  const error = registerValidation(userData);
  if (error) throw new AppError(error, 409);

  const newUser = await serviceRegister(userData);

  successResponse(res, newUser, 201);
};

export const controllerLogin = async (req, res) => {
  const userData = await req.body;

  const error = loginValidation(userData);
  if (error) throw new AppError(error, 409);

  const token = await serviceLogin(userData);
  const data = { token };

  successResponse(res, data, 200);
};

export const controllerToken = async (req, res) => {
  const user = req.user;
  successResponse(res, user, 200);
};

export const controllerUnclock = async (req, res) => {
  const id = req.user._id.toString();
  const userData = req.body;

  const user = await serviceUnlock(id, userData);

  successResponse(res, user, 200);
};

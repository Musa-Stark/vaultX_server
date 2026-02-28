import { AppError, successResponse } from "../../utils/index.js";
import { passwordValidation } from "./password.validation.js";
import {
  newPasswordService,
  getAllPasswordsService,
  updatePasswordService,
  deletePasswordService,
} from "./password.service.js";

export const getAllPasswords = async (req, res) => {
  const userId = req.user._id;

  const passwords = await getAllPasswordsService(userId);

  successResponse(res, passwords, 200);
};

export const newPassword = async (req, res) => {
  let data = await req.body;
  const owner = req.user._id.toString();

  const error = passwordValidation(data);
  if (error) throw new AppError(error, 409);

  const newPw = await newPasswordService(owner, data);
  successResponse(res, newPw, 201);
};

export const updatePassword = async (req, res) => {
  const data = await req.body;
  const owner = req.user._id.toString();

  const error = passwordValidation(data);
  if (error) throw new AppError(error, 409);

  const updatedPw = await updatePasswordService(owner, data);
  successResponse(res, updatedPw, 200);
};

export const deletePassword = async (req, res) => {
  const data = await req.body;
  const owner = req.user._id.toString();

  const deletedPw = await deletePasswordService(owner, data);
  successResponse(res, deletedPw, 200);
};

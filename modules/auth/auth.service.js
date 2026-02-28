import { connectDB, config } from "../../config/index.js";
import { AppError, hash, verify } from "../../utils/index.js";
import { User } from "../user/user.model.js";
import jwt from "jsonwebtoken";

export const serviceRegister = async (userData) => {
  await connectDB();

  let { name, email, password, masterPassword } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new AppError("User with this email already exists", 409);

  password = await hash(password);
  masterPassword = await hash(masterPassword);

  const user = await User.create({ name, email, password, masterPassword });

  const paylaod = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
  const secret = config.JWT_ACCESS_SECRET;
  const exp = config.JWT_ACCESS_TTL;
  const token = jwt.sign(paylaod, secret, { expiresIn: exp });

  return { user, token };
};

export const serviceLogin = async (userData) => {
  await connectDB();

  let { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new AppError("User with this email not found!!", 409);

  const isValid = await verify(password, user.password);
  if (!isValid) throw new AppError("Invalid password", 409);

  const paylaod = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
  const secret = config.JWT_ACCESS_SECRET;
  const exp = config.JWT_ACCESS_TTL;
  const token = jwt.sign(paylaod, secret, { expiresIn: exp });

  return token;
};

export const serviceUnlock = async (id, data) => {
  const { masterPassword } = data;

  const user = await User.findById(id).select("+masterPassword");
  if (!user) throw new AppError("User not found, invalid token", 409);

  const isValid = await verify(masterPassword, user.masterPassword);
  if (!isValid) throw new AppError("Invalid master password", 409);

  return user;
};

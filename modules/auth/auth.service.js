import { connectDB, config } from "../../config/index.js";
import { AppError, hash, verify, sendOTP } from "../../utils/index.js";
import { User } from "../user/user.model.js";
import { TempUser } from "../user/tempUser.model.js";
import jwt from "jsonwebtoken";

// sending OTP while registering
export const serviceRegisterSendOTP = async (userData) => {
  await connectDB();

  let { name, email, password, masterPassword } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new AppError("User with this email already exists", 409);

  const otp = await sendOTP(email);
  if (otp.error)
    throw new Error(
      "You are not allowed to use this application",
      otp.statusCode,
    );

  const otpHash = await hash(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  password = await hash(password);
  masterPassword = await hash(masterPassword);

  await TempUser.deleteOne({ email });

  await TempUser.create({
    name,
    email,
    password,
    masterPassword,
    otpHash,
    expiresAt,
  });
};

// registration
export const serviceRegister = async (userData) => {
  await connectDB();

  let { email, otp } = userData;

  const { name, password, masterPassword, otpHash, expiresAt, attempts } =
    await TempUser.findOne({ email });

  if (expiresAt < Date.now())
    throw new AppError("OTP verification timed out!", 408);

  const verifyOTP = await verify(otp, otpHash);
  if (!verifyOTP) throw new AppError("Invalid OTP. Please try again", 409);

  const user = await User.create({ name, email, password, masterPassword });
  await TempUser.deleteOne({ email });

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

// sending OTP when password forgot
export const serviceForgotPasswordSendOTP = async (email) => {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new AppError("User with this email not found", 409);

  const otp = await sendOTP(email);
  if (otp.error)
    throw new Error(
      "You are not allowed to use this application",
      otp.statusCode,
    );

  const otpHash = await hash(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await TempUser.deleteOne({ email });

  await TempUser.create({
    email,
    otpHash,
    expiresAt,
  });
};

// verfication OTP when password forgot
export const serviceForgotPasswordVerifyOTP = async (email, otp) => {
  await connectDB();

  const { otpHash, expiresAt, attempts } = await TempUser.findOne({ email });

  if (expiresAt < Date.now())
    throw new AppError("OTP verification timed out!", 408);

  const verifyOTP = await verify(otp, otpHash);
  if (!verifyOTP) throw new AppError("Invalid OTP. Please try again", 409);
};

// updating, new password when forgot password
export const serviceNewPassword = async (email, newPassword) => {
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) throw new AppError("User with this email not found", 409);

  newPassword = await hash(newPassword);

  await User.updateOne({ email: email }, { $set: { password: newPassword } });
};

// login
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

// vault unlock
export const serviceUnlock = async (id, data) => {
  await connectDB();

  const { masterPassword } = data;

  const user = await User.findById(id).select("+masterPassword");
  if (!user) throw new AppError("User not found, invalid token", 409);

  const isValid = await verify(masterPassword, user.masterPassword);
  if (!isValid) throw new AppError("Invalid master password", 409);

  return user;
};

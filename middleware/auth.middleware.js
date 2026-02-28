import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { User } from "../modules/user/user.model.js";
import { AppError } from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Not authorized", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

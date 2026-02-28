import dotenv from "dotenv";

dotenv.config();

export const envs = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_TTL: process.env.JWT_ACCESS_TTL,
  PORT: process.env.PORT,
  ENV: process.env.ENV,
  MASTER_KEY: process.env.MASTER_KEY,
};

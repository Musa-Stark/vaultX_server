import express from "express";
export const app = express();
// Trust Vercel's single edge proxy (most common & safe value for Vercel)
app.set('trust proxy', 1);
import cors from "cors";
import { successResponse } from "./utils/successResponse.js";
import authRouter from "./modules/auth/auth.route.js";
import passwordRouter from "./modules/password/password.route.js";
import { errorHandler } from "./middleware/errorHandler.js";
import helmet from "helmet";
import { apiLimiter } from "./utils/limiter.js";

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api/v1", apiLimiter);

app.get("/api/v1/health", (req, res) => {
  successResponse(res, "All clear!");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/password", passwordRouter);

app.use(errorHandler);

// ←←← ADD THIS LINE AT THE VERY BOTTOM
export default app;
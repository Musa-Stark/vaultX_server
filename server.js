import { app } from "./app.js";
import { config, connectDB } from "./config/index.js";

// Lazy DB connection (perfect for Vercel serverless cold starts)
// Mongoose safely ignores repeated connect() calls
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
  next();
});

// Local development only (never runs on Vercel)
if (process.env.NODE_ENV !== "production") {
  const start = async () => {
    await connectDB();
    app.listen(config.PORT, () => {
      console.log(`Server is listening at http://localhost:${config.PORT}`);
    });
  };
  start();
}

// Required for Vercel (this is what makes it work as a serverless function)
export default app;
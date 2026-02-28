import rateLimit from "express-rate-limit";

// 15 minutes window, max 30 requests per IP
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100,                  // limit each IP to 30 requests per window
  standardHeaders: true,    // RateLimit-* headers
  legacyHeaders: false,     // disable X-RateLimit-* headers
  handler: (req, res) => {
    // Calculate seconds until the window resets
    const retryAfter = Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000 / 60);

    // Set Retry-After header for clients
    res.setHeader("Retry-After", retryAfter);

    // Send JSON response
    res.status(429).json({
      status: "fail",
      message: `Requests limit reached. Retry after ${retryAfter} minutes.`,
    });
  },
});
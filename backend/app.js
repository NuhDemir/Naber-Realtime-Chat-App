import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes dynamically so we can catch and log initialization errors
let authRoutes;
let messageRoutes;
import logger from "./src/log/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

// Sanitize and validate CLIENT_URL so we don't accidentally pass a full URL
// into places that expect a route path (this prevents path-to-regexp errors).
const rawClientUrl = process.env.CLIENT_URL || "https://naber-chat.netlify.app";
const CLIENT_URL =
  typeof rawClientUrl === "string"
    ? rawClientUrl.trim().replace(/\/$/, "")
    : rawClientUrl;
if (typeof CLIENT_URL === "string" && !CLIENT_URL.startsWith("http")) {
  console.warn("Warning: CLIENT_URL does not look like a URL:", CLIENT_URL);
}

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Dynamically import and register routes inside an async IIFE so we can
// log which module throws if path-to-regexp (or similar) errors occur during
// route registration.
(async () => {
  try {
    // extra console logs to make Render logs clearer when route import fails
    console.log("[app] Starting dynamic route imports...");
    const authMod = await import("./src/routes/auth.routes.js");
    authRoutes = authMod.default;
    console.log("[app] auth.routes imported");
    app.use("/api/auth", authRoutes);

    const msgMod = await import("./src/routes/message.routes.js");
    messageRoutes = msgMod.default;
    console.log("[app] message.routes imported");
    app.use("/api/message", messageRoutes);
  } catch (err) {
    // log both to winston and console so Render shows it in build logs
    console.error("[app] Route registration failed:", err.message);
    console.error(err.stack);
    logger.error("Route registration failed:", {
      message: err.message,
      stack: err.stack,
    });
    // Re-throw so the process exits and Render logs the failure (we want that).
    throw err;
  }
})();

// 🌐 Frontend statik dosyaları serve et
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  logger.error("💥 Global Error Handler:", {
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;

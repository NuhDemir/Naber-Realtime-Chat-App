import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
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

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

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

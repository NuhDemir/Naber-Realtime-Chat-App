import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

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

// Import routes synchronously (using top-level await would require module changes)
// Instead we'll import routes the traditional way to avoid race conditions
console.log("[app] Importing auth routes...");
import authRoutes from "./src/routes/auth.routes.js";
console.log("[app] auth.routes imported");
app.use("/api/auth", authRoutes);

console.log("[app] Importing message routes...");
import messageRoutes from "./src/routes/message.routes.js";
console.log("[app] message.routes imported");
app.use("/api/message", messageRoutes);

// 🌐 Frontend statik dosyaları serve et (sadece monorepo local deploy için)
// Render/production'da frontend Netlify'de ayrı host edilir
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.resolve(__dirname, "../frontend/dist");
  
  // Check if frontend dist exists (for monorepo deploys, not needed for Render)
  if (existsSync(frontendPath)) {
    console.log("[app] Serving frontend static files from:", frontendPath);
    app.use(express.static(frontendPath));

    // Express 5.x: Use middleware for SPA fallback instead of app.get("*")
    // This catches all non-API routes and serves index.html for client-side routing
    app.use((req, res, next) => {
      // Only serve index.html for non-API routes
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(frontendPath, "index.html"));
      } else {
        next();
      }
    });
  } else {
    console.log("[app] Frontend dist not found - assuming separate frontend deployment (Netlify)");
  }
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

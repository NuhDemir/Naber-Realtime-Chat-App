import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Rotaları
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Production ortamında statik dosya sun
if (process.env.NODE_ENV?.trim() === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(staticPath));

  app.get("/*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      // Sunucu başlatıldı
    });
  } catch (err) {
    process.exit(1);
  }
};

startServer();

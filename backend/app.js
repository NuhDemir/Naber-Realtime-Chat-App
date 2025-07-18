import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app as socketApp, server } from "./src/lib/socket.js";
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

socketApp.use(cors(corsOptions));
socketApp.use(express.json({ limit: "5mb" }));
socketApp.use(express.urlencoded({ extended: true }));
socketApp.use(cookieParser());

// API Rotaları
socketApp.use("/api/auth", authRoutes);
socketApp.use("/api/message", messageRoutes);

// Statik dosyalar (Production)
if (process.env.NODE_ENV?.trim() === "production") {
  const staticPath = path.join(__dirname, "../frontend/dist");
  socketApp.use(express.static(staticPath));

  socketApp.get("/*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Sunucuyu Başlat
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`✅ Server ${PORT} portunda çalışıyor...`);
    });
  } catch (err) {
    console.error("Sunucu başlatılamadı:", err);
    process.exit(1);
  }
};

startServer();

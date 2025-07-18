import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.route.js";

// Env değişkenlerini yükle
dotenv.config();
console.log("✅ .env dosyası yüklendi.");

// Port belirleme
const PORT = process.env.PORT || 5001;
console.log(`✅ PORT ayarlandı: ${PORT}`);

// __dirname elde et
const __dirname = path.resolve();
console.log(`✅ __dirname: ${__dirname}`);

// CORS ayarları
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};
console.log("✅ CORS seçenekleri tanımlandı:", corsOptions);

// Middleware'ler
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
console.log("✅ Middleware'ler eklendi.");

// API Rotaları
app.use("/api/auth", authRoutes);
console.log("✅ /api/auth route'u yüklendi.");
app.use("/api/message", messageRoutes);
console.log("✅ /api/message route'u yüklendi.");

// ✅ Production Statik Dosya Sunumu
if (process.env.NODE_ENV === "production") {
  console.log("✅ Production ortamı algılandı.");
  const staticPath = path.join(__dirname, "../frontend/dist");
  console.log(`✅ Statik dosya yolu: ${staticPath}`);
  app.use(express.static(staticPath));

  app.get("/*", (req, res) => {
    console.log(`📩 İstek alındı: ${req.originalUrl}`);
    res.sendFile(path.join(staticPath, "index.html"));
  });
} else {
  console.log("🧪 Production ortamı değil. Statik dosya sunulmayacak.");
}

// Sunucu başlat
const startServer = async () => {
  try {
    console.log("🔌 Veritabanına bağlanılıyor...");
    await connectDB();
    console.log("✅ MongoDB bağlantısı başarılı.");

    server.listen(PORT, () => {
      console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Veritabanı bağlantısı başarısız:", err);
    process.exit(1);
  }
};

startServer();

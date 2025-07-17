import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Socket.IO ve HTTP sunucusu için gerekli importlar
// ÖNEMLİ: socket.js dosyanızın yolu './src/lib/socket.js' ise bu satırı değiştirmeyin.
import { app, server } from "./src/lib/socket.js"; 

// Veritabanı ve Rota importları
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import messageRoutes from "./src/routes/message.route.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// CORS yapılandırması
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

// Middleware'ler
app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" })); // Büyük resimler için limit
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Rotaları
// Bu rotaların doğru olduğundan emin olun, yoksa 404 hatası alırsınız.
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes); // 'message' (tekil) olduğundan emin olun

// --- PRODUCTION İÇİN STATİK DOSYA SUNUMU ---
if (process.env.NODE_ENV === "production") {
  // Frontend'in build klasörünü statik olarak sun
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // API rotaları dışındaki tüm GET isteklerini index.html'e yönlendir
  // Bu, React Router'ın client tarafında çalışmasını sağlar.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Sunucuyu başlatma fonksiyonu
const startServer = async () => {
  try {
    await connectDB();
    
    // ÖNEMLİ: app.listen() yerine server.listen() kullanılır.
    // Bu, hem Express API'sini hem de Socket.IO'yu aynı portta dinler.
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed, server did not start.", err);
    process.exit(1);
  }
};

startServer();
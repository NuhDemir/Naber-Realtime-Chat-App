import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL?.trim() || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Kullanıcı ID ile socket ID eşleşmesi: { userId: socketId }
const userSocketMap = {};

// Diğer dosyaların socket id’ye ulaşabilmesi için export
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Bağlantı olayı
io.on("connection", (socket) => {
  console.log("🟢 Bağlantı kuruldu:", socket.id);

  const userId = socket.handshake.query?.userId;

  // userId kontrolü (boş, null, undefined veya "undefined" olamaz)
  if (userId && typeof userId === "string" && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`🧾 Kullanıcı kaydedildi: ${userId} -> ${socket.id}`);
  } else {
    console.warn("⚠️ Geçersiz userId:", userId);
  }

  // Herkese online kullanıcı listesini gönder
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Bağlantı kesilince kullanıcıyı haritadan çıkar
  socket.on("disconnect", () => {
    console.log("🔴 Bağlantı koptu:", socket.id);

    // Bu socket.id’ye sahip userId’yi bul ve sil
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        console.log(`🗑️ Kullanıcı kaldırıldı: ${uid}`);
        break;
      }
    }

    // Güncel online kullanıcı listesi
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };

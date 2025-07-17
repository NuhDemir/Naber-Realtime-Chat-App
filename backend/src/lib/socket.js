import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    // BEST PRACTICE: Daha esnek bir CORS yapılandırması
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Online kullanıcıları saklamak için
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  const userId = socket.handshake.query.userId;
  
  // ROBUSTNESS CHECK: 'undefined' string'i gelme ihtimaline karşı kontrol
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() tüm bağlı istemcilere olay gönderir
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() belirli bir istemciden gelen olayları dinler
  socket.on("disconnect", () => {
    console.log("Kullanıcının bağlantısı kesildi:", socket.id);
    
    // CRITICAL BUG FIX: Doğru kullanıcıyı haritadan silmek için
    // Haritayı dolaşıp bağlantısı kesilen socket.id'ye sahip kullanıcıyı bul ve sil
    let disconnectedUserId;
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        disconnectedUserId = uid;
        delete userSocketMap[uid];
        break; // Kullanıcıyı bulduk, döngüden çık
      }
    }
    
    // Güncellenmiş online kullanıcı listesini herkese gönder
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
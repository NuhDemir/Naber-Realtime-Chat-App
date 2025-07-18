import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// .env dosyasının yolunu BELİRTMEYİ en başa alın
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ----- KONTROL İÇİN GEÇİCİ LOGLAMA -----
// Bu satırı ekleyerek değişkenin yüklenip yüklenmediğini anında görün
console.log("MONGO_URI Değeri:", process.env.MONGO_URI);
// -----------------------------------------

import { server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import logger from "./src/log/logger.js";
// `app` importu bu dosyada gerekiyorsa kalsın, normalde socket.js içinden gelir.

const PORT = process.env.PORT || 5000; // PORT bulunamazsa diye bir yedek değer atayın

process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection:", { reason });
});

server.listen(PORT, () => {
  logger.info("Server is running on PORT: " + PORT);
  connectDB();
});
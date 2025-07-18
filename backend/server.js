import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import logger from "./src/log/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌱 .env dosyasını yükle
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5001;

process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection:", { reason });
});

server.listen(PORT, () => {
  logger.info("🚀 Server is running on PORT: " + PORT);
  connectDB();
});

import dotenv from "dotenv";
import { server } from "./src/lib/socket.js";
import { connectDB } from "./src/lib/db.js";
import logger from "./src/log/logger.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception:", { message: err.message, stack: err.stack });
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.error("❌ Unhandled Rejection:", { reason });
});

server.listen(PORT, () => {
  logger.info("Server is running on PORT:" + PORT);
  connectDB();
});
// logger.js
import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

const logDirectory = path.join("logs");

const transport = new DailyRotateFile({
  filename: path.join(logDirectory, "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    transport,
  ],
});

export default logger;
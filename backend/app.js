import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/lib/db.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// İstek gövdelerini JSON olarak ayrıştırmak için (gerekliyse)
app.use(express.json());

// Auth router
app.use("/api/auth", authRoutes);


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB bağlantısı başarısız, sunucu başlatılmadı.", err);
  });

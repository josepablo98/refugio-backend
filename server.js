// ...existing code...
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import memoriesRoutes from "./routes/routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use("/api/memories", memoriesRoutes);

app.get("/", (req, res) => {
  res.send("Servidor del Refugio funcionando 💖");
});

// exporta la app para usar en serverless
export default app;
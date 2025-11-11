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
// Attempt to connect but don't let an unhandled rejection crash the process in serverless.
connectDB().catch((err) => {
  console.error('Database connection failed at startup:', err && err.message ? err.message : err);
  // Do not call process.exit; let the function start and handle DB errors per-request.
});

// Rutas
app.use("/api/memories", memoriesRoutes);

app.get("/", (req, res) => {
  res.send("Servidor del Refugio funcionando 💖");
});

// exporta la app para usar en serverless
export default app;
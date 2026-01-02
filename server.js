// ...existing code...
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import memoriesRoutes from "./routes/memories.js";
import challengesRoutes from "./routes/challenges.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.use("/api/memories", memoriesRoutes);
app.use("/api/challenges", challengesRoutes);

const PORT = 8080;
// app.get("/", (req, res) => {
//   res.send("Servidor del Refugio funcionando 💖");
// });

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
})

// exporta la app para usar en serverless
export default app;
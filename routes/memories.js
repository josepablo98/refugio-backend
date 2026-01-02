import express from "express";
import {
  getMemories,
  addMemory,
  updateMemory,
  deleteMemory,
} from "../controllers/memories.js";

const router = express.Router();

// Obtener todos los recuerdos
router.get("/", getMemories);

// Añadir un recuerdo
router.post("/", addMemory);

// Actualizar un recuerdo por ID
router.put("/:id", updateMemory);

// Eliminar un recuerdo por ID
router.delete("/:id", deleteMemory);

export default router;

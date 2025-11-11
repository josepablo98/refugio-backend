import Memory from "../models/memory.js";

// 📄 Obtener todos los recuerdos
export const getMemories = async (req, res) => {
  try {
    const memories = await Memory.find().sort({ letter: 1 });
    if (memories.length === 0) {
      return res.status(404).json({ ok: false, message: "No hay recuerdos disponibles" });
    }
    res.status(200).json({ ok: true, memories });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error al obtener los recuerdos", error });
  }
};

// ➕ Añadir un recuerdo
export const addMemory = async (req, res) => {
  try {
    const { letter, name, description, password } = req.body;

    if (!letter || !name || !description || !password) {
      return res.status(400).json({ ok: false, message: "Todos los campos son obligatorios" });
    }

    // si en el body no vienen exactamente 4 campos, devolver error
    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length !== 4) {
      return res.status(400).json({ ok: false, message: "Campos inválidos en la solicitud" });
    }

    if (letter.length !== 1 || !/[A-Z]/.test(letter.toUpperCase())) {
      return res.status(400).json({ ok: false, message: "La letra debe ser un solo carácter alfabético" });
    }

    if (name.trim().startsWith(letter.toUpperCase()) === false) {
      return res.status(400).json({ ok: false, message: `El nombre debe comenzar con la letra '${letter.toUpperCase()}'` });
    }

    // Protección simple por contraseña hardcodeada
    if (password !== process.env.PASSWORD_EDITAR) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    const newMemory = new Memory({ letter, name, description });
    await newMemory.save();

    res.status(201).json({ ok: true, message: "Recuerdo añadido correctamente", newMemory });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error al añadir el recuerdo", error });
  }
};

// ✏️ Actualizar un recuerdo
export const updateMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const { letter, name, description, password } = req.body;

    if (password !== process.env.PASSWORD_EDITAR) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    const bodyKeys = Object.keys(req.body);
    if (bodyKeys.length !== 4) {
      return res.status(400).json({ ok: false, message: "Campos inválidos en la solicitud" });
    }

    if (letter.length !== 1 || !/[A-Z]/.test(letter.toUpperCase())) {
      return res.status(400).json({ ok: false, message: "La letra debe ser un solo carácter alfabético" });
    }

    if (name.trim().startsWith(letter.toUpperCase()) === false) {
      return res.status(400).json({ ok: false, message: `El nombre debe comenzar con la letra '${letter.toUpperCase()}'` });
    }

    const updatedMemory = await Memory.findByIdAndUpdate(
      id,
      { letter, name, description },
      { new: true }
    );

    if (!updatedMemory) {
      return res.status(404).json({ ok: false, message: "Recuerdo no encontrado" });
    }

    res.status(201).json({ ok: true, message: "Recuerdo actualizado correctamente", updatedMemory });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error al actualizar el recuerdo", error });
  }
};

// ❌ Eliminar un recuerdo
export const deleteMemory = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (password !== process.env.PASSWORD_EDITAR) {
      return res.status(401).json({ ok: false, message: "Contraseña incorrecta" });
    }

    const deletedMemory = await Memory.findByIdAndDelete(id);

    if (!deletedMemory) {
      return res.status(404).json({ ok: false, message: "Recuerdo no encontrado" });
    }

    res.status(200).json({ ok: true, message: "Recuerdo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error al eliminar el recuerdo", error });
  }
};

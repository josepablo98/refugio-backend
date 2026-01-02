import bcrypt from "bcryptjs";
import Challenge from "../models/challenge.js";

// Obtener retos (con recompensas si están completados)
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .select("+reward")
      .sort({ createdAt: -1 });

    const sanitizedChallenges = challenges.map((challenge) => {
      const obj = challenge.toObject();

      if (obj.status !== "completed") {
        obj.reward = undefined;
      }

      return obj;
    });

    res.status(200).json({
      ok: true,
      challenges: sanitizedChallenges,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener los retos",
    });
  }
};


// Crear un nuevo reto (desde admin)
export const createChallenge = async (req, res) => {
  try {
    const { title, description, reward, unlockCode } = req.body;

    if (!title || !description || !reward || !unlockCode) {
      return res
        .status(400)
        .json({ ok: false, message: "Faltan campos requeridos" });
    }

    const hash = await bcrypt.hash(unlockCode, 10);

    const challenge = new Challenge({
      title,
      description,
      reward,
      unlockCodeHash: hash,
    });

    await challenge.save();

    res.status(201).json({ ok: true, message: "Reto creado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, message: "Error al crear el reto" });
  }
};

// Desbloquear un reto con codigo
export const unlockChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const { unlockCode } = req.body;

        if (!unlockCode) {
            return res.status(400).json({ ok: false, message: "Código requerido" });
        }

        const challenge = await Challenge.findById(id).select(
            "+unlockCodeHash +reward"
        );

        if (!challenge) {
            return res.status(404).json({ ok: false, message: "Reto no encontrado" });
        }

        if (challenge.status === "completed") {
            return res.status(400).json({ ok: false, message: "Reto ya completado" });
        }

        const valid = await bcrypt.compare(
            unlockCode,
            challenge.unlockCodeHash
        )

        if (!valid) {
            return res.status(401).json({ ok: false, message: "Código incorrecto" });
        }

        challenge.status = "completed";
        await challenge.save();

        res.status(200).json({
            ok: true,
            message: "Reto desbloqueado correctamente",
            reward: challenge.reward,
        });
    } catch (error) {
        res.status(500).json({ ok: false, message: "Error al desbloquear el reto" })
    }
}


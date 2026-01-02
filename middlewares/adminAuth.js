export const adminAuth = (req, res, next) => {
  const adminPassword = req.headers["x-admin-password"];

  if (!adminPassword) {
    return res.status(401).json({ ok: false, message: "Acceso restringido" });
  }

  if (adminPassword !== process.env.ADMIN_PASSWORD) {
    return res
      .status(401)
      .json({ ok: false, message: "Contraseña incorrecta" });
  }

  next();
};

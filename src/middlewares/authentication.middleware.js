import jwt from "jsonwebtoken";
import { getIdByName } from "../models/auth.models.js";

export async function authentication(req, res, next) {
  const token = req.cookies.token;

  try {
    const { name } = jwt.verify(token, process.env.PRIVATE_KEY);
    const { id } = await getIdByName(name);
    req.user = { id, name };
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido ou expirado" });
  }
}

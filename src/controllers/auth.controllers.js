import { getUserPassword, registerUser, updateUserPassword, userExists } from "../models/auth.models.js";
import { userSchema } from "../schemas/user.schema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function authRegister(req, res) {
  const { value, error } = userSchema.validate(req.body);
  const { name, password } = value;

  if (error) return res.status(400).json(error.details[0]);

  try {
    const { exists } = await userExists(name);
    if (exists) return res.status(400).json({ error: "userAlreadyExists", message: "Este nome já foi usado." });

    const codedPassword = await bcrypt.hash(password, 8);

    await registerUser({ name, password: codedPassword });

    res.status(200).json({ message: "Usuário registrado com sucesso.", data: { name, codedPassword } });
  } catch (err) {
    throw err;
  }
}

export async function authLogin(req, res) {
  const { name, password: plainPassword } = req.body;
  const DESIRED_COST = 8;

  if (!name && !plainPassword)
    return res
      .status(400)
      .send({ error: "insufficientInformations", message: "Informações insuficientes, nome e senha são necessários." });

  const { password: decodedPassword } = await getUserPassword(name);
  if (!decodedPassword) return res.status(400).json({ error: "userDoesntExists", message: "Usuário não existe." });
  const correct = await bcrypt.compare(plainPassword, decodedPassword);

  const currentCost = parseInt(decodedPassword.split("$")[2]);
  if (currentCost > DESIRED_COST) {
    console.log(`🔄 Atualizando senha de ${name} para cost ${DESIRED_COST}...`);
    const newHash = await bcrypt.hash(plainPassword, DESIRED_COST);
    await updateUserPassword(name, newHash);
  }

  if (!correct) return res.status(400).json({ error: "incorrectPassword", message: "Senha incorreta." });

  const payload = {
    name,
  };

  const token = jwt.sign(payload, process.env.PRIVATE_KEY, { expiresIn: "1hr" });

  res.cookie("token", token, {
    httpOnly: true, // protege contra XSS
    secure: true, // porque no Render é HTTPS, tem que ser seguro
    sameSite: "none", // para aceitar cross-site cookies
    maxAge: 60 * 60 * 1000, // 1 hora
  });

  return res.status(200).json({ message: "Logado com sucesso.", token });
}

export async function authLogOut(req, res) {
  if (!req.cookies.token) return res.status(403).json({ message: "Você não está logado" });
  try {
    res.clearCookie("token", {
      httpOnly: true, // protege contra XSS
      secure: true, // porque no Render é HTTPS, tem que ser seguro
      sameSite: "none", // para aceitar cross-site cookies
    });
    res.status(200).json({ message: "Logout feito com sucesso" });
  } catch (err) {
    throw err;
  }
}

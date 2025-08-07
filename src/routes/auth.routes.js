import express from "express";
import { authRegister, authLogin, authLogOut } from "../controllers/auth.controllers.js";
import { authentication } from "../middlewares/authentication.middleware.js";

const router = express.Router();

router.route("/register").post(authRegister);
router.route("/login").post(authLogin);
router.route("/logout").get(authentication, authLogOut);
router.route("/me").get(authentication, async (req, res) => {
  res.status(200).json({ message: "Você está logado", user: req.user, isLogged: true });
});

export default router;

import express from "express";
import {
  addRegistro,
  getRanking,
  getRegistros,
  removeRegistro,
  updateRegistro,
} from "../controllers/registros.controllers.js";

const router = express.Router();

router.route("/").get(getRanking).post(addRegistro);
router.route("/:ano/:mes").get(getRegistros);
router.route("/:id/:data").delete(removeRegistro);
router.route("/:id/").put(updateRegistro);
router.route("/:ano/:mes/:photographers").get(getRanking);

export default router;

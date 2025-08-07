import express from "express";
import {
  handleAddDiscounts,
  handleDeleteDiscounts,
  handleGetDiscounts,
  handlePutDiscounts,
} from "../controllers/discounts.controllers.js";

const router = express.Router();

router.route("/").post(handleAddDiscounts);
router.route("/:id").put(handlePutDiscounts).delete(handleDeleteDiscounts);
router.route("/:ano/:mes").get(handleGetDiscounts);

export default router;

import { addDiscounts, deleteDiscount, getDiscounts, updateDiscount } from "../models/discounts.models.js";

export async function handleGetDiscounts(req, res) {
  const { id } = req.user;
  const { ano, mes } = req.params;

  try {
    const descontos = await getDiscounts(id, ano, mes);
    res.status(200).json(descontos);
  } catch (err) {
    throw err;
  }
}

export async function handleAddDiscounts(req, res) {
  const { id } = req.user;
  const discount = req.body;

  try {
    await addDiscounts(id, discount);
    res.status(200).json({ message: "Desconto adicionado." });
  } catch (err) {
    throw err;
  }
}

export async function handlePutDiscounts(req, res) {
  const { id } = req.params;
  const { data, reason, value } = req.body;

  try {
    await updateDiscount(id, data, reason, value);

    return res.status(200).json({ message: "Desconto atualizado." });
  } catch (err) {
    throw err;
  }
}

export async function handleDeleteDiscounts(req, res) {
  const { id: discount_id } = req.params;

  try {
    await deleteDiscount(discount_id);

    return res.status(200).json({ message: "Desconto removido." });
  } catch (err) {
    throw err;
  }
}

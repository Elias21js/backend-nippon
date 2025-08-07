import database from "../database.js";

export async function getDiscounts(id, ano, mes) {
  const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const proximoMes = mes == 12 ? `${Number(ano) + 1}-01-01` : `${ano}-${String(Number(mes) + 1).padStart(2, "0")}-01`;

  try {
    const { rows } = await database.query(
      "SELECT * FROM discounts WHERE user_id=$1 AND data >= $2 AND data < $3 ORDER BY data ASC",
      [id, inicio, proximoMes]
    );
    return rows;
  } catch (err) {
    throw err;
  }
}

export async function addDiscounts(id, { data, reason, valor }) {
  try {
    await database.query("INSERT INTO discounts (user_id, data, reason, value) VALUES ($1, $2, $3, $4)", [
      id,
      data,
      reason,
      valor,
    ]);
  } catch (err) {
    throw err;
  }
}

export async function updateDiscount(id, data, reason, value) {
  try {
    await database.query("UPDATE discounts SET data=$1, reason=$2, value=$3 WHERE discount_id=$4", [
      data,
      reason,
      value,
      id,
    ]);
  } catch (err) {
    throw err;
  }
}

export async function deleteDiscount(id) {
  try {
    await database.query("DELETE FROM discounts WHERE discount_id=$1", [id]);
  } catch (err) {
    throw err;
  }
}

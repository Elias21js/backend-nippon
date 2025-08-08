import database from "../database.js";

export async function newRegister({ user_id, data, solds20: vendas_20, solds15: vendas_15, sobras, digitais }) {
  try {
    await database.query(
      "INSERT INTO registros (user_id, data, vendas_20, vendas_15, sobras, digitais) VALUES ($1, $2, $3, $4, $5, $6 )",
      [user_id, data, vendas_20, vendas_15, sobras, digitais]
    );
  } catch (err) {
    throw err;
  }
}

export async function getRegistrosOfUser(id, ano, mes) {
  try {
    const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
    const proximoMes = mes == 12 ? `${Number(ano) + 1}-01-01` : `${ano}-${String(Number(mes) + 1).padStart(2, "0")}-01`;

    const { rows: registros } = await database.query(
      "SELECT * FROM registros WHERE user_id = $1 AND data >= $2 AND data < $3 ORDER BY data ASC",
      [id, inicio, proximoMes]
    );

    const { rows: descontos } = await database.query(
      "SELECT * FROM discounts WHERE user_id = $1 AND data >= $2 AND data < $3 ORDER BY data ASC",
      [id, inicio, proximoMes]
    );
    return { registros, descontos };
  } catch (err) {
    throw err;
  }
}

export async function getAllRegisters({ ano, mes }, photographers) {
  const parsedUser = JSON.parse(photographers);
  const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
  const proximoMes = mes == 12 ? `${Number(ano) + 1}-01-01` : `${ano}-${String(Number(mes) + 1).padStart(2, "0")}-01`;

  try {
    const placeholdersNomes = parsedUser.map((_, i) => `$${i + 1}`).join(", ");
    const idxDataInicio = parsedUser.length + 1;
    const idxDataFim = parsedUser.length + 2;

    const sql = `
      SELECT r.*, u.name AS nome_fotografo
      FROM registros r
      JOIN users u ON r.user_id = u.id
      WHERE u.name IN (${placeholdersNomes})
        AND r.data >= $${idxDataInicio}
        AND r.data < $${idxDataFim}
    `;
    const params = [...parsedUser, inicio, proximoMes];
    const { rows } = await database.query(sql, params);
    return rows;
  } catch (err) {
    throw err;
  }
}

export async function registroExistsByData(data, user_id) {
  if (!user_id) return console.error("user_id is undefined.");
  try {
    const { rows } = await database.query(
      "SELECT EXISTS (SELECT 1 FROM registros WHERE data = $1 AND user_id = $2) AS exists",
      [data, user_id]
    );
    return rows[0].exists;
  } catch (err) {
    throw err;
  }
}

export async function registroExistsById(id) {
  try {
    const { rows } = await database.query("SELECT EXISTS (SELECT 1 FROM registros WHERE register_id = $1) AS exists", [
      id,
    ]);

    return rows[0].exists;
  } catch (err) {
    throw err;
  }
}

export async function getRegistroByData(data, user_id) {
  try {
    const { rows } = await database.query("SELECT * FROM registros WHERE data = $1 AND user_id = $2", [data, user_id]);

    return rows[0];
  } catch (err) {
    throw err;
  }
}

export async function getRegistroById(id) {
  try {
    const { rows } = await database.query("SELECT * FROM registros WHERE register_id = $1", [id]);

    return rows[0];
  } catch (err) {
    throw err;
  }
}

export async function editRegistro(register_id, { data, solds20, solds15, digitais, sobras }) {
  try {
    await database.query(
      "UPDATE registros SET data=$2, vendas_20=$3, vendas_15=$4, digitais=$5, sobras=$6 WHERE register_id=$1",
      [register_id, data, solds20, solds15, digitais, sobras]
    );
  } catch (err) {
    throw err;
  }
}

export async function deleteRegistro(id) {
  try {
    await database.query("DELETE FROM registros WHERE register_id = $1", [id]);
  } catch (err) {
    throw err;
  }
}

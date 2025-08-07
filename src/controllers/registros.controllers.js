import {
  deleteRegistro,
  getRegistrosOfUser,
  newRegister,
  registroExistsByData,
  getRegistroById,
  getRegistroByData,
  registroExistsById,
  editRegistro,
  getAllRegisters,
} from "../models/registros.models.js";
import { registroSchema } from "../schemas/registros.schema.js";

export async function addRegistro(req, res) {
  const { error } = registroSchema.validate(req.body);
  const { id: user_id } = req.user;

  if (error) return res.status(400).json(error.details[0]);

  if (await registroExistsByData(req.body.data, user_id))
    return res.status(400).json({ message: "Esta data já foi adicionada anteriormente." });

  try {
    await newRegister({ user_id, ...req.body });

    return res.status(200).json({ message: "Registro adicionado." });
  } catch (err) {
    throw err;
  }
}

export async function getRegistros(req, res) {
  const { id } = req.user;
  const { ano, mes } = req.params;

  try {
    const registros = await getRegistrosOfUser(id, ano, mes);
    return res.status(200).json(registros);
  } catch (error) {
    throw error;
  }
}

export async function removeRegistro(req, res) {
  const { id, data } = req.params;
  if (!registroExistsByData(data))
    return res.status(400).json({ message: "Registro não encontrado, recarregue a página." });

  try {
    await deleteRegistro(id);

    return res.status(200).json({ message: "Registro deletado." });
  } catch (err) {
    throw err;
  }
}

export async function updateRegistro(req, res) {
  const { id: user_id } = req.user;
  const { id: register_id } = req.params;
  const { data, solds20, solds15, digitais, sobras } = req.body;

  if (await registroExistsByData(data, user_id)) {
    // Buscando ID do registro que contém a data em questão.
    const { id: id_data_existente } = await getRegistroByData(data, user_id);
    // Buscando ID do registro que estou editando atualmente.
    const { id: id_data_modificada } = await getRegistroById(register_id);

    // Comparando se o ID que contém a data é o mesmo ID do registro que estou editando, se for igual, então não tem problema ser a mesma data, até por que significaria que eu nem editei a data, só reenviei a mesma, agora caso seja diferente o ID, então estou tentando reescrever a data encima de outro registro já existente.
    if (id_data_existente !== id_data_modificada)
      return res.status(400).json({ message: "Esta data já foi adicionada anteriormente." });
  }

  if (!(await registroExistsById(register_id)))
    return res.status(400).json({ message: "Registro não encontrado, recarregue a página." });

  try {
    await editRegistro(register_id, {
      data,
      solds20,
      solds15,
      digitais,
      sobras,
    });

    return res.status(200).json({ message: "Registro editado." });
  } catch (err) {
    throw err;
  }
}

export async function getRanking(req, res) {
  const { ano, mes, photographers } = req.params;
  try {
    const ranking = await getAllRegisters({ ano, mes }, photographers);
    return res.status(200).json(ranking);
  } catch (err) {
    throw err;
  }
}

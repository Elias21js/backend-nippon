import database from "../database.js";

export async function registerUser({ name, password }) {
  try {
    await database.query("INSERT INTO users (name, password) VALUES ($1, $2)", [name, password]);
  } catch (error) {
    throw error;
  }
}

export async function userExists(name) {
  try {
    const { rows } = await database.query("SELECT EXISTS (SELECT 1 FROM users WHERE name = $1) AS exists", [name]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

export async function getUserPassword(name) {
  try {
    const { rows } = await database.query("SELECT password FROM users WHERE name = $1", [name]);
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    throw err;
  }
}

export async function getIdByName(name) {
  try {
    const { rows } = await database.query("SELECT id FROM users WHERE name = $1", [name]);
    return rows[0];
  } catch (err) {
    throw err;
  }
}

export async function updateUserPassword(name, password) {
  try {
    await database.query("UPDATE users SET password=$1 WHERE name=$2", [password, name]);
  } catch (err) {
    throw err;
  }
}

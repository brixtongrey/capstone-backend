import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser(email, username, password) {
  const sql = `
  INSERT INTO users
    (email, username, password)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [email, username, hashedPassword]);
  return user;
}

export async function getUserByUsername(username) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [username]);
  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}


export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
    SELECT *
    FROM users
    WHERE username = $1
  `;
  const { rows: [user] } = await db.query(sql, [username]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function searchUsers(q) {
  try {
    const sql = `
      SELECT id, username
      FROM users
      WHERE username ILIKE $1
      ORDER BY username ASC
      LIMIT 20;
    `;
    const { rows } = await db.query(sql, [`%${q}%`]);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

import db from "#db/client";

export async function createExpense(user_id, group_id, item_id, type, total) {
  const query = `
    INSERT INTO expenses (user_id, group_id, item_id, type, total)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const {
    rows: [expense],
  } = await db.query(query, [user_id, group_id, item_id, type, total]);
  return expense;
}
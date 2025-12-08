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

export async function getExpensesByUserId(user_id) {
  const query = `
    SELECT e.*, i.name AS item_name, i.price AS item_amount, g.name AS group_name
    FROM expenses e
    JOIN items i ON e.item_id = i.id
    JOIN groups g ON e.group_id = g.id
    WHERE e.user_id = $1
    ORDER BY e.id DESC
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
}


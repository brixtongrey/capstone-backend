import db from "#db/client";

export async function getTotalOwedByUser(userId) {
  const sql = `
    SELECT COALESCE(SUM(amount_owed), 0) AS total
    FROM split_expenses
    WHERE user_id = $1
  `;
  const { rows: [result] } = await db.query(sql, [userId]);
  return result.total;
}

export async function getExpensesByUserId(user_id) {
  const query = `
    SELECT e.*, i.name AS item_name, i.amount AS item_amount, g.name AS group_name
    FROM expenses e
    JOIN items i ON e.item_id = i.id
    JOIN groups g ON e.group_id = g.id
    WHERE e.user_id = $1
    ORDER BY e.id DESC
  `;
  const { rows } = await db.query(query, [user_id]);
  return rows;
}

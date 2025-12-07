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


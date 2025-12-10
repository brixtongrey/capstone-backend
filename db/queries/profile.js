import db from "#db/client";

export async function getTotalOwedByUser(userId) {
  try {
    const sql = `
      SELECT COALESCE(SUM(amount_owed), 0) AS total
      FROM split_expenses
      WHERE user_id = $1
    `;

    const { rows: [result] } = await db.query(sql, [userId]);
    return result.total;

  } catch (err) {
    console.error("Error in getTotalOwedByUser:", err);
    throw err;
  }
}

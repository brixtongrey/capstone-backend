import db from "#db/client";

export async function createExpense(
  user_id,
  group_id,
  item_id,
  type,
  total,
  receipt
) {
  try {
    const query = `
        INSERT INTO expenses (user_id, group_id, item_id, type, total, receipt)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `;
    const {
      rows: [split],
    } = await db.query(query, [
      user_id,
      group_id,
      item_id,
      type,
      total,
      receipt,
    ]);
    return split;
  } catch (error) {
    console.error(error);
  }
}

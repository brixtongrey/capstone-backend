import db from "#db/client";

export async function createSplitExpense(
  expense_id,
  user_id,
  amount_owed,
  isPaid
) {
  try {
    const query = `
        INSERT INTO split_expenses (expense_id, user_id, amount_owed, isPaid)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
    const {
      rows: [split],
    } = await db.query(query, [expense_id, user_id, amount_owed, isPaid]);
    return split;
  } catch (error) {
    console.error(error);
  }
}

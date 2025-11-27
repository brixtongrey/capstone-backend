import db from "#db/client";

export async function createSplitExpense(expense_id, user_id, amount_owed) {
  try {
    const query = `
        INSERT INTO split_expenses (expense_id, user_id, amount_owed)
        VALUES ($1, $2, $3)
        RETURNING *
        `;
    const {
      rows: [split],
    } = await db.query(query, [expense_id, user_id, amount_owed]);
    return split;
  } catch (error) {
    console.error(error);
  }
}

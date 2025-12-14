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

export async function getExpenseDetail(user_id, expense_id) {
  try {
    const query = `
      SELECT
        g.name AS group_name,
        e.id AS expense_id,
        e.type AS split_type,
        e.total AS expense_total,
        i.name AS item_name,
        i.quantity,
        i.price,
        se.is_paid
      FROM expenses AS e
      INNER JOIN groups AS g
        ON g.id = e.group_id
      INNER JOIN items AS i 
        ON i.id = e.item_id
      INNER JOIN split_expenses se ON se.expense_id = e.id AND se.user_id = $1
      WHERE e.user_id = $1 AND e.id = $2;
    `;

    const {
      rows: [expense],
    } = await db.query(query, [user_id, expense_id]);
    return expense;
  } catch (err) {
    console.error("Error in getExpenseDetail:", err);
    throw err;
  }
}

export async function getExpensesByUserId(user_id) {
  try {
    const query = `
        SELECT e.*, 
        i.name AS item_name, 
        se.amount_owed AS item_amount,
        g.name AS group_name,
        g.id AS group_id
      FROM expenses e
      JOIN items i ON e.item_id = i.id
      JOIN groups g ON e.group_id = g.id
      JOIN split_expenses se ON se.expense_id = e.id AND se.user_id = $1
      WHERE e.user_id = $1
      ORDER BY e.id DESC
    `;

    const { rows } = await db.query(query, [user_id]);
    return rows;
  } catch (err) {
    console.error("Error in getExpensesByUserId:", err);
    throw err;
  }
}

export async function updateExpensePaid(is_paid, user_id, expense_id) {
  try {
    const query = `
      UPDATE split_expenses
      SET is_paid = $1
      WHERE user_id = $2 AND expense_id = $3
      RETURNING *;
    `;

    const {
      rows: [expense],
    } = await db.query(query, [is_paid, user_id, expense_id]);
    return expense;
  } catch (err) {
    console.error("Error in getExpensesByUserId:", err);
    throw err;
  }
}

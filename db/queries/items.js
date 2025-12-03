import db from "#db/client";

export async function createItem(user_id, name, quantity, price) {
  try {
    const query = `
        INSERT INTO items (user_id, name, quantity, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `;
    const {
      rows: [item],
    } = await db.query(query, [user_id, name, quantity, price]);
    return item;
  } catch (error) {
    console.error(error);
  }
}

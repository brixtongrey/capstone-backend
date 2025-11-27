import db from "#db/client";

export async function createGroup(name, description) {
  try {
    const query = `
        INSERT INTO groups(name, description)
        VALUES ($1, $2)
        RETURNING *
        `;
    const {
      rows: [group],
    } = await db.query(query, [name, description]);
    return group;
  } catch (error) {
    console.error(error);
  }
}

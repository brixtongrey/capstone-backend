import db from "#db/client";

export async function createGroupMember(group_id, user_id) {
  try {
    const query = `
        INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2)
        RETURNING *
        `;
    const {
      rows: [member],
    } = await db.query(query, [group_id, user_id]);
    return member;
  } catch (error) {
    console.error(error);
  }
}

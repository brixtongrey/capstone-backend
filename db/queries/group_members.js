import db from "#db/client";

export async function createGroupMember(group_id, user_id) {
  try {
    const query = `
        INSERT INTO group_members (group_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (group_id, user_id) DO NOTHING
        RETURNING *
        `;

  const { rows } = await db.query(query, [group_id, user_id]);

    // If rows is empty, the user was already a member
    if (rows.length === 0) {
      return { alreadyMember: true };
    }

    return rows[0];

  } catch (error) {
    console.error("Error creating group member:", error);
    throw error;
  }
}

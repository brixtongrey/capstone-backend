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

export async function getUserGroups(user_id) {
  try {
    const getUserGroupsQuery = `
        SELECT g.name, g.description
        FROM groups AS g
        INNER JOIN group_members AS gm
          ON gm.group_id = g.id
        WHERE gm.user_id = $1;
    `;

    const { rows: groups } = await db.query(getUserGroupsQuery, [user_id]);

    if (!groups) return null;

    return groups;
  } catch (error) {
    console.error(error.message);
  }
}

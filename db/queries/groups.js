import db from "#db/client";

export async function createGroup(name, description) {
  try {
    const { rows: existing } = await db.query(
      `SELECT * FROM groups WHERE name = $1`,
      [name]
    );
    if (existing.length > 0) return existing[0];

    const { rows: [group] } = await db.query(
      `INSERT INTO groups(name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );

    return group;
  } catch (error) {
    if (error.code === "23505") {
      throw new Error(`Group with name "${name}" already exists.`);
    }
    console.error(error);
    throw error;
  }
}

export async function getUserGroups(user_id) {
  try {
    const getUserGroupsQuery = `
        SELECT g.id, g.name, g.description
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

export async function getGroupDetails(group_id) {
  try {
    const getGroupDetailsQuery = `
    SELECT name, description
    FROM groups
    WHERE id = $1;
    `;

    const {
      rows: [group],
    } = await db.query(getGroupDetailsQuery, [group_id]);

    return group;
  } catch (error) {
    console.error(error.message);
  }
}

export async function searchGroups(q) {
  const sql = `
    SELECT id, name
    FROM groups
    WHERE name ILIKE $1
    ORDER BY name ASC
    LIMIT 20;
  `;
  const { rows } = await db.query(sql, [`%${q}%`]);
  return rows;
}

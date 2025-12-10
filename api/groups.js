import express from "express";
const router = express.Router();

import {
  createGroup,
  getUserGroups,
  getGroupDetails,
} from "#db/queries/groups";
import { createGroupMember } from "#db/queries/group_members";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

router.get("/", async (req, res) => {
  try {
    const { id } = req.user;

    const userGroups = await getUserGroups(id);

    if (!userGroups)
      res.status(200).send("User is currently not a part of any groups");

    return res.status(201).send(userGroups);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // const { id } = req.user;
    const group_id = req.params.id;

    const groupDetails = await getGroupDetails(group_id);

    if (!groupDetails) res.status(403).send("Failed to fetch group details");

    return res.status(201).send(groupDetails);
  } catch (error) {
    console.error(error.message);
  }
});

router.post("/new", requireBody(["name", "description"]), async (req, res) => {
  try {
    const { id } = req.user;
    const { name, description } = req.body;

    const group = await createGroup(name, description);

    if (!group) res.status(500).send("Unable to create group");

    const user = await createGroupMember(group.id, id);

    if (!user) res.status(500).send("Unable to add user as a member to group");

    return res.status(201).send(group);
  } catch (error) {
    console.error(error.message);
  }
});

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    const sql = `
      SELECT id, name
      FROM groups
      WHERE name ILIKE $1
      ORDER BY name ASC
      LIMIT 20;
    `;

    const { rows } = await db.query(sql, [`%${q}%`]);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search groups" });
  }
});


export default router;

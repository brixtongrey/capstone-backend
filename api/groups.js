import express from "express";
const router = express.Router();
export default router;

import { createGroup } from "#db/queries/groups";
import { createGroupMember } from "#db/queries/group_members";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";

router.use(requireUser);

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

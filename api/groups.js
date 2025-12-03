import express from "express";
const router = express.Router();
export default router;

import { createGroup } from "#db/queries/groups";
import requireBody from "#middleware/requireBody";

router.post("/new", requireBody(["name", "description"]), async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await createGroup(name, description);

    if (!group) res.status(500).send("Unable to create group");

    return res.status(201).send(group);
  } catch (error) {
    console.error(error.message);
  }
});

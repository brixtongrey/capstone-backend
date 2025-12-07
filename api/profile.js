import express from "express";
const router = express.Router();

import { getTotalOwedByUser } from "#db/queries/profile";
import { getUserById } from "#db/queries/users";

// GET /profile
router.get("/", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const total = await getTotalOwedByUser(req.user.id);

    res.json({
      id: user.id,
      username: user.username,
      totalOwed: total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;

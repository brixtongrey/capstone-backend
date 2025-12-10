import express from "express";
const router = express.Router();

import { getTotalOwedByUser } from "#db/queries/profile";
import { getExpensesByUserId } from "#db/queries/expenses";
import { getUserById } from "#db/queries/users";
import getUserFromToken from "#middleware/getUserFromToken";

// GET /profile
router.get("/", getUserFromToken, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const total = await getTotalOwedByUser(req.user.id);
    const expenses = await getExpensesByUserId(req.user.id);

    res.json({
      id: user.id,
      username: user.username,
      totalOwed: total,
      expensesOwed: expenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load profile" });
  }
});

export default router;
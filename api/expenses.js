import express from "express";
const router = express.Router();

import { createExpense } from "#db/queries/expenses";
import { createSplitExpense } from "#db/queries/split_expenses";
import { createGroup } from "#db/queries/groups";
import { createItem } from "#db/queries/items";
import { getUserByUsername } from "#db/queries/users";
import { getExpensesByUserId, getExpenseDetail } from "#db/queries/expenses";
import getUserFromToken from "#middleware/getUserFromToken";
import requireBody from "#middleware/requireBody";

router.post(
  "/",
  getUserFromToken,
  requireBody(["groupName", "usernames", "items", "splitType"]),
  async (req, res) => {
    try {
      const { groupName, usernames, items, splitType, shares } = req.body;
      const createdBy = req.user.id;

      // Create a group --> pull from /groups?
      const group = await createGroup(
        groupName,
        "Created from SplitBills form"
      );

      const users = {};
      for (const uname of usernames) {
        const user = await getUserByUsername(uname);
        if (!user)
          return res.status(404).json({ error: `User ${uname} not found` });
        users[uname] = user;
      }

      const createdExpenses = [];
      for (const item of items) {
        const itemRecord = await createItem(
          createdBy,
          item.name,
          group.id,
          parseFloat(item.amount)
        );

        const total = parseFloat(item.amount);
        const assignedUsers = item.assigned?.length ? item.assigned : usernames;

        const expense = await createExpense(
          createdBy,
          group.id,
          itemRecord.id,
          splitType,
          total
        );

        for (const uname of assignedUsers) {
          const owed = parseFloat(shares[uname] || 0);
          await createSplitExpense(expense.id, users[uname].id, owed);
        }

        createdExpenses.push(expense);
      }

      return res.status(201).json({
        message: "Expenses created successfully",
        expenses: createdExpenses,
      });
    } catch (err) {
      console.error("Error in /splitbills route:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

router.get("/:id", getUserFromToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const expense_id = req.params.id;
    const expense_details = await getExpenseDetail(user_id, expense_id);
    res.send(expense_details);
  } catch (err) {
    console.error("Error fetching user expense details:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/user", getUserFromToken, async (req, res) => {
  try {
    const expenses = await getExpensesByUserId(req.user.id);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching user expenses:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

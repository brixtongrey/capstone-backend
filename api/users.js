import express from "express";
const router = express.Router();

import { createUser, getUserByUsernameAndPassword, getUserById } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["email", "username", "password"]), async (req, res) => {
    try {
      const { email, username, password } = req.body;

    const user = await createUser(email, username, password);

    const token = await createToken({ id: user.id });

    res.status(201).json({ token, user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message});
    }
  });

router
  .route("/login")
  .post(requireBody(["username", "password"]), async (req, res) => {
    const { username, password } = req.body;

    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password.");

    const token = await createToken({ id: user.id });
    res.send({ token, user: { id: user.id, username: user.username } });
  });

  // GET CURRENT USER (for auth check)
router.get("/me", async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

  export default router;
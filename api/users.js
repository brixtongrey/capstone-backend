import express from "express";
const router = express.Router();

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";

router
  .route("/register")
  .post(requireBody(["username", "password", "email"]), async (req, res) => {
    try {
      const { username, password, email } = req.body;

    const user = await createUser(username, password, email);

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
    res.send(token);
  });

  export default router;
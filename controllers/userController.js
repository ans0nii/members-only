import * as db from "../db/queries.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await db.getUserByEmail(email);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ error: "Failed to find user" });
      return;
    }

    const user = await db.getUserById(id);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

export const updateUserMembership = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(404).json({ error: "User ID is required" });
      return;
    }

    await db.updateUserMembership(userId);
    res.json({ message: "Membership status updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update membership" });
  }
};

export const updateUserAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    await db.updateUserAdmin(userId);
    res.json({ message: "Admin status updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update admin status" });
  }
};

export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: "All fields required" });
      return;
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insertUser(firstName, lastName, email, hashedPassword);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        isMember: user.is_member,
        isAdmin: user.is_admin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

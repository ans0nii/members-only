import jwt from "jsonwebtoken";
import * as db from "../db/queries.js";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    req.user = user;

    next();
  } catch (errror) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireMember = (req, res, next) => {
  if (!req.user.is_member) {
    res.status(403).json({ error: "Member access required" });
    return;
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    res.status(403).json({ error: "Admin access required" });
  }
  next();
};

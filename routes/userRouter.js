import express from "express";
import {
  signup,
  login,
  getUserById,
  updateUserMembership,
  updateUserAdmin,
} from "../controllers/userController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";
const { Router } = express;
const userRouter = Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);

userRouter.get("/:id", authenticateToken, getUserById);
userRouter.put(
  "/membership",
  authenticateToken,
  requireAdmin,
  updateUserMembership,
);
userRouter.put("/admin", authenticateToken, requireAdmin, updateUserAdmin);
export default userRouter;

import express from "express";
import {
  getAllMessages,
  createMessage,
  deleteMessage,
  updateMessage,
} from "../controllers/messageController.js";
import {
  authenticateToken,
  requireMember,
  requireAdmin,
} from "../middleware/auth.js";
const { Router } = express;
const messageRouter = Router();

messageRouter.get("/", getAllMessages);
messageRouter.post("/", authenticateToken, requireMember, createMessage);
messageRouter.delete("/:id", authenticateToken, requireAdmin, deleteMessage);
messageRouter.put("/:id", authenticateToken, requireMember, updateMessage);

export default messageRouter;

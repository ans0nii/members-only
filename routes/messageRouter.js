import express from "express";
import {
  getAllMessages,
  createMessage,
  deleteMessage,
} from "../controllers/messageController";
import {
  authenticateToken,
  requireMember,
  requireAdmin,
} from "../middleware/auth";
const { Router } = express;
const messageRouter = Router();

messageRouter.get("/", getAllMessages);
messageRouter.post("/", authenticateToken, requireMember, createMessage);
messageRouter.delete("/:id", authenticateToken, requireAdmin, deleteMessage);

export default messageRouter;

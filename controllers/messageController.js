import * as db from "../db/queries.js";

export const getAllMessages = async (req, res) => {
  try {
    const messages = await db.getAllMessages();

    if (!messages) {
      res.status(404).json({ error: "Failed to find messages" });
      return;
    }
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { title, text } = req.body;
    const userId = req.user.id;

    if (!title || !text) {
      res.status(400).json({ error: "Title and text required" });
      return;
    }

    if (text.length > 200) {
      res.json({ error: "Text must be 200 character or less" });
      return;
    }

    if (title.length > 30) {
      res.json({ error: "Title must be 30 characters or less" });
    }

    const message = await db.createMessage(title, text, userId);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    const message = await db.getMessageById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (!isAdmin && message.user_id !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    await db.deleteMessage(messageId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};

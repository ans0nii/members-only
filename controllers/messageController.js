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

    const sanitizeString = (str) => {
      if (!str) return str;
      return str
        .toString()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+="[^"]*"/gi, "")
        .trim();
    };

    const sanitizeText = sanitizeString(text);
    const sanitizeTitle = sanitizeString(title);

    if (!sanitizeTitle || !sanitizeText) {
      res.status(400).json({ error: "Title and text required" });
      return;
    }

    if (sanitizeText.length > 200) {
      res.json({ error: "Text must be 200 character or less" });
      return;
    }

    if (sanitizeTitle.length > 30) {
      res.json({ error: "Title must be 30 characters or less" });
      return;
    }

    const message = await db.createMessage(sanitizeTitle, sanitizeText, userId);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    const { title, text } = req.body;
    const isAdmin = req.user.is_admin;

    const message = await db.getMessageById(messageId);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    if (!isAdmin && message.user_id !== userId) {
      res.status(403).json({ error: "You can only edit your own messages" });
      return;
    }

    const sanitizeString = (str) => {
      if (!str) return str;
      return str
        .toString()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+="[^"]*"/gi, "")
        .trim();
    };

    const sanitizeTitle = sanitizeString(title);
    const sanitizeText = sanitizeString(text);

    if (!sanitizeText || !sanitizeTitle) {
      res.status(400).json({ error: "Title and text are required" });
      return;
    }

    if (sanitizeText.length > 200) {
      res.status(400).json({ error: "Text must be 200 characters or less" });
      return;
    }

    if (sanitizeTitle.length > 30) {
      res.status(400).json({ error: "Title must be 30 characters or less" });
      return;
    }

    const updatedMessage = await db.updateMessage(
      messageId,
      sanitizeTitle,
      sanitizeText,
    );
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    const isAdmin = req.user.is_admin;

    const message = await db.getMessageById(messageId);

    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
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

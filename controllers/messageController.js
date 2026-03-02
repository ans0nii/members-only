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

    const message = await db.createMessage(title, text, userId);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to create message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.id;
    const deletedMessage = await db.deleteMessage(messageId);

    res.json(deletedMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

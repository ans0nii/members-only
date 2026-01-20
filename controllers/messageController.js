const db = require("../db/queries");

exports.homeGet = async (req, res) => {
  try {
    const messages = await db.getAllMessages();
    res.render("index", {
      user: req.user,
      messages: messages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading messages");
  }
};

exports.createMessageGet = (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }
  res.render("new-message", { user: req.user });
};

exports.createMessagePost = async (req, res) => {
  if (!req.user) {
    return res.redirect("/log-in");
  }

  try {
    const { title, text } = req.body;
    await db.insertMessage(title, text, req.user.id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating message");
  }
};

exports.deleteMessagePost = async (req, res) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).send("Admin only");
  }

  try {
    const { messageId } = req.body;
    await db.deleteMessage(messageId);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting message");
  }
};

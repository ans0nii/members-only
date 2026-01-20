const { Router } = require("express");
const messageController = require("../controllers/messageController");
const messageRouter = Router();

messageRouter.get("/", messageController.homeGet);

messageRouter.get("/new-message", messageController.createMessageGet);
messageRouter.post("/new-message", messageController.createMessagePost);

messageRouter.post("/messages/:id/delete", messageController.deleteMessagePost);

module.exports = messageRouter;
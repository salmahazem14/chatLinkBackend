const express = require("express");
const router = express.Router();
const {
  createChat,
  getChatById,
  getUserChats,
  addMessageToChat,
} = require("../controllers/chatController");

router.post("/", createChat);
router.get("/chatInfo/:chatId", getChatById);
router.get("/user", getUserChats);
router.patch("/message/:chatId", addMessageToChat);

module.exports = router;

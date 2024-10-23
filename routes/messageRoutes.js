const express = require("express");
const router = express.Router();
const {
  getMessageById,
  updateReadBy,
} = require("../controllers/messageController");

router.get("/:messageId", getMessageById);
router.patch("/read/:messageId", updateReadBy);

module.exports = router;

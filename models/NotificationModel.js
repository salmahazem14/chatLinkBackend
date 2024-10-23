// NotificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "UserId is required"],
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },

  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat", // Could be a chat or group room
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  readAt: {
    type: Date,
  },

  read: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);

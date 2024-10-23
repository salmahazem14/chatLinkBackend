// notificationControllers.js
const Notification = require("../models/NotificationModel");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { user, type, receiver, message, room } = req.body;
    console.log(req.body);
    const notification = new Notification({
      sender: user,
      type,
      receiver,
      message,
      room,
    });
    console.log(notification);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create notification", message: err.message });
  }
};

// Get notification by id
exports.getNotificationById = async (req, res) => {
  try {
    const notID = req.params.id;
    const notification = await Notification.findById(notID).populate(
      "receiver sender message room"
    );

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get notification", message: err.message });
  }
};

// Get messages for a specific user by userId (from request body)
exports.getNotificationByUserId = async (req, res) => {
  try {
    const { user } = req.body; // Get userId from the request body
    const notifications = await Notification.find({
      receiver: user,
    }).populate("sender message room");

    if (!notifications) {
      return res.status(404).json({ error: "No messages found for this user" });
    }

    res.status(200).json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get messages", message: err.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { user } = req.body;
    const notifications = await Notification.find({
      receiver: user,
    }).populate("receiver sender message room");
    if (!notifications) {
      return res.status(404).json({ error: "No messages found for this user" });
    }
    notifications.forEach(async (noti) => {
      console.log(noti);
      noti.read = true;
      noti.readAt = Date.now();
      await noti.save();
    });
    // const notification = await Notification.findByIdAndUpdate(
    //   notificationId,
    //   { read: true, readAt: Date.now() },
    //   { new: true }
    // );
    res.status(200).json(notifications);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to mark as read", message: err.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const noti = await Notification.findByIdAndDelete(notificationId);

    if (!noti) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete notification", message: err.message });
  }
};

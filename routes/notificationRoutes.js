// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");

// Define notification routes
router.get("/", notificationController.getNotificationByUserId);
router.get("/:id", notificationController.getNotificationById);
router.post("/", notificationController.createNotification);
router.patch("/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;

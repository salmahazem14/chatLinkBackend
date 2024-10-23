const express = require("express");
const {
  updateUserInfo,
  addFriend,
  removeFriend,
  userInfo,
  getNonFriends,
} = require("../controllers/userController.js");

const router = express.Router();

router.get("/", userInfo);
router.get("/suggestFriends", getNonFriends);
router.put("/accountSettings", updateUserInfo);
router.patch("/addFriend", addFriend);
router.patch("/removeFriend", removeFriend);

module.exports = router;

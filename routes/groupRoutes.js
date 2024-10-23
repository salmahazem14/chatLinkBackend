const express = require("express");

const router = express.Router();

const {
  getPublicGroups,
  getPrivateGroups,
  createGroup,
  getGroupsById,
  updateGroup,
  addUserToGroup,
  removeUserFromGroup,
  getAllUsersInGroup,
  getGroupByChatId,
} = require("../controllers/groupsController");

router.get("/:chatId", getGroupByChatId);
router.get("/publicGroups", getPublicGroups);
router.get("/privateGroups", getPrivateGroups);
router.get("/:id", getGroupsById);
router.get("/users/:id", getAllUsersInGroup);
router.post("/", createGroup);
router.put("/:id", updateGroup);
router.put("/addUser/:id", addUserToGroup);
router.put("/removeUser/:id", removeUserFromGroup);

module.exports = router;

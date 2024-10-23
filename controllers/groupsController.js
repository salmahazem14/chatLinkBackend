const groups = require("../models/groupsModel");
const Chat = require("../models/chat");

exports.getPublicGroups = async (req, res) => {
  try {
    const group = await groups
      .find({ visibility: true })
      .populate("admin", "firstName lastName profilePic")
      .populate("members", "firstName lastName profilePic")
      .populate("chat");
    if (!group) return res.status(404).json({ message: "Groups not found" });
    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getPrivateGroups = async (req, res) => {
  try {
    const group = await groups
      .find({ visibility: false })
      .populate("admin", "firstName lastName profilePic")
      .populate("members", "firstName lastName profilePic")
      .populate("chat");
    if (!group) return res.status(404).json({ message: "Groups not found" });
    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
exports.getGroupsById = async (req, res) => {
  try {
    let id = req.params.id;
    const group = await groups
      .findById(id)
      .populate("admin", "firstName lastName profilePic")
      .populate("members", "firstName lastName profilePic")
      .populate("chat");
    if (!group) return res.status(404).json({ message: "Groups not found" });
    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.createGroup = async (req, res) => {
  const { user, name, visibility, members, description, photoURL } = req.body;
  console.log(name, visibility, members);
  if (!name || visibility === undefined || !members) {
    return res.status(400).json({
      error: "(name, visibility, and members are required)",
    });
  }

  try {
    members.push(user);
    const chat = await new Chat({ participants: members }).save();
    const newGroup = new groups({
      admin: user,
      name,
      visibility,
      members,
      chat: chat._id,
      description,
      photoURL,
    });

    await newGroup.save();

    res.status(201).json({
      message: "Group created successfully",
      group: newGroup,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error, unable to create group",
      error: error.message,
    });
  }
};
exports.updateGroup = async (req, res) => {
  let id = req.params.id;
  const { name, visibility, description, photoURL } = req.body;

  try {
    // Update the group and return the updated document
    const group = await groups.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          visibility,
          description,
          photoURL,
        },
      },
      { new: true } // Return the updated group
    );

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    await group.populate([
      { path: "members", select: "firstName lastName profilePic" }, // Only show firstName and lastName for members
      { path: "admin", select: "firstName lastName profilePic" }, // Populate all fields for admin
      { path: "chat" }, // Populate all fields for chat
    ]);

    return res.json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.addUserToGroup = async (req, res) => {
  try {
    let id = req.params.id;
    const { userId } = req.body;

    const group = await groups.findByIdAndUpdate(
      id,
      {
        $push: { members: userId },
      },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    await group.populate([
      { path: "members", select: "firstName lastName profilePic" }, // Only show firstName and lastName for members
      { path: "admin", select: "firstName lastName profilePic" }, // Populate all fields for admin
      { path: "chat" }, // Populate all fields for chat
    ]);

    return res.json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.removeUserFromGroup = async (req, res) => {
  let id = req.params.id; // Group ID
  const { user, userId } = req.body; // User ID to be removed

  try {
    const check = await groups.findById(id);
    if (!check) {
      return res.status(404).json({ error: "Group not found" });
    }
    if (!check.members.includes(userId)) {
      return res.status(400).json({ error: "User not found in group" });
    }
    if (check.admin.toString() !== user) {
      return res.status(403).json({
        error: "You are not authorized to remove members from this group.",
      });
    }
    const group = await groups.findByIdAndUpdate(
      id,
      {
        $pull: { members: userId }, // Use $pull to remove the userId from the members array
      },
      { new: true } // Return the updated document
    );

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    await group.populate([
      { path: "members", select: "firstName lastName profilePic" }, // Only show firstName and lastName for members
      { path: "admin", select: "firstName lastName profilePic" }, // Populate all fields for admin
      { path: "chat" }, // Populate all fields for chat
    ]);

    return res.json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred" });
  }
};

exports.getAllUsersInGroup = async (req, res) => {
  let id = req.params.id;
  try {
    const group = await groups
      .findById(id)
      .populate("members", "firstName lastName profilePic"); // Populate members with the specified fields

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    return res.json(group.members);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred", errormessage: error.message });
  }
};
exports.getGroupByChatId = async (req, res) => {
  try {
    const chatId = req.params.chatId; // Get chat ID from request params

    const group = await groups
      .findOne({ chat: chatId }) // Find group where chat ID matches
      .populate("admin", "firstName lastName profilePic") // Populate admin info
      .populate("members", "firstName lastName profilePic") // Populate members info
      .populate("chat"); // Populate chat info

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.json(group);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
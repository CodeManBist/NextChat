import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

// Create a new group
export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const userId = req.user.id;

    if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "Group name and members are required" });
    }

    // Ensure creator is in the members list
    if (!memberIds.includes(userId)) {
      memberIds.push(userId);
    }

    // Check if all members exist
    const validMembers = await User.find({ _id: { $in: memberIds } });
    if (validMembers.length !== memberIds.length) {
      return res.status(400).json({ message: "Some members do not exist" });
    }

    const group = await Group.create({
      name,
      members: memberIds,
      admin: userId,
    });

    await group.populate("members", "username email avatar");
    await group.populate("admin", "username email avatar");

    res.status(201).json({
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all groups for authenticated user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;

    const groups = await Group.find({ members: userId })
      .populate("members", "username email avatar")
      .populate("admin", "username email avatar")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single group details
export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId)
      .populate("members", "username email avatar")
      .populate("admin", "username email avatar");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member of group
    if (!group.members.some(member => member._id.toString() === userId)) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get group messages
export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member
    if (!group.members.some(member => member.toString() === userId)) {
      return res.status(403).json({ message: "Not a member of this group" });
    }

    const skip = (page - 1) * limit;

    const messages = await Message.find({ groupId })
      .populate("senderId", "username avatar email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalMessages = await Message.countDocuments({ groupId });

    res.status(200).json({
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add member to group (admin only)
export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if requester is admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // Check if member already exists
    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: "Member already in group" });
    }

    // Check if user exists
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    group.members.push(memberId);
    await group.save();

    await group.populate("members", "username email avatar");
    await group.populate("admin", "username email avatar");

    res.status(200).json({
      message: "Member added successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove member from group (admin only)
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if requester is admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    // Check if trying to remove admin
    if (group.admin.toString() === memberId) {
      return res.status(400).json({ message: "Cannot remove group admin" });
    }

    // Remove member
    group.members = group.members.filter(m => m.toString() !== memberId);
    await group.save();

    await group.populate("members", "username email avatar");
    await group.populate("admin", "username email avatar");

    res.status(200).json({
      message: "Member removed successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update group (admin only)
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if requester is admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can update group" });
    }

    if (name && name.trim()) {
      group.name = name.trim();
    }

    await group.save();

    await group.populate("members", "username email avatar");
    await group.populate("admin", "username email avatar");

    res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete group (admin only)
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if requester is admin
    if (group.admin.toString() !== userId) {
      return res.status(403).json({ message: "Only admin can delete group" });
    }

    // Delete all messages in group
    await Message.deleteMany({ groupId });

    // Delete group
    await Group.findByIdAndDelete(groupId);

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Leave group
export const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member
    if (!group.members.includes(userId)) {
      return res.status(400).json({ message: "Not a member of this group" });
    }

    // If user is admin, transfer admin to first remaining member
    if (group.admin.toString() === userId) {
      const otherMembers = group.members.filter(m => m.toString() !== userId);
      if (otherMembers.length > 0) {
        group.admin = otherMembers[0];
      }
    }

    // Remove user from members
    group.members = group.members.filter(m => m.toString() !== userId);

    // Delete group if no members left
    if (group.members.length === 0) {
      await Message.deleteMany({ groupId });
      await Group.findByIdAndDelete(groupId);
    } else {
      await group.save();
    }

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

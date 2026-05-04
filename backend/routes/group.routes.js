import express from "express";
import verifyToken from "../middleware/auth.js";
import {
  createGroup,
  getUserGroups,
  getGroupDetails,
  getGroupMessages,
  addMemberToGroup,
  removeMemberFromGroup,
  updateGroup,
  deleteGroup,
  leaveGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Create new group
router.post("/", createGroup);

// Get all groups for user
router.get("/", getUserGroups);

// Get single group details
router.get("/:groupId", getGroupDetails);

// Get group messages with pagination
router.get("/:groupId/messages", getGroupMessages);

// Add member to group (admin only)
router.post("/:groupId/members", addMemberToGroup);

// Remove member from group (admin only)
router.delete("/:groupId/members/:memberId", removeMemberFromGroup);

// Update group (admin only)
router.put("/:groupId", updateGroup);

// Delete group (admin only)
router.delete("/:groupId", deleteGroup);

// Leave group
router.post("/:groupId/leave", leaveGroup);

export default router;

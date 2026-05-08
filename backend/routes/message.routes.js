import express from "express";
import verifyToken from "../middleware/auth.js";
import { getMessages } from "../controllers/message.controller.js";
import { reactMessage, removeReaction } from "../controllers/message.controller.js";

const router = express.Router();

router.use(verifyToken);

router.get("/:user1/:user2", getMessages);
router.post("/:messageId/reaction", reactMessage);
router.delete("/:messageId/reaction", removeReaction);

export default router;
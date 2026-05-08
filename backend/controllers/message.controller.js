import Message from "../models/message.model.js";

const isDirectParticipant = (message, userId) => {
    const senderId = message.senderId?.toString();
    const receiverId = message.receiverId?.toString();

    return senderId === userId || receiverId === userId;
};

export const getMessages = async (req, res) => {
    const { user1, user2 } = req.params;
    const requesterId = req.user.id;

    if (requesterId !== user1 && requesterId !== user2) {
        return res.status(403).json({ message: "You can only view your own private conversations" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json(messages.reverse());
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching messages" });
    }
}

export const reactMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;

        const userId = req.user.id;

        const message = await Message.findById(messageId);

        if(!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (!isDirectParticipant(message, userId)) {
            return res.status(403).json({ message: "You can only react to your own private messages" });
        }

        const existingReaction = message.reactions.find(
            reaction => reaction.userId.toString() === userId.toString()
        );

        if(existingReaction) {
            existingReaction.emoji = emoji;
        } else {
            message.reactions.push({ userId, emoji });
        }

        await message.save();
        res.json(message);
    } catch(error) {
        res.status(500).json({ message: "Error reacting to message" });
    }
}

export const removeReaction = async (req, res) => {
    try {
        const { messageId } = req.params;

        const userId = req.user.id;

        const message = await Message.findById(messageId);

        if(!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (!isDirectParticipant(message, userId)) {
            return res.status(403).json({ message: "You can only remove reactions from your own private messages" });
        }

        message.reactions = message.reactions.filter(
            reaction => reaction.userId.toString() !== userId.toString()    
        )

        await message.save();
        res.status(200).json(message);
    } catch(error) {
        res.status(500).json({ message: "Error removing reaction" });
    }
}
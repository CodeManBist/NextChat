import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
    const { user1, user2 } = req.params;

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
import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ createdAt: 1 }); // Sort by creation time
        res.json(messages);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching messages" });
    }
}
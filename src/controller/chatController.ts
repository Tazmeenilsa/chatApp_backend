import { Request, Response } from "express"
import { Message } from "../models/MessageSchema";

interface AuthRequest extends Request {
    userId?: string;
}

export const getChatHistory = async (req: AuthRequest, res: Response) => {
    try {
        const senderId = req.userId; // logged-in user
        const receiverId = req.params.receiverId;

        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Fetch all messages between these two users
        const messages = await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }

            ]
        }).sort({ createdAt: 1 })

        return res.status(200).json({
            message: "Chat history fetched successfully",
            data: messages
        });



    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error", error: err });
    }
}
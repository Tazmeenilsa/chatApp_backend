import { Server, Socket } from "socket.io";
import { Message } from "../models/MessageSchema";

const onlineUser = new Map<string, string>();

export const chatHandler = (io: Server, socket: Socket) => {
    const userId = socket.data.userId;

    onlineUser.set(userId, socket.id);

    // Send Message
    socket.on("sendMessage", async (data) => {
        const { receiverId, message } = data;

        console.log({ data });

        const newMessage = await Message.create({
            receiver: receiverId,
            sender: userId,
            message
        });

        const receiverSocketId = onlineUser.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageReceived", newMessage);
            console.log({ newMessage });
        }
    });

    // Typing
    socket.on("typing", ({ receiverId }) => {
        const receiverSocketId = onlineUser.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { userId });
        }
    });

    // Stop Typing
    socket.on("stopTyping", ({ receiverId }) => {
        const receiverSocketId = onlineUser.get(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStopTyping", { userId });
        }
    });
    // message seen
    socket.on('messageSeen', async (messageId, senderId) => {
        await Message.findByIdAndUpdate(messageId, {
            seen: true
        })
        const senderSocketId = onlineUser.get(senderId)
        if (senderSocketId) {
            io.to(senderSocketId).emit("messageSeenUpdate", messageId)
        }
    })



    // Disconnect
    socket.on("disconnect", () => {
        onlineUser.delete(userId);
    });
};
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { presenceHandler } from "./presence";

export const initializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Socket middleware
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token ||
                socket.handshake.query?.token;
            if (!token) return next(new Error("Unauthorized"));

            const secret = process.env.JWT_TOKEN as string;
            const decode = jwt.verify(token, secret) as { userId: string };

            socket.data.userId = decode.userId;
            next();
        } catch {
            next(new Error("Invalid Token"));
        }
    });

    // Log Authenticated User
    // Now only valid JWT users can connect.
    io.on("connection", (socket) => {
        console.log("User Connected:", socket.data.userId);

        presenceHandler(io, socket)

        socket.on("disconnect", () => {
            console.log("User Disconnected:", socket.data.userId);
        });
    });

    return io;
};
import { Server, Socket } from "socket.io";
import { User } from "../models/UserSchema";
import { lstatSync } from "node:fs";


const onlineUser = new Map<string, string>()

export const presenceHandler = (io: Server, socket: Socket) => {
    const userId = socket.data.userId

    if (!userId) return
    // add user to memory
    onlineUser.set(userId, socket.id)
    console.log("User Online:", userId);
    // update db

    User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastSeen: new Date()
    }).exec()

    // broadcast  status

    io.emit("userStatusChanged", {
        userId: userId,
        isOnline: true
    })

    // handle discconect

    socket.on("disconnect", async () => {
        onlineUser.delete(userId)

        await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: new Date()
        })

        io.emit("userStatusChanged", {
            userId: userId,
            isOnline: false
        })
    })
}
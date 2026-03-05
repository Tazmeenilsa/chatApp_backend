import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getChatHistory } from "../controller/chatController";


const chatRouter = Router()

chatRouter.get("/history/:receiverId", authMiddleware, getChatHistory)

export default chatRouter
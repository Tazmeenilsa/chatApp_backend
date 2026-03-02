import { Router, Response, Request } from "express"
import { loginUser, registerUser } from "../controller/userController"
import { authMiddleware } from "../middleware/authMiddleware"
import { User } from "../models/UserSchema";


interface AuthRequest extends Request {
    userId?: string;

}
const userRouter = Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.get("/profile", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User Data",
            user
        });

    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
})





export default userRouter
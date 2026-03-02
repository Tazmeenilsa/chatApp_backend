import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from 'express'
//  read token from headers
// verify token
// decode user id
// attach user to request obj



interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const secret = process.env.JWT_TOKEN as string
        const decode = jwt.verify(token, secret) as { userId: string }
        req.userId = decode.userId

        next()

    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" })
    }
}
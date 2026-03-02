import { Request, Response } from "express"
import { User } from "../models/UserSchema"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// register
export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, } = req.body
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All Fields area required !' })
        }

        // check email already exists
        const emailExists = await User.findOne({ email: email })
        if (emailExists) {
            return res.status(400).json({ message: "User Already Exists !" })
        }

        // hash password
        const hashPass = await bcrypt.hash(password, 10)


        const user = await User.create({
            name: name,
            email: email,
            password: hashPass,
            isOnline: false,
            lastSeen: null
        })
        console.log("User Registered Successfully !", user)
        return res.status(201).json({
            message: "User Registered Successfully !", user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Server Error" })
    }

}

// login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "All Fields are required !" })
        }

        const user = await User.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: " Invalid credentials" })
        }

        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const userPassword = await bcrypt.compare(password, user.password)
        if (!userPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // generate jwt token
        const secret = process.env.JWT_TOKEN as string;
        const token = jwt.sign(
            { userId: user._id.toString() },
            secret,
            { expiresIn: "1h" }
        );
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err: any) {
        console.error("Login Error:", err);
        return res.status(500).json({ message: "Server Error", error: err.message || err })
    }
}


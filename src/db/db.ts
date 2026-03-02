import mongoose from "mongoose";

export const connectDb = async (): Promise<void> => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MongoDB connected:", connection.connection.host);
    } catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
import mongoose from "mongoose";
export const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected:", connection.connection.host);
    }
    catch (err) {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map
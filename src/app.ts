import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute";
import chatRouter from "./routes/chatRoute";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRouter)
app.use('/api/v1/chat', chatRouter)


export default app;

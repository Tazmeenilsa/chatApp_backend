import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./db/db.js";
import http from 'http'
import { initializeSocket } from "./sockets/socketServer.js";
const PORT = process.env.PORT || 3000;

const server = http.createServer(app)

connectDb().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

initializeSocket(server);


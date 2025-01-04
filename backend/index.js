import express from 'express';
import authRoutes from './src/routes/auth.route.js';
import messageRoutes from './src/routes/message.route.js';
import dotenv from 'dotenv';
import { connectdb } from './src/lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from './src/lib/socket.js';
import path from 'path';

dotenv.config();
// const app = express();

app.use(express.json());
app.use(cookieParser()); // Add this middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT;
const __dirname = path.resolve();

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(3001, () => {
    console.log("Server is running on port " + PORT);
    connectdb();
});
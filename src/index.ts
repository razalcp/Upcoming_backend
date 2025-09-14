import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import organizerRouter from './routes/organizerRoutes'
const app: Application = express();
const PORT = process.env.PORT || 5000;

dotenv.config();


// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        // origin: "http://localhost:1234",
        origin: "https://upcoming-frontend-rq1t.vercel.app/",
        methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        credentials: true
    })
);

connectDB();

app.use("/organizer", organizerRouter);
// Test route
app.get("/", (req: Request, res: Response) => {
    res.send("Event Management API is running 🚀");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

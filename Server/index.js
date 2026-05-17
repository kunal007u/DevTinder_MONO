import express from 'express';
import DBConnection from './src/config/database.js';
import { User } from './src/models/User.js';
import bcrypt, { hash } from 'bcrypt';
import { validateSignupData } from './src/utils/validateSignupData.js';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './src/middleWares/auth.middleware.js';
import 'dotenv/config';
import authRouter from './src/api/auth.route.js'
import userRouter from './src/api/user.route.js'
import requestRouter from './src/api/connection.route.js'
import feedRouter from './src/api/feed.route.js'
import cors from 'cors';

const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());// Middleware to parse JSON request body
app.use(cookieParser()); // Middleware to parse cookies from incoming requests
app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies to be sent with requests
}))

// ROUTES
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", feedRouter);

//DB Connection check 
DBConnection().then(() => {
  console.log("Database Connected Successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}).catch((error) => {
  console.log("Database Connection Failed", error);
})

import express from 'express';
import DBConnection from './src/config/database.js';
import { User } from './src/models/User.js';
import bcrypt, { hash } from 'bcrypt';
import { validateSignupData } from './src/utils/validateSignupData.js';
import cookieParser from 'cookie-parser';
import { authMiddelware } from './src/middleWares/auth.middleware.js';
import 'dotenv/config';
import authRouter from './src/routes/auth.route.js'
import userRouter from './src/routes/user.route.js'

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());// Middleware to parse JSON request body
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

// ROUTES
app.use("/", authRouter);
app.use("/", userRouter);

//DB Connection check 
DBConnection().then(() => {
  console.log("Database Connected Successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}).catch((error) => {
  console.log("Database Connection Failed", error);
})

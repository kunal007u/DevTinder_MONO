// Entery Point
// create a server using express
import express from 'express';
import DBConnection from './src/config/database.js';
import { User } from './src/models/User.js';
import bcrypt, { hash } from 'bcrypt';
import { validateSignupData } from './src/utils/validateSignupData.js';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { authMiddelware } from './src/middleWares/auth.middleware.js';
import { tokenGeneration } from './src/utils/tokenGeneration.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());// Middleware to parse JSON request body
app.use(cookieParser()); // Middleware to parse cookies from incoming requests

//GET / User by Email
app.get("/user/getUserByEmail/v1", authMiddelware, async (req, res) => {
  let email = req.body.body
  try {
    const user = await User.find({ email })
    if (!user) res.status(404).json({ message: "User Not Found" })
    res.status(201).json({ user: user })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

//GET / getAllUsers 
app.get("/user/getAllUsers/v1", authMiddelware, async (req, res) => {

  try {

    const users = await User.find({})
    if (getUsers.length === 0) res.status(404).json({ message: "No User In Database" })
    res.status(201).json({ users, message: "Response successfull" })

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// POST/ Signup
app.post("/user/signup/v1", async (req, res) => {
  let { firstName, lastName, email, password, age, gender } = req.body
  // Validating the data coming from the client before processing it
  validateSignupData(req.body)

  // Check if user already exists with the same email
  let existingUser = await User.findOne({email})
  if(existingUser) res.status(400).json({message:"User Already Exists With This Email!!"})

  // encrypting the password before saving to database
  const salt = await bcrypt.genSalt(10);
  let hashpassword = await bcrypt.hash(password, salt);

  // JWT token creatation 
  let token = tokenGeneration({ user })

  // Set that token into the response header or cookie for future authenticated requests
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false
  })

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashpassword,
      age
    });
    await user.save();
    // Send a response back to the client with the created user object
    res.status(201).json({ message: "User Created Successfully", user: user })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// POST/ Login
app.post("/user/login/v1", async (req, res) => {
  let { email, password } = req.body
  try {

    let hasToken = req.cookies.token
    if (hasToken) res.status(400).json({ message: "User Already Logged In!!" })

    // Find the user by email and include the password field in the result
    const user = await User.findOne({ email }).select("+password")
    if (!user) res.status(404).json({ message: "Invalid Credentials" })

    // Compare the provided password with the stored hashed password if user exists
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) res.status(401).json({ message: "Invalid Credentials" })

    // JWT token creatation 
    let token = tokenGeneration({ user })

    // Set that token into the response header or cookie for future authenticated requests
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false
    })

    // If credentials are valid, send a success response 
    res.status(200).json({ message: "Login Successful", user: user })

  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// DELETE/ User by ID
app.delete("/user/deleteUser/v1/:userID", authMiddelware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ "_id": req.params?.userID })
    if (user.deletedCount <= 0) res.status(404).json({ message: "No User Found To Delete" })
    res.status(200).json({ message: "User Deleted Successfully", user: req.query.userID })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// UDPATE/ User by ID
app.patch("/user/UpdateUser/v1/:userID", authMiddelware, async (req, res) => {

  let userId = req.params?.userID
  try {
    const user = await User.findByIdAndUpdate({ userId }, req.body, {
      runValidators: true, // To run the validators defined in the Mongoose schema on the update operation
      new: true, //Return new updated user not the old one
    })
    if (!user) res.status(404).json({ message: "No User Found To Update" })
    res.status(200).json({ message: "User updated Successfully", user: user })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

//DB Connection check 
DBConnection().then(() => {
  console.log("Database Connected Successfully");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  })
}).catch((error) => {
  console.log("Database Connection Failed", error);
})

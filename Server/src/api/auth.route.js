import express from 'express';
import bcrypt from 'bcrypt';
import { validateSignupData } from '../utils/validateSignupData.js';
import { User } from '../models/User.js';

const route = express.Router();

// POST/ Signup
route.post("/api/v1/signup", async (req, res) => {
  let { firstName, lastName, email, password, age, gender } = req.body
  validateSignupData(req.body)

  // Check if user already exists with the same email
  let existingUser = await User.findOne({ email })
  if (existingUser) res.status(400).json({ message: "User Already Exists With This Email!!" })

  // encrypting the password before saving to database
  const salt = await bcrypt.genSalt(10);
  let hashpassword = await bcrypt.hash(password, salt);

 
  try {
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashpassword,
      age
    });

    let token = await user.getJWTToken()

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: false
    })

    await user.save();
    res.status(201).json({ message: "User Created Successfully", user: user })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// POST/ Login
route.post("/api/v1/login", async (req, res) => {
  let { email, password } = req.body
  try {

    let hasToken = req.cookies.token
    if (hasToken) res.status(400).json({ message: "User Already Logged In!!" })

    const user = await User.findOne({ email }).select("+password")
    if (!user) res.status(404).json({ message: "Invalid Credentials" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) res.status(401).json({ message: "Invalid Credentials" })

    let token = await user.getJWTToken()

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

export default route

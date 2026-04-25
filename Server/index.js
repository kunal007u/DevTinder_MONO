// Entery Point
// create a server using express
import express from 'express';
import DBConnection from './src/config/database.js';
import { User } from './src/models/User.js';
import bcrypt, { hash } from 'bcrypt';
import { validateSignupData } from './src/utils/validateSignupData.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());// Middleware to parse JSON request body

//GET / User by Email
app.get("/user/getUserByEmail/v1", async (req, res) => {

  try {
    const user = await User.find({ email: req.query.email })
    if (!user) res.status(404).json({ message: "User Not Found" })
    res.status(201).json({ user: user })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

//GET / getAllUsers 
app.get("/user/getAllUsers/v1", async (req, res) => {

  try {
    const getUsers = await User.find({})
    if (getUsers.length === 0) res.status(404).json({ message: "No User In Database" })
    res.status(201).json({ user: getUsers })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// POST/ Signup
app.post("/user/signup/v1", async (req, res) => {
  let {firstName, lastName, email, password, age, gender} = req.body
  // Validating the data coming from the client before processing it
  validateSignupData (req.body)
  
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
    await user.save();
    // Send a response back to the client with the created user object
    res.status(201).json({ message: "User Created Successfully", user: req.body })
  }
  catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// DELETE/ User by ID
app.delete("/user/deleteUser/v1/:userID", async (req, res) => {
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
app.patch("/user/UpdateUser/v1/:userID", async (req, res) => {
  try {
    // let allowedUpdates = ["age", "gender"]
    // const isAllowed = Object.keys(req.body).every((k) => allowedUpdates.includes(k))

    // if(!isAllowed){
    //   throw new Error("update not allowed")
    // }


    const user = await User.findByIdAndUpdate({ "_id": req.params?.userID }, req.body,{
      runValidators: true,
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

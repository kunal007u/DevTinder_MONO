import express from 'express';
import { authMiddelware } from '../middleWares/auth.middleware.js';
import { User } from '../models/User.js';

const route = express.Router();

//GET / getAllUsers 
route.get("/api/v1/users/", authMiddelware, async (req, res) => {

  try {
    const users = await User.find({})
    if (users.length === 0) res.status(404).json({ message: "No User In Database" })
    res.status(201).json({ users, message: "Response successfull" })

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
})

// DELETE/ User by ID
route.delete("/api/v1/users/:id", authMiddelware, async (req, res) => {
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
route.patch("/api/v1/users/:id", authMiddelware, async (req, res) => {

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


//GET / User by Email
route.get("/api/v1/userByEmail/", authMiddelware, async (req, res) => {
    let email = req.body
    try {
        const user = await User.find({ email })
        if (!req.user) res.status(404).json({ message: "User Not Found" })
        res.status(201).json(req.user)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message })
    }
})


export default route
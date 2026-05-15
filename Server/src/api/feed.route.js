
import express from "express";
import { json, z } from "zod";
import { Connection } from "../models/connection.js";
import { authMiddleware } from "../middleWares/auth.middleware.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/api/v1/feed", authMiddleware, async (req, res) => {
    const { user } = req;
    try {
        const loggedInUserId = req.user.id;

        // 1. Fetch exisiting connections 
        const existingConnections = await Connection.find({
            $or: [
                { loggedInUserId: user._id },
                { randomPersonId: user._id },
            ],
        });
            
        // 2. Use set data structure to store the IDs of users that the logged-in user has already connected with
        const connectedUserIds = new Set();
        existingConnections.forEach((connection) => {
            connectedUserIds.add(connection.loggedInUserId);
            connectedUserIds.add(connection.randomPersonId);
        });
        
        // 3. Fetch users that the logged-in user has not connected with yet
        const usersToConnect = await User.find({
            _id: { $ne: loggedInUserId, $nin: Array.from(connectedUserIds) },
        })

        return res.status(200).json({
            success: true,
            data: usersToConnect,
        });
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ message: "Internal server error" });
    }
})

export default router;
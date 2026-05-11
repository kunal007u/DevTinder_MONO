import express from 'express';
import { Connection } from '../models/connection.js';
import { authMiddelware } from '../middleWares/auth.middleware.js';
import { z } from 'zod';
import { User } from '../models/User.js';

/* 
    Model: Connection
    Fields:
    - senderUserId: ObjectId (Reference to User model)
    - receiverUserId: ObjectId (Reference to User model)
    - status: String (Enum: "interseted", "accepted", "rejected", "ignore")
*/

const route = express.Router();



const connectionSchema = z.object({
    status: z.enum(["interseted", "ignore"])
})

// POST/ Create Request
route.post("/api/v1/request/:status/:receiverUserId", authMiddelware, async (req, res) => {
    const { status, receiverUserId } = req.params;
    const senderUserId = req.user.id;

    try {
        // 1. Validate that the sender is not trying to connect with themselves
        if (senderUserId === receiverUserId) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself" });
        }

        // Validate the request body using Zod schema
        connectionSchema.parse({ status });

        // 2. Check if the receiver user exists in the database
        const receiverUser = await User.findById(receiverUserId);
        if (!receiverUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if a connection request already exists between the sender and receiver

        const existingConnection = await Connection.findOne({
            $or: [
                { senderUserId: req.user.id, receiverUserId: receiverUserId },
                { senderUserId: receiverUserId, receiverUserId: req.user.id }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ message: "Connection request already exists between these users" });
        }

        // Create a new connection request
        const newConnection = new Connection({
            senderUserId: req.user.id,
            receiverUserId: receiverUserId,
            status: status
        });

        await newConnection.save();
        res.status(201).json({ message: "Connection request created successfully", connection: newConnection });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: "Invalid request data", errors: error });
        }
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// GET/ Get All Requests for the authenticated user
route.get("/api/v1/requests", authMiddelware, async (req, res) => {
  
    /**
     * If user kk sending the request to user rahul then only rahul should see the request upon calling the GET /api/v1/requests endpoint. And kk should not see the request in his GET /api/v1/requests endpoint.
     * So, we need to filter the connection requests based on the receiverUserId field in the Connection model. We should only return the connection requests where the receiverUserId matches the authenticated user's ID (req.user.id). This way, only the user who is receiving the connection request will see it in their GET /api/v1/requests endpoint, and the sender will not see it in their GET /api/v1/requests endpoint.
     * now rahul can preview those request one by one clicking them so we need one more API to get the details of the sender user (kk) when rahul click on the request. So, we can create another API endpoint GET /api/v1/request/:senderUserId to get the details of the sender user (kk) when rahul click on the request.
    */
    try {
        const data = await Connection.find({
            status: "interseted",
            $or: [
                { receiverUserId: req.user.id } 
            ]
        })

        if (data.length === 0) {
            return res.status(404).json({ message: "No connection request found"});
        }
        res.status(200).json({ data });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})

// GET/ Preview Sender User Details
route.get("/api/v1/request/:senderUserId", authMiddelware, async (req, res) => {
    const { senderUserId } = req.params;

    try {
        let senderUser = await User.findById(senderUserId).select("-password -email -createdAt -updatedAt -__v");

        if (!senderUser) {
            return res.status(404).json({ message: "Sender user not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
})
export default route;

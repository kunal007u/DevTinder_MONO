import express from "express";
import { z } from "zod";

import { Connection } from "../models/connection.js";
import { User } from "../models/User.js";
import { authMiddleware } from "../middleWares/auth.middleware.js";

const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                                VALIDATIONS                                 */
/* -------------------------------------------------------------------------- */

const sendRequestSchema = z.object({
    status: z.enum(["interested", "ignored"]),
});

const reviewRequestSchema = z.object({
    status: z.enum(["accepted", "rejected"]),
});

/* -------------------------------------------------------------------------- */
/*                        SEND CONNECTION REQUEST                             */
/* -------------------------------------------------------------------------- */

router.post("/api/v1/connection-request/:status/:randomPersonId", authMiddleware, async (req, res) => {
    try {
        const { status, randomPersonId } = req.params;
        const senderUserId = req.user.id;

        // Validate status
        sendRequestSchema.parse({ status });

        // Check that random person is even exist in out database or no 
        const receiverUser = await User.findById(randomPersonId);

        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: "Receiver user not found",
            });
        }

        // Check existing connection
        const existingConnection = await Connection.findOne({
            $or: [
                {
                    loggedInUserId,
                    randomPersonId,
                },
                {
                    loggedInUserId: randomPersonId,
                    randomPersonId: loggedInUserId,
                },
            ],
        });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: "Connection already exists",
            });
        }

        // Create connection
        const connection = await Connection.create({
            loggedInUserId,
            randomPersonId,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Connection request sent successfully",
            data: connection,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
);

/* -------------------------------------------------------------------------- */
/*                         GET PENDING REQUESTS                               */
/* -------------------------------------------------------------------------- */

router.get("/api/v1/pending-requests", authMiddleware, async (req, res) => {
    try {
        const requests = await Connection.find({
            loggedInUserId: req.user.id,
            status: "interested",
        }).populate(
            "loggedInUserId",
            "firstName lastName age gender profilePicture skills location"
        );

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


/* -------------------------------------------------------------------------- */
/*                    ACCEPT / REJECT CONNECTION                              */
/* -------------------------------------------------------------------------- */

router.post("/api/v1/review-request/:status/:randomPersonId", authMiddleware, async (req, res) => {
    try {
        const { status, senderUserId } = req.params;

        // Validate status
        reviewRequestSchema.parse({ status });

        const connection = await Connection.findOne({
            randomPersonId,
            loggedInUserId: req.user.id,
            status: "interested",
        });

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Connection request not found",
            });
        }

        connection.status = status;

        await connection.save();

        return res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            data: connection,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: error.errors[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
);

/* -------------------------------------------------------------------------- */
/*                           GET ALL CONNECTIONS                              */
/* -------------------------------------------------------------------------- */

router.get("/api/v1/connections", authMiddleware, async (req, res) => {
    try {
        const connections = await Connection.find({
            status: "accepted",
            $or: [
                { randomPersonId: req.user.id },
                { loggedInUserId: req.user.id },
            ],
        })
            .populate(
                "randomPersonId",
                "firstName lastName age gender profilePicture skills location"
            )
            .populate(
                "loggedInUserId",
                "firstName lastName age gender profilePicture skills location"
            );

        return res.status(200).json({
            success: true,
            count: connections.length,
            data: connections,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
);

export default router;
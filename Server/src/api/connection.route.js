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

router.post("/api/v1/connection-request/:status/:receiverUserId", authMiddleware, async (req, res) => {
    try {
        const { status, receiverUserId } = req.params;
        const senderUserId = req.user.id;

        // Validate status
        sendRequestSchema.parse({ status });

        // Prevent self request
        if (senderUserId === receiverUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot send a request to yourself",
            });
        }

        // Check receiver exists
        const receiverUser = await User.findById(receiverUserId);

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
                    senderUserId,
                    receiverUserId,
                },
                {
                    senderUserId: receiverUserId,
                    receiverUserId: senderUserId,
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
            senderUserId,
            receiverUserId,
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
            receiverUserId: req.user.id,
            status: "interested",
        }).populate(
            "senderUserId",
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
}
);

/* -------------------------------------------------------------------------- */
/*                        PROFILE PREVIEW API                                 */
/* -------------------------------------------------------------------------- */

router.get("/api/v1/request/profile-preview/:senderUserId", authMiddleware, async (req, res) => {
    try {
        const { senderUserId } = req.params;

        // Find pending request
        const connection = await Connection.findOne({
            senderUserId,
            receiverUserId: req.user.id,
            status: "interested",
        }).populate(
            "senderUserId",
            "firstName lastName age gender profilePicture skills location"
        );

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: "Request not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: connection.senderUserId,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
);

/* -------------------------------------------------------------------------- */
/*                    ACCEPT / REJECT CONNECTION                              */
/* -------------------------------------------------------------------------- */

router.post("/api/v1/review-request/:status/:senderUserId", authMiddleware, async (req, res) => {
    try {
        const { status, senderUserId } = req.params;

        // Validate status
        reviewRequestSchema.parse({ status });

        const connection = await Connection.findOne({
            senderUserId,
            receiverUserId: req.user.id,
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
                { senderUserId: req.user.id },
                { receiverUserId: req.user.id },
            ],
        })
            .populate(
                "senderUserId",
                "firstName lastName age gender profilePicture skills location"
            )
            .populate(
                "receiverUserId",
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
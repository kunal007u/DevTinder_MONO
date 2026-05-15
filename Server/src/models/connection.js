import mongoose from "mongoose";
const { Schema } = mongoose;

const connectionSchema = new Schema({
    senderUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true 
    },
    receiverUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true 
    },
    status: {
        type: String,
        enum: ["ignore","interested", "accepted", "rejected"],
        message: "Status must be either 'interseted', 'accepted', 'rejected' or 'ignore'"
    }
   
}, { timestamps: true });

connectionSchema.pre("save", function(){
    const connection = this;
    if (connection.senderUserId.equals(connection.receiverUserId)){
        return res.status(400).json({ message: "Sender and Receiver cannot be the same user" });
    }
})

export const Connection = mongoose.model("Connection", connectionSchema)
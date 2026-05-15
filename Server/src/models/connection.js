import mongoose from "mongoose";
const { Schema } = mongoose;

const connectionSchema = new Schema({
    loggedInUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true 
    },
    randomPersonId: {
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
    if (connection.loggedInUserId.equals(connection.randomPersonId)){
        return res.status(400).json({ message: "Sender and Receiver cannot be the same user" });
    }
})

export const Connection = mongoose.model("Connection", connectionSchema)
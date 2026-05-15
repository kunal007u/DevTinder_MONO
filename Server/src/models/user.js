// This file defines User schema and model using Mongoose
import mongoose from "mongoose";
import validator from "validator"
import jwt from "jsonwebtoken"

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        maxlength: 255
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Auto-sanitizer
        trim: true,      // Auto-sanitizer
        // custome validation 
        validate(v) {
            if (!validator.isEmail(v)) {
                throw new Error("Invalid Email Format" + v)
            }
        },

    },
    password: {
        type: String,
        required: true,
        select: false // Automatically excludes field from query results
    },
    age: {
        type: Number,
    },
    gender: {
        type: String
    },
    profilePicture: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: 500
    },
    skills: {
        type: [String]
    },
    location: {
        type: String
    }
}, {
     timestamps: true,
 })


userSchema.methods.getJWTToken = function () {
    let user = this
    let secrate_key = process.env.JWT_SECRET_KEY
    let token = jwt.sign({ id: user._id }, secrate_key, { expiresIn: "1h" })
    return token
}

export const User = mongoose.model("User", userSchema)
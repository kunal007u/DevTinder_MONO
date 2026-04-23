// This file defines User schema and model using Mongoose
import mongoose from "mongoose";
import validator from "validator"
const { Schema } = mongoose;


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 30
    },
    lastName: {
        type: String,
        minLength: 30,
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
        type: [String]
    }
});

export const User = mongoose.model("User", userSchema)
// This file defines User schema and model using Mongoose
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 30
    },
    lastName:{
        type: String,
        minLength: 30,
        maxlength: 255
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true, // Auto-sanitizer
        trim: true,      // Auto-sanitizer
        // custome validation 
        validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: props => `${props.value} is not a valid email!`
        }

    },
    password:{
        type: String,
        required: true,
        select: false // Automatically excludes field from query results
    },
    age:{
        type: Number,
    },
    gender:{
        type: [String]
    }
});

export const User = mongoose.model("User", userSchema)
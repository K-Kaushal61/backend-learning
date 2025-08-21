import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { useReducer } from "react";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true // if searching will be done, set it as true so that searching can be optimized
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String, // third-party file uploading site provided URL will be used
            required: true,
        },
        coverImage: {
            type: String, // third-party file uploading site provided URL will be used
        },
        watchHistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Password is Required"]
        },
        refreshToken: {
            type: String
        }

    }, 
    {timestamps: true}
)

userSchema.pre("save", async function (next) { // pre hook to do something before saving, or whatever is specified
    if(!this.isModified("password")) return next(); // hash password only when password field is modified

    this.password = bcrypt.hash(this.password, 10) // to hash the password based on the number(10) of rounds specified, before saving it
    next() // necessary called, to pass it to the next controller or middleware
})

userSchema.methods.isPasswordCorrect = async function (password){ // custom method to check password
    return await bcrypt.compare(password, this.password) // to check user password(string) === hash stored password
}

userSchema.methods.generateAccessToken = function () { // generate Access Token -> to validate the API request for the database
    return jwt.sign(
            {
                // payload given to jwt : data from database
                _id: this._id, // id given from MongoDB
                email: this.email,
                username: this.username,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )   
}

userSchema.methods.generateRefreshToken = function () { // generate Refresh Token -> to generate new Access Token when expired 
    return jwt.sign(
            {
                // payload given to jwt : data from database
                _id: this._id, // id given from MongoDB
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )   
}


export const User = mongoose.model("User", userSchema)
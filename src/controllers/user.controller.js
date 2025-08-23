import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// handles the client request -> no error ? ok report : middleware takes over

const resgisterUser = asyncHandler( async (req, res) => {

    // BASIC/COMMON STEPS FOR REGISTERING A USER:
        // get user details from frontend -> depends on the data model you made
        // validation of data - not empty and more......
        // check if user alreafy exists -> username, email
        // check for images -> avatar
        // upload them to cloudinary -> check avatar
        // create user object - create entry in DB
        // remove password and refresh token field from response
        // check for user creation
        // return response

    const {fullName, email, username, password} = req.body

    if (
        [fullName, email, username, password].some( (field) => field?.trim() === "" ) // many such validation conditions can be checked
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{ email: req.body.email }, { username: req.body.username }]
    });

    if (existingUser) {
    // console.log("Checking for existing user with: ", req.body.email, req.body.username);
    // console.log("Found user: ", req.body.username);

    throw new ApiError(409, "Email or Username already exists."); 
    }


    const avatarLocalPath = req.files?.avatar[0]?.path; // local path is taken from fronten of file
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required.") // check for avatar file
    }

    const avatar = await uploadCloudinary(avatarLocalPath) // file can take time to upload
    const coverImage = await uploadCloudinary(coverImageLocalPath) // file can take time to upload

    if (!avatar) {
        throw new ApiError(400, "Avatar is required.")
    }

    const user = await User.create({ // create new user in DB
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", // if provided give url or leave empty
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select( // fetching the new created user 
        "-password -refreshToken" // by default all fields are selected to subtract the unwanted ones
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user.")
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered")
    )

})

export {resgisterUser}
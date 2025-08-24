import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import { uploadCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// handles the client request -> no error ? ok report : middleware takes over

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken // assign it to the refresh token field of the user model
        await user.save({ validateBeforeSave: false }) // save refresh token in data -> no validation so that other required fields are not checked

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token.")
    }
}

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

const loginUser = asyncHandler( async (req, res) => {

    // take data from user
    // username or email check
    // verify registered data
    // password check
    // access token and refresh generate
    // send cookie
    // user login done

    const {email, username, password} = req.body;

    if(!(username && email)){
        throw new ApiError(400, "Credentials incorrect");
    }

    const user = await User.findOne({  // User is from mongoose || user is the model we created
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User not found.")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Password incorrect.")
    }

    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") // check if calling DB again is expensive, update the existing object, if not then do this step

    const options = {
        httpOnly: true,
        secure: false // is true -> only works for "https" -> for localenv, keep it false
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler( async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },

    )

    const options = {
        httpOnly: true,
        secure: false // is true -> only works for "https" -> for localenv, keep it false
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(
        200,
        {},
        "User logged out"
    ))

})

export {resgisterUser, loginUser, logoutUser}
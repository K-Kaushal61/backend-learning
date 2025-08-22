import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, //which url will be allowed to talk to backend
    credentials: true
}))

app.use(express.json({ limit: "16kb" })) //to configure the type of data which will be dealt with
app.use(express.urlencoded({ extended: true, limit: "16kb" })) //to configure the type of data which will be dealt with
app.use(express.static("public")) // static assets
app.use(cookieParser())

// routes
import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter, ) // gives control further to userRouter route / makes it as a prefix in the url
//http://localhost:8000/api/v1/users/(userRouter)

export { app }
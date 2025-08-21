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

export { app }
import { Router } from "express";
import { loginUser, logoutUser, resgisterUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../controllers/auth.middleware.js";

const router = Router();

router.route("/register").post( // makes the url as /api/v1/users/resgister -> multiple can be made
    upload.fields([ // middleware is injected
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    resgisterUser
)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router;
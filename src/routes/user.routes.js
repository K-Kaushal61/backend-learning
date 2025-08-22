import { Router } from "express";
import { resgisterUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

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

export default router;
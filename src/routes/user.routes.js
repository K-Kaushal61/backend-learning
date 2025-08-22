import { Router } from "express";
import { resgisterUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(resgisterUser) // makes the url as /api/v1/users/resgister -> multiple can be made
// router.route("/login").post(login) ## makes the url as /api/v1/users/login -> multiple can be made


export default router;
import { Router } from "express";
import { UserLogin, UserProfile, UserSignUp } from "../Controler/User.js";
import { verifyToken } from "../Utiles/VerifyToken.js";

export const UserRouter = Router();

// signup route
UserRouter.route("/signup").post(UserSignUp);

// login route
UserRouter.route("/login").post(UserLogin);
UserRouter.route("/Profile").get(verifyToken, UserProfile);

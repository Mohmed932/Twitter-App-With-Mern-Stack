import { Router } from "express";
import {
  DeleteUserProfile,
  UpdateProfileInformation,
  UpdateUserProfile,
  UserLogin,
  UserProfile,
  UserSignUp,
} from "../Controler/User.js";
import { verifyToken } from "../Utiles/VerifyToken.js";
import { upload } from "../Utiles/Upload.js";

export const UserRouter = Router();

// signup route
UserRouter.route("/signup").post(UserSignUp);

// login route
UserRouter.route("/login").post(UserLogin);
UserRouter.route("/Profile").get(verifyToken, UserProfile);
// update the user profile photo
UserRouter.route("/UpdateProfileInformation").put(verifyToken,UpdateProfileInformation)
// update the user profile photo
UserRouter.route("/ProfileUpdatePhoto").put(
  verifyToken,
  upload.single("image"),
  UpdateUserProfile);

// Delete the user profile
UserRouter.delete("/delete", verifyToken, DeleteUserProfile);

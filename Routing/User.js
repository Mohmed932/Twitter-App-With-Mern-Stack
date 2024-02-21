import { Router } from "express";
import {
  ConfirmEmail,
  DeleteUserProfile,
  ResetPassword,
  SendEmailToResetPassword,
  UpdateProfileInformation,
  UpdateUserImageCover,
  UpdateUserImageProfile,
  UserLogin,
  UserProfile,
  UserSignUp,
} from "../Controler/User.js";
import { verifyToken } from "../Utiles/VerifyToken.js";
import { upload } from "../Utiles/Upload.js";
import { isValid } from "../Utiles/IsValid.js";

export const UserRouter = Router();

// signup route
UserRouter.route("/signup").post(UserSignUp);

// login route
UserRouter.route("/login").post(UserLogin);
UserRouter.route("/Profile").get(verifyToken, UserProfile);
// update the user profile photo
UserRouter.route("/UpdateProfileInformation").put(verifyToken,UpdateProfileInformation)
// update the user profile photo
UserRouter.route("/UpdateUserImageProfile").put(
  verifyToken,
  upload.single("image"),
  UpdateUserImageProfile);
  // update the user cover photo
UserRouter.route("/UpdateUserImageCover").put(
  verifyToken,
  upload.single("image"),
  UpdateUserImageCover);

// Delete the user profile
UserRouter.delete("/delete", verifyToken, DeleteUserProfile);

// conform email address
UserRouter.route("/Confirm_email/:id/confirm_token/:token").get(isValid,ConfirmEmail);

// send email to reset password
UserRouter.route("/send_email_to_reset_password").post(SendEmailToResetPassword);

//reset password
UserRouter.route("/reset_password/:id/confirm_token/:token").put(isValid,ResetPassword);
import { Router } from "express";
import {
  CheckLinkforResetPassword,
  ConfirmEmail,
  DeleteUserProfile,
  ResetPassword,
  SendEmailToResetPassword,
  StatusOfUser,
  // UpdatePassword,
  UpdateProfileInformation,
  UpdateUserImageCover,
  UpdateUserImageProfile,
  Update_Password,
  UserLogin,
  UserProfile,
  UserSignUp,
} from "../Controler/User.js";
import { verifyToken } from "../Middelware/VerifyToken.js";
import { upload } from "../Utiles/Upload.js";
import { isValid } from "../Middelware/IsValid.js";

export const UserRouter = Router();

// signup route
UserRouter.route("/signup").post(UserSignUp);

// login route
UserRouter.route("/login").post(UserLogin);
UserRouter.route("/Profile").get(verifyToken, UserProfile);
// update the user profile photo
UserRouter.route("/UpdateProfileInformation").put(
  verifyToken,
  UpdateProfileInformation
);
// update the user profile photo
UserRouter.route("/UpdateUserImageProfile").put(
  verifyToken,
  upload.single("image"),
  UpdateUserImageProfile
);
// update the user cover photo
UserRouter.route("/UpdateUserImageCover").put(
  verifyToken,
  upload.single("image"),
  UpdateUserImageCover
);

// Delete the user profile
UserRouter.delete("/delete", verifyToken, DeleteUserProfile);

// conform email address
UserRouter.route("/Confirm_email/:id/confirm_token/:token").get(
  isValid,
  ConfirmEmail
);

// send email to reset password
UserRouter.route("/send_email_to_reset_password").post(
  SendEmailToResetPassword
);

//reset password
UserRouter.route("/reset_password/:id/confirm_token/:token")
  .get(isValid, CheckLinkforResetPassword)
  .put(isValid, ResetPassword);
//Update password
UserRouter.route("/Update_password").put(verifyToken, Update_Password);

// check user if i follow or he in follow waiting for me
UserRouter.route("/StatusOfUser/:id").get(verifyToken, StatusOfUser);

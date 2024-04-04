import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import {
  AcceptFollowRequests,
  CancelFollow,
  CancelFollowRequests,
  CancelFollowers,
  GetFolloweRequests,
  GetFollowers,
  GetFollowing,
  SendFollowRequests,
  UnFollowRequests,
  UserProfile,
  getUsers,
} from "../Controler/UserInformation.js";
import { isValid } from "../Middelware/IsValid.js";

export const UserInformation = Router();

UserInformation.route("/users").get(verifyToken, getUsers);
UserInformation.route("/users/Following/:username").get(
  verifyToken,
  GetFollowing
);
UserInformation.route("/users/followers/:username").get(
  verifyToken,
  GetFollowers
);
UserInformation.route("/users/GetFolloweRequests").get(
  verifyToken,
  GetFolloweRequests
);
UserInformation.route("/users/sendfollowRequests/:id").put(
  isValid,
  verifyToken,
  SendFollowRequests
);
UserInformation.route("/users/AcceptFollowRequest/:id").put(
  isValid,
  verifyToken,
  AcceptFollowRequests
);
UserInformation.route("/users/CancelFollow/:id").put(
  isValid,
  verifyToken,
  CancelFollow
);
UserInformation.route("/users/CancelFollowers/:id").put(
  isValid,
  verifyToken,
  CancelFollowers
);
UserInformation.route("/users/CancelFollowRequests/:id").put(
  isValid,
  verifyToken,
  CancelFollowRequests
);
UserInformation.route("/users/UnFollowRequests/:id").put(
  isValid,
  verifyToken,
  UnFollowRequests
);
UserInformation.route("/users/UserProfile/:username").get(
  verifyToken,
  UserProfile
);

import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import {
  AcceptFollowRequests,
  CancelFollow,
  CancelFollowRequests,
  GetFolloweRequests,
  GetFollowers,
  GetFollowing,
  SendFollowRequests,
  getUsers,
} from "../Controler/UserInformation.js";
import { isValid } from "../Middelware/IsValid.js";

export const UserInformation = Router();

UserInformation.route("/users").get(verifyToken, getUsers);
UserInformation.route("/users/Following/:id").get(isValid,verifyToken, GetFollowing);
UserInformation.route("/users/followers/:id").get(isValid,verifyToken, GetFollowers);
UserInformation.route("/users/GetFolloweRequests/:id").get(isValid,verifyToken, GetFolloweRequests);
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
UserInformation.route("/users/CancelFollowRequests/:id").put(
  isValid,
  verifyToken,
  CancelFollowRequests
);

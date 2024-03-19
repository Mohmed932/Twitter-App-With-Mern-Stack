import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import {
  AcceptFollowRequests,
  GetFollowers,
  GetFollowing,
  SendFollowRequests,
  getUsers,
} from "../Controler/UserInformation.js";
import { isValid } from "../Middelware/IsValid.js";

export const UserInformation = Router();

UserInformation.route("/users").get(verifyToken, getUsers);
UserInformation.route("/users/Following/:id").get(verifyToken, GetFollowing);
UserInformation.route("/users/followers/:id").get(verifyToken, GetFollowers);
UserInformation.route("/users/followRequests/:id").put(
  isValid,
  verifyToken,
  SendFollowRequests
);
UserInformation.route("/users/AcceptFollowRequest/:id").put(
  isValid,
  verifyToken,
  AcceptFollowRequests
);

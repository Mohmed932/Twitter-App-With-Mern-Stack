import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import {
  AcceptFollowRequests,
  SendFollowRequests,
  getUsers,
} from "../Controler/UserInformation.js";
import { isValid } from "../Middelware/IsValid.js";

export const UserInformation = Router();

UserInformation.route("/users").get(verifyToken, getUsers);
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

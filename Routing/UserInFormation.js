import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import { getUsers } from "../Controler/UserInformation.js";

export const UserInformation = Router();

UserInformation.route("/users").get(verifyToken, getUsers);

import { Router } from "express";
import { verifyToken } from "../Middelware/VerifyToken.js";
import { GetNotifications } from "../Controler/Notifications.js";

export const NotificationsRouter = Router();

NotificationsRouter.route("/notifications").get(verifyToken, GetNotifications);

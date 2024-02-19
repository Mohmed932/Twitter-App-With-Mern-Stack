import { Router } from "express";
import {
  CreateComment,
  DeleteComment,
  GetComment,
  UpdateComment,
} from "../Controler/Comments.js";
import { isValid } from "../Utiles/IsValid.js";
import { verifyToken } from "../Utiles/VerifyToken.js";

export const CommentRouter = Router();

CommentRouter.route("/post/comments/:id")
  .get(isValid, verifyToken, GetComment)
  .post(isValid, verifyToken, CreateComment)
  .delete(isValid, verifyToken, DeleteComment)
  .put(isValid, verifyToken, UpdateComment);

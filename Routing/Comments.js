import { Router } from "express";
import {
  CreateComment,
  DeleteComment,
  GetComment,
  UpdateComment,
} from "../Controler/Comments.js";
import { isValid } from "../Middelware/IsValid.js";
import { verifyToken } from "../Middelware/VerifyToken.js";

export const CommentRouter = Router();

CommentRouter.route("/post/comments/:id")
  .get(isValid, verifyToken, GetComment)
  .post(isValid, verifyToken, CreateComment)
  .delete(isValid, verifyToken, DeleteComment)
  .put(isValid, verifyToken, UpdateComment);

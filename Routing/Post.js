import { Router } from "express";
import { upload } from "../Utiles/Upload.js";
import {
  CreatePost,
  DeletePost,
  GetPosts,
  SinglePost,
  ToggleLike,
  UpdatePost,
} from "../Controler/Post.js";
import { verifyToken } from "../Middelware/VerifyToken.js";
import { isValid } from "../Middelware/IsValid.js";

export const PostRouter = Router();

PostRouter.route("/createpost").post(
  verifyToken,
  upload.single("image"),
  CreatePost
);
PostRouter.route("/posts").get(GetPosts);
PostRouter.route("/posts/:id")
  .get(isValid, SinglePost)
  .put(isValid, verifyToken, upload.single("image"), UpdatePost)
  .delete(isValid, verifyToken, DeletePost);
PostRouter.route("/post/likes/:id").put(isValid, verifyToken, ToggleLike);

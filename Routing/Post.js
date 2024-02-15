import { Router } from "express";
import { verifyToken } from "../Utiles/VerifyToken.js";
import { upload } from "../Utiles/Upload.js";
import {
  CreatePost,
  DeletePost,
  GetPosts,
  SinglePost,
  ToggleLike,
  UpdatePost,
  UpdatePostImage,
} from "../Controler/Post.js";
import { isValid } from "../Utiles/IsValid.js";

export const PostRouter = Router();

PostRouter.route("/createpost").post(
  verifyToken,
  upload.single("image"),
  CreatePost
);
PostRouter.route("/posts").get(GetPosts);
PostRouter.route("/posts/:id")
  .get(isValid, SinglePost)
  .put(isValid, verifyToken, UpdatePost)
  .delete(isValid, verifyToken, DeletePost);
PostRouter.route("/post/image/:id").put(
  isValid,
  verifyToken,
  upload.single("image"),
  UpdatePostImage
);
PostRouter.route("/post/likes/:id").put(isValid, verifyToken, ToggleLike);

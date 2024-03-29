import { Router } from "express";
import { upload } from "../Utiles/Upload.js";
import {
  CreatePost,
  DeletePost,
  GetPostSaved,
  GetPosts,
  GetPostsprofile,
  SinglePost,
  ToggleLike,
  ToggleSavePost,
  UpdatePost,
  getInteractions,
} from "../Controler/Post.js";
import { verifyToken } from "../Middelware/VerifyToken.js";
import { isValid } from "../Middelware/IsValid.js";

export const PostRouter = Router();

PostRouter.route("/createpost").post(
  verifyToken,
  upload.single("image"),
  CreatePost
);
PostRouter.route("/posts").get(verifyToken,GetPosts);
PostRouter.route("/posts/porfile").get(verifyToken,GetPostsprofile);
PostRouter.route("/posts/postsaved").get(verifyToken,GetPostSaved);
PostRouter.route("/posts/:id")
  .get(isValid, SinglePost)
  .put(isValid, verifyToken, upload.single("image"), UpdatePost)
  .delete(isValid, verifyToken, DeletePost);
  
PostRouter.route("/post/Interactions/:id").get(isValid, verifyToken,getInteractions);
PostRouter.route("/post/likes/:id").put(isValid, verifyToken, ToggleLike);
PostRouter.route("/post/ToggleSavePost/:id").put(isValid, verifyToken, ToggleSavePost);

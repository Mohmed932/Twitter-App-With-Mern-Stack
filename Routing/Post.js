import {Router} from 'express';
import { verifyToken } from '../Utiles/VerifyToken.js';
import { upload } from '../Utiles/Upload.js';
import { CreatePost, DeletePost, GetPosts, SinglePost } from '../Controler/Post.js';

export const PostRouter = Router();

PostRouter.route("/createpost").post(verifyToken,upload.single("image"),CreatePost);
PostRouter.route('/posts').get(GetPosts)
PostRouter.route('/posts:id').get(SinglePost).delete(verifyToken,DeletePost)
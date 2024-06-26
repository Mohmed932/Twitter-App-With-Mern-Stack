import { Post } from "../Models/Post.js";
import fs from "fs";
import {
  DeletePhotos,
  Deleteimage,
  Uploadimage,
} from "../Utiles/Cloudinary.js";
import { Comments } from "../Models/Comments.js";
import { User } from "../Models/User.js";
import { CreateNotifications } from "../Controler/Notifications.js";

// create a new post
export const CreatePost = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  try {
    let post;
    if (req.file) {
      const result = await Uploadimage(`images/${req.file.filename}`);
      post = await Post.create({
        title: req.body.title,
        author: req.user._id,
        postImage: {
          url: result.secure_url,
          imageId: result.public_id,
        },
      });
      fs.unlinkSync(`images/${req.file.filename}`);
    } else {
      post = await Post.create({
        title: req.body.title,
        author: req.user._id,
      });
    }
    post._doc.author = {
      _id: user._id,
      imageProfile: user.imageProfile,
      name: user.name,
      surname: user.surname,
      username: user.username,
    };
    await post.save();
    (async () => {
      user.followers.map((userId) => {
        CreateNotifications(req, res, userId);
      });
    })();
    return res.json({ post });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error : ${error}` });
  }
};

// get all the posts
export const GetPosts = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    const posts = await Post.find().sort({ createdAt: -1 }).limit(10).populate({
      path: "author",
      select: "imageProfile name surname username _id",
      model: User,
    });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    for (const post of posts) {
      const isSaved = user.postSaved.includes(post._id);
      post._doc.isSaved = isSaved;
    }
    return res.json({ posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
// get all the posts for user profile
export const GetPostsprofile = async (req, res) => {
  try {
    const _id = req.params.id;
    const userPostSaved = await User.findOne({ _id });
    const posts = await Post.find({ author: userPostSaved._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "author",
        select: "imageProfile name surname username _id",
        model: User,
      });
    if (!userPostSaved || !posts) {
      return res.status(404).json({ message: "User or Posts Not Found" });
    }

    for (const post of posts) {
      const isSaved = userPostSaved.postSaved.includes(post._id);
      post._doc.isSaved = isSaved;
    }
    return res.json({ posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};
// get all the posts user saved
export const GetPostSaved = async (req, res) => {
  try {
    const _id = req.params.id;
    const userPostSaved = await User.findOne({ _id }, { postSaved: 1, _id: 0 });
    if (!userPostSaved) {
      return res.status(404).json({ message: "User or Posts Not Found" });
    }

    // استخدم map بدلاً من forEach لتحويل قيم postSaved إلى أسلوب String
    const PostsSaved = userPostSaved.postSaved.map((i) => i.toString());

    // استخدم قيمة PostsSaved في استعلام find
    const posts = await Post.find({ _id: { $in: PostsSaved } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "author",
        select: "imageProfile name surname username _id",
        model: "User",
      });
    for (const post of posts) {
      const isSaved = userPostSaved.postSaved.includes(post._id);
      post._doc.isSaved = isSaved;
    }
    return res.json({ posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

export const getInteractions = async (req, res) => {
  try {
    const _id = req.params.id;
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const { likes } = post;
    const usersInterAction = await User.find(
      { _id: { $in: likes } },
      { _id: 1, name: 1, surname: 1, username: 1, imageProfile: 1 }
    );
    const me = await User.findOne(
      { _id: req.user._id },
      { following: 1, allFollowRequestsISend: 1 },
      { new: true }
    );
    usersInterAction.map((i) => {
      const isfollowing = me.following.includes(i._id);
      const Requested = me.allFollowRequestsISend.includes(i._id);
      i._doc.isFollowing = isfollowing;
      i._doc.Requested = Requested;
    });
    return res.json(usersInterAction);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get  single post
export const SinglePost = async (req, res) => {
  try {
    const user = await Post.findOne({ _id: req.params.id });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// update post
export const UpdatePost = async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).json({ message: "Not Found" });
    }
    if (post.author.toString() === req.user._id || req.user.isAdmin) {
      if (!req.file) {
        const update = await Post.findByIdAndUpdate(
          { _id },
          {
            $set: {
              title: req.body.title,
            },
          },
          { new: true }
        );
        return res.json({ update });
      } else {
        console.log("Update image file");
        await Deleteimage(post.postImage.imageId);
        const result = await Uploadimage(`images/${req.file.filename}`);
        const update = await Post.findByIdAndUpdate(
          { _id },
          {
            $set: {
              title: req.body.title,
              postImage: {
                url: result.secure_url,
                imageId: result.public_id,
              },
            },
          },
          { new: true }
        );
        fs.unlinkSync(`images/${req.file.filename}`);
        return res.json({ update });
      }
    }
    return res
      .status(400)
      .json({ error: `you are not allowed to remove this post` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Internal Server Error:${error}` });
  }
};
// toggle likes
export const ToggleLike = async (req, res) => {
  try {
    const _id = req.params.id;
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).json({ message: "Not Found" });
    }
    const isliked = post.likes.find((i) => i.toString() === req.user._id);
    if (isliked) {
      const userPost = await Post.findByIdAndUpdate(
        { _id },
        {
          $pull: {
            likes: req.user._id,
          },
        },
        { new: true }
      );
      return res.json({ userPost });
    } else {
      const userPost = await Post.findByIdAndUpdate(
        { _id },
        {
          $push: {
            likes: req.user._id,
          },
        },
        { new: true }
      );
      return res.json({ userPost });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
// delete a post
export const DeletePost = async (req, res) => {
  try {
    const userPost = await Post.findOne({ _id: req.params.id });
    if (!userPost) {
      return res.status(400).json({
        message: "there is some thing worng; posts id removed or not found ",
      });
    }
    if (userPost.author.toString() === req.user._id || req.user.isAdmin) {
      await Post.findByIdAndDelete(userPost._id);
      await Comments.deleteOne({ PostId: userPost._id });
      DeletePhotos(userPost.postImage.imageId);
      return res.json({ message: "Post deleted successfully" });
    } else {
      return res.status(400).json({
        message: "you are not allowed to remove this post",
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const ToggleSavePost = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).json({ message: "user Not Found" });
    }
    const isSaved = user.postSaved.includes(_id);
    if (isSaved) {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { postSaved: _id } }
      );
      return res.json({ message: "Removed successfully" });
    } else {
      await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { postSaved: _id } }
      );
      return res.json({ message: "Saved successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

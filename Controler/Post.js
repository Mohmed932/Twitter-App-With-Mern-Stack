import { Post } from "../Models/Post.js";
import fs from "fs";
import { Deleteimage, Uploadimage } from "../Utiles/Cloudinary.js";
import { Comments } from "../Models/Comments.js";

// create a new post
export const CreatePost = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ message: "no file chossed" });
    }
    const result = await Uploadimage(`images/${req.file.filename}`);

    const user = await Post.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      author: req.user._id,
      postImage: {
        url: result.secure_url,
        imageId: result.public_id,
      },
    });
    fs.unlinkSync(`images/${req.file.filename}`);
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// get all the posts
export const GetPosts = async (req, res) => {
  try {
    const { category, page, limit } = req.query;
    if (page) {
      const user = await Post.find()
        .skip(page - 1 * limit)
        .sort({ created_at: -1 });
      return res.json({ user });
    } else if (category) {
      const user = await Post.find({ category }).sort({ created_at: -1 });
      return res.json({ user });
    } else {
      const user = await Post.find().sort({ created_at: -1 });
      return res.json({ user });
    }
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
      const update = await Post.findByIdAndUpdate(
        { _id },
        {
          $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
          },
        },
        { new: true }
      );
      return res.json({ update });
    }
  } catch (error) {}
};
// update post image
export const UpdatePostImage = async (req, res) => {
  const _id = req.params.id;
  try {
    if (!req.file) {
      return res.status(404).json({ message: "no file found" });
    }
    const post = await Post.findOne({ _id });
    if (!post) {
      return res.status(404).json({ message: "Not Found" });
    }
    if (post.author.toString() === req.user._id || req.user.isAdmin) {
      await Deleteimage(post.postImage.imageId);
      const result = await Uploadimage(`images/${req.file.filename}`);
      post.postImage = {
        url: result.secure_url,
        imageId: result.public_id,
      };
      await post.save();
      fs.unlinkSync(`images/${req.file.filename}`);
      return res.json({ post });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error ${error}` });
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
      await Comments.deleteOne({PostId: userPost._id});
      Deleteimage(userPost.postImage.imageId);
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
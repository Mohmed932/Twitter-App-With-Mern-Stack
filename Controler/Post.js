import { Post } from "../Models/Post.js";
import fs from "fs";
import { Deleteimage } from "../Utiles/Cloudinary.js";


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
    const user = await Post.find().sort({ created_at: -1 });
    return res.json({ user });
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

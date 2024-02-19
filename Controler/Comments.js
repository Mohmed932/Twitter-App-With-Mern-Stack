import { Comments } from "../Models/Comments.js";
import { Post } from "../Models/Post.js";
import { User } from "../Models/User.js";

export const CreateComment = async (req, res) => {
  try {
    const postId = await Post.findById(req.params.id);
    if (!postId) {
      return res.status(404).json({ message: "No such post or post deleted" });
    }
    const userId = await User.findById(req.user._id);
    const Comment = new Comments({
      PostId: postId._id,
      userId: userId._id,
      username: userId.username,
      text: req.body.text,
    });
    await Comment.save();
    return res.status(203).json({ Comment });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error :${error}` });
  }
};

export const GetComment = async (req, res) => {
  try {
    const Comment = await Comments.find({ PostId: req.params.id })
    if (!Comment) {
      return res
        .status(404)
        .json({ message: "No such comment or post deleted" });
    }
    return res.json({ Comment });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error :${error}` });
  }
};

export const DeleteComment = async (req, res) => {
  try {
    const Comment = await Comments.findById(req.params.id);
    if (!Comment) {
      return res
        .status(404)
        .json({ message: "No such comment or post deleted" });
    }
    if (Comment.userId.toString() !== req.user._id) {
      return res
        .status(400)
        .json({ message: "you are not allowed to delete this comment" });
    }
    await Comments.findByIdAndDelete(Comment._id);
    return res.json({ message: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdateComment = async (req, res) => {
  try {
    const Comment = await Comments.findById(req.params.id);
    if (!Comment) {
      return res
        .status(404)
        .json({ message: "No such comment or post deleted" });
    }
    if (Comment.userId.toString() !== req.user._id) {
      return res
        .status(400)
        .json({ message: "you are not allowed to delete this comment" });
    }
    const updateComment = await Comments.findByIdAndUpdate(Comment._id, {
      $set: {
        text: req.body.text,
      },
    });
    return res.json({ updateComment });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

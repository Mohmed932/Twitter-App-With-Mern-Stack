import { Comments } from "../Models/Comments.js";
import { Post } from "../Models/Post.js";
import { User } from "../Models/User.js";

export const CreateComment = async (req, res) => {
  try {
    const postId = await Post.findByIdAndUpdate(
      { _id: req.params.id },
      { $inc: { comments: 1 } }
    );
    if (!postId) {
      return res.status(404).json({ message: "No such post or post deleted" });
    }
    const userId = await User.findById(req.user._id);
    const Comment = new Comments({
      PostId: postId._id,
      userId: userId._id,
      username: userId.username,
      fullname: userId.name + " " + userId.surname,
      imageProfile: userId.imageProfile.sourceImage,
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
    const Comment = await Comments.find({ PostId: req.params.id }).sort({
      createdAt: -1,
    });
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
    await Post.findByIdAndUpdate(
      { _id: Comment.PostId },
      { $inc: { comments: -1 } }
    );
    const Commentinformation = await Comments.findByIdAndDelete(Comment._id);
    return res.json({ message: "deleted successfully", Commentinformation });
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
    const updateComment = await Comments.findByIdAndUpdate(
      Comment._id,
      {
        $set: {
          text: req.body.text,
        },
      },
      { new: true }
    );
    return res.json({ updateComment });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

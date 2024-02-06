import { Post } from "../Models/Post.js";
import fs from "fs"

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

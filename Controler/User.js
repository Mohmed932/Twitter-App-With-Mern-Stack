import fs from "fs";
import { User } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DeletePhotos, Deleteimage, Uploadimage } from "../Utiles/Cloudinary.js";
import { Comments } from "../Models/Comments.js";
import { Post } from "../Models/Post.js";

export const UserSignUp = async (req, res) => {
  const { username, password, email } = req.body;
  console.log(username, password, email);
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      let message;
      if (existingUser.username === username) {
        message = "This username already has an account";
      } else {
        message = "This email already has an account";
      }
      return res.json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const SaveUser = new User({ username, email, password: hash });
    await SaveUser.save();
    return res.json({
      message: "Congratulations, you now have an account. Please log in",
      userData: SaveUser,
    });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};
export const UserLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        message: "Sorry, there is no account with this username",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({
        message: "Incorrect username or password",
      });
    }
    const token = await jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
        date_birth: user.date_birth,
        imageProfile: user.imageProfile,
        imageCover: user.imageCover,
        isAdmin: user.isAdmin,
        isActive: user.isActive,
      },
      process.env.SCRECT_KEY
    );
    return res.json({
      message: "You have been logged in successfully",
      token,
    });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const UserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
      .select("-password")
      .populate("posts");
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const UpdateProfileInformation = async (req, res) => {
  try {
    const update = await User.findOneAndUpdate(
      { username: req.user.username },
      {
        $set: {
          gender: req.body.gender,
          bio: req.body.bio,
          date_birth: req.body.date_birth,
        },
      },
      { new: true }
    ).select("-password");
    return res.json({ update });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const UpdateUserProfile = async (req, res) => {
  try {
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.json({ message: "no file chossed" });
    }
    // upload photo to cloudinary server
    const result = await Uploadimage(`images/${req.file.filename}`);
    const user = await User.findOne(
      { username: req.user.username },
    ).select("-password");
    if (user.imageProfile.imageId !== null) {
      await Deleteimage(user.imageProfile.imageId);
    }
    user.imageProfile = {
      sourceImage: result.secure_url,
      imageId: result.public_id,
    };
    await user.save();
    fs.unlinkSync(`images/${req.file.filename}`);
    // Respond with a success message
    return res.json({ message: "File uploaded successfully!", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const DeleteUserProfile = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ username: req.user.username });
    const posts = await Post.deleteMany({ author: user._id });
    const imageIds = posts.map((i) => i.postImage.imageId);
    if (imageIds.length > 0) {
      DeletePhotos(imageIds);
    }
    await Comments.deleteMany({ userId: user._id });
    return res.json({ message: "account deleted", user });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

import fs from "fs";
import { User } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  DeletePhotos,
  Deleteimage,
  Uploadimage,
} from "../Utiles/Cloudinary.js";
import { Comments } from "../Models/Comments.js";
import { Post } from "../Models/Post.js";
import { GenerateToken } from "../Utiles/Random.js";
import { Veryfation } from "../Models/Veryfation.js";
import { SendMAil } from "../Utiles/Mail.js";

export const UserSignUp = async (req, res) => {
  const { name, surname, email, username, gender, date_birth, password } =
    req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      let message;
      if (existingUser.username === username) {
        message = "This username already has an account";
      } else {
        message = "This email already has an account";
      }
      return res.status(409).json({ message });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const SaveUser = new User({
      name,
      surname,
      email,
      username,
      gender,
      date_birth,
      password: hash,
    });
    await SaveUser.save();
    const token = await GenerateToken();
    const SendEmail = new Veryfation({
      userId: SaveUser._id,
      token,
    });
    await SendEmail.save();
    const linkVeryfation = `https://uber-swart.vercel.app/Confirm_email/${SaveUser._id}/confirm_token/${token}`;
    await SendMAil(
      linkVeryfation,
      SaveUser.email,
      name,
      surname,
      "Confirm email",
      "this link to Confirm your email address"
    );
    return res.json({
      message: "We send email to you please verify your email address",
    });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};
export const UserLogin = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
      return res.status(404).json({
        message: "Incorrect username or password",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(404).json({
        message: "Incorrect username or password",
      });
    }
    if (!user.isActive) {
      await Veryfation.deleteMany({ userId: user._id });
      const token = await GenerateToken();
      const SendEmail = new Veryfation({
        userId: user._id,
        token,
      });
      await SendEmail.save();
      const linkVeryfation = `https://uber-swart.vercel.app/Confirm_email/${user._id}/confirm_token/${token}`;
      await SendMAil(
        linkVeryfation,
        user.email,
        user.name,
        user.surname,
        "Confirm email",
        "this link to Confirm your email address"
      );
      return res.json({
        message: "We send email to you please verify your email address",
      });
    }
    const token = await jwt.sign(
      {
        _id: user._id,
        username: user.username,
        name: user.name,
        surname: user.surname,
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
      _id: user._id,
    });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const UserProfile = async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.user._id },
      {
        postSaved: 0,
        following: 0,
        followers: 0,
        password: 0,
        followRequests: 0,
        allFollowRequestsISend: 0,
      }
    );
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const UpdateProfileInformation = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      {
        $set: {
          name: req.body.name || "",
          surname: req.body.surname || "",
          gender: req.body.gender || "",
          bio: req.body.bio || "",
          date_birth: req.body.date_birth || "",
        },
      },
      {
        projection: {
          postSaved: 0,
          following: 0,
          followers: 0,
          password: 0,
          followRequests: 0,
          allFollowRequestsISend: 0,
        },
        new: true,
      }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ user, message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error ${error}` });
  }
};
export const Update_Password = async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.user.username },
      {
        postSaved: 0,
        following: 0,
        followers: 0,
        password: 0,
        followRequests: 0,
        allFollowRequestsISend: 0,
        // new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    user.password = hash;
    await user.save();
    return res.json({ user, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: `Internal Server Error ${error}` });
  }
};
export const UpdateUserImageProfile = async (req, res) => {
  try {
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.json({ message: "no file chossed" });
    }
    // upload photo to cloudinary server
    const result = await Uploadimage(`images/${req.file.filename}`);
    const user = await User.findOne(
      { username: req.user.username },
      {
        postSaved: 0,
        following: 0,
        followers: 0,
        password: 0,
        followRequests: 0,
        allFollowRequestsISend: 0,
      }
    );
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
export const UpdateUserImageCover = async (req, res) => {
  try {
    // Access the uploaded file via req.file
    if (!req.file) {
      return res.json({ message: "no file chossed" });
    }
    // upload photo to cloudinary server
    const result = await Uploadimage(`images/${req.file.filename}`);
    const user = await User.findOne(
      { username: req.user.username },
      {
        postSaved: 0,
        following: 0,
        followers: 0,
        password: 0,
        followRequests: 0,
        allFollowRequestsISend: 0,
      }
    );
    if (user.imageCover.imageId !== null) {
      await Deleteimage(user.imageCover.imageId);
    }
    user.imageCover = {
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

export const ConfirmEmail = async (req, res) => {
  try {
    const _id = req.params.id;
    const token = req.params.token;
    const user = await User.findOne({ _id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid link" });
    }
    const confirmUser = await Veryfation.findOne({
      userId: user._id,
      token,
    });
    if (!confirmUser) {
      return res.status(404).json({ message: "invalid token" });
    }
    user.isActive = true;
    await user.save();
    // Delete confirmation entry
    await Veryfation.deleteMany({ userId: user._id });

    return res.status(200).json({ message: "Email confirmed successfully" });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const SendEmailToResetPassword = async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
      return res.status(404).json({
        message: "This email or username does not have an account yet",
      });
    }
    await Veryfation.deleteMany({ userId: user._id });
    const token = await GenerateToken();
    const SendEmail = new Veryfation({
      userId: user._id,
      token,
    });
    await SendEmail.save();
    const linkVeryfation = `http://localhost:3000/reset_password/${user._id}/confirm_token/${token}`;
    // send to email
    await SendMAil(
      linkVeryfation,
      user.email,
      user.name,
      user.surname,
      "Resete Password",
      "this link to Resete Password from your email address"
    );
    user.isActive = true;
    await user.save();
    return res.json({
      message: "we send email confirmation to reset password",
    });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const CheckLinkforResetPassword = async (req, res) => {
  try {
    const _id = req.params.id;
    const token = req.params.token;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        message: "invalid token",
      });
    }
    const confirmUser = await Veryfation.findOne({
      userId: user._id,
      token,
    });
    if (!confirmUser) {
      return res.status(400).json({ message: "invalid token" });
    }
    return res.json({ message: "now you can reset password" });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const _id = req.params.id;
    const token = req.params.token;
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(400).json({
        message: "invalid token",
      });
    }
    const confirmUser = await Veryfation.findOne({
      userId: user._id,
      token,
    });
    if (!confirmUser) {
      return res.status(400).json({ message: "invalid token" });
    }
    const password = req.body.password;
    const Salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, Salt);
    user.password = hash;
    await user.save();
    await Veryfation.deleteMany({ userId: user._id });
    return res.json({ message: "password updated" });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const StatusOfUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id: req.user._id });
    const isFollowing = user.following.includes(_id);
    const Requested = user.allFollowRequestsISend.includes(_id);
    return res.json({ isFollowing, Requested });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

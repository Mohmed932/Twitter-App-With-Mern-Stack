import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      default: "male",
    },
    bio: {
      type: String,
      default: "male",
    },
    date_birth: {
      type: String,
      default: "25-5-2003",
    },
    imageProfile: {
      type: Object,
      default: {
        sourceImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        imageId: null,
      },
    },
    imageCover: {
      type: Object,
      default: {
        sourceImage:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png",
        imageId: null,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const User = model("User", UserSchema);

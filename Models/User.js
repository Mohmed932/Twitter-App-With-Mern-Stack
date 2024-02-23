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
      email: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "",
    },
    follower: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    date_birth: {
      type: String,
      required: true,
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("posts", {
  ref: "Post",
  foreignField: "author",
  localField: "_id",
});

export const User = model("User", UserSchema);

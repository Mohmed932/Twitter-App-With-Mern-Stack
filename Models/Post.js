import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      length: 1,
    },
    description: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    comments: {
      type: Number,
      default: 0,
    },
    postImage: {
      type: Object,
      default: {
        url: "",
        imageId: null,
      },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const Post = model("Post", PostSchema);

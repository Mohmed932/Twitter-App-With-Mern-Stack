import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
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

PostSchema.virtual("comments", {
  ref: "Comments",
  foreignField: "PostId",
  localField: "_id",
});
export const Post = model("Post", PostSchema);

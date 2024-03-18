import { Schema, model } from "mongoose";

const CommentsSchema = new Schema({
  PostId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  imageProfile: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

export const Comments = model("Comments", CommentsSchema);

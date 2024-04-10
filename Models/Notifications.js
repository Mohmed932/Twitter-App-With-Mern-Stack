import { Schema, model } from "mongoose";

const NotificationsSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export const Notifications = model("Notifications", NotificationsSchema);

import { Schema, model } from "mongoose";

const VeryfationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

export const Veryfation = model("Veryfation", VeryfationSchema);

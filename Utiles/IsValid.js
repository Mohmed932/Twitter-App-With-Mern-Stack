import mongoose from "mongoose";

const isValidObjectId = (_id) => {
  return mongoose.Types.ObjectId.isValid(_id);
};

export const isValid = (req, res, next) => {
  try {
    if (isValidObjectId(req.params.id)) {
      next();
    } else {
      return res.json({ message: "Invalid id" });
    }
  } catch (error) {
    return res.status(500).json({ error: `Internal Server Error : ${error}` });
  }
};

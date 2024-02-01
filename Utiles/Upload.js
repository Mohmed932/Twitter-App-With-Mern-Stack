import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "images");
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + req.user.username + "-" + +Date.now());
    },
  });
  
export const upload = multer({ storage });

export const renameSync = async ({ originalname, path }) => {
  const split = originalname.split(".");
  const ext = split[split.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);
  return newPath;
};
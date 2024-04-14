import multer from "multer";
// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// console.log(__filename); // Full path to the current file
// console.log(__dirname);  // Directory containing the current file

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    if (file) {
      const imagePath =
        file.fieldname +
        "_" +
        req.user.username +
        "_" +
        Date.now() +
        "_" +
        file.originalname;
      cb(null, imagePath);
    } else {
      cb(null, false);
    }
  },
});

export const upload = multer({ storage });

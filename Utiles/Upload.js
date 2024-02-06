import multer from "multer";
// import path from "path";

// const __filename = new URL(import.meta.url).pathname;
// const __dirname = path.dirname(__filename);
// const photopath = path.join(__dirname,'../images')
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
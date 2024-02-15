import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { config } from "dotenv";
import { UserRouter } from "./Routing/User.js";
import { PostRouter } from "./Routing/Post.js";
import { CommentRouter } from "./Routing/Comments.js";

config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(UserRouter);
app.use(PostRouter);
app.use(CommentRouter);

connect(process.env.MONGO_DB_URL)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `listening on ${process.env.PORT} And listening on Mongo Database`
      );
    });
  })
  .catch(() => {
    console.log("Error listening");
  });
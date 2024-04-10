import express from "express";
import cors from "cors";
import { connect } from "mongoose";
import { config } from "dotenv";
import { UserRouter } from "./Routing/User.js";
import { PostRouter } from "./Routing/Post.js";
import { CommentRouter } from "./Routing/Comments.js";
import { errorHandler } from "./Utiles/Error.js";
import { UserInformation } from "./Routing/UserInFormation.js";
import { SearchRouter } from "./Routing/Search.js";
import { NotificationsRouter } from "./Routing/Notifications.js";

const app = express();
config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(SearchRouter);
app.use(UserRouter);
app.use(NotificationsRouter);
app.use(PostRouter);
app.use(CommentRouter);
app.use(UserInformation);
app.use(errorHandler);
app.get("/", (req, res) => {
  return res.json({ message: "hello in uber" });
});

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

// any path route not found
app.use("*", (req, res) => res.json({ Message: "page not found" }));

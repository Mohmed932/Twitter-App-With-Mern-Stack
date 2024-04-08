import { Post } from "../Models/Post.js";
import { User } from "../Models/User.js";

export const SearchPeolpeByUsername = async (req, res) => {
  try {
    const { query } = req.query;
    const Search = query ? { username: { $regex: query, $options: "i" } } : {};
    const me = await User.findOne(
      { _id: req.user._id },
      { following: 1, allFollowRequestsISend: 1 },
      { new: true }
    );
    let users = await User.find(Search, {
      username: 1,
      name: 1,
      surname: 1,
      imageProfile: 1,
    }); // Assuming you have a Post model
    users.map((user) => {
      const isFollowing = me.following.includes(user._id);
      const Requested = me.allFollowRequestsISend.includes(user._id);
      user._doc.isFollowing = isFollowing;
      user._doc.Requested = Requested;
    });
    users = users.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const SearchPostsByTitle = async (req, res) => {
  try {
    const { query } = req.query;
    const Search = query ? { title: { $regex: query, $options: "i" } } : {};
    const userPostSaved = await User.findOne({ _id: req.user._id });
    const posts = await Post.find(Search)
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({
        path: "author",
        select: "imageProfile name surname username _id",
        model: User,
      });
    if (!userPostSaved) {
      return res.status(404).json({ message: "User Not Found" });
    }

    for (const post of posts) {
      const isSaved = userPostSaved.postSaved.includes(post._id);
      post._doc.isSaved = isSaved;
    }
    return res.json({ posts });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Internal Server Error" });
  }
};

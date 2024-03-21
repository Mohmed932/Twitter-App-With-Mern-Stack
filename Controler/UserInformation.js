import { User } from "../Models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 1, username: 1, name: 1, surname: 1, follower: 1, imageProfile: 1 }
    ).limit(10);
    return res.json({ users });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

export const SendFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findOneAndUpdate(
      { _id },
      { $push: { followRequests: req.user._id } },
      { new: true }
    ).select("followRequests");
    return res.json({ user });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};
export const AcceptFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { followRequests: _id }, $push: { followers: _id } },
      { new: true, select: "followers" }
    );
    await User.findOneAndUpdate(
      { _id },
      { $push: { following: req.user._id } },
      { new: true, select: "following" }
    );
    return res.json({ user: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const CancelFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    const CancelFollow = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { followRequests: _id } }
    );
    return res.json({ CancelFollow });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const GetFolloweRequests = async (req, res) => {
  try {
    const FolloweRequests = await User.findOne(
      { _id: req.user._id },
      { followRequests: 1 }
    );
    return res.json({ FolloweRequests });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const GetFollowing = async (req, res) => {
  try {
    const _id = req.params.id;
    const allFollowing = await User.findOne(
      { _id },
      { following: 1 },
      { new: true }
    );
    return res.json({ allFollowing });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const GetFollowers = async (req, res) => {
  try {
    const _id = req.params.id;
    const allFollowing = await User.findOne(
      { _id },
      { followers: 1 },
      { new: true }
    );
    return res.json({ Following: allFollowing });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};

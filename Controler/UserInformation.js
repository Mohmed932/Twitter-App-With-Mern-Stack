import { User } from "../Models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 1, username: 1, name: 1, surname: 1, imageProfile: 1 }
    ).limit(10);

    const { allFollowRequestsISend, following } = await User.findOne(
      { _id: req.user._id },
      { allFollowRequestsISend: 1, following: 1, _id: 0 }
    );

    const filteredFriendsSuggest = users.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );

    const all = filteredFriendsSuggest.map((user) => {
      user._doc.follow = false;
      allFollowRequestsISend.forEach((user_id) => {
        if (user._id.toString() === user_id._id.toString()) {
          user._doc.follow = true;
        }
      });
      return user;
    });

    const filteredAll = all.filter((i) => {
      let isFollowing = false;
      following.forEach((id) => {
        if (i._id.toString() === id._id.toString()) {
          isFollowing = true;
        }
      });
      return !isFollowing;
    });

    return res.json({ users: filteredAll });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export const SendFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    const { followRequests, followers } = await User.findOne(
      { _id },
      { followRequests: 1, followers: 1 }
    );
    // check if the user is already send a follow request
    const CheckFollowRequests = followRequests.includes(req.user._id);
    if (CheckFollowRequests) {
      return res.json({
        message:
          "You have already sent a follow-up request. Please wait until it is approved",
      });
    }
    // check if the user is already following a _id
    const CheckFollowers = followers.includes(req.user._id);
    if (CheckFollowers) {
      return res.json({
        message: "You are actually following it",
      });
    }
    await User.findByIdAndUpdate(req.user._id, {
      $push: { allFollowRequestsISend: _id },
    });
    await User.findByIdAndUpdate(
      _id,
      { $push: { followRequests: req.user._id } },
      { new: true }
    );
    return res.json({ message: "You are now send follow" });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};
export const AcceptFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    // check if _id is already sending a follow request
    const { followRequests } = await User.findOne(
      { _id: req.user._id },
      { followRequests: 1 }
    );
    const checkfollowRequests = followRequests.includes(_id);
    if (!checkfollowRequests) {
      return res.json({ message: "He did not send you a follow request" });
    }
    // pull _id from followRequests and push it into followers
    const AcceptFollowRequests = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { followRequests: _id }, $push: { followers: _id } },
      { followers: 1 },
      { new: true }
    );
    await User.findOneAndUpdate(
      { _id },
      {
        $push: { following: req.user._id },
        $pull: { allFollowRequestsISend: req.user._id },
      },
      { new: true }
    );
    return res.json({ AcceptFollowRequests });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const UnFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    // check if _id is already sending a follow request
    const { allFollowRequestsISend } = await User.findOne(
      { _id: req.user._id },
      { allFollowRequestsISend: 1 }
    );
    const checkallFollowRequestsISend = allFollowRequestsISend.includes(_id);
    if (!checkallFollowRequestsISend) {
      return res.json({ message: "He didn't send you a follow request" });
    }
    await User.findOneAndUpdate(
      { _id },
      { $pull: { followRequests: req.user._id } }
    );
    // pull _id from followRequests
    const UnFollowRequests = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { allFollowRequestsISend: _id } }
    );
    return res.json({ UnFollowRequests });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const CancelFollowRequests = async (req, res) => {
  try {
    const _id = req.params.id;
    // check if _id is already sending a follow request
    const { followRequests } = await User.findOne(
      { _id: req.user._id },
      { followRequests: 1 }
    );
    const checkfollowRequests = followRequests.includes(_id);
    if (!checkfollowRequests) {
      return res.json({ message: "He didn't send you a follow request" });
    }
    await User.findOneAndUpdate(
      { _id },
      { $pull: { allFollowRequestsISend: req.user._id } }
    );
    // pull _id from followRequests
    const CancelFollowRequests = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { followRequests: _id } }
    );
    return res.json({ CancelFollowRequests });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const CancelFollow = async (req, res) => {
  try {
    const _id = req.params.id;
    // check if _id is already in the following
    const { following } = await User.findOne(
      { _id: req.user._id },
      { following: 1 }
    );
    const Checkfollow = following.includes(_id);
    if (!Checkfollow) {
      return res.json({ message: "you are not allowed to unfollow " });
    }
    // pull _id from following
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { $pull: { following: _id } }
    );
    // pull req.user._id from followers
    await User.findOneAndUpdate(
      { _id },
      { $pull: { followers: req.user._id } }
    );
    await User.findOneAndUpdate({ _id }, { $pull: { followers: _id } });
    return res.json({ message: "Your follow request has been cancelled" });
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error}` });
  }
};
export const GetFolloweRequests = async (req, res) => {
  try {
    const { followRequests } = await User.findOne(
      { _id: req.user._id },
      { followRequests: 1, _id: 0 }
    );

    // تحويل قيمة followRequests إلى مصفوفة من معرفات الأشخاص
    const userIds = followRequests.map((request) => request.toString());

    const users = await User.find(
      { _id: { $in: userIds } },
      { username: 1, name: 1, surname: 1, imageProfile: 1 }
    );

    return res.json({ users });
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

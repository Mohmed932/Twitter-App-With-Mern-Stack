import { User } from "../Models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find(
      {},
      { _id: 1, username: 1, name: 1, surname: 1, follower: 1 }
    ).limit(10);
    return res.json({ users });
  } catch (error) {
    return res.json({ message: `Server Error: ${error}` });
  }
};

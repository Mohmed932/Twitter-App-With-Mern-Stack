import { Notifications } from "../Models/Notifications.js";
import { User } from "../Models/User.js";

export const GetNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.find({
      to: req.user._id,
    }).populate({
      path: "from",
      select: "imageProfile name surname username _id",
      model: User,
    });
    if (!notifications) {
      return res.status(404).json({ message: "Notifications Not Found" });
    }
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const CreateNotifications = async (req, res) => {
  try {
    const id = req.params.id;
    const notifications = new Notifications({
      from: req.user._id,
      to: id,
      text: req.body.text,
    });
    await notifications.save();
    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const DeleteNotifications = async (req, res) => {
  try {
    await Notifications.findOneAndDelete({
      from: req.user._id,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

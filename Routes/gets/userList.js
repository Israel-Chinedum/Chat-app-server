import { groupModel, userModel } from "../../Model/models.js";
import { User } from "../../verification.js";

export const userList = async (req, res) => {
  const { accessToken } = req.cookies;
  const currUser = User(accessToken)["user"];

  try {
    const users = await userModel.find({});
    const userGroups = await userModel.findOne({});
    const allUsers = users.filter((user) => user.chat_id != currUser.chat_id);

    const userList = [];

    for (let i of allUsers) {
      userList.push({ username: i["username"], chat_id: i["chat_id"] });
    }

    res.json({ userList, user: { username: currUser.username } });
  } catch (error) {
    res.status(500).json("An error occured!");
    console.log(error);
  }
};

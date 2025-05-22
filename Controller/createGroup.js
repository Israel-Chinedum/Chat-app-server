import { groupModel } from "../Model/models.js";
import { userGroups } from "./sendUserGroups.js";

export const createGroup = (socket, userId) => {
  socket.on("new-group", async ({ groupName, image }) => {
    const groupList = await groupModel.find({ creator: userId });

    for (let i of groupList) {
      if (i.groupName == groupName) {
        socket.emit("error", "Group already exists!");
        return;
      }
    }

    try {
      await groupModel({
        creator: userId,
        groupName,
        groupImage: image,
        Date: new Date(),
      }).save();

      userGroups(socket, userId);
      socket.emit("new-group");
    } catch (error) {
      console.log(error);
      socket.emit("error", "Unable to create group!");
    }
  });
};

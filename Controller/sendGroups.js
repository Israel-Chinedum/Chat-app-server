import { groupModel } from "../Model/models.js";

export const allGroups = async (socket) => {
  const groupList = await groupModel.find();

  const groups = [];

  for (let i of groupList) {
    groups.push({
      groupName: i.groupName,
      groupImage:
        { type: i.groupImage.type, buffer: i.groupImage.buffer } ||
        i.groupImage,
    });
  }

  socket.emit("groupList", groups);
};

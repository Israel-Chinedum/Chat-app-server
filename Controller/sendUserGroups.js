import { groupModel } from "../Model/models.js";

export const userGroups = async (socket, userId) => {
  try {
    const myGroupList = await groupModel.find({ creator: userId });

    const myGroups = [];

    for (let i of myGroupList) {
      myGroups.push({
        groupName: i.groupName,
        groupImage:
          { type: i.groupImage.type, buffer: i.groupImage.buffer } ||
          i.groupImage,
      });
    }

    socket.emit("myGroupList", myGroups);
  } catch (error) {
    console.log("Error at sendUserGroup.js: ", error);
  }
};

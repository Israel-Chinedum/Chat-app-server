import { groupModel } from "../Model/models.js";

export const allGroups = async (socket, userId) => {
  const groupList = await groupModel.find();

  const groups = [];

  for (let i of groupList) {
    let member = false;

    for (let x of i.groupMembers) {
      if (userId == x.memberId) {
        console.log("USER ID: ", userId);
        console.log("MEMBER ID: ", x.memberId);
        member = true;
      }
    }

    groups.push({
      groupName: i.groupName,
      member,
      groupImage:
        { type: i.groupImage.type, buffer: i.groupImage.buffer } ||
        i.groupImage,
    });
  }

  socket.emit("groupList", groups);
};

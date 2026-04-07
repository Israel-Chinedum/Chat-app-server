import { groupModel, mediaModel } from "../Model/models.js";

export const allGroups = (socket, userId) => {
  socket.on("get-groups", async () => {
    const groups = [];
    const groupList = await groupModel.find();

    if (!groupList.length) {
      socket.emit("groupList", groups);
      return;
    }

    // const group_img = await mediaModel.find({ category: "group" });

    for (let i of groupList) {
      let member = false;
      // let groupImage = "no image";

      // const { content_type = null, data = null } =
      //   group_img.find((img) => img.groupId == i.groupId) || {};

      // if (type && image) {
      //   groupImage = { type: content_type, buffer: data };
      // }

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
        groupImage: `http://localhost:2400/media/group/${i.groupId}`,
      });
    }

    socket.emit("groupList", groups);
  });
};

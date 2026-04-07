import { groupModel, mediaModel } from "../Model/models.js";

export const userGroups = (socket, userId) => {
  socket.on("get-myGroups", async () => {
    try {
      const myGroups = [];
      const myGroupList = await groupModel.find({ creator: userId });

      if (!myGroupList.length) {
        socket.emit("myGroupList", myGroups);
        return;
      }

      // const group_img = await mediaModel.find({
      //   chat_id: userId,
      //   category: "group",
      // });

      for (let i of myGroupList) {
        // let groupImage = "no image";

        // const { type = null, image = null } =
        //   group_img.find((img) => img.groupId == i.groupId) || {};

        // if (type && image) {
        //   groupImage = { type, buffer: image };
        // }

        myGroups.push({
          groupName: i.groupName,
          groupImage: `http://localhost:2400/media/group/${i.groupId}`,
        });
      }

      socket.emit("myGroupList", myGroups);
    } catch (error) {
      console.log("Error at sendUserGroup.js: ", error);
    }
  });
};

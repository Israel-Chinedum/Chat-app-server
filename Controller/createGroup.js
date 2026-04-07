import { groupModel, mediaModel, userModel } from "../Model/models.js";
import { userGroups } from "./sendUserGroups.js";
import { allGroups } from "./sendGroups.js";
import { genGroupId } from "../gen-chat-id.js";

export const createGroup = (socket, userId) => {
  socket.on("new-group", async ({ groupName, image }) => {
    // ====== CHECK IF GROUP ALREADY EXISTS ======
    const groupList = await groupModel.find({ creator: userId });
    const groupId = await genGroupId();

    for (let i of groupList) {
      0;
      if (i.groupName == groupName) {
        socket.emit("error", "Group already exists!");
        return;
      }
    }

    // ====== CHECK IF AN IMAGE WAS ADDED IN ORDER TO SAVE IT ======
    if (typeof image !== "string") {
      const buffer = Buffer.from(image.buffer);
      await mediaModel({
        groupId,
        content_type: image.type,
        data: buffer,
        category: "group",
      }).save();
    }

    // ====== GET CREATOR USERNAME AND GROUPS ======
    const { username, groups } = await userModel.findOne({ chat_id: userId });

    // ====== SAVE GROUP TO DATABASE ======
    try {
      await groupModel({
        creator: userId,
        groupId,
        groupName,
        groupImage: image,
        groupMembers: [
          {
            memberId: userId,
            isAdmin: true,
          },
        ],
        Date: new Date(),
      }).save();
    } catch (error) {
      socket.emit("error", "Unable to create group!");
      console.log("createGroup.js Error: ", error);
    }

    // ====== UPDATE USER GROUPLIST WITH NEW GROUP ======
    try {
      await userModel.updateOne(
        { chat_id: userId },
        { $push: { groups: groupId } },
      );
      userGroups(socket, userId);
      allGroups(socket, userId);
      socket.emit("new-group");
    } catch (error) {
      console.error(
        "Unable to add groupId/creator to user goups property array",
      );
      console.error(error);
    }
  });
};

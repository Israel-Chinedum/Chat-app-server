import { groupModel, mediaModel, userModel } from "../Model/models.js";

export const sendChatList = (socket, userId) => {
  socket.on("getChatList", async (callback) => {
    try {
      const { friends, groups } = await userModel.findOne({ chat_id: userId });

      console.log("FRIENDS: ", friends, "GROUPS: ", groups);

      // ====== SET CHATLIST TO AN EMPTY ARRAY ======
      const chatList = [];

      // ====== PUSH USER FRIENDS INTO THE CHATLIST ARRAY ======
      if (friends) {
        for (let i of friends) {
          const { username = null } =
            (await userModel.findOne({ chat_id: i })) || {};

          const { image = null } =
            (await mediaModel.findOne({ chat_id: i })) || {};

          if (username) {
            chatList.push({ chat_name: username, chat_id: i, img: image });
          }
        }
      }

      // ====== PUSH GROUPS USER BELONGS TO INTO THE CHATLIST ARRAY ======
      if (groups) {
        for (let i of groups) {
          const { groupName = null } =
            (await groupModel.findOne({ groupId: i })) || {};

          const { image = null } =
            (await mediaModel.findOne({ groupId: i })) || {};

          if (groupName) {
            chatList.push({ chat_name: groupName, groupId: i, img: image });
          }
        }
      }
      console.log("CHATLIST: ", chatList);
      // socket.emit("chatList", chatList);
      callback(chatList);
    } catch (error) {
      console.error(error);
    }
  });
};

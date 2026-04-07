import { groupModel, mediaModel, userModel } from "../Model/models.js";

export const chatSearch = async ({ socket, searchTerm, userId }) => {
  const regex = new RegExp(searchTerm, "i");

  const searchList = [];

  //   ====== GET USERS THAT FIT SEARCH TERM ======
  const users = await userModel
    .find(
      { username: regex, chat_id: { $ne: userId } },
      { username: 1, chat_id: 1 },
    )
    .lean();

  // ====== GET GROUPS THAT FIT SEARCH TERM ======
  const groups = await groupModel.find(
    { groupName: regex },
    { groupName: 1, groupId: 1 },
  );

  for (let i of users) {
    searchList.push({ chat_name: i.username, chat_id: i.chat_id });
  }

  for (let i of groups) {
    searchList.push({ chat_name: i.groupName, groupId: i.groupId });
  }

  socket.emit("chat-search", searchList);
};

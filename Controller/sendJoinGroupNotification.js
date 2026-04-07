import {
  groupModel,
  notificationModel,
  notificationStatusType,
  userModel,
} from "../Model/models.js";

export const sendJoinGroupNotification = async ({
  socket,
  groupId,
  userId,
  users,
}) => {
  if (!groupId) return;

  // ====== CHECK IF NOTIFICATION ALREADY EXISTS ======
  const notificationExists = await notificationModel.findOne({
    senderId: userId,
    tag_id: groupId,
    type: "join-group-request",
  });

  if (notificationExists) {
    socket.emit("request-already-exists");
    return;
  }

  const groupAdmins = [];
  let groupName;
  let requesting_user_username;

  try {
    // GET LIST OF ALL THE GROUP ADMINS
    const group = await groupModel.findOne({ groupId }).lean();
    groupName = group.groupName;

    for (let member of group.groupMembers) {
      if (member.isAdmin) {
        groupAdmins.push(member.memberId);
      }
    }
    // SET USERNAME
    const requesting_user = await userModel.findOne({ chat_id: userId });
    requesting_user_username = requesting_user.username;
  } catch (error) {
    console.error(error);
  }

  // SAVE NOTIFICATION TO NOTIFICATIONS COLLECTION IN DATABASE
  try {
    await notificationModel({
      notificationId: crypto.randomUUID(),
      tag_id: groupId,
      senderId: userId,
      recipientId: groupAdmins,
      name: "Join Group Request",
      msg: `${requesting_user_username} is requesting to join ${groupName}!`,
      date: new Date(),
      status: notificationStatusType.PENDING,
      actionNeeded: true,
      type: "join-group-request",
      urgent: false,
    }).save();
  } catch (error) {
    return console.error(error);
  }

  for (let admin_id of groupAdmins) {
    try {
      // ====== EMIT JOIN GROUP REQUEST IN REAL TIME TO RECIPIENT ======
      const socketRecipientId = users.get(admin_id);
      socket.to(socketRecipientId).emit("notification", {
        name: "Join Group Request",
        username: requesting_user_username,
        senderId: userId,
        tag_id: groupId,
        msg: `${requesting_user_username} is requesting to join ${groupName}!`,
        actionNeeded: true,
        type: "join-group-request",
        date: "now",
      });
    } catch (error) {
      console.error(error);
    }
  }
};

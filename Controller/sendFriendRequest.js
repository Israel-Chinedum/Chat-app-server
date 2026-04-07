import {
  notificationModel,
  notificationStatusType,
  userModel,
} from "../Model/models.js";

export const sendFriendRequest = async ({
  socket,
  users,
  recipientId,
  userId,
}) => {
  // ====== DEFINE REQUEST NAME ======
  const name = "Friend Request";

  // ====== CHECK IF NOTIFICATION ALREADY EXISTS ======
  const notificationExists = await notificationModel.findOne({
    senderId: userId,
    recipientId,
    name,
    type: "friend-request",
  });

  if (notificationExists) {
    socket.emit("request-already-exists");
    return;
  }

  // ====== GET DETAILS OF USER(THE ONE SENDING THE FRIEND REQUEST) ======
  const sender = await userModel
    .findOne({ chat_id: userId }, { username: 1, chat_id: 1 })
    .lean();

  // ==== GET RECIPIENT DETAILS(THE ONE RECIEVING THE FRIEND REQUEST) ======
  const recipient = await userModel
    .findOne({ chat_id: recipientId }, { username: 1, chat_id: 1 })
    .lean();

  // ====== SETUP REQUEST MESSAGE ======
  const msg = `You've just recieved a friend request from ${sender.username}`;

  // ====== EMIT FRIEND REQUEST IN REAL TIME TO RECIPIENT ======
  const socketRecipientId = users.get(recipientId);
  socket.to(socketRecipientId).emit("notification", {
    name,
    username: sender.username,
    senderId: sender.chat_id,
    msg,
    type: "friend-request",
    date: "now",
  });

  // ====== EMIT FRIEND REQUEST STATUS TO SENDER IN REAL TIME ======
  socket.emit("sent-friend-request", {
    name: "Sent Friend Request",
    username: recipient.username,
    recipientId: recipient.chat_id,
    msg: `You just sent a friend request to ${recipient.username}`,
    type: "friend-request",
    date: "now",
  });

  // ====== SAVE FRIEND REQUEST TO NOTIFICATIONS COLLECTION IN DATABASE ======
  try {
    await notificationModel({
      senderId: userId,
      recipientId: [recipientId],
      notificationId: crypto.randomUUID(),
      name,
      msg,
      date: new Date(),
      type: "friend-request",
      actionNeeded: true,
      status: notificationStatusType.PENDING,
      urgent: false,
    }).save();
  } catch (error) {
    console.error(error);
  }
};

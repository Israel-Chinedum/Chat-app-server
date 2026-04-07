import {
  notificationModel,
  notificationStatusType,
  userModel,
} from "../Model/models.js";
import mongoose from "mongoose";

export const sendFriendRequestResponse = async ({
  socket,
  userId,
  recipientId,
  users,
  response,
}) => {
  //   ====== CONFIRM THAT RESPONSE IS EITHER TRUE OR FALSE ======
  if (response !== true && response !== false) {
    return console.error(`Response can only be either true or false!`);
  }

  const user = await userModel.findOne({ chat_id: userId });

  // ====== SET NOTIFICATION NAME AND MESSAGE ======
  const name = "FRIEND REQUEST RESPONSE";
  const msg =
    response === true
      ? `${user?.username} accepted your friend request!`
      : response === false &&
        `Your friend request was declined by ${user?.username}!`;

  //   ====== SAVE RESPONSE TO NOTIFICATIONS COLLECTIOIN ======
  try {
    if (!recipientId) {
      throw new Error("RecipientId must be defined!");
    }

    await notificationModel({
      notificationId: crypto.randomUUID(),
      senderId: userId,
      recipientId: [recipientId],
      name,
      msg,
      date: new Date(),
      type: "friend-request",
      actionNeeded: true,
      status: response
        ? notificationStatusType.ACCEPTED
        : notificationStatusType.DECLINED,
      urgent: false,
    }).save();
  } catch (error) {
    return console.error(error);
  }

  //   ====== ADD EACH USER TO EACHOTHERS FRIENDS ARRAY IF RESPONSE IS TRUE ======
  if (response === true) {
    // ====== START SESSION ======
    const session = await mongoose.startSession();

    try {
      // ====== START TRANSACTION ======
      session.startTransaction();

      // ====== ADD NEW FRIEND TO USER1's (the person who accepted the friend request) FRIENDS ARRAY ======
      await userModel.updateOne(
        { chat_id: userId },
        { $addToSet: { friends: recipientId } },
      );

      //   ====== ADD NEW FIREND TO USER2's (the person who sent the friend request) FRIENDS ARRAY ======
      await userModel.updateOne(
        { chat_id: recipientId },
        { $addToSet: { friends: userId } },
      );

      // ====== COMMIT TRANSACTION ======
      await session.commitTransaction();
    } catch (error) {
      // ====== ABORT TRANSACTION ======
      await session.abortTransaction();
      console.error(error);
    } finally {
      // ====== END SESSION ======
      session.endSession();
    }
  }

  // ====== EMIT FRIEND REQUEST RESPONSE TO SENDER(the one who sent the friend request) IN REAL TIME ======
  const socketRecipientId = users.get(recipientId);
  socket.to(socketRecipientId).emit("friend-request-notification", {
    name,
    username: user.username,
    senderId: user.chat_id,
    msg,
    date: "now",
    actionNeeded: true,
    type: "friend-request",
  });
};

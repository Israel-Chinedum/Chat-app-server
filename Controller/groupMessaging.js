import { conversationModel, ConversationType } from "../Model/models.js";

export const groupMessaging = async ({
  socket,
  io,
  senderId,
  groupId,
  type,
  msg,
}) => {
  // SAVE MESSAGE TO DATABASE
  try {
    if (
      !senderId ||
      !groupId ||
      (type !== ConversationType.PRIVATE && type !== ConversationType.GROUP)
    ) {
      throw new Error(
        "Both sender and group id must be provided as well as conversation type must be either 'private' or 'group'!",
      );
    }

    await conversationModel({
      senderId,
      recipientId: groupId,
      message: msg,
      type,
    }).save();

    console.log("RES: ", groupId);

    socket
      .to(groupId)
      .emit("message", { senderId, msg, date: new Date() }, () => {
        console.log(`Just sent message to ${groupId}`);
      });
  } catch (error) {
    if (error) {
      socket.emit("error", "Unable to send message!");
      console.log(error);
    }
  }
};

import { conversationModel, ConversationType } from "../Model/models.js";

export const privateMessaging = async ({
  socket,
  users,
  senderId,
  recipientId,
  type,
  msg,
}) => {
  // SAVE MESSAGE TO DATABASE
  try {
    if (
      !senderId ||
      !recipientId ||
      (type !== ConversationType.PRIVATE && type !== ConversationType.GROUP)
    ) {
      throw new Error("Both sender and recipient id must be provided!");
    }

    await conversationModel({
      senderId,
      recipientId,
      message: msg,
      type,
    }).save();

    console.log("RES: ", recipientId);
    const socketRecipientId = users.get(recipientId);

    if (socketRecipientId) {
      socket
        .to(socketRecipientId)
        .emit("message", { senderId, msg, date: new Date() }, () => {
          console.log(`Just sent message to ${socketRecipientId}`);
        });
    }
  } catch (error) {
    if (error) {
      socket.emit("error", "Unable to send message!");
      console.log(error);
    }
  }
};

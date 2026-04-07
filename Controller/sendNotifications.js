import { notificationModel, userModel } from "../Model/models.js";

export const sendNotifications = async ({ socket, userId }) => {
  const notifications = await notificationModel
    .find(
      { recipientId: userId },
      { urgent: 0, __v: 0, _id: 0, recipientId: 0 },
    )
    .lean();

  for (let i of notifications) {
    try {
      const sender = await userModel.findOne({ chat_id: i.senderId }).lean();
      if (sender) {
        i.username = sender.username;
        i.date = new Date(i.date).toDateString();
      } else {
        throw new Error("Sender does not exist!");
      }
    } catch (error) {
      console.error(error);
    }
  }

  socket.emit("all-notifications", notifications);
};

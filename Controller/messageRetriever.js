import { ConversationType, conversationModel } from "../Model/models.js";

export const messageRetriever = (socket, userId) => {
  socket.on("fetch-messages", async ({ recipientId, type }) => {
    console.log("i heared you !");
    console.log("RECIPIENT ID: ", recipientId, " TYPE: ", type);
    let conversations;

    if (type === ConversationType.PRIVATE) {
      conversations = await conversationModel.find({
        $or: [
          { senderId: userId, recipientId },
          { recipientId: userId, senderId: recipientId },
        ],
      });
    } else if (type === ConversationType.GROUP) {
      conversations = await conversationModel.find({ recipientId });
      socket.join(recipientId);
    }

    const messages = [];

    for (let i of conversations) {
      messages.push({
        msg: i.message,
        role: userId === i.senderId ? "sender" : "receiver",
        date: i.Date,
      });
    }

    console.log(messages);

    socket.emit("messages", messages);

    // console.log('sentMessages: ', sentMessages);
    // console.log('recievedMessages: ', recievedMessages);
  });
};

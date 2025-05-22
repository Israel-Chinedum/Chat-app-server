import { conversationModel } from "../Model/models.js";

export const messageRetriever = (socket, userId) => {
  socket.on("fetch-messages", async () => {
    console.log("i heared you !");
    const sentMessages = await conversationModel.find({ userId });
    const recievedMessages = await conversationModel.find({
      recipientId: userId,
    });

    const messages = [];

    for (let i of sentMessages) {
      messages.push({
        status: "sending",
        msg: i.message,
        recipientId: i.recipientId,
        date: i.Date,
      });
    }
    for (let i of recievedMessages) {
      messages.push({
        status: "recieving",
        msg: i.message,
        recipientId: i.userId,
        date: i.Date,
      });
    }

    console.log(messages);

    socket.emit("messages", messages);

    // console.log('sentMessages: ', sentMessages);
    // console.log('recievedMessages: ', recievedMessages);
  });
};

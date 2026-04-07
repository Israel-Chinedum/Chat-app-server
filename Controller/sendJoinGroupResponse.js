import {
  groupModel,
  notificationModel,
  notificationStatusType,
  userModel,
} from "../Model/models.js";
import mongoose from "mongoose";

export const sendJoinGroupResponse = async ({
  socket,
  recipientId,
  response,
  userId,
  users,
  groupId,
}) => {
  // ====== CHECK IF GROUP ID EXISTS ======
  if (!groupId) {
    return console.error("groupId must be provided!");
  }

  //   ====== GET GROUP DATA ======
  const group = await groupModel.findOne({ groupId }).lean();

  //   ====== CHECK IF USER IS AN ADMIN ======
  const isAdmin = group.groupMembers.find(
    (member, index) => member.memberId === userId && member.isAdmin,
  );
  if (!isAdmin)
    return console.error(
      `Only admins can accept new members in ${group.groupName}`,
    );

  //   ====== CONFIRM THAT RESPONSE IS EITHER TRUE OR FALSE ======
  if (response !== true && response !== false) {
    return console.error(`Response can only be either true or false!`);
  }

  //   ====== ADD USER TO GROUPS MEMBER ARRAY IF RESPONSE IS TRUE ======
  if (response === true) {
    // ====== START SESSION ======
    const session = await mongoose.startSession();

    try {
      // ====== START TRANSACTION ======
      session.startTransaction();

      //   ====== UPDATE NOTIFICATIOIN ======

      console.log("RECIPIENT_ID: ", recipientId);
      const updateNotification = await notificationModel.updateOne(
        {
          tag_id: groupId,
          status: notificationStatusType.PENDING,
          recipientId: userId,
          type: "join-group-request",
        },
        { $set: { status: notificationStatusType.ACCEPTED } },
        { session },
      );

      if (updateNotification.modifiedCount === 0) {
        return console.log(
          "Request has already been handled by another admin!",
        );
      }

      // ====== SET NOTIFICATION NAME AND MESSAGE ======
      const name = "JOIN GROUP REQUEST RESPONSE";
      const msg =
        response === true
          ? `An admin accepted your request to join ${group?.groupName}!`
          : response === false &&
            `Your request to join ${group?.groupName} was declined!`;

      //   ====== SAVE RESPONSE TO NOTIFICATIONS COLLECTIOIN ======

      if (!recipientId) {
        throw new Error("RecipientId must be defined!");
      }

      await notificationModel({
        notificationId: crypto.randomUUID(),
        senderId: groupId,
        recipientId: [recipientId],
        name,
        msg,
        date: new Date(),
        status: notificationStatusType.NULL,
        actionNeeded: false,
        type: "join-group-request",
        urgent: false,
      }).save({ session });

      // ====== ADD NEW MEMBER TO GROUPS (the group that accepted the join group request) GROUP MEMBERS ARRAY ======
      await groupModel.updateOne(
        { groupId },
        {
          $addToSet: {
            groupMembers: { memberId: recipientId, isAdmin: false },
          },
        },
        { session },
      );

      //   ====== ADD NEW GROUP TO USER2's (the person who sent the join group request) GROUPS ARRAY ======
      await userModel.updateOne(
        { chat_id: recipientId },
        { $addToSet: { groups: groupId } },
        { session },
      );

      // ====== EMIT JOIN GROUP REQUEST RESPONSE TO SENDER(the one who sent the request to join the group) IN REAL TIME ======
      const socketRecipientId = users.get(recipientId);
      socket.to(socketRecipientId).emit("notification", {
        name,
        groupName: group?.groupName,
        groupId,
        msg,
        date: "now",
        type: "join-group-request",
        actionNeeded: false,
      });

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
};

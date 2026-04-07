import { messageRetriever } from "./messageRetriever.js";
import { privateMessaging } from "./privateMessaging.js";
import { createGroup } from "./createGroup.js";
import { userGroups } from "./sendUserGroups.js";
import { allGroups } from "./sendGroups.js";
import { sendJoinGroupNotification } from "./sendJoinGroupNotification.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { sendChatList } from "./sendChatList.js";
import { chatSearch } from "./chatSearch.js";
import { sendFriendRequest } from "./sendFriendRequest.js";
import { sendNotifications } from "./sendNotifications.js";
import { sendFriendRequestResponse } from "./sendFriendRequestResponse.js";
import { userModel } from "../Model/models.js";
import { sendJoinGroupResponse } from "./sendJoinGroupResponse.js";
import { groupMessaging } from "./groupMessaging.js";

const users = new Map();

export const Socket = (io) => {
  io.use((socket, next) => {
    cookieParser()(socket.request, {}, () => {
      const { accessToken } = socket.request.cookies;

      if (!accessToken) return next(new Error("Token not found!"));
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return next(new Error("Invalid or expired token!"));
        console.log("USER: ", user);
        socket.request.user = user;
        next();
      });
    });
  });

  io.on("connection", (socket) => {
    console.log("new user connected!");
    const userId = socket.request.user["user"].chat_id;
    userId && users.set(userId, socket.id);
    console.log("users: ", users);

    socket.on("disconnect", () => {
      (async () => {
        const user = await userModel.findOne({ chat_id: userId });
        console.log(`${user?.username} has disconnected!`);
      })();
    });

    // HANDLE PRIVATE MESSAGE RELAYING
    socket.on("message", ({ msg, recipientId, type }) => {
      privateMessaging({
        socket,
        users,
        senderId: userId,
        recipientId,
        type,
        msg,
      });
    });

    socket.on("group-msg", ({ msg, recipientId, type }) => {
      groupMessaging({
        socket,
        io,
        senderId: userId,
        groupId: recipientId,
        type,
        msg,
      });
    });

    // RETRIEVE MESSAGES
    messageRetriever(socket, userId);

    // CREATE GROUPS
    createGroup(socket, userId);

    //  SEND JOIN GROUP REQUEST NOTIFICATION
    socket.on("join-group-request", ({ groupId }) => {
      sendJoinGroupNotification({ groupId, userId, users, socket });
    });

    // SEND ALL GROUPS
    allGroups(socket, userId);

    // SEND CHAT LIST
    sendChatList(socket, userId);

    // GET USER GROUPS
    userGroups(socket, userId);

    // SEARCH FOR CHATS
    socket.on("chat-search", ({ searchTerm }) => {
      chatSearch({ socket, searchTerm, userId });
    });

    // ====== SEND FRIEND REQUEST NOTIFICATION ======
    socket.on("friend-request", ({ recipientId }) => {
      sendFriendRequest({ socket, users, recipientId, userId });
    });

    // ====== SEND NOTIFICATION REQUEST RESPONSE ======
    socket.on(
      "notification-response",
      ({ recipientId, tag_id, response, type }) => {
        if (type === "friend-request") {
          sendFriendRequestResponse({
            socket,
            recipientId,
            response,
            users,
            userId,
          });
        } else if (type === "join-group-request") {
          sendJoinGroupResponse({
            socket,
            recipientId,
            groupId: tag_id,
            response,
            users,
            userId,
          });
        }
      },
    );

    // ====== SEND ALL NOTIFICATIONS ======
    socket.on("get-notifications", () => {
      sendNotifications({ socket, userId });
    });
  });
};

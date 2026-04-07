import mongoose from "mongoose";

export const mongooseConnection = () => {
  return Promise.resolve(
    mongoose
      .connect("mongodb://localhost:27017/chat-app")
      .then(() => {
        console.log("Database connected!");
      })
      .catch((error) => {
        console.log("Unable to connect to database!");
      }),
  );
};

// CREATE USER MODEL/SCHEMA
const createUserSchema = mongoose.Schema({
  "First Name": { type: String, required: true },
  "Last Name": { type: String, required: true },
  Age: { type: Number, required: true },
  "Date of Birth": Date,
  groups: { type: [String] },
  friends: { type: [String] },
  chat_id: { type: String, unique: true, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});
export const userModel = mongoose.model("users", createUserSchema);

// TOKEN MODEL
const createTokenSchema = mongoose.Schema({
  tokenId: String,
  token: String,
  expiresIn: Date,
});
export const tokenModel = mongoose.model("tokens", createTokenSchema);

// CONVERSATION MODEL
export const ConversationType = {
  PRIVATE: "private",
  GROUP: "group",
};
const conversationSchema = mongoose.Schema(
  {
    groupId: { type: String },
    senderId: { type: String, required: true },
    recipientId: { type: String },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(ConversationType),
      required: true,
    },
  },
  { timestamps: true },
);
export const conversationModel = mongoose.model(
  "conversations",
  conversationSchema,
);

const imageSchema = mongoose.Schema({
  name: String,
  type: String,
  buffer: Buffer,
});

// GROUPS MODEL
const createGroupSchema = mongoose.Schema({
  creator: { type: String, required: true },
  groupId: { type: String, unique: true, required: true },
  groupName: { type: String, required: true },
  groupMembers: {
    type: [
      {
        memberId: String,
        isAdmin: Boolean,
      },
    ],
    required: true,
  },
  Date: { type: Date, required: true },
});
export const groupModel = mongoose.model("groups", createGroupSchema);

// NOTIFICATIONS MODEL

// SET NOTIFICATION STATUS TYPES
export const notificationStatusType = {
  ACCEPTED: "accepted",
  DECLINED: "declined",
  PENDING: "pending",
  NULL: "null",
};
const notificationSchema = mongoose.Schema({
  notificationId: { type: String, unique: true, required: true },
  tag_id: { type: String },
  senderId: { type: String, required: true },
  recipientId: { type: [String], required: true },
  name: { type: String, required: true },
  msg: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true },
  actionNeeded: { type: Boolean, required: true },
  status: {
    type: String,
    enum: Object.values(notificationStatusType),
    required: true,
  },
  urgent: { type: Boolean, required: true },
});
export const notificationModel = mongoose.model(
  "notificationModel",
  notificationSchema,
  "notifications",
);

// REQUEST REVIEW MODEL
const reqReviewSchema = mongoose.Schema({
  userId: { type: String, required: true },
});
export const reqReviewModel = mongoose.model("reviews", reqReviewSchema);

// MEDIA MODEL ---- make sure to work on this so that chat_id and groupid are not present at thesame time
const mediaSchema = mongoose.Schema({
  chat_id: {
    type: String,
    validate: {
      validator: (value) => {
        if (value && this.groupId) return false;
        return true;
      },
      message: "groupId and chat_id should not be present in thesame document!",
    },
  },
  groupId: { type: String },
  data: { type: Buffer, required: true },
  content_type: { type: String, required: true },
  category: {
    type: String,
    enum: ["group", "user"],
    required: true,
    message: "Value for category must be either group or user!",
  },
});
export const mediaModel = mongoose.model("mediaModel", mediaSchema, "media");

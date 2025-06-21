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
      })
  );
};

// CREATE USER MODEL/SCHEMA
const createUserSchema = mongoose.Schema({
  "First Name": { type: String, required: true },
  "Last Name": { type: String, required: true },
  Age: { type: Number, required: true },
  "Date of Birth": Date,
  groups: {
    type: [
      {
        userId: String,
        groupName: String,
        isAdmin: Boolean,
      },
    ],
  },
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
const conversationSchema = mongoose.Schema({
  userId: { type: String, required: true },
  recipientId: { type: String, required: true },
  message: { type: String, required: true },
  Date: { type: Date, required: true },
});
export const conversationModel = mongoose.model(
  "conversations",
  conversationSchema
);

const imageSchema = mongoose.Schema({
  name: String,
  type: String,
  buffer: Buffer,
});

// GROUPS MODEL
const createGroupSchema = mongoose.Schema({
  creator: { type: String, required: true },
  groupName: { type: String, required: true },
  groupImage: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: (value) => {
        return typeof value === "string" || imageSchema;
      },
      message: "groupImage field must be a string or type of imageSchema!",
    },
  },
  groupMembers: {
    type: [
      {
        memberId: String,
        username: String,
        isAdmin: Boolean,
      },
    ],
    required: true,
  },
  Date: { type: Date, required: true },
});
export const groupModel = mongoose.model("groups", createGroupSchema);

// NOTIFICATIONS MODEL
const notificationSchema = mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  urgent: { type: Boolean, required: true },
});
export const notificationModel = mongoose.model(
  "notifications",
  notificationSchema
);

// REQUEST REVIEW MODEL
const reqReviewSchema = mongoose.Schema({
  userId: { type: String, required: true },
});
export const reqReviewModel = mongoose.model("reviews", reqReviewSchema);

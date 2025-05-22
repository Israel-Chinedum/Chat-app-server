import mongoose from 'mongoose';
import { stringify } from 'querystring';

export const mongooseConnection = () => {
    return Promise.resolve(mongoose.connect('mongodb://localhost:27017/chat-app').then(() => {
    console.log('Database connected!');
    }));
}



// CREATE USER MODEL/SCHEMA
const createUserSchema = mongoose.Schema({
    "First Name": String,
    "Last Name": String,
    "Age": Number,
    "Date of Birth": Date,
    "username": String,
    "password": String
});
export const userModel = mongoose.model('users', createUserSchema);





// TOKEN MODEL
const createTokenSchema = mongoose.Schema({
    tokenId: String,
    token: String,
    expiresIn: Date
});
export const tokenModel = mongoose.model('tokens', createTokenSchema);





// CONVERSATION MODEL
const conversationSchema = mongoose.Schema({
    userId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
    Date: { type: Date, required: true }
});
export const conversationModel = mongoose.model('conversations', conversationSchema);


const imageSchema = mongoose.Schema({
    name: String,
    type: String,
    buffer: Buffer
});

// GROUPS MODEL
const createGroupSchema = mongoose.Schema({
    creator: { type: String, required: true },
    groupName: { type: String, required: true },
    groupImage: { type: imageSchema },
    groupAdmins: {type: [String] },
    groupMembers: {type: [String] },
    Date: { type: Date, required: true }
});
export const groupModel = mongoose.model('groups', createGroupSchema);

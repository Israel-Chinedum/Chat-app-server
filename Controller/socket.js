import { messageRetriever } from './messageRetriever.js';
import { privateMessaging } from './privateMessaging.js';
import { createGroup } from './createGroup.js';
import { userGroups } from './sendUserGroups.js';
import { allGroups } from './sendGroups.js';

const users = new Map();

export const Socket = (io) => {

    io.on('connection', (socket) => {

        console.log('new user connected!');

            const userId = socket.handshake.auth.userId
            console.log('user id:', socket.handshake)
            userId && users.set(userId, socket.id);
            console.log('users: ', users);

        socket.on('disconnect', () => {
            console.log('user disconnected!');
        })

  
        // HANDLE MESSAGE RELAYING
        privateMessaging(socket, users, userId);

        // RETRIEVE MESSAGES
        messageRetriever(socket, userId);

        // CREATE GROUPS
        createGroup(socket, userId);

        // SEND ALL GROUPS
        socket.on('get-groups', () => {
            allGroups(socket);
        });

        socket.on('get-myGroups', () => {
            userGroups(socket, userId);
        });
    
    });

}
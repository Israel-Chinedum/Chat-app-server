import { conversationModel } from '../Model/models.js';

export const privateMessaging = (socket, users, userId) => {

    socket.on('message', async ({status, msg, recipientId}) => {
        // SAVE MESSAGE TO DATABASE
        try{
            await conversationModel({
                userId, 
                recipientId,
                message: msg,
                Date: new Date()
            }).save()

            const socketRecipientId = users.get(recipientId);

            socket.to(socketRecipientId).emit('message', {recipientId: userId, msg}, () => {
                console.log(`Just sent message to ${socketRecipientId}`)
            });
        } catch(error){
            if(error){
                socket.emit('error', 'Unable to send message!');
                console.log(error);
            }
        }

    });

}
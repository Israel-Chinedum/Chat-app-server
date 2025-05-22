import { groupModel } from '../Model/models.js';

export const userGroups = async (socket, userId) => {

    const myGroupList =  await groupModel.find({ creator: userId });

    const myGroups = [];
                
    for(let i of myGroupList){
        myGroups.push({
            groupName: i.groupName,
            groupImage: i.groupImage.buffer
        });
    }

    socket.emit('myGroupList', myGroups);

}
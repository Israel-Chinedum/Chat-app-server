import { groupModel } from '../Model/models.js';

export const allGroups = async (socket) => {

    const groupList =  await groupModel.find();

    const groups = [];
                
    for(let i of groupList){
        groups.push({
            groupName: i.groupName,
            groupImage: i.groupImage.buffer
        });
    }

    socket.emit('groupList', groups);
}
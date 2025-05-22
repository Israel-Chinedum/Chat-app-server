import { userModel } from '../../Model/models.js';
import { User } from '../../verification.js';

export const userList = async (req, res) => {

    const { accessToken } = req.cookies;
    const currUser = User(accessToken)['user'];

    try{

        const users = await userModel.find({});
        const allUsers = users.filter( user => user._id != currUser._id );
    
        const userList = [];

        for(let i of allUsers){
            userList.push({username: i['username'], id: i['_id']});
        }
        
        res.json({userList, user: {username: currUser.username, id: currUser._id}});


    } catch(error){
        res.status(500).json('An error occured!');
        console.log(error);
    }


}
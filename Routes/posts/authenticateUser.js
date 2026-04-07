import path from 'path';
import { generateToken } from '../../generateToken.js';
import { userModel } from '../../Model/models.js';
import { tokenModel } from '../../Model/models.js';
import bcrypt from 'bcrypt';

export const authenticate = async (req, res) => {

    const { username, password } = req.body;

    const userObj = await userModel.findOne({ username }).lean();

    if(!userObj) return res.status(400).json('Invalid username or password!');

    const match = await bcrypt.compare(password, userObj.password).then(match => match);

    if(match){

        const { accessToken, refreshToken } = generateToken({ both: true, user: userObj });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 1000
        });
        
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            path: '/token'
        });
        
        // DELETE THE PREVIOUS REFRESH TOKEN
        const del = await tokenModel.deleteMany({ tokenId: userObj['_id'] });

        
        // SAVE CURRENT/NEW REFRESH TOKEN
        await tokenModel({
            tokenId: userObj._id,
            token: refreshToken,
            Date: new Date()
        }).save();
        
        res.json({ username: userObj.username, id: userObj._id });

    } else {
        res.status(400).json('Invalid username or password!');
    }
    

}
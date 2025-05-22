import jwt from 'jsonwebtoken';
import { tokenModel } from '../../Model/models.js';
import { generateToken } from '../../generateToken.js';

export const token = async (req, res) => {

    const { refreshToken } = req.cookies;


    // CHECK IF USER HAS TOKEN
    if(!refreshToken) return res.status(401).json('Unauthorized user access!');

    // GET TOKEN FROM DATABASE
    const User = await tokenModel.findOne({ token: refreshToken });

    // CHECK IF TOKEN IS VALID / COMPARE TOKENS
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

        if(err){
            console.log('Error: ', err)
            return res.status(403).json('invalid or expired token!');
        }

        const { accessToken } = generateToken({user: user['user']});
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 1000
        });

        res.json('validated');

    })

}
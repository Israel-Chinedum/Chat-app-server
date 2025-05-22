import jwt from 'jsonwebtoken';

export const generateToken = ({both, user}) => {
    
    let accessToken, refreshToken

    if(both || !both){
        accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
    }

    if(both){
        refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET);
    }

    return both ? { accessToken, refreshToken } : { accessToken };

}
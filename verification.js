import jwt from 'jsonwebtoken';

export const verify = (req, res, next) => {

    const { accessToken } = req.cookies;

    if(!accessToken) return res.status(401).json('Unauthorized user access!');

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if(err) return res.status(403).json('Invalid or expired token!');
        next();

    });

}

export const User = (accessToken) => {

    if(accessToken){
        return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return null;
            return user;
        });
    }


}

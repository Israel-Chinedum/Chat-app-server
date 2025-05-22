import { userModel } from '../../Model/models.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
    console.log(req.body);

    const {
        firstName,
        lastName,
        age,
        DOB,
        username,
        password
    } = req.body;


    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    try{
        console.log(req.body);
        await userModel({
            "First Name": firstName,
            "Last Name": lastName,
            "Age": age,
            "Date of Birth": DOB,
            "username": username,
            "password": hashPassword
        }).save();
        res.json('Registration successfull!');     
        console.log('Registration successfull!');

    } catch(error){
        res.status(500).json('An error occured!');
        throw error;
    }

    
}
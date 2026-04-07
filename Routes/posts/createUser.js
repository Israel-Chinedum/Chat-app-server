import { userModel } from "../../Model/models.js";
import bcrypt from "bcrypt";
import { genChatId } from "../../gen-chat-id.js";
import { crud } from "../../Repository/CRUD.js";

export const createUser = async (req, res) => {
  console.log(req.body);

  const { firstName, lastName, age, DOB, email, username, password } = req.body;

  const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

  try {
    // ====== CHECK IF USERNAME ALREADY EXISTS ======
    const usernameExists = await crud.exists({
      model: userModel,
      key: "username",
      value: username,
    });

    // ====== CHECK IF EMAIL ALREADY EXISTS ======
    const emailExists = await crud.exists({
      model: userModel,
      key: "email",
      value: email,
    });

    if (usernameExists) {
      res.status(400).json("username has been taken!");
      throw new Error("username has been taken!");
    } else if (emailExists) {
      res.status(400).json("This email has already been used!");
      throw new Error("username has been taken!");
    }

    console.log(req.body);
    await userModel({
      "First Name": firstName,
      "Last Name": lastName,
      Age: age,
      "Date of Birth": DOB,
      username: username,
      password: hashPassword,
      chat_id: await genChatId(),
    }).save();
    res.json("Registration successfull!");
    console.log("Registration successfull!");
  } catch (error) {
    console.error(error);
  }
};

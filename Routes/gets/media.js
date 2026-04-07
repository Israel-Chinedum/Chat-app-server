import { mediaModel } from "../../Model/models.js";

export const media = async (req, res) => {
  const media_id = req.params?.media_id;
  const chat = req.params?.chat;

  if (media_id && chat) {
    let image;
    if (chat == "user") {
      image = await mediaModel.findOne({ chat_id: media_id });
    } else if (chat == "group") {
      image = await mediaModel.findOne({ groupId: media_id });
    } else {
      res.status(400).json("Invalid chat identity!");
      return;
    }

    if (image) {
      res.set("Content-Type", image.content_type);
      res.send(image.data);
    } else {
      res.status(404).json("Image not found!");
    }
  }
};

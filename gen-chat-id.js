import { crud } from "./Repository/CRUD.js";
import { mediaModel, userModel } from "./Model/models.js";

// ====== GENERATE CHAT ID ======
export const genChatId = async () => {
  let uuid;
  let idExists;

  do {
    uuid = crypto.randomUUID();
    idExists = await crud.exists({
      model: userModel,
      key: "chat_id",
      value: uuid,
    });
  } while (idExists);

  return uuid;
};

// ====== GENERATE GROUP ID ======
export const genGroupId = async () => {
  let uuid;
  let idExists;

  do {
    uuid = crypto.randomUUID();
    idExists = await crud.exists({
      model: mediaModel,
      key: "groupId",
      value: uuid,
    });
  } while (idExists);

  return uuid;
};

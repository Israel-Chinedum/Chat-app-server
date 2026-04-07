import { createUser } from "./posts/createUser.js";
import { authenticate } from "./posts/authenticateUser.js";
import { token } from "./posts/token.js";
import { userList } from "./gets/userList.js";
import { verify } from "../verification.js";
import { media } from "./gets/media.js";

export const EndPoints = (app) => {
  // POST REQUESTS
  app.post("/createUser", createUser);
  app.post("/login", authenticate);
  app.post("/token", token);

  // GET REQUESTS
  app.get("/userList", verify, userList);
  app.get("/media/:chat/:media_id", media);
};

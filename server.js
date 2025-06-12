import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { Socket } from "./Controller/socket.js";
import { EndPoints } from "./Routes/EndPoints.js";
import dotenv from "dotenv";
import { mongooseConnection } from "./Model/models.js";
import cookieParser from "cookie-parser";

// CONFIGURE ENV FILE
dotenv.config();

const app = express();

// CONFIGURE EXPRESS TO ALLOW HANDLE JSON
app.use(express.json());

// SETUP VIEW ENGINE
app.set("view engine", "ejs");

// SETUP COOKIE PARSER
app.use(cookieParser());

// SETUP CROSS ORIGIN RESOURS SHARING (CORS)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongooseConnection().then(() => {
  // SETUP ENDPOINTS
  EndPoints(app);
});

// SETUP SOCKET CONNECTION
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 1e8,
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
Socket(io);

server.listen(2400, () => {
  console.log("Now listening on port 2400!");
});

app.get("/testRoute1", (req, res) => {
  console.log("got request");
  setTimeout(() => {
    res.status(200).json("This is route test 1");
  }, 3000);
});

app.get("/testRoute2", (req, res) => {
  console.log("COOKIE: ", req.cookies);
  console.log("got request");
  setTimeout(() => {
    res.status(200).json("This is route test 2");
  }, 3000);
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ users: [] }).write();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const jwtSecret = "your-secret-key";

function generateToken(username) {
  return jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
}

app.use(express.json());
app.use(
  session({
    secret: "secret-key-rnd44-32-1420",
    resave: false,
    saveUninitialized: true,
  })
);

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;

  const existingUser = db.get("users").find({ username }).value();
  if (existingUser) {
    res.status(409).send({ message: "Username already taken" });
  } else {
    db.get("users").push({ username, password }).write();
    res.status(200).send({ message: "User registered" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.get("users").find({ username }).value();

  if (user && user.password === password) {
    const token = generateToken(username);
    res.status(200).send({ message: "User logged in", token });
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
});

const messages = [];

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.username = decoded.username;
    next();
  });
});

io.on("connection", (socket) => {
  console.log("User connected");

  socket.emit("loadMessages", messages);

  socket.on("message", (msg, callback) => {
    jwt.verify(msg.token, jwtSecret, (err, decoded) => {
      if (err) {
        console.error("Error verifying token:", err);
        return;
      }
      if (msg.username !== decoded.username) {
        console.error("Usernames don't match");
        return;
      }
      messages.push(msg);
      io.emit("message", msg);
    });
    callback({ status: "success" }); // Отправка подтверждения об успешном получении сообщения
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

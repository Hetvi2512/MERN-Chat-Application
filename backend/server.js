const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const db = require("./config/db").mongoURI;
const path = require("path");
const chats = require("./data/data");
const userAPI = require("./routes/userRoutes");
const chatAPI = require("./routes/chatRoutes");
const messageAPI = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleWare");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/user", userAPI);
app.use("/api/chat", chatAPI);
app.use("/api/message", messageAPI);

// ------------------ Deployment -------------
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
const __dirname1 = path.resolve();
console.log(__dirname1);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API running sucessfully");
  });
}
// ------------------ Deployment -------------
app.use(notFound);
app.use(errorHandler);
mongoose
  .connect(db)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => console.log(err));
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  //Initial setup of socket for each User
  socket.on("setup", (userData) => {
    //Creating room for that particular user
    socket.join(userData._id);
    socket.emit("connected");
  });

  //Joining the selected Chat by passing chat ID
  socket.on("join chat", (room) => {
    socket.join(room);
  });

  // For Typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  //For sending messages
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      //Emiting that message to other user/s
      //"in" means inside that user's room, emit means sending that message
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  // Close the socket
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});

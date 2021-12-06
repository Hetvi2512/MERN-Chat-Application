const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
//const colors = require("colors");
const db = require("./config/db").mongoURI;
const chats = require("./data/data");
const userAPI = require("./routes/userRoutes");
const chatAPI = require("./routes/chatRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleWare");
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/api/user", userAPI);
app.use("/api/chat", chatAPI);
app.use(notFound);
app.use(errorHandler);
// app.get("/", (req, res) => {
//   res.send("API is running");
// });
// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   const singleChat = chats.find((c) => c._id === req.params.id);
//   res.send(singleChat);
// });

mongoose
  .connect(db)
  .then(() => {
    console.log("Mongo DB connected");
  })
  .catch((err) => console.log(err));
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

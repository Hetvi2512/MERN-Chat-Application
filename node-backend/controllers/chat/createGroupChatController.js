const asyncHandler = require("express-async-handler");
const Chat = require("../../models/chatModel");
const createGroupChat = asyncHandler(async (req, res) => {
  const { name, users } = req.body;
  if (!name || !users) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  let usersData = JSON.parse(users);
  if (usersData.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  usersData.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: usersData,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = createGroupChat;

const asyncHandler = require("express-async-handler");
const Chat = require("../../models/chatModel");
const User = require("../../models/userModel");
const createChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.sendStatus(400);
  }
  let isChatExists = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChatExists = await User.populate(isChatExists, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChatExists.length > 0) {
    res.send(isChatExists[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});
module.exports = createChat;

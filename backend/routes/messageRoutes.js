const express = require("express");
const allMessages = require("../controllers/message/getMessageController");
const sendMessage = require("../controllers/message/sendMessageController");
const { authorize } = require("../middlewares/authMiddleWare");

const router = express.Router();
router.route("/").post(authorize, sendMessage);
router.route("/:chatId").get(authorize, allMessages);
module.exports = router;

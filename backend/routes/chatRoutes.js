const express = require("express");
const {
  createChat,
  createGroupChat,
  fetchChats,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat");
const { authorize } = require("../middlewares/authMiddleWare");
const router = express.Router();

router.route("/").post(authorize, createChat).get(authorize, fetchChats);
router.post("/group", authorize, createGroupChat);
router.put("/rename", authorize, renameGroup);
router.put("/removeperson", authorize, removeFromGroup);
router.put("/personadd", authorize, addToGroup);

module.exports = router;

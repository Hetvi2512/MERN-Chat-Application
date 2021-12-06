const express = require("express");
const {
  registerUser,
  authUser,
  allusers,
} = require("../controllers/user/userController");
const { authorize } = require("../middlewares/authMiddleWare");
const router = express.Router();

//router.route is used to chain multiple methods
router.route("/register").post(registerUser);
router.post("/login", authUser);
router.get("/", authorize, allusers);
module.exports = router;

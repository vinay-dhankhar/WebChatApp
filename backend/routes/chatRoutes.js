const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
//   removeFromGroup,
//   addToGroup,
//   renameGroup,
} = require("../controllers/chatController");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(auth, accessChat);
router.route("/").get(auth, fetchChats);
router.route("/group").post(auth, createGroupChat);
// router.route("/rename").put(auth, renameGroup);
// router.route("/groupremove").put(auth, removeFromGroup);
// router.route("/groupadd").put(auth, addToGroup);

module.exports = router;
const express = require("express");
const {
  getAllUser,
  updateScore,
  updatePassword,
  isBanStatus,
} = require("../controllers/userController");
const isAdmin = require("../middleware/validateAdminHandler");

const router = express.Router();

router.get("/allusers", getAllUser);
router.put("/updatepassword", isAdmin, updatePassword);
router.put("/updatescore", isAdmin, updateScore);
router.put("/updateban", isAdmin, isBanStatus);

module.exports = router;

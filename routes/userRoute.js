const express = require("express");
const {
  getAllUser,
  updateScore,
  updatePassword,
} = require("../controllers/userController");
const isAdmin = require("../middleware/validateAdminHandler");

const router = express.Router();

router.get("/allusers", getAllUser);
router.put("/updatepassword", isAdmin, updatePassword);
router.put("/updatescore", isAdmin, updateScore);

module.exports = router;

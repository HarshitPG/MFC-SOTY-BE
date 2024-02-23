const express = require("express");
const bodyParser = require("body-parser");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");
const isSingleLogin = require("../middleware/validateLoginHandler");

const router = express.Router();

router.use(bodyParser.json());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", isSingleLogin, refreshToken);

module.exports = router;

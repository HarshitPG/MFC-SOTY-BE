const express = require("express");
const bodyParser = require("body-parser");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

router.use(bodyParser.json());

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", refreshToken);

module.exports = router;

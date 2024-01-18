const express = require("express");
const bodyParser = require("body-parser");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.use(bodyParser.json());

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const bodyParser = require("body-parser");
const { getAllUser } = require("../controllers/userController");

const router = express.Router();

router.use(bodyParser.json());

router.use("/allusers", getAllUser);

module.exports = router;

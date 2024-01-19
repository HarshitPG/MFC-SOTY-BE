const express = require("express");
const bodyParser = require("body-parser");
const { getAllUser } = require("../controllers/userController");

const router = express.Router();

router.use(bodyParser.json());

router.get("/allusers", getAllUser);

module.exports = router;

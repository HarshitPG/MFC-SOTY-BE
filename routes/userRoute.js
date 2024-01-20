const express = require("express");
const { getAllUser } = require("../controllers/userController");

const router = express.Router();

router.get("/allusers", getAllUser);

module.exports = router;

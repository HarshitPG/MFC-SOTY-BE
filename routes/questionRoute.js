const express = require("express");
const bodyParser = require("body-parser");
const {
  getQuestions,
  getAllQuestions,
} = require("../controllers/questionController");

const router = express.Router();

router.use(bodyParser.json());

router.get("/:id", getQuestions);

router.get("/all/:id", getAllQuestions);

module.exports = router;

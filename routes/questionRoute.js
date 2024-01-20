const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  getQuestions,
  getAllQuestions,
  getAllAnsweredQuestions,
  postAnswerQuestion,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/:id", validateToken, postAnswerQuestion);
router.get("/:id", validateToken, getQuestions);
router.get("/all/:id", validateToken, getAllQuestions);
router.get("/allanswered/:id", validateToken, getAllAnsweredQuestions);

module.exports = router;

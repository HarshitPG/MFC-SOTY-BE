const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const isSingleLogin = require("../middleware/validateLoginHandler");
const {
  getQuestions,
  getAllQuestions,
  getAllAnsweredQuestions,
  postAnswerQuestion,
} = require("../controllers/questionController");

const router = express.Router();

router.post("/:id", validateToken, isSingleLogin, postAnswerQuestion);
router.get("/:id", validateToken, isSingleLogin, getQuestions);
router.get("/all/:id", validateToken, isSingleLogin, getAllQuestions);
router.get(
  "/allanswered/:id",
  validateToken,
  isSingleLogin,
  getAllAnsweredQuestions
);

module.exports = router;

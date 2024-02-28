const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const isSingleLogin = require("../middleware/validateLoginHandler");
const incorrectStreak = require("../middleware/validatePostHandler");
const isBanned = require("../middleware/validateBanHandler");
const {
  getQuestions,
  getAllQuestions,
  getAllAnsweredQuestions,
  postAnswerQuestion,
  getAnsweringStatus,
} = require("../controllers/questionController");

const router = express.Router();

router.post(
  "/:id",
  validateToken,
  isSingleLogin,
  isBanned,
  incorrectStreak,
  postAnswerQuestion
);
router.get("/:id", validateToken, isSingleLogin, isBanned, getQuestions);
router.get("/all/:id", validateToken, isSingleLogin, isBanned, getAllQuestions);
router.get(
  "/allanswered/:id",
  validateToken,
  isSingleLogin,
  isBanned,
  getAllAnsweredQuestions
);
router.get(
  "/answeringStatus/:id",
  validateToken,
  isSingleLogin,
  isBanned,
  getAnsweringStatus
);

module.exports = router;

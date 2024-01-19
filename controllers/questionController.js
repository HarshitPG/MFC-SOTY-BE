const fs = require("fs");
const path = require("path");
const QuestionModel = require("../Models/questionModel");

const questionFilePath = path.join(__dirname, "../questions.json");

//getQuestions based on difficulyLevel
const getQuestions = async (req, res) => {
  const { id } = req.params;
  const { difficultyLevel } = req.query;
  try {
    const questions = JSON.parse(fs.readFileSync(questionFilePath, "utf8"));

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions available.You have solved all questions.",
      });
    }

    const existingUnansweredQuestion = await QuestionModel.findOne({
      user_id: id,
      answered: false,
      difficultyLevel: difficultyLevel,
    });
    console.log("existingUnansweredQuestion", existingUnansweredQuestion);

    if (existingUnansweredQuestion) {
      const questionToDisplay = {
        question: existingUnansweredQuestion.question,
        difficultyLevel: existingUnansweredQuestion.difficultyLevel,
        points: existingUnansweredQuestion.points,
      };

      res.status(200).json(questionToDisplay);
    } else {
      const filteredQuestion = questions.filter(
        (question) => question.difficultyLevel === difficultyLevel
      );

      if (filteredQuestion.length === 0) {
        return res.status(404).json({
          message: "No questions available for the specified difficulty level.",
        });
      }

      const randomIndex = Math.floor(Math.random() * filteredQuestion.length);
      const selectedQuestion = filteredQuestion[randomIndex];

      await QuestionModel.create({
        user_id: id,
        question: selectedQuestion.question,
        answer: selectedQuestion.answer,
        points: selectedQuestion.points,
        difficultyLevel: selectedQuestion.difficultyLevel,
        answered: false,
      });

      const questionToDisplay = {
        question: selectedQuestion.question,
        difficultyLevel: selectedQuestion.difficultyLevel,
        points: selectedQuestion.points,
      };

      res.status(200).json(questionToDisplay);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//getAllQuestions based on users
const getAllQuestions = async (req, res) => {
  try {
    const allQuestions = await QuestionModel.find({ user_id: req.params.id });
    if (allQuestions.length === 0) {
      return res
        .status(404)
        .json({ message: "The user haven't started the game." });
    }
    // console.log(allQuestions);
    res.status(200).json(allQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getQuestions, getAllQuestions };

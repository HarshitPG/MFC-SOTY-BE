const fs = require("fs");
const path = require("path");
const userModel = require("../Models/userModel");
const questionModel = require("../Models/questionModel");

const questionFilePath = path.join(__dirname, "../questions.json");

//getQuestions based on difficulyLevel
const getQuestions = async (req, res) => {
  const { id } = req.params;
  const { difficultyLevel } = req.query;
  try {
    if (questionModel.length === 0) {
      return res.status(404).json({
        message: "No questions available.",
      });
    }

    const existingUnansweredQuestion = await questionModel.findOne({
      user_id: id,
      answered: "pending",
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
      const filteredQuestion = await questionModel.find({
        difficultyLevel: difficultyLevel,
        answered: "false",
      });

      if (filteredQuestion.length === 0) {
        return res.status(404).json({
          message: "No questions available for the specified difficulty level.",
        });
      }

      console.log("filteredQuestion", filteredQuestion);

      const randomIndex = Math.floor(Math.random() * filteredQuestion.length);
      const selectedQuestion = filteredQuestion[randomIndex];

      await questionModel.findOneAndUpdate(
        { _id: selectedQuestion._id },
        { answered: "pending" }
      );

      console.log("selectedQuestion", selectedQuestion);
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
    const allQuestions = await questionModel.find({ user_id: req.params.id });
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
//postAnswer
const postAnswerQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, points, difficultyLevel, score } = req.body;
    const postAnswers = await questionModel.findOne({
      user_id: id,
      question: question,
      points: points,
      answered: "pending",
      difficultyLevel: difficultyLevel,
    });

    if (postAnswers) {
      const questions = JSON.parse(fs.readFileSync(questionFilePath, "utf8"));
      const matchingQuestion = questions.filter(
        (userquestion) => userquestion.question === question
      );
      console.log("matchingQuestion", matchingQuestion);
      if (matchingQuestion && matchingQuestion[0].answer === answer) {
        console.log("matchingQuestion.answer", matchingQuestion.answer);
        const user = await userModel.findById(id);
        if (user) {
          const updatedScore = user.score + points;
          await userModel.findByIdAndUpdate(id, { score: updatedScore });

          await questionModel.findOneAndUpdate(
            { user_id: id, question: question },
            { answered: true }
          );
          return res.status(200).json({
            message: "Correct answer!",
            updatedScore: updatedScore,
          });
        } else {
          return res.status(404).json({ message: "User not found." });
        }
      } else {
        return res.status(200).json({
          message: "Incorrect answer. Try again.",
        });
      }
    }
    console.log("postAnswers", postAnswers);
    return res.status(404).json({
      message: "Check your post req.something is wrong.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getQuestions, getAllQuestions, postAnswerQuestion };

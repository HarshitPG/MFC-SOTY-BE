const userModel = require("../Models/userModel");

const TimeOut = 2 * 60 * 1000;

const incorrectStreak = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.inCorrectStreaks >= 2) {
      const timeElapsed = Date.now() - user.lastIncorrectAttemptTime;

      if (timeElapsed < TimeOut) {
        const remainingTime = TimeOut - timeElapsed;
        await userModel.findByIdAndUpdate(req.params.id, { canAnswer: false });
        return res.status(400).json({
          message: `You have made too many wrong attempts. Please wait for ${remainingTime} milliseconds.`,
          remainingTime: remainingTime,
        });
      } else {
        await userModel.findByIdAndUpdate(id, {
          inCorrectStreaks: 0,
          lastIncorrectAttemptTime: null,
          canAnswer: true,
        });
      }
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = incorrectStreak;

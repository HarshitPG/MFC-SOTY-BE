const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const isBanned = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing." });
    }

    token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECERT);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found.(single user)" });
    }

    if (user.isBan) {
      const TimeOut = 15 * 60 * 1000;

      const timeElapsed = Date.now() - user.banTime;

      if (timeElapsed < TimeOut) {
        const remainingTime = TimeOut - timeElapsed;
        await UserModel.findByIdAndUpdate(req.params.id, { isBan: true });
        return res.status(200).json({
          message: `User has banned. Please wait for ${remainingTime} milliseconds.`,
          remainingTime: remainingTime,
          isBan: user.isBan,
        });
      }
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

module.exports = isBanned;

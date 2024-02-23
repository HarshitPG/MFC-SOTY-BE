const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const isSingleLogin = async (req, res, next) => {
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

    if (user.prevAccessToken.includes(token)) {
      return res.status(401).json({
        message:
          "Multiple logins detected (someone logged in form new device/browser/tab ). So Please log in again.",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

module.exports = isSingleLogin;

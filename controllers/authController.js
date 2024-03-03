const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Registering a new user

// const registerUser = async (req, res) => {
//   const { username, teamname, password, score } = req.body;
//   console.log(req.body);

//   try {
//     const userAvailable = await UserModel.findOne({ username });
//     if (userAvailable) {
//       return res.status(400).json({ message: "User already exists" });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     console.log("Hashed Password: ", hashedPassword);
//     const newUser = new UserModel({
//       username: username,
//       teamname: teamname,
//       password: hashedPassword,
//       score: score,
//       // refreshToken: [],
//     });
//     const user = await newUser.save();

//     const token = jwt.sign(
//       { username: user.username, id: user._id, teamname: user.teamname },
//       process.env.ACCESS_TOKEN_SECERT,
//       { expiresIn: "45m" }
//     );

//     console.log(`User created ${user}`);
//     console.log(`User token ${token}`);
//     res.status(200).json({ user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

//login User

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({
      username: username,
    });

    if (user) {
      // if (user.isBan) {
      //   const TimeOut = 120 * 60 * 1000;

      //   const timeElapsed = Date.now() - user.banTime;

      //   if (timeElapsed < TimeOut) {
      //     const remainingTime = TimeOut - timeElapsed;
      //     await UserModel.findByIdAndUpdate(req.params.id, { isBan: true });
      //     return res.status(403).json({
      //       message: `User has banned. Please wait for ${remainingTime} milliseconds.`,
      //       remainingTime: remainingTime,
      //       isBan: user.isBan,
      //     });
      //   }
      // }
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.send(400).json("Wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id, isAdmin: user.isAdmin },
          process.env.ACCESS_TOKEN_SECERT,
          { expiresIn: "1d" }
        );

        const refreshToken = generateRefreshToken(user);
        user.refreshToken = refreshToken;

        user.prevAccessToken = user.accessTokens;
        user.accessTokens = [];
        await user.save();

        user.accessTokens.push(token);
        await user.save();

        console.log(`User created login : ${user}`);
        console.log(`User token login: ${token}`);
        res.status(200).json({ user, token, refreshToken });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//refreshToken
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "User is not authorized or token missing" });
  }

  token = authHeader.split(" ")[1];

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required." });
  }
  try {
    const user = await UserModel.findOne({ refreshToken: refreshToken });
    console.log("user refresh:", user);
    if (!user) {
      return res.status(404).json({ message: "Invalid refreshToken" });
    }
    const storeRefeshToken = user.refreshToken;
    if (!storeRefeshToken) {
      return res.status(400).json({ message: "Invalid refrsh token" });
    }
    user.tokenVersion += 1;
    await user.save();
    const newAccessToken = jwt.sign(
      { username: user.username, id: user._id },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "45m" }
    );
    res.header("Authorization", `Bearer ${newAccessToken}`);
    res.status(200).json({ accessToken: newAccessToken });
    user.prevAccessToken.push(token);
    await user.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { username: user.username, id: user._id },
    process.env.REFRESH_TOKEN_SECERT
  );
};
module.exports = { registerUser, loginUser, refreshToken };

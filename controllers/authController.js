const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Registering a new user

const registerUser = async (req, res) => {
  const { username, teamname, password, score } = req.body;
  console.log(req.body);

  try {
    const userAvailable = await UserModel.findOne({ username });
    if (userAvailable) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Hashed Password: ", hashedPassword);
    const newUser = new UserModel({
      username: username,
      teamname: teamname,
      password: hashedPassword,
      score: score,
    });
    const user = await newUser.save();

    const token = jwt.sign(
      { username: user.username, id: user._id, teamname: user.teamname },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "45m" }
    );
    console.log(`User created ${user}`);
    console.log(`User token ${token}`);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login User

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({
      username: username,
    });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.send(400).json("Wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.ACCESS_TOKEN_SECERT,
          { expiresIn: "45m" }
        );
        console.log(`User created login : ${user}`);
        console.log(`User token login: ${token}`);
        res.status(200).json({ user });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { registerUser, loginUser };

const UserModel = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//Registering a new user

const registerUser = async (req, res) => {
  const { username, teamname, password } = req.body;
  console.log(req.body);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Hashed Password: ", hashedPassword);
  const newUser = new UserModel({
    username: username,
    teamname: teamname,
    password: hashedPassword,
  });
  try {
    const userAvailable = await UserModel.findOne({ username });
    if (userAvailable)
      return res.status(400).json({ message: "User already exists" });
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id, teamname: user.teamname },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "45m" }
    );
    console.log(`User created ${user}`);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//login User

const loginUser = async (req, res) => {
  const { username, password, teamname } = req.body;
  if (!username || !teamname || !password) {
    res.status(400).json("All fields are mandatory!");
  }
  try {
    const user = await UserModel.findOne({
      $and: [{ username: username }, { teamname: teamname }],
    });
    if (user) {
      const validity = await bcrypt.compare(password, user.password);
      if (!validity) {
        res.send(400).json("Wrong password");
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id, teamname: user.teamname },
          process.env.ACCESS_TOKEN_SECERT,
          { expiresIn: "45m" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = { registerUser, loginUser };
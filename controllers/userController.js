const UserModel = require("../Models/userModel");
const bcrypt = require("bcrypt");

const getAllUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 10000000;
    const skip = page * limit;

    let sort = req.query.sort || "score";

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "desc";
    }
    const users = await UserModel.find()
      .select("username score updatedAt")
      .sort({ score: "desc", updatedAt: "asc" })
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update user score
const updateScore = async (req, res) => {
  const { username, newscore } = req.body;
  try {
    if (typeof newscore !== "number") {
      return res
        .status(400)
        .json({ message: "Invalid score. Score must be a number" });
    }
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await UserModel.updateOne(
      { username: username },
      { $set: { score: newscore } }
    );
    res.status(200).json({ message: "Score updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//update user password
const updatePassword = async (req, res) => {
  const { username, newpassword } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
    await UserModel.updateOne(
      { username: username },
      { $set: { password: hashedPassword } }
    );
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUser, updateScore, updatePassword };

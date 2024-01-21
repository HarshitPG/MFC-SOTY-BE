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
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .exec();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getAllUser };

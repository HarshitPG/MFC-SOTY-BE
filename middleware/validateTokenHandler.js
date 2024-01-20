const jwt = require("jsonwebtoken");

const validateToken = async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "User is not authorized or token missing" });
  }

  token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "User is not authorized" });
    }
    req.user = decoded.user;
    next();
  });
};

module.exports = validateToken;

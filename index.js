const express = require("express");
const bodyParser = require("body-parser");
const donenv = require("dotenv").config();
const connectDb = require("./db/dbConnection");
const AuthRoute = require("./routes/authRoute");

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/auth", AuthRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

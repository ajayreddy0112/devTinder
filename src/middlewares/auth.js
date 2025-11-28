const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request cookies
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Token is not valid");
    }

    // verify the token
    const decoded = jwt.verify(token, "DEV@TINDER$0112");

    // find the user
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
};

module.exports = { userAuth };

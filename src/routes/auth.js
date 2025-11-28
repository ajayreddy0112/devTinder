const express = require("express");
const authRouter = express.Router();

const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

// signup route
authRouter.post("/signup", async (req, res) => {
  try {
    // Validate the request body
    validateSignupData(req.body);

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // creating a new instance of the User model
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      password: hashedPassword,
    });

    // saving the user to the database
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    res.status(500).send(`Internal server error: ${error.message}`);
  }
});

// login route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).send("Invalid credentials");
    }

    // Check if the password is correct
    const isPasswordCorrect = await user.validatePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).send("Invalid credentials");
    }

    // Login successful
    const token = user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.send("Login successful");
  } catch (error) {
    res.status(500).send(`Internal server error: ${error.message}`);
  }
});

module.exports = authRouter;

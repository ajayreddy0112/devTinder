const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

profileRouter.patch("/profile", userAuth, async (req, res) => {
  try {
    // Validate the request body
    if (!validateEditProfileData(req)) {
      return res.status(400).send("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((field) => {
      loggedInUser[field] = req.body[field];
    });

    await loggedInUser.save();
    res.json({
      success: true,
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send(`ERROR: ${error.message}`);
  }
});

module.exports = profileRouter;

const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const USER_PROFILE_FIELDS = [
  "firstName",
  "lastName",
  "photoUrl",
  "age",
  "gender",
  "about",
  "skills",
];

// Get all the pending connection requests for the logged in user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_PROFILE_FIELDS);

    res.json({
      success: true,
      message: "Pending connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `ERROR: ${error.message}`,
    });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: "accepted",
    })
      .populate("fromUserId", USER_PROFILE_FIELDS)
      .populate("toUserId", USER_PROFILE_FIELDS);

    const data = connections.map((connection) => {
      if (connection.fromUserId.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });

    res.json({
      success: true,
      message: "Connections fetched successfully",
      data,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `ERROR: ${error.message}`,
    });
  }
});

module.exports = userRouter;

const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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

// Get all the connections for the logged in user
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

// Get the feed for the logged in user
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = Math.min(limit, 50);
    const skip = (page - 1) * limit;

    // Find all the connection requests that are not accepted or rejected
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      status: { $ne: "accepted" },
      status: { $ne: "rejected" },
    }).select(["fromUserId", "toUserId"]);

    const hiddenUsersFromFeed = new Set();
    connectionRequests.forEach((connectionRequest) => {
      hiddenUsersFromFeed.add(connectionRequest.fromUserId.toString());
      hiddenUsersFromFeed.add(connectionRequest.toUserId.toString());
    });

    // Find all the users who are not in the hidden users from feed and not the logged in user
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_PROFILE_FIELDS)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      message: "User Feed fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `ERROR: ${error.message}`,
    });
  }
});

module.exports = userRouter;

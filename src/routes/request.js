const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // status validation
      const allowedStatuses = ["interested", "ignored"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status type: ${status}`,
        });
      }

      // validate the toUserId
      const toUserExists = await User.exists({ _id: toUserId });
      if (!toUserExists) {
        return res.status(400).json({
          success: false,
          message: "User does not exist",
        });
      }

      // If there is a existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          success: false,
          message:
            status === "interested"
              ? "Connection request already exists"
              : "Connection request already ignored",
        });
      }

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        success: true,
        message:
          status === "interested"
            ? "Connection request sent successfully"
            : "Connection request ignored successfully",
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `ERROR: ${error.message}`,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      // validate the status
      const allowedStatuses = ["accepted", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status type: ${status}`,
        });
      }

      // validate the requestId
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(400).json({
          success: false,
          message: "Connection request not found or already reviewed",
        });
      }

      // update the status of the connection request
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        success: true,
        message: `Connection request ${status} successfully`,
        data,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `ERROR: ${error.message}`,
      });
    }
  }
);

module.exports = requestRouter;

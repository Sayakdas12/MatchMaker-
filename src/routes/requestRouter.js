const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userauth } = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:toUserId", userauth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    // 1. ✅ Validate status
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid Status Type: " + status });
    }

    // 2. ✅ Prevent self-request
    // if (fromUserId.toString() === toUserId.toString()) {
    //   return res.status(400).json({ message: "You cannot send a request to yourself" });
    // }

    // 3. ✅ Ensure target user exists
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User does not exist in the database" });
    }

    // 4. ✅ Check if a request already exists
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({ message: "Connection Request Already Exists!!" });
    }

    // 5. ✅ Create new request
    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const saved = await newRequest.save();
 

    res.status(201).json({
      message: `💬 ${req.user.firstName} showed ${status} towards ${toUser.firstName}.`,
      data: saved,
    });
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});

module.exports = requestRouter;

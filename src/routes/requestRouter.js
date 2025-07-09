const express = require("express");
const { userauth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userauth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ["ignored", "interested"];
    if(!allowedStatus.includes(status)){
        return res.status(400).json({ message: "Invalid Status Type: " + status });
    }

    const existingConnectionRequect = await connectionRequest.findOne({
        $or: [ 
            {fromUserId, toUserId},
            {fromUserId: toUserId, toUserId: fromUserId},
        ],
    });
    if(!existingConnectionRequect){
        return res.status(400).json({message: "Connection Request Already Exists!!"});
    }

    const newRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
 
    const saved = await newRequest.save();

    res.status(201).json({
      message: "✅ Connection Request Sent Successfully!",
      data: saved,
    });
  } catch (err) {
    res.status(400).send("❌ Error: " + err.message);
  }
});



module.exports = requestRouter; 
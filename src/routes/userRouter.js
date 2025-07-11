const express = require("express");

const userRouter = express.Router();
const { userauth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]


// Show all the Panding connection request & There Detials
userRouter.get("/user/requests/received", userauth, async (req, res) => {

  try {

    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]);

    res.json({
      message: "Data fetched Successfully",
      data: connectionRequest,
    })

  } catch (err) {
    res.status(400).send("Error fetching the user : " + err.message);
  }
});

// get all the user existing in this database
userRouter.get("/user/connections", userauth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ]
    }).populate("fromUserId", USER_DATA).populate("toUserId", USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }
      return row.fromUserId;
    });


    res.json({ data: connectionRequest });
  } catch (err) {
    res.status(400).send("Error fetching the user : " + err.message);
  }
});


// for all the user who are connected with the user

userRouter.get("/feed", userauth, async (req, res) => {

  try {
    const loggedInUser = req.user;

    const pageNo = parseInt(req.query.pageNo) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (pageNo - 1) * limit;

    // Step 1: Get all requests where the user is involved
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ],
    }).select("fromUserId toUserId");

    // Step 2: Build list of users to exclude
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach(req => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString()); // also exclude self

    // Step 3: Query feed
    const userCards = await User.find({
      _id: { $nin: Array.from(hideUsersFromFeed) }
    })
      .select(USER_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "✅ Feed data fetched successfully",
      page: pageNo,
      results: userCards.length,
      data: userCards,
    });
  } catch (err) {
    res.status(400).send("❌ Error fetching the feed: " + err.message);
  }
});



module.exports = userRouter;





























































































//   upadate the User Profile :- 

// const { userId } = req.params;
//   const data = req.body;

//   try {
//     const allowedFields = [
//       "firstName",
//       "lastName",
//       "password",
//       "gender",
//       "age",
//       "photoUrl",
//       "About",
//       "Skills",
//     ];

//     const isUpdateAllowed = Object.keys(data).every((key) =>
//       allowedFields.includes(key)
//     );

//     if (!isUpdateAllowed) {
//       return res.status(400).send("Invalid fields in the request");
//     }

//     if (data.Skills.length > 10) {
//       return res.status(400).send("Skills cannot exceed 10 items");
//     }

//     const updatedUser = await User.findByIdAndUpdate(userId, data, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).send("User not found");
//     }

//     res.status(200).json({
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).send("Something went wrong");
//   }
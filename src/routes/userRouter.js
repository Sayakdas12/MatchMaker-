const express = require("express");

const userRouter = express.Router();


userRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(400).send("USer is not Found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Error fetching the user : " + err.message);
  }
});

// get all the user existing in this database
userRouter.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error fetching the user : " + err.message);
  }
});

userRouter.patch("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const data = req.body;

  try {
    const allowedFields = [
      "firstName",
      "lastName",
      "password",
      "gender",
      "age",
      "photoUrl",
      "About",
      "Skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      allowedFields.includes(key)
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid fields in the request");
    }

    if (data.Skills.length > 10) {
      return res.status(400).send("Skills cannot exceed 10 items");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send("Something went wrong");
  }
});

module.exports  = userRouter;
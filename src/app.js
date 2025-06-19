const express = require("express");
const { auth, userauth } = require("./middlewares/auth");
const connectionDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json()); // middleWare to read the json data...

// // Sample user data (mocked like a database)
// const users = [
//   { id: 1, name: "Sayak", email: "sayak@example.com" },
//   { id: 2, name: "Vishal", email: "vishal@example.com" },
// ];

// // ------------------- GET /user -------------------
// app.get("/user", (req, res) => {
//   res.json({
//     message: "All users fetched successfully",
//     data: users,
//   });
// });

// app.get("/user", (req, res, next) => {
//   console.log("This a testing purpose...");
//   next();
// })

// // ------------------- POST /user -------------------
// app.use("/admin", auth);

// app.get("/admin/getAll", (req, res) => {
//   res.send("All Data Fetched !!");
// });

// app.get("/admin/delete", (req, res) => {
//   res.send("All Data are Deleted !!");
// });

// app.get("/user", userauth , (req, res) => {
//      res.send("Get all the user Data")
// })

// data baselogic


//Send the User info..
app.post("/signup", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});


//get the user when match the Email to the database  
app.get("/user", async (req, res) => {
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
app.get("/all", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  }  catch (err){
    res.status(400).send("Error fetching the user : " + err.message);
  }
})

connectionDB()
  .then(() => {
    console.log("✅ Database Connection is Successfully...");
  })
  .catch((err) => {
    console.log("✅ Database Cannot be connected....");
  });

// ------------------- SERVER -------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

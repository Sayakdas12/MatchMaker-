const express = require("express");
const connectionDB = require("./config/database");

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");  
const app = express();

app.use(express.json()); // middleWare to read the json data...
app.use(cookieParser());    // Middleware to parse cookies


const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);







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


 





//get the user when match the Email to the database


// Database Connection
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






















// // Sample user data (mocked like a database)

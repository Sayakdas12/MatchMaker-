const express = require("express");
const { userauth } = require("./middlewares/auth");
const connectionDB = require("./config/database");
const User = require("./models/user");
const { validateSignup } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");  
const app = express();

app.use(express.json()); // middleWare to read the json data...
app.use(cookieParser());    // Middleware to parse cookies

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
  const { emailId, password } = req.body;

  try {
    validateSignup(req);

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const existing = await User.findOne({ emailId }); // logic use fir if the email is already used or not
    if (existing) {
      return res.status(400).send("User with this email already exists");
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash, // Store the hashed password
    });
    await user.save();
    res.send("User Added Successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

app.post("/login", async (req, res) => { 
  try {
    const { emailId, password } = req.body;

    // Validate the input
    if (!emailId || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(400).send("User not found in DB");
    }

    // Compare the password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }


    const token = jwt.sign({ _id: user._id }, "@Sayak@123", 
      {  
        expiresIn: "1d",
      });   

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,     // set to true in production (HTTPS)
      sameSite: "Strict",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),    
      
       // expires the cookie 
    });


    res.send("✅ Login successful");
  } catch (err) {
    res.status(500).send("Error logging in: " + err.message);
  }
});

app.get("/profile", userauth, async (req, res) => {

   try {
      const user = req.user;

      res.send(user);
   } catch(err){
    res.status(500).send("Error fetching user profile: " + err.message);
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
  } catch (err) {
    res.status(400).send("Error fetching the user : " + err.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
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
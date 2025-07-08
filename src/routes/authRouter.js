
const express = require("express");

const authRouter = express.Router();
const User = require("../models/user");
const { validateSignup } = require("../utils/validation");
const bcrypt = require("bcrypt"); 

authRouter.post("/signup", async (req, res) => {
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

authRouter .post("/login", async (req, res) => { 
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
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid credentials");
    }

    const token = await user.getJWT(); 


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


 module.exports = authRouter;
const { userauth } = require("../middlewares/auth");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const {validateEditProfileData} = require("../utils/validation")

const express = require('express');

const profileRouter = express.Router();

profileRouter.get("/profile/view", userauth, async (req, res) => { 

   try {
      const user = req.user;

      res.send(user);
   } catch(err){
    res.status(500).send("Error fetching user profile: " + err.message);
   }
 
   
});

profileRouter.patch("/profile/edit", userauth, async (req, res) => {
       try{
      if  (!validateEditProfileData(req)){
         throw new Error("Invalid Edit Request");
      }



      const loginuser = req.user;
      // console.log(loginuser);

 Object.keys(req.body).forEach((key) => (loginuser[key] = req.body[key]));
      

 await loginuser.save();
      // console.log(loginuser);

      res.json({ Message : `${loginuser.firstName}, Your Profile Updated Succrssfully`, Data : loginuser, });
      
       } catch (err){
         res.status(400).send("  : " + err.message);
       }
});

profileRouter.patch("/profile/password",userauth, async (req, res) => {
 try {
   const { password, newPassword} = req.body;
   if(!password || !newPassword){
      return res.status(400).send ("Both current and new passwords are required.")
   }

   const user = req.user;

   const isMatch = await bcrypt.compare(password, user.password);
   if(!isMatch){
      return res.status(401).send("Current password is incorrect.")
   }

   const hashednewPassword = await bcrypt.hash(newPassword, 10);

   user.password = hashednewPassword;
   await user.save();
       res.send("✅ Password updated successfully.");
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).send("❌ Something went wrong: " + err.message);
  }

 
});

module.exports = profileRouter; 
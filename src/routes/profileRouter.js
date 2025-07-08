const { userauth } = require("../middlewares/auth");

const express = require('express');

const profileRouter = express.Router();

profileRouter.get("/profile", userauth, async (req, res) => {

   try {
      const user = req.user;

      res.send(user);
   } catch(err){
    res.status(500).send("Error fetching user profile: " + err.message);
   }
 
   
});

module.exports = profileRouter; 
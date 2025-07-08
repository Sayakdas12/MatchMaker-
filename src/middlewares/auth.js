 // const auth = (req, res, next) => {
//   console.log("Admin auth is getting checked...!");
//   const token = "sayak";
//   const isAdminAuth = token === "sayak";
//   if (!isAdminAuth) {
//     res.status(401).send("Unauthorized Request");
//   } else {
//     next();
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user") 


const userauth = async (req,res, next) => {
 try {
  const {token} = req.cookies;
  if (!token) {
    return res.status(401).json({error: "Please login to access this resource"});
  }
 const decode = await jwt.verify(token, "@Sayak@123");
 const {_id} = decode;

 const user = await User.findById(_id);
 
 if(!user){
  throw new Error("User not found");
 }
 req.user = user;
 next();
}
catch(error){
  res.status(401).send("Unauthorized Request");

}
};

module.exports ={
  userauth
}
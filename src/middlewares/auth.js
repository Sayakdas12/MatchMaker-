const auth = (req, res, next) => {
  console.log("Admin auth is getting checked...!");
  const token = "sayak";
  const isAdminAuth = token === "sayak";
  if (!isAdminAuth) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
};

const userauth = (req,res, next) => {
 console.log("User auth is getting checked...!");
  
 const token = "sayak";
 const isuserauth = token === "sayak";
 if(!isuserauth){
  res.status(401).send("Unauthorized Request");
 }
 else{
  next();
 }
}

module.exports ={
  auth,
  userauth
}
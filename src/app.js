const express = require("express");

const app = express();

app.use("/", (req, res) => {
  res.send("My Name is Sayak!");
}); 
app.use("/hello/2", (req, res) => {
  res.send("hallow Everyone 2!");
});

app.use("/hello", (req, res) => {
  res.send("hallow Everyone!");
});

app.use("/test", (req, res) => {
  res.send("Test this problem !");
});

app.listen(3000, () => {
  console.log("Server is running successfully on port 3000....*");
});

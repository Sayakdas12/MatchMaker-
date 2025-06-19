const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://SayakDB:AylQsQuePXq3jasm@sayak.jo9i8am.mongodb.net/LoveNest"
  );
};

module.exports = connectionDB;  
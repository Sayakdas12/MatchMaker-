const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Add..." + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a strong password" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender Data Desnot match with the given data");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://bbdu.ac.in/wp-content/uploads/2021/11/dummy-image1.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo Url" + value);
        }
      },
    },
    About: {
      type: String,
      default: "No description provided",
    },
    Skills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

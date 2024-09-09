import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "name must contain atleast 3 characters"],
    maxLength: [30, "name cannot exced 30 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },
  phone: {
    type: String,
    required: [true, "please provide a valid phone number"],
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "password must contain atleast 8 characters"],
    maxLength: [32, "password cannot exced 30 characters"],
    select: false,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.getJWToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);

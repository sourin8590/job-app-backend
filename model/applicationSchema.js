import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
    minLength: [3, "Name must contain atleast 3 characters"],
    maxLength: [30, "Name cannot exced 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    validate: [validator.isEmail, "Please provide a valid email address"],
  },
  coverLetter: {
    type: String,
    required: [true, "please provide your cover letter"],
  },
  phone: {
    type: Number,
    required: [true, "please provide your mobile number"],
  },
  address: {
    type: String,
    required: [true, "please provide your address"],
  },

  // for resume photo wil be uploaded
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  applicantId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    }, 
  },
  employerId: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);

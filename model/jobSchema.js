import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide a job title"],
    minLength: [3, "title must contain atleast 3 characters"],
    maxLength: [50, "title cannot exced 30 characters"],
  },
  description: {
    type: String,
    required: true,
    minLength: [4, "description must contain atleast 4 characters"],
    maxLength: [450, "description cannot exced 450 characters"],
  },
  category: {
    type: String,
    required: [true, "job catagory required"],
  },
  country: {
    type: String,
    required: [true, "job country required"],
  },
  city: {
    type: String,
    required: [true, "job city required"],
  },
  location: {
    type: String,
    required: [true, "please provide location"],
    minLength: [50, "job location must contain atleast 50 characters"],
  },
  fixedSalary: {
    type: Number,
    minLength: [4, "fixed salary must contain atleast 3 digits"],
    maxLength: [9, "fixed salary cannot exced 9 digits"],
  },
  salaryFrom: {
    type: Number,
    minLength: [4, "salary  from must contain atleast 3 digits"],
    maxLength: [9, "salary from cannot exced 9 digits"],
  },
  salaryTo: {
    type: Number,
    minLength: [4, "salary  to must contain atleast 3 digits"],
    maxLength: [9, "salary to cannot exced 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);

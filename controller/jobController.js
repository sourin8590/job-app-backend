import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { Job } from "../model/jobSchema.js";
import ErrorHandler from "../middleware/error.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("you are not allowed ", 400));
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;
  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("please provide full job details", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(new ErrorHandler("please provide salary details", 400));
  }
  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler(
        "cannot enter fixed salary and ranged salary together",
        400
      )
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  res.status(200).json({
    success: true,
    message: "job created successfully",
    postedBy,
    job,
  });
});

export const getMyjobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(new ErrorHandler("you are not allowed ", 400));
  }

  const myJobs = await Job.find({ postedBy: req.user._id });
  //   const y = req.params;
  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "Job Updated!",
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("OOPS! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted!",
  });
});

export const getSingelJob = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("job not found", 400));
  }
  res.status(200).json({
    success: true,
    job,
  });
});

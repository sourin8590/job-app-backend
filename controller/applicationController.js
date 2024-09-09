import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { Application } from "../model/applicationSchema.js";
import cloudinary from "cloudinary";
import { Job } from "../model/jobSchema.js";

export const employeeGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
      return next(
        new ErrorHandler("you are not allowed to access this resources", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employers are not allowed to access this resources",
          400
        )
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
      success: true,
      message: "All applications fetched successfully",
      applications,
    });
  }
);

export const jobseekerDeleteApplications = catchAsyncError(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler(
          "Employers are not allowed to access this resources",
          400
        )
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Application not found!", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  }
);

export const postApplication = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employer") {
    return next(
      new ErrorHandler(
        "Employers are not allowed to access this resources",
        400
      )
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("resume file required", 400));
  }
  const { resume } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(new ErrorHandler("file not supported", 404));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("error:", cloudinaryResponse.error || "Unknown error");
    return next(new ErrorHandler("failed to upload resume file", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;

  const applicantId = {
    user: req.user._id,
    role: "Job Seeker",
  };
  if (!jobId) {
    return next(new ErrorHandler("job not found", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("job not found", 404));
  }
  const employerId = {
    user: jobDetails.postedBy,
    role: "Employer",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !jobId ||
    !applicantId ||
    !employerId ||
    !resume
  ) {
    return next(new ErrorHandler("please fill full form", 404));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantId,
    employerId,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Application created successfully",
    application,
  });
});

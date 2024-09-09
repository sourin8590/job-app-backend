import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../model/userSchema.js";
import { sendToken } from "../utils/jwToken.js";




export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;
  if (!name || !phone || !role || !password || !email) {
    return next(new ErrorHandler("please provide all details", 400));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("user already exist", 400));
  }

  const user = await User.create({ name, email, password, role, phone });
  // res.status(200).json({
  //   success: true,
  //   message: "User registered successfully,
  //   user,
  // });
  sendToken(user, 200, res, "user registered successfully");
});




export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !role || !password) {
    return next(new ErrorHandler("please provide all details", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("user not found", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid password", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler("invalid role", 400));
  }
  sendToken(user, 200, res, "User logged in Successfully");
});



export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite:"None",
    })
    .json({
      success: true,
      message: "user logged out successfully",
    });
});



export const getUser = catchAsyncError((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

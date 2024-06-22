const Otp = require("../models/otp");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// signup handler function
exports.Signup = async (req, res) => {
  try {
    // fetching data from req body
    const {
      firstName,
      lastName,
      password,
      confirmPassword,
      email,
      mobileNumber = "",
      otp,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !email ||
      !otp
    ) {
      return res.status(404).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // password validation
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password and confirmPassword should be same",
      });
    }

    // check if user with same email is already registered
    const userDetails = await User.findOne({ email: email });
    console.log("userDetails", userDetails)
    if (userDetails) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered. Try again",
      });
    }

    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Otp Not valid",
      });
    } else if (response[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      password: hashedPassword,
      confirmPassword,
      email,
      mobileNumber,
      otp,
    });

    return res.status(200).json({
      success: true,
      message: "User registered succefully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

// send otp handler function
exports.SendOtp = async (req, res) => {
  try {
    // fetch data
    const { email } = req.body;

    const checkUserPresent = await Otp.findOne({ email });

    if (checkUserPresent) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate otp
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const otpBody = await Otp.create({ email, otp });
    return res.status(200).json({
      success: true,
      message: "Otp Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login handler function
exports.Login = async (req, res) => {
  try {
    // fetch data from req body
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Please provide all the fields and try again!!",
      });
    }

    // check if email is registered or not
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This email id is not registered",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Login Failed! Password doesn't match",
      });
    }

    // case :- when password match create token
    const payload = {
      id: user._id,
      email: user.email,
    };

    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      success: true,
      message: "login Successfully",
      token,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


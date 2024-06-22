const User = require("../models/user");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// reset password token handler function
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const { email } = req.body;
    // check if email is registered or not , email validation
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Please provide your email",
      });
    }
    const userDetails = await User.findOne({ email });

    console.log("userDetails", userDetails)

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Email is not registered with us provide a valid email",
      });
    }
    // create a token
    const token = crypto.randomBytes(20).toString("hex");

    // update the user db
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 300000,
      },
      { new: true }
    );

    // now lets create url
    const url = `http://localhost:3000/update-password/${token}`;

    return res.status(200).json({
      success: true,
      message: "Token created and reset url sent successfully",
      url: url,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
      error: error.message,
    });
  }
};

// rest password handler
exports.resetPassword = async (req, res) => {
  try {
    // fetch password, confirm password and token from req body
    const { password, confirmPassword, token } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password must be same",
      });
    }

    // get user Details using email
    const userDetails = await User.findOne({ token: token });
    console.log(userDetails);

    // check token
    if (token !== userDetails.token) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid",
      });
    }

    if (Date.now() > userDetails.resetPasswordExpires) {
      return res.status(400).json({
        success: false,
        message: "Token expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedDetails = await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: { ...updatedDetails, password: password },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

// middleware to get user details from token
exports.isAuthenticated = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(404).json({
        success: false,
        message: "auth token not found",
      });
    }
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "auth token is missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

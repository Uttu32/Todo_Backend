const express = require("express");
const { Signup, SendOtp, Login } = require("../controllers/auth");
const { resetPasswordToken, resetPassword } = require("../controllers/resetPassword");
const router = express.Router();

router.post("/signup", Signup);
router.post("/sendOtp", SendOtp);
router.post("/login", Login);

// route for reseting password token
router.post("/reset-password-token", resetPasswordToken);
// route for reseting password
router.post("/reset-password", resetPassword);

module.exports = router;

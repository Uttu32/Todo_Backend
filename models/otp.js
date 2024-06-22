const Joi = require("joi");
const mongoose = require("mongoose");
const otpValidatorSchema = require("../validators/otpValidator");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // 5 minutes
  },
});

// Exclude internal fields during conversion to JSON
otpSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

otpSchema.pre('save', function(next) {
  const dataToValidate = {
    email: this.email,
    otp: this.otp,
    createdAt: this.createdAt,
  };

  const validationResult = otpValidatorSchema.validate(dataToValidate);

  if (validationResult.error) {
    return next(validationResult.error); 
  }

  next(); 
});

const Otp = mongoose.model("Otp", otpSchema);

module.exports = Otp;

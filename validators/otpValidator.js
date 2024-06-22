const Joi = require("joi");

const otpValidatorSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
  otp: Joi.string().trim().min(6).max(6).required(),
  createdAt: Joi.date().iso().required(), // Enforce ISO 8601 format for consistency
});

module.exports = otpValidatorSchema;

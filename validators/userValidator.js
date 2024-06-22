const Joi = require("joi");

const userValidatorSchema = Joi.object({
  firstName: Joi.string().trim().min(3).max(50).required(),
  lastName: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(8).required(), // Adjust password complexity as needed
  mobileNumber: Joi.string().optional().allow(""), // Allow empty string for optional mobile number
  token: Joi.string().optional().allow(""), // Allow empty string for optional token
  resetPasswordExpires: Joi.date().optional().allow(null), // Allow null for resetPasswordExpires
  todos: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(), // Optional array of ObjectId strings
});

module.exports = userValidatorSchema;

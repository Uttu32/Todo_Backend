const Joi = require("joi");

const todoValidatorSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(3).max(255).required(),
  status: Joi.string().valid("Pending", "Progress", "Completed").required(),
});

module.exports = todoValidatorSchema;
